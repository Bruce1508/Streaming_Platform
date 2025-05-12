import { Response, Request } from "express";
import { generateStreamToken } from "../lib/stream";

export function getStreamToken(res: Response, req: Request): Response | any {
    const userId = req.user._id;
    if (!userId) {
        return res.status(200).json({ message: "User not found" });
    }
    
        try {
            const token = generateStreamToken(userId);
            res.status(200).json({token});
        } catch (error: any) {
            console.log("Error in getStreamToken controller:", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    
}