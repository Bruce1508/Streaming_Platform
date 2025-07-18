"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPasswordBreach = void 0;
const crypto_1 = require("crypto");
const axios_1 = __importDefault(require("axios"));
const checkPasswordBreach = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // SHA-1 hash of password
        const hash = (0, crypto_1.createHash)('sha1').update(password).digest('hex').toUpperCase();
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5);
        // Query HaveIBeenPwned API
        const response = yield axios_1.default.get(`https://api.pwnedpasswords.com/range/${prefix}`, {
            timeout: 5000, // Add timeout
            headers: {
                'User-Agent': 'StudyBuddy-PasswordChecker'
            }
        });
        // Check if our suffix appears in results
        const breachedHashes = response.data.split('\n');
        const isBreached = breachedHashes.some((line) => line.startsWith(suffix));
        return isBreached;
    }
    catch (error) {
        console.error('Password breach check failed:', error);
        return false;
    }
});
exports.checkPasswordBreach = checkPasswordBreach;
//# sourceMappingURL=password.security.js.map