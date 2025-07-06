import { Request, Response, NextFunction } from 'express';
export declare const validateEnrollmentCreate: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateBulkEnrollment: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateEnrollmentUpdate: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
declare function handleValidationErrors(req: Request, res: Response, next: NextFunction): void;
export {};
//# sourceMappingURL=enrollment.validation.d.ts.map