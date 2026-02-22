import apiClient from '../apiClient';
import type { LoginPayload, AuthResponse } from '../types';

export const authService = {
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const response = await apiClient.post('/api/auth/login', payload);
        return response.data.data;
    },
    register: async (payload: any): Promise<any> => {
        const response = await apiClient.post('/api/auth/register', payload);
        return response.data.data;
    },
    logout: () => {
        localStorage.removeItem('aegis_token');
        localStorage.removeItem('aegis_user');
    },
};
