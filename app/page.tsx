"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Leaf,
  AlertTriangle,
  Shield,
  Eye,
  ChevronRight,
  X,
  MapPin,
} from "lucide-react";
import speciesData from "@/data/species.json";

// TYPES
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

// CONSTANTS
const REGION_LABELS: Record<string, string> = {
  sumatera: "Sumatera",
  kalimantan: "Kalimantan",
  jawa: "Jawa",
  sulawesi: "Sulawesi",
  papua: "Papua",
  "bali-nusra": "Bali & Nusa Tenggara",
};

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
  }
> = {
  kritis: {
    label: "Kritis",
    color: "#E74C3C",
    bg: "rgba(231,76,60,0.12)",
    border: "rgba(231,76,60,0.3)",
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  terancam: {
    label: "Terancam",
    color: "#E67E22",
    bg: "rgba(230,126,34,0.12)",
    border: "rgba(230,126,34,0.3)",
    icon: <Shield className="w-3 h-3" />,
  },
  rentan: {
    label: "Rentan",
    color: "#F1C40F",
    bg: "rgba(241,196,15,0.12)",
    border: "rgba(241,196,15,0.3)",
    icon: <Eye className="w-3 h-3" />,
  },
};

const FEATURED_IDS = ["harimau-sumatera", "komodo", "jalak-bali"];

// HOOKS
function useCountUp(
  target: number,
  duration: number = 1500,
  start: boolean = false,
) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Status Badge
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        color: cfg.color,
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// Species Card (Featured)
function FeaturedCard({ species, index }: { species: Species; index: number }) {
  return (
    <Link
      href={`/species/${species.id}`}
      className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#0D1B2E] hover:border-[#2ECC71]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={species.image}
          alt={species.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/images/species/harimau-sumatera.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2E] via-[#0D1B2E]/20 to-transparent" />
        {/* Status badge overlay */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={species.status} />
        </div>
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/40 backdrop-blur-sm text-white/70 border border-white/10 capitalize">
            {species.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-[#90A4AE] text-xs italic mb-1">
          {species.latinName}
        </p>
        <h3
          className="text-white font-bold text-lg mb-2 group-hover:text-[#2ECC71] transition-colors duration-300"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {species.name}
        </h3>
        <p className="text-[#90A4AE] text-sm line-clamp-2 leading-relaxed mb-4">
          {species.description.substring(0, 100)}...
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#546E7A]">
            <MapPin className="w-3 h-3" />
            {REGION_LABELS[species.region]}
          </div>
          <span className="flex items-center gap-1 text-[#2ECC71] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Lihat detail <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{
          background: `linear-gradient(90deg, ${species.color}, transparent)`,
        }}
      />
    </Link>
  );
}

// INDONESIA SVG MAP COMPONENT
function IndonesiaMap({
  activeRegion,
  onRegionHover,
  onRegionClick,
}: {
  activeRegion: string | null;
  onRegionHover: (region: string | null) => void;
  onRegionClick: (region: string) => void;
}) {
  const regions = [
    {
      id: "sumatera",
      label: "Sumatera",
      cx: 200,
      cy: 200,
      path: "M 80 160 L 120 140 L 180 145 L 240 155 L 280 175 L 300 210 L 290 250 L 260 280 L 220 290 L 190 285 L 160 265 L 130 240 L 100 210 Z",
    },
    {
      id: "kalimantan",
      label: "Kalimantan",
      cx: 420,
      cy: 210,
      path: "M 330 155 L 390 145 L 460 150 L 510 165 L 530 195 L 520 235 L 490 265 L 450 280 L 400 275 L 360 255 L 335 225 L 325 190 Z",
    },
    {
      id: "jawa",
      label: "Jawa",
      cx: 390,
      cy: 310,
      path: "M 310 295 L 360 288 L 420 292 L 470 300 L 490 315 L 475 330 L 430 338 L 370 335 L 325 322 L 308 308 Z",
    },
    {
      id: "sulawesi",
      label: "Sulawesi",
      cx: 560,
      cy: 210,
      path: "M 545 155 L 575 150 L 590 170 L 580 200 L 560 215 L 575 235 L 565 260 L 545 255 L 535 235 L 540 210 L 525 190 L 535 170 Z",
    },
    {
      id: "papua",
      label: "Papua",
      cx: 720,
      cy: 225,
      path: "M 640 175 L 700 165 L 760 170 L 800 190 L 810 225 L 795 260 L 750 275 L 700 270 L 660 250 L 635 220 Z",
    },
    {
      id: "bali-nusra",
      label: "Bali & Nusa Tenggara",
      cx: 510,
      cy: 320,
      path: "M 500 308 L 525 305 L 560 310 L 590 320 L 595 332 L 570 338 L 535 335 L 505 325 Z",
    },
  ];

  return (
    <svg
      viewBox="0 0 900 420"
      className="w-full h-full"
      style={{ filter: "drop-shadow(0 0 30px rgba(46,204,113,0.05))" }}
    >
      {/* Ocean background */}
      <rect width="900" height="420" fill="transparent" />

      {/* Grid lines (subtle) */}
      {[150, 200, 250, 300, 350].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="900"
          y2={y}
          stroke="rgba(46,204,113,0.04)"
          strokeWidth="1"
        />
      ))}
      {[200, 300, 400, 500, 600, 700].map((x) => (
        <line
          key={x}
          x1={x}
          y1="0"
          x2={x}
          y2="420"
          stroke="rgba(46,204,113,0.04)"
          strokeWidth="1"
        />
      ))}

      {regions.map((region) => {
        const isHovered = activeRegion === region.id;
        const speciesCount = speciesData.filter(
          (s) => s.region === region.id,
        ).length;

        return (
          <g key={region.id}>
            {/* Glow effect when active */}
            {isHovered && (
              <path
                d={region.path}
                fill="rgba(46,204,113,0.15)"
                stroke="rgba(46,204,113,0.6)"
                strokeWidth="3"
                style={{ filter: "blur(6px)" }}
              />
            )}

            {/* Main region shape */}
            <path
              d={region.path}
              fill={isHovered ? "rgba(46,204,113,0.35)" : "rgba(26,58,92,0.8)"}
              stroke={isHovered ? "#2ECC71" : "rgba(46,107,156,0.6)"}
              strokeWidth={isHovered ? "1.5" : "1"}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => onRegionHover(region.id)}
              onMouseLeave={() => onRegionHover(null)}
              onClick={() => onRegionClick(region.id)}
              style={{
                filter: isHovered
                  ? "drop-shadow(0 0 8px rgba(46,204,113,0.4))"
                  : "none",
              }}
            />

            {/* Label */}
            <text
              x={region.cx}
              y={region.cy - 5}
              textAnchor="middle"
              fill={isHovered ? "#2ECC71" : "rgba(255,255,255,0.5)"}
              fontSize="9"
              fontWeight={isHovered ? "700" : "400"}
              className="pointer-events-none select-none transition-all duration-300"
              style={{
                fontFamily: "Inter, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              {region.label.toUpperCase()}
            </text>

            {/* Species count dot */}
            <circle
              cx={region.cx}
              cy={region.cy + 8}
              r={isHovered ? 10 : 8}
              fill={isHovered ? "#2ECC71" : "rgba(46,204,113,0.25)"}
              stroke={
                isHovered ? "rgba(46,204,113,0.5)" : "rgba(46,204,113,0.2)"
              }
              strokeWidth="1"
              className="pointer-events-none transition-all duration-300"
            />
            <text
              x={region.cx}
              y={region.cy + 12}
              textAnchor="middle"
              fill={isHovered ? "#0A1628" : "#2ECC71"}
              fontSize="8"
              fontWeight="700"
              className="pointer-events-none select-none"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {speciesCount}
            </text>
          </g>
        );
      })}

      {/* Decorative dots (islands) */}
      {[
        [620, 220],
        [630, 240],
        [610, 260],
        [600, 240],
        [580, 250],
        [590, 265],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="3"
          fill="rgba(26,58,92,0.6)"
          stroke="rgba(46,107,156,0.4)"
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}

// STATS SECTION
function StatsSection({ visible }: { visible: boolean }) {
  const totalSpecies = useCountUp(speciesData.length, 1200, visible);
  const totalRegions = useCountUp(6, 800, visible);
  const kritisCount = useCountUp(
    speciesData.filter((s) => s.status === "kritis").length,
    1000,
    visible,
  );
  const terancamCount = useCountUp(
    speciesData.filter((s) => s.status === "terancam").length,
    1000,
    visible,
  );

  const stats = [
    {
      value: totalSpecies,
      label: "Spesies Terdokumentasi",
      suffix: "+",
      color: "#2ECC71",
    },
    {
      value: totalRegions,
      label: "Wilayah Nusantara",
      suffix: "",
      color: "#3498DB",
    },
    {
      value: kritisCount,
      label: "Status Kritis (CR)",
      suffix: "",
      color: "#E74C3C",
    },
    {
      value: terancamCount,
      label: "Status Terancam (EN)",
      suffix: "",
      color: "#E67E22",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="relative p-5 rounded-2xl border border-white/6 bg-[#0D1B2E]/80 text-center group hover:border-white/10 transition-all duration-300"
        >
          <div
            className="text-4xl font-bold mb-1 transition-all duration-300"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: stat.color,
              textShadow: `0 0 20px ${stat.color}40`,
            }}
          >
            {stat.value}
            {stat.suffix}
          </div>
          <div className="text-[#90A4AE] text-xs font-medium">{stat.label}</div>
          {/* bottom line */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-px transition-all duration-500"
            style={{ backgroundColor: stat.color }}
          />
        </div>
      ))}
    </div>
  );
}

// MAIN PAGE
export default function HomePage() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const featuredSpecies = FEATURED_IDS.map((id) =>
    speciesData.find((s) => s.id === id),
  ).filter(Boolean) as Species[];

  const sidebarSpecies = selectedRegion
    ? speciesData.filter((s) => s.region === selectedRegion)
    : [];

  // Intersection Observer for stats counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region);
    setSidebarOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #2ECC71, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8"
            style={{
              background: "radial-gradient(circle, #3498DB, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <div className="section-container relative z-10 text-center px-4 py-20">
          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2ECC71]/20 bg-[#2ECC71]/5 mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-pulse" />
            <span className="text-[#2ECC71] text-xs font-semibold tracking-widest uppercase">
              Atlas Digital Keanekaragaman Hayati
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-[1.1] animate-fade-in-up"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Jelajahi Kekayaan
            <br />
            <span className="gradient-text">Hayati Nusantara</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#90A4AE] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up stagger-2">
            Dari ujung Sumatera hingga Papua, Indonesia menyimpan keanekaragaman
            hayati terkaya di dunia. Kenali, cintai, dan ikut lestarikan mereka.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
            <Link
              href="/species"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white font-semibold rounded-2xl shadow-lg shadow-green-900/30 hover:shadow-green-700/40 hover:scale-105 transition-all duration-300"
            >
              <Leaf className="w-5 h-5" />
              Jelajahi Semua Spesies
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#peta"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <MapPin className="w-5 h-5 text-[#2ECC71]" />
              Lihat Peta Interaktif
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
            <span className="text-[#546E7A] text-xs tracking-widest uppercase">
              Scroll
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-[#2ECC71]/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="py-16 border-y border-white/5 bg-[#060E1A]/50"
      >
        <div className="section-container px-4">
          <StatsSection visible={statsVisible} />
        </div>
      </section>

      {/* Map Section */}
      <section id="peta" className="py-24 relative">
        <div className="section-container px-4">
          {/* Section header */}
          <div className="text-center mb-14">
            <p className="text-[#2ECC71] text-xs font-semibold tracking-widest uppercase mb-3">
              Peta Interaktif
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Sebaran Spesies
              <span className="gradient-text"> per Wilayah</span>
            </h2>
            <p className="text-[#90A4AE] max-w-xl mx-auto text-sm leading-relaxed">
              Klik pada wilayah untuk melihat daftar spesies endemik yang hidup
              di sana. Angka pada setiap wilayah menunjukkan jumlah spesies yang
              terdokumentasi.
            </p>
          </div>

          {/* Map + Sidebar layout */}
          <div className="relative flex gap-6">
            {/* Map Container */}
            <div
              className={`relative rounded-3xl border border-white/8 bg-[#060E1A]/80 overflow-hidden transition-all duration-500 ${
                sidebarOpen ? "flex-1" : "w-full"
              }`}
              style={{ minHeight: "420px" }}
            >
              {/* Map background glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(46,204,113,0.03) 0%, transparent 70%)",
                }}
              />

              <div
                className="p-6 h-full flex items-center justify-center"
                style={{ minHeight: "420px" }}
              >
                <IndonesiaMap
                  activeRegion={activeRegion}
                  onRegionHover={setActiveRegion}
                  onRegionClick={handleRegionClick}
                />
              </div>

              {/* Hover tooltip */}
              {activeRegion && !sidebarOpen && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/20 backdrop-blur-sm">
                  <span className="text-[#2ECC71] text-sm font-medium">
                    {REGION_LABELS[activeRegion]} →{" "}
                    {
                      speciesData.filter((s) => s.region === activeRegion)
                        .length
                    }{" "}
                    Spesies — Klik untuk lihat
                  </span>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div
              className={`transition-all duration-500 overflow-hidden ${
                sidebarOpen ? "w-80 opacity-100" : "w-0 opacity-0"
              }`}
            >
              {sidebarOpen && selectedRegion && (
                <div className="w-80 h-full rounded-3xl border border-white/8 bg-[#0D1B2E] flex flex-col overflow-hidden">
                  {/* Sidebar Header */}
                  <div className="p-5 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[#2ECC71] text-xs font-semibold uppercase tracking-widest mb-0.5">
                        Wilayah
                      </p>
                      <h3
                        className="text-white font-bold text-lg"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {REGION_LABELS[selectedRegion]}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#90A4AE] hover:text-white hover:bg-white/10 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Species List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {sidebarSpecies.map((species) => (
                      <Link
                        key={species.id}
                        href={`/species/${species.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-[#2ECC71]/20 hover:bg-[#2ECC71]/5 transition-all duration-200 group"
                      >
                        {/* Species image thumbnail */}
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                          <Image
                            src={species.image}
                            alt={species.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/species/harimau-sumatera.jpg";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate group-hover:text-[#2ECC71] transition-colors">
                            {species.name}
                          </p>
                          <p className="text-[#546E7A] text-xs italic truncate">
                            {species.latinName}
                          </p>
                          <div className="mt-1">
                            <StatusBadge status={species.status} />
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#546E7A] group-hover:text-[#2ECC71] flex-shrink-0 transition-colors" />
                      </Link>
                    ))}
                  </div>

                  {/* Footer CTA */}
                  <div className="p-4 border-t border-white/5">
                    <Link
                      href={`/species?region=${selectedRegion}`}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#2ECC71] text-sm font-semibold hover:bg-[#2ECC71]/20 transition-all duration-200"
                    >
                      Lihat Semua di {REGION_LABELS[selectedRegion]}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Species */}
      <section className="py-24 bg-[#060E1A]/50 border-t border-white/5">
        <div className="section-container px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-[#2ECC71] text-xs font-semibold tracking-widest uppercase mb-3">
                Sorotan Spesies
              </p>
              <h2
                className="text-4xl lg:text-5xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Mereka Butuh
                <span className="gradient-text"> Perhatianmu</span>
              </h2>
            </div>
            <Link
              href="/species"
              className="group inline-flex items-center gap-2 text-[#2ECC71] text-sm font-semibold hover:gap-3 transition-all duration-300 whitespace-nowrap"
            >
              Lihat semua spesies
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSpecies.map((species, index) => (
              <FeaturedCard key={species.id} species={species} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24">
        <div className="section-container px-4">
          <div className="relative rounded-3xl overflow-hidden border border-[#2ECC71]/10 bg-gradient-to-br from-[#0D1B2E] to-[#060E1A] p-12 text-center">
            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(46,204,113,0.08) 0%, transparent 65%)",
              }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2ECC71]/10 border border-[#2ECC71]/20 mb-6 animate-float">
                <Leaf className="w-8 h-8 text-[#2ECC71]" />
              </div>
              <h2
                className="text-4xl lg:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Jadilah Bagian dari
                <span className="gradient-text"> Solusi</span>
              </h2>
              <p className="text-[#90A4AE] max-w-lg mx-auto text-base leading-relaxed mb-8">
                Setiap spesies yang punah adalah kehilangan permanen untuk
                selamanya. Kenali mereka, sebarkan informasinya, dan ambil
                tindakan nyata.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/species"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white font-semibold rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-green-900/30"
                >
                  <Leaf className="w-5 h-5" />
                  Mulai Jelajahi
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300"
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
