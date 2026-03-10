"use client";

import Link from "next/link";
import { Mail, Instagram, ExternalLink } from "lucide-react";

function LeafIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 5.5-8 5.5C12.83 6.63 10.55 7 8 7C8.21 5.71 8 4 4 3c0 0 8-2 13 5z" />
    </svg>
  );
}

const STATUS_LEGEND = [
  { code: "CR", label: "Kritis", color: "var(--status-cr)" },
  { code: "EN", label: "Terancam", color: "var(--status-en)" },
  { code: "VU", label: "Rentan", color: "var(--status-vu)" },
];

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/species", label: "Direktori Spesies" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/contact", label: "Kontak" },
];

const SOURCES = [
  { label: "IUCN Red List", href: "https://iucnredlist.org" },
  { label: "WWF Indonesia", href: "https://wwf.id" },
  { label: "KLHK RI", href: "https://ppid.menlhk.go.id" },
  { label: "BRIN", href: "https://brin.go.id" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-muted)",
        borderTop: "1px solid var(--border-light)",
      }}
    >
      {/* Main */}
      <div className="container-main py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-4 group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--green-500)" }}
              >
                <span className="text-white">
                  <LeafIcon />
                </span>
              </div>
              <span
                className="font-bold text-base"
                style={{ color: "var(--text-primary)" }}
              >
                Nusantara
                <span style={{ color: "var(--green-500)" }}>Hijau</span>
              </span>
            </Link>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "var(--text-muted)" }}
            >
              Atlas digital keanekaragaman hayati Indonesia. Mengenal,
              mencintai, dan melestarikan.
            </p>

            {/* Status legend */}
            <div className="space-y-1.5">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Status IUCN
              </p>
              {STATUS_LEGEND.map((s) => (
                <div key={s.code} className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0"
                    style={{ background: s.color }}
                  >
                    {s.code}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--green-500)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-muted)")
                    }
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sumber */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Sumber Data
            </h4>
            <ul className="space-y-2.5">
              {SOURCES.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm transition-colors duration-200"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--green-500)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-muted)")
                    }
                  >
                    {s.label}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Kontak
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:nusantarahijau@example.com"
                className="flex items-center gap-3 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--green-100)" }}
                >
                  <Mail
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--green-500)" }}
                  />
                </div>
                <span
                  className="text-sm group-hover:text-green-600 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  nusantarahijau@example.com
                </span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--green-100)" }}
                >
                  <Instagram
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--green-500)" }}
                  />
                </div>
                <span
                  className="text-sm group-hover:text-green-600 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  @nusantarahijau
                </span>
              </a>
            </div>

            {/* Note */}
            <div
              className="mt-5 p-3 rounded-xl text-xs leading-relaxed"
              style={{
                background: "var(--green-50)",
                border: "1px solid var(--green-100)",
                color: "var(--text-muted)",
              }}
            >
              Data bersumber dari{" "}
              <strong style={{ color: "var(--green-600)" }}>IUCN</strong>,{" "}
              <strong style={{ color: "var(--green-600)" }}>WWF</strong>, dan{" "}
              <strong style={{ color: "var(--green-600)" }}>KLHK</strong>.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border-light)" }}>
        <div className="container-main py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
            © 2026 NusantaraHijau · Dibuat untuk TECHSOFT 2026
          </p>
          <p
            className="text-xs flex items-center gap-1"
            style={{ color: "var(--text-faint)" }}
          >
            Dibuat dengan
            <svg
              className="w-3.5 h-3.5 text-red-400 fill-red-400 mx-0.5"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            untuk alam Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
