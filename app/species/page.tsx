"use client";

import speciesData from "@/data/species.json";
import { resolveSpeciesImage } from "@/lib/species-images";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Leaf,
  List,
  Search,
  Shield,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useCallback, useMemo, useState } from "react";

// ─── Types & Config ───────────────────────────
interface Species {
  id: string; name: string; latinName: string; region: string; type: string;
  status: string; statusEN: string; description: string; image: string; color: string;
}
const ITEMS_PER_PAGE = 12;

const REGIONS = [
  { value: "all", label: "🌏 Semua Wilayah" },
  { value: "sumatera", label: "🦁 Sumatera" },
  { value: "kalimantan", label: "🦧 Kalimantan" },
  { value: "jawa", label: "🐆 Jawa" },
  { value: "sulawesi", label: "🦜 Sulawesi" },
  { value: "papua", label: "🦅 Papua" },
  { value: "bali-nusra", label: "🦎 Bali & Nusra" },
];
const STATUSES = [
  { value: "all", label: "Semua Status" },
  { value: "kritis", label: "⚠️ Kritis" },
  { value: "terancam", label: "🛡️ Terancam" },
  { value: "rentan", label: "🌿 Rentan" },
];
const TYPES = [
  { value: "all", label: "Semua Jenis" },
  { value: "mamalia", label: "Mamalia" },
  { value: "burung", label: "Burung" },
  { value: "reptil", label: "Reptil" },
  { value: "amfibi", label: "Amfibi" },
];

const STATUS_CFG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  kritis:   { label: "Kritis",   color: "var(--status-cr)", icon: <AlertTriangle className="w-3 h-3" strokeWidth={2.5} /> },
  terancam: { label: "Terancam", color: "var(--status-en)", icon: <Shield className="w-3 h-3" strokeWidth={2.5} /> },
  rentan:   { label: "Rentan",   color: "var(--status-vu)", icon: <Leaf className="w-3 h-3" strokeWidth={2.5} /> },
};
// Rotating shadow colors per card
const SHADOW_COLORS = ["var(--pg-pink)", "var(--pg-accent)", "var(--pg-amber)", "var(--pg-mint)"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };

// ─── Badge ────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status];
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold"
      style={{ background: "white", border: "2px solid var(--border-hard)", color: cfg.color, boxShadow: "2px 2px 0px var(--border-hard)" }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ─── Grid Card ────────────────────────────────
function SpeciesCard({ species, index }: { species: Species; index: number }) {
  const shadowColor = SHADOW_COLORS[index % SHADOW_COLORS.length];
  return (
    <motion.div variants={fadeUp}>
      <Link href={`/species/${species.id}`} className="block h-full">
        <motion.div
          className="relative flex flex-col h-full overflow-hidden"
          style={{
            background: "white", border: "2px solid var(--border-hard)",
            borderRadius: "var(--radius-lg)", boxShadow: "4px 4px 0px var(--border-hard)",
          }}
          whileHover={{
            boxShadow: `8px 8px 0px ${shadowColor}`,
            transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
          }}
        >
          {/* Image */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
            <Image
              src={resolveSpeciesImage(species.image)}
              alt={species.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading={index === 0 ? "eager" : "lazy"}
              priority={index === 0}
            />
            <div className="absolute top-2 left-2">
              <StatusBadge status={species.status} />
            </div>
          </div>
          {/* Body */}
          <div className="p-4 flex flex-col gap-1 flex-1">
            <p className="latin-name text-[10px]">{species.latinName}</p>
            <h3 className="font-bold text-sm leading-snug" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
              {species.name}
            </h3>
            <p className="text-xs line-clamp-2 flex-1 mt-1" style={{ color: "var(--text-muted)" }}>
              {species.description}
            </p>
            <div className="flex items-center gap-1 mt-3 pl-2 text-sm font-bold" style={{ color: "var(--pg-accent)", fontFamily: "system-ui, sans-serif" }}>
              Lihat detail <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ─── List Item ────────────────────────────────
function SpeciesListItem({ species, index }: { species: Species; index: number }) {
  return (
    <motion.div variants={fadeUp}>
      <Link href={`/species/${species.id}`} className="block">
        <motion.div
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{
            background: "white", border: "2px solid var(--border-hard)",
            boxShadow: "3px 3px 0px var(--border-hard)",
          }}
          whileHover={{ x: 4, boxShadow: `6px 4px 0px ${SHADOW_COLORS[index % 4]}` }}
          whileTap={{ scale: 0.99 }}
        >
          <div
            className="relative w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden"
            style={{ border: "2px solid var(--border-hard)" }}
          >
            <Image src={resolveSpeciesImage(species.image)} alt={species.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="latin-name text-[10px] mb-0.5">{species.latinName}</p>
            <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
              {species.name}
            </h3>
            <p className="text-xs line-clamp-1 mt-0.5" style={{ color: "var(--text-muted)" }}>{species.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <StatusBadge status={species.status} />
            <ArrowRight className="w-4 h-4" style={{ color: "var(--pg-accent)" }} strokeWidth={2.5} />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────
function SkeletonCard() {
  return (
    <div className="overflow-hidden" style={{ border: "2px solid var(--border-hard)", borderRadius: "var(--radius-lg)", boxShadow: "4px 4px 0px var(--border-hard)" }}>
      <div className="shimmer" style={{ aspectRatio: "3/2" }} />
      <div className="p-4 space-y-2">
        <div className="shimmer h-2.5 rounded-full w-2/3" />
        <div className="shimmer h-4 rounded-full w-full" />
        <div className="shimmer h-3 rounded-full w-5/6" />
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────
function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (n: number) => void }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
        style={{ border: "2px solid var(--border-hard)", background: "white", boxShadow: "2px 2px 0px var(--border-hard)" }}
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
      </button>
      {Array.from({ length: Math.min(total, 7) }, (_, i) => {
        const page = total <= 7 ? i + 1 : i < 3 ? i + 1 : i === 3 ? current : i === 4 ? Math.min(current + 1, total - 1) : i === 5 ? total - 1 : total;
        return (
          <button
            key={i}
            onClick={() => onChange(page)}
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all"
            style={{
              fontFamily: "var(--font-heading)",
              border: "2px solid var(--border-hard)",
              background: page === current ? "var(--pg-accent)" : "white",
              color: page === current ? "white" : "var(--text-primary)",
              boxShadow: page === current ? "3px 3px 0px var(--border-hard)" : "2px 2px 0px var(--border-hard)",
            }}
          >
            {page}
          </button>
        );
      })}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
        style={{ border: "2px solid var(--border-hard)", background: "white", boxShadow: "2px 2px 0px var(--border-hard)" }}
      >
        <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ─── Inner Page ───────────────────────────────
function SpeciesPageContent() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return (speciesData as Species[]).filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.latinName.toLowerCase().includes(q)) return false;
      if (region !== "all" && s.region !== region) return false;
      if (status !== "all" && s.status !== status) return false;
      if (type !== "all" && s.type !== type) return false;
      return true;
    });
  }, [search, region, status, type]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const visible = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handlePageChange = useCallback((n: number) => {
    setLoading(true);
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setLoading(false), 300);
  }, []);

  const activeCount = (region !== "all" ? 1 : 0) + (status !== "all" ? 1 : 0) + (type !== "all" ? 1 : 0);

  return (
    <div style={{ background: "var(--pg-bg)" }} className="min-h-screen">

      {/* ─── Header ─── */}
      <div
        className="pt-24 pb-12 relative overflow-hidden"
        style={{ background: "var(--pg-dark)", borderBottom: "2px solid var(--border-hard)" }}
      >
        <div className="absolute inset-0 bg-dots-dark opacity-40 pointer-events-none" />
        {/* Deco shapes */}
        <div className="absolute top-8 right-12 w-20 h-20 rounded-full opacity-20" style={{ background: "var(--pg-accent)", border: "2px solid var(--pg-accent)" }} />
        <div className="absolute bottom-4 left-8 w-12 h-12 rounded-lg opacity-20" style={{ background: "var(--pg-amber)", transform: "rotate(15deg)" }} />

        <div className="container-main relative z-10">
          <span className="section-eyebrow mb-3" style={{ color: "var(--pg-amber)" }}>
            <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} /> Direktori Spesies
          </span>
          <h1
            className="text-white mb-3"
            style={{
              fontFamily: "var(--font-heading)", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.15,
            }}
          >
            Atlas Spesies Nusantara
          </h1>
          <p className="text-sm max-w-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
            {speciesData.length} spesies endemik Indonesia dari 6 wilayah Nusantara.
            Filter, cari, dan temukan informasi lengkap.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-2.5 mt-5">
            {[
              { label: `${(speciesData as Species[]).filter(s => s.status === "kritis").length} Kritis`, color: "var(--status-cr)" },
              { label: `${(speciesData as Species[]).filter(s => s.status === "terancam").length} Terancam`, color: "var(--status-en)" },
              { label: `${(speciesData as Species[]).filter(s => s.status === "rentan").length} Rentan`, color: "var(--status-vu)" },
            ].map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold"
                style={{
                  background: "rgba(255,255,255,0.10)", border: "2px solid rgba(255,255,255,0.20)",
                  borderRadius: "var(--radius-full)", color: "white",
                  fontFamily: "var(--font-heading)",
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Search & Filter ─── */}
      <div className="sticky top-16 lg:top-[68px] z-30" style={{ background: "var(--pg-bg)", borderBottom: "2px solid var(--border-hard)" }}>
        <div className="container-main py-3">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Cari nama spesies atau latin…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="input-pg pl-10 pr-10"
                style={{ borderRadius: "var(--radius-full)", border: "2px solid var(--border-hard)", boxShadow: "3px 3px 0px var(--border-hard)" }}
              />
              {search && (
                <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--pg-slate-200)" }}>
                  <X className="w-3 h-3" strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all"
              style={{
                fontFamily: "var(--font-heading)",
                border: "2px solid var(--border-hard)",
                background: showFilters || activeCount > 0 ? "var(--pg-accent)" : "white",
                color: showFilters || activeCount > 0 ? "white" : "var(--text-primary)",
                boxShadow: "3px 3px 0px var(--border-hard)",
              }}
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Filter</span>
              {activeCount > 0 && (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "white", color: "var(--pg-accent)" }}>
                  {activeCount}
                </span>
              )}
            </button>

            {/* View toggle */}
            <div className="flex rounded-xl overflow-hidden" style={{ border: "2px solid var(--border-hard)" }}>
              {([["grid", <Grid3X3 key="g" className="w-4 h-4" strokeWidth={2.5} />], ["list", <List key="l" className="w-4 h-4" strokeWidth={2.5} />]] as const).map(([mode, icon]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as "grid" | "list")}
                  className="p-2.5 transition-all"
                  style={{
                    background: viewMode === mode ? "var(--pg-dark)" : "white",
                    color: viewMode === mode ? "white" : "var(--text-muted)",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-3 border-t-2 mt-3 flex flex-col gap-4" style={{ borderColor: "var(--border-light)" }}>
                  {/* Region */}
                  <div>
                    <p className="label-pg mb-2">Wilayah</p>
                    <div className="flex flex-wrap gap-2">
                      {REGIONS.map((r) => (
                        <button
                          key={r.value}
                          onClick={() => { setRegion(r.value); setPage(1); }}
                          className={`chip ${region === r.value ? "chip-active" : ""}`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Status + Type row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="label-pg mb-2">Status</p>
                      <div className="flex flex-wrap gap-2">
                        {STATUSES.map((s) => (
                          <button key={s.value} onClick={() => { setStatus(s.value); setPage(1); }} className={`chip ${status === s.value ? "chip-active" : ""}`}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="label-pg mb-2">Jenis</p>
                      <div className="flex flex-wrap gap-2">
                        {TYPES.map((t) => (
                          <button key={t.value} onClick={() => { setType(t.value); setPage(1); }} className={`chip ${type === t.value ? "chip-active" : ""}`}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {activeCount > 0 && (
                    <button
                      onClick={() => { setRegion("all"); setStatus("all"); setType("all"); setPage(1); }}
                      className="self-start text-xs font-bold flex items-center gap-1.5"
                      style={{ color: "var(--status-cr)", fontFamily: "var(--font-heading)" }}
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={2.5} /> Reset semua filter
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Results ─── */}
      <div className="container-main py-10">
        {/* Count */}
        <p className="text-xs font-semibold mb-6" style={{ color: "var(--text-muted)", fontFamily: "var(--font-heading)" }}>
          Menampilkan <span style={{ color: "var(--text-primary)" }}>{visible.length}</span> dari{" "}
          <span style={{ color: "var(--text-primary)" }}>{filtered.length}</span> spesies
        </p>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Tidak Ditemukan
              </h3>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Spesies &ldquo;{search}&rdquo; tidak ada dalam database.
              </p>
              <button
                onClick={() => { setSearch(""); setRegion("all"); setStatus("all"); setType("all"); setPage(1); }}
                className="btn-candy px-6 py-2.5 text-sm"
              >
                Reset Pencarian
              </button>
            </motion.div>
          ) : loading ? (
            viewMode === "grid" ? (
              <motion.div key="skel-g" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)}
              </motion.div>
            ) : (
              <motion.div key="skel-l" className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl shimmer" style={{ border: "2px solid var(--border-hard)" }} />
                ))}
              </motion.div>
            )
          ) : viewMode === "grid" ? (
            <motion.div
              key="grid"
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5"
            >
              {visible.map((s, i) => <SpeciesCard key={s.id} species={s as Species} index={i} />)}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-3 max-w-2xl"
            >
              {visible.map((s, i) => <SpeciesListItem key={s.id} species={s as Species} index={i} />)}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && filtered.length > 0 && (
          <Pagination current={page} total={totalPages} onChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}

export default function SpeciesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: "var(--pg-bg)" }}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce-pop">🌿</div>
          <p className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)", color: "var(--text-muted)" }}>Memuat spesies…</p>
        </div>
      </div>
    }>
      <SpeciesPageContent />
    </Suspense>
  );
}
