import { useEffect, useRef, useState } from 'react'
import { X, Bell, Send, Loader2 } from 'lucide-react'
import type { ApiPatient } from '../../types/patient.types'

interface NotifyCaretakerModalProps {
    patient: ApiPatient
    onClose: () => void
    onSend: (message: string) => Promise<void>
}

export default function NotifyCaretakerModal({ patient, onClose, onSend }: NotifyCaretakerModalProps) {
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const backdropRef = useRef<HTMLDivElement>(null)
    const fullName = `${patient.firstName} ${patient.lastName}`

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !sending) onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose, sending])

    const handleSend = async () => {
        setSending(true)
        try {
            await onSend(message.trim())
        } finally {
            setSending(false)
        }
    }

    return (
        <div
            ref={backdropRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === backdropRef.current && !sending) onClose() }}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-in">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                            <Bell className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Notify Caregiver</h3>
                            <p className="text-slate-500 text-xs">Alerting caregiver for {fullName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} disabled={sending} className="text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Caregiver info */}
                {patient.caregiverName ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {patient.caregiverName[0]}
                        </div>
                        <div>
                            <p className="text-slate-800 font-semibold text-sm">{patient.caregiverName}</p>
                            <p className="text-slate-500 text-xs">
                                {[patient.caregiverPhone, patient.caregiverEmail].filter(Boolean).join(' · ')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-amber-700 text-sm">
                        No caregiver assigned to this patient.
                    </div>
                )}

                {/* Default alert preview */}
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 text-rose-700 text-xs">
                    Default alert: <span className="font-semibold">"{fullName}'s risk level is HIGH. Please check in immediately."</span>
                </div>

                {/* Optional message */}
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                    Additional message <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Add specific instructions or context for the caregiver…"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 resize-none transition-all mb-5"
                />

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={sending}
                        className="flex-1 border border-slate-200 text-slate-600 font-semibold text-sm py-3 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={!patient.caregiverName || !patient.caregiverEmail || sending}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold text-sm py-3 rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                        {sending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending…
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Send Alert
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
