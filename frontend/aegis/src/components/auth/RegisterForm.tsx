import { useState } from "react";
import {
  Lock, User, Mail, Phone, Eye, EyeOff,
  Heart, CheckCircle2, AlertCircle, ArrowRight, Stethoscope,
} from "lucide-react";
import PasswordStrength from "../shared/PasswordStrength";
import InputField from "../shared/InputField";
import SectionHeading from "../shared/SectionHeading";

interface Props {
  onGoLogin: () => void;
}

export default function RegisterForm({ onGoLogin }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [consentHealth, setConsentHealth] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    password: "", confirmPassword: "",
    kinName: "", kinPhone: "", kinEmail: "",
  });

  const [errors, setErrors] = useState<Partial<typeof form> & {
    consentHealth?: string; consentTerms?: string;
  }>({});

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
    if (!form.kinName.trim()) e.kinName = "Next of kin full name is required.";
    if (!/^\+?[\d\s\-]{7,15}$/.test(form.kinPhone)) e.kinPhone = "Enter a valid phone number.";
    if (form.kinEmail && !/\S+@\S+\.\S+/.test(form.kinEmail)) e.kinEmail = "Enter a valid email.";
    if (!consentHealth) e.consentHealth = "This consent is required for your safety.";
    if (!consentTerms) e.consentTerms = "You must agree to the Terms & Privacy Policy.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-100 sm:rounded-3xl sm:p-10">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-teal-100 opacity-60" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-teal-400 to-teal-600 shadow-lg">
            <CheckCircle2 className="text-white" size={40} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 sm:text-2xl">You're all set!</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Your Aegis account has been created. Check your email to verify and get started.
          </p>
        </div>
        <button
          onClick={onGoLogin}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-teal-500 py-3.5 text-base font-bold text-white shadow-md transition hover:opacity-90 sm:rounded-2xl"
        >
          Go to Login
          <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:rounded-3xl sm:p-7">

      <div className="mb-5 flex flex-col gap-2.5">
        <div className="flex w-fit items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            New Account
          </span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 sm:text-2xl">Create Your Account</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Join Aegis — your daily stroke prevention companion.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 sm:rounded-2xl">
          <SectionHeading step="01" color="bg-blue-500"
            title="Personal Information" subtitle="Tell us a little about yourself"
          />
          <div className="h-px bg-slate-200" />
          <div className="flex flex-col gap-3">
            <InputField label="Full Name" type="text" placeholder="e.g. Margaret Johnson"
              icon={<User size={15} />} value={form.fullName} onChange={update("fullName")}
              error={errors.fullName} success={!!form.fullName && !errors.fullName}
            />
            <InputField label="Email Address" type="email" placeholder="e.g. margaret@example.com"
              hint="We'll send your confirmation link here." icon={<Mail size={15} />}
              value={form.email} onChange={update("email")} error={errors.email}
              success={!!form.email && !errors.email && /\S+@\S+\.\S+/.test(form.email)}
            />
            <InputField label="Phone Number" type="tel" placeholder="e.g. +1 234 567 8901"
              hint="Include your country code." icon={<Phone size={15} />}
              value={form.phone} onChange={update("phone")} error={errors.phone}
              success={!!form.phone && !errors.phone && /^\+?[\d\s\-]{7,15}$/.test(form.phone)}
            />
            <div>
              <InputField label="Password" type={showPassword ? "text" : "password"}
                placeholder="Create a strong password" hint="Min. 8 chars — uppercase, numbers & symbols."
                icon={<Lock size={15} />} value={form.password} onChange={update("password")}
                error={errors.password}
                rightElement={
                  <span onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </span>
                }
              />
              <PasswordStrength password={form.password} />
            </div>
            <InputField label="Confirm Password" type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password" icon={<Lock size={15} />}
              value={form.confirmPassword} onChange={update("confirmPassword")}
              error={errors.confirmPassword}
              success={!!form.confirmPassword && form.confirmPassword === form.password}
              rightElement={
                <span onClick={() => setShowConfirmPassword(p => !p)}>
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 sm:rounded-2xl">
          <SectionHeading step="02" color="bg-teal-500"
            title="Next of Kin / Close Relative" subtitle="Who should we contact in an emergency?"
          />
          <div className="h-px bg-slate-200" />
          <div className="flex items-start gap-2 rounded-lg bg-teal-50 p-3 sm:rounded-xl">
            <Heart size={14} className="mt-0.5 shrink-0 text-teal-500" />
            <p className="text-xs leading-relaxed text-teal-700 sm:text-sm">
              Only contacted during emergencies or when you choose to share updates.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <InputField label="Full Name" type="text" placeholder="e.g. Robert Johnson"
              icon={<User size={15} />} value={form.kinName} onChange={update("kinName")}
              error={errors.kinName} success={!!form.kinName && !errors.kinName}
            />
            <InputField label="Phone Number" type="tel" placeholder="e.g. +1 234 567 8902"
              hint="Include your country code." icon={<Phone size={15} />}
              value={form.kinPhone} onChange={update("kinPhone")} error={errors.kinPhone}
              success={!!form.kinPhone && !errors.kinPhone && /^\+?[\d\s\-]{7,15}$/.test(form.kinPhone)}
            />
            <InputField label="Email Address" type="email" placeholder="e.g. robert@example.com"
              hint="For sharing health summaries." icon={<Mail size={15} />}
              value={form.kinEmail} onChange={update("kinEmail")} error={errors.kinEmail}
              success={!!form.kinEmail && !errors.kinEmail && /\S+@\S+\.\S+/.test(form.kinEmail)}
              optional
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 sm:rounded-2xl">
          <SectionHeading step="03" color="bg-violet-500"
            title="Consent & Agreements" subtitle="Please read and confirm below"
          />
          <div className="h-px bg-slate-200" />

          <label className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-all sm:rounded-xl ${
            consentHealth ? "border-teal-200 bg-teal-50"
            : errors.consentHealth ? "border-red-200 bg-red-50/40"
            : "border-slate-200 bg-white hover:border-slate-300"
          }`}>
            <input type="checkbox" checked={consentHealth} className="sr-only"
              onChange={(e) => {
                setConsentHealth(e.target.checked);
                if (errors.consentHealth) setErrors(p => ({ ...p, consentHealth: "" }));
              }}
            />
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
              consentHealth ? "border-teal-500 bg-teal-500" : "border-slate-300 bg-white"
            }`}>
              {consentHealth && <CheckCircle2 size={12} className="text-white" />}
            </div>
            <div>
              <p className="text-xs font-medium leading-relaxed text-slate-700 sm:text-sm">
                I consent to share my health status with my caregiver/next of kin for safety purposes.
              </p>
              {errors.consentHealth && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-500 sm:text-sm">
                  <AlertCircle size={12} /> {errors.consentHealth}
                </p>
              )}
            </div>
          </label>

          <label className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-all sm:rounded-xl ${
            consentTerms ? "border-blue-200 bg-blue-50"
            : errors.consentTerms ? "border-red-200 bg-red-50/40"
            : "border-slate-200 bg-white hover:border-slate-300"
          }`}>
            <input type="checkbox" checked={consentTerms} className="sr-only"
              onChange={(e) => {
                setConsentTerms(e.target.checked);
                if (errors.consentTerms) setErrors(p => ({ ...p, consentTerms: "" }));
              }}
            />
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
              consentTerms ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white"
            }`}>
              {consentTerms && <CheckCircle2 size={12} className="text-white" />}
            </div>
            <div>
              <p className="text-xs font-medium leading-relaxed text-slate-700 sm:text-sm">
                I agree to the{" "}
                <a href="#" onClick={e => e.stopPropagation()} className="text-blue-500 underline hover:text-blue-700">
                  Terms of Service
                </a>{" "}and{" "}
                <a href="#" onClick={e => e.stopPropagation()} className="text-blue-500 underline hover:text-blue-700">
                  Privacy Policy
                </a>.
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
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-teal-500 py-3.5 text-base font-bold text-white shadow-md transition-all hover:shadow-lg hover:opacity-95 active:scale-[0.98] sm:rounded-2xl sm:py-4"
        >
          Create My Account
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
        </button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button type="button" onClick={onGoLogin} className="font-semibold text-blue-500 hover:underline">
            Log in here
          </button>
        </p>

        <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100 sm:rounded-xl">
          <Stethoscope size={13} className="mt-0.5 shrink-0 text-slate-300" />
          <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
            <span className="font-medium text-slate-500">Disclaimer: </span>
            Aegis supports daily health monitoring and does not replace professional medical care.
          </p>
        </div>
      </form>
    </div>
  );
}