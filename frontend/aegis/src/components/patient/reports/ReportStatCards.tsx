import { Activity, Heart, Pill, ShieldCheck, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const STAT_CARDS = [
    {
        label: 'Avg Systolic',
        value: '138',
        unit:  'mmHg',
        icon:  Activity,
        color: 'from-amber-400 to-amber-500',
        trend: 'up',
        sub:   '+3 vs last month',
    },
    {
        label: 'Avg Heart Rate',
        value: '74',
        unit:  'bpm',
        icon:  Heart,
        color: 'from-rose-400 to-rose-500',
        trend: 'down',
        sub:   '-2 vs last month',
    },
    {
        label: 'Med Adherence',
        value: '85',
        unit:  '%',
        icon:  Pill,
        color: 'from-teal-400 to-teal-500',
        trend: 'up',
        sub:   '+7% vs last month',
    },
    {
        label: 'Risk Level',
        value: 'Mod',
        unit:  '',
        icon:  ShieldCheck,
        color: 'from-blue-400 to-blue-500',
        trend: 'same',
        sub:   'Unchanged',
    },
]

export default function ReportStatCards() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STAT_CARDS.map(({ label, value, unit, icon: Icon, color, trend, sub }) => (
                <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                        <div className={`w-9 h-9 bg-linear-to-br ${color} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        {trend === 'up'   && <TrendingUp   className="w-4 h-4 text-amber-500" />}
                        {trend === 'down' && <TrendingDown className="w-4 h-4 text-teal-500"  />}
                        {trend === 'same' && <Minus        className="w-4 h-4 text-slate-400" />}
                    </div>
                    <p className="text-slate-900 font-extrabold text-xl leading-none">
                        {value}
                        <span className="text-slate-400 text-sm font-medium ml-1">{unit}</span>
                    </p>
                    <p className="text-slate-500 text-xs font-medium mt-1">{label}</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">{sub}</p>
                </div>
            ))}
        </div>
    )
}