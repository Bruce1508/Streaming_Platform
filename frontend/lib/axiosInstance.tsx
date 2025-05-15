// lib/axiosInstance.ts
import axios from "axios";

const BASE_URL = "http://localhost:5001/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,  // Đây là URL của backend của bạn
  withCredentials: true,  // Cho phép gửi cookies (cần thiết cho authentication)
});