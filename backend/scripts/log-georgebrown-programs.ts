import mongoose from 'mongoose';
import { Program } from '../src/models/Program';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URL || 'mongodb+srv://babyburnie2903:NZ2Ua03TaFbsVQuS@cluster0.1i4zm3y.mongodb.net/streamify_db?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
    try {
        console.log('connecting to database...');
        await mongoose.connect(MONGODB_URI);
        const programs = await Program.find({ school: 'Humber College' });
        console.log(`Found ${programs.length} programs for Humber College`);
        programs.forEach((program, idx) => {
            console.log(`${idx + 1}. Name: ${program.name}`);
            console.log(`   ProgramId: ${program.programId || program.id}`);
            console.log(`   Credential: ${program.credential}`);
            console.log(`   URL: ${program.url}`);
            console.log('---');
        });
        await mongoose.disconnect();
    } catch (error) {
        console.error('could not connect to database:', error);
        process.exit(1);
    }
}

main();