export interface Program {
    _id: string;
    name: string;
    code: string;
    school: {
        _id: string;
        name: string;
        code: string;
        type?: string;
        province?: string;
        website?: string;
    };
    level: 'Certificate' | 'Diploma' | 'Advanced Diploma' | 'Bachelor' | 'Graduate Certificate';
    duration: {
        semesters: number;
        years: number;
    };
    totalCredits: number;
    description?: string;
    requirements?: {
        academic?: string[];
        english?: string;
        other?: string[];
    };
    careerOutcomes?: string[];
    tuition?: {
        domestic?: number;
        international?: number;
        currency: string;
    };
    isActive: boolean;
    stats?: {
        enrollmentCount: number;
        graduationRate?: number;
        employmentRate?: number;
    };
    createdAt: string;
    updatedAt: string;
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
    level?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
//# sourceMappingURL=Program.d.ts.map