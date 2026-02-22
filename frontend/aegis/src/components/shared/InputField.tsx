import { CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

export interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  hint?: string;
  icon?: React.ReactNode;
  error?: string;
  success?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
  optional?: boolean;
}

export default function InputField({
  label, type, placeholder, hint, icon, error,
  success, value, onChange, rightElement, optional,
}: InputFieldProps) {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </label>
        {optional && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400">{t('common.optional' as any)}</span>
        )}
      </div>
      <div className="relative flex items-center">
        {icon && (
          <span className={`absolute left-3.5 transition-colors ${error ? "text-red-400" : success ? "text-emerald-500" : "text-slate-400"}`}>
            {icon}
          </span>
        )}
        <input
          type={type} placeholder={placeholder} value={value} onChange={onChange}
          className={`w-full rounded-xl border py-3.5 text-base text-slate-800 placeholder-slate-300 outline-none transition-all duration-200
            ${icon ? "pl-11" : "pl-4"}
            ${rightElement ? "pr-12" : success ? "pr-10" : "pr-4"}
            ${error
              ? "border-red-300 bg-red-50/60 focus:border-red-400 focus:ring-4 focus:ring-red-100"
              : success
                ? "border-emerald-300 bg-emerald-50/40 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                : "border-slate-200 bg-slate-50 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            }`}
        />
        {rightElement && (
          <button type="button" className="absolute right-3.5 text-slate-400 transition hover:text-slate-600">
            {rightElement}
          </button>
        )}
        {success && !rightElement && (
          <CheckCircle2 className="absolute right-3.5 text-emerald-500" size={16} />
        )}
      </div>
      {error && <p className="flex items-center gap-1 text-sm text-red-500"><AlertCircle size={13} className="shrink-0" /> {error}</p>}
      {hint && !error && <p className="text-sm text-slate-400">{hint}</p>}
    </div>
  );
}