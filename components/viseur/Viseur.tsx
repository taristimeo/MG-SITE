"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FilmCanvas, type FilmCanvasHandle } from "./gl/FilmCanvas";
import { projectPreview, projectThumb, projects, site } from "@/lib/site";
import { ViseurOverlay } from "./ViseurOverlay";
import {
  ContactPanelBody,
  IndexPanelBody,
  StudioPanelBody,
} from "./ViseurPanels";

/* ─────────────────────────────────────────────────────────────────────
   LE VISEUR.

   Ni page ni défilement, seulement des prises. Une image plein écran, les
   repères d'un viseur de caméra, et une bague graduée en bas de l'écran —
   comme la bague de mise au point d'un objectif — qui fait passer d'un film
   à l'autre. La bague est la seule commande de navigation ; les panneaux
   (index, studio, contact) se posent par-dessus sans jamais quitter la prise.

   Le mouvement de la bague ne passe PAS par React : une boucle rAF écrit
   directement les transformations des plans, des titres, des graduations et
   des étiquettes. React ne connaît que le film cadré et l'état du HUD.
   ───────────────────────────────────────────────────────────────────── */

const N = projects.length;
const R = 660; // rayon de la bague, en pixels
const STEP = 30; // degrés entre deux films
const SUB = 10; // graduations fines par intervalle
const TICKS = N * SUB;

type Panel = "index" | "studio" | "contact" | null;

/** Ramène un écart d'indices dans [-N/2, N/2] : la bague est un anneau. */
function wrap(d: number) {
  let v = d % N;
  if (v > N / 2) v -= N;
  if (v < -N / 2) v += N;
  return v;
}

function pad(v: number) {
  return String(v).padStart(2, "0");
}

export function Viseur() {
  // ── Ce que React sait : le film cadré et l'état du HUD ──────────────
  const [active, setActive] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [intro, setIntro] = useState(true);
  const [fiche, setFiche] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [videoOn, setVideoOn] = useState(false);
  // Le projecteur WebGL a-t-il pu démarrer ? Sinon on garde les plans en DOM.
  const [gl, setGl] = useState(false);
  const [reduced, setReduced] = useState(false);

  // ── Ce que la boucle sait : la position continue sur la bague ───────
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const velRef = useRef(0);
  const lastRef = useRef(0);
  const forcedRef = useRef(0);
  const gestureRef = useRef(false); // un geste est en cours (glisser / molette)
  const draggingRef = useRef(false);
  const settledRef = useRef(true);
  const activeRef = useRef(0);
  const reducedRef = useRef(false);
  const panelRef = useRef<Panel>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<FilmCanvasHandle>(null);
  const firstPlanRef = useRef(true);
  const tcRef = useRef<HTMLSpanElement>(null);
  const frameEls = useRef<(HTMLDivElement | null)[]>([]);
  const titleEls = useRef<(HTMLDivElement | null)[]>([]);
  const labelEls = useRef<(HTMLButtonElement | null)[]>([]);
  const tickEls = useRef<(HTMLDivElement | null)[]>([]);

  panelRef.current = panel;

  // Mouvement réduit : plus de flou de filé ni de longues courses.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = mq.matches;
      setReduced(mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /** La première interaction escamote l'indication de geste. */
  const used = useCallback(() => {
    setIntro(false);
  }, []);

  /** Amène la bague sur un film donné. */
  const goTo = useCallback(
    (i: number) => {
      used();
      // On rejoint le film par le plus court chemin, sans faire le tour.
      const cur = Math.round(targetRef.current);
      targetRef.current = cur + wrap(i - (((cur % N) + N) % N));
      gestureRef.current = false;
    },
    [used],
  );

  // ── La boucle : tout le mouvement de la bague ───────────────────────
  useEffect(() => {
    let raf = 0;

    const place = (el: HTMLElement, theta: number, extra = "") => {
      el.style.transform = `translateZ(-${R}px) rotateY(${theta}deg) translateZ(${R}px)${extra}`;
    };

    const render = () => {
      const pos = posRef.current;
      const vel = velRef.current;
      const blur = reducedRef.current
        ? 0
        : Math.min(9, Math.abs(vel) * 110 + forcedRef.current * 7);

      // Fondu propre : deux plans seulement, composés dans l'ordre du DOM.
      const base = ((Math.floor(pos) % N) + N) % N;
      const nxt = (base + 1) % N;
      const f = pos - Math.floor(pos);
      const op: Record<number, number> = {};
      if (f < 0.0005) op[base] = 1;
      else if (nxt > base) {
        op[base] = 1;
        op[nxt] = f;
      } else {
        op[nxt] = 1;
        op[base] = 1 - f;
      }

      for (let i = 0; i < N; i++) {
        const d = wrap(i - pos);
        const ad = Math.abs(d);
        const fr = frameEls.current[i];
        if (fr) {
          fr.style.opacity = String(op[i] ?? 0);
          fr.style.transform = `translateX(${-d * 54}px) scale(${
            1.04 + Math.min(ad, 1) * 0.03
          })`;
        }
        const tt = titleEls.current[i];
        if (tt) {
          const to = ad >= 1 ? 0 : ad < 0.5 ? 1 - ad * 0.82 : Math.pow(1 - ad, 2);
          tt.style.opacity = String(to);
          tt.style.transform = `translate3d(${-d * 46}px,${d * 78}px,0)`;
          tt.style.filter =
            ad > 0.02 && !reducedRef.current ? `blur(${(ad * 6.5).toFixed(2)}px)` : "none";
          // Un titre estompé ne doit pas rester cliquable ni lisible aux
          // technologies d'assistance.
          tt.setAttribute("aria-hidden", ad > 0.02 ? "true" : "false");
        }
      }

      if (framesRef.current) {
        framesRef.current.style.filter =
          blur > 0.4 ? `blur(${blur.toFixed(2)}px) saturate(.92)` : "none";
      }

      for (let j = 0; j < N; j++) {
        const el = labelEls.current[j];
        if (!el) continue;
        const dd = wrap(j - pos);
        const aj = Math.abs(dd);
        const th = dd * STEP;
        const vis = Math.abs(th) > 82 ? 0 : 1;
        const o = aj < 0.5 ? 1 : Math.max(0.12, 0.6 - (aj - 0.5) * 0.26);
        el.style.opacity = String(vis * o);
        el.style.color = aj < 0.5 ? "var(--color-terra)" : "var(--color-bone)";
        const lb =
          (aj < 0.5 ? 0 : Math.min(2, (aj - 0.5) * 0.85)) + blur * 0.14;
        el.style.filter = lb > 0.3 && !reducedRef.current ? `blur(${lb.toFixed(2)}px)` : "none";
        place(el, th, ` scale(${aj < 0.5 ? 1.06 : 1})`);
      }

      for (let m = 0; m < TICKS; m++) {
        const el = tickEls.current[m];
        if (!el) continue;
        const maj = m % SUB === 0;
        const td = wrap(m / SUB - pos);
        const at = Math.abs(td);
        const ang = td * STEP;
        if (Math.abs(ang) > 88) {
          el.style.opacity = "0";
          continue;
        }
        el.style.opacity = String(at < 0.04 ? 1 : Math.max(0.1, 0.85 - at * 0.3));
        el.style.background =
          at < 0.05
            ? "var(--color-terra)"
            : maj
              ? "color-mix(in srgb, var(--color-bone) 62%, transparent)"
              : "color-mix(in srgb, var(--color-bone) 30%, transparent)";
        place(el, ang);
      }

      // Le film cadré : la seule information qui remonte à React.
      const n = ((Math.round(pos) % N) + N) % N;
      if (n !== activeRef.current) {
        activeRef.current = n;
        setActive(n);
      }
    };

    // Le rappel de la bague est une décélération exponentielle — mais
    // calculée sur le TEMPS écoulé, pas sur le nombre d'images : le geste dure
    // autant à 30 qu'à 120 Hz, et se pose toujours (un rappel par image ne
    // convergerait jamais sur une machine lente).
    let prev = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(64, Math.max(1, now - prev));
      prev = now;
      if (!draggingRef.current) {
        const diff = targetRef.current - posRef.current;
        // 0,002 cran = un dixième de pixel à l'écran : invisible, et la bague
        // se cale net au lieu de ramper vers sa cible.
        if (Math.abs(diff) > 0.002 && !reducedRef.current) {
          posRef.current += diff * (1 - Math.pow(0.88, dt / 16.667));
        } else if (posRef.current !== targetRef.current) {
          posRef.current = targetRef.current;
        }
      }
      velRef.current = posRef.current - lastRef.current;
      lastRef.current = posRef.current;
      if (Math.abs(velRef.current) > 0.0006) forcedRef.current = 0;

      render();

      const settled = !gestureRef.current && posRef.current === targetRef.current;
      if (settled !== settledRef.current) {
        settledRef.current = settled;
        setSpinning(!settled);
      }
      raf = requestAnimationFrame(loop);
    };

    render();
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Les commandes : molette, doigt, clavier ─────────────────────────
  useEffect(() => {
    const stage = rootRef.current?.querySelector<HTMLElement>(".vs-stage");
    if (!stage) return;

    let wheelT = 0;

    const busy = () => panelRef.current !== null;

    const onWheel = (e: WheelEvent) => {
      if (busy()) return; // un panneau est ouvert : il défile, lui
      e.preventDefault();
      used();
      forcedRef.current = 0;
      gestureRef.current = true;
      const dx =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      posRef.current += dx * 0.0022;
      targetRef.current = posRef.current;
      window.clearTimeout(wheelT);
      wheelT = window.setTimeout(() => {
        targetRef.current = Math.round(posRef.current);
        gestureRef.current = false;
      }, 150);
    };

    let sx = 0;
    let sp = 0;
    const onDown = (e: PointerEvent) => {
      if (busy()) return;
      // Une étiquette de la bague se clique ; on ne démarre pas de glissé
      // dessus, sinon le clic n'arrive jamais.
      if ((e.target as HTMLElement | null)?.closest(".vs-lbl")) return;
      e.preventDefault();
      draggingRef.current = true;
      gestureRef.current = true;
      sx = e.clientX;
      sp = posRef.current;
      forcedRef.current = 0;
      used();
      stage.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      posRef.current = sp - (e.clientX - sx) / 210;
      targetRef.current = posRef.current;
    };
    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      gestureRef.current = false;
      targetRef.current = Math.round(posRef.current);
    };

    const onKey = (e: KeyboardEvent) => {
      if (busy() || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)))
        return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        used();
        gestureRef.current = false;
        targetRef.current = Math.round(targetRef.current) + 1;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        used();
        gestureRef.current = false;
        targetRef.current = Math.round(targetRef.current) - 1;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(wheelT);
      window.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("keydown", onKey);
    };
  }, [used]);

  // ── L'intro : la fiche se déplie d'elle-même après un temps mort ────
  useEffect(() => {
    if (!intro) return;
    const t = window.setTimeout(() => setIntro(false), 2600);
    return () => window.clearTimeout(t);
  }, [intro]);

  // La fiche s'ouvre d'elle-même sur grand écran (elle y a sa place, à
  // droite du titre) ; sur mobile elle recouvrirait le titre, on la laisse
  // au doigt de l'utilisateur.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 621px)").matches) setFiche(true);
  }, []);

  // ── L'extrait : un seul chargé à la fois ───────────────────────────
  const settled = !spinning;
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!settled || panel !== null) {
      v.pause();
      return;
    }
    const src = projectPreview(projects[active]);
    if (!src) {
      setVideoOn(false);
      return;
    }
    // On ne change la source qu'au changement de film : la page ne porte
    // jamais plus d'un extrait.
    if (!v.currentSrc.endsWith(src)) {
      setVideoOn(false);
      v.src = src;
      v.load();
    }
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [active, settled, panel]);

  // ── Le projecteur : le plan courant y entre par déplacement ─────────
  // Le premier plan est POSÉ (le fondu d'ouverture du projecteur suffit) ;
  // les suivants ARRIVENT, l'ancien filant sous la turbulence.
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const still = projectThumb(projects[active]);
    if (firstPlanRef.current) {
      firstPlanRef.current = false;
      c.set(still);
    } else {
      c.go(still);
    }
  }, [active]);

  // L'extrait sert de texture : le projecteur y puise image par image, et
  // repasse tout seul sur le photogramme fixe si la lecture n'aboutit pas.
  useEffect(() => {
    canvasRef.current?.attachVideo(videoRef.current);
  }, [gl]);

  // ── Le timecode : il avance sans repasser par React ─────────────────
  useEffect(() => {
    let t = 0;
    const id = window.setInterval(() => {
      t += 1;
      const fr = t % 24;
      const s = Math.floor(t / 24) % 60;
      const m = Math.floor(t / 1440) % 60;
      if (tcRef.current)
        tcRef.current.textContent = `00:${pad(m)}:${pad((s + 17) % 60)}:${pad(fr)}`;
    }, 42);
    return () => window.clearInterval(id);
  }, []);

  const p = projects[active];
  const st = spinning ? 1 : !intro && fiche ? 2 : 0;

  return (
    <div
      ref={rootRef}
      data-tone="dark"
      data-st={st}
      data-gl={gl ? "on" : "off"}
      className="vs-root"
    >
      <h1 className="sr-only">
        {site.name} — le viseur : {p.title}
      </h1>

      {/* ── Les plans ─────────────────────────────────────────────────
          Le projecteur WebGL rend le plan courant : grain, souffle de lampe,
          aberration d'objectif, et transition par déplacement d'un film à
          l'autre. La pile DOM juste dessous reste le repli exact si le
          contexte n'est pas obtenu — le site ne perd alors que la matière. */}
      <FilmCanvas ref={canvasRef} onReady={setGl} />

      <div ref={framesRef} className="vs-frames">
        {projects.map((f, i) => (
          <div
            key={f.slug}
            ref={(el) => {
              frameEls.current[i] = el;
            }}
            className="vs-frame"
            style={{ backgroundImage: `url("${projectThumb(f)}")` }}
          />
        ))}
        <video
          ref={videoRef}
          className={`vs-video${videoOn ? " is-on" : ""}`}
          poster={projectThumb(p)}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setVideoOn(true)}
          onError={() => setVideoOn(false)}
        />
      </div>

      <div className="vs-vig" />
      <div className="vs-scrim-t" />
      <div className="vs-scrim-l" />
      <div className="vs-scrim-b" />

      <div className="vs-corner tl" />
      <div className="vs-corner tr" />
      <div className="vs-corner bl" />
      <div className="vs-corner br" />
      <div className="vs-crosshair" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </div>

      {/* ── Barre haute ───────────────────────────────────────────── */}
      <div className="vs-top">
        <div className="vs-logo">
          {site.name}
          <span className="dot">.</span>
        </div>
        <div className="vs-top-r">
          <nav className="vs-nav" aria-label="Accès au reste du studio">
            <button type="button" className="vs-hudbtn" onClick={() => setPanel("index")}>
              Tout voir
            </button>
            <button type="button" className="vs-hudbtn" onClick={() => setPanel("studio")}>
              Studio
            </button>
            <button type="button" className="vs-hudbtn" onClick={() => setPanel("contact")}>
              Contact
            </button>
          </nav>
          <div className="vs-gauge">
            <div className="vs-lens">VISEUR — 24 IPS</div>
            <span className="vs-tc" ref={tcRef}>
              00:00:17:00
            </span>
            <div className="vs-rec">
              <div className="vs-rec-dot" aria-hidden />
              <span>REC</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bloc titre ────────────────────────────────────────────── */}
      <div className="vs-plate">
        <div className="vs-marks">
          <b>{p.category.toUpperCase()}</b>
          <em aria-hidden />
          {p.client.toUpperCase()}
          <em aria-hidden />
          {p.year}
          <button
            type="button"
            className="vs-toggle"
            aria-expanded={st === 2}
            onClick={() => {
              setIntro(false);
              setFiche((v) => !v);
            }}
          >
            {st === 2 ? "Replier la fiche" : "Fiche du plan"}
          </button>
        </div>

        <div className="vs-titles">
          {projects.map((f, i) => (
            <div
              key={f.slug}
              ref={(el) => {
                titleEls.current[i] = el;
              }}
              className="vs-ttl"
            >
              {f.title}
            </div>
          ))}
        </div>

        <p className="vs-approach">{p.approach}</p>
      </div>

      {/* ── La fiche du plan ──────────────────────────────────────── */}
      <div className="vs-panel" aria-hidden={st !== 2}>
        <div className="vs-panel-h">
          <span>FICHE DU PLAN</span>
          <span className="flex items-center gap-3">
            <span>
              {pad(active + 1)} / {pad(N)}
            </span>
            <button
              type="button"
              className="vs-panel-close"
              aria-label="Replier la fiche du plan"
              onClick={() => setFiche(false)}
              tabIndex={st === 2 ? 0 : -1}
            >
              <span aria-hidden>✕</span>
            </button>
          </span>
        </div>
        <dl className="m-0">
          <div className="vs-row">
            <dt>Client</dt>
            <dd>{p.client}</dd>
          </div>
          <div className="vs-row">
            <dt>Année</dt>
            <dd>{p.year}</dd>
          </div>
          <div className="vs-row">
            <dt>Catégorie</dt>
            <dd>{p.category}</dd>
          </div>
        </dl>
        <p className="vs-panel-a">
          <i>APPROCHE</i>
          <span>{p.approach}</span>
        </p>
        <Link
          className="vs-btn"
          href={`/viseur/${p.slug}`}
          tabIndex={st === 2 ? 0 : -1}
        >
          Voir le film <u aria-hidden>→</u>
        </Link>
      </div>

      <div className="vs-glowc" />

      <p className={`vs-hint${intro ? "" : " is-gone"}`}>
        <span className="vs-hint-arrow" aria-hidden>
          ‹
        </span>
        Tournez la bague
        <span className="vs-hint-arrow" aria-hidden>
          ›
        </span>
      </p>

      {/* ── LA BAGUE ──────────────────────────────────────────────── */}
      <div
        className="vs-stage"
        role="group"
        aria-label="Bague de mise au point — flèches gauche et droite pour changer de film"
      >
        <svg className="vs-arcs" viewBox="0 0 1760 214" preserveAspectRatio="none" aria-hidden>
          <path
            d="M0 48 Q880 96 1760 48"
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.16}
            strokeWidth="1"
          />
          <path
            d="M0 96 Q880 146 1760 96"
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth="1"
          />
          <path
            d="M0 152 Q880 200 1760 152"
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.07}
            strokeWidth="1"
          />
        </svg>

        <div className="vs-ring">
          {projects.map((f, i) => (
            <button
              key={f.slug}
              type="button"
              ref={(el) => {
                labelEls.current[i] = el;
              }}
              className="vs-lbl"
              aria-current={i === active ? "true" : undefined}
              onClick={() => goTo(i)}
              onFocus={() => {
                if (i !== activeRef.current) goTo(i);
              }}
            >
              {f.title}
              <span className="n">
                {pad(i + 1)} — {f.year}
              </span>
            </button>
          ))}

          {Array.from({ length: TICKS }, (_, k) => (
            <div
              key={k}
              ref={(el) => {
                tickEls.current[k] = el;
              }}
              className="vs-tick"
              style={{ height: k % SUB === 0 ? 19 : 9 }}
              aria-hidden
            />
          ))}
        </div>

        <div className="vs-index" aria-hidden />
      </div>

      <p className="vs-foot">L&apos;IMAGE AU SERVICE DE VOTRE HISTOIRE.</p>
      <p className="vs-foot-r">
        {site.city.toUpperCase()} — DEPUIS {site.founded}
      </p>

      {/* ── Les panneaux ──────────────────────────────────────────── */}
      <ViseurOverlay
        open={panel === "index"}
        onClose={() => setPanel(null)}
        kicker={`${pad(N)} films`}
        title="Tout voir"
        reduced={reduced}
      >
        <IndexPanelBody
          current={active}
          onPick={(i) => {
            goTo(i);
            setPanel(null);
          }}
        />
      </ViseurOverlay>

      <ViseurOverlay
        open={panel === "studio"}
        onClose={() => setPanel(null)}
        kicker={`${site.city} — depuis ${site.founded}`}
        title="Le studio"
        reduced={reduced}
      >
        <StudioPanelBody />
      </ViseurOverlay>

      <ViseurOverlay
        open={panel === "contact"}
        onClose={() => setPanel(null)}
        kicker="Parlons de votre film"
        title="Contact"
        reduced={reduced}
      >
        <ContactPanelBody />
      </ViseurOverlay>
    </div>
  );
}
