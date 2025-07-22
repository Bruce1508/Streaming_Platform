// src/controllers/auth.controllers.ts - ENHANCED VERSION WITH UTILS
import { Request, Response } from "express";
import { AuthRequest } from "../middleWare/auth.middleware";
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
import { 
    detectEducationalEmail, 
    getVerificationStatusFromEmail,
    getInstitutionFromEmail 
} from "../utils/email.utils";
import { logger } from "../utils/logger.utils";
import { generateSecureToken, generateStudentId } from "../utils/Random.utils";
import redis from 'ioredis';
import { sendEmail, emailTemplates } from "../utils/email.utils";

// ✅ Helper function to generate secure session ID
const generateSessionId = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

const redisClient = new redis(process.env.REDIS_URL || 'redis://localhost:6379');

// ✅ REMOVED: Traditional signUp - now using magic link authentication

// ✅ REMOVED: Traditional signIn - now using magic link authentication

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

// ✅ NEW OAUTH HANDLER with Student vs Non-Student Detection
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

        // ✅ NEW: Detect if email is from educational institution
        const emailDetection = detectEducationalEmail(normalizedEmail);
        const institutionInfo = getInstitutionFromEmail(normalizedEmail);
        
        logger.info('OAuth login attempt', {
            email: maskEmail(normalizedEmail),
            provider,
            isEducational: emailDetection.isEducational,
            institution: institutionInfo.name || 'Non-educational'
        });

        // Check if user exists
        let user = await User.findOne({ email: normalizedEmail });

        if (user) {
            // Update existing user's OAuth info if needed
            if (!user.authProvider || user.authProvider === 'local') {
                user.authProvider = provider;
                user.profilePic = profilePic || user.profilePic;
                
                // Update institution info if it's educational
                if (emailDetection.isEducational) {
                    user.institutionInfo = {
                        name: institutionInfo.name || 'Educational Institution',
                        domain: institutionInfo.domain || '',
                        type: institutionInfo.type || 'institute'
                    };
                }
                
                await user.save();
            }

            // Update last login
            await user.updateLastLogin();
            user.activity.loginCount += 1;
            await user.save();
        } else {
            // ✅ NEW: Create user with proper verification status
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
                providerId: providerId,
                isActive: true,
                
                // ✅ KEY CHANGE: OAuth users are NOT automatically verified
                // Only Magic Link for student emails gives verification
                isVerified: false,
                verificationStatus: emailDetection.isEducational ? 'unverified' : 'non-student',
                verificationMethod: 'oauth-pending',
                
                // ✅ Store institution info for student emails
                institutionInfo: emailDetection.isEducational ? {
                    name: institutionInfo.name || 'Educational Institution',
                    domain: institutionInfo.domain || '',
                    type: institutionInfo.type || 'institute'
                } : {
                    name: '',
                    domain: '',
                    type: ''
                },
                
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
            
            logger.info('New user created via OAuth', {
                userId: user._id,
                email: maskEmail(user.email),
                isEducational: emailDetection.isEducational,
                verificationStatus: user.verificationStatus
            });
        }

        // ✅ Generate secure session and enhanced tokens
        const sessionId = generateSessionId();
        
        const tokens = generateTokenPair(user._id.toString(), sessionId);

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
            isNewUser: !user.lastLogin,
            verificationStatus: user.verificationStatus
        });

        res.json({
            success: true,
            message: "OAuth authentication successful",
            data: {
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    profilePic: user.profilePic,
                    isOnboarded: user.isOnboarded,
                    isVerified: user.isVerified,
                    isActive: user.isActive,
                    authProvider: user.authProvider,
                    verificationStatus: user.verificationStatus,
                    verificationMethod: user.verificationMethod,
                    institutionInfo: user.institutionInfo
                },
                token: tokens.accessToken // NextAuth expects data.token
            },
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                isOnboarded: user.isOnboarded,
                isVerified: user.isVerified,
                isActive: user.isActive,
                authProvider: user.authProvider,
                verificationStatus: user.verificationStatus,
                verificationMethod: user.verificationMethod,
                institutionInfo: user.institutionInfo
            },
            token: tokens.accessToken // Backward compatibility
        });

    } catch (error: any) {
        logger.error("OAuth error:", error);
        res.status(500).json({
            success: false,
            message: "OAuth authentication failed"
        });
    }
};

// ✅ UPDATED: Send Magic Link - Only for Student Emails
export const sendMagicLink = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('🔥 Backend: sendMagicLink controller called');
        
        logApiRequest(req as AuthRequest);
        
        const { email, callbackUrl, baseUrl } = req.body;
        
        console.log('📧 Backend: Request data received:', {
            email,
            callbackUrl,
            baseUrl,
            bodyKeys: Object.keys(req.body),
            headers: {
                'content-type': req.headers['content-type'],
                'user-agent': req.headers['user-agent']
            }
        });
        
        if (!email) {
            console.log('❌ Backend: Email is missing from request');
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }
        
        const normalizedEmail = email.toLowerCase().trim();
        console.log('📝 Backend: Email normalized:', normalizedEmail);

        // ✅ NEW: Validate that email is from educational institution
        const emailDetection = detectEducationalEmail(normalizedEmail);
        console.log('🎓 Backend: Email detection result:', emailDetection);
        
        if (!emailDetection.isEducational) {
            logger.warn('Magic link denied for non-educational email', {
                email: maskEmail(normalizedEmail),
                ip: req.ip
            });
            
            return res.status(400).json({
                success: false,
                message: "Magic link authentication is only available for student emails from educational institutions",
                suggestion: "Please use your student email (e.g., student@yourschool.edu) or sign in with Google instead"
            });
        }

        const institutionInfo = getInstitutionFromEmail(normalizedEmail);
        
        logger.info('Magic link request for student email', {
            email: maskEmail(normalizedEmail),
            institution: institutionInfo.name || 'Educational Institution',
            confidence: emailDetection.confidence
        });

        // Check if user exists, if not create one
        let user = await User.findOne({ email: normalizedEmail });
        
        if (!user) {
            // ✅ Create new user with magic link flow for students
            user = new User({
                email: normalizedEmail,
                fullName: normalizedEmail.split('@')[0], // Temporary name
                role: 'student',
                isActive: true,
                
                // ✅ Magic Link users get verified status immediately
                isVerified: true,
                verificationStatus: emailDetection.confidence === 'high' ? 'edu-verified' : 'email-verified',
                verificationMethod: 'magic-link',
                
                institutionInfo: {
                    name: institutionInfo.name || 'Educational Institution',
                    domain: institutionInfo.domain || '',
                    type: institutionInfo.type || 'institute'
                },
                authProvider: 'local',
                password: generateSecureToken(32), // ✅ Temporary password for magic link users
                hasTemporaryPassword: true, // ✅ Flag to indicate this is a temporary password
                activity: {
                    loginCount: 0,
                    uploadCount: 0,
                    downloadCount: 0,
                    contributionScore: 0
                },
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
                savedMaterials: [],
                uploadedMaterials: [],
                friends: []
            });

            await user.save();
            logger.info('New student user created via magic link', {
                userId: user._id,
                email: maskEmail(user.email),
                institution: institutionInfo.name,
                verificationStatus: user.verificationStatus
            });
        } else {
            // ✅ For existing users, upgrade their verification if they use magic link
            if (user.verificationStatus === 'unverified' || user.verificationStatus === 'non-student') {
                user.verificationStatus = emailDetection.confidence === 'high' ? 'edu-verified' : 'email-verified';
                user.verificationMethod = 'magic-link';
                user.isVerified = true;
                
                // Update institution info
                user.institutionInfo = {
                    name: institutionInfo.name || 'Educational Institution',
                    domain: institutionInfo.domain || '',
                    type: institutionInfo.type || 'institute'
                };
                
                await user.save();
                
                logger.info('Existing user verification upgraded via magic link', {
                    userId: user._id,
                    email: maskEmail(user.email),
                    oldStatus: user.verificationStatus,
                    newStatus: user.verificationStatus
                });
            }
        }

        // Generate magic link token
        const magicToken = generateSecureToken(32);

        // Store magic link token in Redis
        await redisClient.setex(
            `magic:${magicToken}`, 
            600, // 10 minutes
            JSON.stringify({
                userId: user._id.toString(),
                email: normalizedEmail,
                createdAt: new Date().toISOString()
            })
        );

        // Create magic link URL
        const magicLinkUrl = `${baseUrl}/api/auth/callback/email?callbackUrl=${encodeURIComponent(callbackUrl || '/dashboard')}&token=${magicToken}&email=${encodeURIComponent(normalizedEmail)}`;

        // Send magic link email
        const emailTemplate = emailTemplates.magicLink({
            name: user.fullName,
            magicLinkUrl: magicLinkUrl,
            expiryMinutes: 10
        });

        const emailSent = await sendEmail({
            to: normalizedEmail,
            subject: emailTemplate.subject,
            html: emailTemplate.html
        });

        if (!emailSent) {
            throw new Error("Failed to send magic link email");
        }

        logger.info('Magic link sent successfully to student', {
            userId: user._id,
            email: maskEmail(normalizedEmail),
            institution: institutionInfo.name
        });

        res.json({
            success: true,
            message: "Magic link sent to your student email. Check your inbox!",
            institutionInfo: {
                name: institutionInfo.name,
                type: institutionInfo.type
            }
        });

    } catch (error: any) {
        logger.error("Send magic link error:", {
            error: error.message,
            stack: error.stack,
            email: req.body.email ? maskEmail(req.body.email) : 'unknown'
        });
        
        // Provide more specific error message based on error type
        let errorMessage = "Failed to send magic link";
        if (error.message.includes("Authentication failed")) {
            errorMessage = "Email configuration error. Please check SMTP credentials.";
        } else if (error.message.includes("ECONNREFUSED")) {
            errorMessage = "Unable to connect to email server.";
        } else if (error.message.includes("Invalid email")) {
            errorMessage = "Invalid email address provided.";
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            ...(process.env.NODE_ENV === 'development' && { 
                debug: error.message 
            })
        });
    }
};

// ✅ UPDATED: Verify Magic Link with Token Validation
export const verifyMagicLink = async (req: Request, res: Response): Promise<any> => {
    try {
        logApiRequest(req as AuthRequest);
        
        const { email, token } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // ✅ Validate required parameters
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Magic link token is required"
            });
        }

        // ✅ Get token data from Redis
        const tokenData = await redisClient.get(`magic:${token}`);
        
        if (!tokenData) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired magic link token"
            });
        }

        const parsedTokenData = JSON.parse(tokenData);
        
        // ✅ Verify email matches token
        if (parsedTokenData.email !== normalizedEmail) {
            return res.status(400).json({
                success: false,
                message: "Email does not match magic link token"
            });
        }

        // ✅ Find user
        const user = await User.findById(parsedTokenData.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ✅ Delete token from Redis (one-time use)
        await redisClient.del(`magic:${token}`);

        // ✅ Verify this is still a student email
        const emailDetection = detectEducationalEmail(normalizedEmail);
        if (!emailDetection.isEducational) {
            return res.status(400).json({
                success: false,
                message: "Magic link is only valid for student emails"
            });
        }

        // ✅ Ensure user has verified status (Magic Link = Verified Student)
        if (!user.isVerified || user.verificationMethod !== 'magic-link') {
            user.isVerified = true;
            user.verificationStatus = emailDetection.confidence === 'high' ? 'edu-verified' : 'email-verified';
            user.verificationMethod = 'magic-link';
            
            const institutionInfo = getInstitutionFromEmail(normalizedEmail);
            user.institutionInfo = {
                name: institutionInfo.name || 'Educational Institution',
                domain: institutionInfo.domain || '',
                type: institutionInfo.type || 'institute'
            };
            
            await user.save();
            
            logger.info('User verification confirmed via magic link', {
                userId: user._id,
                email: maskEmail(user.email),
                verificationStatus: user.verificationStatus
            });
        }

        // Update last login and activity
        await user.updateLastLogin();
        user.activity.loginCount += 1;
        
        // ✅ Clear temporary password flag on successful magic link login
        if (user.hasTemporaryPassword) {
            user.hasTemporaryPassword = false;
            logger.info('Temporary password flag cleared for magic link user', {
                userId: user._id,
                email: maskEmail(user.email)
            });
        }
        
        await user.save();

        // Generate session tokens
        const sessionId = generateSessionId();
        const tokens = generateTokenPair(user._id.toString(), sessionId);

        // Store session in Redis
        await redisClient.setex(`session:${sessionId}`, 7 * 24 * 60 * 60, JSON.stringify({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            lastLogin: new Date().toISOString(),
            verificationMethod: 'magic-link'
        }));

        // Cache user
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

        logger.info('Magic link authentication successful for verified student', {
            userId: user._id,
            email: maskEmail(user.email),
            verificationStatus: user.verificationStatus,
            institution: user.institutionInfo.name
        });

        res.json({
            success: true,
            message: "Welcome back, verified student! 🎓",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
                role: user.role,
                isOnboarded: user.isOnboarded,
                isVerified: user.isVerified,
                isActive: user.isActive,
                verificationStatus: user.verificationStatus,
                verificationMethod: user.verificationMethod,
                institutionInfo: user.institutionInfo,
                bio: user.bio,
                location: user.location
            },
            token: tokens.accessToken
        });

    } catch (error: any) {
        logger.error("Verify magic link error:", {
            error: error.message,
            stack: error.stack,
            email: req.body.email ? maskEmail(req.body.email) : 'unknown'
        });
        res.status(500).json({
            success: false,
            message: "Failed to verify magic link"
        });
    }
};