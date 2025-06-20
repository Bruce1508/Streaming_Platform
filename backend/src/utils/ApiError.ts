// utils/ApiError.ts
class ApiError extends Error {
    statusCode: number;
    data: any;
    success: boolean;
    errors: any[];

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: any[] = [],
        stack: string = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };

/*
✅ CÁCH SỬ DỤNG:

// Thay vì:
throw new Error("User not found");

// Dùng:
throw new ApiError(404, "User not found");
throw new ApiError(400, "Invalid email format");
throw new ApiError(403, "Access denied");
*/