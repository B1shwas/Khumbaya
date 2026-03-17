import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
// import { useAuthStore } from "../store/useAuthStore"; // Zustand store (if you store token here)

// Create axios instance
import { API_BASE_URL } from "../config/env";
import { useAuthStore } from "../store/AuthStore";
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // const token = Get the token from the auth stooree (if you have one)
    const token = useAuthStore.getState().token; // Dummy token for now

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("📡 API Request:", {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      hasToken: !!token,
      timestamp: new Date().toISOString(),
    });

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor (middleware for incoming responses)
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.data);
    return response;
  },
  (error: any) => {
    console.error(
      "❌ API Error:",
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(error);
  }
);

export default api;
