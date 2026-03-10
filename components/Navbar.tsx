"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/species", label: "Spesies" },
  { href: "/about", label: "Tentang" },
  { href: "/contact", label: "Kontak" },
];
const EASE_STANDARD: [number, number, number, number] = [0.4, 0, 0.2, 1];

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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_STANDARD }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-400"
        style={{
          background: scrolled
            ? "rgba(255,255,255,0.92)"
            : "rgba(245,248,243,0.6)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          borderBottom: scrolled
            ? "1px solid rgba(46,125,50,0.12)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 4px 24px rgba(26,46,26,0.06), 0 1px 4px rgba(26,46,26,0.04)"
            : "none",
        }}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ scale: 1.08, rotate: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #2e7d32, #388e3c)",
                  boxShadow: "0 2px 10px rgba(46,125,50,0.30)",
                }}
              >
                <LeafIcon className="w-4 h-4 lg:w-4.5 lg:h-4.5 text-white" />
              </motion.div>
              <div className="leading-none">
                <span
                  className="block font-bold text-base lg:text-[17px] tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  Nusantara
                  <span style={{ color: "var(--green-500)" }}>Hijau</span>
                </span>
                <span
                  className="block text-[9px] font-semibold tracking-[0.16em] uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  Atlas Hayati
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-3 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group"
                    style={{
                      color: active ? "var(--green-600)" : "var(--text-secondary)",
                      background: active ? "rgba(46,125,50,0.07)" : "transparent",
                      minHeight: "44px",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = "var(--text-primary)";
                        e.currentTarget.style.background = "rgba(46,125,50,0.05)";
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
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-[3px] rounded-full"
                        style={{
                          width: "20px",
                          background: "linear-gradient(90deg, var(--green-400), var(--teal-400))",
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA - Desktop */}
            <div className="hidden md:block">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/species"
                  className="btn-primary text-sm py-2.5 px-4 lg:px-5"
                  style={{ minHeight: "44px" }}
                >
                  <LeafIcon className="w-4 h-4" />
                  <span className="hidden lg:inline">Jelajahi Spesies</span>
                  <span className="lg:hidden">Spesies</span>
                </Link>
              </motion.div>
            </div>

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setOpen(!open)}
              className="md:hidden w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                background: open
                  ? "rgba(46,125,50,0.08)"
                  : "rgba(46,125,50,0.05)",
                color: open ? "var(--green-600)" : "var(--text-secondary)",
                border: `1.5px solid ${open ? "rgba(46,125,50,0.20)" : "transparent"}`,
              }}
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={open ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(26,46,26,0.25)", backdropFilter: "blur(4px)" }}
              onClick={() => setOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: EASE_STANDARD }}
              className="fixed top-[68px] left-3 right-3 z-50 md:hidden rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.97)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(46,125,50,0.12)",
                boxShadow: "0 16px 48px rgba(26,46,26,0.14), 0 4px 12px rgba(26,46,26,0.08)",
                maxHeight: "calc(100vh - 80px)",
                overflowY: "auto",
              }}
            >
              {/* Top gradient line */}
              <div
                className="h-[3px]"
                style={{
                  background: "linear-gradient(90deg, var(--green-400), var(--teal-400), var(--green-300))",
                }}
              />
              <div className="p-3 space-y-1">
                {NAV_LINKS.map((link, i) => {
                  const active = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 active:scale-[0.98]"
                        style={{
                          color: active ? "var(--green-600)" : "var(--text-secondary)",
                          background: active ? "rgba(46,125,50,0.08)" : "transparent",
                          borderLeft: active
                            ? "3px solid var(--green-400)"
                            : "3px solid transparent",
                          minHeight: "52px",
                        }}
                      >
                        {link.label}
                        {active && (
                          <span
                            className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: "rgba(46,125,50,0.10)",
                              color: "var(--green-600)",
                            }}
                          >
                            Aktif
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="pt-2 pb-1">
                  <Link
                    href="/species"
                    className="btn-primary w-full justify-center text-base py-3.5"
                    style={{ minHeight: "52px", borderRadius: "14px" }}
                  >
                    <LeafIcon className="w-5 h-5" />
                    Jelajahi Spesies
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
