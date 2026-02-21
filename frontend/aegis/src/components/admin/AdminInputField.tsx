import type { InputHTMLAttributes } from 'react'

interface AdminInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    hint?: string
}

export default function AdminInputField({ label, hint, className = '', ...inputProps }: AdminInputFieldProps) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                {label}
                {hint && (
                    <span className="ml-1 font-normal text-slate-400 normal-case tracking-normal">
                        ({hint})
                    </span>
                )}
            </label>
            <input
                {...inputProps}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            />
        </div>
    )
}
