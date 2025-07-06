"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getUserFiles = exports.uploadFiles = exports.uploadFile = void 0;
const aws_1 = require("../config/aws");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const typeValidation_1 = require("../utils/typeValidation");
const File_1 = __importDefault(require("../models/File"));
const Api_utils_1 = require("../utils/Api.utils");
const logger_utils_1 = require("../utils/logger.utils");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const Format_utils_1 = require("../utils/Format.utils");
// ===== HELPER FUNCTIONS =====
/**
 * Generate unique file key for S3 storage
 */
const generateFileKey = (originalName, userId) => {
    const timestamp = Date.now();
    const uuid = (0, uuid_1.v4)().substring(0, 8);
    const extension = path_1.default.extname(originalName);
    const cleanName = path_1.default.basename(originalName, extension)
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 50);
    return `study-materials/${userId}/${timestamp}_${uuid}_${cleanName}${extension}`;
};
/**
 * Validate uploaded file
 */
const validateFile = (file) => {
    // Check file type
    if (!typeValidation_1.SUPPORTED_FILE_TYPES[file.mimetype]) {
        return 'Unsupported file type. Supported: PDF, Images, Word documents, Text files';
    }
    // Check file size
    if (file.size > typeValidation_1.MAX_FILE_SIZE) {
        return `File size exceeds ${(0, Format_utils_1.formatFileSize)(typeValidation_1.MAX_FILE_SIZE)} limit`;
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
exports.uploadFile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const user = req.user;
    if (!user) {
        logger_utils_1.logger.warn('File upload denied: User not authenticated', {
            ip: req.ip
        });
        throw new ApiError_1.ApiError(401, 'Authentication required');
    }
    // Check if file exists
    if (!req.file) {
        logger_utils_1.logger.warn('File upload failed: No file provided', {
            userId: user._id,
            ip: req.ip
        });
        throw new ApiError_1.ApiError(400, 'No file provided');
    }
    const file = req.file;
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
        logger_utils_1.logger.warn('File upload failed: Validation error', {
            userId: user._id,
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            error: validationError,
            ip: req.ip
        });
        throw new ApiError_1.ApiError(400, validationError);
    }
    // Generate unique file key
    const fileKey = generateFileKey(file.originalname, user._id);
    logger_utils_1.logger.info('Uploading file to S3', {
        userId: user._id,
        fileName: file.originalname,
        fileSize: (0, Format_utils_1.formatFileSize)(file.size),
        mimeType: file.mimetype,
        s3Key: fileKey,
        ip: req.ip
    });
    // Upload to S3
    const fileUrl = yield (0, aws_1.uploadToS3)(file.buffer, fileKey, file.mimetype);
    logger_utils_1.logger.info('File uploaded to S3 successfully', {
        userId: user._id,
        fileName: file.originalname,
        s3Url: fileUrl,
        ip: req.ip
    });
    // Save to database
    const fileDoc = new File_1.default({
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
    const savedFile = yield fileDoc.save();
    logger_utils_1.logger.info('File saved to database', {
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
            fileType: path_1.default.extname(file.originalname).toLowerCase(),
            category: file.mimetype.startsWith('image/') ? 'image' :
                file.mimetype === 'application/pdf' ? 'pdf' : 'document'
        }
    };
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, responseData, 'File uploaded successfully'));
}));
/**
 * @desc    Upload multiple files
 * @route   POST /api/upload/files
 * @access  Private
 */
exports.uploadFiles = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const user = req.user;
    if (!user) {
        logger_utils_1.logger.warn('Multiple file upload denied: User not authenticated', {
            ip: req.ip
        });
        throw new ApiError_1.ApiError(401, 'Authentication required');
    }
    // Check if files exist
    const files = req.files;
    if (!files || files.length === 0) {
        logger_utils_1.logger.warn('Multiple file upload failed: No files provided', {
            userId: user._id,
            ip: req.ip
        });
        throw new ApiError_1.ApiError(400, 'No files provided');
    }
    logger_utils_1.logger.info('Uploading multiple files', {
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
            const fileUrl = yield (0, aws_1.uploadToS3)(file.buffer, fileKey, file.mimetype);
            // Save to database
            const fileDoc = new File_1.default({
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
            const savedFile = yield fileDoc.save();
            uploadResults.push({
                filename: fileKey,
                originalName: file.originalname,
                size: file.size,
                mimeType: file.mimetype,
                url: fileUrl,
                uploadedAt: new Date(),
                fileType: path_1.default.extname(file.originalname).toLowerCase(),
                category: file.mimetype.startsWith('image/') ? 'image' :
                    file.mimetype === 'application/pdf' ? 'pdf' : 'document'
            });
        }
        catch (error) {
            logger_utils_1.logger.error('File upload failed', {
                userId: user._id,
                fileName: file.originalname,
                error: error.message,
                ip: req.ip
            });
            errors.push(`${file.originalname}: Upload failed`);
        }
    }
    logger_utils_1.logger.info('Multiple file upload completed', {
        userId: user._id,
        successCount: uploadResults.length,
        errorCount: errors.length,
        ip: req.ip
    });
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        uploads: uploadResults,
        errors: errors.length > 0 ? errors : undefined
    }, `Uploaded ${uploadResults.length} files successfully`));
}));
// 🆕 Get user's files
const getUserFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { page = 1, limit = 20, category, search } = req.query;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        // Build filter
        const filter = { uploadedBy: user._id };
        if (category)
            filter.category = category;
        if (search) {
            filter.$or = [
                { originalName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }
        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        const files = yield File_1.default.find(filter)
            .sort({ uploadedAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('uploadedBy', 'fullName profilePic');
        const total = yield File_1.default.countDocuments(filter);
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
    }
    catch (error) {
        console.error('❌ Get files error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get files',
            error: error.message
        });
    }
});
exports.getUserFiles = getUserFiles;
// 🆕 Delete file
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { fileId } = req.params;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        // Find file and check ownership
        const file = yield File_1.default.findOne({
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
        yield File_1.default.findByIdAndDelete(fileId);
        // TODO: Optionally delete from S3
        // await deleteFromS3(file.filename);
        return res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });
    }
    catch (error) {
        console.error('❌ Delete file error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete file',
            error: error.message
        });
    }
});
exports.deleteFile = deleteFile;
//# sourceMappingURL=upload.controllers.js.map