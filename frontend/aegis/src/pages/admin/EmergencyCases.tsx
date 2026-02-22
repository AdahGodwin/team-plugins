import { Link } from 'react-router-dom'
import {
    AlertTriangle, Bell, Phone, Clock, ArrowRight, ShieldCheck,
    CheckCircle2, Loader2, RefreshCw, AlertCircle, Mail,
} from 'lucide-react'
import { useEmergencyCases } from '../../hooks/useEmergencyCases'
import { timeAgo } from '../../utils/dateUtils'
import ToastNotification from '../../components/admin/ToastNotification'
import type { EmergencyRecord } from '../../types/emergency.types'

// ── Notification sent-log pill ────────────────────────────────────────────────
function NotificationPill({ type, recipient }: { type: EmergencyRecord['notifications'][0]['type']; recipient: string }) {
    return (
        <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-2 py-0.5">
            {type === 'caregiver'
                ? <Phone className="w-3 h-3 text-emerald-500" />
                : <Mail className="w-3 h-3 text-blue-500" />}
            {recipient}
        </span>
    )
}

export default function EmergencyCases() {
    const {
        emergencies,
        loading,
        fetchError,
        selectedEmergency,
        setSelectedEmergency,
        acknowledging,
        handleAcknowledge,
        toastMessage,
        dismissToast,
        handleNotify,
        reload,
    } = useEmergencyCases()

    void selectedEmergency
    void setSelectedEmergency
    void handleNotify

    return (
        <div className="space-y-6 relative">
            {toastMessage && (
                <ToastNotification message={toastMessage} variant="alert" onDismiss={dismissToast} />
            )}

            {/* Page header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                        <h1 className="text-2xl font-extrabold text-slate-900">Emergency Cases</h1>
                    </div>
                    <p className="text-slate-500 text-sm">
                        {loading
                            ? 'Loading active SOS alerts…'
                            : `${emergencies.length} active SOS alert${emergencies.length !== 1 ? 's' : ''} requiring attention`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {emergencies.length > 0 && !loading && (
                        <span className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            {emergencies.length} Pending
                        </span>
                    )}
                    <button
                        onClick={reload}
                        disabled={loading}
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Error state */}
            {fetchError && (
                <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    <p className="text-sm text-rose-700 font-medium">{fetchError}</p>
                    <button onClick={reload} className="ml-auto text-xs font-bold text-rose-600 underline">
                        Retry
                    </button>
                </div>
            )}

            {/* Loading skeleton */}
            {loading && !fetchError && (
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse space-y-3">
                            <div className="h-4 bg-slate-100 rounded w-1/3" />
                            <div className="h-3 bg-slate-100 rounded w-2/3" />
                            <div className="h-3 bg-slate-100 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && !fetchError && emergencies.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h2 className="font-bold text-slate-800 text-base mb-2">All Clear</h2>
                    <p className="text-slate-400 text-sm max-w-xs">
                        No active SOS alerts at this time. This page auto-refreshes every 30 seconds.
                    </p>
                </div>
            )}

            {/* Emergency cards */}
            {!loading && (
                <div className="space-y-4">
                    {emergencies.map((em) => {
                        const isAcknowledging = acknowledging === em.id

                        return (
                            <div key={em.id} className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
                                {/* Alert banner */}
                                <div className="bg-rose-50 border-b border-rose-100 px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                                        <span className="text-rose-700 text-xs font-bold uppercase tracking-wide">
                                            SOS Triggered
                                        </span>
                                    </div>
                                    <span className="text-xs text-rose-400 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {timeAgo(em.triggeredAt)}
                                    </span>
                                </div>

                                <div className="p-5 space-y-4">
                                    {/* Patient identity row */}
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-11 h-11 rounded-xl bg-rose-600 flex items-center justify-center text-white font-extrabold shrink-0 text-lg">
                                                {em.patientName[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900">{em.patientName}</p>
                                                {em.patientPhone && (
                                                    <p className="text-slate-400 text-xs flex items-center gap-1">
                                                        <Phone className="w-3 h-3" /> {em.patientPhone}
                                                    </p>
                                                )}
                                                <p className="text-xs mt-0.5">
                                                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 text-xs font-semibold">
                                                        {em.status}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Clinic */}
                                        {em.clinicName && (
                                            <div className="text-xs text-slate-500 sm:text-right">
                                                <p className="font-semibold text-slate-700">{em.clinicName}</p>
                                                <p className="text-slate-400">Linked clinic</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Notifications sent by backend */}
                                    {em.notifications.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                                Notifications sent
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {em.notifications.map((n, i) => (
                                                    <NotificationPill key={i} type={n.type} recipient={n.recipient} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Backend warning if caregiver/clinic missing */}
                                    {em.message && (
                                        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                            <p className="text-xs text-amber-700 leading-relaxed">
                                                <span className="font-semibold">Note: </span>{em.message}
                                            </p>
                                        </div>
                                    )}

                                    {/* Caregiver + action row */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                                        <div>
                                            {em.caregiverName ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                        {em.caregiverName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-700">{em.caregiverName}</p>
                                                        {em.caregiverPhone && (
                                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                                <Phone className="w-3 h-3" /> {em.caregiverPhone}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-400 italic">No caregiver assigned</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleAcknowledge(em.id)}
                                                disabled={isAcknowledging}
                                                className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl hover:bg-emerald-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {isAcknowledging
                                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    : <CheckCircle2 className="w-3.5 h-3.5" />}
                                                {isAcknowledging ? 'Acknowledging…' : 'Acknowledge'}
                                            </button>
                                            <button
                                                onClick={() => setSelectedEmergency(em)}
                                                disabled={!em.caregiverName}
                                                className="flex items-center gap-1.5 text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 px-3 py-2 rounded-xl hover:bg-rose-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <Bell className="w-3.5 h-3.5" /> Notify Caregiver
                                            </button>
                                            <Link
                                                to={`/portal/patients/${em.patientId}`}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                                            >
                                                Patient Profile <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

