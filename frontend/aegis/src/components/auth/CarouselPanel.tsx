import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck, CheckCircle2,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { SLIDES } from "./carouselSlides";

export default function CarouselPanel() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent((index + SLIDES.length) % SLIDES.length);
      setFading(false);
    }, 350);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <div className="relative h-full w-full overflow-hidden">

      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
        style={{ backgroundImage: `url(${slide.image})` }}
      />

      <div className={`absolute inset-0 bg-linear-to-b ${slide.overlay}`} />

      <div className="relative flex h-full flex-col justify-between p-8 lg:p-10">

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Aegis Health
          </span>
        </div>

        <div className={`flex flex-col gap-5 transition-all duration-300 ${
          fading ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
        }`}>
          <div className="flex w-fit items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 backdrop-blur-sm ring-1 ring-white/20">
            <span className="text-white/90">{slide.icon}</span>
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
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-7 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

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