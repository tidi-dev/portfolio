import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer/site-footer";
import { SiteHeader } from "@/components/site-header/site-header";
import { SkipLink } from "@/components/site-header/skip-link";
import { NoscriptStyle } from "@/components/theme/noscript-style";
import { ThemeScript } from "@/components/theme/theme-script";
import { site } from "@/content/site";
import { siteMetadata } from "@/lib/seo/metadata";
import { PAGE_COLOURS } from "@/lib/theme/page-colours";
import "./globals.css";

// Every route is prerendered: any request-time API fails the build
// (contrib-engineering §1.2).
export const dynamic = "error";

export const metadata: Metadata = siteMetadata();

// theme-color follows the system here; the theme script and the toggle set
// both tags to the chosen theme's page colour (contrib-engineering §6).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: PAGE_COLOURS.light },
    { media: "(prefers-color-scheme: dark)", color: PAGE_COLOURS.dark },
  ],
  colorScheme: "light dark",
};

// Archivo, the only family (DESIGN.md → Typography): the subset from
// `pnpm fonts`, preloaded, with a metric-adjusted fallback. The declared
// font-stretch range lets `font-stretch: 125%` select the width axis.
// next/font needs literals; font-coverage.test.ts pins these to the manifest.
const archivo = localFont({
  src: "../assets/fonts/archivo.woff2",
  variable: "--font-archivo",
  display: "swap",
  weight: "400 800",
  style: "normal",
  declarations: [{ prop: "font-stretch", value: "87.5% 125%" }],
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
  preload: true,
});

/**
 * The shell (DESIGN.md → Layout): the skip link first, then the header, main
 * and footer in one container, at most 1200 px wide between the page edges.
 * The theme script sets `data-theme` on <html> before hydration, hence
 * suppressHydrationWarning on that element only.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang={site.lang}
      className={archivo.variable}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <NoscriptStyle />
      </head>
      <body className="bg-surface type-body text-primary">
        <SkipLink />
        <div id="top" className="page-x">
          <div className="mx-auto flex min-h-dvh max-w-container flex-col">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
