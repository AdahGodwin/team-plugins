import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Menu, X } from 'lucide-react'

const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Risk Monitor', href: '#risk' },
    { label: 'For Clinicians', href: '#escalation' },
]

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" fill="white" />
                    </div>
                    <span className="font-bold text-lg text-slate-900 tracking-tight">
                        Aegis <span className="text-blue-600">AI</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <a href="#" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                        Sign In
                    </a>
                    <a
                        href="#"
                        className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                    >
                        Sign Up
                    </a>
                </div>

                {/* Mobile burger */}
                <button
                    className="md:hidden text-slate-700"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-slate-700"
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a href="#" className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-full text-center">
                        Sign Up
                    </a>
                </div>
            )}
        </nav>
    )
}

export default Navbar
