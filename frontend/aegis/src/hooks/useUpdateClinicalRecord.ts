import { useState } from 'react'
import { fetchPatient, patchPatient } from '../api/patientService'
import type { ApiPatient, RiskLevel } from '../types/patient.types'

type HealthStatus = NonNullable<ApiPatient['healthStatus']>

export function useUpdateClinicalRecord() {
    const [idInput, setIdInput] = useState('')
    const [patient, setPatient] = useState<ApiPatient | null>(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    // ── Editable form fields ────────────────────────────────────────────────
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [gender, setGender] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [address, setAddress] = useState('')
    const [bloodGroup, setBloodGroup] = useState('')
    const [allergies, setAllergies] = useState('')          // comma-separated
    const [smokingStatus, setSmokingStatus] = useState<'never' | 'former' | 'current'>('never')
    const [diabetic, setDiabetic] = useState(false)
    const [weight, setWeight] = useState('')
    const [height, setHeight] = useState('')
    const [caregiverName, setCaregiverName] = useState('')
    const [caregiverPhone, setCaregiverPhone] = useState('')
    const [caregiverEmail, setCaregiverEmail] = useState('')

    // ── Read-only vitals (displayed only) ──────────────────────────────────
    const [bloodPressure, setBloodPressure] = useState('')
    const [heartRate, setHeartRate] = useState('')
    const [oxygenSat, setOxygenSat] = useState('')
    const [medications, setMedications] = useState('')
    const [clinicalNotes, setClinicalNotes] = useState('')
    const [riskLevel, setRiskLevel] = useState<RiskLevel>('low')
    const [healthStatus, setHealthStatus] = useState<HealthStatus>('Stable')

    // ── Populate form from fetched patient ─────────────────────────────────
    const populate = (p: ApiPatient) => {
        setPatient(p)
        setFirstName(p.firstName)
        setLastName(p.lastName)
        setPhoneNumber(p.phoneNumber ?? '')
        setGender(p.gender ?? '')
        setDateOfBirth(p.dateOfBirth ?? '')
        setAddress(p.address ?? '')
        setBloodGroup(p.bloodGroup ?? '')
        setAllergies((p.allergies ?? []).join(', '))
        setSmokingStatus(p.smokingStatus ?? 'never')
        setDiabetic(p.diabetic ?? false)
        setWeight(p.weight != null ? String(p.weight) : '')
        setHeight(p.height != null ? String(p.height) : '')
        setCaregiverName(p.caregiverName ?? '')
        setCaregiverPhone(p.caregiverPhone ?? '')
        setCaregiverEmail(p.caregiverEmail ?? '')
        // read-only display fields
        setBloodPressure(p.bloodPressure ?? '')
        setHeartRate(p.heartRate != null ? String(p.heartRate) : '')
        setOxygenSat(p.oxygenSat != null ? String(p.oxygenSat) : '')
        setMedications((p.medications ?? []).join(', '))
        setClinicalNotes(p.clinicalNotes ?? '')
        setRiskLevel(p.riskLevel ?? 'low')
        setHealthStatus(p.healthStatus ?? 'Stable')
    }

    // ── Load patient by ID ─────────────────────────────────────────────────
    const handleLoadRecord = async () => {
        const id = idInput.trim()
        if (!id) return
        setErrorMessage('')
        setIsSaved(false)
        setPatient(null)
        setLoading(true)
        try {
            const data = await fetchPatient(id)
            populate(data)
        } catch (err: any) {
            setErrorMessage(
                err.response?.data?.message ??
                err.response?.status === 404
                    ? `No patient found for ID "${id}".`
                    : 'Failed to load patient. Please check the ID and try again.',
            )
        } finally {
            setLoading(false)
        }
    }

    // ── Save changes via PATCH ─────────────────────────────────────────────
    const handleSaveChanges = async () => {
        if (!patient) return
        setSaving(true)
        setIsSaved(false)
        try {
            const updated = await patchPatient(patient.id, {
                firstName,
                lastName,
                phoneNumber:    phoneNumber   || undefined,
                gender:         gender        || undefined,
                dateOfBirth:    dateOfBirth   || undefined,
                address:        address       || undefined,
                bloodGroup:     bloodGroup    || undefined,
                allergies:      allergies
                    ? allergies.split(',').map((a) => a.trim()).filter(Boolean)
                    : undefined,
                smokingStatus,
                diabetic,
                weight:  weight  ? parseFloat(weight)  : undefined,
                height:  height  ? parseFloat(height)  : undefined,
                caregiverName:  caregiverName  || undefined,
                caregiverPhone: caregiverPhone || undefined,
                caregiverEmail: caregiverEmail || undefined,
            })
            populate(updated)
            setIsSaved(true)
            setTimeout(() => setIsSaved(false), 3500)
        } catch (err: any) {
            setErrorMessage(
                err.response?.data?.message ?? 'Failed to save changes. Please try again.',
            )
        } finally {
            setSaving(false)
        }
    }

    return {
        // ID lookup
        idInput, setIdInput,
        errorMessage, setErrorMessage,
        loading,
        handleLoadRecord,
        // Loaded patient (for display)
        patient,
        // Editable fields
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
        // Read-only vitals (display only)
        bloodPressure, setBloodPressure,
        heartRate, setHeartRate,
        oxygenSat, setOxygenSat,
        medications, setMedications,
        clinicalNotes, setClinicalNotes,
        riskLevel, setRiskLevel,
        healthStatus, setHealthStatus,
        // Save
        saving,
        isSaved,
        handleSaveChanges,
    }
}

