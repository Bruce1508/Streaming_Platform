import { Request, Response } from 'express';
import { uploadToS3 } from '../config/aws';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { UploadResponse } from '../types/uploadTypes/upload';
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE } from '../utils/typeValidation';
import File from '../models/File';

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

        const fileDoc = new File({
            originalName: file.originalname,
            filename: fileKey,
            mimeType: file.mimetype,
            size: file.size,
            url: fileUrl,
            uploadedBy: user._id,
            category: file.mimetype.startsWith('image/') ? 'image' :
                file.mimetype === 'application/pdf' ? 'pdf' : 'document',
            isPublic: false // Default to private
        });

        const savedFile = await fileDoc.save();
        console.log('✅ File saved to database:', savedFile._id);

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

        // Check if files exist
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files provided'
            });
        }

        console.log('📤 Uploading multiple files:', {
            count: files.length,
            userId: user._id
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
                    success: true,
                    file: {
                        id: savedFile._id,
                        filename: savedFile.filename,
                        originalName: savedFile.originalName,
                        size: savedFile.size,
                        mimeType: savedFile.mimeType,
                        url: savedFile.url,
                        uploadedAt: savedFile.uploadedAt,
                        category: savedFile.category
                    }
                });

            } catch (error: any) {
                console.error(`❌ Error uploading ${file.originalname}:`, error);
                errors.push(`${file.originalname}: ${error.message}`);
            }
        }

        const successCount = uploadResults.length;
        const errorCount = errors.length;

        console.log('✅ Multiple upload completed:', {
            success: successCount,
            errors: errorCount
        });

        return res.status(200).json({
            success: true,
            message: `Uploaded ${successCount} files successfully`,
            data: {
                files: uploadResults,
                stats: {
                    successful: successCount,
                    failed: errorCount,
                    total: files.length
                }
            },
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: any) {
        console.error('❌ Multiple files upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'Multiple files upload failed',
            error: error.message
        });
    }
};

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