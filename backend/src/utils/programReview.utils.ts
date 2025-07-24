import { param } from "express-validator";
import { handleValidationErrors } from "../middleWare/validation/common.validation";

export const validateProgramCode = (paramName: string = 'programId') => {
    return [
        param(paramName)
        .trim()
        .notEmpty()
        .withMessage(`${paramName} is required`)
        .isLength({ min: 2, max: 15 })
        .withMessage(`${paramName} must be 2-15 characters`)
        .matches(/^[A-Z0-9]+$/i)
        .withMessage(`${paramName} can only contain letters and numbers`),
    handleValidationErrors
    ]
};

export const validateReviewData = (req: any, res: any, next: any) => {
    const { currentSemester, ratings, takeTheCourseAgain } = req.body;

    if (currentSemester && typeof currentSemester !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Current semester must be a string'
        });
    }

    if (takeTheCourseAgain !== undefined && typeof takeTheCourseAgain !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'takeTheCourseAgain must be a boolean'
        });
    }

    if (ratings) {
        const { instructorRating, contentQualityRating, practicalValueRating } = ratings;

        if (instructorRating !== undefined && (typeof instructorRating !== 'number' || instructorRating < 0 || instructorRating > 100)) {
            return res.status(400).json({
                success: false,
                message: 'Instructor rating must be a number between 0 and 100'
            });
        }

        if (contentQualityRating !== undefined && (typeof contentQualityRating !== 'number' || contentQualityRating < 0 || contentQualityRating > 100)) {
            return res.status(400).json({
                success: false,
                message: 'Content quality rating must be a number between 0 and 100'
            });
        }

        if (practicalValueRating !== undefined && (typeof practicalValueRating !== 'number' || practicalValueRating < 0 || practicalValueRating > 100)) {
            return res.status(400).json({
                success: false,
                message: 'Practical value rating must be a number between 0 and 100'
            });
        }
    }

    next();
}