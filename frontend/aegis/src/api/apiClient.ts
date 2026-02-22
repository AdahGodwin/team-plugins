import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
    // Auth tokens are stored in cookies (aegis-token) by the new auth system
    const token = Cookies.get('aegis-token') ?? localStorage.getItem('aegis_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
