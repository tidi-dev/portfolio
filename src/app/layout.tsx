import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { HudStrip } from "@/components/shell/hud-strip";
import { SiteFooter } from "@/components/shell/site-footer";
import { SkipLink } from "@/components/shell/skip-link";
import { HeadScript } from "@/components/theme/head-script";
import { NoscriptStyle } from "@/components/theme/noscript-style";
import { copy } from "@/content/copy";
import { site } from "@/content/site";
import "./globals.css";

// Every route is prerendered: any request-time API fails the build
// (contrib-engineering §1.2).
export const dynamic = "error";

// Title and description only (contrib-engineering §1.2; SEO is out of scope).
export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

// DESIGN.md → Typography: every word on the site is Portfolio Pixel, the
// subset from `pnpm fonts` (400 only, as the manifest
// src/assets/fonts/fonts.manifest.json records; next/font needs literals).
// It is served under a new name: the OFL reserves the original's name
// (ruling, 2026-09-28), so the family name next/font derives from this
// const avoids it too. The site loads no other face: the Portfolio Sans
// subset is for the résumé PDF only (`pnpm resume:pdf`).
const portfolioPixel = localFont({
  src: "../assets/fonts/portfolio-pixel-400.woff2",
  variable: "--font-portfolio-pixel",
  display: "swap",
  weight: "400",
  style: "normal",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    // The head script sets data-theme and data-motion on <html> before
    // hydration, so its attributes differ from the server's by design.
    <html
      lang={site.lang}
      className={portfolioPixel.variable}
      suppressHydrationWarning
    >
      <head>
        <HeadScript />
        <NoscriptStyle />
      </head>
      <body className="bg-surface type-body text-primary">
        <SkipLink />
        <HudStrip />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
