import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
// import { useAuthStore } from "../store/useAuthStore"; // Zustand store (if you store token here)

// Create axios instance
import { API_BASE_URL } from "../config/env";
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
    const token = "temp"; // Dummy token for now
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

    // Example: Refresh token logic
    if (error.response?.status === 401) {
      //       TODO: implement refresh token & retry
      //       AsyncStorage.removeItem("token");
      //       AsyncStorage.removeItem("user");
      //       remove from the store as well
    }

    return Promise.reject(error);
  }
);

export default api;
