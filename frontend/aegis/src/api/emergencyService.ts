import client from './client'
import type {
  EmergencyRecord,
  EmergencyListResponse,
} from '../types/emergency.types'


export async function fetchEmergencies(
  status?: string,
): Promise<EmergencyListResponse> {
  const { data } = await client.get<EmergencyListResponse>('/api/emergency', {
    params: status ? { status } : undefined,
  })
  return data
}

export async function fetchEmergency(id: string): Promise<EmergencyRecord> {
  const { data } = await client.get<EmergencyRecord>(`/api/emergency/${id}`)
  return data
}

export async function acknowledgeEmergency(
  id: string,
): Promise<EmergencyRecord> {
  const { data } = await client.post<EmergencyRecord>(
    `/api/emergency/${id}/acknowledge`,
  )
  return data
}
