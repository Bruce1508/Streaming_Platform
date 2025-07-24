import Redis from 'ioredis';
import { logger } from './logger.utils';
import dotenv from 'dotenv';

dotenv.config();

// ===== REDIS CONFIGURATION =====
let redis: Redis | null = null;
let isRedisConnected = false;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = parseInt(process.env.MAX_CONNECTION_ATTEMPTS!!);

// ✅ Initialize Redis with proper configuration
const initializeRedis = async (): Promise<void> => {
    try {
        const redisUrl = process.env.REDIS_URL!!;
        redis = new Redis(redisUrl, {
            lazyConnect: true,
            maxRetriesPerRequest: 3,
            connectTimeout: 5000,
            commandTimeout: 5000,
            enableOfflineQueue: false
        });

        // ✅ Event handlers
        redis.on('connect', () => {
            isRedisConnected = true;
            connectionAttempts = 0;
            logger.info('✅ Redis connected successfully');
        });

        redis.on('error', (error) => {
            isRedisConnected = false;
            connectionAttempts++;
            
            if (connectionAttempts <= MAX_CONNECTION_ATTEMPTS) {
                logger.warn(`⚠️ Redis connection error (attempt ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS}):`, error.message);
            } else {
                logger.error('❌ Redis connection failed after maximum attempts. Using memory cache fallback.');
            }
        });

        redis.on('close', () => {
            isRedisConnected = false;
            logger.warn('🔌 Redis connection closed');
        });

        redis.on('reconnecting', () => {
            logger.info('🔄 Redis reconnecting...');
        });

        // ✅ Try to connect
        await redis.connect();
        
    } catch (error: any) {
        isRedisConnected = false;
        logger.warn('⚠️ Redis initialization failed, using memory cache:', error.message);
        redis = null;
    }
};

// ===== MEMORY CACHE FALLBACK =====
interface MemoryCacheItem {
    data: any;
    expiry: number;
    size: number;
}

class MemoryCache {
    private cache = new Map<string, MemoryCacheItem>();
    private maxSize = 1000; // Maximum number of items
    private maxMemory = 50 * 1024 * 1024; // 50MB max memory
    private currentMemory = 0;

    // ✅ Get item with expiry check
    get(key: string): any | null {
        const item = this.cache.get(key);
        
        if (!item) return null;
        
        // Check expiry
        if (Date.now() > item.expiry) {
            this.delete(key);
            return null;
        }
        
        return item.data;
    }

    // ✅ Set item with TTL and memory management
    set(key: string, data: any, ttlSeconds: number): void {
        const dataString = JSON.stringify(data);
        const size = Buffer.byteLength(dataString, 'utf8');
        
        // Remove existing item if it exists
        if (this.cache.has(key)) {
            this.delete(key);
        }
        
        // Check memory limits
        if (this.currentMemory + size > this.maxMemory) {
            this.evictLRU();
        }
        
        // Check size limits
        if (this.cache.size >= this.maxSize) {
            this.evictLRU();
        }
        
        const item: MemoryCacheItem = {
            data,
            expiry: Date.now() + (ttlSeconds * 1000),
            size
        };
        
        this.cache.set(key, item);
        this.currentMemory += size;
    }

    // ✅ Delete item
    delete(key: string): boolean {
        const item = this.cache.get(key);
        if (item) {
            this.currentMemory -= item.size;
            return this.cache.delete(key);
        }
        return false;
    }

    // ✅ Evict least recently used items
    private evictLRU(): void {
        const entries = Array.from(this.cache.entries());
        // Sort by expiry time (oldest first)
        entries.sort((a, b) => a[1].expiry - b[1].expiry);
        
        // Remove oldest 10% of items
        const toRemove = Math.max(1, Math.floor(entries.length * 0.1));
        for (let i = 0; i < toRemove && entries.length > 0; i++) {
            const [key] = entries[i];
            this.delete(key);
        }
    }

    // ✅ Clear all items
    clear(): void {
        this.cache.clear();
        this.currentMemory = 0;
    }

    // ✅ Get cache stats
    getStats() {
        return {
            itemCount: this.cache.size,
            memoryUsage: this.currentMemory,
            maxMemory: this.maxMemory,
            maxSize: this.maxSize
        };
    }
}

const memoryCache = new MemoryCache();

// ===== UNIFIED CACHE INTERFACE =====
export const cache = {
    // ✅ Enhanced get with fallback
    async get(key: string): Promise<any | null> {
        // Try Redis first
        if (isRedisConnected && redis) {
            try {
                const result = await redis.get(key);
                if (result) {
                    return JSON.parse(result);
                }
            } catch (error) {
                logger.warn('Redis get error, using memory cache:', error);
                isRedisConnected = false;
            }
        }
        
        // Fallback to memory cache
        return memoryCache.get(key);
    },

    // ✅ Enhanced set with fallback
    async set(key: string, value: any, ttlSeconds: number = 300): Promise<boolean> {
        const serialized = JSON.stringify(value);
        
        // Try Redis first
        if (isRedisConnected && redis) {
            try {
                await redis.setex(key, ttlSeconds, serialized);
                // Also cache in memory for faster access
                memoryCache.set(key, value, Math.min(ttlSeconds, 300));
                return true;
            } catch (error) {
                logger.warn('Redis set error, using memory cache:', error);
                isRedisConnected = false;
            }
        }
        
        // Fallback to memory cache
        memoryCache.set(key, value, ttlSeconds);
        return true;
    },

    // ✅ Enhanced delete with fallback
    async del(key: string): Promise<boolean> {
        let redisDeleted = false;
        
        // Try Redis first
        if (isRedisConnected && redis) {
            try {
                await redis.del(key);
                redisDeleted = true;
            } catch (error) {
                logger.warn('Redis delete error:', error);
                isRedisConnected = false;
            }
        }
        
        // Always delete from memory cache
        const memoryDeleted = memoryCache.delete(key);
        
        return redisDeleted || memoryDeleted;
    },

    // ✅ Clear all cache
    async clear(): Promise<void> {
        if (isRedisConnected && redis) {
            try {
                await redis.flushdb();
            } catch (error) {
                logger.warn('Redis clear error:', error);
            }
        }
        memoryCache.clear();
    },

    // ✅ Cache statistics
    async getStats() {
        const memStats = memoryCache.getStats();
        let redisStats = null;
        
        if (isRedisConnected && redis) {
            try {
                const info = await redis.info('memory');
                redisStats = { connected: true, info };
            } catch {
                redisStats = { connected: false };
            }
        }
        
        return {
            memory: memStats,
            redis: redisStats,
            isRedisConnected
        };
    }
};

// ===== UTILITY FUNCTIONS =====
export const generateCacheKey = (...parts: string[]): string => {
    return parts.join(':');
};

// ✅ High-level cache functions with consistent interface
export const cacheUser = async (userId: string, userData: any, ttl: number = 3600): Promise<void> => {
    await cache.set(generateCacheKey('user', userId), userData, ttl);
};

export const getCachedUser = async (userId: string): Promise<any | null> => {
    return await cache.get(generateCacheKey('user', userId));
};

export const clearUserCache = async (userId: string): Promise<void> => {
    await cache.del(generateCacheKey('user', userId));
};

export const cacheCourse = async (courseId: string, courseData: any, ttl: number = 1800): Promise<void> => {
    await cache.set(generateCacheKey('course', courseId), courseData, ttl);
};

export const getCachedCourse = async (courseId: string): Promise<any | null> => {
    return await cache.get(generateCacheKey('course', courseId));
};

export const cacheStats = async (key: string, statsData: any, ttl: number = 300): Promise<void> => {
    await cache.set(generateCacheKey('stats', key), statsData, ttl);
};

export const getCachedStats = async (key: string): Promise<any | null> => {
    return await cache.get(generateCacheKey('stats', key));
};

// ===== SCHOOL CACHE FUNCTIONS =====
export const cacheSchools = async (key: string, schoolData: any, ttl: number = 300): Promise<void> => {
    await cache.set(generateCacheKey('schools', key), schoolData, ttl);
};

export const getCachedSchools = async (key: string): Promise<any | null> => {
    return await cache.get(generateCacheKey('schools', key));
};

export const clearSchoolCache = async (schoolId?: string): Promise<void> => {
    if (schoolId) {
        await cache.del(generateCacheKey('schools', schoolId));
    }
    // Could implement pattern-based clearing if needed
};

// ===== PROGRAM CACHE FUNCTIONS =====
export const cachePrograms = async (key: string, programData: any, ttl: number = 300): Promise<void> => {
    await cache.set(generateCacheKey('programs', key), programData, ttl);
};

export const getCachedPrograms = async (key: string): Promise<any | null> => {
    return await cache.get(generateCacheKey('programs', key));
};

export const clearProgramCache = async (programId?: string): Promise<void> => {
    if (programId) {
        await cache.del(generateCacheKey('programs', programId));
    }
    // Could implement pattern-based clearing if needed
};

// ✅ Generic cache wrapper for functions
export const withCache = async <T>(
    key: string, 
    fn: () => Promise<T>, 
    ttl: number = 300
): Promise<T> => {
    // Try to get cached result
    const cached = await cache.get(key);
    if (cached !== null) {
        return cached as T;
    }
    
    // Execute function and cache result
    const result = await fn();
    await cache.set(key, result, ttl);
    return result;
};

// ===== INITIALIZATION =====
// Initialize Redis connection (non-blocking)
initializeRedis().catch(() => {
    logger.info('🔄 Cache system started with memory fallback');
});

// ===== EXPORT STATUS =====
export const getCacheStatus = () => ({
    redis: isRedisConnected,
    memory: true,
    type: isRedisConnected ? 'Redis + Memory' : 'Memory Only'
});

logger.info('🚀 Cache system initialized');