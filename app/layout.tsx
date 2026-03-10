import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Font setup
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

// Metadata SEO
export const metadata: Metadata = {
  title: {
    default: "NusantaraHijau - Atlas Digital Keanekaragaman Hayati Indonesia",
    template: "%s | NusantaraHijau",
  },
  description:
    "Jelajahi kekayaan flora dan fauna endemik Indonesia. Atlas digital interaktif yang menampilkan spesies langka per wilayah beserta status konservasi dan cara melestarikannya.",
  keywords: [
    "keanekaragaman hayati Indonesia",
    "flora fauna endemik",
    "konservasi satwa",
    "spesies langka Indonesia",
    "atlas digital Indonesia",
  ],
  authors: [{ name: "Tim NusantaraHijau" }],
  openGraph: {
    title: "NusantaraHijau — Atlas Digital Keanekaragaman Hayati Indonesia",
    description:
      "Jelajahi kekayaan flora dan fauna endemik Indonesia secara interaktif.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#0A1628] text-[#ECEFF1] font-sans antialiased">
        {/* Background texture — subtle noise overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />

        {/* Ambient glow top */}
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(46,204,113,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Main content wrapper */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
