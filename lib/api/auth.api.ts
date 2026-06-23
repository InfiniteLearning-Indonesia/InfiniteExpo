import api from "./axios";
import type { User, LoginResponse } from "../context/AuthContext";

export const login = (email: string, password: string) =>
  api.post<LoginResponse>("/api/auth/login", { email, password });

export const getCurrentUser = () => api.get<User>("/api/auth/me");

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}) => api.post<User>("/api/auth/register", data);

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => api.post<{ message: string }>("/api/auth/change-password", data);
