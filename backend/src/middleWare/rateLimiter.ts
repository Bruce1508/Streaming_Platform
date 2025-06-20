import rateLimit from 'express-rate-limit';

export const createRateLimit = (maxRequests: number, windowMinutes: number) => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: maxRequests,
        message: {
            success: false,
            message: `Too many requests. Try again in ${windowMinutes} minutes.`,
            retryAfter: windowMinutes * 60
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};