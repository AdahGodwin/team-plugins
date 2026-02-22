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
  hospitalId: string;
  consentHealth: boolean;
  consentTerms: boolean;
}

// ─── Hospital ─────────────────────────────────────────────────────────────────

export interface Hospital {
  id: string;
  name: string;
  address?: string;
}

// ─── Response Shapes ─────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  patientId?: string;   // present for patient role
  adminId?: string;     // present for admin role
  fullName: string;
  email: string;
  role: "patient" | "admin";
  // Admin-specific fields (present when role === "admin")
  title?: string;
  jobTitle?: string;
  specialty?: string;
  department?: string;
  hospitalName?: string;
  isVerified?: boolean;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
