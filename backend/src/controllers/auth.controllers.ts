import { Response, Request } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { upsertStreamUser } from "../lib/stream";

dotenv.config();

// const generateToken = (userId: string): string => {
//     return jwt.sign({ userId }, process.env.JWT_SECRET_KEY!, { expiresIn: "7d" });
// };

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, fullName } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists"
            });
            return;
        }

        // Create new user
        const user = new User({
            email,
            password,
            fullName,
            authProvider: "local",
            isOnboarded: false
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                isOnboarded: user.isOnboarded
            },
            token
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }

        // Check if user registered with OAuth
        if (user.authProvider !== "local") {
            res.status(400).json({
                success: false,
                message: `Please sign in with ${user.authProvider}`
            });
            return;
        }

        // Check password for local users
        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                profilePic: user.profilePic,
                isOnboarded: user.isOnboarded,
                bio: user.bio,
                nativeLanguage: user.nativeLanguage,
                learningLanguage: user.learningLanguage,
                location: user.location
            },
            token
        });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export async function getMe(req: Request, res: Response): Promise<Response | void | any> {
    try {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            isOnboarded: user.isOnboarded,
            bio: user.bio,
            nativeLanguage: user.nativeLanguage,
            learningLanguage: user.learningLanguage,
            location: user.location
        };

        return res.status(200).json({ success: true, user: userResponse });
    } catch (error) {
        console.log("Error in getMe:", error);
        return res.status(500).json({ success: false, message: "Server error in auth.controller.ts" });
    }
}

export async function onBoarding(req: Request, res: Response): Promise<Response | void | any> {
    try {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { fullName, bio, nativeLanguage, learningLanguage, location, profilePic } = req.body;

        if (!fullName || !nativeLanguage || !learningLanguage) {
            return res.status(400).json({
                success: false,
                message: "Full name, native language, and learning language are required"
            });
        }

        if (nativeLanguage === learningLanguage) {
            return res.status(400).json({
                success: false,
                message: "Native and learning languages must be different"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                fullName: fullName.trim(),
                bio: bio?.trim() || "",
                nativeLanguage,
                learningLanguage,
                location: location?.trim() || "",
                profilePic: profilePic || user.profilePic,
                isOnboarded: true
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || ""
            });
        } catch (error) {
            console.log("Error updating Stream user:", error);
        }

        const userResponse = {
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic,
            isOnboarded: updatedUser.isOnboarded,
            bio: updatedUser.bio,
            nativeLanguage: updatedUser.nativeLanguage,
            learningLanguage: updatedUser.learningLanguage,
            location: updatedUser.location
        };

        return res.status(200).json({
            success: true,
            message: "Onboarding completed successfully",
            user: userResponse
        });

    } catch (error) {
        console.log("Error in onBoarding:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

interface OAuthRequest {
    provider: string;
    email: string;
    fullName?: string;
    profilePic?: string;
    providerId: string;
}

export const oauth = async (req: Request<{}, {}, OAuthRequest>, res: Response): Promise<void> => {
    try {
        const { provider, email, fullName, profilePic, providerId } = req.body;

        console.log("OAuth Request:", { provider, email, fullName });

        if (!email || !provider) {
            res.status(400).json({
                success: false,
                message: "Email and provider are required"
            });
            return;
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // Update existing user
            user.lastLogin = new Date();
            if (!user.profilePic && profilePic) {
                user.profilePic = profilePic;
            }
            // Update provider info if needed
            if (user.authProvider === "local" && provider !== "local") {
                user.authProvider = provider as any;
                user.providerId = providerId;
            }
            await user.save();
        } else {
            // Create new user with OAuth
            user = new User({
                email,
                fullName: fullName || email.split('@')[0],
                profilePic: profilePic || "",
                authProvider: provider,
                providerId,
                isOnboarded: false,
                lastLogin: new Date(),
                // Initialize other fields
                bio: "",
                nativeLanguage: "",
                learningLanguage: "",
                location: "",
                friends: []
            });

            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            message: "OAuth authentication successful",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                profilePic: user.profilePic,
                isOnboarded: user.isOnboarded,
                bio: user.bio,
                nativeLanguage: user.nativeLanguage,
                learningLanguage: user.learningLanguage,
                location: user.location
            },
            token
        });

        console.log("OAuth Request Body:", req.body);
        console.log("User found/created:", user);
        console.log("Token generated:", token);

    } catch (error) {
        console.error("OAuth error:", error);
        res.status(500).json({
            success: false,
            message: "OAuth authentication failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};