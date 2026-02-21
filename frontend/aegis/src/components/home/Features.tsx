import { ShieldCheck, TrendingUp, Users, MessageCircle, Lock, Zap } from 'lucide-react'

const features = [
    {
        icon: <ShieldCheck className="w-5 h-5" />,
        title: 'Always-On Monitoring',
        description: 'Passive, continuous tracking of medication adherence, symptoms, and behavioral signals — no manual data entry required.',
    },
    {
        icon: <TrendingUp className="w-5 h-5" />,
        title: 'Predictive Intelligence',
        description: 'ML models trained on stroke-recovery data identify risk patterns days before clinical deterioration occurs.',
    },
    {
        icon: <Users className="w-5 h-5" />,
        title: 'Human-in-the-Loop',
        description: 'AI handles routine monitoring and coaching; humans take over when critical decisions are required — the best of both.',
    },
    {
        icon: <MessageCircle className="w-5 h-5" />,
        title: 'Personalized Guidance',
        description: "Stage-based preventive advice tailored to each patient's recovery phase, history, and behavioral patterns.",
    },
    {
        icon: <Lock className="w-5 h-5" />,
        title: 'Privacy First',
        description: 'Health data stays encrypted on-device. Your information is never sold. Full transparency into what we collect and why.',
    },
    {
        icon: <Zap className="w-5 h-5" />,
        title: 'Instant Emergency Response',
        description: 'Panic mode shares your critical vitals and location with emergency services in seconds when every moment counts.',
    },
]

const Features = () => {
    return (
        <section id="features" className="bg-slate-50 py-24">
            <div className="max-w-6xl mx-auto px-6">

                {/* Section label — auth pill style */}
                <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center gap-2 border border-blue-100 bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Platform Capabilities
                    </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-4 tracking-tight">
                    Built for{' '}
                    <span className="bg-linear-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                        Life After Discharge
                    </span>
                </h2>
                <p className="text-center text-slate-500 text-lg max-w-2xl mx-auto mb-16">
                    Every feature is designed around one goal: ensuring no stroke survivor falls through the gaps of the healthcare system.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-200 hover:bg-teal-50/30 hover:shadow-md transition-all shadow-sm ring-1 ring-slate-50"
                        >
                            <div className="w-11 h-11 bg-linear-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white mb-5 shadow-sm group-hover:scale-105 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-slate-900 font-bold text-base mb-2">{feature.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features