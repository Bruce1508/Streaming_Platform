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
exports.authRateLimiters = exports.clearAuthAttempts = exports.createProgressiveAuthLimit = exports.createRateLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const ioredis_1 = __importDefault(require("ioredis"));
const createRateLimit = (maxRequest, windowMinutes) => {
    return (0, express_rate_limit_1.default)({
        windowMs: windowMinutes * 60 * 1000,
        max: maxRequest,
        message: {
            success: false,
            message: `Too many requests. Try again in ${windowMinutes} minutes.`,
            retryAfter: windowMinutes * 60
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};
exports.createRateLimit = createRateLimit;
const redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
const createProgressiveAuthLimit = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const ip = req.ip;
        const email = (_a = req.body) === null || _a === void 0 ? void 0 : _a.email;
        const key = `auth_attempts:${ip}:${email || 'unknown'}`;
        try {
            // Get current attempts
            const attemptsData = yield redis.get(key);
            const attempts = attemptsData ? JSON.parse(attemptsData) : {
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
            const getBlockDuration = (attemptCount) => {
                if (attemptCount <= 3)
                    return 0; // No block
                if (attemptCount <= 5)
                    return 15; // 15 minutes
                if (attemptCount <= 8)
                    return 60; // 1 hour
                if (attemptCount <= 12)
                    return 240; // 4 hours
                return 1440; // 24 hours
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
                yield redis.setex(key, blockDuration * 60, JSON.stringify(attempts));
                return res.status(429).json({
                    success: false,
                    message: `Too many failed attempts. Account locked for ${blockDuration} minutes.`,
                    retryAfter: blockDuration * 60,
                    type: 'PROGRESSIVE_LOCK'
                });
            }
            // Store attempts
            yield redis.setex(key, 3600, JSON.stringify(attempts)); // 1 hour TTL
            // Add attempts info to request for logging
            req.authAttempts = attempts;
            next();
        }
        catch (error) {
            console.error('Rate limiting error:', error);
            // Fail open - allow request if Redis fails
            next();
        }
    });
};
exports.createProgressiveAuthLimit = createProgressiveAuthLimit;
// 🆕 NEW: Clear rate limit (for successful auth)
const clearAuthAttempts = (ip, email) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `auth_attempts:${ip}:${email || 'unknown'}`;
    try {
        yield redis.del(key);
    }
    catch (error) {
        console.error('Error clearing auth attempts:', error);
    }
});
exports.clearAuthAttempts = clearAuthAttempts;
exports.authRateLimiters = {
    // General auth endpoints
    general: (0, exports.createRateLimit)(10, 15), // 10 requests per 15 minutes
    // Login attempts (progressive)
    login: (0, exports.createProgressiveAuthLimit)(),
    // Registration (prevent spam)
    register: (0, exports.createRateLimit)(3, 60), // 3 registrations per hour
    // Password reset (prevent abuse)
    passwordReset: (0, exports.createRateLimit)(3, 60), // 3 resets per hour
    // OAuth (prevent OAuth abuse)
    oauth: (0, exports.createRateLimit)(5, 15), // 5 OAuth attempts per 15 minutes
};
//# sourceMappingURL=rateLimiter.js.map