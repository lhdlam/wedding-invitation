"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AlbumSection } from "@/components/AlbumSection";
import { CountdownSection } from "@/components/CountdownSection";
import { CoverOverlay } from "@/components/CoverOverlay";
import { FamiliesSection } from "@/components/FamiliesSection";
import { GiftSection } from "@/components/GiftSection";
import { HeroSection } from "@/components/HeroSection";
import { InvitationSection } from "@/components/InvitationSection";
import { LoveStorySection } from "@/components/LoveStorySection";
import { MusicToggle } from "@/components/MusicToggle";
import { PetalField } from "@/components/PetalField";
import { PhotoBreak } from "@/components/PhotoBreak";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { RsvpSection } from "@/components/RsvpSection";
import { ThankYouSection } from "@/components/ThankYouSection";
import { TimelineSection } from "@/components/TimelineSection";
import type { InvitationContent } from "@/types/invitation";

/** Placeholder guest name — the target renders this when no guest token is present. */
const GUEST_NAME = "Bạn";

interface LightboxPhoto {
  src: string;
  alt: string;
}

interface InvitationPageProps {
  /** Which of the two receptions this page invites to. */
  content: InvitationContent;
}

/**
 * The invitation itself, shared by both routes. Everything that differs between
 * the groom's and the bride's reception arrives through `content`.
 */
export function InvitationPage({ content }: InvitationPageProps) {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [photo, setPhoto] = useState<LightboxPhoto | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* `?open=1` skips the envelope — handy for previews and shared screenshots.
     Scheduled so the effect doesn't cascade renders, and server/client first
     paint still agree. */
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("open")) return;
    const id = requestAnimationFrame(() => setOpened(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* Scroll stays locked behind the envelope, exactly as on the target
     (html/body carry `overflow: clip` until the seal is opened). */
  useEffect(() => {
    const { style } = document.documentElement;
    const previous = style.overflow;
    style.overflow = opened ? "" : "clip";
    return () => {
      style.overflow = previous;
    };
  }, [opened]);

  /* Playback must start inside the click gesture or autoplay policy blocks it. */
  const handleOpen = useCallback(() => {
    setOpened(true);
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, []);

  const handleToggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, []);

  const handlePhotoClick = useCallback((src: string, alt: string) => {
    setPhoto({ src, alt });
  }, []);

  const handleCloseLightbox = useCallback(() => setPhoto(null), []);

  return (
    <div className="relative bg-background min-h-screen overflow-x-clip">
      <main
        className="relative max-w-[480px] mx-auto min-h-screen shadow-petal bg-top bg-repeat"
        style={{ backgroundImage: "url(/images/background-white.png)" }}
      >
        <HeroSection dateLabel={content.dateLabel} />
        <PhotoBreak />
        <FamiliesSection
          ceremonyTime={content.ceremonyTime}
          date={content.date}
        />
        <InvitationSection
          guestName={GUEST_NAME}
          receptionTime={content.receptionTime}
          dateLabel={content.dateLabel}
          date={content.date}
          venue={content.venue}
        />
        <CountdownSection targetIso={content.countdownIso} />
        <LoveStorySection onPhotoClick={handlePhotoClick} />
        <TimelineSection entries={content.timeline} />
        <AlbumSection onPhotoClick={handlePhotoClick} />
        <RsvpSection />
        <GiftSection />
        <ThankYouSection />
      </main>

      {/* Ambient layer — fixed, behind the column */}
      <PetalField />

      <audio ref={audioRef} loop src="/audio/wedding-song.mp3" />

      <MusicToggle playing={playing} onToggle={handleToggleMusic} />

      <PhotoLightbox photo={photo} onClose={handleCloseLightbox} />

      {!opened && (
        <CoverOverlay
          guestName={GUEST_NAME}
          dateShort={content.dateLabel.replace(".2026", ".26")}
          onOpen={handleOpen}
        />
      )}
    </div>
  );
}
