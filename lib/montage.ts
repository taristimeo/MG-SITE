// La table de montage : les rushes sont des plages des extraits vidéo de
// chaque film (public/projects/<slug>/preview.mp4), avec un photogramme
// d'affiche par plage. Tout ce qui est lié au montage du visiteur vit ici.
import { projects, type Project } from "@/lib/site";

// Durée réelle de chaque extrait (lue une fois dans l'en-tête MP4).
const PREVIEW_SECONDS: Record<string, number> = {
  "the-sound-of-discovery": 8.36,
  silhouette: 9.28,
  "the-shape-of-vastness": 6.71,
  "delaurentis-gone-colors": 13.08,
  graduation: 8.25,
  "la-medocaine": 10.58,
};

// Code court affiché sur les plans (SD·01, GC·03…).
const CODES: Record<string, string> = {
  "the-sound-of-discovery": "SD",
  silhouette: "SI",
  "the-shape-of-vastness": "SV",
  "delaurentis-gone-colors": "GC",
  graduation: "GR",
  "la-medocaine": "LM",
};

export const RUSHES_PER_FILM = 4;

export type Rush = {
  i: number; // index global
  film: number; // index dans `films`
  k: number; // rang dans le film (0..3)
  code: string; // « SD·01 »
  poster: string; // photogramme d'affiche
  video: string; // extrait source
  in: number; // point d'entrée (s)
  out: number; // point de sortie (s)
  nat: number; // durée naturelle de la plage (s)
};

export type Film = Project & { idx: number; code: string; seconds: number };

export const films: Film[] = projects.map((p, idx) => ({
  ...p,
  idx,
  code: CODES[p.slug] ?? p.slug.slice(0, 2).toUpperCase(),
  seconds: PREVIEW_SECONDS[p.slug] ?? 8,
}));

export const rushes: Rush[] = films.flatMap((f) => {
  const seg = f.seconds / RUSHES_PER_FILM;
  return Array.from({ length: RUSHES_PER_FILM }, (_, k) => ({
    i: f.idx * RUSHES_PER_FILM + k,
    film: f.idx,
    k,
    code: `${f.code}·${String(k + 1).padStart(2, "0")}`,
    poster: `/projects/${f.slug}/${k + 1}.jpg`,
    video: `/projects/${f.slug}/preview.mp4`,
    in: +(k * seg).toFixed(2),
    out: +((k + 1) * seg).toFixed(2),
    nat: +seg.toFixed(1),
  }));
});

// Le premier montage, monté par le site à l'arrivée : un plan par film, en
// alternant les univers (tourisme, événementiel, clip…).
export const AUTO_SEQUENCE = [0, 9, 17, 22, 5, 14, 2];

export type Clip = { r: number; d: number };

// Durée assignée à un plan selon le tempo (0 lent → 1 vif).
export function durFor(r: number, tempo: number): number {
  const nat = rushes[r].nat;
  return +Math.max(0.6, nat * (1.35 - tempo * 1.1)).toFixed(1);
}

export const pad = (n: number) => (n < 10 ? "0" : "") + n;

// Timecode 25 i/s — HH:MM:SS:FF.
export function tc(s: number): string {
  const f = Math.floor((s % 1) * 25);
  const t = Math.floor(s);
  return `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(t % 60)}:${pad(f)}`;
}

export function short(s: number): string {
  const t = Math.round(s);
  return `${Math.floor(t / 60)}:${pad(t % 60)}`;
}

export const plural = (n: number, w: string) => `${n} ${w}${n > 1 ? "s" : ""}`;

export const total = (clips: Clip[]) => clips.reduce((a, c) => a + c.d, 0);

// L'EDL jointe à la demande : lisible par un humain, et par un monteur.
export function edlText(clips: Clip[], version = "v01"): string {
  const lines = [`TITLE: montage-${version} — mauvaisgrain.com`, "FCM: NON-DROP FRAME", ""];
  let acc = 0;
  clips.forEach((c, i) => {
    const r = rushes[c.r];
    const f = films[r.film];
    lines.push(`${pad(i + 1)}  ${r.code}  ${tc(acc)}  ${tc(acc + c.d)}`);
    lines.push(`    ${f.title} · ${c.d.toFixed(1)}s · source ${tc(r.in)}`);
    acc += c.d;
  });
  lines.push("", `TOTAL  ${tc(acc)}  ${plural(clips.length, "plan")}`);
  return lines.join("\n");
}

// Sérialisation compacte dans l'URL (?m=0.3.8-9.4.6…) : rejouable, partageable.
export function encodeClips(clips: Clip[]): string {
  return clips.map((c) => `${c.r}.${c.d.toFixed(1)}`).join("-");
}

export function decodeClips(s: string | null): Clip[] | null {
  if (!s) return null;
  const out: Clip[] = [];
  for (const part of s.split("-")) {
    // « 9.4.6 » → r = 9, d = 4.6 (l'index et la durée sont séparés par le premier point)
    const m = part.match(/^(\d+)\.(\d+(?:\.\d+)?)$/);
    if (!m) continue;
    const r = Number(m[1]);
    const d = Number(m[2]);
    if (!Number.isInteger(r) || r < 0 || r >= rushes.length || !(d >= 0.6 && d <= 12)) continue;
    out.push({ r, d: +d.toFixed(1) });
  }
  return out.length ? out.slice(0, 40) : null;
}

export const CATEGORIES = ["Corporate", "Événementiel", "Immobilier", "Tourisme", "Clip"] as const;

export const NOTES: { title: string; body: string; at: number }[] = [
  { title: "Observer plutôt que mettre en scène.", body: "Laisser les rencontres, les ambiances et la lumière naturelle guider le récit.", at: 0 },
  { title: "Accompagner plutôt que diriger.", body: "Au plus près des gens et des lieux, sans imposer de mise en scène : le film se construit avec vous.", at: 17 },
  { title: "Raconter plutôt que vendre.", body: "Une histoire bien racontée ne s'oublie pas — l'image au service de votre histoire.", at: 34 },
];
