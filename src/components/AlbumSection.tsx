"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Reveal } from "@/components/Reveal";
import { PhotoLightbox, type LightboxPhoto } from "@/components/PhotoLightbox";
import type { AlbumPhoto } from "@/types/invitation";

const PHOTO_ALT = "Ảnh album";

/** Classes shared by every click-to-zoom photo button. */
const PHOTO_BUTTON_CLASS =
  "block w-full p-0 border-0 bg-transparent cursor-zoom-in focus:outline-none";

/* -------------------------------------------------------------------------- */
/* Local reveal helper                                                        */
/* -------------------------------------------------------------------------- */

type SlideTag = "div" | "h2" | "p" | "span";

interface SlideInProps {
  children?: ReactNode;
  /** Exact starting transform, e.g. `"translateX(-50px)"`. */
  from: string;
  delay?: number;
  duration?: number;
  className?: string;
  as?: SlideTag;
}

/**
 * Scroll-triggered reveal with an arbitrary starting transform.
 *
 * Mirrors `Reveal`'s observer settings and easing, but the target's title block
 * animates over 50 px / 20 px / 15 px distances that `Reveal`'s fixed 30 px
 * offsets cannot express, so those transforms are supplied verbatim here rather
 * than approximated.
 */
function SlideIn({
  children,
  from,
  delay = 0,
  duration = 0.7,
  className,
  as: Tag = "div",
}: SlideInProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* Reduced motion: reveal immediately, but schedule the state update rather
       than calling it synchronously inside the effect body. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }

    /* Re-triggers: on the target this whole title block re-hides when scrolled
       out of view and replays on re-entry (a bare framer-motion `whileInView`,
       i.e. without `once: true`). Verified against the live site. */
    const observer = new IntersectionObserver(
      ([entry]) => setShown(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : from,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* Photo data                                                                 */
/* -------------------------------------------------------------------------- */

/** Header stack: one wide hero above a two-up pair. */
const HEADER_HERO: AlbumPhoto = {
  src: "/images/album-2/DSC01008.webp",
  alt: PHOTO_ALT,
  heightClass: "h-[300px]",
  objectClass: "object-center",
};

const HEADER_PAIR: readonly AlbumPhoto[] = [
  {
    src: "/images/album-2/DSC00047.webp",
    alt: PHOTO_ALT,
    heightClass: "h-[165px]",
    objectClass: "object-[center_calc(50%+20px)]",
  },
  {
    src: "/images/album-2/DSC00111.webp",
    alt: PHOTO_ALT,
    heightClass: "h-[165px]",
    objectClass: "object-[center_calc(50%+10px)]",
  },
];

/* -------------------------------------------------------------------------- */
/* Photo button                                                               */
/* -------------------------------------------------------------------------- */

interface PhotoButtonProps {
  src: string;
  /** Complete class attribute for the `<img>`, copied verbatim per photo. */
  imgClassName: string;
  onOpen: (src: string, alt: string) => void;
}

function PhotoButton({ src, imgClassName, onOpen }: PhotoButtonProps) {
  return (
    <button
      type="button"
      aria-label={`Xem ảnh: ${PHOTO_ALT}`}
      onClick={() => onOpen(src, PHOTO_ALT)}
      className={PHOTO_BUTTON_CLASS}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={PHOTO_ALT} loading="lazy" className={imgClassName} />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                    */
/* -------------------------------------------------------------------------- */

interface AlbumSectionProps {
  /**
   * Optional override so the page can route zooms through a single shared
   * lightbox. When supplied, the section's own lightbox stays closed.
   */
  onPhotoClick?: (src: string, alt: string) => void;
}

/**
 * Album section: a three-photo header stack, the centred title block, and a
 * sixteen-photo twelve-column mosaic. Every photo opens in a lightbox.
 */
export function AlbumSection({ onPhotoClick }: AlbumSectionProps) {
  const [lightboxPhoto, setLightboxPhoto] = useState<LightboxPhoto | null>(
    null,
  );

  const openPhoto = useCallback(
    (src: string, alt: string) => {
      if (onPhotoClick) {
        onPhotoClick(src, alt);
        return;
      }
      setLightboxPhoto({ src, alt });
    },
    [onPhotoClick],
  );

  const closePhoto = useCallback(() => setLightboxPhoto(null), []);

  return (
    <section className="px-4 pt-16 mobilel:px-6 mobilel:pt-20 bg-white/60 pb-16">
      {/* Part 1 — header stack */}
      <div className="space-y-2">
        <div className="overflow-hidden rounded-sm">
          <PhotoButton
            src={HEADER_HERO.src}
            imgClassName={`${HEADER_HERO.heightClass} w-full object-cover ${HEADER_HERO.objectClass}`}
            onOpen={openPhoto}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {HEADER_PAIR.map((photo) => (
            <PhotoButton
              key={photo.src}
              src={photo.src}
              imgClassName={`${photo.heightClass} w-full rounded-sm object-cover ${photo.objectClass}`}
              onOpen={openPhoto}
            />
          ))}
        </div>
      </div>

      {/* Part 2 — title block */}
      <div className="relative overflow-hidden py-14 text-center">
        <p className="mb-3 text-[16px] mobilel:text-[18px] uppercase tracking-[4px] text-wine font-bold">
          Album Ảnh
        </p>

        <SlideIn
          as="h2"
          from="translateX(-50px)"
          className="text-[30px] mobilem:text-[32px] mobilel:text-[36px] sm:text-[40px] font-light uppercase tracking-[5px] text-foreground"
        >
          Khoảnh Khắc
        </SlideIn>

        <SlideIn
          as="p"
          from="translateX(50px)"
          delay={0.1}
          className="mt-1 text-[45px] mobilem:text-[50px] leading-none text-wine font-anisa"
        >
          Của Chúng Tôi
        </SlideIn>

        <div className="my-4 flex items-center justify-center gap-3">
          <SlideIn
            from="translateX(-15px)"
            delay={0.15}
            className="h-px w-10 bg-gold/40"
          />
          <SlideIn
            as="span"
            from="translateY(-20px)"
            delay={0.2}
            className="text-wine"
          >
            ♥
          </SlideIn>
          <SlideIn
            from="translateX(15px)"
            delay={0.25}
            className="h-px w-10 bg-gold/40"
          />
        </div>

        <Reveal
          as="p"
          from="down"
          delay={0.3}
          className="text-[12px] uppercase tracking-[1px] sm:tracking-[2px] text-muted-foreground font-bold"
        >
          Lưu giữ những điều đẹp nhất của chúng ta
        </Reveal>
      </div>

      {/* Part 3 — twelve-column mosaic */}
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-7 flex flex-col gap-2">
          <PhotoButton
            src="/images/album-2/DSC01048.webp"
            imgClassName="h-[330px] w-full rounded-sm object-cover"
            onOpen={openPhoto}
          />
        </div>

        <div className="col-span-5 flex flex-col gap-2">
          <PhotoButton
            src="/images/album-2/DSC00207.webp"
            imgClassName="h-[200px] w-full rounded-sm object-cover object-[center_calc(50%+15px)]"
            onOpen={openPhoto}
          />
          <PhotoButton
            src="/images/album-2/DSC00957.webp"
            imgClassName="h-[120px] w-full rounded-sm object-cover object-center"
            onOpen={openPhoto}
          />
        </div>

        <div className="col-span-12 mobilel:col-span-9 flex flex-col gap-2">
          <PhotoButton
            src="/images/album-2/DSC00878.webp"
            imgClassName="h-[140px] w-full rounded-sm object-cover object-center"
            onOpen={openPhoto}
          />
          <div className="grid grid-cols-2 gap-2">
            <PhotoButton
              src="/images/album-2/DSC00143.webp"
              imgClassName="h-[140px] w-full rounded-sm object-cover object-center"
              onOpen={openPhoto}
            />
            <PhotoButton
              src="/images/album-2/DSC00188.webp"
              imgClassName="h-[140px] w-full rounded-sm object-cover object-center"
              onOpen={openPhoto}
            />
          </div>
        </div>

        <div className="col-span-12 mobilel:col-span-3 flex flex-col gap-2">
          <PhotoButton
            src="/images/album-2/DSC00927.webp"
            imgClassName="h-[200px] mobilel:h-[288px] w-full rounded-sm object-cover object-center"
            onOpen={openPhoto}
          />
        </div>

        <div className="col-span-12 flex flex-col gap-2">
          <PhotoButton
            src="/images/album-2/DSC01174.webp"
            imgClassName="h-[200px] w-full rounded-sm object-cover object-center"
            onOpen={openPhoto}
          />
        </div>

        {/* Second half — the same two blocks mirrored, so the wide photo and the
            tall column swap sides instead of repeating the first half's rhythm. */}
        <div className="col-span-5 flex flex-col gap-2">
          <PhotoButton
            src="/images/album-2/DSC00783.webp"
            imgClassName="h-[120px] w-full rounded-sm object-cover object-center"
            onOpen={openPhoto}
          />
          <PhotoButton
            src="/images/album-2/DSC01120.webp"
            imgClassName="h-[200px] w-full rounded-sm object-cover object-center"
            onOpen={openPhoto}
          />
        </div>

        <div className="col-span-7 flex flex-col gap-2">
          <PhotoButton
            src="/images/album-2/DSC09947.webp"
            imgClassName="h-[330px] w-full rounded-sm object-cover object-center"
            onOpen={openPhoto}
          />
        </div>

        <div className="col-span-12 mobilel:col-span-3 flex flex-col gap-2">
          <PhotoButton
            src="/images/album-2/DSC01052.webp"
            imgClassName="h-[200px] mobilel:h-[288px] w-full rounded-sm object-cover object-center"
            onOpen={openPhoto}
          />
        </div>

        <div className="col-span-12 mobilel:col-span-9 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <PhotoButton
              src="/images/album-2/DSC00083.webp"
              imgClassName="h-[140px] w-full rounded-sm object-cover object-center"
              onOpen={openPhoto}
            />
            <PhotoButton
              src="/images/album-2/DSC01158.webp"
              imgClassName="h-[140px] w-full rounded-sm object-cover object-[center_calc(50%+30px)]"
              onOpen={openPhoto}
            />
          </div>
          <PhotoButton
            src="/images/album-2/DSC00838.webp"
            imgClassName="h-[140px] w-full rounded-sm object-cover object-[center_calc(50%-60px)]"
            onOpen={openPhoto}
          />
        </div>

        <div className="col-span-12 flex flex-col gap-2">
          <PhotoButton
            src="/images/album-2/DSC00761.webp"
            imgClassName="h-[200px] w-full rounded-sm object-cover object-center"
            onOpen={openPhoto}
          />
        </div>
      </div>

      <PhotoLightbox photo={lightboxPhoto} onClose={closePhoto} />
    </section>
  );
}
