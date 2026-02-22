import { useState, useEffect, useCallback, useRef } from 'react'
import {
    fetchEmergencies,
    acknowledgeEmergency,
} from '../api/emergencyService'
import type { EmergencyRecord } from '../types/emergency.types'

const POLL_INTERVAL_MS = 30_000

export function useEmergencyCases() {
    const [emergencies, setEmergencies] = useState<EmergencyRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)

    const [selectedEmergency, setSelectedEmergency] = useState<EmergencyRecord | null>(null)
    const [acknowledging, setAcknowledging] = useState<string | null>(null) // id being acknowledged
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const dismissToast = useCallback(() => setToastMessage(null), [])

    const showToast = useCallback((msg: string) => {
        setToastMessage(msg)
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
        toastTimerRef.current = setTimeout(dismissToast, 4000)
    }, [dismissToast])

    // ── Fetch all pending emergencies ─────────────────────────────────────────
    const loadEmergencies = useCallback(async () => {
        try {
            const res = await fetchEmergencies('PENDING')
            setEmergencies(res.emergencies)
            setFetchError(null)
        } catch {
            setFetchError('Failed to load emergency cases. Retrying…')
        } finally {
            setLoading(false)
        }
    }, [])

    // Initial load + polling
    useEffect(() => {
        loadEmergencies()
        const timer = setInterval(loadEmergencies, POLL_INTERVAL_MS)
        return () => {
            clearInterval(timer)
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
        }
    }, [loadEmergencies])

    // ── Acknowledge an emergency ──────────────────────────────────────────────
    const handleAcknowledge = useCallback(async (id: string) => {
        setAcknowledging(id)
        try {
            const updated = await acknowledgeEmergency(id)
            // Remove from the pending list and show toast
            setEmergencies((prev) => prev.filter((e) => e.id !== updated.id))
            showToast(`Emergency for ${updated.patientName} marked as acknowledged.`)
        } catch {
            showToast('Failed to acknowledge — please try again.')
        } finally {
            setAcknowledging(null)
        }
    }, [showToast])

    // ── Notify caregiver (informational — notifications are sent by the backend
    //    at SOS trigger time; this hook just shows the modal as a manual follow-up)
    const handleNotify = useCallback((message: string) => {
        if (!selectedEmergency) return
        showToast(`Follow-up alert queued for ${selectedEmergency.caregiverName ?? 'caregiver'}: "${message.slice(0, 60)}…"`)
        setSelectedEmergency(null)
    }, [selectedEmergency, showToast])

    // Pending-only subset (PENDING comes from backend filter, but guard here too)
    const pendingEmergencies = emergencies.filter((e) => e.status === 'PENDING')

    return {
        emergencies: pendingEmergencies,
        loading,
        fetchError,
        selectedEmergency,
        setSelectedEmergency,
        acknowledging,
        handleAcknowledge,
        toastMessage,
        dismissToast,
        handleNotify,
        reload: loadEmergencies,
    }
}
