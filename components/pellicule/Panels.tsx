"use client";

import type { ReactNode } from "react";
import { DevisModal } from "@/components/DevisModal";
import {
  clients,
  founder,
  manifesto,
  projectStills,
  projects,
  services,
  site,
} from "@/lib/site";

/**
 * LES PHOTOGRAMMES DE LECTURE.
 *
 * Les six panneaux crème de la bande — amorce, manifeste, partis pris,
 * clients, métiers, contact. Le texte vient intégralement de lib/site.ts ;
 * ne restent ici que la mise en page et le rythme de la maquette.
 */

/** Coquille commune : ton, largeur sur la bande, numéro, accroche clavier. */
function Panel({
  className,
  num,
  label,
  w,
  children,
}: {
  className?: string;
  num: string;
  label: string;
  w: number;
  children: ReactNode;
}) {
  return (
    <section
      data-pel-panel=""
      data-tone="light"
      tabIndex={0}
      aria-label={`Photogramme ${num} — ${label}`}
      className={`pel-panel ${className ?? ""}`}
      style={{ "--pel-w": w } as React.CSSProperties}
    >
      {children}
      <span className="pel-num font-cond" aria-hidden="true">
        {num}
      </span>
    </section>
  );
}

/** Le logotype coupé en deux lignes, point terracotta compris. */
function Logotype() {
  const words = site.name.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={word}>
          {word}
          {i < words.length - 1 ? <br /> : null}
        </span>
      ))}
      <span className="dot">.</span>
    </>
  );
}

/** Souligne en terracotta les mots « accents » du manifeste. */
function withAccents(text: string, accents: readonly string[]) {
  const escaped = accents.map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "g"));
  return parts.map((part, i) =>
    (accents as readonly string[]).includes(part) ? (
      <em key={i}>{part}</em>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/* ── 01 · Amorce ─────────────────────────────────────────────────────── */
export function Amorce({ num, w }: { num: string; w: number }) {
  return (
    <Panel className="pel-amorce" num={num} label={site.name} w={w}>
      <div className="pel-kick font-cond">
        <i />
        Studio de production vidéo — {site.city}
      </div>
      <h1 className="font-wide">
        <Logotype />
      </h1>
      <p className="pel-base">{site.tagline}.</p>
      <div className="pel-hint font-cond">
        <b>Défilez</b>
        <span className="pel-arw" />
      </div>
      <div className="pel-edge" aria-hidden="true" />
    </Panel>
  );
}

/* ── 02 · Manifeste ──────────────────────────────────────────────────── */
export function Manifeste({ num, w }: { num: string; w: number }) {
  return (
    <Panel className="pel-manif" num={num} label="Le manifeste" w={w}>
      <div className="pel-lbl font-cond">{manifesto.kicker}</div>
      <blockquote className="font-wide">
        {withAccents(manifesto.text, manifesto.accents)}
      </blockquote>
      <p className="pel-who">
        Studio de production vidéo, {site.city}. Fondé en {site.founded} par{" "}
        {site.founder}.
      </p>
    </Panel>
  );
}

/* ── 09 · Les partis pris ────────────────────────────────────────────── */
export function Credo({ num, w }: { num: string; w: number }) {
  return (
    <Panel className="pel-credo" num={num} label="Les partis pris" w={w}>
      <div className="pel-im">
        <img
          className="pel-media"
          data-parallax=""
          src="/photo-studio.jpg"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="pel-txt">
        <div className="pel-lbl font-cond">Les partis pris</div>
        <ol>
          {founder.lines.map((line) => (
            <li key={line}>
              <span aria-hidden="true">—</span>
              {line}
            </li>
          ))}
        </ol>
        <p className="pel-sig">
          {founder.name}, {founder.role.toLowerCase()} — {site.city}, depuis{" "}
          {site.founded}.
        </p>
      </div>
    </Panel>
  );
}

/* ── 10 · Les clients ────────────────────────────────────────────────── */
export function ClientsPanel({ num, w }: { num: string; w: number }) {
  return (
    <Panel className="pel-clients" num={num} label="Les clients" w={w}>
      <div className="pel-lbl font-cond">Les clients</div>
      <div className="pel-grid">
        {clients.map((c) => (
          <div key={c.name}>
            <img src={c.logo} alt={c.name} loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ── 11 · Les métiers ────────────────────────────────────────────────── */
export function Jobs({ num, w }: { num: string; w: number }) {
  // La bande d'image du panneau : un still du film le plus récent.
  const band = projectStills(projects[0])[3] ?? projectStills(projects[0])[0];
  return (
    <Panel className="pel-jobs" num={num} label="Les métiers" w={w}>
      <div className="pel-col">
        <div className="pel-lbl font-cond">Les métiers</div>
        <h3>
          Les cinq métiers<span className="dot">.</span>
        </h3>
        {services.map((s) => (
          <div className="pel-row" key={s.id}>
            <b>{s.index}</b>
            <strong>{s.title}</strong>
            <p>« {s.line} »</p>
          </div>
        ))}
      </div>
      <div className="pel-band">
        <img
          className="pel-media"
          data-parallax=""
          src={band}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
    </Panel>
  );
}

/* ── 12 · Contact ────────────────────────────────────────────────────── */
export function Contact({ num, w }: { num: string; w: number }) {
  return (
    <Panel className="pel-contact" num={num} label="Contact" w={w}>
      <div className="pel-lbl font-cond">Contact</div>
      <h2 className="font-wide">
        {site.name}
        <span className="dot">.</span>
      </h2>
      <p className="pel-base">{site.tagline}.</p>

      <div className="pel-lines">
        <a href={`mailto:${site.email}`}>
          <em>Email</em>
          {site.email}
        </a>
        <a href={`tel:${site.phoneHref}`}>
          <em>Téléphone</em>
          {site.phone}
        </a>
        <p>
          <em>Atelier</em>
          {site.street}, {site.postalCode} {site.city}
        </p>
      </div>

      <div className="pel-ctas">
        <DevisModal
          className="pel-btn"
          ariaLabel="Demander un devis"
          label={
            <>
              Demander un devis
              <span aria-hidden="true" />
            </>
          }
        />
        <div className="pel-soc">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </Panel>
  );
}
