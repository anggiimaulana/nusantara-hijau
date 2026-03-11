import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { JetBrains_Mono, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NusantaraHijau — Atlas Keanekaragaman Hayati Indonesia",
    template: "%s | NusantaraHijau",
  },
  description:
    "Jelajahi keanekaragaman hayati Indonesia. Atlas digital flora & fauna endemik Nusantara yang interaktif — kenali, cintai, lestarikan.",
  keywords: [
    "keanekaragaman hayati Indonesia",
    "flora fauna endemik",
    "konservasi satwa",
    "spesies langka",
    "IUCN Red List Indonesia",
    "atlas biodiversitas",
  ],
  icons: {
    icon: "/images/logo/nusantara-hijau-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "NusantaraHijau",
    title: "NusantaraHijau — Atlas Keanekaragaman Hayati Indonesia",
    description: "Atlas digital interaktif keanekaragaman hayati Nusantara.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NusantaraHijau",
    description: "Atlas digital keanekaragaman hayati Indonesia.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body
        style={{
          fontFamily: "var(--font-body)",
          background: "var(--pg-bg)",
          overflowX: "hidden",
        }}
      >
        <div className="flex flex-col min-h-screen">
          <Navbar />
          {/* pt-[4.5rem] offsets the fixed navbar height */}
          <main className="flex-1 pt-[4.5rem]">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}