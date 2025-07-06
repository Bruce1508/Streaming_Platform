import { Request } from 'express';
export interface SessionData {
    userId: string;
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    deviceType?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
    loginMethod?: 'password' | 'oauth' | 'migration';
}
export declare const generateSessionId: () => string;
export declare const detectDeviceType: (userAgent: string) => "mobile" | "tablet" | "desktop" | "unknown";
export declare const createUserSession: (userId: string, req: Request, loginMethod?: "password" | "oauth" | "migration") => Promise<string>;
export declare const validateUserSession: (sessionId: string) => Promise<boolean>;
export declare const getUserActiveSessions: (userId: string) => Promise<any>;
export declare const deactivateSession: (sessionId: string) => Promise<boolean>;
export declare const deactivateAllUserSessions: (userId: string, exceptSessionId?: string) => Promise<number>;
//# sourceMappingURL=session.utils.d.ts.map