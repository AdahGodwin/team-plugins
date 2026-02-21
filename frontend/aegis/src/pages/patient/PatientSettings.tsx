import { useState } from 'react'
import { MOCK_NOTIFICATIONS, MOCK_PATIENT } from '../../components/patient/data/mockData'
import Sidebar       from '../../components/patient/layout/Sidebar'
import MobileSidebar from '../../components/patient/layout/MobileSidebar'
import TopBar        from '../../components/patient/layout/TopBar'
import BottomNav     from '../../components/patient/layout/BottomNav'
import {
    User, Bell, Shield, Smartphone,
    ChevronRight, Moon, Globe,
} from 'lucide-react'

const SETTINGS_SECTIONS = [
    {
        title: 'Account',
        items: [
            { icon: User,       label: 'Personal Information', sub: 'Name, age, contact details'       },
            { icon: Shield,     label: 'Privacy & Security',   sub: 'Password, 2FA, data sharing'      },
            { icon: Globe,      label: 'Language',             sub: 'English (UK)'                     },
        ],
    },
    {
        title: 'Preferences',
        items: [
            { icon: Bell,       label: 'Notifications',        sub: 'Alerts, reminders, summaries'     },
            { icon: Moon,       label: 'Appearance',           sub: 'Light mode'                       },
            { icon: Smartphone, label: 'Connected Devices',    sub: 'Blood pressure monitor, wearable' },
        ],
    },
]

export default function PatientSettings() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const unreadCount = MOCK_NOTIFICATIONS.length

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <Sidebar unreadCount={unreadCount} />
            {sidebarOpen && (
                <MobileSidebar
                    onClose={() => setSidebarOpen(false)}
                    unreadCount={unreadCount}
                />
            )}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-20 lg:pb-0">
                <TopBar onMenuClick={() => setSidebarOpen(true)} unreadCount={unreadCount} />
                <main className="flex-1 p-6 max-w-3xl mx-auto w-full">

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-extrabold text-slate-900">Settings</h1>
                        <p className="text-slate-400 text-sm mt-1">Manage your account and preferences</p>
                    </div>

                    {/* Profile card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
                            {MOCK_PATIENT.name[0]}
                        </div>
                        <div>
                            <p className="text-slate-900 font-extrabold text-lg">{MOCK_PATIENT.fullName}</p>
                            <p className="text-slate-400 text-sm">Age {MOCK_PATIENT.age} · Patient</p>
                        </div>
                    </div>

                    {/* Settings sections */}
                    <div className="space-y-6">
                        {SETTINGS_SECTIONS.map(({ title, items }) => (
                            <div key={title} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-6 py-4 border-b border-slate-100">
                                    {title}
                                </p>
                                <div className="divide-y divide-slate-100">
                                    {items.map(({ icon: Icon, label, sub }) => (
                                        <button
                                            key={label}
                                            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors text-left"
                                        >
                                            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-800 font-semibold text-sm">{label}</p>
                                                <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* App version */}
                    <p className="text-center text-slate-300 text-xs mt-8">Aegis v1.0.0 · Built for stroke prevention</p>

                </main>
            </div>
            <BottomNav unreadCount={unreadCount} />
        </div>
    )
}