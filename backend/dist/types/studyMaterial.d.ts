export interface StudyMaterialFilter {
    category?: string;
    language?: string;
    level?: string;
    tags?: string[];
    author?: string;
    status?: 'draft' | 'published' | 'archived';
    isPublic?: boolean;
}
export interface StudyMaterialSort {
    field: 'recent' | 'popular' | 'rating' | 'views' | 'saves';
    order: 'asc' | 'desc';
}
export interface PaginationOptions {
    page: number;
    limit: number;
}
export interface StudyMaterialQuery extends PaginationOptions {
    filter?: StudyMaterialFilter;
    sort?: StudyMaterialSort;
    search?: string;
}
export interface CategoryStats {
    _id: string;
    count: number;
    avgRating: number;
    totalViews: number;
}
//# sourceMappingURL=studyMaterial.d.ts.map