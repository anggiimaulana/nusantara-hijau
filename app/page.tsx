"use client";

import speciesData from "@/data/species.json";
import { resolveSpeciesImage } from "@/lib/species-images";
import { motion, useInView } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Leaf,
  MapPin,
  Shield,
  Sparkles,
  TreePine,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

// ─── Dynamic Map ──────────────────────────────
function MapSkeleton() {
  return (
    <div
      className="w-full rounded-2xl flex items-center justify-center"
      style={{
        height: "420px",
        background: "var(--pg-muted)",
        border: "2px solid var(--border-hard)",
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 rounded-full animate-spin"
          style={{
            border: "4px solid var(--pg-slate-300)",
            borderTopColor: "var(--pg-accent)",
          }}
        />
        <p
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--text-muted)" }}
        >
          Memuat Peta…
        </p>
      </div>
    </div>
  );
}

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

// ─── Types ────────────────────────────────────
interface Species {
  id: string;
  name: string;
  latinName: string;
  region: string;
  type: string;
  status: string;
  statusEN: string;
  description: string;
  image: string;
  color: string;
}

const STATUS_CFG: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  kritis: {
    label: "Kritis",
    color: "var(--status-cr)",
    bg: "var(--status-cr-bg)",
    border: "var(--status-cr-border)",
    icon: <AlertTriangle className="w-3 h-3" strokeWidth={2.5} />,
  },
  terancam: {
    label: "Terancam",
    color: "var(--status-en)",
    bg: "var(--status-en-bg)",
    border: "var(--status-en-border)",
    icon: <Shield className="w-3 h-3" strokeWidth={2.5} />,
  },
  rentan: {
    label: "Rentan",
    color: "var(--status-vu)",
    bg: "var(--status-vu-bg)",
    border: "var(--status-vu-border)",
    icon: <Leaf className="w-3 h-3" strokeWidth={2.5} />,
  },
};

const CARD_SHADOW_COLORS = [
  "var(--pg-pink)",
  "var(--pg-accent)",
  "var(--pg-amber)",
];

const FEATURED_IDS = ["harimau-sumatera", "orangutan-kalimantan", "komodo"];
const featured = FEATURED_IDS.map((id) => speciesData.find((s) => s.id === id)).filter(
  Boolean
) as Species[];

const STATS = [
  { value: "17.000+", label: "Pulau" },
  { value: "515+", label: "Mamalia Endemik" },
  { value: "#2", label: "Negara Megabiodiversitas" },
  { value: `${speciesData.length}+`, label: "Spesies Terdokumentasi" },
  { value: "37%", label: "Hutan Tropis Asia" },
  { value: "1.500+", label: "Spesies Burung" },
];

// ─── Motion Variants ──────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// ─── Featured Card ────────────────────────────
function FeaturedCard({ species, index }: { species: Species; index: number }) {
  const shadowColor = CARD_SHADOW_COLORS[index % CARD_SHADOW_COLORS.length];
  const st = STATUS_CFG[species.status];

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        rotate: -1,
        scale: 1.02,
        boxShadow: `8px 8px 0px ${shadowColor}`,
        transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
      }}
      className="relative flex flex-col overflow-hidden"
      style={{
        background: "white",
        border: "2px solid var(--border-hard)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "4px 4px 0px var(--border-hard)",
      }}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <Image
          src={resolveSpeciesImage(species.image)}
          alt={species.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Status badge */}
        {st && (
          <div
            className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: st.bg,
              border: `1.5px solid ${st.border}`,
              color: st.color,
              boxShadow: "2px 2px 0px var(--border-hard)",
            }}
          >
            {st.icon} {st.label}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <p className="latin-name text-xs">{species.latinName}</p>
        <h3
          className="text-lg font-bold leading-snug"
          style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
        >
          {species.name}
        </h3>
        <p className="text-sm line-clamp-2 flex-1" style={{ color: "var(--text-muted)" }}>
          {species.description}
        </p>
        <Link
          href={`/species/${species.id}`}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold transition-colors"
          style={{ color: "var(--pg-accent)", fontFamily: "var(--font-heading)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pg-accent-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pg-accent)")}
        >
          Selengkapnya <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Stat Card ────────────────────────────────
function StatCard({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center px-3 py-6 rounded-2xl text-center h-full"
      style={{
        background: "white",
        border: "2px solid var(--border-hard)",
        boxShadow: `3px 3px 0px ${accent ?? "var(--border-hard)"}`,
      }}
    >
      <span
        className="text-3xl sm:text-4xl font-bold leading-none mb-1"
        style={{
          fontFamily: "var(--font-heading)",
          color: accent ?? "var(--pg-accent)",
        }}
      >
        {value}
      </span>
      <span
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Homepage ─────────────────────────────────
export default function HomePage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const featRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);

  const isMapInView = useInView(mapRef, { once: true, margin: "-100px" });
  const isFeatInView = useInView(featRef, { once: true, margin: "-80px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-80px" });
  const isStatInView = useInView(statRef, { once: true, margin: "-60px" });

  return (
    <div style={{ background: "var(--pg-bg)" }}>
      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-4.5rem)] flex items-center overflow-x-clip pt-12 pb-12">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />

        {/* Giant amber circle */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute -left-40 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none hidden lg:block"
          style={{ background: "var(--pg-amber)" }}
        />

        {/* Floating decorative shapes */}
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-28 right-16 w-12 h-12 rounded-xl hidden lg:block pointer-events-none"
          style={{
            background: "var(--pg-mint)",
            border: "2px solid var(--border-hard)",
            boxShadow: "var(--shadow-hard)",
            rotate: "15deg",
          }}
        />
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-28 right-1/3 w-8 h-8 rounded-full hidden lg:block pointer-events-none"
          style={{
            background: "var(--pg-pink)",
            border: "2px solid var(--border-hard)",
            boxShadow: "var(--shadow-hard)",
          }}
        />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-1/4 w-10 h-10 hidden xl:block pointer-events-none"
          style={{ border: "3px solid var(--pg-accent)", borderRadius: "4px", opacity: 0.25 }}
        />

        <div className="container-main relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            {/* ── Left: Text ── */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp}>
                <span className="section-eyebrow">
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Atlas Digital Biodiversitas Indonesia
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  marginBottom: "1.25rem",
                }}
              >
                Jelajahi
                <span
                  className="squiggle-underline inline-block ml-6"
                  style={{ color: "var(--pg-accent)" }}
                >
                  Kekayaan
                </span>
                {" "}Hayati
                <br />
                <span style={{ color: "var(--pg-dark)" }}>Nusantara</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg mb-8 max-w-lg"
                style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
              >
                Indonesia menyimpan keanekaragaman hayati terkaya di dunia.
                Kenali{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  flora dan fauna endemik
                </strong>{" "}
                Nusantara — sebelum terlambat.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
                <Link href="/species" className="btn-candy px-7 py-3.5">
                  Jelajahi Spesies
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
                <a href="#peta" className="btn-outline-pg px-7 py-3.5">
                  Lihat Peta
                  <MapPin className="w-4 h-4" strokeWidth={2.5} />
                </a>
              </motion.div>

              {/* Mini stat pills */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5">
                {[
                  { label: "17.000+ Pulau", color: "var(--pg-amber)" },
                  { label: "#2 Megabiodiversitas", color: "var(--pg-mint)" },
                  { label: `${speciesData.length} Spesies`, color: "var(--pg-pink)" },
                ].map((p) => (
                  <span
                    key={p.label}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold"
                    style={{
                      background: "white",
                      border: "2px solid var(--border-hard)",
                      borderRadius: "var(--radius-full)",
                      boxShadow: "var(--shadow-hard-xs)",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: p.color }}
                    />
                    {p.label}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right: Hero Image composition ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[500px] lg:max-w-[640px] mx-auto lg:ml-auto mt-12 lg:mt-0"
              style={{ paddingBottom: "2.5rem" }}
            >
              {/* Dot pattern background square */}
              <div
                className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-full h-full rounded-3xl bg-dots"
                style={{ zIndex: 0, opacity: 0.6 }}
              />

              {/* Main image */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  border: "3px solid var(--border-hard)",
                  boxShadow: "10px 10px 0px var(--border-hard)",
                  aspectRatio: "5/4",
                  zIndex: 1,
                }}
              >
                <Image
                  src="/images/species/harimau-sumatera.jpg"
                  alt="Harimau Sumatera — Panthera tigris sumatrae"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Caption sticker */}
                <div
                  className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 p-3.5 sm:p-4 rounded-2xl"
                  style={{
                    background: "rgba(255,253,245,0.95)",
                    border: "2px solid var(--border-hard)",
                    boxShadow: "4px 4px 0px var(--border-hard)",
                  }}
                >
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mb-2"
                    style={{
                      background: "var(--status-cr-bg)",
                      border: "1.5px solid var(--status-cr-border)",
                      color: "var(--status-cr)",
                    }}
                  >
                    <AlertTriangle className="w-3 h-3" strokeWidth={2.5} /> Status Kritis (CR)
                  </div>
                  <h3
                    className="font-bold text-base mb-0.5"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Harimau Sumatera
                  </h3>
                  <p className="latin-name text-xs">Panthera tigris sumatrae</p>
                </div>
              </div>

              {/* Floating badge — count */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 p-3 sm:p-4 rounded-2xl"
                style={{
                  background: "var(--pg-accent)",
                  border: "2px solid var(--border-hard)",
                  boxShadow: "var(--shadow-hard)",
                  color: "white",
                  zIndex: 10,
                }}
              >
                <div
                  className="text-2xl sm:text-3xl font-bold leading-none"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {speciesData.length}+
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wide opacity-80 mt-0.5">
                  Spesies
                </div>
              </motion.div>

              {/* Floating badge — region */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -bottom-2 -left-2 sm:left-0 p-3 sm:p-3.5 rounded-2xl flex items-center gap-2 sm:gap-2.5"
                style={{
                  background: "var(--pg-amber)",
                  border: "2px solid var(--border-hard)",
                  boxShadow: "var(--shadow-hard)",
                  zIndex: 10,
                }}
              >
                <TreePine className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" strokeWidth={2.5} />
                <div>
                  <div
                    className="text-xs font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    6 Wilayah
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wide opacity-70">
                    Nusantara
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
      </div>

      {/* ═══════════════════════════════════════
          STATS GRID
      ═══════════════════════════════════════ */}
      <section ref={statRef} className="py-14 sm:py-20">
        <div className="container-main">
          <motion.div
            initial="hidden"
            animate={isStatInView ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-10">
              <span className="section-eyebrow justify-center">
                <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} /> Fakta Nusantara
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Negeri{" "}
                <span className="squiggle-underline" style={{ color: "var(--pg-accent)" }}>
                  Mega
                </span>
                biodiversitas
              </h2>
            </motion.div>

            <motion.div
              variants={stagger}
              className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4"
            >
              {STATS.map((s, i) => {
                const accents = [
                  "var(--pg-accent)",
                  "var(--pg-amber)",
                  "var(--pg-pink)",
                  "var(--pg-mint)",
                  "var(--pg-accent-dark)",
                  "var(--pg-amber)",
                ];
                return (
                  <motion.div key={i} variants={fadeUp} className="h-full">
                    <StatCard value={s.value} label={s.label} accent={accents[i % accents.length]} />
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURED SPECIES
      ═══════════════════════════════════════ */}
      <section
        ref={featRef}
        className="py-16 sm:py-24"
        style={{
          background: "var(--pg-muted)",
          borderTop: "2px solid var(--border-hard)",
          borderBottom: "2px solid var(--border-hard)",
        }}
      >
        <div className="container-main">
          <motion.div
            initial="hidden"
            animate={isFeatInView ? "visible" : "hidden"}
            variants={stagger}
          >
            {/* Section header */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4"
            >
              <div>
                <span className="section-eyebrow">
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} /> Sorotan
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-bold leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Mereka Butuh{" "}
                  <span
                    className="squiggle-underline"
                    style={{ color: "var(--pg-accent)" }}
                  >
                    Perhatianmu
                  </span>
                </h2>
              </div>
              <Link href="/species" className="btn-outline-pg py-2.5 px-5 text-sm flex-shrink-0">
                Lihat Semua <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </motion.div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {featured.map((sp, i) => (
                <FeaturedCard key={sp.id} species={sp} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MAP SECTION
      ═══════════════════════════════════════ */}
      <section
        id="peta"
        ref={mapRef}
        className="py-16 sm:py-24"
      >
        <div className="container-main">
          <motion.div
            initial="hidden"
            animate={isMapInView ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-10">
              <span className="section-eyebrow">
                <MapPin className="w-3.5 h-3.5" strokeWidth={2.5} /> Peta Interaktif
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Sebaran Spesies{" "}
                <span style={{ color: "var(--pg-accent)" }}>per Provinsi</span>
              </h2>
              <p className="text-sm max-w-lg" style={{ color: "var(--text-secondary)" }}>
                Klik pada provinsi mana saja untuk melihat spesies endemik yang
                hidup di wilayah tersebut.
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <InteractiveMap />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className="pb-20 sm:pb-28"
        style={{
          background: "var(--pg-muted)",
          borderTop: "2px solid var(--border-hard)",
          paddingTop: "4rem",
        }}
      >
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={isCtaInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden p-10 sm:p-16 lg:p-20 text-center"
            style={{
              background: "var(--pg-accent)",
              border: "3px solid var(--border-hard)",
              boxShadow: "10px 10px 0px var(--border-hard)",
            }}
          >
            {/* Pattern overlay */}
            <div className="absolute inset-0 bg-dots-dark opacity-30 pointer-events-none" />

            {/* Decorative circles */}
            <div
              className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20 pointer-events-none"
              style={{ background: "var(--pg-pink)", border: "3px solid white" }}
            />
            <div
              className="absolute -bottom-8 -left-8 w-32 h-32 rounded-xl opacity-20 pointer-events-none"
              style={{ background: "var(--pg-amber)", rotate: "20deg" }}
            />

            {/* Rotating star */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-8 left-8 text-4xl hidden sm:block pointer-events-none"
              style={{ opacity: 0.35 }}
            >
              ✦
            </motion.div>

            <div className="relative z-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold text-white"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                🌿 Mulai Menjelajah
              </div>

              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5"
                style={{ fontFamily: "var(--font-heading)", lineHeight: 1.2 }}
              >
                Mari Lestarikan Bersama
              </h2>

              <p className="text-white/80 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Platform ini didedikasikan untuk mendokumentasikan keajaiban alam
                Nusantara. Aksi pelestarian nyata ada di tangan kita.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/species" className="btn-ghost-dark px-8 py-3.5 text-base">
                  Lihat Semua Spesies
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
                <Link href="/about" className="btn-ghost-dark px-8 py-3.5 text-base">
                  Tentang Platform
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}