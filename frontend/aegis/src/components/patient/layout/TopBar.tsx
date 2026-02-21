import { Bell, Menu } from 'lucide-react'
import { MOCK_PATIENT } from '../data/mockData'

interface TopBarProps {
    onMenuClick: () => void
    unreadCount: number
}

const TopBar = ({ onMenuClick, unreadCount }: TopBarProps) => {
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-lg font-extrabold text-slate-900">
                        {greeting}, {MOCK_PATIENT.name} 👋
                    </h1>
                    <p className="text-slate-400 text-xs hidden sm:block">
                        {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                        {' · '}
                        <span className="text-orange-500 font-semibold">
                            🔥 {MOCK_PATIENT.streakDays}-day streak
                        </span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative">
                    <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                        <Bell className="w-4 h-4" />
                    </button>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {MOCK_PATIENT.name[0]}
                </div>
            </div>
        </header>
    )
}

export default TopBar