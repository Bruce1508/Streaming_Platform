import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
declare const courseSchemas: {
    create: Joi.ObjectSchema<any>;
    update: Joi.ObjectSchema<any>;
    query: Joi.ObjectSchema<any>;
    enrollment: Joi.ObjectSchema<any>;
};
export declare const validateCourseId: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validatePrerequisites: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const courseValidators: {
    validateCreateCourse: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateUpdateCourse: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateCourseQuery: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateEnrollment: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateCourseId: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    validatePrerequisites: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
};
export { courseSchemas };
//# sourceMappingURL=course.validation.d.ts.map