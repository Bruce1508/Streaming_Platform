// backend/src/controllers/auth.controller.ts
import { Response, Request } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
            role = 'student',
            studentId,
            school,
            program
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

        // ✅ Create user data với all required fields
        const userData: any = {
            email: email.toLowerCase().trim(),
            password,
            fullName: fullName.trim(),
            authProvider: "local",
            role: role || 'student',
            isOnboarded: false,
            isActive: true,
            isVerified: false,
            
            // ✅ Initialize academic fields
            ...(role === 'student' && {
                academic: {
                    ...(studentId && { studentId: studentId.toUpperCase().trim() }),
                    ...(school && { school }),
                    ...(program && { program }),
                    status: 'active',
                    completedCourses: []
                }
            }),

            // ✅ Initialize all required collections
            savedMaterials: [],
            uploadedMaterials: [],
            friends: [],
            preferredLanguages: [],
            
            // ✅ Initialize currentLevel Map
            currentLevel: new Map(),
            
            // ✅ StudyStats will be initialized by schema defaults
            // ✅ Preferences will be initialized by schema defaults
            // ✅ Activity will be initialized by schema defaults
        };

        const user = new User(userData);
        await user.save();

        // ✅ Use instance method from model
        const token = user.generateAuthToken();

        // ✅ Use instance method from model
        await user.updateLastLogin();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                isOnboarded: user.isOnboarded,
                isVerified: user.isVerified,
                profilePic: user.profilePic,
                bio: user.bio,
                academic: user.academic,
                contributionLevel: user.contributionLevel, // ✅ Virtual field
                academicInfo: user.academicInfo, // ✅ Virtual field
            },
            token
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

        // ✅ Find user với proper population
        const user = await User.findOne({ email: email.toLowerCase().trim() })
            .select('+password')
            .populate('academic.school', 'name location')
            .populate('academic.program', 'name code');

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

        // ✅ Use instance method from model
        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
            return;
        }

        // ✅ Use instance method from model
        await user.updateLastLogin();

        // ✅ Use instance method from model
        const token = user.generateAuthToken();

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
                role: user.role,
                profilePic: user.profilePic,
                isOnboarded: user.isOnboarded,
                isVerified: user.isVerified,
                isActive: user.isActive,
                bio: user.bio,
                location: user.location,
                website: user.website,
                nativeLanguage: user.nativeLanguage, // ✅ Existing field from model
                learningLanguage: user.learningLanguage, // ✅ Existing field from model
                academic: user.academic,
                academicInfo: user.academicInfo, // ✅ Virtual field
                contributionLevel: user.contributionLevel, // ✅ Virtual field
                preferences: user.preferences,
                activity: user.activity,
                studyStats: user.studyStats,
                preferredLanguages: user.preferredLanguages, // ✅ Existing field
                lastLogin: user.lastLogin
            },
            token
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

        // ✅ Populate với proper paths
        await user.populate([
            { path: 'academic.school', select: 'name location' },
            { path: 'academic.program', select: 'name code' },
            { path: 'savedMaterials', select: 'title category createdAt', options: { limit: 10 } }
        ]);

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
            nativeLanguage: user.nativeLanguage,
            learningLanguage: user.learningLanguage,
            academic: user.academic,
            academicInfo: user.academicInfo, // ✅ Virtual field
            contributionLevel: user.contributionLevel, // ✅ Virtual field
            preferences: user.preferences,
            activity: user.activity,
            studyStats: user.studyStats,
            preferredLanguages: user.preferredLanguages,
            savedMaterialsCount: user.savedMaterials.length,
            uploadedMaterialsCount: user.uploadedMaterials.length,
            friendsCount: user.friends.length,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        };

        return res.status(200).json({ 
            success: true, 
            user: userResponse 
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
            profilePic,
            nativeLanguage, // ✅ Keep existing language fields
            learningLanguage, // ✅ Keep existing language fields
            preferredLanguages,
            // Academic onboarding fields
            studentId,
            school,
            program,
            currentSemester,
            enrollmentYear,
            // Preferences
            theme = 'system',
            notifications = {
                email: true,
                push: true,
                newMaterials: true,
                courseUpdates: true
            }
        } = req.body;

        if (!fullName?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Full name is required"
            });
        }

        // ✅ Academic validation for students
        if (user.role === 'student' && (!school || !program)) {
            return res.status(400).json({
                success: false,
                message: "School and program are required for students"
            });
        }

        const updateData: any = {
            fullName: fullName.trim(),
            bio: bio?.trim() || "",
            location: location?.trim() || "",
            website: website?.trim() || "",
            profilePic: profilePic || user.profilePic,
            isOnboarded: true,
            
            // ✅ Keep existing language fields
            nativeLanguage: nativeLanguage || user.nativeLanguage,
            learningLanguage: learningLanguage || user.learningLanguage,
            preferredLanguages: preferredLanguages || user.preferredLanguages,
            
            // ✅ Update preferences
            preferences: {
                theme,
                notifications,
                privacy: user.preferences?.privacy || {
                    showProfile: true,
                    showActivity: false
                }
            }
        };

        // ✅ Update academic info for students
        if (user.role === 'student') {
            updateData.academic = {
                ...(user.academic || {}),
                ...(studentId && { studentId: studentId.toUpperCase().trim() }),
                school,
                program,
                ...(currentSemester && { currentSemester: parseInt(currentSemester) }),
                ...(enrollmentYear && { enrollmentYear: parseInt(enrollmentYear) }),
                status: 'active',
                completedCourses: user.academic?.completedCourses || []
            };
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            updateData,
            { new: true, runValidators: true }
        ).populate([
            { path: 'academic.school', select: 'name location' },
            { path: 'academic.program', select: 'name code' }
        ]);

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
            bio: updatedUser.bio,
            location: updatedUser.location,
            website: updatedUser.website,
            nativeLanguage: updatedUser.nativeLanguage,
            learningLanguage: updatedUser.learningLanguage,
            academic: updatedUser.academic,
            academicInfo: updatedUser.academicInfo, // ✅ Virtual field
            contributionLevel: updatedUser.contributionLevel, // ✅ Virtual field
            preferences: updatedUser.preferences
        };

        return res.status(200).json({
            success: true,
            message: "Onboarding completed successfully",
            user: userResponse
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

        if (!email || !provider) {
            res.status(400).json({
                success: false,
                message: "Email and provider are required"
            });
            return;
        }

        let user = await User.findOne({ email: email.toLowerCase().trim() });

        if (user) {
            if (!user.profilePic && profilePic) {
                user.profilePic = profilePic;
            }
            
            if (user.authProvider === "local" && provider !== "local") {
                user.authProvider = provider as any;
                user.providerId = providerId;
            }
            
            // ✅ Use instance method
            await user.updateLastLogin();
            
        } else {
            // ✅ Create new user với all required fields
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
                website: "",
                nativeLanguage: "",
                learningLanguage: "",
                
                // ✅ Initialize collections
                savedMaterials: [],
                uploadedMaterials: [],
                friends: [],
                preferredLanguages: [],
                currentLevel: new Map()
            });

            await user.save();
            await user.updateLastLogin();
        }

        // ✅ Use instance method
        const token = user.generateAuthToken();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "OAuth authentication successful",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                profilePic: user.profilePic,
                isOnboarded: user.isOnboarded,
                isVerified: user.isVerified,
                bio: user.bio,
                location: user.location,
                website: user.website,
                nativeLanguage: user.nativeLanguage,
                learningLanguage: user.learningLanguage,
                academic: user.academic,
                academicInfo: user.academicInfo, // ✅ Virtual field
                contributionLevel: user.contributionLevel, // ✅ Virtual field
                preferences: user.preferences
            },
            token
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
            profilePic,
            nativeLanguage,
            learningLanguage,
            preferredLanguages,
            preferences 
        } = req.body;

        const updateData: any = {};
        
        if (fullName?.trim()) updateData.fullName = fullName.trim();
        if (bio !== undefined) updateData.bio = bio?.trim() || "";
        if (location !== undefined) updateData.location = location?.trim() || "";
        if (website !== undefined) updateData.website = website?.trim() || "";
        if (profilePic !== undefined) updateData.profilePic = profilePic || "";
        if (nativeLanguage !== undefined) updateData.nativeLanguage = nativeLanguage;
        if (learningLanguage !== undefined) updateData.learningLanguage = learningLanguage;
        if (preferredLanguages !== undefined) updateData.preferredLanguages = preferredLanguages;
        if (preferences) updateData.preferences = { ...user.preferences, ...preferences };

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            updateData,
            { new: true, runValidators: true }
        ).populate([
            { path: 'academic.school', select: 'name location' },
            { path: 'academic.program', select: 'name code' }
        ]);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePic: updatedUser.profilePic,
                bio: updatedUser.bio,
                location: updatedUser.location,
                website: updatedUser.website,
                nativeLanguage: updatedUser.nativeLanguage,
                learningLanguage: updatedUser.learningLanguage,
                academic: updatedUser.academic,
                academicInfo: updatedUser.academicInfo, // ✅ Virtual field
                contributionLevel: updatedUser.contributionLevel, // ✅ Virtual field
                preferences: updatedUser.preferences
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