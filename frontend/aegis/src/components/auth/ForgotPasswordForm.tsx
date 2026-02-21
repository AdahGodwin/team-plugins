import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import InputField from "../shared/InputField";

interface Props {
  onGoLogin: () => void;
}

export default function ForgotPasswordForm({ onGoLogin }: Props) {
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
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-teal-400 to-teal-600 shadow-lg">
          <CheckCircle2 className="text-white" size={38} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 sm:text-2xl">Check your inbox</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            We've sent a reset link to{" "}
            <span className="font-semibold text-slate-700">{email}</span>.
            Follow the instructions in the email.
          </p>
        </div>
        <button
          onClick={onGoLogin}
          className="flex items-center gap-2 text-sm font-semibold text-blue-500 hover:underline"
        >
          <ArrowLeft size={15} /> Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:rounded-3xl sm:p-8">

      {/* Heading */}
      <div className="mb-6 flex flex-col gap-2.5">
        <div className="flex w-fit items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-500">
            Account Recovery
          </span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 sm:text-2xl">Forgot Password?</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            No worries — enter your email and we'll send you a reset link.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <InputField
          label="Email Address" type="email"
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
          className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-400 to-rose-500 py-3.5 text-base font-bold text-white shadow-md transition-all hover:shadow-lg hover:opacity-95 active:scale-[0.98] sm:rounded-2xl sm:py-4"
        >
          Send Reset Link
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={onGoLogin}
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-blue-500 hover:underline"
        >
          <ArrowLeft size={15} /> Back to Login
        </button>
      </form>
    </div>
  );
}