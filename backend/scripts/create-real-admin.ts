import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';
import { connectDB } from '../src/lib/db';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const JWT_SECRET = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'default-secret';

async function createAdminUser() {
    try {
        // Connect to database
        await connectDB();
        console.log('📦 Connected to database');

        // Check if admin already exists
        let adminUser = await User.findOne({ email: 'admin@seneca.ca' });
        
        if (adminUser) {
            console.log('✅ Admin user already exists');
        } else {
            // Create admin user
            const hashedPassword = await bcrypt.hash('admin123', 12);
            
            adminUser = await User.create({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@seneca.ca',
                password: hashedPassword,
                role: 'admin',
                isActive: true,
                isEmailVerified: true
            });
            
            console.log('✅ Admin user created successfully');
        }

        console.log('👤 Admin User Info:');
        console.log('- ID:', adminUser._id.toString());
        console.log('- Email:', adminUser.email);
        console.log('- Role:', adminUser.role);

        // Create token with real user ID
        const adminToken = jwt.sign(
            { 
                userId: adminUser._id.toString(),
                id: adminUser._id.toString(),
                role: adminUser.role,
                email: adminUser.email
            }, 
            JWT_SECRET, 
            { 
                expiresIn: '24h',
                issuer: 'seneca-backend',
                audience: 'seneca-api'
            }
        );

        console.log('\n🔑 Generated Admin Token:');
        console.log(adminToken);
        
        console.log('\n📋 Instructions:');
        console.log('1. Copy the token above');
        console.log('2. Paste it into ADMIN_TOKEN in import-program-courses-api.ts');
        console.log('3. Run the import script again');

        // Verify token
        try {
            const decoded = jwt.verify(adminToken, JWT_SECRET);
            console.log('\n✅ Token verification successful');
        } catch (error) {
            console.log('\n❌ Token verification failed:', error);
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

// Run the script
createAdminUser(); 