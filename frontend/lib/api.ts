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
            if (session?.accessToken) {
                config.headers.Authorization = `Bearer ${session.accessToken}`;
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
    signUp: (data: any) => api.post('/auth/signUp', data),
    signIn: (data: any) => api.post('/auth/signIn', data),
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
    getPrograms: (params?: any) => {
        // Filter out undefined values
        const cleanParams: Record<string, string> = {};
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    cleanParams[key] = params[key];
                }
            });
        }
        
        const queryString = Object.keys(cleanParams).length > 0 
            ? `?${new URLSearchParams(cleanParams).toString()}` 
            : '';
        return api.get(`/programs${queryString}`);
    },
    getProgramById: (id: string) => api.get(`/programs/${id}`),
    searchPrograms: (query: string) => api.get(`/programs/search?q=${encodeURIComponent(query)}`),
    getProgramsBySchool: (schoolId: string) => api.get(`/programs/school/${schoolId}`),
    getProgramLevels: () => api.get('/programs/levels'),
};

// ===== COURSE APIs =====
export const courseAPI = {
    getProgramCourses: (programId: string) => api.get(`/courses/program-courses/${programId}`),
    searchCourses: (params?: any) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return api.get(`/courses/program-courses/search${queryString}`);
    },
    getCourseStats: () => api.get('/courses/program-courses/stats'),
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
        year: number;
        criteriaRatings: {
            TeachingQuality: number;
            FacultySupport: number;
            LearningEnvironment: number;
            LibraryResources: number;
            StudentSupport: number;
            CampusLife: number;
            OverallExperience: number;
        };
        comment?: string;
    }) => api.post('/program-reviews', data),
    updateReview: (reviewId: string, data: any) => api.put(`/program-reviews/${reviewId}`, data),
    deleteReview: (reviewId: string) => api.delete(`/program-reviews/${reviewId}`),
    likeReview: (reviewId: string, action: 'like' | 'dislike') => api.post(`/program-reviews/${reviewId}/${action}`),
};

// ===== CHAT APIs =====
export const chatAPI = {
    getStreamToken: () => api.get('/chat/token'),
};

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
export const signUp = authAPI.signUp;
export const signIn = authAPI.signIn;
export const getAuthUser = authAPI.getMe;
export const getUserFriends = userAPI.getFriends;
export const getRecommendedUsers = userAPI.getRecommended;
export const getMyProfile = userAPI.getProfile;
export const updateMyProfile = userAPI.updateProfile;
export const searchUsers = userAPI.searchUsers;
export const getStreamToken = chatAPI.getStreamToken;
export const completeOnBoarding = userAPI.completeOnBoarding;

// Export notification functions
export const getNotifications = notificationAPI.getNotifications;
export const markNotificationAsRead = notificationAPI.markAsRead;
export const markAllNotificationsAsRead = notificationAPI.markAllAsRead;
export const deleteNotification = notificationAPI.deleteNotification;

export default apiClient; 