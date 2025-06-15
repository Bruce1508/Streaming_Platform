import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY', 
    'AWS_REGION',
    'AWS_S3_BUCKET_NAME'
];

requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});

// Create S3 client instance
export const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Export bucket name for easy access
export const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

// Upload utility function (compatible with existing structure)
export const uploadToS3 = async (
    file: Buffer | Uint8Array | string,
    key: string,
    contentType: string
): Promise<string> => {
    try {
        const uploadParams = {
            Bucket: S3_BUCKET_NAME,
            Key: key,
            Body: file,
            ContentType: contentType,
            // Make files publicly readable (for study materials)
            ACL: 'public-read' as const,
        };

        const upload = new Upload({
            client: s3Client,
            params: uploadParams,
        });

        const result = await upload.done();
        
        // Return the public URL
        return `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
        console.error('S3 upload error:', error);
        throw new Error(`Failed to upload file to S3: ${error}`);
    }
};

export default s3Client;