declare global {
    namespace Express {
        interface Request {
            authAttempts?: {
                ip: string;
                email?: string;
                attempts: number;
                lastAttempt: Date;
                blocked: boolean;
                blockUntil?: Date;
            };
            sessionInfo?: {
                userId: string;
                sessionId: string;
                ipAddress: string;
                userAgent: string;
                isActive: boolean;
                lastActivity: Date;
            };
        }
    }
}

export {};