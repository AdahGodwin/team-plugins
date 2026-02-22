export default function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: "Weak", bar: "w-1/4", color: "bg-red-400", text: "text-red-500" },
    { label: "Fair", bar: "w-2/4", color: "bg-orange-400", text: "text-orange-500" },
    { label: "Good", bar: "w-3/4", color: "bg-yellow-500", text: "text-yellow-600" },
    { label: "Strong", bar: "w-full", color: "bg-emerald-500", text: "text-emerald-600" },
  ];
  const level = levels[score - 1] ?? levels[0];
  return (
    <div className="mt-1 flex flex-col gap-1">
      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all duration-500 ${level.bar} ${level.color}`} />
      </div>
      <p className="text-sm text-slate-400">
        Strength: <span className={`font-semibold ${level.text}`}>{level.label}</span>
      </p>
    </div>
  );
}