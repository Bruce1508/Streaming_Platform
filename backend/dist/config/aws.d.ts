import { S3Client } from '@aws-sdk/client-s3';
export declare const s3Client: S3Client;
export declare const S3_BUCKET_NAME: string;
export declare const uploadToS3: (file: Buffer | Uint8Array | string, key: string, contentType: string) => Promise<string>;
export default s3Client;
//# sourceMappingURL=aws.d.ts.map