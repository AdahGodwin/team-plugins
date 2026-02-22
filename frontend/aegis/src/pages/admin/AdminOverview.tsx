import { Link } from 'react-router-dom'
import { Users, AlertTriangle, ClipboardList, Heart, ArrowRight, Clock } from 'lucide-react'
import { patients } from '../../data/mockPatients'
import { timeAgo } from '../../utils/dateUtils'
import StatCard from '../../components/admin/StatCard'
import RiskBadge from '../../components/admin/RiskBadge'

// ─── Derived data ────────────────────────────────────────────────────────────

const highRiskPatients = patients.filter((patient) => patient.riskLevel === 'high')
const moderateRiskPatients = patients.filter((patient) => patient.riskLevel === 'moderate')
const lowRiskPatients = patients.filter((patient) => patient.riskLevel === 'low')
const logsTodayPatients = patients.filter((patient) => {
    const logDate = new Date(patient.lastLog)
    const today = new Date()
    return logDate.toDateString() === today.toDateString()
})
const activeCaretakers = patients.filter((patient) => patient.caretaker !== null)
const recentlyUpdated = [...patients]
    .sort((a, b) => new Date(b.lastLog).getTime() - new Date(a.lastLog).getTime())
    .slice(0, 5)

// ─── Static display config ───────────────────────────────────────────────────

interface RiskDistributionRow {
    level: string
    count: number
    barColor: string
    textColor: string
}

const riskDistribution: RiskDistributionRow[] = [
    { level: 'High', count: highRiskPatients.length, barColor: 'bg-rose-500', textColor: 'text-rose-600' },
    { level: 'Moderate', count: moderateRiskPatients.length, barColor: 'bg-amber-500', textColor: 'text-amber-600' },
    { level: 'Low', count: lowRiskPatients.length, barColor: 'bg-emerald-500', textColor: 'text-emerald-600' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminOverview() {
    return (
        <div className="space-y-8">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Patient monitoring summary ·{' '}
                    {new Date().toLocaleDateString('en-GB', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Patients"
                    value={patients.length}
                    Icon={Users}
                    iconBg="bg-slate-100"
                    iconColor="text-slate-600"
                    sub="Across all risk levels"
                />
                <StatCard
                    label="High-Risk Cases"
                    value={highRiskPatients.length}
                    Icon={AlertTriangle}
                    iconBg="bg-rose-50"
                    iconColor="text-rose-500"
                    sub="Requiring urgent attention"
                />
                <StatCard
                    label="Logs Today"
                    value={logsTodayPatients.length}
                    Icon={ClipboardList}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-500"
                    sub="Health logs submitted"
                />
                <StatCard
                    label="Active Caretakers"
                    value={activeCaretakers.length}
                    Icon={Heart}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-500"
                    sub="Assigned to patients"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent activity feed */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-bold text-slate-900 text-sm">Recent Activity</h2>
                        <Link
                            to="/portal/patients"
                            className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <ul className="divide-y divide-slate-100">
                        {recentlyUpdated.map((patient) => (
                            <li key={patient.uuid}>
                                <Link
                                    to={`/portal/patients/${patient.uuid}`}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {patient.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{patient.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{patient.diagnosis}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <RiskBadge level={patient.riskLevel} />
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {timeAgo(patient.lastLog)}
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Risk distribution */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="font-bold text-slate-900 text-sm mb-5">Risk Distribution</h2>
                    {riskDistribution.map(({ level, count, barColor, textColor }) => (
                        <div key={level} className="mb-4 last:mb-0">
                            <div className="flex justify-between text-xs font-semibold mb-1.5">
                                <span className={textColor}>{level} Risk</span>
                                <span className="text-slate-500">{count} / {patients.length}</span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${barColor} rounded-full transition-all`}
                                    style={{ width: `${(count / patients.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}

                    <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quick Actions</p>
                        <Link
                            to="/portal/patients"
                            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                        >
                            View All Patients <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                            to="/portal/emergencies"
                            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
                        >
                            View Emergencies <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
