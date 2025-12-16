import api from "./axios";

export type MenteeRole =
    | "hustler"      // PM with crown
    | "hacker"
    | "hipster"
    | "design_researcher"
    | "data_engineer"
    | "ml_engineer"
    | "ml_ops"
    | "game_designer"
    | "game_artist"
    | "game_programmer"
    | "scrum_master";  // SM badge (not crown)

export type MenteeProgram =
    | "web_uiux"           // Web Development and UI/UX Design
    | "mobile_uiux"        // Mobile Development and UI/UX Design
    | "mobile_flutter"     // Mobile Development with Flutter and UI/UX Design
    | "ai_development"     // AI Development
    | "game_development"   // Game Development
    | "ibm_aai"           // IBM Academy - AAI
    | "ibm_hcrh"          // IBM Academy - HCRH
    | "comp_net_sec";     // Computer and Network Security

export const programLabels: Record<MenteeProgram, string> = {
    web_uiux: "Web Development and UI/UX Design",
    mobile_uiux: "Mobile Development and UI/UX Design",
    mobile_flutter: "Mobile Development with Flutter and UI/UX Design",
    ai_development: "AI Development",
    game_development: "Game Development",
    ibm_aai: "IBM Academy - AAI",
    ibm_hcrh: "IBM Academy - HCRH",
    comp_net_sec: "Computer and Network Security",
};

export const allPrograms: MenteeProgram[] = [
    "web_uiux",
    "mobile_uiux",
    "mobile_flutter",
    "ai_development",
    "game_development",
    "ibm_aai",
    "ibm_hcrh",
    "comp_net_sec",
];

export interface Mentee {
    id: number;
    name: string;
    batch: number;
    team_id: number | null;
    team_name?: string;
    role: MenteeRole;
    program?: MenteeProgram;
    is_scrum_master: boolean;
    linkedin_url?: string;  // Optional LinkedIn URL
    created_at: string;
}

// Helper to extract array from response
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractArray = <T>(response: any): T[] => {
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    return [];
};

// Public
export const getAllMentees = async (params?: {
    batch?: number;
    team_id?: number;
    search?: string;
}) => {
    const res = await api.get("/api/mentees", { params });
    return { data: extractArray<Mentee>(res.data) };
};

export const getMenteeById = async (id: number) => {
    const res = await api.get(`/api/mentees/${id}`);
    return { data: res.data as Mentee };
};

// Admin
export const createMentee = async (data: {
    name: string;
    batch: number;
    team_id?: number;
    role?: MenteeRole;
    program?: MenteeProgram;
    is_scrum_master?: boolean;
    linkedin_url?: string;
}) => {
    const res = await api.post("/api/mentees", data);
    return { data: res.data as Mentee };
};

export const updateMentee = async (
    id: number,
    data: Partial<{
        name: string;
        batch: number;
        team_id: number;
        role: MenteeRole;
        program: MenteeProgram;
        is_scrum_master: boolean;
        linkedin_url: string;
    }>
) => {
    const res = await api.put(`/api/mentees/${id}`, data);
    return { data: res.data as Mentee };
};

export const deleteMentee = async (id: number) => {
    const res = await api.delete(`/api/mentees/${id}`);
    return { data: res.data as { message: string } };
};

// Bulk delete mentees
export const bulkDeleteMentees = async (ids: number[]) => {
    const res = await api.delete("/api/mentees/bulk", { data: { ids } });
    return { data: res.data as { message: string; deletedCount: number } };
};

export const bulkUpdateMentees = async (
    mentees: Array<{
        id: number;
        name?: string;
        batch?: number;
        team_id?: number;
        role?: MenteeRole;
        program?: MenteeProgram;
        is_scrum_master?: boolean;
        linkedin_url?: string;
    }>
) => {
    const res = await api.patch("/api/mentees/bulk", { mentees });
    return { data: extractArray<Mentee>(res.data) };
};

// Role display helpers - Updated roles for all programs
export const roleLabels: Record<MenteeRole, string> = {
    hustler: "Hustler / PM",
    hacker: "Hacker",
    hipster: "Hipster",
    design_researcher: "Design Researcher",
    data_engineer: "Data Engineer",
    ml_engineer: "ML Engineer",
    ml_ops: "ML Ops",
    game_designer: "Game Designer",
    game_artist: "Game Artist",
    game_programmer: "Game Programmer",
    scrum_master: "Scrum Master",
};

// All available roles
export const allRoles: MenteeRole[] = [
    "hustler",
    "hacker",
    "hipster",
    "design_researcher",
    "data_engineer",
    "ml_engineer",
    "ml_ops",
    "game_designer",
    "game_artist",
    "game_programmer",
    "scrum_master",
];
