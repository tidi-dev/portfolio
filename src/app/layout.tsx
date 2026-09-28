import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
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
// selects through `font-stretch`.
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

const monaSans = localFont({
  src: "../assets/fonts/mona-sans.woff2",
  variable: "--font-mona-sans",
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
    <html
      lang={site.lang}
      className={`${chakraPetch.variable} ${monaSans.variable}`}
    >
      <body className="bg-surface type-body text-primary">{children}</body>
    </html>
  );
}
