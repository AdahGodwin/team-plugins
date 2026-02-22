import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { ApiPatient } from '../../types/patient.types'
import RiskBadge from './RiskBadge'

interface PatientHeaderCardProps {
    patient: ApiPatient
    showProfileLink?: boolean
    rightSlot?: React.ReactNode
}

export default function PatientHeaderCard({
    patient,
    showProfileLink = false,
    rightSlot,
}: PatientHeaderCardProps) {
    const fullName = `${patient.firstName} ${patient.lastName}`
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl shrink-0">
                {patient.firstName[0]}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl font-extrabold text-slate-900">{fullName}</h2>
                    {patient.riskLevel && <RiskBadge level={patient.riskLevel} pulse={patient.riskLevel === 'high'} />}
                </div>
                <p className="text-slate-400 text-xs mt-1">
                    {[patient.gender, patient.dateOfBirth].filter(Boolean).join(' · ')}
                </p>
                <code className="text-xs bg-slate-100 rounded px-2 py-0.5 text-slate-500 font-mono mt-1 inline-block">
                    {patient.id}
                </code>
                {showProfileLink && (
                    <div className="mt-1">
                        <Link
                            to={`/portal/patients/${patient.id}`}
                            className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1 w-fit"
                        >
                            View Full Profile <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                )}
            </div>

            {rightSlot && <div className="shrink-0">{rightSlot}</div>}
        </div>
    )
}
