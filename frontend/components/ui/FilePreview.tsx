// components/ui/upload/FilePreview.tsx

import React from 'react';
import { X, FileText, Image, File, AlertCircle, CheckCircle } from 'lucide-react';
import { FileWithStatus } from '@/hooks/useUpload';

interface FilePreviewProps {
    file: FileWithStatus;
    onRemove: (fileId: string) => void;
}

// File validation function
const validateFile = (file: File) => {
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
    
    const isValidSize = file.size <= maxSize;
    const isValidType = allowedTypes.includes(file.type);
    
    return {
        isValid: isValidSize && isValidType,
        errors: [
            ...(!isValidSize ? [`File too large (max 10MB, current: ${(file.size / (1024 * 1024)).toFixed(1)}MB)`] : []),
            ...(!isValidType ? [`File type not supported (${file.type})`] : [])
        ]
    };
};

// Get file icon based on type
const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType === 'application/pdf') return FileText;
    return File;
};

// Format file size
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export function FilePreview({ file, onRemove }: FilePreviewProps) {
    const validation = validateFile(file.file);
    const FileIcon = getFileIcon(file.file.type);
    
    return (
        <div className={`
            relative p-4 rounded-lg border-2 transition-all duration-200
            ${validation.isValid 
                ? 'border-gray-200 bg-gray-50 hover:border-gray-300' 
                : 'border-red-200 bg-red-50'
            }
            ${file.status === 'uploading' ? 'border-blue-200 bg-blue-50' : ''}
            ${file.status === 'completed' ? 'border-green-200 bg-green-50' : ''}
            ${file.status === 'error' ? 'border-red-200 bg-red-50' : ''}
        `}>
            {/* Remove button */}
            <button
                onClick={() => onRemove(file.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
                disabled={file.status === 'uploading'}
            >
                <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* File info */}
            <div className="flex items-start space-x-3">
                {/* File icon */}
                <div className={`
                    flex-shrink-0 p-2 rounded-lg
                    ${validation.isValid ? 'bg-blue-100' : 'bg-red-100'}
                `}>
                    <FileIcon className={`
                        w-6 h-6 
                        ${validation.isValid ? 'text-blue-600' : 'text-red-600'}
                    `} />
                </div>

                {/* File details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {file.file.name}
                        </p>
                        
                        {/* Status icon */}
                        {file.status === 'completed' && (
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        )}
                        {(file.status === 'error' || !validation.isValid) && (
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">
                        {formatFileSize(file.file.size)} • {file.file.type}
                    </p>

                    {/* Validation errors */}
                    {!validation.isValid && validation.errors.length > 0 && (
                        <div className="mt-2">
                            {validation.errors.map((error, index) => (
                                <p key={index} className="text-xs text-red-600">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Upload error */}
                    {file.status === 'error' && file.error && (
                        <p className="text-xs text-red-600 mt-1">
                            {file.error}
                        </p>
                    )}

                    {/* Upload progress */}
                    {file.status === 'uploading' && (
                        <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-blue-600">Uploading...</span>
                                <span className="text-xs text-blue-600">{file.progress}%</span>
                            </div>
                            <div className="w-full bg-blue-100 rounded-full h-1">
                                <div 
                                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${file.progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Completed status */}
                    {file.status === 'completed' && (
                        <p className="text-xs text-green-600 mt-1">
                            ✅ Upload completed successfully
                        </p>
                    )}
                </div>
            </div>

            {/* Image preview for image files */}
            {file.file.type.startsWith('image/') && validation.isValid && (
                <div className="mt-3">
                    <img
                        src={URL.createObjectURL(file.file)}
                        alt={file.file.name}
                        className="w-full h-32 object-cover rounded-md border"
                        onLoad={(e) => {
                            // Clean up object URL to prevent memory leaks
                            setTimeout(() => {
                                URL.revokeObjectURL((e.target as HTMLImageElement).src);
                            }, 1000);
                        }}
                    />
                </div>
            )}
        </div>
    );
}