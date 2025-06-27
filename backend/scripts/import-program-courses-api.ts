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
}

interface ProgramRequirement {
    type: string;
    count: number;
    description: string;
}

interface ProgramSemester {
    id: string;
    name: string;
    courses: ProgramCourse[];
    requirements?: ProgramRequirement[];
    totalCourses?: number;
}

interface ProgramCourses {
    programId: string;
    programName: string;
    semesters: ProgramSemester[];
}

async function loadBatchFile(batchNumber: number): Promise<ProgramCourses[]> {
    try {
        const batchPath = path.join(__dirname, 'output', 'processed', `courses_batch_${batchNumber}.json`);
        const data = await fs.readFile(batchPath, 'utf-8');
        return JSON.parse(data);
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
    console.log('🚀 Starting program courses import...\n');

    let totalSuccessful = 0;
    let totalErrors = 0;
    let totalProcessed = 0;

    // Import each batch file (1-4)
    for (let batchNumber = 1; batchNumber <= 4; batchNumber++) {
        console.log(`📦 Loading batch ${batchNumber}...`);
        
        const programCourses = await loadBatchFile(batchNumber);
        
        if (programCourses.length === 0) {
            console.log(`⚠️  Batch ${batchNumber} is empty or failed to load, skipping...\n`);
            continue;
        }

        console.log(`📊 Batch ${batchNumber}: ${programCourses.length} programs to import`);

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

    console.log('🎉 Import process completed!');
    console.log(`📊 Final Statistics:`);
    console.log(`   - Total processed: ${totalProcessed}`);
    console.log(`   - Total errors: ${totalErrors}`);
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