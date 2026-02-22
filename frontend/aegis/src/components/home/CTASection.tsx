import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const avatars = [
    { color: 'bg-emerald-500', initial: 'P' },
    { color: 'bg-emerald-600', initial: 'K' },
    { color: 'bg-slate-400', initial: 'A' },
    { color: 'bg-emerald-700', initial: 'M' },
    { color: 'bg-emerald-800', initial: 'T' },
]

const images = [
    { src: 'https://images.unsplash.com/photo-1559000357-f6b52ddfbe37?w=400&q=80', alt: 'Doctor reviewing patient data' },
    { src: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&q=80', alt: 'Patient using health monitoring app' },
    { src: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=400&q=80', alt: 'Family member supporting recovery' },
]

const CTASection = () => {
    return (
        <section className="relative bg-slate-50 py-24 overflow-hidden">

            {/* Background blobs — simplified Emerald/Slate */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -right-32 w-125 h-125 bg-emerald-50 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-32 -left-32 w-125 h-100 bg-slate-100 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="relative max-w-4xl mx-auto px-6 text-center">

                {/* Image row — match auth carousel card style */}
                <div className="flex gap-3 mb-12 justify-center">
                    {images.map(({ src, alt }, i) => (
                        <div
                            key={alt}
                            className={`flex-1 rounded-2xl overflow-hidden shadow-md border border-slate-200 ring-1 ring-slate-100 h-40 ${i === 1 ? 'h-48 -mt-4' : ''
                                }`}
                        >
                            <img src={src} alt={alt} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                {/* Section label — auth pill style */}
                <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center gap-2 border border-emerald-100 bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Get Started Today
                    </span>
                </div>

                {/* Heading */}
                <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                    Your Health Partner,{' '}
                    <span className="text-emerald-600">
                        Always On.
                    </span>
                </h2>

                <p className="text-slate-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join Aegis AI and take control of your stroke prevention and recovery journey — backed by continuous AI monitoring and intelligent care escalation.
                </p>

                {/* CTAs — exact match to auth buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                    <Link
                        to="/auth/register"
                        className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-emerald-700 transition-all hover:shadow-lg shadow-md active:scale-[0.98]"
                    >
                        <ShieldCheck className="w-5 h-5" />
                        Create an Account
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        to="/auth"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        Sign In
                    </Link>
                </div>

                {/* Trust line — matches auth disclaimer style */}
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-12">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Free to start · HIPAA-compliant · No credit card required
                </div>

                {/* Social proof — white card style */}
                <div className="inline-flex flex-col items-center gap-4 bg-white border border-slate-200 rounded-2xl shadow-sm ring-1 ring-slate-100 px-8 py-5">
                    <div className="flex -space-x-3">
                        {avatars.map((avatar, i) => (
                            <div
                                key={i}
                                className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold ${avatar.color} shadow-sm`}
                            >
                                {avatar.initial}
                            </div>
                        ))}
                    </div>
                    <p className="text-slate-500 text-sm">
                        <span className="text-slate-900 font-bold">500+ patients</span>{' '}
                        already protected by Aegis AI
                    </p>
                </div>

            </div>
        </section>
    )
}

export default CTASection