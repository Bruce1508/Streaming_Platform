import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const BACKEND_URL = 'http://localhost:5001';
const BATCH_SIZE = 20;

// Admin token - PASTE THE NEW TOKEN FROM create-admin-token.ts HERE
let ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsImlkIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQHNlbmVjYS5jYSIsImlhdCI6MTc1MTA2NzE4NCwiZXhwIjoxNzUxMTUzNTg0LCJhdWQiOiJzZW5lY2EtYXBpIiwiaXNzIjoic2VuZWNhLWJhY2tlbmQifQ.Ly8s9lW7DuOSgFsY2yCBvxvr0rdIALk1hwcLfjg-_jQ';

interface SenecaProgram {
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

interface BatchResult {
    successCount: number;
    errorCount: number;
    totalProcessed: number;
    errors?: any[];
}

async function loadSenecaPrograms(): Promise<SenecaProgram[]> {
    try {
        const filePath = path.join(__dirname, 'output', 'seneca', 'all_programs.json');
        console.log(`📂 Loading Seneca programs from: ${filePath}`);
        
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const programs = JSON.parse(fileContent);
        
        console.log(`✅ Loaded ${programs.length} Seneca programs`);
        return programs;
    } catch (error) {
        console.error('❌ Error loading Seneca programs:', error);
        throw error;
    }
}

async function importBatch(programs: SenecaProgram[]): Promise<BatchResult> {
    try {
        console.log(`📤 Sending batch of ${programs.length} programs to API...`);
        
        const response = await axios.post(`${BACKEND_URL}/api/programs/bulk-import/seneca`, {
            programs
        }, {
            headers: {
                'Authorization': `Bearer ${ADMIN_TOKEN}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 seconds timeout
        });

        if (response.data.success) {
            console.log(`✅ Batch imported successfully`);
            return {
                successCount: response.data.results?.successCount || programs.length,
                errorCount: response.data.results?.errorCount || 0,
                totalProcessed: programs.length,
                errors: response.data.results?.errors || []
            };
        } else {
            console.error(`❌ Batch import failed:`, response.data.message);
            return {
                successCount: 0,
                errorCount: programs.length,
                totalProcessed: programs.length,
                errors: [response.data.message]
            };
        }
    } catch (error: any) {
        console.error(`❌ Error importing batch:`, error.response?.data || error.message);
        return {
            successCount: 0,
            errorCount: programs.length,
            totalProcessed: programs.length,
            errors: [error.response?.data?.message || error.message]
        };
    }
}

async function main() {
    console.log('🚀 SENECA COLLEGE PROGRAMS IMPORT STARTED');
    console.log('=' .repeat(50));
    
    try {
        // Load programs from JSON file
        const programs = await loadSenecaPrograms();
        
        if (programs.length === 0) {
            console.log('⚠️  No programs found to import');
            return;
        }

        console.log(`📊 Total programs to import: ${programs.length}`);
        console.log(`📦 Batch size: ${BATCH_SIZE}`);
        console.log(`🔄 Total batches: ${Math.ceil(programs.length / BATCH_SIZE)}`);
        
        let totalSuccess = 0;
        let totalErrors = 0;
        const allErrors: any[] = [];

        // Process in batches
        for (let i = 0; i < programs.length; i += BATCH_SIZE) {
            const batch = programs.slice(i, i + BATCH_SIZE);
            const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
            const totalBatches = Math.ceil(programs.length / BATCH_SIZE);
            
            console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} programs)...`);
            
            try {
                const result = await importBatch(batch);
                
                totalSuccess += result.successCount;
                totalErrors += result.errorCount;
                
                if (result.errors && result.errors.length > 0) {
                    allErrors.push(...result.errors);
                }
                
                console.log(`✅ Batch ${batchNumber} completed: ${result.successCount} success, ${result.errorCount} errors`);
                
                // Add delay between batches to avoid overwhelming the server
                if (i + BATCH_SIZE < programs.length) {
                    console.log('⏳ Waiting 2 seconds before next batch...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
                
            } catch (error) {
                console.error(`❌ Batch ${batchNumber} failed completely:`, error);
                totalErrors += batch.length;
                allErrors.push(`Batch ${batchNumber}: ${error}`);
            }
        }

        // Final summary
        console.log('\n' + '='.repeat(50));
        console.log('📈 IMPORT SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Total successful: ${totalSuccess}`);
        console.log(`❌ Total errors: ${totalErrors}`);
        console.log(`📊 Total processed: ${totalSuccess + totalErrors}`);
        console.log(`📋 Success rate: ${((totalSuccess / (totalSuccess + totalErrors)) * 100).toFixed(1)}%`);
        
        if (allErrors.length > 0) {
            console.log(`\n⚠️  First 5 errors:`);
            allErrors.slice(0, 5).forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }
        
        console.log('\n🎉 Seneca College import process completed!');
        
    } catch (error) {
        console.error('💥 Import process failed:', error);
        process.exit(1);
    }
}

main().catch(console.error); 