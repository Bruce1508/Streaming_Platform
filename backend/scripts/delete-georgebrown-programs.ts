import mongoose from 'mongoose';
import { Program } from '../src/models/Program';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URL || 'mongodb+srv://babyburnie2903:NZ2Ua03TaFbsVQuS@cluster0.1i4zm3y.mongodb.net/streamify_db?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGODB_URI);
        
        // Delete all programs except those from Seneca College and George Brown College
        const result = await Program.deleteMany({ school: { $nin: ['Seneca College', 'George Brown College'] } });
        console.log(`✅ Deleted ${result.deletedCount} programs (except Seneca College and George Brown College)`);
        
        await mongoose.disconnect();
        console.log('✅ Database disconnected');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main(); 