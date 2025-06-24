import { Request, Response } from 'express';
import User from '../models/User';
import { School } from '../models/School';
import { Program } from '../models/Program';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { logApiRequest } from '../utils/Api.utils';
import { logger } from '../utils/logger.utils';
import { clearUserCache } from '../utils/Cache.utils';
import mongoose from 'mongoose';

// ===== INTERFACE DEFINITIONS =====
interface OnboardingData {
    schoolId: string;
    programId: string;
    currentSemester?: number;
    enrollmentYear?: number;
    studentId?: string;
}

/**
 * @desc    Complete user onboarding with academic info
 * @route   POST /api/onboarding/complete
 * @access  Private (Authenticated users only)
 */
export const completeOnboarding = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    if (!req.user) {
        throw new ApiError(401, 'Authentication required');
    }

    const { schoolId, programId, currentSemester = 1, enrollmentYear, studentId }: OnboardingData = req.body;

    // ✅ Validate required fields
    if (!schoolId || !programId) {
        throw new ApiError(400, 'School and Program are required');
    }

    // ✅ Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(schoolId) || !mongoose.Types.ObjectId.isValid(programId)) {
        throw new ApiError(400, 'Invalid school or program ID');
    }

    try {
        // ✅ Verify school and program exist
        const [school, program] = await Promise.all([
            School.findById(schoolId).select('name code type'),
            Program.findById(programId).select('name code level school').populate('school', 'name code')
        ]);

        if (!school) {
            throw new ApiError(404, 'School not found');
        }

        if (!program) {
            throw new ApiError(404, 'Program not found');
        }

        // ✅ Verify program belongs to selected school
        if (program.school.toString() !== schoolId) {
            throw new ApiError(400, 'Program does not belong to selected school');
        }

        // ✅ Check if user already completed onboarding
        if (req.user.isOnboarded) {
            throw new ApiError(400, 'User has already completed onboarding');
        }

        // ✅ Prepare academic data
        const academicData = {
            school: schoolId,
            program: programId,
            currentSemester,
            enrollmentYear: enrollmentYear || new Date().getFullYear(),
            studentId: studentId || undefined,
            status: 'active' as const
        };

        // ✅ Update user with academic info and mark as onboarded
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                academic: academicData,
                isOnboarded: true,
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        ).select('-password')
            .populate('academic.school', 'name code type')
            .populate('academic.program', 'name code level');

        if (!updatedUser) {
            throw new ApiError(404, 'User not found');
        }

        // ✅ Clear user cache
        await clearUserCache(req.user._id.toString());

        logger.info('User onboarding completed', {
            userId: updatedUser._id,
            schoolId,
            programId,
            schoolName: school.name,
            programName: program.name
        });

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    user: updatedUser,
                    onboardingCompleted: true
                },
                'Onboarding completed successfully'
            )
        );

    } catch (error: any) {
        logger.error('Error completing onboarding:', error);

        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, 'Failed to complete onboarding');
    }
});

/**
 * @desc    Update user academic information
 * @route   PUT /api/onboarding/academic
 * @access  Private (Authenticated users only)
 */
export const updateAcademicInfo = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    if (!req.user) {
        throw new ApiError(401, 'Authentication required');
    }

    const { schoolId, programId, currentSemester, studentId } = req.body;

    // ✅ Validate ObjectIds if provided
    if (schoolId && !mongoose.Types.ObjectId.isValid(schoolId)) {
        throw new ApiError(400, 'Invalid school ID');
    }

    if (programId && !mongoose.Types.ObjectId.isValid(programId)) {
        throw new ApiError(400, 'Invalid program ID');
    }

    try {
        // ✅ Build update object
        const updateData: any = {};

        if (schoolId) {
            // Verify school exists
            const school = await School.findById(schoolId);
            if (!school) {
                throw new ApiError(404, 'School not found');
            }
            updateData['academic.school'] = schoolId;
        }

        if (programId) {
            // Verify program exists
            const program = await Program.findById(programId);
            if (!program) {
                throw new ApiError(404, 'Program not found');
            }

            // If both school and program provided, verify they match
            if (schoolId && program.school.toString() !== schoolId) {
                throw new ApiError(400, 'Program does not belong to selected school');
            }

            updateData['academic.program'] = programId;
        }

        if (currentSemester !== undefined) {
            if (currentSemester < 1 || currentSemester > 8) {
                throw new ApiError(400, 'Current semester must be between 1 and 8');
            }
            updateData['academic.currentSemester'] = currentSemester;
        }

        if (studentId !== undefined) {
            updateData['academic.studentId'] = studentId || null;
        }

        updateData['updatedAt'] = new Date();

        // ✅ Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select('-password')
            .populate('academic.school', 'name code type')
            .populate('academic.program', 'name code level');

        if (!updatedUser) {
            throw new ApiError(404, 'User not found');
        }

        // ✅ Clear user cache
        await clearUserCache(req.user._id.toString());

        logger.info('User academic info updated', {
            userId: updatedUser._id,
            updates: Object.keys(updateData)
        });

        res.status(200).json(
            new ApiResponse(
                200,
                { user: updatedUser },
                'Academic information updated successfully'
            )
        );

    } catch (error: any) {
        logger.error('Error updating academic info:', error);

        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, 'Failed to update academic information');
    }
});

/**
 * @desc    Get onboarding progress/status
 * @route   GET /api/onboarding/status
 * @access  Private (Authenticated users only)
 */
export const getOnboardingStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    if (!req.user) {
        throw new ApiError(401, 'Authentication required');
    }

    try {
        const user = await User.findById(req.user._id)
            .select('isOnboarded academic createdAt')
            .populate('academic.school', 'name code type')
            .populate('academic.program', 'name code level')
            .lean();

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // ✅ Determine onboarding steps completion
        const steps = {
            accountCreated: true, // User exists
            academicInfoProvided: !!(user.academic?.school && user.academic?.program),
            onboardingCompleted: user.isOnboarded
        };

        // ✅ Calculate completion percentage
        const completedSteps = Object.values(steps).filter(Boolean).length;
        const totalSteps = Object.keys(steps).length;
        const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

        const status = {
            isOnboarded: user.isOnboarded,
            steps,
            completionPercentage,
            academic: user.academic || null,
            nextStep: !steps.academicInfoProvided ? 'academic_info' :
                !steps.onboardingCompleted ? 'complete' : 'done'
        };

        logger.info('Onboarding status retrieved', {
            userId: user._id,
            isOnboarded: user.isOnboarded,
            completionPercentage
        });

        res.status(200).json(
            new ApiResponse(200, status, 'Onboarding status retrieved successfully')
        );

    } catch (error: any) {
        logger.error('Error getting onboarding status:', error);
        throw new ApiError(500, 'Failed to get onboarding status');
    }
});

/**
 * @desc    Skip onboarding (mark as completed without academic info)
 * @route   POST /api/onboarding/skip
 * @access  Private (Authenticated users only)
 */
export const skipOnboarding = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ Log API request
    logApiRequest(req as any);

    if (!req.user) {
        throw new ApiError(401, 'Authentication required');
    }

    try {
        // ✅ Check if user already completed onboarding
        if (req.user.isOnboarded) {
            throw new ApiError(400, 'User has already completed onboarding');
        }

        // ✅ Mark user as onboarded without academic info
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                isOnboarded: true,
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!updatedUser) {
            throw new ApiError(404, 'User not found');
        }

        // ✅ Clear user cache
        await clearUserCache(req.user._id.toString());

        logger.info('User skipped onboarding', {
            userId: updatedUser._id
        });

        res.status(200).json(
            new ApiResponse(
                200,
                { user: updatedUser },
                'Onboarding skipped successfully'
            )
        );

    } catch (error: any) {
        logger.error('Error skipping onboarding:', error);

        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, 'Failed to skip onboarding');
    }
}); 