import Image from "next/image";

/**
 * Full-bleed photo break between sections. The negative vertical
 * object-position offset keeps the couple in frame inside the 330px band.
 */
export function PhotoBreak() {
  return (
    <div className="relative px-0 pt-10 mb-3 text-center bg-[#fbf8f1]/65">
      <Image
        src="/images/couple-2/DSC01485.webp"
        alt=""
        width={1400}
        height={2100}
        sizes="(max-width: 480px) 100vw, 480px"
        className="w-full object-cover object-[center_calc(50%-40px)]"
        unoptimized
      />
    </div>
  );
}
