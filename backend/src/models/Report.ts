import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReport extends Document {
    reporter: mongoose.Types.ObjectId;
    reportedUser?: mongoose.Types.ObjectId; // If reporting a user

    // What's being reported
    targetType: 'StudyMaterial' | 'User' | 'Comment';
    targetId: mongoose.Types.ObjectId;

    // Report details
    reason: 'inappropriate-content' | 'copyright-violation' | 'spam' |
    'harassment' | 'fake-information' | 'academic-dishonesty' |
    'privacy-violation' | 'other';

    category: 'content' | 'behavior' | 'technical' | 'legal';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';

    // Evidence/Context
    evidence?: {
        screenshots?: string[]; // URLs to uploaded screenshots
        urls?: string[]; // Related URLs
        additionalInfo?: string;
    };

    // Report status and handling
    status: 'pending' | 'under-review' | 'resolved' | 'dismissed' | 'escalated';
    priority: 'low' | 'medium' | 'high' | 'urgent';

    // Moderation details
    assignedTo?: mongoose.Types.ObjectId; // Admin/moderator handling this
    reviewedAt?: Date;
    resolvedAt?: Date;

    // Resolution details
    resolution?: {
        action: 'no-action' | 'warning-sent' | 'content-removed' |
        'user-suspended' | 'user-banned' | 'content-modified' | 'other';
        notes: string;
        resolvedBy: mongoose.Types.ObjectId;
        followUpRequired: boolean;
    };

    // Administrative notes
    internalNotes?: {
        note: string;
        addedBy: mongoose.Types.ObjectId;
        addedAt: Date;
    }[];

    // Related reports (for patterns)
    relatedReports?: mongoose.Types.ObjectId[];

    // Metadata
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

const reportSchema = new Schema<IReport>({
    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Reporter is required']
    },

    reportedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    targetType: {
        type: String,
        enum: {
            values: ['StudyMaterial', 'User', 'Comment'],
            message: 'Invalid target type'
        },
        required: [true, 'Target type is required']
    },

    targetId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Target ID is required']
    },

    reason: {
        type: String,
        enum: {
            values: [
                'inappropriate-content', 'copyright-violation', 'spam',
                'harassment', 'fake-information', 'academic-dishonesty',
                'privacy-violation', 'other'
            ],
            message: 'Invalid report reason'
        },
        required: [true, 'Reason is required']
    },

    category: {
        type: String,
        enum: {
            values: ['content', 'behavior', 'technical', 'legal'],
            message: 'Invalid category'
        },
        required: [true, 'Category is required']
    },

    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },

    severity: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high', 'critical'],
            message: 'Invalid severity level'
        },
        required: [true, 'Severity is required']
    },

    evidence: {
        screenshots: [{
            type: String,
            validate: {
                validator: function (v: string) {
                    return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
                },
                message: 'Invalid screenshot URL'
            }
        }],
        urls: [{
            type: String,
            validate: {
                validator: function (v: string) {
                    return /^https?:\/\/.+/.test(v);
                },
                message: 'Invalid URL format'
            }
        }],
        additionalInfo: {
            type: String,
            maxlength: [500, 'Additional info cannot exceed 500 characters']
        }
    },

    status: {
        type: String,
        enum: {
            values: ['pending', 'under-review', 'resolved', 'dismissed', 'escalated'],
            message: 'Invalid status'
        },
        default: 'pending'
    },

    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high', 'urgent'],
            message: 'Invalid priority'
        },
        default: 'medium'
    },

    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    reviewedAt: {
        type: Date
    },

    resolvedAt: {
        type: Date
    },

    resolution: {
        action: {
            type: String,
            enum: {
                values: [
                    'no-action', 'warning-sent', 'content-removed',
                    'user-suspended', 'user-banned', 'content-modified', 'other'
                ],
                message: 'Invalid resolution action'
            }
        },
        notes: {
            type: String,
            maxlength: [1000, 'Resolution notes cannot exceed 1000 characters']
        },
        resolvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        followUpRequired: {
            type: Boolean,
            default: false
        }
    },

    internalNotes: [{
        note: {
            type: String,
            required: true,
            maxlength: [500, 'Internal note cannot exceed 500 characters']
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],

    relatedReports: [{
        type: Schema.Types.ObjectId,
        ref: 'Report'
    }],

    isAnonymous: {
        type: Boolean,
        default: false
    },

    reporterIpAddress: {
        type: String,
        validate: {
            validator: function (v: string) {
                return !v || /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(v);
            },
            message: 'Invalid IP address format'
        }
    },

    userAgent: {
        type: String,
        maxlength: [500, 'User agent cannot exceed 500 characters']
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
reportSchema.index({ status: 1, priority: 1, createdAt: -1 });
reportSchema.index({ targetType: 1, targetId: 1 });
reportSchema.index({ reporter: 1, createdAt: -1 });
reportSchema.index({ assignedTo: 1, status: 1 });
reportSchema.index({ reason: 1, category: 1 });
reportSchema.index({ reportedUser: 1 });
reportSchema.index({ createdAt: -1 });

// Compound index for efficient queries
reportSchema.index({ status: 1, severity: 1, priority: 1 });

// Virtual for resolution time
reportSchema.virtual('resolutionTimeHours').get(function (this: IReport) {
    if (!this.resolvedAt) return null;
    const diffTime = this.resolvedAt.getTime() - this.createdAt.getTime();
    return Math.round(diffTime / (1000 * 60 * 60) * 10) / 10; // Round to 1 decimal
});

// Virtual for time since reported
reportSchema.virtual('ageInHours').get(function (this: IReport) {
    const diffTime = Date.now() - this.createdAt.getTime();
    return Math.round(diffTime / (1000 * 60 * 60) * 10) / 10;
});

// Virtual for is overdue (based on priority)
reportSchema.virtual('isOverdue').get(function (this: IReport) {
    if (this.status === 'resolved' || this.status === 'dismissed') return false;

    const hoursLimit = {
        'urgent': 2,
        'high': 24,
        'medium': 72,
        'low': 168 // 1 week
    };

    return this.get('ageInHours') > hoursLimit[this.priority];
});

// Pre-save middleware to auto-assign priority based on severity and reason
reportSchema.pre<IReport>('save', function (next) {
    if (this.isNew) {
        // Auto-escalate certain reasons
        const criticalReasons = ['harassment', 'academic-dishonesty', 'copyright-violation'];
        if (criticalReasons.includes(this.reason) || this.severity === 'critical') {
            this.priority = 'urgent';
        } else if (this.severity === 'high') {
            this.priority = 'high';
        }

        // Set reviewed timestamp when status changes to under-review
        if (this.status === 'under-review' && !this.reviewedAt) {
            this.reviewedAt = new Date();
        }

        // Set resolved timestamp when status changes to resolved
        if ((this.status === 'resolved' || this.status === 'dismissed') && !this.resolvedAt) {
            this.resolvedAt = new Date();
        }
    }
    next();
});

// Pre-save middleware to update material report count
reportSchema.pre<IReport>('save', async function (next) {
    if (this.isNew && this.targetType === 'StudyMaterial') {
        await mongoose.model('StudyMaterial').findByIdAndUpdate(
            this.targetId,
            {
                $inc: { reportCount: 1 },
                $set: { isReported: true }
            }
        );
    }
    next();
});

// Static methods
reportSchema.statics.findPending = function (
    options: any = {}
): Promise<IReport[]> {
    const query: any = {
        status: { $in: ['pending', 'under-review'] }
    };

    if (options.priority) {
        query.priority = options.priority;
    }

    if (options.category) {
        query.category = options.category;
    }

    return this.find(query)
        .populate('reporter', 'fullName email')
        .populate('reportedUser', 'fullName email')
        .populate('assignedTo', 'fullName')
        .sort(options.sort || { priority: -1, createdAt: 1 })
        .limit(options.limit || 50);
};

reportSchema.statics.findByTarget = function (
    targetType: string,
    targetId: string
): Promise<IReport[]> {
    return this.find({ targetType, targetId })
        .populate('reporter', 'fullName')
        .sort({ createdAt: -1 });
};

reportSchema.statics.findByReporter = function (
    reporterId: string
): Promise<IReport[]> {
    return this.find({ reporter: reporterId })
        .populate('assignedTo', 'fullName')
        .sort({ createdAt: -1 });
};

reportSchema.statics.getReportStats = function () {
    return this.aggregate([
        {
            $group: {
                _id: {
                    status: '$status',
                    reason: '$reason'
                },
                count: { $sum: 1 },
                avgResolutionHours: {
                    $avg: {
                        $divide: [
                            { $subtract: ['$resolvedAt', '$createdAt'] },
                            1000 * 60 * 60
                        ]
                    }
                }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);
};

reportSchema.statics.findSimilarReports = function (
    reportId: string
): Promise<IReport[]> {
    return this.findById(reportId).then((report: IReport | null) => {
        if (!report) return [];

        return this.find({
            _id: { $ne: reportId },
            $or: [
                { targetId: report.targetId },
                { reportedUser: report.reportedUser },
                { reason: report.reason, targetType: report.targetType }
            ]
        })
            .populate('reporter', 'fullName')
            .sort({ createdAt: -1 })
            .limit(10);
    });
};

reportSchema.statics.escalateReport = function (
    reportId: string,
    reason: string
): Promise<IReport | null> {
    return this.findByIdAndUpdate(
        reportId,
        {
            $set: {
                status: 'escalated',
                priority: 'urgent'
            },
            $push: {
                internalNotes: {
                    note: `Report escalated: ${reason}`,
                    addedBy: new mongoose.Types.ObjectId(), // Should be current admin
                    addedAt: new Date()
                }
            }
        },
        { new: true }
    );
};

// Instance methods
reportSchema.methods.assign = function (this: IReport, adminId: mongoose.Types.ObjectId) {
    this.assignedTo = adminId;
    this.status = 'under-review';
    this.reviewedAt = new Date();
    return this.save();
};

reportSchema.methods.resolve = function (
    this: IReport,
    action: string,
    notes: string,
    resolvedBy: mongoose.Types.ObjectId
) {
    this.status = 'resolved';
    this.resolvedAt = new Date();
    this.resolution = {
        action: action as any,
        notes,
        resolvedBy,
        followUpRequired: false
    };
    return this.save();
};

reportSchema.methods.addInternalNote = function (
    this: IReport,
    note: string,
    addedBy: mongoose.Types.ObjectId
) {
    this.internalNotes = this.internalNotes || [];
    this.internalNotes.push({
        note,
        addedBy,
        addedAt: new Date()
    });
    return this.save();
};

export const Report = mongoose.model<IReport, IReportModel>('Report', reportSchema);
export default Report;