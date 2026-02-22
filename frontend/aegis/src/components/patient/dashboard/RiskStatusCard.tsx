import { RISK_CONFIG, type RiskLevel } from "../data/mockData"
import { useLanguage } from "../../../i18n/LanguageContext"

interface RiskStatusCardProps {
    risk: RiskLevel
    reason: string
}

const RiskStatusCard = ({ risk, reason }: RiskStatusCardProps) => {
    const { t } = useLanguage()
    const cfg = RISK_CONFIG[risk]
    const Icon = cfg.icon
    const riskScore = risk === 'stable' ? 22 : risk === 'elevated' ? 58 : 87

    const riskLabelKey = risk === 'stable'
        ? 'dashboard.riskStableLabel'
        : risk === 'elevated'
            ? 'dashboard.riskElevatedLabel'
            : 'dashboard.riskHighLabel'

    const riskDescKey = risk === 'stable'
        ? 'dashboard.riskLow'
        : risk === 'elevated'
            ? 'dashboard.riskModerate'
            : 'dashboard.riskHigh'

    return (
        <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-4 sm:p-6 shadow-sm`}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <p className="text-slate-500 text-sm font-medium">
                            {t('nav.dashboard') === 'Dashboard' ? "Today's Health Status"
                                : t('nav.dashboard') === 'Allon Lafiya' ? "Matsayin Lafiyar ku ta Yau"
                                    : t('nav.dashboard') === 'Ihe ngosipụta Ahụike' ? "Ọnọdụ Ahụike Gị Taa"
                                        : "Ipo Ilera Rẹ Lónìí"}
                        </p>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${cfg.border} bg-white/60 mb-3`}>
                        <Icon className={`w-4 h-4 ${cfg.text}`} />
                        <span className={`text-base font-bold ${cfg.text}`}>{t(riskLabelKey)}</span>
                    </div>
                    {/* reason is mock data in english, keep for now or wrap in t if you have specific reasons mapped */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-2">{reason}</p>
                    <p className={`text-xs font-medium ${cfg.text} leading-relaxed`}>{t(riskDescKey)}</p>
                </div>

                {/* Score meter */}
                <div className="sm:w-44 shrink-0">
                    <div className="bg-white/80 rounded-2xl border border-white p-4 shadow-sm">
                        <p className="text-slate-500 text-xs font-medium mb-2">
                            {t('nav.dashboard') === 'Dashboard' ? "Risk Score"
                                : t('nav.dashboard') === 'Allon Lafiya' ? "Makin Hadari"
                                    : t('nav.dashboard') === 'Ihe ngosipụta Ahụike' ? "Akara Ihe Ize Ndụ"
                                        : "Àmì Ewu"}
                        </p>
                        <div className="flex items-end gap-1 mb-2">
                            <span className={`text-3xl font-extrabold ${cfg.text}`}>{riskScore}</span>
                            <span className="text-slate-400 text-xs mb-1">/ 100</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${cfg.barColor} transition-all duration-700`}
                                style={{ width: `${riskScore}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>
                                {t('nav.dashboard') === 'Dashboard' ? "Safe"
                                    : t('nav.dashboard') === 'Allon Lafiya' ? "Lafiya"
                                        : t('nav.dashboard') === 'Ihe ngosipụta Ahụike' ? "Nchekwa"
                                            : "Ààbò"}
                            </span>
                            <span>
                                {t('nav.dashboard') === 'Dashboard' ? "Critical"
                                    : t('nav.dashboard') === 'Allon Lafiya' ? "Gaggawa"
                                        : t('nav.dashboard') === 'Ihe ngosipụta Ahụike' ? "Dị mkpa"
                                            : "Gìrì"}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default RiskStatusCard