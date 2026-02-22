import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import LoginForm from "../../components/auth/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import CarouselPanel from "../../components/auth/CarouselPanel";
import { useLanguage } from "../../i18n/LanguageContext";

export type AuthView = "login" | "register" | "forgot";

interface AuthPageProps {
  view?: AuthView;
}

export default function AuthPage({ view: initialView = "login" }: AuthPageProps) {
  const { t } = useLanguage();
  const [view, setView] = useState<AuthView>(initialView);
  const [animating, setAnimating] = useState(false);

  const switchView = (next: AuthView) => {
    if (next === view) return;
    setAnimating(true);
    setTimeout(() => {
      setView(next);
      setAnimating(false);
    }, 200);
  };

  return (
    <div className="flex min-h-screen">

      <div className="fixed left-0 top-0 hidden h-full w-[52%] lg:block xl:w-[55%]">
        <CarouselPanel />
      </div>

      <div className="ml-auto flex min-h-screen w-full flex-col bg-slate-100 lg:w-[48%] xl:w-[45%]">

        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-5 py-4 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500">
            <ShieldCheck className="text-white" size={16} />
          </div>
          <span className="text-base font-extrabold text-slate-800">{t('common.brand' as any)}</span>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="w-full max-w-lg">
            <div className={`transition-all duration-200 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              }`}>
              {view === "login" && (
                <LoginForm
                  onGoRegister={() => switchView("register")}
                  onGoForgot={() => switchView("forgot")}
                />
              )}
              {view === "register" && (
                <RegisterForm onGoLogin={() => switchView("login")} />
              )}
              {view === "forgot" && (
                <ForgotPasswordForm onGoLogin={() => switchView("login")} />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}