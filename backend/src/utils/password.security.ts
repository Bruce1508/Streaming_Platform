import { createHash } from 'crypto';  
import axios from 'axios';

export const checkPasswordBreach = async (password: string): Promise<boolean> => {
    try {
        // SHA-1 hash of password
        const hash = createHash('sha1').update(password).digest('hex').toUpperCase();
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5);

        // Query HaveIBeenPwned API
        const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`, {
            timeout: 5000, // Add timeout
            headers: {
                'User-Agent': 'StudyBuddy-PasswordChecker'
            }
        });
        
        // Check if our suffix appears in results
        const breachedHashes = response.data.split('\n');
        const isBreached = breachedHashes.some((line: string) => 
            line.startsWith(suffix)
        );

        return isBreached;
    } catch (error) {
        console.error('Password breach check failed:', error);
        return false; 
    }
};