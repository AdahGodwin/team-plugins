import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
    label: string
    value: string | number
    Icon: LucideIcon
    iconBg: string
    iconColor: string
    sub?: string
}

export default function StatCard({ label, value, Icon, iconBg, iconColor, sub }: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4 shadow-sm">
            <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">{label}</p>
                <p className="text-slate-900 text-2xl font-extrabold leading-tight">{value}</p>
                {sub && <p className="text-slate-400 text-xs mt-0.5">{sub}</p>}
            </div>
        </div>
    )
}
