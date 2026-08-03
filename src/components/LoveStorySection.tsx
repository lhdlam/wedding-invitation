"use client";

import { Reveal } from "@/components/Reveal";
import { BRIDE, GROOM } from "@/data/invitation";

const PORTRAITS = [GROOM, BRIDE] as const;

interface LoveStorySectionProps {
  /** Opens the page-owned lightbox. Buttons stay focusable when omitted. */
  onPhotoClick?: (src: string, alt: string) => void;
}

export function LoveStorySection({ onPhotoClick }: LoveStorySectionProps) {
  return (
    <section className="relative px-4 py-16 mobilem:px-5 mobilel:px-6 mobilel:py-20 bg-white/60">
      <Reveal className="text-center">
        <p className="mb-3 text-[16px] mobilel:text-[18px] uppercase tracking-[4px] text-wine font-bold">
          The love story
        </p>
        <h2 className="font-silenter text-[56px] text-wine mt-1">and</h2>
      </Reveal>

      <Reveal
        as="p"
        delay={0.1}
        className="font-lora text-[18px] text-foreground/75 leading-7 italic text-center mt-2 px-2"
      >
        Tình yêu của anh và em là một hành trình kỳ diệu, vượt qua bao thử thách
        để cùng nhau bước đến ngày hôm nay - đám cưới của chúng mình.
      </Reveal>

      <div className="grid grid-cols-2 gap-4 mt-10">
        {PORTRAITS.map((portrait, index) => (
          <div key={portrait.photo} className="text-center">
            {/* Thin hairline frame + white mat, like a mounted print */}
            <div className="border border-foreground/25 bg-white p-1.5 shadow-card">
              <div className="aspect-[3/4] overflow-hidden">
                <button
                  type="button"
                  className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-wine focus-visible:ring-offset-2 ring-offset-background"
                  aria-label={`Xem ảnh ${portrait.role} lớn`}
                  onClick={() => onPhotoClick?.(portrait.photo, portrait.role)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={portrait.photo}
                    alt={portrait.role}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover ${portrait.photoObjectClass ?? ""}`}
                  />
                </button>
              </div>
            </div>
            <Reveal delay={index * 0.1}>
              <p className="text-[12px] uppercase tracking-[0.1em] text-gold font-bold mt-4">
                {portrait.role}
              </p>
              {/* Two line boxes are reserved because the bride's full name wraps
                  and the groom's does not; without it the two cards' rank lines
                  would sit at different heights. */}
              <p className="font-anisa text-wine text-[24px] mobilem:text-[25px] mobilel:text-[26px] leading-[1.15] min-h-[2.3em] text-balance pt-1">
                {portrait.fullName}
              </p>
              <p className="font-lora text-foreground/75 text-[13px] mobilem:text-[14px] mobilel:text-[15px]">
                {portrait.rank}
              </p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
