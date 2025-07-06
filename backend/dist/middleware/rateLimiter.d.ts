export declare const createRateLimit: (maxRequest: number, windowMinutes: number) => import("express-rate-limit").RateLimitRequestHandler;
export declare const createProgressiveAuthLimit: () => (req: any, res: any, next: any) => Promise<any>;
export declare const clearAuthAttempts: (ip: string, email?: string) => Promise<void>;
export declare const authRateLimiters: {
    general: import("express-rate-limit").RateLimitRequestHandler;
    login: (req: any, res: any, next: any) => Promise<any>;
    register: import("express-rate-limit").RateLimitRequestHandler;
    passwordReset: import("express-rate-limit").RateLimitRequestHandler;
    oauth: import("express-rate-limit").RateLimitRequestHandler;
};
//# sourceMappingURL=rateLimiter.d.ts.map