import { Link } from 'react-router-dom'
import { Search, ClipboardEdit, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { RiskLevel } from '../../data/mockPatients'
import type { Patient } from '../../data/mockPatients'
import { useUpdateClinicalRecord } from '../../hooks/useUpdateClinicalRecord'
import RiskBadge from '../../components/admin/RiskBadge'
import AdminInputField from '../../components/admin/AdminInputField'
import AdminSelectField from '../../components/admin/AdminSelectField'
import AdminTextArea from '../../components/admin/AdminTextArea'
import PatientHeaderCard from '../../components/admin/PatientHeaderCard'

const riskLevelOptions = [
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
]

const healthStatusOptions = [
    { value: 'Stable', label: 'Stable' },
    { value: 'Monitoring', label: 'Monitoring' },
    { value: 'Critical', label: 'Critical' },
]

const quickFillUuids = [
    { label: '…0001 (John Adeyemi)', value: 'ae1f2c3d-0001-4b5e-8f9a-000000000001' },
    { label: '…0007 (Taiwo Afolabi)', value: 'ae1f2c3d-0007-4b5e-8f9a-000000000007' },
    { label: '…0011 (Alhaji Garba)', value: 'ae1f2c3d-0011-4b5e-8f9a-000000000011' },
    { label: '…0016 (Ifeoma Chukwu)', value: 'ae1f2c3d-0016-4b5e-8f9a-000000000016' },
]

export default function UpdateClinicalRecord() {
    const {
        uuidInput, setUuidInput,
        errorMessage, setErrorMessage,
        handleLoadRecord,
        patient,
        bloodPressure, setBloodPressure,
        heartRate, setHeartRate,
        oxygenSat, setOxygenSat,
        medications, setMedications,
        clinicalNotes, setClinicalNotes,
        riskLevel, setRiskLevel,
        healthStatus, setHealthStatus,
        isSaved,
        handleSaveChanges,
    } = useUpdateClinicalRecord()

    const statusEditorSlot = patient ? (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Current Risk</p>
            <RiskBadge level={patient.riskLevel} />
            <Link
                to={`/admin/patients/${patient.uuid}`}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
                View Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    ) : null

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Update Clinical Record</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Enter a patient UUID to load their record, then edit and save changes.
                </p>
            </div>

            {/* UUID lookup */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                    Patient UUID
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            value={uuidInput}
                            onChange={(event) => { setUuidInput(event.target.value); setErrorMessage('') }}
                            onKeyDown={(event) => { if (event.key === 'Enter') handleLoadRecord() }}
                            placeholder="ae1f2c3d-0001-4b5e-8f9a-000000000001"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleLoadRecord}
                        className="flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-teal-500 text-white px-5 py-3 sm:py-2.5 rounded-xl hover:opacity-90 shadow-sm transition-all"
                    >
                        <ClipboardEdit className="w-4 h-4" />
                        Load Record
                    </button>
                </div>

                {errorMessage && (
                    <p className="text-sm text-rose-500 font-medium">{errorMessage}</p>
                )}

                <div className="text-xs text-slate-400 flex flex-wrap gap-x-2 gap-y-1.5 items-center">
                    <span className="font-semibold text-slate-500">Quick-fill:</span>
                    {quickFillUuids.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => setUuidInput(item.value)}
                            className="text-blue-500 hover:underline truncate max-w-[160px] sm:max-w-none"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty state */}
            {!patient && !errorMessage && (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                        <ClipboardEdit className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-slate-700 font-semibold text-sm mb-1">No record loaded</p>
                    <p className="text-slate-400 text-xs max-w-xs">
                        Enter a patient UUID above and click "Load Record" to begin editing their clinical data.
                    </p>
                </div>
            )}

            {/* Edit form */}
            {patient && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <PatientHeaderCard patient={patient} rightSlot={statusEditorSlot} />

                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <AdminInputField
                                label="Blood Pressure"
                                value={bloodPressure}
                                onChange={(event) => setBloodPressure(event.target.value)}
                                placeholder="e.g. 128/82"
                            />
                            <AdminInputField
                                label="Heart Rate (bpm)"
                                type="number"
                                value={heartRate}
                                onChange={(event) => setHeartRate(event.target.value)}
                                placeholder="e.g. 72"
                            />
                            <AdminInputField
                                label="O₂ Saturation (%)"
                                type="number"
                                value={oxygenSat}
                                onChange={(event) => setOxygenSat(event.target.value)}
                                placeholder="e.g. 98"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <AdminSelectField
                                label="Risk Level Override"
                                value={riskLevel}
                                options={riskLevelOptions}
                                onChange={(event) => setRiskLevel(event.target.value as RiskLevel)}
                            />
                            <AdminSelectField
                                label="Health Status"
                                value={healthStatus}
                                options={healthStatusOptions}
                                onChange={(event) => setHealthStatus(event.target.value as Patient['healthStatus'])}
                            />
                        </div>

                        <AdminInputField
                            label="Medications"
                            hint="comma-separated"
                            value={medications}
                            onChange={(event) => setMedications(event.target.value)}
                            placeholder="Aspirin 75mg, Atorvastatin 40mg…"
                        />

                        <AdminTextArea
                            label="Clinical Notes"
                            value={clinicalNotes}
                            onChange={(event) => setClinicalNotes(event.target.value)}
                            rows={4}
                        />

                        <div className="flex items-center gap-4 pt-2">
                            <button
                                onClick={handleSaveChanges}
                                className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
                            >
                                Save Changes
                            </button>
                            {isSaved && (
                                <span className="flex items-center gap-1.5 text-teal-600 text-sm font-semibold">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Saved successfully
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
