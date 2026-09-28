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

// DESIGN.md → Typography: the subsets from `pnpm fonts`. next/font needs
// literals, so the weights and axis ranges below repeat the manifest
// (src/assets/fonts/fonts.manifest.json): Chakra Petch 600 and 700; Mona
// Sans wght 400–600 and wdth 100–112, which the declared font-stretch range
// selects through `font-stretch`. The Mona Sans subset is served as
// "Portfolio Sans": the OFL reserves the name "Mona" for the original
// (ruling, 2026-09-28), so the family name next/font derives from this
// const avoids it too.
const chakraPetch = localFont({
  src: [
    {
      path: "../assets/fonts/chakra-petch-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/chakra-petch-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-chakra-petch",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

const portfolioSans = localFont({
  src: "../assets/fonts/portfolio-sans.woff2",
  variable: "--font-portfolio-sans",
  display: "swap",
  weight: "400 600",
  style: "normal",
  declarations: [{ prop: "font-stretch", value: "100% 112%" }],
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
      className={`${chakraPetch.variable} ${portfolioSans.variable}`}
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
