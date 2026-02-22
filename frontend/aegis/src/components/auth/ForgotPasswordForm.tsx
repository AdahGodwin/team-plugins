import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import InputField from "../shared/InputField";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props {
  onGoLogin: () => void;
}

export default function ForgotPasswordForm({ onGoLogin }: Props) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-100 sm:rounded-3xl sm:p-10">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-60" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 shadow-lg">
            <CheckCircle2 className="text-white" size={38} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 sm:text-2xl font-display">{t('auth.checkInbox' as any)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {t('auth.resetLinkSent' as any)}
          </p>
        </div>
        <button
          onClick={onGoLogin}
          className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft size={15} /> {t('auth.backToLogin' as any)}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:rounded-3xl sm:p-8">

      <div className="mb-6 flex flex-col gap-2.5">
        <div className="flex w-fit items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            {t('auth.accountRecovery' as any)}
          </span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 sm:text-2xl font-display">{t('auth.forgotPassword' as any)}</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            {t('auth.forgotPasswordSubtitle' as any)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <InputField
          label={t('auth.email' as any)} type="email"
          placeholder="e.g. margaret@example.com"
          hint="Enter the email address linked to your account."
          icon={<Mail size={15} />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          error={error}
          success={!!email && !error && /\S+@\S+\.\S+/.test(email)}
        />

        <button
          type="submit"
          className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98] sm:rounded-2xl sm:py-4"
        >
          {t('auth.sendResetLink' as any)}
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={onGoLogin}
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-emerald-600 hover:underline"
        >
          <ArrowLeft size={15} /> {t('auth.backToLogin' as any)}
        </button>
      </form>
    </div>
  );
}
