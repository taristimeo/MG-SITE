"use client";

// La table de montage : bandeau, visionneuse, timeline, outils tactiles et
// feuille « Ajouter au montage ». Les panneaux (chutier, films, studio,
// contact) sont les enfants : ils changent avec la route, la table reste.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AUTO_SEQUENCE,
  NOTES,
  durFor,
  films,
  pad,
  plural,
  rushes,
  short,
  tc,
  total,
} from "@/lib/montage";
import { site } from "@/lib/site";
import { isMobileNow, pps, reducedMotion, useIsMobile, useMontage } from "./store";

type View = "montage" | "films" | "studio" | "contact";

function viewFor(path: string): View {
  if (path.startsWith("/films")) return "films";
  if (path.startsWith("/studio")) return "studio";
  if (path.startsWith("/contact")) return "contact";
  return "montage";
}

const NAV: { href: string; label: string; view: View }[] = [
  { href: "/", label: "Montage", view: "montage" },
  { href: "/films", label: "Films", view: "films" },
  { href: "/studio", label: "Studio", view: "studio" },
  { href: "/contact", label: "Contact", view: "contact" },
];

function makeGhost(r: number): HTMLDivElement {
  const g = document.createElement("div");
  g.className = "ghost";
  g.style.backgroundImage = `url(${rushes[r].poster})`;
  g.innerHTML = `<span class="lab">${films[rushes[r].film].title} · ${pad(rushes[r].k + 1)}</span>`;
  document.body.appendChild(g);
  return g;
}

export function Table({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const view = viewFor(pathname);
  const mobile = useIsMobile();
  const { state, live, drag, clipsRef, set, addClip, removeClip, moveClip, trimClip, clear, takeHand, seek } =
    useMontage();
  const { clips, auto, sel, editMode, playing, nerveux, pop, sheet, openNote, hydrated } = state;

  // Nœuds écrits à chaque image
  const tcTop = useRef<HTMLSpanElement>(null);
  const tcIn = useRef<HTMLSpanElement>(null);
  const phTc = useRef<HTMLSpanElement>(null);
  const playhead = useRef<HTMLDivElement>(null);
  const tempoDot = useRef<HTMLElement>(null);
  const tempoLbl = useRef<HTMLSpanElement>(null);
  const tlScroll = useRef<HTMLDivElement>(null);
  const clipsEl = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const insert = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLElement>(null);
  const frA = useRef<HTMLImageElement>(null);
  const frB = useRef<HTMLImageElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const shownA = useRef(true);
  const [titre, setTitre] = useState<{ t: string; m: string }>({ t: "—", m: "—" });
  const viewRef = useRef(view);
  viewRef.current = view;
  const stateRef = useRef(state);
  stateRef.current = state;

  const P = () => pps(stateRef.current.nerveux);

  /* ── Visionneuse ─────────────────────────────────────────────────── */
  const stopVideos = useCallback((except?: number) => {
    videos.current.forEach((v, i) => {
      if (!v || i === except) return;
      v.classList.remove("on");
      if (!v.paused) v.pause();
    });
  }, []);

  const showRush = useCallback(
    (r: number, hard: boolean) => {
      const rush = rushes[r];
      const a = frA.current, b = frB.current, sc = screen.current;
      if (!a || !b || !sc) return;
      const next = shownA.current ? b : a, prev = shownA.current ? a : b;
      next.src = rush.poster;
      sc.classList.toggle("soft", !hard && !reducedMotion());
      next.classList.add("on");
      prev.classList.remove("on");
      shownA.current = !shownA.current;
      const f = films[rush.film];
      setTitre({ t: f.title, m: `${f.client} · ${f.category} · ${f.year} · plan ${pad(rush.k + 1)}` });
      // La vidéo du film : on se cale sur le point d'entrée du rush.
      stopVideos(rush.film);
      const v = videos.current[rush.film];
      if (!v) return;
      const start = () => {
        try {
          v.currentTime = rush.in;
        } catch {
          /* métadonnées pas encore là : on réessaie au prochain plan */
        }
        if (stateRef.current.playing) v.play().catch(() => {});
      };
      if (v.readyState >= 1) start();
      else {
        v.addEventListener("loadedmetadata", start, { once: true });
        if (v.preload === "none") { v.preload = "auto"; v.load(); }
      }
    },
    [stopVideos],
  );

  const showEmpty = useCallback(() => {
    frA.current?.classList.remove("on");
    frB.current?.classList.remove("on");
    stopVideos();
    setTitre({ t: "—", m: "—" });
  }, [stopVideos]);

  // Lecture / pause suit l'état
  useEffect(() => {
    videos.current.forEach((v) => {
      if (!v || !v.classList.contains("on")) return;
      if (playing) v.play().catch(() => {});
      else v.pause();
    });
  }, [playing]);

  // Vue studio : le portrait dans la visionneuse, les vidéos en pause.
  useEffect(() => {
    if (view === "studio") {
      takeHand();
      set({ playing: false });
      const a = frA.current, b = frB.current;
      if (a && b) { a.src = "/photo-studio.jpg"; a.classList.add("on"); b.classList.remove("on"); shownA.current = true; }
      stopVideos();
      live.current.curClip = -2;
      setTitre({ t: site.founder, m: "Fondateur · réalisateur · Bordeaux" });
    } else if (live.current.curClip === -2) {
      live.current.curClip = -1;
      set({ playing: true });
    }
    set({ editMode: "", sheet: null, sel: -1 });
    if (isMobileNow()) window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  /* ── Boucle : position, timecodes, tempo ─────────────────────────── */
  useEffect(() => {
    let raf = 0, lastT = 0;
    const tick = (t: number) => {
      const L = live.current, cl = clipsRef.current, st = stateRef.current;
      const dt = lastT ? Math.min(0.1, (t - lastT) / 1000) : 0;
      lastT = t;
      const tot = total(cl);
      if (st.playing && cl.length) { L.pos += dt; if (L.pos >= tot) L.pos = 0; }
      let acc = 0, idx = -1;
      for (let i = 0; i < cl.length; i++) { if (L.pos < acc + cl[i].d) { idx = i; break; } acc += cl[i].d; }
      const studio = viewRef.current === "studio";
      if (!studio && idx !== L.curClip && idx >= 0) { showRush(cl[idx].r, L.tempo > 0.55); L.curClip = idx; }
      if (!studio && !cl.length && L.curClip !== -1) { L.curClip = -1; showEmpty(); }
      const p = P();
      if (playhead.current) playhead.current.style.left = `${L.pos * p}px`;
      const s = tc(L.pos);
      if (phTc.current) phTc.current.textContent = s;
      if (tcIn.current) tcIn.current.textContent = s;
      if (tcTop.current) tcTop.current.textContent = s;
      // la timeline suit la tête de lecture
      const sc = tlScroll.current;
      if (sc && st.playing) {
        const x = L.pos * p;
        if (x > sc.scrollLeft + sc.clientWidth - 80 || x < sc.scrollLeft) sc.scrollLeft = Math.max(0, x - sc.clientWidth * 0.4);
      }
      // décroissance du tempo
      if (!L.holdTempo) L.tempo += (0.18 - L.tempo) * dt * 0.35;
      if (tempoDot.current) tempoDot.current.style.left = `${12 + L.tempo * 76}%`;
      const lbl = L.tempo < 0.35 ? "Rythme lent · plans longs" : L.tempo < 0.65 ? "Rythme posé · coupes franches" : "Rythme nerveux · coupes sèches";
      if (tempoLbl.current && tempoLbl.current.textContent !== lbl) tempoLbl.current.textContent = lbl;
      const nv = L.tempo >= 0.65;
      if (nv !== st.nerveux) set({ nerveux: nv });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Le rythme : vitesse du pointeur, de la molette, du défilement.
  useEffect(() => {
    let lastP: { x: number; y: number; t: number } | null = null;
    let lastY: number | null = null, lastYT = 0;
    const L = live.current;
    const onMove = (e: PointerEvent) => {
      L.holdTempo = false;
      if (lastP) { const v = Math.hypot(e.clientX - lastP.x, e.clientY - lastP.y) / Math.max(1, e.timeStamp - lastP.t); L.tempo = Math.min(1, L.tempo + v * 0.06); }
      lastP = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    };
    const onWheel = (e: WheelEvent) => { L.holdTempo = false; L.tempo = Math.min(1, L.tempo + Math.abs(e.deltaY) * 0.002); };
    const onScroll = (e: Event) => {
      const y = e.target === document ? window.scrollY : (e.target as HTMLElement).scrollLeft + (e.target as HTMLElement).scrollTop;
      const t = performance.now();
      if (lastY != null) { const v = Math.abs(y - lastY) / Math.max(1, t - lastYT); L.tempo = Math.min(1, L.tempo + v * 0.05); L.holdTempo = false; }
      lastY = y; lastYT = t;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
    };
  }, [live]);

  /* ── Le premier montage, monté par le site ───────────────────────── */
  const slotRect = useCallback((at: number) => {
    const tr = track.current?.getBoundingClientRect();
    if (!tr) return { x: window.innerWidth / 2, y: window.innerHeight - 100 };
    const p = P(), cl = clipsRef.current;
    let x = 0;
    for (let i = 0; i < Math.min(at, cl.length); i++) x += cl[i].d * p;
    x += (durFor(0, live.current.tempo) * p) / 2 - (tlScroll.current?.scrollLeft ?? 0);
    return { x: tr.left + Math.min(x, tr.width - 60), y: tr.top + tr.height / 2 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rushRect = useCallback((r: number) => {
    const el = document.querySelector<HTMLElement>(`[data-r="${r}"]`);
    let rc = el && !el.classList.contains("hide") ? el.getBoundingClientRect() : null;
    if (!rc || rc.width === 0) { const sr = screen.current?.getBoundingClientRect(); rc = sr ? new DOMRect(sr.right - 200, sr.top + 40, 140, 80) : new DOMRect(200, 200, 140, 80); }
    return rc;
  }, []);

  useEffect(() => {
    if (!hydrated || !auto) return;
    if (clipsRef.current.length) return; // montage restauré : on ne remonte pas
    if (reducedMotion()) {
      AUTO_SEQUENCE.slice(0, 4).forEach((r) => addClip(r));
      set({ auto: false, sel: -1 });
      return;
    }
    const gen = ++live.current.gen;
    let timer = 0;
    const ghosts: HTMLDivElement[] = [];
    const step = (n: number) => {
      if (live.current.gen !== gen || !stateRef.current.auto || n >= AUTO_SEQUENCE.length) return;
      const r = AUTO_SEQUENCE[n];
      const from = rushRect(r);
      document.querySelector(`[data-r="${r}"]`)?.classList.add("sel");
      const g = makeGhost(r);
      ghosts.push(g);
      g.style.left = `${from.left + from.width / 2}px`;
      g.style.top = `${from.top + from.height / 2}px`;
      const target = slotRect(clipsRef.current.length);
      const dx = target.x - (from.left + from.width / 2), dy = target.y - (from.top + from.height / 2);
      const a = g.animate(
        [
          { transform: "translate(-50%,-50%) rotate(-2deg) scale(.7)", opacity: 0.6 },
          { transform: `translate(calc(-50% + ${dx * 0.55}px), calc(-50% + ${dy * 0.45}px)) rotate(3deg) scale(1.05)`, opacity: 1, offset: 0.55 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(0) scale(.62)`, opacity: 1 },
        ],
        { duration: 1100, easing: "cubic-bezier(.22,.61,.36,1)", fill: "forwards" },
      );
      a.onfinish = () => {
        g.remove();
        document.querySelector(`[data-r="${r}"]`)?.classList.remove("sel");
        if (live.current.gen !== gen || !stateRef.current.auto) return;
        addClip(r);
        set({ sel: -1 });
        timer = window.setTimeout(() => step(n + 1), 700 + (1 - live.current.tempo) * 1400);
      };
    };
    timer = window.setTimeout(() => step(0), 700);
    return () => {
      clearTimeout(timer);
      ghosts.forEach((g) => g.remove());
      document.querySelectorAll("[data-r].sel").forEach((el) => el.classList.remove("sel"));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, auto]);

  /* ── Glisser-déposer (pointer events) ─────────────────────────────── */
  const dragState = useRef<{ r: number; from: number | null; ghost: HTMLDivElement } | null>(null);
  const insertIndexAt = useCallback((x: number) => {
    const els = clipsEl.current?.querySelectorAll<HTMLElement>(".clip") ?? [];
    let idx = els.length;
    for (let i = 0; i < els.length; i++) { const rc = els[i].getBoundingClientRect(); if (x < rc.left + rc.width / 2) { idx = i; break; } }
    return idx;
  }, []);
  const showInsert = useCallback((idx: number) => {
    const ins = insert.current, els = clipsEl.current?.querySelectorAll<HTMLElement>(".clip") ?? [];
    if (!ins) return;
    let x: number;
    if (!els.length) x = 0;
    else if (idx >= els.length) { const l = els[els.length - 1]; x = l.offsetLeft + l.offsetWidth + 1; }
    else x = els[idx].offsetLeft - 2;
    ins.style.left = `${x}px`;
    ins.classList.add("on");
  }, []);
  const overTrack = useCallback((e: { clientX: number; clientY: number }) => {
    const rc = track.current?.getBoundingClientRect();
    return !!rc && e.clientY > rc.top - 30 && e.clientY < rc.bottom + 30 && e.clientX >= rc.left && e.clientX <= rc.right;
  }, []);

  useEffect(() => {
    drag.current = {
      active: () => !!dragState.current,
      start: (e, r, from) => {
        takeHand();
        const ghost = makeGhost(r);
        ghost.style.left = `${e.clientX}px`;
        ghost.style.top = `${e.clientY}px`;
        dragState.current = { r, from, ghost };
        document.body.classList.add("dragging");
        if (from != null) clipsEl.current?.children[from]?.classList.add("ghosted");
      },
      move: (e) => {
        const d = dragState.current;
        if (!d) return;
        d.ghost.style.left = `${e.clientX}px`;
        d.ghost.style.top = `${e.clientY}px`;
        if (overTrack(e)) showInsert(insertIndexAt(e.clientX));
        else insert.current?.classList.remove("on");
      },
      end: (e) => {
        document.body.classList.remove("dragging");
        insert.current?.classList.remove("on");
        const d = dragState.current;
        if (!d) return;
        dragState.current = null;
        clipsEl.current?.querySelectorAll(".ghosted").forEach((el) => el.classList.remove("ghosted"));
        if (e && overTrack(e)) {
          const idx = insertIndexAt(e.clientX);
          if (d.from != null) moveClip(d.from, idx);
          else addClip(d.r, idx);
          d.ghost.remove();
        } else {
          const g = d.ghost;
          g.animate([{ opacity: 1 }, { opacity: 0, transform: "translate(-50%,-50%) scale(.6)" }], { duration: 220, fill: "forwards" }).onfinish = () => g.remove();
        }
      },
    };
    const onMove = (e: PointerEvent) => { const d = dragState.current; if (d && d.from == null) drag.current?.move(e); };
    const onUp = (e: PointerEvent) => { const d = dragState.current; if (d && d.from == null) drag.current?.end(e); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [drag, takeHand, moveClip, addClip, overTrack, showInsert, insertIndexAt]);

  /* ── Timeline : sélection, réordonnancement, rognage ─────────────── */
  const tPend = useRef<{ x: number; y: number; i: number } | null>(null);
  const trim = useRef<{ i: number; side: string; x: number; d: number; live?: number } | null>(null);
  const clipHold = useRef(0);

  const onClipsDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    const z = t.closest<HTMLElement>(".dz");
    if (z) { if (sel >= 0) { moveClip(sel, +z.dataset.at!); set({ editMode: "sel" }); } return; }
    const h = t.closest<HTMLElement>(".h"), c = t.closest<HTMLElement>(".clip");
    if (!c) return;
    const i = +c.dataset.i!;
    takeHand();
    if (h) { trim.current = { i, side: h.dataset.h!, x: e.clientX, d: clipsRef.current[i].d }; e.currentTarget.setPointerCapture(e.pointerId); e.preventDefault(); return; }
    const touch = e.pointerType === "touch" && isMobileNow();
    if (touch) {
      if (editMode !== "move") set({ sel: i, editMode: editMode || "sel" });
      clearTimeout(clipHold.current);
      clipHold.current = window.setTimeout(() => { set({ sel: i, editMode: "move" }); tPend.current = null; }, 450);
      if (editMode !== "move") return; // hors mode déplacer, la timeline défile au doigt
    }
    set({ sel: i });
    tPend.current = { x: e.clientX, y: e.clientY, i };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onClipsMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (clipHold.current && tPend.current && Math.hypot(e.clientX - tPend.current.x, e.clientY - tPend.current.y) > 8) { clearTimeout(clipHold.current); clipHold.current = 0; }
    const tr = trim.current;
    if (tr) {
      const dx = (e.clientX - tr.x) / P(), nd = tr.side === "r" ? tr.d + dx : tr.d - dx;
      const d = Math.max(0.6, Math.min(12, +nd.toFixed(1)));
      const el = clipsEl.current?.querySelector<HTMLElement>(`.clip[data-i="${tr.i}"]`);
      if (el) { el.style.width = `${Math.max(18, d * P() - 3)}px`; const dd = el.querySelector(".d"); if (dd) dd.textContent = `${d.toFixed(1)}s`; }
      tr.live = d; // la durée finale est posée au relâchement
      return;
    }
    const p = tPend.current;
    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 8) { drag.current?.start(e, clipsRef.current[p.i].r, p.i); tPend.current = null; }
    if (dragState.current) drag.current?.move(e);
  };
  const onClipsUp = (e: React.PointerEvent<HTMLDivElement>) => {
    clearTimeout(clipHold.current); clipHold.current = 0;
    const tr = trim.current;
    if (tr) { if (tr.live != null) trimClip(tr.i, tr.live); trim.current = null; }
    tPend.current = null;
    if (dragState.current) drag.current?.end(e);
  };
  const onClipsKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const c = (e.target as HTMLElement).closest<HTMLElement>(".clip");
    if (!c) return;
    const i = +c.dataset.i!;
    takeHand();
    if (e.key === "Delete" || e.key === "Backspace") removeClip(i);
    else if (e.key === "ArrowLeft" && e.altKey && i > 0) moveClip(i, i - 1);
    else if (e.key === "ArrowRight" && e.altKey && i < clips.length - 1) moveClip(i, i + 2);
    else if (e.key === "+" || e.key === "=") trimClip(i, Math.min(12, +(clips[i].d + 0.5).toFixed(1)));
    else if (e.key === "-") trimClip(i, Math.max(0.6, +(clips[i].d - 0.5).toFixed(1)));
    else return;
    e.preventDefault();
  };
  const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    if (t.closest(".clip, .dz, .mark")) return;
    if (isMobileNow() && editMode) { set({ editMode: "", sel: -1 }); return; }
    const rc = e.currentTarget.parentElement!.getBoundingClientRect();
    seek(Math.max(0, Math.min(total(clips), (e.clientX - rc.left) / P())));
    set({ sel: -1 });
  };

  // Zoom de la timeline sur les coupes serrées
  useEffect(() => {
    document.documentElement.style.setProperty("--pps", String(pps(nerveux)));
  }, [nerveux, mobile]);

  /* ── Rendu ───────────────────────────────────────────────────────── */
  const p = pps(nerveux);
  const tot = total(clips);
  const T = Math.max(tot + 8, mobile ? 24 : 46);
  const ticks: ReactNode[] = [];
  for (let s = 0; s <= T; s++) ticks.push(<i key={s} className={s % 5 === 0 ? "big" : ""} style={{ left: s * p }}>{s % 5 === 0 ? <span>{short(s)}</span> : null}</i>);
  const editing = mobile && !!editMode && sel >= 0 && sel < clips.length;
  const dz = (k: number) => (mobile && editMode === "move" && sel >= 0 && k !== sel && k !== sel + 1 ? <span key={`dz${k}`} className="dz" data-at={k} role="button" aria-label="Déposer ici" /> : null);
  const owner = view === "studio" ? "porte-notes" : auto ? "le site monte" : "votre montage";
  const hint = view === "studio" ? "Les partis pris du fondateur, en timecode" : auto ? (nerveux ? "Vous allez vite — le site coupe sec" : "Le montage suit votre rythme") : "Vous avez la main — glisser, réordonner, rogner";
  const sum = view === "studio" ? `${NOTES.length} notes · 0:42` : `${plural(clips.length, "plan")} · ${short(tot)}`;
  const sheetRush = sheet != null ? rushes[sheet] : null;
  const sheetFilm = sheetRush ? films[sheetRush.film] : null;
  const filmRushes = sheetRush ? rushes.filter((x) => x.film === sheetRush.film) : [];

  // Le relâchement du doigt après un appui long produit un clic sur le voile :
  // on ignore ce clic pendant la demi-seconde qui suit l'ouverture.
  const sheetOpenedAt = useRef(0);
  useEffect(() => { if (sheet != null) sheetOpenedAt.current = performance.now(); }, [sheet]);
  const closeSheet = () => set({ sheet: null });
  const onVeil = () => { if (performance.now() - sheetOpenedAt.current > 500) closeSheet(); };
  const addFilm = (fi: number) => {
    takeHand();
    rushes.filter((r) => r.film === fi).forEach((r, k) => setTimeout(() => addClip(r.i), k * 120));
  };

  return (
    <div className="mg">
      <header className="top">
        <Link className="logo wide" href="/" aria-label="Mauvais Grain, accueil">Mauvais Grain<span className="dot">.</span></Link>
        <nav className="menu cond" aria-label="Menu">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={n.view === view ? "on" : ""} aria-current={n.view === view ? "page" : undefined}>{n.label}</Link>
          ))}
        </nav>
        <div className="top-r cond">
          <span className="rythme"><i /><span>{auto ? "Le montage suit votre rythme" : "Vous avez la main"}</span></span>
          <span className="tc" ref={tcTop}>00:00:00:00</span>
        </div>
      </header>

      <main className={`mg-table${editing ? " editing" : ""}`} data-view={view}>
        {view === "montage" || view === "studio" ? (
          <section className="stage" aria-label="Table de montage">
            <div className="viewer">
              <figure className="screen soft" ref={screen}>
                <img alt="" ref={frA} />
                <img alt="" ref={frB} />
                {films.map((f, i) => (
                  <video
                    key={f.slug}
                    ref={(el) => { videos.current[i] = el; }}
                    src={`/projects/${f.slug}/preview.mp4`}
                    muted
                    playsInline
                    preload="none"
                    aria-hidden="true"
                    onPlaying={(e) => e.currentTarget.classList.add("on")}
                    onEnded={(e) => { const v = e.currentTarget; const cur = live.current.curClip; const cl = clipsRef.current[cur]; if (cl && rushes[cl.r].film === i) { v.currentTime = rushes[cl.r].in; v.play().catch(() => {}); } }}
                  />
                ))}
                <div className={`empty cond${view === "studio" || clips.length ? " off" : ""}`}>Timeline vide —<br />glissez un plan pour commencer</div>
                <span className="cond tcin" ref={tcIn}>00:00:00:00</span>
                <span className="cond rec"><i />{playing ? "Lecture" : "Pause"}</span>
              </figure>
              <div className="under cond">
                <span className="wide titre">{titre.t}</span>
                <span>{titre.m}</span>
                <span className="tempo"><span ref={tempoLbl}>Rythme lent · plans longs</span><span className="bar"><i ref={tempoDot} /></span></span>
              </div>
            </div>
            {children}
          </section>
        ) : (
          children
        )}

        <footer className={`timeline${nerveux ? " nerveux" : ""}`} aria-label="Timeline">
          <div className="tl-head cond">
            <span><span className="edl-tag"><b>EDL v.01</b> — </span>{owner}</span>
            <span>{sum}</span>
            <span className="hint">{hint}</span>
            {nerveux && view !== "studio" ? <span className="rythme-tag">Nerveux · coupes sèches</span> : null}
            <span className="hand">
              <button type="button" onClick={() => set({ playing: !playing })}>{playing ? "Pause" : "Lecture"}</button>
              <button type="button" className="desk" onClick={() => { takeHand(); removeClip(sel); }} disabled={sel < 0}>Retirer le plan</button>
              <button type="button" className="desk" onClick={() => { takeHand(); clear(); }}>Vider</button>
            </span>
          </div>
          <div className="tl-scroll" ref={tlScroll}>
            <div className="tl-inner" style={{ width: T * p + 120 }}>
              <div className="ruler">{ticks}</div>
              <div className="track" ref={track} onClick={onTrackClick}>
                <div className="clips" ref={clipsEl} role="listbox" aria-label="Plans du montage" onPointerDown={onClipsDown} onPointerMove={onClipsMove} onPointerUp={onClipsUp} onPointerCancel={onClipsUp} onKeyDown={onClipsKey}>
                  {clips.map((c, i) => {
                    const r = rushes[c.r];
                    return [
                      dz(i),
                      <div
                        key={`c${i}-${c.r}`}
                        className={`clip${i === sel ? " sel" : ""}${i === pop ? " pop" : ""}${mobile && editMode === "move" && i === sel ? " lift" : ""}`}
                        data-i={i}
                        tabIndex={0}
                        role="option"
                        aria-selected={i === sel}
                        aria-label={`Plan ${i + 1}, ${films[r.film].title}, ${c.d} secondes`}
                        style={{ width: Math.max(18, c.d * p - 3), backgroundImage: `url(${r.poster})` }}
                      >
                        <span className="n">{pad(i + 1)}</span>
                        <span className="d">{c.d.toFixed(1)}s</span>
                        <span className="h l" data-h="l" />
                        <span className="h r" data-h="r" />
                      </div>,
                    ];
                  })}
                  {dz(clips.length)}
                </div>
                <div className={`tl-empty cond${clips.length ? " off" : ""}`}>Timeline vide — déposez un plan ici</div>
                <div className="insert" ref={insert} />
                <div className="playhead" ref={playhead}><span ref={phTc}>00:00:00:00</span></div>
                <div className="marks">
                  {NOTES.map((n, i) => (
                    <div key={i} className={`mark${i === openNote ? " open" : ""}`} role="button" tabIndex={0} style={{ left: n.at * p }} onClick={() => set({ openNote: openNote === i ? -1 : i })} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set({ openNote: openNote === i ? -1 : i }); } }}>
                      <span className="cond">Note {pad(i + 1)} · {tc(n.at)}</span>
                      <b>{n.title}</b>
                      <small>Parti pris du fondateur — toucher pour ouvrir</small>
                      <span className="body">{n.body}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>

        <div className="tl-tools cond" role="toolbar" aria-label="Plan sélectionné">
          <span className="who"><b>Plan {pad(sel + 1)}</b><span>{sel >= 0 && clips[sel] ? `${clips[sel].d.toFixed(1)}s` : ""}</span></span>
          <button type="button" onClick={() => { removeClip(sel); set({ editMode: clips.length > 1 ? "sel" : "", sel: clips.length > 1 ? Math.max(0, sel - 1) : -1 }); }}>Retirer</button>
          <button type="button" className={editMode === "trim" ? "on" : ""} onClick={() => set({ editMode: editMode === "trim" ? "sel" : "trim" })}>Rogner</button>
          <button type="button" className={editMode === "move" ? "on" : ""} onClick={() => set({ editMode: editMode === "move" ? "sel" : "move" })}>Déplacer</button>
          <button type="button" className="ok" onClick={() => set({ editMode: "", sel: -1 })}>OK</button>
        </div>
      </main>

      <div className={`veil${sheet != null ? " on" : ""}`} onClick={onVeil} />
      <div className={`sheet${sheet != null ? " on" : ""}`} role="dialog" aria-label="Ajouter au montage" aria-hidden={sheet == null}>
        <div className="grip" />
        {sheetRush && sheetFilm ? (
          <>
            <div className="prev">
              <figure style={{ backgroundImage: `url(${sheetRush.poster})` }}><i>{sheetRush.nat.toFixed(1)}s</i></figure>
              <div>
                <b>{sheetFilm.title}</b>
                <span className="cond">{sheetFilm.client} · {sheetFilm.category} · {sheetFilm.year}<br />Plan <strong>{sheetRush.code}</strong> · <strong>{durFor(sheetRush.i, live.current.tempo).toFixed(1)}s</strong> au rythme actuel</span>
              </div>
            </div>
            <button type="button" className="btn terra cond" onClick={() => { takeHand(); addClip(sheetRush.i); closeSheet(); }}>Ajouter au montage</button>
            <div className="row">
              <button type="button" className="btn cond" onClick={() => { addFilm(sheetRush.film); closeSheet(); }}>Tout le film · {filmRushes.length} plans · {filmRushes.reduce((a, x) => a + x.nat, 0).toFixed(1)}s</button>
              <button type="button" className="btn cond" onClick={closeSheet}>Annuler</button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
