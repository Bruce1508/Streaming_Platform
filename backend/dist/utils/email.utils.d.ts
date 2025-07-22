export interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    from?: string;
}
export interface EmailTemplateData {
    welcome: {
        name: string;
        loginUrl: string;
    };
    resetPassword: {
        name: string;
        resetUrl: string;
        expiresIn: string;
    };
    emailVerification: {
        name: string;
        verificationUrl: string;
    };
    materialApproved: {
        name: string;
        materialTitle: string;
        materialUrl: string;
    };
    materialRejected: {
        name: string;
        materialTitle: string;
        reason: string;
    };
}
export interface EmailTemplate {
    subject: string;
    html: string;
}
export declare const emailTemplates: {
    welcome: ({ name, loginUrl }: EmailTemplateData["welcome"]) => EmailTemplate;
    resetPassword: ({ name, resetUrl, expiresIn }: EmailTemplateData["resetPassword"]) => EmailTemplate;
    magicLink: ({ name, magicLinkUrl, expiryMinutes }: {
        name: string;
        magicLinkUrl: string;
        expiryMinutes: number;
    }) => EmailTemplate;
    emailVerification: ({ name, verificationUrl }: EmailTemplateData["emailVerification"]) => EmailTemplate;
    materialApproved: ({ name, materialTitle, materialUrl }: EmailTemplateData["materialApproved"]) => EmailTemplate;
    materialRejected: ({ name, materialTitle, reason }: EmailTemplateData["materialRejected"]) => EmailTemplate;
};
export declare const sendEmail: (options: EmailOptions) => Promise<boolean>;
export declare const sendWelcomeEmail: (to: string, data: EmailTemplateData["welcome"]) => Promise<boolean>;
export declare const sendPasswordResetEmail: (to: string, data: EmailTemplateData["resetPassword"]) => Promise<boolean>;
export declare const sendEmailVerification: (to: string, data: EmailTemplateData["emailVerification"]) => Promise<boolean>;
export declare const sendMaterialApprovalEmail: (to: string, data: EmailTemplateData["materialApproved"]) => Promise<boolean>;
export declare const sendMaterialRejectionEmail: (to: string, data: EmailTemplateData["materialRejected"]) => Promise<boolean>;
export declare const sendBulkEmail: (recipients: string[], subject: string, html: string) => Promise<{
    sent: number;
    failed: number;
}>;
export declare const isEmailServiceAvailable: () => Promise<boolean>;
export declare const emailService: {
    sendEmail: (options: EmailOptions) => Promise<boolean>;
    sendWelcomeEmail: (to: string, data: EmailTemplateData["welcome"]) => Promise<boolean>;
    sendPasswordResetEmail: (to: string, data: EmailTemplateData["resetPassword"]) => Promise<boolean>;
    sendEmailVerification: (to: string, data: EmailTemplateData["emailVerification"]) => Promise<boolean>;
    sendMaterialApprovalEmail: (to: string, data: EmailTemplateData["materialApproved"]) => Promise<boolean>;
    sendMaterialRejectionEmail: (to: string, data: EmailTemplateData["materialRejected"]) => Promise<boolean>;
    sendBulkEmail: (recipients: string[], subject: string, html: string) => Promise<{
        sent: number;
        failed: number;
    }>;
    isAvailable: () => Promise<boolean>;
};
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
export declare const detectEducationalEmail: (email: string) => EmailVerificationResult;
/**
 * Get verification status and method based on email
 */
export declare const getVerificationStatusFromEmail: (email: string) => {
    isVerified: boolean;
    verificationStatus: string;
    verificationMethod: string;
};
/**
 * Validate educational email format
 */
export declare const validateEducationalEmail: (email: string) => {
    isValid: boolean;
    errors: string[];
    suggestions?: string[];
};
/**
 * Get institution info from email
 */
export declare const getInstitutionFromEmail: (email: string) => {
    name?: string;
    domain?: string;
    type?: "university" | "college" | "polytechnic" | "institute";
};
//# sourceMappingURL=email.utils.d.ts.map