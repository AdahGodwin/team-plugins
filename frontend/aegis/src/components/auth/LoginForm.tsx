import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import InputField from "../shared/InputField";

interface Props {
  onGoRegister: () => void;
  onGoForgot: () => void;
}

export default function LoginForm({ onGoRegister, onGoForgot }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-100 sm:rounded-3xl sm:p-10">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-teal-100 opacity-60" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-teal-400 to-teal-600 shadow-lg">
            <ShieldCheck className="text-white" size={38} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 sm:text-2xl">Welcome back!</h2>
          <p className="mt-2 text-sm text-slate-500">You've logged in successfully. Redirecting you now...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:rounded-3xl sm:p-8">

      {/* Heading */}
      <div className="mb-6 flex flex-col gap-2.5">
        <div className="flex w-fit items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            Welcome Back
          </span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 sm:text-2xl">Log In to Aegis</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Sign in to your account to continue.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <InputField
          label="Email Address" type="email"
          placeholder="e.g. margaret@example.com"
          icon={<Mail size={15} />}
          value={form.email} onChange={update("email")}
          error={errors.email}
          success={!!form.email && !errors.email && /\S+@\S+\.\S+/.test(form.email)}
        />

        <div className="flex flex-col gap-1.5">
          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            icon={<Lock size={15} />}
            value={form.password} onChange={update("password")}
            error={errors.password}
            rightElement={
              <span onClick={() => setShowPassword(p => !p)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            }
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onGoForgot}
              className="text-sm font-semibold text-blue-500 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-teal-500 py-3.5 text-base font-bold text-white shadow-md transition-all hover:shadow-lg hover:opacity-95 active:scale-[0.98] sm:rounded-2xl sm:py-4"
        >
          Log In
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
        </button>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onGoRegister}
            className="font-semibold text-blue-500 hover:underline"
          >
            Create one here
          </button>
        </p>

        <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100">
          <AlertCircle size={13} className="mt-0.5 shrink-0 text-slate-300" />
          <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
            <span className="font-medium text-slate-500">Disclaimer: </span>
            Aegis does not replace professional medical care. Always consult your physician.
          </p>
        </div>
      </form>
    </div>
  );
}