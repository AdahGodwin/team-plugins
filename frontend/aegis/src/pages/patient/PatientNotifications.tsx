import { useState } from 'react'
import { MOCK_NOTIFICATIONS } from '../../components/patient/data/mockData'
import Sidebar            from '../../components/patient/layout/Sidebar'
import MobileSidebar      from '../../components/patient/layout/MobileSidebar'
import TopBar             from '../../components/patient/layout/TopBar'
import BottomNav          from '../../components/patient/layout/BottomNav'
import NotificationsPanel from '../../components/patient/dashboard/NotificationPanel'

export default function PatientNotifications() {
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
                    <div className="mb-6">
                        <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <NotificationsPanel />
                </main>
            </div>
            <BottomNav unreadCount={unreadCount} />
        </div>
    )
}