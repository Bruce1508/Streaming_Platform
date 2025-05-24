import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<Response|void|any> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix

        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as { userId: string };

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        (req as any).user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute:", error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};