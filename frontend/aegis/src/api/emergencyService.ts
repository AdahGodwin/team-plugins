import client from './client'
import type {
  EmergencyRecord,
  EmergencyListResponse,
} from '../types/emergency.types'

interface EmergencyListEnvelope {
  success: boolean
  data: EmergencyListResponse
}

interface EmergencyItemEnvelope {
  success: boolean
  data: EmergencyRecord
}

export async function fetchEmergencies(
  status?: string,
): Promise<EmergencyListResponse> {
  const { data } = await client.get<EmergencyListEnvelope>('/api/emergency', {
    params: status ? { status } : undefined,
  })
  return data.data
}

export async function fetchEmergency(id: string): Promise<EmergencyRecord> {
  const { data } = await client.get<EmergencyItemEnvelope>(`/api/emergency/${id}`)
  return data.data
}

export async function acknowledgeEmergency(
  id: string,
): Promise<EmergencyRecord> {
  const { data } = await client.post<EmergencyItemEnvelope>(
    `/api/emergency/${id}/acknowledge`,
  )
  return data.data
}
