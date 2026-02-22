import { Bell, Building2, AlertTriangle, Check } from 'lucide-react'

const levels = [
    {
        tier: '01',
        label: 'Behavioral Prevention',
        color: 'bg-emerald-600',
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-200',
        bgColor: 'bg-emerald-50',
        pillBg: 'bg-emerald-50',
        pillBorder: 'border-emerald-100',
        pillText: 'text-emerald-600',
        icon: <Bell className="w-6 h-6" />,
        trigger: 'Low & Moderate Risk',
        headline: 'Personalized Daily Guidance',
        description: 'When risk is elevated, Aegis AI delivers stage-based preventive reminders, stroke-recovery coaching tips, and medication‐adherence nudges — all tailored to where you are in your recovery journey.',
        actions: [
            'Morning & evening medication reminders',
            'Daily stroke-recovery coaching tips',
            'Activity and lifestyle recommendations',
            'Symptom self-check prompts',
        ],
    },
    {
        tier: '02',
        label: 'Clinical Escalation',
        color: 'bg-amber-500',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-200',
        bgColor: 'bg-amber-50',
        pillBg: 'bg-amber-50',
        pillBorder: 'border-amber-100',
        pillText: 'text-amber-600',
        icon: <Building2 className="w-6 h-6" />,
        trigger: 'Declining Adherence Detected',
        headline: 'Your Medical Centre Gets Alerted',
        description: 'When adherence drops significantly or warning signs appear, Aegis AI automatically sends structured alerts to your registered medical center — keeping your care team informed without requiring action on your part.',
        actions: [
            'Structured alert sent to care team',
            'Adherence decline report shared',
            'Warning symptom flags forwarded',
            'Appointment recommendation triggered',
        ],
    },
    {
        tier: '03',
        label: 'Emergency Fallback',
        color: 'bg-rose-600',
        textColor: 'text-rose-600',
        borderColor: 'border-rose-200',
        bgColor: 'bg-rose-50',
        pillBg: 'bg-rose-50',
        pillBorder: 'border-rose-100',
        pillText: 'text-rose-600',
        icon: <AlertTriangle className="w-6 h-6" />,
        trigger: 'Severe Symptoms Detected',
        headline: 'Panic Mode & Emergency Data Sharing',
        description: 'If critical stroke symptoms are detected — or the patient activates panic mode — Aegis AI immediately shares vital health data with emergency services and designated contacts, enabling the fastest possible response.',
        actions: [
            'One-tap panic activation',
            'Critical health data shared instantly',
            'Emergency contacts notified with location',
            'Nearest stroke center identified',
        ],
    },
]

const EscalationLevels = () => {
    return (
        <section id="escalation" className="bg-white py-24">
            <div className="max-w-6xl mx-auto px-6">

                {/* Section label — auth pill style */}
                <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Intelligent Escalation
                    </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-4 tracking-tight">
                    The Right Response,{' '}
                    <span className="text-emerald-600">
                        At Every Level
                    </span>
                </h2>
                <p className="text-center text-slate-500 text-lg max-w-2xl mx-auto mb-16">
                    Aegis AI transitions seamlessly from digital coaching to human intervention — always keeping the right people in the loop.
                </p>

                <div className="space-y-5">
                    {levels.map((level) => (
                        <div
                            key={level.tier}
                            className={`rounded-2xl border ${level.borderColor} ${level.bgColor} p-6 sm:p-8 hover:scale-[1.005] transition-all shadow-sm ring-1 ring-slate-50`}
                        >
                            <div className="flex flex-col md:flex-row gap-8">

                                {/* Left: Icon + tier */}
                                <div className="flex items-start gap-4 md:w-64 shrink-0">
                                    <div className={`w-12 h-12 rounded-xl ${level.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                                        {level.icon}
                                    </div>
                                    <div>
                                        <span className={`text-xs font-bold uppercase tracking-widest ${level.textColor}`}>
                                            Level {level.tier}
                                        </span>
                                        <p className="font-bold text-slate-900 text-base leading-tight mt-0.5">{level.label}</p>
                                        <span className={`inline-flex items-center gap-1 mt-2 text-xs font-medium ${level.pillText} ${level.pillBg} border ${level.pillBorder} rounded-full px-3 py-0.5`}>
                                            <span className="w-1 h-1 rounded-full bg-current" />
                                            {level.trigger}
                                        </span>
                                    </div>
                                </div>

                                {/* Center: Description */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{level.headline}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{level.description}</p>
                                </div>

                                {/* Right: Actions */}
                                <div className="md:w-64 shrink-0">
                                    <ul className="space-y-2">
                                        {level.actions.map((action) => (
                                            <li key={action} className="flex items-center gap-2 text-sm text-slate-600">
                                                <Check className={`w-4 h-4 ${level.textColor} shrink-0`} strokeWidth={2.5} />
                                                {action}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default EscalationLevels