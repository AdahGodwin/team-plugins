export default function SectionHeading({ step, title, subtitle, color }: {
  step: string; title: string; subtitle: string; color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${color}`}>
        {step}
      </div>
      <div>
        <p className="text-base font-bold text-slate-800">{title}</p>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}