import { ShieldCheck, Twitter, Linkedin, Github, CircleDot } from 'lucide-react'
import { Link } from 'react-router-dom'

const footerLinks = {
    Product:  ['How It Works', 'Risk Monitor', 'For Clinicians', 'Mobile App'],
    Company:  ['About Us', 'Blog', 'Research', 'Careers'],
    Legal:    ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Cookie Policy'],
    Support:  ['Help Center', 'Contact Us', 'Report an Issue', 'Community'],
}

const socialLinks = [
    { platform: 'Twitter',  Icon: Twitter  },
    { platform: 'LinkedIn', Icon: Linkedin },
    { platform: 'GitHub',   Icon: Github   },
]

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-200">
            <div className="max-w-6xl mx-auto px-6 py-16">

                <div className="grid md:grid-cols-5 gap-12 mb-12">

                    {/* Brand — matches auth navbar logo */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-sm">
                                <ShieldCheck className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-extrabold text-base text-slate-800 tracking-tight">Aegis</span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed mb-5">
                            AI-powered stroke prevention & recovery. Your health, always protected.
                        </p>
                        <div className="flex gap-2">
                            {socialLinks.map(({ platform, Icon }) => (
                                <a
                                    key={platform}
                                    href="#"
                                    className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                                    aria-label={platform}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-slate-800 font-bold text-sm mb-4">{category}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-slate-500 text-sm hover:text-slate-800 transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-400 text-sm">
                        © {new Date().getFullYear()} Aegis. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <CircleDot className="w-3 h-3 text-teal-500" />
                        All systems operational
                    </div>

                    <p className="text-slate-400 text-sm">
                        Built with ❤️ for stroke survivors everywhere.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer