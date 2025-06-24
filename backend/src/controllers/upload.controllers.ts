import { Request, Response } from 'express';
import { uploadToS3 } from '../config/aws';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { UploadResponse } from '../types/uploadTypes/upload';
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE } from '../utils/typeValidation';
import File from '../models/File';
import { logApiRequest } from '../utils/Api.utils';
import { logger } from '../utils/logger.utils';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { formatFileSize } from '../utils/Format.utils';
import { generateRandomFileName } from '../utils/Random.utils';

// ===== INTERFACE DEFINITIONS =====
interface AuthenticatedRequest extends Request {
    user?: any;
}

// ===== HELPER FUNCTIONS =====

/**
 * Generate unique file key for S3 storage
 */
const generateFileKey = (originalName: string, userId: string): string => {
    const timestamp = Date.now();
    const uuid = uuidv4().substring(0, 8);
    const extension = path.extname(originalName);
    const cleanName = path.basename(originalName, extension)
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 50);

    return `study-materials/${userId}/${timestamp}_${uuid}_${cleanName}${extension}`;
};

/**
 * Validate uploaded file
 */
const validateFile = (file: Express.Multer.File): string | null => {
    // Check file type
    if (!SUPPORTED_FILE_TYPES[file.mimetype as keyof typeof SUPPORTED_FILE_TYPES]) {
        return 'Unsupported file type. Supported: PDF, Images, Word documents, Text files';
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`;
    }

    // Check if file has content
    if (file.size === 0) {
        return 'Empty file not allowed';
    }

    return null;
};

// ===== UPLOAD CONTROLLERS =====

/**
 * @desc    Upload single file
 * @route   POST /api/upload/file
 * @access  Private
 */
export const uploadFile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const user = req.user;
    if (!user) {
        logger.warn('File upload denied: User not authenticated', {
            ip: req.ip
        });
        throw new ApiError(401, 'Authentication required');
    }

    // Check if file exists
    if (!req.file) {
        logger.warn('File upload failed: No file provided', {
            userId: user._id,
            ip: req.ip
        });
        throw new ApiError(400, 'No file provided');
    }

    const file = req.file;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
        logger.warn('File upload failed: Validation error', {
            userId: user._id,
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            error: validationError,
            ip: req.ip
        });
        throw new ApiError(400, validationError);
    }

    // Generate unique file key
    const fileKey = generateFileKey(file.originalname, user._id);

    logger.info('Uploading file to S3', {
        userId: user._id,
        fileName: file.originalname,
        fileSize: formatFileSize(file.size),
        mimeType: file.mimetype,
        s3Key: fileKey,
        ip: req.ip
    });

    // Upload to S3
    const fileUrl = await uploadToS3(
        file.buffer,
        fileKey,
        file.mimetype
    );

    logger.info('File uploaded to S3 successfully', {
        userId: user._id,
        fileName: file.originalname,
        s3Url: fileUrl,
        ip: req.ip
    });

    // Save to database
    const fileDoc = new File({
        originalName: file.originalname,
        filename: fileKey,
        mimeType: file.mimetype,
        size: file.size,
        url: fileUrl,
        uploadedBy: user._id,
        category: file.mimetype.startsWith('image/') ? 'image' :
            file.mimetype === 'application/pdf' ? 'pdf' : 'document',
        isPublic: false
    });

    const savedFile = await fileDoc.save();
    
    logger.info('File saved to database', {
        userId: user._id,
        fileId: savedFile._id,
        fileName: file.originalname,
        ip: req.ip
    });

    // Return success response
    const responseData = {
        attachment: {
            filename: fileKey,
            originalName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            url: fileUrl,
            uploadedAt: new Date(),
            fileType: path.extname(file.originalname).toLowerCase(),
            category: file.mimetype.startsWith('image/') ? 'image' :
                file.mimetype === 'application/pdf' ? 'pdf' : 'document'
        }
    };

    return res.status(200).json(
        new ApiResponse(200, responseData, 'File uploaded successfully')
    );
});

/**
 * @desc    Upload multiple files
 * @route   POST /api/upload/files
 * @access  Private
 */
export const uploadFiles = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    const user = req.user;
    if (!user) {
        logger.warn('Multiple file upload denied: User not authenticated', {
            ip: req.ip
        });
        throw new ApiError(401, 'Authentication required');
    }

    // Check if files exist
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
        logger.warn('Multiple file upload failed: No files provided', {
            userId: user._id,
            ip: req.ip
        });
        throw new ApiError(400, 'No files provided');
    }

    logger.info('Uploading multiple files', {
        userId: user._id,
        fileCount: files.length,
        ip: req.ip
    });

    const uploadResults = [];
    const errors = [];

    // Process each file
    for (const file of files) {
        try {
            // Validate file
            const validationError = validateFile(file);
            if (validationError) {
                errors.push(`${file.originalname}: ${validationError}`);
                continue;
            }

            // Generate unique file key
            const fileKey = generateFileKey(file.originalname, user._id);

            // Upload to S3
            const fileUrl = await uploadToS3(
                file.buffer,
                fileKey,
                file.mimetype
            );

            // Save to database
            const fileDoc = new File({
                originalName: file.originalname,
                filename: fileKey,
                mimeType: file.mimetype,
                size: file.size,
                url: fileUrl,
                uploadedBy: user._id,
                category: file.mimetype.startsWith('image/') ? 'image' :
                         file.mimetype === 'application/pdf' ? 'pdf' : 'document',
                isPublic: false
            });

            const savedFile = await fileDoc.save();

            uploadResults.push({
                filename: fileKey,
                originalName: file.originalname,
                size: file.size,
                mimeType: file.mimetype,
                url: fileUrl,
                uploadedAt: new Date(),
                fileType: path.extname(file.originalname).toLowerCase(),
                category: file.mimetype.startsWith('image/') ? 'image' :
                         file.mimetype === 'application/pdf' ? 'pdf' : 'document'
            });

        } catch (error: any) {
            logger.error('File upload failed', {
                userId: user._id,
                fileName: file.originalname,
                error: error.message,
                ip: req.ip
            });
            errors.push(`${file.originalname}: Upload failed`);
        }
    }

    logger.info('Multiple file upload completed', {
        userId: user._id,
        successCount: uploadResults.length,
        errorCount: errors.length,
        ip: req.ip
    });

    return res.status(200).json(
        new ApiResponse(200, {
            uploads: uploadResults,
            errors: errors.length > 0 ? errors : undefined
        }, `Uploaded ${uploadResults.length} files successfully`)
    );
});

// 🆕 Get user's files
export const getUserFiles = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const user = (req as any).user;
        const { page = 1, limit = 20, category, search } = req.query;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Build filter
        const filter: any = { uploadedBy: user._id };
        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { originalName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search as string, 'i')] } }
            ];
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        
        const files = await File.find(filter)
            .sort({ uploadedAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('uploadedBy', 'fullName profilePic');

        const total = await File.countDocuments(filter);

        return res.status(200).json({
            success: true,
            data: {
                files,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / Number(limit)),
                    totalItems: total,
                    hasNext: skip + files.length < total,
                    hasPrev: Number(page) > 1
                }
            }
        });

    } catch (error: any) {
        console.error('❌ Get files error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get files',
            error: error.message
        });
    }
};

// 🆕 Delete file
export const deleteFile = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const user = (req as any).user;
        const { fileId } = req.params;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Find file and check ownership
        const file = await File.findOne({
            _id: fileId,
            uploadedBy: user._id
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found or access denied'
            });
        }

        // Delete from database
        await File.findByIdAndDelete(fileId);

        // TODO: Optionally delete from S3
        // await deleteFromS3(file.filename);

        return res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });

    } catch (error: any) {
        console.error('❌ Delete file error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete file',
            error: error.message
        });
    }
};