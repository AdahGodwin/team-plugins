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
