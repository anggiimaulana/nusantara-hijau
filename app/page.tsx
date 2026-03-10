"use client";

import speciesData from "@/data/species.json";
import { resolveSpeciesImage } from "@/lib/species-images";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, ArrowRight, ChevronRight, Globe, Leaf, MapPin, Shield } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function MapSkeleton() {
  return (
    <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-[2rem] bg-gray-200/50 animate-pulse flex items-center justify-center" style={{ border: "1px solid var(--border-light)" }}>
      <div className="flex flex-col items-center gap-3">
        <MapPin className="w-8 h-8 text-gray-400" />
        <span className="text-sm font-medium text-gray-400">Memuat Peta...</span>
      </div>
    </div>
  );
}

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), { 
  ssr: false,
  loading: () => <MapSkeleton />
});

// ============================================
// TYPES
// ============================================
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

const REGION_LABELS: Record<string, string> = {
  sumatera: "Sumatera",
  kalimantan: "Kalimantan",
  jawa: "Jawa",
  sulawesi: "Sulawesi",
  papua: "Papua",
  "bali-nusra": "Bali & Nusa Tenggara",
};

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string; label: string; icon: React.ReactNode }> = {
  kritis: {
    color: "var(--status-cr)",
    bg: "var(--status-cr-bg)",
    border: "var(--status-cr-border)",
    label: "Kritis",
    icon: <AlertTriangle className="w-2.5 h-2.5" />,
  },
  terancam: {
    color: "var(--status-en)",
    bg: "var(--status-en-bg)",
    border: "var(--status-en-border)",
    label: "Terancam",
    icon: <Shield className="w-2.5 h-2.5" />,
  },
  rentan: {
    color: "var(--status-vu)",
    bg: "var(--status-vu-bg)",
    border: "var(--status-vu-border)",
    label: "Rentan",
    icon: <Leaf className="w-2.5 h-2.5" />,
  },
};

const FEATURED_IDS = [
  "harimau-sumatera",
  "badak-jawa",
  "komodo",
  "jalak-bali",
  "cenderawasih",
  "maleo",
];
const EASE_STANDARD: [number, number, number, number] = [0.4, 0, 0.2, 1];
const EASE_OUT_BACK: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

// ============================================
// ANIMATION VARIANTS
// ============================================
const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_STANDARD } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

// ============================================
// COUNTER HOOK
// ============================================
function useCountUp(target: number, duration = 1400, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

// ============================================
// LEAF DECORATIVE SVG
// ============================================
function LeafDecor({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 80 80" fill="none">
      <path
        d="M40 8C25 20 12 35 18 50C24 65 40 72 40 72C40 72 56 65 62 50C68 35 55 20 40 8Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path d="M40 8C40 8 40 30 40 72" stroke="currentColor" strokeWidth="1.5" opacity="0.25" strokeDasharray="3 3" />
    </svg>
  );
}

// ============================================
// STATUS BADGE
// ============================================
function StatusBadge({ status, overlay = false }: { status: string; overlay?: boolean }) {
  const s = STATUS_STYLE[status];
  if (!s) return null;
  return (
    <span
      className="badge"
      style={{
        color: overlay ? "#fff" : s.color,
        background: overlay ? s.color : s.bg,
        border: overlay ? "1px solid rgba(255,255,255,0.25)" : `1px solid ${s.border}`,
        textShadow: overlay ? "0 1px 3px rgba(0,0,0,0.35)" : "none",
      }}
    >
      {s.icon}
      {s.label}
    </span>
  );
}

// ============================================
// FEATURED CARD
// ============================================
function FeaturedCard({ species }: { species: Species }) {
  const isCritical = species.status === "kritis";
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_OUT_BACK } }}
    >
      <Link
        href={`/species/${species.id}`}
        className="group relative flex flex-col overflow-hidden h-[340px] sm:h-[380px] lg:h-[420px] rounded-[24px]"
        style={{
          background: "var(--bg-surface)",
          boxShadow: isCritical ? "0 10px 30px rgba(198,40,40,0.12)" : "var(--shadow-md)",
        }}
      >
        {/* Full-bleed background image with slow zoom hover */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-100">
          <Image
            src={resolveSpeciesImage(species.image)}
            alt={species.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          />
        </div>
        
        {/* Deep bottom gradient for text contrast */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{ background: "linear-gradient(to top, rgba(0,5,0,0.95) 0%, rgba(5,12,5,0.7) 50%, transparent 90%)" }}
        />

        {/* Top Badges */}
        <div className="absolute top-4 right-4 z-10">
          <div
            className="rounded-full"
            style={{
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
            }}
          >
            <StatusBadge status={species.status} overlay />
          </div>
        </div>
        <div className="absolute top-4 left-4 z-10">
          <span
            className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest text-white shadow-sm"
            style={{
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {species.type}
          </span>
        </div>

        {/* Bottom Floating Glass Panel */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col justify-end">
          <div 
            className="p-4 sm:p-5 rounded-2xl transition-all duration-300 transform group-hover:-translate-y-1"
            style={{
              background: "linear-gradient(180deg, rgba(18,26,18,0.38) 0%, rgba(10,16,10,0.48) 100%)",
              backdropFilter: "blur(10px) saturate(120%)",
              border: "1px solid rgba(255,255,255,0.28)",
              boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
            }}
          >
            <p
              className="text-xs italic mb-1 font-serif drop-shadow-md"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              {species.latinName}
            </p>
            <h3
              className="font-bold text-xl sm:text-2xl leading-tight mb-3 drop-shadow-lg"
              style={{ color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.85)" }}
            >
              {species.name}
            </h3>
             
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "rgba(255,255,255,0.92)" }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: "var(--green-400)" }} />
                {REGION_LABELS[species.region]}
              </span>
              <span
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-3 group-hover:translate-x-0"
                style={{ color: "#9EF0A8" }}
              >
                Lihat detail <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Outer glow frame on hover */}
        <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 transition-colors duration-500 rounded-[24px] pointer-events-none" />
      </Link>
    </motion.div>
  );
}

// ============================================
// STATS BAR
// ============================================
function StatsBar({ active }: { active: boolean }) {
  const total = useCountUp(speciesData.length, 1200, active);
  const regions = useCountUp(6, 800, active);
  const kritis = useCountUp(speciesData.filter((s) => s.status === "kritis").length, 1000, active);
  const terancam = useCountUp(speciesData.filter((s) => s.status === "terancam").length, 1000, active);

  const items = [
    { value: total, suffix: "+", label: "Spesies Tercatat", color: "var(--green-500)", icon: <Leaf className="w-5 h-5" />, bg: "rgba(46,125,50,0.08)" },
    { value: regions, suffix: "", label: "Wilayah Nusantara", color: "#2196F3", icon: <Globe className="w-5 h-5" />, bg: "rgba(33,150,243,0.08)" },
    { value: kritis, suffix: "", label: "Status Kritis (CR)", color: "var(--status-cr)", icon: <AlertTriangle className="w-5 h-5" />, bg: "rgba(198,40,40,0.08)" },
    { value: terancam, suffix: "", label: "Status Terancam (EN)", color: "var(--status-en)", icon: <Shield className="w-5 h-5" />, bg: "rgba(191,54,12,0.08)" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20, scale: 0.93 }}
          animate={active ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: i * 0.12, duration: 0.5, ease: EASE_OUT_BACK }}
          className="p-4 sm:p-5 rounded-2xl text-center group"
          style={{
            background: "white",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-sm)",
            transition: "box-shadow 0.3s, border-color 0.3s, transform 0.3s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = "var(--shadow-md)";
            el.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = "var(--shadow-sm)";
            el.style.transform = "none";
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2.5"
            style={{ background: item.bg, color: item.color }}
          >
            {item.icon}
          </div>
          <div
            className="text-2xl sm:text-3xl font-bold mb-1"
            style={{ color: item.color, fontVariantNumeric: "tabular-nums" }}
          >
            {item.value}{item.suffix}
          </div>
          <div className="text-xs font-medium leading-tight" style={{ color: "var(--text-muted)" }}>
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// HOMEPAGE
// ============================================
export default function HomePage() {
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const isMapInView = useInView(mapRef, { once: true, margin: "-80px" });
  const isFeaturedInView = useInView(featuredRef, { once: true, margin: "-80px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  const featured = FEATURED_IDS.map((id) => (speciesData as Species[]).find((s) => s.id === id)).filter(Boolean) as Species[];

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsActive(true); },
      { threshold: 0.2 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div>
      {/* ============ HERO ============ */}
      <section
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
        style={{ background: "var(--bg-base)" }}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        <div className="absolute inset-0 dot-pattern pointer-events-none opacity-60" />

        {/* Radial glow top-right */}
        <div
          className="absolute top-0 right-0 w-[60%] h-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(76,175,80,0.12) 0%, transparent 60%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[50%] h-[60%] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 10% 90%, rgba(38,166,154,0.07) 0%, transparent 55%)" }}
        />

        {/* Floating leaf decorations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="absolute top-24 right-12 hidden lg:block"
          style={{ color: "var(--green-400)" }}
        >
          <LeafDecor className="w-44 h-44 animate-float" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute bottom-24 left-8 hidden lg:block"
          style={{ color: "var(--teal-400)", transform: "rotate(130deg)" }}
        >
          <LeafDecor className="w-28 h-28 animate-float-reverse" style={{ animationDelay: "1s" }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute top-[45%] right-[15%] hidden xl:block"
          style={{ color: "var(--green-300)", transform: "rotate(60deg)" }}
        >
          <LeafDecor className="w-16 h-16 animate-float" style={{ animationDelay: "2s" }} />
        </motion.div>

        <div className="container-main relative z-10 py-24 sm:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT — Text */}
            <div className="max-w-xl">
              {/* Eyebrow badge */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-7"
                style={{
                  background: "rgba(46,125,50,0.07)",
                  border: "1px solid rgba(46,125,50,0.20)",
                  color: "var(--green-600)",
                }}
              >
                <span className="dot-live w-2 h-2" />
                Atlas Digital Keanekaragaman Hayati Indonesia
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.65, ease: EASE_STANDARD }}
                className="font-bold mb-6 leading-[1.06]"
                style={{
                  fontSize: "clamp(2.6rem, 5vw, 4.5rem)",
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                Jelajahi
                <br />
                <span className="text-gradient">Kekayaan Hayati</span>
                <br />
                Nusantara
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.65 }}
                className="text-lg leading-relaxed mb-9 max-w-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                Indonesia menyimpan keanekaragaman hayati terkaya di dunia. Kenali flora dan fauna endemiknya — sebelum terlambat.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.65 }}
                className="flex flex-col sm:flex-row gap-3 mb-10"
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/species" className="btn-primary px-7 py-3.5 text-base inline-flex">
                    Jelajahi Spesies
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <a href="#peta" className="btn-outline px-7 py-3.5 text-base inline-flex">
                    Lihat Peta
                  </a>
                </motion.div>
              </motion.div>

              {/* Info pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-2.5"
              >
                {[
                  { label: "17.000+ Pulau", color: "var(--green-500)" },
                  { label: "#2 Megabiodiversitas", color: "#2196F3" },
                  { label: "515+ Mamalia Endemik", color: "var(--status-en)" },
                ].map((pill, i) => (
                  <motion.span
                    key={pill.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.06 }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: "white",
                      border: "1px solid var(--border-light)",
                      color: "var(--text-secondary)",
                      boxShadow: "var(--shadow-xs)",
                    }}
                  >
                    <span style={{ color: pill.color }}>● </span>
                    {pill.label}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — Visual panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: EASE_STANDARD }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                {/* Main image card */}
                <div
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    height: "540px",
                    boxShadow: "0 24px 80px rgba(10,30,10,0.25), 0 8px 32px rgba(10,30,10,0.15)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <Image
                    src="/images/species/harimau-sumatera.jpg"
                    alt="Harimau Sumatera — Simbol Keanekaragaman Hayati Indonesia"
                    fill
                    className="object-cover animate-ken-burns transform-origin-center"
                    priority
                  />
                  {/* Cinematic Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(5,20,5,0.95) 0%, rgba(5,20,5,0.3) 40%, transparent 100%)" }}
                  />
                  {/* Caption */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-xs font-semibold text-white tracking-wide shadow-sm"
                      style={{ background: "rgba(198,40,40,0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Status Kritis (CR)
                    </div>
                    <h3 className="text-white font-serif font-bold text-3xl leading-tight drop-shadow-lg mb-1">
                      Harimau Sumatera
                    </h3>
                    <p className="text-white/80 text-base italic font-medium">Panthera tigris sumatrae</p>
                  </div>
                </div>

                {/* Floating stat cards */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-5 -left-8 px-5 py-4 rounded-2xl glass-strong"
                  style={{
                    border: "1px solid rgba(255,255,255,0.6)",
                    boxShadow: "0 12px 40px rgba(10,30,10,0.15)",
                  }}
                >
                  <div className="text-3xl font-bold" style={{ color: "var(--green-500)", letterSpacing: "-0.03em" }}>
                    {speciesData.length}+
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: "var(--text-muted)" }}>Spesies Terdaftar</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-5 -right-8 px-5 py-4 rounded-2xl glass-strong"
                  style={{
                    border: "1px solid rgba(255,255,255,0.6)",
                    boxShadow: "0 12px 40px rgba(10,30,10,0.15)",
                  }}
                >
                  <div className="text-3xl font-bold" style={{ color: "#2196F3", letterSpacing: "-0.03em" }}>6</div>
                  <div className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: "var(--text-muted)" }}>Wilayah Nusantara</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
            style={{ borderColor: "var(--green-300)" }}
          >
            <div className="w-1 h-2 rounded-full" style={{ background: "var(--green-400)" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ============ STATS ============ */}
      <section
        ref={statsRef}
        className="py-16 sm:py-20"
        style={{
          background: "var(--bg-muted)",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="container-main">
          <StatsBar active={statsActive} />
        </div>
      </section>

      {/* ============ MAP ============ */}
      <section id="peta" ref={mapRef} className="py-20 sm:py-24 lg:py-32" style={{ background: "var(--bg-base)" }}>
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isMapInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="section-label">Peta Interaktif</p>
            <h2
              className="font-bold mb-3"
              style={{ fontSize: "clamp(1.7rem, 3vw, 2.5rem)", color: "var(--text-primary)" }}
            >
              Sebaran Spesies{" "}
              <span className="text-gradient">per Provinsi</span>
            </h2>
            <p className="text-sm max-w-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Klik pada provinsi mana saja untuk melihat spesies endemik yang hidup di wilayah tersebut. Gunakan scroll atau tombol zoom untuk memperbesar area tertentu.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={isMapInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <InteractiveMap />
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURED SPECIES ============ */}
      <section
        ref={featuredRef}
        className="py-20 sm:py-24 lg:py-32"
        style={{ background: "var(--bg-muted)", borderTop: "1px solid var(--border-light)" }}
      >
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isFeaturedInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4"
          >
            <div>
              <p className="section-label">Sorotan</p>
              <h2
                className="font-bold"
                style={{ fontSize: "clamp(1.7rem, 3vw, 2.5rem)", color: "var(--text-primary)" }}
              >
                Mereka Perlu{" "}
                <span style={{ color: "var(--green-700)" }}>Perhatianmu</span>
              </h2>
            </div>
            <Link
              href="/species"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80 flex-shrink-0"
              style={{ color: "var(--green-500)" }}
            >
              Lihat semua spesies
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isFeaturedInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {featured.map((sp) => (
              <FeaturedCard key={sp.id} species={sp} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section ref={ctaRef} className="py-20 sm:py-24 lg:py-32" style={{ background: "var(--bg-base)" }}>
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            animate={isCtaInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: EASE_STANDARD }}
            className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-20 text-center"
            style={{
              background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
              boxShadow: "0 20px 40px rgba(4,120,87,0.15)",
            }}
          >
            {/* Background layers */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 70%)",
              }}
            />

            {/* Decorative leaves */}
            <LeafDecor
              className="absolute top-6 left-10 w-32 text-white hidden sm:block"
              style={{ transform: "rotate(-20deg)", opacity: 0.18 }}
            />
            <LeafDecor
              className="absolute bottom-6 right-10 w-28 text-white hidden sm:block"
              style={{ transform: "rotate(35deg)", opacity: 0.15 }}
            />
            <div
              className="absolute top-0 right-0 w-[40%] h-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 90% 10%, rgba(255,255,255,0.08) 0%, transparent 60%)" }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative z-10 max-w-2xl mx-auto"
            >
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 text-xs font-semibold text-white"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Leaf className="w-3.5 h-3.5" />
                Ambil Tindakan Sekarang
              </div>
              <h2
                className="font-bold text-white mb-5"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.02em", fontFamily: "var(--font-playfair), serif" }}
              >
                Jadilah Bagian dari Solusi
              </h2>
              <p className="text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.9)" }}>
                Setiap spesies yang punah adalah kehilangan permanen. Kenali kekayaan alam kita, sebarkan kesadaran, dan ambil tindakan nyata hari ini bersama NusantaraHijau.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Link
                    href="/species"
                    className="inline-flex items-center justify-center w-full gap-2 px-8 py-4 rounded-full font-bold text-sm transition-all duration-300"
                    style={{
                      background: "white",
                      color: "#064e3b",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    }}
                  >
                    Mulai Jelajahi
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full gap-2 px-8 py-4 rounded-full font-bold text-sm transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    Hubungi Kami
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
