"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMagicLink = exports.sendMagicLink = exports.handleOAuth = exports.logoutAllDevices = exports.logout = exports.refreshToken = exports.getAllUsers = exports.updateProfile = exports.getMe = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_enhanced_1 = require("../utils/jwt.enhanced");
const crypto_1 = __importDefault(require("crypto"));
const Api_utils_1 = require("../utils/Api.utils");
const Cache_utils_1 = require("../utils/Cache.utils");
const Format_utils_1 = require("../utils/Format.utils");
const email_utils_1 = require("../utils/email.utils");
const logger_utils_1 = require("../utils/logger.utils");
const Random_utils_1 = require("../utils/Random.utils");
const ioredis_1 = __importDefault(require("ioredis"));
const email_utils_2 = require("../utils/email.utils");
// ✅ Helper function to generate secure session ID
const generateSessionId = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
const redisClient = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
// ✅ REMOVED: Traditional signUp - now using magic link authentication
// ✅ REMOVED: Traditional signIn - now using magic link authentication
// ✅ ENHANCED getMe with cache integration
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, Api_utils_1.logApiRequest)(req);
        const userId = req.user._id.toString();
        // ✅ Try cache first
        let user = yield (0, Cache_utils_1.getCachedUser)(userId);
        if (!user) {
            user = yield User_1.default.findById(userId)
                .select('-password')
                .populate('academic.school', 'name')
                .populate('academic.program', 'name')
                .lean();
            if (user) {
                yield (0, Cache_utils_1.cacheUser)(userId, user);
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
    }
    catch (error) {
        logger_utils_1.logger.error("Error in getMe:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user data"
        });
    }
});
exports.getMe = getMe;
// ✅ ENHANCED updateProfile with cache clearing
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, Api_utils_1.logApiRequest)(req);
        const userId = req.user._id.toString();
        const updateData = req.body;
        // Remove sensitive fields
        delete updateData.password;
        delete updateData.email;
        delete updateData.role;
        delete updateData.isActive;
        delete updateData.isVerified;
        // ✅ Format data with utils
        if (updateData.fullName) {
            updateData.fullName = (0, Format_utils_1.capitalize)(updateData.fullName);
        }
        if (updateData.phone) {
            updateData.phone = (0, Format_utils_1.formatPhoneNumber)(updateData.phone);
        }
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), {
            new: true,
            runValidators: true,
            select: '-password'
        });
        if (!updatedUser) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        // ✅ Clear cache with utils
        const userCacheKey = (0, Cache_utils_1.generateCacheKey)('user', userId);
        Cache_utils_1.cache.del(userCacheKey);
        logger_utils_1.logger.info('Profile updated', {
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
    }
    catch (error) {
        logger_utils_1.logger.error("Error updating profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
});
exports.updateProfile = updateProfile;
// ✅ ENHANCED getAllUsers with pagination utils
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        (0, Api_utils_1.logApiRequest)(req);
        const { page, limit, skip } = (0, Api_utils_1.extractPagination)(req);
        const { role, isActive, search } = req.query;
        let query = {};
        if (role)
            query.role = role;
        if (typeof isActive === 'boolean')
            query.isActive = isActive;
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'academic.studentId': { $regex: search, $options: 'i' } }
            ];
        }
        // ✅ Check cache first
        const cacheKey = (0, Cache_utils_1.generateCacheKey)('admin_users_list', JSON.stringify(req.query));
        const cached = Cache_utils_1.cache.get(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        const [users, total] = yield Promise.all([
            User_1.default.find(query)
                .select('-password')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),
            User_1.default.countDocuments(query)
        ]);
        // ✅ Enhanced users data with formatting
        const enhancedUsers = users.map((user) => {
            var _a;
            return (Object.assign(Object.assign({}, user), { maskedEmail: (0, Format_utils_1.maskEmail)(user.email), truncatedBio: user.bio ? (0, Format_utils_1.truncate)(user.bio, 100) : "", studentId: ((_a = user.academic) === null || _a === void 0 ? void 0 : _a.studentId) || null }));
        });
        // ✅ Create paginated response with utils
        const response = (0, Api_utils_1.createPaginatedResponse)(enhancedUsers, total, page, limit, 'Users retrieved successfully');
        // ✅ Cache the response
        Cache_utils_1.cache.set(cacheKey, response, 180); // 3 minutes
        logger_utils_1.logger.info('Admin users list retrieved', {
            adminId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            totalUsers: total,
            page,
            limit
        });
        res.json(response);
    }
    catch (error) {
        logger_utils_1.logger.error("Error getting all users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve users"
        });
    }
});
exports.getAllUsers = getAllUsers;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, Api_utils_1.logApiRequest)(req);
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(401).json({
                success: false,
                message: "Refresh token is required"
            });
            return;
        }
        // ✅ Use enhanced JWT refresh with token rotation
        const newTokens = yield (0, jwt_enhanced_1.refreshAccessToken)(refreshToken);
        if (!newTokens) {
            res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token"
            });
            return;
        }
        // ✅ Verify user still exists and is active
        const decoded = yield (0, jwt_enhanced_1.validateRefreshToken)(refreshToken);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
            return;
        }
        const user = yield User_1.default.findById(decoded.userId).select('-password');
        if (!user || !user.isActive) {
            // ✅ Revoke session if user is inactive
            yield (0, jwt_enhanced_1.revokeAllTokensForSession)(decoded.sessionId);
            res.status(401).json({
                success: false,
                message: "User not found or inactive"
            });
            return;
        }
        logger_utils_1.logger.info('Tokens refreshed', {
            userId: user._id,
            email: (0, Format_utils_1.maskEmail)(user.email)
        });
        res.json({
            success: true,
            message: "Tokens refreshed successfully",
            data: { tokens: newTokens }
        });
    }
    catch (error) {
        logger_utils_1.logger.error("Token refresh error:", error);
        res.status(401).json({
            success: false,
            message: "Token refresh failed"
        });
    }
});
exports.refreshToken = refreshToken;
// ✅ NEW ENHANCED LOGOUT with token blacklisting
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        (0, Api_utils_1.logApiRequest)(req);
        const authHeader = req.headers.authorization;
        const accessToken = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1]; // Bearer <token>
        const { refreshToken } = req.body;
        if (!accessToken) {
            res.status(400).json({
                success: false,
                message: "Access token is required"
            });
            return;
        }
        // ✅ Validate access token to get session info
        const decoded = yield (0, jwt_enhanced_1.validateAccessToken)(accessToken);
        if (decoded) {
            // ✅ Revoke all tokens for this session (most secure)
            yield (0, jwt_enhanced_1.revokeAllTokensForSession)(decoded.sessionId);
            logger_utils_1.logger.info('User logged out successfully', {
                userId: decoded.userId,
                sessionId: decoded.sessionId
            });
        }
        else {
            // ✅ If token is invalid, still try to blacklist it
            yield (0, jwt_enhanced_1.blacklistToken)(accessToken);
        }
        // ✅ Also blacklist refresh token if provided
        if (refreshToken) {
            yield (0, jwt_enhanced_1.blacklistToken)(refreshToken);
        }
        // ✅ Clear user cache
        if ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) {
            const userCacheKey = (0, Cache_utils_1.generateCacheKey)('user', req.user._id.toString());
            Cache_utils_1.cache.del(userCacheKey);
        }
        res.json({
            success: true,
            message: "Logged out successfully"
        });
    }
    catch (error) {
        logger_utils_1.logger.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
});
exports.logout = logout;
// ✅ NEW FUNCTION: Logout from all devices
const logoutAllDevices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, Api_utils_1.logApiRequest)(req);
        const userId = req.user._id.toString();
        // ✅ Get all active sessions for user
        const sessionKeys = yield redisClient.keys(`session:*`);
        const userSessions = [];
        for (const sessionKey of sessionKeys) {
            const sessionData = yield redisClient.get(sessionKey);
            if (sessionData) {
                try {
                    const session = JSON.parse(sessionData);
                    if (session.userId === userId) {
                        const sessionId = sessionKey.split(':')[1];
                        userSessions.push(sessionId);
                    }
                }
                catch (e) {
                    // Skip invalid session data
                    continue;
                }
            }
        }
        // ✅ Revoke all sessions for this user
        const revokePromises = userSessions.map(sessionId => (0, jwt_enhanced_1.revokeAllTokensForSession)(sessionId));
        yield Promise.all(revokePromises);
        // ✅ Clear user cache
        const userCacheKey = (0, Cache_utils_1.generateCacheKey)('user', userId);
        Cache_utils_1.cache.del(userCacheKey);
        logger_utils_1.logger.info('User logged out from all devices', {
            userId,
            sessionsRevoked: userSessions.length
        });
        res.json({
            success: true,
            message: `Logged out from ${userSessions.length} devices successfully`
        });
    }
    catch (error) {
        logger_utils_1.logger.error("Logout all devices error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to logout from all devices"
        });
    }
});
exports.logoutAllDevices = logoutAllDevices;
// ✅ NEW OAUTH HANDLER with Student vs Non-Student Detection
const handleOAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, Api_utils_1.logApiRequest)(req);
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
        const emailDetection = (0, email_utils_1.detectEducationalEmail)(normalizedEmail);
        const institutionInfo = (0, email_utils_1.getInstitutionFromEmail)(normalizedEmail);
        logger_utils_1.logger.info('OAuth login attempt', {
            email: (0, Format_utils_1.maskEmail)(normalizedEmail),
            provider,
            isEducational: emailDetection.isEducational,
            institution: institutionInfo.name || 'Non-educational'
        });
        // Check if user exists
        let user = yield User_1.default.findOne({ email: normalizedEmail });
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
                yield user.save();
            }
            // Update last login
            yield user.updateLastLogin();
            user.activity.loginCount += 1;
            yield user.save();
        }
        else {
            // ✅ NEW: Create user with proper verification status
            const userData = {
                fullName: (0, Format_utils_1.capitalize)(fullName),
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
            user = new User_1.default(userData);
            yield user.save();
            logger_utils_1.logger.info('New user created via OAuth', {
                userId: user._id,
                email: (0, Format_utils_1.maskEmail)(user.email),
                isEducational: emailDetection.isEducational,
                verificationStatus: user.verificationStatus
            });
        }
        // ✅ Generate secure session and enhanced tokens
        const sessionId = generateSessionId();
        const tokens = (0, jwt_enhanced_1.generateTokenPair)(user._id.toString(), sessionId);
        // ✅ Store session in Redis with user info
        yield redisClient.setex(`session:${sessionId}`, 7 * 24 * 60 * 60, JSON.stringify({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            provider: provider,
            createdAt: new Date().toISOString()
        }));
        // ✅ Cache user
        yield (0, Cache_utils_1.cacheUser)(user._id.toString(), {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            isOnboarded: user.isOnboarded,
            isVerified: user.isVerified,
            isActive: user.isActive
        });
        logger_utils_1.logger.info('OAuth authentication successful', {
            userId: user._id,
            email: (0, Format_utils_1.maskEmail)(user.email),
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
    }
    catch (error) {
        logger_utils_1.logger.error("OAuth error:", error);
        res.status(500).json({
            success: false,
            message: "OAuth authentication failed"
        });
    }
});
exports.handleOAuth = handleOAuth;
// ✅ UPDATED: Send Magic Link - Only for Student Emails
const sendMagicLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔥 Backend: sendMagicLink controller called');
        (0, Api_utils_1.logApiRequest)(req);
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
        const emailDetection = (0, email_utils_1.detectEducationalEmail)(normalizedEmail);
        console.log('🎓 Backend: Email detection result:', emailDetection);
        if (!emailDetection.isEducational) {
            logger_utils_1.logger.warn('Magic link denied for non-educational email', {
                email: (0, Format_utils_1.maskEmail)(normalizedEmail),
                ip: req.ip
            });
            return res.status(400).json({
                success: false,
                message: "Magic link authentication is only available for student emails from educational institutions",
                suggestion: "Please use your student email (e.g., student@yourschool.edu) or sign in with Google instead"
            });
        }
        const institutionInfo = (0, email_utils_1.getInstitutionFromEmail)(normalizedEmail);
        logger_utils_1.logger.info('Magic link request for student email', {
            email: (0, Format_utils_1.maskEmail)(normalizedEmail),
            institution: institutionInfo.name || 'Educational Institution',
            confidence: emailDetection.confidence
        });
        // Check if user exists, if not create one
        let user = yield User_1.default.findOne({ email: normalizedEmail });
        if (!user) {
            // ✅ Create new user with magic link flow for students
            user = new User_1.default({
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
                password: (0, Random_utils_1.generateSecureToken)(32), // ✅ Temporary password for magic link users
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
            yield user.save();
            logger_utils_1.logger.info('New student user created via magic link', {
                userId: user._id,
                email: (0, Format_utils_1.maskEmail)(user.email),
                institution: institutionInfo.name,
                verificationStatus: user.verificationStatus
            });
        }
        else {
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
                yield user.save();
                logger_utils_1.logger.info('Existing user verification upgraded via magic link', {
                    userId: user._id,
                    email: (0, Format_utils_1.maskEmail)(user.email),
                    oldStatus: user.verificationStatus,
                    newStatus: user.verificationStatus
                });
            }
        }
        // Generate magic link token
        const magicToken = (0, Random_utils_1.generateSecureToken)(32);
        // Store magic link token in Redis
        yield redisClient.setex(`magic:${magicToken}`, 600, // 10 minutes
        JSON.stringify({
            userId: user._id.toString(),
            email: normalizedEmail,
            createdAt: new Date().toISOString()
        }));
        // Create magic link URL
        const magicLinkUrl = `${baseUrl}/api/auth/callback/email?callbackUrl=${encodeURIComponent(callbackUrl || '/dashboard')}&token=${magicToken}&email=${encodeURIComponent(normalizedEmail)}`;
        // Send magic link email
        const emailTemplate = email_utils_2.emailTemplates.magicLink({
            name: user.fullName,
            magicLinkUrl: magicLinkUrl,
            expiryMinutes: 10
        });
        const emailSent = yield (0, email_utils_2.sendEmail)({
            to: normalizedEmail,
            subject: emailTemplate.subject,
            html: emailTemplate.html
        });
        if (!emailSent) {
            throw new Error("Failed to send magic link email");
        }
        logger_utils_1.logger.info('Magic link sent successfully to student', {
            userId: user._id,
            email: (0, Format_utils_1.maskEmail)(normalizedEmail),
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
    }
    catch (error) {
        logger_utils_1.logger.error("Send magic link error:", {
            error: error.message,
            stack: error.stack,
            email: req.body.email ? (0, Format_utils_1.maskEmail)(req.body.email) : 'unknown'
        });
        // Provide more specific error message based on error type
        let errorMessage = "Failed to send magic link";
        if (error.message.includes("Authentication failed")) {
            errorMessage = "Email configuration error. Please check SMTP credentials.";
        }
        else if (error.message.includes("ECONNREFUSED")) {
            errorMessage = "Unable to connect to email server.";
        }
        else if (error.message.includes("Invalid email")) {
            errorMessage = "Invalid email address provided.";
        }
        res.status(500).json(Object.assign({ success: false, message: errorMessage }, (process.env.NODE_ENV === 'development' && {
            debug: error.message
        })));
    }
});
exports.sendMagicLink = sendMagicLink;
// ✅ UPDATED: Verify Magic Link with Token Validation
const verifyMagicLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, Api_utils_1.logApiRequest)(req);
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
        const tokenData = yield redisClient.get(`magic:${token}`);
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
        const user = yield User_1.default.findById(parsedTokenData.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // ✅ Delete token from Redis (one-time use)
        yield redisClient.del(`magic:${token}`);
        // ✅ Verify this is still a student email
        const emailDetection = (0, email_utils_1.detectEducationalEmail)(normalizedEmail);
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
            const institutionInfo = (0, email_utils_1.getInstitutionFromEmail)(normalizedEmail);
            user.institutionInfo = {
                name: institutionInfo.name || 'Educational Institution',
                domain: institutionInfo.domain || '',
                type: institutionInfo.type || 'institute'
            };
            yield user.save();
            logger_utils_1.logger.info('User verification confirmed via magic link', {
                userId: user._id,
                email: (0, Format_utils_1.maskEmail)(user.email),
                verificationStatus: user.verificationStatus
            });
        }
        // Update last login and activity
        yield user.updateLastLogin();
        user.activity.loginCount += 1;
        // ✅ Clear temporary password flag on successful magic link login
        if (user.hasTemporaryPassword) {
            user.hasTemporaryPassword = false;
            logger_utils_1.logger.info('Temporary password flag cleared for magic link user', {
                userId: user._id,
                email: (0, Format_utils_1.maskEmail)(user.email)
            });
        }
        yield user.save();
        // Generate session tokens
        const sessionId = generateSessionId();
        const tokens = (0, jwt_enhanced_1.generateTokenPair)(user._id.toString(), sessionId);
        // Store session in Redis
        yield redisClient.setex(`session:${sessionId}`, 7 * 24 * 60 * 60, JSON.stringify({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            lastLogin: new Date().toISOString(),
            verificationMethod: 'magic-link'
        }));
        // Cache user
        yield (0, Cache_utils_1.cacheUser)(user._id.toString(), {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            isOnboarded: user.isOnboarded,
            isVerified: user.isVerified,
            isActive: user.isActive
        });
        logger_utils_1.logger.info('Magic link authentication successful for verified student', {
            userId: user._id,
            email: (0, Format_utils_1.maskEmail)(user.email),
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
    }
    catch (error) {
        logger_utils_1.logger.error("Verify magic link error:", {
            error: error.message,
            stack: error.stack,
            email: req.body.email ? (0, Format_utils_1.maskEmail)(req.body.email) : 'unknown'
        });
        res.status(500).json({
            success: false,
            message: "Failed to verify magic link"
        });
    }
});
exports.verifyMagicLink = verifyMagicLink;
//# sourceMappingURL=auth.controllers.js.map