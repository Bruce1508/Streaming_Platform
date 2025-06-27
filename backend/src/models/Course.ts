import mongoose, { Schema, Document } from 'mongoose';

// ===== PROGRAM COURSES MODEL =====
// Interface for individual course in a semester
export interface IProgramCourse {
    id: string;
    code: string;
    name: string;
}

// Interface for requirement in a semester
export interface IProgramRequirement {
    type: string;
    count: number;
    description: string;
}

// Interface for semester
export interface IProgramSemester {
    id: string;
    name: string;
    courses: IProgramCourse[];
    requirements?: IProgramRequirement[];
    totalCourses?: number;
}

// Interface for program courses document
export interface IProgramCourses extends Document {
    programId: string;
    programName: string;
    semesters: IProgramSemester[];
    createdAt: Date;
    updatedAt: Date;
}

const programCoursesSchema = new Schema<IProgramCourses>({
    programId: {
        type: String,
        required: [true, 'Program ID is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    programName: {
        type: String,
        required: [true, 'Program name is required'],
        trim: true
    },
    semesters: [{
        id: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        courses: [{
            id: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            },
            code: {
                type: String,
                required: true,
                trim: true,
                uppercase: true
            },
            name: {
                type: String,
                required: true,
                trim: true
            }
        }],
        requirements: [{
            type: {
                type: String,
                required: true,
                trim: true
            },
            count: {
                type: Number,
                required: true,
                min: 1
            },
            description: {
                type: String,
                required: true,
                trim: true
            }
        }],
        totalCourses: {
            type: Number,
            min: 0
        }
    }]
}, {
    timestamps: true
});

// Indexes for ProgramCourses (programId already has index from unique: true)
programCoursesSchema.index({ programName: 'text' });
programCoursesSchema.index({ 'semesters.courses.code': 1 });
programCoursesSchema.index({ 'semesters.courses.name': 'text' });

export const ProgramCourses = mongoose.model<IProgramCourses>('ProgramCourses', programCoursesSchema);