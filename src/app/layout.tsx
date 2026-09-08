import type { Metadata } from "next";
import localFont from "next/font/local";
import { BRIDE, GROOM } from "@/data/invitation";
import "./globals.css";

/* Fonts are self-hosted by the target site; the exact files are mirrored into
   public/fonts by scripts/download-assets.mjs. */

const lora = localFont({
  src: "../../public/fonts/lora-regular.ttf",
  variable: "--font-lora-local",
  weight: "400",
  style: "normal",
  adjustFontFallback: false,
  display: "block",
});

const ergisa = localFont({
  src: "../../public/fonts/ergisa-regular.otf",
  variable: "--font-ergisa-local",
  weight: "400",
  style: "normal",
  adjustFontFallback: false,
  display: "block",
});

const flavinda = localFont({
  src: "../../public/fonts/flavinda.otf",
  variable: "--font-flavinda-local",
  weight: "400",
  style: "normal",
  adjustFontFallback: false,
  display: "block",
});

const silenter = localFont({
  src: "../../public/fonts/silenter.ttf",
  variable: "--font-silenter-local",
  weight: "400",
  style: "normal",
  adjustFontFallback: false,
  display: "block",
});

const anisa = localFont({
  src: "../../public/fonts/anisa.otf",
  variable: "--font-anisa-local",
  weight: "400",
  style: "normal",
  adjustFontFallback: false,
  display: "block",
});

const arcittya = localFont({
  src: "../../public/fonts/arcittya-begatri.otf",
  variable: "--font-arcittya-local",
  weight: "400",
  style: "normal",
  adjustFontFallback: false,
  display: "block",
});

const memv = localFont({
  src: "../../public/fonts/memv.woff2",
  variable: "--font-memv-local",
  weight: "400",
  style: "normal",
  adjustFontFallback: false,
  display: "block",
});

/* Per-route pages override both fields with their own reception details. */
export const metadata: Metadata = {
  title: `${GROOM.shortName} & ${BRIDE.shortName} · Thiệp cưới`,
  description: `Save our date.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${lora.variable} ${ergisa.variable} ${flavinda.variable} ${silenter.variable} ${anisa.variable} ${arcittya.variable} ${memv.variable}`}
    >
      <body className="overflow-x-clip antialiased">{children}</body>
    </html>
  );
}
