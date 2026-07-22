"use client";

import { useEffect, useRef, useState } from "react";

export type StorySection = { label: string; body: string };

// Récit d'une réalisation en trois temps (Le projet / Notre approche / Le
// résultat). Chaque bloc se révèle à son entrée dans le viewport : grand
// chiffre fantôme, filet terracotta qui se trace, puis titre et texte en
// fondu-montée échelonnés. Repli statique si prefers-reduced-motion.
export function ProjectStory({ sections }: { sections: StorySection[] }) {
  return (
    <div className="mx-auto flex max-w-[680px] flex-col gap-20 text-center sm:gap-28 lg:mx-0 lg:ml-[16%] lg:text-left">
      {sections.map((s, i) => (
        <StoryBlock key={s.label} index={i} label={s.label} body={s.body} />
      ))}
    </div>
  );
}

function StoryBlock({
  index,
  label,
  body,
}: {
  index: number;
  label: string;
  body: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={ref}
      className={`story-block relative ${visible ? "is-in" : ""}`}
    >
      {/* Grand chiffre fantôme en filigrane derrière le bloc */}
      <span
        aria-hidden
        className="story-ghost pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-wide leading-none text-[clamp(7rem,18vw,13rem)] text-[rgba(183,110,78,0.07)] lg:left-0 lg:translate-x-[-20%]"
      >
        {num}
      </span>

      <span className="story-index inline-block font-cond text-xs tracking-[0.2em] text-[var(--color-terra)]">
        {num}
      </span>

      {/* Filet terracotta : se trace depuis le centre */}
      <span
        aria-hidden
        className="story-rule mx-auto mt-4 block h-px w-12 origin-center bg-[var(--color-terra)] lg:mx-0 lg:origin-left"
      />

      <h2 className="story-title font-wide mt-5 text-2xl text-[var(--color-bone)] sm:text-3xl">
        {label}
      </h2>
      <p className="story-body font-sans mx-auto mt-5 text-[1.05rem] leading-[1.7] text-[var(--color-bone-dim)] lg:mx-0">
        {body}
      </p>
    </div>
  );
}
