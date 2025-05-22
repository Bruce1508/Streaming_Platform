'use server'

import { completeOnboarding, signup } from "@/lib/api";

// State type
interface SignUpState {
    success: boolean;
    message?: string | null;
    errors?: {
        fullName?: string;
        email?: string;
        password?: string;
        terms?: string;
    };
}

interface OnBoardingState {
    success: boolean;
    message?: string | null;
    errors?: {
        bio?: string;
        nativeLanguage?: string;
        learningLanguage?: string;
        location?: string;
    };
}

export async function signUp(prevState: SignUpState, formData: FormData): Promise<SignUpState> {

    try {
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const termsAccepted = formData.get('terms') === 'on';

        console.log("Server Action received data:", {
            fullName,
            email,
            password,
            termsAccepted
        });

        const errors: SignUpState['errors'] = {};

        if (!fullName) errors.fullName = 'Full name is required';
        if (!email) errors.email = 'Email is required';
        if (!password) errors.password = 'Password is required';
        if (password && password.length < 6) errors.password = 'Password must be at least 6 characters';
        if (!termsAccepted) errors.terms = 'You must accept the terms';

        if (Object.keys(errors).length > 0) {
            return {
                success: false,
                message: 'Please fix the errors below',
                errors
            };
        }

        //gọi API signup từ api.ts và truyền dữ liệu từ form. cái này sẽ được gửi request đến backend
        const result = await signup({ fullName, email, password });

        if (result.success) {
            return {
                success: true,
                message: "Account created successfully!"
            };

        } else {
            return {
                success: false,
                message: result.message || 'Failed to create account'
            }
        }

    } catch (error: any) {
        console.error('SignUp error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'An unexpected error occurred in signUp function in auth.ts'
        };
    }
}

export async function handleOnBoarded(prevState: OnBoardingState, onBoardedData: FormData): Promise <OnBoardingState> {

    try {
        const fullName = onBoardedData.get("fullName") as string;
        const bio = onBoardedData.get("bio") as string;
        const nativeLanguage = onBoardedData.get("nativeLanguage") as string;
        const learningLanguage = onBoardedData.get("learningLanguage") as string;
        const location = onBoardedData.get("location") as string;
        const profilePic = onBoardedData.get("profilePic") as string;

        console.log("Server action of onBoarding received data: ", fullName, bio, nativeLanguage, learningLanguage, location, profilePic);

        const errors: OnBoardingState['errors'] = {};

        // Validate required fields
        if (!nativeLanguage) errors.nativeLanguage = 'Native language is required';
        if (!learningLanguage) errors.learningLanguage = 'Learning language is required';

        if (Object.keys(errors).length > 0) {
            return {
                success: false,
                message: 'Please fix the errors below',
                errors
            };
        }

        const result = await completeOnboarding({
            fullName,
            bio,
            nativeLanguage,
            learningLanguage,
            location,
            profilePic,
        });

        if (result.success) {
            return {
                success: true,
                message: "OnBoarding successfully"
            }
        } else {
            return {
                success: false,
                message: result.message || "OnBoarding failed at auth.ts"
            }
        }

    } catch (error: any) {
        console.error('OnBoarded error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'An unexpected error occurred in handleOnBoarded function in auth.ts'
        }
    }
}
