// Script to create text search indexes for MongoDB
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/streamify_db';

interface IndexInfo {
    name: string;
    key: Record<string, any>;
    weights?: Record<string, number>;
}

async function createTextIndexes(): Promise<void> {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('🔌 Connecting to MongoDB...');
        await client.connect();
        
        const db = client.db();
        const forumPostsCollection = db.collection('forumposts');
        
        console.log('🔍 Creating text search indexes...');
        
        // Create text index for title and content
        await forumPostsCollection.createIndex(
            { title: 'text', content: 'text' },
            { 
                name: 'text_search_index',
                weights: {
                    title: 10,  // Title has higher weight
                    content: 5   // Content has lower weight
                }
            }
        );
        
        console.log('✅ Text search index created successfully!');
        
        // Create other useful indexes
        const indexes: IndexInfo[] = [
            { name: 'tags_index', key: { tags: 1 } },
            { name: 'author_created_index', key: { author: 1, createdAt: -1 } },
            { name: 'program_created_index', key: { program: 1, createdAt: -1 } },
            { name: 'category_created_index', key: { category: 1, createdAt: -1 } },
            { name: 'status_pinned_created_index', key: { status: 1, isPinned: -1, createdAt: -1 } },
            { name: 'last_activity_index', key: { lastActivity: -1 } }
        ];
        
        for (const index of indexes) {
            await forumPostsCollection.createIndex(index.key, { name: index.name });
            console.log(`✅ Created index: ${index.name}`);
        }
        
        console.log('✅ All indexes created successfully!');
        
        // List all indexes to verify
        const allIndexes = await forumPostsCollection.listIndexes().toArray();
        console.log('📋 Current indexes:');
        allIndexes.forEach((index: any) => {
            console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
        });
        
    } catch (error) {
        console.error('❌ Error creating indexes:', error);
        throw error;
    } finally {
        await client.close();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the script
createTextIndexes()
    .then(() => {
        console.log('🎉 Text search indexes setup completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Failed to setup text search indexes:', error);
        process.exit(1);
    }); 