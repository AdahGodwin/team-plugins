import { useState } from 'react'
import { getPatient, updatePatient } from '../data/mockPatients'
import type { Patient, RiskLevel } from '../data/mockPatients'

export function useUpdateClinicalRecord() {
    const [uuidInput, setUuidInput] = useState('')
    const [patient, setPatient] = useState<Patient | null>(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [isSaved, setIsSaved] = useState(false)

    // Form fields
    const [bloodPressure, setBloodPressure] = useState('')
    const [heartRate, setHeartRate] = useState('')
    const [oxygenSat, setOxygenSat] = useState('')
    const [medications, setMedications] = useState('')
    const [clinicalNotes, setClinicalNotes] = useState('')
    const [riskLevel, setRiskLevel] = useState<RiskLevel>('low')
    const [healthStatus, setHealthStatus] = useState<Patient['healthStatus']>('Stable')

    const handleLoadRecord = () => {
        setErrorMessage('')
        setIsSaved(false)

        const found = getPatient(uuidInput.trim())
        if (!found) {
            setPatient(null)
            setErrorMessage(`No patient found for UUID "${uuidInput.trim()}".`)
            return
        }

        setPatient(found)
        setBloodPressure(found.bloodPressure)
        setHeartRate(String(found.heartRate))
        setOxygenSat(String(found.oxygenSat))
        setMedications(found.medications.join(', '))
        setClinicalNotes(found.clinicalNotes)
        setRiskLevel(found.riskLevel)
        setHealthStatus(found.healthStatus)
    }

    const handleSaveChanges = () => {
        if (!patient) return

        updatePatient(patient.uuid, {
            bloodPressure,
            heartRate: parseInt(heartRate) || patient.heartRate,
            oxygenSat: parseInt(oxygenSat) || patient.oxygenSat,
            medications: medications.split(',').map((med) => med.trim()).filter(Boolean),
            clinicalNotes,
            riskLevel,
            healthStatus,
        })

        setIsSaved(true)
    }

    return {
        // UUID lookup
        uuidInput,
        setUuidInput,
        errorMessage,
        setErrorMessage,
        handleLoadRecord,
        // Loaded patient
        patient,
        // Form fields + setters
        bloodPressure, setBloodPressure,
        heartRate, setHeartRate,
        oxygenSat, setOxygenSat,
        medications, setMedications,
        clinicalNotes, setClinicalNotes,
        riskLevel, setRiskLevel,
        healthStatus, setHealthStatus,
        // Save
        isSaved,
        handleSaveChanges,
    }
}
