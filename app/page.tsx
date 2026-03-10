"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import speciesData from "@/data/species.json";

// Load map client-side only (no SSR — avoids window errors)
const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
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

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string; label: string }> = {
  kritis: {
    color: "var(--status-cr)",
    bg: "var(--status-cr-bg)",
    border: "var(--status-cr-border)",
    label: "Kritis",
  },
  terancam: {
    color: "var(--status-en)",
    bg: "var(--status-en-bg)",
    border: "var(--status-en-border)",
    label: "Terancam",
  },
  rentan: {
    color: "var(--status-vu)",
    bg: "var(--status-vu-bg)",
    border: "var(--status-vu-border)",
    label: "Rentan",
  },
};

const FEATURED_IDS = ["harimau-sumatera", "komodo", "jalak-bali"];

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
        opacity="0.12"
      />
      <path d="M40 8C40 8 40 30 40 72" stroke="currentColor" strokeWidth="1.5" opacity="0.2" strokeDasharray="3 3" />
    </svg>
  );
}

// ============================================
// STATUS BADGE
// ============================================
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status];
  if (!s) return null;
  return (
    <span
      className="badge"
      style={{
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
}

// ============================================
// FEATURED CARD
// ============================================
function FeaturedCard({ species, index }: { species: Species; index: number }) {
  return (
    <Link
      href={`/species/${species.id}`}
      className="card card-lift group flex flex-col overflow-hidden"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <Image
          src={species.image}
          alt={species.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(26,46,26,0.5) 0%, transparent 60%)",
          }}
        />
        <div className="absolute top-3 right-3">
          <StatusBadge status={species.status} />
        </div>
        <div className="absolute top-3 left-3">
          <span
            className="badge capitalize"
            style={{
              background: "rgba(255,255,255,0.9)",
              color: "var(--text-secondary)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            {species.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs italic mb-0.5" style={{ color: "var(--text-muted)" }}>
          {species.latinName}
        </p>
        <h3
          className="font-bold text-base mb-2 group-hover:text-green-600 transition-colors"
          style={{ color: "var(--text-primary)" }}
        >
          {species.name}
        </h3>
        <p className="text-sm leading-relaxed line-clamp-2 flex-1 mb-4" style={{ color: "var(--text-muted)" }}>
          {species.description}
        </p>
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border-light)" }}>
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
            <MapPin className="w-3 h-3" />
            {REGION_LABELS[species.region]}
          </span>
          <span
            className="flex items-center gap-0.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: "var(--green-500)" }}
          >
            Detail <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Color accent */}
      <div
        className="h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{
          background: `linear-gradient(90deg, ${species.color}, transparent)`,
        }}
      />
    </Link>
  );
}

// ============================================
// STATS SECTION
// ============================================
function StatsBar({ active }: { active: boolean }) {
  const total = useCountUp(speciesData.length, 1200, active);
  const regions = useCountUp(6, 800, active);
  const kritis = useCountUp(speciesData.filter((s) => s.status === "kritis").length, 1000, active);
  const terancam = useCountUp(speciesData.filter((s) => s.status === "terancam").length, 1000, active);

  const items = [
    { value: total, suffix: "+", label: "Spesies", color: "var(--green-500)" },
    { value: regions, suffix: "", label: "Wilayah", color: "#2196F3" },
    {
      value: kritis,
      suffix: "",
      label: "Status Kritis",
      color: "var(--status-cr)",
    },
    {
      value: terancam,
      suffix: "",
      label: "Status Terancam",
      color: "var(--status-en)",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl text-center"
          style={{
            background: "white",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="text-3xl font-bold mb-1" style={{ color: item.color, fontVariantNumeric: "tabular-nums" }}>
            {item.value}
            {item.suffix}
          </div>
          <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            {item.label}
          </div>
        </div>
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

  const featured = FEATURED_IDS.map((id) => (speciesData as Species[]).find((s) => s.id === id)).filter(
    Boolean,
  ) as Species[];

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStatsActive(true);
      },
      { threshold: 0.3 },
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
        {/* Decorative background */}
        <div className="absolute inset-0 dot-pattern pointer-events-none" />
        <div
          className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at top right, var(--green-50) 0%, transparent 70%)",
          }}
        />

        {/* Leaf decorations */}
        <LeafDecor className="absolute top-20 right-16 w-40 h-40 text-green-500 hidden lg:block" />
        <LeafDecor
          className="absolute bottom-20 left-10 w-24 h-24 text-green-400 hidden lg:block"
          style={{ transform: "rotate(120deg)" }}
        />

        <div className="container-main relative z-10 py-20">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 animate-fade-up"
              style={{
                background: "var(--green-50)",
                border: "1px solid var(--green-100)",
                color: "var(--green-600)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--green-400)" }} />
              Atlas Digital Keanekaragaman Hayati
            </div>

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.08] animate-fade-up delay-1"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
            >
              Jelajahi
              <br />
              <span className="text-gradient">Kekayaan Hayati</span>
              <br />
              Nusantara
            </h1>

            {/* Sub */}
            <p
              className="text-lg leading-relaxed mb-9 max-w-lg animate-fade-up delay-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Indonesia menyimpan keanekaragaman hayati terkaya di dunia. Kenali flora dan fauna endemiknya — sebelum
              terlambat.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up delay-3">
              <Link href="/species" className="btn-primary px-7 py-3.5 text-base">
                Jelajahi Spesies
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#peta" className="btn-outline px-7 py-3.5 text-base">
                Lihat Peta
              </a>
            </div>

            {/* Quick stat pills */}
            <div className="flex flex-wrap gap-3 mt-10 animate-fade-up delay-4">
              {[
                { label: "17.000+ Pulau", color: "var(--green-500)" },
                { label: "#2 Megabiodiversitas", color: "#2196F3" },
                { label: "515+ Mamalia Endemik", color: "var(--status-en)" },
              ].map((pill) => (
                <span
                  key={pill.label}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "white",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-secondary)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <span style={{ color: pill.color }}>● </span>
                  {pill.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-float">
          <div
            className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
            style={{ borderColor: "var(--green-300)" }}
          >
            <div className="w-1 h-2 rounded-full animate-bounce" style={{ background: "var(--green-400)" }} />
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section
        ref={statsRef}
        className="py-14"
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
      <section id="peta" className="py-20" style={{ background: "var(--bg-base)" }}>
        <div className="container-main">
          {/* Header */}
          <div className="mb-10">
            <p className="section-label">Peta Interaktif</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              Sebaran Spesies
              <span className="text-gradient"> per Provinsi</span>
            </h2>
            <p className="text-sm max-w-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Klik pada provinsi mana saja untuk melihat spesies endemik yang hidup di wilayah tersebut. Gunakan scroll
              atau tombol zoom untuk memperbesar area tertentu.
            </p>
          </div>

          <InteractiveMap />
        </div>
      </section>

      {/* ============ FEATURED SPECIES ============ */}
      <section
        className="py-20"
        style={{
          background: "var(--bg-muted)",
          borderTop: "1px solid var(--border-light)",
        }}
      >
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="section-label">Sorotan</p>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                Mereka Perlu
                <span className="text-gradient"> Perhatianmu</span>
              </h2>
            </div>
            <Link
              href="/species"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: "var(--green-500)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green-600)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--green-500)")}
            >
              Lihat semua spesies
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featured.map((sp, i) => (
              <FeaturedCard key={sp.id} species={sp} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="py-20" style={{ background: "var(--bg-base)" }}>
        <div className="container-main">
          <div
            className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center"
            style={{
              background: "linear-gradient(135deg, var(--green-500) 0%, var(--green-600) 100%)",
            }}
          >
            {/* Decorative leaves */}
            <LeafDecor
              className="absolute top-4 left-8 w-28 text-white hidden sm:block"
              style={{ transform: "rotate(-20deg)" }}
            />
            <LeafDecor
              className="absolute bottom-4 right-8 w-24 text-white hidden sm:block"
              style={{ transform: "rotate(30deg)" }}
            />

            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
                Jadilah Bagian dari Solusi
              </h2>
              <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.85)" }}>
                Setiap spesies yang punah adalah kehilangan permanen. Kenali, sebarkan, dan ambil tindakan nyata hari
                ini.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/species"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    background: "white",
                    color: "var(--green-600)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  }}
                >
                  Mulai Jelajahi
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    border: "1.5px solid rgba(255,255,255,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                  }}
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
