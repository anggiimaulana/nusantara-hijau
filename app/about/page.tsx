import type { Metadata } from "next";
import Link from "next/link";
import {
  Leaf,
  Eye,
  Heart,
  Shield,
  Users,
  Database,
  ExternalLink,
  ArrowRight,
  Globe,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "NusantaraHijau adalah atlas digital keanekaragaman hayati Indonesia yang dibuat untuk mengenalkan, mencintai, dan melestarikan flora fauna endemik Nusantara.",
};

// ============================================
// DATA
// ============================================
const MISSIONS = [
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Mengenalkan",
    desc: "Memperkenalkan kekayaan flora dan fauna endemik Indonesia kepada masyarakat luas melalui visualisasi yang menarik dan informasi yang akurat.",
    color: "#3498DB",
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Mencintai",
    desc: "Membangun rasa cinta dan kebanggaan terhadap keanekaragaman hayati Indonesia yang merupakan warisan tak ternilai bagi generasi mendatang.",
    color: "#E74C3C",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Melestarikan",
    desc: "Mendorong aksi nyata konservasi dengan menyajikan informasi ancaman, status perlindungan, dan langkah konkret yang bisa dilakukan siapa saja.",
    color: "#2ECC71",
  },
];

const SOURCES = [
  {
    name: "IUCN Red List",
    desc: "Basis data status konservasi spesies terlengkap dan terpercaya di dunia, dikelola oleh International Union for Conservation of Nature.",
    url: "https://iucnredlist.org",
    color: "#E74C3C",
  },
  {
    name: "WWF Indonesia",
    desc: "World Wide Fund for Nature Indonesia — organisasi konservasi terkemuka yang menyediakan data ancaman dan program perlindungan satwa.",
    url: "https://wwf.id",
    color: "#27AE60",
  },
  {
    name: "KLHK — Kementerian LHK",
    desc: "Kementerian Lingkungan Hidup dan Kehutanan Republik Indonesia sebagai otoritas resmi pengelolaan sumber daya alam dan konservasi.",
    url: "https://ppid.menlhk.go.id",
    color: "#3498DB",
  },
  {
    name: "BRIN — Badan Riset Inovasi Nasional",
    desc: "Lembaga riset nasional Indonesia yang mengelola penelitian ilmiah tentang keanekaragaman hayati dan ekosistem Nusantara.",
    url: "https://brin.go.id",
    color: "#9B59B6",
  },
  {
    name: "Wikimedia Commons",
    desc: "Repositori media bebas lisensi Creative Commons yang menyediakan foto-foto spesies berkualitas tinggi untuk keperluan edukasi.",
    url: "https://commons.wikimedia.org",
    color: "#F39C12",
  },
  {
    name: "iNaturalist",
    desc: "Platform citizen science global untuk observasi keanekaragaman hayati dengan foto-foto spesies berlisensi terbuka dari seluruh dunia.",
    url: "https://inaturalist.org",
    color: "#1ABC9C",
  },
];

const FACTS = [
  { value: "17.000+", label: "Pulau di Indonesia", color: "#2ECC71" },
  { value: "#2", label: "Negara Megabiodiversitas Dunia", color: "#3498DB" },
  { value: "515+", label: "Spesies Mamalia Endemik", color: "#E67E22" },
  { value: "1.500+", label: "Spesies Burung Tercatat", color: "#F1C40F" },
  { value: "7.500+", label: "Spesies Tumbuhan Berbunga", color: "#9B59B6" },
  {
    value: "37%",
    label: "Hutan Tropis Asia ada di Indonesia",
    color: "#E74C3C",
  },
];

const STATUS_GUIDE = [
  {
    code: "CR",
    label: "Kritis",
    color: "#E74C3C",
    bg: "rgba(231,76,60,0.08)",
    border: "rgba(231,76,60,0.2)",
    desc: "Critically Endangered — menghadapi risiko kepunahan sangat tinggi di alam liar dalam waktu dekat.",
  },
  {
    code: "EN",
    label: "Terancam",
    color: "#E67E22",
    bg: "rgba(230,126,34,0.08)",
    border: "rgba(230,126,34,0.2)",
    desc: "Endangered — menghadapi risiko kepunahan tinggi di alam liar jika faktor ancaman tidak ditangani.",
  },
  {
    code: "VU",
    label: "Rentan",
    color: "#F1C40F",
    bg: "rgba(241,196,15,0.08)",
    border: "rgba(241,196,15,0.2)",
    desc: "Vulnerable — menghadapi risiko kepunahan cukup tinggi jika kondisi habitat dan ancaman tidak membaik.",
  },
];

// ============================================
// ABOUT PAGE
// ============================================
export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* ==================== HERO ==================== */}
      <section className="section-container px-4 mb-20">
        <div
          className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-light)",
          }}
        >
          {/* BG effects */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(46,204,113,0.07) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--green-400), transparent)",
            }}
          />

          <div className="relative z-10">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto"
              style={{
                background: "var(--green-50)",
                border: "1px solid var(--border-light)",
              }}
            >
              <Leaf className="w-8 h-8" style={{ color: "#2ECC71" }} />
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight"
              style={{
                fontFamily: "var(--font-playfair), serif",
                color: "var(--text-primary)",
              }}
            >
              Tentang
              <span className="gradient-text"> NusantaraHijau</span>
            </h1>
            <p
              className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Atlas digital keanekaragaman hayati Indonesia — sebuah upaya kecil
              untuk memperkenalkan kekayaan alam Nusantara yang luar biasa
              kepada dunia, sebelum terlambat.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== LATAR BELAKANG ==================== */}
      <section className="section-container px-4 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#2ECC71" }}
            >
              Latar Belakang
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-5"
              style={{
                fontFamily: "var(--font-playfair), serif",
                color: "var(--text-primary)",
              }}
            >
              Indonesia, Surga Hayati
              <span className="gradient-text"> yang Terancam</span>
            </h2>
            <div
              className="space-y-4 text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              <p>
                Indonesia adalah salah satu negara dengan keanekaragaman hayati
                tertinggi di dunia. Dengan hanya 1,3% luas daratan dunia,
                Indonesia menyimpan sekitar{" "}
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  10% spesies tumbuhan berbunga
                </span>
                , lebih dari{" "}
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  12% mamalia
                </span>
                , dan{" "}
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  17% burung
                </span>{" "}
                seluruh dunia.
              </p>
              <p>
                Namun kekayaan ini terancam hilang. Deforestasi, perburuan liar,
                dan perubahan iklim telah mendorong ratusan spesies ke ambang
                kepunahan. Banyak dari mereka bahkan belum sempat dikenal oleh
                masyarakat Indonesia sendiri.
              </p>
              <p>
                NusantaraHijau hadir untuk menjembatani jarak antara data
                konservasi yang kompleks dengan pemahaman publik yang lebih luas
                — karena kami percaya,{" "}
                <span className="font-semibold" style={{ color: "#2ECC71" }}>
                  kita tidak akan mau menjaga apa yang tidak kita kenal.
                </span>
              </p>
            </div>
          </div>

          {/* Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {FACTS.map((fact, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl text-center group transition-all duration-300"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <div
                  className="text-2xl sm:text-3xl font-bold mb-1"
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    color: fact.color,
                  }}
                >
                  {fact.value}
                </div>
                <div
                  className="text-xs leading-tight"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {fact.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MISI ==================== */}
      <section
        className="py-20 mb-20"
        style={{
          background: "rgba(250, 252, 249, 0.5)",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="section-container px-4">
          <div className="text-center mb-12">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#2ECC71" }}
            >
              Misi Kami
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{
                fontFamily: "var(--font-playfair), serif",
                color: "var(--text-primary)",
              }}
            >
              Tiga Pilar
              <span className="gradient-text"> NusantaraHijau</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MISSIONS.map((m, i) => (
              <div
                key={i}
                className="relative p-6 rounded-2xl group transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-light)",
                }}
              >
                {/* Number */}
                <div
                  className="absolute top-5 right-5 text-5xl font-bold opacity-5"
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    color: m.color,
                  }}
                >
                  {i + 1}
                </div>

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${m.color}15`, color: m.color }}
                >
                  {m.icon}
                </div>
                <h3
                  className="font-bold text-xl mb-3"
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    color: "var(--text-primary)",
                  }}
                >
                  {m.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {m.desc}
                </p>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl"
                  style={{ backgroundColor: m.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PANDUAN STATUS ==================== */}
      <section className="section-container px-4 mb-20">
        <div className="text-center mb-10">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#2ECC71" }}
          >
            Panduan
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{
              fontFamily: "var(--font-playfair), serif",
              color: "var(--text-primary)",
            }}
          >
            Memahami Status
            <span className="gradient-text"> Konservasi IUCN</span>
          </h2>
          <p
            className="text-sm max-w-lg mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Setiap spesies di NusantaraHijau dikategorikan berdasarkan sistem
            penilaian IUCN Red List yang diakui secara internasional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {STATUS_GUIDE.map((s) => (
            <div
              key={s.code}
              className="p-5 rounded-2xl border"
              style={{ backgroundColor: s.bg, borderColor: s.border }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: `${s.color}20`, color: s.color }}
                >
                  {s.code}
                </span>
                <span
                  className="font-bold text-lg"
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    color: s.color,
                  }}
                >
                  {s.label}
                </span>
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== SUMBER DATA ==================== */}
      <section
        className="py-20 mb-20"
        style={{
          background: "rgba(250, 252, 249, 0.5)",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="section-container px-4">
          <div className="text-center mb-12">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#2ECC71" }}
            >
              Transparansi Data
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{
                fontFamily: "var(--font-playfair), serif",
                color: "var(--text-primary)",
              }}
            >
              Sumber Data &<span className="gradient-text"> Referensi</span>
            </h2>
            <p
              className="text-sm max-w-lg mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              Semua informasi di NusantaraHijau bersumber dari lembaga dan
              organisasi terpercaya di bidang konservasi dan keanekaragaman
              hayati.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOURCES.map((src) => (
              <a
                key={src.name}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${src.color}15` }}
                  >
                    <Database
                      className="w-4 h-4"
                      style={{ color: src.color }}
                    />
                  </div>
                  <ExternalLink
                    className="w-3.5 h-3.5 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  />
                </div>
                <h3
                  className="font-bold text-base mb-2 group-hover:transition-colors"
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    color: "var(--text-primary)",
                  }}
                >
                  {src.name}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {src.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DISCLAIMER ==================== */}
      <section className="section-container px-4 mb-20">
        <div
          className="p-6 rounded-2xl"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid rgba(241, 196, 15, 0.15)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "rgba(241, 196, 15, 0.1)" }}
            >
              <BookOpen className="w-4 h-4" style={{ color: "#F1C40F" }} />
            </div>
            <div>
              <h3
                className="font-bold text-base mb-2"
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  color: "var(--text-primary)",
                }}
              >
                Catatan Penting
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                NusantaraHijau adalah platform edukasi non-komersial yang dibuat
                untuk keperluan kompetisi TECHSOFT 2026. Data spesies bersumber
                dari referensi terpercaya dan telah diparafrase untuk keperluan
                edukasi publik. Foto spesies digunakan dari sumber berlisensi
                Creative Commons dengan atribusi yang sesuai. Jika menemukan
                ketidakakuratan informasi, silakan hubungi kami melalui halaman
                Kontak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="section-container px-4">
        <div
          className="relative rounded-3xl overflow-hidden p-10 sm:p-14 text-center"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-light)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(46,204,113,0.08) 0%, transparent 65%)",
            }}
          />
          <div className="relative z-10">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 mx-auto"
              style={{
                background: "var(--green-50)",
                border: "1px solid var(--border-light)",
              }}
            >
              <Globe className="w-7 h-7" style={{ color: "#2ECC71" }} />
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{
                fontFamily: "var(--font-playfair), serif",
                color: "var(--text-primary)",
              }}
            >
              Siap Menjelajah
              <span className="gradient-text"> Nusantara?</span>
            </h2>
            <p
              className="text-sm max-w-md mx-auto mb-7 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Mulai perjalananmu mengenal kekayaan hayati Indonesia. Temukan
              spesies-spesies menakjubkan yang mungkin belum pernah kamu dengar
              sebelumnya.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/species"
                className="group inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg"
                style={{
                  background: "linear-gradient(to right, #2ECC71, #27AE60)",
                  color: "white",
                }}
              >
                <Leaf className="w-4 h-4" />
                Jelajahi Spesies
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-2xl transition-all duration-300"
                style={{
                  background: "var(--bg-muted)",
                  border: "1px solid var(--border-light)",
                  color: "var(--text-primary)",
                }}
              >
                <Users className="w-4 h-4" />
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
