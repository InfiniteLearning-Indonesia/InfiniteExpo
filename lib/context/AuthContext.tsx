"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as authApi from "../api/auth.api";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface LoginResponse {
  token: string;
  user: User;
}

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Read session from localStorage on mount
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      // Fetch user profile info
      authApi.getCurrentUser()
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error("Session verification failed:", err);
          // Token expired or invalid
          localStorage.removeItem("token");
          setToken(null);
          setIsAuthenticated(false);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.login(email, password);
      const data = res.data;
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error("Login failed:", err);
      let message = "Login failed. Please check your credentials and try again.";
      const isDev = process.env.NODE_ENV !== "production";

      if (!err.response) {
        // Backend is down / Network Error
        message = isDev
          ? "Unable to connect to the backend server."
          : "Server is temporarily unreachable. Please check your internet connection or try again later.";
      } else if (err.response.status === 500) {
        // Internal Server Error (e.g. database offline)
        const errMsg = err.response.data?.message || "";
        const isDbError = errMsg.includes("ECONNREFUSED") || errMsg.includes("database") || errMsg.includes("mysql") || errMsg.includes("connection");
        if (isDbError) {
          message = isDev
            ? `Database connection error: Please make sure MySQL is running (XAMPP).`
            : "A database error occurred on the server. Please try again later.";
        } else {
          message = isDev
            ? `Server error: ${errMsg}`
            : "An unexpected server error occurred. Please try again later.";
        }
      } else if (err.response.status === 401 || err.response.status === 400) {
        message = err.response.data?.message || "Invalid email or password. Please try again.";
      } else if (err.response.data?.message) {
        message = err.response.data.message;
      }

      setError(message);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
