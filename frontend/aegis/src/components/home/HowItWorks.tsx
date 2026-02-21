import { BarChart2, Brain, Zap, Check } from 'lucide-react'

const steps = [
    {
        number: '01',
        icon: <BarChart2 className="w-6 h-6" />,
        title: 'Continuous Monitoring',
        description: 'Aegis AI tracks medication adherence, symptom reports, engagement patterns, and recovery stability indicators around the clock.',
        points: ['Medication intake tracking', 'Daily symptom check-ins', 'Engagement pattern analysis'],
    },
    {
        number: '02',
        icon: <Brain className="w-6 h-6" />,
        title: 'AI Risk Scoring',
        description: 'Our model dynamically generates a relapse risk score — Low, Moderate, or High — based on behavioral and clinical signals from your day-to-day data.',
        points: ['Dynamic risk categorization', 'Stage-based preventive guidance', 'Trend detection over time'],
    },
    {
        number: '03',
        icon: <Zap className="w-6 h-6" />,
        title: 'Intelligent Escalation',
        description: 'When risk rises, Aegis AI escalates from personalized behavioral nudges to clinical alerts and emergency fallback — always keeping humans in the loop.',
        points: ['Behavioral reminders & tips', 'Clinic alert triggers', 'Emergency panic mode'],
    },
]

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="bg-white py-24">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section label */}
                <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        How It Works
                    </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-4 tracking-tight">
                    Monitor. Analyze. Intervene.
                </h2>
                <p className="text-center text-slate-500 text-lg max-w-2xl mx-auto mb-16">
                    Aegis AI transforms passive health data into proactive, life-saving intervention before relapse occurs.
                </p>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-blue-200 via-violet-200 to-cyan-200" />

                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="relative bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all group"
                        >
                            <div className="absolute -top-4 left-8 bg-white border border-slate-200 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:border-blue-300 group-hover:text-blue-500 transition-colors">
                                {step.number}
                            </div>

                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white mb-5">
                                {step.icon}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-5">{step.description}</p>

                            <ul className="space-y-2">
                                {step.points.map((point) => (
                                    <li key={point} className="flex items-center gap-2 text-sm text-slate-600">
                                        <Check className="w-4 h-4 text-blue-500 shrink-0" strokeWidth={2.5} />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
