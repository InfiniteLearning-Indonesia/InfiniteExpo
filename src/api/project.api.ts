import api from "./axios";
import type { TeamMember } from "./team.api";

// Project Categories
export type ProjectCategory =
  | "merge" // Legacy
  | "non-merge" // Legacy
  | "merge_web_ai"
  | "merge_web_mobile"
  | "merge_ai_mobile"
  | "web_only"
  | "mobile_only"
  | "game_only"
  | "ai_only";

export const categoryLabels: Record<ProjectCategory, string> = {
  merge: "Web + AI (Legacy)",
  "non-merge": "Web Only (Legacy)",
  merge_web_ai: "Merge: Web + AI",
  merge_web_mobile: "Merge: Web + Mobile",
  merge_ai_mobile: "Merge: AI + Mobile",
  web_only: "Web Development",
  mobile_only: "Mobile Development",
  game_only: "Game Development",
  ai_only: "AI Development",
};

// Types
export interface Project {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  app_icon?: string;
  category?: ProjectCategory | string;
  team_id: number | null;
  team_name?: string;
  batch?: number;
  big_idea?: string;
  frontend_demo?: string;
  repository?: string;
  is_published: boolean;
  is_best_product?: boolean;
  best_product_rank?: number | null;
  members?: TeamMember[]; // Frontend often expects this
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  active_batch: number | null;
  total_projects: number;
  published_projects: number;
  total_teams: number;
  total_mentees: number;
  best_products: number;
  totalProjects?: number;
  batchProjects?: number;
  totalTeams?: number;
  totalMentees?: number;
  bestProducts?: number;
  activeBatch?: number | null;
}

// Helper to extract array from response
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractArray = <T>(response: any): T[] => {
  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractData = <T>(response: any): T => {
  if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
    return response.data;
  }
  return response;
};

// Public API
export const getPublishedProjects = async (params?: { batch?: number; best_only?: boolean }) => {
  const res = await api.get("/api/projects", { params });
  return { data: extractArray<Project>(res.data) };
};

export const getBestProducts = async (params?: { batch?: number; limit?: number }) => {
  const res = await api.get("/api/projects/best", { params });
  return { data: extractArray<Project>(res.data) };
};

export const getProjectById = async (id: number | string) => {
  const res = await api.get(`/api/projects/${id}`);
  return { data: extractData<Project>(res.data) };
};

// Admin API
export const getAllProjects = async (batch?: number) => {
  const res = await api.get("/api/projects/all", { params: batch ? { batch } : {} });
  return { data: extractArray<Project>(res.data) };
};

export const getProjectsByActiveBatch = async () => {
  const res = await api.get("/api/projects/active-batch");
  return { data: extractArray<Project>(res.data) };
};

export const getDashboardStats = async () => {
  const res = await api.get("/api/projects/stats");
  return { data: extractData<DashboardStats>(res.data) };
};

export const createProject = async (data: FormData) => {
  const res = await api.post("/api/projects", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return { data: res.data as Project };
};

export const updateProject = async (id: number, data: FormData) => {
  const res = await api.put(`/api/projects/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return { data: res.data as Project };
};

export const deleteProject = async (id: number) => {
  const res = await api.delete(`/api/projects/${id}`);
  return { data: res.data as { message: string } };
};

export const publishProject = async (id: number, is_published: boolean) => {
  const res = await api.patch(`/api/projects/${id}/publish`, { is_published });
  return { data: res.data as Project };
};

export const setBestProduct = async (
  id: number,
  is_best_product: boolean,
  best_product_rank?: number
) => {
  const res = await api.patch(`/api/projects/${id}/best`, {
    is_best_product,
    best_product_rank,
  });
  return { data: res.data as Project };
};
