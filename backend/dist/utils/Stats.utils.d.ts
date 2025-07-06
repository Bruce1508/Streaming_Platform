export declare const calculateBasicStats: (numbers: number[]) => {
    count: number;
    sum: number;
    mean: number;
    median: number;
    min: number;
    max: number;
    range: number;
} | null;
export declare const calculatePercentageChange: (oldValue: number, newValue: number) => number;
export declare const getUserStats: (UserModel: any, programId?: string) => Promise<any>;
export declare const getMaterialStats: (MaterialModel: any, courseId?: string) => Promise<any>;
export declare const getCourseStats: (CourseModel: any, EnrollmentModel: any, programId?: string) => Promise<any>;
export declare const getDashboardStats: (models: any) => Promise<any>;
export declare const getTrendingMaterials: (MaterialModel: any, days?: number, limit?: number) => Promise<any>;
export declare const getUserActivityStats: (models: any, userId: string, days?: number) => Promise<any>;
export declare const calculateGrowthMetrics: (Model: any, field?: string, periods?: number[]) => Promise<any>;
export declare const getTopPerformers: (models: any, metric?: string, limit?: number) => Promise<any>;
declare const _default: {
    calculateBasicStats: (numbers: number[]) => {
        count: number;
        sum: number;
        mean: number;
        median: number;
        min: number;
        max: number;
        range: number;
    } | null;
    calculatePercentageChange: (oldValue: number, newValue: number) => number;
    getUserStats: (UserModel: any, programId?: string) => Promise<any>;
    getMaterialStats: (MaterialModel: any, courseId?: string) => Promise<any>;
    getCourseStats: (CourseModel: any, EnrollmentModel: any, programId?: string) => Promise<any>;
    getDashboardStats: (models: any) => Promise<any>;
    getTrendingMaterials: (MaterialModel: any, days?: number, limit?: number) => Promise<any>;
    getUserActivityStats: (models: any, userId: string, days?: number) => Promise<any>;
    calculateGrowthMetrics: (Model: any, field?: string, periods?: number[]) => Promise<any>;
    getTopPerformers: (models: any, metric?: string, limit?: number) => Promise<any>;
};
export default _default;
//# sourceMappingURL=Stats.utils.d.ts.map