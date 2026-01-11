// src/services/authService.ts
import apiClient from "./apiClient";

// Payload structure for login API
export interface LoginPayload {
  email: string;
  password: string;
}

// Payload structure for register API
export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

// Sends login request to backend
// Returns token and user info for use in AuthContext
export const loginUser = async (data: LoginPayload) => {
  const response = await apiClient.post("/Auth/login", data);
  return response.data;
};

// Sends registration request to backend
// Returns success message on successful registration
export const registerUser = async (data: RegisterPayload) => {
  const response = await apiClient.post("/Auth/register", data);
  return response.data;
};

// Clears local auth state
// Can be extended to call logout API if needed
export const logoutUser = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};