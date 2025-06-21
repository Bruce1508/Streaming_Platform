// utils/random.utils.ts
import crypto from 'crypto';

// Generate random string
export const generateRandomString = (length: number = 10, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
};

// Generate random number
export const generateRandomNumber = (min: number = 0, max: number = 100): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random hex color
export const generateRandomColor = (): string => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

// Generate secure random token
export const generateSecureToken = (bytes: number = 32): string => {
    return crypto.randomBytes(bytes).toString('hex');
};

// Generate random UUID
export const generateUUID = (): string => {
    return crypto.randomUUID();
};

// Generate random password
export const generateRandomPassword = (length: number = 12): string => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Generate random course code
export const generateCourseCode = (prefix: string = 'CS'): string => {
    const number = generateRandomNumber(100, 999);
    return `${prefix}${number}`;
};

// Generate random student ID
export const generateStudentId = (year: number = new Date().getFullYear()): string => {
    const yearSuffix = year.toString().slice(-2);
    const randomNum = generateRandomNumber(1000, 9999);
    return `${yearSuffix}${randomNum}`;
};

// Generate random file name
export const generateRandomFileName = (extension: string = 'txt'): string => {
    const timestamp = Date.now();
    const random = generateRandomString(8);
    return `${timestamp}_${random}.${extension}`;
};

// Shuffle array
export const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Pick random item from array
export const pickRandom = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
};

// Pick multiple random items from array
export const pickRandomMultiple = <T>(array: T[], count: number): T[] => {
    const shuffled = shuffleArray(array);
    return shuffled.slice(0, Math.min(count, array.length));
};