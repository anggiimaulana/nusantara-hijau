import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
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
    <html lang="id" className={`${jakarta.variable}`}>
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
