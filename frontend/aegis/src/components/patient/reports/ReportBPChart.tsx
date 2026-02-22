import { TrendingUp } from 'lucide-react'
import { MOCK_BP_HISTORY } from '../data/mockData'

export default function ReportBPChart() {
    const maxSys = Math.max(...MOCK_BP_HISTORY.map(d => d.sys))
    const minSys = Math.min(...MOCK_BP_HISTORY.map(d => d.sys))

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="text-slate-900 font-bold">Blood Pressure Trend</h2>
                    <p className="text-slate-400 text-xs mt-0.5">Last 7 days · systolic mmHg</p>
                </div>
                <div className="flex items-center gap-1.5 text-amber-600 text-xs font-semibold bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full shrink-0">
                    <TrendingUp className="w-3.5 h-3.5" /> Trending up
                </div>
            </div>

            <div className="flex items-end gap-2 sm:gap-3 h-24">
                {MOCK_BP_HISTORY.map((d) => {
                    const pct = ((d.sys - minSys) / (maxSys - minSys || 1)) * 100
                    const isHigh = d.sys > 138
                    return (
                        <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-medium">{d.sys}</span>
                            <div className="w-full relative flex items-end" style={{ height: '56px' }}>
                                <div
                                    className={`w-full rounded-t-lg transition-all ${isHigh ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                    style={{ height: `${Math.max(20, pct)}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">{d.day}</span>
                        </div>
                    )
                })}
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-400">Normal (&lt;138)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs text-slate-400">Elevated (&gt;138)</span>
                </div>
            </div>
        </div>
    )
}