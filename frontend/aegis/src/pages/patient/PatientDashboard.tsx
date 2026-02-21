import { useState } from 'react'
import { MOCK_NOTIFICATIONS, MOCK_PATIENT } from '../../components/patient/data/mockData'

import Sidebar            from '../../components/patient/layout/Sidebar'
import MobileSidebar      from '../../components/patient/layout/MobileSidebar'
import TopBar             from '../../components/patient/layout/TopBar'
import BottomNav          from '../../components/patient/layout/BottomNav'

import StatsRow           from '../../components/patient/dashboard/StatsRow'
import RiskStatusCard     from '../../components/patient/dashboard/RiskStatusCard'
import DailyLogCard       from '../../components/patient/dashboard/DailyLogCard'
import ChatSection        from '../../components/patient/dashboard/ChatSesction'
import SOSButton          from '../../components/patient/dashboard/SOSButton'
import HealthReportButton from '../../components/patient/dashboard/HealthReportButton'
import NotificationsPanel from '../../components/patient/dashboard/NotificationPanel'

function PatientDashboard() {
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

                <TopBar
                    onMenuClick={() => setSidebarOpen(true)}
                    unreadCount={unreadCount}
                />

                <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">

                    <StatsRow />

                    <RiskStatusCard
                        risk={MOCK_PATIENT.riskLevel}
                        reason={MOCK_PATIENT.riskReason}
                    />

                    <div className="grid lg:grid-cols-2 gap-6">
                        <DailyLogCard />
                        <ChatSection />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <SOSButton />
                        <HealthReportButton />
                        <NotificationsPanel />
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-center">
                        <p className="text-slate-500 text-xs leading-relaxed">
                            ⚕️ <span className="font-semibold text-slate-600">Medical Disclaimer:</span> Aegis supports daily health monitoring and does not replace professional medical care. Always consult your doctor for medical decisions.
                        </p>
                    </div>

                </main>
            </div>

            <BottomNav unreadCount={unreadCount} /> 
        </div>
    )
}

export default PatientDashboard