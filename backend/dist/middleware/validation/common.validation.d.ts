import { Request, Response, NextFunction } from 'express';
export declare const validatePagination: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateSearch: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateSort: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateObjectId: (paramName?: string) => (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateObjectIds: (fieldName: string) => (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateDateRange: (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateStatus: (allowedStatuses: string[]) => (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateCategory: (allowedCategories: string[]) => (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateNumericRange: (fieldName: string, min: number, max: number) => (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
export declare const validateFileType: (allowedTypes: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateArrayLength: (fieldName: string, min: number, max: number) => (import("express-validator").ValidationChain | typeof handleValidationErrors)[];
declare function handleValidationErrors(req: Request, res: Response, next: NextFunction): void;
export { handleValidationErrors };
//# sourceMappingURL=common.validation.d.ts.map