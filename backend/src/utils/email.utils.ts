// utils/email.utils.ts - FIXED VERSION
import nodemailer from 'nodemailer';
import { logger } from './logger.utils';
import { 
    capitalize, 
    truncate, 
    formatArray,
    maskEmail 
} from './Format.utils';

// Types
export interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    from?: string;
}

export interface EmailTemplateData {
    welcome: { name: string; loginUrl: string };
    resetPassword: { name: string; resetUrl: string; expiresIn: string };
    emailVerification: { name: string; verificationUrl: string };
    materialApproved: { name: string; materialTitle: string; materialUrl: string };
    materialRejected: { name: string; materialTitle: string; reason: string };
}

export interface EmailTemplate {
    subject: string;
    html: string;
}

// ✅ Enhanced email formatting helper
const formatEmailContent = {
    formatName: (name: string): string => capitalize(name.trim()),
    formatTitle: (title: string): string => truncate(title, 60),
    formatReason: (reason: string): string => truncate(reason, 200),
    createSafeUrl: (url: string): string => url.trim()
};

// Create transporter based on environment
const createTransporter = (): nodemailer.Transporter | null => {
    try {
        let transporter: nodemailer.Transporter;

        if (process.env.NODE_ENV === 'production') {
            // Production: Use real SMTP
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        } else {
            // Development: Use Ethereal Email for testing
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: process.env.ETHEREAL_USER || 'ethereal.user@ethereal.email',
                    pass: process.env.ETHEREAL_PASS || 'ethereal.password'
                }
            });
        }

        logger.info('Email transporter initialized successfully');
        return transporter;
    } catch (error) {
        logger.error('Failed to initialize email transporter', error);
        return null;
    }
};

// Initialize transporter
const transporter = createTransporter();

// ✅ Enhanced email templates with better formatting
export const emailTemplates = {
    welcome: ({ name, loginUrl }: EmailTemplateData['welcome']): EmailTemplate => {
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

    resetPassword: ({ name, resetUrl, expiresIn }: EmailTemplateData['resetPassword']): EmailTemplate => {
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

    magicLink: ({ name, magicLinkUrl, expiryMinutes }: { name: string; magicLinkUrl: string; expiryMinutes: number }): EmailTemplate => {
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

    emailVerification: ({ name, verificationUrl }: EmailTemplateData['emailVerification']): EmailTemplate => {
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

    materialApproved: ({ name, materialTitle, materialUrl }: EmailTemplateData['materialApproved']): EmailTemplate => {
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

    materialRejected: ({ name, materialTitle, reason }: EmailTemplateData['materialRejected']): EmailTemplate => {
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
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
    if (!transporter) {
        logger.error('Email transporter not configured');
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

        const result = await transporter.sendMail(mailOptions);
        
        // ✅ Enhanced logging with masked emails
        logger.info('Email sent successfully', {
            to: Array.isArray(options.to) ? 
                options.to.map(email => maskEmail(email)).join(', ') : 
                maskEmail(options.to as string),
            subject: truncate(options.subject, 50),
            messageId: result.messageId
        });

        // Log preview URL in development
        if (process.env.NODE_ENV === 'development') {
            const previewUrl = nodemailer.getTestMessageUrl(result);
            if (previewUrl) {
                logger.info('Email preview URL:', previewUrl);
            }
        }

        return true;
    } catch (error) {
        logger.error('Failed to send email', { 
            error: error instanceof Error ? error.message : error,
            to: Array.isArray(options.to) ? 
                options.to.map(email => maskEmail(email)).join(', ') : 
                maskEmail(options.to as string),
            subject: truncate(options.subject, 50)
        });
        return false;
    }
};

// Template-based email functions
export const sendWelcomeEmail = async (
    to: string, 
    data: EmailTemplateData['welcome']
): Promise<boolean> => {
    const template = emailTemplates.welcome(data);
    return sendEmail({
        to,
        subject: template.subject,
        html: template.html
    });
};

export const sendPasswordResetEmail = async (
    to: string, 
    data: EmailTemplateData['resetPassword']
): Promise<boolean> => {
    const template = emailTemplates.resetPassword(data);
    return sendEmail({
        to,
        subject: template.subject,
        html: template.html
    });
};

export const sendEmailVerification = async (
    to: string, 
    data: EmailTemplateData['emailVerification']
): Promise<boolean> => {
    const template = emailTemplates.emailVerification(data);
    return sendEmail({
        to,
        subject: template.subject,
        html: template.html
    });
};

export const sendMaterialApprovalEmail = async (
    to: string, 
    data: EmailTemplateData['materialApproved']
): Promise<boolean> => {
    const template = emailTemplates.materialApproved(data);
    return sendEmail({
        to,
        subject: template.subject,
        html: template.html
    });
};

export const sendMaterialRejectionEmail = async (
    to: string, 
    data: EmailTemplateData['materialRejected']
): Promise<boolean> => {
    const template = emailTemplates.materialRejected(data);
    return sendEmail({
        to,
        subject: template.subject,
        html: template.html
    });
};

// Bulk email function
export const sendBulkEmail = async (
    recipients: string[], 
    subject: string, 
    html: string
): Promise<{ sent: number; failed: number }> => {
    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
        const success = await sendEmail({
            to: recipient,
            subject,
            html
        });

        if (success) {
            sent++;
        } else {
            failed++;
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    logger.info('Bulk email completed', { sent, failed, total: recipients.length });
    return { sent, failed };
};

// Utility function to check if email service is available
export const isEmailServiceAvailable = (): boolean => {
    return transporter !== null;
};

// Default export object for backward compatibility
export const emailService = {
    sendEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendEmailVerification,
    sendMaterialApprovalEmail,
    sendMaterialRejectionEmail,
    sendBulkEmail,
    isAvailable: isEmailServiceAvailable
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

export interface EmailVerificationResult {
    isEducational: boolean;
    institutionName?: string;
    domain?: string;
    verificationMethod: 'domain-match' | 'pattern-match' | 'none';
    confidence: 'high' | 'medium' | 'low';
}

/**
 * Detect if an email belongs to an educational institution
 */
export const detectEducationalEmail = (email: string): EmailVerificationResult => {
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
            logger.info('Educational email detected via domain match', {
                email: maskEmail(email),
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
            logger.info('Educational email detected via pattern match', {
                email: maskEmail(email),
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
        logger.info('Educational email detected via generic domain', {
            email: maskEmail(email),
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

/**
 * Get verification status and method based on email
 */
export const getVerificationStatusFromEmail = (email: string): {
    isVerified: boolean;
    verificationStatus: string;
    verificationMethod: string;
} => {
    const detection = detectEducationalEmail(email);
    
    if (detection.isEducational && detection.confidence === 'high') {
        return {
            isVerified: true,
            verificationStatus: 'edu-verified',
            verificationMethod: 'edu-domain'
        };
    } else if (detection.isEducational && detection.confidence === 'medium') {
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

/**
 * Validate educational email format
 */
export const validateEducationalEmail = (email: string): {
    isValid: boolean;
    errors: string[];
    suggestions?: string[];
} => {
    const errors: string[] = [];
    const suggestions: string[] = [];
    
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
    
    const detection = detectEducationalEmail(normalizedEmail);
    
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

/**
 * Get institution info from email
 */
export const getInstitutionFromEmail = (email: string): {
    name?: string;
    domain?: string;
    type?: 'university' | 'college' | 'polytechnic' | 'institute';
} => {
    const detection = detectEducationalEmail(email);
    
    if (!detection.isEducational) {
        return {};
    }
    
    // Determine institution type based on name
    const name = detection.institutionName?.toLowerCase() || '';
    let type: 'university' | 'college' | 'polytechnic' | 'institute' = 'institute';
    
    if (name.includes('university')) {
        type = 'university';
    } else if (name.includes('college')) {
        type = 'college';
    } else if (name.includes('polytechnic')) {
        type = 'polytechnic';
    }
    
    return {
        name: detection.institutionName,
        domain: detection.domain,
        type
    };
};