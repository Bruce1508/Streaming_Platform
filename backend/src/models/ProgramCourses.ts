import mongoose, { Schema, Document } from 'mongoose';

// ===== PROGRAM COURSES MODEL =====
// Interface for individual course in a semester
export interface IProgramCourse {
    id: string;
    code: string;
    name: string;
    credits?: number;
    description?: string;
}

// Interface for requirement in a semester
export interface IProgramRequirement {
    id: string;
    type: 'general_education' | 'professional_options' | 'electives' | 'other';
    title: string;
    description: string;
    selectCount: number; // Số môn cần chọn
    availableCourses: IProgramCourse[];
    isRequired: boolean;
    category?: string;
    externalLinks?: string[]; // Links to external pages for General Education
}

// Interface for semester
export interface IProgramSemester {
    id: string;
    name: string;
    type: 'regular' | 'work_integrated_learning' | 'coop'; // Thêm type cho Co-op terms
    order: number;
    coreCourses: IProgramCourse[];
    requirements: IProgramRequirement[];
    totalCredits?: number;
    prerequisites?: string[];
    notes?: string;
    isOptional?: boolean; // For Work-Integrated Learning terms
}

// Interface for program courses document
export interface IProgramCourses extends Document {
    programId: string;
    programName: string;
    semesters: IProgramSemester[];
    totalSemesters: number;
    totalCredits?: number;
    hasWorkIntegratedLearning?: boolean; // Flag for Co-op programs
    migratedFrom?: string;
    migrationDate?: Date;
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
        id: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        type: { 
            type: String, 
            enum: ['regular', 'work_integrated_learning', 'coop'],
            default: 'regular'
        },
        order: { type: Number, required: true },
        coreCourses: [{
            id: { type: String, required: true, trim: true, lowercase: true },
            code: { type: String, required: true, trim: true, uppercase: true },
            name: { type: String, required: true, trim: true },
            credits: { type: Number },
            description: { type: String }
        }],
        requirements: [{
            id: { type: String, required: true, trim: true },
            type: { 
                type: String, 
                enum: ['general_education', 'professional_options', 'electives', 'other'],
                required: true, 
                trim: true 
            },
            title: { type: String, required: true, trim: true },
            description: { type: String, required: true, trim: true },
            selectCount: { type: Number, required: true, min: 1 },
            availableCourses: [{
                id: { type: String, required: true, trim: true, lowercase: true },
                code: { type: String, required: true, trim: true, uppercase: true },
                name: { type: String, required: true, trim: true },
                credits: { type: Number },
                description: { type: String }
            }],
            isRequired: { type: Boolean, default: true },
            category: { type: String },
            externalLinks: [{ type: String }] // For General Education external links
        }],
        totalCredits: { type: Number },
        prerequisites: [{ type: String }],
        notes: { type: String },
        isOptional: { type: Boolean, default: false }
    }],
    totalSemesters: { type: Number, required: true },
    totalCredits: { type: Number },
    hasWorkIntegratedLearning: { type: Boolean, default: false },
    migratedFrom: { type: String },
    migrationDate: { type: Date }
}, {
    timestamps: true
});

// Indexes for ProgramCourses 
programCoursesSchema.index({ programName: 'text' });
programCoursesSchema.index({ 'semesters.coreCourses.code': 1 });
programCoursesSchema.index({ 'semesters.coreCourses.name': 'text' });
programCoursesSchema.index({ 'semesters.requirements.availableCourses.code': 1 });
programCoursesSchema.index({ hasWorkIntegratedLearning: 1 });

export const ProgramCourses = mongoose.model<IProgramCourses>('ProgramCourses', programCoursesSchema);