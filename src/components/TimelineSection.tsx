"use client";

import { Reveal } from "@/components/Reveal";
import { SectionDivider } from "@/components/icons";
import type { TimelineEntry } from "@/types/invitation";

interface TimelineSectionProps {
  entries: readonly TimelineEntry[];
}

/**
 * Reception running order on a vertical rail: a hairline spine on the left,
 * a crimson ring at every stop, time in Lora over a muted title.
 */
export function TimelineSection({ entries }: TimelineSectionProps) {
  return (
    <section className="relative px-4 py-10 mobilem:px-5 mobilel:px-6 mobilel:py-12 text-center">
      <Reveal>
        <p className="mb-3 text-[16px] mobilel:text-[18px] uppercase tracking-[4px] text-wine font-bold">
          Timeline of
        </p>
        <h2 className="font-silenter text-5xl text-wine mt-2 mb-3">
          Wedding
        </h2>
      </Reveal>

      <SectionDivider />

      <div className="relative mt-6 max-w-[300px] mx-auto text-left">
        {/* spine */}
        <span
          className="absolute left-[7px] top-[6px] bottom-[6px] w-px bg-foreground/15"
          aria-hidden="true"
        />
        {entries.map((entry, index) => (
          <Reveal
            key={entry.time}
            from="right"
            delay={index * 0.08}
            className="relative pl-10 pb-9 last:pb-0"
          >
            <span
              className="absolute left-0 top-[3px] h-[15px] w-[15px] rounded-full border-2 border-wine bg-background"
              aria-hidden="true"
            />
            <p className="font-lora text-xl text-foreground leading-none">
              {entry.time}
            </p>
            <p className="font-lora text-muted-foreground mt-2 text-[15px] leading-snug">
              {entry.title}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
