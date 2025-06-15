export interface Material {
    _id: string;
    title: string;
    description: string;
    category: string;
    language: string;
    level: string;
    tags: string[];
    attachments: Array<{
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        uploadedAt: string;
    }>;
    author: {
        _id: string;
        fullName: string;
        profilePic?: string;
    };
    views: number;
    saves: number;
    averageRating: number;
    totalRatings: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMaterialData {
    title: string;
    description: string;
    category: string;
    language: string;
    level: string;
    tags: string[];
    attachments: string[]; // Array of file IDs from upload
}

export interface MaterialFilters {
    search?: string;
    category?: string;
    language?: string;
    level?: string;
    page?: number;
    limit?: number;
}

export interface UseMaterialsReturn {
    materials: Material[];
    loading: boolean;
    error: string | null;
    fetchMaterials: (filters?: MaterialFilters) => Promise<void>;
    refetch: () => Promise<void>;
}