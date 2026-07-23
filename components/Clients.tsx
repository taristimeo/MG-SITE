import { Reveal } from "@/components/Reveal";
import { clients } from "@/lib/site";

// « Nos clients » — mur de logos épuré. Les logotypes (clairs, sur fond
// transparent) reposent directement sur l'encre, en teinte discrète, et se
// ravivent au survol. Pas de cadres, pas de défilement automatique : une grille
// centrée qui s'enroule, révélée en cascade à l'entrée dans le champ.
// prefers-reduced-motion : géré par la classe .reveal (globals.css).
export function Clients() {
  return (
    <section className="px-5 pb-20 pt-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1100px]">
        <Reveal>
          <p className="font-cond text-center text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Nos clients
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-wide mx-auto mt-4 max-w-[18ch] text-center text-[clamp(2.2rem,6vw,4.2rem)] leading-tight text-[var(--color-bone)]">
            Pourquoi pas vous&nbsp;?
          </h2>
        </Reveal>

        <ul className="mx-auto mt-16 flex max-w-[900px] flex-wrap items-center justify-center gap-x-[clamp(2.75rem,6vw,5rem)] gap-y-14 sm:mt-20">
          {clients.map((c, i) => (
            <Reveal key={c.name} as="li" delay={90 + i * 55}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.logo}
                alt={c.name}
                loading="lazy"
                className="h-8 w-auto opacity-65 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-100 sm:h-9"
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
