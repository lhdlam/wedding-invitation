"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import type { Venue, WeddingDate } from "@/types/invitation";

interface InvitationSectionProps {
  /** Guest name placeholder rendered in the script face. */
  guestName?: string;
  /** Rendered inside the reception lines, e.g. "11:00, Thứ Bảy". */
  receptionTime: string;
  /** Compact reception date, e.g. "19.09.2026". */
  dateLabel: string;
  date: WeddingDate;
  venue: Venue;
  className?: string;
}

/**
 * Mirror of the printed "ruột mời" card: left-aligned invitation copy with
 * the venue name in crimson script, and the giant stacked crimson numerals
 * (day / month / year) running down the right edge. The venue map sits
 * below inside the same card.
 */
export function InvitationSection({
  guestName = "Bạn",
  receptionTime,
  dateLabel,
  date,
  venue,
  className,
}: InvitationSectionProps) {
  const [mapActive, setMapActive] = useState(false);

  /* "11:00, Thứ Bảy" → time + weekday for the printed card's split lines. */
  const [time, weekday] = receptionTime.split(", ");
  /* "19.09.2026" → the three stacked numerals: 19 / 09 / 26. */
  const [day, month, year] = dateLabel.split(".");
  const numerals = [day, month, year.slice(2)];

  /* Place-name query rather than coordinates: the embed resolves it
     server-side, so no API key is needed. */
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    venue.mapQuery,
  )}&output=embed`;

  return (
    <section
      className={cn(
        "mobilel:px-6 mobilel:py-20 relative px-4 py-16",
        className,
      )}
    >
      <div className="mx-auto max-w-[400px] border border-foreground/20 bg-white/80 shadow-card">
        <div className="flex">
          {/* Left — invitation copy */}
          <div className="flex-1 px-5 mobilem:px-6 py-10 text-left">
            <p className="font-lora text-[15px] text-foreground/85">
              Trân trọng kính mời
            </p>
            <div className="mt-3 max-w-[210px]">
              <Reveal
                as="p"
                from="down"
                distance={20}
                once={false}
                className="font-anisa italic text-[40px] text-wine leading-[30px] mb-2"
              >
                {guestName}
              </Reveal>
              <ScaleXRule />
            </div>

            <p className="font-lora text-[14px] mobilel:text-[15px] text-foreground/85 mt-6 leading-relaxed">
              đến dự buổi tiệc chung vui cùng gia đình chúng tôi
            </p>

            <p className="font-lora text-[14px] text-foreground/85 mt-5">
              Tại nhà hàng tiệc cưới
            </p>
            <p className="font-anisa text-[38px] text-wine leading-[36px] mt-1">
              {venue.name.replace("Nhà hàng tiệc cưới ", "")}
            </p>
            <p className="font-lora italic text-[12.5px] text-muted-foreground mt-2 leading-relaxed">
              {venue.address}
            </p>

            <p className="font-lora text-[14px] text-foreground/85 mt-5">
              Vào lúc: {weekday}
            </p>
            <p className="font-lora text-[19px] text-wine font-bold tracking-[2px] mt-1">
              {time} | {dateLabel}
            </p>
            <p className="font-lora italic text-[12.5px] text-muted-foreground mt-1">
              {date.lunarNote.replace("(Tức", "Nhằm").replace(")", "")}
            </p>

            <p className="font-lora italic text-[13px] text-foreground/75 mt-6 leading-relaxed">
              Sự hiện diện của Quý vị là niềm vinh hạnh cho gia đình chúng tôi.
              <br />
              Rất hân hạnh được đón tiếp!
            </p>
          </div>

          {/* Right — giant stacked numerals, the suite's signature motif */}
          <div className="flex flex-col items-center justify-center gap-4 pr-4 mobilem:pr-5 py-10">
            {numerals.map((value, index) => (
              <Reveal
                key={`${value}-${index}`}
                as="p"
                from="right"
                delay={index * 0.12}
                className="font-lora text-[64px] mobilel:text-[72px] leading-[0.9] text-wine"
              >
                {value}
              </Reveal>
            ))}
          </div>
        </div>

        {/* Map, inside the same card */}
        <div className="px-5 mobilem:px-6 pb-8">
          <div className="relative rounded-sm overflow-hidden border border-foreground/15">
            <button
              type="button"
              onClick={() => setMapActive(true)}
              aria-label="Kích hoạt bản đồ"
              className={cn(
                "absolute inset-0 z-10 flex items-center justify-center bg-black/35 text-white text-sm px-4 text-center transition-opacity duration-300",
                mapActive && "opacity-0 pointer-events-none",
              )}
            >
              Chạm để xem bản đồ
            </button>
            <iframe
              title="Wedding venue map"
              src={mapSrc}
              className="w-full h-52 border-0"
              loading="lazy"
              style={{ pointerEvents: mapActive ? "auto" : "none" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The rule beneath the guest name. It draws itself outward from the centre
 * (`scaleX(0)` → `scaleX(1)`), which `Reveal` cannot express, so it carries
 * its own observer.
 */
function ScaleXRule() {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* Re-triggers: collapses back to scaleX(0) out of view, redraws on re-entry. */
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
      className={cn(
        "border-t border-foreground/50 w-full will-change-transform",
        "origin-center transition-transform duration-700 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "motion-reduce:transition-none motion-reduce:scale-x-100",
        shown ? "scale-x-100" : "scale-x-0",
      )}
    />
  );
}
