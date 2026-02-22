import { useState, useCallback } from "react";
import {
  ShieldCheck, CheckCircle2,
  ChevronLeft, ChevronRight, Activity, Heart,
} from "lucide-react";

interface Slide {
  title: string
  description: string
  image: string
  icon: React.ElementType
  tag: string
  color: string
  overlay: string
  bullets: string[]
}

const slides: Slide[] = [
  {
    title: 'Prevent Stroke With AI',
    description: 'Log your vitals daily and let our AI detect early warning signs before they become critical.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    icon: ShieldCheck,
    tag: 'AI-Powered Prevention',
    color: 'bg-emerald-600',
    overlay: 'bg-slate-900/40',
    bullets: [
      'Daily vital logging',
      'AI-driven early detection',
      'Personalized risk assessment',
    ],
  },
  {
    title: 'Intelligent Recovery',
    description: 'Personalized guidance and AI-driven insights to help you get back on your feet faster.',
    image: 'https://images.unsplash.com/photo-1559000357-f6b52ddfbe37?w=800&q=80',
    icon: Activity,
    tag: 'Smart Rehabilitation',
    color: 'bg-emerald-700',
    overlay: 'bg-slate-900/40',
    bullets: [
      'Tailored exercise plans',
      'Progress tracking & feedback',
      'Virtual physical therapy',
    ],
  },
  {
    title: 'Peace of Mind',
    description: 'Auto-sync with your care team and instant alerts for your family when it matters most.',
    image: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=800&q=80',
    icon: Heart,
    tag: 'Connected Care',
    color: 'bg-emerald-800',
    overlay: 'bg-slate-900/40',
    bullets: [
      'Automated care team updates',
      'Emergency family alerts',
      'Secure health data sharing',
    ],
  },
]

export default function CarouselPanel() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent((index + slides.length) % slides.length);
      setFading(false);
    }, 350);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  const slide = slides[current]

  return (
    <div className="relative h-full w-full overflow-hidden">

      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"
          }`}
        style={{ backgroundImage: `url(${slide.image})` }}
      />

      <div className={`absolute inset-0 ${slide.overlay}`} />

      <div className="relative flex h-full flex-col justify-between p-8 lg:p-10">

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Aegis Health
          </span>
        </div>

        <div className={`flex flex-col gap-5 transition-all duration-300 ${fading ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
          }`}>
          <div className="flex w-fit items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 backdrop-blur-sm ring-1 ring-white/20">
            <span className="text-white/90">
              <slide.icon size={14} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
              {slide.tag}
            </span>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight text-white lg:text-4xl">
            {slide.title}
          </h2>

          <p className="max-w-xs text-sm leading-relaxed text-white/75">
            {slide.description}
          </p>

          <ul className="flex flex-col gap-2">
            {slide.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <CheckCircle2 size={12} className="text-white" />
                </span>
                <span className="text-sm text-white/80">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between">
          {slides.map((slideItem: Slide, i: number) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? `${slideItem.color || "bg-white"} w-7` : "w-2 bg-white/40 hover:bg-white/60"
                }`}
            />
          ))}

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/20 transition hover:bg-white/25"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/20 transition hover:bg-white/25"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}