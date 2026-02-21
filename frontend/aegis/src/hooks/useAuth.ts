import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../api/services/authService'
import type { LoginPayload } from '../types/auth.types'

export function useAuth() {
    const navigate              = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState<string | null>(null)

    const login = async (payload: LoginPayload) => {
        try {
            setLoading(true)
            setError(null)
            const res = await authService.login(payload)
            localStorage.setItem('aegis-token', res.data.token)
            navigate('/patient/dashboard')
        } catch (e: any) {
            setError(e.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        await authService.logout()
        localStorage.removeItem('aegis-token')
        navigate('/auth/login')
    }

    return { login, logout, loading, error }
}