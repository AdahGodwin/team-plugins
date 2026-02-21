import { useState } from 'react'
import { Printer, Download, X } from 'lucide-react'
import { MOCK_PATIENT, MOCK_BP_HISTORY, RISK_CONFIG } from '../data/mockData'
import BPSparkline from '../../shared/BPSparkline'

const HealthReportButton = () => {
    const [open, setOpen] = useState(false)
    const cfg = RISK_CONFIG[MOCK_PATIENT.riskLevel]

    return (
        <>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <Printer className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Health Report</h2>
                        <p className="text-slate-400 text-xs">Last 7 days summary</p>
                    </div>
                </div>
                {/* Chart preview */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
                    <p className="text-slate-400 text-xs mb-2">Blood Pressure — 7 days</p>
                    <BPSparkline />
                </div>
                <button
                    onClick={() => setOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                >
                    <Download className="w-5 h-5 text-blue-500" />
                    Download Health Report
                </button>
            </div>

            {open && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">Health Report</h3>
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
                            <p className="text-slate-500 text-xs font-medium mb-1">Systolic BP — Last 7 days</p>
                            <BPSparkline />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                {MOCK_BP_HISTORY.map(d => <span key={d.day}>{d.day}</span>)}
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            {[
                                { label: 'Current Risk Level',       value: cfg.label,                                                 valueClass: cfg.text         },
                                { label: '7-Day Avg Blood Pressure', value: MOCK_PATIENT.bpAvg + ' mmHg',                             valueClass: 'text-slate-900' },
                                { label: 'Medication Adherence',     value: `${MOCK_PATIENT.medicationAdherence}%`,                   valueClass: 'text-slate-900' },
                                { label: 'Recent Symptoms',          value: MOCK_PATIENT.recentSymptoms.join(', ') || 'None reported', valueClass: 'text-slate-900' },
                                { label: 'Last Log Submitted',       value: MOCK_PATIENT.lastLog,                                      valueClass: 'text-slate-900' },
                                { label: 'Next Appointment',         value: MOCK_PATIENT.nextAppointment,                              valueClass: 'text-blue-600'  },
                            ].map(({ label, value, valueClass }) => (
                                <div key={label} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-slate-500 text-sm">{label}</span>
                                    <span className={`font-bold text-sm ${valueClass}`}>{value}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="w-full bg-linear-to-r from-blue-500 to-teal-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all"
                        >
                            <Download className="w-5 h-5" /> Save as PDF
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default HealthReportButton