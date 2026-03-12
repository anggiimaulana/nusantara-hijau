"use client";

import { motion } from "framer-motion";
import { Leaf, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/species", label: "Spesies" },
  { href: "/about", label: "Tentang" },
  { href: "/contact", label: "Kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(255,253,245,0.98)",
          borderBottom: "2px solid var(--border-hard)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-16 sm:h-[4.5rem]">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group select-none"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "var(--pg-accent)",
                  border: "2px solid var(--border-hard)",
                  boxShadow: "var(--shadow-hard-xs)",
                }}
              >
                <Leaf className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                <span
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                  style={{
                    background: "var(--pg-amber)",
                    border: "1.5px solid var(--border-hard)",
                  }}
                />
              </motion.div>
              <div className="flex flex-col leading-none">
                <span
                  className="font-bold text-base tracking-tight"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--text-primary)",
                  }}
                >
                  Nusantara
                  <span style={{ color: "var(--pg-accent)" }}>Hijau</span>
                </span>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest hidden sm:block"
                  style={{ color: "var(--text-muted)" }}
                >
                  Atlas Biodiversitas
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: active ? "white" : "var(--text-secondary)",
                      background: active ? "var(--pg-accent)" : "transparent",
                      border: active
                        ? "2px solid var(--border-hard)"
                        : "2px solid transparent",
                      boxShadow: active ? "var(--shadow-hard-xs)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        e.currentTarget.style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                        style={{
                          background: "var(--pg-amber)",
                          border: "1.5px solid var(--border-hard)",
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-2">
              <Link
                href="/species"
                className="hidden sm:inline-flex btn-candy py-2 px-4 text-sm"
              >
                Jelajahi
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{
                  border: "2px solid var(--border-hard)",
                  background: "white",
                  boxShadow: "var(--shadow-hard-xs)",
                  cursor: "pointer",
                }}
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="w-4.5 h-4.5" strokeWidth={2.5} />
                ) : (
                  <Menu className="w-4.5 h-4.5" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <motion.div
        initial={false}
        animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="fixed inset-y-0 right-0 z-40 w-72 md:hidden"
        style={{
          background: "var(--pg-bg)",
          borderLeft: "2px solid var(--border-hard)",
          boxShadow: "-6px 0 0 var(--border-hard)",
        }}
      >
        <div className="flex flex-col h-full p-6 pt-20">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link, i) => {
              const active = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={
                    menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }
                  }
                  transition={{ delay: i * 0.07 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 group"
                    style={{
                      fontFamily: "var(--font-heading)",
                      background: active ? "var(--pg-accent)" : "white",
                      color: active ? "white" : "var(--text-primary)",
                      border: "2px solid var(--border-hard)",
                      boxShadow: active
                        ? "var(--shadow-hard-xs)"
                        : "2px 2px 0px var(--border-hard)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (active) return;
                      e.currentTarget.style.background = "var(--pg-amber)";
                      e.currentTarget.style.color = "var(--text-primary)";
                      e.currentTarget.style.boxShadow =
                        "4px 4px 0px var(--border-hard)";
                      e.currentTarget.style.transform = "translate(-2px, -2px)";
                    }}
                    onMouseLeave={(e) => {
                      if (active) return;
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "var(--text-primary)";
                      e.currentTarget.style.boxShadow =
                        "2px 2px 0px var(--border-hard)";
                      e.currentTarget.style.transform = "translate(0, 0)";
                    }}
                  >
                    {/* Color accent dot per link */}
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-200"
                      style={{
                        background: active
                          ? "white"
                          : [
                              "var(--pg-accent)",
                              "var(--pg-pink)",
                              "var(--pg-amber)",
                              "var(--pg-mint)",
                            ][i],
                      }}
                    />
                    {link.label}
                    {active && (
                      <span
                        className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(255,255,255,0.25)",
                          color: "white",
                        }}
                      >
                        Aktif
                      </span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Bottom pill */}
          <div className="mt-auto">
            <div
              className="p-4 rounded-2xl text-center"
              style={{
                background: "var(--pg-amber)",
                border: "2px solid var(--border-hard)",
                boxShadow: "var(--shadow-hard)",
              }}
            >
              <p
                className="text-xs font-bold mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                🌿 Jaga Nusantara Kita
              </p>
              <Link
                href="/species"
                onClick={() => setMenuOpen(false)}
                className="btn-candy w-full justify-center py-2.5 text-sm"
              >
                Mulai Jelajahi
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Backdrop */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 md:hidden"
          style={{
            background: "rgba(15,23,42,0.4)",
            backdropFilter: "blur(4px)",
            cursor: "pointer",
          }}
        />
      )}
    </>
  );
}
