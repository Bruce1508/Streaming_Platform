import mongoose, { Document, Model } from 'mongoose';
export interface IEnrollment extends Document {
    user: mongoose.Types.ObjectId;
    school: mongoose.Types.ObjectId;
    program: mongoose.Types.ObjectId;
    enrollmentDate: Date;
    expectedGraduation: Date;
    currentSemester: number;
    status: 'active' | 'completed' | 'dropped' | 'suspended' | 'transferred';
    gpa?: number;
    totalCredits: number;
    completedCredits: number;
    courses: {
        course: string;
        semester: number;
        year: number;
        term: 'fall' | 'winter' | 'summer';
        status: 'enrolled' | 'completed' | 'dropped' | 'in-progress';
        grade?: string;
        credits: number;
        enrolledAt: Date;
        completedAt?: Date;
    }[];
    isPublic: boolean;
    graduationYear?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    completionPercentage: number;
}
export interface IEnrollmentModel extends Model<IEnrollment> {
    findByUser(userId: string): Promise<IEnrollment[]>;
    findByProgram(programId: string, options?: any): Promise<IEnrollment[]>;
    findClassmates(userId: string, programId: string): Promise<IEnrollment[]>;
    getEnrollmentStats(programId: string): Promise<any>;
}
export declare const Enrollment: IEnrollmentModel;
export default Enrollment;
//# sourceMappingURL=Enrollment.d.ts.map