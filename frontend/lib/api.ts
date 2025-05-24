const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    user?: T;
    token?: string;
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

const makeAuthenticationRequest = async (
    endpoint: string, 
    options: RequestInit = {}
): Promise<Response> => {
    const token = localStorage.getItem('auth_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

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
