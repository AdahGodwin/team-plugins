import { useState } from 'react'
import { Printer, Download, X } from 'lucide-react'
import { MOCK_PATIENT, MOCK_BP_HISTORY, RISK_CONFIG } from '../data/mockData'
import BPSparkline from '../../shared/BPSparkline'
import { useLanguage } from '../../../i18n/LanguageContext'

const HealthReportButton = () => {
    const { t } = useLanguage()
    const [open, setOpen] = useState(false)
    const cfg = RISK_CONFIG[MOCK_PATIENT.riskLevel]

    return (
        <>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm ring-1 ring-slate-50">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                        <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">{t('dashboard.report.title')}</h2>
                        <p className="text-slate-400 text-xs">{t('dashboard.report.subtitle')}</p>
                    </div>
                </div>
                {/* Chart preview */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
                    <p className="text-slate-400 text-xs mb-2">{t('dashboard.report.chartTitle')}</p>
                    <BPSparkline />
                </div>
                <button
                    onClick={() => setOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                >
                    <Download className="w-5 h-5 text-emerald-500" />
                    {t('dashboard.report.downloadButton')}
                </button>
            </div>

            {open && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">{t('dashboard.report.title')}</h3>
                                <p className="text-slate-400 text-sm">
                                    {MOCK_PATIENT.fullName} · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <button onClick={() => setOpen(false)} className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Chart in modal */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-5">
                            <p className="text-slate-500 text-xs font-medium mb-1">{t('dashboard.report.chartTitle')}</p>
                            <BPSparkline />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                {MOCK_BP_HISTORY.map(d => <span key={d.day}>{d.day}</span>)}
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            {[
                                {
                                    label: t('dashboard.report.currentRisk'),
                                    value: MOCK_PATIENT.riskLevel === 'stable' ? t('dashboard.riskStableLabel') :
                                        MOCK_PATIENT.riskLevel === 'elevated' ? t('dashboard.riskElevatedLabel') :
                                            t('dashboard.riskHighLabel'),
                                    valueClass: cfg.text
                                },
                                { label: t('dashboard.report.avgBp'), value: MOCK_PATIENT.bpAvg + ' mmHg', valueClass: 'text-slate-900' },
                                { label: t('dashboard.report.medAdherence'), value: `${MOCK_PATIENT.medicationAdherence}%`, valueClass: 'text-slate-900' },
                                { label: t('dashboard.report.recentSymptoms'), value: MOCK_PATIENT.recentSymptoms.join(', ') || t('dashboard.report.noneReported'), valueClass: 'text-slate-900' },
                                { label: t('dashboard.report.lastLog'), value: MOCK_PATIENT.lastLog, valueClass: 'text-slate-900' },
                                { label: t('dashboard.report.nextAppt'), value: MOCK_PATIENT.nextAppointment, valueClass: 'text-emerald-600' },
                            ].map(({ label, value, valueClass }) => (
                                <div key={label} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-slate-500 text-sm">{label}</span>
                                    <span className={`font-bold text-sm ${valueClass}`}>{value}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:bg-emerald-700 transition-all"
                        >
                            <Download className="w-5 h-5" /> {t('dashboard.report.savePdf')}
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default HealthReportButton
