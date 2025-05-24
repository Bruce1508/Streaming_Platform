import { Response, Request } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { upsertStreamUser } from "../lib/stream";

dotenv.config();

const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY!, { expiresIn: "7d" });
};

export async function signUp(req: Request, res: Response): Promise<Response|void|any> {
    try {
        const { email, password, fullName } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || ""
            });
        } catch (error) {
            console.log("Error creating Stream User:", error);
        }

        const token = generateToken(newUser._id.toString());

        const userResponse = {
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
            isOnboarded: newUser.isOnboarded,
            bio: newUser.bio,
            nativeLanguage: newUser.nativeLanguage,
            learningLanguage: newUser.learningLanguage,
            location: newUser.location
        };

        return res.status(201).json({ 
            success: true, 
            user: userResponse,
            token
        });

    } catch (error: any) {
        console.log("Error in SignUp:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function signIn(req: Request, res: Response): Promise<Response|void|any> {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(user._id.toString());

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

        return res.status(200).json({ 
            success: true, 
            user: userResponse,
            token 
        });

    } catch (error: any) {
        console.log("Error in signIn:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getMe(req: Request, res: Response): Promise<Response|void|any> {
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

export async function onBoarding(req: Request, res: Response): Promise<Response|void|any> {
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