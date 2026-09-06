// Dossier « Veille & concepts » — A4 paysage, à la charte.
// Contenu : dossier4-content.mjs (veille, concepts, recommandation).
import fs from 'node:fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { VEILLE, CONCEPTS, RECO, META } from './dossier4-content.mjs';
const { chromium } = pw;

const BASE = '/tmp/claude-0/-home-user-MG-SITE/9d5c93dd-0bf5-5524-906d-697c0ddde50a/scratchpad';
const SHOTS = `${BASE}/shots3`;
const REFS = `${BASE}/veille/refs`;
const FONTS = `${BASE}/mockups/fonts`;
const img = (p) => `file://${p}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Mise en gras légère : **mot** → <b>
const rich = (s) => esc(s).replace(/&lt;span class="dot"&gt;\.&lt;\/span&gt;/g, '<span class="dot">.</span>').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

const css = `
@font-face { font-family:"Gloock"; src:url("file://${FONTS}/gloock.woff2") format("woff2"); font-display:block; }
@font-face { font-family:"JetBrains Mono"; src:url("file://${FONTS}/mono.woff2") format("woff2"); font-weight:100 800; font-display:block; }
@font-face { font-family:"Saira"; src:url("file://${FONTS}/saira.woff2") format("woff2"); font-weight:100 900; font-display:block; }
:root{ --ink:#f6f3ec; --ink-2:#efeadf; --line:#d6cfbf; --line-soft:#e7e1d4; --bone:#201a12; --bone-dim:#574f43; --bone-faint:#736b5d; --terra:#a85f3c;
  --wide:"Gloock",serif; --cond:"JetBrains Mono",monospace; --sans:"Saira",system-ui,sans-serif; }
*{box-sizing:border-box;} @page{ size:297mm 210mm; margin:0; } html,body{margin:0;padding:0;}
body{ font-family:var(--sans); color:var(--bone); background:var(--ink); -webkit-print-color-adjust:exact; print-color-adjust:exact; font-weight:300; }
b{ font-weight:600; }
.page{ position:relative; width:297mm; height:210mm; overflow:hidden; background:var(--ink); page-break-after:always; break-after:page; }
.page:last-child{ page-break-after:auto; break-after:auto; }
.dark{ background:#0a0908; color:#ece8dc; --line:#393229; --line-soft:#221d17; --bone-dim:#9b9384; --bone-faint:#6e685c; --terra:#b76e4e; --ink-2:#15120f; }
.pad{ position:absolute; inset:0; padding:12mm 14mm 20mm; display:flex; flex-direction:column; }
.wide{font-family:var(--wide);font-weight:400;letter-spacing:-0.01em;line-height:1;}
.cond{font-family:var(--cond);font-weight:500;text-transform:uppercase;letter-spacing:0.16em;}
.dot{color:var(--terra);}
.rule{ height:1px; background:var(--line); border:0; margin:0; }
.folio{ position:absolute; left:14mm; right:14mm; bottom:8mm; display:flex; justify-content:space-between; font-family:var(--cond); font-size:6.4pt; letter-spacing:0.18em; text-transform:uppercase; color:var(--bone-faint); }
.kicker{ font-family:var(--cond); font-size:7pt; letter-spacing:0.2em; text-transform:uppercase; color:var(--terra); margin:0; }
h1.t{ font-family:var(--wide); font-weight:400; font-size:30pt; line-height:1.02; margin:4mm 0 0; letter-spacing:-0.01em; }
h2.t{ font-family:var(--wide); font-weight:400; font-size:22pt; line-height:1.05; margin:3.5mm 0 0; letter-spacing:-0.01em; }
.lede{ font-size:10.5pt; line-height:1.55; color:var(--bone-dim); max-width:120mm; margin:4mm 0 0; }
.txt{ font-size:9pt; line-height:1.6; color:var(--bone-dim); margin:0; }
.txt+.txt{ margin-top:2.6mm; }
.lbl{ font-family:var(--cond); font-size:6.4pt; letter-spacing:0.18em; color:var(--terra); margin:0 0 2.2mm; text-transform:uppercase; }
.shot{ width:100%; display:block; border:1px solid var(--line-soft); }
.cap{ font-family:var(--cond); font-size:6.2pt; letter-spacing:0.12em; color:var(--bone-faint); margin-top:2mm; text-transform:uppercase; line-height:1.45; }
.cap b{ color:var(--bone); font-weight:600; }
.grid2{ display:grid; grid-template-columns:1fr 1fr; gap:8mm; }
.grid3{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:6mm; }
.grid4{ display:grid; grid-template-columns:repeat(4,1fr); gap:5mm; }
.num{ font-family:var(--cond); font-size:8pt; letter-spacing:0.2em; color:var(--terra); }
ul.list{ margin:0; padding:0; list-style:none; }
ul.list li{ position:relative; padding-left:6mm; font-size:8.8pt; line-height:1.5; color:var(--bone-dim); margin-bottom:2.2mm; }
ul.list li::before{ content:""; position:absolute; left:0; top:2.4mm; width:3.2mm; height:1px; background:var(--terra); }
ul.list li b{ color:var(--bone); }
table.tb{ width:100%; border-collapse:collapse; }
table.tb th{ font-family:var(--cond); font-size:6.2pt; letter-spacing:0.16em; text-transform:uppercase; color:var(--terra); text-align:left; padding:0 3mm 2mm 0; border-bottom:1px solid var(--line); font-weight:500; }
table.tb td{ font-size:8.6pt; line-height:1.45; color:var(--bone-dim); padding:2.4mm 3mm 2.4mm 0; border-bottom:1px solid var(--line-soft); vertical-align:top; }
table.tb td:first-child{ color:var(--bone); font-weight:500; }
.ref{ position:relative; }
.ref img{ width:100%; aspect-ratio:16/10; object-fit:cover; object-position:top; display:block; border:1px solid var(--line-soft); background:#111; }
.ref .cap{ margin-top:1.8mm; text-transform:none; letter-spacing:0; font-family:var(--sans); font-size:7.6pt; line-height:1.45; color:var(--bone-dim); }
.ref .cap b{ font-family:var(--cond); font-size:6.4pt; letter-spacing:0.14em; text-transform:uppercase; }
.ref .cap i{ font-style:normal; font-family:var(--cond); font-size:6pt; letter-spacing:0.1em; color:var(--bone-faint); }
.big{ font-family:var(--wide); font-size:64pt; line-height:0.95; letter-spacing:-0.02em; }
.stat{ font-family:var(--wide); font-size:34pt; line-height:1; }
.stat-l{ font-family:var(--cond); font-size:6.4pt; letter-spacing:0.18em; color:var(--bone-faint); margin-top:2mm; text-transform:uppercase; }
.box{ border:1px solid var(--line); padding:4mm 5mm; }
.arch{ display:flex; gap:4mm; align-items:stretch; }
.arch .n{ flex:1; border:1px solid var(--line); padding:3.5mm 4mm; min-height:26mm; }
.arch .n .h{ font-family:var(--wide); font-size:12pt; margin:0 0 1.6mm; }
.arch .n .d{ font-size:7.8pt; line-height:1.45; color:var(--bone-dim); }
.arch .n .k{ font-family:var(--cond); font-size:5.8pt; letter-spacing:0.16em; color:var(--terra); margin-bottom:1.5mm; text-transform:uppercase; }
.chip{ display:inline-block; font-family:var(--cond); font-size:6pt; letter-spacing:0.14em; text-transform:uppercase; color:var(--bone); border:1px solid var(--line); padding:1.2mm 2.4mm; margin:0 1.5mm 1.5mm 0; }
.phone{ width:100%; border:1px solid var(--line-soft); display:block; }
.score{ display:inline-block; width:2.6mm; height:2.6mm; border:1px solid var(--terra); margin-right:0.8mm; vertical-align:middle; }
.score.on{ background:var(--terra); }
.toc td{ padding:2.6mm 0; border-bottom:1px solid var(--line-soft); vertical-align:baseline; font-size:8.4pt; line-height:1.4; color:var(--bone-dim); }
.toc td.n{ width:16mm; font-family:var(--cond); font-size:7pt; color:var(--terra); letter-spacing:0.16em; }
.toc td.nm{ width:60mm; font-family:var(--wide); font-size:13pt; color:var(--bone); }
`;

let pageNo = 0;
const folio = (l, r) => { pageNo++; return `<div class="folio"><span>${l}</span><span>${r}${r ? ' · ' : ''}${String(pageNo).padStart(2, '0')}</span></div>`; };
const P = (inner, l, r, cls = '') => `<section class="page ${cls}"><div class="pad">${inner}</div>${folio(l, r)}</section>`;

/* ── Couverture ─────────────────────────────────────────────── */
const cover = () => P(`
  <div class="wide" style="font-size:48pt;line-height:1">Mauvais Grain<span class="dot">.</span></div>
  <div style="margin-top:auto;display:grid;grid-template-columns:1.2fr 1fr;gap:16mm;align-items:end">
    <div>
      <p class="kicker" style="color:#b76e4e">${esc(META.serie)}</p>
      <h1 class="t" style="font-size:38pt;max-width:26ch">${rich(META.titre)}</h1>
      <p class="lede" style="color:#9b9384;max-width:70ch">${rich(META.lede)}</p>
    </div>
    <div style="font-family:var(--cond);font-size:6.6pt;letter-spacing:0.16em;text-transform:uppercase;color:#6e685c;line-height:2">
      ${META.chiffres.map(c => `<div><span style="color:#ece8dc">${esc(c[0])}</span> — ${esc(c[1])}</div>`).join('')}
    </div>
  </div>`, 'Bordeaux — ' + META.date, '', 'dark');

/* ── Sommaire ───────────────────────────────────────────────── */
const toc = (rows) => P(`
  <p class="kicker">Sommaire</p>
  <h2 class="t">Comment lire ce dossier</h2>
  <div class="grid2" style="margin-top:6mm;gap:14mm">
    <table class="toc" style="border-collapse:collapse;width:100%">${rows.map(r => `<tr><td class="n">${r[0]}</td><td class="nm">${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</table>
    <div>
      <p class="lbl">Ce qui a changé</p>
      <p class="txt">${rich(META.changement)}</p>
      <p class="lbl" style="margin-top:6mm">Ce que ce dossier n'est pas</p>
      <p class="txt">${rich(META.limites)}</p>
    </div>
  </div>`, 'Sommaire', '');

/* ── Veille : méthode ───────────────────────────────────────── */
const veilleMethode = () => P(`
  <p class="kicker">Première partie — la veille</p>
  <h1 class="t">${rich(VEILLE.titre)}</h1>
  <p class="lede">${rich(VEILLE.lede)}</p>
  <div class="grid4" style="margin-top:10mm">
    ${VEILLE.corpus.map(c => `<div><div class="stat">${esc(c.n)}</div><div class="stat-l">${esc(c.l)}</div><p class="txt" style="margin-top:3mm;font-size:8.4pt">${rich(c.d)}</p></div>`).join('')}
  </div>
  <div style="margin-top:auto"><hr class="rule"><p class="txt" style="margin-top:3mm;font-size:8pt">${rich(VEILLE.methode)}</p></div>`, 'La veille', 'Méthode');

/* ── Veille : planche de références ─────────────────────────── */
const planche = (pl) => P(`
  <div style="display:flex;align-items:baseline;gap:6mm"><p class="kicker">${esc(pl.kicker)}</p><span class="cond" style="margin-left:auto;font-size:6.4pt;color:var(--bone-faint)">${esc(pl.note || '')}</span></div>
  <h2 class="t">${rich(pl.titre)}</h2>
  <div class="grid4" style="margin-top:5mm">
    ${pl.refs.map(r => `<div class="ref"><img src="${img(`${REFS}/${r.key}.jpg`)}" alt=""><p class="cap"><b>${esc(r.nom)}</b> <i>${esc(r.url)}</i><br>${esc(r.cap)}</p></div>`).join('')}
  </div>
  ${pl.bas ? `<div style="margin-top:auto"><hr class="rule"><p class="txt" style="margin-top:3mm;font-size:8.2pt">${rich(pl.bas)}</p></div>` : ''}`, 'La veille', pl.folio);

/* ── Veille : page de texte à deux colonnes de listes ───────── */
const listes = (pg) => P(`
  <p class="kicker">${esc(pg.kicker)}</p>
  <h2 class="t">${rich(pg.titre)}</h2>
  ${pg.lede ? `<p class="lede" style="max-width:150mm">${rich(pg.lede)}</p>` : ''}
  <div class="${pg.cols === 3 ? 'grid3' : 'grid2'}" style="margin-top:6mm;gap:10mm">
    ${pg.colonnes.map(c => `<div>${c.lbl ? `<p class="lbl">${esc(c.lbl)}</p>` : ''}<ul class="list">${c.items.map(i => `<li>${rich(i)}</li>`).join('')}</ul></div>`).join('')}
  </div>
  ${pg.bas ? `<div style="margin-top:auto"><hr class="rule"><p class="txt" style="margin-top:3mm;font-size:8.6pt">${rich(pg.bas)}</p></div>` : ''}`, 'La veille', pg.folio, pg.dark ? 'dark' : '');

/* ── Concept : ouverture ────────────────────────────────────── */
const cOuverture = (c) => P(`
  <div style="display:flex;align-items:baseline;gap:6mm"><span class="num">Concept ${c.num}</span><span class="cond" style="margin-left:auto;font-size:6.4pt;color:var(--bone-faint)">${esc(c.famille)}</span></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12mm;margin-top:6mm;flex:1">
    <div style="display:flex;flex-direction:column">
      <div class="big">${esc(c.nom)}<span class="dot">.</span></div>
      <p class="wide" style="font-size:15pt;line-height:1.25;margin:8mm 0 0;max-width:30ch">${rich(c.phrase)}</p>
      <div style="margin-top:auto">
        <p class="lbl">En une phrase</p>
        <p class="txt" style="font-size:9.6pt;max-width:60ch">${rich(c.pitch)}</p>
      </div>
    </div>
    <div style="display:flex;flex-direction:column">
      <img class="shot" src="${img(`${SHOTS}/${c.id}-d0.jpg`)}" alt="">
      <p class="cap">${esc(c.etats[0])}</p>
      <div style="margin-top:auto;display:grid;grid-template-columns:1fr 1fr;gap:6mm">
        <div><p class="lbl">Ce que ça dit du studio</p><p class="txt" style="font-size:8.4pt">${rich(c.dit)}</p></div>
        <div><p class="lbl">Pourquoi c'est rare</p><p class="txt" style="font-size:8.4pt">${rich(c.rare)}</p></div>
      </div>
    </div>
  </div>`, `Concept ${c.num} — ${esc(c.nom)}`, 'Ouverture', 'dark');

/* ── Concept : l'idée en profondeur ─────────────────────────── */
const cIdee = (c) => P(`
  <div style="display:flex;align-items:baseline;gap:6mm"><span class="num">Concept ${c.num}</span><span class="wide" style="font-size:20pt">${esc(c.nom)}</span><span class="cond" style="margin-left:auto;font-size:6.4pt;color:var(--bone-faint)">L'idée</span></div>
  <div style="display:grid;grid-template-columns:1.25fr 1fr 1fr;margin-top:5mm;gap:9mm;flex:1;min-height:0">
    <div>
      <p class="lbl">Le principe</p>
      ${c.principe.map(p => `<p class="txt" style="font-size:8.4pt;line-height:1.55">${rich(p)}</p>`).join('')}
    </div>
    <div><p class="lbl">Ce que le visiteur fait, dans l'ordre</p><ul class="list">${c.parcours.map(i => `<li style="font-size:8.2pt">${rich(i)}</li>`).join('')}</ul></div>
    <div><p class="lbl">Ce qu'on a vu dans la veille, et ce qu'on en fait</p><ul class="list">${c.veille.map(i => `<li style="font-size:8.2pt">${rich(i)}</li>`).join('')}</ul></div>
  </div>`, `Concept ${c.num} — ${esc(c.nom)}`, 'L’idée');

/* ── Concept : architecture ─────────────────────────────────── */
const cArchi = (c) => P(`
  <div style="display:flex;align-items:baseline;gap:6mm"><span class="num">Concept ${c.num}</span><span class="wide" style="font-size:20pt">${esc(c.nom)}</span><span class="cond" style="margin-left:auto;font-size:6.4pt;color:var(--bone-faint)">Architecture &amp; navigation</span></div>
  <p class="lede" style="max-width:160mm">${rich(c.archiLede)}</p>
  <div class="arch" style="margin-top:6mm">${c.archi.map(n => `<div class="n"><div class="k">${esc(n.k)}</div><div class="h">${esc(n.h)}</div><div class="d">${rich(n.d)}</div></div>`).join('')}</div>
  <div class="grid2" style="margin-top:7mm;gap:12mm">
    <div><p class="lbl">Les gestes</p><table class="tb"><tr><th style="width:38mm">Geste</th><th>Ce qui se passe</th></tr>${c.gestes.map(g => `<tr><td>${esc(g[0])}</td><td>${rich(g[1])}</td></tr>`).join('')}</table></div>
    <div><p class="lbl">Le mouvement</p><ul class="list">${c.motion.map(i => `<li>${rich(i)}</li>`).join('')}</ul></div>
  </div>`, `Concept ${c.num} — ${esc(c.nom)}`, 'Architecture');

/* ── Concept : écrans desktop ───────────────────────────────── */
const cEcrans = (c) => P(`
  <div style="display:flex;align-items:baseline;gap:6mm"><span class="num">Concept ${c.num}</span><span class="wide" style="font-size:20pt">${esc(c.nom)}</span><span class="cond" style="margin-left:auto;font-size:6.4pt;color:var(--bone-faint)">Écrans — bureau</span></div>
  <div style="display:grid;grid-template-columns:121mm 121mm;justify-content:center;margin-top:4mm;gap:4mm 8mm">
    ${[0, 1, 2, 3].map(i => `<div><img class="shot" src="${img(`${SHOTS}/${c.id}-d${i}.jpg`)}" alt=""><p class="cap"><b>${String(i + 1).padStart(2, '0')}</b> — ${esc(c.etats[i])}</p></div>`).join('')}
  </div>`, `Concept ${c.num} — ${esc(c.nom)}`, 'Écrans');

/* ── Concept : téléphone + mise en œuvre ────────────────────── */
const cMobile = (c) => P(`
  <div style="display:flex;align-items:baseline;gap:6mm"><span class="num">Concept ${c.num}</span><span class="wide" style="font-size:20pt">${esc(c.nom)}</span><span class="cond" style="margin-left:auto;font-size:6.4pt;color:var(--bone-faint)">Téléphone &amp; mise en œuvre</span></div>
  <div style="display:grid;grid-template-columns:34mm 34mm 34mm 1fr;gap:6mm;margin-top:5mm;align-items:start">
    ${[0, 1, 2].map(i => `<div><img class="phone" src="${img(`${SHOTS}/${c.id}-m${i}.jpg`)}" alt=""><p class="cap">${esc(c.mobile[i])}</p></div>`).join('')}
    <div style="display:flex;flex-direction:column;gap:5mm;padding-left:4mm">
      <div><p class="lbl">Sur le téléphone</p><p class="txt" style="font-size:8.6pt">${rich(c.mobileTxt)}</p></div>
      <div><p class="lbl">Technique</p><ul class="list" style="font-size:8.4pt">${c.tech.map(i => `<li style="font-size:8.4pt">${rich(i)}</li>`).join('')}</ul></div>
      <div class="grid2" style="gap:5mm">
        <div><p class="lbl">Ce qu'il faut de vous</p><p class="txt" style="font-size:8.2pt">${rich(c.besoin)}</p></div>
        <div><p class="lbl">Risques &amp; parades</p><p class="txt" style="font-size:8.2pt">${rich(c.risques)}</p></div>
      </div>
      <div style="display:flex;gap:8mm;margin-top:auto">
        ${c.chiffres.map(k => `<div><div class="wide" style="font-size:18pt">${esc(k[0])}</div><div class="stat-l">${esc(k[1])}</div></div>`).join('')}
      </div>
    </div>
  </div>`, `Concept ${c.num} — ${esc(c.nom)}`, 'Téléphone');

/* ── Recommandation ─────────────────────────────────────────── */
const scoreRow = (r) => `<tr><td>${esc(r[0])}</td>${r.slice(1).map(v => `<td>${[1, 2, 3, 4, 5].map(i => `<span class="score${i <= v ? ' on' : ''}"></span>`).join('')}</td>`).join('')}</tr>`;
const reco = () => P(`
  <p class="kicker">Troisième partie — choisir</p>
  <h2 class="t">${rich(RECO.titre)}</h2>
  <div class="grid2" style="margin-top:6mm;gap:12mm;flex:1">
    <div>
      <table class="tb"><tr><th style="width:40mm">Critère</th>${CONCEPTS.map(c => `<th>${esc(c.nom)}</th>`).join('')}</tr>${RECO.grille.map(scoreRow).join('')}</table>
      <p class="txt" style="margin-top:4mm;font-size:8pt">${rich(RECO.legende)}</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:5mm">
      <div><p class="lbl">Mon avis</p>${RECO.avis.map(p => `<p class="txt">${rich(p)}</p>`).join('')}</div>
      <div><p class="lbl">Ce qui se combine</p><p class="txt">${rich(RECO.combine)}</p></div>
    </div>
  </div>`, 'Choisir', 'Recommandation');

const suite = () => P(`
  <p class="kicker">Et après</p>
  <h2 class="t">${rich(RECO.suiteTitre)}</h2>
  <div class="grid3" style="margin-top:8mm;gap:10mm">
    ${RECO.etapes.map((e, i) => `<div class="box"><div class="num">${String(i + 1).padStart(2, '0')}</div><div class="wide" style="font-size:14pt;margin:2mm 0 3mm">${esc(e.h)}</div><p class="txt" style="font-size:8.6pt">${rich(e.d)}</p></div>`).join('')}
  </div>
  <div style="margin-top:auto"><hr class="rule"><p class="cond" style="font-size:6.6pt;color:var(--bone-faint);margin:4mm 0 0">Mauvais Grain<span class="dot">.</span> — 94 quai des Chartrons, 33000 Bordeaux — timeotaris@mauvaisgrain.com — 06 52 06 53 89</p></div>`, 'Et après', 'Suite');

/* ── Assemblage ─────────────────────────────────────────────── */
const pages = [];
pages.push(cover());
const tocRows = [];
const body = [];
body.push(veilleMethode());
for (const pl of VEILLE.planches) body.push(planche(pl));
for (const pg of VEILLE.pages) body.push(listes(pg));
for (const c of CONCEPTS) body.push(cOuverture(c), cIdee(c), cArchi(c), cEcrans(c), cMobile(c));
body.push(reco(), suite());
// Sommaire (les numéros sont recalculés : couverture 1, sommaire 2, puis le corps)
const n0 = 3;
let n = n0;
tocRows.push([`p. ${String(n).padStart(2, '0')}`, 'La veille', `${VEILLE.planches.length + VEILLE.pages.length + 1} pages — méthode, références, conventions, gestes rares, ce que personne ne fait, le niveau bordelais.`]);
n += 1 + VEILLE.planches.length + VEILLE.pages.length;
for (const c of CONCEPTS) { tocRows.push([`p. ${String(n).padStart(2, '0')}`, `${c.num} — ${c.nom}`, c.pitchCourt]); n += 5; }
tocRows.push([`p. ${String(n).padStart(2, '0')}`, 'Choisir', 'Grille de comparaison, avis, ce qui se combine, et les étapes suivantes.']);
pageNo = 1; // le folio du sommaire sera 02
pages.push(toc(tocRows));
// Renuméroter le corps proprement : on régénère avec pageNo courant
pageNo = 2;
const bodyHtml = [];
bodyHtml.push(veilleMethode());
for (const pl of VEILLE.planches) bodyHtml.push(planche(pl));
for (const pg of VEILLE.pages) bodyHtml.push(listes(pg));
for (const c of CONCEPTS) bodyHtml.push(cOuverture(c), cIdee(c), cArchi(c), cEcrans(c), cMobile(c));
bodyHtml.push(reco(), suite());

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Mauvais Grain — Veille & concepts</title><style>${css}</style></head><body>${pages.join('')}${bodyHtml.join('')}</body></html>`;
fs.writeFileSync(`${BASE}/dossier4.html`, html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${BASE}/dossier4.html`, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1500);
// Contrôle des débordements : chaque .pad ne doit pas dépasser sa page.
const overflow = await page.evaluate(() => [...document.querySelectorAll('.page')].map((p, i) => {
  const pad = p.querySelector('.pad'); const r = p.getBoundingClientRect();
  const over = [...pad.querySelectorAll('*')].filter(el => { const b = el.getBoundingClientRect(); return b.height > 0 && (b.bottom > r.bottom - 2 || b.right > r.right - 2); });
  return over.length ? `page ${i + 1}: ${over.length} éléments débordent (${over.slice(0, 2).map(e => e.className || e.tagName).join(', ')})` : null;
}).filter(Boolean));
console.log(overflow.length ? overflow.join('\n') : 'Aucun débordement.');
await page.pdf({ path: `${BASE}/MauvaisGrain-veille-concepts.pdf`, width: '297mm', height: '210mm', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
await browser.close();
console.log('PDF écrit :', pageNo, 'pages');
