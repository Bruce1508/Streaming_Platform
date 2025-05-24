import { Response, Request } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { upsertStreamUser } from "../lib/stream";
import mongoose from "mongoose";

dotenv.config();
interface IUser {
    _id: mongoose.Types.ObjectId;
    fullName: string;
    profilePic?: string;
    bio?: string;
    nativeLanguage?: string;
    learningLanguage?: string;
    location?: string;
    isOnboarded: boolean;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isValidEmail(email: string): boolean {
    return emailRegex.test(email);
};

export async function signUp(req: Request, res: Response): Promise <Response | any> {
    const { email, password, fullName } = req.body;

    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Passwords must be at least 6 characters" });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        //check if user is existed or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists, please use a diffrent one" });
        }

        const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        }) as IUser;

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || ""
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error: any) {
            console.log("Error creating Stream User: ", error);
        };

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET_KEY!,
            { expiresIn: "7d" }
        );

        if (!token) {
            return res.status(500).json({message: "Token not found"});
        }

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: false,
        });

        return res.status(201).json({ success: true, user: newUser });

    } catch (error: any) {
        console.log("Error in SignUp function: ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export async function signIn(req: Request, res: Response): Promise<Response | void | any> {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const checkedUser = await User.findOne({ email });
        if (!checkedUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await checkedUser.matchPassword(password);
        if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { userId: checkedUser._id },
            process.env.JWT_SECRET_KEY!,
            { expiresIn: "7d" }
        );

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: false,
        });

        return res.status(200).json({ success: true, checkedUser });

    } catch (error: any) {
        console.log("Error in login controller", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export function signOut(req: Request, res: Response): Response | any {
    res.clearCookie("jwt");
    return res.status(200).json({ success: true, message: "Logout successful" });
};

export async function onBoarding(req: Request, res: Response): Promise<Response | any> {
    // Kiểm tra nếu user không tồn tại
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - User not authenticated" });
        }
        const userId = req.user._id;
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                //hiển thị ra các trường bị thiếu
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean) //loại bỏ các giá trị false trong mảng
            });
        }

        //cập nhật thông tin người dùng trong MongoDB
        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true, //đánh dấu rằng người dùng đã hoàn thành quá trình onboarding
        }, { new: true }) as IUser; //phương thức sẽ trả về document đã được cập nhật


        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        //cập nhật user trong stream database
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            })

            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
        } catch (streamError: any) {
            console.log("Error updating Stream user during onboarding controller:", streamError.message);
        }

        return res.status(200).json({
            success: true,
            message: "Onboarding completely successfully",
            user: updatedUser
        });

    } catch (error: any) {
        console.error("Onboarding error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}


















