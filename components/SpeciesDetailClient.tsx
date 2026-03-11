"use client";

import { resolveSpeciesImage } from "@/lib/species-images";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  Leaf,
  MapPin,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// ─── Types ────────────────────────────────────
interface Species {
  id: string; name: string; latinName: string; region: string; type: string;
  status: string; statusEN: string; population: string; habitat: string;
  threat: string; description: string; image: string; action: string;
  funFact: string; source: string; color: string;
}
interface Props { species: Species; related: Species[] }

// ─── Status Config ────────────────────────────
const STATUS_CFG: Record<string, {
  label: string; color: string; bg: string; border: string;
  icon: React.ReactNode; desc: string;
}> = {
  kritis: {
    label: "Kritis (CR)", color: "var(--status-cr)", bg: "var(--status-cr-bg)", border: "var(--status-cr-border)",
    icon: <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />,
    desc: "Menghadapi risiko kepunahan yang sangat tinggi di alam liar",
  },
  terancam: {
    label: "Terancam (EN)", color: "var(--status-en)", bg: "var(--status-en-bg)", border: "var(--status-en-border)",
    icon: <Shield className="w-4 h-4" strokeWidth={2.5} />,
    desc: "Menghadapi risiko kepunahan yang tinggi di alam liar",
  },
  rentan: {
    label: "Rentan (VU)", color: "var(--status-vu)", bg: "var(--status-vu-bg)", border: "var(--status-vu-border)",
    icon: <Leaf className="w-4 h-4" strokeWidth={2.5} />,
    desc: "Menghadapi risiko kepunahan yang cukup tinggi di alam liar",
  },
};

const REGION_LABELS: Record<string, string> = {
  sumatera: "Sumatera", kalimantan: "Kalimantan", jawa: "Jawa",
  sulawesi: "Sulawesi", papua: "Papua", "bali-nusra": "Bali & Nusa Tenggara",
};

// ─── Variants ────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.09 } } };

// ─── Stat Card ────────────────────────────────
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-2xl"
      style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "3px 3px 0px var(--border-hard)" }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "var(--pg-accent-light)", color: "var(--pg-accent)" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest font-bold mb-0.5" style={{ color: "var(--text-faint)", fontFamily: "var(--font-heading)" }}>{label}</p>
        <p className="text-sm font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{value}</p>
      </div>
    </div>
  );
}

// ─── Related Card ────────────────────────────
function RelatedCard({ sp }: { sp: Species }) {
  return (
    <Link href={`/species/${sp.id}`} className="block flex-shrink-0 w-44">
      <motion.div
        whileHover={{ rotate: -1, scale: 1.03, boxShadow: "6px 6px 0px var(--pg-pink)" }}
        whileTap={{ scale: 0.98 }}
        className="overflow-hidden"
        style={{ background: "white", border: "2px solid var(--border-hard)", borderRadius: "var(--radius-md)", boxShadow: "3px 3px 0px var(--border-hard)" }}
      >
        <div className="relative" style={{ aspectRatio: "3/2" }}>
          <Image src={resolveSpeciesImage(sp.image)} alt={sp.name} fill className="object-cover" />
        </div>
        <div className="p-3">
          <p className="latin-name text-[10px] mb-0.5">{sp.latinName}</p>
          <h4 className="font-bold text-xs leading-snug" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>{sp.name}</h4>
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────
export default function SpeciesDetailClient({ species, related }: Props) {
  const st = STATUS_CFG[species.status];

  return (
    <div style={{ background: "var(--pg-bg)" }} className="min-h-screen pb-20">

      {/* ─── HERO ─── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(360px, 55vh, 640px)", borderBottom: "3px solid var(--border-hard)" }}
      >
        {/* Image */}
        <Image
          src={resolveSpeciesImage(species.image)}
          alt={species.name}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(30,41,59,0.85) 100%)" }}
        />

        {/* Floating deco */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-24 right-8 text-4xl opacity-30 hidden sm:block"
        >✦</motion.div>

        {/* Back button */}
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="container-main">
            <Link
              href="/species"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm text-white transition-all"
              style={{
                fontFamily: "var(--font-heading)",
                background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.30)",
                backdropFilter: "blur(8px)",
              }}
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Kembali
            </Link>
          </div>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-8">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {st && (
                <span
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold mb-4"
                  style={{
                    background: "white", border: "2px solid var(--border-hard)",
                    color: st.color, boxShadow: "3px 3px 0px var(--border-hard)",
                  }}
                >
                  {st.icon} {st.label}
                </span>
              )}
              <h1
                className="text-white mb-2"
                style={{
                  fontFamily: "var(--font-heading)", fontWeight: 800,
                  fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", lineHeight: 1.1,
                  textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                {species.name}
              </h1>
              <p className="latin-name text-white/65 text-sm">{species.latinName}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="container-main py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12 items-start">

          {/* ── LEFT: Description + Cards ── */}
          <motion.div initial="hidden" animate="visible" variants={stagger}>

            {/* Description */}
            <motion.div
              variants={fadeUp}
              className="p-7 sm:p-8 rounded-3xl mb-6"
              style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}
            >
              <h2 className="font-bold text-xl mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                Tentang Spesies Ini
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {species.description}
              </p>
            </motion.div>

            {/* Fun Fact — amber card */}
            {species.funFact && (
              <motion.div
                variants={fadeUp}
                className="relative p-7 rounded-3xl mb-6 overflow-hidden"
                style={{ background: "var(--pg-amber)", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}
              >
                <div className="absolute -right-4 -top-4 text-7xl opacity-15 select-none">✨</div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5" strokeWidth={2.5} />
                    <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-heading)" }}>
                      Tahukah Kamu?
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed font-medium">{species.funFact}</p>
                </div>
              </motion.div>
            )}

            {/* Threat — pink card */}
            {species.threat && (
              <motion.div
                variants={fadeUp}
                className="p-7 rounded-3xl mb-6"
                style={{
                  background: "var(--pg-pink-light)", border: "2px solid var(--pg-pink)",
                  boxShadow: "4px 4px 0px var(--pg-pink)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--pg-pink)", color: "white" }}>
                    <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                    Ancaman Utama
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{species.threat}</p>
              </motion.div>
            )}

            {/* Stats grid */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {species.population && (
                <StatCard icon={<Users className="w-4 h-4" strokeWidth={2.5} />} label="Populasi Tersisa" value={species.population} />
              )}
              {species.habitat && (
                <StatCard icon={<MapPin className="w-4 h-4" strokeWidth={2.5} />} label="Habitat" value={species.habitat} />
              )}
              {species.region && (
                <StatCard icon={<Globe className="w-4 h-4" strokeWidth={2.5} />} label="Wilayah" value={REGION_LABELS[species.region] ?? species.region} />
              )}
              {species.type && (
                <StatCard icon={<Zap className="w-4 h-4" strokeWidth={2.5} />} label="Klasifikasi" value={species.type.charAt(0).toUpperCase() + species.type.slice(1)} />
              )}
            </motion.div>

            {/* Source */}
            {species.source && (
              <motion.div variants={fadeUp}>
                <a
                  href={species.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold transition-colors"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-heading)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--pg-accent)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} /> Sumber Data
                </a>
              </motion.div>
            )}
          </motion.div>

          {/* ── RIGHT: Sidebar ── */}
          <motion.aside
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col gap-5 lg:sticky lg:top-28"
          >
            {/* Status card */}
            {st && (
              <motion.div
                variants={fadeUp}
                className="p-6 rounded-2xl"
                style={{
                  background: st.bg, border: `2px solid ${st.color}`,
                  boxShadow: `4px 4px 0px ${st.color}`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: st.color, color: "white" }}>
                    {st.icon}
                  </div>
                  <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)", color: st.color }}>{st.label}</h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{st.desc}</p>
              </motion.div>
            )}

            {/* Action card — violet */}
            {species.action && (
              <motion.div
                variants={fadeUp}
                className="p-6 rounded-2xl relative overflow-hidden"
                style={{ background: "var(--pg-accent)", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}
              >
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-15 select-none">🌿</div>
                <div className="relative z-10">
                  <h3 className="font-bold text-base text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Apa Yang Bisa Kita Lakukan?
                  </h3>
                  <p className="text-xs leading-relaxed text-white/80 mb-4">{species.action}</p>
                  <Link href="/contact" className="btn-ghost-dark py-2 px-5 text-xs w-full justify-center">
                    Hubungi Kami <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Back to listing */}
            <motion.div variants={fadeUp}>
              <Link href="/species" className="btn-outline-pg w-full justify-center py-3 text-sm">
                <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali ke Direktori
              </Link>
            </motion.div>
          </motion.aside>
        </div>

        {/* ─── Related Species ─── */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-14"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                Spesies Terkait
              </h2>
              <Link href="/species" className="text-xs font-bold flex items-center gap-1" style={{ color: "var(--pg-accent)", fontFamily: "var(--font-heading)" }}>
                Lihat Semua <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {related.map((sp) => <RelatedCard key={sp.id} sp={sp} />)}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
