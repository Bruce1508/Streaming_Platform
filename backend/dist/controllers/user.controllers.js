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
exports.getRecommendedUsers = getRecommendedUsers;
exports.getMyFriends = getMyFriends;
exports.getMyProfile = getMyProfile;
exports.updateMyProfile = updateMyProfile;
exports.searchUsers = searchUsers;
exports.removeFriend = removeFriend;
exports.getUserStats = getUserStats;
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const Format_utils_1 = require("../utils/Format.utils");
const Search_utils_1 = require("../utils/Search.utils");
const Api_utils_1 = require("../utils/Api.utils");
// ===== UTILITY FUNCTIONS =====
const safeObjectId = (id) => {
    try {
        return new mongoose_1.default.Types.ObjectId(id);
    }
    catch (_a) {
        return null;
    }
};
// ===== RECOMMENDATION SYSTEM =====
function getRecommendedUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        (0, Api_utils_1.logApiRequest)(req);
        const authReq = req;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        try {
            const currentUserId = authReq.user._id;
            const currentUser = authReq.user;
            const baseQuery = {
                $and: [
                    { _id: { $ne: currentUserId } },
                    { _id: { $nin: currentUser.friends } },
                    { isOnboarded: true },
                    { isActive: true },
                    { role: { $in: ['student', 'professor'] } }
                ],
            };
            let recommendedUsers = [];
            // Same School, Different Programs
            if (currentUser.role === 'student' && ((_a = currentUser.academic) === null || _a === void 0 ? void 0 : _a.school)) {
                const sameSchoolUsers = yield User_1.default.find(Object.assign(Object.assign({}, baseQuery), { 'academic.school': currentUser.academic.school, 'academic.program': { $ne: (_b = currentUser.academic) === null || _b === void 0 ? void 0 : _b.program } }))
                    .select('fullName email profilePic role bio location academic activity')
                    .populate('academic.school', 'name location')
                    .populate('academic.program', 'name code')
                    .limit(8);
                recommendedUsers.push(...sameSchoolUsers);
            }
            // Same Program, Different Semesters
            if (currentUser.role === 'student' && ((_c = currentUser.academic) === null || _c === void 0 ? void 0 : _c.program)) {
                const sameProgramUsers = yield User_1.default.find(Object.assign(Object.assign({}, baseQuery), { 'academic.program': currentUser.academic.program, 'academic.currentSemester': { $ne: (_d = currentUser.academic) === null || _d === void 0 ? void 0 : _d.currentSemester }, _id: { $nin: recommendedUsers.map(u => u._id) } }))
                    .select('fullName email profilePic role bio location academic activity')
                    .populate('academic.school', 'name location')
                    .populate('academic.program', 'name code')
                    .limit(6);
                recommendedUsers.push(...sameProgramUsers);
            }
            // High Contributors
            if (recommendedUsers.length < 12) {
                const topContributors = yield User_1.default.find(Object.assign(Object.assign({}, baseQuery), { 'activity.contributionScore': { $gte: 50 }, _id: { $nin: recommendedUsers.map(u => u._id) } }))
                    .select('fullName email profilePic role bio location academic activity')
                    .populate('academic.school', 'name location')
                    .populate('academic.program', 'name code')
                    .sort({ 'activity.contributionScore': -1 })
                    .limit(6);
                recommendedUsers.push(...topContributors);
            }
            // Fill with Active Academic Users
            if (recommendedUsers.length < 15) {
                const remainingUsers = yield User_1.default.find(Object.assign(Object.assign({}, baseQuery), { _id: { $nin: recommendedUsers.map(u => u._id) } }))
                    .select('fullName email profilePic role bio location academic activity')
                    .populate('academic.school', 'name location')
                    .populate('academic.program', 'name code')
                    .sort({ 'activity.contributionScore': -1, lastLogin: -1 })
                    .limit(15 - recommendedUsers.length);
                recommendedUsers.push(...remainingUsers);
            }
            const enhancedUsers = recommendedUsers.map(user => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                return ({
                    _id: user._id,
                    fullName: (0, Format_utils_1.capitalize)(user.fullName),
                    email: (0, Format_utils_1.maskEmail)(user.email),
                    profilePic: user.profilePic,
                    role: user.role,
                    bio: user.bio ? (0, Format_utils_1.truncate)(user.bio, 100) : null,
                    location: user.location,
                    academic: user.academic,
                    contributionLevel: user.contributionLevel,
                    academicInfo: user.academicInfo,
                    activity: {
                        contributionScore: ((_a = user.activity) === null || _a === void 0 ? void 0 : _a.contributionScore) || 0,
                        uploadCount: ((_b = user.activity) === null || _b === void 0 ? void 0 : _b.uploadCount) || 0
                    },
                    academicMatch: {
                        sameSchool: ((_d = (_c = user.academic) === null || _c === void 0 ? void 0 : _c.school) === null || _d === void 0 ? void 0 : _d.toString()) === ((_f = (_e = currentUser.academic) === null || _e === void 0 ? void 0 : _e.school) === null || _f === void 0 ? void 0 : _f.toString()),
                        sameProgram: ((_h = (_g = user.academic) === null || _g === void 0 ? void 0 : _g.program) === null || _h === void 0 ? void 0 : _h.toString()) === ((_k = (_j = currentUser.academic) === null || _j === void 0 ? void 0 : _j.program) === null || _k === void 0 ? void 0 : _k.toString()),
                        isContributor: (((_l = user.activity) === null || _l === void 0 ? void 0 : _l.contributionScore) || 0) >= 50
                    }
                });
            });
            return res.status(200).json({
                success: true,
                users: enhancedUsers,
                total: enhancedUsers.length,
                recommendationStrategies: {
                    sameSchool: enhancedUsers.filter(u => u.academicMatch.sameSchool).length,
                    sameProgram: enhancedUsers.filter(u => u.academicMatch.sameProgram).length,
                    contributors: enhancedUsers.filter(u => u.academicMatch.isContributor).length
                }
            });
        }
        catch (error) {
            console.error("Error in getRecommendedUsers controller:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
// ===== FRIENDS MANAGEMENT =====
function getMyFriends(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const authReq = req;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        try {
            const user = yield User_1.default.findById(authReq.user._id)
                .select("friends")
                .populate({
                path: "friends",
                select: "fullName profilePic role bio location academic activity",
                populate: [
                    { path: 'academic.school', select: 'name location' },
                    { path: 'academic.program', select: 'name code' }
                ]
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            const enhancedFriends = user.friends.map((friend) => {
                var _a, _b;
                return ({
                    _id: friend._id,
                    fullName: friend.fullName,
                    profilePic: friend.profilePic,
                    role: friend.role,
                    bio: friend.bio,
                    location: friend.location,
                    academic: friend.academic,
                    academicInfo: friend.academicInfo,
                    contributionLevel: friend.contributionLevel,
                    activity: {
                        contributionScore: ((_a = friend.activity) === null || _a === void 0 ? void 0 : _a.contributionScore) || 0,
                        uploadCount: ((_b = friend.activity) === null || _b === void 0 ? void 0 : _b.uploadCount) || 0
                    }
                });
            });
            return res.status(200).json({
                success: true,
                friends: enhancedFriends,
                total: enhancedFriends.length
            });
        }
        catch (error) {
            console.error("Error in getMyFriends controller:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
// ===== PROFILE MANAGEMENT =====
function getMyProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const authReq = req;
            const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            const user = yield User_1.default.findById(userId)
                .select("-password")
                .populate([
                { path: 'academic.school', select: 'name location website' },
                { path: 'academic.program', select: 'name code description' },
                { path: 'savedMaterials', select: 'title category', options: { limit: 5 } }
            ]);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            const profileResponse = {
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
                academic: user.academic,
                academicInfo: user.academicInfo,
                activity: user.activity,
                studyStats: user.studyStats,
                contributionLevel: user.contributionLevel,
                preferences: user.preferences,
                friendsCount: user.friends.length,
                savedMaterialsCount: user.savedMaterials.length,
                uploadedMaterialsCount: user.uploadedMaterials.length,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
            return res.status(200).json({
                success: true,
                user: profileResponse
            });
        }
        catch (error) {
            console.error("Error in getMyProfile:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
function updateMyProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const authReq = req;
            const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            const { fullName, bio, location, website, academic, preferences } = req.body;
            const updateData = {};
            if (fullName)
                updateData.fullName = (0, Format_utils_1.capitalize)(fullName);
            if (bio !== undefined)
                updateData.bio = bio;
            if (location)
                updateData.location = location;
            if (website)
                updateData.website = website;
            if (academic)
                updateData.academic = academic;
            if (preferences)
                updateData.preferences = preferences;
            const updatedUser = yield User_1.default.findByIdAndUpdate(userId, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true, runValidators: true })
                .select("-password")
                .populate([
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
                user: updatedUser
            });
        }
        catch (error) {
            console.error("Error in updateMyProfile:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
function searchUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const authReq = req;
            const currentUserId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!currentUserId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            const { search = '', role, school, program, semester, sortBy = 'relevance', limit = 25 } = req.query;
            const trimmedQuery = search.trim();
            const limitNum = Math.min(parseInt(limit) || 25, 50);
            const baseQuery = {
                $and: [
                    { _id: { $ne: currentUserId } },
                    { isOnboarded: true },
                    { isActive: true }
                ]
            };
            if (trimmedQuery) {
                baseQuery.$and.push({
                    $or: [
                        { fullName: { $regex: trimmedQuery, $options: 'i' } },
                        { email: { $regex: trimmedQuery, $options: 'i' } },
                        { bio: { $regex: trimmedQuery, $options: 'i' } }
                    ]
                });
            }
            if (role)
                baseQuery.$and.push({ role: role });
            if (school)
                baseQuery.$and.push({ 'academic.school': school });
            if (program)
                baseQuery.$and.push({ 'academic.program': program });
            if (semester)
                baseQuery.$and.push({ 'academic.currentSemester': parseInt(semester) });
            const searchQuery = baseQuery;
            const users = yield User_1.default.find(searchQuery)
                .select('fullName email profilePic role bio location academic activity lastLogin')
                .populate([
                { path: 'academic.school', select: 'name location' },
                { path: 'academic.program', select: 'name code' }
            ])
                .sort({ 'activity.contributionScore': -1, lastLogin: -1 })
                .limit(limitNum)
                .lean();
            const enhancedUsers = users.map((user) => {
                var _a, _b, _c, _d;
                return ({
                    _id: user._id,
                    fullName: (0, Format_utils_1.capitalize)(user.fullName),
                    email: (0, Format_utils_1.maskEmail)(user.email),
                    profilePic: user.profilePic,
                    role: user.role,
                    bio: user.bio ? (0, Format_utils_1.truncate)(user.bio, 100) : null,
                    location: user.location,
                    academic: user.academic,
                    academicInfo: user.academicInfo,
                    contributionLevel: user.contributionLevel,
                    activity: {
                        contributionScore: ((_a = user.activity) === null || _a === void 0 ? void 0 : _a.contributionScore) || 0,
                        uploadCount: ((_b = user.activity) === null || _b === void 0 ? void 0 : _b.uploadCount) || 0
                    },
                    relevanceScore: {
                        searchScore: (0, Search_utils_1.calculateRelevanceScore)(user, trimmedQuery, {
                            fullName: 3,
                            email: 2,
                            bio: 1,
                            'academic.studentId': 2
                        }),
                        isContributor: (((_c = user.activity) === null || _c === void 0 ? void 0 : _c.contributionScore) || 0) >= 10,
                        isActive: user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                        hasProfile: !!(user.bio && ((_d = user.academic) === null || _d === void 0 ? void 0 : _d.program))
                    }
                });
            });
            return res.status(200).json({
                success: true,
                users: enhancedUsers,
                total: enhancedUsers.length,
                filters: {
                    query: trimmedQuery,
                    role: role || null,
                    school: school || null,
                    program: program || null,
                    semester: semester || null,
                    sortBy
                },
                stats: {
                    contributors: enhancedUsers.filter((u) => u.relevanceScore.isContributor).length,
                    activeUsers: enhancedUsers.filter((u) => u.relevanceScore.isActive).length,
                    completeProfiles: enhancedUsers.filter((u) => u.relevanceScore.hasProfile).length
                }
            });
        }
        catch (error) {
            console.error("Error in searchUsers controller:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
function removeFriend(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const authReq = req;
            const currentUserId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            const { friendId } = req.params;
            if (!currentUserId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            const validFriendId = safeObjectId(friendId);
            if (!validFriendId) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid friend ID"
                });
            }
            const currentUser = yield User_1.default.findById(currentUserId).select('friends');
            if (!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.friends.some(id => id.toString() === friendId))) {
                return res.status(400).json({
                    success: false,
                    message: "You are not friends with this user"
                });
            }
            yield Promise.all([
                User_1.default.findByIdAndUpdate(currentUserId, {
                    $pull: { friends: friendId }
                }),
                User_1.default.findByIdAndUpdate(friendId, {
                    $pull: { friends: currentUserId }
                })
            ]);
            console.log(`✅ Friend removed: ${currentUserId} <-> ${friendId}`);
            return res.status(200).json({
                success: true,
                message: "Friend removed successfully"
            });
        }
        catch (error) {
            console.error("Error in removeFriend:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
function getUserStats(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            const authReq = req;
            const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            const user = yield User_1.default.findById(userId)
                .select('activity studyStats friends savedMaterials uploadedMaterials academic role')
                .populate('savedMaterials', 'title category createdAt')
                .populate('uploadedMaterials', 'title category createdAt')
                .populate('academic.school', 'name')
                .populate('academic.program', 'name code');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            const recentUploads = user.uploadedMaterials.filter((material) => new Date(material.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
            const recentSaves = user.savedMaterials.filter((material) => new Date(material.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
            const completedCoursesCount = ((_c = (_b = user.academic) === null || _b === void 0 ? void 0 : _b.completedCourses) === null || _c === void 0 ? void 0 : _c.length) || 0;
            const currentSemester = ((_d = user.academic) === null || _d === void 0 ? void 0 : _d.currentSemester) || 0;
            const enrollmentYear = ((_e = user.academic) === null || _e === void 0 ? void 0 : _e.enrollmentYear) || new Date().getFullYear();
            const academicYearsActive = new Date().getFullYear() - enrollmentYear + 1;
            const stats = {
                activity: user.activity,
                contributionLevel: user.contributionLevel,
                studyStats: user.studyStats,
                friendsCount: user.friends.length,
                totalSavedMaterials: user.savedMaterials.length,
                totalUploadedMaterials: user.uploadedMaterials.length,
                recentUploads: recentUploads,
                recentSaves: recentSaves,
                academicStats: {
                    completedCourses: completedCoursesCount,
                    currentSemester: currentSemester,
                    enrollmentYear: enrollmentYear,
                    academicYearsActive: academicYearsActive,
                    academicStatus: ((_f = user.academic) === null || _f === void 0 ? void 0 : _f.status) || 'active',
                    hasProgram: !!((_g = user.academic) === null || _g === void 0 ? void 0 : _g.program),
                    hasSchool: !!((_h = user.academic) === null || _h === void 0 ? void 0 : _h.school)
                },
                engagementScore: user.activity.contributionScore + (user.friends.length * 5) + (completedCoursesCount * 2),
                academicPerformance: {
                    coursesPerYear: academicYearsActive > 0 ? Math.round((completedCoursesCount / academicYearsActive) * 10) / 10 : 0,
                    contributionsPerSemester: currentSemester > 0 ? Math.round((user.activity.uploadCount / currentSemester) * 10) / 10 : 0,
                    studyEfficiency: user.studyStats.materialsViewed > 0 ? Math.round((user.studyStats.materialsSaved / user.studyStats.materialsViewed) * 100) : 0
                },
                summary: {
                    isActiveContributor: user.activity.contributionScore > 100,
                    isActiveLearner: user.studyStats.materialsViewed > 50,
                    isSocialUser: user.friends.length > 10,
                    hasRecentActivity: recentUploads > 0 || recentSaves > 0,
                    isAcademicUser: !!(((_j = user.academic) === null || _j === void 0 ? void 0 : _j.program) && ((_k = user.academic) === null || _k === void 0 ? void 0 : _k.school)),
                    isActiveStudent: user.role === 'student' && ((_l = user.academic) === null || _l === void 0 ? void 0 : _l.status) === 'active',
                    hasAcademicProgress: completedCoursesCount > 0,
                    isContributingStudent: user.role === 'student' && user.activity.contributionScore > 50
                }
            };
            return res.status(200).json({
                success: true,
                stats
            });
        }
        catch (error) {
            console.error("Error in getUserStats:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
//# sourceMappingURL=user.controllers.js.map