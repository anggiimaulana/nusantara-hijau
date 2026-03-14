"use client";

import { catalogRecords, getCatalogRegions, getCatalogRegionText, type CatalogSpecies } from "@/lib/biodiversity-catalog";
import { hasSpeciesImage, resolveSpeciesImage } from "@/lib/species-images";
import {
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Database,
  Globe,
  Grid3X3,
  Leaf,
  List,
  Search,
  Shield,
  Sparkles,
  Filter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 15;
const REGIONS = [
  { value: "all", label: "Semua Wilayah" },
  { value: "sumatera", label: "Sumatera" },
  { value: "kalimantan", label: "Kalimantan" },
  { value: "jawa", label: "Jawa" },
  { value: "sulawesi", label: "Sulawesi" },
  { value: "papua", label: "Papua" },
  { value: "maluku", label: "Maluku" },
  { value: "bali-nusra", label: "Bali & Nusa Tenggara" },
  { value: "nasional", label: "Nasional / Multiwilayah" },
] as const;
const STATUSES = [
  { value: "all", label: "Semua Status" },
  { value: "kritis", label: "Kritis" },
  { value: "terancam", label: "Terancam" },
  { value: "rentan", label: "Rentan" },
] as const;
const TYPES = [
  { value: "all", label: "Semua Jenis" },
  { value: "flora", label: "Flora" },
  { value: "fauna", label: "Fauna" },
] as const;

function getInitialParam(value: string | null, allowed: readonly { value: string }[]) {
  if (!value) return "all";
  return allowed.some((entry) => entry.value === value) ? value : "all";
}
const STATUS_CFG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode; bg: string }
> = {
  kritis: {
    label: "Kritis",
    color: "var(--status-cr)",
    icon: <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2.5} />,
    bg: "var(--status-cr-bg)",
  },
  terancam: {
    label: "Terancam",
    color: "var(--status-en)",
    icon: <Shield className="w-3.5 h-3.5" strokeWidth={2.5} />,
    bg: "var(--status-en-bg)",
  },
  rentan: {
    label: "Rentan",
    color: "var(--status-vu)",
    icon: <Leaf className="w-3.5 h-3.5" strokeWidth={2.5} />,
    bg: "var(--status-vu-bg)",
  },
};
const SOURCE_ACCENTS: Record<string, string> = {
  curated: "var(--pg-accent)",
  dfi: "#2F855A",
  mdd: "#7C5E3C",
  fishbase: "#0F766E",
};

const CARD_SHADOW_COLORS = [
  "var(--pg-pink)",
  "var(--pg-accent)",
  "var(--pg-amber)",
  "var(--pg-mint)"
];

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push(-1);
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push(-1);
  pages.push(totalPages);

  return pages;
}

function FilterChip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, filter: "brightness(0.9)" }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center justify-center px-3.5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer"
      style={{
        fontFamily: "var(--font-heading)",
        border: "2px solid var(--border-hard)",
        background: active ? "var(--pg-accent)" : "white",
        color: active ? "white" : "var(--text-primary)",
        boxShadow: active ? "3px 3px 0px var(--border-hard)" : "2px 2px 0px var(--border-hard)",
      }}
    >
      {children}
    </motion.button>
  );
}

function PaginationLink({ active, disabled, children, onClick }: { active?: boolean; disabled?: boolean; children: React.ReactNode; onClick: () => void }) {
  if (disabled) {
    return (
      <span
        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold cursor-not-allowed"
        style={{
          fontFamily: "var(--font-heading)",
          border: "2px solid var(--border-light)",
          color: "var(--text-faint)",
          background: "white",
          opacity: 0.45,
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, rotate: active ? 0 : -3, filter: "brightness(0.9)" }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
      style={{
        fontFamily: "var(--font-heading)",
        border: "2px solid var(--border-hard)",
        background: active ? "var(--pg-accent)" : "white",
        color: active ? "white" : "var(--text-primary)",
        boxShadow: active ? "3px 3px 0px var(--border-hard)" : "2px 2px 0px var(--border-hard)",
      }}
    >
      {children}
    </motion.button>
  );
}

function SpeciesImagePanel({ species, compact = false, priority = false }: { species: CatalogSpecies; compact?: boolean, priority?: boolean }) {
  const hasImage = hasSpeciesImage(species.image);
  const accent = species.color ?? SOURCE_ACCENTS[species.sourceKey] ?? "var(--pg-accent)";

  if (hasImage) {
    return (
      <Image
        src={resolveSpeciesImage(species.image)}
        alt={species.name}
        fill
        className="object-cover"
        sizes={compact ? "130px" : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"}
        priority={priority}
      />
    );
  }

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-4"
      style={{
        background: `linear-gradient(145deg, ${accent}22 0%, white 100%)`,
      }}
    >
      <span
        className="inline-flex self-start px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em]"
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(15,23,42,0.10)",
          color: accent,
        }}
      >
        {species.sourceLabel}
      </span>
      <div>
        <p className="latin-name text-[11px] mb-1" style={{ color: "var(--text-muted)" }}>
          {species.latinName}
        </p>
        <p className="text-sm font-bold leading-snug" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
          Data gambar belum tersedia
        </p>
      </div>
    </div>
  );
}

function SpeciesGridCard({ species, index }: { species: CatalogSpecies, index: number }) {
  const status = species.status ? STATUS_CFG[species.status] : null;
  const shadowColor = CARD_SHADOW_COLORS[index % CARD_SHADOW_COLORS.length];

  return (
    <Link href={`/species/${species.id}`} className="block h-full cursor-pointer group">
      <motion.article
        whileHover={{
          scale: 1.02,
          rotate: -1,
          boxShadow: `6px 6px 0px ${shadowColor}`,
          transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
        }}
        className="h-full overflow-hidden flex flex-col"
        style={{
          background: "white",
          border: "2px solid var(--border-hard)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "4px 4px 0px var(--border-hard)",
        }}
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: "3 / 2" }}>
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105 z-0 bg-slate-50">
            <SpeciesImagePanel species={species} priority={index < 6} />
          </div>
          {status && (
            <span
              className="absolute z-10 top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: "white",
                color: status.color,
                border: "2px solid var(--border-hard)",
                boxShadow: "2px 2px 0px var(--border-hard)",
              }}
            >
              {status.icon}
              {status.label}
            </span>
          )}
        </div>
        <div className="p-5 flex flex-col gap-3 flex-1 relative z-10 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="latin-name text-[11px] mb-1">{species.latinName}</p>
              <h2 className="text-lg font-bold leading-snug group-hover:text-pg-accent transition-colors" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                {species.name}
              </h2>
            </div>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{
                background: species.type === "flora" ? "#DCFCE7" : "#CCFBF1",
                color: species.type === "flora" ? "#166534" : "#0F766E",
              }}
            >
              {species.type}
            </span>
          </div>
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "var(--text-secondary)" }}>
            {species.description}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
            <span>{getCatalogRegionText(species)}</span>
            <span aria-hidden="true">•</span>
            <span>{species.sourceLabel}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-sm font-bold group-hover:text-pg-accent-dark transition-colors" style={{ color: "var(--pg-accent)", fontFamily: "var(--font-heading)" }}>
            Lihat detail
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function SpeciesListCard({ species, index }: { species: CatalogSpecies, index: number }) {
  const status = species.status ? STATUS_CFG[species.status] : null;
  const shadowColor = CARD_SHADOW_COLORS[index % CARD_SHADOW_COLORS.length];

  return (
    <Link href={`/species/${species.id}`} className="block group cursor-pointer">
      <motion.article
        whileHover={{
          scale: 1.01,
          x: 4,
          boxShadow: `6px 6px 0px ${shadowColor}`,
          transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
        }}
        className="overflow-hidden flex gap-0"
        style={{
          background: "white",
          border: "2px solid var(--border-hard)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "4px 4px 0px var(--border-hard)",
        }}
      >
        <div className="relative flex-shrink-0 overflow-hidden" style={{ width: "140px", aspectRatio: "4 / 3" }}>
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105 z-0 bg-slate-50">
            <SpeciesImagePanel species={species} compact priority={index < 4} />
          </div>
        </div>
        <div className="p-4 sm:p-5 flex-1 flex flex-col gap-3 min-w-0 bg-white z-10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="latin-name text-[11px] mb-1 truncate">{species.latinName}</p>
              <h2 className="text-base sm:text-lg font-bold leading-snug group-hover:text-pg-accent transition-colors" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                {species.name}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{
                  background: species.type === "flora" ? "#DCFCE7" : "#CCFBF1",
                  color: species.type === "flora" ? "#166534" : "#0F766E",
                }}
              >
                {species.type}
              </span>
              {status && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{ background: status.bg, color: status.color, border: `1px solid ${status.color}33` }}
                >
                  {status.icon}
                  {status.label}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
            {species.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
            <span>{getCatalogRegionText(species)}</span>
            <span aria-hidden="true">•</span>
            <span>{species.sourceLabel}</span>
            {species.statusEN && (
              <>
                <span aria-hidden="true">•</span>
                <span>Status {species.statusEN}</span>
              </>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function SpeciesCatalogContent() {
  const searchParams = useSearchParams();
  const initialRegion = getInitialParam(searchParams.get("region"), REGIONS);
  const initialType = getInitialParam(searchParams.get("type"), TYPES);
  const initialStatus = getInitialParam(searchParams.get("status"), STATUSES);

  const [query, setQuery] = useState("");
  const [region, setRegion] = useState(initialRegion);
  const [status, setStatus] = useState(initialStatus);
  const [type, setType] = useState(initialType);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(
    initialRegion !== "all" || initialType !== "all" || initialStatus !== "all",
  );

  const isFilterActive = query !== "" || region !== "all" || status !== "all" || type !== "all";

  const updateQuery = (value: string) => {
    setCurrentPage(1);
    setQuery(value);
  };

  const updateRegion = (value: string) => {
    setCurrentPage(1);
    setRegion(value);
  };

  const updateStatus = (value: string) => {
    setCurrentPage(1);
    setStatus(value);
  };

  const updateType = (value: string) => {
    setCurrentPage(1);
    setType(value);
  };

  const updateView = (value: "grid" | "list") => {
    setCurrentPage(1);
    setView(value);
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setQuery("");
    setRegion("all");
    setStatus("all");
    setType("all");
  };

  const filtered = useMemo(() => {
    return catalogRecords.filter((species) => {
      const lowerQuery = query.toLowerCase();
      const speciesRegions = getCatalogRegions(species);

      if (
        lowerQuery &&
        !species.name.toLowerCase().includes(lowerQuery) &&
        !species.latinName.toLowerCase().includes(lowerQuery)
      ) {
        return false;
      }

      if (region !== "all") {
        if (region === "nasional") {
          if (species.region !== "nasional") return false;
        } else if (!speciesRegions.includes(region)) {
          return false;
        }
      }

      if (status !== "all" && species.status !== status) {
        return false;
      }

      if (type !== "all" && species.type !== type) {
        return false;
      }

      return true;
    });
  }, [query, region, status, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const visible = useMemo(() => filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE), [filtered, startIndex]);
  const visiblePages = getVisiblePages(safeCurrentPage, totalPages);

  const totalCount = catalogRecords.length.toLocaleString("id-ID");
  const floraCount = catalogRecords.filter((species) => species.type === "flora").length.toLocaleString("id-ID");
  const faunaCount = catalogRecords.filter((species) => species.type === "fauna").length.toLocaleString("id-ID");
  const filteredCount = filtered.length.toLocaleString("id-ID");
  const firstVisible = filtered.length === 0 ? 0 : startIndex + 1;
  const lastVisible = startIndex + visible.length;

  return (
    <div style={{ background: "var(--pg-bg)" }} className="min-h-screen pb-16">
      <section
        className="relative overflow-hidden border-b-2"
        style={{ background: "var(--pg-dark)", borderColor: "var(--border-hard)" }}
      >
        <div className="absolute inset-0 bg-dots-dark opacity-35 pointer-events-none" />
        <div className="container-main relative z-10 py-14 sm:py-18">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <span className="section-eyebrow mb-4" style={{ color: "var(--pg-amber)" }}>
                <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} /> Katalog Biodiversitas
              </span>
              <h1
                className="text-white mb-4"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  lineHeight: 1.05,
                }}
              >
                Katalog Flora dan Fauna Indonesia
              </h1>
              <p className="max-w-3xl text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                Jelajahi koleksi flora dan fauna Indonesia melalui direktori yang tersusun rapi menurut wilayah, status konservasi, dan jenis.
              </p>
            </div>
            <div
              className="rounded-[28px] p-5 sm:p-6 relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, var(--pg-accent) 0%, var(--pg-accent-dark) 100%)",
                border: "2px solid rgba(255,255,255,0.2)",
                boxShadow: "0 10px 30px rgba(15, 118, 110, 0.3)",
              }}
            >
              {/* Sabuk glow putih halus di belakang */}
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                style={{ background: "white" }}
              />
              <div
                className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                style={{ background: "var(--pg-mint)" }}
              />

              <div className="grid grid-cols-3 gap-3 relative">
                <div className="rounded-2xl p-2 sm:p-3 overflow-hidden relative" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] mb-1 font-bold text-white/80">Total</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white relative z-10 drop-shadow-sm" style={{ fontFamily: "var(--font-heading)" }}>{totalCount}</p>
                </div>
                <div className="rounded-2xl p-2 sm:p-3 overflow-hidden relative" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] mb-1 font-bold text-white/90">Flora</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white relative z-10 drop-shadow-sm" style={{ fontFamily: "var(--font-heading)" }}>{floraCount}</p>
                </div>
                <div className="rounded-2xl p-2 sm:p-3 overflow-hidden relative" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] mb-1 font-bold text-white/80">Fauna</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white relative z-10 drop-shadow-sm" style={{ fontFamily: "var(--font-heading)" }}>{faunaCount}</p>
                </div>
              </div>

              <div
                className="mt-4 w-full flex items-center gap-3 rounded-2xl px-4 py-3 sm:py-3.5 text-[13px] sm:text-sm leading-relaxed relative z-10 font-medium"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.3)" }}>
                  <Database className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span><strong className="text-white drop-shadow-sm">Akses Instan:</strong> Pencarian, filter, dan pagination berjalan cepat <span className="underline decoration-white/40 underline-offset-2">di perangkat Anda</span>.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-main py-8 sm:py-10">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {TYPES.map((entry) => (
              <FilterChip
                key={entry.value}
                onClick={() => updateType(entry.value)}
                active={type === entry.value}
              >
                {entry.label}
              </FilterChip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setShowFilter(!showFilter)} className="btn-candy px-5 py-3 h-fit whitespace-nowrap cursor-pointer hover:brightness-90 transition-all flex items-center gap-2 shadow-sm">
              <Filter className="w-4 h-4" /> {showFilter ? "Tutup Filter" : "Filter & Cari"}
            </button>
            <AnimatePresence>
              {isFilterActive && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  whileHover={{ filter: "brightness(0.9)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetFilters}
                  className="btn-outline-pg px-5 py-3 h-fit whitespace-nowrap cursor-pointer transition-all shadow-sm"
                >
                  Reset
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mb-8"
            >
              <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr] xl:items-start p-5 sm:p-6 rounded-3xl" style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}>
                <div>
                  <label className="label-pg mb-2 block" htmlFor="catalog-search">Cari nama umum atau nama latin</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} strokeWidth={2.5} />
                    <input
                      id="catalog-search"
                      type="search"
                      value={query}
                       onChange={(e) => updateQuery(e.target.value)}
                      placeholder="Misalnya raflesia, orangutan, Acanthus…"
                      className="input-pg pl-10"
                      style={{ borderRadius: "999px", border: "2px solid var(--border-hard)", boxShadow: "3px 3px 0px var(--border-hard)", transition: 'all 0.2s ease-in-out' }}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-pg mb-2 block" htmlFor="catalog-region">Wilayah</label>
                     <select id="catalog-region" value={region} onChange={(e) => updateRegion(e.target.value)} className="input-pg cursor-pointer" style={{ borderRadius: "18px", border: "2px solid var(--border-hard)", boxShadow: "3px 3px 0px var(--border-hard)", backgroundColor: "white", color: "var(--text-primary)" }}>
                      {REGIONS.map((entry) => (
                        <option key={entry.value} value={entry.value}>{entry.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-pg mb-2 block" htmlFor="catalog-status">Status</label>
                     <select id="catalog-status" value={status} onChange={(e) => updateStatus(e.target.value)} className="input-pg cursor-pointer" style={{ borderRadius: "18px", border: "2px solid var(--border-hard)", boxShadow: "3px 3px 0px var(--border-hard)", backgroundColor: "white", color: "var(--text-primary)" }}>
                      {STATUSES.map((entry) => (
                        <option key={entry.value} value={entry.value}>{entry.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>



        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-muted)", fontFamily: "var(--font-heading)" }}>
              Menampilkan {firstVisible.toLocaleString("id-ID")}–{lastVisible.toLocaleString("id-ID")} dari {filteredCount} entri
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-faint)" }}>
              {query ? `Pencarian aktif: “${query}”. ` : ""}
              Gunakan filter untuk menelusuri katalog secara instan.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex overflow-hidden rounded-xl" style={{ border: "2px solid var(--border-hard)" }}>
              <button onClick={() => updateView("grid")} className="p-2.5 transition-all hover:brightness-90 cursor-pointer" style={{ background: view === "grid" ? "var(--pg-dark)" : "white", color: view === "grid" ? "white" : "var(--text-muted)" }} aria-label="Tampilan grid">
                <Grid3X3 className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <button onClick={() => updateView("list")} className="p-2.5 transition-all hover:brightness-90 cursor-pointer" style={{ background: view === "list" ? "var(--pg-dark)" : "white", color: view === "list" ? "white" : "var(--text-muted)" }} aria-label="Tampilan list">
                <List className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] p-4 sm:p-5" style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}>
          <div className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={2.5} style={{ color: "var(--pg-accent)" }} />
            <p>
              Setiap entri menampilkan nama ilmiah, wilayah persebaran, status konservasi, dan rujukan sumber sesuai ketersediaan data.
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-[32px] p-10 text-center" style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}>
            <div className="text-6xl mb-4">🔎</div>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>Tidak ada entri yang cocok</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Coba longgarkan kata kunci atau reset filter wilayah, status, dan jenis untuk melihat cakupan katalog yang lebih luas.
            </p>
            <button onClick={resetFilters} className="btn-candy mt-6 inline-flex px-6 py-3 cursor-pointer hover:brightness-90 transition-all">Reset semua filter</button>
          </div>
        ) : view === "grid" ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {visible.map((species, idx) => (
              <SpeciesGridCard key={species.id} species={species} index={idx} />
            ))}
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {visible.map((species, idx) => (
              <SpeciesListCard key={species.id} species={species} index={idx} />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
            <PaginationLink
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            </PaginationLink>
            {visiblePages.map((page, index) =>
              page === -1 ? (
                <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-sm font-bold" style={{ color: "var(--text-faint)" }}>
                  …
                </span>
              ) : (
                <PaginationLink key={page} onClick={() => setCurrentPage(page)} active={page === safeCurrentPage}>
                  {page}
                </PaginationLink>
              ),
            )}
            <PaginationLink
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </PaginationLink>
          </div>
        )}
      </section>
    </div>
  );
}

export default function SpeciesCatalogClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-pg-bg">
        <div className="w-10 h-10 border-4 border-pg-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SpeciesCatalogContent />
    </Suspense>
  );
}
