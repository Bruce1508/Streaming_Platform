import { Request, Response } from 'express';
/**
 * @desc    Complete user onboarding with academic info
 * @route   POST /api/onboarding/complete
 * @access  Private (Authenticated users only)
 */
export declare const completeOnboarding: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Update user academic information
 * @route   PUT /api/onboarding/academic
 * @access  Private (Authenticated users only)
 */
export declare const updateAcademicInfo: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get onboarding progress/status
 * @route   GET /api/onboarding/status
 * @access  Private (Authenticated users only)
 */
export declare const getOnboardingStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Skip onboarding (mark as completed without academic info)
 * @route   POST /api/onboarding/skip
 * @access  Private (Authenticated users only)
 */
export declare const skipOnboarding: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=onboarding.controllers.d.ts.map