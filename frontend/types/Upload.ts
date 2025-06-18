export interface UploadFileResponse {
    success: boolean;
    message: string;
    data?: {
        attachment: {
            filename: string;
            originalName: string;
            size: number;
            mimeType: string;
            url: string;
            uploadedAt: string;
            fileType: string;
            category: 'image' | 'pdf' | 'document';
        };
    };
    error?: string;
}

export interface DeleteFileResponse {
    success: boolean;
    message: string;
    error?: string;
}

export const SUPPORTED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png', 
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB