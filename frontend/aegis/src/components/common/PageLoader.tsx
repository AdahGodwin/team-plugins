import { Shield } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

export default function PageLoader() {
    const { t } = useLanguage()
    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-3xl bg-emerald-600/10 flex items-center justify-center animate-pulse">
                    <Shield className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="absolute inset-0 border-4 border-emerald-600/20 border-t-emerald-600 rounded-3xl animate-spin" />
            </div>

            <div className="space-y-2">
                <p className="text-slate-900 font-extrabold text-2xl tracking-tight">{t('common.brand' as any)}</p>
                <p className="text-slate-400 text-sm font-medium">Loading your health data…</p>
            </div>

            <div className="mt-8 flex items-center gap-2">
                {[0, 1, 2, 3].map(i => (
                    <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    )
}
