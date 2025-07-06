import { Request, Response, NextFunction } from 'express';
export declare const validateQueryParams: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateMaterialQuery: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateUserQuery: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateCourseQuery: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
declare function handleValidationErrors(req: Request, res: Response, next: NextFunction): void;
export {};
//# sourceMappingURL=query.validation.d.ts.map