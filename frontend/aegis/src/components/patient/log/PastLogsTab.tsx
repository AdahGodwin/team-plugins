import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react'

const PAST_LOGS = [
    { date: 'Yesterday', bp: '135/85', hr: 74, mood: '😊', symptoms: 'None',           status: 'good'    },
    { date: 'Feb 19',    bp: '140/90', hr: 78, mood: '😐', symptoms: 'Mild dizziness', status: 'warning' },
    { date: 'Feb 18',    bp: '132/82', hr: 72, mood: '😊', symptoms: 'None',           status: 'good'    },
    { date: 'Feb 17',    bp: '128/80', hr: 70, mood: '😄', symptoms: 'None',           status: 'good'    },
]

const STATUS_STYLE = {
    good:    { dot: 'bg-teal-500',  bg: 'bg-white hover:bg-teal-50'  },
    warning: { dot: 'bg-amber-500', bg: 'bg-white hover:bg-amber-50' },
}

export default function PastLogsTab() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">Previous Logs</h2>
                <p className="text-slate-400 text-xs mt-0.5">Your recent health check-ins</p>
            </div>
            <div className="divide-y divide-slate-100">
                {PAST_LOGS.map((log) => {
                    const style = STATUS_STYLE[log.status as keyof typeof STATUS_STYLE]
                    const bpNum = parseInt(log.bp.split('/')[0])
                    const trend = bpNum > 138
                        ? <TrendingUp   className="w-3.5 h-3.5 text-amber-500" />
                        : bpNum < 130
                        ? <TrendingDown className="w-3.5 h-3.5 text-teal-500"  />
                        : <Minus        className="w-3.5 h-3.5 text-slate-400"  />
                    return (
                        <div
                            key={log.date}
                            className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 transition-colors ${style.bg}`}
                        >
                            <div className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <p className="text-slate-800 font-bold text-sm truncate">{log.date}</p>
                                    <span className="text-base sm:text-lg">{log.mood}</span>
                                </div>
                                <p className="text-xs mt-0.5 truncate">
                                    {log.symptoms !== 'None'
                                        ? <span className="text-amber-600 font-medium">{log.symptoms}</span>
                                        : <span className="text-slate-400">No symptoms</span>
                                    }
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="flex items-center gap-1 justify-end">
                                    <p className="text-slate-700 font-bold text-sm">{log.bp}</p>
                                    {trend}
                                </div>
                                <p className="text-slate-400 text-xs">{log.hr} bpm</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden sm:block" />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}