import { useState, useEffect } from "react";
import {
  Lock, User, Mail, Phone, Eye, EyeOff,
  Heart, CheckCircle2, AlertCircle, ArrowRight, Stethoscope, Loader2,
  Building2, ChevronDown,
} from "lucide-react";
import PasswordStrength from "../shared/PasswordStrength";
import InputField from "../shared/InputField";
import SectionHeading from "../shared/SectionHeading";
import { useLanguage } from "../../i18n/LanguageContext";
import { register, fetchHospitals } from "../../api/authService";
import { useAuth } from "../../context/AuthContext";
import type { Hospital } from "../../types/auth.types";

interface Props {
  onGoLogin: () => void;
}

export default function RegisterForm({ onGoLogin }: Props) {
  const { t } = useLanguage();
  const { syncUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [consentHealth, setConsentHealth] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    password: "", confirmPassword: "",
    kinName: "", kinPhone: "", kinEmail: "",
  });

  const [errors, setErrors] = useState<Partial<typeof form> & {
    consentHealth?: string; consentTerms?: string; hospitalId?: string;
  }>({});

  // ── Hospital select ───────────────────────────────────────────────────────
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hospitalId, setHospitalId] = useState("");
  const [hospitalsLoading, setHospitalsLoading] = useState(true);
  const [hospitalsError, setHospitalsError] = useState("");

  useEffect(() => {
    fetchHospitals()
      .then(setHospitals)
      .catch(() => setHospitalsError("Could not load hospitals. Please refresh."))
      .finally(() => setHospitalsLoading(false));
  }, []);

  const update = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
    };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address.";
    if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match.";
    if (!hospitalId) e.hospitalId = "Please select your hospital.";
    if (!form.kinName.trim()) e.kinName = "Next of kin full name is required.";
    if (!/^\+?[\d\s\-]{7,15}$/.test(form.kinPhone)) e.kinPhone = "Enter a valid phone number.";
    if (form.kinEmail && !/\S+@\S+\.\S+/.test(form.kinEmail)) e.kinEmail = "Enter a valid email.";
    if (!consentHealth) e.consentHealth = "This consent is required for your safety.";
    if (!consentTerms) e.consentTerms = "You must agree to the Terms & Privacy Policy.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setApiError("");
    setLoading(true);

    // Split fullName into firstName / lastName
    const nameParts = form.fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || nameParts[0];

    try {
      await register({
        firstName,
        lastName,
        email: form.email,
        password: form.password,
        phoneNumber: form.phone,
        kinName: form.kinName,
        kinPhone: form.kinPhone,
        kinEmail: form.kinEmail,
        hospitalId,
        consentHealth,
        consentTerms,
      });
      syncUser(); // sync AuthContext so ProtectedRoute sees the new user
      setSubmitted(true);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        "Registration failed. Please try again.";
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
            <CheckCircle2 className="text-white" size={40} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 sm:text-2xl">{t('auth.allSet' as any)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {t('auth.registerSuccess' as any)}
          </p>
        </div>
        <button
          onClick={onGoLogin}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-emerald-700 sm:rounded-2xl"
        >
          {t('auth.goLogin' as any)}
          <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:rounded-3xl sm:p-7">

      <div className="mb-5 flex flex-col gap-2.5">
        <div className="flex w-fit items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            {t('auth.newAccount' as any)}
          </span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 sm:text-2xl font-display">{t('auth.createAccountTitle' as any)}</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            {t('auth.createAccountSubtitle' as any)}
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

        <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 sm:rounded-2xl">
          <SectionHeading step="01" color="bg-emerald-500"
            title={t('auth.personalInfo' as any)} subtitle={t('auth.personalInfoSubtitle' as any)}
          />
          <div className="h-px bg-slate-200" />
          <div className="flex flex-col gap-3">
            <InputField label={t('auth.fullName' as any)} type="text" placeholder="e.g. Margaret Johnson"
              icon={<User size={15} />} value={form.fullName} onChange={update("fullName")}
              error={errors.fullName} success={!!form.fullName && !errors.fullName}
            />
            <InputField label={t('auth.email' as any)} type="email" placeholder="e.g. margaret@example.com"
              hint="We'll send your confirmation link here." icon={<Mail size={15} />}
              value={form.email} onChange={update("email")} error={errors.email}
              success={!!form.email && !errors.email && /\S+@\S+\.\S+/.test(form.email)}
            />
            <InputField label={t('auth.phoneNumber' as any)} type="tel" placeholder="e.g. +234 81 2345 6789"
              hint="Include your country code." icon={<Phone size={15} />}
              value={form.phone} onChange={update("phone")} error={errors.phone}
              success={!!form.phone && !errors.phone && /^\+?[\d\s\-]{7,15}$/.test(form.phone)}
            />

            {/* ── Hospital select ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 sm:text-sm">
                Hospital / Clinic
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Building2 size={15} />
                </div>
                <select
                  value={hospitalId}
                  disabled={hospitalsLoading}
                  onChange={(e) => {
                    setHospitalId(e.target.value);
                    if (errors.hospitalId) setErrors(p => ({ ...p, hospitalId: "" }));
                  }}
                  className={`w-full appearance-none rounded-xl border bg-white py-2.5 pl-9 pr-9 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-60
                    ${errors.hospitalId ? "border-red-300 text-red-700" : hospitalId ? "border-emerald-300 text-slate-800" : "border-slate-200 text-slate-400"}`}
                >
                  <option value="">
                    {hospitalsLoading ? "Loading hospitals…" : "Select your hospital"}
                  </option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}{h.address ? ` — ${h.address}` : ""}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  {hospitalsLoading
                    ? <Loader2 size={14} className="animate-spin" />
                    : <ChevronDown size={14} />
                  }
                </div>
              </div>
              {hospitalsError && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={12} /> {hospitalsError}
                </p>
              )}
              {errors.hospitalId && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={12} /> {errors.hospitalId}
                </p>
              )}
            </div>
            {/* ────────────────────────────────────────────────────────────── */}
            <div>
              <InputField label={t('auth.password' as any)} type={showPassword ? "text" : "password"}
                placeholder="••••••••" hint="Min. 8 chars — uppercase, numbers & symbols."
                icon={<Lock size={15} />} value={form.password} onChange={update("password")}
                error={errors.password}
                rightElement={
                  <button type="button" onClick={() => setShowPassword(p => !p)} className="text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <PasswordStrength password={form.password} />
            </div>
            <InputField label={t('auth.confirmPassword' as any)} type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••" icon={<Lock size={15} />}
              value={form.confirmPassword} onChange={update("confirmPassword")}
              error={errors.confirmPassword}
              success={!!form.confirmPassword && form.confirmPassword === form.password}
              rightElement={
                <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="text-slate-400 hover:text-slate-600">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 sm:rounded-2xl">
          <SectionHeading step="02" color="bg-emerald-600"
            title={t('auth.nextOfKin' as any)} subtitle={t('auth.nextOfKinSubtitle' as any)}
          />
          <div className="h-px bg-slate-200" />
          <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 sm:rounded-xl">
            <Heart size={14} className="mt-0.5 shrink-0 text-emerald-500" />
            <p className="text-xs leading-relaxed text-emerald-700 sm:text-sm">
              {t('auth.nextOfKinDisclaimer' as any)}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <InputField label={t('auth.fullName' as any)} type="text" placeholder="e.g. Robert Johnson"
              icon={<User size={15} />} value={form.kinName} onChange={update("kinName")}
              error={errors.kinName} success={!!form.kinName && !errors.kinName}
            />
            <InputField label={t('auth.phoneNumber' as any)} type="tel" placeholder="e.g. +234 81 2345 6780"
              hint="Include your country code." icon={<Phone size={15} />}
              value={form.kinPhone} onChange={update("kinPhone")} error={errors.kinPhone}
              success={!!form.kinPhone && !errors.kinPhone && /^\+?[\d\s\-]{7,15}$/.test(form.kinPhone)}
            />
            <InputField label={t('auth.email' as any)} type="email" placeholder="e.g. robert@example.com"
              hint="For sharing health summaries." icon={<Mail size={15} />}
              value={form.kinEmail} onChange={update("kinEmail")} error={errors.kinEmail}
              success={!!form.kinEmail && !errors.kinEmail && /\S+@\S+\.\S+/.test(form.kinEmail)}
              optional
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 sm:rounded-2xl">
          <SectionHeading step="03" color="bg-slate-700"
            title={t('auth.consentTitle' as any)} subtitle={t('auth.consentSubtitle' as any)}
          />
          <div className="h-px bg-slate-200" />

          <label className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-all sm:rounded-xl ${consentHealth ? "border-emerald-200 bg-emerald-50"
            : errors.consentHealth ? "border-red-200 bg-red-50/40"
              : "border-slate-200 bg-white hover:border-slate-300"
            }`}>
            <input type="checkbox" checked={consentHealth} className="sr-only"
              onChange={(e) => {
                setConsentHealth(e.target.checked);
                if (errors.consentHealth) setErrors(p => ({ ...p, consentHealth: "" }));
              }}
            />
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${consentHealth ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white"
              }`}>
              {consentHealth && <CheckCircle2 size={12} className="text-white" />}
            </div>
            <div>
              <p className="text-xs font-medium leading-relaxed text-slate-700 sm:text-sm">
                {t('auth.consentShare' as any)}
              </p>
              {errors.consentHealth && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                  <AlertCircle size={12} /> {errors.consentHealth}
                </p>
              )}
            </div>
          </label>

          <label className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-all sm:rounded-xl ${consentTerms ? "border-emerald-200 bg-emerald-50"
            : errors.consentTerms ? "border-red-200 bg-red-50/40"
              : "border-slate-200 bg-white hover:border-slate-300"
            }`}>
            <input type="checkbox" checked={consentTerms} className="sr-only"
              onChange={(e) => {
                setConsentTerms(e.target.checked);
                if (errors.consentTerms) setErrors(p => ({ ...p, consentTerms: "" }));
              }}
            />
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${consentTerms ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white"
              }`}>
              {consentTerms && <CheckCircle2 size={12} className="text-white" />}
            </div>
            <div>
              <p className="text-xs font-medium leading-relaxed text-slate-700 sm:text-sm">
                {t('auth.consentTerms' as any)}
              </p>
              {errors.consentTerms && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                  <AlertCircle size={12} /> {errors.consentTerms}
                </p>
              )}
            </div>
          </label>
        </div>

        <button type="submit"
          disabled={loading}
          className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed sm:rounded-2xl sm:py-4"
        >
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              {t('auth.createAccountTitle' as any)}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button type="button" onClick={onGoLogin} className="font-semibold text-emerald-600 hover:underline">
            {t('auth.login' as any)}
          </button>
        </p>

        <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100 sm:rounded-xl">
          <Stethoscope size={13} className="mt-0.5 shrink-0 text-slate-300" />
          <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
            <span className="font-medium text-slate-500">Disclaimer: </span>
            {t('common.medicalDisclaimer' as any)}
          </p>
        </div>
      </form>
    </div>
  );
}
