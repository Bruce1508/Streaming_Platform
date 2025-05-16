'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { axiosInstance } from '@/lib/axiosInstance';

export async function signUp(prevState: any, formData: FormData) {
    try {
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!fullName || !email || !password) {
            return {
                success: false,
                message: "All fields are required"
            };
        }

        if (password.length < 6) {
            return {
                success: false,
                message: "Password must be at least 6 characters long"
            };
        }

        // Đổi route từ /auth/signup sang /auth/sign-in theo API của bạn
        const response = await axiosInstance.post('/auth/sign-in', {
            fullName,
            email,
            password
        });

        // Handle successful signup
        if (response.data.success) {
            // You may set cookies here if needed
            // redirect('/onboarding'); // Uncomment nếu muốn redirect ngay
            return {
                success: true,
                message: 'Account created successfully'
            };
        }

        return {
            success: true,
            message: 'Account created successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Registration failed'
        };
    }
}