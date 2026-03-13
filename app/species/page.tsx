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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ITEMS_PER_PAGE = 24;
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

type SpeciesSearchParams = Promise<{
  q?: string;
  region?: string;
  status?: string;
  type?: string;
  view?: string;
  p?: string;
}>;

function parsePositiveInt(value?: string) {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildHref(params: {
  q?: string;
  region?: string;
  status?: string;
  type?: string;
  view?: string;
  p?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.region && params.region !== "all") searchParams.set("region", params.region);
  if (params.status && params.status !== "all") searchParams.set("status", params.status);
  if (params.type && params.type !== "all") searchParams.set("type", params.type);
  if (params.view && params.view !== "grid") searchParams.set("view", params.view);
  if (params.p && params.p > 1) searchParams.set("p", String(params.p));

  const query = searchParams.toString();
  return query ? `/species?${query}` : "/species";
}

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

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center px-3.5 py-2 rounded-full text-sm font-bold transition-colors"
      style={{
        fontFamily: "var(--font-heading)",
        border: "2px solid var(--border-hard)",
        background: active ? "var(--pg-accent)" : "white",
        color: active ? "white" : "var(--text-primary)",
        boxShadow: active ? "3px 3px 0px var(--border-hard)" : "2px 2px 0px var(--border-hard)",
      }}
    >
      {children}
    </Link>
  );
}

function PaginationLink({ href, active, disabled, children }: { href: string; active?: boolean; disabled?: boolean; children: React.ReactNode }) {
  if (disabled) {
    return (
      <span
        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
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
    <Link
      href={href}
      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
      style={{
        fontFamily: "var(--font-heading)",
        border: "2px solid var(--border-hard)",
        background: active ? "var(--pg-accent)" : "white",
        color: active ? "white" : "var(--text-primary)",
        boxShadow: active ? "3px 3px 0px var(--border-hard)" : "2px 2px 0px var(--border-hard)",
      }}
    >
      {children}
    </Link>
  );
}

function SpeciesImagePanel({ species, compact = false }: { species: CatalogSpecies; compact?: boolean }) {
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

function SpeciesGridCard({ species }: { species: CatalogSpecies }) {
  const status = species.status ? STATUS_CFG[species.status] : null;

  return (
    <Link href={`/species/${species.id}`} className="block h-full">
      <article
        className="h-full overflow-hidden flex flex-col"
        style={{
          background: "white",
          border: "2px solid var(--border-hard)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "4px 4px 0px var(--border-hard)",
        }}
      >
        <div className="relative" style={{ aspectRatio: "3 / 2" }}>
          <SpeciesImagePanel species={species} />
          {status && (
            <span
              className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold"
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
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="latin-name text-[11px] mb-1">{species.latinName}</p>
              <h2 className="text-lg font-bold leading-snug" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
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
          <div className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--pg-accent)", fontFamily: "var(--font-heading)" }}>
            Lihat detail
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </div>
        </div>
      </article>
    </Link>
  );
}

function SpeciesListCard({ species }: { species: CatalogSpecies }) {
  const status = species.status ? STATUS_CFG[species.status] : null;

  return (
    <Link href={`/species/${species.id}`} className="block">
      <article
        className="overflow-hidden flex gap-0"
        style={{
          background: "white",
          border: "2px solid var(--border-hard)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "4px 4px 0px var(--border-hard)",
        }}
      >
        <div className="relative flex-shrink-0" style={{ width: "140px", aspectRatio: "4 / 3" }}>
          <SpeciesImagePanel species={species} compact />
        </div>
        <div className="p-4 sm:p-5 flex-1 flex flex-col gap-3 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="latin-name text-[11px] mb-1 truncate">{species.latinName}</p>
              <h2 className="text-base sm:text-lg font-bold leading-snug" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
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
      </article>
    </Link>
  );
}

export default async function SpeciesPage({ searchParams }: { searchParams: SpeciesSearchParams }) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const region = REGIONS.some((entry) => entry.value === params.region) ? params.region ?? "all" : "all";
  const status = STATUSES.some((entry) => entry.value === params.status) ? params.status ?? "all" : "all";
  const type = TYPES.some((entry) => entry.value === params.type) ? params.type ?? "all" : "all";
  const view = params.view === "list" ? "list" : "grid";

  const filtered = catalogRecords.filter((species) => {
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(parsePositiveInt(params.p), totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visible = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const visiblePages = getVisiblePages(currentPage, totalPages);
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
          <span className="section-eyebrow mb-4" style={{ color: "var(--pg-amber)" }}>
            <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} /> Katalog Biodiversitas
          </span>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1
                className="text-white mb-4"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: "clamp(2.2rem, 5vw, 4rem)",
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
              className="rounded-[28px] p-5 sm:p-6"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "2px solid rgba(255,255,255,0.15)",
                boxShadow: "6px 6px 0px rgba(0,0,0,0.22)",
              }}
            >
              <div className="grid grid-cols-3 gap-3 text-white">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/60 mb-1">Total</p>
                  <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{totalCount}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/60 mb-1">Flora</p>
                  <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{floraCount}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/60 mb-1">Fauna</p>
                  <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{faunaCount}</p>
                </div>
              </div>
              <div className="mt-4 inline-flex items-start gap-2 rounded-2xl px-3.5 py-3 text-sm leading-relaxed" style={{ background: "rgba(255,255,255,0.08)" }}>
                <Database className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <span>Pencarian, filter, dan pagination dirancang untuk penelusuran katalog yang cepat dan terarah.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-main py-8 sm:py-10">
        <form action="/species" method="get" className="grid gap-4 xl:grid-cols-[1.3fr_1fr_auto] xl:items-start">
          <div>
            <label className="label-pg mb-2 block" htmlFor="catalog-search">Cari nama umum atau nama latin</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} strokeWidth={2.5} />
              <input
                id="catalog-search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Misalnya raflesia, orangutan, Acanthus…"
                className="input-pg pl-10"
                style={{ borderRadius: "999px", border: "2px solid var(--border-hard)", boxShadow: "3px 3px 0px var(--border-hard)" }}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="label-pg mb-2 block" htmlFor="catalog-region">Wilayah</label>
              <select id="catalog-region" name="region" defaultValue={region} className="input-pg" style={{ borderRadius: "18px", border: "2px solid var(--border-hard)", boxShadow: "3px 3px 0px var(--border-hard)", backgroundColor: "white", color: "var(--text-primary)" }}>
                {REGIONS.map((entry) => (
                  <option key={entry.value} value={entry.value}>{entry.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-pg mb-2 block" htmlFor="catalog-status">Status</label>
              <select id="catalog-status" name="status" defaultValue={status} className="input-pg" style={{ borderRadius: "18px", border: "2px solid var(--border-hard)", boxShadow: "3px 3px 0px var(--border-hard)", backgroundColor: "white", color: "var(--text-primary)" }}>
                {STATUSES.map((entry) => (
                  <option key={entry.value} value={entry.value}>{entry.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-pg mb-2 block" htmlFor="catalog-type">Jenis</label>
              <select id="catalog-type" name="type" defaultValue={type} className="input-pg" style={{ borderRadius: "18px", border: "2px solid var(--border-hard)", boxShadow: "3px 3px 0px var(--border-hard)", backgroundColor: "white", color: "var(--text-primary)" }}>
                {TYPES.map((entry) => (
                  <option key={entry.value} value={entry.value}>{entry.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 xl:justify-end xl:pt-7">
            <input type="hidden" name="view" value={view} />
            <button className="btn-candy px-5 py-3 h-fit" type="submit">Terapkan Filter</button>
            <Link href="/species" className="btn-outline-pg px-5 py-3 h-fit">Reset</Link>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {TYPES.map((entry) => (
            <FilterChip
              key={entry.value}
              href={buildHref({ q: query, region, status, type: entry.value, view, p: 1 })}
              active={type === entry.value}
            >
              {entry.label}
            </FilterChip>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-muted)", fontFamily: "var(--font-heading)" }}>
              Menampilkan {firstVisible.toLocaleString("id-ID")}–{lastVisible.toLocaleString("id-ID")} dari {filteredCount} entri
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-faint)" }}>
              {query ? `Pencarian aktif: “${query}”. ` : ""}
              Gunakan filter untuk menelusuri katalog secara lebih spesifik.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex overflow-hidden rounded-xl" style={{ border: "2px solid var(--border-hard)" }}>
              <Link href={buildHref({ q: query, region, status, type, view: "grid", p: currentPage })} className="p-2.5" style={{ background: view === "grid" ? "var(--pg-dark)" : "white", color: view === "grid" ? "white" : "var(--text-muted)" }} aria-label="Tampilan grid">
                <Grid3X3 className="w-4 h-4" strokeWidth={2.5} />
              </Link>
              <Link href={buildHref({ q: query, region, status, type, view: "list", p: currentPage })} className="p-2.5" style={{ background: view === "list" ? "var(--pg-dark)" : "white", color: view === "list" ? "white" : "var(--text-muted)" }} aria-label="Tampilan list">
                <List className="w-4 h-4" strokeWidth={2.5} />
              </Link>
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
            <Link href="/species" className="btn-candy mt-6 inline-flex px-6 py-3">Reset semua filter</Link>
          </div>
        ) : view === "grid" ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {visible.map((species) => (
              <SpeciesGridCard key={species.id} species={species} />
            ))}
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {visible.map((species) => (
              <SpeciesListCard key={species.id} species={species} />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
            <PaginationLink
              href={buildHref({ q: query, region, status, type, view, p: Math.max(1, currentPage - 1) })}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            </PaginationLink>
            {visiblePages.map((page, index) =>
              page === -1 ? (
                <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-sm font-bold" style={{ color: "var(--text-faint)" }}>
                  …
                </span>
              ) : (
                <PaginationLink key={page} href={buildHref({ q: query, region, status, type, view, p: page })} active={page === currentPage}>
                  {page}
                </PaginationLink>
              ),
            )}
            <PaginationLink
              href={buildHref({ q: query, region, status, type, view, p: Math.min(totalPages, currentPage + 1) })}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </PaginationLink>
          </div>
        )}
      </section>
    </div>
  );
}
