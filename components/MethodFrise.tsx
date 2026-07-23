"use client";

import { useEffect, useRef } from "react";

export type FriseStep = { title: string; text: string };

type Props = {
  steps: FriseStep[];
};

// « Notre méthode » en timeline VERTICALE façon Apple : un rail vertical à
// gauche, quatre nœuds numérotés (pastilles terracotta) empilés de haut en bas,
// titre Gloock + texte à droite. Au scroll, la ligne du rail se trace de haut en
// bas (fill terracotta en scaleY par-dessus une ligne de base discrète), chaque
// étape se révèle en cascade (opacity + translateY) et son nœud s'active quand le
// tracé l'atteint. iOS-safe STRICT : transform + opacity + background uniquement,
// aucun filter, aucun clip-path. prefers-reduced-motion : tout affiché, aucun
// listener. Écriture directe dans le DOM en requestAnimationFrame (pas de
// re-render par frame). Thème géré exclusivement par tokens CSS.
export function MethodFrise({ steps }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const rail = railRef.current;
    const fill = fillRef.current;
    if (!root || !rail || !fill) return;

    // Accessibilité : mouvement réduit → état final figé, aucun listener.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("mf-static");
      return;
    }

    // Positionne le rail entre le centre du premier nœud et celui du dernier,
    // afin que la ligne tracée s'aligne exactement sur les pastilles.
    const measure = () => {
      const nodes = nodeRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (nodes.length < 2) return;
      const rootRect = root.getBoundingClientRect();
      const first = nodes[0].getBoundingClientRect();
      const last = nodes[nodes.length - 1].getBoundingClientRect();
      const top = first.top - rootRect.top + first.height / 2;
      const bottom = last.top - rootRect.top + last.height / 2;
      rail.style.top = `${top}px`;
      rail.style.height = `${Math.max(0, bottom - top)}px`;
    };

    let ticking = false;

    const update = () => {
      ticking = false;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const trigger = vh * 0.62; // ligne de déclenchement dans le viewport

      // Progression du tracé : le rail se remplit au fur et à mesure qu'il
      // franchit la ligne de déclenchement.
      const railRect = rail.getBoundingClientRect();
      let p = 0;
      if (railRect.height > 0) {
        p = (trigger - railRect.top) / railRect.height;
      }
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      fill.style.transform = `scaleY(${p})`;

      // Activation des nœuds : actif dès que le tracé l'a atteint.
      for (const node of nodeRefs.current) {
        if (!node) continue;
        const r = node.getBoundingClientRect();
        const center = r.top + r.height / 2;
        node.classList.toggle("is-active", center <= trigger);
      }

      // Révélation des étapes à l'entrée dans le champ.
      const revealLine = vh * 0.88;
      for (const step of stepRefs.current) {
        if (!step) continue;
        if (step.getBoundingClientRect().top < revealLine) {
          step.classList.add("is-in");
        }
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={rootRef} className="mf">
      {/* Rail vertical : ligne de base discrète + ligne de tracé terracotta */}
      <div ref={railRef} aria-hidden className="mf-rail">
        <div className="mf-rail-base" />
        <div ref={fillRef} className="mf-rail-fill" />
      </div>

      {steps.map((s, i) => (
        <div
          key={s.title}
          ref={(el) => {
            stepRefs.current[i] = el;
          }}
          className="mf-step"
          style={{ transitionDelay: `${Math.min(i, 3) * 80}ms` }}
        >
          <div className="mf-node-col">
            <span
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className="mf-node font-cond"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="mf-content">
            <h3 className="font-wide text-[clamp(1.5rem,3.4vw,2rem)] leading-[1.12] text-[var(--color-bone)]">
              {s.title}
            </h3>
            <p className="font-sans mt-3 text-[0.95rem] leading-relaxed text-[var(--color-bone-dim)]">
              {s.text}
            </p>
          </div>
        </div>
      ))}

      <style>{`
        .mf {
          position: relative;
          max-width: 760px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Rail : positionné en JS entre le premier et le dernier nœud. */
        .mf-rail {
          position: absolute;
          top: 0;
          height: 0;
          left: 1.375rem;        /* centre horizontal du nœud (2.75rem / 2) */
          width: 2px;
          transform: translateX(-1px);
          z-index: 0;
        }
        .mf-rail-base,
        .mf-rail-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          border-radius: 2px;
        }
        .mf-rail-base { background: var(--color-line); }
        .mf-rail-fill {
          background: var(--color-terra);
          transform: scaleY(0);
          transform-origin: top;
          will-change: transform;
        }

        .mf-step {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding-bottom: clamp(3.5rem, 9vh, 6rem);
          opacity: 0;
          transform: translateY(22px);
          transition:
            opacity 0.8s var(--ease-out-soft),
            transform 0.9s var(--ease-out-expo);
        }
        .mf-step:last-child { padding-bottom: 0; }
        .mf-step.is-in {
          opacity: 1;
          transform: none;
        }

        .mf-node-col {
          position: relative;
          z-index: 1;
          flex: 0 0 2.75rem;
          display: flex;
          justify-content: center;
        }

        .mf-node {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 9999px;
          background: var(--color-ink);
          border: 1px solid var(--color-line);
          color: var(--color-bone-faint);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          transform: scale(1);
          transition:
            background 0.5s var(--ease-out-soft),
            border-color 0.5s var(--ease-out-soft),
            color 0.5s var(--ease-out-soft),
            transform 0.5s var(--ease-out-expo);
        }
        .mf-node.is-active {
          background: var(--color-terra);
          border-color: var(--color-terra);
          color: var(--color-ink);
          transform: scale(1.06);
        }

        .mf-content {
          flex: 1 1 auto;
          padding-top: 0.35rem;
        }

        /* Mouvement réduit : tout est tracé / révélé / actif, sans transition. */
        .mf-static .mf-step,
        .mf-static .mf-node,
        .mf-static .mf-rail-fill {
          transition: none !important;
        }
        .mf-static .mf-step {
          opacity: 1 !important;
          transform: none !important;
        }
        .mf-static .mf-rail-fill { transform: scaleY(1) !important; }
        .mf-static .mf-node {
          background: var(--color-terra) !important;
          border-color: var(--color-terra) !important;
          color: var(--color-ink) !important;
          transform: none !important;
        }
      `}</style>
    </div>
  );
}
