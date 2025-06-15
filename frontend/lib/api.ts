import { getSession } from "next-auth/react";
import { getAuthToken } from './tokenUtils';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    user?: T;
    token?: string;
}

interface User {
    _id: string;
    fullName: string;
    username?: string;
    avatar?: string;
    nativeLanguage: string;
    learningLanguage: string;
    location?: string;
    email: string;
}

interface SignupData {
    fullName: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface OnboardingData {
    fullName: string;
    bio: string;
    nativeLanguage: string;
    learningLanguage: string;
    location: string;
    profilePic: string;
}

export const makeAuthenticationRequest = async (
    endpoint: string, 
    options: RequestInit = {}
): Promise<Response> => {
    // ✅ Get token with proper type checking
    let rawToken = localStorage.getItem('auth_token');
    
    console.log('🔍 makeAuthenticationRequest debug:', {
        rawToken,
        tokenType: typeof rawToken,
        tokenLength: rawToken?.length,
        isNull: rawToken === null,
        isStringNull: rawToken === 'null'
    });
    
    // ✅ Clean token
    let token: string | null = null;
    if (rawToken && rawToken !== 'null' && rawToken !== 'undefined') {
        token = typeof rawToken === 'string' ? rawToken : String(rawToken);
    }
    
    // ✅ Fallback to session if no localStorage token
    if (!token) {
        console.log('🔍 No localStorage token, trying session...');
        try {
            const session = await getSession();
            token = session?.accessToken || null;
            console.log('🔍 Session token:', !!token);
        } catch (error) {
            console.log('❌ Session token failed:', error);
        }
    }
    
    if (!token) {
        console.error('❌ No token available for request');
        throw new Error('No authentication token available');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };
    
    console.log('📡 Making request:', {
        endpoint: `${BASE_URL}${endpoint}`,
        hasAuth: !!headers.Authorization,
        authPreview: headers.Authorization?.substring(0, 30) + '...'
    });

    return fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
}

export const signUp = async (signUpData: SignupData): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/auth/sign-up`, {
            method: 'POST',
            body: JSON.stringify(signUpData),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('Signup error:', error);
        return {
            success: false,
            message: 'Network error occurred with signUp function in api.ts'
        };
    }
}

export const signIn = async (loginData: LoginData): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/auth/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('Login error in api.ts:', error);
        return {
            success: false,
            message: 'Something wrong with signIn function in api.ts'
        };
    }
};

export const getAuthUser = async (): Promise<ApiResponse | null> => {
    try {
        const response = await makeAuthenticationRequest("/auth/me");
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Get auth user error in api.ts:', error);
        return null;
    }
}

export const completeOnBoarding = async (userData: OnboardingData): Promise<ApiResponse> => {
    try {
        const response = await makeAuthenticationRequest('/auth/onBoarding', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Onboarding error in api.ts: ", error);
        return {
            success: false,
            message: "Internal error in Onboarding in api.ts"
        }
    }
}

export async function getUserFriends(): Promise<any[]> {
    try {
        const response = await makeAuthenticationRequest('/users/friends');
        if (!response.ok) {
            throw new Error('Failed to fetch friends');
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('Get friends error:', error);
        throw error;
    };
}

export async function getRecommendedUsers(): Promise<any[]> {
    try {
        const response = await makeAuthenticationRequest('/users/recommended');
        
        if (!response.ok) {
            throw new Error('Failed to fetch recommended users');
        }
        
        const data = await response.json();
        console.log('✅ Recommended users fetched:', data);
        return data;
    } catch (error) {
        console.error('Get recommended users error:', error);
        throw error;
    }
}

export async function getOutgoingFriendReqs(): Promise<any[]> {
    try {
        const response = await makeAuthenticationRequest('/users/outgoing-friend-requests');
        
        if (!response.ok) {
            throw new Error('Failed to fetch outgoing requests');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Get outgoing requests error:', error);
        throw error;
    }
}

//hàm bị trùng bên useFriend.ts
export async function sendFriendRequest(userId: string): Promise<any> {
    try {
        const response = await makeAuthenticationRequest(`/users/friend-request/${userId}`, {
            method: 'POST',
        });
        
        if (!response.ok) {
            throw new Error('Failed to send friend request');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Send friend request error:', error);
        throw error;
    }
}

export async function getFriendRequests(): Promise<any> {
    try {
        console.log('🌐 Making API call to /users/friend-requests');
        
        const response = await makeAuthenticationRequest('/users/friend-requests');
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            console.error('❌ Response not OK:', response.status, response.statusText);
            throw new Error('Failed to fetch friend requests');
        }
        
        const data = await response.json();
        console.log('📦 Raw API response:', data);
        
        // Check backend response structure
        const result = {
            incomingRequests: data.incomingRequests || data.incomingReqs || [],
            acceptedRequests: data.acceptedRequests || data.acceptedReqs || []
        };
        
        console.log('🔄 Mapped result:', result);
        return result;
    } catch (error) {
        console.error('❌ Get friend requests error:', error);
        throw error;
    }
}

export async function acceptFriendRequest(requestId: string): Promise<any> {
    try {
        console.log('🔄 Accepting friend request:', requestId);
        
        const response = await makeAuthenticationRequest(`/users/friend-request/${requestId}/accept`, {
            method: 'PUT',
        });
        
        console.log('📡 Accept response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Accept failed:', errorData);
            throw new Error(errorData.message || 'Failed to accept friend request');
        }
        
        const data = await response.json();
        console.log('✅ Accept success:', data);
        return data;
    } catch (error) {
        console.error('❌ Accept friend request error:', error);
        throw error;
    }
}

// Chat APIs
export async function getStreamToken(): Promise<any> {
    try {
        console.log('🔄 Requesting Stream token...');
        
        const response = await makeAuthenticationRequest('/chat/token');
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Token request failed:', errorData);
            throw new Error(errorData.message || 'Failed to get stream token in frontend api.ts');
        }
        
        const data = await response.json();
        console.log('✅ Stream token received:', data);
        return data;
    } catch (error) {
        console.error('❌ Get stream token error in the frontend:', error);
        throw error;
    }
}

export async function rejectFriendRequest(requestId: string): Promise<any> {
    try {
        console.log('🔄 Rejecting friend request:', requestId);
        
        const response = await makeAuthenticationRequest(`/users/friend-request/${requestId}/reject`, {
            method: 'DELETE',
        });
        
        console.log('📡 Reject response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Reject failed:', errorData);
            throw new Error(errorData.message || 'Failed to reject friend request from api.ts');
        }
        
        const data = await response.json();
        console.log('✅ Reject success:', data);
        return data;
    } catch (error) {
        console.error('❌ Reject friend request error in api.ts:', error);
        throw error;
    }
}

export async function cancelFriendRequest(recipientId: string): Promise<any> {
    try {
        const response = await makeAuthenticationRequest(`/users/friend-request/${recipientId}/cancel`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to cancel friend request');
        }

        const data = await response.json();
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Error cancelling friend request:', error);
        throw error;
    }
}

export async function getMyProfile(): Promise<any> {
    try {
        const response = await makeAuthenticationRequest('/users/profile', {
            method: 'GET',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch profile');
        }
        
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

export async function updateMyProfile(profileData: {
    fullName?: string;
    bio?: string;
    location?: string;
    website?: string;
}): Promise<any> {
    try {
        const response = await makeAuthenticationRequest('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update profile');
        }
        
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

export async function updateProfilePicture(profilePic: string): Promise<any> {
    try {
        const response = await makeAuthenticationRequest('/users/profile/avatar', {
            method: 'PUT',
            body: JSON.stringify({ profilePic }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update profile picture');
        }
        
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Error updating profile picture:', error);
        throw error;
    }
}

export async function searchUsers(query: string): Promise<User[]> {
    try {
        console.log('🔍 Starting user search for:', query);
        
        if (!query.trim()) {
            console.log('⚠️ Empty search query');
            return [];
        }
        
        const response = await makeAuthenticationRequest(
            `/users/search?q=${encodeURIComponent(query)}`
        );
        
        console.log('📡 Search response status:', response.status);
        
        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Search error:', error);
            
            if (response.status === 401) {
                console.log('🔄 Unauthorized - token may be expired');
                // Let the auth wrapper handle redirect
                throw new Error('Unauthorized');
            }
            
            throw new Error(error.message || 'Search failed');
        }
        
        const data = await response.json();
        console.log('✅ Search successful:', data);
        
        // Return the users array, filtering will be done in component
        return data.users || [];
        
    } catch (error) {
        console.error('❌ Search request failed:', error);
        throw error;
    }
}


