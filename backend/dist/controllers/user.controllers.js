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
exports.sendFriendRequest = sendFriendRequest;
exports.acceptFriendRequest = acceptFriendRequest;
exports.getFriendRequests = getFriendRequests;
exports.getOutgoingFriendReqs = getOutgoingFriendReqs;
exports.rejectFriendRequest = rejectFriendRequest;
exports.cancelFriendRequest = cancelFriendRequest;
exports.getMyProfile = getMyProfile;
exports.updateMyProfile = updateMyProfile;
exports.updateProfilePicture = updateProfilePicture;
exports.searchUsers = searchUsers;
exports.removeFriend = removeFriend;
exports.getUsersByProgram = getUsersByProgram;
exports.getTopContributors = getTopContributors;
exports.collectFriendData = collectFriendData;
exports.getUserStats = getUserStats;
const User_1 = __importDefault(require("../models/User"));
const friendRequest_1 = __importDefault(require("../models/friendRequest"));
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
        // ✅ Log API request
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
            // ✅ Academic-focused recommendation base query
            const baseQuery = {
                $and: [
                    { _id: { $ne: currentUserId } },
                    { _id: { $nin: currentUser.friends } },
                    { isOnboarded: true },
                    { isActive: true },
                    { role: { $in: ['student', 'professor'] } } // Only academic users
                ],
            };
            let recommendedUsers = [];
            // 🎯 Strategy 1: Same School, Different Programs (Academic Diversity)
            if (currentUser.role === 'student' && ((_a = currentUser.academic) === null || _a === void 0 ? void 0 : _a.school)) {
                const sameSchoolUsers = yield User_1.default.find(Object.assign(Object.assign({}, baseQuery), { 'academic.school': currentUser.academic.school, 'academic.program': { $ne: (_b = currentUser.academic) === null || _b === void 0 ? void 0 : _b.program } // Different programs
                 }))
                    .select('fullName email profilePic role bio location academic activity')
                    .populate('academic.school', 'name location')
                    .populate('academic.program', 'name code')
                    .limit(8);
                recommendedUsers.push(...sameSchoolUsers);
            }
            // 🎯 Strategy 2: Same Program, Different Semesters (Study Buddies)
            if (currentUser.role === 'student' && ((_c = currentUser.academic) === null || _c === void 0 ? void 0 : _c.program)) {
                const sameProgramUsers = yield User_1.default.find(Object.assign(Object.assign({}, baseQuery), { 'academic.program': currentUser.academic.program, 'academic.currentSemester': { $ne: (_d = currentUser.academic) === null || _d === void 0 ? void 0 : _d.currentSemester }, _id: { $nin: recommendedUsers.map(u => u._id) } }))
                    .select('fullName email profilePic role bio location academic activity')
                    .populate('academic.school', 'name location')
                    .populate('academic.program', 'name code')
                    .limit(6);
                recommendedUsers.push(...sameProgramUsers);
            }
            // 🎯 Strategy 3: High Contributors (Academic Excellence)
            if (recommendedUsers.length < 12) {
                const topContributors = yield User_1.default.find(Object.assign(Object.assign({}, baseQuery), { 'activity.contributionScore': { $gte: 50 }, _id: { $nin: recommendedUsers.map(u => u._id) } }))
                    .select('fullName email profilePic role bio location academic activity')
                    .populate('academic.school', 'name location')
                    .populate('academic.program', 'name code')
                    .sort({ 'activity.contributionScore': -1 })
                    .limit(6);
                recommendedUsers.push(...topContributors);
            }
            // 🎯 Strategy 4: Fill with Active Academic Users
            if (recommendedUsers.length < 15) {
                const remainingUsers = yield User_1.default.find(Object.assign(Object.assign({}, baseQuery), { _id: { $nin: recommendedUsers.map(u => u._id) } }))
                    .select('fullName email profilePic role bio location academic activity')
                    .populate('academic.school', 'name location')
                    .populate('academic.program', 'name code')
                    .sort({ 'activity.contributionScore': -1, lastLogin: -1 })
                    .limit(15 - recommendedUsers.length);
                recommendedUsers.push(...remainingUsers);
            }
            // ✅ Clean academic-focused response with formatting
            const enhancedUsers = recommendedUsers.map(user => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                return ({
                    _id: user._id,
                    fullName: (0, Format_utils_1.capitalize)(user.fullName), // ✅ Format name
                    email: (0, Format_utils_1.maskEmail)(user.email), // ✅ Mask email for privacy
                    profilePic: user.profilePic,
                    role: user.role,
                    bio: user.bio ? (0, Format_utils_1.truncate)(user.bio, 100) : null, // ✅ Truncate bio
                    location: user.location,
                    academic: user.academic,
                    contributionLevel: user.contributionLevel, // Virtual field
                    academicInfo: user.academicInfo, // Virtual field
                    activity: {
                        contributionScore: ((_a = user.activity) === null || _a === void 0 ? void 0 : _a.contributionScore) || 0,
                        uploadCount: ((_b = user.activity) === null || _b === void 0 ? void 0 : _b.uploadCount) || 0
                    },
                    // ✅ Academic similarity indicators
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
            // ✅ Enhanced friends data
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
                    academicInfo: friend.academicInfo, // Virtual field
                    contributionLevel: friend.contributionLevel, // Virtual field
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
// ===== FRIEND REQUESTS =====
function sendFriendRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const authReq = req;
        const senderId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
        const { id: recipientId } = req.params;
        if (!senderId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        // ✅ Validate recipient ID
        const validRecipientId = safeObjectId(recipientId);
        if (!validRecipientId) {
            return res.status(400).json({
                success: false,
                message: "Invalid recipient ID"
            });
        }
        // ✅ Check if trying to send to self
        if (senderId.toString() === recipientId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a friend request to yourself"
            });
        }
        try {
            const recipient = yield User_1.default.findById(recipientId).select('fullName friends isActive');
            if (!recipient || !recipient.isActive) {
                return res.status(404).json({
                    success: false,
                    message: "User not found or inactive"
                });
            }
            // ✅ Check if already friends
            if (recipient.friends.some(friendId => friendId.toString() === senderId.toString())) {
                return res.status(400).json({
                    success: false,
                    message: "You are already friends with this user"
                });
            }
            // ✅ Check for existing requests
            const existingRequest = yield friendRequest_1.default.findOne({
                $or: [
                    { sender: senderId, recipient: recipientId },
                    { sender: recipientId, recipient: senderId },
                ],
                status: 'pending'
            });
            if (existingRequest) {
                return res.status(400).json({
                    success: false,
                    message: "A friend request already exists between you and this user"
                });
            }
            const friend_request = yield friendRequest_1.default.create({
                sender: senderId,
                recipient: recipientId,
            });
            console.log('✅ Friend request sent successfully:', friend_request._id);
            return res.status(201).json({
                success: true,
                message: "Friend request sent successfully",
                sentTo: recipient.fullName,
                friendRequest: {
                    _id: friend_request._id,
                    sender: senderId,
                    recipient: recipientId,
                    status: friend_request.status,
                    createdAt: friend_request.createdAt
                }
            });
        }
        catch (error) {
            console.error("❌ Error in sendFriendRequest controller:", error.message);
            return res.status(500).json({
                success: false,
                message: "Failed to send friend request"
            });
        }
    });
}
function acceptFriendRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const authReq = req;
            const { id: requestId } = req.params;
            const currentUserId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!currentUserId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            // ✅ Validate request ID
            const validRequestId = safeObjectId(requestId);
            if (!validRequestId) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request ID"
                });
            }
            // ✅ Find and validate friend request
            const friend_request = yield friendRequest_1.default.findById(requestId);
            if (!friend_request) {
                return res.status(404).json({
                    success: false,
                    message: "Friend request not found"
                });
            }
            // ✅ Authorization check
            if (friend_request.recipient.toString() !== currentUserId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to accept this request"
                });
            }
            // ✅ Status check
            if (friend_request.status === 'accepted') {
                return res.status(400).json({
                    success: false,
                    message: "Friend request already accepted"
                });
            }
            // ✅ Update request status and add friends
            friend_request.status = "accepted";
            yield friend_request.save();
            // ✅ Use atomic operations for consistency
            yield Promise.all([
                User_1.default.findByIdAndUpdate(friend_request.sender, {
                    $addToSet: { friends: friend_request.recipient },
                }),
                User_1.default.findByIdAndUpdate(friend_request.recipient, {
                    $addToSet: { friends: friend_request.sender },
                })
            ]);
            // ✅ Get friend info to return
            const newFriend = yield User_1.default.findById(friend_request.sender)
                .select('fullName profilePic role academic')
                .populate('academic.school', 'name')
                .populate('academic.program', 'name');
            console.log('✅ Friend request accepted successfully');
            return res.status(200).json({
                success: true,
                message: "Friend request accepted",
                newFriend: newFriend
            });
        }
        catch (error) {
            console.error("❌ Error in acceptFriendRequest controller:", error.message);
            return res.status(500).json({
                success: false,
                message: "Failed to accept friend request"
            });
        }
    });
}
function getFriendRequests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const authReq = req;
        const recipientId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!recipientId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        try {
            // ✅ Get incoming requests with enhanced user info
            const incomingRequests = yield friendRequest_1.default.find({
                recipient: recipientId,
                status: "pending",
            })
                .populate({
                path: "sender",
                select: "fullName profilePic role bio location academic activity",
                populate: [
                    { path: 'academic.school', select: 'name location' },
                    { path: 'academic.program', select: 'name code' }
                ]
            })
                .sort({ createdAt: -1 });
            // ✅ Get accepted requests for notification purposes
            const recentlyAccepted = yield friendRequest_1.default.find({
                recipient: recipientId,
                status: "accepted",
                updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
            })
                .populate("sender", "fullName profilePic")
                .sort({ updatedAt: -1 });
            // ✅ Enhanced request data
            const enhancedIncoming = incomingRequests.map(request => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return ({
                    _id: request._id,
                    sender: (typeof request.sender === 'object' && request.sender !== null && 'fullName' in request.sender)
                        ? {
                            _id: (_a = request.sender) === null || _a === void 0 ? void 0 : _a._id,
                            fullName: (_b = request.sender) === null || _b === void 0 ? void 0 : _b.fullName,
                            profilePic: (_c = request.sender) === null || _c === void 0 ? void 0 : _c.profilePic,
                            role: (_d = request.sender) === null || _d === void 0 ? void 0 : _d.role,
                            bio: (_e = request.sender) === null || _e === void 0 ? void 0 : _e.bio,
                            location: (_f = request.sender) === null || _f === void 0 ? void 0 : _f.location,
                            academic: (_g = request.sender) === null || _g === void 0 ? void 0 : _g.academic,
                            academicInfo: (_h = request.sender) === null || _h === void 0 ? void 0 : _h.academicInfo, // Virtual field
                            contributionLevel: (_j = request.sender) === null || _j === void 0 ? void 0 : _j.contributionLevel, // Virtual field
                        }
                        : null,
                    status: request.status,
                    createdAt: request.createdAt
                });
            });
            return res.status(200).json({
                success: true,
                incomingRequests: enhancedIncoming,
                recentlyAccepted: recentlyAccepted,
                counts: {
                    pending: enhancedIncoming.length,
                    recentlyAccepted: recentlyAccepted.length
                }
            });
        }
        catch (error) {
            console.error("Error in getFriendRequests controller:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
function getOutgoingFriendReqs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const authReq = req;
        const senderId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!senderId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        try {
            const pendingRequests = yield friendRequest_1.default.find({
                sender: senderId,
                status: "pending",
            })
                .populate({
                path: "recipient",
                select: "fullName profilePic learning role academic",
                populate: [
                    { path: 'academic.school', select: 'name' },
                    { path: 'academic.program', select: 'name' }
                ]
            })
                .sort({ createdAt: -1 });
            const enhancedRequests = pendingRequests.map(request => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    _id: request._id,
                    recipient: (typeof request.recipient === 'object' && request.recipient !== null && 'fullName' in request.recipient)
                        ? {
                            _id: (_a = request.recipient) === null || _a === void 0 ? void 0 : _a._id,
                            fullName: (_b = request.recipient) === null || _b === void 0 ? void 0 : _b.fullName,
                            profilePic: (_c = request.recipient) === null || _c === void 0 ? void 0 : _c.profilePic,
                            role: (_d = request.recipient) === null || _d === void 0 ? void 0 : _d.role,
                            academic: (_e = request.recipient) === null || _e === void 0 ? void 0 : _e.academic,
                            academicInfo: (_f = request.recipient) === null || _f === void 0 ? void 0 : _f.academicInfo, // Virtual field
                        }
                        : null,
                    status: request.status,
                    createdAt: request.createdAt
                });
            });
            return res.status(200).json({
                success: true,
                requests: enhancedRequests,
                total: enhancedRequests.length
            });
        }
        catch (error) {
            console.error("Error in getOutgoingFriendReqs controller:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
function rejectFriendRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const authReq = req;
            const { id: requestId } = req.params;
            const currentUserId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!currentUserId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            // ✅ Validate request ID
            const validRequestId = safeObjectId(requestId);
            if (!validRequestId) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request ID"
                });
            }
            const friend_request = yield friendRequest_1.default.findById(requestId);
            if (!friend_request) {
                return res.status(404).json({
                    success: false,
                    message: "Friend request not found"
                });
            }
            // ✅ Authorization check
            if (friend_request.recipient.toString() !== currentUserId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to reject this request"
                });
            }
            // ✅ Status check
            if (friend_request.status !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: "Friend request already processed"
                });
            }
            // ✅ Delete the request
            yield friendRequest_1.default.findByIdAndDelete(requestId);
            console.log('✅ Friend request rejected and deleted successfully');
            return res.status(200).json({
                success: true,
                message: "Friend request rejected"
            });
        }
        catch (error) {
            console.error("❌ Error in rejectFriendRequest controller:", error.message);
            return res.status(500).json({
                success: false,
                message: "Failed to reject friend request"
            });
        }
    });
}
function cancelFriendRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const authReq = req;
            const { id: recipientId } = req.params;
            const senderId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!senderId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            // ✅ Validate recipient ID
            const validRecipientId = safeObjectId(recipientId);
            if (!validRecipientId) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid recipient ID"
                });
            }
            const friend_request = yield friendRequest_1.default.findOne({
                sender: senderId,
                recipient: recipientId,
                status: 'pending'
            });
            if (!friend_request) {
                return res.status(404).json({
                    success: false,
                    message: "Friend request not found"
                });
            }
            yield friendRequest_1.default.findByIdAndDelete(friend_request._id);
            console.log('✅ Friend request cancelled successfully');
            return res.status(200).json({
                success: true,
                message: "Friend request cancelled"
            });
        }
        catch (error) {
            console.error("❌ Error in cancelFriendRequest controller:", error.message);
            return res.status(500).json({
                success: false,
                message: "Failed to cancel friend request"
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
                // ✅ Academic information
                academic: user.academic,
                academicInfo: user.academicInfo, // Virtual field
                // ✅ Activity & Stats
                activity: user.activity,
                studyStats: user.studyStats,
                contributionLevel: user.contributionLevel, // Virtual field
                // ✅ Preferences
                preferences: user.preferences,
                // ✅ Counts
                friendsCount: user.friends.length,
                savedMaterialsCount: user.savedMaterials.length,
                uploadedMaterialsCount: user.uploadedMaterials.length,
                // ✅ Timestamps
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
            const { fullName, bio, location, website, preferences, academic // ✅ Added academic updates
             } = req.body;
            const updates = {};
            // ✅ Validate and update basic fields
            if (fullName !== undefined) {
                if (fullName.trim().length < 2) {
                    return res.status(400).json({
                        success: false,
                        message: "Full name must be at least 2 characters"
                    });
                }
                updates.fullName = fullName.trim();
            }
            if (bio !== undefined) {
                if (bio.length > 500) {
                    return res.status(400).json({
                        success: false,
                        message: "Bio must be less than 500 characters"
                    });
                }
                updates.bio = bio.trim();
            }
            if (location !== undefined) {
                if (location.length > 100) {
                    return res.status(400).json({
                        success: false,
                        message: "Location must be less than 100 characters"
                    });
                }
                updates.location = location.trim();
            }
            if (website !== undefined) {
                if (website && !website.match(/^https?:\/\/.+/)) {
                    return res.status(400).json({
                        success: false,
                        message: "Website must be a valid URL starting with http:// or https://"
                    });
                }
                updates.website = website;
            }
            // ✅ Academic updates (new feature)
            if (academic && typeof academic === 'object') {
                const currentUser = yield User_1.default.findById(userId).select('academic');
                const currentAcademic = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.academic) || {};
                // Validate academic updates
                if (academic.studentId !== undefined) {
                    if (academic.studentId && !/^[A-Z0-9]+$/.test(academic.studentId)) {
                        return res.status(400).json({
                            success: false,
                            message: "Student ID can only contain letters and numbers"
                        });
                    }
                }
                if (academic.currentSemester !== undefined) {
                    const semester = parseInt(academic.currentSemester);
                    if (isNaN(semester) || semester < 1 || semester > 8) {
                        return res.status(400).json({
                            success: false,
                            message: "Current semester must be between 1 and 8"
                        });
                    }
                }
                updates.academic = Object.assign(Object.assign({}, currentAcademic), academic);
            }
            // ✅ Preferences update
            if (preferences && typeof preferences === 'object') {
                const currentUser = yield User_1.default.findById(userId).select('preferences');
                updates.preferences = Object.assign(Object.assign({}, currentUser === null || currentUser === void 0 ? void 0 : currentUser.preferences), preferences);
            }
            const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true })
                .select("-password")
                .populate([
                { path: 'academic.school', select: 'name location' },
                { path: 'academic.program', select: 'name code' }
            ]);
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                user: {
                    _id: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id,
                    fullName: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.fullName,
                    email: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.email,
                    role: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.role,
                    profilePic: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.profilePic,
                    bio: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.bio,
                    location: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.location,
                    website: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.website,
                    academic: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.academic,
                    academicInfo: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.academicInfo, // Virtual field
                    contributionLevel: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.contributionLevel, // Virtual field
                    preferences: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.preferences
                }
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
function updateProfilePicture(req, res) {
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
            const { profilePic } = req.body;
            if (!profilePic) {
                return res.status(400).json({
                    success: false,
                    message: "Profile picture URL is required"
                });
            }
            // ✅ Basic URL validation
            if (!profilePic.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) {
                return res.status(400).json({
                    success: false,
                    message: "Profile picture must be a valid image URL"
                });
            }
            const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { profilePic }, { new: true }).select("-password");
            return res.status(200).json({
                success: true,
                message: "Profile picture updated successfully",
                user: {
                    _id: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id,
                    fullName: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.fullName,
                    profilePic: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.profilePic
                }
            });
        }
        catch (error) {
            console.error("Error in updateProfilePicture:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
// ===== SEARCH & DISCOVERY =====
function searchUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // ✅ Log API request
        (0, Api_utils_1.logApiRequest)(req);
        const authReq = req;
        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        try {
            const { q, role, school, program, semester, sortBy = 'relevance' } = req.query;
            const currentUserId = authReq.user._id;
            if (!q || typeof q !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: "Search query is required"
                });
            }
            const trimmedQuery = q.trim();
            if (trimmedQuery.length < 2) {
                return res.status(400).json({
                    success: false,
                    message: "Search query must be at least 2 characters long"
                });
            }
            // ✅ Get current user's friends to exclude
            const currentUser = yield User_1.default.findById(currentUserId).select('friends');
            const friendIds = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.friends) || [];
            // ✅ Build search query with simple approach
            const searchFields = ['fullName', 'email', 'bio', 'academic.studentId'];
            const searchOrConditions = (0, Search_utils_1.buildSearchQuery)(trimmedQuery, searchFields);
            const searchQuery = {
                $and: [
                    { _id: { $ne: currentUserId } },
                    { _id: { $nin: friendIds } },
                    { isOnboarded: true },
                    { isActive: true },
                    searchOrConditions
                ]
            };
            // ✅ Academic filters
            if (role && typeof role === 'string') {
                searchQuery.$and.push({ role: role });
            }
            if (school && typeof school === 'string') {
                searchQuery.$and.push({ 'academic.school': school });
            }
            if (program && typeof program === 'string') {
                searchQuery.$and.push({ 'academic.program': program });
            }
            if (semester && typeof semester === 'string') {
                const semesterNum = parseInt(semester);
                if (!isNaN(semesterNum)) {
                    searchQuery.$and.push({ 'academic.currentSemester': semesterNum });
                }
            }
            const users = yield User_1.default.find(searchQuery)
                .select('fullName email profilePic bio location role academic activity lastLogin')
                .populate([
                { path: 'academic.school', select: 'name location' },
                { path: 'academic.program', select: 'name code' }
            ])
                .sort({ 'activity.contributionScore': -1, lastLogin: -1 })
                .limit(25)
                .lean();
            // ✅ Get friend request statuses
            const friendRequests = yield friendRequest_1.default.find({
                $or: [
                    { sender: currentUserId, status: 'pending' },
                    { recipient: currentUserId, status: 'pending' }
                ]
            }).select('sender recipient');
            const pendingRequestsMap = new Map();
            friendRequests.forEach(req => {
                if (req.sender.toString() === currentUserId.toString()) {
                    pendingRequestsMap.set(req.recipient.toString(), 'sent');
                }
                else {
                    pendingRequestsMap.set(req.sender.toString(), 'received');
                }
            });
            // ✅ Enhanced response with formatting
            const enhancedUsers = users.map((user) => {
                var _a, _b, _c, _d;
                return ({
                    _id: user._id,
                    fullName: (0, Format_utils_1.capitalize)(user.fullName), // ✅ Format name
                    email: (0, Format_utils_1.maskEmail)(user.email), // ✅ Mask email for privacy
                    profilePic: user.profilePic,
                    role: user.role,
                    bio: user.bio ? (0, Format_utils_1.truncate)(user.bio, 100) : null, // ✅ Truncate bio
                    location: user.location,
                    academic: user.academic,
                    academicInfo: user.academicInfo, // Virtual field
                    contributionLevel: user.contributionLevel, // Virtual field
                    activity: {
                        contributionScore: ((_a = user.activity) === null || _a === void 0 ? void 0 : _a.contributionScore) || 0,
                        uploadCount: ((_b = user.activity) === null || _b === void 0 ? void 0 : _b.uploadCount) || 0
                    },
                    friendRequestStatus: pendingRequestsMap.get(user._id.toString()) || null,
                    // ✅ Academic relevance scores
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
            // ✅ Validate friend ID
            const validFriendId = safeObjectId(friendId);
            if (!validFriendId) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid friend ID"
                });
            }
            // ✅ Check if they are actually friends
            const currentUser = yield User_1.default.findById(currentUserId).select('friends');
            if (!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.friends.some(id => id.toString() === friendId))) {
                return res.status(400).json({
                    success: false,
                    message: "You are not friends with this user"
                });
            }
            // ✅ Remove friend from both users atomically
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
// ===== ACADEMIC & STUDY FEATURES =====
function getUsersByProgram(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const authReq = req;
            const { programId } = req.params;
            const currentUserId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!currentUserId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            // ✅ Validate program ID
            const validProgramId = safeObjectId(programId);
            if (!validProgramId) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid program ID"
                });
            }
            const users = yield User_1.default.find({
                'academic.program': programId,
                isActive: true,
                isVerified: true,
                _id: { $ne: currentUserId }
            })
                .select('fullName email profilePic role academic activity studyStats')
                .populate([
                { path: 'academic.school', select: 'name location' },
                { path: 'academic.program', select: 'name code' }
            ])
                .sort({ 'academic.currentSemester': 1, 'activity.contributionScore': -1 });
            const enhancedUsers = users.map(user => ({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
                role: user.role,
                academic: user.academic,
                academicInfo: user.academicInfo, // Virtual field
                contributionLevel: user.contributionLevel, // Virtual field
                activity: user.activity,
                studyStats: user.studyStats
            }));
            return res.status(200).json({
                success: true,
                users: enhancedUsers,
                total: enhancedUsers.length,
                program: ((_c = (_b = users[0]) === null || _b === void 0 ? void 0 : _b.academic) === null || _c === void 0 ? void 0 : _c.program) || null
            });
        }
        catch (error) {
            console.error("Error in getUsersByProgram:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
function getTopContributors(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { limit = 10, timeframe = 'all' } = req.query;
            const limitNum = Math.min(parseInt(limit) || 10, 50);
            // ✅ Build date filter for timeframe
            let dateFilter = {};
            if (timeframe === 'month') {
                dateFilter = { updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
            }
            else if (timeframe === 'week') {
                dateFilter = { updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
            }
            const topContributors = yield User_1.default.find(Object.assign({ isActive: true, 'activity.contributionScore': { $gt: 0 } }, dateFilter))
                .select('fullName profilePic role academic activity studyStats')
                .populate([
                { path: 'academic.school', select: 'name' },
                { path: 'academic.program', select: 'name code' }
            ])
                .sort({ 'activity.contributionScore': -1 })
                .limit(limitNum);
            const enhancedContributors = topContributors.map((user, index) => ({
                rank: index + 1,
                _id: user._id,
                fullName: user.fullName,
                profilePic: user.profilePic,
                role: user.role,
                academic: user.academic,
                academicInfo: user.academicInfo, // Virtual field
                contributionLevel: user.contributionLevel, // Virtual field
                activity: user.activity,
                studyStats: user.studyStats
            }));
            return res.status(200).json({
                success: true,
                contributors: enhancedContributors,
                total: enhancedContributors.length,
                timeframe
            });
        }
        catch (error) {
            console.error("Error in getTopContributors:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
// ===== COMPREHENSIVE FRIEND DATA =====
function collectFriendData(req, res) {
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
            // ✅ Get user with friends
            const user = yield User_1.default.findById(userId)
                .populate({
                path: 'friends',
                select: 'fullName profilePic email location role academic activity',
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
            // ✅ Get received friend requests
            const receivedRequests = yield friendRequest_1.default.find({
                recipient: userId,
                status: 'pending'
            })
                .populate({
                path: 'sender',
                select: 'fullName profilePic email role academic',
                populate: [
                    { path: 'academic.school', select: 'name' },
                    { path: 'academic.program', select: 'name code' }
                ]
            })
                .sort({ createdAt: -1 });
            // ✅ Get sent friend requests
            const sentRequests = yield friendRequest_1.default.find({
                sender: userId,
                status: 'pending'
            })
                .populate({
                path: 'recipient',
                select: 'fullName profilePic email role academic',
                populate: [
                    { path: 'academic.school', select: 'name' },
                    { path: 'academic.program', select: 'name code' }
                ]
            })
                .sort({ createdAt: -1 });
            // ✅ Enhanced friends data
            const enhancedFriends = user.friends.map((friend) => {
                var _a, _b;
                return ({
                    _id: friend._id,
                    fullName: friend.fullName,
                    profilePic: friend.profilePic,
                    email: friend.email,
                    role: friend.role,
                    location: friend.location,
                    academic: friend.academic,
                    academicInfo: friend.academicInfo, // Virtual field
                    contributionLevel: friend.contributionLevel, // Virtual field
                    activity: {
                        contributionScore: ((_a = friend.activity) === null || _a === void 0 ? void 0 : _a.contributionScore) || 0,
                        uploadCount: ((_b = friend.activity) === null || _b === void 0 ? void 0 : _b.uploadCount) || 0
                    }
                });
            });
            // ✅ Enhanced received requests
            const enhancedReceived = receivedRequests.map(request => {
                var _a, _b, _c, _d, _e, _f, _g;
                return ({
                    _id: request._id,
                    sender: (typeof request.sender === 'object' && request.sender !== null && 'fullName' in request.sender)
                        ? {
                            _id: (_a = request.sender) === null || _a === void 0 ? void 0 : _a._id,
                            fullName: (_b = request.sender) === null || _b === void 0 ? void 0 : _b.fullName,
                            profilePic: (_c = request.sender) === null || _c === void 0 ? void 0 : _c.profilePic,
                            email: (_d = request.sender) === null || _d === void 0 ? void 0 : _d.email,
                            role: (_e = request.sender) === null || _e === void 0 ? void 0 : _e.role,
                            academic: (_f = request.sender) === null || _f === void 0 ? void 0 : _f.academic,
                            academicInfo: (_g = request.sender) === null || _g === void 0 ? void 0 : _g.academicInfo, // Virtual field
                        }
                        : null,
                    createdAt: request.createdAt
                });
            });
            // ✅ Enhanced sent requests
            const enhancedSent = sentRequests.map(request => {
                var _a, _b, _c, _d, _e, _f, _g;
                return ({
                    _id: request._id,
                    recipient: (typeof request.recipient === 'object' && request.recipient !== null && 'fullName' in request.recipient)
                        ? {
                            _id: (_a = request.recipient) === null || _a === void 0 ? void 0 : _a._id,
                            fullName: (_b = request.recipient) === null || _b === void 0 ? void 0 : _b.fullName,
                            profilePic: (_c = request.recipient) === null || _c === void 0 ? void 0 : _c.profilePic,
                            email: (_d = request.recipient) === null || _d === void 0 ? void 0 : _d.email,
                            role: (_e = request.recipient) === null || _e === void 0 ? void 0 : _e.role,
                            academic: (_f = request.recipient) === null || _f === void 0 ? void 0 : _f.academic,
                            academicInfo: (_g = request.recipient) === null || _g === void 0 ? void 0 : _g.academicInfo, // Virtual field
                        }
                        : null,
                    createdAt: request.createdAt
                });
            });
            return res.status(200).json({
                success: true,
                data: {
                    friends: enhancedFriends,
                    receivedFriendRequests: enhancedReceived,
                    sentFriendRequests: enhancedSent
                },
                counts: {
                    friends: enhancedFriends.length,
                    receivedRequests: enhancedReceived.length,
                    sentRequests: enhancedSent.length
                }
            });
        }
        catch (error) {
            console.error("Error in collectFriendData:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
}
// ===== USER STATISTICS =====
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
                .select('activity studyStats friends savedMaterials uploadedMaterials academic role') // 
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
            // ✅ Calculate additional stats
            const recentUploads = user.uploadedMaterials.filter((material) => new Date(material.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
            const recentSaves = user.savedMaterials.filter((material) => new Date(material.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
            // ✅ Academic progress calculations
            const completedCoursesCount = ((_c = (_b = user.academic) === null || _b === void 0 ? void 0 : _b.completedCourses) === null || _c === void 0 ? void 0 : _c.length) || 0;
            const currentSemester = ((_d = user.academic) === null || _d === void 0 ? void 0 : _d.currentSemester) || 0;
            const enrollmentYear = ((_e = user.academic) === null || _e === void 0 ? void 0 : _e.enrollmentYear) || new Date().getFullYear();
            const academicYearsActive = new Date().getFullYear() - enrollmentYear + 1;
            const stats = {
                // ✅ Activity stats
                activity: user.activity,
                contributionLevel: user.contributionLevel, // Virtual field
                // ✅ Study stats
                studyStats: user.studyStats,
                // ✅ Social stats
                friendsCount: user.friends.length,
                // ✅ Content stats
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
                // ✅ Enhanced computed metrics (academic-focused)
                engagementScore: user.activity.contributionScore + (user.friends.length * 5) + (completedCoursesCount * 2),
                // ✅ Academic performance indicators
                academicPerformance: {
                    coursesPerYear: academicYearsActive > 0 ? Math.round((completedCoursesCount / academicYearsActive) * 10) / 10 : 0,
                    contributionsPerSemester: currentSemester > 0 ? Math.round((user.activity.uploadCount / currentSemester) * 10) / 10 : 0,
                    studyEfficiency: user.studyStats.materialsViewed > 0 ? Math.round((user.studyStats.materialsSaved / user.studyStats.materialsViewed) * 100) : 0
                },
                // ✅ Updated activity summary (academic-focused)
                summary: {
                    isActiveContributor: user.activity.contributionScore > 100,
                    isActiveLearner: user.studyStats.materialsViewed > 50,
                    isSocialUser: user.friends.length > 10,
                    hasRecentActivity: recentUploads > 0 || recentSaves > 0,
                    // ✅ NEW academic indicators
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