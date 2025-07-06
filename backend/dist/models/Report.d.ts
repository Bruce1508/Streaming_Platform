import mongoose, { Document, Model } from 'mongoose';
export interface IReport extends Document {
    reporter: mongoose.Types.ObjectId;
    reportedUser?: mongoose.Types.ObjectId;
    targetType: 'StudyMaterial' | 'User' | 'Comment';
    targetId: mongoose.Types.ObjectId;
    reason: 'inappropriate-content' | 'copyright-violation' | 'spam' | 'harassment' | 'fake-information' | 'academic-dishonesty' | 'privacy-violation' | 'other';
    category: 'content' | 'behavior' | 'technical' | 'legal';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    evidence?: {
        screenshots?: string[];
        urls?: string[];
        additionalInfo?: string;
    };
    status: 'pending' | 'under-review' | 'resolved' | 'dismissed' | 'escalated';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    resolvedAt?: Date;
    resolution?: {
        action: 'no-action' | 'warning-sent' | 'content-removed' | 'user-suspended' | 'user-banned' | 'content-modified' | 'other';
        notes: string;
        resolvedBy: mongoose.Types.ObjectId;
        followUpRequired: boolean;
    };
    internalNotes?: {
        note: string;
        addedBy: mongoose.Types.ObjectId;
        addedAt: Date;
    }[];
    relatedReports?: mongoose.Types.ObjectId[];
    isAnonymous: boolean;
    reporterIpAddress?: string;
    userAgent?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IReportModel extends Model<IReport> {
    findPending(options?: any): Promise<IReport[]>;
    findByTarget(targetType: string, targetId: string): Promise<IReport[]>;
    findByReporter(reporterId: string): Promise<IReport[]>;
    getReportStats(): Promise<any>;
    findSimilarReports(reportId: string): Promise<IReport[]>;
    escalateReport(reportId: string, reason: string): Promise<IReport | null>;
}
export declare const Report: IReportModel;
export default Report;
//# sourceMappingURL=Report.d.ts.map