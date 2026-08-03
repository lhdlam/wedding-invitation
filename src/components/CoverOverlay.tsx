"use client";

import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/* The flip + unmount timings from the spec (1.1s flip, 0.3s seal fade). */
const FLIP_MS = 1100;
const UNMOUNT_MS = 1250;

const COVER_STYLES = `
@keyframes cover-seal-breathe {
  0%, 100% { transform: scale(1) rotate(42deg); }
  50% { transform: scale(1.06) rotate(46deg); }
}

@keyframes cover-cursor-tap {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-6px) scale(1.08); }
}

.cover-seal-breathe {
  animation: cover-seal-breathe 2.5s ease-in-out infinite;
  transform-origin: center;
  will-change: transform;
}

.cover-cursor-tap {
  animation: cover-cursor-tap 1.5s ease-in-out infinite;
  transform-origin: center;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .cover-seal-breathe,
  .cover-cursor-tap {
    animation: none;
  }
}
`;

export interface CoverOverlayProps {
  /** Name rendered on the invitation flap. Default placeholder: "Bạn". */
  guestName: string;
  /** Short date on the envelope front, e.g. "19.09.26". */
  dateShort: string;
  /** Fired the moment the wax seal is clicked, so the page can unlock scroll + start audio. */
  onOpen: () => void;
}

export function CoverOverlay({ guestName, dateShort, onOpen }: CoverOverlayProps) {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);

  const handleOpen = useCallback(() => {
    if (opening) return;
    onOpen();

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setGone(true);
      return;
    }

    setOpening(true);
  }, [onOpen, opening]);

  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(() => setGone(true), UNMOUNT_MS);
    return () => window.clearTimeout(timer);
  }, [opening]);

  if (gone) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] flex justify-center">
      <style>{COVER_STYLES}</style>
      <div className="pointer-events-auto relative h-[100dvh] w-full max-w-[480px]">
        <div className="absolute inset-0 z-[100] isolate">
          <div
            className="absolute inset-0 z-0 flex w-full"
            aria-hidden="true"
            style={{ perspective: "1600px" }}
          >
            {/* LEFT FLAP — pearl-white paper, like the printed envelope front */}
            <div
              className="relative z-0 h-full min-h-0 flex-[8] origin-left bg-gradient-to-br from-white via-[#fbfaf7] to-[#efece6] shadow-[inset_-10px_0_24px_rgba(0,0,0,0.06)] border-r border-[#e2ded7] pt-14"
              style={{
                transform: opening ? "rotateY(-170deg)" : "rotateY(0deg)",
                transition: `transform ${FLIP_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
                backfaceVisibility: "hidden",
              }}
            >
              <p className="font-silenter text-[44px] text-wine text-center leading-none px-2">
                Save our date
              </p>
              <p className="font-lora text-[34px] text-foreground text-center tracking-[4px] mt-4">
                {dateShort}
              </p>
              <p className="font-lora text-[13px] text-wine text-center uppercase tracking-[3px] mt-2">
                Đăng Lâm &amp; Hoài Thương
              </p>
              <p className="font-lora text-[15px] text-foreground/80 uppercase tracking-[2px] mt-10 text-center">
                Trân trọng kính mời:
              </p>
              <div className="mt-4 ml-[20px] mr-[20px]">
                <p className="font-anisa italic text-[44px] text-wine text-center leading-[34px] mb-2 relative">
                  {guestName}
                </p>
                <p className="border-t border-foreground/50 w-[200px] mx-auto" />
              </div>
            </div>

            {/* RIGHT FLAP */}
            <div
              className="relative z-0 h-full min-h-0 flex-[4] origin-right bg-gradient-to-bl from-[#fcfbf9] via-[#f3f1ec] to-[#e6e2da] shadow-[inset_12px_0_32px_rgba(0,0,0,0.07)]"
              style={{
                transform: opening ? "rotateY(170deg)" : "rotateY(0deg)",
                transition: `transform ${FLIP_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
                backfaceVisibility: "hidden",
              }}
            />
          </div>

          {/* SEAL CLUSTER */}
          <div
            className={cn(
              "absolute left-[65%] top-1/2 z-10 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300",
              opening && "pointer-events-none opacity-0",
            )}
          >
            {/* No -translate-*-1/2 here: an inline `transform` from the original
                site's framer-motion overrides the Tailwind translate utilities,
                so the seal renders 50px down-right of where the classes alone
                would place it. Matched deliberately. */}
            <button
              type="button"
              onClick={handleOpen}
              className="absolute left-[33%] top-[33%] z-10 cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/wax-seal-red.webp"
                alt="Open invitation"
                className="cover-seal-breathe w-[100px] object-contain drop-shadow-md"
              />
            </button>
            {/* Same as the seal: the target's inline `transform: none` from
                framer-motion cancels the translate utilities here too. */}
            <button
              type="button"
              onClick={handleOpen}
              className="absolute left-[48%] top-[43%] z-10 cursor-pointer opacity-80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/cursor.webp"
                alt="Open invitation"
                className="cover-cursor-tap w-[80px] object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
