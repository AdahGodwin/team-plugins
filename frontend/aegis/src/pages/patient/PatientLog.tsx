import { useState } from 'react'
import { MOCK_NOTIFICATIONS, MOCK_PATIENT } from '../../components/patient/data/mockData'
import Sidebar        from '../../components/patient/layout/Sidebar'
import MobileSidebar  from '../../components/patient/layout/MobileSidebar'
import TopBar         from '../../components/patient/layout/TopBar'
import BottomNav      from '../../components/patient/layout/BottomNav'
import DailyLogCard   from '../../components/patient/dashboard/DailyLogCard'
import BPTrendChart   from '../../components/patient/log/BPTrendChart'
import PastLogsTab    from '../../components/patient/log/PastLogsTab'
import DailyHabitsTab from '../../components/patient/log/DailyHabitsTab'
import { Activity, Clock, CheckCircle2, Flame } from 'lucide-react'

export default function PatientLog() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab,   setActiveTab]   = useState<'log' | 'history' | 'habits'>('log')
    const unreadCount = MOCK_NOTIFICATIONS.length

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <Sidebar unreadCount={unreadCount} />
            {sidebarOpen && (
                <MobileSidebar onClose={() => setSidebarOpen(false)} unreadCount={unreadCount} />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-20 lg:pb-0">
                <TopBar onMenuClick={() => setSidebarOpen(true)} unreadCount={unreadCount} />

                <main className="flex-1 p-4 sm:p-6 max-w-250 mx-auto w-full space-y-4 sm:space-y-6">

                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Daily Log</h1>
                            <p className="text-slate-400 text-xs sm:text-sm mt-1">
                                {new Date().toLocaleDateString('en-GB', {
                                    weekday: 'long', day: 'numeric', month: 'long',
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-2xl px-3 sm:px-4 py-2 shrink-0">
                            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                            <span className="text-orange-600 font-bold text-xs sm:text-sm whitespace-nowrap">
                                {MOCK_PATIENT.streakDays}d streak
                            </span>
                        </div>
                    </div>

                    {/* BP chart */}
                    <BPTrendChart />

                    {/* Tab switcher */}
                    <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
                        {([
                            { id: 'log',     label: "Today's Log",  icon: Activity     },
                            { id: 'history', label: 'Past Logs',    icon: Clock        },
                            { id: 'habits',  label: 'Daily Habits', icon: CheckCircle2 },
                        ] as const).map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                    activeTab === id
                                        ? 'bg-linear-to-r from-blue-500 to-teal-500 text-white shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                                <span className="hidden sm:inline">{label}</span>
                                <span className="sm:hidden">
                                    {id === 'log' ? 'Today' : id === 'history' ? 'History' : 'Habits'}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    {activeTab === 'log'     && <DailyLogCard   />}
                    {activeTab === 'history' && <PastLogsTab    />}
                    {activeTab === 'habits'  && <DailyHabitsTab />}

                </main>
            </div>

            <BottomNav unreadCount={unreadCount} />
        </div>
    )
}