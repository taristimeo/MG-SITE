"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// Film vedette « à la Apple » : la section fait ~2 écrans, la vidéo reste
// épinglée au centre et s'étire d'une carte arrondie (~80 vw) jusqu'au bord à
// bord pendant le scroll ; le titre se révèle sur la fin. La progression est
// publiée dans la variable CSS --p (le style est calculé en pur CSS).
// reduced-motion : carte statique, titre visible, sans étirement ni lecture.
export function FeatureReel({
  href,
  videoSrc,
  poster,
  title,
  category,
}: {
  href: string;
  videoSrc?: string;
  poster: string;
  title: string;
  category: string;
}) {
  const outerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reduced, setReduced] = useState(false);

  // Progression de scroll → --p sur la section.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const el = outerRef.current;
    if (!el) return;
    let raf = 0;
    const render = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? clamp01(-rect.top / span) : 1;
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Lecture de la boucle uniquement quand la section est visible.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section
      ref={outerRef}
      className={reduced ? "px-5 py-24" : "h-[220vh]"}
      style={{ "--p": 0 } as React.CSSProperties}
    >
      <div
        className={
          reduced
            ? "flex justify-center"
            : "sticky top-0 flex h-svh items-center justify-center overflow-hidden"
        }
      >
        <Link
          href={href}
          aria-label={`${title} — voir le film`}
          className="group relative block"
          style={{
            width: reduced ? "min(1200px, 94vw)" : "calc(80vw + 20vw * var(--p))",
          }}
        >
          <div
            className="relative aspect-video overflow-hidden bg-[var(--color-ink-2)]"
            style={{
              borderRadius: reduced
                ? "1rem"
                : "calc(1.25rem * (1 - var(--p)))",
            }}
          >
            {videoSrc && !reduced ? (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                poster={poster}
                muted
                loop
                playsInline
                preload="none"
                aria-label={title}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={poster}
                alt={`${title} — ${category} · film Mauvais Grain`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            )}

            {/* Voile bas pour asseoir le titre */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
            />

            {/* Titre — se révèle sur la fin de la progression */}
            <div
              className="absolute bottom-0 left-0 p-6 sm:p-10"
              style={{
                opacity: reduced
                  ? 1
                  : "clamp(0, calc((var(--p) - 0.55) / 0.3), 1)",
              }}
            >
              <p className="font-cond text-[11px] tracking-[0.25em] text-[var(--color-terra)]">
                {category}
              </p>
              <p className="font-wide mt-2 text-[clamp(1.6rem,4.5vw,3.4rem)] leading-none text-[var(--color-cream)]">
                {title}
              </p>
              <p className="font-cond mt-4 text-[11px] tracking-[0.2em] text-[var(--color-bone-dim)] transition-colors duration-300 group-hover:text-[var(--color-terra)]">
                Voir le film <span aria-hidden>→</span>
              </p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
