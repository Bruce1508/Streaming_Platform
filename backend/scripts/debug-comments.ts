import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ForumComment from '../src/models/ForumComment';
import ForumPost from '../src/models/ForumPost';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/streamify_db';

async function debugComments(): Promise<void> {
    const client = await mongoose.connect(MONGODB_URI);
    
    try {
        console.log('🔍 Debugging comments...');
        
        // Get all comments
        const allComments = await ForumComment.find({}).lean();
        console.log('📊 Total comments in database:', allComments.length);
        
        if (allComments.length > 0) {
            console.log('📝 Comments found:');
            allComments.forEach((comment, index) => {
                console.log(`${index + 1}. Comment ID: ${comment._id}`);
                console.log(`   Post ID: ${comment.post}`);
                console.log(`   Author: ${comment.author}`);
                console.log(`   Content: ${comment.content.substring(0, 50)}...`);
                console.log(`   Parent Comment: ${comment.parentComment || 'None'}`);
                console.log(`   Parent Comment exists: ${comment.parentComment ? 'YES' : 'NO'}`);
                console.log(`   Created: ${comment.createdAt}`);
                console.log('---');
            });
        }
        
        // Check specific post
        const postId = '688cb1e36f654315fb98c69a';
        const specificPost = await ForumPost.findById(postId).lean();
        if (specificPost) {
            console.log(`🎯 Specific post (${postId}):`);
            console.log(`   Title: ${specificPost.title}`);
            console.log(`   Comment Count: ${specificPost.commentCount}`);
            
            // Find ALL comments for this post (including replies)
            const allPostComments = await ForumComment.find({ post: postId }).lean();
            console.log(`   All comments for this post: ${allPostComments.length}`);
            
            // Find only top-level comments (no parentComment)
            const topLevelComments = await ForumComment.find({ 
                post: postId, 
                parentComment: { $exists: false } 
            }).lean();
            console.log(`   Top-level comments (no parentComment): ${topLevelComments.length}`);
            
            // Find comments with parentComment = null
            const nullParentComments = await ForumComment.find({ 
                post: postId, 
                parentComment: null 
            }).lean();
            console.log(`   Comments with parentComment = null: ${nullParentComments.length}`);
            
            // Find comments with parentComment = undefined
            const undefinedParentComments = await ForumComment.find({ 
                post: postId, 
                parentComment: undefined 
            }).lean();
            console.log(`   Comments with parentComment = undefined: ${undefinedParentComments.length}`);
            
            if (allPostComments.length > 0) {
                console.log('   All comments details:');
                allPostComments.forEach((comment, index) => {
                    console.log(`     ${index + 1}. ID: ${comment._id}`);
                    console.log(`        Content: ${comment.content.substring(0, 30)}...`);
                    console.log(`        Parent Comment: ${comment.parentComment || 'None'}`);
                    console.log(`        Parent Comment type: ${typeof comment.parentComment}`);
                    console.log(`        Parent Comment === null: ${comment.parentComment === null}`);
                    console.log(`        Parent Comment === undefined: ${comment.parentComment === undefined}`);
                });
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.disconnect();
    }
}

debugComments().then(() => {
    console.log('✅ Debug completed');
    process.exit(0);
}).catch((error) => {
    console.error('❌ Debug failed:', error);
    process.exit(1);
}); 