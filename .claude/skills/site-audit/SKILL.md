---
name: site-audit
description: >-
  Run a comprehensive multi-agent audit of a website or web codebase. Launches
  independent agents in parallel — SEO, bug/robustness, and creative/design
  inspiration — each analysing (never editing) the repo, then compiles their
  findings into a single self-contained, brand-matched HTML audit report with
  per-item priority + effort badges, a "quick wins" filter, and a top-3
  synthesis. Use whenever the user asks to audit/review the site, do a "gros
  tour"/"big pass", "lance plusieurs agents" to review the code, wants an
  SEO + bugs + design review, asks "what can I improve" about their site, or
  wants an HTML audit of findings with priorities and options — even if they
  don't say the word "audit".
---

# Site Audit — multi-agent → HTML report

Produce a decision-ready audit of a website by fanning out specialised agents,
then synthesising their reports into one branded HTML page the user can browse
and act on. The value is twofold: **breadth** (several expert lenses at once)
and **a single ranked artefact** where every finding carries a priority and an
effort estimate so the user can choose what to ship.

## Core principles

- **Agents analyse, they never edit.** The audit's job is to *inform a decision*,
  not to change the site mid-flight. Parallel agents editing the same repo would
  also collide. Tell every agent explicitly: read-only, report only.
- **The user decides.** The deliverable is options, not a fait accompli. After
  the audit, offer to implement chosen items — don't apply changes unasked.
- **Match the report to the site's own identity.** An audit of a design-led
  studio should itself look considered. Read the target's design tokens and
  reuse its palette/type so the report feels like it belongs to the brand.
- **Relay, don't dump.** Agent reports are not shown to the user automatically —
  you receive them, you compile them. In chat, give a tight synthesis + the
  artefact link, not the raw agent output.

## Workflow

### 1. Scope the audit

Confirm the target (repo path, live URL) and which lenses to run. Default to
three, but adapt to the request:

| Lens | Focus |
|------|-------|
| **SEO** | metadata, structured data (JSON-LD), sitemap/robots, headings, image/perf (Core Web Vitals), local SEO, content gaps, `npm run build` sanity |
| **Bugs & robustness** | correctness, edge cases, React/effects pitfalls, forms, modals, a11y, responsive, TypeScript, build/lint |
| **Inspiration / design** | study best-in-class sites in the subject's field (web research), propose improvements that fit the existing identity |

Swap or add lenses when the request calls for it (e.g. "performance", "security",
"accessibility", "copywriting"). Keep each lens sharply scoped — overlap wastes
tokens and produces duplicate findings.

### 2. Launch all agents in parallel — in one turn

Spawn every agent in a **single message** (multiple Agent tool calls) so they run
concurrently. Use `general-purpose` agents (the inspiration lens needs web
access via WebSearch/WebFetch; SEO/bugs need repo reading + `npm run build`).

Each prompt MUST specify, in the target language (write prompts in the user's
language so the returned report is too):
- The stack, repo path, and live URL.
- The exact scope for that lens (see table) with instruction to cite `file:line`.
- **"NE MODIFIE AUCUN FICHIER — analyse seulement."** (read-only).
- A structured deliverable: for each finding return
  `{zone/area, constat/current state, problème-opportunité, reco concrète (code
  snippet si utile), priorité HAUTE/MOYENNE/BASSE (or severity for bugs),
  effort}`, plus a short "already good / robust" list. End the prompt with:
  *"Ton rapport final EST le livrable — renvoie le contenu brut."*

See `references/agent-prompts.md` for ready-to-adapt prompt templates for each
lens.

Agents run in the background; you'll be notified as each completes. Do not
fabricate or pre-empt results — wait for every agent before compiling. Capture
the `total_tokens` / `duration_ms` from each notification if the user wants
cost/timing.

### 3. Compile the HTML audit

Once **all** agents have returned, build one self-contained HTML file.

- **Load the `artifact-design` skill first** to calibrate the treatment, then
  build. This is an information-design deliverable (scanned, not read
  top-to-bottom): surface the summary before the detail, encode priority/effort
  as pills so what matters reads at a glance.
- **Start from `assets/audit-template.html`** — it already implements the
  structure and interactions (sticky filter bar, priority/effort badges,
  quick-win chips, top-3 picks, per-lens sections, reduced-motion guard). Copy
  it, then **replace the content with the real findings** and **retune the
  palette to the audited site's brand** (read its `globals.css`/tokens). Never
  ship the template's example content.
- **Structure**: header (title, meta, verdict stats) → one section per lens
  (each with a compact "déjà en place / robuste" line + finding cards) →
  cross-lens "quick wins" and a top-3 "par où commencer" synthesis.
- **Each finding is a card** carrying: a reference code (reuse the agent's own
  IDs — they're real identifiers the user can search), a one-line *constat*, a
  one-line *reco* (prefix `→`), and badges for priority/severity + effort.
  Mark high-impact-low-effort items as `★ Quick win` and tag them so the filter
  can isolate them (`data-tags`, `data-priority`, `data-effort`).
- **Self-contained**: inline all CSS/JS, no external fonts/CDNs (Artifact CSP
  blocks them) — use system serif/mono/sans stacks that echo the brand. Respect
  `prefers-reduced-motion`. Give the `<title>` a stable, descriptive name.

Publish with the **Artifact** tool (favicon suited to the subject, e.g. 🎬 for a
video studio) so the user gets a browsable page. In headless/no-browser
environments an Artifact is ideal; otherwise `SendUserFile` with `display:
"render"` also works.

### 4. Synthesise in chat

Give the user: the artefact link, a 3-bullet recap (one per lens, leading with
the single most important finding of each), the recommended **quick-wins** list,
and an explicit offer to implement whichever items they pick. Keep it short — the
detail lives in the audit.

## Adapting scope

- **"Just SEO"** → run one lens, still produce the HTML (single section) unless
  the user only wants a chat answer.
- **More lenses** → add cards/sections; the template's grid and filter scale.
- **Non-web subject** → the same fan-out-then-compile shape works; rename lenses
  and retune the palette to that subject.

## Reference files

- `references/agent-prompts.md` — adaptable per-lens agent prompt templates.
- `assets/audit-template.html` — the report scaffold (structure + CSS + filter
  JS). Copy and refill; retune the palette to the target brand.
