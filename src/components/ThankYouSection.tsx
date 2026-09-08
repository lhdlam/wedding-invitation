import { HeartsDoodleIcon, SectionDivider } from "@/components/icons";
import { coupleFor } from "@/data/invitation";
import type { SideKey } from "@/types/invitation";

/**
 * Closing block mirroring the printed envelope back: script "Thank you", the
 * paired-hearts doodle, the envelope-back message, and the couple's crimson
 * script signature.
 */
export function ThankYouSection({ side }: { side: SideKey }) {
  const [first, second] = coupleFor(side);
  return (
    <section className="mobilel:px-6 mobilel:pt-14 relative px-6 py-14 text-center bg-[#fbf8f1]/65">
      <h2 className="font-silenter text-6xl text-wine mb-6">Thank you</h2>

      <SectionDivider />

      <p className="font-lora text-foreground/75 leading-loose mt-6">
        Cảm ơn mọi người đã trở thành
        <br />
        một phần quan trọng trong ngày đặc biệt này!
      </p>

      <p className="font-anisa text-[34px] text-wine mt-10 leading-tight">
        {first.shortName} &amp; {second.shortName}
      </p>
      <HeartsDoodleIcon className="mx-auto mt-4" />
    </section>
  );
}
