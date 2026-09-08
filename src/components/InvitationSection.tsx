"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import type { Venue, WeddingDate } from "@/types/invitation";

interface InvitationSectionProps {
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
        "mobilel:px-6 mobilel:pb-12 relative px-4 pt-3 pb-10",
        className,
      )}
    >
      <div className="mx-auto max-w-[400px] border border-foreground/20 bg-[#fbf8f1]/85 shadow-card">
        <div className="flex">
          {/* Left — invitation copy */}
          <div className="flex-1 px-5 mobilem:px-6 py-10 text-left">
            <p className="font-lora text-[15px] text-foreground/85 leading-relaxed">
              Địa điểm tổ chức tiệc cưới
            </p>
            <a
              href={venue.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-anisa text-[38px] text-wine leading-[36px] mt-1"
            >
              {venue.name.replace("Nhà hàng tiệc cưới ", "")}
            </a>
            {/* "Tỉnh …" never splits mid-way: the province wraps as one unit. */}
            <p className="font-lora italic text-[12.5px] text-muted-foreground mt-2 leading-relaxed">
              {venue.address.includes(", Tỉnh ") ? (
                <>
                  {venue.address.split(", Tỉnh ")[0]},{" "}
                  <span className="whitespace-nowrap">
                    Tỉnh {venue.address.split(", Tỉnh ")[1]}
                  </span>
                </>
              ) : (
                venue.address
              )}
            </p>

            <p className="font-lora text-[14px] text-foreground/85 mt-5">
              Vào lúc: {weekday}
            </p>
            <p className="font-lora text-[19px] text-wine font-bold tracking-[2px] mt-1">
              {time} | {dateLabel}
            </p>
            {/* Keep "năm Bính Ngọ" together so the year name never orphans. */}
            <p className="font-lora italic text-[12.5px] text-muted-foreground mt-1">
              {date.lunarNote
                .replace("(Tức", "Nhằm")
                .replace(")", "")
                .replace(/ năm .+$/, "")}{" "}
              <span className="whitespace-nowrap">
                {date.lunarNote.match(/năm .+(?=\))/)?.[0] ?? ""}
              </span>
            </p>

            <p className="font-lora italic text-[13px] text-foreground/75 mt-6 leading-relaxed">
              Sự hiện diện của Quý vị là niềm vinh hạnh cho gia đình chúng tôi.
              <br />
              Rất hân hạnh được đón tiếp!
            </p>
          </div>

          {/* Right — giant stacked numerals, the suite's signature motif */}
          <div className="flex flex-col items-center justify-center gap-3 pr-4 mobilem:pr-5 py-10">
            {numerals.map((value, index) => (
              <Reveal
                key={`${value}-${index}`}
                as="p"
                from="right"
                delay={index * 0.12}
                className="font-lora text-[78px] mobilel:text-[88px] leading-[0.9] text-wine"
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
          {/* Directions go through the venue's own Maps listing, not the raw pin */}
          <a
            href={venue.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-wine bg-[#fbf8f1] py-3 font-lora text-[13px] uppercase tracking-[2px] text-wine transition-colors hover:bg-wine/10"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Chỉ đường tới nhà hàng
          </a>
        </div>
      </div>
    </section>
  );
}
