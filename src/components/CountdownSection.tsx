"use client";

import { useEffect, useState } from "react";

interface CountdownSectionProps {
  /** Ceremony start with the Vietnam offset, so every viewer agrees on the target. */
  targetIso: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

/** Remaining time, clamped at zero — never negative once the date has passed. */
function getTimeLeft(targetMs: number, now: number): TimeLeft {
  const diff = targetMs - now;
  if (diff <= 0) return ZERO;

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[64px]">
      <span className="font-lora leading-none text-foreground tabular-nums text-[44px]">
        {pad(value)}
      </span>
      <span className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-lora">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span className="text-[26px] leading-none text-wine/70 pt-[6px]" aria-hidden="true">
      ·
    </span>
  );
}

/**
 * Live countdown to the ceremony. Renders all-zero markup on the server and
 * begins ticking only after mount, so the hydrated HTML always matches.
 */
export function CountdownSection({ targetIso }: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO);

  useEffect(() => {
    const targetMs = new Date(targetIso).getTime();
    const tick = () => setTimeLeft(getTimeLeft(targetMs, Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  return (
    <section className="px-4 pt-16 mobilel:px-6 mobilel:pt-20 relative text-center pb-16">
      <h2 className="font-silenter text-5xl text-wine mb-3">Countdown</h2>
      <p className="font-lora text-[16px] text-foreground/80 mt-5 mb-8">
        Đếm ngược đến ngày hạnh phúc
      </p>

      <div className="mx-auto max-w-[360px] border-y border-foreground/20 py-7 flex items-start justify-center gap-4 mobilem:gap-5 mobilel:gap-6">
        <CountdownUnit value={timeLeft.days} label="Ngày" />
        <Separator />
        <CountdownUnit value={timeLeft.hours} label="Giờ" />
        <Separator />
        <CountdownUnit value={timeLeft.minutes} label="Phút" />
        <Separator />
        <CountdownUnit value={timeLeft.seconds} label="Giây" />
      </div>
    </section>
  );
}
