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
        description: 'Stage-based preventive advice tailored to each patient\'s recovery phase, history, and behavioral patterns.',
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
        <section id="features" className="bg-slate-950 py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        Platform Capabilities
                    </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-4 tracking-tight">
                    Built for{' '}
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Life After Discharge
                    </span>
                </h2>
                <p className="text-center text-slate-400 text-lg max-w-2xl mx-auto mb-16">
                    Every feature is designed around one goal: ensuring no stroke survivor falls through the gaps of the healthcare system.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-slate-800/80 transition-all"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
