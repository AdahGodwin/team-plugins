import { Pill, Droplets, Moon, Apple, CheckCircle2 } from 'lucide-react'

const DAILY_HABITS = [
    { icon: Pill, label: 'Aspirin 75mg', time: '8:00 AM', done: true },
    { icon: Pill, label: 'Amlodipine 5mg', time: '8:00 PM', done: false },
    { icon: Droplets, label: '8 glasses of water', time: 'All day', done: true },
    { icon: Apple, label: 'Low-sodium meals', time: 'All day', done: false },
    { icon: Moon, label: 'Sleep by 10 PM', time: '10:00 PM', done: false },
]

export default function DailyHabitsTab() {
    const doneCount = DAILY_HABITS.filter(h => h.done).length

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
                <div>
                    <h2 className="font-bold text-slate-900">Daily Habits</h2>
                    <p className="text-slate-400 text-xs mt-0.5">Stay on track with your care plan</p>
                </div>
                <span className="text-sm font-bold text-emerald-600 shrink-0">
                    {doneCount}/{DAILY_HABITS.length} done
                </span>
            </div>

            {/* Progress bar */}
            <div className="px-4 sm:px-6 pt-4">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${(doneCount / DAILY_HABITS.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
                {DAILY_HABITS.map(({ icon: Icon, label, time, done }) => (
                    <div
                        key={label}
                        className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 transition-colors ${done ? 'opacity-60' : 'hover:bg-slate-50'
                            }`}
                    >
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${done ? 'bg-emerald-100' : 'bg-slate-100'
                            }`}>
                            <Icon className={`w-4 h-4 ${done ? 'text-emerald-500' : 'text-slate-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${done ? 'line-through text-slate-400' : 'text-slate-800'
                                }`}>
                                {label}
                            </p>
                            <p className="text-slate-400 text-xs mt-0.5">{time}</p>
                        </div>
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'
                            }`}>
                            {done && <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}