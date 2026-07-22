"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

export function MaskTitle({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setReduced(true);
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={`block overflow-hidden pb-[0.16em] ${className}`}>
      <span
        style={{
          display: "block",
          transform: inView ? "translateY(0)" : "translateY(115%)",
          filter: inView ? "blur(0)" : "blur(5px)",
          transition: reduced
            ? "none"
            : `transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter 0.85s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
          willChange: "transform, filter",
        } as CSSProperties}
      >
        {children}
      </span>
    </span>
  );
}
