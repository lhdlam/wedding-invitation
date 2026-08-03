import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { BRIDE, GROOM } from "@/data/invitation";

interface HeroSectionProps {
  /** Compact ceremony date, e.g. "19.09.2026". */
  dateLabel: string;
}

/**
 * Opening block mirroring the printed envelope front: crimson script
 * "Save our date", the short date in wide-tracked serif, the two names in
 * crimson caps, then the photo in a thin hairline frame like a print.
 */
export function HeroSection({ dateLabel }: HeroSectionProps) {
  const dateShort = dateLabel.replace(".2026", ".26");

  return (
    <section className="relative px-6 pt-16 pb-14 text-center bg-white/60 overflow-hidden">
      <Reveal from="up" as="p" className="font-silenter text-[54px] mobilel:text-[60px] text-wine leading-none">
        Save our date
      </Reveal>

      <Reveal from="up" delay={0.15} as="p" className="font-lora text-[40px] text-foreground tracking-[5px] mt-5">
        {dateShort}
      </Reveal>

      <Reveal from="up" delay={0.25} as="p" className="font-lora text-[15px] mobilel:text-[16px] text-wine uppercase tracking-[3px] mt-2">
        {GROOM.shortName} &amp; {BRIDE.shortName}
      </Reveal>

      {/* Framed photo — thin hairline + white mat, like a mounted print */}
      <Reveal from="none" delay={0.4}>
        <div className="mx-auto mt-10 max-w-[320px] border border-foreground/25 p-2 bg-white shadow-card">
          <Image
            src="/images/couple-2/DSC01062.webp"
            alt={`${GROOM.fullName} & ${BRIDE.fullName}`}
            width={1400}
            height={2100}
            priority
            sizes="(max-width: 480px) 100vw, 320px"
            className="w-full h-[400px] mobilel:h-[430px] object-cover object-center"
            unoptimized
          />
        </div>
      </Reveal>

      <Reveal from="up" delay={0.5} as="p" className="font-lora text-[14px] text-foreground/80 uppercase tracking-[3px] mt-10">
        Trân trọng kính mời
      </Reveal>
    </section>
  );
}
