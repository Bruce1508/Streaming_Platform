export interface Program {
    _id: string; // MongoDB ObjectId
    programId: string;
    code: string;
    name: string;
    overview: string;
    duration: string;
    campus: string[];
    delivery?: string;
    credential: string;
    school: string;
    level: string;
    isActive: boolean;
    stats: {
        enrollmentCount: number;
        graduationRate?: number;
        employmentRate?: number;
    };
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface ProgramsResponse {
    success: boolean;
    message: string;
    data: {
        data: Program[]; // API trả về data.data chứa array programs
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
            nextPage: number | null;
            prevPage: number | null;
        };
    };
}

export interface ProgramQuery {
    page?: number;
    limit?: number;
    search?: string;
    school?: string;
    credential?: string;
    delivery?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ProgramLevelsResponse {
    success: boolean;
    message: string;
    data: {
        levels: string[];
    };
} 