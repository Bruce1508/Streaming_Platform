'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Plus, X, Tag as TagIcon } from 'lucide-react';
import ForumLayout from '@/components/forum/ForumLayout';
import { forumAPI } from '@/lib/api';
import { CreateForumPostData } from '@/types/Forum';
import { toast } from 'react-hot-toast';

// ===== CREATE POST PAGE =====
// Trang tạo bài viết mới cho forum
const CreatePostPage = () => {
    const router = useRouter();
    const { data: session } = useSession();

    // ===== STATES =====
    const [formData, setFormData] = useState<CreateForumPostData>({
        title: '',
        content: '',
        category: 'general',
        tags: [],
        isAnonymous: false
    });
    const [tagInput, setTagInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // ===== VALIDATION =====
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.trim().length < 10) {
            newErrors.title = 'Title must be at least 10 characters';
        } else if (formData.title.trim().length > 200) {
            newErrors.title = 'Title must be less than 200 characters';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        } else if (formData.content.trim().length < 20) {
            newErrors.content = 'Content must be at least 20 characters';
        }

        if (formData.tags.length > 5) {
            newErrors.tags = 'Maximum 5 tags allowed';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ===== HANDLE FORM SUBMISSION =====
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session?.user) {
            toast.error('Please login to create a post');
            return;
        }

        if (!validateForm()) {
            toast.error('Please fix the errors below');
            return;
        }

        try {
            setIsSubmitting(true);

            console.log('🔄 Creating post:', formData);

            const response = await forumAPI.createPost(formData);
            
            console.log('📨 API Response:', response);
            console.log('�� Response structure:', {
                hasResponse: !!response,
                hasData: !!response?.data,
                dataKeys: response?.data ? Object.keys(response.data) : [],
                message: response?.data?.message,
                success: response?.data?.success,
                statusCode: response?.data?.statusCode
            });

            // Check if response exists and has data
            if (response && response.data) {
                // Since API client returns data directly, check if it's a valid post object
                const hasValidPostData = response.data._id && response.data.title && response.data.content;
                
                if (hasValidPostData) {
                    const createdPost = response.data;
                    console.log('✅ Post created:', createdPost);
                    
                    toast.success('Post created successfully!');
                    
                    // Navigate to the new post
                    if (createdPost._id) {
                        router.push(`/forum/${createdPost._id}`);
                    } else {
                        router.push('/forum');
                    }
                } else {
                    console.error('❌ API Error - Invalid post data:', response.data);
                    toast.error('Failed to create post - invalid response data');
                }
            } else {
                console.error('❌ API Error - No response data');
                toast.error('Failed to create post - no response data');
            }
        } catch (error: any) {
            console.error('❌ Create post error:', error);
            toast.error(error.response?.data?.message || 'Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ===== HANDLE TAG OPERATIONS =====
    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim()) && formData.tags.length < 5) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleTagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        }
    };

    // ===== CATEGORY OPTIONS =====
    const categoryOptions = [
        { value: 'general', label: 'General Discussion' },
        { value: 'question', label: 'Question' },
        { value: 'course-specific', label: 'Course Specific' },
        { value: 'assignment', label: 'Assignment Help' },
        { value: 'exam', label: 'Exam Discussion' },
        { value: 'career', label: 'Career Advice' },
        { value: 'discussion', label: 'Discussion' }
    ];

    // ===== REDIRECT IF NOT LOGGED IN =====
    if (!session?.user) {
        return (
            <ForumLayout>
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Please Login</h3>
                    <p className="text-gray-600 mb-4">You need to be logged in to create a post.</p>
                    <button 
                        onClick={() => router.push('/sign-in')}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                        Sign In
                    </button>
                </div>
            </ForumLayout>
        );
    }

    return (
        <ForumLayout showRightSidebar={false}>
            <div className="max-w-4xl mx-auto">
                {/* ===== HEADER ===== */}
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Forum
                    </button>
                    
                    <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
                    <p className="text-gray-600 mt-2">Share your thoughts, ask questions, or start a discussion</p>
                </div>

                {/* ===== CREATE POST FORM ===== */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* ===== TITLE FIELD ===== */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="What's your post about? Be specific and descriptive."
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                                maxLength={200}
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            <p className="text-gray-500 text-xs mt-1">{formData.title.length}/200 characters</p>
                        </div>

                        {/* ===== CATEGORY FIELD ===== */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {categoryOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* ===== CONTENT FIELD ===== */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Content *
                            </label>
                            <textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Share your thoughts, provide details, ask your question..."
                                rows={12}
                                className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.content ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                            <p className="text-gray-500 text-xs mt-1">{formData.content.length} characters (minimum 20)</p>
                        </div>

                        {/* ===== TAGS FIELD ===== */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                Tags (Optional)
                            </label>
                            
                            {/* Current Tags */}
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                                        >
                                            <TagIcon className="w-3 h-3" />
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 hover:text-indigo-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Tag Input */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    id="tags"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={handleTagKeyPress}
                                    placeholder="Add tags (press Enter or comma to add)"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={formData.tags.length >= 5}
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    disabled={!tagInput.trim() || formData.tags.length >= 5}
                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
                            <p className="text-gray-500 text-xs mt-1">{formData.tags.length}/5 tags</p>
                        </div>

                        {/* ===== OPTIONS ===== */}
                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isAnonymous}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Post anonymously</span>
                            </label>
                            <p className="text-gray-500 text-xs mt-1">Your username will be hidden from other users</p>
                        </div>

                        {/* ===== SUBMIT BUTTONS ===== */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Create Post
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ForumLayout>
    );
};

export default CreatePostPage; 