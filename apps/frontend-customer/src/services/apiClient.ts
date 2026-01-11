// src/services/apiClient.ts
import axios from "axios";

// Centralized Axios instance for consistent API configuration
// - Defines base URL and default headers
// - Avoids repetitive setup across requests
const apiClient = axios.create({
  baseURL: "https://framely-backend-cvccf3aah7d4ceaq.centralindia-01.azurewebsites.net/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach auth token if available
// - Reads token from localStorage (browser only)
// - Adds Authorization header to each request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for global error handling
// - Logs error details for debugging
// - Handles 401 Unauthorized by clearing token and redirecting to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;