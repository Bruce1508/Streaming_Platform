import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const BACKEND_URL = 'http://localhost:5001';
const BATCH_SIZE = 20;

// Admin token - PASTE THE NEW TOKEN FROM create-admin-token.ts HERE
let ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsImlkIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQHNlbmVjYS5jYSIsImlhdCI6MTc1MTA2NzE4NCwiZXhwIjoxNzUxMTUzNTg0LCJhdWQiOiJzZW5lY2EtYXBpIiwiaXNzIjoic2VuZWNhLWJhY2tlbmQifQ.Ly8s9lW7DuOSgFsY2yCBvxvr0rdIALk1hwcLfjg-_jQ';

interface CentennialProgram {
    id: string;
    code: string;
    name: string;
    overview: string;
    duration: string;
    campus: string[];
    delivery: string;
    credential: string;
}

interface BatchResult {
    successCount: number;
    errorCount: number;
    totalProcessed: number;
    errors?: any[];
}

async function loadCentennialPrograms(): Promise<CentennialProgram[]> {
    try {
        const programsPath = path.join(__dirname, 'output', 'centennial', 'centennial_programs_manual.json');
        const data = await fs.readFile(programsPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading Centennial programs:', error);
        return [];
    }
}

async function importBatch(programs: CentennialProgram[], batchNumber: number): Promise<BatchResult> {
    try {
        console.log(`📤 Processing batch ${batchNumber} with ${programs.length} programs...`);
        
        const response = await axios.post(
            `${BACKEND_URL}/api/programs/bulk-import/centennial`,
            { programs },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ADMIN_TOKEN}`
                },
                timeout: 60000
            }
        );

        const result: BatchResult = {
            successCount: response.data.data.successCount || 0,
            errorCount: response.data.data.errorCount || 0,
            totalProcessed: response.data.data.totalProcessed || programs.length,
            errors: response.data.data.errors || []
        };

        console.log(`✅ Batch ${batchNumber} completed:`, {
            successCount: result.successCount,
            errorCount: result.errorCount,
            totalProcessed: result.totalProcessed,
            school: response.data.data.school
        });

        if (result.errors && result.errors.length > 0) {
            console.log(`⚠️  Batch ${batchNumber} had ${result.errors.length} errors:`, result.errors.slice(0, 3));
        }

        return result;

    } catch (error: any) {
        console.error(`❌ Error importing batch ${batchNumber}:`, {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        
        return {
            successCount: 0,
            errorCount: programs.length,
            totalProcessed: programs.length,
            errors: [error.message]
        };
    }
}

async function importCentennialPrograms(): Promise<void> {
    console.log('🚀 Starting Centennial College programs import...\n');

    let totalSuccessful = 0;
    let totalErrors = 0;
    let totalProcessed = 0;

    const allPrograms = await loadCentennialPrograms();
    
    if (allPrograms.length === 0) {
        console.log('⚠️  No Centennial programs found to import');
        return;
    }

    console.log(`📊 Found ${allPrograms.length} Centennial programs to import`);

    // Create batches
    const chunks: CentennialProgram[][] = [];
    for (let i = 0; i < allPrograms.length; i += BATCH_SIZE) {
        chunks.push(allPrograms.slice(i, i + BATCH_SIZE));
    }

    console.log(`📦 Will process ${chunks.length} batches of ${BATCH_SIZE} programs each\n`);

    // Process each batch
    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const chunk = chunks[chunkIndex];
        const batchNumber = chunkIndex + 1;
        
        console.log(`\n📦 Starting batch ${batchNumber}/${chunks.length} (${chunk.length} programs)...`);
        
        try {
            const result = await importBatch(chunk, batchNumber);
            
            totalSuccessful += result.successCount;
            totalErrors += result.errorCount;
            totalProcessed += result.totalProcessed;
            
            console.log(`✅ Batch ${batchNumber} statistics:`, {
                success: result.successCount,
                errors: result.errorCount,
                processed: result.totalProcessed
            });
            
            // Add delay between batches to avoid overwhelming the server
            if (chunkIndex < chunks.length - 1) {
                console.log('⏳ Waiting 2 seconds before next batch...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
        } catch (error) {
            console.error(`❌ Failed to process batch ${batchNumber}:`, error);
            totalErrors += chunk.length;
            totalProcessed += chunk.length;
        }
    }

    // Final summary
    console.log('\n🎉 Centennial College import process completed!');
    console.log(`📊 Final Statistics:`);
    console.log(`   - Total programs found: ${allPrograms.length}`);
    console.log(`   - Total batches processed: ${chunks.length}`);
    console.log(`   - Total successful imports: ${totalSuccessful}`);
    console.log(`   - Total errors: ${totalErrors}`);
    console.log(`   - Total processed: ${totalProcessed}`);
    console.log(`   - Success rate: ${totalProcessed > 0 ? ((totalSuccessful / totalProcessed) * 100).toFixed(1) : 0}%`);
}

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

async function main() {
    try {
        const isConnected = await testConnection();
        if (!isConnected) {
            console.log('🚫 Cannot proceed without backend connection');
            process.exit(1);
        }

        if (ADMIN_TOKEN === 'your-admin-token-here') {
            console.error('❌ Please set your admin token in the ADMIN_TOKEN variable');
            process.exit(1);
        }

        await importCentennialPrograms();
        
    } catch (error) {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

export { main as importCentennialPrograms }; 