import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Filter, ChevronLeft, ChevronRight, Users, ArrowRight, Loader2 } from 'lucide-react'
import { fetchPatients } from '../../api/patientService'
import type { ApiPatient, RiskLevel } from '../../types/patient.types'
import { formatDate } from '../../utils/dateUtils'
import RiskBadge from '../../components/admin/RiskBadge'

const PAGE_SIZE = 10
const riskFilterOptions = ['all', 'low', 'moderate', 'high'] as const

export default function PatientList() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all')
    const [currentPage, setCurrentPage] = useState(1)

    const [patients, setPatients] = useState<ApiPatient[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [fetchError, setFetchError] = useState('')

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    const load = useCallback(async () => {
        setLoading(true)
        setFetchError('')
        try {
            const res = await fetchPatients({
                search: searchQuery || undefined,
                page: currentPage,
                limit: PAGE_SIZE,
            })
            // Apply client-side risk filter if server doesn't support it yet
            const filtered = riskFilter === 'all'
                ? res.patients
                : res.patients.filter((p) => p.riskLevel === riskFilter)
            setPatients(filtered)
            setTotal(riskFilter === 'all' ? res.total : filtered.length)
        } catch (err: any) {
            setFetchError(err.response?.data?.message ?? 'Failed to load patients.')
        } finally {
            setLoading(false)
        }
    }, [searchQuery, riskFilter, currentPage])

    useEffect(() => { load() }, [load])

    // Reset to page 1 on search / filter change
    const handleSearch = (value: string) => { setSearchQuery(value); setCurrentPage(1) }
    const handleRisk = (value: 'all' | RiskLevel) => { setRiskFilter(value); setCurrentPage(1) }
    const handleClear = () => { setSearchQuery(''); setRiskFilter('all'); setCurrentPage(1) }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Patients</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {total} record{total !== 1 ? 's' : ''} · page {currentPage} of {totalPages}
                    </p>
                </div>
                <Link
                    to="/portal/patients/update"
                    className="inline-flex items-center gap-2 text-sm font-semibold bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 transition-all self-start sm:self-auto"
                >
                    Update Record <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Search + filter row */}
            <div className="flex flex-col gap-3">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search by name…"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                    {riskFilterOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleRisk(option)}
                            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${riskFilter === option
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error */}
            {fetchError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">
                    {fetchError}
                </div>
            )}

            {/* Table card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-7 h-7 animate-spin text-emerald-500" />
                    </div>
                ) : patients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-slate-800 font-bold text-base mb-1">No patients found</h3>
                        <p className="text-slate-400 text-sm max-w-xs">
                            No records match your current filters.
                        </p>
                        <button onClick={handleClear} className="mt-4 text-sm font-semibold text-emerald-600 hover:underline">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-130">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                                        <th className="px-4 py-3.5">Patient</th>
                                        <th className="px-4 py-3.5 hidden md:table-cell">ID</th>
                                        <th className="px-4 py-3.5">Risk</th>
                                        <th className="px-4 py-3.5 hidden sm:table-cell">Last Log</th>
                                        <th className="px-4 py-3.5 hidden lg:table-cell">Caregiver</th>
                                        <th className="px-4 py-3.5">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {patients.map((patient) => (
                                        <tr
                                            key={patient.id}
                                            className="hover:bg-slate-50 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/portal/patients/${patient.id}`)}
                                        >
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                        {patient.firstName[0]}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-slate-900 truncate">
                                                            {patient.firstName} {patient.lastName}
                                                        </p>
                                                        <p className="text-xs text-slate-400">
                                                            {[patient.gender, patient.dateOfBirth].filter(Boolean).join(' · ')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 hidden md:table-cell">
                                                <code className="text-xs bg-slate-100 rounded px-2 py-0.5 text-slate-500 font-mono">
                                                    {patient.id.slice(0, 18)}…
                                                </code>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {patient.riskLevel
                                                    ? <RiskBadge level={patient.riskLevel} pulse={patient.riskLevel === 'high'} />
                                                    : <span className="text-slate-300 text-xs italic">—</span>
                                                }
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-500 text-xs hidden sm:table-cell">
                                                {patient.lastLog ? formatDate(patient.lastLog) : '—'}
                                            </td>
                                            <td className="px-4 py-3.5 hidden lg:table-cell">
                                                {patient.caregiverName ? (
                                                    <div>
                                                        <p className="text-slate-700 font-medium text-xs">{patient.caregiverName}</p>
                                                        <p className="text-slate-400 text-xs">{patient.caregiverPhone ?? ''}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300 text-xs italic">None assigned</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <Link
                                                    to={`/portal/patients/${patient.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1 whitespace-nowrap"
                                                >
                                                    View <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-4 py-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                            <p className="text-xs text-slate-400 truncate">
                                {Math.min((currentPage - 1) * PAGE_SIZE + 1, total)}–
                                {Math.min(currentPage * PAGE_SIZE, total)} of {total}
                            </p>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
