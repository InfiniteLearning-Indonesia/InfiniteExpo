import api from "./axios";

export const getPublishedProjects = () => api.get("/api/projects");

export const getAllProjects = () => api.get("/api/projects/all");

export const createProject = (data: FormData) =>
  api.post("/api/projects", data);

export const publishProject = (id: number) =>
  api.patch(`/api/projects/${id}/publish`);
