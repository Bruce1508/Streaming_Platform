import { createTransformer, validateStandardizedProgram } from '../src/utils/programTransformer';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function testTransformation() {
    console.log('🧪 TESTING PROGRAM TRANSFORMATION');
    console.log('=' .repeat(50));

    const schools = ['seneca', 'centennial', 'york', 'georgebrown', 'humber', 'tmu', 'manitobaUni'] as const;
    const filePaths: Record<typeof schools[number], string> = {
        seneca: 'output/seneca/all_programs.json',
        centennial: 'output/centennial/centennial_programs_manual.json',
        york: 'output/yorkUni/yorkUni.json',
        georgebrown: 'output/george_brown/georgebrown_programs_complete.json',
        humber: 'output/humber/humber.json',
        tmu: 'output/tmu/tmu.json',
        manitobaUni: 'output/manitobaUni/umanitoba_programs.json'
    };

    for (const school of schools) {
        console.log(`\n🏫 Testing ${school.toUpperCase()} transformation...`);
        
        try {
            // Load sample data
            const filePath = path.join(__dirname, filePaths[school]);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const programs = JSON.parse(fileContent);
            
            if (programs.length === 0) {
                console.log(`⚠️  No programs found in ${school}`);
                continue;
            }

            // Test transformation with first 3 programs
            const transformer = createTransformer(school);
            const samplePrograms = programs.slice(0, 3);
            
            console.log(`📊 Original sample data structure:`);
            console.log(JSON.stringify(samplePrograms[0], null, 2));
            
            console.log(`\n🔄 Transforming ${samplePrograms.length} sample programs...`);
            
            const transformedPrograms = transformer.transformBatch(samplePrograms);
            
            console.log(`✅ Transformed sample:`);
            console.log(JSON.stringify(transformedPrograms[0], null, 2));
            
            // Validate transformed programs
            const validPrograms = transformedPrograms.filter(validateStandardizedProgram);
            const invalidPrograms = transformedPrograms.length - validPrograms.length;
            
            console.log(`\n📈 Validation Results:`);
            console.log(`  ✅ Valid programs: ${validPrograms.length}`);
            console.log(`  ❌ Invalid programs: ${invalidPrograms}`);
            
            if (invalidPrograms > 0) {
                console.log(`  ⚠️  Invalid programs detected!`);
                transformedPrograms.forEach((program, index) => {
                    if (!validateStandardizedProgram(program)) {
                        console.log(`    - Program ${index + 1}: ${program.name} - Missing required fields`);
                    }
                });
            }
            
        } catch (error: any) {
            console.error(`❌ Error testing ${school}:`, error.message);
        }
    }

    console.log('\n🎉 Transformation testing completed!');
}

testTransformation().catch(console.error); 