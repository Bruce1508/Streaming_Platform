import { Request, Response } from 'express';
import { uploadToS3 } from '../config/aws';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { UploadResponse } from '../types/uploadTypes/upload';
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE } from '../utils/typeValidation';

// Helper function to generate unique file key
const generateFileKey = (originalName: string, userId: string): string => {
    const timestamp = Date.now();
    const uuid = uuidv4().substring(0, 8);
    const extension = path.extname(originalName);
    const cleanName = path.basename(originalName, extension)
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 50);

    return `study-materials/${userId}/${timestamp}_${uuid}_${cleanName}${extension}`;
};

const validateFile = (file: Express.Multer.File): string | null => {
    // Check file type
    if (!SUPPORTED_FILE_TYPES[file.mimetype as keyof typeof SUPPORTED_FILE_TYPES]) {
        return 'Unsupported file type. Supported: PDF, Images, Word documents, Text files';
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return 'File size exceeds 10MB limit';
    }

    // Check if file has content
    if (file.size === 0) {
        return 'Empty file not allowed';
    }

    return null;
};


// Single file upload endpoint (Option A: Upload file first)
export const uploadFile = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            } as UploadResponse);
        }

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file provided'
            } as UploadResponse);
        }

        const file = req.file;

        const validationError = validateFile(file);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        // Generate unique file key
        const fileKey = generateFileKey(file.originalname, user._id);

        console.log('📤 Uploading file to S3:', {
            originalName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            key: fileKey,
            userId: user._id
        });

        // Upload to S3
        const fileUrl = await uploadToS3(
            file.buffer,
            fileKey,
            file.mimetype
        );

        console.log('✅ File uploaded successfully:', fileUrl);

        // Return success response with file info
        return res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                attachment: {
                    filename: fileKey, // S3 KEY for database storage
                    originalName: file.originalname,
                    size: file.size,
                    mimeType: file.mimetype,
                    url: fileUrl, // S3 public URL for frontend access
                    uploadedAt: new Date(),
                    fileType: path.extname(file.originalname).toLowerCase(),
                    // ✅ Add file category for frontend
                    category: file.mimetype.startsWith('image/') ? 'image' :
                        file.mimetype === 'application/pdf' ? 'pdf' : 'document'
                }
            }
        });

    } catch (error: any) {
        console.error('❌ File upload error:', error);

        return res.status(500).json({
            success: false,
            message: 'File upload failed in uploadFile function in backend',
            error: error.message
        } as UploadResponse);
    }
};

// Multiple files upload endpoint (for future scalability)
export const uploadFiles = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files provided'
            });
        }

        // Upload all files to S3
        const uploadPromises = files.map(async (file) => {
            const fileKey = generateFileKey(file.originalname, user._id);
            const fileUrl = await uploadToS3(file.buffer, fileKey, file.mimetype);

            return {
                originalName: file.originalname,
                size: file.size,
                mimeType: file.mimetype,
                fileUrl,
                key: fileKey
            };
        });

        const uploadedFiles = await Promise.all(uploadPromises);

        return res.status(200).json({
            success: true,
            message: `${uploadedFiles.length} files uploaded successfully`,
            files: uploadedFiles
        });

    } catch (error: any) {
        console.error('❌ Multiple files upload error:', error);

        return res.status(500).json({
            success: false,
            message: 'Files upload failed',
            error: error.message
        });
    }
};

// File deletion endpoint (for cleanup)
export const deleteFile = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const user = (req as any).user;
        const { fileKey } = req.params;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Verify user owns this file (security check)
        if (!fileKey.includes(user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // TODO: Implement S3 file deletion
        // For now, just return success (files will be cleaned up later)
        console.log('🗑️ File deletion requested:', fileKey);

        return res.status(200).json({
            success: true,
            message: 'File deletion scheduled'
        });

    } catch (error: any) {
        console.error('❌ File deletion error:', error);

        return res.status(500).json({
            success: false,
            message: 'File deletion failed',
            error: error.message
        });
    }
};