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
exports.logoutAllDevices = exports.logoutSession = exports.getActiveSessions = void 0;
const session_utils_1 = require("../utils/session.utils");
const Api_utils_1 = require("../utils/Api.utils");
const logger_utils_1 = require("../utils/logger.utils");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
// ===== SESSION MANAGEMENT =====
/**
 * @desc    Get user's active sessions
 * @route   GET /api/sessions
 * @access  Private
 */
exports.getActiveSessions = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    if (!req.user) {
        logger_utils_1.logger.warn('Session access denied: User not authenticated', {
            ip: req.ip
        });
        throw new ApiError_1.ApiError(401, 'Authentication required');
    }
    const sessions = yield (0, session_utils_1.getUserActiveSessions)(req.user._id.toString());
    logger_utils_1.logger.info('User sessions retrieved', {
        userId: req.user._id,
        sessionCount: sessions.length,
        ip: req.ip
    });
    const formattedSessions = sessions.map((session) => {
        var _a;
        return ({
            sessionId: session.sessionId,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            deviceType: session.deviceType,
            lastActivity: session.lastActivity,
            createdAt: session.createdAt,
            isCurrent: session.sessionId === ((_a = req.sessionInfo) === null || _a === void 0 ? void 0 : _a.sessionId)
        });
    });
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, { sessions: formattedSessions }, 'Sessions retrieved successfully'));
}));
/**
 * @desc    Logout specific session
 * @route   DELETE /api/sessions/:sessionId
 * @access  Private
 */
exports.logoutSession = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const { sessionId } = req.params;
    if (!req.user) {
        logger_utils_1.logger.warn('Session logout denied: User not authenticated', {
            sessionId,
            ip: req.ip
        });
        throw new ApiError_1.ApiError(401, 'Authentication required');
    }
    const success = yield (0, session_utils_1.deactivateSession)(sessionId);
    if (!success) {
        logger_utils_1.logger.warn('Session logout failed: Session not found', {
            userId: req.user._id,
            sessionId,
            ip: req.ip
        });
        throw new ApiError_1.ApiError(404, 'Session not found');
    }
    logger_utils_1.logger.info('Session logged out successfully', {
        userId: req.user._id,
        sessionId,
        ip: req.ip
    });
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Session logged out successfully'));
}));
/**
 * @desc    Logout all devices except current
 * @route   DELETE /api/sessions
 * @access  Private
 */
exports.logoutAllDevices = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    if (!req.user) {
        logger_utils_1.logger.warn('Bulk session logout denied: User not authenticated', {
            ip: req.ip
        });
        throw new ApiError_1.ApiError(401, 'Authentication required');
    }
    const currentSessionId = (_a = req.sessionInfo) === null || _a === void 0 ? void 0 : _a.sessionId;
    const loggedOutCount = yield (0, session_utils_1.deactivateAllUserSessions)(req.user._id.toString(), currentSessionId);
    logger_utils_1.logger.info('Bulk session logout completed', {
        userId: req.user._id,
        loggedOutCount,
        currentSessionId,
        ip: req.ip
    });
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, { loggedOutCount }, `Logged out ${loggedOutCount} devices successfully`));
}));
//# sourceMappingURL=session.controllers.js.map