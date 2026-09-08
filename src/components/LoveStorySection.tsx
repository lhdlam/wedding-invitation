"use client";

import { Reveal } from "@/components/Reveal";

/** "The love story" — script heading over the couple's quote line. */
export function LoveStorySection() {
  return (
    <section className="relative px-4 py-10 mobilem:px-5 mobilel:px-6 mobilel:py-12 bg-[#fbf8f1]/65">
      <Reveal className="text-center">
        <p className="mb-3 text-[16px] mobilel:text-[18px] uppercase tracking-[4px] text-wine font-bold">
          The love story
        </p>
        <h2 className="font-silenter text-[56px] text-wine mt-1">and</h2>
      </Reveal>

      <Reveal
        as="p"
        delay={0.1}
        className="font-lora text-[18px] text-foreground/75 leading-7 italic text-center mt-2 px-2"
      >
        Tình yêu của anh và em là một hành trình kỳ diệu, vượt qua bao thử thách
        để cùng nhau bước đến ngày hôm nay - đám cưới của chúng mình.
      </Reveal>
    </section>
  );
}
