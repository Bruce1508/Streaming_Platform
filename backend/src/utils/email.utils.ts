// utils/email.utils.ts - FIXED VERSION
import nodemailer from 'nodemailer';
import { logger } from './logger.utils';

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

// Email templates
export const emailTemplates = {
    welcome: ({ name, loginUrl }: EmailTemplateData['welcome']): EmailTemplate => ({
        subject: 'Welcome to StudyBuddy!',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h1 style="color: #3B82F6;">Welcome to StudyBuddy, ${name}!</h1>
                <p>We're excited to have you join our academic community.</p>
                <p>Get started by exploring study materials and connecting with fellow students:</p>
                <a href="${loginUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Start Learning
                </a>
                <p>Best regards,<br>The StudyBuddy Team</p>
            </div>
        `
    }),

    resetPassword: ({ name, resetUrl, expiresIn }: EmailTemplateData['resetPassword']): EmailTemplate => ({
        subject: 'Reset Your StudyBuddy Password',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h1 style="color: #3B82F6;">Password Reset Request</h1>
                <p>Hi ${name},</p>
                <p>You requested to reset your password. Click the button below to create a new password:</p>
                <a href="${resetUrl}" style="background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Reset Password
                </a>
                <p><strong>This link expires in ${expiresIn}.</strong></p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br>The StudyBuddy Team</p>
            </div>
        `
    }),

    emailVerification: ({ name, verificationUrl }: EmailTemplateData['emailVerification']): EmailTemplate => ({
        subject: 'Verify Your Email Address',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h1 style="color: #3B82F6;">Verify Your Email</h1>
                <p>Hi ${name},</p>
                <p>Please verify your email address to complete your registration:</p>
                <a href="${verificationUrl}" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Verify Email
                </a>
                <p>Best regards,<br>The StudyBuddy Team</p>
            </div>
        `
    }),

    materialApproved: ({ name, materialTitle, materialUrl }: EmailTemplateData['materialApproved']): EmailTemplate => ({
        subject: 'Your Study Material Has Been Approved!',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h1 style="color: #10B981;">Material Approved! 🎉</h1>
                <p>Hi ${name},</p>
                <p>Great news! Your study material "<strong>${materialTitle}</strong>" has been approved and is now live.</p>
                <a href="${materialUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    View Material
                </a>
                <p>Thank you for contributing to our academic community!</p>
                <p>Best regards,<br>The StudyBuddy Team</p>
            </div>
        `
    }),

    materialRejected: ({ name, materialTitle, reason }: EmailTemplateData['materialRejected']): EmailTemplate => ({
        subject: 'Study Material Needs Revision',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h1 style="color: #EF4444;">Material Needs Revision</h1>
                <p>Hi ${name},</p>
                <p>Your study material "<strong>${materialTitle}</strong>" needs some revisions before approval.</p>
                <p><strong>Reason:</strong> ${reason}</p>
                <p>Please update your material and resubmit when ready.</p>
                <p>Best regards,<br>The StudyBuddy Team</p>
            </div>
        `
    })
};

// Core email sending function
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
        
        logger.info('Email sent successfully', {
            to: options.to,
            subject: options.subject,
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
            to: options.to, 
            subject: options.subject 
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