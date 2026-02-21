import {
    UserPlus,
    BarChart2,
    PenLine,
    Bell,
    ShieldCheck,
    Eye,
} from 'lucide-react'

interface CaretakerCapability {
    Icon: typeof UserPlus
    title: string
    description: string
}

const capabilities: CaretakerCapability[] = [
    {
        Icon: BarChart2,
        title: 'View Daily Health Trends',
        description: "Access the patient's health logs, risk score history, and trend charts in real time — staying informed without needing the patient to report manually.",
    },
    {
        Icon: PenLine,
        title: 'Log on Behalf of Patient',
        description: 'When the patient is unable to enter data themselves — due to fatigue, hospitalization, or cognitive difficulty — the caretaker can submit logs directly.',
    },
    {
        Icon: Bell,
        title: 'Receive Risk Alerts',
        description: 'Get notified immediately when the patient\'s risk score changes significantly or when critical symptoms are flagged — just like the clinical care team.',
    },
    {
        Icon: ShieldCheck,
        title: 'Privacy-Controlled Access',
        description: 'Patients decide exactly what their caretaker can see. Access is scoped, audited, and revocable at any time — full transparency, always.',
    },
]

const Caretaker = () => {
    return (
        <section className="bg-slate-50 py-24">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section label */}
                <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center gap-2 border border-violet-200 bg-violet-50 text-violet-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        Caretaker Monitoring
                    </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-4 tracking-tight">
                    Care Is a{' '}
                    <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                        Team Effort
                    </span>
                </h2>
                <p className="text-center text-slate-500 text-lg max-w-2xl mx-auto mb-16">
                    Assign a trusted relative or friend as a caretaker. They can monitor the patient&apos;s health trends, receive alerts, and log health data on their behalf — ensuring no one faces recovery alone.
                </p>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Capabilities */}
                    <div className="space-y-5">
                        {capabilities.map(({ Icon, title, description }) => (
                            <div
                                key={title}
                                className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-violet-200 hover:shadow-sm transition-all group"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-blue-500 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Visual mockup */}
                    <div className="bg-slate-950 rounded-3xl p-8 border border-slate-800">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Monitoring</p>
                                <p className="text-white font-bold text-lg">John Adeyemi</p>
                                <p className="text-slate-500 text-xs">Patient · Post-stroke recovery</p>
                            </div>
                            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-emerald-400 text-xs font-semibold">Low Risk</span>
                            </div>
                        </div>

                        {/* Trend mini chart (decorative) */}
                        <div className="flex items-end gap-1.5 h-16 mb-6">
                            {[40, 55, 48, 62, 58, 72, 65, 70, 60, 68, 55, 63].map((h, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-sm transition-all ${i === 11 ? 'bg-violet-500' : 'bg-slate-700'}`}
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                        <p className="text-slate-500 text-xs mb-6">Adherence score — last 12 days</p>

                        {/* Log entry widget */}
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <PenLine className="w-4 h-4 text-violet-400" />
                                <span className="text-slate-300 text-xs font-semibold">Log entry by caretaker</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {[
                                    { label: 'Blood Pressure', value: '128/82 mmHg' },
                                    { label: 'Medications', value: 'Taken ✓' },
                                    { label: 'Mood', value: 'Calm' },
                                    { label: 'Activity', value: 'Light walk' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-slate-800 rounded-lg p-2">
                                        <p className="text-slate-500 mb-0.5">{label}</p>
                                        <p className="text-white font-semibold">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Caretaker info */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                A
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-300 text-xs font-semibold">Amara Adeyemi <span className="text-slate-500 font-normal">· Sister</span></p>
                                <p className="text-slate-500 text-xs">Caretaker · Logged 2 mins ago</p>
                            </div>
                            <Eye className="w-4 h-4 text-slate-600" />
                        </div>
                    </div>
                </div>

                {/* Bottom callout strip */}
                <div className="mt-12 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Invite a caretaker in seconds</p>
                            <p className="text-violet-100 text-sm">Send an invite link. They&apos;ll set up their account and be connected to your health profile instantly.</p>
                        </div>
                    </div>
                    <a
                        href="#"
                        className="shrink-0 bg-white text-violet-700 font-semibold text-sm px-6 py-3 rounded-full hover:bg-violet-50 transition-colors"
                    >
                        Get Started
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Caretaker
