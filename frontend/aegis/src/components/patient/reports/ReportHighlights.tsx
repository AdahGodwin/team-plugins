import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { MOCK_PATIENT } from '../data/mockData'

const WINS = [
    '7-day logging streak maintained',
    'Medication adherence improved by 7%',
    'Heart rate within healthy range',
    'No emergency SOS events',
]

const WATCH = [
    'Systolic BP elevated on 3 days',
    'Evening medication missed twice',
    'Water intake below target 4 days',
    'Next appointment due in 2 weeks',
]

export default function ReportHighlights() {
    return (
        <div className="space-y-4">

            {/* Wins + Watch */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-slate-900 font-bold text-sm mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        This Month's Wins
                    </h3>
                    <div className="space-y-3">
                        {WINS.map(w => (
                            <div key={w} className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <p className="text-slate-600 text-sm">{w}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-slate-900 font-bold text-sm mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Areas to Watch
                    </h3>
                    <div className="space-y-3">
                        {WATCH.map(w => (
                            <div key={w} className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                <p className="text-slate-600 text-sm">{w}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Doctor note */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                    AO
                </div>
                <div>
                    <p className="text-emerald-800 font-bold text-sm">Dr Amara Osei · Last note</p>
                    <p className="text-emerald-600 text-xs mt-1 leading-relaxed">
                        "{MOCK_PATIENT.name}'s BP is showing improvement but still above target.
                        Continue current medication. Reduce sodium intake and increase physical
                        activity. Review in 3 weeks."
                    </p>
                    <p className="text-emerald-400 text-[10px] mt-2">14 November 2025</p>
                </div>
            </div>

        </div>
    )
}