import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./phone.css";
import "./story.css";
import "./sections.css";

const inter = Inter({ subsets: ["latin"], axes: ["opsz"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-mono", display: "swap" });

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://nowline.org";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "Nowline: your day, handled. The voice-first AI planner for students",
  description:
    "Nowline plans your day, keeps you on pace, and re-plans when life happens. Reply to notifications by voice, sync Canvas deadlines, and join the waitlist for a free month.",
  openGraph: {
    title: "Nowline: your day, handled.",
    description: "The voice-first AI planner for students. Join the waitlist for a free month and early access.",
    url: site,
    siteName: "Nowline",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#F4F5F1",
  width: "device-width",
  initialScale: 1,
};

// Runs before paint: marks JS support and skips the intro on repeat visits this session.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('nl-seen'))d.classList.add('pre-skip');sessionStorage.setItem('nl-seen','1')}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
