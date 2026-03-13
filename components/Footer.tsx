"use client";

import { motion } from "framer-motion";
import { Github, Instagram, Leaf, Twitter } from "lucide-react";
import Link from "next/link";

const SPECIES_LINKS = [
  { label: "Harimau Sumatera", href: "/species/harimau-sumatera" },
  { label: "Orangutan Kalimantan", href: "/species/orangutan-kalimantan" },
  { label: "Badak Jawa", href: "/species/badak-jawa" },
  { label: "Rafflesia Arnoldii", href: "/species/rafflesia-arnoldii" },
  { label: "Lihat Semua →", href: "/species" },
];

const PAGE_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Spesies", href: "/species" },
  { label: "Peta Interaktif", href: "/#peta" },
  { label: "Tentang", href: "/about" },
];

const SOCIALS = [
  { icon: <Instagram className="w-4 h-4" />, href: "#", label: "Instagram" },
  { icon: <Twitter className="w-4 h-4" />, href: "#", label: "Twitter" },
  { icon: <Github className="w-4 h-4" />, href: "#", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--pg-dark)",
        borderTop: "2px solid var(--border-hard)",
      }}
    >
      {/* Top strip — amber accent */}
      <div
        className="h-2"
        style={{
          background: "repeating-linear-gradient(90deg, var(--pg-accent) 0, var(--pg-accent) 32px, var(--pg-amber) 32px, var(--pg-amber) 64px, var(--pg-pink) 64px, var(--pg-pink) 96px, var(--pg-mint) 96px, var(--pg-mint) 128px)",
        }}
      />

      <div className="container-main py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">

          {/* Brand col */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "var(--pg-accent)",
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              >
                <Leaf className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span
                className="font-bold text-base text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Nusantara<span style={{ color: "var(--pg-accent)" }}>Hijau</span>
              </span>
            </Link>
            <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
              Atlas digital biodiversitas Indonesia untuk penjelajahan flora, fauna, dan lanskap hayati Nusantara.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  whileHover={{ y: -2, scale: 1.1 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    border: "2px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--pg-accent)";
                    e.currentTarget.style.borderColor = "var(--pg-accent)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Spesies col */}
          <div>
            <h4
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-heading)", color: "var(--pg-amber)" }}
            >
              Spesies Populer
            </h4>
            <ul className="flex flex-col gap-2.5">
              {SPECIES_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-base transition-colors"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "white"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages col */}
          <div>
            <h4
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-heading)", color: "var(--pg-mint)" }}
            >
              Navigasi
            </h4>
            <ul className="flex flex-col gap-2.5">
              {PAGE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-base transition-colors"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "white"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA / Conservation col */}
          <div>
            <h4
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-heading)", color: "var(--pg-pink)" }}
            >
              Lestarikan Bersama
            </h4>
            <div
              className="p-4 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "2px solid rgba(255,255,255,0.1)",
              }}
            >
              <p className="text-base mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                Dikembangkan sebagai ruang eksplorasi dan apresiasi terhadap kekayaan biodiversitas Indonesia.
              </p>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold"
                style={{
                  background: "var(--pg-accent)",
                  color: "white",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                }}
              >
                🌿 Referensi Terpilih
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="my-5"
          style={{ borderTop: "2px dashed rgba(255,255,255,0.1)" }}
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-center">
          <p className="text-base text-center" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-heading)" }}>
            © {new Date().getFullYear()} NusantaraHijau · Atlas Keanekaragaman Hayati Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
