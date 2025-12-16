import api from "./axios";

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    program?: string;
    is_scrum_master: boolean;
    linkedin_url?: string;
    batch: number;
    created_at: string;
}

export interface Team {
    id: number;
    team_name: string;
    batch: number;
    project_id?: number | null;
    project_title?: string;
    member_count?: number;
    members?: TeamMember[];
    created_at: string;
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

// Public
export const getAllTeams = async (batch?: number) => {
    const res = await api.get("/api/teams", { params: batch ? { batch } : {} });
    return { data: extractArray<Team>(res.data) };
};

export const getTeamById = async (id: number) => {
    const res = await api.get(`/api/teams/${id}`);
    return { data: extractData<Team>(res.data) };
};

// Admin
export const createTeam = async (data: {
    team_name: string;
    batch: number;
    project_id?: number;
}) => {
    const res = await api.post("/api/teams", data);
    return { data: res.data as Team };
};

export const updateTeam = async (
    id: number,
    data: Partial<{
        team_name: string;
        batch: number;
        project_id: number;
    }>
) => {
    const res = await api.put(`/api/teams/${id}`, data);
    return { data: res.data as Team };
};

export const deleteTeam = async (id: number) => {
    const res = await api.delete(`/api/teams/${id}`);
    return { data: res.data as { message: string } };
};

export const addTeamMember = async (
    teamId: number,
    data: {
        name: string;
        role: string;
        is_scrum_master?: boolean;
    }
) => {
    const res = await api.post(`/api/teams/${teamId}/members`, data);
    return { data: res.data as TeamMember };
};
