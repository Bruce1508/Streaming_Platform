// components/ui/upload/FileUpload.tsx

'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUpload } from '@/hooks/useUpload';
import { FilePreview } from './FilePreview';
import { ProgressBar } from './ProgressBar';
import { cn } from '@/lib/utils';
import {
    Upload,
    File,
    AlertCircle,
    CheckCircle2,
    Loader2,
    X,
    FileText,
    Image
} from 'lucide-react';
import { Button } from './Button';
import { Alert, AlertDescription } from './Alert';

interface FileUploadProps {
    onUploadComplete?: (uploadedFiles: any[]) => void;
    maxFiles?: number;
    className?: string;
}

export function FileUpload({
    onUploadComplete,
    maxFiles = 10,
    className
}: FileUploadProps) {
    const {
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
    } = useUpload();

    const [uploadStep, setUploadStep] = useState<'select' | 'preview' | 'uploading' | 'complete'>('select');

    const isValidFile = (file: File): { isValid: boolean; errors: string[] } => {
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

        const errors: string[] = [];

        if (file.size > maxSize) {
            errors.push(`File too large (max 10MB, current: ${(file.size / (1024 * 1024)).toFixed(1)}MB)`);
        }

        if (!allowedTypes.includes(file.type)) {
            errors.push(`File type not supported (${file.type})`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    // Handle file drop/select
    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        console.log('Accepted files:', acceptedFiles);
        console.log('Rejected files:', rejectedFiles);

        // Check total file limit
        if (files.length + acceptedFiles.length > maxFiles) {
            alert(`Maximum ${maxFiles} files allowed. Currently have ${files.length} files.`);
            return;
        }

        // Additional validation for accepted files (size check)
        const validFiles: File[] = [];
        const invalidFiles: { file: File; errors: string[] }[] = [];

        acceptedFiles.forEach(file => {
            const validation = isValidFile(file);
            if (validation.isValid) {
                validFiles.push(file);
            } else {
                invalidFiles.push({ file, errors: validation.errors });
            }
        });

        // Show validation errors if any
        if (invalidFiles.length > 0) {
            console.warn('Invalid files detected:', invalidFiles);

            // Optional: Show detailed error message
            const errorMessage = invalidFiles.map(({ file, errors }) =>
                `${file.name}: ${errors.join(', ')}`
            ).join('\n');

            alert(`Some files were rejected:\n${errorMessage}`);
        }

        // Add valid files
        if (validFiles.length > 0) {
            addFiles(validFiles);
            setUploadStep('preview');
        } else if (acceptedFiles.length > 0) {
            // All files were invalid
            alert('No valid files to add. Please check file size and type requirements.');
        }
    }, [addFiles, files.length, maxFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        maxFiles,
        maxSize: 10 * 1024 * 1024, // 10MB limit
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/gif': ['.gif'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt']
        },
        onDropRejected: (rejectedFiles) => {
            console.log('Rejected by dropzone:', rejectedFiles);

            const rejectionReasons = rejectedFiles.map(({ file, errors }) => {
                const reasons = errors.map(error => {
                    switch (error.code) {
                        case 'file-too-large':
                            return 'File too large (max 10MB)';
                        case 'file-invalid-type':
                            return 'Invalid file type';
                        case 'too-many-files':
                            return 'Too many files';
                        default:
                            return error.message;
                    }
                });
                return `${file.name}: ${reasons.join(', ')}`;
            }).join('\n');

            alert(`Files rejected:\n${rejectionReasons}`);
        }
    });

    // Handle upload process
    const handleUpload = async () => {
        try {
            setUploadStep('uploading');
            const results = await uploadAllFiles();
            setUploadStep('complete');
            onUploadComplete?.(results || []);
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadStep('preview');
        }
    };

    // Reset to initial state
    const handleReset = () => {
        reset();
        setUploadStep('select');
    };

    const stats = getStats();

    return (
        <div className={cn('w-full max-w-4xl mx-auto', className)}>
            {/* Step 1: File Selection */}
            {uploadStep === 'select' && (
                <div className="space-y-4">
                    <div
                        {...getRootProps()}
                        className={cn(
                            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                            isDragActive
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                        )}
                    >
                        <input {...getInputProps()} />

                        <div className="flex flex-col items-center space-y-4">
                            <Upload className={cn(
                                'w-12 h-12',
                                isDragActive ? 'text-blue-500' : 'text-gray-400'
                            )} />

                            <div>
                                <p className="text-lg font-medium text-gray-900">
                                    {isDragActive
                                        ? 'Drop files here...'
                                        : 'Upload your study materials'
                                    }
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Drag & drop files or click to browse
                                </p>
                            </div>

                            <div className="text-xs text-gray-400 space-y-1">
                                <p>Supported: PDF, Images (JPG, PNG, GIF), Word docs, Text files</p>
                                <p>Max file size: 10MB • Max files: {maxFiles}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Upload Button */}
                    <div className="text-center">
                        <Button
                            variant="outline"
                            onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                        >
                            <File className="w-4 h-4 mr-2" />
                            Choose Files
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2: Preview & Confirm */}
            {uploadStep === 'preview' && (
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Review Files ({stats.total})
                            </h3>
                            <p className="text-sm text-gray-500">
                                {stats.valid} valid • {stats.invalid} invalid • {stats.totalSizeFormatted}
                            </p>
                        </div>

                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setUploadStep('select')}
                            >
                                Add More
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleReset}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Clear All
                            </Button>
                        </div>
                    </div>

                    {/* File Previews */}
                    <div className="space-y-4">
                        {files.map((file) => (
                            <FilePreview
                                key={file.id}
                                file={file}
                                onRemove={removeFile}
                            />
                        ))}
                    </div>

                    {/* Upload Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-500">
                            {stats.valid > 0
                                ? `Ready to upload ${stats.valid} file${stats.valid > 1 ? 's' : ''}`
                                : 'No valid files to upload'
                            }
                        </div>

                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setUploadStep('select')}
                            >
                                Back
                            </Button>

                            <Button
                                onClick={handleUpload}
                                disabled={stats.valid === 0}
                                className="px-6"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload {stats.valid} File{stats.valid > 1 ? 's' : ''}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Uploading */}
            {uploadStep === 'uploading' && (
                <div className="space-y-6">
                    <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Uploading Files...
                            </h3>
                            <p className="text-sm text-gray-500">
                                Please don't close this window
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="max-w-md mx-auto">
                            <ProgressBar
                                progress={progress}
                                variant="default"
                                size="md"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Complete */}
            {uploadStep === 'complete' && (
                <div className="text-center py-4">
                    <p className="text-green-600 font-medium">
                        ✅ Files uploaded successfully! Scroll down to see details.
                    </p>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}