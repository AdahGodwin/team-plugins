import { TrendingUp } from 'lucide-react'
import { MOCK_PATIENT, MOCK_BP_HISTORY } from '../data/mockData'

export default function BPTrendChart() {
    const maxSys = Math.max(...MOCK_BP_HISTORY.map(d => d.sys))
    const minSys = Math.min(...MOCK_BP_HISTORY.map(d => d.sys))

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-start sm:items-center justify-between gap-3 mb-4 flex-wrap">
                <div>
                    <p className="text-slate-500 text-xs font-medium">7-Day Blood Pressure Trend</p>
                    <p className="text-slate-900 font-extrabold text-base sm:text-lg mt-0.5">
                        {MOCK_PATIENT.bpAvg}
                        <span className="text-slate-400 text-xs sm:text-sm font-normal ml-1">avg mmHg</span>
                    </p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-600 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Trending up
                </div>
            </div>

            <div className="flex items-end gap-1.5 sm:gap-2" style={{ height: '64px' }}>
                {MOCK_BP_HISTORY.map((d) => {
                    const height = ((d.sys - minSys) / (maxSys - minSys || 1)) * 100
                    const isHigh = d.sys > 138
                    return (
                        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full relative flex items-end" style={{ height: '48px' }}>
                                <div
                                    className={`w-full rounded-t-lg transition-all ${isHigh ? 'bg-amber-400' : 'bg-teal-400'}`}
                                    style={{ height: `${Math.max(20, height)}%` }}
                                />
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">{d.day}</span>
                        </div>
                    )
                })}
            </div>

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-teal-400" />
                    <span className="text-xs text-slate-400">Normal</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs text-slate-400">Elevated</span>
                </div>
            </div>
        </div>
    )
}