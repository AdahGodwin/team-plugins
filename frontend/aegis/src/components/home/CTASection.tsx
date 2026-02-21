const avatars = [
    { color: '#60a5fa', initial: 'P' },
    { color: '#a78bfa', initial: 'K' },
    { color: '#34d399', initial: 'A' },
    { color: '#f87171', initial: 'M' },
    { color: '#fbbf24', initial: 'T' },
]

const CTASection = () => {
    return (
        <section className="relative bg-white py-24 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-50 to-transparent" />
            </div>

            <div className="relative max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                    Your Health Partner,{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                        Always On.
                    </span>
                </h2>

                <p className="text-slate-500 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join Aegis AI and take control of your stroke prevention and recovery journey — backed by continuous AI monitoring and intelligent care escalation.
                </p>

                {/* Auth CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <a
                        href="#"
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
                    >
                        Create an Account
                    </a>
                    <a
                        href="#"
                        className="w-full sm:w-auto border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-full hover:border-blue-300 hover:text-blue-600 transition-all"
                    >
                        Sign In
                    </a>
                </div>

                <p className="text-slate-400 text-sm mb-12">
                    Free to start · HIPAA-compliant · No credit card required
                </p>

                {/* Social proof */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex -space-x-3">
                        {avatars.map((avatar, i) => (
                            <div
                                key={i}
                                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: avatar.color }}
                            >
                                {avatar.initial}
                            </div>
                        ))}
                    </div>
                    <p className="text-slate-500 text-sm">
                        <span className="text-slate-900 font-semibold">500+ patients</span> already using Aegis AI
                    </p>
                </div>
            </div>
        </section>
    )
}

export default CTASection
