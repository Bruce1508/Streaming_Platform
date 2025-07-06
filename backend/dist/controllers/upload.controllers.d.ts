import { Request, Response } from 'express';
/**
 * @desc    Upload single file
 * @route   POST /api/upload/file
 * @access  Private
 */
export declare const uploadFile: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Upload multiple files
 * @route   POST /api/upload/files
 * @access  Private
 */
export declare const uploadFiles: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getUserFiles: (req: Request, res: Response) => Promise<Response | any>;
export declare const deleteFile: (req: Request, res: Response) => Promise<Response | any>;
//# sourceMappingURL=upload.controllers.d.ts.map