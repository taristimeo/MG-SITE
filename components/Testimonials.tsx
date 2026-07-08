import { Reveal } from "@/components/Reveal";
import { testimonials } from "@/lib/site";

// Étoile pleine, teinte terracotta (note 5/5).
function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 17.3l-6.16 3.7 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.48 4.73 1.64 7.03z" />
    </svg>
  );
}

// Section preuve sociale : avis clients (Google) en cartes éditoriales.
export function Testimonials() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <p className="font-cond text-center text-xs tracking-[0.25em] text-[var(--color-bone-faint)]">
            Ils nous font confiance
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-wide mt-4 text-center text-[clamp(2rem,6vw,4rem)] leading-[1] text-[var(--color-bone)]">
            Ce qu&apos;ils en disent<span className="dot">.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-20 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 110}>
              <figure className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-line-soft)] bg-[var(--color-ink-2)] p-8 sm:p-9">
                <div
                  className="mb-6 flex gap-1.5 text-[var(--color-terra)]"
                  aria-label="Note : 5 sur 5"
                >
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} />
                  ))}
                </div>

                <blockquote className="font-sans text-[15px] leading-relaxed text-[var(--color-cream)] sm:text-base">
                  <span
                    aria-hidden
                    className="font-wide mr-1 align-[-0.15em] text-xl text-[var(--color-terra)]"
                  >
                    &laquo;
                  </span>
                  {t.quote}
                  <span
                    aria-hidden
                    className="font-wide ml-1 align-[-0.15em] text-xl text-[var(--color-terra)]"
                  >
                    &raquo;
                  </span>
                </blockquote>

                <figcaption className="mt-auto flex items-center gap-3 pt-9">
                  <span className="h-px w-6 shrink-0 bg-[var(--color-terra)]" />
                  <span className="font-cond text-sm text-[var(--color-bone)]">
                    {t.name}
                  </span>
                  {t.meta && (
                    <span className="font-cond text-xs text-[var(--color-bone-faint)]">
                      · {t.meta}
                    </span>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
