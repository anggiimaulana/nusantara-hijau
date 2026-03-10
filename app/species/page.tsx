"use client";

import speciesData from "@/data/species.json";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertTriangle,
    ChevronRight,
    Eye,
    Grid3X3,
    Leaf,
    List,
    MapPin,
    Search,
    Shield,
    SlidersHorizontal,
    X,
} from "lucide-react";
import { resolveSpeciesImage } from "@/lib/species-images";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

// ============================================
// TYPES & CONSTANTS
// ============================================
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

const REGIONS = [
  { value: "all", label: "Semua Wilayah" },
  { value: "sumatera", label: "Sumatera" },
  { value: "kalimantan", label: "Kalimantan" },
  { value: "jawa", label: "Jawa" },
  { value: "sulawesi", label: "Sulawesi" },
  { value: "papua", label: "Papua" },
  { value: "bali-nusra", label: "Bali & Nusa Tenggara" },
];

const TYPES = [
  { value: "all", label: "Flora & Fauna" },
  { value: "fauna", label: "Fauna" },
  { value: "flora", label: "Flora" },
];

const STATUSES = [
  { value: "all", label: "Semua Status", color: "#90A4AE", icon: null },
  {
    value: "kritis",
    label: "Kritis (CR)",
    color: "#E74C3C",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  {
    value: "terancam",
    label: "Terancam (EN)",
    color: "#E67E22",
    icon: <Shield className="w-3.5 h-3.5" />,
  },
  {
    value: "rentan",
    label: "Rentan (VU)",
    color: "#F1C40F",
    icon: <Eye className="w-3.5 h-3.5" />,
  },
];

const STATUS_CONFIG: Record<
  string,
  {
    color: string;
    bg: string;
    border: string;
    label: string;
    icon: React.ReactNode;
  }
> = {
  kritis: {
    label: "Kritis",
    color: "#C0392B",
    bg: "rgba(192,57,43,0.1)",
    border: "rgba(192,57,43,0.25)",
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  terancam: {
    label: "Terancam",
    color: "#D35400",
    bg: "rgba(211,84,0,0.1)",
    border: "rgba(211,84,0,0.25)",
    icon: <Shield className="w-3 h-3" />,
  },
  rentan: {
    label: "Rentan",
    color: "#B7950B",
    bg: "rgba(183,149,11,0.1)",
    border: "rgba(183,149,11,0.25)",
    icon: <Eye className="w-3 h-3" />,
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
const EASE_STANDARD: [number, number, number, number] = [0.4, 0, 0.2, 1];
const EASE_OUT_BACK: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

// ============================================
// ANIMATION VARIANTS
// ============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

// ============================================
// STATUS BADGE
// ============================================
function StatusBadge({ status, overlay = false }: { status: string; overlay?: boolean }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        color: overlay ? "#fff" : cfg.color,
        backgroundColor: overlay ? cfg.color : cfg.bg,
        border: overlay ? "1px solid rgba(255,255,255,0.25)" : `1px solid ${cfg.border}`,
        textShadow: overlay ? "0 1px 3px rgba(0,0,0,0.35)" : "none",
      }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ============================================
// STATUS BADGE
// ============================================

// ============================================
// SPECIES CARD (GRID VIEW)
// ============================================
function SpeciesCard({ species, index }: { species: Species; index: number }) {
  const isCritical = species.status === "kritis";
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_OUT_BACK } }}
    >
      <Link
        href={`/species/${species.id}`}
        className="group relative flex flex-col overflow-hidden h-[260px] sm:h-[300px] lg:h-[360px] rounded-2xl sm:rounded-[24px]"
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
          style={{ background: "linear-gradient(to top, rgba(5,12,5,0.98) 0%, rgba(5,12,5,0.7) 40%, transparent 80%)" }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 scale-90 sm:scale-100 origin-top-right">
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
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
          <span
            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-white shadow-sm"
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
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 z-10 flex flex-col justify-end">
          <div 
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform group-hover:-translate-y-1"
            style={{
              background: "linear-gradient(180deg, rgba(18,26,18,0.38) 0%, rgba(10,16,10,0.48) 100%)",
              backdropFilter: "blur(10px) saturate(120%)",
              border: "1px solid rgba(255,255,255,0.28)",
              boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
            }}
          >
            <p
              className="text-[10px] sm:text-xs italic mb-0.5 sm:mb-1 font-serif line-clamp-1 drop-shadow-md"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              {species.latinName}
            </p>
            <h3
              className="font-bold text-base sm:text-lg lg:text-xl leading-tight mb-1.5 sm:mb-2.5 drop-shadow-lg line-clamp-1"
              style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.85)" }}
            >
              {species.name}
            </h3>
             
            <div className="flex items-center justify-between pt-2 sm:pt-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "rgba(255,255,255,0.92)" }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: "var(--green-400)" }} />
                <span className="truncate max-w-[120px]">{REGION_LABELS[species.region] || species.region}</span>
              </span>
              <span
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-3 group-hover:translate-x-0"
                style={{ color: "#9EF0A8" }}
              >
                Detail <ChevronRight className="w-3.5 h-3.5" />
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
// SPECIES LIST ITEM (LIST VIEW)
// ============================================
const STATUS_LEFT_COLOR: Record<string, string> = {
  kritis: "#C0392B",
  terancam: "#D35400",
  rentan: "#B7950B",
};

function SpeciesListItem({ species, index }: { species: Species; index: number }) {
  const leftColor = STATUS_LEFT_COLOR[species.status] || "var(--border-medium)";
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.03 }}
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
    >
      <Link
        href={`/species/${species.id}`}
        className="group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 overflow-hidden relative"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-light)",
          borderLeft: `3px solid ${leftColor}`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)";
          (e.currentTarget as HTMLElement).style.borderLeftColor = leftColor;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)";
          (e.currentTarget as HTMLElement).style.borderLeftColor = leftColor;
        }}
      >
        {/* Thumbnail */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={resolveSpeciesImage(species.image)}
            alt={species.name}
            fill
            sizes="64px"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3
                className="font-semibold text-sm transition-colors duration-200"
                style={{ color: "var(--text-primary)" }}
              >
                <span className="group-hover:text-[var(--green-500)]">
                  {species.name}
                </span>
              </h3>
              <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
                {species.latinName}
              </p>
            </div>
            <StatusBadge status={species.status} />
          </div>
          <p
            className="text-xs line-clamp-1 hidden sm:block mb-1"
            style={{ color: "var(--text-muted)" }}
          >
            {species.description}
          </p>
          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <MapPin className="w-3 h-3" />
              {REGION_LABELS[species.region]}
            </span>
            <span
              className="text-xs capitalize"
              style={{ color: "var(--text-faint)" }}
            >
              • {species.type}
            </span>
          </div>
        </div>

        <ChevronRight
          className="w-4 h-4 flex-shrink-0 transition-colors duration-200"
          style={{ color: "var(--text-faint)" }}
        />
      </Link>
    </motion.div>
  );
}

// ============================================
// FILTER CHIP
// ============================================
function FilterChip({
  label,
  active,
  color,
  icon,
  onClick,
}: {
  label: string;
  active: boolean;
  color?: string;
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap"
      style={
        active
          ? {
              backgroundColor: color ? `${color}15` : "var(--green-50)",
              border: `1px solid ${color ? `${color}40` : "var(--green-200)"}`,
              color: color || "var(--green-600)",
            }
          : {
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              color: "var(--text-muted)",
            }
      }
    >
      {icon}
      {label}
    </motion.button>
  );
}

// ============================================
// EMPTY STATE
// ============================================
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: "var(--bg-muted)",
          border: "1px solid var(--border-light)",
        }}
      >
        <Search className="w-7 h-7" style={{ color: "var(--text-muted)" }} />
      </div>
      <h3
        className="font-bold text-xl mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        Tidak ada spesies ditemukan
      </h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: "var(--text-muted)" }}>
        Coba ubah filter atau kata kunci pencarianmu.
      </p>
      <button
        onClick={onReset}
        className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
        style={{
          background: "var(--green-50)",
          border: "1px solid var(--green-200)",
          color: "var(--green-600)",
        }}
      >
        Reset Semua Filter
      </button>
    </motion.div>
  );
}

// ============================================
// MAIN SPECIES PAGE CONTENT
// ============================================
function SpeciesPageContent() {
  const ITEMS_PER_PAGE = 12;
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState(
    searchParams.get("region") || "all"
  );
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    const region = searchParams.get("region");
    if (!region) return;
    const timer = window.setTimeout(() => setRegionFilter(region), 0);
    return () => window.clearTimeout(timer);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return (speciesData as Species[]).filter((s) => {
      const matchSearch =
        search === "" ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.latinName.toLowerCase().includes(search.toLowerCase());
      const matchRegion = regionFilter === "all" || s.region === regionFilter;
      const matchType = typeFilter === "all" || s.type === typeFilter;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchRegion && matchType && matchStatus;
    });
  }, [search, regionFilter, typeFilter, statusFilter]);
  const visibleSpecies = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );
  const hasMore = filtered.length > visibleCount;

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [search, regionFilter, typeFilter, statusFilter, viewMode]);

  const activeFilterCount = [
    regionFilter !== "all",
    typeFilter !== "all",
    statusFilter !== "all",
    search !== "",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearch("");
    setRegionFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const kritisCount = filtered.filter((s) => s.status === "kritis").length;
  const terancamCount = filtered.filter((s) => s.status === "terancam").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-16"
      style={{ background: "var(--bg-base)" }}
    >
      {/* ==================== PAGE HEADER ==================== */}
      <div className="container-main px-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_STANDARD }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-12"
          style={{
            background: "linear-gradient(135deg, var(--green-500) 0%, var(--green-600) 100%)",
          }}
        >
          {/* Decorative elements */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(255,255,255,0.4) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <Leaf className="w-3.5 h-3.5 text-white" />
              <span className="text-white text-xs font-semibold tracking-widest uppercase">
                Atlas Spesies
              </span>
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl font-bold text-white mb-3"
                >
                  Direktori
                  <span className="text-white/80"> Spesies</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm max-w-lg leading-relaxed text-white/85"
                >
                  {speciesData.length} spesies endemik Indonesia dari 6 wilayah
                  Nusantara. Filter, cari, dan temukan informasi lengkap setiap
                  spesies.
                </motion.p>
              </div>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3"
              >
                {[
                  {
                    count: speciesData.filter((s) => s.status === "kritis").length,
                    label: "Kritis",
                    color: "#ff6b6b",
                  },
                  {
                    count: speciesData.filter((s) => s.status === "terancam").length,
                    label: "Terancam",
                    color: "#ffa726",
                  },
                  {
                    count: speciesData.filter((s) => s.status === "rentan").length,
                    label: "Rentan",
                    color: "#ffca28",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="text-center px-4 py-3 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div className="text-2xl font-bold text-white">
                      {stat.count}
                    </div>
                    <div className="text-white/70 text-xs mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ==================== SEARCH & FILTER BAR ==================== */}
      <div className="container-main px-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search + View Toggle Row */}
          <div className="flex gap-3">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative flex-1"
            >
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                placeholder="Cari nama spesies atau nama latin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 rounded-xl text-sm transition-all duration-200 focus:outline-none"
                style={{
                  background: "var(--bg-surface)",
                  border: "1.5px solid var(--border-light)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--green-400)";
                  e.target.style.boxShadow = "var(--shadow-glow)";
                  e.target.style.background = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-light)";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "var(--bg-surface)";
                }}
              />
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    background: "var(--bg-muted)",
                    color: "var(--text-muted)",
                  }}
                >
                  <X className="w-3 h-3" />
                </motion.button>
              )}
            </motion.div>

            {/* Filter toggle button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200"
              style={
                showFilters || activeFilterCount > 0
                  ? {
                      background: "var(--green-50)",
                      borderColor: "var(--green-200)",
                      color: "var(--green-600)",
                    }
                  : {
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-light)",
                      color: "var(--text-muted)",
                    }
              }
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span
                  className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{
                    background: "var(--green-500)",
                    color: "white",
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </motion.button>

            {/* View mode toggle */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex rounded-xl p-1 gap-1"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
              }}
            >
              <button
                onClick={() => setViewMode("grid")}
                className="p-2 rounded-lg transition-all duration-200"
                style={
                  viewMode === "grid"
                    ? {
                        background: "var(--green-50)",
                        color: "var(--green-600)",
                      }
                    : { color: "var(--text-muted)" }
                }
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className="p-2 rounded-lg transition-all duration-200"
                style={
                  viewMode === "list"
                    ? {
                        background: "var(--green-50)",
                        color: "var(--green-600)",
                      }
                    : { color: "var(--text-muted)" }
                }
              >
                <List className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

          {/* Filter Panels */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-2xl space-y-4 overflow-hidden"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-light)",
                }}
              >
                {/* Region filter */}
                <div>
                  <p
                    className="text-xs uppercase tracking-widest font-medium mb-2.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Wilayah
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {REGIONS.map((r) => (
                      <FilterChip
                        key={r.value}
                        label={r.label}
                        active={regionFilter === r.value}
                        onClick={() => setRegionFilter(r.value)}
                      />
                    ))}
                  </div>
                </div>

                {/* Type filter */}
                <div>
                  <p
                    className="text-xs uppercase tracking-widest font-medium mb-2.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Jenis
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map((t) => (
                      <FilterChip
                        key={t.value}
                        label={t.label}
                        active={typeFilter === t.value}
                        onClick={() => setTypeFilter(t.value)}
                      />
                    ))}
                  </div>
                </div>

                {/* Status filter */}
                <div>
                  <p
                    className="text-xs uppercase tracking-widest font-medium mb-2.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Status Konservasi
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <FilterChip
                        key={s.value}
                        label={s.label}
                        active={statusFilter === s.value}
                        color={s.color}
                        icon={s.icon ?? undefined}
                        onClick={() => setStatusFilter(s.value)}
                      />
                    ))}
                  </div>
                </div>

                {/* Reset */}
                {activeFilterCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-2"
                    style={{ borderTop: "1px solid var(--border-light)" }}
                  >
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                      style={{ color: "var(--status-cr)" }}
                    >
                      <X className="w-3.5 h-3.5" />
                      Reset semua filter
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count + active filters summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between flex-wrap gap-3"
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Menampilkan{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {visibleSpecies.length}
              </span>{" "}
              dari{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {filtered.length}
              </span>{" "}
              spesies hasil filter
              {kritisCount > 0 && (
                <span style={{ color: "var(--status-cr)" }}>
                  {" "}
                  · {kritisCount} kritis
                </span>
              )}
              {terancamCount > 0 && (
                <span style={{ color: "var(--status-en)" }}>
                  {" "}
                  · {terancamCount} terancam
                </span>
              )}
            </p>

            {/* Active filter tags */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <AnimatePresence>
                {regionFilter !== "all" && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setRegionFilter("all")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors"
                    style={{
                      background: "var(--green-50)",
                      border: "1px solid var(--green-200)",
                      color: "var(--green-600)",
                    }}
                  >
                    {REGION_LABELS[regionFilter]}
                    <X className="w-3 h-3" />
                  </motion.button>
                )}
                {typeFilter !== "all" && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setTypeFilter("all")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors capitalize"
                    style={{
                      background: "var(--green-50)",
                      border: "1px solid var(--green-200)",
                      color: "var(--green-600)",
                    }}
                  >
                    {typeFilter}
                    <X className="w-3 h-3" />
                  </motion.button>
                )}
                {statusFilter !== "all" && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setStatusFilter("all")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors"
                    style={{
                      background: STATUS_CONFIG[statusFilter]?.bg,
                      border: `1px solid ${STATUS_CONFIG[statusFilter]?.border}`,
                      color: STATUS_CONFIG[statusFilter]?.color,
                    }}
                  >
                    {STATUS_CONFIG[statusFilter]?.label}
                    <X className="w-3 h-3" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ==================== SPECIES GRID / LIST ==================== */}
      <div className="container-main px-4">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <EmptyState key="empty" onReset={resetFilters} />
          ) : viewMode === "grid" ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
            >
              {visibleSpecies.map((species, index) => (
                <SpeciesCard
                  key={species.id}
                  species={species as Species}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="space-y-3 max-w-3xl mx-auto"
            >
              {visibleSpecies.map((species, index) => (
                <SpeciesListItem
                  key={species.id}
                  species={species as Species}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                color: "var(--text-primary)",
              }}
            >
              Muat lagi ({Math.min(ITEMS_PER_PAGE, filtered.length - visibleCount)})
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// EXPORT WITH SUSPENSE
// ============================================
export default function SpeciesPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen pt-24 flex items-center justify-center"
          style={{ background: "var(--bg-base)" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-full border-2"
              style={{ borderColor: "var(--green-200)", borderTopColor: "var(--green-500)" }}
            />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Memuat spesies...
            </p>
          </motion.div>
        </div>
      }
    >
      <SpeciesPageContent />
    </Suspense>
  );
}
