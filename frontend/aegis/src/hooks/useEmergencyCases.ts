import { useState } from 'react'
import { patients, addCaretakerMessage } from '../data/mockPatients'
import type { Patient } from '../data/mockPatients'

const highRiskPatients = patients.filter((patient) => patient.riskLevel === 'high')

export function useEmergencyCases() {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const [renderKey, setRenderKey] = useState(0)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const forceRefresh = () => setRenderKey((previous) => previous + 1)
    const dismissToast = () => setToastMessage(null)

    const handleNotify = (message: string) => {
        if (!selectedPatient) return

        addCaretakerMessage(selectedPatient.uuid, 'admin', message)
        setToastMessage(`Alert sent to ${selectedPatient.caretaker?.name ?? 'caretaker'}.`)
        setTimeout(dismissToast, 3000)
        forceRefresh()
    }

    return {
        highRiskPatients,
        renderKey,
        selectedPatient,
        setSelectedPatient,
        toastMessage,
        dismissToast,
        handleNotify,
    }
}
