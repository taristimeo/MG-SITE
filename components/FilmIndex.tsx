"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FilmCanvas, type FilmHandle } from "@/components/grain/FilmCanvas";
import {
  projectPreview,
  projectThumb,
  services,
  type Project,
} from "@/lib/site";

/**
 * L'INDEX DES FILMS.
 *
 * Une liste de titres en grand, et un seul tirage qui révèle le film que la
 * main survole (ou, au doigt, celui qui passe au centre). La liste est la page ;
 * l'image réagit au texte.
 */
export function FilmIndex({ projects }: { projects: Project[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const filter = params.get("f") ?? "";
  const filmRef = useRef<FilmHandle>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const list = useMemo(() => {
    if (!filter) return projects;
    const s = services.find((x) => x.id === filter);
    if (!s) return projects;
    const out = projects.filter((p) => p.category.toLowerCase() === s.title.toLowerCase());
    return out.length ? out : projects;
  }, [filter, projects]);

  // Le tirage suit le film actif : déplacement, puis extrait.
  const first = useRef(true);
  useEffect(() => {
    const film = filmRef.current;
    const p = list[active];
    if (!film || !p) return;
    if (first.current) first.current = false;
    else film.go(projectThumb(p), 900);

    const v = videoRef.current;
    const src = projectPreview(p);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    film.attachVideo(null);
    if (!v || !src || reduced) return;
    v.pause();
    v.src = src;
    const t = setTimeout(() => {
      film.attachVideo(v);
      v.play().catch(() => {});
    }, 650);
    return () => clearTimeout(t);
  }, [active, list]);

  // Filtre changé : on repart du premier.
  useEffect(() => {
    activeRef.current = 0;
    setActive(0);
  }, [list]);

  // Au doigt : le film le plus proche du milieu de l'écran devient actif.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine) return;
    const ol = listRef.current;
    if (!ol) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.55;
      let best = 0;
      let bestD = Infinity;
      Array.from(ol.children).forEach((li, i) => {
        const b = li.getBoundingClientRect();
        const d = Math.abs(b.top + b.height / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      if (best !== activeRef.current) {
        activeRef.current = best;
        setActive(best);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [list]);

  const hover = (i: number) => {
    if (i === activeRef.current) return;
    activeRef.current = i;
    setActive(i);
  };

  const setFilter = (id: string) => {
    router.replace(id ? `/realisations?f=${id}` : "/realisations", { scroll: false });
  };

  const p = list[active];
  const num = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <div className="gutter md:grid md:grid-cols-12 md:gap-x-8">
      {/* Le tirage : collé en haut sur mobile, à droite sur grand écran. */}
      <div className="sticky top-0 z-10 -mx-[var(--gutter)] bg-[var(--color-paper)] pb-4 pt-[calc(var(--nav-h)+4px)] md:top-[var(--nav-h)] md:order-2 md:col-span-7 md:mx-0 md:h-[calc(100dvh-var(--nav-h))] md:bg-transparent md:pb-0 md:pt-0">
        <div className="px-[var(--gutter)] md:flex md:h-full md:flex-col md:justify-center md:px-0">
          <Link href={`/realisations/${p.slug}`} aria-label={`Voir le film ${p.title}`} className="block">
            <FilmCanvas
              ref={filmRef}
              src={projectThumb(list[0])}
              alt={list[0].title}
              className="aspect-video w-full"
              videoMode="none"
            />
          </Link>
          <p className="t-legend mt-3 flex justify-between">
            <span>
              <span className="inline-block w-[2.6em] text-[var(--color-terra)]">{num(active)}</span>
              {p.client} · {p.category} · {p.year}
            </span>
            <span className="hidden sm:inline">Voir le film →</span>
          </p>
          <video ref={videoRef} muted loop playsInline preload="none" className="pointer-events-none absolute h-px w-px opacity-0" aria-hidden tabIndex={-1} />
        </div>
      </div>

      {/* La liste. */}
      <div className="md:order-1 md:col-span-5">
        {/* Filtres : des mots, un trait. */}
        <ul className="t-legend flex flex-wrap gap-x-5 gap-y-2 pt-6 md:pt-0">
          <li>
            <button type="button" onClick={() => setFilter("")} className={`u-draw py-1 ${!filter ? "is-on" : "opacity-50"}`}>
              Tous
            </button>
          </li>
          {services.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setFilter(s.id)}
                className={`u-draw py-1 ${filter === s.id ? "is-on" : "opacity-50"}`}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>

        <ol ref={listRef} className="mt-10 md:mt-16">
          {list.map((f, i) => (
            <li key={f.slug} onPointerEnter={() => hover(i)} onFocus={() => hover(i)}>
              <Link
                href={`/realisations/${f.slug}`}
                className={`row-link block py-5 transition-opacity duration-500 md:py-6 ${
                  i === active ? "opacity-100" : "opacity-40 hover:opacity-100"
                }`}
              >
                <span className="t-legend block">
                  <span className="inline-block w-[2.6em]">{num(i)}</span>
                  {f.category} · {f.year}
                </span>
                <span className="t-title mt-2 block">{f.title}</span>
              </Link>
              <div className="rule" />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
