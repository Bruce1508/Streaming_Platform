import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
export declare const signUp: (req: Request, res: Response) => Promise<void>;
export declare const signIn: (req: Request, res: Response) => Promise<void>;
export declare const getMe: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllUsers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const forgotPassword: (req: Request, res: Response) => Promise<void>;
export declare const resetPassword: (req: Request, res: Response) => Promise<void>;
export declare const refreshToken: (req: Request, res: Response) => Promise<void>;
export declare const logout: (req: AuthRequest, res: Response) => Promise<void>;
export declare const logoutAllDevices: (req: AuthRequest, res: Response) => Promise<void>;
export declare const handleOAuth: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controllers.d.ts.map