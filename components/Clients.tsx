import { Reveal } from "@/components/Reveal";
import { clients } from "@/lib/site";

// « Nos clients » — grille STATIQUE de cartes (aucun défilement horizontal).
// Chaque logo repose dans une carte sombre au liseré terracotta discret, qui se
// soulève et s'éclaire au survol. Révélation en cascade à l'entrée dans le
// champ. prefers-reduced-motion : géré par la classe .reveal (globals.css).
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

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:mt-20 sm:grid-cols-4 sm:gap-4">
          {clients.map((c, i) => (
            <Reveal key={c.name} as="li" delay={80 + i * 60}>
              <div className="group flex aspect-[16/10] items-center justify-center rounded-2xl bg-gradient-to-br from-[#211812] to-[#15100c] p-6 ring-1 ring-[rgba(183,110,78,0.18)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:ring-[rgba(183,110,78,0.5)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.logo}
                  alt={c.name}
                  loading="lazy"
                  className="max-h-[44%] w-auto max-w-[72%] object-contain opacity-75 transition-opacity duration-500 group-hover:opacity-100"
                />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
