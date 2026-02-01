import apiClient from "./apiClient";

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
 * Also persists auth state in localStorage (STAGE SAFE).
 */
export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/Auth/login", data);

  // 🔐 Persist auth state
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data));

  return response.data;
};

/**
 * Clears authentication state and redirects to login page.
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setTimeout(() => {
    window.location.href = "/auth/login";
  }, 300);
};
