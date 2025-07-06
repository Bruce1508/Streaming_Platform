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
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalSessionValidation = exports.validateSessionMiddleware = exports.createSessionMiddleware = void 0;
const session_utils_1 = require("../utils/session.utils");
const UserSession_1 = require("../models/UserSession");
// Add session creation to login flow
const createSessionMiddleware = (loginMethod = 'password') => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // This runs AFTER successful authentication
            if (res.locals.userId) {
                const sessionId = yield (0, session_utils_1.createUserSession)(res.locals.userId, req, loginMethod);
                res.locals.sessionId = sessionId;
                console.log('✅ Session created:', { sessionId, userId: res.locals.userId });
            }
            next();
        }
        catch (error) {
            console.error('Session creation error:', error);
            // Don't fail the request, just log error
            next();
        }
    });
};
exports.createSessionMiddleware = createSessionMiddleware;
// Validate session middleware
const validateSessionMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = req.headers['x-session-id'];
        if (!sessionId) {
            return next(); // Skip validation if no session ID
        }
        // Get full session from database
        const session = yield UserSession_1.UserSession.findOne({
            sessionId,
            isActive: true
        });
        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired session',
                type: 'SESSION_INVALID'
            });
        }
        // Update last activity
        session.lastActivity = new Date();
        yield session.save();
        // ✅ Set complete sessionInfo object
        req.sessionInfo = {
            userId: session.userId.toString(),
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
        next(); // Fail open
    }
});
exports.validateSessionMiddleware = validateSessionMiddleware;
// Optional session validation (doesn't fail if no session)
const optionalSessionValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = req.headers['x-session-id'];
        if (!sessionId) {
            return next(); // No session, continue
        }
        // Get session from database
        const session = yield UserSession_1.UserSession.findOne({
            sessionId,
            isActive: true
        });
        if (session) {
            // Update activity
            session.lastActivity = new Date();
            yield session.save();
            // ✅ Set complete sessionInfo object
            req.sessionInfo = {
                userId: session.userId.toString(),
                sessionId: session.sessionId,
                ipAddress: session.ipAddress,
                userAgent: session.userAgent,
                isActive: session.isActive,
                lastActivity: session.lastActivity
            };
        }
        next();
    }
    catch (error) {
        console.error('Optional session validation error:', error);
        next(); // Continue without session
    }
});
exports.optionalSessionValidation = optionalSessionValidation;
//# sourceMappingURL=session.middleware.js.map