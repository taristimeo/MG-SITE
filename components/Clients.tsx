import { Reveal } from "@/components/Reveal";
import { clients } from "@/lib/site";

// Rangée de logos dupliquée pour un défilement parfaitement continu (la piste
// translate de -50 %). La seconde copie est purement décorative.
function LogoRow({ decorative = false }: { decorative?: boolean }) {
  return (
    <ul
      aria-hidden={decorative || undefined}
      className="flex shrink-0 items-center gap-4 pr-4"
    >
      {clients.map((c) => (
        <li
          key={c.name}
          className="group flex h-28 w-44 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#241a13] to-[#16110d] p-6 ring-1 ring-[rgba(183,110,78,0.22)] transition-all duration-500 hover:ring-[var(--color-terra)] sm:h-32 sm:w-52"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.logo}
            alt={decorative ? "" : c.name}
            loading="lazy"
            className="max-h-[56%] w-auto max-w-[72%] object-contain opacity-80 transition-opacity duration-500 group-hover:opacity-100"
          />
        </li>
      ))}
    </ul>
  );
}

// « Ils nous font confiance » : les logos défilent en continu, lentement,
// comme un générique horizontal. En prefers-reduced-motion le défilement
// s'arrête et la rangée devient défilable au doigt (voir globals.css).
export function Clients() {
  return (
    <section className="overflow-hidden px-0 pb-20 pt-8">
      <div className="px-5 sm:px-8 lg:px-10">
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
      </div>

      <Reveal delay={220}>
        <div className="marquee-wrap mt-14 overflow-hidden">
          <div className="marquee-x flex w-max">
            <LogoRow />
            <LogoRow decorative />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
