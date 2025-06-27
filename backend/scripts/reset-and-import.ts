import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Program } from '../backend/src/models/Program';
import { logger } from '../backend/src/utils/logger.utils';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

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

interface TransformedProgram {
    programId: string;
    code: string;
    name: string;
    overview: string;
    duration: string;
    campus: string[];
    delivery?: string;
    credential: string;
    school: string;
    level: string;
    isActive: boolean;
    stats: {
        enrollmentCount: number;
        graduationRate?: number;
        employmentRate?: number;
    };
}

// Function to map credential to level
function mapCredentialToLevel(credential: string): string {
    const credentialLower = credential.toLowerCase();
    
    if (credentialLower.includes('certificate') && credentialLower.includes('graduate')) {
        return 'Graduate Certificate';
    }
    if (credentialLower.includes('honours bachelor')) {
        return 'Honours Bachelor Degree';
    }
    if (credentialLower.includes('bachelor')) {
        return 'Bachelor';
    }
    if (credentialLower.includes('advanced diploma')) {
        return 'Advanced Diploma';
    }
    if (credentialLower.includes('diploma')) {
        return 'Diploma';
    }
    if (credentialLower.includes('certificate')) {
        return 'Certificate';
    }
    if (credentialLower.includes('seneca certificate')) {
        return 'Seneca Certificate of Standing';
    }
    if (credentialLower.includes('apprenticeship')) {
        return 'Certificate of Apprenticeship, Ontario College Certificate';
    }
    
    // Default fallback
    return 'Certificate';
}

// Function to transform raw program data
function transformProgram(rawProgram: RawProgram): TransformedProgram {
    return {
        programId: rawProgram.id.toLowerCase(),
        code: rawProgram.code.toUpperCase(),
        name: rawProgram.name,
        overview: rawProgram.overview,
        duration: rawProgram.duration,
        campus: rawProgram.campus || [],
        delivery: rawProgram.delivery === 'program delivery options' ? undefined : rawProgram.delivery,
        credential: rawProgram.credential,
        school: rawProgram.school,
        level: mapCredentialToLevel(rawProgram.credential),
        isActive: true,
        stats: {
            enrollmentCount: 0,
            graduationRate: undefined,
            employmentRate: undefined
        }
    };
}

// Import programs function
async function importPrograms() {
    try {
        // Read the JSON file
        const jsonPath = path.join(__dirname, 'output/processed/all_programs.json');
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`File not found: ${jsonPath}`);
        }

        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const rawPrograms: RawProgram[] = JSON.parse(rawData);

        logger.info(`Found ${rawPrograms.length} programs to import`);

        // Clear existing programs
        const deleteResult = await Program.deleteMany({});
        logger.info(`Deleted ${deleteResult.deletedCount} existing programs`);

        // Transform and insert programs
        const transformedPrograms = rawPrograms.map(transformProgram);
        
        // Insert in batches to avoid memory issues
        const batchSize = 100;
        let insertedCount = 0;
        
        for (let i = 0; i < transformedPrograms.length; i += batchSize) {
            const batch = transformedPrograms.slice(i, i + batchSize);
            const result = await Program.insertMany(batch, { 
                ordered: false, // Continue on errors
                rawResult: true 
            });
            
            insertedCount += batch.length;
            logger.info(`Inserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} programs`);
        }

        logger.info(`Import completed successfully!`);
        logger.info(`Total programs imported: ${insertedCount}`);

        // Verify import
        const totalPrograms = await Program.countDocuments();
        logger.info(`Total programs in database: ${totalPrograms}`);

        // Show some statistics
        const levelStats = await Program.aggregate([
            { $group: { _id: '$level', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        logger.info('Programs by level:');
        levelStats.forEach(stat => {
            logger.info(`  ${stat._id}: ${stat.count}`);
        });

        const schoolStats = await Program.aggregate([
            { $group: { _id: '$school', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        logger.info('Top 10 schools by program count:');
        schoolStats.forEach(stat => {
            logger.info(`  ${stat._id}: ${stat.count}`);
        });

    } catch (error) {
        logger.error('Import failed:', error);
        throw error;
    }
}

async function resetAndImport() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI environment variable is required');
        }

        await mongoose.connect(mongoUri);
        logger.info('Connected to MongoDB');

        // Get database name from connection string
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }
        
        const dbName = db.databaseName;
        logger.info(`Database: ${dbName}`);

        // Drop the entire database
        logger.info('Dropping database...');
        await db.dropDatabase();
        logger.info('Database dropped successfully');

        // Disconnect and reconnect to ensure clean state
        await mongoose.disconnect();
        logger.info('Disconnected from MongoDB');

        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Reconnect
        await mongoose.connect(mongoUri);
        logger.info('Reconnected to MongoDB');

        // Import programs
        logger.info('Starting program import...');
        await importPrograms();

        logger.info('Reset and import completed successfully!');

    } catch (error) {
        logger.error('Reset and import failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        logger.info('Disconnected from MongoDB');
    }
}

// Run the reset and import
if (require.main === module) {
    resetAndImport();
}

export { resetAndImport }; 