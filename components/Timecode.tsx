"use client";

import { useEffect, useRef, useState } from "react";

// Signature « viewfinder » de caméra : point REC qui pulse + timecode qui
// défile (HH:MM:SS:FF, 25 i/s). Motif cinéma discret et différenciant.
// prefers-reduced-motion : point fixe, timecode figé sur 00:00:00:00.
export function Timecode({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const pad = (n: number) => String(n).padStart(2, "0");
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = (now - start) / 1000;
      const ff = Math.floor((t * 25) % 25);
      const ss = Math.floor(t % 60);
      const mm = Math.floor((t / 60) % 60);
      const hh = Math.floor(t / 3600) % 100;
      if (ref.current)
        ref.current.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-2 font-cond text-[10px] tracking-[0.22em] text-[var(--color-bone-faint)] ${className}`}
    >
      <span
        aria-hidden
        className={`inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-terra)] ${
          reduced ? "" : "rec-blink"
        }`}
      />
      REC
      <span ref={ref} className="tabular-nums">
        00:00:00:00
      </span>
    </span>
  );
}
