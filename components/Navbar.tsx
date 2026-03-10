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

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b shadow-sm"
            : "bg-transparent"
        }`}
        style={{
          borderColor: scrolled ? "var(--border-light)" : "transparent",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        }}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div
                className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                style={{ background: "var(--green-500)" }}
              >
                <LeafIcon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div className="leading-none">
                <span
                  className="block font-bold text-base lg:text-lg tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  Nusantara
                  <span style={{ color: "var(--green-500)" }}>Hijau</span>
                </span>
                <span
                  className="block text-[9px] lg:text-[10px] font-medium tracking-[0.15em] uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  Atlas Hayati
                </span>
              </div>
            </Link>

            {/* Desktop links - Tablet and up */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active ? "font-semibold" : ""
                    }`}
                    style={{
                      color: active
                        ? "var(--green-500)"
                        : "var(--text-secondary)",
                      background: active ? "var(--green-50)" : "transparent",
                      minHeight: "44px",
                      display: "inline-flex",
                      alignItems: "center",
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

            {/* CTA - Desktop */}
            <div className="hidden md:block">
              <Link
                href="/species"
                className="btn-primary text-sm py-2.5 px-4 lg:px-5"
                style={{ minHeight: "44px" }}
              >
                <LeafIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Jelajahi Spesies</span>
                <span className="lg:hidden">Spesies</span>
              </Link>
            </div>

            {/* Mobile hamburger - Touch friendly 44px */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95"
              style={{
                background: open ? "var(--green-50)" : "var(--bg-muted)",
                color: open ? "var(--green-600)" : "var(--text-secondary)",
                border: open ? "1px solid var(--green-200)" : "1px solid transparent",
              }}
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu - Full screen overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Menu panel */}
        <div
          className={`absolute top-16 left-0 right-0 bg-white shadow-xl transition-transform duration-300 ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
          style={{
            borderTop: "1px solid var(--border-light)",
            maxHeight: "calc(100vh - 4rem)",
            overflowY: "auto",
          }}
        >
          <div className="container-main py-4 space-y-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 active:scale-[0.98]"
                  style={{
                    color: active ? "var(--green-600)" : "var(--text-secondary)",
                    background: active ? "var(--green-50)" : "transparent",
                    borderLeft: active
                      ? "4px solid var(--green-400)"
                      : "4px solid transparent",
                    minHeight: "56px",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 pb-2">
              <Link
                href="/species"
                className="btn-primary w-full justify-center text-base py-4"
                style={{ minHeight: "56px" }}
              >
                <LeafIcon className="w-5 h-5" />
                Jelajahi Spesies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
