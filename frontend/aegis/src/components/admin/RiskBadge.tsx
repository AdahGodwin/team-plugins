import type { RiskLevel } from '../../data/mockPatients'

const config: Record<RiskLevel, { bg: string; text: string; dot: string; label: string }> = {
    low: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Low Risk' },
    moderate: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Moderate Risk' },
    high: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', label: 'High Risk' },
}

interface RiskBadgeProps {
    level: RiskLevel
    pulse?: boolean
}

export default function RiskBadge({ level, pulse = false }: RiskBadgeProps) {
    const c = config[level]
    return (
        <span className={`inline-flex items-center gap-1.5 ${c.bg} ${c.text} text-xs font-semibold px-2.5 py-1 rounded-full border border-current/10`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${pulse ? 'animate-pulse' : ''}`} />
            {c.label}
        </span>
    )
}
