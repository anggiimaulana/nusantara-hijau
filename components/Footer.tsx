"use client";

import { ArrowUp, ExternalLink, Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";

function LeafIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 5.5-8 5.5C12.83 6.63 10.55 7 8 7C8.21 5.71 8 4 4 3c0 0 8-2 13 5z" />
    </svg>
  );
}

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
  { label: "Badan Riset & Inovasi", href: "https://brin.go.id" },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden pt-24 pb-8" style={{ background: "var(--bg-muted)", borderTop: "1px solid var(--border-light)" }}>
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
      <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-main relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-20">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col items-start pr-0 lg:pr-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                style={{ background: "linear-gradient(135deg, var(--green-600), var(--green-400))" }}
              >
                <span className="text-white"><LeafIcon /></span>
              </div>
              <div>
                <span className="block font-bold text-2xl tracking-tight mb-0.5" style={{ color: "var(--text-primary)" }}>
                  Nusantara<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Hijau</span>
                </span>
                <span className="block text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--green-600)" }}>
                  Atlas Hayati Indonesia
                </span>
              </div>
            </Link>
            
            <p className="text-sm leading-relaxed mb-8 max-w-sm" style={{ color: "var(--text-muted)" }}>
              Menjaga asa untuk satwa dan puspa Nusantara. Platform edukasi digital untuk mengenal, mencintai, dan melestarikan warisan alam Indonesia yang tak ternilai harganya.
            </p>

            <div className="flex items-center gap-4">
              {[
                { icon: Instagram, href: "https://instagram.com" },
                { icon: Facebook, href: "https://facebook.com" },
                { icon: Twitter, href: "https://twitter.com" },
                { icon: Mail, href: "mailto:halo@nusantarahijau.id" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--green-600)";
                    e.currentTarget.style.borderColor = "var(--green-300)";
                    e.currentTarget.style.background = "var(--green-50)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.borderColor = "var(--border-light)";
                    e.currentTarget.style.background = "var(--bg-surface)";
                  }}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "var(--green-700)" }}>Navigasi Utama</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center gap-2 text-sm transition-colors" style={{ color: "var(--text-muted)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-green-500 transition-colors" />
                    <span className="group-hover:text-green-700 transition-colors">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "var(--green-700)" }}>Data & Referensi</h4>
            <ul className="space-y-4">
              {SOURCES.map((source) => (
                <li key={source.label}>
                  <a href={source.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-sm transition-colors" style={{ color: "var(--text-muted)" }}>
                    <span className="group-hover:text-green-700 transition-colors">{source.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-green-500" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Call to Action Col */}
          <div className="lg:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "var(--green-700)" }}>Mulai Aksi</h4>
            <div className="p-5 rounded-2xl border relative overflow-hidden group shadow-sm" style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)" }}>
              <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="text-xs leading-relaxed mb-4 relative z-10" style={{ color: "var(--text-muted)" }}>
                Jadilah bagian dari gerakan konservasi. Berlangganan buletin kami untuk info satwa dan inisiatif terbaru.
              </p>
              <div className="relative z-10 flex flex-col gap-2">
                <input 
                  type="email" 
                  placeholder="Alamat email..." 
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors shadow-inner"
                  style={{
                    background: "var(--bg-base)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--green-400)";
                    e.currentTarget.style.boxShadow = "var(--shadow-glow)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-light)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button 
                  className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                  style={{ background: "var(--green-600)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--green-500)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "var(--green-600)"}
                >
                  Berlangganan
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--border-light)" }}>
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} NusantaraHijau. Didedikasikan untuk TECHSOFT 2026.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              Dibuat dengan Sempurna di Indonesia
            </p>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all group"
              aria-label="Kembali ke atas"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-light)",
                color: "var(--text-muted)",
              }}
              onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--green-600)";
                    e.currentTarget.style.borderColor = "var(--green-300)";
                    e.currentTarget.style.background = "var(--green-50)";
              }}
              onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.borderColor = "var(--border-light)";
                    e.currentTarget.style.background = "var(--bg-surface)";
              }}
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
