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

export async function fetchPatients(
  params: FetchPatientsParams = {},
): Promise<ApiPatientListResponse> {
  const { data } = await client.get<ApiPatientListResponse>(
    '/api/admin/patients',
    { params },
  )
  return data
}

export async function fetchPatient(id: string): Promise<ApiPatient> {
  const { data } = await client.get<ApiPatient>(`/api/admin/patients/${id}`)
  return data
}

export async function patchPatient(
  id: string,
  payload: PatchPatientPayload,
): Promise<ApiPatient> {
  const { data } = await client.patch<ApiPatient>(
    `/api/admin/patients/${id}`,
    payload,
  )
  return data
}
