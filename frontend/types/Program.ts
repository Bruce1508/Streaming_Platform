export interface Program {
    id: string;
    code: string;
    name: string;
    overview?: string;
    duration?: string;
    campus?: string[];
    delivery?: string;
    credential?: string;
    school?: string;
}

export interface ProgramsResponse {
    success: boolean;
    message: string;
    data: {
        programs: Program[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
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