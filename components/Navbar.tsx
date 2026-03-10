"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Leaf } from "lucide-react";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/species", label: "Spesies" },
  { href: "/about", label: "Tentang" },
  { href: "/contact", label: "Kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Detect scroll untuk efek background navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup menu mobile saat navigasi
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A1628]/95 backdrop-blur-md shadow-lg shadow-black/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#2ECC71] to-[#1a8a4a] flex items-center justify-center shadow-lg shadow-green-900/30 group-hover:shadow-green-700/40 transition-all duration-300 group-hover:scale-105">
              <Leaf className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-bold text-white text-base tracking-wide"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Nusantara
              </span>
              <span className="text-[#2ECC71] text-[10px] font-semibold tracking-[0.2em] uppercase">
                Hijau
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group ${
                    isActive
                      ? "text-[#2ECC71]"
                      : "text-[#90A4AE] hover:text-white"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute inset-0 bg-[#2ECC71]/10 rounded-lg border border-[#2ECC71]/20" />
                  )}
                  {/* Hover indicator */}
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-lg transition-all duration-300" />
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA Button Desktop */}
          <div className="hidden md:block">
            <Link
              href="/species"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white text-sm font-semibold rounded-xl shadow-md shadow-green-900/30 hover:shadow-green-700/40 hover:scale-105 transition-all duration-300"
            >
              <Leaf className="w-4 h-4" />
              Jelajahi Spesies
            </Link>
          </div>

          {/* Hamburger Button Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
            aria-label="Toggle menu"
          >
            <span
              className={`absolute transition-all duration-300 ${isOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}
            >
              <X className="w-5 h-5" />
            </span>
            <span
              className={`absolute transition-all duration-300 ${isOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`}
            >
              <Menu className="w-5 h-5" />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#0A1628]/98 backdrop-blur-md border-t border-white/5 px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20"
                    : "text-[#90A4AE] hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]" />
                )}
                {link.label}
              </Link>
            );
          })}

          {/* CTA Mobile */}
          <div className="pt-2">
            <Link
              href="/species"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white text-sm font-semibold rounded-xl"
            >
              <Leaf className="w-4 h-4" />
              Jelajahi Spesies
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
