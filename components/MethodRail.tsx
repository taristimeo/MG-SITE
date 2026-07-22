"use client";

import { useEffect, useRef, useState } from "react";
import { values } from "@/lib/site";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// « Notre méthode » en rail horizontal : la section reste épinglée pendant que
// le scroll vertical fait glisser les quatre temps de gauche à droite, avec une
// jauge de progression terracotta. En prefers-reduced-motion (ou si le rail
// tient à l'écran) : grille statique classique.
export function MethodRail() {
  const outerRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // Repli grille verticale : mouvement réduit OU téléphone (le rail
    // horizontal piloté au scroll est peu confortable au doigt).
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 639px)").matches
    ) {
      setReduced(true);
      return;
    }
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    let shift = 0;
    const measure = () => {
      const viewport = track.parentElement?.clientWidth ?? window.innerWidth;
      shift = Math.max(0, track.scrollWidth - viewport);
    };

    let raf = 0;
    const render = () => {
      raf = 0;
      const rect = outer.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? clamp01(-rect.top / span) : 1;
      track.style.transform = `translate3d(${(-p * shift).toFixed(1)}px, 0, 0)`;
      if (fillRef.current)
        fillRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const header = (
    <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8 lg:px-10">
      <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
        Notre méthode
      </p>
      <h2 className="font-wide mt-4 text-[clamp(2rem,5vw,4rem)] leading-[0.99] text-[var(--color-cream)]">
        Quatre temps, une exigence<span className="dot">.</span>
      </h2>
    </div>
  );

  const card = (v: (typeof values)[number], i: number, wide: boolean) => (
    <div
      key={v.title}
      className={`rounded-3xl border border-[var(--color-line-soft)] bg-[var(--color-ink-2)] p-8 sm:p-10 ${
        wide ? "w-[78vw] max-w-[440px] shrink-0 sm:w-[440px]" : ""
      }`}
    >
      <span className="font-cond text-xs tracking-[0.2em] text-[var(--color-terra)]">
        0{i + 1}
      </span>
      <h3 className="font-wide mt-6 text-2xl text-[var(--color-bone)] sm:text-3xl">
        {v.title}
      </h3>
      <p className="font-sans mt-4 text-sm leading-relaxed text-[var(--color-bone-dim)]">
        {v.text}
      </p>
    </div>
  );

  // Repli sans mouvement : grille sobre.
  if (reduced) {
    return (
      <section className="mt-32 sm:mt-40">
        {header}
        <div className="mx-auto mt-12 grid w-full max-w-[1100px] grid-cols-1 gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:px-10">
          {values.map((v, i) => card(v, i, false))}
        </div>
      </section>
    );
  }

  return (
    <section ref={outerRef} className="mt-16 h-[240vh] sm:mt-24">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        {header}

        {/* Rail — glisse au rythme du scroll */}
        <div className="mt-12 overflow-hidden sm:mt-14">
          <div
            ref={trackRef}
            className="flex w-max gap-5 pl-5 pr-[18vw] will-change-transform sm:pl-8 lg:pl-[max(2.5rem,calc((100vw-1100px)/2))]"
          >
            {values.map((v, i) => card(v, i, true))}
          </div>
        </div>

        {/* Jauge de progression */}
        <div className="mx-auto mt-12 h-px w-44 bg-[var(--color-line-soft)]">
          <span
            ref={fillRef}
            className="block h-full origin-left bg-[var(--color-terra)]"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
