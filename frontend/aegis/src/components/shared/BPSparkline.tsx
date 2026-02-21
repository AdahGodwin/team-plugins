import { MOCK_BP_HISTORY } from "../patient/data/mockData"

const BPSparkline = () => {
    const maxSys = Math.max(...MOCK_BP_HISTORY.map(d => d.sys))
    const minSys = Math.min(...MOCK_BP_HISTORY.map(d => d.sys))
    const range  = maxSys - minSys || 1
    const h = 48, w = 100

    const points = MOCK_BP_HISTORY.map((d, i) => {
        const x = (i / (MOCK_BP_HISTORY.length - 1)) * w
        const y = h - ((d.sys - minSys) / range) * (h - 8) - 4
        return `${x},${y}`
    }).join(' ')

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12" preserveAspectRatio="none">
            <defs>
                <linearGradient id="bpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
            </defs>
            <polyline
                points={points}
                fill="none"
                stroke="url(#bpGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default BPSparkline