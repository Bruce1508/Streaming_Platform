// utils/ApiResponse.ts
class ApiResponse {
    statusCode: number;
    data: any;
    message: string;
    success: boolean;

    constructor(statusCode: number, data: any, message: string = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };

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