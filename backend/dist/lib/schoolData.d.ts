interface CanadianSchool {
    name: string;
    code: string;
    type: 'University' | 'College' | 'Institute' | 'Seminary' | 'Cégep' | 'Specialized School' | 'Private College';
    province: string;
    location?: string;
    website?: string;
    established?: number;
    hasMedical?: boolean;
    hasDental?: boolean;
    isActive: boolean;
}
export declare const canadianSchools: CanadianSchool[];
export declare const getSchoolsByProvince: (province: string) => CanadianSchool[];
export declare const getUniversities: () => CanadianSchool[];
export declare const getColleges: () => CanadianSchool[];
export {};
//# sourceMappingURL=schoolData.d.ts.map