import { useEffect } from 'react'
import { Check, Bell } from 'lucide-react'

interface ToastNotificationProps {
    message: string
    variant?: 'success' | 'alert'
    onDismiss: () => void
    durationMs?: number
}

export default function ToastNotification({
    message,
    variant = 'success',
    onDismiss,
    durationMs = 3000,
}: ToastNotificationProps) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, durationMs)
        return () => clearTimeout(timer)
    }, [message, onDismiss, durationMs])

    const Icon = variant === 'alert' ? Bell : Check
    const iconColor = variant === 'alert' ? 'text-amber-400' : 'text-teal-400'

    return (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in">
            <Icon className={`w-4 h-4 ${iconColor}`} />
            {message}
        </div>
    )
}
