// backend/src/types/post.ts
export interface FileAttachment {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    size: number;
    mimetype: string;
    publicId: string; // For Cloudinary deletion
    uploadedAt: Date;
}

export interface Post {
    id: string;
    userId: string;
    content: string;
    attachments: FileAttachment[];
    likes: number;
    comments: number;
    shares: number;
    isPublic: boolean;
    tags: string[];
    language?: string; // For language learning posts
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    createdAt: Date;
    updatedAt: Date;
}

export interface CreatePostRequest {
    content: string;
    isPublic?: boolean;
    tags?: string[];
    language?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface CreatePostResponse {
    success: boolean;
    post: Post;
    message: string;
}