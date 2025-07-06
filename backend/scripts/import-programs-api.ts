import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const BACKEND_URL = 'http://localhost:5001';
const BATCH_SIZE = 20; // Smaller batch size for programs

// Admin token - PASTE THE NEW TOKEN FROM create-admin-token.ts HERE
let ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsImlkIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQHNlbmVjYS5jYSIsImlhdCI6MTc1MTA2NzE4NCwiZXhwIjoxNzUxMTUzNTg0LCJhdWQiOiJzZW5lY2EtYXBpIiwiaXNzIjoic2VuZWNhLWJhY2tlbmQifQ.Ly8s9lW7DuOSgFsY2yCBvxvr0rdIALk1hwcLfjg-_jQ';

interface RawProgram {
    id: string;
    code: string;
    name: string;
    overview: string;
    duration: string;
    campus: string[];
    delivery: string;
    credential: string;
    school: string;
}

async function loadAllPrograms(): Promise<RawProgram[]> {
    try {
        const programsPath = path.join(__dirname, 'output', 'processed', 'all_programs.json');
        const data = await fs.readFile(programsPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading programs:', error);
        return [];
    }
}

async function importBatch(programs: RawProgram[]): Promise<void> {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/api/programs/bulk-import`,
            { programs },
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

async function importAllPrograms(): Promise<void> {
    console.log('🚀 Starting programs import...\n');

    let totalSuccessful = 0;
    let totalErrors = 0;
    let totalProcessed = 0;

    // Load all programs
    console.log('📦 Loading programs from all_programs.json...');
    const allPrograms = await loadAllPrograms();
    
    if (allPrograms.length === 0) {
        console.log('⚠️  No programs found to import');
        return;
    }

    console.log(`📊 Found ${allPrograms.length} programs to import`);

    // Split into smaller chunks to avoid overwhelming the server
    const chunks: RawProgram[][] = [];
    for (let i = 0; i < allPrograms.length; i += BATCH_SIZE) {
        chunks.push(allPrograms.slice(i, i + BATCH_SIZE));
    }

    console.log(`📦 Will process ${chunks.length} batches of ${BATCH_SIZE} programs each\n`);

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const chunk = chunks[chunkIndex];
        console.log(`📤 Importing batch ${chunkIndex + 1}/${chunks.length} (${chunk.length} programs)...`);
        
        try {
            await importBatch(chunk);
            totalProcessed += chunk.length;
            
            // Add small delay between chunks to avoid overwhelming the server
            if (chunkIndex < chunks.length - 1) {
                console.log('⏳ Waiting 2 seconds before next batch...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (error) {
            console.error(`❌ Failed to import batch ${chunkIndex + 1}`);
            totalErrors += chunk.length;
        }

        console.log(`✅ Batch ${chunkIndex + 1} completed\n`);
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
        const response = await axios.get(`${BACKEND_URL}/api/programs`, {
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

        await importAllPrograms();
        
    } catch (error) {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

export { main as importProgramsViaAPI }; 