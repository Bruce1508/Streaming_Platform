// hooks/useUpload.ts

'use client';

import { useState, useCallback } from 'react';
import {
    uploadFile as apiUploadFile,
    deleteFile as apiDeleteFile
} from '@/lib/UploadApi';
import {
    validateFile,
    getFileInfo,
    formatFileSize,
} from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext';
import { UploadFileResponse } from '@/types/Upload';

export interface FileWithPreview {
    file: File;
    id: string;
    preview?: string;
    info: {
        name: string;
        size: number;
        type: string;
        category: 'image' | 'pdf' | 'document';
        sizeFormatted: string;
    };
    validation: {
        isValid: boolean;
        error?: string;
    };
}

export interface UploadState {
    files: FileWithPreview[];
    uploading: boolean;
    progress: number;
    uploadedFiles: UploadFileResponse['data'][];
    error: string | null;
}

export function useUpload() {
    const { user } = useAuth();

    const [state, setState] = useState<UploadState>({
        files: [],
        uploading: false,
        progress: 0,
        uploadedFiles: [],
        error: null
    });

    // 📁 Add files to preview
    const addFiles = useCallback((newFiles: File[]) => {
        const filesWithPreview: FileWithPreview[] = newFiles.map(file => {
            const info = getFileInfo(file);
            const validation = validateFile(file);

            // Create preview for images
            let preview: string | undefined;
            if (file.type.startsWith('image/')) {
                preview = URL.createObjectURL(file);
            }

            return {
                file,
                id: `${file.name}-${file.lastModified}-${Math.random()}`,
                preview,
                info: {
                    ...info,
                    category: info.category as 'image' | 'pdf' | 'document'
                },
                validation: {
                    isValid: validation === null,
                    error: validation || undefined
                }
            };
        });

        setState(prev => ({
            ...prev,
            files: [...prev.files, ...filesWithPreview],
            error: null
        }));

        return filesWithPreview;
    }, []);

    // 🗑️ Remove file from preview
    const removeFile = useCallback((fileId: string) => {
        setState(prev => {
            const updatedFiles = prev.files.filter(f => f.id !== fileId);

            // Clean up preview URLs
            const removedFile = prev.files.find(f => f.id === fileId);
            if (removedFile?.preview) {
                URL.revokeObjectURL(removedFile.preview);
            }

            return {
                ...prev,
                files: updatedFiles
            };
        });
    }, []);

    // 📤 Upload single file
    const uploadSingleFile = useCallback(async (fileWithPreview: FileWithPreview) => {
        if (!user) {
            throw new Error('Authentication required');
        }

        if (!fileWithPreview.validation.isValid) {
            throw new Error(fileWithPreview.validation.error || 'Invalid file');
        }

        setState(prev => ({ ...prev, uploading: true, progress: 0, error: null }));

        try {
            const response = await apiUploadFile(
                fileWithPreview.file,
                (progress: any) => {
                    setState(prev => ({ ...prev, progress }));
                }
            );

            if (response.success && response.data) {
                setState(prev => ({
                    ...prev,
                    uploadedFiles: [...prev.uploadedFiles, response.data!],
                    uploading: false,
                    progress: 100
                }));

                // Clean up preview
                if (fileWithPreview.preview) {
                    URL.revokeObjectURL(fileWithPreview.preview);
                }

                return response;
            } else {
                throw new Error(response.message || 'Upload failed');
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            setState(prev => ({
                ...prev,
                uploading: false,
                progress: 0,
                error: errorMessage
            }));
            throw error;
        }
    }, [user]);

    // 📤 Upload all valid files
    const uploadAllFiles = useCallback(async () => {
        const validFiles = state.files.filter(f => f.validation.isValid);

        if (validFiles.length === 0) {
            setState(prev => ({ ...prev, error: 'No valid files to upload' }));
            return;
        }

        const results = [];

        for (const fileWithPreview of validFiles) {
            try {
                const result = await uploadSingleFile(fileWithPreview);
                results.push(result);
            } catch (error) {
                console.error(`Failed to upload ${fileWithPreview.info.name}:`, error);
                // Continue with other files
            }
        }

        // Clear uploaded files from preview
        setState(prev => ({
            ...prev,
            files: prev.files.filter(f => !f.validation.isValid)
        }));

        return results;
    }, [state.files, uploadSingleFile]);

    // 🗑️ Delete uploaded file
    const deleteUploadedFile = useCallback(async (filename: string) => {
        try {
            await apiDeleteFile(filename);

            setState(prev => ({
                ...prev,
                uploadedFiles: prev.uploadedFiles.filter(
                    file => file?.attachment.filename !== filename
                )
            }));

        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    }, []);

    // 🔄 Reset state
    const reset = useCallback(() => {
        // Clean up preview URLs
        state.files.forEach(file => {
            if (file.preview) {
                URL.revokeObjectURL(file.preview);
            }
        });

        setState({
            files: [],
            uploading: false,
            progress: 0,
            uploadedFiles: [],
            error: null
        });
    }, [state.files]);

    // 📊 Get statistics
    const getStats = useCallback(() => {
        const validFiles = state.files.filter(f => f.validation.isValid);
        const invalidFiles = state.files.filter(f => !f.validation.isValid);
        const totalSize = state.files.reduce((sum, f) => sum + f.info.size, 0);

        return {
            total: state.files.length,
            valid: validFiles.length,
            invalid: invalidFiles.length,
            totalSize,
            totalSizeFormatted: formatFileSize(totalSize),
            uploaded: state.uploadedFiles.length
        };
    }, [state.files, state.uploadedFiles]);

    return {
        // State
        ...state,

        // Actions
        addFiles,
        removeFile,
        uploadFile: uploadSingleFile,
        uploadAllFiles,
        deleteUploadedFile,
        reset,

        // Utils
        getStats,

        // Validation
        validateFile,
        formatFileSize
    };
}