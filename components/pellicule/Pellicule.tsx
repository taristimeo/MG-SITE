"use client";

import { useEffect, useRef, useState } from "react";
import { projects, site } from "@/lib/site";
import { FilmFrame, filmSpec } from "./FilmFrame";
import {
  Amorce,
  ClientsPanel,
  Contact,
  Credo,
  Jobs,
  Manifeste,
} from "./Panels";
import { Reel } from "./Reel";

/* Largeurs des photogrammes de lecture, en unités de bande (× --pel-u). */
const W_AMORCE = 1180;
const W_MANIF = 940;
const W_CREDO = 1000;
const W_CLIENTS = 760;
const W_JOBS = 1340;
const W_CONTACT = 1080;

/** Pas des perforations, en pixels. */
const PITCH = 62;

/** 1 → « 01 ». */
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * LA PELLICULE.
 *
 * Le site ne descend pas : il passe. Amorce, manifeste, six films, cinq
 * métiers et contact sont posés sur UNE bande continue qui défile
 * latéralement entre deux rangées de perforations, avec une bobine en bas à
 * droite qui se dévide et donne la position.
 *
 * Le défilement s'appuie sur un vrai conteneur de défilement natif plutôt
 * que sur une transformation : le focus clavier y entraîne la bande tout
 * seul, et les observateurs de visibilité (lecture des extraits) y lisent la
 * position sans qu'on ait à la leur donner. Molette, flèches et glisser ne
 * font qu'écrire dans ce défilement.
 *
 * Sous 768 px la bande bascule en vertical — mêmes photogrammes, même ordre,
 * perforations sur les côtés — et c'est le défilement natif de la page qui
 * prend le relais.
 */
export function Pellicule() {
  const rootRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const holeARef = useRef<HTMLDivElement>(null);
  const holeBRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const gaugeRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const cornerRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const reelFilmRef = useRef<SVGCircleElement>(null);
  const reelSpokesRef = useRef<SVGGElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const countMobRef = useRef<HTMLSpanElement>(null);

  // « x » : bande horizontale (desktop). « y » : bande verticale (mobile).
  // null tant que rien n'est monté — le rendu serveur et la première passe
  // client restent identiques, la bascule de mise en page est purement CSS.
  const [axis, setAxis] = useState<"x" | "y" | null>(null);
  const [ioRoot, setIoRoot] = useState<HTMLElement | null>(null);

  const total = projects.length + 6;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setAxis(mq.matches ? "x" : "y");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // La racine des observateurs de visibilité : le conteneur horizontal en
  // desktop, la fenêtre (null) quand la bande est verticale.
  useEffect(() => {
    setIoRoot(axis === "x" ? gateRef.current : null);
  }, [axis]);

  useEffect(() => {
    const root = rootRef.current;
    const gate = gateRef.current;
    const strip = stripRef.current;
    if (!axis || !root || !gate || !strip) return;

    const horizontal = axis === "x";
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const panels = Array.from(
      strip.querySelectorAll<HTMLElement>("[data-pel-panel]"),
    );
    const parallax = Array.from(
      strip.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    const holes = [holeARef.current, holeBRef.current].filter(
      (h): h is HTMLDivElement => h !== null,
    );

    let starts: number[] = [];
    let sizes: number[] = [];
    let darks: boolean[] = [];
    let rootTop = 0;
    let max = 1;
    let view = 1;
    let target = 0;
    let raf: number | null = null;

    const clamp = (v: number) => Math.max(0, Math.min(max, v));
    const pos = () =>
      horizontal ? gate.scrollLeft : Math.max(0, window.scrollY - rootTop);

    /* ── Mémoire du dernier état écrit : on ne touche au DOM que quand
          quelque chose change vraiment. ─────────────────────────────── */
    let lastIdx = -1;
    let lastTone = "";
    let lastMoved = "";
    let lastMark = "";
    let lastEdge = "";

    const at = (px: number) => {
      const c = pos() + px;
      let k = 0;
      for (let i = 0; i < starts.length; i++) if (c >= starts[i]) k = i;
      return k;
    };

    const render = () => {
      const x = pos();

      // Les perforations défilent avec la bande.
      const mp = horizontal ? `${-x % PITCH}px center` : `center ${-x % PITCH}px`;
      for (const h of holes) {
        h.style.maskPosition = mp;
        h.style.webkitMaskPosition = mp;
      }

      const p = max > 0 ? Math.min(1, Math.max(0, x / max)) : 0;
      if (barRef.current) barRef.current.style.width = `${p * 100}%`;

      // La bobine se dévide : l'anneau de film s'amincit, l'axe tourne.
      const film = reelFilmRef.current;
      if (film) {
        const sw = 25 - 21 * p;
        film.setAttribute("stroke-width", sw.toFixed(2));
        film.setAttribute("r", (46.5 - sw / 2).toFixed(2));
      }
      if (reelSpokesRef.current) {
        reelSpokesRef.current.style.transform = `rotate(${(x * 0.16).toFixed(2)}deg)`;
      }

      // Le photogramme sous la tête de lecture.
      const idx = at(view * 0.42);
      if (idx !== lastIdx) {
        lastIdx = idx;
        const n = pad(idx + 1);
        if (countRef.current) countRef.current.textContent = n;
        if (countMobRef.current) countMobRef.current.textContent = n;
      }

      const tone = darks[idx] ? "dark" : "light";
      if (tone !== lastTone) {
        lastTone = tone;
        root.setAttribute("data-tone", tone);
        gaugeRef.current?.setAttribute("data-tone", tone);
      }

      // Chaque élément de chrome adopte le ton de ce qu'il surplombe.
      if (horizontal) {
        const left = darks[at(96)] ? "dark" : "light";
        const right = darks[at(Math.max(0, view - 130))] ? "dark" : "light";
        if (left !== lastMark) {
          lastMark = left;
          markRef.current?.setAttribute("data-tone", left);
        }
        if (right !== lastEdge) {
          lastEdge = right;
          cornerRef.current?.setAttribute("data-tone", right);
          reelRef.current?.setAttribute("data-tone", right);
        }
      }

      const moved = x > 24 ? "true" : "false";
      if (moved !== lastMoved) {
        lastMoved = moved;
        root.setAttribute("data-moved", moved);
      }

      // Parallaxe douce sur les photogrammes (bande horizontale seulement).
      for (const im of parallax) {
        if (!horizontal) {
          im.style.transform = "";
          continue;
        }
        const host = im.closest<HTMLElement>("[data-pel-panel]");
        if (!host) continue;
        const d = host.offsetLeft + host.offsetWidth / 2 - (x + view / 2);
        im.style.transform = `translate3d(${(d * -0.035).toFixed(1)}px,0,0)`;
      }
    };

    const measure = () => {
      rootTop = root.getBoundingClientRect().top + window.scrollY;
      starts = panels.map((p) => (horizontal ? p.offsetLeft : p.offsetTop));
      sizes = panels.map((p) => (horizontal ? p.offsetWidth : p.offsetHeight));
      darks = panels.map((p) => p.getAttribute("data-tone") === "dark");
      view = horizontal ? gate.clientWidth : window.innerHeight;
      const last = starts.length - 1;
      max = Math.max(1, (starts[last] ?? 0) + (sizes[last] ?? 0) - view);
      target = clamp(pos());
      render();
    };

    /* ── Défilement animé (molette, flèches, glisser) ─────────────────── */
    const loop = () => {
      const cur = gate.scrollLeft;
      const d = target - cur;
      if (Math.abs(d) < 1) {
        gate.scrollLeft = target;
        raf = null;
        render();
        return;
      }
      // Le navigateur aligne `scrollLeft` sur le pixel : sous 1 px de pas, la
      // bande resterait figée et la boucle tournerait dans le vide. On garde
      // donc toujours au moins un pixel d'avance…
      const step = d * 0.14;
      gate.scrollLeft = cur + (Math.abs(step) < 1 ? Math.sign(step) : step);
      // …et si rien n'a bougé, c'est une butée (début ou fin de bande) : on
      // s'arrête là plutôt que de tirer indéfiniment dessus.
      if (gate.scrollLeft === cur) {
        target = cur;
        raf = null;
        render();
        return;
      }
      render();
      raf = requestAnimationFrame(loop);
    };

    const to = (v: number) => {
      target = clamp(v);
      // Mouvement réduit : saut direct, aucune interpolation.
      if (reduced) {
        if (raf !== null) cancelAnimationFrame(raf);
        raf = null;
        gate.scrollLeft = target;
        render();
        return;
      }
      if (raf === null) raf = requestAnimationFrame(loop);
    };

    /* ── Écoutes ──────────────────────────────────────────────────────── */
    const cleanups: Array<() => void> = [];
    const on = (
      el: Window | HTMLElement,
      type: string,
      fn: EventListener,
      opts?: AddEventListenerOptions,
    ) => {
      el.addEventListener(type, fn, opts);
      cleanups.push(() => el.removeEventListener(type, fn, opts));
    };

    on(
      horizontal ? gate : window,
      "scroll",
      () => {
        if (raf === null) target = clamp(pos());
        render();
      },
      { passive: true },
    );
    on(window, "resize", measure);

    if (horizontal) {
      // Molette → horizontal. On travaille sur la cible, pas sur la position :
      // les à-coups d'un pavé tactile se lissent tout seuls.
      on(
        root,
        "wheel",
        (event) => {
          const e = event as WheelEvent;
          if (e.ctrlKey) return;
          e.preventDefault();
          const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? view : 1;
          const d =
            Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
          to(target + d * unit * 1.5);
        },
        { passive: false },
      );

      // Clavier — flèches, page précédente/suivante, début/fin de bande.
      on(window, "keydown", (event) => {
        const e = event as KeyboardEvent;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        // Une modale de devis ouverte garde le clavier pour elle.
        if (document.querySelector('[role="dialog"]')) return;
        const el = e.target as HTMLElement | null;
        if (
          el &&
          (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
        )
          return;
        const step = Math.max(280, view * 0.28);
        if (e.key === "ArrowRight") to(target + step);
        else if (e.key === "ArrowLeft") to(target - step);
        else if (e.key === "PageDown") to(target + view * 0.85);
        else if (e.key === "PageUp") to(target - view * 0.85);
        else if (e.key === "Home") to(0);
        else if (e.key === "End") to(max);
        else return;
        e.preventDefault();
      });

      // Glisser à la souris. Le clic n'est annulé qu'au-delà de 6 px, pour ne
      // jamais manger un clic sur un photogramme de film.
      let down = false;
      let dragged = false;
      let startX = 0;
      let lastX = 0;
      let pid = -1;

      on(gate, "pointerdown", (event) => {
        const e = event as PointerEvent;
        if (e.pointerType === "touch" || e.button !== 0) return;
        down = true;
        dragged = false;
        startX = lastX = e.clientX;
        pid = e.pointerId;
      });
      on(window, "pointermove", (event) => {
        const e = event as PointerEvent;
        if (!down) return;
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        if (!dragged) {
          if (Math.abs(e.clientX - startX) <= 6) return;
          dragged = true;
          root.setAttribute("data-drag", "true");
          try {
            gate.setPointerCapture(pid);
          } catch {
            /* le pointeur a déjà quitté la fenêtre : sans conséquence */
          }
        }
        if (raf !== null) {
          cancelAnimationFrame(raf);
          raf = null;
        }
        target = clamp(gate.scrollLeft - dx);
        gate.scrollLeft = target;
        render();
      });
      const release = () => {
        down = false;
        root.removeAttribute("data-drag");
      };
      on(window, "pointerup", release);
      on(window, "pointercancel", release);
      on(
        gate,
        "click",
        (event) => {
          if (!dragged) return;
          event.preventDefault();
          event.stopPropagation();
          dragged = false;
        },
        { capture: true },
      );

      // Le focus clavier entraîne la bande (défilement natif) : on se
      // resynchronise pour ne pas la ramener en arrière à la frappe suivante.
      on(gate, "focusin", () => {
        if (raf !== null) {
          cancelAnimationFrame(raf);
          raf = null;
        }
        requestAnimationFrame(() => {
          target = clamp(pos());
          render();
        });
      });
    }

    measure();
    // Les polices et les stills changent la géométrie après coup.
    const t = window.setTimeout(measure, 300);
    if (document.fonts?.ready) void document.fonts.ready.then(measure);
    on(window, "load", measure);

    return () => {
      window.clearTimeout(t);
      if (raf !== null) cancelAnimationFrame(raf);
      for (const c of cleanups) c();
    };
  }, [axis]);

  const films = projects.map((project, i) => (
    <FilmFrame
      key={project.slug}
      project={project}
      spec={filmSpec(i)}
      filmNo={pad(i + 1)}
      panelNo={pad(i + 3)}
      eager={i < 2}
      axis={axis}
      ioRoot={ioRoot}
    />
  ));

  return (
    <div ref={rootRef} className="pel-root">
      <div ref={gateRef} className="pel-gate">
        <div ref={stripRef} className="pel-strip">
          <Amorce num={pad(1)} w={W_AMORCE} />
          <Manifeste num={pad(2)} w={W_MANIF} />
          {films}
          <Credo num={pad(total - 3)} w={W_CREDO} />
          <ClientsPanel num={pad(total - 2)} w={W_CLIENTS} />
          <Jobs num={pad(total - 1)} w={W_JOBS} />
          <Contact num={pad(total)} w={W_CONTACT} />
        </div>
      </div>

      {/* Les deux rangées de perforations : haut/bas en desktop,
          gauche/droite quand la bande passe à la verticale. */}
      <div className="pel-rail pel-rail-a" aria-hidden="true">
        <div ref={holeARef} className="pel-holes" />
      </div>
      <div className="pel-rail pel-rail-b" aria-hidden="true">
        <div ref={holeBRef} className="pel-holes" />
      </div>

      <div ref={markRef} className="pel-mark pel-chrome" aria-hidden="true">
        {site.name}
        <span className="dot">.</span>
      </div>
      <div ref={cornerRef} className="pel-corner pel-chrome" aria-hidden="true">
        {site.city} · depuis {site.founded}
      </div>

      <div className="pel-prog" aria-hidden="true">
        <i ref={barRef} />
      </div>

      {/* Sur téléphone, la bobine cède la place à une simple jauge. */}
      <div ref={gaugeRef} className="pel-gauge" aria-hidden="true">
        <span ref={countMobRef}>01</span> <i>/ {pad(total)}</i>
      </div>

      <Reel
        hostRef={reelRef}
        filmRef={reelFilmRef}
        spokesRef={reelSpokesRef}
        countRef={countRef}
        total={total}
      />
    </div>
  );
}
