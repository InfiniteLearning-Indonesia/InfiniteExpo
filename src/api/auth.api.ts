import api from "./axios";
import type { LoginResponse, User } from "../store/types/auth.types";

// Login
export const login = (email: string, password: string) =>
  api.post<LoginResponse>("/api/auth/login", { email, password });

// Get current user
export const getCurrentUser = () => api.get<User>("/api/auth/me");

// Register new user (admin only)
export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}) => api.post<User>("/api/auth/register", data);

// Change password
export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => api.post<{ message: string }>("/api/auth/change-password", data);
