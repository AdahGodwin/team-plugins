import { useState } from 'react'
import { MOCK_NOTIFICATIONS, MOCK_PATIENT, MOCK_BP_HISTORY } from '../../components/patient/data/mockData'
import Sidebar       from '../../components/patient/layout/Sidebar'
import MobileSidebar from '../../components/patient/layout/MobileSidebar'
import TopBar        from '../../components/patient/layout/TopBar'
import BottomNav     from '../../components/patient/layout/BottomNav'
import DailyLogCard  from '../../components/patient/dashboard/DailyLogCard'
import {
    Activity, Pill, Droplets, Moon,
    TrendingUp, TrendingDown, Minus,
    CheckCircle2, Clock, ChevronRight,
    Flame, Apple,
} from 'lucide-react'

const PAST_LOGS = [
    { date: 'Yesterday',    bp: '135/85', hr: 74, mood: '😊', symptoms: 'None',          status: 'good'    },
    { date: 'Feb 19',       bp: '140/90', hr: 78, mood: '😐', symptoms: 'Mild dizziness', status: 'warning' },
    { date: 'Feb 18',       bp: '132/82', hr: 72, mood: '😊', symptoms: 'None',           status: 'good'    },
    { date: 'Feb 17',       bp: '128/80', hr: 70, mood: '😄', symptoms: 'None',           status: 'good'    },
]

const DAILY_HABITS = [
    { icon: Pill,     label: 'Aspirin 75mg',     time: '8:00 AM',  done: true  },
    { icon: Pill,     label: 'Amlodipine 5mg',   time: '8:00 PM',  done: false },
    { icon: Droplets, label: '8 glasses of water', time: 'All day', done: true  },
    { icon: Apple,    label: 'Low-sodium meals',  time: 'All day',  done: false },
    { icon: Moon,     label: 'Sleep by 10 PM',    time: '10:00 PM', done: false },
]

const STATUS_STYLE = {
    good:    { dot: 'bg-teal-500',  text: 'text-teal-600',  bg: 'bg-teal-50',  border: 'border-teal-100'  },
    warning: { dot: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
}

export default function PatientLog() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab,   setActiveTab]   = useState<'log' | 'history' | 'habits'>('log')
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
                            <h1 className="text-2xl font-extrabold text-slate-900">Daily Log</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-2">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-orange-600 font-bold text-sm">{MOCK_PATIENT.streakDays} day streak</span>
                        </div>
                    </div>

                    {/* BP Trend strip */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-slate-500 text-xs font-medium">7-Day Blood Pressure Trend</p>
                                <p className="text-slate-900 font-extrabold text-lg">{MOCK_PATIENT.bpAvg} <span className="text-slate-400 text-sm font-normal">avg mmHg</span></p>
                            </div>
                            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                                <TrendingUp className="w-3.5 h-3.5" /> Trending up
                            </div>
                        </div>
                        {/* Chart bars */}
                        <div className="flex items-end gap-2 h-16">
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
                                        <span className="text-[10px] text-slate-400 font-medium">{d.day}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                                <span className="text-xs text-slate-400">Normal</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                <span className="text-xs text-slate-400">Elevated</span>
                            </div>
                        </div>
                    </div>

                    {/* Tab switcher */}
                    <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
                        {([
                            { id: 'log',     label: "Today's Log",    icon: Activity        },
                            { id: 'history', label: 'Past Logs',      icon: Clock           },
                            { id: 'habits',  label: 'Daily Habits',   icon: CheckCircle2    },
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
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    {activeTab === 'log' && (
                        <DailyLogCard />
                    )}

                    {activeTab === 'history' && (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
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
                                        <div key={log.date} className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors ${style.bg}`}>
                                            <div className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-slate-800 font-bold text-sm">{log.date}</p>
                                                    <span className="text-lg">{log.mood}</span>
                                                </div>
                                                <p className="text-slate-400 text-xs mt-0.5">
                                                    {log.symptoms !== 'None'
                                                        ? <span className="text-amber-600 font-medium">{log.symptoms}</span>
                                                        : 'No symptoms reported'
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
                                            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'habits' && (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="font-bold text-slate-900">Daily Habits</h2>
                                    <p className="text-slate-400 text-xs mt-0.5">Stay on track with your care plan</p>
                                </div>
                                <span className="text-sm font-bold text-teal-600">
                                    {DAILY_HABITS.filter(h => h.done).length}/{DAILY_HABITS.length} done
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="px-6 pt-4">
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-linear-to-r from-blue-500 to-teal-500 rounded-full transition-all"
                                        style={{ width: `${(DAILY_HABITS.filter(h => h.done).length / DAILY_HABITS.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100 mt-2">
                                {DAILY_HABITS.map(({ icon: Icon, label, time, done }) => (
                                    <div key={label} className={`flex items-center gap-4 px-6 py-4 transition-colors ${done ? 'opacity-60' : 'hover:bg-slate-50'}`}>
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${done ? 'bg-teal-100' : 'bg-slate-100'}`}>
                                            <Icon className={`w-4 h-4 ${done ? 'text-teal-500' : 'text-slate-400'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-semibold ${done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                                {label}
                                            </p>
                                            <p className="text-slate-400 text-xs mt-0.5">{time}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                            done ? 'bg-teal-500 border-teal-500' : 'border-slate-200'
                                        }`}>
                                            {done && <CheckCircle2 className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </main>
            </div>

            <BottomNav unreadCount={unreadCount} />
        </div>
    )
}