import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

//chỉ những người đã đăng nhập mới có thể truy cập vào các route được bảo vệ
export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<Response | any> => {
    //lấy JWT từ cookie của request
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        // Kiểm tra SECRET_KEY có tồn tại không
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            console.error("JWT_SECRET_KEY is not defined in environment variables");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const decoded_token = jwt.verify(token, secretKey) as { userId: string };
        if (
            !decoded_token ||
            !('userId' in decoded_token) ||
            typeof decoded_token !== 'object' ||
            typeof decoded_token.userId !== 'string'
        ) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        //tìm kiếm người dùng trong database và loại bỏ trường password khỏi kết quả trả về
        const user = await User.findById(decoded_token.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        (req as any).user = user;
        next();
    } catch (error: any) {
        console.log("Error in protectRoute middleware", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}