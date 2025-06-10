// backend/src/middleware/upload.ts
import multer, { FileFilterCallback } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';
import cloudinary from '../config/cloudinary';
import { UploadParams } from '../uploadTypes/upload';

// Configure cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'langbuddy/posts',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'mp3', 'mp4', 'mov', 'avi'],
        resource_type: 'auto',
        transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { format: 'auto' }
        ]
    } as UploadParams
});

// File filter with proper typing
const fileFilter = (
    req: Request, 
    file: Express.Multer.File, 
    cb: FileFilterCallback
): void => {
    const allowedMimes: string[] = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
        'application/pdf',
        'audio/mpeg', 'audio/mp3',
        'video/mp4', 'video/quicktime', 'video/avi'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} not allowed`));
    }
};

// Configure multer with proper typing
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
        files: 5 // Max 5 files per request
    }
});

export default upload;