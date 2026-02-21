import { useState } from 'react'
import { MOCK_NOTIFICATIONS, MOCK_PATIENT, MOCK_BP_HISTORY } from '../../components/patient/data/mockData'
import Sidebar       from '../../components/patient/layout/Sidebar'
import MobileSidebar from '../../components/patient/layout/MobileSidebar'
import TopBar        from '../../components/patient/layout/TopBar'
import BottomNav     from '../../components/patient/layout/BottomNav'
import {
    FileText, Download, TrendingUp, TrendingDown,
    Activity, Heart, Pill, ShieldCheck,
    Calendar, ChevronRight, Eye, Lock,
    CheckCircle2, AlertTriangle, Minus,
} from 'lucide-react'

const REPORTS = [
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
        tagColor: 'bg-blue-100 text-blue-600',
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
        tagColor: 'bg-teal-100 text-teal-600',
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
    Monthly:   'bg-blue-50  text-blue-600  border-blue-100',
    Quarterly: 'bg-violet-50 text-violet-600 border-violet-100',
    Visit:     'bg-teal-50  text-teal-600  border-teal-100',
    Annual:    'bg-amber-50 text-amber-600 border-amber-100',
}

const STAT_CARDS = [
    {
        label: 'Avg Systolic',
        value: '138',
        unit: 'mmHg',
        icon: Activity,
        color: 'from-amber-400 to-amber-500',
        trend: 'up',
        sub: '+3 vs last month',
    },
    {
        label: 'Avg Heart Rate',
        value: '74',
        unit: 'bpm',
        icon: Heart,
        color: 'from-rose-400 to-rose-500',
        trend: 'down',
        sub: '-2 vs last month',
    },
    {
        label: 'Med Adherence',
        value: '85',
        unit: '%',
        icon: Pill,
        color: 'from-teal-400 to-teal-500',
        trend: 'up',
        sub: '+7% vs last month',
    },
    {
        label: 'Risk Level',
        value: 'Mod',
        unit: '',
        icon: ShieldCheck,
        color: 'from-blue-400 to-blue-500',
        trend: 'same',
        sub: 'Unchanged',
    },
]

export default function PatientReports() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab,   setActiveTab]   = useState<'overview' | 'reports'>('overview')
    const [expanded,    setExpanded]    = useState<number | null>(null)
    const unreadCount = MOCK_NOTIFICATIONS.length

    const maxSys = Math.max(...MOCK_BP_HISTORY.map(d => d.sys))
    const minSys = Math.min(...MOCK_BP_HISTORY.map(d => d.sys))

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <Sidebar unreadCount={unreadCount} />
            {sidebarOpen && (
                <MobileSidebar onClose={() => setSidebarOpen(false)} unreadCount={unreadCount} />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-20 lg:pb-0">
                <TopBar onMenuClick={() => setSidebarOpen(true)} unreadCount={unreadCount} />

                <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">

                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900">Health Reports</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                View, download and share your health summaries
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600 font-semibold text-sm">Feb 2026</span>
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {STAT_CARDS.map(({ label, value, unit, icon: Icon, color, trend, sub }) => (
                            <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-9 h-9 bg-linear-to-br ${color} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    {trend === 'up'   && <TrendingUp   className="w-4 h-4 text-amber-500" />}
                                    {trend === 'down' && <TrendingDown className="w-4 h-4 text-teal-500"  />}
                                    {trend === 'same' && <Minus        className="w-4 h-4 text-slate-400" />}
                                </div>
                                <p className="text-slate-900 font-extrabold text-xl leading-none">
                                    {value}<span className="text-slate-400 text-sm font-medium ml-1">{unit}</span>
                                </p>
                                <p className="text-slate-500 text-xs font-medium mt-1">{label}</p>
                                <p className="text-slate-400 text-[10px] mt-0.5">{sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tab switcher */}
                    <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
                        {([
                            { id: 'overview', label: 'Health Overview', icon: Activity },
                            { id: 'reports',  label: 'All Reports',     icon: FileText },
                        ] as const).map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    activeTab === id
                                        ? 'bg-linear-to-r from-blue-500 to-teal-500 text-white shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Overview tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">

                            {/* BP chart */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h2 className="text-slate-900 font-bold">Blood Pressure Trend</h2>
                                        <p className="text-slate-400 text-xs mt-0.5">Last 7 days · systolic mmHg</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-amber-600 text-xs font-semibold bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                                        <TrendingUp className="w-3.5 h-3.5" /> Trending up
                                    </div>
                                </div>
                                <div className="flex items-end gap-3 h-24">
                                    {MOCK_BP_HISTORY.map((d) => {
                                        const pct    = ((d.sys - minSys) / (maxSys - minSys || 1)) * 100
                                        const isHigh = d.sys > 138
                                        return (
                                            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                                                <span className="text-[10px] text-slate-400 font-medium">{d.sys}</span>
                                                <div className="w-full relative flex items-end" style={{ height: '56px' }}>
                                                    <div
                                                        className={`w-full rounded-t-lg transition-all ${isHigh ? 'bg-amber-400' : 'bg-teal-400'}`}
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
                                        <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                                        <span className="text-xs text-slate-400">Normal (&lt;138)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                        <span className="text-xs text-slate-400">Elevated (&gt;138)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Highlights grid */}
                            <div className="grid md:grid-cols-2 gap-4">

                                {/* Wins */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                    <h3 className="text-slate-900 font-bold text-sm mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-teal-500" /> This Month's Wins
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            '7-day logging streak maintained',
                                            'Medication adherence improved by 7%',
                                            'Heart rate within healthy range',
                                            'No emergency SOS events',
                                        ].map(w => (
                                            <div key={w} className="flex items-start gap-2.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                                                <p className="text-slate-600 text-sm">{w}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Watch items */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                    <h3 className="text-slate-900 font-bold text-sm mb-4 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-500" /> Areas to Watch
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            'Systolic BP elevated on 3 days',
                                            'Evening medication missed twice',
                                            'Water intake below target 4 days',
                                            'Next appointment due in 2 weeks',
                                        ].map(w => (
                                            <div key={w} className="flex items-start gap-2.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                                <p className="text-slate-600 text-sm">{w}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Doctor note */}
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                                    AO
                                </div>
                                <div>
                                    <p className="text-blue-800 font-bold text-sm">Dr Amara Osei · Last note</p>
                                    <p className="text-blue-600 text-xs mt-1 leading-relaxed">
                                        "{MOCK_PATIENT.name}'s BP is showing improvement but still above target. Continue current medication. Reduce sodium intake and increase physical activity. Review in 3 weeks."
                                    </p>
                                    <p className="text-blue-400 text-[10px] mt-2">14 November 2025</p>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Reports tab */}
                    {activeTab === 'reports' && (
                        <div className="space-y-3">
                            {REPORTS.map((r) => (
                                <div
                                    key={r.id}
                                    className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all ${
                                        expanded === r.id ? 'border-blue-200' : 'border-slate-200'
                                    }`}
                                >
                                    {/* Row */}
                                    <div className="flex items-center gap-4 px-5 py-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                            r.status === 'locked' ? 'bg-slate-100' : 'bg-linear-to-br from-blue-500 to-teal-500'
                                        }`}>
                                            {r.status === 'locked'
                                                ? <Lock     className="w-4 h-4 text-slate-400" />
                                                : <FileText className="w-4 h-4 text-white"      />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-slate-800 font-bold text-sm">{r.title}</p>
                                                {r.tag && (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.tagColor}`}>
                                                        {r.tag}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                <p className="text-slate-400 text-xs">{r.subtitle}</p>
                                                <span className="text-slate-200">·</span>
                                                <p className="text-slate-400 text-xs">{r.pages} pages</p>
                                                <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${TYPE_STYLE[r.type]}`}>
                                                    {r.type}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {r.status !== 'locked' && (
                                                <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-600 flex items-center justify-center text-slate-500 transition-colors">
                                                    <Download className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-slate-500 transition-colors"
                                            >
                                                {r.status === 'locked'
                                                    ? <Lock         className="w-3.5 h-3.5" />
                                                    : <Eye          className="w-3.5 h-3.5" />
                                                }
                                            </button>
                                            <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${expanded === r.id ? 'rotate-90' : ''}`} />
                                        </div>
                                    </div>

                                    {/* Expanded highlights */}
                                    {expanded === r.id && r.status !== 'locked' && (
                                        <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Report Highlights</p>
                                            <div className="flex flex-wrap gap-2">
                                                {r.highlights.map(h => (
                                                    <span key={h} className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full">
                                                        {h}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-3 mt-4">
                                                <button className="flex items-center gap-2 bg-linear-to-r from-blue-500 to-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm">
                                                    <Download className="w-3.5 h-3.5" /> Download PDF
                                                </button>
                                                <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                                    <Eye className="w-3.5 h-3.5" /> Preview
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {expanded === r.id && r.status === 'locked' && (
                                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 flex items-center gap-3">
                                            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                            <p className="text-slate-400 text-sm">This report is locked. Contact your care team to request access.</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                </main>
            </div>

            <BottomNav unreadCount={unreadCount} />
        </div>
    )
}