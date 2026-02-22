// ─── Shared ───────────────────────────────────────────────────────────────────

export type RiskLevel = 'low' | 'moderate' | 'high'

export interface Caregiver {
  name: string
  phone?: string
  email?: string
  relation?: string
}

// ─── Patient returned by GET /api/admin/patients/:id ─────────────────────────

export interface ApiPatient {
  // identity (from User document)
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string

  // profile (from Patient document)
  gender?: string
  dateOfBirth?: string        // ISO date string "YYYY-MM-DD"
  bloodGroup?: string
  allergies?: string[]
  smokingStatus?: 'never' | 'former' | 'current'
  diabetic?: boolean
  weight?: number
  height?: number
  address?: string

  // caregiver
  caregiverName?: string
  caregiverPhone?: string
  caregiverEmail?: string

  // clinical / monitoring
  riskLevel?: RiskLevel
  bloodPressure?: string
  heartRate?: number
  oxygenSat?: number
  healthStatus?: 'Stable' | 'Monitoring' | 'Critical'
  clinicalNotes?: string
  medications?: string[]
  lastLog?: string
}

// ─── List response from GET /api/admin/patients ───────────────────────────────

export interface ApiPatientListResponse {
  patients: ApiPatient[]
  total: number
  page: number
  limit: number
}

// ─── PATCH /api/admin/patients/:id request body ───────────────────────────────

export interface PatchPatientPayload {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  gender?: string
  dateOfBirth?: string
  address?: string
  bloodGroup?: string
  allergies?: string[]
  smokingStatus?: 'never' | 'former' | 'current'
  diabetic?: boolean
  weight?: number
  height?: number
  caregiverName?: string
  caregiverPhone?: string
  caregiverEmail?: string
}
