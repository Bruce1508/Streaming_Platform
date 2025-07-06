"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheStatus = exports.withCache = exports.clearProgramCache = exports.getCachedPrograms = exports.cachePrograms = exports.clearSchoolCache = exports.getCachedSchools = exports.cacheSchools = exports.getCachedStats = exports.cacheStats = exports.getCachedCourse = exports.cacheCourse = exports.clearUserCache = exports.getCachedUser = exports.cacheUser = exports.generateCacheKey = exports.cache = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_utils_1 = require("./logger.utils");
// ===== REDIS CONFIGURATION =====
let redis = null;
let isRedisConnected = false;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;
// ✅ Initialize Redis with proper configuration
const initializeRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        redis = new ioredis_1.default(redisUrl, {
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
            logger_utils_1.logger.info('✅ Redis connected successfully');
        });
        redis.on('error', (error) => {
            isRedisConnected = false;
            connectionAttempts++;
            if (connectionAttempts <= MAX_CONNECTION_ATTEMPTS) {
                logger_utils_1.logger.warn(`⚠️ Redis connection error (attempt ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS}):`, error.message);
            }
            else {
                logger_utils_1.logger.error('❌ Redis connection failed after maximum attempts. Using memory cache fallback.');
            }
        });
        redis.on('close', () => {
            isRedisConnected = false;
            logger_utils_1.logger.warn('🔌 Redis connection closed');
        });
        redis.on('reconnecting', () => {
            logger_utils_1.logger.info('🔄 Redis reconnecting...');
        });
        // ✅ Try to connect
        yield redis.connect();
    }
    catch (error) {
        isRedisConnected = false;
        logger_utils_1.logger.warn('⚠️ Redis initialization failed, using memory cache:', error.message);
        redis = null;
    }
});
class MemoryCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 1000; // Maximum number of items
        this.maxMemory = 50 * 1024 * 1024; // 50MB max memory
        this.currentMemory = 0;
    }
    // ✅ Get item with expiry check
    get(key) {
        const item = this.cache.get(key);
        if (!item)
            return null;
        // Check expiry
        if (Date.now() > item.expiry) {
            this.delete(key);
            return null;
        }
        return item.data;
    }
    // ✅ Set item with TTL and memory management
    set(key, data, ttlSeconds) {
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
        const item = {
            data,
            expiry: Date.now() + (ttlSeconds * 1000),
            size
        };
        this.cache.set(key, item);
        this.currentMemory += size;
    }
    // ✅ Delete item
    delete(key) {
        const item = this.cache.get(key);
        if (item) {
            this.currentMemory -= item.size;
            return this.cache.delete(key);
        }
        return false;
    }
    // ✅ Evict least recently used items
    evictLRU() {
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
    clear() {
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
exports.cache = {
    // ✅ Enhanced get with fallback
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // Try Redis first
            if (isRedisConnected && redis) {
                try {
                    const result = yield redis.get(key);
                    if (result) {
                        return JSON.parse(result);
                    }
                }
                catch (error) {
                    logger_utils_1.logger.warn('Redis get error, using memory cache:', error);
                    isRedisConnected = false;
                }
            }
            // Fallback to memory cache
            return memoryCache.get(key);
        });
    },
    // ✅ Enhanced set with fallback
    set(key_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (key, value, ttlSeconds = 300) {
            const serialized = JSON.stringify(value);
            // Try Redis first
            if (isRedisConnected && redis) {
                try {
                    yield redis.setex(key, ttlSeconds, serialized);
                    // Also cache in memory for faster access
                    memoryCache.set(key, value, Math.min(ttlSeconds, 300));
                    return true;
                }
                catch (error) {
                    logger_utils_1.logger.warn('Redis set error, using memory cache:', error);
                    isRedisConnected = false;
                }
            }
            // Fallback to memory cache
            memoryCache.set(key, value, ttlSeconds);
            return true;
        });
    },
    // ✅ Enhanced delete with fallback
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let redisDeleted = false;
            // Try Redis first
            if (isRedisConnected && redis) {
                try {
                    yield redis.del(key);
                    redisDeleted = true;
                }
                catch (error) {
                    logger_utils_1.logger.warn('Redis delete error:', error);
                    isRedisConnected = false;
                }
            }
            // Always delete from memory cache
            const memoryDeleted = memoryCache.delete(key);
            return redisDeleted || memoryDeleted;
        });
    },
    // ✅ Clear all cache
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            if (isRedisConnected && redis) {
                try {
                    yield redis.flushdb();
                }
                catch (error) {
                    logger_utils_1.logger.warn('Redis clear error:', error);
                }
            }
            memoryCache.clear();
        });
    },
    // ✅ Cache statistics
    getStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const memStats = memoryCache.getStats();
            let redisStats = null;
            if (isRedisConnected && redis) {
                try {
                    const info = yield redis.info('memory');
                    redisStats = { connected: true, info };
                }
                catch (_a) {
                    redisStats = { connected: false };
                }
            }
            return {
                memory: memStats,
                redis: redisStats,
                isRedisConnected
            };
        });
    }
};
// ===== UTILITY FUNCTIONS =====
const generateCacheKey = (...parts) => {
    return parts.join(':');
};
exports.generateCacheKey = generateCacheKey;
// ✅ High-level cache functions with consistent interface
const cacheUser = (userId_1, userData_1, ...args_1) => __awaiter(void 0, [userId_1, userData_1, ...args_1], void 0, function* (userId, userData, ttl = 3600) {
    yield exports.cache.set((0, exports.generateCacheKey)('user', userId), userData, ttl);
});
exports.cacheUser = cacheUser;
const getCachedUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.cache.get((0, exports.generateCacheKey)('user', userId));
});
exports.getCachedUser = getCachedUser;
const clearUserCache = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.cache.del((0, exports.generateCacheKey)('user', userId));
});
exports.clearUserCache = clearUserCache;
const cacheCourse = (courseId_1, courseData_1, ...args_1) => __awaiter(void 0, [courseId_1, courseData_1, ...args_1], void 0, function* (courseId, courseData, ttl = 1800) {
    yield exports.cache.set((0, exports.generateCacheKey)('course', courseId), courseData, ttl);
});
exports.cacheCourse = cacheCourse;
const getCachedCourse = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.cache.get((0, exports.generateCacheKey)('course', courseId));
});
exports.getCachedCourse = getCachedCourse;
const cacheStats = (key_1, statsData_1, ...args_1) => __awaiter(void 0, [key_1, statsData_1, ...args_1], void 0, function* (key, statsData, ttl = 300) {
    yield exports.cache.set((0, exports.generateCacheKey)('stats', key), statsData, ttl);
});
exports.cacheStats = cacheStats;
const getCachedStats = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.cache.get((0, exports.generateCacheKey)('stats', key));
});
exports.getCachedStats = getCachedStats;
// ===== SCHOOL CACHE FUNCTIONS =====
const cacheSchools = (key_1, schoolData_1, ...args_1) => __awaiter(void 0, [key_1, schoolData_1, ...args_1], void 0, function* (key, schoolData, ttl = 300) {
    yield exports.cache.set((0, exports.generateCacheKey)('schools', key), schoolData, ttl);
});
exports.cacheSchools = cacheSchools;
const getCachedSchools = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.cache.get((0, exports.generateCacheKey)('schools', key));
});
exports.getCachedSchools = getCachedSchools;
const clearSchoolCache = (schoolId) => __awaiter(void 0, void 0, void 0, function* () {
    if (schoolId) {
        yield exports.cache.del((0, exports.generateCacheKey)('schools', schoolId));
    }
    // Could implement pattern-based clearing if needed
});
exports.clearSchoolCache = clearSchoolCache;
// ===== PROGRAM CACHE FUNCTIONS =====
const cachePrograms = (key_1, programData_1, ...args_1) => __awaiter(void 0, [key_1, programData_1, ...args_1], void 0, function* (key, programData, ttl = 300) {
    yield exports.cache.set((0, exports.generateCacheKey)('programs', key), programData, ttl);
});
exports.cachePrograms = cachePrograms;
const getCachedPrograms = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.cache.get((0, exports.generateCacheKey)('programs', key));
});
exports.getCachedPrograms = getCachedPrograms;
const clearProgramCache = (programId) => __awaiter(void 0, void 0, void 0, function* () {
    if (programId) {
        yield exports.cache.del((0, exports.generateCacheKey)('programs', programId));
    }
    // Could implement pattern-based clearing if needed
});
exports.clearProgramCache = clearProgramCache;
// ✅ Generic cache wrapper for functions
const withCache = (key_1, fn_1, ...args_1) => __awaiter(void 0, [key_1, fn_1, ...args_1], void 0, function* (key, fn, ttl = 300) {
    // Try to get cached result
    const cached = yield exports.cache.get(key);
    if (cached !== null) {
        return cached;
    }
    // Execute function and cache result
    const result = yield fn();
    yield exports.cache.set(key, result, ttl);
    return result;
});
exports.withCache = withCache;
// ===== INITIALIZATION =====
// Initialize Redis connection (non-blocking)
initializeRedis().catch(() => {
    logger_utils_1.logger.info('🔄 Cache system started with memory fallback');
});
// ===== EXPORT STATUS =====
const getCacheStatus = () => ({
    redis: isRedisConnected,
    memory: true,
    type: isRedisConnected ? 'Redis + Memory' : 'Memory Only'
});
exports.getCacheStatus = getCacheStatus;
logger_utils_1.logger.info('🚀 Cache system initialized');
//# sourceMappingURL=Cache.utils.js.map