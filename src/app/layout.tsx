import type { Metadata } from "next";
import { Barlow_Condensed, Inter, JetBrains_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-barlow",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cursive",
});

export const metadata: Metadata = {
  title: "RPL Evidence Mapper — Australian Construction Qualifications",
  description:
    "Map and track RPL evidence across CPC40120, CPC50220 and CPC60220 construction qualifications. Carry-over engine automatically calculates coverage.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${barlow.variable} ${inter.variable} ${jetbrains.variable} ${dancingScript.variable}`}>
      <body className="font-body antialiased min-h-screen blueprint-bg">
        {children}
      </body>
    </html>
  );
}
