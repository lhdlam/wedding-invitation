"use client";

import { useCallback, useEffect, useState } from "react";

import { HEART_PATH } from "@/components/icons";
import { cn } from "@/lib/utils";

/* Opening sequence, all delays measured from the seal click:
   seal breaks + hearts burst → the triangular flap swings up → the card
   slides out of the envelope → the whole overlay dissolves into the page. */
const FLAP_DELAY_MS = 350;
const FLAP_MS = 800;
/* Past ~55% of the swing the flap has passed vertical, so it drops behind
   the card for the rest of the sequence. */
const FLAP_BEHIND_MS = FLAP_DELAY_MS + Math.round(FLAP_MS * 0.55);
/* The card's three-act journey (one keyframe animation): slide up out of the
   envelope → glide back to the centre of the screen → zoom up and dissolve. */
const CARD_DELAY_MS = 1200;
const CARD_JOURNEY_MS = 3000;
/* The envelope dissolves while the card hovers at the top of its arc, so the
   card returns to an empty centre instead of sliding back behind the pocket. */
const ENVELOPE_FADE_AT_MS = CARD_DELAY_MS + 1100;
const FADE_DELAY_MS = CARD_DELAY_MS + CARD_JOURNEY_MS - 500;
const FADE_MS = 600;
const UNMOUNT_MS = FADE_DELAY_MS + FADE_MS + 100;
const BURST_COUNT = 14;

interface BurstHeart {
  /** Flight vector, in px. */
  dx: number;
  dy: number;
  /** Final rotation, in degrees. */
  rot: number;
  size: number;
  delayMs: number;
  color: string;
}

/**
 * Built inside the click handler — never during render — so the randomness
 * cannot cause a hydration mismatch.
 */
function buildBurst(): BurstHeart[] {
  return Array.from({ length: BURST_COUNT }, (_, i) => {
    const angle =
      (i / BURST_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const distance = 70 + Math.random() * 90;
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance - 30,
      rot: (Math.random() - 0.5) * 240,
      size: 9 + Math.random() * 9,
      delayMs: Math.random() * 120,
      color: Math.random() < 0.6 ? "#a2262f" : "#cf7d84",
    };
  });
}

const COVER_STYLES = `
@keyframes cover-seal-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.07); }
}

@keyframes cover-cursor-tap {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-6px) scale(1.08); }
}

@keyframes cover-envelope-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes cover-heart-burst {
  0% { transform: translate(0, 0) scale(0.3) rotate(0deg); opacity: 0; }
  12% { opacity: 1; }
  100% { transform: translate(var(--dx), var(--dy)) scale(1) rotate(var(--rot)); opacity: 0; }
}

@keyframes cover-card-journey {
  0% { transform: translate(-50%, 0) scale(1); opacity: 1; }
  32% { transform: translate(-50%, -238px) scale(1); opacity: 1; }
  42% { transform: translate(-50%, -238px) scale(1.02); opacity: 1; }
  64% { transform: translate(-50%, 14px) scale(1.06); opacity: 1; }
  76% { opacity: 1; }
  100% { transform: translate(-50%, 30px) scale(1.9); opacity: 0; }
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

.cover-envelope-float {
  animation: cover-envelope-float 5s ease-in-out infinite;
}

.cover-heart-burst {
  animation: cover-heart-burst 1.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  will-change: transform, opacity;
}

.cover-card-journey {
  animation: cover-card-journey 3s cubic-bezier(0.45, 0, 0.25, 1) both;
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .cover-seal-breathe,
  .cover-cursor-tap,
  .cover-envelope-float,
  .cover-heart-burst,
  .cover-card-journey {
    animation: none;
  }
}
`;

export interface CoverOverlayProps {
  /** Name rendered on the envelope pocket. Default placeholder: "Bạn". */
  guestName: string;
  /** Short date on the sliding card, e.g. "19.09.26". */
  dateShort: string;
  /** Fired the moment the wax seal is clicked, so the page can unlock scroll + start audio. */
  onOpen: () => void;
}

/**
 * Opening cover: a miniature pearl envelope floating over the page. Clicking
 * the wax seal breaks it with a heart burst, the triangular flap swings open,
 * the "Save our date" card slides out, and the whole scene dissolves into
 * the invitation.
 */
export function CoverOverlay({ guestName, dateShort, onOpen }: CoverOverlayProps) {
  const [opening, setOpening] = useState(false);
  const [flapBehind, setFlapBehind] = useState(false);
  const [envelopeGone, setEnvelopeGone] = useState(false);
  const [gone, setGone] = useState(false);
  const [burst, setBurst] = useState<BurstHeart[]>([]);

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

    setBurst(buildBurst());
    setOpening(true);
  }, [onOpen, opening]);

  useEffect(() => {
    if (!opening) return;
    const behindTimer = window.setTimeout(
      () => setFlapBehind(true),
      FLAP_BEHIND_MS,
    );
    const envelopeTimer = window.setTimeout(
      () => setEnvelopeGone(true),
      ENVELOPE_FADE_AT_MS,
    );
    const goneTimer = window.setTimeout(() => setGone(true), UNMOUNT_MS);
    return () => {
      window.clearTimeout(behindTimer);
      window.clearTimeout(envelopeTimer);
      window.clearTimeout(goneTimer);
    };
  }, [opening]);

  if (gone) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] flex justify-center">
      <style>{COVER_STYLES}</style>
      <div
        className="pointer-events-auto relative h-[100dvh] w-full max-w-[480px] isolate bg-gradient-to-b from-[#fdfcfa] via-[#faf8f4] to-[#f2efe9]"
        style={{
          opacity: opening ? 0 : 1,
          transform: opening ? "scale(1.04)" : "scale(1)",
          transition: `opacity ${FADE_MS}ms ease ${FADE_DELAY_MS}ms, transform ${FADE_MS}ms ease ${FADE_DELAY_MS}ms`,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* ENVELOPE */}
          <div
            className={cn("relative", !opening && "cover-envelope-float")}
            style={{ perspective: "900px" }}
          >
            <div className="relative h-[248px] w-[330px]">
              {/* back panel */}
              <div
                className={cn(
                  "absolute inset-0 z-[10] rounded-[6px] border border-[#ddd8d0] bg-gradient-to-b from-[#f6f3ee] to-[#eeebe4] transition-opacity duration-500",
                  envelopeGone && "opacity-0",
                )}
              />

              {/* CARD — slides out, glides back to centre, zooms and dissolves */}
              <div
                className={cn(
                  "absolute left-1/2 top-[12px] h-[196px] w-[292px] border border-[#e2ded7] bg-white px-4 pt-6 text-center shadow-card",
                  opening && "cover-card-journey",
                )}
                style={{
                  zIndex: envelopeGone ? 45 : 20,
                  transform: "translate(-50%, 0)",
                  animationDelay: `${CARD_DELAY_MS}ms`,
                }}
              >
                <p className="font-silenter text-[34px] leading-none text-wine">
                  Save our date
                </p>
                <p className="font-lora text-[24px] tracking-[4px] text-foreground mt-3">
                  {dateShort}
                </p>
                <p className="font-lora text-[11px] uppercase tracking-[3px] text-wine mt-2">
                  Đăng Lâm &amp; Hoài Thương
                </p>
                <svg
                  viewBox="0 0 20 18"
                  width="14"
                  height="12.6"
                  className="mx-auto mt-3"
                  aria-hidden="true"
                >
                  <path d={HEART_PATH} fill="#a2262f" />
                </svg>
              </div>

              {/* front pocket */}
              <div
                className={cn(
                  "absolute inset-0 z-[30] rounded-[6px] border border-[#ddd8d0] bg-gradient-to-b from-[#fdfcfa] to-[#f3f0ea] shadow-[inset_0_-14px_24px_rgba(0,0,0,0.05)] transition-opacity duration-500",
                  envelopeGone && "opacity-0",
                )}
              >
                <div className="absolute inset-x-0 bottom-[14px] text-center">
                  <p className="font-lora text-[12px] uppercase tracking-[3px] text-foreground/70">
                    Thân mời:
                  </p>
                  <p className="font-anisa italic text-[32px] leading-[26px] text-wine mt-2">
                    {guestName}
                  </p>
                  <p className="mx-auto mt-2 w-[150px] border-t border-foreground/40" />
                </div>
              </div>

              {/* triangular flap */}
              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-[122px] border-t border-[#ddd8d0] bg-gradient-to-b from-[#faf8f4] to-[#e9e5dd] shadow-sm",
                  envelopeGone && "opacity-0",
                )}
                style={{
                  zIndex: flapBehind ? 15 : 40,
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  transformOrigin: "top center",
                  transform: opening ? "rotateX(-180deg)" : "rotateX(0deg)",
                  transition: `transform ${FLAP_MS}ms cubic-bezier(0.45, 0, 0.2, 1) ${FLAP_DELAY_MS}ms, opacity 500ms ease`,
                }}
              />

              {/* HEART BURST — anchored at the seal, above everything */}
              {burst.length > 0 ? (
                <div
                  className="pointer-events-none absolute left-1/2 top-[116px] z-[60] h-0 w-0"
                  aria-hidden="true"
                >
                  {burst.map((heart, index) => (
                    <svg
                      key={index}
                      viewBox="0 0 20 18"
                      width={heart.size}
                      height={(heart.size * 18) / 20}
                      className="cover-heart-burst absolute"
                      style={
                        {
                          "--dx": `${heart.dx}px`,
                          "--dy": `${heart.dy}px`,
                          "--rot": `${heart.rot}deg`,
                          animationDelay: `${heart.delayMs}ms`,
                        } as React.CSSProperties
                      }
                    >
                      <path d={HEART_PATH} fill={heart.color} />
                    </svg>
                  ))}
                </div>
              ) : null}

              {/* WAX SEAL — on the flap tip */}
              <button
                type="button"
                onClick={handleOpen}
                aria-label="Mở thiệp"
                className={cn(
                  "absolute left-1/2 top-[116px] z-[50] -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-[opacity,scale] duration-500",
                  opening && "pointer-events-none opacity-0 scale-125",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/wax-seal-red.webp"
                  alt=""
                  className="cover-seal-breathe w-[86px] object-contain drop-shadow-md"
                />
              </button>

              {/* tap cursor hint */}
              <button
                type="button"
                onClick={handleOpen}
                aria-label="Mở thiệp"
                className={cn(
                  "absolute left-[58%] top-[138px] z-[50] cursor-pointer opacity-80 transition-opacity duration-300",
                  opening && "pointer-events-none opacity-0",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/cursor.webp"
                  alt=""
                  className="cover-cursor-tap w-[64px] object-contain"
                />
              </button>
            </div>
          </div>

          <p
            className={cn(
              "mt-24 font-lora text-[12px] uppercase tracking-[3px] text-foreground/55 transition-opacity duration-300",
              opening && "opacity-0",
            )}
          >
            Chạm vào dấu sáp để mở thiệp
          </p>
        </div>
      </div>
    </div>
  );
}
