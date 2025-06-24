// src/controllers/auth.controllers.ts - ENHANCED VERSION WITH UTILS
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User, { IUser } from "../models/User";
import { 
    generateTokenPair, 
    validateAccessToken, 
    validateRefreshToken,
    blacklistToken,
    refreshAccessToken,
    revokeAllTokensForSession 
} from "../utils/jwt.enhanced";
import crypto from 'crypto';
import { 
    logApiRequest, 
    createPaginatedResponse, 
    extractPagination 
} from "../utils/Api.utils";
import { 
    cacheUser, 
    getCachedUser, 
    generateCacheKey, 
    cache
} from "../utils/Cache.utils";
import { 
    maskEmail, 
    formatPhoneNumber, 
    truncate, 
    capitalize
} from "../utils/Format.utils";
import { logger } from "../utils/logger.utils";
import { generateSecureToken, generateStudentId } from "../utils/Random.utils";
import redis from 'ioredis';

// ✅ Helper function to generate secure session ID
const generateSessionId = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

const redisClient = new redis(process.env.REDIS_URL || 'redis://localhost:6379');

// ✅ ENHANCED signUp with utils integration
export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        logApiRequest(req as AuthRequest);
        
        const { email, password, fullName, role = 'student', academic } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
            return;
        }

        // ✅ Enhanced user data with utils
        const userData: Partial<IUser> = {
            fullName: capitalize(fullName),
            email: email.toLowerCase(),
            password,
            role,
            bio: "",
            profilePic: "",
            location: "",
            website: "",
            isOnboarded: false,
            authProvider: "local",
            isActive: true,
            isVerified: false,
            savedMaterials: [],
            uploadedMaterials: [],
            studyStats: {
                materialsViewed: 0,
                materialsSaved: 0,
                materialsCreated: 0,
                ratingsGiven: 0
            },
            preferences: {
                theme: 'system',
                notifications: {
                    email: true,
                    push: true,
                    newMaterials: true,
                    courseUpdates: true
                },
                privacy: {
                    showProfile: true,
                    showActivity: true
                }
            },
            activity: {
                loginCount: 0,
                uploadCount: 0,
                downloadCount: 0,
                contributionScore: 0
            },
            friends: []
        };

        // ✅ Enhanced academic info with utils
        if (academic) {
            userData.academic = {
                studentId: academic.studentId || (role === 'student' ? generateStudentId() : undefined),
                school: academic.school,
                program: academic.program,
                currentSemester: academic.currentSemester,
                enrollmentYear: academic.enrollmentYear,
                completedCourses: [],
                status: 'active'
            };
        }

        const newUser = new User(userData);
        await newUser.save();

        // ✅ Generate secure session and enhanced tokens
        const sessionId = generateSessionId();
        const tokens = generateTokenPair(newUser._id.toString(), sessionId);

        // ✅ Store session in Redis with user info
        await redisClient.setex(`session:${sessionId}`, 7 * 24 * 60 * 60, JSON.stringify({
            userId: newUser._id.toString(),
            email: newUser.email,
            role: newUser.role,
            createdAt: new Date().toISOString()
        }));

        // ✅ Cache user with utils
        await cacheUser(newUser._id.toString(), {
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            role: newUser.role,
            isOnboarded: newUser.isOnboarded,
            isVerified: newUser.isVerified
        });

        // ✅ Enhanced logging with masked email
        logger.info('User registered successfully', {
            userId: newUser._id,
            email: maskEmail(newUser.email),
            role: newUser.role
        });

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                user: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    role: newUser.role,
                    isOnboarded: newUser.isOnboarded,
                    isVerified: newUser.isVerified
                },
                tokens
            }
        });

    } catch (error: any) {
        logger.error("Signup error:", error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ✅ ENHANCED signIn with utils integration
export const signIn = async (req: Request, res: Response): Promise<void> => {
    try {
        logApiRequest(req as AuthRequest);
        
        const { email, password, rememberMe = false } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        
        if (!user || !(await user.matchPassword(password))) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }

        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: "Account is deactivated. Please contact support."
            });
            return;
        }

        // Update last login and activity
        await user.updateLastLogin();
        user.activity.loginCount += 1;
        await user.save();

        // ✅ Generate secure session and enhanced tokens  
        const sessionId = generateSessionId();
        const tokens = generateTokenPair(user._id.toString(), sessionId);

        // ✅ Store session in Redis with user info
        await redisClient.setex(`session:${sessionId}`, 7 * 24 * 60 * 60, JSON.stringify({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            lastLogin: new Date().toISOString()
        }));

        // ✅ Cache user after successful login
        await cacheUser(user._id.toString(), {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            isOnboarded: user.isOnboarded,
            isVerified: user.isVerified,
            isActive: user.isActive
        });

        // ✅ Enhanced logging with masked email
        logger.info('User signed in successfully', {
            userId: user._id,
            email: maskEmail(user.email)
        });

        res.json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    profilePic: user.profilePic,
                    isOnboarded: user.isOnboarded,
                    isVerified: user.isVerified,
                    isActive: user.isActive
                },
                tokens
            }
        });

    } catch (error: any) {
        logger.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

// ✅ ENHANCED getMe with cache integration
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        logApiRequest(req);
        
        const userId = req.user!._id.toString();

        // ✅ Try cache first
        let user = await getCachedUser(userId);
        
        if (!user) {
            user = await User.findById(userId)
                .select('-password')
                .populate('academic.school', 'name')
                .populate('academic.program', 'name')
                .lean();

            if (user) {
                await cacheUser(userId, user);
            }
        }

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }

        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            bio: user.bio,
            location: user.location,
            website: user.website,
            isOnboarded: user.isOnboarded,
            isVerified: user.isVerified,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            authProvider: user.authProvider,
            academic: user.academic,
            preferences: user.preferences,
            activity: user.activity,
            studyStats: user.studyStats
        };

        res.json({
            success: true,
            data: { user: userResponse }
        });

    } catch (error: any) {
        logger.error("Error in getMe:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user data"
        });
    }
};

// ✅ ENHANCED updateProfile with cache clearing
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        logApiRequest(req);
        
        const userId = req.user!._id.toString();
        const updateData = req.body;

        // Remove sensitive fields
        delete updateData.password;
        delete updateData.email;
        delete updateData.role;
        delete updateData.isActive;
        delete updateData.isVerified;

        // ✅ Format data with utils
        if (updateData.fullName) {
            updateData.fullName = capitalize(updateData.fullName);
        }
        if (updateData.phone) {
            updateData.phone = formatPhoneNumber(updateData.phone);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                ...updateData,
                updatedAt: new Date()
            },
            { 
                new: true, 
                runValidators: true,
                select: '-password'
            }
        );

        if (!updatedUser) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }

        // ✅ Clear cache with utils
        const userCacheKey = generateCacheKey('user', userId);
        cache.del(userCacheKey);

        logger.info('Profile updated', {
            userId,
            updatedFields: Object.keys(updateData)
        });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: {
                    _id: updatedUser._id,
                    fullName: updatedUser.fullName,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    profilePic: updatedUser.profilePic,
                    bio: updatedUser.bio,
                    location: updatedUser.location,
                    website: updatedUser.website,
                    isOnboarded: updatedUser.isOnboarded,
                    isVerified: updatedUser.isVerified,
                    isActive: updatedUser.isActive,
                    lastLogin: updatedUser.lastLogin,
                    updatedAt: updatedUser.updatedAt,
                    academic: updatedUser.academic,
                    preferences: updatedUser.preferences
                }
            }
        });

    } catch (error: any) {
        logger.error("Error updating profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};

// ✅ ENHANCED getAllUsers with pagination utils
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        logApiRequest(req);
        
        const { page, limit, skip } = extractPagination(req);
        const { role, isActive, search } = req.query;

        let query: any = {};
        
        if (role) query.role = role;
        if (typeof isActive === 'boolean') query.isActive = isActive;
        
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'academic.studentId': { $regex: search, $options: 'i' } }
            ];
        }

        // ✅ Check cache first
        const cacheKey = generateCacheKey('admin_users_list', JSON.stringify(req.query));
        const cached = cache.get(cacheKey);
        
        if (cached) {
            res.json(cached);
            return;
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),
            User.countDocuments(query)
        ]);

        // ✅ Enhanced users data with formatting
        const enhancedUsers = users.map((user: any) => ({
            ...user,
            maskedEmail: maskEmail(user.email),
            truncatedBio: user.bio ? truncate(user.bio, 100) : "",
            studentId: user.academic?.studentId || null
        }));

        // ✅ Create paginated response with utils
        const response = createPaginatedResponse(
            enhancedUsers,
            total,
            page,
            limit,
            'Users retrieved successfully'
        );

        // ✅ Cache the response
        cache.set(cacheKey, response, 180); // 3 minutes

        logger.info('Admin users list retrieved', {
            adminId: req.user?._id,
            totalUsers: total,
            page,
            limit
        });

        res.json(response);

    } catch (error: any) {
        logger.error("Error getting all users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve users"
        });
    }
};

// ✅ ENHANCED forgotPassword with secure token generation
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        logApiRequest(req as AuthRequest);
        
        const { email } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });
        
        if (!user) {
            logger.warn('Password reset requested for non-existent user', {
                email: maskEmail(normalizedEmail),
                ip: req.ip
            });
            
            res.status(200).json({
                success: true,
                message: "If an account with that email exists, we have sent a password reset link."
            });
            return;
        }

        // ✅ Generate secure token with utils
        const resetToken = generateSecureToken(32);
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        (user as any).resetPasswordToken = resetToken;
        (user as any).resetPasswordExpires = resetTokenExpiry;
        await user.save();

        logger.info('Password reset token generated', {
            userId: user._id,
            email: maskEmail(user.email)
        });

        res.json({
            success: true,
            message: "Password reset link sent to your email"
        });

    } catch (error: any) {
        logger.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process password reset request"
        });
    }
};

// ✅ Continue with other functions...
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        logApiRequest(req as AuthRequest);
        
        const { token, password } = req.body;

        if (!token || !password) {
            res.status(400).json({
                success: false,
                message: "Token and new password are required"
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

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        } as any);

        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
            return;
        }

        user.password = password;
        (user as any).resetPasswordToken = undefined;
        (user as any).resetPasswordExpires = undefined;
        
        await user.save();

        logger.info('Password reset successful', {
            userId: user._id,
            email: maskEmail(user.email)
        });

        res.json({
            success: true,
            message: "Password reset successful. Please login with your new password."
        });

    } catch (error: any) {
        logger.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password"
        });
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        logApiRequest(req as AuthRequest);
        
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(401).json({
                success: false,
                message: "Refresh token is required"
            });
            return;
        }

        // ✅ Use enhanced JWT refresh with token rotation
        const newTokens = await refreshAccessToken(refreshToken);
        
        if (!newTokens) {
            res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token"
            });
            return;
        }

        // ✅ Verify user still exists and is active
        const decoded = await validateRefreshToken(refreshToken);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
            return;
        }

        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user || !user.isActive) {
            // ✅ Revoke session if user is inactive
            await revokeAllTokensForSession(decoded.sessionId);
            res.status(401).json({
                success: false,
                message: "User not found or inactive"
            });
            return;
        }

        logger.info('Tokens refreshed', {
            userId: user._id,
            email: maskEmail(user.email)
        });

        res.json({
            success: true,
            message: "Tokens refreshed successfully",
            data: { tokens: newTokens }
        });

    } catch (error: any) {
        logger.error("Token refresh error:", error);
        res.status(401).json({
            success: false,
            message: "Token refresh failed"
        });
    }
};

// ✅ NEW ENHANCED LOGOUT with token blacklisting
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        logApiRequest(req);
        
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.split(' ')[1]; // Bearer <token>
        const { refreshToken } = req.body;
        
        if (!accessToken) {
            res.status(400).json({
                success: false,
                message: "Access token is required"
            });
            return;
        }

        // ✅ Validate access token to get session info
        const decoded = await validateAccessToken(accessToken);
        
        if (decoded) {
            // ✅ Revoke all tokens for this session (most secure)
            await revokeAllTokensForSession(decoded.sessionId);
            
            logger.info('User logged out successfully', {
                userId: decoded.userId,
                sessionId: decoded.sessionId
            });
        } else {
            // ✅ If token is invalid, still try to blacklist it
            await blacklistToken(accessToken);
        }

        // ✅ Also blacklist refresh token if provided
        if (refreshToken) {
            await blacklistToken(refreshToken);
        }

        // ✅ Clear user cache
        if (req.user?._id) {
            const userCacheKey = generateCacheKey('user', req.user._id.toString());
            cache.del(userCacheKey);
        }

        res.json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error: any) {
        logger.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};

// ✅ NEW FUNCTION: Logout from all devices
export const logoutAllDevices = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        logApiRequest(req);
        
        const userId = req.user!._id.toString();

        // ✅ Get all active sessions for user
        const sessionKeys = await redisClient.keys(`session:*`);
        const userSessions: string[] = [];

        for (const sessionKey of sessionKeys) {
            const sessionData = await redisClient.get(sessionKey);
            if (sessionData) {
                try {
                    const session = JSON.parse(sessionData);
                    if (session.userId === userId) {
                        const sessionId = sessionKey.split(':')[1];
                        userSessions.push(sessionId);
                    }
                } catch (e) {
                    // Skip invalid session data
                    continue;
                }
            }
        }

        // ✅ Revoke all sessions for this user
        const revokePromises = userSessions.map(sessionId => 
            revokeAllTokensForSession(sessionId)
        );
        await Promise.all(revokePromises);

        // ✅ Clear user cache
        const userCacheKey = generateCacheKey('user', userId);
        cache.del(userCacheKey);

        logger.info('User logged out from all devices', {
            userId,
            sessionsRevoked: userSessions.length
        });

        res.json({
            success: true,
            message: `Logged out from ${userSessions.length} devices successfully`
        });

    } catch (error: any) {
        logger.error("Logout all devices error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to logout from all devices"
        });
    }
};

// ✅ NEW OAUTH HANDLER for Google/Social login
export const handleOAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        logApiRequest(req as AuthRequest);
        
        const { provider, email, fullName, profilePic, providerId } = req.body;

        if (!provider || !email || !fullName) {
            res.status(400).json({
                success: false,
                message: "Provider, email, and fullName are required"
            });
            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists
        let user = await User.findOne({ email: normalizedEmail });

        if (user) {
            // Update existing user's OAuth info if needed
            if (!user.authProvider || user.authProvider === 'local') {
                user.authProvider = provider;
                user.profilePic = profilePic || user.profilePic;
                await user.save();
            }

            // Update last login
            await user.updateLastLogin();
            user.activity.loginCount += 1;
            await user.save();
        } else {
            // Create new user from OAuth
            const userData: Partial<IUser> = {
                fullName: capitalize(fullName),
                email: normalizedEmail,
                role: 'student',
                bio: "",
                profilePic: profilePic || "",
                location: "",
                website: "",
                isOnboarded: false,
                authProvider: provider,
                isActive: true,
                isVerified: true, // OAuth users are considered verified
                savedMaterials: [],
                uploadedMaterials: [],
                studyStats: {
                    materialsViewed: 0,
                    materialsSaved: 0,
                    materialsCreated: 0,
                    ratingsGiven: 0
                },
                preferences: {
                    theme: 'system',
                    notifications: {
                        email: true,
                        push: true,
                        newMaterials: true,
                        courseUpdates: true
                    },
                    privacy: {
                        showProfile: true,
                        showActivity: true
                    }
                },
                activity: {
                    loginCount: 1,
                    uploadCount: 0,
                    downloadCount: 0,
                    contributionScore: 0
                },
                friends: []
            };

            user = new User(userData);
            await user.save();
        }

        // ✅ Generate secure session and enhanced tokens
        const sessionId = generateSessionId();
        console.log('🔑 OAuth - Generated sessionId:', sessionId);
        console.log('🔑 OAuth - User ID:', user._id.toString());
        
        const tokens = generateTokenPair(user._id.toString(), sessionId);
        console.log('🔑 OAuth - Generated tokens:', {
            accessTokenLength: tokens.accessToken.length,
            refreshTokenLength: tokens.refreshToken.length
        });

        // ✅ Store session in Redis with user info
        await redisClient.setex(`session:${sessionId}`, 7 * 24 * 60 * 60, JSON.stringify({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            provider: provider,
            createdAt: new Date().toISOString()
        }));

        // ✅ Cache user
        await cacheUser(user._id.toString(), {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            isOnboarded: user.isOnboarded,
            isVerified: user.isVerified,
            isActive: user.isActive
        });

        logger.info('OAuth authentication successful', {
            userId: user._id,
            email: maskEmail(user.email),
            provider,
            isNewUser: !user.lastLogin
        });

        res.json({
            success: true,
            message: "OAuth authentication successful",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                isOnboarded: user.isOnboarded,
                isVerified: user.isVerified,
                isActive: user.isActive,
                authProvider: user.authProvider
            },
            token: tokens.accessToken // Return access token for NextAuth
        });

    } catch (error: any) {
        logger.error("OAuth error:", error);
        res.status(500).json({
            success: false,
            message: "OAuth authentication failed"
        });
    }
};