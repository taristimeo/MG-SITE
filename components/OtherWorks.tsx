"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CardMedia } from "@/components/CardMedia";
import { projectThumb, projectPreview, type Project } from "@/lib/site";

// Desktop: stacked at rest, fan on hover (CSS group-hover).
// Mobile: stacked at first, tap the container to deploy the fan.
export function OtherWorks({ projects }: { projects: Project[] }) {
  const pair = projects.slice(0, 2);
  const [deployed, setDeployed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  if (pair.length === 0) return null;

  return (
    <div className="mt-14">
    <div
      className="group relative mx-auto grid h-[clamp(220px,56vw,440px)] max-w-[900px] place-items-center [perspective:1400px]"
      // tap anywhere on the stack to toggle on mobile
      onClick={() => setDeployed((d) => !d)}
    >
      {pair.map((p, i) => {
        const left = i === 0;

        const mobileDeployed = left
          ? "-translate-x-[52%] -rotate-[8deg] scale-[1.02]"
          : "translate-x-[52%] rotate-[8deg] scale-[1.02]";
        const desktopRest = left
          ? "sm:translate-x-[-5%] sm:rotate-[-5deg]"
          : "sm:translate-x-[5%] sm:rotate-[5deg]";
        const desktopHover = left
          ? "sm:group-hover:-translate-x-[52%] sm:group-hover:-rotate-[8deg] sm:group-hover:scale-[1.02]"
          : "sm:group-hover:translate-x-[52%] sm:group-hover:rotate-[8deg] sm:group-hover:scale-[1.02]";
        const zClass = left ? "z-20" : "z-10";
        // La carte arrière suit la carte avant d'un souffle : le déploiement
        // s'ouvre en éventail plutôt que d'un bloc. Instantané en reduced-motion.
        const motion = reduced
          ? "duration-0"
          : left
            ? "duration-[900ms]"
            : "duration-[900ms] [transition-delay:70ms]";

        return (
          <Link
            key={p.slug}
            href={`/realisations/${p.slug}`}
            className={`group/card [grid-area:1/1] w-[clamp(130px,44vw,360px)] transition-transform ${motion} ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${zClass} ${desktopRest} ${desktopHover} ${deployed ? mobileDeployed : ""}`}
            // prevent the link from firing on the first tap (which deploys the fan)
            // only on coarse/touch pointers: on a fine pointer (desktop mouse) the
            // fan opens on CSS hover, so the first click must navigate normally.
            onClick={(e) => {
              const coarse =
                typeof window !== "undefined" &&
                window.matchMedia("(hover: none)").matches;
              if (coarse && !deployed) {
                e.preventDefault();
              }
            }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--color-ink-2)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] ring-1 ring-[var(--color-line-soft)]">
              <div className={`h-full w-full ${reduced ? "" : "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.06]"}`}>
                <CardMedia
                  src={projectThumb(p)}
                  videoSrc={projectPreview(p)}
                  alt={`${p.title} — ${p.category} · film Mauvais Grain`}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                <span className="font-cond text-sm tracking-[0.08em] text-[var(--color-bone)] transition-colors group-hover/card:text-[var(--color-terra)]">
                  {p.title}
                </span>
                <span className="font-cond text-[0.62rem] tracking-[0.1em] text-[var(--color-bone-faint)]">
                  {p.category}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
      {/* Affordance tactile (masquée sur desktop où le survol suffit) */}
      <p className="mt-6 text-center font-cond text-[10px] tracking-[0.22em] text-[var(--color-bone-faint)] sm:hidden">
        {deployed ? "Choisir un film" : "Toucher pour déployer"}
      </p>
    </div>
  );
}
