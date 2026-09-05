"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  projectPreview,
  projectThumb,
  type Project,
} from "@/lib/site";

/**
 * LA MOVIOLA — l'écran-titre.
 *
 * Une table de montage : en haut le cadre, en bas la pellicule de tout le
 * travail du studio. On promène le curseur sur la bande et on MONTE — la
 * position horizontale choisit le film ET la position dans ce film. Le cadre
 * suit image par image, la tête de lecture avance, le timecode défile.
 *
 * Un seul extrait est chargé à la fois (la source change quand on passe d'un
 * film à l'autre) : la page reste légère malgré six films sur la bande.
 *
 * La bande reste une vraie navigation (des liens) : sans pointeur, sans JS ou
 * au clavier, on accède aux six films exactement de la même façon.
 */
export function Moviola({ films }: { films: Project[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [headX, setHeadX] = useState(0);
  const [tc, setTc] = useState("00:00");

  const film = films[active];
  const activeRef = useRef(active);
  activeRef.current = active;

  // Les volets s'ouvrent une fois la page posée — la lumière se fait.
  useEffect(() => {
    const t = window.setTimeout(() => setOpen(true), 260);
    return () => window.clearTimeout(t);
  }, []);

  // Changement de film : on recharge la source et on relance la boucle.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    setReady(false);
    v.load();
  }, [active]);

  const play = useCallback(() => {
    const v = videoRef.current;
    if (v) void v.play().catch(() => {});
  }, []);

  // Position du pointeur sur la bande → film + instant dans ce film.
  const scrub = useCallback(
    (clientX: number) => {
      const strip = stripRef.current;
      const v = videoRef.current;
      if (!strip || !v) return;

      const r = strip.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - r.left, 0), r.width);
      const p = r.width > 0 ? x / r.width : 0;

      setHeadX(x);

      const idx = Math.min(films.length - 1, Math.floor(p * films.length));
      if (idx !== activeRef.current) {
        setActive(idx);
        return; // la nouvelle source se chargera, on scrubbera au coup suivant
      }

      // Position à l'intérieur de la case du film survolé.
      const local = p * films.length - idx;
      if (v.readyState >= 1 && Number.isFinite(v.duration)) {
        v.pause();
        v.currentTime = Math.min(v.duration - 0.05, local * v.duration);
        const s = Math.floor(v.currentTime);
        const f = Math.floor((v.currentTime % 1) * 24);
        setTc(
          `${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`,
        );
      }
    },
    [films.length],
  );

  return (
    <section
      data-tone="dark"
      data-chapter="Générique"
      data-chapter-index="01"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 pb-8 pt-24 sm:px-8 sm:pb-10 lg:px-10"
    >
      {/* Halo terracotta très diffus — la lampe de la visionneuse */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-terra)] opacity-[0.07] blur-[130px]"
      />

      <div className="relative mx-auto w-full max-w-[1500px]">
        {/* ── Logotype ─────────────────────────────────────────────── */}
        <div className="mb-6 flex items-end justify-between gap-6 sm:mb-10">
          <h1 className="font-wide text-[clamp(2.1rem,7vw,6rem)] leading-[0.92] text-[var(--color-cream)]">
            <span className="reveal-word-text">Mauvais Grain</span>
            <span className="hero-dot dot">.</span>
          </h1>
          <p className="hidden max-w-[22ch] pb-2 font-cond text-[11px] leading-[1.9] tracking-[0.16em] text-[var(--color-bone-dim)] sm:block">
            Studio de production vidéo
            <br />
            Bordeaux — depuis 2022
          </p>
        </div>

        {/* ── Le cadre ─────────────────────────────────────────────── */}
        <div
          className={`relative overflow-hidden rounded-[10px] bg-black ring-1 ring-[var(--color-line-soft)] ${
            open ? "is-open" : ""
          }`}
        >
          <div className="relative aspect-[16/10] max-h-[46svh] w-full sm:aspect-[2.39/1] sm:max-h-[46svh]">
            {/* Image de secours : le premier photogramme, visible tant que
                l'extrait n'est pas prêt (et si la vidéo ne charge pas). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={projectThumb(film)}
              alt=""
              aria-hidden
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                ready ? "opacity-0" : "opacity-100"
              }`}
            />
            <video
              ref={videoRef}
              key={film.slug}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              poster={projectThumb(film)}
              onLoadedData={() => {
                setReady(true);
                if (!held) play();
              }}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={projectPreview(film)} type="video/mp4" />
            </video>

            {/* Volets de projection : ils se rétractent à l'ouverture */}
            <div className="gate gate-top" aria-hidden />
            <div className="gate gate-bottom" aria-hidden />

            {/* Tête de lecture */}
            <div
              className={`scrub-head ${held ? "" : "opacity-0"}`}
              style={{ left: `${headX}px`, opacity: held ? 1 : 0 }}
              aria-hidden
            />

            {/* Cartouches d'information, façon viseur */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-5">
              <p className="font-cond text-[10px] tracking-[0.2em] text-[#e8e4d8]/85 sm:text-[11px]">
                <span className="text-[var(--color-terra)]">
                  {String(active + 1).padStart(2, "0")}
                </span>{" "}
                {film.title}
                <span className="hidden text-[#e8e4d8]/50 sm:inline">
                  {" "}
                  — {film.client}
                </span>
              </p>
              <p className="font-cond tabular-nums text-[10px] tracking-[0.2em] text-[#e8e4d8]/70 sm:text-[11px]">
                {held ? tc : film.year}
              </p>
            </div>

            <Link
              href={`/realisations/${film.slug}`}
              className="absolute inset-0 z-[3]"
              aria-label={`Voir ${film.title}`}
            />
          </div>
        </div>

        {/* ── La pellicule ─────────────────────────────────────────── */}
        <div className="mt-3 sm:mt-5">
          <div
            className="sprocket"
            style={{ ["--gap" as string]: "22px" }}
            aria-hidden
          />

          <div
            ref={stripRef}
            className={`scrub-frame relative flex touch-pan-x gap-[3px] overflow-hidden bg-[var(--color-ink-2)] py-[3px] ${
              held ? "is-held" : ""
            }`}
            onPointerMove={(e) => {
              if (e.pointerType !== "mouse") return;
              setHeld(true);
              scrub(e.clientX);
            }}
            onPointerLeave={() => {
              setHeld(false);
              play();
            }}
          >
            {films.map((f, i) => (
              <Link
                key={f.slug}
                href={`/realisations/${f.slug}`}
                onFocus={() => setActive(i)}
                onClick={(e) => {
                  // Au doigt, le premier contact choisit le film ; c'est le
                  // second qui l'ouvre. À la souris et au clavier, le lien
                  // fonctionne normalement.
                  if (
                    window.matchMedia("(hover: none)").matches &&
                    i !== active
                  ) {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
                className="group relative block h-14 flex-1 overflow-hidden sm:h-[4.6rem]"
                aria-label={`${f.title} — ${f.category}, ${f.year}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={projectThumb(f)}
                  alt=""
                  aria-hidden
                  className={`h-full w-full object-cover transition-all duration-500 ${
                    i === active
                      ? "opacity-100 saturate-100"
                      : "opacity-40 saturate-[0.3] group-hover:opacity-70"
                  }`}
                />
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[var(--color-terra)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    i === active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            ))}

            {/* La tête de lecture court aussi sur la bande */}
            <div
              className="scrub-head z-10"
              style={{ left: `${headX}px`, opacity: held ? 1 : 0 }}
              aria-hidden
            />
          </div>

          <div
            className="sprocket"
            style={{ ["--gap" as string]: "22px" }}
            aria-hidden
          />
        </div>

        {/* ── Le mode d'emploi, dit une fois ───────────────────────── */}
        <div className="mt-5 flex items-center justify-between gap-4 sm:mt-7">
          <p className="font-cond text-[10px] leading-relaxed tracking-[0.2em] text-[var(--color-bone-faint)] sm:text-[11px]">
            <span className="hidden sm:inline">
              Promenez le curseur sur la pellicule — vous montez le film.
            </span>
            <span className="sm:hidden">Touchez la pellicule.</span>
          </p>
          <p className="font-cond shrink-0 text-[10px] tracking-[0.2em] text-[var(--color-bone-faint)] sm:text-[11px]">
            {films.length} films <span aria-hidden>↓</span>
          </p>
        </div>
      </div>
    </section>
  );
}
