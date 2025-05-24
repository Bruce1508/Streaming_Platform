'use server'

import { completeOnboarding, signup } from "@/lib/api";
import { cookies } from "next/headers";

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
        fullName?: string;
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

export async function handleOnBoarded(prevState: OnBoardingState, formData: FormData): Promise<OnBoardingState> {
    try {
        const fullName = formData.get("fullName") as string;
        const bio = formData.get("bio") as string;
        const nativeLanguage = formData.get("nativeLanguage") as string;
        const learningLanguage = formData.get("learningLanguage") as string;
        const location = formData.get("location") as string;
        const profilePic = formData.get("profilePic") as string;

        console.log("Server action of onBoarding received data: ", {
            fullName, bio, nativeLanguage, learningLanguage, location, profilePic
        });

        const errors: OnBoardingState['errors'] = {};

        // Validate required fields
        if (!fullName?.trim()) errors.fullName = 'Full name is required';
        if (!nativeLanguage) errors.nativeLanguage = 'Native language is required';
        if (!learningLanguage) errors.learningLanguage = 'Learning language is required';
        if (nativeLanguage === learningLanguage) {
            errors.learningLanguage = 'Learning language must be different from native language';
        }

        if (Object.keys(errors).length > 0) {
            return {
                success: false,
                message: 'Please fix the errors below',
                errors
            };
        }

        const cookieStore = await cookies();
        const jwtCookie = cookieStore.get('jwt');
        const cookieHeader = jwtCookie ? `jwt=${jwtCookie.value}` : '';

        console.log('🍪 JWT Cookie:', jwtCookie);
        console.log('🍪 Cookie header:', cookieHeader);

        if (!cookieHeader) {
            return {
                success: false,
                message: 'Authentication required. Please login again.'
            };
        }

        const result = await completeOnboarding(
            {
                fullName: fullName.trim(),
                bio: bio?.trim() || "",
                nativeLanguage,
                learningLanguage,
                location: location?.trim() || "",
                profilePic,
            },
            { cookieHeader } // Truyền cookie
        );

        if (result.success) {
            return {
                success: true,
                message: "Profile completed successfully!"
            }
        } else {
            return {
                success: false,
                message: result.message || "Failed to complete onboarding"
            }
        }

    } catch (error: any) {
        console.error('OnBoarding error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'An unexpected error occurred during onBoarding process'
        }
    }
}