"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { PhotoLightbox, type LightboxPhoto } from "@/components/PhotoLightbox";
import { Reveal } from "@/components/Reveal";

/* -------------------------------------------------------------------------- */
/* Gallery data — every album photo in narrative order                        */
/* -------------------------------------------------------------------------- */

const src = (name: string) => `/images/album-2/${name}.webp`;

/** Studio whites → sea & rocks → the closing frames (the couple's cut of 26). */
export const ALL_PHOTOS: readonly LightboxPhoto[] = [
  "DSC00111",
  "DSC09942",
  "DSC09992",
  "DSC00188",
  "DSC00927",
  "DSC01008",
  "DSC01048",
  "DSC01052",
  "DSC01202",
  "DSC01329",
  "DSC01344",
  "DSC01470",
  "DSC01485",
  "DSC01504",
  "DSC01515",
  "DSC01525",
  "DSC00969",
  "DSC01625",
  "voan1",
  "voan2",
].map((name) => ({ src: src(name), alt: "Ảnh cưới" }));

/** Index into ALL_PHOTOS by file name, for readable layout definitions. */
const idx = (name: string) =>
  ALL_PHOTOS.findIndex((p) => p.src === src(name));

/* -------------------------------------------------------------------------- */
/* Scroll reveal                                                              */
/* -------------------------------------------------------------------------- */

interface PhotoRevealProps {
  children: ReactNode;
  /** Seconds of stagger before the rise starts. */
  delay?: number;
  className?: string;
}

/** One-shot fade + rise as the photo scrolls into view. */
function PhotoReveal({ children, delay = 0, className }: PhotoRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(24px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Building blocks                                                            */
/* -------------------------------------------------------------------------- */

interface PhotoProps {
  photoIndex: number;
  imgClassName: string;
  onOpen: (index: number) => void;
}

function Photo({ photoIndex, imgClassName, onOpen }: PhotoProps) {
  const photo = ALL_PHOTOS[photoIndex];
  if (!photo) return null;
  return (
    <button
      type="button"
      aria-label="Xem ảnh lớn"
      onClick={() => onOpen(photoIndex)}
      className="block w-full p-0 border-0 bg-transparent cursor-zoom-in focus:outline-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className={imgClassName}
      />
    </button>
  );
}

type OnOpen = (index: number) => void;

/* Every frame renders at the photo's NATIVE ratio (`h-auto`) — nothing is
   ever cropped, so the couple can never be cut out of a preview. Rhythm
   comes from mixing full-width frames, two-up pairs and the landscape
   breathers instead of from crop heights. */

/** Full-width frame at native ratio. */
function Wide({ name, onOpen }: { name: string; onOpen: OnOpen }) {
  return (
    <PhotoReveal className="mt-2">
      <Photo
        photoIndex={idx(name)}
        imgClassName="w-full h-auto rounded-sm"
        onOpen={onOpen}
      />
    </PhotoReveal>
  );
}

/** Two-up row at native ratio with staggered reveals. */
function Pair({
  left,
  right,
  leftImgClass = "w-full h-auto rounded-sm",
  rightImgClass = "w-full h-auto rounded-sm",
  onOpen,
}: {
  left: string;
  right: string;
  /** Override when the two frames' native ratios differ and must be evened. */
  leftImgClass?: string;
  rightImgClass?: string;
  onOpen: OnOpen;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-2 items-start">
      <PhotoReveal delay={0.08}>
        <Photo
          photoIndex={idx(left)}
          imgClassName={leftImgClass}
          onOpen={onOpen}
        />
      </PhotoReveal>
      <PhotoReveal delay={0.16}>
        <Photo
          photoIndex={idx(right)}
          imgClassName={rightImgClass}
          onOpen={onOpen}
        />
      </PhotoReveal>
    </div>
  );
}

function ChapterHeader({
  number,
  title,
  quote,
}: {
  number: string;
  title: string;
  quote: string;
}) {
  return (
    <div className="text-center pt-8 pb-5">
      <p className="font-anisa text-[34px] text-wine leading-tight mt-1">
        {title}
      </p>
      <p className="font-lora italic text-[14px] text-muted-foreground mt-1">
        {quote}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Album as a two-chapter story — the white studio, then sea & rocks —
 * every photo rising into view on scroll and opening a shared swipeable
 * gallery lightbox.
 */
export function AlbumShowcase() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-4 pt-10 mobilel:px-6 mobilel:pt-12 bg-[#fbf8f1]/65 pb-12">
      {/* Title block */}
      <div className="relative overflow-hidden pb-2 text-center">
        <Reveal
          from="right"
          distance={50}
          once={false}
          as="p"
          className="text-[30px] mobilem:text-[32px] mobilel:text-[36px] sm:text-[40px] font-light uppercase tracking-[5px] text-foreground font-lora"
        >
          Khoảnh Khắc
        </Reveal>
        <Reveal
          from="left"
          distance={50}
          delay={0.1}
          once={false}
          as="p"
          className="mt-1 text-[45px] mobilem:text-[50px] leading-none text-wine font-anisa"
        >
          Của Chúng Tôi
        </Reveal>
        <div className="my-4 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gold/40" />
          <span className="text-wine">♥</span>
          <span className="h-px w-10 bg-gold/40" />
        </div>
        <Reveal
          as="p"
          from="down"
          delay={0.2}
          className="text-[12px] uppercase tracking-[1px] sm:tracking-[2px] text-muted-foreground font-bold"
        >
          Lưu giữ những điều đẹp nhất của chúng ta
        </Reveal>
      </div>

      {/* Chương 01 — studio trắng, hoa pampas */}
      <ChapterHeader
        number="01"
        title="Hoa & Lá"
        quote=""
      />
      <Pair left="DSC00111" right="DSC00188" onOpen={setOpenIndex} />
      <Pair left="DSC09942" right="DSC09992" onOpen={setOpenIndex} />

      {/* Chương 02 — biển, ghềnh đá và cỏ xanh */}
      <ChapterHeader
        number="02"
        title="Biển & Đá"
        quote=""
      />
      <Wide name="DSC01052" onOpen={setOpenIndex} />
      <Pair left="DSC01344" right="DSC01470" onOpen={setOpenIndex} />
      <Pair left="DSC01329" right="DSC00927" onOpen={setOpenIndex} />
      {/* landscape breather */}
      <Wide name="DSC01504" onOpen={setOpenIndex} />
      <Wide name="DSC01515" onOpen={setOpenIndex} />
      <Pair left="DSC01525" right="DSC01202" onOpen={setOpenIndex} />
      {/* 01625 is natively 3:4, so this row evens at 3:4; 00969 (2:3) gives up
          ~11% of its height, aimed high to keep the faces and bouquet */}
      <Pair
        left="DSC00969"
        right="DSC01625"
        leftImgClass="w-full aspect-[3/4] object-cover object-[center_30%] rounded-sm"
        rightImgClass="w-full aspect-[3/4] object-cover rounded-sm"
        onOpen={setOpenIndex}
      />

      <Pair left="DSC01008" right="DSC01048" onOpen={setOpenIndex} />


{/* 
      {/* was a duplicate of 01344/01525 — swapped for the two unplaced frames */}
      <Wide name="DSC01485" onOpen={setOpenIndex} />
      {/* closing frames — the embroidered veil with the couple's names */}
      {/* <Wide name="voan1" onOpen={setOpenIndex} /> */}
      <Wide name="voan2" onOpen={setOpenIndex} />

      <PhotoLightbox
        photos={ALL_PHOTOS}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
