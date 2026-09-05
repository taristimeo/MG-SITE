"use client";

import { useCallback, useRef, useState } from "react";
import { Amorce } from "@/components/motion/Amorce";
import { Composer } from "@/components/motion/Composer";
import { Curseur } from "@/components/motion/Curseur";
import { Transition } from "@/components/motion/Transition";
import { useInertie } from "@/components/motion/useInertie";
import { useMouvementReduit } from "@/components/motion/useMouvementReduit";

const ARRETS = ["01", "02", "03", "04", "05"];

function Titre({ n, t }: { n: string; t: string }) {
  return (
    <div className="mb-6 flex items-baseline gap-4 border-b border-line pb-3">
      <span className="font-cond text-[10px] text-terra">{n}</span>
      <h2 className="font-wide text-2xl md:text-3xl">{t}</h2>
    </div>
  );
}

export function Demo() {
  const reduit = useMouvementReduit();

  // 1 — l'amorce, rejouable à la demande.
  const [tour, setTour] = useState(0);
  const [amorce, setAmorce] = useState(false);
  const [memoire, setMemoire] = useState(false);
  const [finie, setFinie] = useState<string | null>(null);

  // 3 — le titre composé, rejouable lui aussi.
  const [cle, setCle] = useState(0);

  // 4 — l'inertie.
  const [arret, setArret] = useState(0);
  const [raideur, setRaideur] = useState(170);
  const [amorti, setAmorti] = useState(18);
  const piste = useRef<HTMLDivElement>(null);
  const cible = arret / (ARRETS.length - 1);
  const lisse = useInertie(cible, {
    stiffness: raideur,
    damping: amorti,
    epsilon: 0.0004,
    // La position s'écrit directement dans le DOM : aucun rendu React par
    // image, exactement ce que fera la bague du viseur.
    onFrame: (v) => {
      const el = piste.current;
      if (el) el.style.transform = `translate3d(${(v * 100).toFixed(3)}%, 0, 0)`;
    },
  });

  // 5 — l'enchaînement.
  const [ouvert, setOuvert] = useState(true);

  const rejoue = useCallback(() => {
    setFinie(null);
    setTour((t) => t + 1);
    setAmorce(true);
  }, []);

  return (
    <main className="min-h-screen bg-ink px-6 py-24 md:px-12">
      {amorce ? (
        <Amorce
          key={tour}
          force={!memoire}
          storageKey={memoire ? "mg:amorce" : null}
          label="MAUVAIS GRAIN — AMORCE"
          onDone={() => {
            setAmorce(false);
            setFinie(new Date().toLocaleTimeString("fr-FR"));
          }}
        />
      ) : null}

      <Curseur />

      <div className="mx-auto max-w-4xl">
        <p className="font-cond mb-5 text-[10px] text-bone-faint">
          BANC D&apos;ESSAI — HORS PRODUCTION
        </p>
        <Composer
          as="h1"
          immediate
          text="La chaîne de gestes"
          className="font-wide text-5xl md:text-7xl"
          delay={120}
          stagger={30}
        />
        <p className="mt-6 max-w-xl text-bone-dim">
          Cinq primitives de mouvement, sans aucune dépendance.{" "}
          {reduit ? (
            <strong className="text-terra">
              Mouvement réduit détecté : la chaîne est neutralisée.
            </strong>
          ) : (
            "Réglage système « mouvement réduit » : tout se coupe."
          )}
        </p>

        {/* ── 1 ─────────────────────────────────────────────────────── */}
        <section className="mt-24">
          <Titre n="01" t="L'amorce" />
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={rejoue}
              data-cursor="open"
              className="btn-cta bg-terra px-6 py-3 font-cond text-[11px] text-on-terra"
            >
              Rejouer l&apos;amorce
            </button>
            <p className="font-cond text-[10px] text-bone-faint">
              {finie ? `TERMINÉE À ${finie}` : "3 · 2 · 1 — ~2,1 S · CLIC OU TOUCHE POUR PASSER"}
            </p>
          </div>
          <label className="mt-5 flex w-fit items-center gap-3 text-sm text-bone-dim">
            <input
              type="checkbox"
              checked={memoire}
              onChange={(e) => setMemoire(e.target.checked)}
              className="accent-terra"
            />
            Comme en production : mémorisée pour la session
          </label>
          <p className="mt-4 max-w-xl text-sm text-bone-dim">
            Case cochée, l&apos;amorce ne se rejoue plus tant que l&apos;onglet
            reste ouvert (<code className="font-cond text-[11px]">sessionStorage</code>) ;
            décochée, la mémoire est débranchée pour pouvoir la revoir.
          </p>
        </section>

        {/* ── 2 ─────────────────────────────────────────────────────── */}
        <section className="mt-24">
          <Titre n="02" t="Le curseur" />
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="mgd-zone" data-cursor="grab">
              <span className="font-cond text-[10px] text-bone-dim">
                data-cursor=&quot;grab&quot;
              </span>
            </div>
            <div className="mgd-zone" data-cursor="open">
              <span className="font-cond text-[10px] text-bone-dim">
                data-cursor=&quot;open&quot;
              </span>
            </div>
            <div className="mgd-zone" data-cursor="drag">
              <span className="font-cond text-[10px] text-bone-dim">
                data-cursor=&quot;drag&quot;
              </span>
            </div>
          </div>
          <p className="mt-4 max-w-xl text-sm text-bone-dim">
            Pointeur fin uniquement. Au doigt, le composant ne rend rien.
          </p>
        </section>

        {/* ── 3 ─────────────────────────────────────────────────────── */}
        <section className="mt-24">
          <Titre n="03" t="Les titres qui se composent" />
          <Composer
            key={cle}
            as="p"
            text="Chaque lettre monte derrière son masque."
            className="font-wide text-3xl md:text-5xl"
            stagger={26}
          />
          <button
            type="button"
            onClick={() => setCle((k) => k + 1)}
            data-cursor="grab"
            className="mt-8 border border-line px-5 py-2 font-cond text-[10px] text-bone-dim transition-colors hover:border-terra hover:text-terra"
          >
            Rejouer
          </button>
        </section>

        {/* ── 4 ─────────────────────────────────────────────────────── */}
        <section className="mt-24">
          <Titre n="04" t="L'inertie" />
          <div className="mgd-rail" data-cursor="drag">
            {ARRETS.map((a, i) => (
              <i key={a} style={{ left: `${(i / (ARRETS.length - 1)) * 100}%` }} />
            ))}
            {/* La piste fait exactement la largeur du rail : la déplacer de
                50 % déplace la tête d'une demi-largeur de rail. C'est la seule
                façon de courir sur toute la longueur en `transform` pur. */}
            <div ref={piste} className="absolute inset-y-0 left-0 right-0 will-change-transform">
              <div className="mgd-tete" />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {ARRETS.map((a, i) => (
              <button
                key={a}
                type="button"
                onClick={() => setArret(i)}
                data-cursor="grab"
                className={`border px-4 py-2 font-cond text-[10px] transition-colors ${
                  i === arret
                    ? "border-terra text-terra"
                    : "border-line text-bone-faint hover:text-bone"
                }`}
              >
                {a}
              </button>
            ))}
            <span className="font-cond ml-auto text-[10px] text-bone-faint">
              VALEUR {lisse.toFixed(3)}
            </span>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="font-cond text-[10px] text-bone-faint">
                RAIDEUR {raideur}
              </span>
              <input
                type="range"
                min={40}
                max={420}
                step={10}
                value={raideur}
                onChange={(e) => setRaideur(Number(e.target.value))}
                className="mt-2 w-full accent-terra"
              />
            </label>
            <label className="block">
              <span className="font-cond text-[10px] text-bone-faint">
                AMORTISSEMENT {amorti}
              </span>
              <input
                type="range"
                min={4}
                max={60}
                step={1}
                value={amorti}
                onChange={(e) => setAmorti(Number(e.target.value))}
                className="mt-2 w-full accent-terra"
              />
            </label>
          </div>
        </section>

        {/* ── 5 ─────────────────────────────────────────────────────── */}
        <section className="mt-24 mb-32">
          <Titre n="05" t="L'enchaînement" />
          <button
            type="button"
            onClick={() => setOuvert((v) => !v)}
            data-cursor="open"
            className="border border-line px-5 py-2 font-cond text-[10px] text-bone-dim transition-colors hover:border-terra hover:text-terra"
          >
            {ouvert ? "Retirer le bloc" : "Poser le bloc"}
          </button>
          <div className="mt-6 min-h-[190px]">
            <Transition show={ouvert} duration={560}>
              <div className="border border-line bg-ink-2 p-8">
                <p className="font-cond text-[10px] text-terra">FICHE DU PLAN</p>
                <p className="font-wide mt-3 text-2xl">
                  La sortie dure 72 % de l&apos;entrée.
                </p>
                <p className="mt-3 max-w-md text-sm text-bone-dim">
                  Le bloc reste dans le DOM le temps de sortir, puis il est
                  réellement démonté — jamais seulement caché.
                </p>
              </div>
            </Transition>
          </div>
        </section>
      </div>
    </main>
  );
}
