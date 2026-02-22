import { X, AlertTriangle } from 'lucide-react'

interface SafetyAlertProps {
    onClose: () => void
}

export default function SafetyAlert({ onClose }: SafetyAlertProps) {
    return (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
                <p className="text-rose-700 text-sm font-bold mb-0.5">Symptom Detected</p>
                <p className="text-rose-600 text-xs leading-relaxed">
                    If this is a medical emergency, use the <strong>Emergency SOS button</strong> on your dashboard or call emergency services immediately.
                </p>
            </div>
            <button onClick={onClose} className="text-rose-400 hover:text-rose-600">
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}
