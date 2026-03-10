"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/species", label: "Spesies" },
  { href: "/about", label: "Tentang" },
  { href: "/contact", label: "Kontak" },
];

// Leaf SVG icon (inline, no external font)
function LeafIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 5.5-8 5.5C12.83 6.63 10.55 7 8 7C8.21 5.71 8 4 4 3c0 0 8-2 13 5z" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b shadow-sm"
          : "bg-transparent"
      }`}
      style={{
        borderColor: scrolled ? "var(--border-light)" : "transparent",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
      }}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{ background: "var(--green-500)" }}
            >
              <LeafIcon className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none">
              <span
                className="block font-bold text-base tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Nusantara
                <span style={{ color: "var(--green-500)" }}>Hijau</span>
              </span>
              <span
                className="block text-[9px] font-medium tracking-[0.15em] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                Atlas Hayati
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active ? "font-semibold" : ""
                  }`}
                  style={{
                    color: active
                      ? "var(--green-500)"
                      : "var(--text-secondary)",
                    background: active ? "var(--green-50)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--text-primary)";
                      e.currentTarget.style.background = "var(--bg-muted)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                  {active && (
                    <span
                      className="block h-0.5 rounded-full mt-0.5 mx-auto"
                      style={{ width: "20px", background: "var(--green-400)" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Link href="/species" className="btn-primary text-sm py-2.5 px-5">
              <LeafIcon className="w-4 h-4" />
              Jelajahi Spesies
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200"
            style={{
              background: open ? "var(--green-50)" : "var(--bg-muted)",
              color: "var(--text-secondary)",
            }}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-80" : "max-h-0"
        }`}
        style={{
          background: "white",
          borderTop: open ? "1px solid var(--border-light)" : "none",
        }}
      >
        <div className="container-main py-3 space-y-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200"
                style={{
                  color: active ? "var(--green-600)" : "var(--text-secondary)",
                  background: active ? "var(--green-50)" : "transparent",
                  borderLeft: active
                    ? "3px solid var(--green-400)"
                    : "3px solid transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 pb-1">
            <Link
              href="/species"
              className="btn-primary w-full justify-center text-sm"
            >
              <LeafIcon className="w-4 h-4" />
              Jelajahi Spesies
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
