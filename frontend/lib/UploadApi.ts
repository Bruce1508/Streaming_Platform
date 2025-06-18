import { getValidToken } from './tokenUtils';
import { UploadFileResponse, DeleteFileResponse, SUPPORTED_TYPES, MAX_FILE_SIZE } from '@/types/Upload';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const uploadFile = async (
    file: File,
    onProgress?: (progress: number) => void
): Promise<UploadFileResponse> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const validToken = getValidToken();

        if (!validToken) {
            console.error('❌ No auth token for fetchFriendRequests');
            throw new Error('Authentication required');
        }

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
            Object.entries(validToken).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });

            xhr.timeout = 300000; // 5 minutes timeout
            xhr.send(formData);
        })
    } catch (error) {
        console.error('❌ Upload file error in uploadFile in uploadAPI.ts:', error);
        throw error;
    }
};

// 📤 Upload multiple files
export const uploadFiles = async (
    files: File[],
    onProgress?: (progress: number) => void
): Promise<any> => {
    try {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const validToken = getValidToken();

        if (!validToken) {
            console.error('❌ No auth token for fetchFriendRequests');
            return;
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && onProgress) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    onProgress(progress);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    const errorResponse = JSON.parse(xhr.responseText);
                    reject(new Error(errorResponse.message || 'Upload failed'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error'));
            });

            xhr.open('POST', `${BASE_URL}/api/upload/files`);
            Object.entries(validToken).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });

            xhr.send(formData);
        });

    } catch (error) {
        console.error('❌ Upload files error:', error);
        throw error;
    }
};

// 🗑️ Delete file
export const deleteFile = async (fileKey: string): Promise<DeleteFileResponse> => {
    try {
        const validToken = getValidToken();

        if (!validToken) {
            console.error('❌ No auth token for fetchFriendRequests');
            throw new Error('Authentication required');
        }

        const response = await fetch(`${BASE_URL}/api/upload/${fileKey}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${validToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Delete failed');
        }

        return data;

    } catch (error) {
        console.error('❌ Delete file error:', error);
        throw error;
    }
};

