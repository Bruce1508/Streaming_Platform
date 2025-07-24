import { logger } from './logger.utils';

export interface StandardizedProgram {
    id: string;
    code: string;
    name: string;
    duration: string;
    campus: string[];
    credential: 'bachelor' | 'diploma' | 'advanced diploma' | 'certificate' | 'other';
    url: string;
}

// School transformation configurations
export const SCHOOL_TRANSFORMERS: Record<string, (program: any) => StandardizedProgram> = {
    seneca: (program: any): StandardizedProgram => {
        return {
            id: program.id || generateId(program.name),
            code: program.code || generateCode(program.name),
            name: program.name,
            duration: program.duration || '',
            campus: Array.isArray(program.campus) ? program.campus : [program.campus].filter(Boolean),
            credential: mapCredential(program.credential),
            url: program.url
        };
    },

    centennial: (program: any): StandardizedProgram => {
        return {
            id: program.id || generateId(program.name),
            code: program.code || generateCode(program.name),
            name: program.name,
            duration: program.duration || '',
            campus: Array.isArray(program.campus) ? program.campus : [program.campus].filter(Boolean),
            credential: mapCredential(program.credential),
            url: program.url
        };
    },

    york: (program: any): StandardizedProgram => {
        return {
            id: generateId(program.name),
            code: extractCodeFromName(program.name) || generateCode(program.name),
            name: program.name,
            duration: '', // York doesn't have duration info
            campus: program.campus ? [program.campus] : [],
            credential: mapYorkDegree(program.degree),
            url: program.url
        };
    },

    georgebrown: (program: any): StandardizedProgram => {
        return {
            id: program.id || generateId(program.name),
            code: program.code || generateCode(program.name),
            name: program.name,
            duration: program.duration || '',
            campus: Array.isArray(program.campus) ? program.campus : [program.campus].filter(Boolean),
            credential: mapCredential(program.credential),
            url: program.url
        };
    },

    humber: (program: any): StandardizedProgram => {
        return {
            id: program.id || generateId(program.name),
            code: program.code || generateCode(program.name),
            name: program.name,
            duration: program.duration || '',
            campus: Array.isArray(program.campus) ? program.campus : [program.campus].filter(Boolean),
            credential: mapCredential(program.credential),
            url: program.url
        };
    },

    tmu: (program: any): StandardizedProgram => {
        return {
            id: program.id || generateId(program.name),
            code: program.code || generateCode(program.name),
            name: program.name,
            duration: program.duration || '',
            campus: Array.isArray(program.campus) ? program.campus : [program.campus].filter(Boolean),
            credential: mapCredential(program.credential),
            url: program.url
        };
    },
    manitobaUni: (program: any): StandardizedProgram => {
        return {
            id: program.id || generateId(program.name),
            code: program.code || generateCode(program.name),
            name: program.name,
            duration: program.duration || '',
            campus: program.faculty ? [program.faculty] : ['Main Campus'],
            credential: mapManitobaCredential(program.credential),
            url: program.url
        };
    }
};

// Credential mapping functions
function mapCredential(credential: string): 'bachelor' | 'diploma' | 'advanced diploma' | 'certificate' | 'other' {
    if (!credential) return 'certificate';
    
    const credentialLower = credential.toLowerCase();
    
    if (credentialLower.includes('bachelor')) {
        return 'bachelor';
    } else if (credentialLower.includes('advanced diploma')) {
        return 'advanced diploma';
    } else if (credentialLower.includes('diploma')) {
        return 'diploma';
    } else if (credentialLower.includes('certificate')) {
        return 'certificate';
    } else {
        return 'other';
    }
}

function mapYorkDegree(degree: string): 'bachelor' | 'diploma' | 'advanced diploma' | 'certificate' | 'other' {
    if (!degree) return 'certificate';
    
    const degreeLower = degree.toLowerCase();
    
    if (degreeLower.includes('ba') || degreeLower.includes('bsc') || 
        degreeLower.includes('beng') || degreeLower.includes('bcomm') || 
        degreeLower.includes('bfa') || degreeLower.includes('bed') ||
        degreeLower.includes('bscn') || degreeLower.includes('iba') ||
        degreeLower.includes('ibsc') || degreeLower.includes('jd')) {
        return 'bachelor';
    } else if (degreeLower.includes('certificate')) {
        return 'certificate';
    } else {
        return 'other';
    }
}

function mapTMUDegree(degree: string): 'bachelor' | 'diploma' | 'advanced diploma' | 'certificate' | 'other' {
    if (!degree) return 'certificate';
    
    const degreeLower = degree.toLowerCase();
    
    if (degreeLower.includes('bachelor')) {
        return 'bachelor';
    } else if (degreeLower.includes('certificate')) {
        return 'certificate';
    } else {
        return 'other';
    }
}

function mapManitobaCredential(credential: string | string[]): 'bachelor' | 'diploma' | 'advanced diploma' | 'certificate' | 'other' {
    if (!credential) return 'certificate';
    
    // Handle array credentials - use first item
    const credentialStr = Array.isArray(credential) ? credential[0] : credential;
    if (!credentialStr || typeof credentialStr !== 'string') return 'certificate';
    
    const credentialLower = credentialStr.toLowerCase();
    
    if (credentialLower.includes('bachelor') || credentialLower.includes('bcomm') || 
        credentialLower.includes('bsc') || credentialLower.includes('ba') ||
        credentialLower.includes('bfa') || credentialLower.includes('bed') ||
        credentialLower.includes('bkin') || credentialLower.includes('bmid') ||
        credentialLower.includes('benvd') || credentialLower.includes('bjazz') ||
        credentialLower.includes('doctor') || credentialLower.includes('juris')) {
        return 'bachelor';
    } else if (credentialLower.includes('advanced diploma')) {
        return 'advanced diploma';
    } else if (credentialLower.includes('diploma') && !credentialLower.includes('post-baccalaureate')) {
        return 'diploma';
    } else if (credentialLower.includes('certificate')) {
        return 'certificate';
    } else {
        return 'other';
    }
}

// Utility functions
function generateId(name: string): string {
    const cleanName = name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
    return `${cleanName}-${Date.now()}`;
}

function generateCode(name: string): string {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 8) + Math.random().toString(36).substring(2, 5).toUpperCase();
}

function extractCodeFromName(name: string): string | null {
    // Extract code from patterns like "Program Name (CODE123)" or "Program Name - CODE"
    const patterns = [
        /\(([A-Z0-9]+)\)/,     // (CODE123)
        /\-\s*([A-Z0-9]+)$/,   // - CODE123
        /([A-Z0-9]{3,8})$/     // CODE123 at end
    ];
    
    for (const pattern of patterns) {
        const match = name.match(pattern);
        if (match) return match[1];
    }
    
    return null;
}

// Main transformer class
export class ProgramTransformer {
    private schoolKey: string;
    private transformer: (program: any) => StandardizedProgram;

    constructor(schoolKey: string) {
        this.schoolKey = schoolKey;
        this.transformer = SCHOOL_TRANSFORMERS[schoolKey];
        
        if (!this.transformer) {
            throw new Error(`No transformer found for school: ${schoolKey}`);
        }
    }

    transform(rawProgram: any): StandardizedProgram {
        try {
            return this.transformer(rawProgram);
        } catch (error) {
            logger.error(`Error transforming program for ${this.schoolKey}:`, error);
            throw error;
        }
    }

    transformBatch(rawPrograms: any[]): StandardizedProgram[] {
        return rawPrograms.map(program => this.transform(program));
    }
}

// Factory function
export function createTransformer(schoolKey: string): ProgramTransformer {
    return new ProgramTransformer(schoolKey);
}

// Validation function
export function validateStandardizedProgram(program: StandardizedProgram): boolean {
    return !!(
        program.id && 
        program.code && 
        program.name && 
        program.credential &&
        ['bachelor', 'diploma', 'advanced diploma', 'certificate', 'other'].includes(program.credential) &&
        program.url
    );
} 