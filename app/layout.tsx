import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans, Noto_Sans_Malayalam, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";
import { wedding } from "../src/data/wedding";

const serif = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", weight: ["400", "500", "600"], display: "swap" });
const sans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const malayalam = Noto_Sans_Malayalam({ subsets: ["malayalam"], variable: "--font-ml", display: "swap" });
const tamil = Noto_Sans_Tamil({ subsets: ["tamil"], variable: "--font-ta", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(wedding.canonicalUrl), title: wedding.social.title, description: wedding.social.description,
  alternates: { canonical: "/" },
  openGraph: { title: wedding.social.title, description: wedding.social.description, url: "/", siteName: wedding.couple.display, type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "S & S — 13–14 December 2026" }] },
  twitter: { card: "summary_large_image", title: wedding.social.title, description: wedding.social.description, images: ["/opengraph-image"] },
  icons: { icon: "/icon.svg" },
};

const eventJsonLd = {
  "@context": "https://schema.org", "@type": "Event", name: "Sajith & Sreelakshmi — Wedding Celebration",
  startDate: "2026-12-14T11:00:00+05:30", eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: { "@type": "Place", name: "K. R. Thekkedath Mana", address: { "@type": "PostalAddress", streetAddress: "Ottupara–Kunnamkulam Road", addressLocality: "Thalappally", addressRegion: "Kerala", addressCountry: "IN" } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${serif.variable} ${sans.variable} ${malayalam.variable} ${tamil.variable}`}><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd).replace(/</g, "\\u003c") }} /></body></html>;
}
