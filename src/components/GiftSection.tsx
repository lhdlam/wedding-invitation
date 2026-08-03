"use client";

/**
 * Outlined "send a wedding gift" call-to-action sitting directly under the RSVP
 * form. The target opens a bank-details modal here; the clone exposes an
 * optional `onClick` instead of inventing account numbers.
 */
export function GiftSection({ onClick }: { onClick?: () => void }) {
  return (
    <section className="mobilel:px-6 relative px-6 pt-0 mobilel:pt-0 pb-20 text-center">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 font-lora w-full bg-white hover:bg-wine/10 text-wine border border-wine tracking-widest uppercase text-sm py-6 shadow-soft"
      >
        Gửi quà mừng cưới
      </button>
    </section>
  );
}
