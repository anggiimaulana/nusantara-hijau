"use client";

import { getCatalogRegionText, getCatalogRegions, type CatalogSpecies } from "@/lib/biodiversity-catalog";
import { hasSpeciesImage, resolveSpeciesImage } from "@/lib/species-images";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Database,
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
import React, { useRef, useState } from "react";

interface Props {
  species: CatalogSpecies;
  related: CatalogSpecies[];
}

const STATUS_CFG: Record<
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
    color: "var(--status-cr)",
    bg: "var(--status-cr-bg)",
    border: "var(--status-cr-border)",
    icon: <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />,
    desc: "Menghadapi risiko kepunahan yang sangat tinggi di alam liar",
  },
  terancam: {
    label: "Terancam (EN)",
    color: "var(--status-en)",
    bg: "var(--status-en-bg)",
    border: "var(--status-en-border)",
    icon: <Shield className="w-4 h-4" strokeWidth={2.5} />,
    desc: "Menghadapi risiko kepunahan yang tinggi di alam liar",
  },
  rentan: {
    label: "Rentan (VU)",
    color: "var(--status-vu)",
    bg: "var(--status-vu-bg)",
    border: "var(--status-vu-border)",
    icon: <Leaf className="w-4 h-4" strokeWidth={2.5} />,
    desc: "Menghadapi risiko kepunahan yang cukup tinggi di alam liar",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
};

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
        <p className="text-base font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{value}</p>
      </div>
    </div>
  );
}

function RelatedCard({ sp }: { sp: CatalogSpecies }) {
  return (
    <Link href={`/species/${sp.id}`} className="block group flex-shrink-0 w-[220px] lg:w-full">
      <motion.div
        whileHover={{ rotate: -1, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="overflow-hidden flex flex-col"
        style={{
          background: "white",
          border: "2px solid var(--border-hard)",
          borderRadius: "var(--radius-md)",
          boxShadow: "none",
        }}
      >
        <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio: "4/3" }}>
          {hasSpeciesImage(sp.image) ? (
            <Image
              src={resolveSpeciesImage(sp.image)}
              alt={sp.name}
              fill
              sizes="220px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col justify-between p-3"
              style={{ background: `linear-gradient(145deg, ${(sp.color ?? "#0F766E")}22 0%, white 100%)` }}
            >
              <span
                className="inline-flex self-start rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ background: "rgba(255,255,255,0.88)", color: sp.color ?? "#0F766E" }}
              >
                {sp.sourceLabel}
              </span>
              <p className="text-xs font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
                Arsip visual
              </p>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="latin-name text-[10px] mb-0.5 truncate">{sp.latinName}</p>
          <h4
            className="font-bold text-sm leading-snug line-clamp-2"
            style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
          >
            {sp.name}
          </h4>
        </div>
      </motion.div>
    </Link>
  );
}

function RelatedCarousel({ items }: { items: CatalogSpecies[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;

    el.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / 236));
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition"
        style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "3px 3px 0px var(--border-hard)" }}
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
      </button>

      <button
        onClick={() => scroll(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition"
        style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "3px 3px 0px var(--border-hard)" }}
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
      </button>

      <div ref={trackRef} onScroll={handleScroll} className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {items.map((sp) => (
          <RelatedCard key={sp.id} sp={sp} />
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, itemIndex) => (
          <div
            key={itemIndex}
            className="h-2 rounded-full transition-all"
            style={{
              width: itemIndex === index ? "22px" : "8px",
              background: itemIndex === index ? "var(--pg-accent)" : "var(--border-light)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SpeciesDetailClient({ species, related }: Props) {
  const st = species.status ? STATUS_CFG[species.status] : null;
  const accent = species.color ?? "var(--pg-accent)";

  return (
    <div style={{ background: "var(--pg-bg)" }} className="min-h-screen pb-20">
      <div
        className="relative w-full overflow-hidden flex justify-center"
        style={{ height: "clamp(280px, 48vh, 640px)", borderBottom: "3px solid var(--border-hard)", backgroundColor: "var(--pg-dark)" }}
      >
        {hasSpeciesImage(species.image) ? (
          <>
            {/* Blurred background for premium feel */}
            <div className="absolute inset-0 z-0">
              <Image
                src={resolveSpeciesImage(species.image)}
                alt={`${species.name} background`}
                fill
                className="object-cover blur-2xl opacity-40 scale-110"
                priority
              />
            </div>
            {/* Contained image to prevent pixelation on large screens */}
            <div className="relative z-1 w-full h-full lg:max-w-[1024px] mx-auto shadow-2xl">
              <Image
                src={resolveSpeciesImage(species.image)}
                alt={species.name}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover sm:object-cover lg:object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at top right, ${accent}66, transparent 40%), linear-gradient(140deg, ${accent}26 0%, #10231a 100%)`,
            }}
          />
        )}
        <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(30,41,59,0.85) 100%)" }} />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-24 right-8 text-4xl opacity-30 hidden sm:block"
        >
          ✦
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 z-10 pb-8">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {st && (
                <span
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-bold mb-4"
                  style={{
                    background: "white",
                    border: "2px solid var(--border-hard)",
                    color: st.color,
                    boxShadow: "3px 3px 0px var(--border-hard)",
                  }}
                >
                  {st.icon}
                  {st.label}
                </span>
              )}
              <h1
                className="text-white mb-2"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
                  lineHeight: 1.1,
                  textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                {species.name}
              </h1>
              <p className="latin-name text-white/65 text-base">{species.latinName}</p>
              <div
                className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-white/90"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <Database className="w-4 h-4" strokeWidth={2.5} />
                {species.sourceLabel}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container-main py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12 items-start">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div
              variants={fadeUp}
              className="p-7 sm:p-8 rounded-3xl mb-6"
              style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}
            >
              <h2 className="font-bold text-xl mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                Tentang Spesies Ini
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {species.description}
              </p>
            </motion.div>

            {species.funFact && (
              <motion.div
                variants={fadeUp}
                className="flex gap-0 rounded-2xl mb-6 overflow-hidden"
                style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}
              >
                <div className="w-1.5 flex-shrink-0" style={{ background: "var(--pg-accent)" }} />
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--pg-accent)", color: "white" }}>
                      <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                      Tahukah Kamu?
                    </h3>
                  </div>
                  <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>{species.funFact}</p>
                </div>
              </motion.div>
            )}

            {species.threat && (
              <motion.div
                variants={fadeUp}
                className="flex gap-0 rounded-2xl mb-6 overflow-hidden"
                style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}
              >
                <div className="w-1.5 flex-shrink-0" style={{ background: "var(--pg-amber)" }} />
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--pg-amber)", color: "white" }}>
                      <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                      Ancaman Utama
                    </h3>
                  </div>
                  <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>{species.threat}</p>
                </div>
              </motion.div>
            )}

            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {species.population && <StatCard icon={<Users className="w-4 h-4" strokeWidth={2.5} />} label="Populasi Tersisa" value={species.population} />}
              {species.habitat && <StatCard icon={<MapPin className="w-4 h-4" strokeWidth={2.5} />} label="Habitat" value={species.habitat} />}
              <StatCard icon={<Globe className="w-4 h-4" strokeWidth={2.5} />} label="Wilayah" value={getCatalogRegionText(species)} />
              <StatCard icon={<Zap className="w-4 h-4" strokeWidth={2.5} />} label="Klasifikasi" value={species.type.charAt(0).toUpperCase() + species.type.slice(1)} />
            </motion.div>
          </motion.div>

          <motion.aside
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col gap-5 lg:sticky lg:top-28"
          >
            {st && (
              <motion.div
                variants={fadeUp}
                className="p-5 rounded-2xl overflow-hidden"
                style={{
                  background: "white",
                  borderLeft: "2px solid var(--border-hard)",
                  borderRight: "2px solid var(--border-hard)",
                  borderBottom: "2px solid var(--border-hard)",
                  boxShadow: "4px 4px 0px var(--border-hard)",
                  borderTop: `4px solid ${st.color}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: st.color, color: "white" }}>
                    {st.icon}
                  </div>
                  <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)", color: st.color }}>{st.label}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{st.desc}</p>
              </motion.div>
            )}

            <motion.div
              variants={fadeUp}
              className="p-5 rounded-2xl"
              style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--pg-dark)", color: "white" }}>
                  <Database className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                  Sumber Data
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{species.sourceLabel}</p>
              <p className="text-xs leading-relaxed mt-2 break-words" style={{ color: "var(--text-faint)" }}>{species.source}</p>
            </motion.div>

            {species.action && (
              <motion.div
                variants={fadeUp}
                className="p-5 rounded-2xl relative overflow-hidden"
                style={{ background: "var(--pg-accent)", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}
              >
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-15 select-none">🌿</div>
                <div className="relative z-10">
                  <h3 className="font-bold text-sm text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Apa Yang Bisa Kita Lakukan?
                  </h3>
                  <p className="text-sm leading-relaxed text-white/80 mb-4">{species.action}</p>
                  <Link href="/contact" className="btn-ghost-dark py-2 px-5 text-sm w-full justify-center">
                    Hubungi Kami <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                  </Link>
                </div>
              </motion.div>
            )}

            <motion.div variants={fadeUp}>
              <Link href="/species" className="btn-outline-pg w-full justify-center py-2.5 text-sm">
                <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali ke Direktori
              </Link>
            </motion.div>
          </motion.aside>
        </div>

        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-14"
          >
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: "2px solid var(--border-light)" }}>
              <h2 className="font-bold text-xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                Spesies Terkait
              </h2>
              <Link href={`/species?region=${getCatalogRegions(species)[0] || "all"}`} className="text-sm font-bold flex items-center gap-1" style={{ color: "var(--pg-accent)", fontFamily: "var(--font-heading)" }}>
                Lihat Semua <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </Link>
            </div>
            <div className="lg:hidden">
              <RelatedCarousel items={related} />
            </div>
            <div className="hidden lg:grid lg:grid-cols-4 gap-5 sm:gap-6">
              {related.map((item) => (
                <RelatedCard key={item.id} sp={item} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
