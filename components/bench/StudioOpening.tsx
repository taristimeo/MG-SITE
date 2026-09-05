"use client";

import { useEffect, useRef, useState } from "react";
import { founder, site } from "@/lib/site";

/**
 * L'OUVERTURE DE LA PAGE STUDIO.
 *
 * Un plan, pas une page de garde : le portrait occupe l'écran, les volets de
 * projection s'ouvrent dessus, et les trois partis pris du studio se posent
 * l'un après l'autre — comme un carton de générique.
 *
 * Le fond bascule en salle de projection : le header et la barre d'état du
 * navigateur suivent d'eux-mêmes (ToneWatcher).
 */
export function StudioOpening() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(-1);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setOpen(true);
      setStep(founder.lines.length - 1);
      return;
    }
    timers.current.push(window.setTimeout(() => setOpen(true), 220));
    founder.lines.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStep(i), 1100 + i * 420));
    });
    const t = timers.current;
    return () => t.forEach(window.clearTimeout);
  }, []);

  return (
    <section
      data-tone="dark"
      data-chapter="Le portrait"
      data-chapter-index="01"
      className="relative h-[100svh] w-full overflow-hidden"
    >
      <div className={`relative h-full w-full ${open ? "is-open" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/photo-studio.jpg"
          alt={`${site.founder} — ${site.name}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[rgba(7,6,5,0.9)] via-[rgba(7,6,5,0.25)] to-[rgba(7,6,5,0.55)]"
        />

        <div className="gate gate-top" aria-hidden />
        <div className="gate gate-bottom" aria-hidden />

        <div className="absolute inset-x-0 bottom-0 z-[3] px-5 pb-16 sm:px-10 sm:pb-24">
          <div className="mx-auto max-w-[1400px]">
            <p className="font-cond text-[10px] tracking-[0.24em] text-[var(--color-terra)] sm:text-[11px]">
              Le studio — depuis {site.founded}
            </p>
            <h1 className="font-wide mt-3 text-[clamp(2.6rem,9vw,7rem)] leading-[0.95] text-[#f2efe6]">
              {founder.name}
              <span className="dot">.</span>
            </h1>
            <p className="font-cond mt-3 text-[11px] tracking-[0.2em] text-[#e8e4d8]/60">
              {founder.role} — {site.city}
            </p>

            {/* Les trois partis pris, en carton de générique */}
            <ul className="mt-8 flex flex-col gap-1.5 sm:mt-12 sm:flex-row sm:gap-10">
              {founder.lines.map((line, i) => (
                <li
                  key={line}
                  style={{
                    opacity: i <= step ? 1 : 0,
                    transform: i <= step ? "none" : "translateY(12px)",
                    transition:
                      "opacity 0.9s var(--ease-out-soft), transform 1s var(--ease-out-expo)",
                  }}
                  className="font-sans max-w-[34ch] text-[0.98rem] leading-[1.6] text-[#e8e4d8]/85 sm:text-[1.05rem]"
                >
                  <span className="mr-2 text-[var(--color-terra)]" aria-hidden>
                    —
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
