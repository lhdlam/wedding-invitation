"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScriptRevealProps {
  children: ReactNode;
  /** Seconds of delay before the wipe starts. */
  delay?: number;
  /** Seconds the wipe runs for. */
  duration?: number;
  className?: string;
}

/**
 * Handwriting-style reveal for script type: the text wipes in from the left,
 * as if being written. The clip insets are negative so the script's tall
 * flourishes and descenders are never cut off. Replays on re-entry, matching
 * the other reveals on the page.
 */
export function ScriptReveal({
  children,
  delay = 0,
  duration = 1.4,
  className,
}: ScriptRevealProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* Reduced motion: reveal immediately, scheduled rather than synchronous. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShown(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className={cn(className)}
      style={{
        clipPath: shown
          ? "inset(-25% -8% -35% -8%)"
          : "inset(-25% 108% -35% -8%)",
        opacity: shown ? 1 : 0,
        transition: `clip-path ${duration}s cubic-bezier(0.65, 0, 0.35, 1) ${delay}s, opacity 0.3s ease ${delay}s`,
        willChange: "clip-path",
      }}
    >
      {children}
    </p>
  );
}
