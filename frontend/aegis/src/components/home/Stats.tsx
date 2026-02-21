const stats = [
    { value: '68%', label: 'of stroke survivors experience relapse', sublabel: 'within 5 years of first stroke' },
    { value: '80%', label: 'of relapses are preventable', sublabel: 'with consistent behavioral monitoring' },
    { value: '3x', label: 'higher risk when care continuity breaks', sublabel: 'after hospital discharge' },
    { value: '24/7', label: 'continuous monitoring', sublabel: 'by your AI health partner' },
]

const Stats = () => {
    return (
        <section className="bg-slate-900 py-20">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-center text-slate-400 text-sm font-medium uppercase tracking-widest mb-12">
                    The problem we're solving
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.value} className="text-center">
                            <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                                {stat.value}
                            </div>
                            <p className="text-white font-semibold text-sm mb-1">{stat.label}</p>
                            <p className="text-slate-500 text-xs">{stat.sublabel}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Stats
