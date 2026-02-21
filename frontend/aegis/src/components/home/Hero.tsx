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

            <div className="relative max-w-6xl mx-auto px-6 w-full py-20">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Left: Copy */}
                    <div className="text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping absolute" />
                            <span className="w-2 h-2 rounded-full bg-blue-400 relative" />
                            <span className="text-blue-300 text-sm font-medium">AI-Powered Stroke Prevention & Recovery</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                            From Prevention to Recovery{' '}
                            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                                AI That Has Your Back.
                            </span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
                            Aegis AI helps prevent strokes before they happen and supports recovery after one. Log your health daily, receive personalized preventive guidance, and let AI continuously monitor your risk — escalating to your care team the moment it matters.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-start gap-4">
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

                    {/* Right: Hero image */}
                    <div className="relative hidden md:block">
                        <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl shadow-blue-900/30">
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
                                alt="Doctor using digital health monitoring tablet"
                                className="w-full h-[480px] object-cover"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                            {/* Floating risk badge */}
                            <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                                <div>
                                    <p className="text-white text-sm font-bold">Risk Score: Low</p>
                                    <p className="text-slate-400 text-xs">Aegis AI · Updated just now</p>
                                </div>
                            </div>

                            {/* Floating stat top right */}
                            <div className="absolute top-6 right-6 bg-blue-600/90 backdrop-blur-sm rounded-xl px-4 py-2 text-white text-sm font-semibold shadow-lg">
                                24/7 Active Monitoring
                            </div>
                        </div>
                    </div>
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
