import { useState, useEffect } from 'react'
import { Phone, AlertTriangle, CheckCircle2 } from 'lucide-react'

const SOSButton = () => {
    const [showConfirm, setShowConfirm] = useState(false)
    const [sent,        setSent]        = useState(false)
    const [loading,     setLoading]     = useState(false)
    const [countdown,   setCountdown]   = useState(5)

    useEffect(() => {
        if (!showConfirm || sent) return
        if (countdown === 0) { handleConfirm(); return }
        const t = setTimeout(() => setCountdown(c => c - 1), 1000)
        return () => clearTimeout(t)
    }, [showConfirm, countdown, sent])

    const handleConfirm = () => {
        setLoading(true)
        setTimeout(() => { setLoading(false); setSent(true); setShowConfirm(false) }, 1500)
    }

    const openConfirm = () => { setShowConfirm(true); setCountdown(5) }

    return (
        <>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <Phone className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Emergency Alert</h2>
                        <p className="text-slate-500 text-xs">Instantly alerts your caregiver & clinic</p>
                    </div>
                </div>

                {sent ? (
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 bg-white border border-teal-200 rounded-2xl p-4">
                            <CheckCircle2 className="w-6 h-6 text-teal-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-slate-900 font-bold text-sm">Alert sent successfully.</p>
                                <p className="text-slate-500 text-xs mt-0.5">Sarah & Dr. Okafor's clinic have been notified.</p>
                            </div>
                        </div>
                        <button onClick={() => setSent(false)} className="w-full text-xs text-rose-500 font-semibold py-2 hover:underline">
                            Reset (testing only)
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={openConfirm}
                        className="w-full flex flex-col bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white font-extrabold text-[15px] py-5 rounded-2xl transition-all shadow-lg items-center justify-center gap-3 ring-4 ring-rose-200"
                    >
                        <AlertTriangle className="w-10 h-10" />
                        EMERGENCY — Send Alert
                    </button>
                )}
            </div>

            {/* Confirm modal */}
            {showConfirm && !sent && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200">
                        <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mb-5 mx-auto relative">
                            <AlertTriangle className="w-8 h-8 text-rose-500" />
                            {!loading && (
                                <span className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 text-white rounded-full text-xs font-extrabold flex items-center justify-center">
                                    {countdown}
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 text-center mb-2">Send Emergency Alert?</h3>
                        <p className="text-slate-500 text-sm text-center leading-relaxed mb-2">
                            This will immediately notify <strong>Sarah</strong> and <strong>Dr. Okafor's clinic</strong>.
                        </p>
                        <p className="text-rose-500 text-xs text-center font-medium mb-7">
                            Auto-sending in {countdown}s unless cancelled
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleConfirm} disabled={loading}
                                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md"
                            >
                                {loading
                                    ? <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    : <><AlertTriangle className="w-5 h-5" /> Send Now</>
                                }
                            </button>
                            <button
                                onClick={() => { setShowConfirm(false); setCountdown(5) }}
                                className="w-full bg-white border border-slate-200 text-slate-600 font-semibold py-4 rounded-2xl hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SOSButton