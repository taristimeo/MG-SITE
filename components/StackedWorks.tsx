"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CardMedia } from "@/components/CardMedia";
import { CardCursor } from "@/components/CardCursor";
import { projectThumb, projectPreview, type Project } from "@/lib/site";

// Vitrine « cartes empilées » : chaque film est une dalle qui se cale en haut
// (position: sticky) tandis que la suivante glisse par-dessus — un jeu de
// cartes qui s'empile au défilement, pensé pour le téléphone. Un léger recul
// (scale + descente) des cartes couvertes donne la profondeur du paquet.
// 100 % transform/opacity/sticky → robuste iOS. prefers-reduced-motion : les
// cartes restent posées les unes sous les autres, sans recul.

const STACK_TOP = 72; // px : hauteur à laquelle les cartes se calent
const STEP = 12; // px : décalage d'empilement entre deux cartes

export function StackedWorks({
  items,
  startIndex = 1,
}: {
  items: Project[];
  startIndex?: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const cards = Array.from(
      wrap.querySelectorAll<HTMLElement>("[data-stack-inner]"),
    );
    if (!cards.length) return;

    let raf = 0;
    let running = false;

    const render = () => {
      running = false;
      for (let i = 0; i < cards.length - 1; i++) {
        const inner = cards[i];
        const next = cards[i + 1];
        const h = inner.offsetHeight || 1;
        const target = STACK_TOP + i * STEP;
        const nextTop = next.getBoundingClientRect().top;
        // 0 quand la carte suivante touche le bas de celle-ci ; 1 quand elle la
        // recouvre entièrement (calée au même niveau).
        const cover = Math.min(1, Math.max(0, (target + h - nextTop) / h));
        const scale = 1 - cover * 0.06;
        const y = cover * 10;
        inner.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
      }
    };

    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };

    render();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <CardCursor>
      <div ref={wrapRef} className="mx-auto max-w-[1080px]">
        {items.map((p, i) => (
          <div
            key={p.slug}
            className="sticky pb-5 sm:pb-6"
            style={{ top: `${STACK_TOP + i * STEP}px`, zIndex: i + 1 }}
          >
            <div data-stack-inner className="origin-top will-change-transform">
              <Link
                href={`/realisations/${p.slug}`}
                data-card
                className="group relative block aspect-[4/5] overflow-hidden rounded-[26px] bg-[var(--color-ink-2)] shadow-[0_-6px_44px_-14px_rgba(0,0,0,0.75)] ring-1 ring-white/[0.08] sm:aspect-[16/10]"
              >
                {/* Média — léger sur-cadrage, zoom doux au survol. */}
                <div className="absolute inset-0 scale-[1.05] transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.1]">
                  <CardMedia
                    src={projectThumb(p)}
                    videoSrc={projectPreview(p)}
                    alt={`${p.title} — ${p.category} · film Mauvais Grain, studio vidéo à Bordeaux`}
                  />
                </div>

                {/* Dégradé : lisibilité du titre en bas. */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/25"
                />

                {/* Numéro discret en haut. */}
                <span className="font-cond absolute left-6 top-5 text-[11px] tracking-[0.22em] text-white/45">
                  {String(startIndex + i).padStart(2, "0")}
                </span>

                {/* Bloc titre posé en bas. */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                  <p className="font-cond text-[11px] tracking-[0.25em] text-[var(--color-terra)]">
                    {p.category} · {p.year}
                  </p>
                  <h3 className="font-wide mt-2 text-[clamp(1.7rem,7vw,2.9rem)] leading-[1.02] text-[var(--color-cream)]">
                    {p.title}
                  </h3>
                  <p className="font-cond mt-4 text-[11px] tracking-[0.2em] text-white/60 transition-colors duration-300 group-hover:text-[var(--color-terra)]">
                    Voir le film <span aria-hidden>→</span>
                  </p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </CardCursor>
  );
}
