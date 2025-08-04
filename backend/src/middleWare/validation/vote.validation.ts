import { body, param } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../../utils/ApiResponse';

/**
 * Validation for vote on post
 */
export const validateVoteOnPost = [
    // Validate postId parameter
    param('postId')
        .notEmpty()
        .withMessage('Post ID is required')
        .isMongoId()
        .withMessage('Invalid post ID format'),

    // Validate voteType in body
    body('voteType')
        .notEmpty()
        .withMessage('Vote type is required')
        .isIn(['up', 'down'])
        .withMessage('Vote type must be either "up" or "down"'),

    // Handle validation results
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(new ApiResponse(400, null, 'Validation failed', errors.array()));
        }
        next();
    }
];

/**
 * Validation for vote on comment
 */
export const validateVoteOnComment = [
    // Validate commentId parameter
    param('commentId')
        .notEmpty()
        .withMessage('Comment ID is required')
        .isMongoId()
        .withMessage('Invalid comment ID format'),

    // Validate voteType in body
    body('voteType')
        .notEmpty()
        .withMessage('Vote type is required')
        .isIn(['up', 'down'])
        .withMessage('Vote type must be either "up" or "down"'),

    // Handle validation results
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(new ApiResponse(400, null, 'Validation failed', errors.array()));
        }
        next();
    }
];