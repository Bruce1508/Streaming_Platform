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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSession = void 0;
// models/UserSession.ts - Enhanced version
const mongoose_1 = __importStar(require("mongoose"));
const userSessionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    location: {
        country: String,
        city: String,
        timezone: String
    },
    deviceType: {
        type: String,
        enum: ['mobile', 'tablet', 'desktop', 'unknown'],
        default: 'unknown'
    },
    loginMethod: {
        type: String,
        enum: ['password', 'oauth'],
        default: 'password'
    }
}, {
    timestamps: true
});
// 🆕 Compound indexes for better performance
userSessionSchema.index({ userId: 1, isActive: 1 });
userSessionSchema.index({ userId: 1, lastActivity: -1 });
userSessionSchema.index({ sessionId: 1, isActive: 1 });
// TTL index - sessions expire after 30 days of inactivity
userSessionSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
// 🆕 Instance methods
userSessionSchema.methods.updateActivity = function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.lastActivity = new Date();
        yield this.save();
    });
};
userSessionSchema.methods.deactivate = function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.isActive = false;
        yield this.save();
    });
};
// 🆕 Static methods
userSessionSchema.statics.findActiveSessions = function (userId) {
    return this.find({
        userId: new mongoose_1.default.Types.ObjectId(userId),
        isActive: true
    }).sort({ lastActivity: -1 });
};
userSessionSchema.statics.deactivateOldestSession = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const oldestSession = yield this.findOne({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            isActive: true
        }).sort({ lastActivity: 1 });
        if (oldestSession) {
            yield oldestSession.deactivate();
        }
        return oldestSession;
    });
};
exports.UserSession = mongoose_1.default.model('UserSession', userSessionSchema);
//# sourceMappingURL=UserSession.js.map