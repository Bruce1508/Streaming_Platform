"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRefreshToken = exports.getTokenMetadata = exports.revokeAllTokensForSession = exports.rotateRefreshToken = exports.refreshAccessToken = exports.validateRefreshToken = exports.validateAccessToken = exports.validateTokenType = exports.isTokenBlacklisted = exports.blacklistToken = exports.generateTokenPair = void 0;
// utils/jwt.enhanced.ts - ADD THESE FUNCTIONS
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
// ===== EXISTING FUNCTIONS (You already have these) =====
const generateTokenPair = (userId, sessionId) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId, sessionId, type: 'access' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ userId, sessionId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};
exports.generateTokenPair = generateTokenPair;
const blacklistToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (decoded && decoded.exp) {
            const ttl = decoded.exp - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
                yield redis.setex(`blacklist:${token}`, ttl, '1');
            }
        }
    }
    catch (error) {
        console.error('Error blacklisting token:', error);
    }
});
exports.blacklistToken = blacklistToken;
const isTokenBlacklisted = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield redis.get(`blacklist:${token}`);
        return result === '1';
    }
    catch (error) {
        console.error('Error checking blacklist:', error);
        return false;
    }
});
exports.isTokenBlacklisted = isTokenBlacklisted;
// ===== NEW FUNCTIONS TO ADD =====
/**
 * Validate token type and return decoded payload
 */
const validateTokenType = (token, expectedType) => {
    try {
        const secret = expectedType === 'access'
            ? process.env.JWT_SECRET
            : process.env.JWT_REFRESH_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Check if token type matches expected type
        if (decoded.type !== expectedType) {
            console.error(`Token type mismatch. Expected: ${expectedType}, Got: ${decoded.type}`);
            return null;
        }
        return decoded;
    }
    catch (error) {
        console.error(`Token validation failed for type ${expectedType}:`, error);
        return null;
    }
};
exports.validateTokenType = validateTokenType;
/**
 * Validate access token specifically
 */
const validateAccessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Check blacklist first
    if (yield (0, exports.isTokenBlacklisted)(token)) {
        console.log('Access token is blacklisted');
        return null;
    }
    return (0, exports.validateTokenType)(token, 'access');
});
exports.validateAccessToken = validateAccessToken;
/**
 * Validate refresh token specifically
 */
const validateRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Check blacklist first
    if (yield (0, exports.isTokenBlacklisted)(token)) {
        console.log('Refresh token is blacklisted');
        return null;
    }
    return (0, exports.validateTokenType)(token, 'refresh');
});
exports.validateRefreshToken = validateRefreshToken;
/**
 * Refresh access token using refresh token with rotation
 */
const refreshAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔄 Starting token refresh process');
        // 1. Validate refresh token
        const decoded = yield (0, exports.validateRefreshToken)(refreshToken);
        if (!decoded) {
            console.log('❌ Invalid refresh token');
            return null;
        }
        // 2. Check if session is still active
        const sessionExists = yield redis.get(`session:${decoded.sessionId}`);
        if (!sessionExists) {
            console.log('❌ Session not found or expired');
            yield (0, exports.blacklistToken)(refreshToken); // Blacklist the refresh token
            return null;
        }
        // 3. Generate new token pair
        const newTokenPair = (0, exports.generateTokenPair)(decoded.userId, decoded.sessionId);
        // 4. Blacklist old refresh token (Token Rotation Security)
        yield (0, exports.blacklistToken)(refreshToken);
        // 5. Store new refresh token metadata for tracking
        yield redis.setex(`refresh:${decoded.sessionId}`, 7 * 24 * 60 * 60, // 7 days
        newTokenPair.refreshToken);
        console.log('✅ Token refresh successful for user:', decoded.userId);
        return newTokenPair;
    }
    catch (error) {
        console.error('❌ Token refresh failed:', error);
        return null;
    }
});
exports.refreshAccessToken = refreshAccessToken;
/**
 * Rotate refresh token (blacklist old, generate new pair)
 */
const rotateRefreshToken = (oldRefreshToken, userId, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔄 Rotating refresh token for user:', userId);
        // 1. Validate old refresh token
        const decoded = yield (0, exports.validateRefreshToken)(oldRefreshToken);
        if (!decoded || decoded.userId !== userId || decoded.sessionId !== sessionId) {
            console.log('❌ Invalid refresh token for rotation');
            return null;
        }
        // 2. Generate new token pair
        const newTokenPair = (0, exports.generateTokenPair)(userId, sessionId);
        // 3. Blacklist old refresh token
        yield (0, exports.blacklistToken)(oldRefreshToken);
        // 4. Update refresh token in Redis
        yield redis.setex(`refresh:${sessionId}`, 7 * 24 * 60 * 60, newTokenPair.refreshToken);
        console.log('✅ Refresh token rotated successfully');
        return newTokenPair;
    }
    catch (error) {
        console.error('❌ Refresh token rotation failed:', error);
        return null;
    }
});
exports.rotateRefreshToken = rotateRefreshToken;
/**
 * Revoke all tokens for a user session
 */
const revokeAllTokensForSession = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🚫 Revoking all tokens for session:', sessionId);
        // 1. Get current refresh token for session
        const currentRefreshToken = yield redis.get(`refresh:${sessionId}`);
        // 2. Blacklist refresh token if exists
        if (currentRefreshToken) {
            yield (0, exports.blacklistToken)(currentRefreshToken);
        }
        // 3. Remove refresh token from Redis
        yield redis.del(`refresh:${sessionId}`);
        // 4. Remove session data
        yield redis.del(`session:${sessionId}`);
        console.log('✅ All tokens revoked for session');
        return true;
    }
    catch (error) {
        console.error('❌ Token revocation failed:', error);
        return false;
    }
});
exports.revokeAllTokensForSession = revokeAllTokensForSession;
/**
 * Get token metadata for debugging/monitoring
 */
const getTokenMetadata = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded)
            return null;
        return {
            userId: decoded.userId,
            sessionId: decoded.sessionId,
            type: decoded.type,
            issuedAt: new Date(decoded.iat * 1000),
            expiresAt: new Date(decoded.exp * 1000),
            timeToExpiry: decoded.exp - Math.floor(Date.now() / 1000)
        };
    }
    catch (error) {
        return null;
    }
};
exports.getTokenMetadata = getTokenMetadata;
/**
 * Check if access token needs refresh (expires in < 5 minutes)
 */
const shouldRefreshToken = (accessToken) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(accessToken);
        if (!decoded)
            return false;
        const timeToExpiry = decoded.exp - Math.floor(Date.now() / 1000);
        return timeToExpiry < 300; // Less than 5 minutes
    }
    catch (error) {
        return false;
    }
};
exports.shouldRefreshToken = shouldRefreshToken;
//# sourceMappingURL=jwt.enhanced.js.map