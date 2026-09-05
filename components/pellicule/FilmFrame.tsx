"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  projectPreview,
  projectStills,
  projectThumb,
  type Project,
} from "@/lib/site";

/** Les trois cadrages de photogramme repris de la maquette. */
export type FilmKind = "cover" | "framed" | "split";

export type FilmSpec = {
  /** Largeur du photogramme en unités de bande (× --pel-u). */
  w: number;
  kind: FilmKind;
  /** Index du still dans /public/projects/<slug>/ (0 = 1.jpg). */
  still: number;
};

/**
 * Le rythme de la bande : des photogrammes de largeurs variables, dans
 * l'ordre de `projects`. C'est de la mise en page, pas du contenu — le
 * texte, lui, vient entièrement de lib/site.ts.
 */
export const FILM_LAYOUT: FilmSpec[] = [
  { w: 1440, kind: "cover", still: 0 },
  { w: 700, kind: "framed", still: 1 },
  { w: 1240, kind: "cover", still: 0 },
  { w: 720, kind: "cover", still: 0 },
  { w: 1240, kind: "split", still: 0 },
  { w: 860, kind: "framed", still: 0 },
];

export function filmSpec(i: number): FilmSpec {
  return FILM_LAYOUT[i % FILM_LAYOUT.length];
}

/**
 * UN PHOTOGRAMME DE FILM.
 *
 * L'extrait muet ne se charge jamais d'avance : les six pèsent 20 Mo. Deux
 * observateurs sur le conteneur de défilement (horizontal en desktop, la
 * fenêtre en mobile) suffisent —
 *   · le premier, à large marge, MONTE la balise <video> à l'approche ;
 *   · le second, au ras du champ, la LIT quand le photogramme entre et la
 *     met en pause dès qu'il sort.
 * Tant que rien n'est joué, seul le still est affiché.
 */
export function FilmFrame({
  project,
  spec,
  filmNo,
  panelNo,
  eager,
  axis,
  ioRoot,
}: {
  project: Project;
  spec: FilmSpec;
  /** Numéro du film dans la filmographie (01…06). */
  filmNo: string;
  /** Numéro du photogramme sur la bande (03…08). */
  panelNo: string;
  eager: boolean;
  axis: "x" | "y" | null;
  ioRoot: HTMLElement | null;
}) {
  const hostRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);

  const preview = projectPreview(project);
  const still = projectStills(project)[spec.still] ?? projectThumb(project);
  const meta = [project.client, project.category, project.year].join(" — ");
  const href = `/realisations/${project.slug}`;

  // 1er observateur — l'approche : on monte la balise (preload="none", donc
  // toujours aucun octet de vidéo transféré) puis on ne redescend jamais,
  // pour éviter les cycles de montage/démontage en aller-retour.
  useEffect(() => {
    const el = hostRef.current;
    if (!el || !axis || near || !preview) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setNear(true);
      },
      {
        root: ioRoot,
        rootMargin: axis === "x" ? "0px 80% 0px 80%" : "80% 0px 80% 0px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [axis, ioRoot, near, preview]);

  // 2e observateur — l'entrée en champ : lecture / pause.
  useEffect(() => {
    const el = hostRef.current;
    if (!el || !axis || !near) return;
    const io = new IntersectionObserver(
      (entries) => {
        const v = videoRef.current;
        if (!v) return;
        const visible = entries[entries.length - 1].intersectionRatio >= 0.2;
        if (visible) {
          // Muet + playsInline : la lecture automatique est autorisée. Un
          // refus (onglet en arrière-plan, économiseur de données) ne doit
          // rien casser — le still reste à l'écran.
          void v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { root: ioRoot, threshold: [0, 0.2, 0.5] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      videoRef.current?.pause();
    };
  }, [axis, ioRoot, near]);

  const media = (
    <>
      <img
        className="pel-media"
        data-parallax=""
        src={still}
        alt=""
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      {near && preview ? (
        <video
          ref={videoRef}
          className="pel-media pel-media-video"
          data-parallax=""
          data-playing={playing ? "true" : "false"}
          src={preview}
          poster={still}
          preload="none"
          muted
          loop
          playsInline
          tabIndex={-1}
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
        />
      ) : null}
    </>
  );

  const see = (
    <span className="pel-see font-cond" aria-hidden="true">
      Voir le film
      <i />
    </span>
  );

  const approach = `« ${project.approach} »`;
  const label = `${project.title} — voir la réalisation`;

  return (
    <section
      ref={hostRef}
      data-pel-panel=""
      data-tone="dark"
      tabIndex={0}
      aria-label={`Photogramme ${panelNo} — ${project.title}`}
      className={
        "pel-panel" +
        (spec.kind === "framed"
          ? " pel-framed"
          : spec.kind === "split"
            ? " pel-split"
            : "")
      }
      style={{ "--pel-w": spec.w } as React.CSSProperties}
    >
      {spec.kind === "cover" ? (
        <>
          {media}
          <div className="pel-scrim" />
          <div className="pel-cap">
            <div className="pel-meta font-cond">
              <s>{filmNo}</s>
              {meta}
            </div>
            <h2 className="font-wide">{project.title}</h2>
            <p className="pel-appr">{approach}</p>
            {see}
          </div>
        </>
      ) : spec.kind === "framed" ? (
        <>
          <div className="pel-meta font-cond">
            <s>{filmNo}</s>
            {meta}
          </div>
          <div className="pel-frame">{media}</div>
          <h2 className="font-wide">{project.title}</h2>
          <p className="pel-appr">{approach}</p>
          {see}
        </>
      ) : (
        <>
          <div className="pel-im">{media}</div>
          <div className="pel-txt">
            <div className="pel-idx font-cond">{filmNo}</div>
            <div className="pel-meta font-cond">{meta}</div>
            <h2 className="font-wide">{project.title}</h2>
            <p className="pel-appr">{approach}</p>
            {see}
          </div>
        </>
      )}

      <Link className="pel-hit" href={href} aria-label={label} />

      <span
        className={
          "pel-num font-cond" + (spec.kind === "cover" ? " pel-num-photo" : "")
        }
        aria-hidden="true"
      >
        {panelNo}
      </span>
    </section>
  );
}
