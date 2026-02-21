import axios from 'axios'

const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
})

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('aegis-token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

client.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('aegis-token')
            window.location.href = '/auth/login'
        }
        return Promise.reject(err)
    }
)

export default client