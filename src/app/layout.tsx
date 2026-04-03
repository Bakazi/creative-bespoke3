import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luminary — Strategy · Design · Growth",
  description:
    "Luminary partners with ambitious companies to build brands, systems, and strategies that stand the test of time. Precision. Purpose. Performance.",
  keywords: [
    "Luminary",
    "Brand Strategy",
    "Digital Experience",
    "Growth Advisory",
    "Product Design",
    "Content Systems",
  ],
  authors: [{ name: "Luminary" }],
  openGraph: {
    title: "Luminary — We craft futures that endure",
    description:
      "Premium strategy, design, and growth services for ambitious companies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorantGaramond.variable} ${dmMono.variable} luminary-body`}>
        {children}
      </body>
    </html>
  );
}
