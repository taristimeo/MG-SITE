"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { CardMedia } from "@/components/CardMedia";
import { DevisModal } from "@/components/DevisModal";
import { Parallax } from "@/components/Parallax";
import { Reveal } from "@/components/Reveal";

// Section « Donner vie à vos images » : titre révélé ligne par ligne (masque
// qui monte) et photo qui s'ouvre en se dézoomant, avec léger parallax.
export function LiveImages() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28 lg:px-10 lg:pt-40">
      <div ref={ref} className={`mx-auto max-w-[1600px] ${inView ? "in-view" : ""}`}>
        <div className="flex flex-col items-center">
          <h2 className="font-wide text-center text-[clamp(2.4rem,9vw,8.5rem)] leading-[0.98] text-[var(--color-bone)]">
            <span className="mask-line">
              <span>Donner vie</span>
            </span>
            <span className="mask-line" style={{ "--mask-delay": "130ms" } as CSSProperties}>
              <span>à vos images</span>
            </span>
          </h2>

          <div className="mt-12 sm:mt-16">
            <Parallax amount={40}>
              <div className="aspect-[4/5] w-[72vw] max-w-[320px] overflow-hidden rounded-2xl sm:w-[40vw] sm:max-w-[380px]">
                <div
                  className="img-open h-full w-full"
                  style={{ "--mask-delay": "220ms" } as CSSProperties}
                >
                  <CardMedia
                    src="/projects/the-sound-of-discovery/1.jpg"
                    videoSrc="/projects/the-sound-of-discovery/preview.mp4"
                    alt="The Sound of Discovery — film tourné en Égypte par Mauvais Grain"
                  />
                </div>
              </div>
            </Parallax>
          </div>
        </div>

        {/* Bloc CTA — monte en fondu, échelonné, quand il entre dans le champ
            (observer propre à chaque Reveal, indépendant du reveal du titre). */}
        <div className="mt-16 flex flex-col items-center gap-5">
          <Reveal
            as="p"
            className="font-cond text-center text-xs tracking-[0.2em] text-[var(--color-bone-faint)]"
          >
            Un projet en tête ?
          </Reveal>
          <Reveal delay={140}>
            <DevisModal label="Démarrer un projet" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
