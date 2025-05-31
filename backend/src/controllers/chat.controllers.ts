import { Response, Request } from "express";
import { generateStreamToken } from "../lib/stream";

export function getStreamToken(req: Request, res: Response): Response | any {
    try {
        console.log('🎯 getStreamToken called');
        console.log('👤 User:', req.user);
        
        const user = (req as any).user; // Type assertion
        
        if (!user || !user._id) {
            console.log('❌ User not found in request');
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        const userId = user._id.toString();
        console.log('🔑 Generating token for user:', userId);
        
        const token = generateStreamToken(userId);
        
        if (!token) {
            console.log('❌ Failed to generate Stream token');
            return res.status(500).json({ 
                success: false, 
                message: "Failed to generate token" 
            });
        }

        console.log('✅ Stream token generated successfully');
        return res.status(200).json({ 
            success: true, 
            token 
        });
        
    } catch (error: any) {
        console.error("❌ Error in getStreamToken controller:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
}