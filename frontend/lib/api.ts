// lib/api.ts - SECURE CENTRALIZED API CLIENT
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';

// ===== API CLIENT CONFIGURATION =====
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ===== REQUEST INTERCEPTOR =====
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const session = await getSession();
            console.log('🔍 API Request Debug:', {
                url: config.url,
                method: config.method,
                hasSession: !!session,
                hasAccessToken: !!session?.accessToken,
                sessionKeys: session ? Object.keys(session) : [],
                userEmail: session?.user?.email
            });
            
            if (session?.accessToken) {
                config.headers.Authorization = `Bearer ${session.accessToken}`;
                console.log('✅ Authorization header added');
            } else {
                console.log('❌ No accessToken in session');
            }
        } catch (error) {
            console.error('❌ Error getting session token:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ===== RESPONSE INTERCEPTOR =====
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('🚫 Unauthorized');
        }
        return Promise.reject(error);
    }
);

// ===== GENERIC API METHODS =====
export const api = {
    get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.get(url, config);
        return response.data;
    },
    post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.post(url, data, config);
        return response.data;
    },
    put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.put(url, data, config);
        return response.data;
    },
    delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.delete(url, config);
        return response.data;
    },
};

// ===== API RESPONSE TYPES =====
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

// ===== AUTH APIs =====
export const authAPI = {
    // ✅ REMOVED: signUp, signIn - now using NextAuth with magic link + OAuth
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

// ===== USER APIs =====
export const userAPI = {
    getRecommended: () => api.get('/users/recommended'),
    searchUsers: (query: string) => api.get(`/users/search?search=${encodeURIComponent(query)}`),
    getFriends: () => api.get('/users/friends'),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data: any) => api.put('/users/profile', data),
    completeOnBoarding: (data: any) => api.put('/users/onboarding', data),
};

// ===== MATERIAL APIs =====
export const materialAPI = {
    getMaterials: (params?: any) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return api.get(`/materials${queryString}`);
    },
    getMaterialById: (id: string) => api.get(`/materials/${id}`),
    searchMaterials: (query: string) => api.get(`/materials/search?search=${encodeURIComponent(query)}`),
    createMaterial: (data: any) => api.post('/materials', data),
    saveMaterial: (id: string) => api.post(`/materials/${id}/save`),
    rateMaterial: (id: string, rating: number) => api.post(`/materials/${id}/rate`, { rating }),
};

// ===== UPLOAD APIs =====
export const uploadAPI = {
    uploadFile: (file: FormData) => api.post('/upload/file', file, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getUserFiles: () => api.get('/upload/files'),
};

// ===== PROGRAM APIs =====
export const programAPI = {
    getPrograms: (params: any) => api.get('/programs', { params }),
    getProgramById: (id: string) => api.get(`/programs/${id}`),
    getProgramsBySchool: (schoolId: string, params: any) => api.get(`/programs/school/${schoolId}`, { params }),
    getProgramLevels: () => api.get('/programs/levels'),
    getProgramSchools: () => api.get('/programs/schools'),
    getProgramCredentials: () => api.get('/programs/credentials'),
    searchPrograms: (params: any) => api.get('/programs/search', { params }),
    getProgramSuggestions: (query: string) => api.get('/programs/suggestions', { params: { q: query } }),
    createProgram: (data: any) => api.post('/programs', data),
    updateProgram: (id: string, data: any) => api.put(`/programs/${id}`, data),
    deleteProgram: (id: string) => api.delete(`/programs/${id}`),
};

// ===== FORUM APIs =====
// APIs cho hệ thống forum - posts, comments, voting, search
export const forumAPI = {
    // ===== POST OPERATIONS =====
    // Lấy danh sách posts với filters và pagination (Home - personalized)
    getPosts: (params?: any, customPath?: string) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        const path = customPath ? `/forum${customPath}` : '/forum/posts';
        return api.get(`${path}${queryString}`);
    },
    

    
    // Lấy chi tiết một post
    getPost: (id: string) => api.get(`/forum/posts/${id}`),
    
    // Tạo post mới
    createPost: (data: any) => api.post('/forum/posts/create', data),
    
    // Cập nhật post
    updatePost: (id: string, data: any) => api.put(`/forum/posts/${id}`, data),
    
    // Xóa post
    deletePost: (id: string) => api.delete(`/forum/posts/${id}`),
    
    // Vote cho post
    votePost: (id: string, vote: 'up' | 'down') => api.post(`/forum/posts/${id}/vote`, { vote }),
    
    // ===== COMMENT OPERATIONS =====
    // Lấy comments của một post
    getComments: (postId: string, params?: any) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return api.get(`/forum/posts/${postId}/comments${queryString}`);
    },
    
    // Tạo comment hoặc reply
    createComment: (postId: string, data: any) => api.post(`/forum/posts/${postId}/comments`, data),
    
    // Cập nhật comment
    updateComment: (id: string, data: any) => api.put(`/forum/comments/${id}`, data),
    
    // Xóa comment
    deleteComment: (id: string) => api.delete(`/forum/comments/${id}`),
    
    // Vote cho comment
    voteComment: (id: string, vote: 'up' | 'down') => api.post(`/forum/comments/${id}/vote`, { vote }),
    
    // Đánh dấu comment là accepted answer (chỉ post author)
    acceptAnswer: (id: string) => api.post(`/forum/comments/${id}/accept`),
    
    // ===== SEARCH & DISCOVERY =====
    // Tìm kiếm posts
    searchPosts: (query: string, params?: any) => {
        const searchParams = new URLSearchParams({ q: query, ...params });
        return api.get(`/forum/search?${searchParams.toString()}`);
    }
};

// ===== COURSE APIs =====
// Removed due to model deletion
export const courseAPI = {
    getProgramCourses: (programId: string) => Promise.resolve({ data: null }),
    searchCourses: (params?: any) => Promise.resolve({ data: null }),
    getCourseStats: () => Promise.resolve({ data: null }),
};

// ===== PROGRAM REVIEW APIs =====
export const programReviewAPI = {
    getProgramReviews: (programId: string, params?: any) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return api.get(`/program-reviews/program/${programId}${queryString}`);
    },
    getUserReviewForProgram: (programId: string) => api.get(`/program-reviews/user/${programId}`),
    createReview: (data: {
        programId: string;
        currentSemester: string;
        ratings: {
            instructorRating: number;        // 0-100
            contentQualityRating: number;    // 0-100
            practicalValueRating: number;    // 0-100
        };
        takeTheCourseAgain: boolean;
        comment?: string;
    }) => api.post('/program-reviews', data),
    updateReview: (reviewId: string, data: {
        currentSemester?: string;
        ratings?: {
            instructorRating?: number;
            contentQualityRating?: number;
            practicalValueRating?: number;
        };
        takeTheCourseAgain?: boolean;
        comment?: string;
    }) => api.put(`/program-reviews/${reviewId}`, data),
    deleteReview: (reviewId: string) => api.delete(`/program-reviews/${reviewId}`),
    likeReview: (reviewId: string, action: 'like' | 'dislike') => api.post(`/program-reviews/${reviewId}/${action}`),
};

// ✅ REMOVED: Chat APIs - stream.io no longer used

// ===== NOTIFICATION API =====
const notificationAPI = {
    getNotifications: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
        const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
        return api.get(`/notifications${queryString}`);
    },
    markAsRead: (notificationId: string) => api.put(`/notifications/${notificationId}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    deleteNotification: (notificationId: string) => api.delete(`/notifications/${notificationId}`)
};

// ===== LEGACY EXPORTS (Để tương thích với code cũ) =====
// ✅ REMOVED: signUp, signIn exports - now using NextAuth
export const getAuthUser = authAPI.getMe;
export const getUserFriends = userAPI.getFriends;
export const getRecommendedUsers = userAPI.getRecommended;
export const getMyProfile = userAPI.getProfile;
export const updateMyProfile = userAPI.updateProfile;
export const searchUsers = userAPI.searchUsers;
// ✅ REMOVED: getStreamToken - stream.io no longer used
export const completeOnBoarding = userAPI.completeOnBoarding;

// Export notification functions
export const getNotifications = notificationAPI.getNotifications;
export const markNotificationAsRead = notificationAPI.markAsRead;
export const markAllNotificationsAsRead = notificationAPI.markAllAsRead;
export const deleteNotification = notificationAPI.deleteNotification;

export default apiClient; 