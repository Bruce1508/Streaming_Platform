// components/ui/upload/FilePreview.tsx

'use client';

import { FileWithPreview } from '@/hooks/useUpload';
import { cn } from '@/lib/utils';
import { 
    FileText, 
    Image as ImageIcon, 
    FileType, 
    X, 
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import Image from 'next/image';

interface FilePreviewProps {
    file: FileWithPreview;
    onRemove: (fileId: string) => void;
    className?: string;
    showRemoveButton?: boolean;
}

export function FilePreview({ 
    file, 
    onRemove, 
    className,
    showRemoveButton = true 
}: FilePreviewProps) {
    const getFileIcon = () => {
        switch (file.info.category) {
            case 'image':
                return <ImageIcon className="w-6 h-6 text-blue-500" />;
            case 'pdf':
                return <FileType className="w-6 h-6 text-red-500" />;
            default:
                return <FileText className="w-6 h-6 text-gray-500" />;
        }
    };

    const getStatusIcon = () => {
        if (file.validation.isValid) {
            return <CheckCircle className="w-4 h-4 text-green-500" />;
        } else {
            return <AlertCircle className="w-4 h-4 text-red-500" />;
        }
    };

    return (
        <div className={cn(
            'relative group border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow',
            file.validation.isValid ? 'border-gray-200' : 'border-red-200 bg-red-50',
            className
        )}>
            {/* Remove Button */}
            {showRemoveButton && (
                <button
                    onClick={() => onRemove(file.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                    title="Remove file"
                >
                    <X className="w-3 h-3" />
                </button>
            )}

            <div className="flex items-start space-x-3">
                {/* File Preview/Icon */}
                <div className="flex-shrink-0">
                    {file.info.category === 'image' && file.preview ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                            <Image
                                src={file.preview}
                                alt={file.info.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            {getFileIcon()}
                        </div>
                    )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                        {getStatusIcon()}
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                            {file.info.name}
                        </h4>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center space-x-4">
                            <span>{file.info.sizeFormatted}</span>
                            <span className="capitalize">{file.info.category}</span>
                        </div>
                        
                        {file.validation.error && (
                            <div className="text-red-600 font-medium">
                                {file.validation.error}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* File Type Badge */}
            <div className="absolute top-2 right-2">
                <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    file.info.category === 'image' && 'bg-blue-100 text-blue-800',
                    file.info.category === 'pdf' && 'bg-red-100 text-red-800',
                    file.info.category === 'document' && 'bg-gray-100 text-gray-800'
                )}>
                    {file.info.type.split('/')[1]?.toUpperCase() || 'FILE'}
                </span>
            </div>
        </div>
    );
}

// Grid view for multiple files
interface FilePreviewGridProps {
    files: FileWithPreview[];
    onRemove: (fileId: string) => void;
    className?: string;
}

export function FilePreviewGrid({ files, onRemove, className }: FilePreviewGridProps) {
    if (files.length === 0) {
        return null;
    }

    return (
        <div className={cn(
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
            className
        )}>
            {files.map((file) => (
                <FilePreview
                    key={file.id}
                    file={file}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}