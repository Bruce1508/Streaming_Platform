import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';

export const createRateLimit = (maxRequest: number, windowMinutes: number) => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: maxRequest,
        message: {
            success: false,
            message: `Too many requests. Try again in ${windowMinutes} minutes.`,
            retryAfter: windowMinutes * 60
        },
        standardHeaders: true,
        legacyHeaders: false,
    })
}

const redis = new Redis(process.env.REDIS_URL!!);

interface AuthAttempt {
    ip: string;
    email?: string;
    attempts: number;
    lastAttempt: Date;
    blocked: boolean;
    blockUntil?: Date;
}

export const createProgressiveAuthLimit = () => {
    return async (req: any, res: any, next: any) => {
        const ip = req.ip;
        const email = req.body?.email;
        const key = `auth_attempts:${ip}:${email || 'unknown'}`;
        
        try {
            // Get current attempts
            const attemptsData = await redis.get(key);
            const attempts: AuthAttempt = attemptsData ? JSON.parse(attemptsData) : {
                ip,
                email,
                attempts: 0,
                lastAttempt: new Date(),
                blocked: false
            };

            // Check if currently blocked
            if (attempts.blocked && attempts.blockUntil && new Date() < new Date(attempts.blockUntil)) {
                const timeLeft = Math.ceil((new Date(attempts.blockUntil).getTime() - Date.now()) / 1000 / 60);
                return res.status(429).json({
                    success: false,
                    message: `Account temporarily locked. Try again in ${timeLeft} minutes.`,
                    retryAfter: timeLeft * 60,
                    type: 'ACCOUNT_LOCKED'
                });
            }

            // Progressive penalty calculation
            const getBlockDuration = (attemptCount: number): number => {
                if (attemptCount <= 3) return 0;           // No block
                if (attemptCount <= 5) return 15;          // 15 minutes
                if (attemptCount <= 8) return 60;          // 1 hour
                if (attemptCount <= 12) return 240;        // 4 hours
                return 1440;                               // 24 hours
            };

            // Reset attempts if enough time has passed (1 hour window)
            const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
            if (attempts.lastAttempt < hourAgo && !attempts.blocked) {
                attempts.attempts = 0;
            }

            // Increment attempts
            attempts.attempts += 1;
            attempts.lastAttempt = new Date();

            // Check if should block
            const blockDuration = getBlockDuration(attempts.attempts);
            if (blockDuration > 0) {
                attempts.blocked = true;
                attempts.blockUntil = new Date(Date.now() + blockDuration * 60 * 1000);
                
                // Store in Redis với TTL
                await redis.setex(key, blockDuration * 60, JSON.stringify(attempts));
                
                return res.status(429).json({
                    success: false,
                    message: `Too many failed attempts. Account locked for ${blockDuration} minutes.`,
                    retryAfter: blockDuration * 60,
                    type: 'PROGRESSIVE_LOCK'
                });
            }

            // Store attempts
            await redis.setex(key, 3600, JSON.stringify(attempts)); // 1 hour TTL
            
            // Add attempts info to request for logging
            req.authAttempts = attempts;
            
            next();
        } catch (error) {
            console.error('Rate limiting error:', error);
            // Fail open - allow request if Redis fails
            next();
        }
    };
};

// 🆕 NEW: Clear rate limit (for successful auth)
export const clearAuthAttempts = async (ip: string, email?: string) => {
    const key = `auth_attempts:${ip}:${email || 'unknown'}`;
    try {
        await redis.del(key);
    } catch (error) {
        console.error('Error clearing auth attempts:', error);
    }
};

export const authRateLimiters = {
    // General auth endpoints
    general: createRateLimit(10, 15), // 10 requests per 15 minutes
    
    // Login attempts (progressive)
    login: createProgressiveAuthLimit(),
    
    // Registration (prevent spam)
    register: createRateLimit(3, 60), // 3 registrations per hour
    
    // Password reset (prevent abuse)
    passwordReset: createRateLimit(3, 60), // 3 resets per hour
    
    // OAuth (prevent OAuth abuse)
    oauth: createRateLimit(5, 15), // 5 OAuth attempts per 15 minutes
};