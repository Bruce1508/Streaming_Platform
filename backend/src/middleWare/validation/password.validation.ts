import { Request, Response, NextFunction } from 'express';
import { checkPasswordBreach } from '../../utils/password.security';

export const passwordSecurityMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    
    if (!password) {
        return next(); // Let Joi validation handle missing password
    }

    try {
        // Check if password has been breached
        const isBreached = await checkPasswordBreach(password);
        
        if (isBreached) {
            return res.status(400).json({
                success: false,
                message: 'This password has been found in data breaches. Please choose a different password.',
                type: 'PASSWORD_BREACHED'
            });
        }

        next();
    } catch (error) {
        console.error('Password security check error:', error);
        next(); // Continue if security check fails
    }
};