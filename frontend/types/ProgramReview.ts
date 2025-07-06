export interface CriteriaRatings {
    TeachingQuality: number;
    FacultySupport: number;
    LearningEnvironment: number;
    LibraryResources: number;
    StudentSupport: number;
    CampusLife: number;
    OverallExperience: number;
}

export interface ProgramReview {
    _id: string;
    program: string;
    user: {
        _id: string;
        fullName: string;
        profilePic?: string;
    };
    year: number;
    criteriaRatings: CriteriaRatings;
    comment?: string;
    likes: number;
    dislikes: number;
    userLiked?: boolean;
    userDisliked?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProgramReviewsResponse {
    reviews: ProgramReview[];
    averages: CriteriaRatings & { totalReviews: number };
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreateReviewData {
    programId: string;
    year: number;
    criteriaRatings: CriteriaRatings;
    comment?: string;
}

// Mapping cho hiển thị labels
export const CRITERIA_LABELS: Record<keyof CriteriaRatings, string> = {
    TeachingQuality: 'Teaching Quality',
    FacultySupport: 'Faculty Support',
    LearningEnvironment: 'Learning Environment',
    LibraryResources: 'Library Resources',
    StudentSupport: 'Student Support',
    CampusLife: 'Campus Life',
    OverallExperience: 'Overall Experience'
};

// Mapping cho descriptions
export const CRITERIA_DESCRIPTIONS: Record<keyof CriteriaRatings, string> = {
    TeachingQuality: 'Quality & Communication from Instructors',
    FacultySupport: 'Help & Guidance from Faculty',
    LearningEnvironment: 'Classrooms & Learning Spaces Quality',
    LibraryResources: 'Library & Learning Resources',
    StudentSupport: 'Student Services & Support',
    CampusLife: 'Social Activities & Campus Experience',
    OverallExperience: 'Overall Program Experience'
}; 