const stats = [
    { value: '80%', label: 'of stroke survivors experience relapse',  sublabel: 'within 5 years of first stroke'          },
    { value: '80%', label: 'of relapses are preventable',             sublabel: 'with consistent behavioural monitoring'  },
    { value: '3x',  label: 'higher risk when care continuity breaks', sublabel: 'after hospital discharge'                },
    { value: '24/7',label: 'continuous AI monitoring',                sublabel: 'by your personal health partner'         },
]

const Stats = () => {
    return (
        <section className="bg-white border-y border-slate-100 py-20">
            <div className="max-w-6xl mx-auto px-6">

                <div className="flex justify-center mb-12">
                    <span className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        The problem we're solving
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div
                            key={stat.value}
                            className="group flex flex-col items-center text-center p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-teal-200 hover:bg-teal-50/30 transition-all shadow-sm"
                        >
                            <div className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent mb-2 transition-transform group-hover:scale-105">
                                {stat.value}
                            </div>
                            <p className="text-slate-800 font-semibold text-sm mb-1 leading-snug">{stat.label}</p>
                            <p className="text-slate-400 text-xs leading-relaxed">{stat.sublabel}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Stats