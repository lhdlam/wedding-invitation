import { HeartsDoodleIcon, SectionDivider } from "@/components/icons";
import { BRIDE, GROOM } from "@/data/invitation";

/**
 * Closing block mirroring the printed envelope back: script "Thank you", the
 * paired-hearts doodle, the envelope-back message, and the couple's crimson
 * script signature.
 */
export function ThankYouSection() {
  return (
    <section className="mobilel:px-6 mobilel:pt-20 relative px-6 py-24 text-center bg-white/60">
      <h2 className="font-silenter text-6xl text-wine mb-6">Thank you</h2>

      <SectionDivider />

      <p className="font-lora text-foreground/75 leading-loose mt-6">
        Cảm ơn mọi người đã trở thành một phần quan trọng
        <br />
        trong ngày đặc biệt này!
      </p>

      <p className="font-anisa text-[34px] text-wine mt-10 leading-tight">
        {GROOM.shortName} &amp; {BRIDE.shortName}
      </p>
      <HeartsDoodleIcon className="mx-auto mt-4" />
    </section>
  );
}
