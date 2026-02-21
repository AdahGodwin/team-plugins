import { useState, useEffect, useCallback } from 'react'
import { notifService } from '../api/services/notifService'
import type { Notif } from '../components/patient/notifications/notifTypes'

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notif[]>([])
    const [loading,       setLoading]       = useState(true)
    const [error,         setError]         = useState<string | null>(null)

    const fetch = useCallback(async () => {
        try {
            setLoading(true)
            const res = await notifService.getAll()
            setNotifications(res.data)
        } catch (e) {
            setError('Failed to load notifications')
        } finally {
            setLoading(false)
        }
    }, [])

    const markRead = async (id: number) => {
        // Optimistic update
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
        try {
            await notifService.markRead(id)
        } catch {
            // Rollback on failure
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: false } : n)
            )
        }
    }

    const dismiss = async (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
        try {
            await notifService.dismiss(id)
        } catch {
            fetch() // refetch on failure
        }
    }

    useEffect(() => { fetch() }, [fetch])

    return { notifications, loading, error, markRead, dismiss, refetch: fetch }
}