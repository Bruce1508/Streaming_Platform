import { 
    createTransformer, 
    validateStandardizedProgram, 
    StandardizedProgram
} from '../src/utils/programTransformer';
import path from 'path';
import fs from 'fs/promises';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5001';
const BATCH_SIZE = 20;

// Admin token - Update this with your actual token
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsImlkIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQHNlbmVjYS5jYSIsImlhdCI6MTc1MTA2NzE4NCwiZXhwIjoxNzUxMTUzNTg0LCJhdWQiOiJzZW5lY2EtYXBpIiwiaXNzIjoic2VuZWNhLWJhY2tlbmQifQ.Ly8s9lW7DuOSgFsY2yCBvxvr0rdIALk1hwcLfjg-_jQ';

// School configurations
const SCHOOL_CONFIGS: Record<string, { filePath: string; name: string }> = {
    seneca: { filePath: 'output/seneca/all_programs.json', name: 'Seneca College' },
    centennial: { filePath: 'output/centennial/centennial_programs_manual.json', name: 'Centennial College' },
    york: { filePath: 'output/yorkUni/yorkUni.json', name: 'York University' },
    georgebrown: { filePath: 'output/george_brown/georgebrown_programs_complete.json', name: 'George Brown College' },
    humber: { filePath: 'output/humber/humber.json', name: 'Humber College' },
    tmu: { filePath: 'output/tmu/tmu.json', name: 'Toronto Metropolitan University' },
    manitobaUni: { filePath: 'output/manitobaUni/umanitoba_programs.json', name: 'University of Manitoba' }
};

interface ImportResult {
    school: string;
    successCount: number;
    errorCount: number;
    totalProcessed: number;
    errors: string[];
}

async function loadProgramsFromFile(filePath: string): Promise<any[]> {
    try {
        const fullPath = path.join(__dirname, filePath);
        console.log(`📂 Loading programs from: ${fullPath}`);
        
        const fileContent = await fs.readFile(fullPath, 'utf-8');
        const programs = JSON.parse(fileContent);
        
        console.log(`✅ Loaded ${programs.length} programs`);
        return programs;
    } catch (error) {
        console.error(`❌ Error loading programs from ${filePath}:`, error);
        throw error;
    }
}

async function importBatch(schoolKey: string, standardizedPrograms: StandardizedProgram[]): Promise<ImportResult> {
    try {
        console.log(`📤 Sending batch of ${standardizedPrograms.length} programs to API...`);
        
        // For now, we'll use the bulk import endpoint
        const response = await axios.post(`${BACKEND_URL}/api/programs/bulk-import`, {
            school: schoolKey,
            programs: standardizedPrograms
        }, {
            headers: {
                'Authorization': `Bearer ${ADMIN_TOKEN}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        if (response.data.success) {
            console.log(`✅ Batch imported successfully`);
            return {
                school: schoolKey,
                successCount: response.data.results?.successCount || standardizedPrograms.length,
                errorCount: response.data.results?.errorCount || 0,
                totalProcessed: standardizedPrograms.length,
                errors: response.data.results?.errors || []
            };
        } else {
            console.error(`❌ Batch import failed:`, response.data.message);
            return {
                school: schoolKey,
                successCount: 0,
                errorCount: standardizedPrograms.length,
                totalProcessed: standardizedPrograms.length,
                errors: [response.data.message]
            };
        }
    } catch (error: any) {
        console.error(`❌ Error importing batch:`, error.response?.data || error.message);
        return {
            school: schoolKey,
            successCount: 0,
            errorCount: standardizedPrograms.length,
            totalProcessed: standardizedPrograms.length,
            errors: [error.response?.data?.message || error.message]
        };
    }
}

async function importSchoolPrograms(schoolKey: string): Promise<ImportResult> {
    const config = SCHOOL_CONFIGS[schoolKey];
    if (!config) {
        throw new Error(`No config found for school: ${schoolKey}`);
    }

    console.log(`\n🏫 Starting import for ${config.name}`);
    console.log('=' .repeat(50));

    try {
        // Load programs from file
        const rawPrograms = await loadProgramsFromFile(config.filePath);
        
        if (rawPrograms.length === 0) {
            console.log('⚠️  No programs found to import');
            return {
                school: schoolKey,
                successCount: 0,
                errorCount: 0,
                totalProcessed: 0,
                errors: []
            };
        }

        // Transform programs
        console.log(`🔄 Transforming programs for ${config.name}...`);
        const transformer = createTransformer(schoolKey);
        const transformedPrograms = transformer.transformBatch(rawPrograms);
        
        // Validate transformed programs
        const validPrograms = transformedPrograms.filter(validateStandardizedProgram);
        const invalidCount = transformedPrograms.length - validPrograms.length;
        
        console.log(`📊 Transformation Results:`);
        console.log(`  ✅ Valid programs: ${validPrograms.length}`);
        console.log(`  ❌ Invalid programs: ${invalidCount} (will be skipped)`);
        
        if (validPrograms.length === 0) {
            console.log('⚠️  No valid programs to import');
            return {
                school: schoolKey,
                successCount: 0,
                errorCount: transformedPrograms.length,
                totalProcessed: transformedPrograms.length,
                errors: ['All programs failed validation']
            };
        }

        console.log(`📦 Batch size: ${BATCH_SIZE}`);
        console.log(`🔄 Total batches: ${Math.ceil(validPrograms.length / BATCH_SIZE)}`);
        
        let totalSuccess = 0;
        let totalErrors = 0;
        const allErrors: string[] = [];

        // Process in batches
        for (let i = 0; i < validPrograms.length; i += BATCH_SIZE) {
            const batch = validPrograms.slice(i, i + BATCH_SIZE);
            const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
            const totalBatches = Math.ceil(validPrograms.length / BATCH_SIZE);
            
            console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} programs)...`);
            
            const result = await importBatch(schoolKey, batch);
            
            totalSuccess += result.successCount;
            totalErrors += result.errorCount;
            
            if (result.errors.length > 0) {
                allErrors.push(...result.errors);
            }
            
            console.log(`✅ Batch ${batchNumber} completed: ${result.successCount} success, ${result.errorCount} errors`);
            
            // Add delay between batches
            if (i + BATCH_SIZE < validPrograms.length) {
                console.log('⏳ Waiting 2 seconds before next batch...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        return {
            school: schoolKey,
            successCount: totalSuccess,
            errorCount: totalErrors + invalidCount,
            totalProcessed: rawPrograms.length,
            errors: allErrors
        };
        
    } catch (error) {
        console.error(`💥 ${schoolKey} import failed:`, error);
        throw error;
    }
}

async function main() {
    console.log('🚀 UNIVERSAL PROGRAM IMPORTER STARTED');
    console.log('🎯 Standardized Fields: id, code, name, duration, campus, credential');
    console.log('🔧 Credential Types: bachelor, diploma, advanced diploma, certificate, other');
    console.log('=' .repeat(50));

    const schoolsToImport = process.argv.slice(2);
    const availableSchools = Object.keys(SCHOOL_CONFIGS);

    if (schoolsToImport.length === 0) {
        console.log('📋 Available schools:', availableSchools.join(', '));
        console.log('💡 Usage: npm run import-unified [school1] [school2] ...');
        console.log('   Example: npm run import-unified seneca centennial');
        console.log('   Import all: npm run import-unified all');
        return;
    }

    const schoolsToProcess = schoolsToImport.includes('all') 
        ? availableSchools 
        : schoolsToImport.filter(school => availableSchools.includes(school));

    if (schoolsToProcess.length === 0) {
        console.error('❌ No valid schools specified');
        return;
    }

    console.log(`📚 Importing programs for: ${schoolsToProcess.map(s => SCHOOL_CONFIGS[s].name).join(', ')}`);

    const results: ImportResult[] = [];

    for (const school of schoolsToProcess) {
        try {
            const result = await importSchoolPrograms(school);
            results.push(result);
        } catch (error) {
            console.error(`❌ Failed to import ${school}:`, error);
            results.push({
                school,
                successCount: 0,
                errorCount: 0,
                totalProcessed: 0,
                errors: [String(error)]
            });
        }
    }

    // Final summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 IMPORT SUMMARY');
    console.log('='.repeat(50));
    
    results.forEach(result => {
        const config = SCHOOL_CONFIGS[result.school];
        console.log(`\n🏫 ${config.name}:`);
        console.log(`  ✅ Success: ${result.successCount}`);
        console.log(`  ❌ Errors: ${result.errorCount}`);
        console.log(`  📊 Total: ${result.totalProcessed}`);
        console.log(`  📋 Success rate: ${result.totalProcessed > 0 ? ((result.successCount / result.totalProcessed) * 100).toFixed(1) : 0}%`);
    });

    const totalSuccess = results.reduce((sum, r) => sum + r.successCount, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errorCount, 0);
    const totalProcessed = results.reduce((sum, r) => sum + r.totalProcessed, 0);

    console.log(`\n🎯 OVERALL TOTALS:`);
    console.log(`  ✅ Total successful: ${totalSuccess}`);
    console.log(`  ❌ Total errors: ${totalErrors}`);
    console.log(`  📊 Total processed: ${totalProcessed}`);
    console.log(`  📋 Overall success rate: ${totalProcessed > 0 ? ((totalSuccess / totalProcessed) * 100).toFixed(1) : 0}%`);
    
    // Show sample of standardized data
    if (totalSuccess > 0) {
        console.log(`\n📋 STANDARDIZED DATA SAMPLE:`);
        console.log('Fields: id, code, name, duration, campus, credential');
        console.log('Credential values: bachelor, diploma, advanced diploma, certificate, other');
    }
    
    console.log('\n🎉 Universal import process completed!');
}

main().catch(console.error); 