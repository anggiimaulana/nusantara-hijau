"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  X,
  Leaf,
  AlertTriangle,
  Shield,
  Eye,
  MapPin,
  ChevronRight,
  Grid3X3,
  List,
} from "lucide-react";
import speciesData from "@/data/species.json";

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

const REGION_LABELS: Record<string, string> = {
  sumatera: "Sumatera",
  kalimantan: "Kalimantan",
  jawa: "Jawa",
  sulawesi: "Sulawesi",
  papua: "Papua",
  "bali-nusra": "Bali & Nusa Tenggara",
};

// ============================================
// STATUS BADGE
// ============================================
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
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

// ============================================
// SPECIES CARD (GRID VIEW)
// ============================================
function SpeciesCard({ species }: { species: Species }) {
  return (
    <Link
      href={`/species/${species.id}`}
      className="group relative overflow-hidden rounded-2xl border border-white/6 bg-[#0D1B2E] hover:border-[#2ECC71]/25 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/30 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <Image
          src={species.image}
          alt={species.name}
          fill
          className="object-cover transition-transform duration-600 group-hover:scale-108"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/images/species/harimau-sumatera.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2E] via-[#0D1B2E]/10 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={species.status} />
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm text-white/60 border border-white/10 capitalize">
            {species.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[#546E7A] text-xs italic mb-0.5">
          {species.latinName}
        </p>
        <h3
          className="text-white font-bold text-base mb-2 group-hover:text-[#2ECC71] transition-colors duration-300 line-clamp-1"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {species.name}
        </h3>
        <p className="text-[#90A4AE] text-xs leading-relaxed line-clamp-2 flex-1 mb-3">
          {species.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-1 text-[#546E7A] text-xs">
            <MapPin className="w-3 h-3" />
            <span>{REGION_LABELS[species.region] || species.region}</span>
          </div>
          <span className="flex items-center gap-0.5 text-[#2ECC71] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Detail <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Color accent bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{
          background: `linear-gradient(90deg, ${species.color}, transparent)`,
        }}
      />
    </Link>
  );
}

// ============================================
// SPECIES LIST ITEM (LIST VIEW)
// ============================================
function SpeciesListItem({ species }: { species: Species }) {
  return (
    <Link
      href={`/species/${species.id}`}
      className="group flex items-center gap-4 p-4 rounded-2xl border border-white/6 bg-[#0D1B2E] hover:border-[#2ECC71]/20 hover:bg-[#2ECC71]/3 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
        <Image
          src={species.image}
          alt={species.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/images/species/harimau-sumatera.jpg";
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3
              className="text-white font-semibold text-sm group-hover:text-[#2ECC71] transition-colors duration-200"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {species.name}
            </h3>
            <p className="text-[#546E7A] text-xs italic">{species.latinName}</p>
          </div>
          <StatusBadge status={species.status} />
        </div>
        <p className="text-[#90A4AE] text-xs line-clamp-1 hidden sm:block">
          {species.description}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-[#546E7A] text-xs">
            <MapPin className="w-3 h-3" />
            {REGION_LABELS[species.region]}
          </span>
          <span className="text-[#546E7A] text-xs capitalize">
            • {species.type}
          </span>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-[#546E7A] group-hover:text-[#2ECC71] flex-shrink-0 transition-colors duration-200" />
    </Link>
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
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? "text-white border"
          : "bg-white/4 border border-white/8 text-[#90A4AE] hover:text-white hover:bg-white/8"
      }`}
      style={
        active
          ? {
              backgroundColor: color ? `${color}18` : "rgba(46,204,113,0.15)",
              borderColor: color ? `${color}40` : "rgba(46,204,113,0.3)",
              color: color || "#2ECC71",
            }
          : {}
      }
    >
      {icon}
      {label}
    </button>
  );
}

// ============================================
// EMPTY STATE
// ============================================
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <Search className="w-7 h-7 text-[#546E7A]" />
      </div>
      <h3
        className="text-white font-bold text-xl mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Tidak ada spesies ditemukan
      </h3>
      <p className="text-[#90A4AE] text-sm mb-6 max-w-xs">
        Coba ubah filter atau kata kunci pencarianmu.
      </p>
      <button
        onClick={onReset}
        className="px-5 py-2.5 rounded-xl bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#2ECC71] text-sm font-medium hover:bg-[#2ECC71]/20 transition-all duration-200"
      >
        Reset Semua Filter
      </button>
    </div>
  );
}

// ============================================
// MAIN SPECIES PAGE CONTENT
// ============================================
function SpeciesPageContent() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState(
    searchParams.get("region") || "all",
  );
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Update region from URL param
  useEffect(() => {
    const region = searchParams.get("region");
    if (region) setRegionFilter(region);
  }, [searchParams]);

  // Filtered species
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

  // Stats summary
  const kritisCount = filtered.filter((s) => s.status === "kritis").length;
  const terancamCount = filtered.filter((s) => s.status === "terancam").length;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="section-container px-4 mb-10">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/6 bg-[#060E1A] p-6 sm:p-8 lg:p-12">
          {/* BG glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 20% 50%, rgba(46,204,113,0.07) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2ECC71]/20 bg-[#2ECC71]/5 mb-4">
                <Leaf className="w-3.5 h-3.5 text-[#2ECC71]" />
                <span className="text-[#2ECC71] text-xs font-semibold tracking-widest uppercase">
                  Atlas Spesies
                </span>
              </div>
              <h1
                className="text-4xl sm:text-5xl font-bold text-white mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Direktori
                <span className="gradient-text"> Spesies</span>
              </h1>
              <p className="text-[#90A4AE] text-sm max-w-lg leading-relaxed">
                {speciesData.length} spesies endemik Indonesia dari 6 wilayah
                Nusantara. Filter, cari, dan temukan informasi lengkap setiap
                spesies.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4 flex-shrink-0">
              <div className="text-center px-4 py-3 rounded-2xl bg-[#E74C3C]/8 border border-[#E74C3C]/15">
                <div
                  className="text-2xl font-bold text-[#E74C3C]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {speciesData.filter((s) => s.status === "kritis").length}
                </div>
                <div className="text-[#E74C3C]/70 text-xs mt-0.5">Kritis</div>
              </div>
              <div className="text-center px-4 py-3 rounded-2xl bg-[#E67E22]/8 border border-[#E67E22]/15">
                <div
                  className="text-2xl font-bold text-[#E67E22]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {speciesData.filter((s) => s.status === "terancam").length}
                </div>
                <div className="text-[#E67E22]/70 text-xs mt-0.5">Terancam</div>
              </div>
              <div className="text-center px-4 py-3 rounded-2xl bg-[#F1C40F]/8 border border-[#F1C40F]/15">
                <div
                  className="text-2xl font-bold text-[#F1C40F]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {speciesData.filter((s) => s.status === "rentan").length}
                </div>
                <div className="text-[#F1C40F]/70 text-xs mt-0.5">Rentan</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== SEARCH & FILTER BAR ==================== */}
      <div className="section-container px-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search + View Toggle Row */}
          <div className="flex gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#546E7A]" />
              <input
                type="text"
                placeholder="Cari nama spesies atau nama latin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0D1B2E] border border-white/8 text-white placeholder-[#546E7A] text-sm focus:outline-none focus:border-[#2ECC71]/40 focus:bg-[#0D1B2E] transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-3 h-3 text-[#90A4AE]" />
                </button>
              )}
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                showFilters || activeFilterCount > 0
                  ? "bg-[#2ECC71]/10 border-[#2ECC71]/30 text-[#2ECC71]"
                  : "bg-[#0D1B2E] border-white/8 text-[#90A4AE] hover:text-white hover:border-white/15"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#2ECC71] text-[#0A1628] text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View mode toggle */}
            <div className="flex rounded-xl bg-[#0D1B2E] border border-white/8 p-1 gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-[#2ECC71]/15 text-[#2ECC71]"
                    : "text-[#546E7A] hover:text-white"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-[#2ECC71]/15 text-[#2ECC71]"
                    : "text-[#546E7A] hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Panels */}
          {showFilters && (
            <div className="p-4 rounded-2xl bg-[#0D1B2E] border border-white/8 space-y-4 animate-fade-in">
              {/* Region filter */}
              <div>
                <p className="text-[#546E7A] text-xs uppercase tracking-widest font-medium mb-2.5">
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
                <p className="text-[#546E7A] text-xs uppercase tracking-widest font-medium mb-2.5">
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
                <p className="text-[#546E7A] text-xs uppercase tracking-widest font-medium mb-2.5">
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
                <div className="pt-1 border-t border-white/5">
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 text-[#E74C3C] text-xs font-medium hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reset semua filter
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results count + active filters summary */}
          <div className="flex items-center justify-between">
            <p className="text-[#546E7A] text-xs">
              Menampilkan{" "}
              <span className="text-white font-semibold">
                {filtered.length}
              </span>{" "}
              dari{" "}
              <span className="text-white font-semibold">
                {speciesData.length}
              </span>{" "}
              spesies
              {kritisCount > 0 && (
                <span className="text-[#E74C3C]"> · {kritisCount} kritis</span>
              )}
              {terancamCount > 0 && (
                <span className="text-[#E67E22]">
                  {" "}
                  · {terancamCount} terancam
                </span>
              )}
            </p>

            {/* Active filter tags */}
            <div className="flex items-center gap-1.5">
              {regionFilter !== "all" && (
                <button
                  onClick={() => setRegionFilter("all")}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#2ECC71] text-xs hover:bg-[#2ECC71]/20 transition-colors"
                >
                  {REGION_LABELS[regionFilter]}
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
              {typeFilter !== "all" && (
                <button
                  onClick={() => setTypeFilter("all")}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#2ECC71] text-xs hover:bg-[#2ECC71]/20 transition-colors capitalize"
                >
                  {typeFilter}
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
              {statusFilter !== "all" && (
                <button
                  onClick={() => setStatusFilter("all")}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors"
                  style={{
                    backgroundColor: STATUS_CONFIG[statusFilter]?.bg,
                    borderWidth: 1,
                    borderColor: STATUS_CONFIG[statusFilter]?.border,
                    color: STATUS_CONFIG[statusFilter]?.color,
                  }}
                >
                  {STATUS_CONFIG[statusFilter]?.label}
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== SPECIES GRID / LIST ==================== */}
      <div className="section-container px-4">
        {filtered.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((species) => (
              <SpeciesCard key={species.id} species={species as Species} />
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-w-3xl mx-auto">
            {filtered.map((species) => (
              <SpeciesListItem key={species.id} species={species as Species} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// EXPORT WITH SUSPENSE (required for useSearchParams)
// ============================================
export default function SpeciesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#2ECC71]/30 border-t-[#2ECC71] animate-spin" />
            <p className="text-[#90A4AE] text-sm">Memuat spesies...</p>
          </div>
        </div>
      }
    >
      <SpeciesPageContent />
    </Suspense>
  );
}
