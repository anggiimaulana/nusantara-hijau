import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <html lang="id">
      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
