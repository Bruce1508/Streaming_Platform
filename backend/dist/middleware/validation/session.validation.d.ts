import { Request, Response, NextFunction } from 'express';
export declare const createSession: (userId: string, req: Request) => Promise<string>;
export declare const validateSession: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=session.validation.d.ts.map