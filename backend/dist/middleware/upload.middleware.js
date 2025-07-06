"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// File filter function (reuse from existing validation)
const fileFilter = (req, file, cb) => {
    // Allowed file types (focus on PDF & Word as requested)
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
        'application/vnd.ms-powerpoint', // .ppt
        'text/plain', // .txt
        'image/jpeg',
        'image/png',
        'image/gif'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Only PDF, Word documents, and text files are allowed.`));
    }
};
// Multer configuration - store in memory for S3 upload
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(), // Store in memory for direct S3 upload
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit (matches existing validation)
    },
    fileFilter,
});
// Export upload middleware for routes
exports.uploadSingle = exports.upload.single('file');
exports.uploadMultiple = exports.upload.array('files', 10); // Max 5 files
//# sourceMappingURL=upload.middleware.js.map