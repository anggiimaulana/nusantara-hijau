"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ExtendedFeature,
  type ExtendedFeatureCollection,
  type GeoGeometryObjects,
  type GeoPermissibleObjects,
  geoMercator,
  geoPath,
} from "d3-geo";
import {
  ChevronRight,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
  MapPin,
  Leaf,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { catalogRecords, getCatalogRegions } from "@/lib/biodiversity-catalog";
import { resolveSpeciesImage } from "@/lib/species-images";

const GEO_URL =
  "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-province-simple.json";

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
  "NUSATENGGARA BARAT": "bali-nusra",
  "NUSA TENGGARA BARAT": "bali-nusra",
  "NUSATENGGARA TIMUR": "bali-nusra",
  "NUSA TENGGARA TIMUR": "bali-nusra",
  "SULAWESI UTARA": "sulawesi",
  GORONTALO: "sulawesi",
  "SULAWESI TENGAH": "sulawesi",
  "SULAWESI BARAT": "sulawesi",
  "SULAWESI SELATAN": "sulawesi",
  "SULAWESI TENGGARA": "sulawesi",
  "MALUKU UTARA": "maluku",
  MALUKU: "maluku",
  "PAPUA BARAT": "papua",
  PAPUA: "papua",
  "PAPUA PEGUNUNGAN": "papua",
  "PAPUA SELATAN": "papua",
  "PAPUA TENGAH": "papua",
  "PAPUA BARAT DAYA": "papua",
  "IRIAN JAYA BARAT": "papua",
  "IRIAN JAYA TENGAH": "papua",
  "IRIAN JAYA TIMUR": "papua",
};

const REGION_CFG: Record<
  string,
  {
    fill: string;
    fillHover: string;
    fillSel: string;
    stroke: string;
    label: string;
    dot: string;
    accent: string;
    accentLight: string;
  }
> = {
  sumatera: {
    fill: "#7EC27E",
    fillHover: "#62B062",
    fillSel: "#459645",
    stroke: "#62B062",
    label: "Sumatera",
    dot: "#4CAF50",
    accent: "#22c55e",
    accentLight: "#dcfce7",
  },
  kalimantan: {
    fill: "#1A5C20",
    fillHover: "#236B2A",
    fillSel: "#2E7D32",
    stroke: "#1A5C20",
    label: "Kalimantan",
    dot: "#66BB6A",
    accent: "#16a34a",
    accentLight: "#d1fae5",
  },
  jawa: {
    fill: "#4DB04D",
    fillHover: "#3D9A3D",
    fillSel: "#2D7A2D",
    stroke: "#3D9A3D",
    label: "Jawa",
    dot: "#1B5E20",
    accent: "#15803d",
    accentLight: "#dcfce7",
  },
  sulawesi: {
    fill: "#F4C430",
    fillHover: "#E8B020",
    fillSel: "#D09000",
    stroke: "#D4A017",
    label: "Sulawesi",
    dot: "#B8860B",
    accent: "#d97706",
    accentLight: "#fef3c7",
  },
  maluku: {
    fill: "#7DD3DA",
    fillHover: "#52C0C9",
    fillSel: "#2BAAB5",
    stroke: "#4DB8C0",
    label: "Maluku",
    dot: "#008B8B",
    accent: "#0891b2",
    accentLight: "#cffafe",
  },
  papua: {
    fill: "#A07850",
    fillHover: "#8C6440",
    fillSel: "#785030",
    stroke: "#8C6440",
    label: "Papua",
    dot: "#5D4037",
    accent: "#92400e",
    accentLight: "#fef3c7",
  },
  "bali-nusra": {
    fill: "#F4C878",
    fillHover: "#E8B055",
    fillSel: "#D8943A",
    stroke: "#DBA040",
    label: "Bali & Nusa Tenggara",
    dot: "#B8780A",
    accent: "#b45309",
    accentLight: "#fffbeb",
  },
  unknown: {
    fill: "#D0D8DC",
    fillHover: "#B8C4CA",
    fillSel: "#A0B0B8",
    stroke: "#B0C0C8",
    label: "Tidak diketahui",
    dot: "#78909C",
    accent: "#64748b",
    accentLight: "#f1f5f9",
  },
};

const STATUS_CFG: Record<
  string,
  { text: string; bg: string; border: string; label: string; emoji: string }
> = {
  kritis: {
    text: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
    label: "Kritis",
    emoji: "🔴",
  },
  terancam: {
    text: "#EA580C",
    bg: "#FFF7ED",
    border: "#FFEDD5",
    label: "Terancam",
    emoji: "🟠",
  },
  rentan: {
    text: "#D97706",
    bg: "#FFFBEB",
    border: "#FEF3C7",
    label: "Rentan",
    emoji: "🟡",
  },
};

interface GeoFeat {
  type: string;
  properties: Record<string, string>;
  geometry: GeoGeometryObjects;
}
interface Sp {
  id: string;
  name: string;
  latinName: string;
  region: string;
  regions: string[];
  status: string | null;
  image: string | null;
}
interface Tip {
  x: number;
  y: number;
  name: string;
  region: string;
  count: number;
  topNames: string[];
}

function provKey(props: Record<string, string>): string {
  return (
    props?.Propinsi ??
    props?.PROVINSI ??
    props?.Provinsi ??
    props?.name ??
    props?.NAME_1 ??
    ""
  )
    .toUpperCase()
    .trim();
}
function getRegion(k: string): string {
  if (PROV_REGION[k]) return PROV_REGION[k];
  for (const [key, r] of Object.entries(PROV_REGION)) {
    if (k.includes(key) || key.includes(k)) return r;
  }
  return "unknown";
}
function toTitle(s: string) {
  return s
    .split(" ")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

const MAP_RECORDS: Sp[] = catalogRecords.map((species) => ({
  id: species.id,
  name: species.name,
  latinName: species.latinName,
  region: species.region,
  regions: getCatalogRegions(species),
  status: species.status,
  image: species.image,
}));

function getSpecies(prov: string): Sp[] {
  const region = getRegion(prov);
  if (region === "unknown") return [];
  return MAP_RECORDS.filter((sp) => sp.regions.includes(region));
}
function getTop(prov: string, n = 3): Sp[] {
  const ord: Record<string, number> = { kritis: 0, terancam: 1, rentan: 2 };
  return [...getSpecies(prov)]
    .sort((a, b) => {
      const aRank = a.status ? (ord[a.status] ?? 9) : 9;
      const bRank = b.status ? (ord[b.status] ?? 9) : 9;
      if (aRank !== bRank) return aRank - bRank;
      return a.name.localeCompare(b.name, "id");
    })
    .slice(0, n);
}

const MAP_W = 1000;
const MAP_H = 420;

export default function InteractiveMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [feats, setFeats] = useState<GeoFeat[]>([]);
  const [paths, setPaths] = useState<Record<string, string>>({});
  const [regMap, setRegMap] = useState<Record<string, string>>({});
  const [loadSt, setLoadSt] = useState<"loading" | "ok" | "err">("loading");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [centroids, setCentroids] = useState<Record<string, [number, number]>>(
    {},
  );

  const dragging = useRef(false);
  const drag0 = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const touchStart = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
  } | null>(null);
  const pinchDist0 = useRef<number | null>(null);

  // Keep refs in sync for use in non-reactive event handlers
  useEffect(() => {
    panRef.current = pan;
  }, [pan]);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  // Non-passive wheel + touch events
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.min(5, Math.max(1, z - e.deltaY * 0.001)));
    };
    const onTS = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          px: panRef.current.x,
          py: panRef.current.y,
        };
        pinchDist0.current = null;
      } else if (e.touches.length === 2) {
        pinchDist0.current = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        touchStart.current = null;
      }
    };
    const onTM = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchDist0.current !== null) {
        e.preventDefault();
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const ratio = d / pinchDist0.current;
        pinchDist0.current = d;
        setZoom((z) => Math.min(5, Math.max(1, z * ratio)));
      } else if (
        e.touches.length === 1 &&
        touchStart.current &&
        zoomRef.current >= 1.05
      ) {
        e.preventDefault();
        setPan({
          x:
            touchStart.current.px + e.touches[0].clientX - touchStart.current.x,
          y:
            touchStart.current.py + e.touches[0].clientY - touchStart.current.y,
        });
      }
    };
    const onTE = () => {
      touchStart.current = null;
      pinchDist0.current = null;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTS, { passive: false });
    el.addEventListener("touchmove", onTM, { passive: false });
    el.addEventListener("touchend", onTE);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTS);
      el.removeEventListener("touchmove", onTM);
      el.removeEventListener("touchend", onTE);
    };
  }, []);

  // Load GeoJSON
  useEffect(() => {
    fetch(GEO_URL)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        const features: GeoFeat[] = data.features ?? [];
        const fc: ExtendedFeatureCollection<
          ExtendedFeature<GeoGeometryObjects, Record<string, string>>
        > = {
          type: "FeatureCollection",
          features: features.map((f) => ({
            type: "Feature",
            properties: f.properties,
            geometry: f.geometry,
          })),
        };
        const proj = geoMercator().fitSize(
          [MAP_W, MAP_H],
          fc as GeoPermissibleObjects,
        );
        const gen = geoPath().projection(proj);
        const pm: Record<string, string> = {};
        const rm: Record<string, string> = {};
        const cm: Record<string, [number, number]> = {};
        features.forEach((f, i) => {
          const k = provKey(f.properties) || `feat_${i}`;
          const feat = {
            type: "Feature" as const,
            properties: f.properties,
            geometry: f.geometry,
          };
          const d = gen(feat);
          if (d) pm[k] = d;
          rm[k] = getRegion(k);
          const c = gen.centroid(feat);
          if (c && !isNaN(c[0]) && !isNaN(c[1])) cm[k] = c as [number, number];
        });
        setFeats(features);
        setPaths(pm);
        setRegMap(rm);
        setCentroids(cm);
        setLoadSt("ok");
      })
      .catch(() => setLoadSt("err"));
  }, []);

  const topSp = selected ? getTop(selected, 3) : [];
  const total = selected ? getSpecies(selected).length : 0;
  const selCfg = selected ? REGION_CFG[regMap[selected] ?? "unknown"] : null;

  const onEnter = useCallback(
    (f: GeoFeat, i: number, e: React.MouseEvent<SVGPathElement>) => {
      const k = provKey(f.properties) || `feat_${i}`;
      const all = getSpecies(k);
      setHovered(k);
      setTip({
        x: e.clientX,
        y: e.clientY,
        name: toTitle(k),
        region: regMap[k] ?? "unknown",
        count: all.length,
        topNames: all.slice(0, 3).map((s) => s.name),
      });
    },
    [regMap],
  );

  const onMove = useCallback((e: React.MouseEvent<SVGPathElement>) => {
    setTip((p) => (p ? { ...p, x: e.clientX, y: e.clientY } : null));
  }, []);
  const onLeave = useCallback(() => {
    setHovered(null);
    setTip(null);
  }, []);
  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const onClick = useCallback(
    (f: GeoFeat, i: number) => {
      const k = provKey(f.properties) || `feat_${i}`;
      if (!getSpecies(k).length) return;
      setSelected((prev) => {
        if (prev === k) {
          setZoom(1);
          setPan({ x: 0, y: 0 });
          return null;
        }
        const c = centroids[k];
        if (c) {
          const z = 1.6;
          setZoom(z);
          setPan({ x: -(c[0] - MAP_W / 2) * z, y: -(c[1] - MAP_H / 2) * z });
        }
        return k;
      });
    },
    [centroids],
  );

  const zoomIn = () => setZoom((z) => Math.min(z + 0.4, 5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.4, 1));
  const reset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelected(null);
  };

  const onMD = (e: React.MouseEvent) => {
    if (zoom < 1.05) return;
    dragging.current = true;
    setIsDragging(true);
    drag0.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
  };
  const onMM = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    setPan({
      x: drag0.current.px + e.clientX - drag0.current.mx,
      y: drag0.current.py + e.clientY - drag0.current.my,
    });
  };
  const onMU = () => {
    dragging.current = false;
    setIsDragging(false);
  };

  return (
    <div
      className="rounded-3xl overflow-hidden w-full"
      style={{
        border: "2px solid var(--border-hard)",
        boxShadow: "6px 6px 0px var(--border-hard)",
      }}
    >
      {/* ════ DESKTOP: side by side | MOBILE: map then bottom sheet ════ */}
      <div className="flex flex-col lg:flex-row">
        {/* ══ MAP AREA ══ */}
        <div
          ref={wrapRef}
          className="relative flex-1 overflow-hidden"
          style={{
            background: "linear-gradient(155deg,#E8F5E9 0%,#C8E6C9 100%)",
            minHeight: "clamp(180px, 44vw, 360px)",
            paddingTop: "clamp(36px, 3vw, 24px)",
          }}
        >
          {/* Hint */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.88)",
                border: "1px solid rgba(0,0,0,0.07)",
                color: "var(--text-secondary)",
                backdropFilter: "blur(6px)",
              }}
            >
              {zoom > 1
                ? "✋ Geser · Cubit zoom"
                : "👆 Klik untuk melihat cakupan wilayah."}
            </span>
          </div>

          {/* Zoom controls */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
            {[
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
            ].map((b) => (
              <button
                key={b.title}
                title={b.title}
                onClick={b.fn}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1.5px solid var(--border-light)",
                  color: "var(--text-secondary)",
                  backdropFilter: "blur(6px)",
                  transition: "all 0.12s",
                }}
                onMouseEnter={(e) => {
                  const t = e.currentTarget;
                  t.style.background = "var(--pg-accent)";
                  t.style.color = "white";
                  t.style.borderColor = "var(--pg-accent)";
                }}
                onMouseLeave={(e) => {
                  const t = e.currentTarget;
                  t.style.background = "rgba(255,255,255,0.9)";
                  t.style.color = "var(--text-secondary)";
                  t.style.borderColor = "var(--border-light)";
                }}
              >
                {b.icon}
              </button>
            ))}
          </div>

          {/* Legend — sm+ overlay */}
          <div
            className="absolute bottom-3 left-3 z-10 p-3 rounded-2xl pointer-events-none hidden sm:block"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(0,0,0,0.07)",
              backdropFilter: "blur(10px)",
            }}
          >
            <p
              className="text-[9px] font-bold uppercase tracking-widest mb-2"
              style={{ color: "var(--text-faint)" }}
            >
              Wilayah
            </p>
            <div className="space-y-1.5">
              {Object.entries(REGION_CFG)
                .filter(([k]) => k !== "unknown")
                .map(([k, c]) => (
                  <div key={k} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{
                        background: c.fill,
                        border: `1px solid ${c.stroke}`,
                      }}
                    />
                    <span
                      className="text-[10px] leading-none"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {c.label}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Loading */}
          <AnimatePresence>
            {loadSt === "loading" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20"
                style={{
                  background: "linear-gradient(155deg,#E8F5E9 0%,#C8E6C9 100%)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-full border-[3px] animate-spin"
                  style={{
                    borderColor: "var(--pg-accent-light)",
                    borderTopColor: "var(--pg-accent)",
                  }}
                />
                <p
                  className="text-xs font-semibold"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Memuat peta…
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {loadSt === "err" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Gagal memuat peta.
              </p>
              <button
                onClick={() => {
                  setLoadSt("loading");
                  setFeats([]);
                  setPaths({});
                }}
                className="btn-candy text-xs py-2 px-4"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* SVG Map */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full block"
            style={{
              cursor: isDragging ? "grabbing" : zoom > 1 ? "grab" : "crosshair",
              userSelect: "none",
              touchAction: "none",
            }}
            onMouseDown={onMD}
            onMouseMove={onMM}
            onMouseUp={onMU}
            onMouseLeave={() => {
              onMU();
              onLeave();
            }}
          >
            <defs>
              <filter id="map-sh" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="1.5"
                  stdDeviation="2.5"
                  floodOpacity="0.16"
                />
              </filter>
            </defs>
            <g
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px,${pan.y / zoom}px)`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.15s ease-out",
              }}
            >
              {feats.map((f, i) => {
                const k = provKey(f.properties) || `feat_${i}`;
                const d = paths[k];
                if (!d) return null;
                const cfg = REGION_CFG[regMap[k] ?? "unknown"];
                const isH = hovered === k;
                const isS = selected === k;
                const hasSp = getSpecies(k).length > 0;
                const dim = selected !== null && !isS;
                return (
                  <path
                    key={i}
                    d={d}
                    fill={isS ? cfg.fillSel : isH ? cfg.fillHover : cfg.fill}
                    stroke="white"
                    strokeWidth={isS ? 2 : isH ? 1.5 : 0.7}
                    strokeLinejoin="round"
                    filter={isH || isS ? "url(#map-sh)" : "none"}
                    opacity={dim ? 0.28 : 1}
                    style={{
                      cursor: hasSp ? "pointer" : "default",
                      transition: "fill 0.1s,opacity 0.12s,stroke-width 0.1s",
                    }}
                    onMouseEnter={(e) => onEnter(f, i, e)}
                    onMouseMove={onMove}
                    onMouseLeave={onLeave}
                    onClick={() => onClick(f, i)}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* ══ DESKTOP SIDEBAR (lg+) ══ */}
        <AnimatePresence>
          {selected && (
            <motion.aside
              key="desktop-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="hidden lg:flex flex-shrink-0 overflow-hidden flex-col"
              style={{
                borderLeft: "2px solid var(--border-hard)",
                background: "#fafaf8",
              }}
            >
              <SpeciesPanel
                selected={selected}
                total={total}
                topSp={topSp}
                selCfg={selCfg}
                onClose={() => {
                  setSelected(null);
                  resetView();
                }}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ══ Mobile legend grid (sm and below) ══ */}
      <div
        className="sm:hidden px-4 pt-2.5 pb-3"
        style={{
          borderTop: "1px solid var(--border-light)",
          background: "rgba(255,255,255,0.97)",
        }}
      >
        <span
          className="text-[9px] font-bold uppercase tracking-widest block mb-2"
          style={{ color: "var(--text-faint)" }}
        >
          Wilayah
        </span>
        <div className="grid grid-cols-3 gap-x-3 gap-y-2">
          {Object.entries(REGION_CFG)
            .filter(([k]) => k !== "unknown")
            .map(([k, c]) => (
              <div key={k} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{
                    background: c.fill,
                    border: `1px solid ${c.stroke}`,
                  }}
                />
                <span
                  className="text-[10px] leading-tight"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {c.label}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* ══ MOBILE BOTTOM SHEET (below lg) ══ */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="mobile-sheet"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden"
            style={{ borderTop: "2px solid var(--border-hard)" }}
          >
            <SpeciesPanel
              selected={selected}
              total={total}
              topSp={topSp}
              selCfg={selCfg}
              onClose={() => {
                setSelected(null);
                resetView();
              }}
              mobile
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ TOOLTIP ══ */}
      <AnimatePresence>
        {tip && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, scale: 0.52, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.09 }}
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: tip.x + 14,
              top: tip.y,
              transform: "translateY(-50%)",
            }}
          >
            <div
              className="rounded-2xl p-3.5 min-w-[176px] max-w-[215px]"
              style={{
                background: "rgba(255,255,255,0.98)",
                border: "2px solid var(--border-hard)",
                boxShadow: "4px 4px 0px var(--border-hard)",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: REGION_CFG[tip.region]?.dot ?? "#888" }}
                />
                <span
                  className="font-bold text-sm leading-tight"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--text-primary)",
                  }}
                >
                  {tip.name}
                </span>
              </div>
              <p
                className="text-[11px] mb-2 pl-[18px]"
                style={{ color: "var(--text-muted)" }}
              >
                {REGION_CFG[tip.region]?.label ?? "—"}
              </p>
              <div
                style={{
                  borderTop: "1px solid var(--border-light)",
                  marginBottom: "0.5rem",
                }}
              />
              {tip.count > 0 ? (
                <>
                  <p
                    className="text-[11px] font-bold mb-1.5"
                    style={{ color: "var(--pg-accent-dark)" }}
                  >
                    {tip.count} rekaman biodiversitas wilayah
                  </p>
                  <ul className="space-y-1">
                    {tip.topNames.map((n, i) => (
                      <li
                        key={`${n}-${i}`}
                        className="flex items-start gap-1.5 text-[11px]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span
                          className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: "var(--pg-accent)" }}
                        />
                        {n}
                      </li>
                    ))}
                  </ul>
                  {tip.count > 3 && (
                    <p
                      className="text-[10px] mt-1.5 pl-[10px]"
                      style={{ color: "var(--text-faint)" }}
                    >
                      +{tip.count - 3} lainnya
                    </p>
                  )}
                  <p
                    className="text-[10px] mt-2 font-bold"
                    style={{ color: "var(--pg-accent)" }}
                  >
                    Klik untuk membuka sorotan wilayah →
                  </p>
                </>
              ) : (
                <p
                  className="text-[11px]"
                  style={{ color: "var(--text-faint)" }}
                >
                  Belum ada data
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SpeciesPanel — shared between desktop & mobile
// ═══════════════════════════════════════════════════
interface PanelProps {
  selected: string;
  total: number;
  topSp: Sp[];
  selCfg: (typeof REGION_CFG)[string] | null;
  onClose: () => void;
  mobile?: boolean;
}

function SpeciesPanel({
  selected,
  total,
  topSp,
  selCfg,
  onClose,
  mobile = false,
}: PanelProps) {
  const cfg = selCfg ?? REGION_CFG.unknown;

  return (
    <div
      className={`flex flex-col ${mobile ? "w-full" : "w-[300px] h-full"}`}
      style={{ minHeight: mobile ? 0 : 260, maxHeight: mobile ? "none" : 520 }}
    >
      {/* ── Header ── */}
      <div
        className="relative px-5 pt-5 pb-4 flex-shrink-0 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${cfg.accentLight} 0%, white 100%)`,
          borderBottom: "2px solid var(--border-hard)",
        }}
      >
        {/* Decorative circle */}
        <div
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 pointer-events-none"
          style={{ background: cfg.accent }}
        />

        <div className="flex items-start justify-between relative">
          <div className="flex-1 min-w-0 pr-3">
            {/* Region badge */}
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2"
              style={{
                background: cfg.fill,
                color: "white",
                border: `1px solid ${cfg.stroke}`,
              }}
            >
              <MapPin className="w-2.5 h-2.5" />
              {cfg.label}
            </span>

            {/* Province name */}
            <h3
              className="font-extrabold text-xl leading-tight"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              {toTitle(selected)}
            </h3>

            <div className="flex items-center gap-2 mt-2">
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{ background: cfg.accent, color: "white" }}
              >
                <Leaf className="w-3 h-3" />
                <span className="text-xs font-bold">{total} rekaman wilayah</span>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              background: "rgba(0,0,0,0.06)",
              color: "var(--text-muted)",
              transition: "all 0.12s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.14)";
              e.currentTarget.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.06)";
              e.currentTarget.style.transform = "rotate(0deg)";
            }}
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ── Species list ── */}
      <div
        className={`flex-1 p-4 space-y-3 ${mobile ? "" : "overflow-y-auto"}`}
        style={{ overscrollBehavior: "contain", background: "#fafaf8" }}
      >
        {total > 3 && (
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--text-faint)" }}
          >
            Sorotan dari {total} rekaman wilayah
          </p>
        )}

        {topSp.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Belum ada data
            </p>
          </div>
        ) : (
          topSp.map((sp, idx) => {
            const sc = sp.status ? STATUS_CFG[sp.status] : null;
            return (
              <motion.div
                key={sp.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: idx * 0.07,
                  duration: 0.22,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <Link
                  href={`/species/${sp.id}`}
                  className="group flex items-center gap-3 p-3 rounded-2xl"
                  style={{
                    background: "white",
                    border: "1.5px solid #e8e8e4",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = cfg.accent;
                    e.currentTarget.style.boxShadow = `0 4px 16px ${cfg.accent}22, 0 1px 3px rgba(0,0,0,0.08)`;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e8e8e4";
                    e.currentTarget.style.boxShadow =
                      "0 1px 3px rgba(0,0,0,0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Image */}
                  <div
                    className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                    style={{
                      border: `2px solid ${cfg.accentLight}`,
                      boxShadow: `0 2px 8px ${cfg.accent}20`,
                    }}
                  >
                    <Image
                      src={resolveSpeciesImage(sp.image)}
                      alt={sp.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    {/* Rank badge */}
                    <div
                      className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
                      style={{ background: cfg.accent, color: "white" }}
                    >
                      {idx + 1}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-bold truncate leading-snug"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {sp.name}
                    </p>
                    <p
                      className="text-[10px] italic truncate mb-1.5 mt-0.5"
                      style={{
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {sp.latinName}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {sc && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: sc.bg,
                            color: sc.text,
                            border: `1px solid ${sc.border}`,
                          }}
                        >
                          <span style={{ fontSize: 8 }}>{sc.emoji}</span>
                          {sc.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    className="w-4 h-4 flex-shrink-0 transition-all duration-150"
                    style={{ color: cfg.accent, opacity: 0.4 }}
                  />
                </Link>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ── Footer CTA ── */}
      {total > 0 && (
        <div
          className="p-4 flex-shrink-0"
          style={{
            borderTop: "2px solid var(--border-hard)",
            background: "white",
          }}
        >
          <Link
            href={`/species?province=${encodeURIComponent(selected)}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold transition-all"
            style={{
              background: `linear-gradient(135deg, ${cfg.accent} 0%, ${cfg.dot} 100%)`,
              color: "white",
              boxShadow: `0 4px 14px ${cfg.accent}50`,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = `0 6px 20px ${cfg.accent}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 14px ${cfg.accent}50`;
            }}
          >
            {total > 3
              ? `Lihat Semua ${total} Spesies`
              : "Lihat Detail Spesies"}
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      )}
    </div>
  );
}
