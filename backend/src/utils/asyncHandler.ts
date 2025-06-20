// utils/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => Promise<any>;

const asyncHandler = (fn: AsyncFunction) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export { asyncHandler };

/*
✅ CÁCH SỬ DỤNG:

// Thay vì viết try-catch trong mỗi function:
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// Dùng asyncHandler:
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find();
    res.status(200).json(new ApiResponse(200, users, "Users retrieved"));
});
*/