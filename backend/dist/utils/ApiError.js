"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
// utils/ApiError.ts
class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApiError = ApiError;
/*
✅ CÁCH SỬ DỤNG:

// Thay vì:
throw new Error("User not found");

// Dùng:
throw new ApiError(404, "User not found");
throw new ApiError(400, "Invalid email format");
throw new ApiError(403, "Access denied");
*/ 
//# sourceMappingURL=ApiError.js.map