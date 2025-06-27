import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const JWT_SECRET = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'default-secret';

// Create admin token
const adminToken = jwt.sign(
    { 
        userId: 'admin',
        id: 'admin', // For backward compatibility
        role: 'admin',
        email: 'admin@seneca.ca'
    }, 
    JWT_SECRET, 
    { 
        expiresIn: '24h',
        issuer: 'seneca-backend',
        audience: 'seneca-api'
    }
);

console.log('🔑 Generated Admin Token:');
console.log(adminToken);
console.log('\n📋 Token Info:');
console.log('- Valid for: 24 hours');
console.log('- Role: admin');
console.log('- JWT Secret used:', JWT_SECRET.substring(0, 10) + '...');

// Verify the token works
try {
    const decoded = jwt.verify(adminToken, JWT_SECRET);
    console.log('\n✅ Token verification successful');
    console.log('Decoded payload:', decoded);
} catch (error) {
    console.log('\n❌ Token verification failed:', error);
}

export { adminToken }; 