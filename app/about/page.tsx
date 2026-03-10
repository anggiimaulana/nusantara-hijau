"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    BookOpen,
    Database,
    ExternalLink,
    Eye,
    Globe,
    Heart,
    Leaf,
    Shield,
    Users,
} from "lucide-react";
import Link from "next/link";

// ============================================
// DATA & ANIMATIONS
// ============================================
const MISSIONS = [
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Mengenalkan",
    desc: "Memperkenalkan kekayaan flora dan fauna endemik Indonesia kepada masyarakat luas melalui visualisasi yang menarik dan informasi yang akurat.",
    color: "#2196F3",
    num: "01",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Mencintai",
    desc: "Membangun rasa cinta dan kebanggaan terhadap keanekaragaman hayati Indonesia yang merupakan warisan tak ternilai bagi generasi mendatang.",
    color: "#E74C3C",
    num: "02",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Melestarikan",
    desc: "Mendorong aksi nyata konservasi dengan menyajikan informasi ancaman, status perlindungan, dan langkah konkret yang bisa dilakukan siapa saja.",
    color: "var(--green-500)",
    num: "03",
  },
];

const SOURCES = [
  { name: "IUCN Red List", desc: "Basis data status konservasi spesies terlengkap dan terpercaya di dunia.", url: "https://iucnredlist.org", color: "#E74C3C" },
  { name: "WWF Indonesia", desc: "World Wide Fund for Nature Indonesia — data ancaman dan program perlindungan satwa.", url: "https://wwf.id", color: "#27AE60" },
  { name: "KLHK — Kementerian LHK", desc: "Otoritas resmi pengelolaan sumber daya alam dan konservasi Indonesia.", url: "https://ppid.menlhk.go.id", color: "#3498DB" },
  { name: "BRIN", desc: "Lembaga riset nasional yang mengelola penelitian keanekaragaman hayati Nusantara.", url: "https://brin.go.id", color: "#9B59B6" },
  { name: "Wikimedia Commons", desc: "Repositori media Creative Commons — foto spesies berkualitas tinggi untuk edukasi.", url: "https://commons.wikimedia.org", color: "#F39C12" },
  { name: "iNaturalist", desc: "Platform citizen science global untuk observasi keanekaragaman hayati dunia.", url: "https://inaturalist.org", color: "#1ABC9C" },
];

const FACTS = [
  { value: "17.000+", label: "Pulau di Indonesia", color: "#2ECC71" },
  { value: "#2", label: "Negara Megabiodiversitas", color: "#3498DB" },
  { value: "515+", label: "Spesies Mamalia Endemik", color: "#E67E22" },
  { value: "1.500+", label: "Spesies Burung Tercatat", color: "#F1C40F" },
  { value: "7.500+", label: "Spesies Tumbuhan Berbunga", color: "#9B59B6" },
  { value: "37%", label: "Hutan Tropis Asia ada di Indonesia", color: "#E74C3C" },
];

const STATUS_GUIDE = [
  {
    code: "CR",
    label: "Kritis",
    color: "#E74C3C",
    bg: "rgba(231,76,60,0.07)",
    border: "rgba(231,76,60,0.18)",
    bar: "#E74C3C",
    desc: "Critically Endangered — menghadapi risiko kepunahan sangat tinggi di alam liar dalam waktu dekat.",
  },
  {
    code: "EN",
    label: "Terancam",
    color: "#E67E22",
    bg: "rgba(230,126,34,0.07)",
    border: "rgba(230,126,34,0.18)",
    bar: "#E67E22",
    desc: "Endangered — menghadapi risiko kepunahan tinggi di alam liar jika faktor ancaman tidak ditangani.",
  },
  {
    code: "VU",
    label: "Rentan",
    color: "#F1C40F",
    bg: "rgba(241,196,15,0.07)",
    border: "rgba(241,196,15,0.18)",
    bar: "#F1C40F",
    desc: "Vulnerable — menghadapi risiko kepunahan cukup tinggi jika kondisi habitat dan ancaman tidak membaik.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// ============================================
// ABOUT PAGE
// ============================================
export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 lg:pb-32" style={{ background: "var(--bg-base)" }}>

      {/* ===== HERO ===== */}
      <section className="container-main px-4 mb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden p-10 sm:p-14 lg:p-20 text-center shadow-xl"
          style={{
            background: "linear-gradient(135deg, var(--bg-surface) 0%, rgba(237,247,237,0.6) 100%)",
            border: "1px solid var(--border-light)",
          }}
        >
          {/* BG layered effects */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 40% 60%, rgba(46,204,113,0.09) 0%, transparent 65%)" }}
          />
          <div className="absolute inset-0 pointer-events-none dot-pattern opacity-40" />
          
          {/* Top gradient line */}
          <div
            className="absolute top-0 left-0 right-0 h-[4px]"
            style={{ background: "linear-gradient(90deg, transparent, var(--green-400), var(--teal-400), var(--green-300), transparent)" }}
          />

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto shadow-sm"
              style={{
                background: "linear-gradient(135deg, rgba(46,125,50,0.12), rgba(38,166,154,0.10))",
                border: "1px solid rgba(46,125,50,0.15)",
              }}
            >
              <Leaf className="w-8 h-8" style={{ color: "var(--green-500)" }} />
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-bold mb-5 leading-tight"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontFamily: "var(--font-playfair), serif",
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Tentang{" "}
              <span className="text-gradient">NusantaraHijau</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Atlas digital keanekaragaman hayati Indonesia — sebuah upaya kecil untuk memperkenalkan kekayaan alam Nusantara yang luar biasa kepada dunia, sebelum terlambat.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== LATAR BELAKANG ===== */}
      <section className="container-main px-4 mb-32 overflow-hidden mt-16 lg:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold tracking-[0.14em] uppercase mb-3" style={{ color: "var(--green-500)" }}>
              Latar Belakang
            </p>
            <h2
              className="font-bold mb-5 leading-tight"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontFamily: "var(--font-playfair), serif",
                color: "var(--text-primary)",
              }}
            >
              Indonesia, Surga Hayati{" "}
              <span className="text-gradient">yang Terancam</span>
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <p>
                Indonesia adalah salah satu negara dengan keanekaragaman hayati tertinggi di dunia. Dengan hanya 1,3% luas daratan dunia, Indonesia menyimpan sekitar{" "}
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>10% spesies tumbuhan berbunga</span>, lebih dari{" "}
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>12% mamalia</span>, dan{" "}
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>17% burung</span>{" "}
                seluruh dunia.
              </p>
              <p>
                Namun kekayaan ini terancam hilang. Deforestasi, perburuan liar, dan perubahan iklim telah mendorong ratusan spesies ke ambang kepunahan. Banyak dari mereka bahkan belum sempat dikenal oleh masyarakat Indonesia sendiri.
              </p>
              <p>
                NusantaraHijau hadir untuk menjembatani jarak antara data konservasi yang kompleks dengan pemahaman publik yang lebih luas — karena kami percaya,{" "}
                <span className="font-semibold" style={{ color: "var(--green-500)" }}>
                  kita tidak akan mau menjaga apa yang tidak kita kenal.
                </span>
              </p>
            </div>
          </motion.div>

          {/* Facts grid */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {FACTS.map((fact, i) => (
              <motion.div
                variants={fadeUp}
                key={i}
                className="p-5 rounded-2xl text-center group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-light)",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                {/* Top color accent */}
                <div className="h-[4px] rounded-full mb-4 mx-auto w-10 transition-all duration-300 group-hover:w-16" style={{ background: fact.color }} />
                <div
                  className="text-2xl sm:text-3xl font-bold mb-2 transition-transform duration-300 group-hover:scale-110"
                  style={{ fontFamily: "var(--font-playfair), serif", color: fact.color }}
                >
                  {fact.value}
                </div>
                <div className="text-xs sm:text-sm leading-tight font-medium" style={{ color: "var(--text-secondary)" }}>
                  {fact.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== MISI ===== */}
      <section
        className="py-32 mb-32 relative overflow-hidden"
        style={{
          background: "var(--bg-muted)",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
        <div className="container-main px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold tracking-[0.14em] uppercase mb-3" style={{ color: "var(--green-500)" }}>
              Misi Kami
            </p>
            <h2
              className="font-bold text-4xl"
              style={{
                fontFamily: "var(--font-playfair), serif",
                color: "var(--text-primary)",
              }}
            >
              Tiga Pilar{" "}
              <span className="text-gradient">NusantaraHijau</span>
            </h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {MISSIONS.map((m, i) => (
              <motion.div
                variants={fadeUp}
                key={i}
                className="relative p-8 rounded-[2rem] group transition-all duration-500 hover:-translate-y-2 hover:shadow-xl bg-white"
                style={{
                  border: "1px solid var(--border-light)",
                }}
              >
                {/* Large ghost number */}
                <div
                  className="absolute top-6 right-8 text-7xl font-bold leading-none select-none transition-transform duration-500 group-hover:scale-110"
                  style={{ fontFamily: "var(--font-playfair), serif", color: m.color, opacity: 0.04 }}
                >
                  {m.num}
                </div>

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundColor: `${m.color}15`, color: m.color }}
                >
                  {m.icon}
                </div>
                <h3
                  className="font-bold text-2xl mb-4"
                  style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
                >
                  {m.title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {m.desc}
                </p>

                {/* Animated bottom accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[4px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-[2rem]"
                  style={{ backgroundColor: m.color }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== PANDUAN STATUS ===== */}
      <section className="container-main px-4 mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold tracking-[0.14em] uppercase mb-3" style={{ color: "var(--green-500)" }}>
            Panduan
          </p>
          <h2
            className="font-bold mb-4 text-3xl sm:text-4xl"
            style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
          >
            Memahami Status{" "}
            <span className="text-gradient">Konservasi IUCN</span>
          </h2>
          <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Setiap spesies di NusantaraHijau dikategorikan berdasarkan sistem penilaian IUCN Red List yang diakui secara internasional.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {STATUS_GUIDE.map((s) => (
            <motion.div
              variants={fadeUp}
              key={s.code}
              className="p-8 rounded-[2rem] border overflow-hidden relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
              style={{ backgroundColor: s.bg, borderColor: s.border }}
            >
              {/* Left color band */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[6px] rounded-l-[2rem] transition-all duration-300 group-hover:w-[10px]"
                style={{ background: s.color }}
              />
              <div className="flex items-center gap-4 mb-5 pl-2">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-md"
                  style={{ background: s.color }}
                >
                  {s.code}
                </span>
                <span className="font-bold text-xl sm:text-2xl" style={{ fontFamily: "var(--font-playfair), serif", color: s.color }}>
                  {s.label}
                </span>
              </div>
              <p className="text-sm leading-relaxed pl-2 font-medium" style={{ color: "var(--text-secondary)" }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== SUMBER DATA ===== */}
      <section
        className="py-32 mb-32 relative overflow-hidden"
        style={{
          background: "var(--bg-muted)",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="container-main px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold tracking-[0.14em] uppercase mb-3" style={{ color: "var(--teal-500)" }}>
              Transparansi Data
            </p>
            <h2
              className="font-bold mb-4 text-3xl sm:text-4xl"
              style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
            >
              Sumber Data &{" "}<span className="text-gradient">Referensi</span>
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
              Semua informasi di NusantaraHijau bersumber dari lembaga dan organisasi terpercaya di bidang konservasi.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {SOURCES.map((src) => (
              <motion.a
                variants={fadeUp}
                key={src.name}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-3xl transition-all duration-300 block hover:shadow-xl hover:-translate-y-2 bg-white relative overflow-hidden"
                style={{
                  border: "1px solid var(--border-light)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                  style={{ background: src.color }} 
                />
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${src.color}15` }}
                  >
                    <Database className="w-5 h-5" style={{ color: src.color }} />
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                    <ExternalLink className="w-4 h-4 transition-colors" style={{ color: src.color }} />
                  </div>
                </div>
                <h3
                  className="font-bold text-lg mb-2 transition-colors relative z-10"
                  style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
                >
                  {src.name}
                </h3>
                <p className="text-sm leading-relaxed relative z-10" style={{ color: "var(--text-secondary)" }}>
                  {src.desc}
                </p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== DISCLAIMER & CTA ===== */}
      <section className="container-main px-4 mb-16 lg:mb-24 space-y-8">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 rounded-3xl"
          style={{
            background: "rgba(241,196,15,0.06)",
            border: "1px solid rgba(241,196,15,0.25)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ background: "rgba(241,196,15,0.15)" }}
            >
              <BookOpen className="w-6 h-6" style={{ color: "#b7950b" }} />
            </div>
            <div>
              <h3
                className="font-bold text-xl sm:text-2xl mb-3"
                style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
              >
                Catatan Penting
              </h3>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                NusantaraHijau adalah platform edukasi non-komersial yang dibuat untuk keperluan kompetisi TECHSOFT 2026. Data spesies bersumber dari referensi terpercaya dan telah diparafrase untuk keperluan edukasi publik. Foto spesies digunakan dari sumber berlisensi Creative Commons dengan atribusi yang sesuai.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2.5rem] overflow-hidden p-12 sm:p-16 text-center shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 70%, #145214 100%)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none dot-pattern opacity-20" style={{ filter: "invert(1)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(76,175,80,0.22) 0%, transparent 60%)" }} />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 shadow-inner"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.20)" }}
            >
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2
              className="font-bold mb-6 text-white leading-tight text-3xl sm:text-5xl"
              style={{ fontFamily: "var(--font-playfair), serif", letterSpacing: "-0.02em" }}
            >
              Siap Menjelajah{" "}
              <span style={{ color: "rgba(134,239,172,0.95)" }}>Nusantara?</span>
            </h2>
            <p className="text-base sm:text-lg mb-10 leading-relaxed text-white/80">
              Mulai perjalananmu mengenal kekayaan hayati Indonesia. Temukan spesies-spesies menakjubkan yang mungkin belum pernah kamu dengar sebelumnya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/species"
                className="group inline-flex justify-center items-center gap-2 px-8 py-4 font-bold rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: "white", color: "var(--green-700)" }}
              >
                <Leaf className="w-5 h-5" />
                Jelajahi Spesies
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex justify-center items-center gap-2 px-8 py-4 font-bold rounded-2xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.28)" }}
              >
                <Users className="w-5 h-5" />
                Hubungi Kami
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
