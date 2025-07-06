import { Request, Response, NextFunction } from 'express';
export declare const validateObjectId: (paramName?: string) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateCreateMaterial: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateUpdateMaterial: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateRating: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateComment: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateQueryParams: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=material.middleware.d.ts.map