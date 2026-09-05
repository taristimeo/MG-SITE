"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { mouvementReduit } from "./useMouvementReduit";

/* ─────────────────────────────────────────────────────────────────────
   L'AMORCE DE BOBINE.

   Avant la première image, le compte à rebours d'amorce : le disque, la
   croix de visée, le balai qui fait le tour en une mesure, et les
   chiffres 3, 2, 1 qui se relaient au centre. Sur le dernier, les volets
   de projection s'écartent et le site est là.

   Tout est tracé en SVG — aucune image à charger, rien qui puisse
   arriver en retard. Le mouvement ne touche que `transform` et
   `opacity`.

   Trois règles :
   · elle dure ~2,2 s et se joue UNE SEULE FOIS par session ;
   · elle se passe au clic ou à n'importe quelle touche ;
   · une fois finie elle se démonte — plus rien dans le flux, plus rien
     dans l'arbre d'accessibilité.
   ───────────────────────────────────────────────────────────────────── */

/** Durée d'un chiffre. Trois chiffres = 1560 ms. */
const MESURE = 520;
/** Ouverture des volets. */
const OUVERTURE = 620;
const PREMIER = 3;

/** `useLayoutEffect` côté client (décision avant peinture), `useEffect` au rendu serveur. */
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Graduations du disque — calcul déterministe, identique serveur et client. */
const GRADUATIONS = Array.from({ length: 48 }, (_, i) => {
  const a = (i * Math.PI * 2) / 48;
  const longue = i % 4 === 0;
  const sin = Math.sin(a);
  const cos = Math.cos(a);
  const r2 = longue ? 91 : 98;
  return {
    x1: Number((110 + sin * 104).toFixed(2)),
    y1: Number((110 - cos * 104).toFixed(2)),
    x2: Number((110 + sin * r2).toFixed(2)),
    y2: Number((110 - cos * r2).toFixed(2)),
    longue,
  };
});

type Phase = "compte" | "ouverture" | "finie";

export type AmorceProps = {
  /** Appelé une fois, quand l'amorce a fini (ou qu'elle a été sautée). */
  onDone?: () => void;
  /**
   * Clé de session. `null` pour ne rien mémoriser (page de démonstration,
   * rejeu manuel). Si le stockage est refusé, l'amorce se joue quand même.
   */
  storageKey?: string | null;
  /** Rejoue l'amorce même si elle a déjà été vue dans la session. */
  force?: boolean;
  /** Petite ligne mono sous le disque (nom du studio, mention…). */
  label?: string;
};

export function Amorce({
  onDone,
  storageKey = "mg:amorce",
  force = false,
  label,
}: AmorceProps) {
  // Le rendu serveur montre toujours le premier temps : l'amorce couvre
  // l'écran dès le premier octet, et c'est l'effet de mise en page qui la
  // retire — avant peinture — pour ceux qui l'ont déjà vue.
  const [phase, setPhase] = useState<Phase>("compte");
  const [n, setN] = useState(PREMIER);

  const phaseRef = useRef<Phase>("compte");
  const minuteries = useRef<number[]>([]);
  const finiRef = useRef(false);
  const decisionRef = useRef<boolean | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const arrete = useCallback(() => {
    minuteries.current.forEach((id) => window.clearTimeout(id));
    minuteries.current = [];
  }, []);

  const pose = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  /** Passer l'amorce : on n'ampute pas l'ouverture, on y saute. */
  const passe = useCallback(() => {
    if (phaseRef.current !== "compte") return;
    arrete();
    pose("ouverture");
    minuteries.current.push(
      window.setTimeout(() => pose("finie"), OUVERTURE),
    );
  }, [arrete, pose]);

  useIso(() => {
    // La décision est prise UNE fois par instance : en mode strict l'effet
    // est rejoué à l'identique, et relire le stockage ferait croire à
    // l'amorce qu'elle a déjà été vue — par elle-même.
    let joue = decisionRef.current;

    if (joue === null) {
      let deja = false;
      try {
        if (storageKey) deja = window.sessionStorage.getItem(storageKey) === "1";
      } catch {
        // Stockage refusé (navigation privée, réglage strict) : on joue.
        deja = false;
      }
      joue = !(mouvementReduit() || (deja && !force));
      decisionRef.current = joue;

      if (joue) {
        try {
          if (storageKey) window.sessionStorage.setItem(storageKey, "1");
        } catch {
          /* sans mémoire, l'amorce se rejouera : ce n'est pas une panne */
        }
      }
    }

    // Mouvement réduit ou amorce déjà vue : rien ne se joue, rien ne couvre.
    if (!joue) {
      pose("finie");
      return;
    }

    setN(PREMIER);
    phaseRef.current = "compte";

    const t = (ms: number, fn: () => void) =>
      minuteries.current.push(window.setTimeout(fn, ms));

    t(MESURE, () => setN(2));
    t(MESURE * 2, () => setN(1));
    t(MESURE * PREMIER, () => pose("ouverture"));
    t(MESURE * PREMIER + OUVERTURE, () => pose("finie"));

    return arrete;
  }, [storageKey, force, arrete, pose]);

  // Le clavier : n'importe quelle touche passe l'amorce.
  useEffect(() => {
    if (phase !== "compte") return;
    const onKey = () => passe();
    window.addEventListener("keydown", onKey, { once: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, passe]);

  // `onDone` exactement une fois, et jamais pendant un rendu.
  useEffect(() => {
    if (phase !== "finie" || finiRef.current) return;
    finiRef.current = true;
    onDoneRef.current?.();
  }, [phase]);

  if (phase === "finie") return null;

  const style = {
    "--am-mesure": `${MESURE}ms`,
    "--am-ouverture": `${OUVERTURE}ms`,
  } as CSSProperties;

  return (
    <div
      className={`mg-am${phase === "ouverture" ? " is-out" : ""}`}
      data-tone="dark"
      style={style}
      role="presentation"
      aria-hidden="true"
      onPointerDown={passe}
    >
      <div className="mg-am-volet is-haut" />
      <div className="mg-am-volet is-bas" />
      <div className="mg-am-fente" />

      <div className="mg-am-core">
        <svg className="mg-am-svg" viewBox="0 0 220 220" aria-hidden="true">
          {/* La croix de visée, d'un bord à l'autre du cadre. */}
          <line className="mg-am-hair" x1="110" y1="0" x2="110" y2="220" />
          <line className="mg-am-hair" x1="0" y1="110" x2="220" y2="110" />

          {/* Le disque. */}
          <circle className="mg-am-cercle" cx="110" cy="110" r="104" />
          <circle className="mg-am-cercle is-faible" cx="110" cy="110" r="78" />

          {GRADUATIONS.map((g, i) => (
            <line
              key={i}
              className={`mg-am-grad${g.longue ? " is-longue" : ""}`}
              x1={g.x1}
              y1={g.y1}
              x2={g.x2}
              y2={g.y2}
            />
          ))}

          {/* Le balai : un tour par mesure, trois tours en tout. */}
          <g className="mg-am-balai">
            <path
              className="mg-am-tourne"
              d="M110 110 L26.86 62 A96 96 0 0 1 110 14 Z"
            />
            <line className="mg-am-main" x1="110" y1="110" x2="110" y2="14" />
          </g>

          <circle className="mg-am-axe" cx="110" cy="110" r="2.5" />

          {/* Le chiffre — remonté à chaque mesure, donc rejoué. */}
          <text
            key={n}
            className="mg-am-n font-wide"
            x="110"
            y="110"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {n}
          </text>
        </svg>

        {label ? <p className="mg-am-label font-cond">{label}</p> : null}
      </div>
    </div>
  );
}

export default Amorce;
