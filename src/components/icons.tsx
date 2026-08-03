import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/* Ornaments drawn for the printed-suite identity: tiny paired hearts (the
   doodle on the envelope back), hairline rules, crimson accents. */

/** Heart outline path in a 20×18 box, shared by the doodle, rain and burst. */
export const HEART_PATH =
  "M10 17 C 4.2 12.2, 0.6 8.7, 0.6 5.4 C 0.6 2.6, 2.8 0.6, 5.4 0.6 C 7.2 0.6, 8.9 1.5, 10 3 C 11.1 1.5, 12.8 0.6, 14.6 0.6 C 17.2 0.6, 19.4 2.6, 19.4 5.4 C 19.4 8.7, 15.8 12.2, 10 17 Z";

/** The paired-hearts doodle from the envelope back: one outline, one filled. */
export function HeartsDoodleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="44"
      height="24"
      viewBox="0 0 44 24"
      fill="none"
      aria-hidden="true"
      {...props}
      className={cn("text-wine", props.className)}
    >
      <g transform="translate(2 4) scale(0.75) rotate(-8 10 9)">
        <path d={HEART_PATH} stroke="currentColor" strokeWidth="1.6" />
      </g>
      <g transform="translate(22 2) scale(0.95) rotate(10 10 9)">
        <path d={HEART_PATH} fill="currentColor" />
      </g>
    </svg>
  );
}

/** Full divider: hairline — paired hearts — hairline. */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-4 my-8", className)}>
      <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold/60" />
      <HeartsDoodleIcon />
      <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}

/** The falling shape used by the ambient background — a tiny crimson heart. */
export function PetalIcon({
  width,
  height,
  opacity,
}: {
  width: number;
  height: number;
  opacity: number;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 18" style={{ opacity }} aria-hidden="true">
      <path d={HEART_PATH} fill="hsl(357 55% 46%)" />
    </svg>
  );
}

/* ---- Lucide icons used by the target, inlined so no runtime dep is needed ---- */

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function MapPinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function CircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function Volume2Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
      <path d="M16 9a5 5 0 0 1 0 6" />
      <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
    </svg>
  );
}

export function VolumeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </svg>
  );
}
