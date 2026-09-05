"use client";

import { useEffect, useRef, useState } from "react";

/** Cadence de référence — 24 images/seconde, la cadence cinéma. */
const FPS = 24;
/** Durée nominale du « film » que constitue la page, en secondes. */
const RUNTIME = 232;

function timecode(seconds: number) {
  const total = Math.max(0, Math.min(RUNTIME, seconds));
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  const f = Math.floor((total % 1) * FPS);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(m)}:${pad(s)}:${pad(f)}`;
}

/**
 * La réglette de visionneuse.
 *
 * Le site est traité comme une bobine : la position de défilement devient un
 * timecode, la progression un trait de montage qui se remplit, et le chapitre
 * courant se nomme — repris des sections marquées `data-chapter`.
 *
 * C'est un repère, pas une commande : `pointer-events: none`, jamais dans le
 * chemin de lecture, effacé tant qu'on est sur l'écran-titre.
 */
export function Hud() {
  const [on, setOn] = useState(false);
  const [tc, setTc] = useState("00:00:00");
  const [chapter, setChapter] = useState<{ index: string; label: string } | null>(
    null,
  );
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mouvement réduit : la réglette reste, mais on n'anime rien de superflu.
    let raf = 0;

    const read = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

      // La réglette s'efface dans le dernier écran : le générique de fin
      // (adresse, mentions) doit rester lisible sans rien par-dessus.
      setOn(y > window.innerHeight * 0.55 && p < 0.985);
      setTc(timecode(p * RUNTIME));
      if (fillRef.current) {
        fillRef.current.style.setProperty("--p", String(p));
      }

      // Chapitre courant : le dernier dont le haut est passé au-dessus du
      // tiers supérieur de l'écran.
      const marks = Array.from(
        document.querySelectorAll<HTMLElement>("[data-chapter]"),
      );
      const line = window.innerHeight * 0.34;
      let active: HTMLElement | null = null;
      for (const m of marks) {
        if (m.getBoundingClientRect().top <= line) active = m;
      }
      // Aucun chapitre sur la page (fiche d'une réalisation, contact) : la
      // réglette n'a rien à mesurer, elle ne s'affiche pas.
      setChapter(
        marks.length === 0
          ? null
          : {
              index: active?.dataset.chapterIndex ?? marks[0].dataset.chapterIndex ?? "01",
              label: active?.dataset.chapter ?? marks[0].dataset.chapter ?? "",
            },
      );
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!chapter) return null;

  return (
    <div className={`hud ${on ? "is-on" : ""}`} aria-hidden>
      <div className="hud-shell font-cond text-[10px] tracking-[0.18em]">
        <span className="rec-blink h-[6px] w-[6px] rounded-full bg-[#b76e4e]" />
        <span className="tabular-nums text-[#ece8dc]">{tc}</span>
        <div className="hud-track">
          <div ref={fillRef} className="hud-fill" />
        </div>
        <span className="hidden sm:inline">
          <span className="text-[#b76e4e]">{chapter.index}</span>{" "}
          {chapter.label}
        </span>
      </div>
    </div>
  );
}
