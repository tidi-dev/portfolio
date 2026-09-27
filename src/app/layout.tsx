import localFont from "next/font/local";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import "./globals.css";

// Every route is prerendered: any request-time API fails the build
// (contrib-engineering §1.2).
export const dynamic = "error";

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

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={site.lang} className={archivo.variable}>
      <body className="bg-surface type-body text-primary">{children}</body>
    </html>
  );
}
