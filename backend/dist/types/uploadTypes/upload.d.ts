export interface CloudinaryFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    path: string;
    size: number;
    filename: string;
    public_id?: string;
}
export interface FileUploadResult {
    filename: string;
    originalName: string;
    url: string;
    size: number;
    mimetype: string;
    publicId: string;
}
export interface UploadParams {
    folder: string;
    allowed_formats: string[];
    resource_type: string;
    transformation: Array<{
        width?: number;
        height?: number;
        crop?: string;
        quality?: string;
        format?: string;
    }>;
}
export interface UploadResponse {
    success: boolean;
    message: string;
    fileUrl?: string;
    fileInfo?: {
        originalName: string;
        size: number;
        mimeType: string;
        key: string;
    };
    error?: string;
}
//# sourceMappingURL=upload.d.ts.map