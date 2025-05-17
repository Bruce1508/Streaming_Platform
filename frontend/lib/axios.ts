// lib/axiosInstance.ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,  // Đây là URL của backend của bạn
  withCredentials: true,  // Cho phép gửi cookies (cần thiết cho authentication)
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi globally, ví dụ: refresh token, redirect to login, v.v.
    return Promise.reject(error);
  }
);