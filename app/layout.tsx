import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import type { ReactNode } from "react";

import "@/app/globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"]
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Incrementum Library",
  description: "A living investment research system centered around a resident AI analyst."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
