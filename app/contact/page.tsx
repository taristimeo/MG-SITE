import type { Metadata } from "next";
import { DevisForm } from "@/components/DevisForm";
import { Rise } from "@/components/Rise";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Parlez-nous de votre projet vidéo : ${site.name}, studio de production vidéo à ${site.city}. Réponse sous 24 h.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="pt-[calc(var(--nav-h)+24px)] md:pt-[calc(var(--nav-h)+48px)]">
      <header className="gutter">
        <p className="t-legend mb-5">Un projet ?</p>
        <h1 className="t-giant m-0">On en parle.</h1>
      </header>

      <section className="gutter mt-16 md:mt-28 md:grid md:grid-cols-12 md:gap-x-8">
        {/* Les accès directs. */}
        <div className="md:col-span-4">
          <Rise>
            <dl className="space-y-8">
              <div>
                <dt className="t-legend mb-2 opacity-60">Écrire</dt>
                <dd className="m-0">
                  <a href={`mailto:${site.email}`} className="u-draw font-wide text-[clamp(1.35rem,2.3vw,2.4rem)] leading-tight [overflow-wrap:anywhere]">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="t-legend mb-2 opacity-60">Appeler</dt>
                <dd className="m-0">
                  <a href={`tel:${site.phoneHref}`} className="u-draw t-title">
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="t-legend mb-2 opacity-60">Venir</dt>
                <dd className="t-body m-0">
                  {site.street}
                  <br />
                  {site.postalCode} {site.city}
                </dd>
              </div>
              <div>
                <dt className="t-legend mb-2 opacity-60">Suivre</dt>
                <dd className="t-legend m-0 flex gap-5">
                  {site.socials.map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="u-draw">
                      {s.label}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
            <p className="t-legend mt-12 flex items-center gap-3">
              <span aria-hidden className="inline-block h-[6px] w-[6px] rounded-full bg-[var(--color-terra)]" />
              Disponible — réponse sous 24 h
            </p>
          </Rise>
        </div>

        {/* La demande. */}
        <div className="mt-16 md:col-span-7 md:col-start-6 md:mt-0">
          <Rise>
            <p className="t-legend mb-8">Décrire le projet</p>
            <DevisForm />
          </Rise>
        </div>
      </section>
    </article>
  );
}
