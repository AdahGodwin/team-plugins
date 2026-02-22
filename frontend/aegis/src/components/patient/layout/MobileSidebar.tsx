import { ShieldCheck, LogOut, X, Flame, Calendar } from "lucide-react";
import {
  LayoutDashboard,
  ClipboardList,
  MessageCircle,
  FileText,
  Bell,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutModal from "../../auth/modal/LogoutModal";
import { MOCK_PATIENT, RISK_CONFIG } from "../data/mockData";
import AccessibilityBar from "../../common/AccessibilityBar";
import { useLanguage } from "../../../i18n/LanguageContext";

const ICON_MAP = {
  LayoutDashboard,
  ClipboardList,
  MessageCircle,
  FileText,
  Bell,
  Settings,
};

const NAV_ITEMS = [
  {
    icon: "LayoutDashboard",
    id: "dashboard",
    path: "/dashboard",
  },
  {
    icon: "ClipboardList",
    id: "log",
    path: "/dashboard/log",
  },
  { icon: "MessageCircle", id: "chat", path: "/dashboard/chat" },
  {
    icon: "FileText",
    id: "reports",
    path: "/dashboard/reports",
  },
  {
    icon: "Bell",
    id: "notifications",
    path: "/dashboard/notifications",
  },
  {
    icon: "Settings",
    id: "settings",
    path: "/dashboard/settings",
  },
];

interface MobileSidebarProps {
  onClose: () => void;
  unreadCount: number;
}

const MobileSidebar = ({ onClose, unreadCount }: MobileSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [showLogout, setShowLogout] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <div className="lg:hidden fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-slate-800 tracking-tight">
                {t('common.brand')}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Patient info + streak */}
          {(() => {
            const riskCfg = RISK_CONFIG[MOCK_PATIENT.riskLevel]
            return (
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold border-2 border-slate-100 shadow-sm shrink-0">
                  {MOCK_PATIENT.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-slate-800 font-bold text-sm truncate">{MOCK_PATIENT.fullName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${riskCfg.dot}`} />
                    <p className={`text-xs font-medium ${riskCfg.text}`}>
                      {MOCK_PATIENT.riskLevel === 'stable' ? t('dashboard.riskStableLabel') :
                        MOCK_PATIENT.riskLevel === 'elevated' ? t('dashboard.riskElevatedLabel') :
                          t('dashboard.riskHighLabel')}
                    </p>
                    <span className="text-slate-300 text-xs">·</span>
                    <Flame className="w-3 h-3 text-orange-500" />
                    <p className="text-orange-500 text-xs font-semibold">
                      {t('dashboard.streakUnit').replace('{days}', MOCK_PATIENT.streakDays.toString())}
                    </p>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Next appointment */}
          <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <p className="text-emerald-700 text-xs font-bold">{t('nav.nextAppointment')}</p>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">{MOCK_PATIENT.nextAppointment}</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV_ITEMS.map(({ icon, id, path }) => {
              const Icon = ICON_MAP[icon as keyof typeof ICON_MAP];
              const isActive = location.pathname === path;
              const label = t(`nav.${id}` as any);
              return (
                <button
                  key={id}
                  onClick={() => handleNav(path)}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-500" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                  />
                  {label}
                  {id === "notifications" && unreadCount > 0 && (
                    <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Accessibility + Logout */}
          <div className="px-3 py-4 border-t border-slate-100 space-y-2">
            <div className="px-3 py-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('nav.accessibility')}</p>
              <AccessibilityBar dropUp />
            </div>
            <button
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {t('nav.logout' as any)}
            </button>
          </div>
        </aside>
      </div>
      {showLogout && (
        <LogoutModal
          onConfirm={() => {
            setShowLogout(false);
            onClose();
            navigate("/auth/login");
          }}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </>
  );
};

export default MobileSidebar;
