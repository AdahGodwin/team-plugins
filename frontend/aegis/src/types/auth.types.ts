export interface LoginPayload {
    email:    string
    password: string
}

export interface RegisterPayload {
    fullName: string
    email:    string
    password: string
}

export interface AuthResponse {
    token:   string
    user: {
        id:    string
        name:  string
        email: string
        role:  'patient' | 'admin'
    }
}