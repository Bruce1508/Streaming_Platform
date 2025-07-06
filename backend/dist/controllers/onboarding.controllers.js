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
exports.skipOnboarding = exports.getOnboardingStatus = exports.updateAcademicInfo = exports.completeOnboarding = void 0;
const User_1 = __importDefault(require("../models/User"));
const School_1 = require("../models/School");
const Program_1 = require("../models/Program");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const Api_utils_1 = require("../utils/Api.utils");
const logger_utils_1 = require("../utils/logger.utils");
const Cache_utils_1 = require("../utils/Cache.utils");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @desc    Complete user onboarding with academic info
 * @route   POST /api/onboarding/complete
 * @access  Private (Authenticated users only)
 */
exports.completeOnboarding = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    if (!req.user) {
        throw new ApiError_1.ApiError(401, 'Authentication required');
    }
    const { schoolId, programId, currentSemester = 1, enrollmentYear, studentId } = req.body;
    // ✅ Validate required fields
    if (!schoolId || !programId) {
        throw new ApiError_1.ApiError(400, 'School and Program are required');
    }
    // ✅ Validate ObjectIds
    if (!mongoose_1.default.Types.ObjectId.isValid(schoolId) || !mongoose_1.default.Types.ObjectId.isValid(programId)) {
        throw new ApiError_1.ApiError(400, 'Invalid school or program ID');
    }
    try {
        // ✅ Verify school and program exist
        const [school, program] = yield Promise.all([
            School_1.School.findById(schoolId).select('name code type'),
            Program_1.Program.findById(programId).select('name code level school').populate('school', 'name code')
        ]);
        if (!school) {
            throw new ApiError_1.ApiError(404, 'School not found');
        }
        if (!program) {
            throw new ApiError_1.ApiError(404, 'Program not found');
        }
        // ✅ Verify program belongs to selected school
        if (program.school.toString() !== schoolId) {
            throw new ApiError_1.ApiError(400, 'Program does not belong to selected school');
        }
        // ✅ Check if user already completed onboarding
        if (req.user.isOnboarded) {
            throw new ApiError_1.ApiError(400, 'User has already completed onboarding');
        }
        // ✅ Prepare academic data
        const academicData = {
            school: schoolId,
            program: programId,
            currentSemester,
            enrollmentYear: enrollmentYear || new Date().getFullYear(),
            studentId: studentId || undefined,
            status: 'active'
        };
        // ✅ Update user with academic info and mark as onboarded
        const updatedUser = yield User_1.default.findByIdAndUpdate(req.user._id, {
            academic: academicData,
            isOnboarded: true,
            updatedAt: new Date()
        }, {
            new: true,
            runValidators: true
        }).select('-password')
            .populate('academic.school', 'name code type')
            .populate('academic.program', 'name code level');
        if (!updatedUser) {
            throw new ApiError_1.ApiError(404, 'User not found');
        }
        // ✅ Clear user cache
        yield (0, Cache_utils_1.clearUserCache)(req.user._id.toString());
        logger_utils_1.logger.info('User onboarding completed', {
            userId: updatedUser._id,
            schoolId,
            programId,
            schoolName: school.name,
            programName: program.name
        });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {
            user: updatedUser,
            onboardingCompleted: true
        }, 'Onboarding completed successfully'));
    }
    catch (error) {
        logger_utils_1.logger.error('Error completing onboarding:', error);
        if (error instanceof ApiError_1.ApiError) {
            throw error;
        }
        throw new ApiError_1.ApiError(500, 'Failed to complete onboarding');
    }
}));
/**
 * @desc    Update user academic information
 * @route   PUT /api/onboarding/academic
 * @access  Private (Authenticated users only)
 */
exports.updateAcademicInfo = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    if (!req.user) {
        throw new ApiError_1.ApiError(401, 'Authentication required');
    }
    const { schoolId, programId, currentSemester, studentId } = req.body;
    // ✅ Validate ObjectIds if provided
    if (schoolId && !mongoose_1.default.Types.ObjectId.isValid(schoolId)) {
        throw new ApiError_1.ApiError(400, 'Invalid school ID');
    }
    if (programId && !mongoose_1.default.Types.ObjectId.isValid(programId)) {
        throw new ApiError_1.ApiError(400, 'Invalid program ID');
    }
    try {
        // ✅ Build update object
        const updateData = {};
        if (schoolId) {
            // Verify school exists
            const school = yield School_1.School.findById(schoolId);
            if (!school) {
                throw new ApiError_1.ApiError(404, 'School not found');
            }
            updateData['academic.school'] = schoolId;
        }
        if (programId) {
            // Verify program exists
            const program = yield Program_1.Program.findById(programId);
            if (!program) {
                throw new ApiError_1.ApiError(404, 'Program not found');
            }
            // If both school and program provided, verify they match
            if (schoolId && program.school.toString() !== schoolId) {
                throw new ApiError_1.ApiError(400, 'Program does not belong to selected school');
            }
            updateData['academic.program'] = programId;
        }
        if (currentSemester !== undefined) {
            if (currentSemester < 1 || currentSemester > 8) {
                throw new ApiError_1.ApiError(400, 'Current semester must be between 1 and 8');
            }
            updateData['academic.currentSemester'] = currentSemester;
        }
        if (studentId !== undefined) {
            updateData['academic.studentId'] = studentId || null;
        }
        updateData['updatedAt'] = new Date();
        // ✅ Update user
        const updatedUser = yield User_1.default.findByIdAndUpdate(req.user._id, updateData, {
            new: true,
            runValidators: true
        }).select('-password')
            .populate('academic.school', 'name code type')
            .populate('academic.program', 'name code level');
        if (!updatedUser) {
            throw new ApiError_1.ApiError(404, 'User not found');
        }
        // ✅ Clear user cache
        yield (0, Cache_utils_1.clearUserCache)(req.user._id.toString());
        logger_utils_1.logger.info('User academic info updated', {
            userId: updatedUser._id,
            updates: Object.keys(updateData)
        });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, { user: updatedUser }, 'Academic information updated successfully'));
    }
    catch (error) {
        logger_utils_1.logger.error('Error updating academic info:', error);
        if (error instanceof ApiError_1.ApiError) {
            throw error;
        }
        throw new ApiError_1.ApiError(500, 'Failed to update academic information');
    }
}));
/**
 * @desc    Get onboarding progress/status
 * @route   GET /api/onboarding/status
 * @access  Private (Authenticated users only)
 */
exports.getOnboardingStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    if (!req.user) {
        throw new ApiError_1.ApiError(401, 'Authentication required');
    }
    try {
        const user = yield User_1.default.findById(req.user._id)
            .select('isOnboarded academic createdAt')
            .populate('academic.school', 'name code type')
            .populate('academic.program', 'name code level')
            .lean();
        if (!user) {
            throw new ApiError_1.ApiError(404, 'User not found');
        }
        // ✅ Determine onboarding steps completion
        const steps = {
            accountCreated: true, // User exists
            academicInfoProvided: !!(((_a = user.academic) === null || _a === void 0 ? void 0 : _a.school) && ((_b = user.academic) === null || _b === void 0 ? void 0 : _b.program)),
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
        logger_utils_1.logger.info('Onboarding status retrieved', {
            userId: user._id,
            isOnboarded: user.isOnboarded,
            completionPercentage
        });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, status, 'Onboarding status retrieved successfully'));
    }
    catch (error) {
        logger_utils_1.logger.error('Error getting onboarding status:', error);
        throw new ApiError_1.ApiError(500, 'Failed to get onboarding status');
    }
}));
/**
 * @desc    Skip onboarding (mark as completed without academic info)
 * @route   POST /api/onboarding/skip
 * @access  Private (Authenticated users only)
 */
exports.skipOnboarding = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Log API request
    (0, Api_utils_1.logApiRequest)(req);
    if (!req.user) {
        throw new ApiError_1.ApiError(401, 'Authentication required');
    }
    try {
        // ✅ Check if user already completed onboarding
        if (req.user.isOnboarded) {
            throw new ApiError_1.ApiError(400, 'User has already completed onboarding');
        }
        // ✅ Mark user as onboarded without academic info
        const updatedUser = yield User_1.default.findByIdAndUpdate(req.user._id, {
            isOnboarded: true,
            updatedAt: new Date()
        }, {
            new: true,
            runValidators: true
        }).select('-password');
        if (!updatedUser) {
            throw new ApiError_1.ApiError(404, 'User not found');
        }
        // ✅ Clear user cache
        yield (0, Cache_utils_1.clearUserCache)(req.user._id.toString());
        logger_utils_1.logger.info('User skipped onboarding', {
            userId: updatedUser._id
        });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, { user: updatedUser }, 'Onboarding skipped successfully'));
    }
    catch (error) {
        logger_utils_1.logger.error('Error skipping onboarding:', error);
        if (error instanceof ApiError_1.ApiError) {
            throw error;
        }
        throw new ApiError_1.ApiError(500, 'Failed to skip onboarding');
    }
}));
//# sourceMappingURL=onboarding.controllers.js.map