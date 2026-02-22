import { Link } from 'react-router-dom'
import { AlertTriangle, Bell, Phone, Clock, ArrowRight, ShieldCheck } from 'lucide-react'
import { useEmergencyCases } from '../../hooks/useEmergencyCases'
import { timeAgo } from '../../utils/dateUtils'
import RiskBadge from '../../components/admin/RiskBadge'
import NotifyCaretakerModal from '../../components/admin/NotifyCaretakerModal'
import ToastNotification from '../../components/admin/ToastNotification'

const vitalLabels = ['BP', 'HR', 'O₂'] as const

export default function EmergencyCases() {
    const {
        highRiskPatients,
        renderKey,
        selectedPatient,
        setSelectedPatient,
        toastMessage,
        dismissToast,
        handleNotify,
    } = useEmergencyCases()

    void renderKey

    return (
        <div className="space-y-6 relative">
            {toastMessage && (
                <ToastNotification message={toastMessage} variant="alert" onDismiss={dismissToast} />
            )}

            {selectedPatient && (
                <NotifyCaretakerModal
                    patient={selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                    onSend={handleNotify}
                />
            )}

            {/* Page header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                        <h1 className="text-2xl font-extrabold text-slate-900">Emergency Cases</h1>
                    </div>
                    <p className="text-slate-500 text-sm">
                        {highRiskPatients.length} high-risk patient{highRiskPatients.length !== 1 ? 's' : ''} requiring immediate attention
                    </p>
                </div>
                {highRiskPatients.length > 0 && (
                    <span className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        {highRiskPatients.length} Active Alerts
                    </span>
                )}
            </div>

            {/* Empty state */}
            {highRiskPatients.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h2 className="font-bold text-slate-800 text-base mb-2">All Clear</h2>
                    <p className="text-slate-400 text-sm max-w-xs">
                        No high-risk patients at this time. Aegis AI will flag critical cases here as they arise.
                    </p>
                </div>
            )}

            {/* Case cards */}
            <div className="space-y-4">
                {highRiskPatients.map((patient) => {
                    const vitalsSnapshot = [
                        { label: vitalLabels[0], value: patient.bloodPressure },
                        { label: vitalLabels[1], value: `${patient.heartRate} bpm` },
                        { label: vitalLabels[2], value: `${patient.oxygenSat}%` },
                    ]

                    return (
                        <div key={patient.uuid} className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
                            {/* Alert banner */}
                            <div className="bg-rose-50 border-b border-rose-100 px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                                    <span className="text-rose-700 text-xs font-bold uppercase tracking-wide">High Risk Alert</span>
                                </div>
                                {patient.lastEscalation && (
                                    <span className="text-xs text-rose-400 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" /> Last escalation: {timeAgo(patient.lastEscalation)}
                                    </span>
                                )}
                            </div>

                            <div className="p-5">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    {/* Patient info */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-11 h-11 rounded-xl bg-rose-600 flex items-center justify-center text-white font-extrabold shrink-0">
                                            {patient.name[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                                <p className="font-bold text-slate-900">{patient.name}</p>
                                                <RiskBadge level={patient.riskLevel} pulse />
                                            </div>
                                            <p className="text-slate-500 text-xs">{patient.diagnosis}</p>
                                            <p className="text-slate-400 text-xs">
                                                {patient.age} · {patient.gender} · Health:{' '}
                                                <span className="font-semibold text-rose-500">{patient.healthStatus}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Vitals snapshot — compact on mobile */}
                                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 text-center text-xs sm:shrink-0">
                                        {vitalsSnapshot.map(({ label, value }) => (
                                            <div key={label} className="bg-slate-50 rounded-xl px-2 sm:px-3 py-2 border border-slate-100">
                                                <p className="text-slate-400 mb-0.5">{label}</p>
                                                <p className="font-bold text-slate-800 text-xs">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Caretaker + actions */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
                                    <div>
                                        {patient.caretaker ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                    {patient.caretaker.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-700">
                                                        {patient.caretaker.name}
                                                        <span className="font-normal text-slate-400"> · {patient.caretaker.relation}</span>
                                                    </p>
                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Phone className="w-3 h-3" /> {patient.caretaker.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">No caretaker assigned</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedPatient(patient)}
                                            disabled={!patient.caretaker}
                                            className="flex items-center gap-1.5 text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 px-3 py-2 rounded-xl hover:bg-rose-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Bell className="w-3.5 h-3.5" /> Notify Caretaker
                                        </button>
                                        <Link
                                            to={`/portal/patients/${patient.uuid}`}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
                                        >
                                            View Details <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Clinical note snippet */}
                                <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        <span className="font-semibold">Clinical note: </span>
                                        {patient.clinicalNotes.slice(0, 140)}…
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
