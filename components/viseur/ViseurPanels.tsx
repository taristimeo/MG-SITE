"use client";

import Link from "next/link";
import { founder, projectThumb, projects, services, site } from "@/lib/site";

/**
 * L'INDEX DÉPLIABLE — « Tout voir ».
 *
 * Le mode de secours qu'exige le parti pris de la bague : six vignettes,
 * toutes atteignables au clavier. Cliquer une vignette ramène la bague sur
 * ce film ; le lien secondaire mène directement à sa fiche.
 */
export function IndexPanelBody({
  current,
  onPick,
}: {
  current: number;
  onPick: (i: number) => void;
}) {
  return (
    <div className="vs-grid">
      {projects.map((p, i) => (
        <div key={p.slug} className={`vs-card${i === current ? " is-current" : ""}`}>
          <button
            type="button"
            onClick={() => onPick(i)}
            className="block w-full cursor-pointer text-left"
            aria-label={`Cadrer ${p.title} dans le viseur`}
          >
            <span className="vs-card-img block">
              <img
                src={projectThumb(p)}
                alt=""
                loading="lazy"
                decoding="async"
                aria-hidden="true"
              />
              <span className="vs-card-n">{String(i + 1).padStart(2, "0")}</span>
            </span>
            <span className="vs-card-t block">{p.title}</span>
            <span className="vs-card-m">
              {p.category}
              <em aria-hidden />
              {p.client}
              <em aria-hidden />
              {p.year}
            </span>
          </button>
          <Link href={`/realisations/${p.slug}`} className="vs-card-link">
            Voir le film →
          </Link>
        </div>
      ))}
    </div>
  );
}

/** LE STUDIO — le portrait, les trois partis pris, les cinq métiers. */
export function StudioPanelBody() {
  return (
    <div className="vs-cols">
      <div>
        <div className="vs-portrait">
          <img
            src="/photo-studio.jpg"
            alt={`${founder.name}, ${founder.role.toLowerCase()} de ${site.name}`}
            loading="lazy"
            decoding="async"
          />
        </div>
        <p className="vs-sublabel mt-5 mb-0">{founder.role}</p>
        <p className="font-wide mt-2 text-[22px] leading-none text-[var(--color-bone)]">
          {founder.name}
        </p>
      </div>

      <div>
        <p className="vs-lead mb-10">{site.intro}</p>

        <p className="vs-sublabel">Les partis pris</p>
        <ul className="vs-creed">
          {founder.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>

        <p className="vs-sublabel">Les métiers</p>
        <ul className="vs-jobs">
          {services.map((s) => (
            <li key={s.id}>
              <span className="i">{s.index}</span>
              <span className="t">{s.title}</span>
              <span className="l">{s.line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** LE CONTACT — de quoi joindre le studio sans quitter le viseur. */
export function ContactPanelBody() {
  const devisHref = `mailto:${site.email}?subject=${encodeURIComponent(
    "Demande de devis",
  )}`;

  return (
    <div className="vs-cols">
      <div>
        <p className="vs-sublabel">{site.city} — depuis {site.founded}</p>
        <p className="font-wide text-[26px] leading-[1.15] text-[var(--color-bone)]">
          {site.tagline}
          <span className="dot">.</span>
        </p>
      </div>

      <div>
        <dl className="vs-contact-list">
          <div className="vs-contact-row">
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </dd>
          </div>
          <div className="vs-contact-row">
            <dt>Téléphone</dt>
            <dd>
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            </dd>
          </div>
          <div className="vs-contact-row">
            <dt>Adresse</dt>
            <dd>
              {site.street}
              <br />
              {site.postalCode} {site.city}
            </dd>
          </div>
          <div className="vs-contact-row">
            <dt>Réseaux</dt>
            <dd className="flex flex-wrap gap-x-6 gap-y-2">
              {site.socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </dd>
          </div>
        </dl>

        <a className="vs-devis" href={devisHref}>
          Demander un devis <u aria-hidden>→</u>
        </a>
      </div>
    </div>
  );
}
