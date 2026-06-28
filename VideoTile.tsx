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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={`block overflow-hidden pb-[0.04em] ${className}`}>
      <span
        style={{
          display: "block",
          transform: inView ? "translateY(0)" : "translateY(115%)",
          transition: `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          willChange: "transform",
        } as CSSProperties}
      >
        {children}
      </span>
    </span>
  );
}
