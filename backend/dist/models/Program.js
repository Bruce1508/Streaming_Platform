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
exports.Program = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const programSchema = new mongoose_1.Schema({
    // Simplified schema with standardized fields
    id: {
        type: String,
        required: [true, 'Program ID is required'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Program code is required'],
        uppercase: true,
        trim: true,
        maxlength: [50, 'Program code cannot exceed 50 characters']
    },
    name: {
        type: String,
        required: [true, 'Program name is required'],
        trim: true,
        maxlength: [200, 'Program name cannot exceed 200 characters']
    },
    duration: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'Duration cannot exceed 100 characters']
    },
    campus: [{
            type: String,
            trim: true
        }],
    credential: {
        type: String,
        required: [true, 'Credential is required'],
        enum: ['bachelor', 'diploma', 'advanced diploma', 'certificate'],
        lowercase: true
    },
    // Optional legacy fields for backward compatibility
    programId: {
        type: String,
        trim: true,
        lowercase: true
    },
    overview: {
        type: String,
        required: false,
        trim: true,
        maxlength: [2000, 'Overview cannot exceed 2000 characters']
    },
    delivery: {
        type: String,
        trim: true,
        maxlength: [200, 'Delivery cannot exceed 200 characters']
    },
    school: {
        type: String,
        trim: true,
        maxlength: [200, 'School name cannot exceed 200 characters']
    },
    level: {
        type: String,
        enum: [
            'Certificate',
            'Diploma',
            'Advanced Diploma',
            'Bachelor',
            'Graduate Certificate',
            'Honours Bachelor Degree',
            'Honours Bachelor',
            'Seneca Certificate of Standing',
            'Certificate of Apprenticeship, Ontario College Certificate'
        ]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    stats: {
        enrollmentCount: {
            type: Number,
            default: 0,
            min: [0, 'Enrollment count cannot be negative']
        },
        graduationRate: {
            type: Number,
            min: [0, 'Graduation rate cannot be negative'],
            max: [100, 'Graduation rate cannot exceed 100%']
        },
        employmentRate: {
            type: Number,
            min: [0, 'Employment rate cannot be negative'],
            max: [100, 'Employment rate cannot exceed 100%']
        }
    },
    // Semester and course structure for imported data
    semesters: [{
            id: {
                type: String,
                trim: true
            },
            name: {
                type: String,
                trim: true
            },
            courses: [{
                    id: {
                        type: String,
                        trim: true
                    },
                    code: {
                        type: String,
                        uppercase: true,
                        trim: true
                    },
                    name: {
                        type: String,
                        trim: true
                    }
                }]
        }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes
// Note: programId and code already have unique indexes from field definitions
programSchema.index({ school: 1 });
programSchema.index({ level: 1 });
programSchema.index({ isActive: 1 });
programSchema.index({ name: 'text', overview: 'text', description: 'text' });
// Virtual for courses - commented out until Course model is properly implemented
// programSchema.virtual('courses', {
//     ref: 'Course',
//     localField: '_id',
//     foreignField: 'programs.program'
// });
exports.Program = mongoose_1.default.model('Program', programSchema);
//# sourceMappingURL=Program.js.map