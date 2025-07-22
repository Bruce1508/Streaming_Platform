"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstitutionFromEmail = exports.validateEducationalEmail = exports.getVerificationStatusFromEmail = exports.detectEducationalEmail = exports.emailService = exports.isEmailServiceAvailable = exports.sendBulkEmail = exports.sendMaterialRejectionEmail = exports.sendMaterialApprovalEmail = exports.sendEmailVerification = exports.sendPasswordResetEmail = exports.sendWelcomeEmail = exports.sendEmail = exports.emailTemplates = void 0;
// utils/email.utils.ts - FIXED VERSION
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_utils_1 = require("./logger.utils");
const Format_utils_1 = require("./Format.utils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ✅ Enhanced email formatting helper
const formatEmailContent = {
    formatName: (name) => (0, Format_utils_1.capitalize)(name.trim()),
    formatTitle: (title) => (0, Format_utils_1.truncate)(title, 60),
    formatReason: (reason) => (0, Format_utils_1.truncate)(reason, 200),
    createSafeUrl: (url) => url.trim()
};
// Create transporter using Gmail SMTP for both development and production
const createTransporter = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ✅ TEMPORARY: Use Ethereal for development until Gmail credentials are fixed
        if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Using Ethereal email for development (Gmail credentials not configured)');
            // Create Ethereal test account
            const testAccount = yield nodemailer_1.default.createTestAccount();
            const transporter = nodemailer_1.default.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            logger_utils_1.logger.info('Ethereal email transporter initialized for development', {
                user: testAccount.user,
                pass: testAccount.pass, // <--- add this line
                previewUrl: 'https://ethereal.email'
            });
            return transporter;
        }
        // Validate required environment variables for production
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            logger_utils_1.logger.error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS in .env file');
            return null;
        }
        // Use Gmail SMTP for production
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true', // false for TLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            // Gmail specific settings
            tls: {
                rejectUnauthorized: false
            }
        });
        logger_utils_1.logger.info('Gmail SMTP transporter initialized successfully', {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || '587',
            user: process.env.SMTP_USER
        });
        return transporter;
    }
    catch (error) {
        logger_utils_1.logger.error('Failed to initialize email transporter', error);
        return null;
    }
});
// Get transporter (simplified approach)
const getTransporter = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield createTransporter();
});
// ✅ Enhanced email templates with better formatting
exports.emailTemplates = {
    welcome: ({ name, loginUrl }) => {
        const formattedName = formatEmailContent.formatName(name);
        const safeUrl = formatEmailContent.createSafeUrl(loginUrl);
        return {
            subject: `Welcome to StudyBuddy, ${formattedName}!`,
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
                    <h1 style="color: #3B82F6;">Welcome to StudyBuddy, ${formattedName}!</h1>
                    <p>We're excited to have you join our academic community.</p>
                    <p>Get started by exploring study materials and connecting with fellow students:</p>
                    <a href="${safeUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
                        Start Learning
                    </a>
                    <p style="margin-top: 24px;">Best regards,<br><strong>The StudyBuddy Team</strong></p>
                </div>
            `
        };
    },
    resetPassword: ({ name, resetUrl, expiresIn }) => {
        const formattedName = formatEmailContent.formatName(name);
        const safeUrl = formatEmailContent.createSafeUrl(resetUrl);
        return {
            subject: 'Reset Your StudyBuddy Password',
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
                    <h1 style="color: #3B82F6;">Password Reset Request</h1>
                    <p>Hi ${formattedName},</p>
                    <p>You requested to reset your password. Click the button below to create a new password:</p>
                    <a href="${safeUrl}" style="background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
                        Reset Password
                    </a>
                    <p style="background: #FEF3C7; padding: 12px; border-radius: 6px; border-left: 4px solid #F59E0B;">
                        <strong>⚠️ This link expires in ${expiresIn}.</strong>
                    </p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p style="margin-top: 24px;">Best regards,<br><strong>The StudyBuddy Team</strong></p>
                </div>
            `
        };
    },
    magicLink: ({ name, magicLinkUrl, expiryMinutes }) => {
        const formattedName = formatEmailContent.formatName(name);
        const safeUrl = formatEmailContent.createSafeUrl(magicLinkUrl);
        return {
            subject: 'Your StudyHub Sign-in Link',
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
                    <h1 style="color: #3B82F6;">Your Sign-in Link</h1>
                    <p>Hi ${formattedName},</p>
                    <p>Click the button below to sign in to your StudyHub account:</p>
                    <a href="${safeUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
                        Sign In to StudyHub
                    </a>
                    <p style="background: #FEF3C7; padding: 12px; border-radius: 6px; border-left: 4px solid #F59E0B;">
                        <strong>⚠️ This link expires in ${expiryMinutes} minutes.</strong>
                    </p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p style="margin-top: 24px;">Best regards,<br><strong>The StudyHub Team</strong></p>
                </div>
            `
        };
    },
    emailVerification: ({ name, verificationUrl }) => {
        const formattedName = formatEmailContent.formatName(name);
        const safeUrl = formatEmailContent.createSafeUrl(verificationUrl);
        return {
            subject: 'Verify Your Email Address',
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
                    <h1 style="color: #3B82F6;">Verify Your Email</h1>
                    <p>Hi ${formattedName},</p>
                    <p>Please verify your email address to complete your registration:</p>
                    <a href="${safeUrl}" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
                        Verify Email
                    </a>
                    <p style="margin-top: 24px;">Best regards,<br><strong>The StudyBuddy Team</strong></p>
                </div>
            `
        };
    },
    materialApproved: ({ name, materialTitle, materialUrl }) => {
        const formattedName = formatEmailContent.formatName(name);
        const formattedTitle = formatEmailContent.formatTitle(materialTitle);
        const safeUrl = formatEmailContent.createSafeUrl(materialUrl);
        return {
            subject: `Your Study Material "${formattedTitle}" Has Been Approved!`,
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
                    <h1 style="color: #10B981;">Material Approved! 🎉</h1>
                    <p>Hi ${formattedName},</p>
                    <p>Great news! Your study material "<strong>${formattedTitle}</strong>" has been approved and is now live.</p>
                    <a href="${safeUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
                        View Material
                    </a>
                    <p style="background: #ECFDF5; padding: 12px; border-radius: 6px; border-left: 4px solid #10B981;">
                        <strong>✅ Thank you for contributing to our academic community!</strong>
                    </p>
                    <p style="margin-top: 24px;">Best regards,<br><strong>The StudyBuddy Team</strong></p>
                </div>
            `
        };
    },
    materialRejected: ({ name, materialTitle, reason }) => {
        const formattedName = formatEmailContent.formatName(name);
        const formattedTitle = formatEmailContent.formatTitle(materialTitle);
        const formattedReason = formatEmailContent.formatReason(reason);
        return {
            subject: `Study Material "${formattedTitle}" Needs Revision`,
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
                    <h1 style="color: #EF4444;">Material Needs Revision</h1>
                    <p>Hi ${formattedName},</p>
                    <p>Your study material "<strong>${formattedTitle}</strong>" needs some revisions before approval.</p>
                    <p style="background: #FEF2F2; padding: 12px; border-radius: 6px; border-left: 4px solid #EF4444;">
                        <strong>Revision Required:</strong><br>${formattedReason}
                    </p>
                    <p>Please update your material and resubmit when ready.</p>
                    <p style="margin-top: 24px;">Best regards,<br><strong>The StudyBuddy Team</strong></p>
                </div>
            `
        };
    }
};
// ✅ Enhanced core email sending function with better logging
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = yield getTransporter();
    if (!transporter) {
        logger_utils_1.logger.error('Email transporter not configured');
        return false;
    }
    try {
        const mailOptions = {
            from: options.from || process.env.EMAIL_FROM || 'noreply@studybuddy.com',
            to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        };
        const result = yield transporter.sendMail(mailOptions);
        // ✅ Enhanced logging with masked emails
        logger_utils_1.logger.info('Email sent successfully', {
            to: Array.isArray(options.to) ?
                options.to.map(email => (0, Format_utils_1.maskEmail)(email)).join(', ') :
                (0, Format_utils_1.maskEmail)(options.to),
            subject: (0, Format_utils_1.truncate)(options.subject, 50),
            messageId: result.messageId
        });
        // Gmail SMTP doesn't provide preview URLs like Ethereal
        // Email sent successfully via Gmail
        return true;
    }
    catch (error) {
        logger_utils_1.logger.error('Failed to send email', {
            error: error instanceof Error ? error.message : error,
            to: Array.isArray(options.to) ?
                options.to.map(email => (0, Format_utils_1.maskEmail)(email)).join(', ') :
                (0, Format_utils_1.maskEmail)(options.to),
            subject: (0, Format_utils_1.truncate)(options.subject, 50)
        });
        return false;
    }
});
exports.sendEmail = sendEmail;
// Template-based email functions
const sendWelcomeEmail = (to, data) => __awaiter(void 0, void 0, void 0, function* () {
    const template = exports.emailTemplates.welcome(data);
    return (0, exports.sendEmail)({
        to,
        subject: template.subject,
        html: template.html
    });
});
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendPasswordResetEmail = (to, data) => __awaiter(void 0, void 0, void 0, function* () {
    const template = exports.emailTemplates.resetPassword(data);
    return (0, exports.sendEmail)({
        to,
        subject: template.subject,
        html: template.html
    });
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const sendEmailVerification = (to, data) => __awaiter(void 0, void 0, void 0, function* () {
    const template = exports.emailTemplates.emailVerification(data);
    return (0, exports.sendEmail)({
        to,
        subject: template.subject,
        html: template.html
    });
});
exports.sendEmailVerification = sendEmailVerification;
const sendMaterialApprovalEmail = (to, data) => __awaiter(void 0, void 0, void 0, function* () {
    const template = exports.emailTemplates.materialApproved(data);
    return (0, exports.sendEmail)({
        to,
        subject: template.subject,
        html: template.html
    });
});
exports.sendMaterialApprovalEmail = sendMaterialApprovalEmail;
const sendMaterialRejectionEmail = (to, data) => __awaiter(void 0, void 0, void 0, function* () {
    const template = exports.emailTemplates.materialRejected(data);
    return (0, exports.sendEmail)({
        to,
        subject: template.subject,
        html: template.html
    });
});
exports.sendMaterialRejectionEmail = sendMaterialRejectionEmail;
// Bulk email function
const sendBulkEmail = (recipients, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    let sent = 0;
    let failed = 0;
    for (const recipient of recipients) {
        const success = yield (0, exports.sendEmail)({
            to: recipient,
            subject,
            html
        });
        if (success) {
            sent++;
        }
        else {
            failed++;
        }
        // Add delay to avoid rate limiting
        yield new Promise(resolve => setTimeout(resolve, 100));
    }
    logger_utils_1.logger.info('Bulk email completed', { sent, failed, total: recipients.length });
    return { sent, failed };
});
exports.sendBulkEmail = sendBulkEmail;
// Utility function to check if email service is available
const isEmailServiceAvailable = () => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = yield getTransporter();
    return transporter !== null;
});
exports.isEmailServiceAvailable = isEmailServiceAvailable;
// Default export object for backward compatibility
exports.emailService = {
    sendEmail: exports.sendEmail,
    sendWelcomeEmail: exports.sendWelcomeEmail,
    sendPasswordResetEmail: exports.sendPasswordResetEmail,
    sendEmailVerification: exports.sendEmailVerification,
    sendMaterialApprovalEmail: exports.sendMaterialApprovalEmail,
    sendMaterialRejectionEmail: exports.sendMaterialRejectionEmail,
    sendBulkEmail: exports.sendBulkEmail,
    isAvailable: exports.isEmailServiceAvailable
};
// Canadian educational institution domains
const CANADIAN_EDU_DOMAINS = {
    // Universities
    'utoronto.ca': 'University of Toronto',
    'utsc.utoronto.ca': 'University of Toronto Scarborough',
    'utm.utoronto.ca': 'University of Toronto Mississauga',
    'yorku.ca': 'York University',
    'queensu.ca': "Queen's University",
    'umanitoba.ca': 'University of Manitoba',
    'uwaterloo.ca': 'University of Waterloo',
    'mcmaster.ca': 'McMaster University',
    'uwo.ca': 'Western University',
    'carleton.ca': 'Carleton University',
    'uottawa.ca': 'University of Ottawa',
    'concordia.ca': 'Concordia University',
    'mcgill.ca': 'McGill University',
    // Colleges & Polytechnics
    'myseneca.ca': 'Seneca College',
    'georgebrown.ca': 'George Brown College',
    'humber.ca': 'Humber College',
    'centennialcollege.ca': 'Centennial College',
    'torontomu.ca': 'Toronto Metropolitan University',
    'ryerson.ca': 'Ryerson University (TMU)',
    'sheridancollege.ca': 'Sheridan College',
    'mohawkcollege.ca': 'Mohawk College',
    'algonquincollege.com': 'Algonquin College',
    'conestogac.on.ca': 'Conestoga College',
    'fanshawec.ca': 'Fanshawe College',
    'lambtoncollege.ca': 'Lambton College',
    'loyalistcollege.com': 'Loyalist College',
    'niagaracollege.ca': 'Niagara College',
    'stclaircollege.ca': 'St. Clair College',
    // General educational domains
    '.edu': 'Educational Institution',
    '.ac.ca': 'Academic Institution (Canada)'
};
// Student email patterns that might not have institutional domains
const STUDENT_EMAIL_PATTERNS = [
    /student\./i,
    /\.student\./i,
    /students\./i,
    /\.students\./i,
    /myseneca\./i,
    /my\.georgebrown\./i,
    /learn\.humber\./i,
    /student\.centennialcollege\./i,
    /my\.torontomu\./i
];
/**
 * Detect if an email belongs to an educational institution
 */
const detectEducationalEmail = (email) => {
    const normalizedEmail = email.toLowerCase().trim();
    const emailDomain = normalizedEmail.split('@')[1];
    if (!emailDomain) {
        return {
            isEducational: false,
            verificationMethod: 'none',
            confidence: 'low'
        };
    }
    // Method 1: Direct domain match (highest confidence)
    for (const [domain, institutionName] of Object.entries(CANADIAN_EDU_DOMAINS)) {
        if (emailDomain === domain || emailDomain.endsWith(`.${domain}`)) {
            logger_utils_1.logger.info('Educational email detected via domain match', {
                email: (0, Format_utils_1.maskEmail)(email),
                institution: institutionName,
                domain
            });
            return {
                isEducational: true,
                institutionName,
                domain: emailDomain,
                verificationMethod: 'domain-match',
                confidence: 'high'
            };
        }
    }
    // Method 2: Pattern matching for student subdomains (medium confidence)
    for (const pattern of STUDENT_EMAIL_PATTERNS) {
        if (pattern.test(normalizedEmail)) {
            logger_utils_1.logger.info('Educational email detected via pattern match', {
                email: (0, Format_utils_1.maskEmail)(email),
                pattern: pattern.toString()
            });
            return {
                isEducational: true,
                institutionName: 'Educational Institution (Pattern Match)',
                domain: emailDomain,
                verificationMethod: 'pattern-match',
                confidence: 'medium'
            };
        }
    }
    // Method 3: Generic educational domains (medium confidence)
    if (emailDomain.includes('.edu') || emailDomain.includes('.ac.')) {
        logger_utils_1.logger.info('Educational email detected via generic domain', {
            email: (0, Format_utils_1.maskEmail)(email),
            domain: emailDomain
        });
        return {
            isEducational: true,
            institutionName: 'Educational Institution',
            domain: emailDomain,
            verificationMethod: 'domain-match',
            confidence: 'medium'
        };
    }
    return {
        isEducational: false,
        verificationMethod: 'none',
        confidence: 'low'
    };
};
exports.detectEducationalEmail = detectEducationalEmail;
/**
 * Get verification status and method based on email
 */
const getVerificationStatusFromEmail = (email) => {
    const detection = (0, exports.detectEducationalEmail)(email);
    if (detection.isEducational && detection.confidence === 'high') {
        return {
            isVerified: true,
            verificationStatus: 'edu-verified',
            verificationMethod: 'edu-domain'
        };
    }
    else if (detection.isEducational && detection.confidence === 'medium') {
        return {
            isVerified: true,
            verificationStatus: 'email-verified',
            verificationMethod: 'edu-pattern'
        };
    }
    return {
        isVerified: false,
        verificationStatus: 'unverified',
        verificationMethod: 'none'
    };
};
exports.getVerificationStatusFromEmail = getVerificationStatusFromEmail;
/**
 * Validate educational email format
 */
const validateEducationalEmail = (email) => {
    const errors = [];
    const suggestions = [];
    if (!email || typeof email !== 'string') {
        errors.push('Email is required');
        return { isValid: false, errors };
    }
    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
        errors.push('Please provide a valid email address');
        return { isValid: false, errors };
    }
    const detection = (0, exports.detectEducationalEmail)(normalizedEmail);
    if (!detection.isEducational) {
        errors.push('This email does not appear to be from an educational institution');
        suggestions.push('Please use your student email (e.g., student@senecacollege.ca)');
        suggestions.push('Contact your institution\'s IT support if you need help accessing your student email');
    }
    return {
        isValid: detection.isEducational,
        errors,
        suggestions: suggestions.length > 0 ? suggestions : undefined
    };
};
exports.validateEducationalEmail = validateEducationalEmail;
/**
 * Get institution info from email
 */
const getInstitutionFromEmail = (email) => {
    var _a;
    const detection = (0, exports.detectEducationalEmail)(email);
    if (!detection.isEducational) {
        return {};
    }
    // Determine institution type based on name
    const name = ((_a = detection.institutionName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
    let type = 'institute';
    if (name.includes('university')) {
        type = 'university';
    }
    else if (name.includes('college')) {
        type = 'college';
    }
    else if (name.includes('polytechnic')) {
        type = 'polytechnic';
    }
    return {
        name: detection.institutionName,
        domain: detection.domain,
        type
    };
};
exports.getInstitutionFromEmail = getInstitutionFromEmail;
//# sourceMappingURL=email.utils.js.map