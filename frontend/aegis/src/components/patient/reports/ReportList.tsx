import { useState } from 'react'
import { FileText, Download, ChevronRight, Eye, Lock } from 'lucide-react'

interface Report {
    id: number
    title: string
    subtitle: string
    date: string
    type: string
    status: string
    pages: number
    highlights: string[]
    tag: string | null
    tagColor: string
}

const REPORTS: Report[] = [
    {
        id: 1,
        title: 'Monthly Health Summary',
        subtitle: 'February 2026',
        date: '01 Feb 2026',
        type: 'Monthly',
        status: 'ready',
        pages: 4,
        highlights: ['BP avg 138/87', 'Medication 85% adherence', '1 flagged reading'],
        tag: 'Latest',
        tagColor: 'bg-emerald-100 text-emerald-600',
    },
    {
        id: 2,
        title: 'Monthly Health Summary',
        subtitle: 'January 2026',
        date: '01 Jan 2026',
        type: 'Monthly',
        status: 'ready',
        pages: 5,
        highlights: ['BP avg 142/89', 'Medication 78% adherence', '3 flagged readings'],
        tag: null,
        tagColor: '',
    },
    {
        id: 3,
        title: 'Quarterly Risk Assessment',
        subtitle: 'Q4 2025',
        date: '01 Dec 2025',
        type: 'Quarterly',
        status: 'ready',
        pages: 8,
        highlights: ['Moderate stroke risk', 'Lifestyle score improved', 'Doctor reviewed'],
        tag: 'Reviewed',
        tagColor: 'bg-emerald-100 text-emerald-600',
    },
    {
        id: 4,
        title: 'Doctor Visit Summary',
        subtitle: 'Dr Amara Osei · Nov 2025',
        date: '14 Nov 2025',
        type: 'Visit',
        status: 'ready',
        pages: 2,
        highlights: ['Amlodipine 5mg prescribed', 'Follow-up in 3 months', 'BP target set'],
        tag: null,
        tagColor: '',
    },
    {
        id: 5,
        title: 'Annual Health Review',
        subtitle: '2025',
        date: '01 Jan 2025',
        type: 'Annual',
        status: 'locked',
        pages: 12,
        highlights: ['Full blood panel', 'Cardio assessment', 'Risk stratification'],
        tag: 'Locked',
        tagColor: 'bg-slate-100 text-slate-500',
    },
]

const TYPE_STYLE: Record<string, string> = {
    Monthly: 'bg-emerald-50   text-emerald-600   border-emerald-100',
    Quarterly: 'bg-violet-50 text-violet-600 border-violet-100',
    Visit: 'bg-emerald-50   text-emerald-600   border-emerald-100',
    Annual: 'bg-amber-50  text-amber-600  border-amber-100',
}

export default function ReportList() {
    const [expanded, setExpanded] = useState<number | null>(null)

    return (
        <div className="space-y-3">
            {REPORTS.map((r) => (
                <div
                    key={r.id}
                    className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all ${expanded === r.id ? 'border-emerald-200' : 'border-slate-200'
                        }`}
                >
                    {/* Row */}
                    <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r.status === 'locked'
                                ? 'bg-slate-100'
                                : 'bg-emerald-600'
                            }`}>
                            {r.status === 'locked'
                                ? <Lock className="w-4 h-4 text-slate-400" />
                                : <FileText className="w-4 h-4 text-white" />
                            }
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-slate-800 font-bold text-sm truncate">{r.title}</p>
                                {r.tag && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${r.tagColor}`}>
                                        {r.tag}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 flex-wrap">
                                <p className="text-slate-400 text-xs truncate">{r.subtitle}</p>
                                <span className="text-slate-200 hidden sm:inline">·</span>
                                <p className="text-slate-400 text-xs hidden sm:inline">{r.pages} pages</p>
                                <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full shrink-0 ${TYPE_STYLE[r.type]}`}>
                                    {r.type}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            {r.status !== 'locked' && (
                                <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center text-slate-500 transition-colors">
                                    <Download className="w-3.5 h-3.5" />
                                </button>
                            )}
                            <button
                                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center text-slate-500 transition-colors"
                            >
                                {r.status === 'locked'
                                    ? <Lock className="w-3.5 h-3.5" />
                                    : <Eye className="w-3.5 h-3.5" />
                                }
                            </button>
                            <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${expanded === r.id ? 'rotate-90' : ''
                                }`} />
                        </div>
                    </div>

                    {/* Expanded — unlocked */}
                    {expanded === r.id && r.status !== 'locked' && (
                        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
                                Report Highlights
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {r.highlights.map(h => (
                                    <span key={h} className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full">
                                        {h}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-3 mt-4 flex-wrap">
                                <button className="flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm">
                                    <Download className="w-3.5 h-3.5" /> Download PDF
                                </button>
                                <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                    <Eye className="w-3.5 h-3.5" /> Preview
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Expanded — locked */}
                    {expanded === r.id && r.status === 'locked' && (
                        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 flex items-center gap-3">
                            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                            <p className="text-slate-400 text-sm">
                                This report is locked. Contact your care team to request access.
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}