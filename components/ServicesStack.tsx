import Link from "next/link";
import { services } from "@/lib/site";

// « Ce qu'on fait » : les 5 prestations en cartes empilées. Chaque carte est
// sticky avec un décalage croissant : au scroll, la suivante vient recouvrir la
// précédente (pur CSS, aucun JS — se dégrade naturellement en simple liste).
// Enfin visibles : ces accroches n'existaient jusqu'ici que dans le SEO.
export function ServicesStack() {
  return (
    <section className="px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center">
          <p className="font-cond text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Ce qu&apos;on fait
          </p>
          <h2 className="font-wide mt-4 text-[clamp(1.9rem,5vw,3.6rem)] leading-[1] text-[var(--color-bone)]">
            Cinq façons de raconter<span className="dot">.</span>
          </h2>
        </div>

        <ol className="mt-16 flex flex-col gap-6 sm:mt-20">
          {services.map((s, i) => (
            <li
              key={s.id}
              className="sticky"
              style={{ top: `calc(84px + ${i * 18}px)` }}
            >
              <div
                className="flex min-h-[38vh] flex-col justify-between rounded-3xl border border-[var(--color-line-soft)] p-8 shadow-2xl sm:min-h-[42vh] sm:p-12"
                style={{
                  background:
                    i % 2 ? "var(--color-ink-3)" : "var(--color-ink-2)",
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-cond text-sm tracking-[0.2em] text-[var(--color-terra)]">
                    {s.index}
                  </span>
                  <span className="font-cond text-[11px] tracking-[0.2em] text-[var(--color-bone-faint)]">
                    {s.title}
                  </span>
                </div>

                <p className="font-wide max-w-[18ch] text-[clamp(1.7rem,4.6vw,3.6rem)] leading-[1.12] text-[var(--color-cream)]">
                  {s.line}
                </p>

                <div>
                  <Link
                    href="/realisations"
                    className="link-underline font-cond text-[11px] tracking-[0.2em] text-[var(--color-bone-dim)] transition-colors hover:text-[var(--color-terra)]"
                  >
                    Voir les films <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
