"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickRandomMultiple = exports.pickRandom = exports.shuffleArray = exports.generateRandomFileName = exports.generateStudentId = exports.generateCourseCode = exports.generateRandomPassword = exports.generateUUID = exports.generateSecureToken = exports.generateRandomColor = exports.generateRandomNumber = exports.generateRandomString = void 0;
// utils/random.utils.ts
const crypto_1 = __importDefault(require("crypto"));
// Generate random string
const generateRandomString = (length = 10, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
};
exports.generateRandomString = generateRandomString;
// Generate random number
const generateRandomNumber = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.generateRandomNumber = generateRandomNumber;
// Generate random hex color
const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};
exports.generateRandomColor = generateRandomColor;
// Generate secure random token
const generateSecureToken = (bytes = 32) => {
    return crypto_1.default.randomBytes(bytes).toString('hex');
};
exports.generateSecureToken = generateSecureToken;
// Generate random UUID
const generateUUID = () => {
    return crypto_1.default.randomUUID();
};
exports.generateUUID = generateUUID;
// Generate random password
const generateRandomPassword = (length = 12) => {
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
exports.generateRandomPassword = generateRandomPassword;
// Generate random course code
const generateCourseCode = (prefix = 'CS') => {
    const number = (0, exports.generateRandomNumber)(100, 999);
    return `${prefix}${number}`;
};
exports.generateCourseCode = generateCourseCode;
// Generate random student ID
const generateStudentId = (year = new Date().getFullYear()) => {
    const yearSuffix = year.toString().slice(-2);
    const randomNum = (0, exports.generateRandomNumber)(1000, 9999);
    return `${yearSuffix}${randomNum}`;
};
exports.generateStudentId = generateStudentId;
// Generate random file name
const generateRandomFileName = (extension = 'txt') => {
    const timestamp = Date.now();
    const random = (0, exports.generateRandomString)(8);
    return `${timestamp}_${random}.${extension}`;
};
exports.generateRandomFileName = generateRandomFileName;
// Shuffle array
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
exports.shuffleArray = shuffleArray;
// Pick random item from array
const pickRandom = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
exports.pickRandom = pickRandom;
// Pick multiple random items from array
const pickRandomMultiple = (array, count) => {
    const shuffled = (0, exports.shuffleArray)(array);
    return shuffled.slice(0, Math.min(count, array.length));
};
exports.pickRandomMultiple = pickRandomMultiple;
//# sourceMappingURL=Random.utils.js.map