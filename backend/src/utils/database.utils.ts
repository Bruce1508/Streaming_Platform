// utils/database.utils.ts
import mongoose from 'mongoose';
import { logger } from './logger.utils';

// Database connection utility
export const connectDatabase = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URL!!;
        
        const conn = await mongoose.connect(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        logger.info(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error('Database connection failed:', error);
        process.exit(1);
    }
};

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
    try {
        const state = mongoose.connection.readyState;
        return state === 1; // 1 = connected
    } catch (error) {
        logger.error('Database health check failed:', error);
        return false;
    }
};

// Get database statistics
export const getDatabaseStats = async () => {
    try {
        const db = mongoose.connection.db!;
        const stats = await db.stats();
        
        return {
            collections: stats.collections,
            dataSize: stats.dataSize,
            storageSize: stats.storageSize,
            indexes: stats.indexes,
            indexSize: stats.indexSize
        };
    } catch (error) {
        logger.error('Failed to get database stats:', error);
        return null;
    }
};

// Clean expired documents
export const cleanExpiredDocuments = async () => {
    try {
        // Clean expired sessions
        const Session = mongoose.model('Session');
        const expiredSessions = await Session.deleteMany({
            expiresAt: { $lt: new Date() }
        });

        // Clean expired tokens
        const Token = mongoose.model('Token');
        const expiredTokens = await Token.deleteMany({
            expiresAt: { $lt: new Date() }
        });

        logger.info('Cleaned expired documents:', {
            sessions: expiredSessions.deletedCount,
            tokens: expiredTokens.deletedCount
        });

        return {
            sessionsDeleted: expiredSessions.deletedCount,
            tokensDeleted: expiredTokens.deletedCount
        };
    } catch (error) {
        logger.error('Failed to clean expired documents:', error);
        return null;
    }
};

// Create database indexes
export const createIndexes = async () => {
    try {
        // Create indexes based on schema definitions
        await mongoose.model('User').createIndexes();
        await mongoose.model('Material').createIndexes();

        logger.info('Database indexes created successfully');
    } catch (error) {
        logger.error('Failed to create indexes:', error);
    }
};