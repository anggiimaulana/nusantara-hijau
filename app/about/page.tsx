"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Database,
  ExternalLink,
  Globe,
  Heart,
  Leaf,
  Shield,
  Sparkles,
  TreePine,
  Users,
} from "lucide-react";
import Link from "next/link";

const MISSIONS = [
  {
    num: "01", icon: <Globe className="w-5 h-5" strokeWidth={2.5} />, color: "var(--pg-accent)",
    title: "Mengenalkan",
    desc: "Memperkenalkan flora dan fauna endemik Indonesia kepada masyarakat luas melalui visualisasi yang menarik dan informasi yang akurat.",
  },
  {
    num: "02", icon: <Heart className="w-5 h-5" strokeWidth={2.5} />, color: "var(--pg-pink)",
    title: "Mencintai",
    desc: "Membangun rasa cinta dan kebanggaan terhadap keanekaragaman hayati Indonesia — warisan tak ternilai bagi generasi mendatang.",
  },
  {
    num: "03", icon: <Shield className="w-5 h-5" strokeWidth={2.5} />, color: "var(--pg-mint)",
    title: "Melestarikan",
    desc: "Mendorong aksi nyata konservasi dengan menyajikan informasi status perlindungan dan langkah konkret yang bisa dilakukan siapa saja.",
  },
];

const FACTS = [
  { value: "17.000+", label: "Pulau di Indonesia", color: "var(--pg-amber)" },
  { value: "#2", label: "Negara Megabiodiversitas", color: "var(--pg-accent)" },
  { value: "515+", label: "Spesies Mamalia Endemik", color: "var(--pg-pink)" },
  { value: "1.500+", label: "Spesies Burung Tercatat", color: "var(--pg-mint)" },
  { value: "7.500+", label: "Spesies Tumbuhan Berbunga", color: "var(--pg-amber)" },
  { value: "37%", label: "Hutan Tropis Asia ada di sini", color: "var(--pg-accent)" },
];

const SOURCES = [
  { name: "IUCN Red List", desc: "Basis data status konservasi global", url: "https://iucnredlist.org", icon: <BookOpen className="w-4 h-4" strokeWidth={2.5} />, color: "var(--pg-accent)" },
  { name: "WWF Indonesia", desc: "Data perlindungan satwa liar Indonesia", url: "https://wwf.id", icon: <Leaf className="w-4 h-4" strokeWidth={2.5} />, color: "var(--pg-mint)" },
  { name: "KLHK — Kementerian LHK", desc: "Otoritas pengelolaan alam Indonesia", url: "https://ppid.menlhk.go.id", icon: <Shield className="w-4 h-4" strokeWidth={2.5} />, color: "var(--pg-pink)" },
  { name: "BRIN", desc: "Lembaga riset keanekaragaman hayati", url: "https://brin.go.id", icon: <Database className="w-4 h-4" strokeWidth={2.5} />, color: "var(--pg-amber)" },
  { name: "Wikimedia Commons", desc: "Foto dan media Creative Commons", url: "https://commons.wikimedia.org", icon: <Globe className="w-4 h-4" strokeWidth={2.5} />, color: "var(--pg-accent)" },
  { name: "iNaturalist", desc: "Citizen science keanekaragaman hayati", url: "https://inaturalist.org", icon: <Users className="w-4 h-4" strokeWidth={2.5} />, color: "var(--pg-mint)" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.10 } } };

export default function AboutPage() {
  return (
    <main style={{ background: "var(--pg-bg)" }} className="min-h-screen">

      {/* ─── HERO ─── */}
      <section
        className="relative py-12 overflow-hidden"
        style={{ background: "var(--pg-dark)", borderBottom: "3px solid var(--border-hard)" }}
      >
        <div className="absolute inset-0 bg-dots-dark opacity-40 pointer-events-none" />

        {/* Deco shapes */}
        <motion.div
          animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-16 right-16 w-20 h-20 rounded-2xl hidden sm:block"
          style={{ background: "var(--pg-accent)", border: "2px solid rgba(255,255,255,0.3)", opacity: 0.30, transform: "rotate(15deg)" }}
        />
        <div className="absolute bottom-8 left-8 w-14 h-14 rounded-full opacity-20" style={{ background: "var(--pg-amber)" }} />
        <div className="absolute top-32 left-1/3 w-8 h-8 rounded-full opacity-15" style={{ background: "var(--pg-pink)" }} />

        <div className="container-main relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.span variants={fadeUp} className="section-eyebrow mb-4" style={{ color: "var(--pg-amber)" }}>
              <TreePine className="w-3.5 h-3.5" strokeWidth={2.5} /> Tentang NusantaraHijau
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-white mb-5"
              style={{
                fontFamily: "var(--font-heading)", fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-0.02em",
              }}
            >
              Menjaga Harapan untuk
              <br className="hidden md:block" />
              <span style={{ color: "var(--pg-amber)" }}> Satwa & Puspa Nusantara</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base max-w-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
              Platform edukasi digital untuk mengenal, mencintai, dan melestarikan
              keanekaragaman hayati Indonesia. Dibuat untuk TECHSOFT 2026.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── QUOTE ─── */}
      <section className="relative py-12 overflow-hidden" style={{ background: "var(--pg-bg)", borderBottom: "2px solid var(--border-hard)" }}>
        <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />

        {/* Geometric deco */}
        <motion.div
          animate={{ y: [0, -16, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 right-16 w-16 h-16 rounded-2xl hidden lg:block"
          style={{ background: "var(--pg-accent)", border: "2px solid var(--border-hard)", boxShadow: "var(--shadow-hard)", transform: "rotate(12deg)" }}
        />
        <motion.div
          animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-8 right-1/3 w-10 h-10 rounded-full hidden lg:block"
          style={{ background: "var(--pg-pink)", border: "2px solid var(--border-hard)", boxShadow: "var(--shadow-hard)" }}
        />
        <div
          className="absolute top-36 left-8 w-12 h-12 hidden lg:block"
          style={{ border: "3px solid var(--pg-amber)", borderRadius: "6px", opacity: 0.4, transform: "rotate(20deg)" }}
        />

        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="text-4xl mb-4">🌿</div>
            <p
              className="mb-4 squiggle-underline inline-block"
              style={{
                fontFamily: "var(--font-heading)", fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "var(--text-primary)",
                lineHeight: 1.3,
              }}
            >
              &ldquo;Kita tidak akan menjaga apa yang tidak kita kenal.&rdquo;
            </p>
            <p className="text-sm font-bold mt-4" style={{ color: "var(--text-muted)", fontFamily: "var(--font-heading)" }}>
              — Prinsip Dasar Konservasi
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── MISSION ─── */}
      <section className="py-20 sm:py-24">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-12">
              <span className="section-eyebrow"><Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} /> Misi Kami</span>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
                Tiga Pilar <span style={{ color: "var(--pg-accent)" }}>Konservasi</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MISSIONS.map((m) => (
                <motion.div
                  key={m.num}
                  variants={fadeUp}
                  whileHover={{ rotate: -1, scale: 1.02, boxShadow: `6px 6px 0px ${m.color}` }}
                  className="relative p-7 rounded-3xl overflow-hidden"
                  style={{
                    background: "white", border: "2px solid var(--border-hard)",
                    boxShadow: "4px 4px 0px var(--border-hard)",
                    borderTop: `5px solid ${m.color}`,
                    transition: "box-shadow 0.2s",
                  }}
                >
                  {/* Watermark number */}
                  <span
                    className="absolute -bottom-2 -right-2 font-black select-none"
                    style={{ fontFamily: "var(--font-heading)", fontSize: "6rem", lineHeight: 1, color: m.color, opacity: 0.08 }}
                  >
                    {m.num}
                  </span>
                  <div className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: m.color, color: "white" }}>
                    {m.icon}
                  </div>
                  <h3 className="relative z-10 text-xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>{m.title}</h3>
                  <p className="relative z-10 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FACTS ─── */}
      <section className="py-20 sm:py-24" style={{ background: "var(--pg-dark)", borderTop: "3px solid var(--border-hard)", borderBottom: "3px solid var(--border-hard)" }}>
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <span className="section-eyebrow justify-center" style={{ color: "var(--pg-amber)" }}>
                <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} /> Fakta Mengagumkan
              </span>
              <h2 className="text-white" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
                Indonesia dalam <span style={{ color: "var(--pg-amber)" }}>Angka</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {FACTS.map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ rotate: -1, scale: 1.05, boxShadow: `5px 5px 0px ${f.color}` }}
                  className="p-5 rounded-2xl text-center"
                  style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "3px 3px 0px var(--border-hard)", transition: "box-shadow 0.2s" }}
                >
                  <div className="font-bold mb-1.5" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: f.color }}>
                    {f.value}
                  </div>
                  <p className="text-[10px] font-bold leading-tight uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{f.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SOURCES ─── */}
      <section className="py-20 sm:py-24">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-10">
              <span className="section-eyebrow"><Database className="w-3.5 h-3.5" strokeWidth={2.5} /> Transparansi Data</span>
              <h2 className="mb-3" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
                Sumber Data & <span style={{ color: "var(--pg-accent)" }}>Referensi</span>
              </h2>
              <p className="text-sm max-w-xl" style={{ color: "var(--text-secondary)" }}>
                Semua data bersumber dari institusi terpercaya internasional dan nasional.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SOURCES.map((s) => (
                <motion.a
                  key={s.name}
                  variants={fadeUp}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-5 rounded-2xl transition-all"
                  style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "3px 3px 0px var(--border-hard)" }}
                  whileHover={{ rotate: -0.5, boxShadow: `5px 5px 0px ${s.color}` }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color, color: "white" }}>
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>{s.name}</h3>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60" style={{ color: s.color }} />
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16" style={{ borderTop: "2px solid var(--border-hard)" }}>
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center"
            style={{ background: "var(--pg-accent)", border: "3px solid var(--border-hard)", boxShadow: "8px 8px 0px var(--border-hard)" }}
          >
            <div className="absolute inset-0 bg-dots-dark opacity-30 pointer-events-none" />
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20" style={{ background: "var(--pg-amber)" }} />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🌿</div>
              <h2 className="text-white font-bold mb-3" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
                Mulai Menjelajah Warisan Alam
              </h2>
              <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.75)" }}>
                Kenali lebih dari 50 spesies endemik Indonesia dan ambil bagian dalam pelestarian alam Nusantara.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/species" className="btn-ghost-dark py-3.5 px-8">
                  Jelajahi Spesies →
                </Link>
                <Link href="/contact" className="btn-ghost-dark py-3.5 px-8">
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
