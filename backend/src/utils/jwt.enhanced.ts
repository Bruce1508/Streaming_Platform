import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

// Generate token pair
export const generateTokenPair = (userId: string, sessionId: string): TokenPair => {
    // Short-lived access token (15 minutes)
    const accessToken = jwt.sign(
        { userId, sessionId, type: 'access' },
        process.env.JWT_SECRET!,
        { expiresIn: '15m' }
    );

    // Long-lived refresh token (7 days)
    const refreshToken = jwt.sign(
        { userId, sessionId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

// Blacklist token
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

// Check if token is blacklisted
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
    try {
        const result = await redis.get(`blacklist:${token}`);
        return result === '1';
    } catch (error) {
        console.error('Error checking blacklist:', error);
        return false;
    }
};