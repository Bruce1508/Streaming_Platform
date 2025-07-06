import { Request, Response, NextFunction } from 'express';
export declare const securityMiddleware: {
    sanitizeInput: (req: Request, res: Response, next: NextFunction) => void;
    preventNoSQLInjection: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    validateContentType: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
};
export declare const authValidators: {
    validateSignUp: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateSignIn: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateOAuth: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateOnBoarding: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateUpdateProfile: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateForgotPassword: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateResetPassword: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateChangePassword: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateRefreshToken: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateGetUsersList: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateUpdateUserStatus: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateUserParams: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateVerificationToken: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateCompleteProfile: (((req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>) | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
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