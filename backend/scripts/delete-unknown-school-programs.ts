import mongoose from 'mongoose';
import { Program } from '../src/models/Program';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URL || '';

async function main() {
    await mongoose.connect(mongoURI);
    const result = await Program.deleteMany({school: "Unknown School"});
    console.log(`Deleted ${result.deletedCount} programs with school = "Unknown School"`);
    await mongoose.disconnect();
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});