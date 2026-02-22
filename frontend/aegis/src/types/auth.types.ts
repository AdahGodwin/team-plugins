// ─── Request Payloads ────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  kinName?: string;
  kinPhone?: string;
  kinEmail?: string;
  consentHealth: boolean;
  consentTerms: boolean;
}

// ─── Response Shapes ─────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  patientId: string;
  fullName: string;
  email: string;
  role: "patient" | "admin";
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
