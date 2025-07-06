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
exports.deactivateAllUserSessions = exports.deactivateSession = exports.getUserActiveSessions = exports.validateUserSession = exports.createUserSession = exports.detectDeviceType = exports.generateSessionId = void 0;
// utils/session.utils.ts - Session helper functions
const crypto_1 = require("crypto");
const UserSession_1 = require("../models/UserSession");
// Generate unique session ID
const generateSessionId = () => {
    return (0, crypto_1.randomBytes)(32).toString('hex');
};
exports.generateSessionId = generateSessionId;
// Detect device type from user agent
const detectDeviceType = (userAgent) => {
    const ua = userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
        return 'mobile';
    }
    else if (/tablet|ipad|kindle|silk/i.test(ua)) {
        return 'tablet';
    }
    else if (/chrome|firefox|safari|edge|opera/i.test(ua)) {
        return 'desktop';
    }
    return 'unknown';
};
exports.detectDeviceType = detectDeviceType;
// Create new session
const createUserSession = (userId_1, req_1, ...args_1) => __awaiter(void 0, [userId_1, req_1, ...args_1], void 0, function* (userId, req, loginMethod = 'password') {
    const sessionId = (0, exports.generateSessionId)();
    const userAgent = req.headers['user-agent'] || 'Unknown';
    // Check current active sessions
    const activeSessions = yield UserSession_1.UserSession.countDocuments({
        userId,
        isActive: true
    });
    // Limit to 5 concurrent sessions
    if (activeSessions >= 5) {
        // Deactivate oldest session
        yield UserSession_1.UserSession.deactivateOldestSession(userId);
    }
    // Create new session
    yield UserSession_1.UserSession.create({
        userId,
        sessionId,
        ipAddress: req.ip,
        userAgent,
        deviceType: (0, exports.detectDeviceType)(userAgent),
        loginMethod,
        isActive: true,
        lastActivity: new Date()
    });
    return sessionId;
});
exports.createUserSession = createUserSession;
// Validate session
const validateUserSession = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield UserSession_1.UserSession.findOne({
        sessionId,
        isActive: true
    });
    if (!session) {
        return false;
    }
    // Update activity
    yield session.updateActivity();
    return true;
});
exports.validateUserSession = validateUserSession;
// Get user's active sessions
const getUserActiveSessions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield UserSession_1.UserSession.findActiveSessions(userId);
});
exports.getUserActiveSessions = getUserActiveSessions;
// Deactivate session
const deactivateSession = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield UserSession_1.UserSession.findOne({ sessionId });
    if (!session) {
        return false;
    }
    yield session.deactivate();
    return true;
});
exports.deactivateSession = deactivateSession;
// Deactivate all user sessions except current
const deactivateAllUserSessions = (userId, exceptSessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        userId,
        isActive: true
    };
    if (exceptSessionId) {
        filter.sessionId = { $ne: exceptSessionId };
    }
    const result = yield UserSession_1.UserSession.updateMany(filter, { isActive: false });
    return result.modifiedCount;
});
exports.deactivateAllUserSessions = deactivateAllUserSessions;
//# sourceMappingURL=session.utils.js.map