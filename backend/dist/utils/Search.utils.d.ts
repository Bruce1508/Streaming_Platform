export declare const buildSearchQuery: (searchTerm: string, searchFields: string[]) => {
    $or?: undefined;
} | {
    $or: {
        [x: string]: RegExp;
    }[];
};
export declare const buildAdvancedSearchQuery: (filters: any) => any;
export declare const highlightSearchTerms: (text: string, searchTerm: string, className?: string) => string;
export declare const extractSearchSuggestions: (documents: any[], searchField: string, limit?: number) => string[];
export declare const calculateRelevanceScore: (document: any, searchTerm: string, weightedFields: {
    [key: string]: number;
}) => number;
export declare const searchMaterials: (Model: any, filters: any) => Promise<any>;
export declare const searchUsers: (Model: any, filters: any) => Promise<any>;
export declare const searchCourses: (Model: any, filters: any) => Promise<any>;
//# sourceMappingURL=Search.utils.d.ts.map