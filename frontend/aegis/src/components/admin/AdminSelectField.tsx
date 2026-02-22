import type { SelectHTMLAttributes } from 'react'

interface AdminSelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    options: { value: string; label: string }[]
}

export default function AdminSelectField({ label, options, className = '', ...selectProps }: AdminSelectFieldProps) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                {label}
            </label>
            <select
                {...selectProps}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
