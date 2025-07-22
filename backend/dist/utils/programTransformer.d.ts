export interface StandardizedProgram {
    id: string;
    code: string;
    name: string;
    duration: string;
    campus: string[];
    credential: 'bachelor' | 'diploma' | 'advanced diploma' | 'certificate' | 'other';
    url?: string;
}
export declare const SCHOOL_TRANSFORMERS: Record<string, (program: any) => StandardizedProgram>;
export declare class ProgramTransformer {
    private schoolKey;
    private transformer;
    constructor(schoolKey: string);
    transform(rawProgram: any): StandardizedProgram;
    transformBatch(rawPrograms: any[]): StandardizedProgram[];
}
export declare function createTransformer(schoolKey: string): ProgramTransformer;
export declare function validateStandardizedProgram(program: StandardizedProgram): boolean;
//# sourceMappingURL=programTransformer.d.ts.map