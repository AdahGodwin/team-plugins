import { useState } from 'react'
import { MOCK_NOTIFICATIONS, MOCK_PATIENT } from '../../components/patient/data/mockData'
import Sidebar from '../../components/patient/layout/Sidebar'
import MobileSidebar from '../../components/patient/layout/MobileSidebar'
import TopBar from '../../components/patient/layout/TopBar'
import BottomNav from '../../components/patient/layout/BottomNav'
import {
    User, Bell, Shield,
    ChevronRight, Globe,
    LogOut, HelpCircle, Heart,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LogoutModal from '../../components/auth/modal/LogoutModal'
import { useLanguage } from '../../i18n/LanguageContext'

export default function PatientSettings() {
    const { t, language } = useLanguage()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [showLogout, setShowLogout] = useState(false)
    const unreadCount = MOCK_NOTIFICATIONS.length

    const languageDisplay = language === 'en' ? 'English (UK)' :
        language === 'ha' ? 'Hausa' :
            language === 'ig' ? 'Igbo' : 'Yoruba'

    const SETTINGS_SECTIONS = [
        {
            title: t('settings.sections.account'),
            items: [
                {
                    icon: User,
                    label: t('settings.items.personal'),
                    sub: t('settings.items.personalSub'),
                    iconBg: 'bg-emerald-100',
                    iconFg: 'text-emerald-600',
                },
                {
                    icon: Shield,
                    label: t('settings.items.privacy'),
                    sub: t('settings.items.privacySub'),
                    iconBg: 'bg-violet-100',
                    iconFg: 'text-violet-500',
                },
                {
                    icon: Globe,
                    label: t('settings.items.language'),
                    sub: languageDisplay,
                    iconBg: 'bg-emerald-100',
                    iconFg: 'text-emerald-600',
                },
            ],
        },
        {
            title: t('settings.sections.preferences'),
            items: [
                {
                    icon: Bell,
                    label: t('settings.items.notifications'),
                    sub: t('settings.items.notificationsSub'),
                    iconBg: 'bg-amber-100',
                    iconFg: 'text-amber-500',
                },
            ],
        },
        {
            title: t('settings.sections.support'),
            items: [
                {
                    icon: HelpCircle,
                    label: t('settings.items.help'),
                    sub: t('settings.items.helpSub'),
                    iconBg: 'bg-emerald-100',
                    iconFg: 'text-emerald-600',
                },
                {
                    icon: Heart,
                    label: t('settings.items.about'),
                    sub: t('settings.items.aboutSub'),
                    iconBg: 'bg-pink-100',
                    iconFg: 'text-pink-500',
                },
            ],
        },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex  ">
            <Sidebar unreadCount={unreadCount} />
            {sidebarOpen && (
                <MobileSidebar
                    onClose={() => setSidebarOpen(false)}
                    unreadCount={unreadCount}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-20 lg:pb-0">
                <TopBar onMenuClick={() => setSidebarOpen(true)} unreadCount={unreadCount} />

                <main className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-4 sm:space-y-6">

                    {/* Header */}
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{t('settings.title')}</h1>
                        <p className="text-slate-400 text-sm mt-1">{t('settings.subtitle')}</p>
                    </div>

                    {/* Profile card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl shadow-sm shrink-0">
                                {MOCK_PATIENT.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-900 font-extrabold text-base sm:text-lg truncate">
                                    {MOCK_PATIENT.fullName}
                                </p>
                                <p className="text-slate-400 text-sm">
                                    {t('settings.profile.agePatient').replace('{age}', MOCK_PATIENT.age.toString())}
                                </p>
                            </div>
                            <button className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl hover:bg-emerald-100 transition-colors shrink-0">
                                {t('settings.profile.edit')}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100 mt-4 pt-4 grid grid-cols-3 gap-3 text-center">
                            <div>
                                <p className="text-slate-900 font-extrabold text-sm sm:text-base">
                                    {MOCK_PATIENT.streakDays}
                                </p>
                                <p className="text-slate-400 text-[10px] sm:text-xs">{t('settings.profile.streak')}</p>
                            </div>
                            <div className="border-x border-slate-100">
                                <p className="text-slate-900 font-extrabold text-sm sm:text-base">
                                    {MOCK_PATIENT.bpAvg}
                                </p>
                                <p className="text-slate-400 text-[10px] sm:text-xs">{t('settings.profile.avgBp')}</p>
                            </div>
                            <div>
                                <p className="text-slate-900 font-extrabold text-sm sm:text-base capitalize">
                                    {MOCK_PATIENT.riskLevel === 'stable' ? t('dashboard.riskStableLabel') :
                                        MOCK_PATIENT.riskLevel === 'elevated' ? t('dashboard.riskElevatedLabel') :
                                            t('dashboard.riskHighLabel')}
                                </p>
                                <p className="text-slate-400 text-[10px] sm:text-xs">{t('settings.profile.risk')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Settings sections */}
                    {SETTINGS_SECTIONS.map(({ title, items }) => (
                        <div key={title} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100">
                                {title}
                            </p>
                            <div className="divide-y divide-slate-100">
                                {items.map(({ icon: Icon, label, sub, iconBg, iconFg }) => (
                                    <button
                                        key={label}
                                        className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors text-left group"
                                    >
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                                            <Icon className={`w-4 h-4 ${iconFg}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-slate-800 font-semibold text-sm sm:text-base truncate">
                                                {label}
                                            </p>
                                            <p className="text-slate-400 text-xs sm:text-sm mt-0.5 truncate">{sub}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-slate-400 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Logout button */}
                    <button
                        onClick={() => setShowLogout(true)}
                        className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-rose-50 hover:border-rose-100 transition-colors group text-left"
                    >
                        <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                            <LogOut className="w-4 h-4 text-rose-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-rose-600 font-semibold text-sm sm:text-base">{t('settings.logout')}</p>
                            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{t('settings.logoutSub')}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-rose-300 transition-colors" />
                    </button>

                    {/* App version */}
                    <p className="text-center text-slate-300 text-xs pb-2">
                        {t('settings.footer')}
                    </p>

                </main>
            </div>

            <BottomNav unreadCount={unreadCount} />

            {/* Logout modal */}
            {showLogout && (
                <LogoutModal
                    onConfirm={() => { setShowLogout(false); navigate('/auth/login') }}
                    onCancel={() => setShowLogout(false)}
                />
            )}
        </div>
    )
}
