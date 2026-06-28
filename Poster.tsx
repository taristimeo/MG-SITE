import { Reveal } from "@/components/Reveal";
import { clients } from "@/lib/site";

// « Ils nous font confiance » : logos clients qui apparaissent un à un
// (gauche → droite) dans des carrés arrondis terracotta-mocha, stylés premium.
export function Clients() {
  return (
    <section className="px-5 pb-28 pt-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <p className="font-cond text-center text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Ils nous font confiance
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-wide mx-auto mt-4 max-w-[18ch] text-center text-[clamp(2.2rem,6vw,4.2rem)] leading-tight text-[var(--color-bone)]">
            Pourquoi pas vous&nbsp;?
          </h2>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {clients.map((c, i) => (
            <Reveal key={c.name} delay={i * 90}>
              <li className="group flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br from-[#241a13] to-[#16110d] p-7 ring-1 ring-[rgba(185,110,77,0.22)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(185,110,77,0.5)] hover:ring-[var(--color-terra)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.logo}
                  alt={c.name}
                  loading="lazy"
                  className="max-h-[58%] w-auto max-w-[74%] object-contain opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                />
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
