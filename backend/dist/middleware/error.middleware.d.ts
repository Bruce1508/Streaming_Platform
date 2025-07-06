import { Request, Response, NextFunction } from 'express';
export declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
export declare const catchAsync: (fn: any) => (req: Request, res: Response, next: NextFunction) => void;
export declare const handleValidationError: (err: any) => any;
export declare const handleDuplicateKeyError: (err: any) => any;
export declare const handleJWTError: (err: any) => any;
export declare const processError: (err: any) => any;
//# sourceMappingURL=error.middleware.d.ts.map