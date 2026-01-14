import axios from "axios";
import Cookies from "js-cookie";

// 🔹 API base URL from environment (local + prod safe)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8081/api/v1"; // fallback for local dev

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attaches JWT token from cookies to every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handles global API errors and redirects unauthorized users
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    console.error("API Error:", message);

    // Clears auth cookies and redirects if unauthorized
    if (status === 401 || status === 403) {
      Cookies.remove("token");
      Cookies.remove("user");

      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 500);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
