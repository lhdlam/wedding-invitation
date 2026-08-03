"use client";

import { Volume2Icon, VolumeOffIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface MusicToggleProps {
  /** True while `/audio/wedding-song.mp3` is playing. The page owns the <audio> element. */
  playing: boolean;
  onToggle: () => void;
  className?: string;
}

export function MusicToggle({ playing, onToggle, className }: MusicToggleProps) {
  return (
    <button
      type="button"
      aria-label="Toggle music"
      aria-pressed={playing}
      onClick={onToggle}
      className={cn(
        "fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-petal border border-blush-200 flex items-center justify-center hover:scale-110 transition-transform",
        className,
      )}
    >
      {playing ? (
        <Volume2Icon className="w-5 h-5 text-primary animate-pulse" />
      ) : (
        <VolumeOffIcon className="w-5 h-5 text-primary" />
      )}
    </button>
  );
}
