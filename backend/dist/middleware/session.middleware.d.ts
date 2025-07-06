import { Request, Response, NextFunction } from 'express';
export declare const createSessionMiddleware: (loginMethod?: "password" | "oauth") => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateSessionMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const optionalSessionValidation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=session.middleware.d.ts.map