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

                <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
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

                    {/* Right: Image + floating mockup */}
                    <div className="relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                            <img
                                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80"
                                alt="A family member helping an elderly patient with health monitoring"
                                className="w-full h-[460px] object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                        </div>

                        {/* Floating log entry card */}
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-64">
                            <div className="flex items-center gap-2 mb-3">
                                <PenLine className="w-4 h-4 text-violet-500" />
                                <span className="text-slate-700 text-xs font-semibold">Logged by caretaker</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {[
                                    { label: 'Blood Pressure', value: '128/82' },
                                    { label: 'Medications', value: 'Taken ✓' },
                                    { label: 'Mood', value: 'Calm' },
                                    { label: 'Activity', value: 'Light walk' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-slate-50 rounded-lg p-2">
                                        <p className="text-slate-500 mb-0.5">{label}</p>
                                        <p className="text-slate-900 font-semibold">{value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                    A
                                </div>
                                <div>
                                    <p className="text-slate-700 text-xs font-semibold">Amara <span className="text-slate-400 font-normal">· Sister</span></p>
                                    <p className="text-slate-400 text-xs">2 mins ago</p>
                                </div>
                                <Eye className="w-3.5 h-3.5 text-slate-300 ml-auto" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom callout strip */}
                <div className="mt-16 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
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
