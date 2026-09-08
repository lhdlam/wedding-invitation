"use client";

import { useEffect, useRef, useState } from "react";

/** Duration of the overlay fade, in milliseconds. */
const FADE_MS = 250;
/** Minimum horizontal swipe distance, in px, to change photo. */
const SWIPE_PX = 40;

export interface LightboxPhoto {
  src: string;
  alt: string;
}

interface PhotoLightboxProps {
  photos: readonly LightboxPhoto[];
  /** Index of the open photo, or null while closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Full-screen gallery viewer: swipe left/right (or arrow keys / chevrons) to
 * move through the album without closing, with a position counter. Closes on
 * the close button, a backdrop click, or `Escape`; locks body scroll while
 * open and keeps the last photo through the fade-out.
 */
export function PhotoLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const [rendered, setRendered] = useState<number | null>(index);
  const [visible, setVisible] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Swap in the incoming photo and fade up, or fade down and unmount.
  useEffect(() => {
    if (index !== null) {
      /* Mount on one frame, then flip to visible on the next so the CSS
         transition has two distinct states to animate between. */
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        setRendered(index);
        inner = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }

    const frame = requestAnimationFrame(() => setVisible(false));
    const timer = window.setTimeout(() => setRendered(null), FADE_MS);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [index]);

  // Escape closes; arrows navigate (wrapping at both ends).
  useEffect(() => {
    if (index === null) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate((index + 1) % photos.length);
      if (event.key === "ArrowLeft")
        onNavigate((index - 1 + photos.length) % photos.length);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, photos.length, onClose, onNavigate]);

  // Body scroll lock, keyed on the boolean so photo swaps don't recapture it.
  const isOpen = rendered !== null;
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (rendered === null) return null;

  const photo = photos[rendered];
  if (!photo) return null;

  const navigate = (step: number) => {
    if (index === null) return;
    onNavigate((index + step + photos.length) % photos.length);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={onClose}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const startX = touchStartX.current;
        touchStartX.current = null;
        const endX = event.changedTouches[0]?.clientX;
        if (startX === null || endX === undefined) return;
        const delta = endX - startX;
        if (Math.abs(delta) < SWIPE_PX) return;
        navigate(delta < 0 ? 1 : -1);
      }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease`,
      }}
    >
      <button
        type="button"
        aria-label="Đóng ảnh"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Ảnh trước"
        onClick={(event) => {
          event.stopPropagation();
          navigate(-1);
        }}
        className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Ảnh sau"
        onClick={(event) => {
          event.stopPropagation();
          navigate(1);
        }}
        className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.alt}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[86vh] max-w-[92vw] object-contain"
      />

      <p className="absolute bottom-5 inset-x-0 text-center font-lora text-[13px] tracking-[2px] text-white/80">
        {rendered + 1} / {photos.length}
      </p>
    </div>
  );
}
