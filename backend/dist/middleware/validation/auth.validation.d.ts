import { Request, Response, NextFunction } from 'express';
export declare const securityMiddleware: {
    sanitizeInput: (req: Request, res: Response, next: NextFunction) => void;
    preventNoSQLInjection: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    validateContentType: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
};
export declare const authValidators: {
    validateOAuth: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateSendMagicLink: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateVerifyMagicLink: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateOnBoarding: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateCompleteProfile: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateGetUsersList: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateUpdateUserStatus: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateUserParams: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateVerificationToken: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validatePagination: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
};
export declare const validationHelpers: {
    isEducationalEmail: (email: string) => boolean;
    createValidationError: (field: string, message: string) => {
        success: boolean;
        message: string;
        errors: {
            field: string;
            message: string;
        }[];
    };
    sanitizeFilename: (filename: string) => string;
};
export declare const composeValidation: (...middlewares: any[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const defaultSecurityChain: ((req: Request, res: Response, next: NextFunction) => void)[];
//# sourceMappingURL=auth.validation.d.ts.map