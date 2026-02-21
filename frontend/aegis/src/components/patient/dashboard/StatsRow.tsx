import { ShieldCheck, Activity, TrendingUp, TrendingDown, Pill } from 'lucide-react'
import { MOCK_PATIENT, RISK_CONFIG } from '../data/mockData'

const StatsRow = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            {
                label: 'Risk Level',
                value: RISK_CONFIG[MOCK_PATIENT.riskLevel].label,
                sub: 'Current status',
                Icon: ShieldCheck,
                color: 'from-blue-500 to-teal-500',
                trend: null,
            },
            {
                label: 'BP Average',
                value: MOCK_PATIENT.bpAvg,
                sub: 'Last 7 days',
                Icon: Activity,
                color: 'from-blue-500 to-teal-500',
                trend: 'up',
            },
            {
                label: 'Med Adherence',
                value: `${MOCK_PATIENT.medicationAdherence}%`,
                sub: 'This week',
                Icon: Pill,
                color: 'from-teal-400 to-teal-500',
                trend: 'down',
            },
            {
                label: 'Log Streak',
                value: `${MOCK_PATIENT.streakDays} days`,
                sub: 'Keep it up!',
                Icon: Activity,
                color: 'from-orange-400 to-amber-500',
                trend: null,
            },
        ].map(({ label, value, sub, Icon, color, trend }) => (
            <div
                key={label}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm ring-1 ring-slate-50 hover:shadow-md transition-shadow"
            >
                <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 bg-linear-to-br ${color} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                        <Icon className="w-4 h-4" />
                    </div>
                    {trend === 'up' && <TrendingUp className="w-4 h-4 text-amber-500" />}
                    {trend === 'down' && <TrendingDown className="w-4 h-4 text-rose-500" />}
                </div>
                <p className="text-slate-900 font-extrabold text-base sm:text-lg leading-none mb-0.5 truncate">{value}</p>
                <p className="text-slate-500 text-[10px] sm:text-xs font-medium truncate">{label}</p>
                <p className="text-slate-400 text-[10px] sm:text-xs truncate">{sub}</p>
            </div>
        ))}
    </div>
)

export default StatsRow