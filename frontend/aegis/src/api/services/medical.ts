import apiClient from '../apiClient';
import type { VitalsPayload, VitalsSubmitResponse, VitalsHistoryEntry } from '../types';

export const medicalService = {
    submitVitals: async (payload: VitalsPayload): Promise<VitalsSubmitResponse> => {
        const response = await apiClient.post('/api/vitals', payload);
        return response.data.data;
    },
    getVitalsHistory: async (days = 30): Promise<VitalsHistoryEntry[]> => {
        const response = await apiClient.get(`/api/vitals?days=${days}`);
        return response.data.data ?? [];
    },
};
