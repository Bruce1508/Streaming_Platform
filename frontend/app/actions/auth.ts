'use server'

import { signup } from "@/lib/api";

// State type
interface SignUpState {
    success: boolean;
    message?: string | null;
    errors?: {
        fullName?: string;
        email?: string;
        password?: string;
        terms?: string;
        [key: string]: string | undefined;
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
            message: error.response?.data?.message || 'An unexpected error occurred'
        };
    }
}
