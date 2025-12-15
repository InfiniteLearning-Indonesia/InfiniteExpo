import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type {
    AuthState,
    LoginCredentials,
    LoginResponse,
    User,
} from "../types/auth.types";

// Initial state
const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    isLoading: false,
    error: null,
};

// Async thunks
export const loginUser = createAsyncThunk<
    LoginResponse,
    LoginCredentials,
    { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post<LoginResponse>(
            "/api/auth/login",
            credentials
        );
        // Save token to localStorage
        localStorage.setItem("token", response.data.token);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
            err.response?.data?.message || "Login failed. Please try again."
        );
    }
});

export const getCurrentUser = createAsyncThunk<
    User,
    void,
    { rejectValue: string }
>("auth/getCurrentUser", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get<User>("/api/auth/me");
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        // Clear token if unauthorized
        localStorage.removeItem("token");
        return rejectWithValue(
            err.response?.data?.message || "Failed to get user info."
        );
    }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
    localStorage.removeItem("token");
    return null;
});

// Auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload || "Login failed";
            });

        // Get current user
        builder
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload || "Failed to get user";
            });

        // Logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        });
    },
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
