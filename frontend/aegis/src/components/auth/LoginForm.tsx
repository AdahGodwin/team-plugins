import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InputField from "../shared/InputField";
import { useLanguage } from "../../i18n/LanguageContext";
import { login } from "../../api/authService";
import { useAuth } from "../../context/AuthContext";

interface Props {
  onGoRegister: () => void;
  onGoForgot: () => void;
}

export default function LoginForm({ onGoRegister, onGoForgot }: Props) {
  const { t } = useLanguage();
  const { syncUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
    };

  const validate = () => {
    const e: typeof errors = {};
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setApiError("");
    setLoading(true);
    try {
      const data = await login({ email: form.email, password: form.password });
      syncUser(); // sync AuthContext so ProtectedRoute sees the user immediately
      setSubmitted(true);
      // Role-based redirect
      setTimeout(() => {
        if (data.user.role === "admin") navigate("/portal");
        else navigate("/dashboard");
      }, 1200);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        "Login failed. Please check your credentials.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-100 sm:rounded-3xl sm:p-10">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-60" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
            <ShieldCheck className="text-white" size={38} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 sm:text-2xl">{t('auth.login' as any)}!</h2>
          <p className="mt-2 text-sm text-slate-500">You've logged in successfully. Redirecting you now...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:rounded-3xl sm:p-8">

      {/* Heading */}
      <div className="mb-6 flex flex-col gap-2.5">
        <div className="flex w-fit items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            {t('auth.login' as any)}
          </span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 sm:text-2xl font-display">{t('auth.login' as any)} to Aegis</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Sign in to your account to continue.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* API Error Banner */}
        {apiError && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
            <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500" />
            <p className="text-sm font-medium text-red-600">{apiError}</p>
          </div>
        )}

        <InputField
          label={t('auth.email' as any)} type="email"
          placeholder="e.g. margaret@example.com"
          icon={<Mail size={15} />}
          value={form.email} onChange={update("email")}
          error={errors.email}
          success={!!form.email && !errors.email && /\S+@\S+\.\S+/.test(form.email)}
        />

        <div className="flex flex-col gap-1.5">
          <InputField
            label={t('auth.password' as any)}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={<Lock size={15} />}
            value={form.password} onChange={update("password")}
            error={errors.password}
            rightElement={
              <button type="button" onClick={() => setShowPassword(p => !p)} className="text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onGoForgot}
              className="text-sm font-semibold text-emerald-600 hover:underline"
            >
              {t('auth.forgotPassword' as any)}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed sm:rounded-2xl sm:py-4"
        >
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              {t('auth.login' as any)}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onGoRegister}
            className="font-semibold text-emerald-600 hover:underline"
          >
            {t('auth.register' as any)}
          </button>
        </p>

        <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100">
          <AlertCircle size={13} className="mt-0.5 shrink-0 text-slate-300" />
          <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
            <span className="font-medium text-slate-500">Disclaimer: </span>
            {t('common.medicalDisclaimer' as any)}
          </p>
        </div>
      </form>
    </div>
  );
}
