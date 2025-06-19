// scripts/utils/database-backup.ts

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

export async function createBackup(collections: string[] = []): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../backups');
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
    
    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }
    
    console.log('💾 Creating database backup...');
    
    const backup: Record<string, any[]> = {};
    
    // Get all collections if none specified
    if (collections.length === 0) {
        const db = mongoose.connection.db;
        const collectionsList = await db.listCollections().toArray();
        collections = collectionsList.map(c => c.name);
    }
    
    for (const collectionName of collections) {
        try {
            const collection = mongoose.connection.collection(collectionName);
            const documents = await collection.find({}).toArray();
            backup[collectionName] = documents;
            console.log(`📦 Backed up ${documents.length} documents from ${collectionName}`);
        } catch (error) {
            console.warn(`⚠️ Could not backup collection ${collectionName}:`, error);
        }
    }
    
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    console.log(`✅ Backup saved to: ${backupFile}`);
    
    return backupFile;
}

export async function restoreBackup(backupFile: string): Promise<void> {
    if (!fs.existsSync(backupFile)) {
        throw new Error(`Backup file not found: ${backupFile}`);
    }
    
    console.log(`🔄 Restoring backup from: ${backupFile}`);
    
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    for (const [collectionName, documents] of Object.entries(backupData)) {
        try {
            const collection = mongoose.connection.collection(collectionName);
            await collection.deleteMany({});
            
            if (Array.isArray(documents) && documents.length > 0) {
                await collection.insertMany(documents);
                console.log(`✅ Restored ${documents.length} documents to ${collectionName}`);
            }
        } catch (error) {
            console.error(`❌ Error restoring ${collectionName}:`, error);
        }
    }
    
    console.log('✅ Backup restoration completed');
}