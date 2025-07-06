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
exports.handleOAuth = exports.logoutAllDevices = exports.logout = exports.refreshToken = exports.resetPassword = exports.forgotPassword = exports.getAllUsers = exports.updateProfile = exports.getMe = exports.signIn = exports.signUp = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_enhanced_1 = require("../utils/jwt.enhanced");
const crypto_1 = __importDefault(require("crypto"));
const Api_utils_1 = require("../utils/Api.utils");
const Cache_utils_1 = require("../utils/Cache.utils");
const Format_utils_1 = require("../utils/Format.utils");
const logger_utils_1 = require("../utils/logger.utils");
const Random_utils_1 = require("../utils/Random.utils");
const ioredis_1 = __importDefault(require("ioredis"));
// ✅ Helper function to generate secure session ID
const generateSessionId = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
const redisClient = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
// ✅ ENHANCED signUp with utils integration
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, Api_utils_1.logApiRequest)(req);
        const { email, password, fullName, role = 'student', academic } = req.body;
        // Check if user exists
        const existingUser = yield User_1.default.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
            return;
        }
        // ✅ Enhanced user data with utils
        const userData = {
            fullName: (0, Format_utils_1.capitalize)(fullName),
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
                studentId: academic.studentId || (role === 'student' ? (0, Random_utils_1.generateStudentId)() : undefined),
                school: academic.school,
                program: academic.program,
                currentSemester: academic.currentSemester,
                enrollmentYear: academic.enrollmentYear,
                completedCourses: [],
                status: 'active'
            };
        }
        const newUser = new User_1.default(userData);
        yield newUser.save();
        // ✅ Generate secure session and enhanced tokens
        const sessionId = generateSessionId();
        const tokens = (0, jwt_enhanced_1.generateTokenPair)(newUser._id.toString(), sessionId);
        // ✅ Store session in Redis with user info
        yield redisClient.setex(`session:${sessionId}`, 7 * 24 * 60 * 60, JSON.stringify({
            userId: newUser._id.toString(),
            email: newUser.email,
            role: newUser.role,
            createdAt: new Date().toISOString()
        }));
        // ✅ Cache user with utils
        yield (0, Cache_utils_1.cacheUser)(newUser._id.toString(), {
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            role: newUser.role,
            isOnboarded: newUser.isOnboarded,
            isVerified: newUser.isVerified
        });
        // ✅ Enhanced logging with masked email
        logger_utils_1.logger.info('User registered successfully', {
            userId: newUser._id,
            email: (0, Format_utils_1.maskEmail)(newUser.email),
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
    }
    catch (error) {
        logger_utils_1.logger.error("Signup error:", error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.signUp = signUp;
// ✅ ENHANCED signIn with utils integration
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, Api_utils_1.logApiRequest)(req);
        const { email, password, rememberMe = false } = req.body;
        const user = yield User_1.default.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user || !(yield user.matchPassword(password))) {
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
        yield user.updateLastLogin();
        user.activity.loginCount += 1;
        yield user.save();
        // ✅ Generate secure session and enhanced tokens  
        const sessionId = generateSessionId();
        const tokens = (0, jwt_enhanced_1.generateTokenPair)(user._id.toString(), sessionId);
        // ✅ Store session in Redis with user info
        yield redisClient.setex(`session:${sessionId}`, 7 * 24 * 60 * 60, JSON.stringify({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            lastLogin: new Date().toISOString()
        }));
        // ✅ Cache user after successful login
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
        // ✅ Enhanced logging with masked email
        logger_utils_1.logger.info('User signed in successfully', {
            userId: user._id,
            email: (0, Format_utils_1.maskEmail)(user.email)
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
    }
    catch (error) {
        logger_utils_1.logger.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
});
exports.signIn = signIn;
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
// ✅ ENHANCED forgotPassword with secure token generation
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, Api_utils_1.logApiRequest)(req);
        const { email } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        const user = yield User_1.default.findOne({ email: normalizedEmail });
        if (!user) {
            logger_utils_1.logger.warn('Password reset requested for non-existent user', {
                email: (0, Format_utils_1.maskEmail)(normalizedEmail),
                ip: req.ip
            });
            res.status(200).json({
                success: true,
                message: "If an account with that email exists, we have sent a password reset link."
            });
            return;
        }
        // ✅ Generate secure token with utils
        const resetToken = (0, Random_utils_1.generateSecureToken)(32);
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        yield user.save();
        logger_utils_1.logger.info('Password reset token generated', {
            userId: user._id,
            email: (0, Format_utils_1.maskEmail)(user.email)
        });
        res.json({
            success: true,
            message: "Password reset link sent to your email"
        });
    }
    catch (error) {
        logger_utils_1.logger.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process password reset request"
        });
    }
});
exports.forgotPassword = forgotPassword;
// ✅ Continue with other functions...
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, Api_utils_1.logApiRequest)(req);
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
        const user = yield User_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
            return;
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save();
        logger_utils_1.logger.info('Password reset successful', {
            userId: user._id,
            email: (0, Format_utils_1.maskEmail)(user.email)
        });
        res.json({
            success: true,
            message: "Password reset successful. Please login with your new password."
        });
    }
    catch (error) {
        logger_utils_1.logger.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password"
        });
    }
});
exports.resetPassword = resetPassword;
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
// ✅ NEW OAUTH HANDLER for Google/Social login
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
        // Check if user exists
        let user = yield User_1.default.findOne({ email: normalizedEmail });
        if (user) {
            // Update existing user's OAuth info if needed
            if (!user.authProvider || user.authProvider === 'local') {
                user.authProvider = provider;
                user.profilePic = profilePic || user.profilePic;
                yield user.save();
            }
            // Update last login
            yield user.updateLastLogin();
            user.activity.loginCount += 1;
            yield user.save();
        }
        else {
            // Create new user from OAuth
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
            user = new User_1.default(userData);
            yield user.save();
        }
        // ✅ Generate secure session and enhanced tokens
        const sessionId = generateSessionId();
        console.log('🔑 OAuth - Generated sessionId:', sessionId);
        console.log('🔑 OAuth - User ID:', user._id.toString());
        const tokens = (0, jwt_enhanced_1.generateTokenPair)(user._id.toString(), sessionId);
        console.log('🔑 OAuth - Generated tokens:', {
            accessTokenLength: tokens.accessToken.length,
            refreshTokenLength: tokens.refreshToken.length
        });
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
//# sourceMappingURL=auth.controllers.js.map