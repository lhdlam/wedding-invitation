import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { BRIDE, GROOM, coupleFor } from "@/data/invitation";
import type { SideKey } from "@/types/invitation";

interface HeroSectionProps {
  /** Compact ceremony date, e.g. "19.09.2026". */
  dateLabel: string;
  /** Hosting side — decides whose name is read first. */
  side: SideKey;
}

/**
 * Full-bleed opening: the veil photo fills the first viewport edge to edge,
 * with the cream script, date and names overlaid on a soft bottom gradient.
 */
export function HeroSection({ dateLabel, side }: HeroSectionProps) {
  const dateShort = dateLabel.replace(".2026", ".26");
  const [first, second] = coupleFor(side);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <Image
        src="/images/couple-2/DSC01062.webp"
        alt={`${GROOM.fullName} & ${BRIDE.fullName}`}
        fill
        priority
        sizes="(max-width: 480px) 100vw, 480px"
        className="object-cover object-center"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />

      <div className="absolute inset-x-0 bottom-0 pb-12 px-6 text-center">
        <Reveal from="up" as="p" className="font-silenter text-[46px] text-[#f2e9da] leading-none drop-shadow-md">
          Save our date
        </Reveal>
        <Reveal from="up" delay={0.15} as="p" className="font-lora text-[34px] text-white tracking-[6px] mt-4 drop-shadow-md">
          {dateShort}
        </Reveal>
        <Reveal from="up" delay={0.25} as="p" className="font-lora text-[13px] text-white/90 uppercase tracking-[4px] mt-2 drop-shadow">
          {first.shortName} &amp; {second.shortName}
        </Reveal>
        <Reveal from="up" delay={0.35} className="mt-6 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-white/50" />
          <p className="font-lora text-[11px] text-white/75 uppercase tracking-[3px]">
            Trân trọng kính mời
          </p>
          <span className="h-px w-10 bg-white/50" />
        </Reveal>
      </div>
    </section>
  );
}
