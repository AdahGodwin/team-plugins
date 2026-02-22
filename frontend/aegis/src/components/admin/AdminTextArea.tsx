import type { TextareaHTMLAttributes } from 'react'

interface AdminTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
}

export default function AdminTextArea({ label, className = '', ...textareaProps }: AdminTextAreaProps) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                {label}
            </label>
            <textarea
                {...textareaProps}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 resize-none transition-all disabled:opacity-50 ${className}`}
            />
        </div>
    )
}
