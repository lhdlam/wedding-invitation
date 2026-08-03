"use client";

import { useMemo } from "react";

import { PetalIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const PETAL_COUNT = 14;
const PETAL_SEED = 0x5eed_1234;

/** Deterministic PRNG (mulberry32) so SSR and the client agree — no hydration mismatch. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Petal {
  left: number;
  delay: number;
  duration: number;
  opacity: number;
  width: number;
  height: number;
}

function buildPetals(count: number, seed: number): Petal[] {
  const rand = mulberry32(seed);
  const petals: Petal[] = [];

  for (let i = 0; i < count; i += 1) {
    /* Tiny, sparse and faint — the hearts are a whisper, not confetti. */
    const left = rand() * 100; // 0–100%
    const delay = rand() * 10; // 0–10s
    const duration = 14 + rand() * 8; // 14–22s
    const opacity = 0.22 + rand() * 0.26; // 0.22–0.48
    const width = 8 + rand() * 8; // 8–16px

    petals.push({
      left,
      delay,
      duration,
      opacity,
      width,
      height: (width * 18) / 20,
    });
  }

  return petals;
}

export interface PetalFieldProps {
  className?: string;
}

export function PetalField({ className }: PetalFieldProps) {
  const petals = useMemo(() => buildPetals(PETAL_COUNT, PETAL_SEED), []);

  return (
    <div
      className={cn("pointer-events-none fixed inset-0 overflow-hidden z-0", className)}
      aria-hidden="true"
    >
      {petals.map((petal, index) => (
        <div
          key={index}
          className="absolute animate-petal"
          style={{
            left: `${petal.left}%`,
            top: 0,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        >
          <PetalIcon width={petal.width} height={petal.height} opacity={petal.opacity} />
        </div>
      ))}
    </div>
  );
}
