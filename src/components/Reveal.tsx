"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const DEFAULT_DISTANCE = 30;

function offsetFor(from: Direction, distance: number): string {
  switch (from) {
    case "up":
      return `translateY(${distance}px)`;
    case "down":
      return `translateY(${-distance}px)`;
    case "left":
      return `translateX(${distance}px)`;
    case "right":
      return `translateX(${-distance}px)`;
    default:
      return "none";
  }
}

interface RevealProps {
  children: ReactNode;
  /** Direction the element travels *from* while entering. */
  from?: Direction;
  /** Seconds of delay before the transition starts. */
  delay?: number;
  /** Seconds the transition runs for. */
  duration?: number;
  className?: string;
  as?: "div" | "section" | "p" | "span" | "li";
  /**
   * `true` (default) matches framer-motion's `viewport={{ once: true }}` — the
   * element reveals once and stays. `false` matches a bare `whileInView`, which
   * re-hides the element when it leaves the viewport and replays on re-entry.
   * The target uses both; see docs/research/BEHAVIORS.md for which is which.
   */
  once?: boolean;
  /** Travel distance in px. The target mostly uses 30, but not always. */
  distance?: number;
}

/**
 * Scroll-triggered reveal matching the target site's framer-motion
 * `whileInView` behaviour: elements start hidden and offset, then ease into
 * place once ~15% of the element has entered the viewport.
 */
export function Reveal({
  children,
  from = "up",
  delay = 0,
  duration = 0.7,
  className,
  as: Tag = "div",
  once = true,
  distance,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* Reduced motion: reveal immediately, but schedule the state update rather
       than calling it synchronously inside the effect body. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn(className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : offsetFor(from, distance ?? DEFAULT_DISTANCE),
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        /* Only hint while the element still has work to do. Leaving `will-change`
           on permanently keeps the element on its own compositing layer, which
           changes subpixel text antialiasing versus the target. */
        willChange: shown && once ? undefined : "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
