import { ShieldCheck } from 'lucide-react'

export default function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 gap-8">
            <div className="relative flex items-center justify-center w-24 h-24">

                <svg
                    className="absolute inset-0 w-full h-full animate-spin"
                    viewBox="0 0 96 96"
                    fill="none"
                >
                    <circle
                        cx="48" cy="48" r="44"
                        stroke="#e2e8f0"
                        strokeWidth="6"
                    />
                    <path
                        d="M48 4 a44 44 0 0 1 44 44"
                        stroke="url(#spinGrad)"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg animate-pulse">
                    <ShieldCheck className="w-7 h-7 text-white" />
                </div>
            </div>

            <div className="flex flex-col items-center gap-1">
                <p className="text-slate-900 font-extrabold text-2xl tracking-tight">Aegis</p>
                <p className="text-slate-400 text-sm font-medium">Loading your health data…</p>
            </div>

            <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map(i => (
                    <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-linear-to-br from-blue-500 to-teal-500 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>

        </div>
    )
}