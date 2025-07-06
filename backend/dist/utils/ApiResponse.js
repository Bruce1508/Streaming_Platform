"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
// utils/ApiResponse.ts
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
exports.ApiResponse = ApiResponse;
/*
✅ CÁCH SỬ DỤNG:

// Thay vì:
res.status(200).json({ users: userData });

// Dùng:
res.status(200).json(
    new ApiResponse(200, userData, "Users retrieved successfully")
);

// Response sẽ có format:
{
    "statusCode": 200,
    "data": [...],
    "message": "Users retrieved successfully",
    "success": true
}
*/ 
//# sourceMappingURL=ApiResponse.js.map