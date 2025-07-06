import { Request } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiResponse } from './ApiResponse';
export declare const createPaginatedResponse: <T>(data: T[], total: number, page: number, limit: number, message?: string) => ApiResponse;
export declare const extractPagination: (req: Request) => {
    page: number;
    limit: number;
    skip: number;
};
export declare const extractSortOptions: (req: Request, defaultSort?: any) => any;
export declare const extractSearchFilter: (req: Request, searchFields: string[]) => {
    $or?: undefined;
} | {
    $or: {
        [x: string]: {
            $regex: string;
            $options: string;
        };
    }[];
};
export declare const buildMongoQuery: (req: Request, allowedFilters?: string[]) => any;
export declare const logApiRequest: (req: AuthRequest) => void;
export declare const generateApiKey: () => string;
//# sourceMappingURL=Api.utils.d.ts.map