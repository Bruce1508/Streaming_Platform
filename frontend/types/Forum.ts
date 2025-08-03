// ===== FORUM TYPES =====
// Định nghĩa các types cho hệ thống forum

// Author information for posts and comments
export interface ForumAuthor {
    _id: string;
    fullName: string;
    email?: string;
    profilePic?: string;
}

// Program information for categorizing posts
export interface ForumProgram {
    _id: string;
    name: string;
    code: string;
}

// Main forum post interface
export interface ForumPost {
    _id: string;
    title: string;
    content: string;
    author: ForumAuthor;
    program?: ForumProgram;
    tags: string[];
    category: 'general' | 'course-specific' | 'assignment' | 'exam' | 'career' | 'question' | 'discussion';
    status: 'open' | 'closed' | 'resolved' | 'pinned';
    views: number;
    upvotes: string[]; // Array of user IDs who upvoted
    downvotes: string[]; // Array of user IDs who downvoted
    voteCount: number; // Virtual field: upvotes.length - downvotes.length
    isPinned: boolean;
    isAnonymous: boolean;
    commentCount: number;
    lastActivity: string; // ISO date string
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    displayAuthor: ForumAuthor; // Virtual field for anonymous handling
}

// Forum comment interface
export interface ForumComment {
    _id: string;
    content: string;
    author: ForumAuthor;
    post: string; // Post ID
    parentComment?: string; // Parent comment ID for replies
    upvotes: string[]; // Array of user IDs who upvoted
    downvotes: string[]; // Array of user IDs who downvoted
    voteCount: number; // Virtual field: upvotes.length - downvotes.length
    isAcceptedAnswer: boolean;
    isAnonymous: boolean;
    replyCount: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    displayAuthor: ForumAuthor; // Virtual field for anonymous handling
    replies?: ForumComment[]; // Nested replies (populated)
}

// API Response interfaces
export interface ForumPostsResponse {
    posts: ForumPost[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalPosts: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface ForumPostDetailResponse {
    post: ForumPost;
    comments: ForumComment[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalComments: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface ForumSearchResponse {
    posts: ForumPost[];
    query: string;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalPosts: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// Form interfaces for creating/updating
export interface CreateForumPostData {
    title: string;
    content: string;
    category: ForumPost['category'];
    tags: string[];
    program?: string; // Program ID
    isAnonymous?: boolean;
}

export interface UpdateForumPostData {
    title?: string;
    content?: string;
    category?: ForumPost['category'];
    tags?: string[];
    isAnonymous?: boolean;
}

export interface CreateCommentData {
    content: string;
    parentComment?: string; // For replies
    isAnonymous?: boolean;
}

export interface UpdateCommentData {
    content?: string;
    isAnonymous?: boolean;
}

// Vote data
export interface VoteData {
    vote: 'up' | 'down';
}

export interface VoteResponse {
    voteCount: number;
    upvotes: number;
    downvotes: number;
}

// Filter and sort options
export interface ForumFilters {
    page?: number;
    limit?: number;
    category?: ForumPost['category'];
    program?: string;
    search?: string;
    sort?: 'latest' | 'popular' | 'trending' | 'votes';
    status?: ForumPost['status'];
}

// Top user interface for sidebar
export interface TopUser {
    _id: string;
    fullName: string;
    profilePic?: string;
    reputation: number;
    postCount: number;
}

// Navigation menu items
export interface ForumNavItem {
    id: string;
    label: string;
    icon: string;
    href: string;
    active?: boolean;
    count?: number; // For showing counts like unread
} 