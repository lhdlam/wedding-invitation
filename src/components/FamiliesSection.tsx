"use client";

import { Reveal } from "@/components/Reveal";
import { coupleFor, familiesFor } from "@/data/invitation";
import { cn } from "@/lib/utils";
import type { FamilySide, SideKey, WeddingDate } from "@/types/invitation";

interface FamiliesSectionProps {
  /** Hosting side — its family and its child are named first. */
  side: SideKey;
  families?: readonly FamilySide[];
  /** Rendered bold inside the ceremony line, e.g. "9:00, Thứ Bảy". */
  ceremonyTime: string;
  date: WeddingDate;
  className?: string;
}

/**
 * Mirror of the printed "ruột báo tin" card: the two families in two columns,
 * the announcement lines in tracked serif caps, the couple's full names in
 * crimson script with their ranks between, then the ceremony line and date.
 */
export function FamiliesSection({
  side,
  families,
  ceremonyTime,
  date,
  className,
}: FamiliesSectionProps) {
  const [hostSide, guestSide] = families ?? familiesFor(side);
  const [first, second] = coupleFor(side);
  const dateShort = `${date.day}.${date.monthLabel.replace("tháng ", "")}.26`;

  return (
    <div
      className={cn(
        "relative px-4 pt-10 pb-3 mobilem:px-5 mobilel:px-6 mobilel:pt-12",
        className,
      )}
    >
      <div className="mx-auto max-w-[400px] border border-foreground/20 bg-[#fbf8f1]/85 px-4 mobilem:px-5 py-10 text-center shadow-card">
        <div className="flex justify-between items-start gap-2 sm:gap-4">
          {hostSide ? <FamilyColumn side={hostSide} delay={0} /> : null}
          {guestSide ? <FamilyColumn side={guestSide} delay={0.1} /> : null}
        </div>

        <p className="font-lora text-[14px] mobilel:text-[15px] text-foreground/85 uppercase tracking-[2px] mt-10 leading-relaxed">
          Trân trọng báo tin
          <br />
          {side === "gai" ? "Lễ Vu Quy" : "Lễ Thành Hôn"}
        </p>

        <div className="mt-8">
          <Reveal as="p" from="up" className="font-anisa text-[44px] mobilel:text-[48px] text-wine leading-[44px]">
            {first.fullName}
          </Reveal>
          <Reveal from="none" delay={0.1} className="my-3 flex items-center justify-center gap-3">
            <span className="font-lora text-[13px] uppercase tracking-[2px] text-foreground/70">
              {first.rank}
            </span>
            <span className="font-anisa text-[26px] text-wine leading-none">&amp;</span>
            <span className="font-lora text-[13px] uppercase tracking-[2px] text-foreground/70">
              {second.rank}
            </span>
          </Reveal>
          <Reveal as="p" from="up" delay={0.2} className="font-anisa text-[44px] mobilel:text-[48px] text-wine leading-[44px]">
            {second.fullName}
          </Reveal>
        </div>

        <p className="font-lora text-[14px] mobilel:text-[15px] text-foreground/85 mt-10 leading-relaxed">
          Hôn lễ được tổ chức tại tư gia
          <br />
          vào lúc <span className="font-bold">{ceremonyTime}</span>
        </p>
        <p className="font-lora text-[26px] text-wine tracking-[6px] mt-3">
          {dateShort}
        </p>
        <p className="font-lora italic text-[13px] text-muted-foreground mt-2">
          {date.lunarNote.replace("(", "Nhằm ").replace("Tức ", "").replace(")", "")}
        </p>
      </div>
    </div>
  );
}

interface FamilyColumnProps {
  side: FamilySide;
  delay: number;
}

function FamilyColumn({ side, delay }: FamilyColumnProps) {
  return (
    <Reveal from="up" delay={delay} className="flex-1 space-y-1">
      <p className="font-lora text-[13px] mobilel:text-[14px] text-foreground/80">
        {side.label}
      </p>
      {/* Fixed two-line box on both columns so the address rows align; a
          single parent name centres within it. */}
      <div className="flex min-h-[46px] flex-col justify-center gap-1">
        <p className="font-lora text-foreground font-bold uppercase whitespace-nowrap text-[11.5px] mobilem:text-[12.5px] mobilel:text-[13px]">
          {side.father.replace("Ông. ", "Ông ")}
        </p>
        {side.mother ? (
          <p className="font-lora text-foreground font-bold uppercase whitespace-nowrap text-[11.5px] mobilem:text-[12.5px] mobilel:text-[13px]">
            {side.mother.replace("Bà. ", "Bà ")}
          </p>
        ) : null}
      </div>
      <p className="font-lora italic text-[10px] mobilem:text-[11px] mobilel:text-xs text-muted-foreground pt-1">
        {side.address[0]}
        <br />
        {side.address[1]}
      </p>
    </Reveal>
  );
}
