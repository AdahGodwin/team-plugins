import { useState } from 'react'
import { ClipboardList, CheckCircle2, AlertTriangle } from 'lucide-react'
import { SYMPTOMS, MOCK_PATIENT } from '../data/mockData'
import { useLanguage } from '../../../i18n/LanguageContext'

const DailyLogCard = () => {
    const { t } = useLanguage()
    const [systolic, setSystolic] = useState('')
    const [diastolic, setDiastolic] = useState('')
    const [heartRate, setHeartRate] = useState('')
    const [symptoms, setSymptoms] = useState<string[]>([])
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<1 | 2>(1)

    const toggleSymptom = (s: string) =>
        setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

    const handleSubmit = () => {
        setLoading(true)
        setTimeout(() => { setLoading(false); setSubmitted(true) }, 1200)
    }

    const reset = () => {
        setSubmitted(false); setSystolic(''); setDiastolic('')
        setHeartRate(''); setSymptoms([]); setStep(1)
    }

    if (submitted) {
        return (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8 flex flex-col items-center text-center gap-4 shadow-sm h-full justify-center">
                <div className="relative">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 animate-ping" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{t('dashboard.vitals.successTitle')}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        {t('dashboard.vitals.successSubtitle')}
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-emerald-200 rounded-2xl px-4 py-2">
                    <span className="text-2xl">🔥</span>
                    <div className="text-left">
                        <p className="text-slate-800 font-bold text-sm">
                            {(MOCK_PATIENT.streakDays + 1).toString()}-{'day streak!'}
                        </p>
                        <p className="text-slate-400 text-xs">Keep it up, {MOCK_PATIENT.name}</p>
                    </div>
                </div>
                <button onClick={reset} className="text-sm text-emerald-600 font-semibold hover:underline">
                    {t('dashboard.vitals.submitAnother')}
                </button>
            </div>
        )
    }

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
                    {[1, 2].map(s => (
                        <div key={s} className={`h-1.5 rounded-full transition-all ${step === s ? 'w-6 bg-emerald-500' : 'w-3 bg-slate-200'}`} />
                    ))}
                </div>
            </div>

            <div className="flex-1 p-4 sm:p-6">
                {step === 1 ? (
                    <div className="space-y-5">
                        {/* BP */}
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
                        {/* Heart Rate */}
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
                            disabled={!systolic || !diastolic || !heartRate}
                            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            {t('dashboard.vitals.nextSymptoms')}
                        </button>
                    </div>
                ) : (
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
                                        <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${symptoms.includes(s) ? 'bg-rose-500 border-rose-500' : 'border-slate-300'
                                            }`}>
                                            {symptoms.includes(s) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                        </span>
                                        <span className="truncate">{s}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 min-w-[100px] bg-slate-50 border border-slate-200 text-slate-600 font-semibold py-3.5 rounded-2xl hover:bg-slate-100 transition-all"
                            >
                                {t('dashboard.vitals.back')}
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