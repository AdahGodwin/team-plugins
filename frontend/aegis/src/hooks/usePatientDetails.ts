import { useState } from 'react'
import { getPatient, updatePatient, addCaretakerMessage } from '../data/mockPatients'
import type { Patient } from '../data/mockPatients'
import { formatDate } from '../utils/dateUtils'

export function usePatientDetails(uuid: string | undefined) {
    const [renderKey, setRenderKey] = useState(0)
    const [isEditingNotes, setIsEditingNotes] = useState(false)
    const [notesInputValue, setNotesInputValue] = useState('')
    const [statusValue, setStatusValue] = useState<Patient['healthStatus']>('Stable')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const forceRefresh = () => setRenderKey((previous) => previous + 1)
    const showToast = (message: string) => setToastMessage(message)
    const dismissToast = () => setToastMessage(null)

    const patient = uuid ? getPatient(uuid) : undefined

    const handleSaveStatus = () => {
        if (!patient) return
        updatePatient(patient.uuid, { healthStatus: statusValue })
        showToast('Health status updated.')
        forceRefresh()
    }

    const handleSaveNotes = () => {
        if (!patient) return
        updatePatient(patient.uuid, { clinicalNotes: notesInputValue })
        setIsEditingNotes(false)
        showToast('Clinical notes saved.')
        forceRefresh()
    }

    const handleSendNotification = (message: string) => {
        if (!patient) return
        addCaretakerMessage(patient.uuid, 'admin', message)
        showToast('Alert sent to caretaker.')
        forceRefresh()
    }

    const handleDownloadReport = () => {
        if (!patient) return

        const generatedAt = new Date().toLocaleString('en-GB')
        const separator = '─'.repeat(40)

        const reportLines = [
            'AEGIS AI — PATIENT REPORT',
            `Generated: ${generatedAt}`,
            separator,
            `Name:           ${patient.name}`,
            `UUID:           ${patient.uuid}`,
            `Age / Gender:   ${patient.age} · ${patient.gender}`,
            `Diagnosis:      ${patient.diagnosis}`,
            `Risk Level:     ${patient.riskLevel.toUpperCase()}`,
            `Health Status:  ${patient.healthStatus}`,
            `Last Log:       ${formatDate(patient.lastLog)}`,
            '',
            'VITALS',
            `Blood Pressure: ${patient.bloodPressure} mmHg`,
            `Heart Rate:     ${patient.heartRate} bpm`,
            `O₂ Saturation:  ${patient.oxygenSat}%`,
            '',
            'MEDICATIONS',
            ...patient.medications.map((medication) => `  • ${medication}`),
            '',
            'CLINICAL NOTES',
            patient.clinicalNotes,
            '',
            'CARETAKER',
            patient.caretaker
                ? `${patient.caretaker.name} (${patient.caretaker.relation}) · ${patient.caretaker.phone}`
                : 'None assigned',
            '',
            separator,
            'Aegis AI · Confidential Medical Record',
        ]

        const blob = new Blob([reportLines.join('\n')], { type: 'text/plain' })
        const objectUrl = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = objectUrl
        anchor.download = `aegis-report-${patient.name.replace(/\s+/g, '-').toLowerCase()}.txt`
        anchor.click()
        URL.revokeObjectURL(objectUrl)
    }

    return {
        patient,
        renderKey,
        isEditingNotes,
        setIsEditingNotes,
        notesInputValue,
        setNotesInputValue,
        statusValue,
        setStatusValue,
        isModalOpen,
        setIsModalOpen,
        toastMessage,
        dismissToast,
        handleSaveStatus,
        handleSaveNotes,
        handleSendNotification,
        handleDownloadReport,
    }
}
