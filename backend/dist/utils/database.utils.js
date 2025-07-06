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
exports.createIndexes = exports.cleanExpiredDocuments = exports.getDatabaseStats = exports.checkDatabaseHealth = exports.connectDatabase = void 0;
// utils/database.utils.ts
const mongoose_1 = __importDefault(require("mongoose"));
const logger_utils_1 = require("./logger.utils");
// Database connection utility
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/studybuddy';
        const conn = yield mongoose_1.default.connect(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        logger_utils_1.logger.info(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        logger_utils_1.logger.error('Database connection failed:', error);
        process.exit(1);
    }
});
exports.connectDatabase = connectDatabase;
// Database health check
const checkDatabaseHealth = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const state = mongoose_1.default.connection.readyState;
        return state === 1; // 1 = connected
    }
    catch (error) {
        logger_utils_1.logger.error('Database health check failed:', error);
        return false;
    }
});
exports.checkDatabaseHealth = checkDatabaseHealth;
// Get database statistics
const getDatabaseStats = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = mongoose_1.default.connection.db;
        const stats = yield db.stats();
        return {
            collections: stats.collections,
            dataSize: stats.dataSize,
            storageSize: stats.storageSize,
            indexes: stats.indexes,
            indexSize: stats.indexSize
        };
    }
    catch (error) {
        logger_utils_1.logger.error('Failed to get database stats:', error);
        return null;
    }
});
exports.getDatabaseStats = getDatabaseStats;
// Clean expired documents
const cleanExpiredDocuments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clean expired sessions
        const Session = mongoose_1.default.model('Session');
        const expiredSessions = yield Session.deleteMany({
            expiresAt: { $lt: new Date() }
        });
        // Clean expired tokens
        const Token = mongoose_1.default.model('Token');
        const expiredTokens = yield Token.deleteMany({
            expiresAt: { $lt: new Date() }
        });
        logger_utils_1.logger.info('Cleaned expired documents:', {
            sessions: expiredSessions.deletedCount,
            tokens: expiredTokens.deletedCount
        });
        return {
            sessionsDeleted: expiredSessions.deletedCount,
            tokensDeleted: expiredTokens.deletedCount
        };
    }
    catch (error) {
        logger_utils_1.logger.error('Failed to clean expired documents:', error);
        return null;
    }
});
exports.cleanExpiredDocuments = cleanExpiredDocuments;
// Create database indexes
const createIndexes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create indexes based on schema definitions
        yield mongoose_1.default.model('User').createIndexes();
        yield mongoose_1.default.model('Material').createIndexes();
        logger_utils_1.logger.info('Database indexes created successfully');
    }
    catch (error) {
        logger_utils_1.logger.error('Failed to create indexes:', error);
    }
});
exports.createIndexes = createIndexes;
//# sourceMappingURL=database.utils.js.map