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
exports.ProgramCourses = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const programCoursesSchema = new mongoose_1.Schema({
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
exports.ProgramCourses = mongoose_1.default.model('ProgramCourses', programCoursesSchema);
//# sourceMappingURL=ProgramCourses.js.map