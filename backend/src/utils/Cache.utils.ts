// utils/cache.utils.ts
import { logger } from './logger.utils';

// In-memory cache (simple implementation)
class SimpleCache {
    private cache: Map<string, { data: any; expires: number }> = new Map();
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        // Clean expired entries every 5 minutes
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 5 * 60 * 1000);
    }

    set(key: string, data: any, ttlSeconds: number = 300): void {
        const expires = Date.now() + (ttlSeconds * 1000);
        this.cache.set(key, { data, expires });
    }

    get(key: string): any | null {
        const item = this.cache.get(key);
        
        if (!item) return null;
        
        if (Date.now() > item.expires) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    private cleanup(): void {
        const now = Date.now();
        let deletedCount = 0;

        for (const [key, item] of this.cache.entries()) {
            if (now > item.expires) {
                this.cache.delete(key);
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            logger.info(`Cache cleanup: ${deletedCount} expired entries removed`);
        }
    }

    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// Create cache instance
export const cache = new SimpleCache();

// Cache decorator for functions
export const withCache = (key: string, ttlSeconds: number = 300) => {
    return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
        const method = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const cacheKey = `${key}_${JSON.stringify(args)}`;
            
            // Try to get from cache
            const cached = cache.get(cacheKey);
            if (cached) {
                logger.debug(`Cache hit for key: ${cacheKey}`);
                return cached;
            }

            // Execute method and cache result
            const result = await method.apply(this, args);
            cache.set(cacheKey, result, ttlSeconds);
            
            logger.debug(`Cache set for key: ${cacheKey}`);
            return result;
        };
    };
};

// Generate cache key
export const generateCacheKey = (prefix: string, ...parts: any[]): string => {
    return `${prefix}:${parts.join(':')}`;
};

// Cache user data
export const cacheUser = (userId: string, userData: any, ttl: number = 900) => {
    const key = generateCacheKey('user', userId);
    cache.set(key, userData, ttl);
};

// Get cached user
export const getCachedUser = (userId: string): any | null => {
    const key = generateCacheKey('user', userId);
    return cache.get(key);
};

// Cache course data
export const cacheCourse = (courseId: string, courseData: any, ttl: number = 600) => {
    const key = generateCacheKey('course', courseId);
    cache.set(key, courseData, ttl);
};

// Get cached course
export const getCachedCourse = (courseId: string): any | null => {
    const key = generateCacheKey('course', courseId);
    return cache.get(key);
};

// Cache statistics
export const cacheStats = (statsType: string, data: any, ttl: number = 300) => {
    const key = generateCacheKey('stats', statsType);
    cache.set(key, data, ttl);
};

// Get cached statistics
export const getCachedStats = (statsType: string): any | null => {
    const key = generateCacheKey('stats', statsType);
    return cache.get(key);
};