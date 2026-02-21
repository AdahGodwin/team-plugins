import { Heart, Twitter, Linkedin, Github, CircleDot } from 'lucide-react'

const footerLinks = {
    Product: ['How It Works', 'Risk Monitor', 'For Clinicians', 'Mobile App'],
    Company: ['About Us', 'Blog', 'Research', 'Careers'],
    Legal: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Cookie Policy'],
    Support: ['Help Center', 'Contact Us', 'Report an Issue', 'Community'],
}

const socialLinks = [
    { platform: 'Twitter', Icon: Twitter },
    { platform: 'LinkedIn', Icon: Linkedin },
    { platform: 'GitHub', Icon: Github },
]

const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-slate-800">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-5 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                                <Heart className="w-4 h-4 text-white" fill="white" />
                            </div>
                            <span className="font-bold text-white">Aegis <span className="text-blue-400">AI</span></span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
                            From Data to Prevention: AI as Your Health Partner.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map(({ platform, Icon }) => (
                                <a
                                    key={platform}
                                    href="#"
                                    className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
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
                            <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-600 text-sm">
                        © {new Date().getFullYear()} Aegis AI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                        <CircleDot className="w-3 h-3 text-emerald-500" />
                        All systems operational
                    </div>
                    <p className="text-slate-600 text-sm">
                        Built with ❤️ for stroke survivors everywhere.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
