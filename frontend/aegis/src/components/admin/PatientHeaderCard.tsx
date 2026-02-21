import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Patient } from '../../data/mockPatients'
import RiskBadge from './RiskBadge'

interface PatientHeaderCardProps {
    patient: Patient
    /** Show a "View Profile" link that navigates to the patient's details page */
    showProfileLink?: boolean
    /** Render extra controls (e.g. status editor) in the right slot */
    rightSlot?: React.ReactNode
}

export default function PatientHeaderCard({
    patient,
    showProfileLink = false,
    rightSlot,
}: PatientHeaderCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shrink-0">
                {patient.name[0]}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl font-extrabold text-slate-900">{patient.name}</h2>
                    <RiskBadge level={patient.riskLevel} pulse={patient.riskLevel === 'high'} />
                </div>
                <p className="text-slate-500 text-sm">{patient.diagnosis}</p>
                <p className="text-slate-400 text-xs mt-1">
                    {patient.age} · {patient.gender}
                </p>
                <code className="text-xs bg-slate-100 rounded px-2 py-0.5 text-slate-500 font-mono mt-1 inline-block">
                    {patient.uuid}
                </code>
                {showProfileLink && (
                    <div className="mt-1">
                        <Link
                            to={`/admin/patients/${patient.uuid}`}
                            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 w-fit"
                        >
                            View Full Profile <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                )}
            </div>

            {/* Right slot — optional controls */}
            {rightSlot && <div className="shrink-0">{rightSlot}</div>}
        </div>
    )
}
