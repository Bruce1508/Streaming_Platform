// backend/src/controllers/auth.controller.ts
import { Response, Request } from "express";
import User, { IUser } from "../models/User";
import dotenv from "dotenv";
import { createUserSession, deactivateSession } from "../utils/session.utils";
import { 
    generateTokenPair, 
    refreshAccessToken, 
    revokeAllTokensForSession,
    blacklistToken 
} from "../utils/jwt.enhanced";

dotenv.config();

type AuthenticatedRequest = Request & {
    user?: IUser;
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        let refreshTokenValue;

        // Get refresh token from body or cookie
        if (req.body.refreshToken) {
            refreshTokenValue = req.body.refreshToken;
        } else if (req.cookies?.refreshToken) {
            refreshTokenValue = req.cookies.refreshToken;
        }
        
        if (!refreshTokenValue) {
            res.status(400).json({
                success: false,
                message: "Refresh token is required"
            });
            return;
        }

        console.log('🔄 Processing token refresh request');

        // Use enhanced refresh function
        const newTokenPair = await refreshAccessToken(refreshTokenValue);
        
        if (!newTokenPair) {
            res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token. Please login again.",
                requireReauth: true
            });
            return;
        }

        // Set new tokens in cookies
        res.cookie("accessToken", newTokenPair.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", newTokenPair.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        console.log('✅ Token refresh successful');

        res.status(200).json({
            success: true,
            message: "Tokens refreshed successfully",
            data: {
                accessToken: newTokenPair.accessToken,
                refreshToken: newTokenPair.refreshToken,
                expiresIn: 15 * 60
            }
        });

    } catch (error: any) {
        console.error("❌ Token refresh error:", error);
        res.status(500).json({
            success: false,
            message: "Token refresh failed"
        });
    }
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            email, 
            password, 
            fullName,
            role = 'student'
        } = req.body;

        // ✅ EXISTING VALIDATION (keep as is)
        if (!email || !password || !fullName) {
            res.status(400).json({
                success: false,
                message: "Email, password, and full name are required"
            });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
            return;
        }

        // ✅ EXISTING USER DATA (keep as is)
        const userData = {
            email: email.toLowerCase().trim(),
            password,
            fullName: fullName.trim(),
            authProvider: "local",
            role: role || 'student',
            isOnboarded: false,
            isActive: true,
            isVerified: false,
            bio: "",
            location: "",
            website: "",
            profilePic: ""
        };

        const user = new User(userData);
        await user.save();

        // ✅ UPDATE LAST LOGIN (keep as is)
        await user.updateLastLogin();

        // ✅ CREATE SESSION (keep as is)
        const sessionId = await createUserSession(
            user._id.toString(),
            req,
            'password'
        );

        // 🆕 CHANGE: Generate token pair instead of single token
        const { accessToken, refreshToken } = generateTokenPair(
            user._id.toString(), 
            sessionId
        );

        // 🆕 CHANGE: Set both tokens in separate cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // 🆕 CHANGE: Updated response data
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    isOnboarded: user.isOnboarded,
                    isVerified: user.isVerified,
                    isActive: user.isActive,
                    profilePic: user.profilePic,
                    bio: user.bio,
                    location: user.location,
                    website: user.website,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt
                },
                // 🆕 Return both tokens for mobile apps
                accessToken,
                refreshToken,
                sessionId,
                expiresIn: 15 * 60 // Access token expires in 15 minutes
            }
        });

    } catch (error: any) {
        // ✅ EXISTING ERROR HANDLING (keep as is)
        console.error("Signup error:", error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
            return;
        }

        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Failed to create account. Please try again."
        });
    }
};

// controllers/auth.controllers.ts - UPDATED signIn
export const signIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // ✅ EXISTING VALIDATION (keep as is)
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }

        // ✅ EXISTING USER LOOKUP (keep as is)
        const user = await User.findOne({ email: email.toLowerCase().trim() })
            .select('+password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
            return;
        }

        // ✅ EXISTING VALIDATIONS (keep as is)
        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: "Account has been deactivated. Please contact support."
            });
            return;
        }

        if (user.authProvider !== "local") {
            res.status(400).json({
                success: false,
                message: `Please sign in with ${user.authProvider.charAt(0).toUpperCase() + user.authProvider.slice(1)}`
            });
            return;
        }

        // ✅ EXISTING PASSWORD VALIDATION (keep as is)
        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
            return;
        }

        // ✅ UPDATE LAST LOGIN (keep as is)
        await user.updateLastLogin();

        // ✅ CREATE SESSION (keep as is)
        const sessionId = await createUserSession(
            user._id.toString(),
            req,
            'password'
        );

        // 🆕 CHANGE: Generate token pair instead of single token
        const { accessToken, refreshToken } = generateTokenPair(
            user._id.toString(), 
            sessionId
        );

        // ✅ EXISTING LOGIN LOG (keep as is)
        console.log('✅ Successful login:', {
            userId: user._id,
            email: user.email,
            sessionId,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            timestamp: new Date()
        });

        // 🆕 CHANGE: Set both tokens in separate cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // 🆕 CHANGE: Updated response data
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    profilePic: user.profilePic,
                    isOnboarded: user.isOnboarded,
                    isVerified: user.isVerified,
                    isActive: user.isActive,
                    bio: user.bio,
                    location: user.location,
                    website: user.website,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt
                },
                // 🆕 Return both tokens for mobile apps
                accessToken,
                refreshToken,
                sessionId,
                expiresIn: 15 * 60 // Access token expires in 15 minutes
            }
        });

    } catch (error: any) {
        // ✅ EXISTING ERROR HANDLING (keep as is)
        console.error("Signin error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed. Please try again."
        });
    }
};

export async function getMe(req: Request, res: Response): Promise<Response | void | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const user = authReq.user;

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required" 
            });
        }

        // ✅ Base user response
        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            isOnboarded: user.isOnboarded,
            isVerified: user.isVerified,
            isActive: user.isActive,
            bio: user.bio,
            location: user.location,
            website: user.website,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        // ✅ Build response data conditionally
        const responseData: any = {
            user: userResponse
        };

        // ✅ Add session info separately if available
        if (req.sessionInfo) {
            responseData.session = {
                sessionId: req.sessionInfo.sessionId,
                lastActivity: req.sessionInfo.lastActivity,
                ipAddress: req.sessionInfo.ipAddress
            };
        }

        return res.status(200).json({ 
            success: true, 
            data: responseData
        });

    } catch (error: any) {
        console.error("Error in getMe:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch user profile" 
        });
    }
}

export async function onBoarding(req: Request, res: Response): Promise<Response | void | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const user = authReq.user;

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required" 
            });
        }

        const { 
            fullName, 
            bio, 
            location, 
            website,
            profilePic
        } = req.body;

        if (!fullName?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Full name is required"
            });
        }

        // ✅ Simple update data - clean and focused
        const updateData = {
            fullName: fullName.trim(),
            bio: bio?.trim() || "",
            location: location?.trim() || "",
            website: website?.trim() || "",
            profilePic: profilePic || user.profilePic,
            isOnboarded: true
        };

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        const userResponse = {
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            role: updatedUser.role,
            profilePic: updatedUser.profilePic,
            isOnboarded: updatedUser.isOnboarded,
            isVerified: updatedUser.isVerified,
            isActive: updatedUser.isActive,
            bio: updatedUser.bio,
            location: updatedUser.location,
            website: updatedUser.website,
            lastLogin: updatedUser.lastLogin,
            createdAt: updatedUser.createdAt
        };

        return res.status(200).json({
            success: true,
            message: "Onboarding completed successfully",
            data: {
                user: userResponse
            }
        });

    } catch (error: any) {
        console.error("Error in onBoarding:", error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "Failed to complete onboarding" 
        });
    }
}

export const oauth = async (req: Request, res: Response): Promise<void> => {
    try {
        const { provider, email, fullName, profilePic, providerId } = req.body;

        if (!email || !provider) {
            res.status(400).json({
                success: false,
                message: "Email and provider are required"
            });
            return;
        }

        let user = await User.findOne({ email: email.toLowerCase().trim() });

        if (user) {
            // ✅ Update existing user
            if (!user.profilePic && profilePic) {
                user.profilePic = profilePic;
            }
            
            if (user.authProvider === "local" && provider !== "local") {
                user.authProvider = provider as any;
                user.providerId = providerId;
            }
            
            await user.updateLastLogin();
            
        } else {
            // ✅ Create new user - clean data
            user = new User({
                email: email.toLowerCase().trim(),
                fullName: fullName || email.split('@')[0],
                profilePic: profilePic || "",
                authProvider: provider,
                providerId,
                role: 'student',
                isOnboarded: false,
                isActive: true,
                isVerified: false,
                bio: "",
                location: "",
                website: ""
            });

            await user.save();
            await user.updateLastLogin();
        }

        // 🆕 NEW: Create session for OAuth
        const sessionId = await createUserSession(
            user._id.toString(),
            req,
            'oauth' // ← OAuth login method
        );

        // 🆕 NEW: Generate token pair instead of single token
        const { accessToken, refreshToken } = generateTokenPair(
            user._id.toString(), 
            sessionId
        );

        console.log('✅ OAuth successful:', {
            userId: user._id,
            email: user.email,
            provider: provider,
            sessionId,
            tokenType: 'token_pair'
        });

        // 🆕 NEW: Set both tokens in separate cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // 🆕 NEW: Updated response with token pair
        res.status(200).json({
            success: true,
            message: "OAuth authentication successful",
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    profilePic: user.profilePic,
                    isOnboarded: user.isOnboarded,
                    isVerified: user.isVerified,
                    isActive: user.isActive,
                    bio: user.bio,
                    location: user.location,
                    website: user.website,
                    lastLogin: user.lastLogin,
                    authProvider: user.authProvider
                },
                // 🆕 Return both tokens for mobile apps
                accessToken,
                refreshToken,
                sessionId,
                expiresIn: 15 * 60, // Access token expires in 15 minutes
                loginMethod: 'oauth'
            }
        });

    } catch (error: any) {
        console.error("❌ OAuth error:", error);
        res.status(500).json({
            success: false,
            message: "OAuth authentication failed",
            error: process.env.NODE_ENV === 'development' ? error.message : "Authentication failed"
        });
    }
};

// controllers/auth.controllers.ts - ENHANCED logout
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        // ✅ EXISTING SESSION DEACTIVATION (keep as is)
        if (req.sessionInfo?.sessionId) {
            await deactivateSession(req.sessionInfo.sessionId);
            console.log('✅ Session deactivated:', {
                sessionId: req.sessionInfo.sessionId,
                userId: req.sessionInfo.userId,
                timestamp: new Date()
            });
        }

        // 🆕 ENHANCED: Revoke all tokens for session
        if (req.sessionInfo?.sessionId) {
            await revokeAllTokensForSession(req.sessionInfo.sessionId);
            console.log('✅ All tokens revoked for session:', req.sessionInfo.sessionId);
        }
        
        // 🆕 ENHANCED: Blacklist current tokens if available
        const accessToken = req.cookies?.accessToken || req.cookies?.token; // Support legacy
        const refreshTokenValue = req.cookies?.refreshToken;
        
        if (accessToken) {
            await blacklistToken(accessToken);
            console.log('✅ Access token blacklisted');
        }
        
        if (refreshTokenValue) {
            await blacklistToken(refreshTokenValue);
            console.log('✅ Refresh token blacklisted');
        }

        // 🆕 CHANGE: Clear all possible cookies (new + legacy)
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.clearCookie("token"); // Clean up legacy token
        
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error: any) {
        // ✅ EXISTING ERROR HANDLING (keep as is)
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<Response | void | any> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const user = authReq.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const { 
            fullName, 
            bio, 
            location, 
            website, 
            profilePic
        } = req.body;

        // ✅ Clean update data - only essential fields
        const updateData: any = {};
        
        if (fullName?.trim()) updateData.fullName = fullName.trim();
        if (bio !== undefined) updateData.bio = bio?.trim() || "";
        if (location !== undefined) updateData.location = location?.trim() || "";
        if (website !== undefined) updateData.website = website?.trim() || "";
        if (profilePic !== undefined) updateData.profilePic = profilePic || "";

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: {
                    _id: updatedUser._id,
                    fullName: updatedUser.fullName,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    profilePic: updatedUser.profilePic,
                    isOnboarded: updatedUser.isOnboarded,
                    isVerified: updatedUser.isVerified,
                    isActive: updatedUser.isActive,
                    bio: updatedUser.bio,
                    location: updatedUser.location,
                    website: updatedUser.website,
                    lastLogin: updatedUser.lastLogin,
                    updatedAt: updatedUser.updatedAt
                }
            }
        });

    } catch (error: any) {
        console.error("Error updating profile:", error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};