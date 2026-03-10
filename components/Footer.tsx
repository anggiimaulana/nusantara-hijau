import Link from "next/link";
import { Leaf, Instagram, Mail, Heart, ExternalLink } from "lucide-react";

const footerLinks = {
  navigasi: [
    { href: "/", label: "Beranda" },
    { href: "/species", label: "Spesies" },
    { href: "/about", label: "Tentang Kami" },
    { href: "/contact", label: "Kontak" },
  ],
  konservasi: [
    { href: "https://www.wwf.id", label: "WWF Indonesia", external: true },
    { href: "https://iucnredlist.org", label: "IUCN Red List", external: true },
    { href: "https://www.brin.go.id", label: "BRIN Indonesia", external: true },
    { href: "https://ppid.menlhk.go.id", label: "KLHK", external: true },
  ],
};

const statusList = [
  { label: "Kritis (CR)", color: "#E74C3C" },
  { label: "Terancam (EN)", color: "#E67E22" },
  { label: "Rentan (VU)", color: "#F1C40F" },
];

export default function Footer() {
  return (
    <footer className="bg-[#060E1A] border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2ECC71] to-[#1a8a4a] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="font-bold text-white text-base"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Nusantara
                </span>
                <span className="text-[#2ECC71] text-[10px] font-semibold tracking-[0.2em] uppercase">
                  Hijau
                </span>
              </div>
            </Link>
            <p className="text-[#90A4AE] text-sm leading-relaxed mb-6">
              Atlas digital keanekaragaman hayati Indonesia. Mengenal,
              mencintai, dan melestarikan kekayaan alam Nusantara.
            </p>
            {/* Status Legend */}
            <div className="space-y-2">
              <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-3">
                Status Konservasi
              </p>
              {statusList.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-[#90A4AE] text-xs">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
              Navigasi
            </h4>
            <ul className="space-y-3">
              {footerLinks.navigasi.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#90A4AE] text-sm hover:text-[#2ECC71] transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[#2ECC71] transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Link Konservasi */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
              Sumber & Referensi
            </h4>
            <ul className="space-y-3">
              {footerLinks.konservasi.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#90A4AE] text-sm hover:text-[#2ECC71] transition-colors duration-200 flex items-center gap-1.5"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
              Hubungi Kami
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:nusantarahijau@example.com"
                className="flex items-center gap-3 text-[#90A4AE] text-sm hover:text-[#2ECC71] transition-colors duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#2ECC71]/30 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                nusantarahijau@example.com
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#90A4AE] text-sm hover:text-[#2ECC71] transition-colors duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#2ECC71]/30 transition-colors">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                @nusantarahijau
              </a>
            </div>

            {/* Data Sources Note */}
            <div className="mt-6 p-3 rounded-xl bg-white/3 border border-white/5">
              <p className="text-[#90A4AE] text-xs leading-relaxed">
                Data spesies bersumber dari{" "}
                <span className="text-[#2ECC71]">IUCN Red List</span>,{" "}
                <span className="text-[#2ECC71]">WWF Indonesia</span>, dan{" "}
                <span className="text-[#2ECC71]">KLHK</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#90A4AE] text-xs">
            © 2026 NusantaraHijau. Dibuat untuk kompetisi TECHSOFT 2026.
          </p>
          <p className="text-[#90A4AE] text-xs flex items-center gap-1">
            Dibuat dengan{" "}
            <Heart className="w-3 h-3 text-[#E74C3C] fill-[#E74C3C]" /> untuk
            alam Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
