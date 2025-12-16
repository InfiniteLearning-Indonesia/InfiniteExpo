import api from "./axios";

export interface Batch {
    id: number;
    batch_number: number;
    name: string;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface BatchStats {
    batch_number: number;
    projects: number;
    teams: number;
    mentees: number;
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
export const getActiveBatch = async () => {
    const res = await api.get("/api/batches/active");
    return { data: extractData<Batch>(res.data) };
};

// Admin
export const getAllBatches = async () => {
    const res = await api.get("/api/batches");
    return { data: extractArray<Batch>(res.data) };
};

export const getBatchById = async (id: number) => {
    const res = await api.get(`/api/batches/${id}`);
    return { data: extractData<Batch>(res.data) };
};

export const getBatchStats = async (id: number) => {
    const res = await api.get(`/api/batches/${id}/stats`);
    return { data: extractData<BatchStats>(res.data) };
};

export const createBatch = async (data: {
    batch_number: number;
    name?: string;
    start_date?: string;
    end_date?: string;
}) => {
    const res = await api.post("/api/batches", data);
    return { data: res.data as Batch };
};

export const updateBatch = async (
    id: number,
    data: Partial<{
        batch_number: number;
        name: string;
        start_date: string;
        end_date: string;
    }>
) => {
    const res = await api.put(`/api/batches/${id}`, data);
    return { data: res.data as Batch };
};

export const activateBatch = async (id: number) => {
    const res = await api.patch(`/api/batches/${id}/activate`);
    return { data: res.data as Batch };
};

export const deactivateBatch = async (id: number) => {
    const res = await api.patch(`/api/batches/${id}/deactivate`);
    return { data: res.data as Batch };
};

export const deleteBatch = async (id: number) => {
    const res = await api.delete(`/api/batches/${id}`);
    return { data: res.data as { message: string } };
};
