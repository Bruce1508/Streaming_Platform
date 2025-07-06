import { Request, Response, NextFunction } from 'express';
export declare const validateUserUpdate: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateUserProfile: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateUserQuery: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateUserId: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateRoleChange: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateStatusChange: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
declare function handleValidationErrors(req: Request, res: Response, next: NextFunction): void;
export {};
//# sourceMappingURL=user.validation.d.ts.map