import {
    PenLine,
    Bell,
    BarChart2,
    Heart,
    ClipboardList,
    TrendingUp,
    AlertTriangle,
    Shield,
    Building2,
    RefreshCw,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface LogFeature {
    icon: React.ReactNode
    title: string
    description: string
}

interface Notification {
    time: string
    Icon: LucideIcon
    iconColor: string
    msg: string
    type: 'reminder' | 'insight' | 'warning'
}

interface ContinuumStep {
    Icon: LucideIcon
    label: string
}

const logFeatures: LogFeature[] = [
    {
        icon: <PenLine className="w-5 h-5" />,
        title: 'Daily & Weekly Health Logs',
        description: 'Log your blood pressure, medications, mood, diet, exercise, and symptoms — daily or weekly, on your schedule.',
    },
    {
        icon: <Bell className="w-5 h-5" />,
        title: 'Smart Log Reminders',
        description: "Missed your weekly check-in? Aegis AI sends gentle nudges via push, SMS, or email — ensuring your health record stays current.",
    },
    {
        icon: <BarChart2 className="w-5 h-5" />,
        title: 'Trend Analysis',
        description: 'Aegis AI spots patterns across your logs over weeks and months, flagging early signals before they become serious risks.',
    },
    {
        icon: <Heart className="w-5 h-5" />,
        title: 'Preventive Health Tips',
        description: 'Get AI-generated, evidence-based health tips personalized to your log data — from diet recommendations to lifestyle adjustments.',
    },
]

const notifications: Notification[] = [
    { time: 'Now', Icon: ClipboardList, iconColor: 'text-blue-400', msg: "Time for your weekly health log! It only takes 2 minutes.", type: 'reminder' },
    { time: '2h ago', Icon: TrendingUp, iconColor: 'text-emerald-400', msg: 'Your blood pressure trend looks stable — great work this week!', type: 'insight' },
    { time: 'Yesterday', Icon: AlertTriangle, iconColor: 'text-amber-400', msg: "You haven't logged in 3 days. Missing data affects your risk score.", type: 'warning' },
]

const continuumSteps: ContinuumStep[] = [
    { Icon: Shield, label: 'Pre-stroke Prevention' },
    { Icon: Building2, label: 'Acute Recovery' },
    { Icon: RefreshCw, label: 'Relapse Prevention' },
]

const PreCare = () => {
    return (
        <section className="bg-white py-24">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section label */}
                <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center gap-2 border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        Pre-Stroke Prevention
                    </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-4 tracking-tight">
                    Prevention Starts{' '}
                    <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                        Before a Stroke
                    </span>
                </h2>
                <p className="text-center text-slate-500 text-lg max-w-2xl mx-auto mb-16">
                    Whether you&apos;re at risk or supporting a loved one, Aegis AI helps you build protective health habits — logging, analyzing, and guiding you every step of the way.
                </p>

                {/* Image + Feature cards row */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    {/* Left: Image */}
                    <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                        <img
                            src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80"
                            alt="Person logging health data on a smartphone"
                            className="w-full h-[460px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur rounded-2xl p-4 flex items-center gap-3 shadow-lg">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shrink-0">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-slate-900 text-sm font-bold">Weekly check-in reminder</p>
                                <p className="text-slate-500 text-xs">Aegis AI · Log your health data now</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Log & notification features */}
                    <div className="space-y-5">
                        {logFeatures.map((feature) => (
                            <div
                                key={feature.title}
                                className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all group"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notification mockup row */}
                <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-12">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-4">Smart Notifications</p>
                    <div className="grid md:grid-cols-3 gap-3">
                        {notifications.map((notif) => (
                            <div
                                key={notif.msg}
                                className={`flex items-start gap-3 p-3 rounded-xl ${notif.type === 'warning'
                                        ? 'bg-amber-500/10 border border-amber-500/20'
                                        : notif.type === 'insight'
                                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                                            : 'bg-blue-500/10 border border-blue-500/20'
                                    }`}
                            >
                                <notif.Icon className={`w-5 h-5 shrink-0 mt-0.5 ${notif.iconColor}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm leading-snug">{notif.msg}</p>
                                    <p className="text-slate-500 text-xs mt-1">{notif.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dual care banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-extrabold mb-2">Complete Continuum of Care</h3>
                    <p className="text-emerald-50 text-sm max-w-xl mx-auto">
                        Aegis AI supports you at every stage — from prevention and risk reduction before a stroke, through acute recovery, to long-term relapse prevention. One platform, your entire journey.
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-3 mt-6 text-sm font-semibold">
                        {continuumSteps.map(({ Icon, label }, i) => (
                            <>
                                <span key={label} className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5">
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </span>
                                {i < continuumSteps.length - 1 && (
                                    <span key={`arrow-${i}`} className="text-emerald-200">→</span>
                                )}
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PreCare
