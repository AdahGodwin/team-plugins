import { useState } from 'react'
import { ClipboardList, CheckCircle2, AlertTriangle, ShieldCheck, Activity, ChevronRight, ChevronLeft, Pill } from 'lucide-react'
import { SYMPTOMS } from '../data/mockData'
import { useLanguage } from '../../../i18n/LanguageContext'
import { useAuth } from '../../../context/AuthContext'
import { medicalService } from '../../../api/services/medical'
import type { AiRiskUpdate } from '../../../api/types'

type Step = 1 | 2 | 3

const RISK_STYLES = {
    STABLE: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: ShieldCheck, iconColor: 'text-emerald-600', dot: 'bg-emerald-500' },
    ELEVATED: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: AlertTriangle, iconColor: 'text-amber-500', dot: 'bg-amber-500' },
    HIGH: { bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700', icon: AlertTriangle, iconColor: 'text-rose-500', dot: 'bg-rose-500' },
}

const DailyLogCard = () => {
    const { t } = useLanguage()
    const { profile, refreshProfile } = useAuth()

    // Step 1: Vitals
    const [systolic, setSystolic] = useState('')
    const [diastolic, setDiastolic] = useState('')
    const [heartRate, setHeartRate] = useState('')

    // Step 2: Lifestyle
    const [dailySteps, setDailySteps] = useState('')
    const [sleepHours, setSleepHours] = useState('')
    const [medications, setMedications] = useState('')

    // Step 3: Symptoms
    const [symptoms, setSymptoms] = useState<string[]>([])
    const [notes, setNotes] = useState('')

    // UI state
    const [step, setStep] = useState<Step>(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [aiResult, setAiResult] = useState<AiRiskUpdate | null>(null)

    const toggleSymptom = (s: string) =>
        setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

    const handleSubmit = async () => {
        setLoading(true)
        setError('')
        try {
            const result = await medicalService.submitVitals({
                systolic: parseInt(systolic),
                diastolic: parseInt(diastolic),
                heartRate: heartRate ? parseInt(heartRate) : undefined,
                dailySteps: dailySteps ? parseInt(dailySteps) : undefined,
                sleepHours: sleepHours ? parseFloat(sleepHours) : undefined,
                medications: medications || undefined,
                symptoms,
                notes: notes || undefined,
            })
            setAiResult(result.riskUpdate)
            // Refresh sidebar risk level
            await refreshProfile()
        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'Submission failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setSystolic(''); setDiastolic(''); setHeartRate('')
        setDailySteps(''); setSleepHours(''); setMedications('')
        setSymptoms([]); setNotes(''); setStep(1); setAiResult(null); setError('')
    }

    // ── AI Result card ────────────────────────────────────────────────────────
    if (aiResult) {
        const level = aiResult.level
        const cfg = RISK_STYLES[level]
        const Icon = cfg.icon
        const labels = { STABLE: 'Stable', ELEVATED: 'Elevated Risk', HIGH: 'High Risk' }

        return (
            <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5 sm:p-6 flex flex-col gap-4 shadow-sm h-full`}>
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${level === 'STABLE' ? 'bg-emerald-600' : level === 'ELEVATED' ? 'bg-amber-500' : 'bg-rose-500'}`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Vitals Logged & Analyzed</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                            <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.badge.split(' ')[1]}`}>{labels[level]}</span>
                        </div>
                    </div>
                    <span className={`ml-auto text-lg font-black ${cfg.badge.split(' ')[1]}`}>{aiResult.score}/100</span>
                </div>

                {/* Score bar */}
                <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all ${level === 'STABLE' ? 'bg-emerald-500' : level === 'ELEVATED' ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${aiResult.score}%` }}
                    />
                </div>

                {/* Justification */}
                <p className="text-slate-700 text-sm leading-relaxed">{aiResult.justification}</p>

                {/* Urgent banner */}
                {aiResult.isUrgent && (
                    <div className="flex items-start gap-2.5 bg-rose-100 border border-rose-300 rounded-xl px-3 py-2.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <p className="text-rose-700 text-xs font-semibold">Please contact your doctor or caregiver immediately.</p>
                    </div>
                )}

                {/* Prevention steps */}
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Stroke Prevention Steps</p>
                    <ul className="space-y-1.5">
                        {aiResult.strokePreventionSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                <span className="mt-1 w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">{i + 1}</span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Streak & log again */}
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-auto">
                    <div className="flex items-center gap-1.5">
                        <span>🔥</span>
                        <p className="text-slate-600 text-xs font-semibold">
                            Great job, {profile?.fullName ? profile.fullName.split(' ')[0] : 'Patient'}!
                        </p>
                    </div>
                    <button onClick={reset} className="text-sm text-emerald-600 font-semibold hover:underline">
                        {t('dashboard.vitals.submitAnother')}
                    </button>
                </div>
            </div>
        )
    }

    // ── Form ──────────────────────────────────────────────────────────────────
    const step1Valid = !!systolic && !!diastolic && !!heartRate
    const step2Valid = true // lifestyle fields are optional
    const TOTAL_STEPS = 3

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                        <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">{t('dashboard.vitals.title')}</h2>
                        <p className="text-slate-400 text-xs">{t('dashboard.vitals.subtitle')}</p>
                    </div>
                </div>
                {/* Step dots */}
                <div className="flex items-center gap-1.5">
                    {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(s => (
                        <div key={s} className={`h-1.5 rounded-full transition-all ${step === s ? 'w-6 bg-emerald-500' : step > s ? 'w-3 bg-emerald-300' : 'w-3 bg-slate-200'}`} />
                    ))}
                </div>
            </div>

            <div className="flex-1 p-4 sm:p-6">
                {/* ── STEP 1: Blood Pressure & Heart Rate ── */}
                {step === 1 && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {t('dashboard.vitals.bloodPressure')} <span className="text-slate-400 font-normal">(mmHg)</span>
                            </label>
                            <div className="flex flex-wrap gap-3 items-center">
                                <input
                                    type="number" placeholder={t('dashboard.vitals.systolic')} value={systolic}
                                    onChange={e => setSystolic(e.target.value)}
                                    className="flex-1 min-w-[100px] text-base border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50 placeholder:text-slate-300"
                                />
                                <span className="text-slate-400 font-bold">/</span>
                                <input
                                    type="number" placeholder={t('dashboard.vitals.diastolic')} value={diastolic}
                                    onChange={e => setDiastolic(e.target.value)}
                                    className="flex-1 min-w-[100px] text-base border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50 placeholder:text-slate-300"
                                />
                            </div>
                            {systolic && parseInt(systolic) > 140 && (
                                <p className="text-amber-600 text-xs mt-1.5 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> {t('dashboard.vitals.aboveRange')} (≤ 140)
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {t('dashboard.vitals.heartRate')} <span className="text-slate-400 font-normal">(bpm)</span>
                            </label>
                            <input
                                type="number" placeholder="e.g. 72" value={heartRate}
                                onChange={e => setHeartRate(e.target.value)}
                                className="w-full text-base border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50 placeholder:text-slate-300"
                            />
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            disabled={!step1Valid}
                            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* ── STEP 2: Lifestyle ── */}
                {step === 2 && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <Activity className="inline w-4 h-4 mr-1 text-emerald-500" />
                                Daily Steps <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="number" placeholder="e.g. 8000" value={dailySteps}
                                onChange={e => setDailySteps(e.target.value)}
                                className="w-full text-base border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50 placeholder:text-slate-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Sleep Hours <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="number" step="0.5" placeholder="e.g. 7.5" value={sleepHours}
                                onChange={e => setSleepHours(e.target.value)}
                                className="w-full text-base border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50 placeholder:text-slate-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <Pill className="inline w-4 h-4 mr-1 text-emerald-500" />
                                Current Medications <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="text" placeholder="e.g. Amlodipine 5mg" value={medications}
                                onChange={e => setMedications(e.target.value)}
                                className="w-full text-base border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50 placeholder:text-slate-300"
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 min-w-[100px] bg-slate-50 border border-slate-200 text-slate-600 font-semibold py-3.5 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-1"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!step2Valid}
                                className="flex-1 min-w-[140px] bg-emerald-600 text-white font-bold py-3.5 rounded-2xl hover:bg-emerald-700 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 3: Symptoms & Submit ── */}
                {step === 3 && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                {t('dashboard.vitals.symptomsTitle')}
                                <span className="text-slate-400 font-normal ml-1">{t('dashboard.vitals.symptomsSubtitle')}</span>
                            </label>
                            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                                {SYMPTOMS.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => toggleSymptom(s)}
                                        className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left flex items-center gap-2 ${symptoms.includes(s)
                                            ? 'bg-rose-50 border-rose-300 text-rose-700'
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${symptoms.includes(s) ? 'bg-rose-500 border-rose-500' : 'border-slate-300'}`}>
                                            {symptoms.includes(s) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                        </span>
                                        <span className="truncate">{s}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea
                            placeholder="Any additional notes for your doctor... (optional)"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={2}
                            className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50 placeholder:text-slate-300 resize-none"
                        />

                        {error && (
                            <p className="text-rose-600 text-xs flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" /> {error}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 min-w-[100px] bg-slate-50 border border-slate-200 text-slate-600 font-semibold py-3.5 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-1"
                            >
                                <ChevronLeft className="w-4 h-4" /> {t('dashboard.vitals.back')}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 min-w-[140px] bg-emerald-600 text-white font-bold py-3.5 rounded-2xl hover:bg-emerald-700 transition-all shadow-md disabled:opacity-40 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loading
                                    ? <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    : <><CheckCircle2 className="w-5 h-5" /> {t('dashboard.vitals.submitLog')}</>
                                }
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DailyLogCard