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
  { value: "flora", label: "Flora" },
  { value: "fauna", label: "Fauna" },
];

const STATUS_CFG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  kritis: {
    label: "Kritis",
    color: "var(--status-cr)",
    icon: <AlertTriangle className="w-3 h-3" strokeWidth={2.5} />,
  },
  terancam: {
    label: "Terancam",
    color: "var(--status-en)",
    icon: <Shield className="w-3 h-3" strokeWidth={2.5} />,
  },
  rentan: {
    label: "Rentan",
    color: "var(--status-vu)",
    icon: <Leaf className="w-3 h-3" strokeWidth={2.5} />,
  },
};
const SHADOW_COLORS = [
  "var(--pg-pink)",
  "var(--pg-accent)",
  "var(--pg-amber)",
  "var(--pg-mint)",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

// ─── Badge ────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status];
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold"
      style={{
        background: "white",
        border: "2px solid var(--border-hard)",
        color: cfg.color,
        boxShadow: "2px 2px 0px var(--border-hard)",
      }}
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
            background: "white",
            border: "2px solid var(--border-hard)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "4px 4px 0px var(--border-hard)",
          }}
          whileHover={{
            boxShadow: `8px 8px 0px ${shadowColor}`,
            transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: "3/2" }}
          >
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
          <div className="p-4 flex flex-col gap-1 flex-1">
            <p className="latin-name text-[10px]">{species.latinName}</p>
            <h3
              className="font-bold text-base leading-snug"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--text-primary)",
              }}
            >
              {species.name}
            </h3>
            <p
              className="text-sm line-clamp-2 flex-1 mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              {species.description}
            </p>
            <div
              className="flex items-center gap-1 mt-3 pl-2 text-base font-bold"
              style={{
                color: "var(--pg-accent)",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Lihat detail{" "}
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ─── List Item ────────────────────────────────
const REGION_LABELS: Record<string, string> = {
  sumatera: "Sumatera",
  kalimantan: "Kalimantan",
  jawa: "Jawa",
  sulawesi: "Sulawesi",
  papua: "Papua",
  "bali-nusra": "Bali & Nusra",
};

function SpeciesListItem({
  species,
  index,
}: {
  species: Species;
  index: number;
}) {
  const shadowColor = SHADOW_COLORS[index % SHADOW_COLORS.length];
  const statusColor = STATUS_CFG[species.status]?.color ?? "var(--pg-accent)";
  return (
    <motion.div variants={fadeUp}>
      <Link href={`/species/${species.id}`} className="block group">
        <motion.div
          className="relative flex items-stretch gap-0 overflow-hidden"
          style={{
            background: "white",
            border: "2px solid var(--border-hard)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "4px 4px 0px var(--border-hard)",
            transition: "box-shadow 0.2s",
          }}
          whileHover={{
            boxShadow: `7px 7px 0px ${shadowColor}`,
            transition: { duration: 0.18, ease: [0.34, 1.56, 0.64, 1] },
          }}
          whileTap={{ scale: 0.995 }}
        >
          {/* Colored left accent bar */}
          <div
            className="w-1.5 flex-shrink-0 self-stretch"
            style={{ background: statusColor }}
          />

          {/* Image */}
          <div
            className="relative flex-shrink-0 overflow-hidden"
            style={{
              width: "130px",
              aspectRatio: "4/3",
              borderRight: "2px solid var(--border-hard)",
            }}
          >
            <Image
              src={resolveSpeciesImage(species.image)}
              alt={species.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="130px"
            />
            {/* Type chip overlay */}
            <span
              className="absolute bottom-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize"
              style={{
                background: "rgba(0,0,0,0.55)",
                color: "white",
                letterSpacing: "0.04em",
                backdropFilter: "blur(4px)",
              }}
            >
              {species.type}
            </span>
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 px-5 py-4">
            <p
              className="latin-name text-[10px] tracking-wide"
              style={{ color: "var(--text-faint)" }}
            >
              {species.latinName}
            </p>
            <h3
              className="font-bold leading-snug"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--text-primary)",
                fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
              }}
            >
              {species.name}
            </h3>
            <p
              className="text-sm leading-relaxed line-clamp-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {species.description}
            </p>
            {/* Region tag */}
            {REGION_LABELS[species.region] && (
              <span
                className="self-start text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
                style={{
                  background: "var(--pg-muted)",
                  border: "1.5px solid var(--border-light)",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                📍 {REGION_LABELS[species.region]}
              </span>
            )}
          </div>

          {/* Right: status + arrow */}
          <div
            className="flex flex-col items-center justify-between gap-3 px-5 py-4 flex-shrink-0"
            style={{
              borderLeft: "2px solid var(--border-light)",
              minWidth: "120px",
            }}
          >
            <StatusBadge status={species.status} />
            <motion.div
              className="flex items-center gap-1 text-sm font-bold"
              style={{
                color: "var(--pg-accent)",
                fontFamily: "var(--font-heading)",
              }}
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
            >
              <span>Detail</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="overflow-hidden"
      style={{
        border: "2px solid var(--border-hard)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "4px 4px 0px var(--border-hard)",
      }}
    >
      <div className="shimmer" style={{ aspectRatio: "3/2" }} />
      <div className="p-4 space-y-2">
        <div className="shimmer h-2.5 rounded-full w-2/3" />
        <div className="shimmer h-4 rounded-full w-full" />
        <div className="shimmer h-3 rounded-full w-5/6" />
      </div>
    </div>
  );
}

// ─── Pagination Button ────────────────────────
function PageBtn({
  onClick,
  disabled = false,
  active = false,
  children,
  isArrow = false,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
  isArrow?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -2, scale: 1.05 } : {}}
      whileTap={!disabled ? { y: 1, scale: 0.95 } : {}}
      transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base select-none"
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "var(--font-heading)",
        border: "2px solid var(--border-hard)",
        background: active ? "var(--pg-accent)" : "white",
        color: active
          ? "white"
          : disabled
            ? "var(--text-faint)"
            : "var(--text-primary)",
        boxShadow: active
          ? "3px 3px 0px var(--border-hard)"
          : disabled
            ? "none"
            : "2px 2px 0px var(--border-hard)",
        opacity: disabled ? 0.4 : 1,
        // hover bg handled via CSS var trick — motion handles transform
        transition: "background 0.15s, color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        if (disabled || active) return;
        const el = e.currentTarget;
        el.style.background = isArrow ? "var(--pg-dark)" : "var(--pg-amber)";
        el.style.color = "white";
        el.style.boxShadow = "4px 4px 0px var(--border-hard)";
      }}
      onMouseLeave={(e) => {
        if (disabled || active) return;
        const el = e.currentTarget;
        el.style.background = "white";
        el.style.color = "var(--text-primary)";
        el.style.boxShadow = "2px 2px 0px var(--border-hard)";
      }}
    >
      {children}
    </motion.button>
  );
}

// ─── Pagination ───────────────────────────────
function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (n: number) => void;
}) {
  if (total <= 1) return null;

  // Build page number array (max 7 slots)
  const pages: number[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push(-1); // ellipsis
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    )
      pages.push(i);
    if (current < total - 2) pages.push(-1); // ellipsis
    pages.push(total);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      {/* Prev */}
      <PageBtn
        isArrow
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
      </PageBtn>

      {/* Pages */}
      {pages.map((p, i) =>
        p === -1 ? (
          <span
            key={`ellipsis-${i}`}
            className="w-10 h-10 flex items-center justify-center text-base font-bold select-none"
            style={{
              color: "var(--text-faint)",
              fontFamily: "var(--font-heading)",
            }}
          >
            …
          </span>
        ) : (
          <PageBtn key={p} onClick={() => onChange(p)} active={p === current}>
            {p}
          </PageBtn>
        ),
      )}

      {/* Next */}
      <PageBtn
        isArrow
        onClick={() => onChange(current + 1)}
        disabled={current === total}
      >
        <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
      </PageBtn>
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
      if (
        q &&
        !s.name.toLowerCase().includes(q) &&
        !s.latinName.toLowerCase().includes(q)
      )
        return false;
      if (region !== "all" && s.region !== region) return false;
      if (status !== "all" && s.status !== status) return false;
      if (type !== "all" && s.type !== type) return false;
      return true;
    });
  }, [search, region, status, type]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const visible = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handlePageChange = useCallback((n: number) => {
    setLoading(true);
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setLoading(false), 300);
  }, []);

  const activeCount =
    (region !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    (type !== "all" ? 1 : 0);

  return (
    <div style={{ background: "var(--pg-bg)" }} className="min-h-screen">
      {/* ─── Header ─── */}
      <div
        className="py-12 relative overflow-hidden"
        style={{
          background: "var(--pg-dark)",
          borderBottom: "2px solid var(--border-hard)",
        }}
      >
        <div className="absolute inset-0 bg-dots-dark opacity-40 pointer-events-none" />
        <div
          className="absolute top-8 right-12 w-20 h-20 rounded-full opacity-20"
          style={{
            background: "var(--pg-accent)",
            border: "2px solid var(--pg-accent)",
          }}
        />
        <div
          className="absolute bottom-4 left-8 w-12 h-12 rounded-lg opacity-20"
          style={{ background: "var(--pg-amber)", transform: "rotate(15deg)" }}
        />

        <div className="container-main relative z-10">
          <span
            className="section-eyebrow mb-3"
            style={{ color: "var(--pg-amber)" }}
          >
            <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} /> Direktori
            Spesies
          </span>
          <h1
            className="text-white mb-3"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              lineHeight: 1.15,
            }}
          >
            Atlas Spesies Nusantara
          </h1>
          <p
            className="text-base max-w-xl leading-relaxed"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            {speciesData.length} spesies endemik Indonesia dari 6 wilayah
            Nusantara. Filter, cari, dan temukan informasi lengkap.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-5">
            {[
              {
                label: `${(speciesData as Species[]).filter((s) => s.status === "kritis").length} Kritis`,
                color: "var(--status-cr)",
              },
              {
                label: `${(speciesData as Species[]).filter((s) => s.status === "terancam").length} Terancam`,
                color: "var(--status-en)",
              },
              {
                label: `${(speciesData as Species[]).filter((s) => s.status === "rentan").length} Rentan`,
                color: "var(--status-vu)",
              },
            ].map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "2px solid rgba(255,255,255,0.20)",
                  borderRadius: "var(--radius-full)",
                  color: "white",
                  fontFamily: "var(--font-heading)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: p.color }}
                />
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Search & Filter ─── */}
      <div
        className="sticky top-16 lg:top-[68px] z-30"
        style={{
          background: "var(--pg-bg)",
          borderBottom: "2px solid var(--border-hard)",
        }}
      >
        <div className="container-main py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--text-muted)" }}
                strokeWidth={2.5}
              />
              <input
                type="text"
                placeholder="Cari nama spesies atau latin…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="input-pg pl-10 pr-10"
                style={{
                  borderRadius: "var(--radius-full)",
                  border: "2px solid var(--border-hard)",
                  boxShadow: "3px 3px 0px var(--border-hard)",
                }}
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: "var(--pg-slate-200)",
                    cursor: "pointer",
                  }}
                >
                  <X className="w-3 h-3" strokeWidth={2.5} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-base transition-all"
              style={{
                fontFamily: "var(--font-heading)",
                cursor: "pointer",
                border: "2px solid var(--border-hard)",
                background:
                  showFilters || activeCount > 0 ? "var(--pg-accent)" : "white",
                color:
                  showFilters || activeCount > 0
                    ? "white"
                    : "var(--text-primary)",
                boxShadow: "3px 3px 0px var(--border-hard)",
              }}
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Filter</span>
              {activeCount > 0 && (
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: "white", color: "var(--pg-accent)" }}
                >
                  {activeCount}
                </span>
              )}
            </button>
            <div
              className="flex rounded-xl overflow-hidden"
              style={{ border: "2px solid var(--border-hard)" }}
            >
              {(
                [
                  [
                    "grid",
                    <Grid3X3 key="g" className="w-4 h-4" strokeWidth={2.5} />,
                  ],
                  [
                    "list",
                    <List key="l" className="w-4 h-4" strokeWidth={2.5} />,
                  ],
                ] as const
              ).map(([mode, icon]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as "grid" | "list")}
                  className="p-2.5 transition-all"
                  style={{
                    cursor: "pointer",
                    background: viewMode === mode ? "var(--pg-dark)" : "white",
                    color: viewMode === mode ? "white" : "var(--text-muted)",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div
                  className="pt-4 pb-3 border-t-2 mt-3 flex flex-col gap-4"
                  style={{ borderColor: "var(--border-light)" }}
                >
                  <div>
                    <p className="label-pg mb-2">Wilayah</p>
                    <div className="flex flex-wrap gap-2">
                      {REGIONS.map((r) => (
                        <button
                          key={r.value}
                          onClick={() => {
                            setRegion(r.value);
                            setPage(1);
                          }}
                          className={`chip ${region === r.value ? "chip-active" : ""}`}
                          style={{ cursor: "pointer" }}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="label-pg mb-2">Status</p>
                      <div className="flex flex-wrap gap-2">
                        {STATUSES.map((s) => (
                          <button
                            key={s.value}
                            onClick={() => {
                              setStatus(s.value);
                              setPage(1);
                            }}
                            className={`chip ${status === s.value ? "chip-active" : ""}`}
                            style={{ cursor: "pointer" }}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="label-pg mb-2">Jenis</p>
                      <div className="flex flex-wrap gap-2">
                        {TYPES.map((t) => (
                          <button
                            key={t.value}
                            onClick={() => {
                              setType(t.value);
                              setPage(1);
                            }}
                            className={`chip ${type === t.value ? "chip-active" : ""}`}
                            style={{ cursor: "pointer" }}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {activeCount > 0 && (
                    <button
                      onClick={() => {
                        setRegion("all");
                        setStatus("all");
                        setType("all");
                        setPage(1);
                      }}
                      className="self-start text-sm font-bold flex items-center gap-1.5"
                      style={{
                        color: "var(--status-cr)",
                        fontFamily: "var(--font-heading)",
                        cursor: "pointer",
                      }}
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={2.5} /> Reset
                      semua filter
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
        <p
          className="text-sm font-semibold mb-6"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Menampilkan{" "}
          <span style={{ color: "var(--text-primary)" }}>{visible.length}</span>{" "}
          dari{" "}
          <span style={{ color: "var(--text-primary)" }}>
            {filtered.length}
          </span>{" "}
          spesies
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
              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Tidak Ditemukan
              </h3>
              <p
                className="text-base mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                Spesies &ldquo;{search}&rdquo; tidak ada dalam database.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setRegion("all");
                  setStatus("all");
                  setType("all");
                  setPage(1);
                }}
                className="btn-candy px-6 py-2.5 text-base"
              >
                Reset Pencarian
              </button>
            </motion.div>
          ) : loading ? (
            viewMode === "grid" ? (
              <motion.div
                key="skel-g"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5"
              >
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div key="skel-l" className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-2xl shimmer"
                    style={{ border: "2px solid var(--border-hard)" }}
                  />
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
              {visible.map((s, i) => (
                <SpeciesCard key={s.id} species={s as Species} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {visible.map((s, i) => (
                <SpeciesListItem key={s.id} species={s as Species} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && filtered.length > 0 && (
          <Pagination
            current={page}
            total={totalPages}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

export default function SpeciesPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen pt-24 flex items-center justify-center"
          style={{ background: "var(--pg-bg)" }}
        >
          <div className="text-center">
            <div className="text-5xl mb-4 animate-bounce-pop">🌿</div>
            <p
              className="font-bold text-lg"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--text-muted)",
              }}
            >
              Memuat spesies…
            </p>
          </div>
        </div>
      }
    >
      <SpeciesPageContent />
    </Suspense>
  );
}
