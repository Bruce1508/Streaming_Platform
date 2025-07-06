export declare const connectDatabase: () => Promise<void>;
export declare const checkDatabaseHealth: () => Promise<boolean>;
export declare const getDatabaseStats: () => Promise<{
    collections: any;
    dataSize: any;
    storageSize: any;
    indexes: any;
    indexSize: any;
} | null>;
export declare const cleanExpiredDocuments: () => Promise<{
    sessionsDeleted: number;
    tokensDeleted: number;
} | null>;
export declare const createIndexes: () => Promise<void>;
//# sourceMappingURL=database.utils.d.ts.map