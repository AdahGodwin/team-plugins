import { PlayCircle, ChevronDown, ShieldCheck, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 pt-16">

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -right-32 w-150 h-150 bg-teal-100/60 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-150 h-150 bg-blue-100/60 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-100/40 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 w-full py-20">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    <div className="text-left">

                        <div className="inline-flex items-center gap-2 border border-blue-100 bg-blue-50 rounded-full px-4 py-1.5 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
                                AI-Powered Stroke Prevention & Recovery
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
                            From Prevention{' '}
                            <br className="hidden md:block" />
                            to Recovery —{' '}
                            <span className="bg-linear-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                                AI That Has Your Back.
                            </span>
                        </h1>

                        <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg">
                            Aegis AI helps prevent strokes before they happen and supports recovery after one. Log your health daily, receive personalised guidance, and let AI continuously monitor your risk.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start gap-3">
                            <Link
                                to="/auth/register"
                                className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-teal-500 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-95 transition-all hover:shadow-lg shadow-md active:scale-[0.98]"
                            >
                                <ShieldCheck className="w-5 h-5" />
                                Get Started — It's Free
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                            <a
                                href="#how-it-works"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <PlayCircle className="w-5 h-5 text-teal-500" />
                                See How It Works
                            </a>
                        </div>

                        <p className="mt-6 text-slate-400 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
                            No credit card required · HIPAA compliant · Free forever plan
                        </p>
                    </div>

                    <div className="relative hidden md:block">
                        <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl ring-1 ring-slate-100">
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
                                alt="Doctor using digital health monitoring tablet"
                                className="w-full h-125 object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 via-transparent to-transparent" />

                            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 shadow-xl ring-1 ring-slate-100">
                                <div className="w-3 h-3 rounded-full bg-teal-400 animate-pulse shrink-0" />
                                <div>
                                    <p className="text-slate-800 text-sm font-bold">Risk Score: Low</p>
                                    <p className="text-slate-400 text-xs">Aegis AI · Updated just now</p>
                                </div>
                            </div>

                            <div className="absolute top-6 right-6 flex items-center gap-2 bg-linear-to-r from-blue-500 to-teal-500 rounded-xl px-4 py-2 text-white text-sm font-bold shadow-lg">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                24/7 Active Monitoring
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm ring-1 ring-slate-100">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-slate-800 text-sm font-bold">Your health, always protected</p>
                                <p className="text-slate-400 text-xs">Real-time alerts · AI risk scoring · Care team sync</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-slate-400 text-xs">Scroll to explore</span>
                <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
        </section>
    )
}

export default Hero