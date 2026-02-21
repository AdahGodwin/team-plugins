import { useState } from 'react'

type RiskLevel = 'low' | 'moderate' | 'high'

interface RiskConfig {
    color: string
    textColor: string
    bg: string
    border: string
    dotColor: string
    barWidth: string
    barColor: string
    scoreLabel: string
    score: number
    label: string
    description: string
    actions: string[]
    inputs: string
}

const riskConfig: Record<RiskLevel, RiskConfig> = {
    low: {
        color: 'text-teal-600',
        textColor: 'text-teal-500',
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        dotColor: 'bg-teal-500',
        barColor: 'from-teal-400 to-teal-500',
        barWidth: '28%',
        score: 28,
        scoreLabel: '28 / 100',
        label: 'Low Risk',
        description: 'Recovery is on track. Medication adherence is stable and no concerning symptoms have been reported. Aegis AI continues passive monitoring and delivers weekly wellness tips.',
        actions: [
            'Continue medication as prescribed',
            'Weekly wellness check-in with Aegis AI',
            'Maintain healthy lifestyle habits',
        ],
        inputs: 'All medications on schedule · No symptoms flagged · Consistent engagement',
    },
    moderate: {
        color: 'text-amber-600',
        textColor: 'text-amber-500',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        dotColor: 'bg-amber-500',
        barColor: 'from-amber-400 to-orange-500',
        barWidth: '62%',
        score: 62,
        scoreLabel: '62 / 100',
        label: 'Moderate Risk',
        description: 'Early signals of care breakdown detected — missed doses or reduced engagement. Personalized behavioral coaching has been activated and the care team has been flagged for a soft review.',
        actions: [
            'Daily medication reminders intensified',
            'Behavioral coaching sessions initiated',
            'Care team flagged for soft review',
        ],
        inputs: '2 missed doses this week · Engagement dropped 40% · Mild fatigue reported',
    },
    high: {
        color: 'text-rose-600',
        textColor: 'text-rose-500',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        dotColor: 'bg-rose-500',
        barColor: 'from-rose-400 to-rose-600',
        barWidth: '89%',
        score: 89,
        scoreLabel: '89 / 100',
        label: 'High Risk',
        description: 'Critical threshold crossed. Severe symptom flags or prolonged medication non-adherence detected. Clinical escalation and emergency protocols are now active — humans are in the loop.',
        actions: [
            'Medical center alerted instantly',
            'Emergency contact notified with status',
            'Panic mode & critical vitals sharing enabled',
        ],
        inputs: 'Symptoms: severe headache + vision blur · 5-day adherence gap · No engagement 72h',
    },
}

const riskLevels: RiskLevel[] = ['low', 'moderate', 'high']

const RiskScore = () => {
    const [active, setActive] = useState<RiskLevel>('moderate')
    const config = riskConfig[active]

    return (
        <section id="risk" className="bg-slate-50 py-24">
            <div className="max-w-6xl mx-auto px-6">

                {/* Section label — auth pill style */}
                <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center gap-2 border border-blue-100 bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Dynamic Risk Intelligence
                    </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-4 tracking-tight">
                    Real-Time Relapse{' '}
                    <span className="bg-linear-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                        Risk Score
                    </span>
                </h2>
                <p className="text-center text-slate-500 text-lg max-w-2xl mx-auto mb-16">
                    Aegis AI continuously computes your relapse risk and responds with the right level of care — automatically. Click each risk level to explore the response.
                </p>

                <div className="grid md:grid-cols-2 gap-8 items-start">

                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm ring-1 ring-slate-100">
                        <p className="text-slate-500 text-sm font-medium mb-5">Select a risk level to explore</p>

                        <div className="space-y-3 mb-8">
                            {riskLevels.map((level) => {
                                const cfg = riskConfig[level]
                                const isActive = level === active
                                return (
                                    <button
                                        key={level}
                                        onClick={() => setActive(level)}
                                        className={`w-full text-left rounded-xl p-4 border transition-all duration-200 cursor-pointer ${
                                            isActive
                                                ? `${cfg.bg} ${cfg.border} scale-[1.02] shadow-md`
                                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${cfg.dotColor} ${isActive ? 'animate-pulse' : 'opacity-30'}`} />
                                                <span className={`font-bold text-sm ${isActive ? cfg.color : 'text-slate-400'}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            {isActive && (
                                                <span className={`text-xs font-semibold ${cfg.color} uppercase tracking-wider`}>
                                                    Active ↓
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        <div>
                            <div className="flex justify-between text-xs text-slate-500 mb-2">
                                <span>Relapse Risk Score</span>
                                <span className={`font-semibold ${config.textColor} transition-colors duration-300`}>
                                    {config.scoreLabel}
                                </span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                <div
                                    className={`h-full rounded-full bg-linear-to-r ${config.barColor} transition-all duration-700`}
                                    style={{ width: config.barWidth }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>Safe</span>
                                <span>Critical</span>
                            </div>
                        </div>

                        <div className="mt-5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-slate-500 text-xs">
                                <span className="text-slate-700 font-semibold">Signals detected: </span>
                                <span className="transition-all duration-300">{config.inputs}</span>
                            </p>
                        </div>
                    </div>

                    <div key={active} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm ring-1 ring-slate-100 transition-all duration-300">
                        <div className={`inline-flex items-center gap-2 ${config.bg} border ${config.border} rounded-full px-4 py-1.5 mb-5`}>
                            <div className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`} />
                            <span className={`${config.color} text-xs font-semibold uppercase tracking-wider`}>
                                {config.label} Detected
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-3">Aegis AI Responds</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">{config.description}</p>

                        <ul className="space-y-3 mb-8">
                            {config.actions.map((action, i) => (
                                <li key={action} className="flex items-start gap-3 text-slate-700 text-sm">
                                    <div className={`w-6 h-6 rounded-full ${config.bg} border ${config.border} ${config.color} text-xs font-bold flex items-center justify-center shrink-0 mt-0.5`}>
                                        {i + 1}
                                    </div>
                                    {action}
                                </li>
                            ))}
                        </ul>

                        <div className="grid grid-cols-3 gap-2">
                            {riskLevels.map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setActive(level)}
                                    className={`text-center p-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                                        level === active
                                            ? `${riskConfig[level].bg} ${riskConfig[level].border} ${riskConfig[level].color}`
                                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                                    }`}
                                >
                                    {riskConfig[level].label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RiskScore