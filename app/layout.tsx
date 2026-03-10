import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NusantaraHijau — Atlas Keanekaragaman Hayati Indonesia",
    template: "%s | NusantaraHijau",
  },
  description:
    "Jelajahi kekayaan flora dan fauna endemik Indonesia per provinsi. Atlas digital interaktif keanekaragaman hayati Nusantara.",
  keywords: [
    "keanekaragaman hayati Indonesia",
    "flora fauna endemik",
    "konservasi satwa",
    "spesies langka",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
