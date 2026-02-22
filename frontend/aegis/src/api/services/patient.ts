import apiClient from '../apiClient';
import type { PatientProfile } from '../types';

export const patientService = {
    getProfile: async (): Promise<PatientProfile> => {
        const response = await apiClient.get('/api/patient/profile');
        return response.data.data;
    },
};
