import type { VitalsPayload } from '../../types/patient.types'
import client from '../client'
import { ENDPOINTS } from '../endpoints'

export const patientService = {
    getProfile: () =>
        client.get(ENDPOINTS.PATIENT.PROFILE),

    getVitals: () =>
        client.get(ENDPOINTS.PATIENT.VITALS),

    logVitals: (payload: VitalsPayload) =>
        client.post(ENDPOINTS.PATIENT.VITALS_LOG, payload),

    getRisk: () =>
        client.get(ENDPOINTS.PATIENT.RISK),
}