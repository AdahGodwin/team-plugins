import {
    PenLine, Bell, BarChart2, Heart,
    ClipboardList, TrendingUp, AlertTriangle,
    Shield, Building2, RefreshCw, ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LogFeature { icon: React.ReactNode; title: string; description: string }
interface Notification { time: string; Icon: LucideIcon; iconColor: string; bgColor: string; borderColor: string; msg: string }
interface ContinuumStep { Icon: LucideIcon; label: string }

const logFeatures: LogFeature[] = [
    {
        icon: <PenLine className="w-5 h-5" />,
        title: 'Daily & Weekly Health Logs',
        description: 'Log your blood pressure, medications, mood, diet, exercise, and symptoms — daily or weekly, on your schedule.',
    },
    {
        icon: <Bell className="w-5 h-5" />,
        title: 'Smart Log Reminders',
        description: "Missed your weekly check-in? Aegis sends gentle nudges via push, SMS, or email — keeping your health record current.",
    },
    {
        icon: <BarChart2 className="w-5 h-5" />,
        title: 'Trend Analysis',
        description: 'Aegis AI spots patterns across your logs over weeks and months, flagging early signals before they become serious.',
    },
    {
        icon: <Heart className="w-5 h-5" />,
        title: 'Preventive Health Tips',
        description: 'Get AI-generated, evidence-based tips personalised to your log data — from diet recommendations to lifestyle adjustments.',
    },
]

const notifications: Notification[] = [
    {
        time: 'Just now', Icon: ClipboardList,
        iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100',
        msg: "Time for your weekly health log! It only takes 2 minutes.",
    },
    {
        time: '2h ago', Icon: TrendingUp,
        iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100',
        msg: 'Your blood pressure trend looks stable — great work this week!',
    },
    {
        time: 'Yesterday', Icon: AlertTriangle,
        iconColor: 'text-amber-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-100',
        msg: "You haven't logged in 3 days. Missing data affects your risk score.",
    },
]

const continuumSteps: ContinuumStep[] = [
    { Icon: Shield, label: 'Pre-stroke Prevention' },
    { Icon: Building2, label: 'Acute Recovery' },
    { Icon: RefreshCw, label: 'Relapse Prevention' },
]

const PreCare = () => {
    return (
        <section className="bg-slate-50 py-24">
            <div className="max-w-6xl mx-auto px-6">

                <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center gap-2 border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Pre-Stroke Prevention
                    </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-4 tracking-tight">
                    Prevention Starts{' '}
                    <span className="text-emerald-600">
                        Before a Stroke
                    </span>
                </h2>
                <p className="text-center text-slate-500 text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
                    Whether you're at risk or supporting a loved one, Aegis AI helps you build protective health habits — logging, analysing, and guiding you every step of the way.
                </p>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
                    <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 ring-1 ring-slate-100">
                        <img
                            src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80"
                            alt="Person logging health data on a smartphone"
                            className="w-full h-115 object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/40" />
                        <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 shadow-xl ring-1 ring-slate-100">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-slate-900 text-sm font-bold">Weekly check-in reminder</p>
                                <p className="text-slate-400 text-xs">Aegis AI · Log your health data now</p>
                            </div>
                            <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {logFeatures.map((feature) => (
                            <div
                                key={feature.title}
                                className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group shadow-sm ring-1 ring-slate-50"
                            >
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-1 text-sm">{feature.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm ring-1 ring-slate-100 mb-8">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
                            Smart Notifications
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                        {notifications.map((notif) => (
                            <div
                                key={notif.msg}
                                className={`flex items-start gap-3 p-4 rounded-2xl border ${notif.bgColor} ${notif.borderColor}`}
                            >
                                <notif.Icon className={`w-5 h-5 shrink-0 mt-0.5 ${notif.iconColor}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-700 text-sm leading-snug">{notif.msg}</p>
                                    <p className="text-slate-400 text-xs mt-1.5">{notif.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-emerald-600 rounded-3xl p-8 text-white text-center shadow-xl">
                    <h3 className="text-2xl font-extrabold mb-2 tracking-tight">Complete Continuum of Care</h3>
                    <p className="text-emerald-50/90 text-sm max-w-xl mx-auto leading-relaxed mb-6">
                        Aegis AI supports you at every stage — from prevention before a stroke, through acute recovery, to long-term relapse prevention. One platform, your entire journey.
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-3 text-sm font-semibold mb-8">
                        {continuumSteps.map(({ Icon, label }, i) => (
                            <div key={label} className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 ring-1 ring-white/20">
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </span>
                                {i < continuumSteps.length - 1 && (
                                    <span className="text-emerald-100 text-lg">→</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <Link
                        to="/auth/register"
                        className="group inline-flex items-center gap-2 bg-white text-emerald-600 font-bold px-8 py-3.5 rounded-2xl hover:bg-emerald-50 transition-all shadow-md active:scale-[0.98]"
                    >
                        Start Your Journey
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

            </div>
        </section>
    )
}

export default PreCare