import multer from 'multer';
import { Request } from 'express';
import path from 'path';

// File filter function (reuse from existing validation)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Only PDF, Word documents, and text files are allowed.`));
    }
};

// Multer configuration - store in memory for S3 upload
export const upload = multer({
    storage: multer.memoryStorage(), // Store in memory for direct S3 upload
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit (matches existing validation)
    },
    fileFilter,
});

// Export upload middleware for routes
export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.array('files', 10); // Max 5 files