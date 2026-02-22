import client from './client'
import type {
  ApiPatient,
  ApiPatientListResponse,
  PatchPatientPayload,
} from '../types/patient.types'
import type { DashboardData, DashboardResponse } from '../types/dashboard.types'

export async function fetchDashboard(): Promise<DashboardData> {
  const { data } = await client.get<DashboardResponse>('/api/admin/dashboard')
  return data.data
}

export interface FetchPatientsParams {
  search?: string
  page?: number
  limit?: number
}

interface ApiListEnvelope {
  success: boolean
  data: ApiPatientListResponse
}

export async function fetchPatients(
  params: FetchPatientsParams = {},
): Promise<ApiPatientListResponse> {
  const { data } = await client.get<ApiListEnvelope>(
    '/api/admin/patients',
    { params },
  )
  return data.data
}

interface ApiItemEnvelope {
  success: boolean
  data: ApiPatient
}

export async function fetchPatient(id: string): Promise<ApiPatient> {
  const { data } = await client.get<ApiItemEnvelope>(`/api/admin/patients/${id}`)
  return data.data
}

export async function patchPatient(
  id: string,
  payload: PatchPatientPayload,
): Promise<ApiPatient> {
  const { data } = await client.patch<ApiItemEnvelope>(
    `/api/admin/patients/${id}`,
    payload,
  )
  return data.data
}

// ── Notify caregiver ──────────────────────────────────────────────────────────

export interface NotifyCaregiverPayload {
  patientId: string
  adminNote?: string
}

interface NotifyCaregiverResult {
  sent: boolean
  to: string
  caregiverName: string
  patientName: string
}

interface NotifyEnvelope {
  success: boolean
  data: NotifyCaregiverResult
}

export async function notifyCaregiver(
  payload: NotifyCaregiverPayload,
): Promise<NotifyCaregiverResult> {
  const { data } = await client.post<NotifyEnvelope>('/api/notify/caregiver', payload)
  return data.data
}

// ── Daily reminder broadcast ──────────────────────────────────────────────────

export interface DailyReminderResult {
  sent: number
  failed: number
  total: number
  message: string
}

interface DailyReminderEnvelope {
  success: boolean
  data: DailyReminderResult
}

export async function sendDailyReminders(): Promise<DailyReminderResult> {
  const { data } = await client.post<DailyReminderEnvelope>('/api/admin/notify-all')
  return data.data
}
