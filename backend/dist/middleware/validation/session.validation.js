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
exports.validateSession = exports.createSession = void 0;
const UserSession_1 = require("../../models/UserSession");
const crypto_1 = require("crypto");
const mongoose_1 = __importDefault(require("mongoose"));
// Create new session
const createSession = (userId, req) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = (0, crypto_1.randomBytes)(32).toString('hex');
    // Limit concurrent sessions (max 5 per user)
    const activeSessions = yield UserSession_1.UserSession.countDocuments({
        userId: new mongoose_1.default.Types.ObjectId(userId), // ← Fix: Convert string to ObjectId
        isActive: true
    });
    if (activeSessions >= 5) {
        // Deactivate oldest session
        const oldestSession = yield UserSession_1.UserSession.findOne({
            userId: new mongoose_1.default.Types.ObjectId(userId), // ← Fix: Convert string to ObjectId
            isActive: true
        }).sort({ lastActivity: 1 });
        if (oldestSession) {
            oldestSession.isActive = false;
            yield oldestSession.save();
        }
    }
    // Create new session
    yield UserSession_1.UserSession.create({
        userId: new mongoose_1.default.Types.ObjectId(userId), // ← Fix: Convert string to ObjectId
        sessionId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'Unknown'
    });
    return sessionId;
});
exports.createSession = createSession;
// Validate session middleware
const validateSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = req.headers['x-session-id'];
        if (!sessionId) {
            return next(); // Let auth middleware handle missing session
        }
        const session = yield UserSession_1.UserSession.findOne({
            sessionId,
            isActive: true
        });
        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Invalid session',
                type: 'SESSION_INVALID'
            });
        }
        // Update last activity
        session.lastActivity = new Date();
        yield session.save();
        // ✅ Fix: Convert Mongoose document to plain object với correct types
        req.sessionInfo = {
            userId: session.userId.toString(), // Convert ObjectId to string
            sessionId: session.sessionId,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            isActive: session.isActive,
            lastActivity: session.lastActivity
        };
        next();
    }
    catch (error) {
        console.error('Session validation error:', error);
        next(); // Continue without session info
    }
});
exports.validateSession = validateSession;
// 🎯 Mục đích: Fix TypeScript validation errors
// ✅ validateSession() - Check session exists
// ✅ createSession() - Create new session  
// ✅ Handle ObjectId conversion issues
//# sourceMappingURL=session.validation.js.map