import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<Response|void|any> => {
    try {
        const authHeader = req.headers.authorization;
        console.log("🔐 Full auth header:", authHeader);
        console.log("🔐 Headers object:", req.headers);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("❌ Invalid auth header format");
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix
        console.log("🔑 Extracted token length:", token.length);
        console.log("🔑 Token preview:", token.substring(0, 20) + "...");

        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as { userId: string };
        console.log("✅ Token decoded:", decoded);

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