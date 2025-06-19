import mongoose, { Document, Schema, Model } from 'mongoose';

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    sender?: mongoose.Types.ObjectId; // Optional - system notifications don't have sender

    // Notification content
    title: string;
    message: string;
    type: 'comment' | 'rating' | 'material-approved' | 'material-rejected' |
    'new-material' | 'course-update' | 'reminder' | 'system' |
    'enrollment' | 'achievement' | 'report-resolved';

    // Context references
    relatedModel?: 'StudyMaterial' | 'Course' | 'Program' | 'User' | 'Enrollment';
    relatedId?: mongoose.Types.ObjectId;

    // Additional data for rich notifications
    metadata?: {
        course?: {
            id: mongoose.Types.ObjectId;
            name: string;
            code: string;
        };
        material?: {
            id: mongoose.Types.ObjectId;
            title: string;
            category: string;
        };
        user?: {
            id: mongoose.Types.ObjectId;
            name: string;
            profilePic?: string;
        };
        action?: string; // 'liked', 'commented', 'shared', etc.
        grade?: string;
        points?: number;
    };

    // Notification status
    isRead: boolean;
    isArchived: boolean;
    readAt?: Date;

    // Delivery settings
    priority: 'low' | 'medium' | 'high' | 'urgent';
    channels: ('in-app' | 'email' | 'push')[];

    // Scheduling
    scheduledFor?: Date; // For delayed notifications
    expiresAt?: Date; // Auto-delete after this date

    createdAt: Date;
    updatedAt: Date;
}

export interface INotificationModel extends Model<INotification> {
    findByUser(userId: string, options?: any): Promise<INotification[]>;
    findUnread(userId: string): Promise<INotification[]>;
    markAsRead(userId: string, notificationIds: string[]): Promise<any>;
    markAllAsRead(userId: string): Promise<any>;
    createNotification(data: Partial<INotification>): Promise<INotification>;
    getNotificationStats(userId: string): Promise<any>;
    cleanupExpired(): Promise<any>;
}

const notificationSchema = new Schema<INotification>({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipient is required']
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },

    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        maxlength: [500, 'Message cannot exceed 500 characters']
    },

    type: {
        type: String,
        enum: {
            values: [
                'comment', 'rating', 'material-approved', 'material-rejected',
                'new-material', 'course-update', 'reminder', 'system',
                'enrollment', 'achievement', 'report-resolved'
            ],
            message: 'Invalid notification type'
        },
        required: [true, 'Type is required']
    },

    relatedModel: {
        type: String,
        enum: {
            values: ['StudyMaterial', 'Course', 'Program', 'User', 'Enrollment'],
            message: 'Invalid related model'
        }
    },

    relatedId: {
        type: Schema.Types.ObjectId
    },

    metadata: {
        course: {
            id: {
                type: Schema.Types.ObjectId,
                ref: 'Course'
            },
            name: String,
            code: String
        },
        material: {
            id: {
                type: Schema.Types.ObjectId,
                ref: 'StudyMaterial'
            },
            title: String,
            category: String
        },
        user: {
            id: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            name: String,
            profilePic: String
        },
        action: {
            type: String,
            maxlength: [50, 'Action cannot exceed 50 characters']
        },
        grade: {
            type: String,
            maxlength: [10, 'Grade cannot exceed 10 characters']
        },
        points: {
            type: Number,
            min: [0, 'Points cannot be negative']
        }
    },

    isRead: {
        type: Boolean,
        default: false
    },

    isArchived: {
        type: Boolean,
        default: false
    },

    readAt: {
        type: Date
    },

    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high', 'urgent'],
            message: 'Invalid priority level'
        },
        default: 'medium'
    },

    channels: [{
        type: String,
        enum: {
            values: ['in-app', 'email', 'push'],
            message: 'Invalid notification channel'
        }
    }],

    scheduledFor: {
        type: Date,
        validate: {
            validator: function (v: Date) {
                return !v || v >= new Date();
            },
            message: 'Scheduled date must be in the future'
        }
    },

    expiresAt: {
        type: Date,
        validate: {
            validator: function (v: Date) {
                return !v || v > new Date();
            },
            message: 'Expiration date must be in the future'
        }
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ isRead: 1, isArchived: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ relatedModel: 1, relatedId: 1 });

// Virtual for notification age
notificationSchema.virtual('ageInHours').get(function (this: INotification) {
    const diffTime = Math.abs(new Date().getTime() - this.createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60));
});

// Virtual for time until scheduled
notificationSchema.virtual('hoursUntilScheduled').get(function (this: INotification) {
    if (!this.scheduledFor) return null;
    const diffTime = this.scheduledFor.getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60));
});

// Pre-save middleware to set default channels
notificationSchema.pre<INotification>('save', function (next) {
    if (this.isNew && this.channels.length === 0) {
        // Default channels based on priority
        switch (this.priority) {
            case 'urgent':
                this.channels = ['in-app', 'email', 'push'];
                break;
            case 'high':
                this.channels = ['in-app', 'email'];
                break;
            case 'medium':
                this.channels = ['in-app'];
                break;
            case 'low':
                this.channels = ['in-app'];
                break;
        }
    }
    next();
});

// Pre-save middleware to set expiration date
notificationSchema.pre<INotification>('save', function (next) {
    if (this.isNew && !this.expiresAt) {
        // Auto-expire notifications based on type
        const daysToExpire = this.type === 'system' ? 7 : 30;
        this.expiresAt = new Date(Date.now() + daysToExpire * 24 * 60 * 60 * 1000);
    }
    next();
});

// Static methods
notificationSchema.statics.findByUser = function (
    userId: string,
    options: any = {}
): Promise<INotification[]> {
    const query: any = {
        recipient: userId,
        isArchived: options.includeArchived || false
    };

    if (options.type) {
        query.type = options.type;
    }

    if (options.isRead !== undefined) {
        query.isRead = options.isRead;
    }

    return this.find(query)
        .populate('sender', 'fullName profilePic')
        .sort(options.sort || { createdAt: -1 })
        .limit(options.limit || 50);
};

notificationSchema.statics.findUnread = function (
    userId: string
): Promise<INotification[]> {
    return this.find({
        recipient: userId,
        isRead: false,
        isArchived: false
    })
        .populate('sender', 'fullName profilePic')
        .sort({ createdAt: -1 });
};

notificationSchema.statics.markAsRead = function (
    userId: string,
    notificationIds: string[]
) {
    return this.updateMany(
        {
            _id: { $in: notificationIds },
            recipient: userId
        },
        {
            $set: {
                isRead: true,
                readAt: new Date()
            }
        }
    );
};

notificationSchema.statics.markAllAsRead = function (
    userId: string
) {
    return this.updateMany(
        {
            recipient: userId,
            isRead: false
        },
        {
            $set: {
                isRead: true,
                readAt: new Date()
            }
        }
    );
};

notificationSchema.statics.createNotification = function (
    data: Partial<INotification>
): Promise<INotification> {
    const notification = new this(data);
    return notification.save();
};

notificationSchema.statics.getNotificationStats = function (
    userId: string
) {
    return this.aggregate([
        { $match: { recipient: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$type',
                total: { $sum: 1 },
                unread: {
                    $sum: {
                        $cond: [{ $eq: ['$isRead', false] }, 1, 0]
                    }
                }
            }
        },
        { $sort: { total: -1 } }
    ]);
};

notificationSchema.statics.cleanupExpired = function () {
    return this.deleteMany({
        expiresAt: { $lt: new Date() }
    });
};

// Instance methods
notificationSchema.methods.markAsRead = function (this: INotification) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

notificationSchema.methods.archive = function (this: INotification) {
    this.isArchived = true;
    return this.save();
};

notificationSchema.methods.unarchive = function (this: INotification) {
    this.isArchived = false;
    return this.save();
};

export const Notification = mongoose.model<INotification, INotificationModel>('Notification', notificationSchema);
export default Notification;