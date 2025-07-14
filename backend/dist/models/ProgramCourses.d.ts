import mongoose, { Document } from 'mongoose';
export interface IProgramCourse {
    id: string;
    code: string;
    name: string;
    credits?: number;
    description?: string;
}
export interface IProgramRequirement {
    id: string;
    type: 'general_education' | 'professional_options' | 'electives' | 'other';
    title: string;
    description: string;
    selectCount: number;
    availableCourses: IProgramCourse[];
    isRequired: boolean;
    category?: string;
    externalLinks?: string[];
}
export interface IProgramSemester {
    id: string;
    name: string;
    type: 'regular' | 'work_integrated_learning' | 'coop';
    order: number;
    coreCourses: IProgramCourse[];
    requirements: IProgramRequirement[];
    totalCredits?: number;
    prerequisites?: string[];
    notes?: string;
    isOptional?: boolean;
}
export interface IProgramCourses extends Document {
    programId: string;
    programName: string;
    semesters: IProgramSemester[];
    totalSemesters: number;
    totalCredits?: number;
    hasWorkIntegratedLearning?: boolean;
    migratedFrom?: string;
    migrationDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProgramCourses: mongoose.Model<IProgramCourses, {}, {}, {}, mongoose.Document<unknown, {}, IProgramCourses, {}> & IProgramCourses & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ProgramCourses.d.ts.map