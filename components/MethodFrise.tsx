"use client";

import { useEffect, useRef } from "react";

export type FriseStep = { title: string; text: string };

type Props = {
  steps: FriseStep[];
};

// « Notre méthode » — timeline VERTICALE façon Apple.
// Un rail descend le long de la colonne ; une ligne terracotta se TRACE de haut
// en bas au fil du scroll (scaleY piloté en requestAnimationFrame, écriture
// directe dans le DOM). Chaque étape se révèle à son entrée (opacity+translateY)
// et son nœud s'active quand le tracé l'atteint.
// iOS-safe STRICT : transform (scaleY/translateY/scale) + opacity + background
// uniquement. Aucun filter, aucun clip-path.
// prefers-reduced-motion : rail tracé, étapes visibles, nœuds actifs, 0 listener.
export function MethodFrise({ steps }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);
  const railRef = useRef<HTMLSpanElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const nodeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    const rail = railRef.current;
    const fill = fillRef.current;
    if (!root || !list || !rail || !fill) return;

    const nodes = nodeRefs.current;
    const stepEls = stepRefs.current;

    // ── prefers-reduced-motion : état final, aucun listener ────────────────
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("mv-static");
      return;
    }

    // Fractions (0→1) de chaque nœud le long du rail — recalculées au layout.
    let nodeFracs: number[] = [];
    // Suivi des nœuds actifs pour n'écrire dans le DOM qu'au changement.
    const activeState: boolean[] = nodes.map(() => false);

    // Positionne le rail entre le centre du 1er et du dernier nœud, puis
    // mesure les fractions. À exécuter au montage et à chaque resize.
    const layout = () => {
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      const listTop = list.getBoundingClientRect().top;
      const centerOf = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2 - listTop;
      };
      const firstC = centerOf(first);
      const lastC = centerOf(last);
      const span = Math.max(1, lastC - firstC);
      rail.style.top = `${firstC}px`;
      rail.style.height = `${span}px`;
      nodeFracs = nodes.map((n) => (n ? (centerOf(n) - firstC) / span : 0));
    };

    // Boucle de tracé : lit la position du rail dans le viewport, en déduit la
    // progression, écrit directement scaleY + l'état des nœuds. Pas de re-render.
    let ticking = false;
    const frame = () => {
      ticking = false;
      const railRect = rail.getBoundingClientRect();
      const railH = railRect.height || 1;
      // Ligne de lecture à ~62% de la hauteur du viewport.
      const readLine = window.innerHeight * 0.62;
      let p = (readLine - railRect.top) / railH;
      if (p < 0) p = 0;
      else if (p > 1) p = 1;

      fill.style.transform = `scaleY(${p})`;

      for (let i = 0; i < nodes.length; i++) {
        const on = p >= (nodeFracs[i] ?? 1) - 0.0001;
        if (on !== activeState[i]) {
          activeState[i] = on;
          nodes[i]?.classList.toggle("is-active", on);
        }
      }
    };
    const requestFrame = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    };

    // Révélation en cascade des étapes à leur entrée dans le champ.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -12% 0px" },
    );
    for (const el of stepEls) if (el) io.observe(el);

    const onResize = () => {
      layout();
      requestFrame();
    };

    layout();
    requestFrame();
    window.addEventListener("scroll", requestFrame, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", requestFrame);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [steps.length]);

  return (
    <div ref={rootRef} className="mv">
      <ol ref={listRef} className="mv-steps">
        {/* Rail vertical : base discrète + tracé terracotta (scaleY au scroll) */}
        <span ref={railRef} aria-hidden className="mv-rail">
          <span className="mv-rail-base" />
          <span ref={fillRef} className="mv-rail-fill" />
        </span>

        {steps.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            className="mv-step"
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <span
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className="mv-node font-cond"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="mv-body">
              <h3 className="font-wide mv-title">{s.title}</h3>
              <p className="font-sans mv-text">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <style>{`
        .mv {
          margin-inline: auto;
          width: 100%;
          max-width: 740px;
        }

        .mv-steps {
          position: relative;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        /* Rail : positionné en JS entre le centre du 1er et du dernier nœud.
           Colonne de gauche = 2.75rem, centre du nœud à 1.375rem. */
        .mv-rail {
          position: absolute;
          left: 1.375rem;
          width: 2px;
          transform: translateX(-50%);
          z-index: 0;
          pointer-events: none;
        }
        .mv-rail-base {
          position: absolute;
          inset: 0;
          width: 100%;
          background: var(--color-line);
        }
        .mv-rail-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          background: var(--color-terra);
          transform: scaleY(0);
          transform-origin: top center;
          will-change: transform;
        }

        .mv-step {
          position: relative;
          display: grid;
          grid-template-columns: 2.75rem 1fr;
          gap: 1.25rem;
          align-items: start;
          opacity: 0;
          transform: translateY(22px);
          transition:
            opacity 0.8s var(--ease-out-soft),
            transform 0.9s var(--ease-out-expo);
        }
        .mv-step.is-in {
          opacity: 1;
          transform: none;
        }
        .mv-step + .mv-step {
          margin-top: clamp(3rem, 7vw, 4.5rem);
        }

        /* Nœud : pastille discrète au repos, se remplit en terracotta + léger
           scale quand le tracé l'atteint (classe .is-active écrite en JS). */
        .mv-node {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 9999px;
          background: var(--color-ink);
          box-shadow: inset 0 0 0 1px var(--color-line);
          color: var(--color-bone-dim);
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          transition:
            background 0.5s var(--ease-out-soft),
            color 0.5s var(--ease-out-soft),
            box-shadow 0.5s var(--ease-out-soft),
            transform 0.5s var(--ease-out-expo);
        }
        .mv-node.is-active {
          background: var(--color-terra);
          color: var(--color-ink);
          box-shadow: inset 0 0 0 1px var(--color-terra);
          transform: scale(1.06);
        }

        .mv-body {
          padding-top: 0.35rem;
          max-width: 46ch;
        }
        .mv-title {
          font-size: clamp(1.5rem, 3.4vw, 2rem);
          line-height: 1.1;
          color: var(--color-bone);
        }
        .mv-text {
          margin-top: 0.75rem;
          font-size: 0.98rem;
          line-height: 1.7;
          color: var(--color-bone-dim);
        }

        /* prefers-reduced-motion / fallback statique : tout à l'état final. */
        .mv-static .mv-step {
          opacity: 1;
          transform: none;
          transition: none;
        }
        .mv-static .mv-rail {
          top: 1.375rem;
          bottom: 1.375rem;
          height: auto;
        }
        .mv-static .mv-rail-fill {
          transform: scaleY(1);
        }
        .mv-static .mv-node {
          background: var(--color-terra);
          color: var(--color-ink);
          box-shadow: inset 0 0 0 1px var(--color-terra);
          transform: none;
          transition: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .mv-step {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .mv-rail-fill {
            transform: scaleY(1) !important;
          }
          .mv-node {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
