// backend/src/controllers/user.controller.ts
import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import mongoose from "mongoose";
import { 
    capitalize, 
    maskEmail,
    truncate 
} from '../utils/Format.utils';
import { 
    searchUsers as searchUtilsFunction,
    buildSearchQuery,
    calculateRelevanceScore 
} from '../utils/Search.utils';
import { logApiRequest } from '../utils/Api.utils';

// ===== EXTENDED REQUEST INTERFACE =====
interface AuthenticatedRequest extends Request {
    user?: IUser;
}

// ===== UTILITY FUNCTIONS =====
const safeObjectId = (id: string): mongoose.Types.ObjectId | null => {
    try {
        return new mongoose.Types.ObjectId(id);
    } catch {
        return null;
    }
};

// ===== RECOMMENDATION SYSTEM =====
export async function getRecommendedUsers(req: Request, res: Response): Promise<Response | any> {
    logApiRequest(req as any);

    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    try {
        const currentUserId = authReq.user._id;
        const currentUser = authReq.user;

        const baseQuery: any = {
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
        if (currentUser.role === 'student' && currentUser.academic?.school) {
            const sameSchoolUsers = await User.find({
                ...baseQuery,
                'academic.school': currentUser.academic.school,
                'academic.program': { $ne: currentUser.academic?.program }
            })
                .select('fullName email profilePic role bio location academic activity')
                .populate('academic.school', 'name location')
                .populate('academic.program', 'name code')
                .limit(8);

            recommendedUsers.push(...sameSchoolUsers);
        }

        // Same Program, Different Semesters
        if (currentUser.role === 'student' && currentUser.academic?.program) {
            const sameProgramUsers = await User.find({
                ...baseQuery,
                'academic.program': currentUser.academic.program,
                'academic.currentSemester': { $ne: currentUser.academic?.currentSemester },
                _id: { $nin: recommendedUsers.map(u => u._id) }
            })
                .select('fullName email profilePic role bio location academic activity')
                .populate('academic.school', 'name location')
                .populate('academic.program', 'name code')
                .limit(6);

            recommendedUsers.push(...sameProgramUsers);
        }

        // High Contributors
        if (recommendedUsers.length < 12) {
            const topContributors = await User.find({
                ...baseQuery,
                'activity.contributionScore': { $gte: 50 },
                _id: { $nin: recommendedUsers.map(u => u._id) }
            })
                .select('fullName email profilePic role bio location academic activity')
                .populate('academic.school', 'name location')
                .populate('academic.program', 'name code')
                .sort({ 'activity.contributionScore': -1 })
                .limit(6);

            recommendedUsers.push(...topContributors);
        }

        // Fill with Active Academic Users
        if (recommendedUsers.length < 15) {
            const remainingUsers = await User.find({
                ...baseQuery,
                _id: { $nin: recommendedUsers.map(u => u._id) }
            })
                .select('fullName email profilePic role bio location academic activity')
                .populate('academic.school', 'name location')
                .populate('academic.program', 'name code')
                .sort({ 'activity.contributionScore': -1, lastLogin: -1 })
                .limit(15 - recommendedUsers.length);

            recommendedUsers.push(...remainingUsers);
        }

        const enhancedUsers = recommendedUsers.map(user => ({
            _id: user._id,
            fullName: capitalize(user.fullName),
            email: maskEmail(user.email),
            profilePic: user.profilePic,
            role: user.role,
            bio: user.bio ? truncate(user.bio, 100) : null,
            location: user.location,
            academic: user.academic,
            contributionLevel: user.contributionLevel,
            academicInfo: user.academicInfo,
            activity: {
                contributionScore: user.activity?.contributionScore || 0,
                uploadCount: user.activity?.uploadCount || 0
            },
            academicMatch: {
                sameSchool: user.academic?.school?.toString() === currentUser.academic?.school?.toString(),
                sameProgram: user.academic?.program?.toString() === currentUser.academic?.program?.toString(),
                isContributor: (user.activity?.contributionScore || 0) >= 50
            }
        }));

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

    } catch (error: any) {
        console.error("Error in getRecommendedUsers controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// ===== FRIENDS MANAGEMENT =====
export async function getMyFriends(req: Request, res: Response): Promise<Response | any> {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    try {
        const user = await User.findById(authReq.user._id)
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

        const enhancedFriends = user.friends.map((friend: any) => ({
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
                contributionScore: friend.activity?.contributionScore || 0,
                uploadCount: friend.activity?.uploadCount || 0
            }
        }));

        return res.status(200).json({
            success: true,
            friends: enhancedFriends,
            total: enhancedFriends.length
        });

    } catch (error: any) {
        console.error("Error in getMyFriends controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// ===== PROFILE MANAGEMENT =====
export async function getMyProfile(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const user = await User.findById(userId)
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

    } catch (error: any) {
        console.error("Error in getMyProfile:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function updateMyProfile(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const { fullName, bio, location, website, academic, preferences } = req.body;

        const updateData: any = {};
        if (fullName) updateData.fullName = capitalize(fullName);
        if (bio !== undefined) updateData.bio = bio;
        if (location) updateData.location = location;
        if (website) updateData.website = website;
        if (academic) updateData.academic = academic;
        if (preferences) updateData.preferences = preferences;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        )
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

    } catch (error: any) {
        console.error("Error in updateMyProfile:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function searchUsers(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const currentUserId = authReq.user?._id;

        if (!currentUserId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const { 
            search = '', 
            role, 
            school, 
            program, 
            semester, 
            sortBy = 'relevance',
            limit = 25 
        } = req.query;

        const trimmedQuery = (search as string).trim();
        const limitNum = Math.min(parseInt(limit as string) || 25, 50);

        const baseQuery: any = {
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

        if (role) baseQuery.$and.push({ role: role as string });
        if (school) baseQuery.$and.push({ 'academic.school': school as string });
        if (program) baseQuery.$and.push({ 'academic.program': program as string });
        if (semester) baseQuery.$and.push({ 'academic.currentSemester': parseInt(semester as string) });

        const searchQuery = baseQuery;

        const users = await User.find(searchQuery)
            .select('fullName email profilePic role bio location academic activity lastLogin')
            .populate([
                { path: 'academic.school', select: 'name location' },
                { path: 'academic.program', select: 'name code' }
            ])
            .sort({ 'activity.contributionScore': -1, lastLogin: -1 })
            .limit(limitNum)
            .lean();

        const enhancedUsers = users.map((user: any) => ({
            _id: user._id,
            fullName: capitalize(user.fullName),
            email: maskEmail(user.email),
            profilePic: user.profilePic,
            role: user.role,
            bio: user.bio ? truncate(user.bio, 100) : null,
            location: user.location,
            academic: user.academic,
            academicInfo: user.academicInfo,
            contributionLevel: user.contributionLevel,
            activity: {
                contributionScore: user.activity?.contributionScore || 0,
                uploadCount: user.activity?.uploadCount || 0
            },
            relevanceScore: {
                searchScore: calculateRelevanceScore(user, trimmedQuery, {
                    fullName: 3,
                    email: 2,
                    bio: 1,
                    'academic.studentId': 2
                }),
                isContributor: (user.activity?.contributionScore || 0) >= 10,
                isActive: user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                hasProfile: !!(user.bio && user.academic?.program)
            }
        }));

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
                contributors: enhancedUsers.filter((u: any) => u.relevanceScore.isContributor).length,
                activeUsers: enhancedUsers.filter((u: any) => u.relevanceScore.isActive).length,
                completeProfiles: enhancedUsers.filter((u: any) => u.relevanceScore.hasProfile).length
            }
        });

    } catch (error: any) {
        console.error("Error in searchUsers controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function removeFriend(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const currentUserId = authReq.user?._id;
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

        const currentUser = await User.findById(currentUserId).select('friends');
        if (!currentUser?.friends.some(id => id.toString() === friendId)) {
            return res.status(400).json({
                success: false,
                message: "You are not friends with this user"
            });
        }

        await Promise.all([
            User.findByIdAndUpdate(currentUserId, {
                $pull: { friends: friendId }
            }),
            User.findByIdAndUpdate(friendId, {
                $pull: { friends: currentUserId }
            })
        ]);

        console.log(`✅ Friend removed: ${currentUserId} <-> ${friendId}`);
        return res.status(200).json({
            success: true,
            message: "Friend removed successfully"
        });

    } catch (error: any) {
        console.error("Error in removeFriend:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function getUserStats(req: Request, res: Response): Promise<Response | any> {
    try {
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const user = await User.findById(userId)
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

        const recentUploads = user.uploadedMaterials.filter((material: any) =>
            new Date(material.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;

        const recentSaves = user.savedMaterials.filter((material: any) =>
            new Date(material.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;

        const completedCoursesCount = user.academic?.completedCourses?.length || 0;
        const currentSemester = user.academic?.currentSemester || 0;
        const enrollmentYear = user.academic?.enrollmentYear || new Date().getFullYear();
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
                academicStatus: user.academic?.status || 'active',
                hasProgram: !!(user.academic?.program),
                hasSchool: !!(user.academic?.school)
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
                isAcademicUser: !!(user.academic?.program && user.academic?.school),
                isActiveStudent: user.role === 'student' && user.academic?.status === 'active',
                hasAcademicProgress: completedCoursesCount > 0,
                isContributingStudent: user.role === 'student' && user.activity.contributionScore > 50
            }
        };

        return res.status(200).json({
            success: true,
            stats
        });

    } catch (error: any) {
        console.error("Error in getUserStats:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
