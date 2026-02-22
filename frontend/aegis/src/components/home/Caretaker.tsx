import {
    UserPlus, BarChart2, PenLine,
    Bell, ShieldCheck, Eye, ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

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
        description: 'When the patient is unable to enter data themselves — due to fatigue, hospitalisation, or cognitive difficulty — the caretaker can submit logs directly.',
    },
    {
        Icon: Bell,
        title: 'Receive Risk Alerts',
        description: "Get notified immediately when the patient's risk score changes significantly or when critical symptoms are flagged — just like the clinical care team.",
    },
    {
        Icon: ShieldCheck,
        title: 'Privacy-Controlled Access',
        description: 'Patients decide exactly what their caretaker can see. Access is scoped, audited, and revocable at any time — full transparency, always.',
    },
]

const Caretaker = () => {
    return (
        <section className="bg-white py-24">
            <div className="max-w-6xl mx-auto px-6">

                <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center gap-2 border border-emerald-100 bg-emerald-50 text-emerald-600 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Caretaker Monitoring
                    </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-4 tracking-tight">
                    Care Is a{' '}
                    <span className="text-emerald-600">
                        Team Effort
                    </span>
                </h2>
                <p className="text-center text-slate-500 text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
                    Assign a trusted relative or friend as a caretaker. They can monitor the patient's health trends, receive alerts, and log health data on their behalf — ensuring no one faces recovery alone.
                </p>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-12">

                    <div className="flex flex-col gap-3">
                        {capabilities.map(({ Icon, title, description }) => (
                            <div
                                key={title}
                                className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group shadow-sm ring-1 ring-slate-50"
                            >
                                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-1 text-sm">{title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 ring-1 ring-slate-100">
                            <img
                                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80"
                                alt="A family member helping an elderly patient with health monitoring"
                                className="w-full h-115 object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-slate-900/40" />
                        </div>

                        <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl ring-1 ring-slate-100 border border-slate-200 p-4 w-64">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-5 h-5 bg-emerald-600 rounded-md flex items-center justify-center">
                                    <PenLine className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-slate-700 text-xs font-semibold">Logged by caretaker</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {[
                                    { label: 'Blood Pressure', value: '128/82' },
                                    { label: 'Medications', value: 'Taken ✓' },
                                    { label: 'Mood', value: 'Calm' },
                                    { label: 'Activity', value: 'Light walk' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                                        <p className="text-slate-400 mb-0.5">{label}</p>
                                        <p className="text-slate-800 font-semibold">{value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                    A
                                </div>
                                <div>
                                    <p className="text-slate-700 text-xs font-semibold">
                                        Amara <span className="text-slate-400 font-normal">· Sister</span>
                                    </p>
                                    <p className="text-slate-400 text-xs">2 mins ago</p>
                                </div>
                                <Eye className="w-3.5 h-3.5 text-slate-300 ml-auto" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 bg-emerald-600 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-white/20">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Invite a caretaker in seconds</p>
                            <p className="text-emerald-50/90 text-sm leading-relaxed">
                                Send an invite link. They'll set up their account and be connected to your health profile instantly.
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/auth/register"
                        className="group shrink-0 inline-flex items-center gap-2 bg-white text-emerald-600 font-bold text-sm px-7 py-3.5 rounded-2xl hover:bg-emerald-50 transition-all shadow-md active:scale-[0.98]"
                    >
                        Get Started
                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

            </div>
        </section>
    )
}

export default Caretaker