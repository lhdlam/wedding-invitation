"use client";

import { useEffect, useState } from "react";

/** Duration of the overlay fade, in milliseconds. */
const FADE_MS = 250;

export interface LightboxPhoto {
  src: string;
  alt: string;
}

interface PhotoLightboxProps {
  photo: LightboxPhoto | null;
  onClose: () => void;
}

/**
 * Full-screen photo viewer shared by `AlbumSection` and `LoveStorySection`.
 *
 * Closes on the close button, a backdrop click, or `Escape`; locks body scroll
 * while open and restores the previous value on close. The photo is retained
 * for the length of the fade-out so the exit transition can play, after which
 * the component renders `null`.
 */
export function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  const [rendered, setRendered] = useState<LightboxPhoto | null>(photo);
  const [visible, setVisible] = useState(false);

  // Swap in the incoming photo and fade up, or fade down and unmount.
  useEffect(() => {
    if (photo) {
      /* Mount on one frame, then flip to visible on the next so the CSS
         transition has two distinct states to animate between. Scheduling
         both keeps setState out of the effect body. */
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        setRendered(photo);
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
  }, [photo]);

  // Escape closes.
  useEffect(() => {
    if (!photo) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [photo, onClose]);

  // Body scroll lock. Keyed on the boolean so swapping photos while open does
  // not capture "hidden" as the value to restore.
  const isOpen = rendered !== null;
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!rendered) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={rendered.alt}
      onClick={onClose}
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

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={rendered.src}
        alt={rendered.alt}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] max-w-[92vw] object-contain"
      />
    </div>
  );
}
