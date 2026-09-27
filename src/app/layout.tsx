import type { ReactNode } from "react";
import "./globals.css";

// Every route is prerendered: any request-time API fails the build
// (contrib-engineering §1.2).
export const dynamic = "error";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
