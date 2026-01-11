import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "https://framely-backend-cvccf3aah7d4ceaq.centralindia-01.azurewebsites.net/api/v1",
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