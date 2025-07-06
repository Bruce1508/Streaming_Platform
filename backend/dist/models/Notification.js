"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const notificationSchema = new mongoose_1.Schema({
    recipient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipient is required']
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId
    },
    metadata: {
        course: {
            id: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Course'
            },
            name: String,
            code: String
        },
        material: {
            id: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'StudyMaterial'
            },
            title: String,
            category: String
        },
        user: {
            id: {
                type: mongoose_1.Schema.Types.ObjectId,
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
            validator: function (v) {
                return !v || v >= new Date();
            },
            message: 'Scheduled date must be in the future'
        }
    },
    expiresAt: {
        type: Date,
        validate: {
            validator: function (v) {
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
notificationSchema.virtual('ageInHours').get(function () {
    const diffTime = Math.abs(new Date().getTime() - this.createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60));
});
// Virtual for time until scheduled
notificationSchema.virtual('hoursUntilScheduled').get(function () {
    if (!this.scheduledFor)
        return null;
    const diffTime = this.scheduledFor.getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60));
});
// Pre-save middleware to set default channels
notificationSchema.pre('save', function (next) {
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
notificationSchema.pre('save', function (next) {
    if (this.isNew && !this.expiresAt) {
        // Auto-expire notifications based on type
        const daysToExpire = this.type === 'system' ? 7 : 30;
        this.expiresAt = new Date(Date.now() + daysToExpire * 24 * 60 * 60 * 1000);
    }
    next();
});
// Static methods
notificationSchema.statics.findByUser = function (userId, options = {}) {
    const query = {
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
notificationSchema.statics.findUnread = function (userId) {
    return this.find({
        recipient: userId,
        isRead: false,
        isArchived: false
    })
        .populate('sender', 'fullName profilePic')
        .sort({ createdAt: -1 });
};
notificationSchema.statics.markAsRead = function (userId, notificationIds) {
    return this.updateMany({
        _id: { $in: notificationIds },
        recipient: userId
    }, {
        $set: {
            isRead: true,
            readAt: new Date()
        }
    });
};
notificationSchema.statics.markAllAsRead = function (userId) {
    return this.updateMany({
        recipient: userId,
        isRead: false
    }, {
        $set: {
            isRead: true,
            readAt: new Date()
        }
    });
};
notificationSchema.statics.createNotification = function (data) {
    const notification = new this(data);
    return notification.save();
};
notificationSchema.statics.getNotificationStats = function (userId) {
    return this.aggregate([
        { $match: { recipient: new mongoose_1.default.Types.ObjectId(userId) } },
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
notificationSchema.methods.markAsRead = function () {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};
notificationSchema.methods.archive = function () {
    this.isArchived = true;
    return this.save();
};
notificationSchema.methods.unarchive = function () {
    this.isArchived = false;
    return this.save();
};
exports.Notification = mongoose_1.default.model('Notification', notificationSchema);
exports.default = exports.Notification;
//# sourceMappingURL=Notification.js.map