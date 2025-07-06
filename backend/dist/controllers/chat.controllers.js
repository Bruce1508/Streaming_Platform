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
exports.getStreamToken = void 0;
const stream_1 = require("../lib/stream");
const Api_utils_1 = require("../utils/Api.utils");
const logger_utils_1 = require("../utils/logger.utils");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
// ===== STREAM TOKEN GENERATION =====
exports.getStreamToken = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    const user = req.user;
    if (!user || !user._id) {
        logger_utils_1.logger.warn('Stream token request failed: User not authenticated', {
            userId: user === null || user === void 0 ? void 0 : user._id,
            ip: req.ip
        });
        throw new ApiError_1.ApiError(401, "User not authenticated");
    }
    const userId = user._id.toString();
    logger_utils_1.logger.info('Generating stream token', {
        userId,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    const token = (0, stream_1.generateStreamToken)(userId);
    if (!token) {
        logger_utils_1.logger.error('Failed to generate stream token', {
            userId,
            ip: req.ip
        });
        throw new ApiError_1.ApiError(500, "Failed to generate token");
    }
    logger_utils_1.logger.info('Stream token generated successfully', {
        userId,
        ip: req.ip
    });
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, { token }, 'Stream token generated successfully'));
}));
//# sourceMappingURL=chat.controllers.js.map