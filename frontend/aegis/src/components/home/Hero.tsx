import { PlayCircle, ChevronDown } from 'lucide-react'

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-16">
            {/* Animated background gradient blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-3xl" />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping absolute" />
                    <span className="w-2 h-2 rounded-full bg-blue-400 relative" />
                    <span className="text-blue-300 text-sm font-medium">AI-Powered Stroke Prevention & Recovery</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                    From Prevention to Recovery{' '}
                    <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                        AI That Has Your Back.
                    </span>
                </h1>

                {/* Subtext */}
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
                    Aegis AI helps prevent strokes before they happen and supports recovery after one. Log your health daily, receive personalized preventive guidance, and let AI continuously monitor your risk — escalating to your care team the moment it matters.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <a
                        href="#"
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
                    >
                        Sign Up — It&apos;s Free
                    </a>
                    <a
                        href="#how-it-works"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-medium px-8 py-4 rounded-full hover:bg-white/10 transition-all"
                    >
                        <PlayCircle className="w-5 h-5" />
                        See How It Works
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-slate-500 text-xs">Scroll to explore</span>
                <ChevronDown className="w-5 h-5 text-slate-500" />
            </div>
        </section>
    )
}

export default Hero
