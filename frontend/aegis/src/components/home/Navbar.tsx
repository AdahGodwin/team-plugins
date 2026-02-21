import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Menu, X } from 'lucide-react'

const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Risk Monitor', href: '#risk' },
    { label: 'For Clinicians', href: '#escalation' },
]

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 py-2 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

                <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-extrabold text-base text-slate-800 tracking-tight">
                        Aegis
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors font-medium"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <Link
                        to="/auth"
                        className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/auth/register"
                        className="text-sm font-bold bg-linear-to-r from-blue-500 to-teal-500 text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all hover:shadow-md shadow-sm active:scale-[0.98]"
                    >
                        Get Started
                    </Link>
                </div>

                <button
                    className="md:hidden text-slate-600 hover:text-slate-900 transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 px-6 py-5 flex flex-col gap-4 shadow-lg">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="h-px bg-slate-100" />
                    <Link
                        to="/auth"
                        className="text-sm font-semibold text-slate-600 text-center"
                        onClick={() => setMobileOpen(false)}
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/auth/register"
                        className="text-sm font-bold bg-linear-to-r from-blue-500 to-teal-500 text-white px-4 py-3 rounded-xl text-center hover:opacity-90 transition-all"
                        onClick={() => setMobileOpen(false)}
                    >
                        Get Started
                    </Link>
                </div>
            )}
        </nav>
    )
}

export default Navbar