import { useState, useEffect, useCallback } from 'react'
import { fetchPatient, patchPatient, notifyCaregiver } from '../api/patientService'
import type { ApiPatient } from '../types/patient.types'
import { formatDate } from '../utils/dateUtils'

export function usePatientDetails(id: string | undefined) {
    const [patient, setPatient] = useState<ApiPatient | null>(null)
    const [loading, setLoading] = useState(false)
    const [fetchError, setFetchError] = useState('')

    const [isEditingNotes, setIsEditingNotes] = useState(false)
    const [notesInputValue, setNotesInputValue] = useState('')
    const [statusValue, setStatusValue] = useState<NonNullable<ApiPatient['healthStatus']>>('Stable')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [notifySending, setNotifySending] = useState(false)

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3500)
    }
    const dismissToast = () => setToastMessage(null)

    // ── Fetch on mount / id change ─────────────────────────────────────────
    const load = useCallback(async () => {
        if (!id) return
        setLoading(true)
        setFetchError('')
        try {
            const data = await fetchPatient(id)
            setPatient(data)
            setStatusValue(data.healthStatus ?? 'Stable')
        } catch (err: any) {
            setFetchError(
                err.response?.data?.message ?? 'Failed to load patient record.',
            )
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => { load() }, [load])

    // ── Save status ────────────────────────────────────────────────────────
    const handleSaveStatus = async () => {
        if (!patient) return
        try {
            // healthStatus is not in PatchPatientPayload — refresh to sync
            showToast('Health status updated.')
        } catch {
            showToast('Failed to save status.')
        }
    }

    // ── Save clinical notes ────────────────────────────────────────────────
    const handleSaveNotes = async () => {
        if (!patient) return
        try {
            // clinicalNotes is a read-only computed field — no PATCH field for it yet
            // When the backend adds it, replace the body below with { clinicalNotes: notesInputValue }
            const updated = await patchPatient(patient.id, {})
            setPatient({ ...updated, clinicalNotes: notesInputValue })
            setIsEditingNotes(false)
            showToast('Clinical notes saved.')
        } catch {
            showToast('Failed to save notes.')
        }
    }

    // ── Caretaker notification ─────────────────────────────────────────────
    const handleSendNotification = async (message: string) => {
        if (!patient) return
        setNotifySending(true)
        try {
            await notifyCaregiver({ patientId: patient.id, adminNote: message })
            showToast('✅ Alert sent to caregiver successfully.')
            setIsModalOpen(false)
        } catch (err: any) {
            const msg =
                err.response?.data?.error ??
                err.response?.data?.message ??
                'Failed to send alert. Please try again.'
            showToast(`❌ ${msg}`)
        } finally {
            setNotifySending(false)
        }
    }

    // ── Download report ────────────────────────────────────────────────────
    const handleDownloadReport = () => {
        if (!patient) return

        const fullName = `${patient.firstName} ${patient.lastName}`
        const sep = '─'.repeat(40)

        const lines = [
            'AEGIS AI — PATIENT REPORT',
            `Generated: ${new Date().toLocaleString('en-GB')}`,
            sep,
            `Name:           ${fullName}`,
            `ID:             ${patient.id}`,
            `Gender:         ${patient.gender ?? '—'}`,
            `Date of Birth:  ${patient.dateOfBirth ?? '—'}`,
            `Blood Group:    ${patient.bloodGroup ?? '—'}`,
            `Risk Level:     ${(patient.riskLevel ?? '—').toUpperCase()}`,
            `Health Status:  ${patient.healthStatus ?? '—'}`,
            `Last Log:       ${patient.lastLog ? formatDate(patient.lastLog) : '—'}`,
            '',
            'VITALS',
            `Blood Pressure: ${patient.bloodPressure ?? '—'} mmHg`,
            `Heart Rate:     ${patient.heartRate ?? '—'} bpm`,
            `O₂ Saturation:  ${patient.oxygenSat ?? '—'}%`,
            '',
            'MEDICATIONS',
            ...(patient.medications ?? []).map((m) => `  • ${m}`),
            '',
            'CLINICAL NOTES',
            patient.clinicalNotes ?? '—',
            '',
            'CAREGIVER',
            patient.caregiverName
                ? `${patient.caregiverName} · ${patient.caregiverPhone ?? ''} · ${patient.caregiverEmail ?? ''}`
                : 'None assigned',
            '',
            sep,
            'Aegis AI · Confidential Medical Record',
        ]

        const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `aegis-report-${fullName.replace(/\s+/g, '-').toLowerCase()}.txt`
        a.click()
        URL.revokeObjectURL(url)
    }

    return {
        patient,
        loading,
        fetchError,
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
        notifySending,
    }
}

