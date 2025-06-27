import mongoose from 'mongoose';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables từ backend
dotenv.config({ path: './backend/.env' });

interface ScrapedProgramData {
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

// Define schemas directly trong script này để tránh vấn đề import
const { Schema } = mongoose;

const programSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    overview: {
        type: String,
        trim: true
    },
    duration: {
        type: String,
        trim: true
    },
    campus: [{
        type: String,
        trim: true
    }],
    delivery: {
        type: String,
        trim: true
    },
    credential: {
        type: String,
        trim: true
    },
    school: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Create model
const Program = mongoose.model('Program', programSchema);

class ProgramImporter {
    private async connectDB() {
        try {
            const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/streaming_platform';
            await mongoose.connect(mongoUrl);
            console.log('✅ Connected to MongoDB');
        } catch (error) {
            console.error('❌ MongoDB connection failed:', error);
            process.exit(1);
        }
    }
    
    async importPrograms() {
        await this.connectDB();
        
        // Load scraped data
        const dataPath = path.join('./scripts/output/processed/all_programs.json');
        
        if (!await fs.pathExists(dataPath)) {
            console.error(`❌ File not found: ${dataPath}`);
            process.exit(1);
        }
        
        const scrapedPrograms: ScrapedProgramData[] = await fs.readJSON(dataPath);
        console.log(`📋 Found ${scrapedPrograms.length} programs to import`);
        
        let imported = 0;
        let updated = 0;
        let skipped = 0;
        
        for (const scraped of scrapedPrograms) {
            try {
                console.log(`\n🔍 Processing: ${scraped.code} - ${scraped.name}`);
                console.log(`   Campus: ${scraped.campus.join(', ') || 'Not specified'}`);
                
                // Check if program already exists
                const existing = await Program.findOne({ code: scraped.code });
                
                if (existing) {
                    // Update existing program
                    await Program.findByIdAndUpdate(existing._id, {
                        id: scraped.id,
                        code: scraped.code,
                        name: scraped.name,
                        overview: scraped.overview,
                        duration: scraped.duration,
                        campus: scraped.campus,
                        delivery: scraped.delivery,
                        credential: scraped.credential,
                        school: scraped.school
                    });
                    console.log(`🔄 Updated existing program: ${scraped.code}`);
                    updated++;
                } else {
                    // Create new program
                    const newProgram = await Program.create({
                        id: scraped.id,
                        code: scraped.code,
                        name: scraped.name,
                        overview: scraped.overview,
                        duration: scraped.duration,
                        campus: scraped.campus,
                        delivery: scraped.delivery,
                        credential: scraped.credential,
                        school: scraped.school
                    });
                    
                    console.log(`✅ Created new program: ${scraped.code}`);
                    imported++;
                }
                
            } catch (error) {
                console.error(`❌ Failed to process ${scraped.code}:`, error);
                skipped++;
            }
        }
        
        console.log(`\n🎉 Import completed!`);
        console.log(`✅ Imported: ${imported} programs`);
        console.log(`🔄 Updated: ${updated} programs`);
        console.log(`⏭️ Skipped: ${skipped} programs`);
        console.log(`📊 Total processed: ${imported + updated + skipped}/${scrapedPrograms.length}`);
        
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run import
async function main() {
    try {
        console.log('🚀 Starting program import...');
        const importer = new ProgramImporter();
        await importer.importPrograms();
    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    }
}

main();