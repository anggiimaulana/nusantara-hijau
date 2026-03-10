"use client";

import { motion } from "framer-motion";
import {
    AlertTriangle,
    ArrowLeft,
    ChevronRight,
    ExternalLink,
    Eye,
    Leaf,
    MapPin,
    Shield,
    Users,
    Zap,
} from "lucide-react";
import { resolveSpeciesImage } from "@/lib/species-images";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Types matching the ones in page.tsx
interface Species {
  id: string;
  name: string;
  latinName: string;
  region: string;
  type: string;
  status: string;
  statusEN: string;
  population: string;
  habitat: string;
  threat: string;
  description: string;
  image: string;
  action: string;
  funFact: string;
  source: string;
  color: string;
}

interface SpeciesDetailClientProps {
  species: Species;
  related: Species[];
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
    desc: string;
  }
> = {
  kritis: {
    label: "Kritis (CR)",
    color: "#C0392B",
    bg: "rgba(192,57,43,0.1)",
    border: "rgba(192,57,43,0.25)",
    icon: <AlertTriangle className="w-4 h-4" />,
    desc: "Menghadapi risiko kepunahan yang sangat tinggi di alam liar",
  },
  terancam: {
    label: "Terancam (EN)",
    color: "#D35400",
    bg: "rgba(211,84,0,0.1)",
    border: "rgba(211,84,0,0.25)",
    icon: <Shield className="w-4 h-4" />,
    desc: "Menghadapi risiko kepunahan yang tinggi di alam liar",
  },
  rentan: {
    label: "Rentan (VU)",
    color: "#B7950B",
    bg: "rgba(183,149,11,0.1)",
    border: "rgba(183,149,11,0.25)",
    icon: <Eye className="w-4 h-4" />,
    desc: "Menghadapi risiko kepunahan yang cukup tinggi di alam liar",
  },
};

const REGION_LABELS: Record<string, string> = {
  sumatera: "Sumatera",
  kalimantan: "Kalimantan",
  jawa: "Jawa",
  sulawesi: "Sulawesi",
  papua: "Papua",
  "bali-nusra": "Bali & Nusa Tenggara",
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const MAIN_CARD_CLASS =
  "group p-6 sm:p-8 rounded-3xl relative overflow-hidden border shadow-sm transition-shadow duration-300";
const SIDEBAR_CARD_CLASS =
  "group p-5 rounded-2xl relative border shadow-sm transition-shadow duration-300";

export default function SpeciesDetailClient({ species, related }: SpeciesDetailClientProps) {
  const statusCfg = STATUS_CONFIG[species.status];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-8" style={{ background: "var(--bg-base)" }}>
      {/* ==================== HERO IMAGE ==================== */}
      <div className="px-3 sm:px-4 lg:px-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.8 }}
          className="relative h-[56vh] min-h-[360px] max-h-[560px] overflow-hidden rounded-3xl shadow-xl"
        >
        <Image
          src={resolveSpeciesImage(species.image)}
          alt={species.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,20,8,0.92) 0%, rgba(18,38,18,0.55) 42%, rgba(18,38,18,0.12) 72%, transparent 100%)",
          }}
        />

        {/* Back button */}
        <div className="absolute top-4 sm:top-6 left-0 right-0 z-20">
          <div className="container-main px-4">
            <Link
              href="/species"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group hover:pr-5"
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.28)",
                color: "white",
                boxShadow: "0 4px 14px rgba(0,0,0,0.16)",
              }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Kembali ke Direktori
            </Link>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 pb-8 sm:pb-10 z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="container-main px-4"
          >
            {/* Type + Region badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5 mb-3.5">
              <span
                className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
                }}
              >
                {species.type}
              </span>
              <span
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
                }}
              >
                <MapPin className="w-3.5 h-3.5" />
                {REGION_LABELS[species.region]}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-1.5 leading-tight"
              style={{
                fontFamily: "var(--font-playfair), serif",
                color: "#ffffff",
                textShadow: "0 6px 24px rgba(0,0,0,0.55)",
              }}
            >
              {species.name}
            </motion.h1>
            <motion.p 
              variants={fadeUp}
              className="text-white/85 text-base sm:text-lg italic mb-5 font-medium tracking-wide"
            >
              {species.latinName}
            </motion.p>

            {/* Status badge */}
            {statusCfg && (
              <motion.div
                variants={fadeUp}
                className="inline-flex items-start gap-3 px-4 py-3 rounded-2xl backdrop-blur-md max-w-2xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.92)",
                  border: `1px solid ${statusCfg.color}`,
                  color: statusCfg.color,
                  boxShadow: `0 8px 24px ${statusCfg.color}22`,
                }}
              >
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: statusCfg.bg }}>
                  {statusCfg.icon}
                </div>
                <div>
                  <div className="font-bold text-sm tracking-wide">{statusCfg.label}</div>
                  <div className="text-xs font-semibold opacity-80 mt-0.5 leading-relaxed" style={{ color: "var(--text-primary)" }}>{statusCfg.desc}</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
        </motion.div>
      </div>

      {/* ==================== CONTENT ==================== */}
      <div className="container-main px-4 mt-6 sm:mt-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-9 lg:gap-12">
          {/* ===== MAIN CONTENT (2/3) ===== */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Description */}
            <motion.div
              variants={fadeUp}
              className={MAIN_CARD_CLASS}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" />
              <h2
                className="text-2xl sm:text-3xl font-bold mb-6 relative z-10"
                style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
              >
                Tentang {species.name}
              </h2>
              <p className="leading-relaxed text-base sm:text-lg relative z-10" style={{ color: "var(--text-secondary)" }}>
                {species.description}
              </p>
            </motion.div>

            {/* Fun Fact */}
            <motion.div
              variants={fadeUp}
              className={MAIN_CARD_CLASS}
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: `${species.color}30`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${species.color}, transparent)` }}
              />
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -translate-y-1/3 translate-x-1/3 transition-transform duration-500 group-hover:scale-150"
                style={{
                  background: `radial-gradient(circle, ${species.color}, transparent)`,
                }}
              />
              <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner"
                  style={{ backgroundColor: `${species.color}15` }}
                >
                  <Zap className="w-6 h-6" style={{ color: species.color }} />
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
                    style={{ color: species.color }}
                  >
                    Fakta Unik
                  </p>
                  <p
                    className="text-base sm:text-lg leading-relaxed font-semibold italic"
                    style={{ color: "var(--text-primary)" }}
                  >
                    &quot;{species.funFact}&quot;
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Threat Section */}
            <motion.div
              variants={fadeUp}
              className={MAIN_CARD_CLASS}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--status-cr-border)",
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" style={{ background: "var(--status-cr-bg)" }} />
              
              <div className="relative z-10 flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--status-cr-bg)" }}
                >
                  <AlertTriangle className="w-6 h-6" style={{ color: "var(--status-cr)" }} />
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
                >
                  Ancaman yang Dihadapi
                </h2>
              </div>
              <p className="text-base sm:text-lg leading-relaxed relative z-10" style={{ color: "var(--text-secondary)" }}>
                {species.threat}
              </p>
            </motion.div>

            {/* Action CTA */}
            <motion.div
              variants={fadeUp}
              className={MAIN_CARD_CLASS}
              style={{
                background: "linear-gradient(135deg, var(--green-600), var(--green-500))",
                border: "1px solid var(--green-400)",
                color: "white"
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at top right, rgba(255,255,255,0.2) 0%, transparent 60%)",
                }}
              />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/20 backdrop-blur-sm border border-white/30"
                >
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold mb-2 text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    Apa yang Bisa Kamu Lakukan?
                  </h2>
                  <p className="text-sm sm:text-base text-white/80 font-medium">
                    Setiap tindakan kecilmu berarti besar bagi kelangsungan hidup mereka
                  </p>
                </div>
              </div>
              <p className="text-base sm:text-lg leading-relaxed mb-8 relative z-10 text-white/90">
                {species.action}
              </p>
              <a
                href="https://www.wwf.id"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 group/btn bg-white text-green-700 hover:shadow-lg hover:-translate-y-1"
              >
                <ExternalLink className="w-5 h-5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                Kunjungi WWF Indonesia
              </a>
            </motion.div>
          </motion.div>

          {/* ===== SIDEBAR (1/3) ===== */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-5 lg:sticky lg:top-24 h-fit"
          >
            {/* Info Cards */}
            {[
              {
                icon: <Users className="w-5 h-5" />,
                label: "Estimasi Populasi",
                value: species.population,
                color: species.color,
              },
              {
                icon: <MapPin className="w-5 h-5" />,
                label: "Habitat",
                value: species.habitat,
                color: "#3498DB",
              },
              {
                icon: <Leaf className="w-5 h-5" />,
                label: "Wilayah",
                value: REGION_LABELS[species.region],
                color: "var(--green-600)",
              },
            ].map((item) => (
              <motion.div
                variants={fadeUp}
                key={item.label}
                className={SIDEBAR_CARD_CLASS}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-light)",
                }}
              >
                {/* Colored top border */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
                  style={{ background: item.color }}
                />
                <div className="flex items-center gap-4 mb-4 mt-1">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
                    {item.label}
                  </span>
                </div>
                <p className="text-base font-bold leading-relaxed" style={{ color: "var(--text-primary)" }}>
                  {item.value}
                </p>
              </motion.div>
            ))}

            {/* Source */}
            <motion.div
              variants={fadeUp}
              className={SIDEBAR_CARD_CLASS}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
              }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--text-muted)" }}>
                Sumber Data
              </p>
              <p className="text-sm leading-relaxed mb-5 font-medium" style={{ color: "var(--text-secondary)" }}>
                {species.source}
              </p>
              <a
                href="https://iucnredlist.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 hover:bg-green-500 hover:text-white"
                style={{ background: "rgba(34,197,94,0.1)", color: "var(--green-700)", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                IUCN Red List <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>

            {/* Navigation */}
            <motion.div
              variants={fadeUp}
              className={SIDEBAR_CARD_CLASS}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
              }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--text-muted)" }}>
                Eksplorasi Lanjut
              </p>
              <Link
                href="/species"
                className="flex items-center justify-between text-base font-bold transition-all duration-300"
                style={{ color: "var(--green-600)" }}
              >
                <span className="group-hover:translate-x-1 transition-transform">Lihat semua spesies</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ==================== RELATED SPECIES ==================== */}
        {related.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-24 pt-14 border-t"
            style={{ borderColor: "var(--border-light)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
              <motion.div variants={fadeUp}>
                <p className="text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: "var(--green-600)" }}>
                  Satu Habitat
                </p>
                <h2
                  className="text-3xl sm:text-4xl font-bold"
                  style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
                >
                  Spesies dari {REGION_LABELS[species.region]}
                </h2>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link
                  href={`/species?region=${species.region}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all group hover:shadow-md"
                  style={{ background: "rgba(34,197,94,0.1)", color: "var(--green-700)" }}
                >
                  Lihat Wilayah Ini
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <motion.div variants={fadeUp} key={rel.id}>
                  <Link
                    href={`/species/${rel.id}`}
                    className="group flex flex-col p-4 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-light)",
                    }}
                  >
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4">
                      <Image
                        src={resolveSpeciesImage(rel.image)}
                        alt={rel.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="px-2">
                      <h3
                        className="font-bold text-xl mb-1 transition-colors group-hover:text-green-600"
                        style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
                      >
                        {rel.name}
                      </h3>
                      <p className="text-sm italic font-medium" style={{ color: "var(--text-muted)" }}>
                        {rel.latinName}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
