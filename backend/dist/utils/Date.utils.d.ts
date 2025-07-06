export declare const formatDate: (date: Date | string, format?: "short" | "long" | "iso") => string;
export declare const timeAgo: (date: Date | string) => string;
export declare const isValidDate: (date: any) => boolean;
export declare const addDays: (date: Date, days: number) => Date;
export declare const getDateRange: (period: string) => {
    start: Date;
    end: Date;
};
//# sourceMappingURL=Date.utils.d.ts.map