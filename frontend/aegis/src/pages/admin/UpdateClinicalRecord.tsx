import { Link } from 'react-router-dom'
import { Search, ClipboardEdit, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { useUpdateClinicalRecord } from '../../hooks/useUpdateClinicalRecord'
import RiskBadge from '../../components/admin/RiskBadge'
import AdminInputField from '../../components/admin/AdminInputField'
import AdminSelectField from '../../components/admin/AdminSelectField'
import AdminTextArea from '../../components/admin/AdminTextArea'
import PatientHeaderCard from '../../components/admin/PatientHeaderCard'

const smokingOptions = [
    { value: 'never',   label: 'Never' },
    { value: 'former',  label: 'Former smoker' },
    { value: 'current', label: 'Current smoker' },
]

export default function UpdateClinicalRecord() {
    const {
        idInput, setIdInput,
        errorMessage, setErrorMessage,
        loading,
        handleLoadRecord,
        patient,
        firstName, setFirstName,
        lastName, setLastName,
        phoneNumber, setPhoneNumber,
        gender, setGender,
        dateOfBirth, setDateOfBirth,
        address, setAddress,
        bloodGroup, setBloodGroup,
        allergies, setAllergies,
        smokingStatus, setSmokingStatus,
        diabetic, setDiabetic,
        weight, setWeight,
        height, setHeight,
        caregiverName, setCaregiverName,
        caregiverPhone, setCaregiverPhone,
        caregiverEmail, setCaregiverEmail,
        // read-only vitals
        bloodPressure,
        heartRate,
        oxygenSat,
        medications,
        clinicalNotes,
        riskLevel,
        saving,
        isSaved,
        handleSaveChanges,
    } = useUpdateClinicalRecord()

    const statusEditorSlot = patient ? (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Current Risk</p>
            <RiskBadge level={riskLevel} />
            <Link
                to={`/portal/patients/${patient.id}`}
                className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1"
            >
                View Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    ) : null

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Update Patient Record</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Enter a patient ID to load their record, then edit and save changes.
                </p>
            </div>

            {/* ID lookup */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Patient ID
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            value={idInput}
                            onChange={(e) => { setIdInput(e.target.value); setErrorMessage('') }}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleLoadRecord() }}
                            placeholder="Paste the patient's ID here…"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleLoadRecord}
                        disabled={loading || !idInput.trim()}
                        className="flex items-center justify-center gap-2 text-sm font-semibold bg-emerald-600 text-white px-5 py-3 sm:py-2.5 rounded-xl hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardEdit className="w-4 h-4" />}
                        {loading ? 'Loading…' : 'Load Record'}
                    </button>
                </div>

                {errorMessage && (
                    <div className="flex items-start gap-2 text-sm text-rose-600 font-medium">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        {errorMessage}
                    </div>
                )}
            </div>

            {/* Empty state */}
            {!patient && !loading && !errorMessage && (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                        <ClipboardEdit className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-slate-700 font-semibold text-sm mb-1">No record loaded</p>
                    <p className="text-slate-400 text-xs max-w-xs">
                        Enter a patient ID above and click "Load Record" to begin editing.
                    </p>
                </div>
            )}

            {/* Edit form */}
            {patient && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <PatientHeaderCard patient={patient} rightSlot={statusEditorSlot} />

                    <div className="p-6 space-y-8">

                        {/* ── Section 1: Personal info ───────────────────── */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Personal Information
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <AdminInputField label="First Name" value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
                                <AdminInputField label="Last Name" value={lastName}
                                    onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <AdminInputField label="Phone Number" value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+234 81 2345 6789" />
                                <AdminInputField label="Gender" value={gender}
                                    onChange={(e) => setGender(e.target.value)} placeholder="e.g. Male / Female / Other" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <AdminInputField label="Date of Birth" type="date" value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)} placeholder="YYYY-MM-DD" />
                                <AdminInputField label="Blood Group" value={bloodGroup}
                                    onChange={(e) => setBloodGroup(e.target.value)} placeholder="e.g. O+" />
                            </div>
                            <AdminInputField label="Address" value={address}
                                onChange={(e) => setAddress(e.target.value)} placeholder="Home address" />
                        </section>

                        <div className="h-px bg-slate-100" />

                        {/* ── Section 2: Clinical profile ───────────────── */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Clinical Profile
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <AdminInputField label="Allergies" hint="comma-separated" value={allergies}
                                    onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. Penicillin, Sulfa drugs" />
                                <AdminSelectField label="Smoking Status" value={smokingStatus}
                                    options={smokingOptions}
                                    onChange={(e) => setSmokingStatus(e.target.value as typeof smokingStatus)} />
                            </div>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <AdminInputField label="Weight (kg)" type="number" value={weight}
                                    onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 72" />
                                <AdminInputField label="Height (cm)" type="number" value={height}
                                    onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 175" />
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                        Diabetic
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer mt-1">
                                        <div
                                            onClick={() => setDiabetic(!diabetic)}
                                            className={`relative w-10 h-6 rounded-full transition-colors ${diabetic ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                        >
                                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${diabetic ? 'left-5' : 'left-1'}`} />
                                        </div>
                                        <span className="text-sm text-slate-600">{diabetic ? 'Yes' : 'No'}</span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        <div className="h-px bg-slate-100" />

                        {/* ── Section 3: Caregiver ──────────────────────── */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Caregiver
                            </h3>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <AdminInputField label="Full Name" value={caregiverName}
                                    onChange={(e) => setCaregiverName(e.target.value)} placeholder="Caregiver's name" />
                                <AdminInputField label="Phone" value={caregiverPhone}
                                    onChange={(e) => setCaregiverPhone(e.target.value)} placeholder="+234 80 1234 5678" />
                                <AdminInputField label="Email" type="email" value={caregiverEmail}
                                    onChange={(e) => setCaregiverEmail(e.target.value)} placeholder="caregiver@example.com" />
                            </div>
                        </section>

                        <div className="h-px bg-slate-100" />

                        {/* ── Section 4: Read-only vitals snapshot ─────── */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Latest Vitals (read-only)
                            </h3>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <AdminInputField label="Blood Pressure" value={bloodPressure}
                                    onChange={(e) => e.preventDefault()} placeholder="—"
                                    hint="Updated via patient app" />
                                <AdminInputField label="Heart Rate (bpm)" type="number" value={heartRate}
                                    onChange={(e) => e.preventDefault()} placeholder="—"
                                    hint="Updated via patient app" />
                                <AdminInputField label="O₂ Saturation (%)" type="number" value={oxygenSat}
                                    onChange={(e) => e.preventDefault()} placeholder="—"
                                    hint="Updated via patient app" />
                            </div>
                            <AdminInputField label="Medications" hint="Updated via patient app"
                                value={medications} onChange={(e) => e.preventDefault()}
                                placeholder="—" />
                            <AdminTextArea label="Clinical Notes (read-only — updated via patient app)"
                                value={clinicalNotes} onChange={(e) => e.preventDefault()} rows={3} />
                        </section>

                        {/* ── Save ─────────────────────────────────────── */}
                        <div className="flex items-center gap-4 pt-2">
                            <button
                                onClick={handleSaveChanges}
                                disabled={saving}
                                className="flex items-center gap-2 text-sm font-bold bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-sm hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                            {isSaved && (
                                <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
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

