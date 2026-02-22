import { ShieldCheck, Activity, TrendingUp, TrendingDown, Pill } from 'lucide-react'
import { MOCK_PATIENT } from '../data/mockData'
import { useLanguage } from '../../../i18n/LanguageContext'

const StatsRow = () => {
    const { t } = useLanguage()

    const riskLabelKey = MOCK_PATIENT.riskLevel === 'stable'
        ? 'dashboard.riskStableLabel'
        : MOCK_PATIENT.riskLevel === 'elevated'
            ? 'dashboard.riskElevatedLabel'
            : 'dashboard.riskHighLabel'

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                {
                    label: t('dashboard.riskLevel'),
                    value: t(riskLabelKey),
                    sub: t('dashboard.stats.currentStatus'),
                    Icon: ShieldCheck,
                    color: 'bg-emerald-600',
                    trend: null,
                },
                {
                    label: t('dashboard.stats.bpAverage'),
                    value: MOCK_PATIENT.bpAvg,
                    sub: t('dashboard.stats.last7Days'),
                    Icon: Activity,
                    color: 'bg-emerald-600',
                    trend: 'up',
                },
                {
                    label: t('dashboard.stats.medAdherence'),
                    value: `${MOCK_PATIENT.medicationAdherence}%`,
                    sub: t('dashboard.stats.thisWeek'),
                    Icon: Pill,
                    color: 'bg-emerald-600',
                    trend: 'down',
                },
                {
                    label: t('dashboard.stats.logStreak'),
                    value: `${MOCK_PATIENT.streakDays} ${t('nav.dashboard') === 'Dashboard' ? 'days' : t('nav.dashboard') === 'Allon Lafiya' ? 'kwanaki' : t('nav.dashboard') === 'Ihe ngosipụta Ahụike' ? 'ụbọchị' : 'ọjọ́'}`,
                    sub: t('dashboard.stats.keepItUp'),
                    Icon: Activity,
                    color: 'bg-emerald-600',
                    trend: null,
                },
            ].map(({ label, value, sub, Icon, color, trend }, idx) => (
                <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm ring-1 ring-slate-50 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center text-white shadow-sm`}>
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
}

export default StatsRow