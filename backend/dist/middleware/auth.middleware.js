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
exports.requireFreshAdmin = exports.requireAdmin = exports.requireProfessor = exports.requireStudent = exports.authenticate = exports.requireFreshToken = exports.authorizeOwnerOrAdmin = exports.authorize = exports.optionalAuth = exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const jwt_enhanced_1 = require("../utils/jwt.enhanced");
const Cache_utils_1 = require("../utils/Cache.utils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET_VALUE = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
if (!JWT_SECRET_VALUE) {
    console.error("❌ JWT Secret not configured");
    throw new ApiError_1.ApiError(500, "Server configuration error");
}
/**
 * @desc    Enhanced authentication with token pair support
 * @access  Protected routes
 */
exports.protectRoute = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let token;
    // 🔍 EXTRACT TOKEN - Support both new and legacy formats
    const authHeader = req.headers.authorization;
    console.log("🔐 Auth header:", authHeader ? `Bearer ${authHeader.substring(7, 27)}...` : 'None');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }
    // Check new cookie names first, then fallback to legacy
    else if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) {
        token = req.cookies.accessToken; // New token pair system
    }
    else if ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.token) {
        token = req.cookies.token; // Legacy single token support
    }
    if (!token) {
        console.log("❌ No token provided");
        throw new ApiError_1.ApiError(401, "Access denied. No token provided");
    }
    console.log("🔑 Token length:", token.length);
    console.log("🔑 Token preview:", token.substring(0, 20) + "...");
    // 🔍 GET TOKEN METADATA for monitoring
    const tokenMetadata = (0, jwt_enhanced_1.getTokenMetadata)(token);
    req.tokenMetadata = tokenMetadata;
    try {
        let decoded;
        // 🆕 NEW: Try enhanced token validation first
        if ((tokenMetadata === null || tokenMetadata === void 0 ? void 0 : tokenMetadata.type) === 'access') {
            console.log("🔄 Using enhanced access token validation");
            decoded = yield (0, jwt_enhanced_1.validateAccessToken)(token);
            if (!decoded) {
                throw new ApiError_1.ApiError(401, "Invalid or blacklisted access token");
            }
            // ✅ NEW: Check if token needs refresh notification
            if ((0, jwt_enhanced_1.shouldRefreshToken)(token)) {
                res.setHeader('X-Token-Refresh-Needed', 'true');
                console.log("⚠️ Token refresh recommended");
            }
        }
        // 🔄 FALLBACK: Legacy token validation for backward compatibility
        else {
            console.log("🔄 Using legacy token validation");
            // Check blacklist for legacy tokens too
            if (yield (0, jwt_enhanced_1.isTokenBlacklisted)(token)) {
                throw new ApiError_1.ApiError(401, "Token has been revoked");
            }
            const jwtDecoded = jsonwebtoken_1.default.verify(token, JWT_SECRET_VALUE);
            // Convert to standard format
            decoded = {
                userId: jwtDecoded.userId || jwtDecoded.id,
                sessionId: jwtDecoded.sessionId,
                type: 'legacy'
            };
        }
        console.log("✅ Token decoded:", {
            userId: decoded.userId,
            sessionId: decoded.sessionId,
            type: decoded.type || 'legacy'
        });
        // Validate user ID
        if (!decoded.userId) {
            throw new ApiError_1.ApiError(401, "Invalid token format");
        }
        // 🔍 FIND USER - Try cache first
        let user = yield (0, Cache_utils_1.getCachedUser)(decoded.userId);
        if (!user) {
            user = yield User_1.default.findById(decoded.userId).select("-password");
            if (!user) {
                console.log("❌ User not found for ID:", decoded.userId);
                throw new ApiError_1.ApiError(401, "Invalid token - user not found");
            }
        }
        // ✅ CHECK USER STATUS
        if (!user.isActive) {
            console.log("❌ User account deactivated:", decoded.userId);
            throw new ApiError_1.ApiError(401, "Account has been deactivated");
        }
        console.log("✅ User authenticated:", {
            id: user._id,
            email: user.email,
            role: user.role,
            tokenType: decoded.type || 'legacy'
        });
        // 📝 ATTACH TO REQUEST
        req.user = user;
        next();
    }
    catch (error) {
        console.log("❌ Token verification failed:", error.message);
        // Enhanced error handling
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError_1.ApiError(401, "Invalid token format");
        }
        else if (error.name === 'TokenExpiredError') {
            throw new ApiError_1.ApiError(401, "Token has expired. Please refresh or login again.");
        }
        else if (error instanceof ApiError_1.ApiError) {
            throw error;
        }
        else {
            throw new ApiError_1.ApiError(401, "Token authentication failed");
        }
    }
}));
/**
 * @desc    Enhanced optional authentication with token pair support
 * @access  Public routes that can benefit from user context
 */
exports.optionalAuth = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }
    else if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) {
        token = req.cookies.accessToken;
    }
    else if ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.token) {
        token = req.cookies.token;
    }
    if (!token) {
        return next(); // Continue without authentication
    }
    try {
        // Check if token is blacklisted
        if (yield (0, jwt_enhanced_1.isTokenBlacklisted)(token)) {
            console.log("Optional auth: Token is blacklisted");
            return next();
        }
        const tokenMetadata = (0, jwt_enhanced_1.getTokenMetadata)(token);
        let decoded;
        // Try enhanced validation first
        if ((tokenMetadata === null || tokenMetadata === void 0 ? void 0 : tokenMetadata.type) === 'access') {
            decoded = yield (0, jwt_enhanced_1.validateAccessToken)(token);
        }
        else {
            // Legacy token validation
            const jwtDecoded = jsonwebtoken_1.default.verify(token, JWT_SECRET_VALUE);
            decoded = { userId: jwtDecoded.userId || jwtDecoded.id };
        }
        if (decoded === null || decoded === void 0 ? void 0 : decoded.userId) {
            // ✅ Try cache first
            let user = yield (0, Cache_utils_1.getCachedUser)(decoded.userId);
            if (!user) {
                user = yield User_1.default.findById(decoded.userId).select("-password");
            }
            if (user && user.isActive) {
                req.user = user;
                req.tokenMetadata = tokenMetadata;
            }
        }
    }
    catch (error) {
        console.log("Optional auth failed:", error);
        // Continue without user - don't throw error
    }
    next();
}));
/**
 * @desc    Authorize user roles (unchanged)
 * @param   roles - Array of allowed roles
 * @access  Protected routes with role restriction
 */
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ApiError_1.ApiError(401, "Authentication required");
        }
        if (!roles.includes(req.user.role)) {
            console.log(`❌ Access denied. User role: ${req.user.role}, Required: ${roles.join(', ')}`);
            throw new ApiError_1.ApiError(403, `Access denied. Required role: ${roles.join(' or ')}`);
        }
        console.log(`✅ Role authorized: ${req.user.role}`);
        next();
    };
};
exports.authorize = authorize;
/**
 * @desc    Check if user owns resource or is admin (unchanged)
 * @param   getUserId - Function to extract user ID from request
 * @access  Protected routes with ownership check
 */
const authorizeOwnerOrAdmin = (getUserId) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ApiError_1.ApiError(401, "Authentication required");
        }
        const resourceUserId = getUserId(req);
        const isOwner = req.user._id.toString() === resourceUserId;
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            throw new ApiError_1.ApiError(403, "Access denied. You can only access your own resources");
        }
        next();
    };
};
exports.authorizeOwnerOrAdmin = authorizeOwnerOrAdmin;
// 🆕 NEW: Require fresh token (for sensitive operations)
exports.requireFreshToken = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tokenMetadata = req.tokenMetadata;
    if (!tokenMetadata) {
        throw new ApiError_1.ApiError(401, "Token metadata required");
    }
    // Check if token was issued in last 5 minutes
    const tokenAge = Date.now() - (((_a = tokenMetadata.issuedAt) === null || _a === void 0 ? void 0 : _a.getTime()) || 0);
    const fiveMinutes = 5 * 60 * 1000;
    if (tokenAge > fiveMinutes) {
        throw new ApiError_1.ApiError(401, "Fresh token required for this operation. Please refresh your token.");
    }
    next();
}));
// Legacy alias for backward compatibility
exports.authenticate = exports.protectRoute;
// Export commonly used combinations
exports.requireStudent = [exports.protectRoute, (0, exports.authorize)(['student'])];
exports.requireProfessor = [exports.protectRoute, (0, exports.authorize)(['professor', 'admin'])];
exports.requireAdmin = [exports.protectRoute, (0, exports.authorize)(['admin'])];
exports.requireFreshAdmin = [exports.protectRoute, (0, exports.authorize)(['admin']), exports.requireFreshToken];
//# sourceMappingURL=auth.middleware.js.map