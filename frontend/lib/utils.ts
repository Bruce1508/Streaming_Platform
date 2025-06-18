import { MAX_FILE_SIZE, SUPPORTED_TYPES } from "@/types/Upload";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
interface CapitalizeFunction {
    (str: string): string;
}

export const capitialize: CapitalizeFunction = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// 📋 Validate file before upload
export const validateFile = (file: File): string | null => {
    if (!SUPPORTED_TYPES.includes(file.type)) {
        return 'Unsupported file type. Supported: PDF, Images, Word documents, Text files';
    }

    if (file.size > MAX_FILE_SIZE) {
        return 'File size exceeds 10MB limit';
    }

    if (file.size === 0) {
        return 'Empty file not allowed';
    }

    return null;
};

// 📊 Get file info
export const getFileInfo = (file: File) => {
    return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        category: file.type.startsWith('image/') ? 'image' :
            file.type === 'application/pdf' ? 'pdf' : 'document',
        sizeFormatted: formatFileSize(file.size)
    };
};

// 📏 Format file size
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 📂 Get file category
export const getFileCategory = (file: File): 'image' | 'pdf' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    return 'document';
};

// 🔍 Check if file type is supported
export const isSupportedFileType = (file: File): boolean => {
    return SUPPORTED_TYPES.includes(file.type);
};

// 📋 Get supported file types for display
export const getSupportedFileTypes = () => ({
    types: SUPPORTED_TYPES,
    extensions: ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx', '.txt'],
    maxSize: MAX_FILE_SIZE,
    maxSizeFormatted: formatFileSize(MAX_FILE_SIZE)
});



export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}