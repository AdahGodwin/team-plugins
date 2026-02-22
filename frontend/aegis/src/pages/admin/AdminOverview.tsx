import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Users, AlertTriangle, ClipboardList, Heart, ArrowRight,
    Clock, AlertCircle, Loader2, Activity, Mail, CheckCircle2,
} from 'lucide-react'
import { fetchDashboard, sendDailyReminders } from '../../api/patientService'
import type { DashboardData, RecentActivityItem } from '../../types/dashboard.types'
import { timeAgo } from '../../utils/dateUtils'
import StatCard from '../../components/admin/StatCard'
import RiskBadge from '../../components/admin/RiskBadge'
import type { RiskLevel } from '../../types/patient.types'

function toRiskLevel(raw: RecentActivityItem['riskLevel']): RiskLevel {
    const map: Record<RecentActivityItem['riskLevel'], RiskLevel> = {
        HIGH: 'high',
        ELEVATED: 'moderate',
        STABLE: 'low',
    }
    return map[raw]
}

function SkeletonBar({ w = 'w-full' }: { w?: string }) {
    return <div className={`h-3 bg-slate-100 rounded-full animate-pulse ${w}`} />
}

export default function AdminOverview() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // ── Daily reminder state ───────────────────────────────────────────────
    const [reminderState, setReminderState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
    const [reminderMessage, setReminderMessage] = useState('')

    const handleSendReminders = async () => {
        if (reminderState === 'sending') return
        setReminderState('sending')
        setReminderMessage('')
        try {
            const result = await sendDailyReminders()
            setReminderState('success')
            setReminderMessage(result.message)
        } catch (err: any) {
            setReminderState('error')
            setReminderMessage(err.response?.data?.error ?? 'Failed to send reminders. Please try again.')
        } finally {
            // Reset back to idle after 5 seconds
            setTimeout(() => {
                setReminderState('idle')
                setReminderMessage('')
            }, 5000)
        }
    }

    useEffect(() => {
        fetchDashboard()
            .then(setData)
            .catch(() => setError('Failed to load dashboard. Please refresh.'))
            .finally(() => setLoading(false))
    }, [])

    const stats = data?.stats
    const dist = data?.riskDistribution
    const activity = data?.recentActivity ?? []
    const openEmergencies = data?.openEmergencies ?? 0

    const riskRows = dist
        ? [
              { level: 'High',     count: dist.high,     barColor: 'bg-rose-500',   textColor: 'text-rose-600'   },
              { level: 'Elevated', count: dist.elevated, barColor: 'bg-amber-500',  textColor: 'text-amber-600'  },
              { level: 'Stable',   count: dist.stable,   barColor: 'bg-emerald-500', textColor: 'text-emerald-600' },
          ]
        : []

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Patient monitoring summary ·{' '}
                        {new Date().toLocaleDateString('en-GB', {
                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                        })}
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Daily reminder button */}
                    <button
                        onClick={handleSendReminders}
                        disabled={reminderState === 'sending'}
                        className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors disabled:cursor-not-allowed
                            ${reminderState === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : reminderState === 'error'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                    >
                        {reminderState === 'sending' && <Loader2 className="w-3 h-3 animate-spin" />}
                        {reminderState === 'success' && <CheckCircle2 className="w-3 h-3" />}
                        {reminderState === 'error'   && <AlertCircle  className="w-3 h-3" />}
                        {reminderState === 'idle'    && <Mail          className="w-3 h-3" />}
                        {reminderState === 'sending' ? 'Sending…'
                            : reminderState === 'success' ? reminderMessage || 'Reminders sent!'
                            : reminderState === 'error'   ? 'Failed — retry?'
                            : 'Send Daily Reminders'}
                    </button>

                    {openEmergencies > 0 && (
                        <Link
                            to="/portal/emergencies"
                            className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-full animate-pulse hover:bg-rose-100 transition-colors"
                        >
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                            {openEmergencies} Open Emergency Alert{openEmergencies !== 1 ? 's' : ''}
                        </Link>
                    )}
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    <p className="text-sm text-rose-700 font-medium">{error}</p>
                    <button
                        onClick={() => { setError(null); setLoading(true); fetchDashboard().then(setData).catch(() => setError('Failed to load dashboard. Please refresh.')).finally(() => setLoading(false)) }}
                        className="ml-auto text-xs font-bold text-rose-600 underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Stat cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Patients"
                    value={loading ? '—' : (stats?.totalPatients ?? 0)}
                    Icon={Users}
                    iconBg="bg-slate-100"
                    iconColor="text-slate-600"
                    sub="Across all risk levels"
                />
                <StatCard
                    label="High-Risk Cases"
                    value={loading ? '—' : (stats?.highRiskCases ?? 0)}
                    Icon={AlertTriangle}
                    iconBg="bg-rose-50"
                    iconColor="text-rose-500"
                    sub="Requiring urgent attention"
                />
                <StatCard
                    label="Logs Today"
                    value={loading ? '—' : (stats?.logsToday ?? 0)}
                    Icon={ClipboardList}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-500"
                    sub="Health logs submitted"
                />
                <StatCard
                    label="Active Caretakers"
                    value={loading ? '—' : (stats?.activeCaretakers ?? 0)}
                    Icon={Heart}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-500"
                    sub="Assigned to patients"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* ── Recent activity feed ─────────────────────────────── */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-bold text-slate-900 text-sm">Recent Activity</h2>
                        <Link
                            to="/portal/patients"
                            className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Loading state */}
                    {loading && (
                        <ul className="divide-y divide-slate-100">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <li key={i} className="flex items-center gap-4 px-6 py-4">
                                    <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <SkeletonBar w="w-1/3" />
                                        <SkeletonBar w="w-1/2" />
                                    </div>
                                    <SkeletonBar w="w-16" />
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Data */}
                    {!loading && activity.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                            <Activity className="w-8 h-8 text-slate-300 mb-3" />
                            <p className="text-sm text-slate-500 font-medium">No recent activity</p>
                            <p className="text-xs text-slate-400">Patient logs will appear here as they come in.</p>
                        </div>
                    )}

                    {!loading && activity.length > 0 && (
                        <ul className="divide-y divide-slate-100">
                            {activity.map((entry) => (
                                <li key={entry.logId}>
                                    <Link
                                        to={`/portal/patients/${entry.patientId}`}
                                        className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                            {entry.fullName[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{entry.fullName}</p>
                                            <p className="text-xs text-slate-400 truncate">
                                                BP {entry.systolic}/{entry.diastolic} mmHg · HR {entry.heartRate} bpm
                                                {entry.symptoms.length > 0 && (
                                                    <> · <span className="text-amber-600">{entry.symptoms.slice(0, 2).join(', ')}{entry.symptoms.length > 2 ? '…' : ''}</span></>
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                                            <RiskBadge level={toRiskLevel(entry.riskLevel)} />
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {timeAgo(entry.loggedAt)}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ── Risk distribution ────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="font-bold text-slate-900 text-sm mb-5">Risk Distribution</h2>

                    {loading && (
                        <div className="space-y-5">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between">
                                        <SkeletonBar w="w-16" />
                                        <SkeletonBar w="w-10" />
                                    </div>
                                    <div className="h-2.5 bg-slate-100 rounded-full animate-pulse" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && dist && (
                        <>
                            {riskRows.map(({ level, count, barColor, textColor }) => (
                                <div key={level} className="mb-4 last:mb-0">
                                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                                        <span className={textColor}>{level} Risk</span>
                                        <span className="text-slate-500">{count} / {dist.total}</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${barColor} rounded-full transition-all`}
                                            style={{ width: dist.total > 0 ? `${(count / dist.total) * 100}%` : '0%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Open emergencies mini-stat */}
                    {!loading && (
                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-semibold">Open Emergencies</span>
                            <span className={`text-sm font-extrabold ${openEmergencies > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {openEmergencies > 0
                                    ? <>{openEmergencies} <span className="text-xs font-semibold">pending</span></>
                                    : 'All clear'}
                            </span>
                        </div>
                    )}

                    <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quick Actions</p>
                        <Link
                            to="/portal/patients"
                            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                        >
                            View All Patients <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                            to="/portal/emergencies"
                            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
                        >
                            {openEmergencies > 0
                                ? <><span>View Emergencies</span><span className="bg-rose-500 text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold">{openEmergencies}</span></>
                                : <><span>View Emergencies</span><ArrowRight className="w-3.5 h-3.5" /></>}
                        </Link>
                    </div>

                    {/* Loading spinner overlay */}
                    {loading && (
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-xs mt-4">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading stats…
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

