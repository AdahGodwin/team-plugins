// ─── Emergency status lifecycle ───────────────────────────────────────────────

export type EmergencyStatus = 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED'

// ─── A single notification sent as part of an SOS ────────────────────────────

export interface EmergencyNotification {
  type: 'caregiver' | 'clinic'
  recipient: string         // name of person / clinic
  contact: string           // phone or email used
  sentAt: string            // ISO timestamp
}

// ─── Full emergency record (GET /api/emergency/:id) ───────────────────────────

export interface EmergencyRecord {
  id: string
  patientId: string
  patientName: string        // firstName + lastName resolved by backend
  patientPhone?: string

  status: EmergencyStatus
  triggeredAt: string        // ISO timestamp

  // caregiver resolved by backend from patient profile
  caregiverName?: string
  caregiverPhone?: string

  // clinic resolved from patient's linked hospitalId
  clinicName?: string

  notifications: EmergencyNotification[]

  acknowledgedBy?: string    // admin / user id who acknowledged
  acknowledgedAt?: string    // ISO timestamp

  message?: string           // backend warning if caregiver/clinic missing
}

// ─── List response (GET /api/emergency — admin list) ─────────────────────────

export interface EmergencyListResponse {
  emergencies: EmergencyRecord[]
  total: number
}
