// backend/src/controllers/auth.controller.ts
import { Response, Request } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createUserSession, deactivateSession } from "../utils/session.utils";

dotenv.config();

type AuthenticatedRequest = Request & {
    user?: IUser;
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            email, 
            password, 
            fullName,
            role = 'student'
        } = req.body;

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

        // ✅ Clean user data - only essential fields
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

        // ✅ Generate JWT token
        const token = user.generateAuthToken();

        // ✅ Update last login
        await user.updateLastLogin();

        // ✅ Create user session
        const sessionId = await createUserSession(
            user._id.toString(),
            req,
            'password'
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

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
                token,
                sessionId
            }
        });

    } catch (error: any) {
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

export const signIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }

        // ✅ Simple user lookup - no complex population
        const user = await User.findOne({ email: email.toLowerCase().trim() })
            .select('+password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
            return;
        }

        // ✅ Check if account is active
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

        // ✅ Validate password
        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
            return;
        }

        // ✅ Update last login
        await user.updateLastLogin();

        // ✅ Generate JWT token
        const token = user.generateAuthToken();

        // ✅ Create user session
        const sessionId = await createUserSession(
            user._id.toString(),
            req,
            'password'
        );

        console.log('✅ Successful login:', {
            userId: user._id,
            email: user.email,
            sessionId,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            timestamp: new Date()
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

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
                token,
                sessionId
            }
        });

    } catch (error: any) {
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

        // ✅ Generate token
        const token = user.generateAuthToken();

        // ✅ Create session for OAuth
        const sessionId = await createUserSession(
            user._id.toString(),
            req,
            'oauth'
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

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
                    lastLogin: user.lastLogin
                },
                token,
                sessionId
            }
        });

    } catch (error: any) {
        console.error("OAuth error:", error);
        res.status(500).json({
            success: false,
            message: "OAuth authentication failed",
            error: process.env.NODE_ENV === 'development' ? error.message : "Authentication failed"
        });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        // ✅ Deactivate session if session info is available
        if (req.sessionInfo?.sessionId) {
            await deactivateSession(req.sessionInfo.sessionId);
            console.log('✅ Session deactivated:', {
                sessionId: req.sessionInfo.sessionId,
                userId: req.sessionInfo.userId,
                timestamp: new Date()
            });
        }

        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error: any) {
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