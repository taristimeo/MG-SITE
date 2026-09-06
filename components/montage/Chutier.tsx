"use client";

// Le chutier : tous les rushes, filtrés par métier. Souris : on glisse vers
// la timeline ; tactile : appui long → feuille « Ajouter au montage ».
import { useRef } from "react";
import { CATEGORIES, films, pad, rushes } from "@/lib/montage";
import { useIsMobile, useMontage } from "./store";

export function Chutier() {
  const { state, drag, set, addClip, takeHand } = useMontage();
  const mobile = useIsMobile();
  const { filter, clips, sheet } = state;
  const pend = useRef<{ x: number; y: number; r: number; touch: boolean } | null>(null);
  const hold = useRef(0);
  const used = new Set(clips.map((c) => c.r));
  const visible = rushes.filter((r) => !filter || films[r.film].category === filter);

  const cancel = () => { clearTimeout(hold.current); pend.current = null; };

  return (
    <aside className="chutier" aria-label="Chutier">
      <div className="ch-head cond">
        <span><b>Chutier</b> · {visible.length} rushes</span>
        <span>{mobile ? "Appui long pour ajouter" : "Glisser vers la timeline"}</span>
      </div>
      <div className="filters cond" role="group" aria-label="Filtrer par métier">
        <button type="button" className={filter === "" ? "on" : ""} onClick={() => set({ filter: "" })}>Tous</button>
        {CATEGORIES.map((c) => (
          <button key={c} type="button" className={filter === c ? "on" : ""} aria-pressed={filter === c} onClick={() => set({ filter: c })}>{c}</button>
        ))}
      </div>
      <div
        className="ch-grid"
        onPointerDown={(e) => {
          const el = (e.target as HTMLElement).closest<HTMLElement>(".rush");
          if (!el) return;
          const r = +el.dataset.r!;
          clearTimeout(hold.current);
          const touch = e.pointerType === "touch";
          pend.current = { x: e.clientX, y: e.clientY, r, touch };
          if (touch) hold.current = window.setTimeout(() => { set({ sheet: r }); pend.current = null; }, 450);
        }}
        onPointerMove={(e) => {
          const p = pend.current;
          if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 8) {
            clearTimeout(hold.current);
            if (!p.touch && !drag.current?.active()) drag.current?.start(e, p.r, null);
            pend.current = null;
          }
        }}
        onPointerUp={cancel}
        onPointerCancel={cancel}
        onDoubleClick={(e) => { const el = (e.target as HTMLElement).closest<HTMLElement>(".rush"); if (el) { takeHand(); addClip(+el.dataset.r!); } }}
        onKeyDown={(e) => { const el = (e.target as HTMLElement).closest<HTMLElement>(".rush"); if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); takeHand(); addClip(+el.dataset.r!); } }}
      >
        {rushes.map((r) => {
          const f = films[r.film];
          const hidden = !!filter && f.category !== filter;
          return (
            <div
              key={r.i}
              className={`rush${used.has(r.i) ? " used" : ""}${sheet === r.i ? " sel" : ""}${hidden ? " hide" : ""}`}
              data-r={r.i}
              tabIndex={hidden ? -1 : 0}
              role="button"
              aria-label={`${f.title}, plan ${r.k + 1}, ${r.nat.toFixed(1)} secondes — ajouter au montage`}
            >
              <figure><img src={r.poster} alt="" loading="lazy" draggable={false} width={320} height={180} /></figure>
              <div className="lab cond"><span>{r.code}</span><span>{r.nat.toFixed(1)}s</span></div>
            </div>
          );
        })}
      </div>
      <p className="sr">{pad(rushes.length)} plans tirés de {films.length} films. Double-clic ou Entrée sur un plan pour l&apos;ajouter à la timeline.</p>
    </aside>
  );
}
