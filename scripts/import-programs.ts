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

// School Schema
const schoolSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['College', 'University', 'Institute'],
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    established: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Program Schema
const programSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        maxlength: 10
    },
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    level: {
        type: String,
        enum: ['Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor', 'Graduate Certificate'],
        required: true
    },
    duration: {
        semesters: {
            type: Number,
            required: true,
            min: 1,
            max: 12
        },
        years: {
            type: Number,
            required: true,
            min: 0.5,
            max: 6
        }
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1500
    },
    requirements: {
        academic: [{
            type: String,
            trim: true
        }],
        english: {
            type: String,
            trim: true
        },
        other: [{
            type: String,
            trim: true
        }]
    },
    careerOutcomes: [{
        type: String,
        trim: true
    }],
    totalCredits: {
        type: Number,
        required: true,
        min: 10,
        max: 200
    },
    tuition: {
        domestic: {
            type: Number,
            min: 0
        },
        international: {
            type: Number,
            min: 0
        },
        currency: {
            type: String,
            default: 'CAD',
            uppercase: true,
            maxlength: 3
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    stats: {
        enrollmentCount: {
            type: Number,
            default: 0,
            min: 0
        },
        graduationRate: {
            type: Number,
            min: 0,
            max: 100
        },
        employmentRate: {
            type: Number,
            min: 0,
            max: 100
        }
    }
}, { timestamps: true });

// Create models
const School = mongoose.model('School', schoolSchema);
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
    
    private async ensureSenecaSchool() {
        let school = await School.findOne({ code: 'SENECA' });
        
        if (!school) {
            school = await School.create({
                name: 'Seneca Polytechnic',
                code: 'SENECA',
                type: 'College',
                location: 'Toronto, Ontario',
                website: 'https://www.senecapolytechnic.ca',
                established: 1967,
                isActive: true
            });
            console.log('✅ Created Seneca school');
        } else {
            console.log('✅ Found existing Seneca school');
        }
        
        return school._id;
    }
    
    private parseDuration(durationStr: string) {
        // Parse các format như:
        // "6 Semesters (3 Years)" -> { semesters: 6, years: 3 }
        // "2 Semesters (8 Months)" -> { semesters: 2, years: 0.67 }
        // "1 to 3 Semesters" -> { semesters: 2, years: 1 }
        
        const semesterMatch = durationStr.match(/(\d+)(?:\s*to\s*(\d+))?\s*semesters?/i);
        const yearMatch = durationStr.match(/(\d+)\s*years?/i);
        const monthMatch = durationStr.match(/(\d+)\s*months?/i);
        
        let semesters = 2; // default
        let years = 1; // default
        
        if (semesterMatch) {
            // Nếu có range "1 to 3", lấy giá trị trung bình
            if (semesterMatch[2]) {
                semesters = Math.round((parseInt(semesterMatch[1]) + parseInt(semesterMatch[2])) / 2);
            } else {
                semesters = parseInt(semesterMatch[1]);
            }
        }
        
        if (yearMatch) {
            years = parseInt(yearMatch[1]);
        } else if (monthMatch) {
            // Convert months to years
            years = Math.round((parseInt(monthMatch[1]) / 12) * 10) / 10; // Round to 1 decimal
        } else {
            // Estimate years from semesters
            years = Math.round((semesters / 2) * 10) / 10;
        }
        
        // ✅ Fix: Đảm bảo years không nhỏ hơn 0.5
        if (years < 0.5) {
            years = 0.5; // Minimum theo schema validation
            console.log(`⚠️ Adjusted years from ${Math.round((semesters / 2) * 10) / 10} to ${years} (minimum requirement)`);
        }
        
        // ✅ Fix: Đảm bảo semesters tối thiểu là 1
        if (semesters < 1) {
            semesters = 1;
            console.log(`⚠️ Adjusted semesters to ${semesters} (minimum requirement)`);
        }
        
        return { semesters, years };
    }
    
    private mapCredentialToLevel(credential: string): string {
        const credLower = credential.toLowerCase();
        
        if (credLower.includes('graduate certificate')) return 'Graduate Certificate';
        if (credLower.includes('advanced diploma')) return 'Advanced Diploma';
        if (credLower.includes('diploma')) return 'Diploma';
        if (credLower.includes('certificate')) return 'Certificate';
        if (credLower.includes('bachelor')) return 'Bachelor';
        
        return 'Diploma'; // default
    }
    
    private cleanOverview(overview: string): string {
        // Clean up overview text
        if (!overview || overview.length < 50) {
            return 'Program description will be updated soon.';
        }
        
        // Remove redundant phrases
        let cleaned = overview
            .replace(/^As a graduate of this program, you may pursue future career options, such as:\s*/i, '')
            .replace(/Without fulfilment of the above requirements.*$/i, '')
            .trim();
        
        // Giới hạn độ dài không quá 950 ký tự (để an toàn với giới hạn 1000)
        if (cleaned.length > 950) {
            cleaned = cleaned.substring(0, 947) + '...';
        }
        
        return cleaned;
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
        
        const schoolId = await this.ensureSenecaSchool();
        let imported = 0;
        let updated = 0;
        let skipped = 0;
        
        for (const scraped of scrapedPrograms) {
            try {
                console.log(`\n🔍 Processing: ${scraped.code} - ${scraped.name}`);
                
                // Parse duration and level
                const duration = this.parseDuration(scraped.duration);
                const level = this.mapCredentialToLevel(scraped.credential);
                const cleanedOverview = this.cleanOverview(scraped.overview);
                
                console.log(`   Duration: ${duration.semesters} semesters, ${duration.years} years`);
                console.log(`   Level: ${level}`);
                console.log(`   Campus: ${scraped.campus.join(', ') || 'Not specified'}`);
                
                // Check if program already exists
                const existing = await Program.findOne({ code: scraped.code });
                
                if (existing) {
                    // Update existing program
                    await Program.findByIdAndUpdate(existing._id, {
                        name: scraped.name,
                        level: level,
                        duration: duration,
                        description: cleanedOverview,
                        totalCredits: Math.max(30, duration.years * 30), // Min 30 credits
                        isActive: true
                    });
                    console.log(`🔄 Updated existing program: ${scraped.code}`);
                    updated++;
                } else {
                    // Create new program
                    const newProgram = await Program.create({
                        name: scraped.name,
                        code: scraped.code,
                        school: schoolId,
                        level: level,
                        duration: duration,
                        description: cleanedOverview,
                        totalCredits: Math.max(30, duration.years * 30),
                        isActive: true,
                        requirements: {
                            academic: ['Ontario Secondary School Diploma or equivalent'],
                            english: 'Grade 12 English (ENG4U) or equivalent',
                            other: []
                        },
                        careerOutcomes: [],
                        stats: {
                            enrollmentCount: Math.floor(Math.random() * 400) + 100, // 100-500
                            graduationRate: Math.floor(Math.random() * 15) + 85,    // 85-100%
                            employmentRate: Math.floor(Math.random() * 10) + 90     // 90-100%
                        }
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