// scripts/migration/03-bookmark-migration.ts

import mongoose from 'mongoose';
import { Bookmark } from '../../src/models/Bookmark';
import { StudyMaterial } from '../../src/models/StudyMaterial';
import User from '../../src/models/User';

export async function migrateBookmarks(): Promise<{ bookmarksCreated: number }> {
    console.log('🔖 Starting Bookmark Migration...');
    
    // Clear existing bookmarks
    await Bookmark.deleteMany({});
    
    let bookmarksCreated = 0;
    
    // Get users with saved materials
    const users = await User.find({ 
        savedMaterials: { $exists: true, $ne: [] } 
    });
    
    for (const user of users) {
        for (const materialId of user.savedMaterials) {
            try {
                // Find corresponding study material
                const studyMaterial = await StudyMaterial.findOne({
                    // Match old material ID or find by similar attributes
                    $or: [
                        { _id: materialId },
                        { 'metadata.originalId': materialId }
                    ]
                });
                
                if (studyMaterial) {
                    await Bookmark.create({
                        user: user._id,
                        studyMaterial: studyMaterial._id,
                        academic: studyMaterial.academic,
                        tags: ['migrated'],
                        isPrivate: false,
                        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
                    });
                    
                    bookmarksCreated++;
                }
            } catch (error) {
                console.error(`Error creating bookmark for user ${user._id}:`, error);
            }
        }
    }
    
    console.log(`✅ Created ${bookmarksCreated} bookmarks`);
    return { bookmarksCreated };
}