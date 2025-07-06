import mongoose, { Document } from 'mongoose';
export interface IProgramCourse {
    id: string;
    code: string;
    name: string;
}
export interface IProgramRequirement {
    type: string;
    count: number;
    description: string;
}
export interface IProgramSemester {
    id: string;
    name: string;
    courses: IProgramCourse[];
    requirements?: IProgramRequirement[];
    totalCourses?: number;
}
export interface IProgramCourses extends Document {
    programId: string;
    programName: string;
    semesters: IProgramSemester[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProgramCourses: mongoose.Model<IProgramCourses, {}, {}, {}, mongoose.Document<unknown, {}, IProgramCourses, {}> & IProgramCourses & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Course.d.ts.map