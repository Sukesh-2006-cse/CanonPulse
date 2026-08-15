import type { Metadata } from "next";
import { Cormorant_Garamond, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Calligraphic display font — elegant, writerly, editorial
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Literary body serif — beautiful, warm, readable
const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Monospace for data labels / code
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CanonPulse — Narrative Intelligence for Serialized Fiction",
  description:
    "Every clue, vow, wound, threat, and romance arc is a promise made to a reader. CanonPulse tells a writer which of those promises are broken, which are intentional twists still waiting on their payoff, and which are overdue — with the exact episodes to prove it.",
  openGraph: {
    title: "CanonPulse — Protect the 300 episodes you already shipped.",
    description:
      "Dual-layer narrative graph continuity analysis for long-running serialized fiction.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${lora.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#080800] text-[#f5f0e8]">
        {children}
      </body>
    </html>
  );
}
