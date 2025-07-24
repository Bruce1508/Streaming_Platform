// utils/jwt.enhanced.ts - ADD THESE FUNCTIONS
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!!);

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

interface DecodedToken {
    userId: string;
    sessionId: string;
    type: 'access' | 'refresh';
    iat: number;
    exp: number;
}

// ===== EXISTING FUNCTIONS (You already have these) =====
export const generateTokenPair = (userId: string, sessionId: string): TokenPair => {
    const accessToken = jwt.sign(
        { userId, sessionId, type: 'access' },
        process.env.JWT_SECRET!,
        { expiresIn: '30d' }
    );

    const refreshToken = jwt.sign(
        { userId, sessionId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

export const blacklistToken = async (token: string): Promise<void> => {
    try {
        const decoded = jwt.decode(token) as any;
        if (decoded && decoded.exp) {
            const ttl = decoded.exp - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
                await redis.setex(`blacklist:${token}`, ttl, '1');
            }
        }
    } catch (error) {
        console.error('Error blacklisting token:', error);
    }
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
    try {
        const result = await redis.get(`blacklist:${token}`);
        return result === '1';
    } catch (error) {
        console.error('Error checking blacklist:', error);
        return false;
    }
};

/**
 * Validate token type and return decoded payload
 */
export const validateTokenType = (token: string, expectedType: 'access' | 'refresh'): DecodedToken | null => {
    try {
        const secret = expectedType === 'access' 
            ? process.env.JWT_SECRET! 
            : process.env.JWT_REFRESH_SECRET!;
            
        const decoded = jwt.verify(token, secret) as DecodedToken;
        
        // Check if token type matches expected type
        if (decoded.type !== expectedType) {
            console.error(`Token type mismatch. Expected: ${expectedType}, Got: ${decoded.type}`);
            return null;
        }
        
        return decoded;
    } catch (error) {
        console.error(`Token validation failed for type ${expectedType}:`, error);
        return null;
    }
};

/**
 * Validate access token specifically
 */
export const validateAccessToken = async (token: string): Promise<DecodedToken | null> => {
    // Check blacklist first
    if (await isTokenBlacklisted(token)) {
        console.log('Access token is blacklisted');
        return null;
    }
    
    return validateTokenType(token, 'access');
};

/**
 * Validate refresh token specifically
 */
export const validateRefreshToken = async (token: string): Promise<DecodedToken | null> => {
    // Check blacklist first
    if (await isTokenBlacklisted(token)) {
        console.log('Refresh token is blacklisted');
        return null;
    }
    
    return validateTokenType(token, 'refresh');
};

/**
 * Refresh access token using refresh token with rotation
 */
export const refreshAccessToken = async (refreshToken: string): Promise<TokenPair | null> => {
    try {
        console.log('🔄 Starting token refresh process');
        
        // 1. Validate refresh token
        const decoded = await validateRefreshToken(refreshToken);
        if (!decoded) {
            console.log('❌ Invalid refresh token');
            return null;
        }
        
        // 2. Check if session is still active
        const sessionExists = await redis.get(`session:${decoded.sessionId}`);
        if (!sessionExists) {
            console.log('❌ Session not found or expired');
            await blacklistToken(refreshToken); // Blacklist the refresh token
            return null;
        }
        
        // 3. Generate new token pair
        const newTokenPair = generateTokenPair(decoded.userId, decoded.sessionId);
        
        // 4. Blacklist old refresh token (Token Rotation Security)
        await blacklistToken(refreshToken);
        
        // 5. Store new refresh token metadata for tracking
        await redis.setex(
            `refresh:${decoded.sessionId}`, 
            7 * 24 * 60 * 60, // 7 days
            newTokenPair.refreshToken
        );
        
        console.log('✅ Token refresh successful for user:', decoded.userId);
        return newTokenPair;
        
    } catch (error) {
        console.error('❌ Token refresh failed:', error);
        return null;
    }
};

/**
 * Rotate refresh token (blacklist old, generate new pair)
 */
export const rotateRefreshToken = async (
    oldRefreshToken: string, 
    userId: string, 
    sessionId: string
): Promise<TokenPair | null> => {
    try {
        console.log('🔄 Rotating refresh token for user:', userId);
        
        // 1. Validate old refresh token
        const decoded = await validateRefreshToken(oldRefreshToken);
        if (!decoded || decoded.userId !== userId || decoded.sessionId !== sessionId) {
            console.log('❌ Invalid refresh token for rotation');
            return null;
        }
        
        // 2. Generate new token pair
        const newTokenPair = generateTokenPair(userId, sessionId);
        
        // 3. Blacklist old refresh token
        await blacklistToken(oldRefreshToken);
        
        // 4. Update refresh token in Redis
        await redis.setex(
            `refresh:${sessionId}`, 
            7 * 24 * 60 * 60,
            newTokenPair.refreshToken
        );
        
        console.log('✅ Refresh token rotated successfully');
        return newTokenPair;
        
    } catch (error) {
        console.error('❌ Refresh token rotation failed:', error);
        return null;
    }
};

/**
 * Revoke all tokens for a user session
 */
export const revokeAllTokensForSession = async (sessionId: string): Promise<boolean> => {
    try {
        console.log('🚫 Revoking all tokens for session:', sessionId);
        
        // 1. Get current refresh token for session
        const currentRefreshToken = await redis.get(`refresh:${sessionId}`);
        
        // 2. Blacklist refresh token if exists
        if (currentRefreshToken) {
            await blacklistToken(currentRefreshToken);
        }
        
        // 3. Remove refresh token from Redis
        await redis.del(`refresh:${sessionId}`);
        
        // 4. Remove session data
        await redis.del(`session:${sessionId}`);
        
        console.log('✅ All tokens revoked for session');
        return true;
        
    } catch (error) {
        console.error('❌ Token revocation failed:', error);
        return false;
    }
};

/**
 * Get token metadata for debugging/monitoring
 */
export const getTokenMetadata = (token: string): any => {
    try {
        const decoded = jwt.decode(token) as DecodedToken;
        if (!decoded) return null;
        
        return {
            userId: decoded.userId,
            sessionId: decoded.sessionId,
            type: decoded.type,
            issuedAt: new Date(decoded.iat * 1000),
            expiresAt: new Date(decoded.exp * 1000),
            timeToExpiry: decoded.exp - Math.floor(Date.now() / 1000)
        };
    } catch (error) {
        return null;
    }
};

/**
 * Check if access token needs refresh (expires in < 5 minutes)
 */
export const shouldRefreshToken = (accessToken: string): boolean => {
    try {
        const decoded = jwt.decode(accessToken) as DecodedToken;
        if (!decoded) return false;
        
        const timeToExpiry = decoded.exp - Math.floor(Date.now() / 1000);
        return timeToExpiry < 300; // Less than 5 minutes
    } catch (error) {
        return false;
    }
};