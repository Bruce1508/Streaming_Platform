import { Document, Types } from 'mongoose';

// ===== COURSE INTERFACES =====
export interface ICourse {
    code: string;
    name: string;
    description: string;
    credits: number;
    hours: {
        lecture: number;
        lab: number;
        tutorial: number;
        total: number;
    };
    prerequisites: string[];
    corequisites: string[];
    programs: {
        program: string;
        semester: number;
        isCore: boolean;
        isElective: boolean;
    }[];
    school: string;
    department?: string;
    level: '1' | '2' | '3' | '4' | 'graduate' | 'undergraduate';
    delivery: ('in-person' | 'online' | 'hybrid' | 'blended')[];
    language: 'english' | 'french' | 'bilingual';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    learningOutcomes: string[];
    assessmentMethods: string[];
    textbooks: {
        title: string;
        author: string;
        isbn?: string;
        required: boolean;
    }[];
    professors: {
        name: string;
        email?: string;
        rating?: number;
    }[];
    isActive: boolean;
    stats: {
        enrollmentCount: number;
        averageGrade?: number;
        passRate?: number;
        materialCount: number;
        rating: {
            average: number;
            count: number;
        };
    };
}

export interface ICourseDocument extends ICourse, Document {
    fullCode: string;
    getProgramCodes(): string[];
}

// ===== PROGRAM INTERFACES =====
export interface IProgram {
    programId: string;
    code: string;
    name: string;
    overview: string;
    duration: string; // e.g., "2 Semesters (8 Months)"
    campus: string[];
    delivery?: string;
    credential: string;
    school: string;
    // Derived/computed fields
    level: 'Certificate' | 'Diploma' | 'Advanced Diploma' | 'Bachelor' | 'Graduate Certificate' | 'Honours Bachelor Degree' | 'Honours Bachelor' | 'Seneca Certificate of Standing' | 'Certificate of Apprenticeship, Ontario College Certificate';
    isActive: boolean;
    description?: string;
    stats: {
        enrollmentCount: number;
        graduationRate?: number;
        employmentRate?: number;
    };
    // Semester and course structure for imported data
    semesters?: {
        id?: string;
        name?: string;
        courses?: {
            id?: string;
            code?: string;
            name?: string;
        }[];
    }[];
}

export interface IProgramDocument extends IProgram, Document {}

// ===== SCHOOL INTERFACES =====
export interface ISchool {
    code: string;
    name: string;
    description: string;
    location: {
        address: string;
        city: string;
        province: string;
        postalCode: string;
        country: string;
    };
    contact: {
        phone: string;
        email: string;
        website: string;
    };
    type: 'college' | 'university' | 'institute';
    accreditation: string[];
    isActive: boolean;
    stats: {
        programCount: number;
        courseCount: number;
        studentCount: number;
        instructorCount: number;
    };
}

export interface ISchoolDocument extends ISchool, Document {}

// ===== STUDY MATERIAL INTERFACES =====
export interface IStudyMaterial {
    title: string;
    description: string;
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
    uploadedBy: Types.ObjectId | string;

    // Academic Context
    academic: {
        school?: Types.ObjectId | string;
        program?: Types.ObjectId | string;
        course: Types.ObjectId | string;
        semester?: {
            term: 'fall' | 'winter' | 'summer';
            year: number;
        };
        week?: number;
        professor?: string;
    };

    // Material Classification
    materialType:
    | 'lecture-notes'
    | 'assignment'
    | 'lab-report'
    | 'project'
    | 'midterm-exam'
    | 'final-exam'
    | 'quiz'
    | 'presentation'
    | 'tutorial'
    | 'reference'
    | 'textbook'
    | 'cheat-sheet'
    | 'solution'
    | 'other';

    // Enhanced Metadata
    metadata: {
        difficulty: 'beginner' | 'intermediate' | 'advanced';
        completionTime?: number; // minutes
        language: 'english' | 'french' | 'other';
        grade?: string;
        isVerified: boolean;
        qualityScore: number;
    };

    // Interaction Tracking
    interactions: {
        views: number;
        downloads: number;
        likes: {
            user: Types.ObjectId | string;
            createdAt: Date;
        }[];
        bookmarks: {
            user: Types.ObjectId | string;
            createdAt: Date;
        }[];
        shares: number;
    };

    // Reviews and Ratings
    reviews: {
        user: Types.ObjectId | string;
        rating: number;
        comment?: string;
        helpful: {
            user: Types.ObjectId | string;
            isHelpful: boolean;
            createdAt: Date;
        }[];
        createdAt: Date;
    }[];

    // Rating Aggregation
    rating: {
        average: number;
        count: number;
        distribution: {
            five: number;
            four: number;
            three: number;
            two: number;
            one: number;
        };
    };

    // Visibility & Status
    isPublic: boolean;
    isActive: boolean;
    moderationStatus: 'pending' | 'approved' | 'rejected';

    createdAt?: Date;
    updatedAt?: Date;
}

export interface IStudyMaterialDocument extends IStudyMaterial, Document {
    _id: Types.ObjectId;
    incrementViews(): Promise<IStudyMaterialDocument>;
    incrementDownloads(): Promise<IStudyMaterialDocument>;
    ratingText: string;
}

// ===== USER INTERFACES =====
export interface IUser {
    email: string;
    password: string;
    name: string;
    avatar?: string;
    role: 'student' | 'professor' | 'admin' | 'guest';

    // Academic Profile
    academic?: {
        studentId?: string;
        program?: Types.ObjectId | string;
        currentSemester?: number;
        enrollmentYear?: number;
        completedCourses: string[];
        status: 'active' | 'graduated' | 'suspended';
    };

    // Preferences
    preferences: {
        theme: 'light' | 'dark' | 'system';
        notifications: {
            email: boolean;
            push: boolean;
            newMaterials: boolean;
            courseUpdates: boolean;
        };
        privacy: {
            showProfile: boolean;
            showActivity: boolean;
        };
    };

    // Activity Tracking
    activity: {
        lastLogin?: Date;
        loginCount: number;
        uploadCount: number;
        downloadCount: number;
        contributionScore: number;
    };

    isActive: boolean;
    isVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
    _id: Types.ObjectId;
    comparePassword(password: string): Promise<boolean>;
    generateAuthToken(): string;
}

// ===== API INTERFACES =====
export type CourseWithPrograms = Omit<ICourse, 'school'> & {
    programs: (ICourse['programs'][0] & { program: IProgram })[];
    school: ISchool | Types.ObjectId | string;
};

export type MaterialWithDetails = Omit<IStudyMaterial, 'uploadedBy' | 'academic'> & {
    academic: IStudyMaterial['academic'] & {
        course: ICourse;
        program?: IProgram;
        school?: ISchool;
    };
    uploadedBy: IUser | Types.ObjectId | string;
};

export interface SearchResult {
    courses: ICourse[];
    programs: IProgram[];
    materials: IStudyMaterial[];
    totalResults: number;
}

// ===== REQUEST/RESPONSE INTERFACES =====
export interface CreateMaterialRequest {
    title: string;
    description: string;
    courseCode: string;
    materialType: IStudyMaterial['materialType'];
    professor?: string;
    semester?: {
        term: 'fall' | 'winter' | 'summer';
        year: number;
    };
    week?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    language?: 'english' | 'french' | 'other';
}

export interface SearchQuery {
    query?: string;
    courseCode?: string;
    program?: string;
    materialType?: string;
    difficulty?: string;
    professor?: string;
    semester?: string;
    sortBy?: 'relevance' | 'date' | 'rating' | 'downloads';
    page?: number;
    limit?: number;
}

export interface MaterialStats {
    totalMaterials: number;
    materialsByType: Record<string, number>;
    materialsByDifficulty: Record<string, number>;
    topCourses: { course: string; count: number }[];
    recentUploads: IStudyMaterial[];
}