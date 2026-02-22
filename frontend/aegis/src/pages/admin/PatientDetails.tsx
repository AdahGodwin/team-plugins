import { useParams, Link, useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Download, Bell, Edit2, Check, X,
    Heart, Activity, Wind, MessageSquare, UserX, FileText, Loader2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { usePatientDetails } from '../../hooks/usePatientDetails'
import NotifyCaretakerModal from '../../components/admin/NotifyCaretakerModal'
import PatientHeaderCard from '../../components/admin/PatientHeaderCard'
import ToastNotification from '../../components/admin/ToastNotification'
import type { ApiPatient } from '../../types/patient.types'

interface VitalItem {
    Icon: LucideIcon
    label: string
    iconColor: string
    iconBackground: string
    value: string
}

const healthStatusOptions = [
    { value: 'Stable', label: 'Stable' },
    { value: 'Monitoring', label: 'Monitoring' },
    { value: 'Critical', label: 'Critical' },
]

function buildVitals(p: ApiPatient): VitalItem[] {
    return [
        { Icon: Activity, label: 'Blood Pressure', value: p.bloodPressure ? `${p.bloodPressure} mmHg` : '—', iconColor: 'text-emerald-500', iconBackground: 'bg-emerald-50' },
        { Icon: Heart, label: 'Heart Rate', value: p.heartRate ? `${p.heartRate} bpm` : '—', iconColor: 'text-rose-500', iconBackground: 'bg-rose-50' },
        { Icon: Wind, label: 'O₂ Saturation', value: p.oxygenSat ? `${p.oxygenSat}%` : '—', iconColor: 'text-emerald-500', iconBackground: 'bg-emerald-50' },
    ]
}

export default function PatientDetails() {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const {
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
    } = usePatientDetails(uuid)

    // ── Loading ────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        )
    }

    // ── Fetch error ────────────────────────────────────────────────────────
    if (fetchError) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
                    <UserX className="w-8 h-8 text-rose-400" />
                </div>
                <h2 className="font-bold text-slate-800 text-lg mb-2">Failed to Load Patient</h2>
                <p className="text-slate-500 text-sm mb-6 max-w-sm">{fetchError}</p>
                <Link to="/portal/patients" className="text-sm font-semibold text-emerald-600 hover:underline flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Patients
                </Link>
            </div>
        )
    }

    // ── Not found ──────────────────────────────────────────────────────────
    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <UserX className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="font-bold text-slate-800 text-lg mb-2">Patient Not Found</h2>
                <p className="text-slate-500 text-sm mb-6 max-w-sm">
                    No patient record matches ID{' '}
                    <code className="bg-slate-100 rounded px-1 text-xs">{uuid}</code>.
                </p>
                <Link to="/portal/patients" className="text-sm font-semibold text-emerald-600 hover:underline flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Patients
                </Link>
            </div>
        )
    }

    const vitals = buildVitals(patient)

    const statusEditorSlot = (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Health Status</p>
            <select
                defaultValue={patient.healthStatus ?? 'Stable'}
                onChange={(event) => setStatusValue(event.target.value as typeof statusValue)}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 bg-white"
            >
                {healthStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <button
                onClick={handleSaveStatus}
                className="text-xs font-semibold text-emerald-600 hover:underline text-left"
            >
                Save status
            </button>
        </div>
    )

    return (
        <div className="space-y-6 relative">
            {toastMessage && (
                <ToastNotification message={toastMessage} onDismiss={dismissToast} />
            )}

            {isModalOpen && (
                <NotifyCaretakerModal
                    patient={patient}
                    onClose={() => setIsModalOpen(false)}
                    onSend={handleSendNotification}
                />
            )}

            {/* Action bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex items-center gap-2 flex-wrap">
                    {patient.riskLevel === 'high' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 text-sm font-semibold bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors"
                        >
                            <Bell className="w-4 h-4" /> Notify Caregiver
                        </button>
                    )}
                    <button
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2 text-sm font-semibold bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Download className="w-4 h-4" /> Download Report
                    </button>
                    <Link
                        to="/portal/patients/update"
                        className="flex items-center gap-2 text-sm font-semibold bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-emerald-700 transition-all"
                    >
                        <Edit2 className="w-4 h-4" /> Update Record
                    </Link>
                </div>
            </div>

            {/* Patient header */}
            <PatientHeaderCard patient={patient} rightSlot={statusEditorSlot} />

            {/* Vitals */}
            <div className="grid sm:grid-cols-3 gap-4">
                {vitals.map(({ Icon, label, value, iconColor, iconBackground }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
                        <div className={`w-10 h-10 ${iconBackground} rounded-xl flex items-center justify-center shrink-0`}>
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-semibold">{label}</p>
                            <p className="text-slate-900 font-extrabold text-lg leading-tight">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Medications + clinical notes */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-slate-400" /> Medications
                    </h2>
                    <ul className="space-y-2">
                        {(patient.medications ?? []).map((medication) => (
                            <li key={medication} className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                {medication}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" /> Clinical Notes
                        </h2>
                        {!isEditingNotes ? (
                            <button
                                onClick={() => { setNotesInputValue(patient.clinicalNotes ?? ''); setIsEditingNotes(true) }}
                                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
                            >
                                <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={handleSaveNotes} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline">
                                    <Check className="w-3.5 h-3.5" /> Save
                                </button>
                                <button onClick={() => setIsEditingNotes(false)} className="flex items-center gap-1 text-xs text-slate-400 hover:underline">
                                    <X className="w-3.5 h-3.5" /> Cancel
                                </button>
                            </div>
                        )}
                    </div>
                    {isEditingNotes ? (
                        <textarea
                            value={notesInputValue}
                            onChange={(event) => setNotesInputValue(event.target.value)}
                            rows={5}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 resize-none transition-all"
                        />
                    ) : (
                        <p className="text-slate-600 text-sm leading-relaxed">{patient.clinicalNotes}</p>
                    )}
                </div>
            </div>

            {/* Caretaker / Caregiver */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400" /> Caregiver
                    </h2>
                    {patient.caregiverName && patient.riskLevel === 'high' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl hover:bg-rose-100 transition-colors"
                        >
                            <Bell className="w-3.5 h-3.5" /> Notify
                        </button>
                    )}
                </div>

                {patient.caregiverName ? (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {patient.caregiverName[0]}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 text-sm">{patient.caregiverName}</p>
                            <p className="text-slate-400 text-xs">
                                {[patient.caregiverPhone, patient.caregiverEmail].filter(Boolean).join(' · ')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-10 text-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                            <UserX className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-700 font-semibold text-sm mb-1">No caregiver assigned</p>
                        <p className="text-slate-400 text-xs max-w-xs">
                            This patient has no caregiver on record. Encourage them to assign a trusted contact from within the app.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
