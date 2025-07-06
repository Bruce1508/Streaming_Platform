import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const BACKEND_URL = 'http://localhost:5001';
const BATCH_SIZE = 10;

// Admin token - PASTE THE NEW TOKEN FROM create-admin-token.ts HERE
let ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsImlkIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQHNlbmVjYS5jYSIsImlhdCI6MTc1MTA2NzE4NCwiZXhwIjoxNzUxMTUzNTg0LCJhdWQiOiJzZW5lY2EtYXBpIiwiaXNzIjoic2VuZWNhLWJhY2tlbmQifQ.Ly8s9lW7DuOSgFsY2yCBvxvr0rdIALk1hwcLfjg-_jQ';

interface ProgramCourse {
    id: string;
    code: string;
    name: string;
    credits?: number;
    description?: string;
}

interface ProgramRequirement {
    id: string;
    type: 'general_education' | 'professional_options' | 'electives' | 'other';
    title: string;
    description: string;
    selectCount: number;
    availableCourses: ProgramCourse[];
    isRequired: boolean;
    category?: string;
    externalLinks?: string[];
}

interface ProgramSemester {
    id: string;
    name: string;
    type: 'regular' | 'work_integrated_learning' | 'coop';
    order: number;
    coreCourses: ProgramCourse[];
    requirements: ProgramRequirement[];
    totalCredits?: number;
    prerequisites?: string[];
    notes?: string;
    isOptional?: boolean;
}

interface ProgramCourses {
    programId: string;
    programName: string;
    semesters: ProgramSemester[];
    totalSemesters: number;
    totalCredits?: number;
    hasWorkIntegratedLearning?: boolean;
}

// Legacy interfaces for backward compatibility
interface LegacyProgramCourse {
    id: string;
    code: string;
    name: string;
}

interface LegacyProgramRequirement {
    type: string;
    count: number;
    description: string;
}

interface LegacyProgramSemester {
    id: string;
    name: string;
    courses: LegacyProgramCourse[];
    requirements?: LegacyProgramRequirement[];
    totalCourses?: number;
}

interface LegacyProgramCourses {
    programId: string;
    programName: string;
    semesters: LegacyProgramSemester[];
}

function migrateLegacyData(legacyData: LegacyProgramCourses): ProgramCourses {
    console.log(`🔄 Migrating legacy data for program: ${legacyData.programId}`);
    
    const migratedSemesters: ProgramSemester[] = legacyData.semesters.map((legacySemester, index) => {
        // Determine semester type
        let semesterType: 'regular' | 'work_integrated_learning' | 'coop' = 'regular';
        let isOptional = false;
        
        // Check for Work-Integrated Learning indicators
        const semesterNameLower = legacySemester.name.toLowerCase();
        const programNameLower = legacyData.programName.toLowerCase();
        
        if (semesterNameLower.includes('work-integrated learning') || 
            semesterNameLower.includes('co-op') ||
            programNameLower.includes('co-op')) {
            semesterType = 'work_integrated_learning';
            isOptional = true;
        }
        
        // Migrate requirements
        const migratedRequirements: ProgramRequirement[] = (legacySemester.requirements || []).map(legacyReq => {
            // Determine requirement type from legacy type string
            let reqType: 'general_education' | 'professional_options' | 'electives' | 'other' = 'other';
            const typeStr = legacyReq.type.toLowerCase();
            
            if (typeStr.includes('general education')) {
                reqType = 'general_education';
            } else if (typeStr.includes('professional option')) {
                reqType = 'professional_options';
            } else if (typeStr.includes('elective')) {
                reqType = 'electives';
            }
            
            // Add external links for General Education
            const externalLinks: string[] = [];
            if (reqType === 'general_education') {
                externalLinks.push('https://www.senecapolytechnic.ca/school/els.html');
            }
            
            return {
                id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: reqType,
                title: legacyReq.type,
                description: legacyReq.description,
                selectCount: legacyReq.count,
                availableCourses: [], // Will be populated later if available
                isRequired: true,
                externalLinks: externalLinks.length > 0 ? externalLinks : undefined
            };
        });
        
        return {
            id: legacySemester.id,
            name: legacySemester.name,
            type: semesterType,
            order: semesterType === 'work_integrated_learning' ? 999 : index + 1,
            coreCourses: legacySemester.courses.map(course => ({
                id: course.id,
                code: course.code,
                name: course.name
            })),
            requirements: migratedRequirements,
            isOptional,
            notes: semesterType === 'work_integrated_learning' ? 
                'Work-Integrated Learning Term - Optional practical work experience' : undefined
        };
    });
    
    const hasWorkIntegratedLearning = migratedSemesters.some(sem => 
        sem.type === 'work_integrated_learning' || sem.type === 'coop'
    );
    
    console.log(`✅ Migration completed: ${migratedSemesters.length} semesters, Work-Integrated Learning: ${hasWorkIntegratedLearning}`);
    
    return {
        programId: legacyData.programId,
        programName: legacyData.programName,
        semesters: migratedSemesters,
        totalSemesters: migratedSemesters.length,
        hasWorkIntegratedLearning
    };
}

async function loadBatchFile(batchNumber: number): Promise<ProgramCourses[]> {
    try {
        const batchPath = path.join(__dirname, 'output', 'processed', `courses_batch_${batchNumber}.json`);
        const data = await fs.readFile(batchPath, 'utf-8');
        const rawData = JSON.parse(data);
        
        // Check if data needs migration (legacy format)
        const migratedData: ProgramCourses[] = rawData.map((item: any) => {
            // If it has the new format, return as is
            if (item.semesters && item.semesters[0] && 'coreCourses' in item.semesters[0]) {
                return item as ProgramCourses;
            }
            // Otherwise, migrate from legacy format
            return migrateLegacyData(item as LegacyProgramCourses);
        });
        
        console.log(`📁 Loaded batch ${batchNumber}: ${migratedData.length} programs`);
        return migratedData;
    } catch (error) {
        console.error(`Error loading batch ${batchNumber}:`, error);
        return [];
    }
}

async function importBatch(programCourses: ProgramCourses[]): Promise<void> {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/api/courses/program-courses/bulk-import`,
            { programCourses },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ADMIN_TOKEN}`
                },
                timeout: 60000 // 60 seconds timeout
            }
        );

        console.log(`✅ Batch imported successfully:`, {
            successCount: response.data.data.successCount,
            errorCount: response.data.data.errorCount,
            totalProcessed: response.data.data.totalProcessed
        });

        if (response.data.data.errors && response.data.data.errors.length > 0) {
            console.log('⚠️  Some errors occurred:', response.data.data.errors);
        }

    } catch (error: any) {
        console.error('❌ Error importing batch:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
}

async function importAllBatches(): Promise<void> {
    console.log('🚀 Starting program courses import with enhanced schema...\n');

    let totalSuccessful = 0;
    let totalErrors = 0;
    let totalProcessed = 0;
    let totalWorkIntegratedPrograms = 0;

    // Import each batch file (1-4)
    for (let batchNumber = 1; batchNumber <= 4; batchNumber++) {
        console.log(`📦 Loading batch ${batchNumber}...`);
        
        const programCourses = await loadBatchFile(batchNumber);
        
        if (programCourses.length === 0) {
            console.log(`⚠️  Batch ${batchNumber} is empty or failed to load, skipping...\n`);
            continue;
        }

        console.log(`📊 Batch ${batchNumber}: ${programCourses.length} programs to import`);
        
        // Count Work-Integrated Learning programs in this batch
        const workIntegratedInBatch = programCourses.filter(p => p.hasWorkIntegratedLearning).length;
        if (workIntegratedInBatch > 0) {
            console.log(`🏢 Work-Integrated Learning programs in batch: ${workIntegratedInBatch}`);
            totalWorkIntegratedPrograms += workIntegratedInBatch;
        }

        // Split into smaller chunks if batch is too large
        const chunks: ProgramCourses[][] = [];
        for (let i = 0; i < programCourses.length; i += BATCH_SIZE) {
            chunks.push(programCourses.slice(i, i + BATCH_SIZE));
        }

        for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
            const chunk = chunks[chunkIndex];
            console.log(`  📤 Importing chunk ${chunkIndex + 1}/${chunks.length} (${chunk.length} programs)...`);
            
            try {
                await importBatch(chunk);
                totalProcessed += chunk.length;
                // Add small delay between chunks to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`  ❌ Failed to import chunk ${chunkIndex + 1} of batch ${batchNumber}`);
                totalErrors += chunk.length;
            }
        }

        console.log(`✅ Batch ${batchNumber} completed\n`);
    }

    console.log('🎉 Enhanced import process completed!');
    console.log(`📊 Final Statistics:`);
    console.log(`   - Total processed: ${totalProcessed}`);
    console.log(`   - Total errors: ${totalErrors}`);
    console.log(`   - Work-Integrated Learning programs: ${totalWorkIntegratedPrograms}`);
    console.log(`   - Success rate: ${totalProcessed > 0 ? ((totalProcessed - totalErrors) / totalProcessed * 100).toFixed(1) : 0}%`);
}

// Test connection first
async function testConnection(): Promise<boolean> {
    try {
        console.log('🔍 Testing backend connection...');
        const response = await axios.get(`${BACKEND_URL}/api/courses/program-courses/stats`, {
            timeout: 10000
        });
        console.log('✅ Backend connection successful');
        return true;
    } catch (error: any) {
        console.error('❌ Backend connection failed:', {
            message: error.message,
            code: error.code
        });
        return false;
    }
}

// Main execution
async function main() {
    try {
        // Test connection first
        const isConnected = await testConnection();
        if (!isConnected) {
            console.log('🚫 Cannot proceed without backend connection');
            process.exit(1);
        }

        // Check if admin token is set
        if (ADMIN_TOKEN === 'your-admin-token-here') {
            console.error('❌ Please set your admin token in the ADMIN_TOKEN variable');
            process.exit(1);
        }

        await importAllBatches();
        
    } catch (error) {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
} 