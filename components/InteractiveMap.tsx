"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { geoMercator, geoPath } from "d3-geo";
import {
  X,
  ChevronRight,
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import speciesData from "@/data/species.json";

const GEO_URL =
  "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-province-simple.json";

// ─────────────────────────────────────────────
// Province name → display name (Title Case)
// and → region color group
// ─────────────────────────────────────────────
const PROV_REGION: Record<string, string> = {
  ACEH: "sumatera",
  "NANGGROE ACEH DARUSSALAM": "sumatera",
  "SUMATERA UTARA": "sumatera",
  "SUMATRA UTARA": "sumatera",
  "SUMATERA BARAT": "sumatera",
  "SUMATRA BARAT": "sumatera",
  RIAU: "sumatera",
  "KEPULAUAN RIAU": "sumatera",
  "KEP. RIAU": "sumatera",
  JAMBI: "sumatera",
  BENGKULU: "sumatera",
  "SUMATERA SELATAN": "sumatera",
  "SUMATRA SELATAN": "sumatera",
  "KEPULAUAN BANGKA BELITUNG": "sumatera",
  "BANGKA BELITUNG": "sumatera",
  LAMPUNG: "sumatera",
  "DKI JAKARTA": "jawa",
  JAKARTA: "jawa",
  BANTEN: "jawa",
  "JAWA BARAT": "jawa",
  "JAWA TENGAH": "jawa",
  "DAERAH ISTIMEWA YOGYAKARTA": "jawa",
  "DI YOGYAKARTA": "jawa",
  YOGYAKARTA: "jawa",
  "JAWA TIMUR": "jawa",
  "KALIMANTAN BARAT": "kalimantan",
  "KALIMANTAN TENGAH": "kalimantan",
  "KALIMANTAN SELATAN": "kalimantan",
  "KALIMANTAN TIMUR": "kalimantan",
  "KALIMANTAN UTARA": "kalimantan",
  BALI: "bali-nusra",
  "NUSA TENGGARA BARAT": "bali-nusra",
  "NUSA TENGGARA TIMUR": "bali-nusra",
  "SULAWESI UTARA": "sulawesi",
  GORONTALO: "sulawesi",
  "SULAWESI TENGAH": "sulawesi",
  "SULAWESI BARAT": "sulawesi",
  "SULAWESI SELATAN": "sulawesi",
  "SULAWESI TENGGARA": "sulawesi",
  "MALUKU UTARA": "papua",
  MALUKU: "papua",
  "PAPUA BARAT": "papua",
  PAPUA: "papua",
  "PAPUA PEGUNUNGAN": "papua",
  "PAPUA SELATAN": "papua",
  "PAPUA TENGAH": "papua",
};

const REGION_CFG: Record<
  string,
  { base: string; hover: string; active: string; hasSpecies: string }
> = {
  sumatera: {
    base: "#BBE0BB",
    hover: "#6DBF6D",
    active: "#388E3C",
    hasSpecies: "#2E7D32",
  },
  kalimantan: {
    base: "#C5E1A5",
    hover: "#8BC34A",
    active: "#558B2F",
    hasSpecies: "#33691E",
  },
  jawa: {
    base: "#E6EE9C",
    hover: "#CDDC39",
    active: "#AFB42B",
    hasSpecies: "#827717",
  },
  sulawesi: {
    base: "#B2DFDB",
    hover: "#4DB6AC",
    active: "#00796B",
    hasSpecies: "#004D40",
  },
  papua: {
    base: "#A5D6A7",
    hover: "#4CAF50",
    active: "#2E7D32",
    hasSpecies: "#1B5E20",
  },
  "bali-nusra": {
    base: "#DCEDC8",
    hover: "#AED581",
    active: "#689F38",
    hasSpecies: "#33691E",
  },
  unknown: {
    base: "#E8E8E8",
    hover: "#D0D0D0",
    active: "#BDBDBD",
    hasSpecies: "#9E9E9E",
  },
};

const REGION_LABEL: Record<string, string> = {
  sumatera: "Sumatera",
  kalimantan: "Kalimantan",
  jawa: "Jawa",
  sulawesi: "Sulawesi",
  papua: "Papua & Maluku",
  "bali-nusra": "Bali & Nusa Tenggara",
};

const STATUS_CLR: Record<string, string> = {
  kritis: "#C0392B",
  terancam: "#D35400",
  rentan: "#B7950B",
};

interface GeoFeat {
  type: string;
  properties: Record<string, string>;
  geometry: any;
}
interface TooltipSt {
  x: number;
  y: number;
  prov: string;
  provRaw: string;
  region: string;
  speciesCount: number;
  speciesNames: string[];
}
interface Sp {
  id: string;
  name: string;
  latinName: string;
  region: string;
  status: string;
  image: string;
  province: string[];
  provinceMain: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function provName(props: Record<string, string>): string {
  const raw =
    props?.Propinsi ??
    props?.PROVINSI ??
    props?.Provinsi ??
    props?.name ??
    props?.NAME_1 ??
    "";
  return raw.toUpperCase().trim();
}

function getRegion(name: string): string | null {
  if (PROV_REGION[name]) return PROV_REGION[name];
  for (const [key, region] of Object.entries(PROV_REGION)) {
    if (name.includes(key) || key.includes(name)) return region;
  }
  if (process.env.NODE_ENV === "development" && name) {
    console.warn(`[Map] Unknown province: "${name}"`);
  }
  return null;
}

function toTitleCase(str: string): string {
  return str
    .split(" ")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

// Get species that live in a specific province
function getSpeciesForProvince(provRaw: string): Sp[] {
  return (speciesData as Sp[]).filter(
    (sp) => sp.province && sp.province.some((p) => p.toUpperCase() === provRaw),
  );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function InteractiveMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 860, h: 430 });
  const [feats, setFeats] = useState<GeoFeat[]>([]);
  const [paths, setPaths] = useState<Record<string, string>>({});
  const [featRegion, setFeatRegion] = useState<Record<string, string | null>>(
    {},
  );
  const [status, setStatus] = useState<"loading" | "ok" | "err">("loading");

  const [hovered, setHovered] = useState<string | null>(null);
  const [selProv, setSelProv] = useState<string | null>(null); // selected province (raw uppercase)
  const [tip, setTip] = useState<TooltipSt | null>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const drag0 = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  // Responsive
  useEffect(() => {
    const upd = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.clientWidth;
      setDims({ w, h: Math.round(Math.max(300, w * 0.46)) });
    };
    upd();
    const ro = new ResizeObserver(upd);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Load GeoJSON
  useEffect(() => {
    if (!dims.w) return;
    setStatus("loading");
    fetch(GEO_URL)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        const features: GeoFeat[] = data.features ?? [];
        const proj = geoMercator().fitSize([dims.w, dims.h], {
          type: "FeatureCollection",
          features,
        } as any);
        const gen = geoPath().projection(proj);
        const pathMap: Record<string, string> = {};
        const regionMap: Record<string, string | null> = {};
        features.forEach((f, i) => {
          const nm = provName(f.properties) || `feat_${i}`;
          const reg = getRegion(nm);
          const d = gen(f.geometry as any);
          if (d) pathMap[nm] = d;
          regionMap[nm] = reg;
        });
        setFeats(features);
        setPaths(pathMap);
        setFeatRegion(regionMap);
        setStatus("ok");
      })
      .catch(() => setStatus("err"));
  }, [dims]);

  // Sidebar species (per province)
  const sidebarSpecies: Sp[] = selProv ? getSpeciesForProvince(selProv) : [];
  const selRegion = selProv ? (featRegion[selProv] ?? null) : null;

  // Handlers
  const onEnter = useCallback(
    (f: GeoFeat, i: number, e: React.MouseEvent) => {
      const nm = provName(f.properties) || `feat_${i}`;
      const reg = featRegion[nm] ?? null;
      const sps = getSpeciesForProvince(nm);
      setHovered(nm);
      setTip({
        x: e.clientX,
        y: e.clientY,
        prov: toTitleCase(nm),
        provRaw: nm,
        region: reg ?? "unknown",
        speciesCount: sps.length,
        speciesNames: sps.slice(0, 3).map((s) => s.name),
      });
    },
    [featRegion],
  );

  const onMove = useCallback(
    (e: React.MouseEvent) =>
      setTip((p) => (p ? { ...p, x: e.clientX, y: e.clientY } : null)),
    [],
  );
  const onLeave = useCallback(() => {
    setHovered(null);
    setTip(null);
  }, []);

  const onClick = useCallback((f: GeoFeat, i: number) => {
    const nm = provName(f.properties) || `feat_${i}`;
    const sps = getSpeciesForProvince(nm);
    if (sps.length === 0) return; // only open if has species
    setSelProv((p) => (p === nm ? null : nm));
  }, []);

  // Zoom/pan
  const zoomIn = () => setZoom((z) => Math.min(z + 0.5, 5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.5, 1));
  const reset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelProv(null);
  };
  const onMDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    dragging.current = true;
    drag0.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
  };
  const onMMove = (e: React.MouseEvent) => {
    onMove(e);
    if (!dragging.current) return;
    setPan({
      x: drag0.current.px + (e.clientX - drag0.current.mx),
      y: drag0.current.py + (e.clientY - drag0.current.my),
    });
  };
  const onMUp = () => {
    dragging.current = false;
  };
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(5, Math.max(1, z - e.deltaY * 0.0015)));
  };

  // Province fill color
  const getProvFill = (nm: string, isHov: boolean, isSel: boolean) => {
    const reg = featRegion[nm] ?? null;
    const cfg = reg
      ? (REGION_CFG[reg] ?? REGION_CFG.unknown)
      : REGION_CFG.unknown;
    const hasSp = getSpeciesForProvince(nm).length > 0;

    if (isSel) return cfg.active;
    if (isHov) return cfg.hover;
    if (hasSp) return cfg.hasSpecies; // slightly darker = has species
    return cfg.base;
  };

  return (
    <div className="flex gap-5 items-start flex-col xl:flex-row">
      {/* ══════════ MAP ══════════ */}
      <div
        ref={wrapRef}
        className="relative flex-1 rounded-2xl overflow-hidden"
        style={{
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-md)",
          background: "#D6EAF8",
          cursor: zoom > 1 ? "grab" : "default",
          userSelect: "none",
          minHeight: 300,
        }}
      >
        {/* Loading */}
        {status === "loading" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20"
            style={{ background: "#D6EAF8" }}
          >
            <Loader2
              className="w-7 h-7 animate-spin"
              style={{ color: "var(--green-400)" }}
            />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Memuat peta Indonesia…
            </p>
          </div>
        )}

        {/* Error */}
        {status === "err" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20"
            style={{ background: "#D6EAF8" }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Gagal memuat peta.
            </p>
            <button
              onClick={() => {
                setStatus("loading");
                setFeats([]);
                setPaths({});
              }}
              className="btn-outline text-xs py-1.5 px-4"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Zoom controls */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
          {(
            [
              {
                icon: <ZoomIn className="w-3.5 h-3.5" />,
                fn: zoomIn,
                title: "Zoom in",
              },
              {
                icon: <ZoomOut className="w-3.5 h-3.5" />,
                fn: zoomOut,
                title: "Zoom out",
              },
              {
                icon: <RotateCcw className="w-3.5 h-3.5" />,
                fn: reset,
                title: "Reset",
              },
            ] as const
          ).map((b) => (
            <button
              key={b.title}
              title={b.title}
              onClick={b.fn}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: "white",
                border: "1px solid var(--border-light)",
                color: "var(--text-secondary)",
                boxShadow: "var(--shadow-sm)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--green-50)";
                e.currentTarget.style.color = "var(--green-600)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {b.icon}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div
          className="absolute bottom-3 left-3 z-10 p-3 rounded-xl hidden sm:block"
          style={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid var(--border-light)",
            backdropFilter: "blur(8px)",
          }}
        >
          <p
            className="text-[9px] font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Wilayah
          </p>
          <div className="space-y-1.5">
            {Object.entries(REGION_LABEL).map(([k, lbl]) => {
              const count = (speciesData as Sp[]).filter(
                (s) => s.region === k,
              ).length;
              return (
                <div key={k} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ background: REGION_CFG[k].active }}
                  />
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {lbl}
                  </span>
                  <span
                    className="text-[9px] ml-auto tabular-nums"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Has-species indicator */}
          <div
            className="mt-2 pt-2 flex items-center gap-2"
            style={{ borderTop: "1px solid var(--border-light)" }}
          >
            <span
              className="w-3 h-3 rounded-sm"
              style={{ background: "#2E7D32" }}
            />
            <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
              Ada spesies terdokumentasi
            </span>
          </div>
        </div>

        {/* Hint */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-[10px] px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid var(--border-light)",
              color: "var(--text-muted)",
            }}
          >
            {zoom > 1
              ? "Drag untuk menggeser · Scroll untuk zoom"
              : "Klik provinsi yang lebih gelap untuk lihat spesies"}
          </span>
        </div>

        {/* SVG */}
        <svg
          width={dims.w}
          height={dims.h}
          style={{ display: "block" }}
          onMouseDown={onMDown}
          onMouseMove={onMMove}
          onMouseUp={onMUp}
          onMouseLeave={() => {
            onMUp();
            onLeave();
          }}
          onWheel={onWheel}
        >
          <rect width={dims.w} height={dims.h} fill="#D6EAF8" />
          {[...Array(8)].map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={(dims.h / 8) * i}
              x2={dims.w}
              y2={(dims.h / 8) * i}
              stroke="rgba(52,152,219,0.06)"
              strokeWidth={1}
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <line
              key={`v${i}`}
              x1={(dims.w / 12) * i}
              y1={0}
              x2={(dims.w / 12) * i}
              y2={dims.h}
              stroke="rgba(52,152,219,0.06)"
              strokeWidth={1}
            />
          ))}

          <g
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: `${dims.w / 2}px ${dims.h / 2}px`,
            }}
          >
            {feats.map((f, i) => {
              const nm = provName(f.properties) || `feat_${i}`;
              const d = paths[nm];
              if (!d) return null;

              const isHov = hovered === nm;
              const isSel = selProv === nm;
              const reg = featRegion[nm] ?? null;
              // dim all other provinces when one is selected
              const dim = selProv !== null && !isSel && reg !== null;
              const hasSp = getSpeciesForProvince(nm).length > 0;

              return (
                <path
                  key={i}
                  d={d}
                  fill={getProvFill(nm, isHov, isSel)}
                  stroke="white"
                  strokeWidth={isSel ? 1.5 / zoom : 0.7 / zoom}
                  opacity={dim ? 0.35 : 1}
                  style={{
                    cursor: hasSp ? "pointer" : reg ? "default" : "not-allowed",
                    transition: "fill 0.15s, opacity 0.2s",
                    filter: isHov
                      ? "drop-shadow(0 2px 6px rgba(0,0,0,0.2))"
                      : "none",
                  }}
                  onMouseEnter={(e) => onEnter(f, i, e)}
                  onMouseMove={onMove}
                  onMouseLeave={onLeave}
                  onClick={() => onClick(f, i)}
                />
              );
            })}
          </g>

          {zoom > 1 && (
            <text
              x={dims.w - 8}
              y={dims.h - 8}
              textAnchor="end"
              fill="rgba(46,125,50,0.35)"
              fontSize={9}
              fontFamily="system-ui"
            >
              {zoom.toFixed(1)}×
            </text>
          )}
        </svg>
      </div>

      {/* ══════════ SIDEBAR ══════════ */}
      <div
        className={`transition-all duration-300 overflow-hidden flex-shrink-0 w-full xl:w-auto ${
          selProv
            ? "opacity-100 max-h-[600px] xl:max-h-none"
            : "opacity-0 max-h-0 xl:max-h-0 xl:w-0"
        }`}
      >
        {selProv && (
          <div
            className="rounded-2xl overflow-hidden flex flex-col xl:w-72"
            style={{
              background: "white",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-md)",
              maxHeight: Math.max(dims.h, 400),
            }}
          >
            {/* Header */}
            <div
              className="p-4 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--border-light)" }}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p
                    className="section-label mb-0.5"
                    style={{ fontSize: "9px" }}
                  >
                    Provinsi
                  </p>
                  <h3
                    className="font-bold text-base leading-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {toTitleCase(selProv)}
                  </h3>
                  {selRegion && (
                    <span
                      className="inline-flex items-center gap-1 text-[10px] mt-1 px-2 py-0.5 rounded-full"
                      style={{
                        background: "var(--green-50)",
                        color: "var(--green-600)",
                        border: "1px solid var(--green-100)",
                      }}
                    >
                      {REGION_LABEL[selRegion]}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelProv(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 mt-0.5"
                  style={{
                    background: "var(--bg-muted)",
                    color: "var(--text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--green-100)";
                    e.currentTarget.style.color = "var(--green-600)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--bg-muted)";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p
                className="text-xs mt-2"
                style={{ color: "var(--text-muted)" }}
              >
                <span
                  className="font-semibold"
                  style={{ color: "var(--green-500)" }}
                >
                  {sidebarSpecies.length}
                </span>{" "}
                spesies terdokumentasi
              </p>
            </div>

            {/* Species list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sidebarSpecies.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Belum ada data spesies
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-faint)" }}
                  >
                    untuk provinsi ini
                  </p>
                </div>
              ) : (
                sidebarSpecies.map((sp) => (
                  <Link
                    key={sp.id}
                    href={`/species/${sp.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl transition-all group"
                    style={{
                      background: "var(--bg-subtle)",
                      border: "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--green-50)";
                      e.currentTarget.style.borderColor = "var(--green-100)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--bg-subtle)";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={sp.image}
                        alt={sp.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {sp.name}
                      </p>
                      <p
                        className="text-[10px] italic truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {sp.latinName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="inline-block px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                          style={{
                            color: STATUS_CLR[sp.status] || "var(--text-muted)",
                            background: `${STATUS_CLR[sp.status] || "#999"}18`,
                            border: `1px solid ${STATUS_CLR[sp.status] || "#999"}30`,
                          }}
                        >
                          {sp.status.charAt(0).toUpperCase() +
                            sp.status.slice(1)}
                        </span>
                        {/* Show if main province */}
                        {sp.provinceMain === selProv && (
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded-full"
                            style={{
                              background: "var(--green-50)",
                              color: "var(--green-600)",
                              border: "1px solid var(--green-100)",
                            }}
                          >
                            Habitat Utama
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight
                      className="w-3.5 h-3.5 flex-shrink-0 opacity-30 group-hover:opacity-60 transition-opacity"
                      style={{ color: "var(--green-500)" }}
                    />
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            {sidebarSpecies.length > 0 && selRegion && (
              <div
                className="p-3 flex-shrink-0 space-y-2"
                style={{ borderTop: "1px solid var(--border-light)" }}
              >
                <Link
                  href={`/species?province=${encodeURIComponent(selProv)}`}
                  className="flex items-center justify-center gap-1 w-full py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: "var(--green-500)", color: "white" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--green-600)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--green-500)")
                  }
                >
                  Lihat Semua Spesies
                  <ChevronRight className="w-3 h-3" />
                </Link>
                <Link
                  href={`/species?region=${selRegion}`}
                  className="flex items-center justify-center gap-1 w-full py-2 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: "var(--green-50)",
                    border: "1px solid var(--green-100)",
                    color: "var(--green-600)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--green-100)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--green-50)")
                  }
                >
                  Semua Spesies {REGION_LABEL[selRegion]}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════ TOOLTIP ══════════ */}
      {tip && (
        <div
          className="map-tooltip"
          style={{
            left: tip.x + 14,
            top: tip.y,
            transform: "translateY(-50%)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin
              className="w-3 h-3 flex-shrink-0"
              style={{ color: "var(--green-500)" }}
            />
            <span
              className="font-semibold text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              {tip.prov}
            </span>
          </div>
          {tip.region !== "unknown" && (
            <p
              className="text-[10px] mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              {REGION_LABEL[tip.region] ?? tip.region}
            </p>
          )}
          {tip.speciesCount > 0 ? (
            <div
              className="mt-1.5 pt-1.5"
              style={{ borderTop: "1px solid var(--border-light)" }}
            >
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: "var(--green-500)" }}
              >
                {tip.speciesCount} spesies terdokumentasi
              </p>
              {tip.speciesNames.map((n) => (
                <p
                  key={n}
                  className="text-[10px] leading-snug"
                  style={{ color: "var(--text-muted)" }}
                >
                  · {n}
                </p>
              ))}
              {tip.speciesCount > 3 && (
                <p
                  className="text-[10px]"
                  style={{ color: "var(--text-faint)" }}
                >
                  +{tip.speciesCount - 3} lainnya
                </p>
              )}
              <p
                className="text-[9px] mt-1.5 font-medium"
                style={{ color: "var(--green-400)" }}
              >
                Klik untuk lihat detail →
              </p>
            </div>
          ) : (
            <div
              className="mt-1 pt-1"
              style={{ borderTop: "1px solid var(--border-light)" }}
            >
              <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>
                Belum ada data spesies
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
