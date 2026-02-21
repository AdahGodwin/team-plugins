import type { AuthResponse, LoginPayload, RegisterPayload } from '../../types/auth.types'
import client from '../client'
import { ENDPOINTS } from '../endpoints'

export const authService = {
    login: (payload: LoginPayload) =>
        client.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, payload),

    register: (payload: RegisterPayload) =>
        client.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, payload),

    forgot: (email: string) =>
        client.post(ENDPOINTS.AUTH.FORGOT, { email }),

    logout: () =>
        client.post(ENDPOINTS.AUTH.LOGOUT),
}