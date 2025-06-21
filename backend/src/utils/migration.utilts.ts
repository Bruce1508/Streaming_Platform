import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createUserSession } from "./session.utils";
import { generateTokenPair } from "./jwt.enhanced";

export const migrateLegacyToken = async (req: Request, res: Response) => {
    const legacyToken = req.cookies?.token;
    
    if (legacyToken) {
        try {
            const decoded = jwt.verify(legacyToken, process.env.JWT_SECRET_KEY!) as any;
            
            // Create session for legacy token
            const sessionId = await createUserSession(
                decoded.userId,
                req,
                'migration'
            );
            
            // Generate new token pair
            const { accessToken, refreshToken } = generateTokenPair(
                decoded.userId,
                sessionId
            );
            
            // Set new cookies
            res.cookie("accessToken", accessToken, { /* options */ });
            res.cookie("refreshToken", refreshToken, { /* options */ });
            res.clearCookie("token"); // Remove legacy
            
            console.log('✅ Migrated legacy token to token pair for user:', decoded.userId);
            
        } catch (error) {
            console.log('❌ Legacy token migration failed:', error);
        }
    }
};