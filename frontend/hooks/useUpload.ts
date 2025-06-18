// hooks/useUpload.ts

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth vào hook

export interface UploadFileResponse {
    success: boolean;
    data?: {
        attachment: {
            id: string;
            originalName: string;
            size: number;
            mimeType: string;
            url: string;
            uploadedAt: string;
        }
    };
    error?: string;
}

export interface FileWithStatus {
    file: File;
    id: string;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    progress: number;
    error?: string;
    result?: any;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export function useUpload() {
    const { user, token } = useAuth(); // Dùng useAuth trong hook
    const [files, setFiles] = useState<FileWithStatus[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Upload single file function - bây giờ có thể access token
    const uploadSingleFile = useCallback(async (
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<UploadFileResponse> => {
        const getValidToken = (): string | null => {
            // Try context first
            if (token && typeof token === 'string' && token !== 'null') {
                return token;
            }
            // Try localStorage
            const storageToken = localStorage.getItem("auth_token");
            if (storageToken && storageToken !== 'null' && storageToken !== 'undefined') {
                return typeof storageToken === 'string' ? storageToken : String(storageToken);
            }
            return null;
        };

        try {
            const formData = new FormData();
            formData.append('file', file);

            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                // Track upload progress
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable && onProgress) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        onProgress(progress);
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response);
                        } catch (error) {
                            reject(new Error('Invalid response format'));
                        }
                    } else {
                        try {
                            const errorResponse = JSON.parse(xhr.responseText);
                            reject(new Error(errorResponse.message || 'Upload failed'));
                        } catch {
                            reject(new Error(`HTTP ${xhr.status}: Upload failed`));
                        }
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Network error during upload'));
                });

                xhr.addEventListener('timeout', () => {
                    reject(new Error('Upload timeout'));
                });

                xhr.open('POST', `${BASE_URL}/upload/file`);

                // Set headers
                const validToken = getValidToken();
                if (validToken) {
                    xhr.setRequestHeader('Authorization', `Bearer ${validToken}`);
                }

                xhr.timeout = 300000; // 5 minutes timeout
                xhr.send(formData);
            });
        } catch (error) {
            console.error('❌ Upload file error:', error);
            throw error;
        }
    }, [token]); // Dependency array

    // Add files to upload queue
    const addFiles = useCallback((newFiles: File[]) => {
        const fileStatuses: FileWithStatus[] = newFiles.map(file => ({
            file,
            id: `${Date.now()}-${Math.random()}`,
            status: 'pending' as const,
            progress: 0,
        }));

        setFiles(prev => [...prev, ...fileStatuses]);
        setError(null);
    }, []);

    // Remove file from queue
    const removeFile = useCallback((fileId: string) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
    }, []);

    // Upload all files
    const uploadAllFiles = useCallback(async () => {
        const pendingFiles = files.filter(f => f.status === 'pending');
        if (pendingFiles.length === 0) return [];

        setUploading(true);
        setError(null);

        const results: any[] = [];
        let completedCount = 0;

        try {
            for (const fileStatus of pendingFiles) {
                // Update file status to uploading
                setFiles(prev => prev.map(f =>
                    f.id === fileStatus.id
                        ? { ...f, status: 'uploading' as const }
                        : f
                ));

                try {
                    const result = await uploadSingleFile(
                        fileStatus.file,
                        (progress) => {
                            // Update individual file progress
                            setFiles(prev => prev.map(f =>
                                f.id === fileStatus.id
                                    ? { ...f, progress }
                                    : f
                            ));
                        }
                    );

                    // Mark file as completed
                    setFiles(prev => prev.map(f =>
                        f.id === fileStatus.id
                            ? { ...f, status: 'completed' as const, progress: 100, result }
                            : f
                    ));

                    results.push(result);
                    completedCount++;

                    // Update overall progress
                    setProgress(Math.round((completedCount / pendingFiles.length) * 100));

                } catch (error) {
                    // Mark file as error
                    setFiles(prev => prev.map(f =>
                        f.id === fileStatus.id
                            ? {
                                ...f,
                                status: 'error' as const,
                                error: error instanceof Error ? error.message : 'Upload failed'
                            }
                            : f
                    ));
                }
            }

            setUploadedFiles(results);
            return results;

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Upload failed');
            throw error;
        } finally {
            setUploading(false);
        }
    }, [files, uploadSingleFile]);

    // Reset all state
    const reset = useCallback(() => {
        setFiles([]);
        setUploading(false);
        setProgress(0);
        setUploadedFiles([]);
        setError(null);
    }, []);

    // Get upload statistics
    const getStats = useCallback(() => {
        const total = files.length;
        const completed = files.filter(f => f.status === 'completed').length;
        const errors = files.filter(f => f.status === 'error').length;
        const pending = files.filter(f => f.status === 'pending').length;
        const uploading = files.filter(f => f.status === 'uploading').length;

        const valid = files.filter(f => {
            const maxSize = 10 * 1024 * 1024; // 10MB
            const allowedTypes = [
                'application/pdf',
                'image/jpeg',
                'image/png',
                'image/gif',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain'
            ];
            return f.file.size <= maxSize && allowedTypes.includes(f.file.type);
        }).length;

        const invalid = total - valid;
        const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);
        const totalSizeFormatted = `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;

        return {
            total,
            completed,
            errors,
            pending,
            uploading,
            valid,
            invalid,
            totalSize,
            totalSizeFormatted
        };
    }, [files]);

    return {
        files,
        uploading,
        progress,
        uploadedFiles,
        error,
        addFiles,
        removeFile,
        uploadAllFiles,
        reset,
        getStats
    };
}