import apiClient from "./apiClient";
import Cookies from "js-cookie";

// Defines the payload structure for login credentials
export interface LoginPayload {
  email: string;
  password: string;
}

// Defines the full authentication response returned by the backend
export interface AuthResponse {
  userId: string;
  fullName: string;
  email: string;
  role: "ADMIN";
  token: string;
  expiresAt: string;
  refreshToken: string | null;
}

/**
 * Sends a login request to the API and returns the authentication response.
 */
export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/Auth/login", data);
  return response.data;
};

/**
 * Clears authentication cookies and redirects the user to the login page.
 */
export const logoutUser = () => {
  Cookies.remove("token");
  Cookies.remove("user");

  setTimeout(() => {
    window.location.href = "/auth/login";
  }, 300);
};