import { FILTERS, type Filter } from './notifTypes'

interface NotifFiltersProps {
    activeFilter: Filter
    getCount: (f: Filter) => number
    onChange: (f: Filter) => void
}

export default function NotifFilters({ activeFilter, getCount, onChange }: NotifFiltersProps) {
    return (
        <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => {
                const count = getCount(f)
                const isActive = activeFilter === f
                return (
                    <button
                        key={f}
                        onClick={() => onChange(f)}
                        className={[
                            'flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all',
                            isActive
                                ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-200 hover:text-emerald-600',
                        ].join(' ')}
                    >
                        {f}
                        {count > 0 && (
                            <span className={`text-[10px] md:text-[13px] font-bold px-1.5 py-0.5 rounded-full ${isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                {count}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}