"use client";

// L'état de la table de montage, partagé entre la visionneuse, la timeline,
// le chutier, les films et le contact. Les valeurs qui changent à chaque
// image (position de lecture, tempo) vivent dans des refs : elles sont lues
// par la boucle d'animation, jamais par React.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { type Clip, decodeClips, durFor, encodeClips, total } from "@/lib/montage";

export type EditMode = "" | "sel" | "trim" | "move";

export type State = {
  clips: Clip[];
  auto: boolean; // le site monte encore tout seul
  sel: number; // plan sélectionné sur la timeline
  editMode: EditMode; // mobile : '' | 'sel' | 'trim' | 'move'
  filter: string; // métier filtré dans le chutier
  playing: boolean;
  openNote: number; // marqueur ouvert (vue studio)
  sheet: number | null; // rush ouvert dans la feuille mobile
  nerveux: boolean; // tempo ≥ 0,65 : coupes sèches
  pop: number; // index du plan qui vient d'être posé (animation)
  hydrated: boolean;
};

type Action =
  | { type: "set"; patch: Partial<State> }
  | { type: "add"; r: number; at?: number; d: number }
  | { type: "remove"; i: number }
  | { type: "move"; from: number; to: number }
  | { type: "trim"; i: number; d: number }
  | { type: "clear" };

const initial: State = {
  clips: [],
  auto: true,
  sel: -1,
  editMode: "",
  filter: "",
  playing: true,
  openNote: -1,
  sheet: null,
  nerveux: false,
  pop: -1,
  hydrated: false,
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "set":
      return { ...s, ...a.patch };
    case "add": {
      const clips = s.clips.slice();
      const at = a.at == null || a.at > clips.length ? clips.length : a.at;
      clips.splice(at, 0, { r: a.r, d: a.d });
      return { ...s, clips, sel: at, pop: at };
    }
    case "remove": {
      if (a.i < 0 || a.i >= s.clips.length) return s;
      const clips = s.clips.filter((_, i) => i !== a.i);
      return { ...s, clips, sel: Math.min(s.sel, clips.length - 1), pop: -1 };
    }
    case "move": {
      if (a.from < 0 || a.from >= s.clips.length) return s;
      const clips = s.clips.slice();
      const [c] = clips.splice(a.from, 1);
      let to = a.to;
      if (to > a.from) to--;
      to = Math.max(0, Math.min(clips.length, to));
      clips.splice(to, 0, c);
      return { ...s, clips, sel: to, pop: to };
    }
    case "trim": {
      const clips = s.clips.map((c, i) => (i === a.i ? { ...c, d: a.d } : c));
      return { ...s, clips, pop: -1 };
    }
    case "clear":
      return { ...s, clips: [], sel: -1, pop: -1 };
  }
}

// Valeurs lues et écrites à chaque image, hors React.
export type Live = {
  pos: number; // position de lecture (s)
  tempo: number; // 0 lent → 1 vif
  holdTempo: boolean;
  curClip: number; // plan affiché dans la visionneuse
  gen: number; // génération du montage automatique (annulation)
};

export type DragApi = {
  start: (e: PointerEvent | React.PointerEvent, r: number, from: number | null) => void;
  move: (e: PointerEvent | React.PointerEvent) => void;
  end: (e: PointerEvent | React.PointerEvent | null) => void;
  active: () => boolean;
};

type Ctx = {
  state: State;
  live: React.MutableRefObject<Live>;
  drag: React.MutableRefObject<DragApi | null>;
  clipsRef: React.MutableRefObject<Clip[]>;
  set: (patch: Partial<State>) => void;
  addClip: (r: number, at?: number, d?: number) => void;
  removeClip: (i: number) => void;
  moveClip: (from: number, to: number) => void;
  trimClip: (i: number, d: number) => void;
  clear: () => void;
  takeHand: () => void;
  seek: (pos: number) => void;
};

const MontageCtx = createContext<Ctx | null>(null);

const STORAGE = "mg-montage-v1";

export function MontageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const live = useRef<Live>({ pos: 0, tempo: 0.18, holdTempo: false, curClip: -1, gen: 0 });
  const drag = useRef<DragApi | null>(null);
  const clipsRef = useRef<Clip[]>(state.clips);
  clipsRef.current = state.clips;
  const stateRef = useRef(state);
  stateRef.current = state;

  const set = useCallback((patch: Partial<State>) => dispatch({ type: "set", patch }), []);
  const takeHand = useCallback(() => {
    if (!stateRef.current.auto) return;
    live.current.gen++;
    dispatch({ type: "set", patch: { auto: false } });
  }, []);
  const addClip = useCallback(
    (r: number, at?: number, d?: number) => {
      dispatch({ type: "add", r, at, d: d ?? durFor(r, live.current.tempo) });
      if (clipsRef.current.length === 0) live.current.pos = 0;
    },
    [],
  );
  const removeClip = useCallback((i: number) => {
    dispatch({ type: "remove", i });
    const rest = clipsRef.current.filter((_, k) => k !== i);
    live.current.pos = Math.min(live.current.pos, Math.max(0, total(rest) - 0.01));
  }, []);
  const moveClip = useCallback((from: number, to: number) => dispatch({ type: "move", from, to }), []);
  const trimClip = useCallback((i: number, d: number) => dispatch({ type: "trim", i, d }), []);
  const clear = useCallback(() => {
    dispatch({ type: "clear" });
    live.current.pos = 0;
  }, []);
  const seek = useCallback((pos: number) => {
    live.current.pos = Math.max(0, pos);
    live.current.curClip = -1;
  }, []);

  // Hydratation : l'URL (?m=) d'abord, la session ensuite. Sinon, le site monte.
  useEffect(() => {
    let clips: Clip[] | null = null;
    let auto = true;
    try {
      clips = decodeClips(new URLSearchParams(window.location.search).get("m"));
      if (clips) auto = false;
      if (!clips) {
        const raw = sessionStorage.getItem(STORAGE);
        if (raw) {
          const saved = JSON.parse(raw) as { clips?: Clip[]; auto?: boolean };
          clips = decodeClips(encodeClips(saved.clips ?? []));
          auto = saved.auto ?? false;
        }
      }
    } catch {
      clips = null;
    }
    if (clips && clips.length) live.current.pos = 0;
    dispatch({ type: "set", patch: { clips: clips ?? [], auto: clips && clips.length ? auto : true, hydrated: true } });
  }, []);

  // Persistance : session + URL partageable (une fois la main prise).
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      sessionStorage.setItem(STORAGE, JSON.stringify({ clips: state.clips, auto: state.auto }));
      const url = new URL(window.location.href);
      if (!state.auto && state.clips.length) url.searchParams.set("m", encodeClips(state.clips));
      else url.searchParams.delete("m");
      window.history.replaceState(window.history.state, "", url.toString());
    } catch {
      /* stockage indisponible : le montage vit le temps de la page */
    }
  }, [state.clips, state.auto, state.hydrated]);

  const value = useMemo<Ctx>(
    () => ({ state, live, drag, clipsRef, set, addClip, removeClip, moveClip, trimClip, clear, takeHand, seek }),
    [state, set, addClip, removeClip, moveClip, trimClip, clear, takeHand, seek],
  );
  return <MontageCtx.Provider value={value}>{children}</MontageCtx.Provider>;
}

export function useMontage(): Ctx {
  const ctx = useContext(MontageCtx);
  if (!ctx) throw new Error("useMontage : hors de MontageProvider");
  return ctx;
}

// Point de bascule tactile / bureau, aligné sur la feuille de style.
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useReducer((_: boolean, v: boolean) => v, false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return mobile;
}

export const isMobileNow = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches;

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Pixels par seconde sur la timeline : on zoome sur les coupes serrées.
export function pps(nerveux: boolean): number {
  const m = isMobileNow();
  return nerveux ? (m ? 22 : 30) : m ? 16 : 22;
}
