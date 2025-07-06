export declare const cache: {
    get(key: string): Promise<any | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<boolean>;
    del(key: string): Promise<boolean>;
    clear(): Promise<void>;
    getStats(): Promise<{
        memory: {
            itemCount: number;
            memoryUsage: number;
            maxMemory: number;
            maxSize: number;
        };
        redis: {
            connected: boolean;
            info: string;
        } | {
            connected: boolean;
            info?: undefined;
        } | null;
        isRedisConnected: boolean;
    }>;
};
export declare const generateCacheKey: (...parts: string[]) => string;
export declare const cacheUser: (userId: string, userData: any, ttl?: number) => Promise<void>;
export declare const getCachedUser: (userId: string) => Promise<any | null>;
export declare const clearUserCache: (userId: string) => Promise<void>;
export declare const cacheCourse: (courseId: string, courseData: any, ttl?: number) => Promise<void>;
export declare const getCachedCourse: (courseId: string) => Promise<any | null>;
export declare const cacheStats: (key: string, statsData: any, ttl?: number) => Promise<void>;
export declare const getCachedStats: (key: string) => Promise<any | null>;
export declare const cacheSchools: (key: string, schoolData: any, ttl?: number) => Promise<void>;
export declare const getCachedSchools: (key: string) => Promise<any | null>;
export declare const clearSchoolCache: (schoolId?: string) => Promise<void>;
export declare const cachePrograms: (key: string, programData: any, ttl?: number) => Promise<void>;
export declare const getCachedPrograms: (key: string) => Promise<any | null>;
export declare const clearProgramCache: (programId?: string) => Promise<void>;
export declare const withCache: <T>(key: string, fn: () => Promise<T>, ttl?: number) => Promise<T>;
export declare const getCacheStatus: () => {
    redis: boolean;
    memory: boolean;
    type: string;
};
//# sourceMappingURL=Cache.utils.d.ts.map