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
import { motion, AnimatePresence } from "framer-motion";
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

// Premium 3D color palette with depth
const REGION_CFG: Record<
  string,
  {
    base: string;
    light: string;
    shadow: string;
    hover: string;
    active: string;
    hasSpecies: string;
    gradient: string;
  }
> = {
  sumatera: {
    base: "#4CAF50",
    light: "#81C784",
    shadow: "#2E7D32",
    hover: "#66BB6A",
    active: "#388E3C",
    hasSpecies: "#2E7D32",
    gradient: "linear-gradient(135deg, #66BB6A 0%, #4CAF50 50%, #388E3C 100%)",
  },
  kalimantan: {
    base: "#8BC34A",
    light: "#AED581",
    shadow: "#558B2F",
    hover: "#9CCC65",
    active: "#689F38",
    hasSpecies: "#558B2F",
    gradient: "linear-gradient(135deg, #9CCC65 0%, #8BC34A 50%, #689F38 100%)",
  },
  jawa: {
    base: "#CDDC39",
    light: "#DCE775",
    shadow: "#AFB42B",
    hover: "#D4E157",
    active: "#C0CA33",
    hasSpecies: "#9E9D24",
    gradient: "linear-gradient(135deg, #D4E157 0%, #CDDC39 50%, #AFB42B 100%)",
  },
  sulawesi: {
    base: "#26A69A",
    light: "#4DB6AC",
    shadow: "#00695C",
    hover: "#26C6DA",
    active: "#00838F",
    hasSpecies: "#00695C",
    gradient: "linear-gradient(135deg, #4DB6AC 0%, #26A69A 50%, #00897B 100%)",
  },
  papua: {
    base: "#66BB6A",
    light: "#81C784",
    shadow: "#1B5E20",
    hover: "#4CAF50",
    active: "#2E7D32",
    hasSpecies: "#1B5E20",
    gradient: "linear-gradient(135deg, #81C784 0%, #66BB6A 50%, #4CAF50 100%)",
  },
  "bali-nusra": {
    base: "#AED581",
    light: "#C5E1A5",
    shadow: "#7CB342",
    hover: "#C5E1A5",
    active: "#8BC34A",
    hasSpecies: "#558B2F",
    gradient: "linear-gradient(135deg, #C5E1A5 0%, #AED581 50%, #9CCC65 100%)",
  },
  unknown: {
    base: "#E0E0E0",
    light: "#F5F5F5",
    shadow: "#BDBDBD",
    hover: "#EEEEEE",
    active: "#BDBDBD",
    hasSpecies: "#9E9E9E",
    gradient: "linear-gradient(135deg, #EEEEEE 0%, #E0E0E0 100%)",
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 860, h: 430 });
  const [feats, setFeats] = useState<GeoFeat[]>([]);
  const [paths, setPaths] = useState<Record<string, string>>({});
  const [featRegion, setFeatRegion] = useState<Record<string, string | null>>(
    {},
  );
  const [status, setStatus] = useState<"loading" | "ok" | "err">("loading");

  const [hovered, setHovered] = useState<string | null>(null);
  const [selProv, setSelProv] = useState<string | null>(null);
  const [tip, setTip] = useState<TooltipSt | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const drag0 = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  // 3D tilt effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mapContainerRef.current) return;
      const rect = mapContainerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: y * 8, y: -x * 8 }); // Max 8 degrees tilt
    };

    const container = mapContainerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Responsive
  useEffect(() => {
    const upd = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.clientWidth;
      setDims({ w, h: Math.round(Math.max(320, w * 0.5)) });
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

  const sidebarSpecies: Sp[] = selProv ? getSpeciesForProvince(selProv) : [];
  const selRegion = selProv ? (featRegion[selProv] ?? null) : null;

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

  const onMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setTip((p) => (p ? { ...p, x: e.clientX, y: e.clientY } : null));
  }, []);

  const onLeave = useCallback(() => {
    setHovered(null);
    setTip(null);
  }, []);

  const onClick = useCallback((f: GeoFeat, i: number) => {
    const nm = provName(f.properties) || `feat_${i}`;
    const sps = getSpeciesForProvince(nm);
    if (sps.length === 0) return;
    setSelProv((p) => (p === nm ? null : nm));
  }, []);

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

  const getProvFill = (nm: string, isHov: boolean, isSel: boolean) => {
    const reg = featRegion[nm] ?? null;
    const cfg = reg
      ? (REGION_CFG[reg] ?? REGION_CFG.unknown)
      : REGION_CFG.unknown;
    const hasSp = getSpeciesForProvince(nm).length > 0;

    if (isSel) return cfg.active;
    if (isHov) return cfg.hover;
    if (hasSp) return cfg.hasSpecies;
    return cfg.base;
  };

  // 3D transform style
  const map3DStyle = {
    transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
    transformOrigin: "center center",
    transition: dragging.current ? "none" : "transform 0.3s ease-out",
  };

  return (
    <div className="flex gap-5 items-start flex-col xl:flex-row">
      {/* ══════════ MAP ══════════ */}
      <div
        ref={wrapRef}
        className="relative flex-1 rounded-2xl overflow-hidden"
        style={{
          border: "1px solid var(--border-light)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.5) inset",
          background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)",
          cursor: zoom > 1 ? "grab" : "default",
          userSelect: "none",
          minHeight: 320,
        }}
      >
        {/* Premium 3D Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(144,202,249,0.3) 0%, transparent 50%),
              linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)
            `,
          }}
        />

        {/* Ocean texture pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <defs>
            <pattern id="oceanGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#64B5F6" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#oceanGrid)"/>
        </svg>

        {/* Loading */}
        <AnimatePresence>
          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20"
              style={{
                background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
              }}
            >
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
                className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-500"
              />
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Memuat peta Indonesia…
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {status === "err" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20"
              style={{ background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)" }}
            >
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Gagal memuat peta.
              </p>
              <button
                onClick={() => {
                  setStatus("loading");
                  setFeats([]);
                  setPaths({});
                }}
                className="btn-outline text-xs py-2 px-5 rounded-full"
              >
                Coba Lagi
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom controls - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 right-4 z-10 flex flex-col gap-2"
        >
          {([
            { icon: <ZoomIn className="w-4 h-4" />, fn: zoomIn, title: "Zoom in" },
            { icon: <ZoomOut className="w-4 h-4" />, fn: zoomOut, title: "Zoom out" },
            { icon: <RotateCcw className="w-4 h-4" />, fn: reset, title: "Reset" },
          ] as const).map((b, i) => (
            <motion.button
              key={b.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ scale: 1.1, backgroundColor: "var(--green-50)" }}
              whileTap={{ scale: 0.95 }}
              title={b.title}
              onClick={b.fn}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all glass-strong"
              style={{
                color: "var(--text-secondary)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              {b.icon}
            </motion.button>
          ))}
        </motion.div>

        {/* Legend - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-4 left-4 z-10 p-4 rounded-2xl hidden sm:block glass-card max-w-[200px]"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
            Wilayah
          </p>
          <div className="space-y-2">
            {Object.entries(REGION_LABEL).map(([k, lbl]) => {
              const count = (speciesData as Sp[]).filter(
                (s) => s.region === k,
              ).length;
              return (
                <div key={k} className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 rounded-md flex-shrink-0 shadow-sm"
                    style={{
                      background: REGION_CFG[k].gradient,
                      boxShadow: `0 2px 4px ${REGION_CFG[k].shadow}40`,
                    }}
                  />
                  <span className="text-[11px] font-medium flex-1" style={{ color: "var(--text-secondary)" }}>
                    {lbl}
                  </span>
                  <span className="text-[10px] tabular-nums font-semibold" style={{ color: "var(--text-muted)" }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute top-4 left-4 z-10"
        >
          <span
            className="text-[11px] px-3 py-1.5 rounded-full font-medium glass"
            style={{ color: "var(--text-secondary)" }}
          >
            {zoom > 1
              ? "Drag untuk menggeser · Scroll untuk zoom"
              : "Hover untuk 3D effect · Klik provinsi untuk detail"}
          </span>
        </motion.div>

        {/* 3D Map Container */}
        <div
          ref={mapContainerRef}
          className="relative w-full h-full"
          style={{ perspective: "1200px" }}
        >
          <svg
            width={dims.w}
            height={dims.h}
            className="block mx-auto"
            style={map3DStyle}
            onMouseDown={onMDown}
            onMouseMove={onMMove}
            onMouseUp={onMUp}
            onMouseLeave={() => {
              onMUp();
              onLeave();
            }}
            onWheel={onWheel}
          >
            <defs>
              {/* 3D elevation filter */}
              <filter id="elevation" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
                <feOffset in="blur" dx="1" dy="2" result="offsetBlur"/>
                <feComponentTransfer in="offsetBlur" result="shadowMatrix">
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="shadowMatrix"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* Inner shadow for 3D effect */}
              <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                <feOffset dx="-1" dy="-1"/>
                <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.3 0"/>
              </filter>

              {/* Gradients for each region */}
              {Object.entries(REGION_CFG).map(([key, cfg]) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={cfg.light} />
                  <stop offset="50%" stopColor={cfg.base} />
                  <stop offset="100%" stopColor={cfg.shadow} />
                </linearGradient>
              ))}
            </defs>

            {/* Ocean background */}
            <rect width={dims.w} height={dims.h} fill="transparent" />

            {/* Province paths with 3D effect */}
            <g>
              {feats.map((f, i) => {
                const nm = provName(f.properties) || `feat_${i}`;
                const d = paths[nm];
                if (!d) return null;

                const isHov = hovered === nm;
                const isSel = selProv === nm;
                const reg = featRegion[nm] ?? "unknown";
                const cfg = REGION_CFG[reg] ?? REGION_CFG.unknown;
                const hasSp = getSpeciesForProvince(nm).length > 0;
                const dim = selProv !== null && !isSel && reg !== "unknown";

                return (
                  <motion.path
                    key={i}
                    d={d}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: dim ? 0.3 : 1,
                      scale: isSel ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.3, delay: i * 0.01 }}
                    fill={`url(#grad-${reg})`}
                    stroke="white"
                    strokeWidth={isSel ? 2 / zoom : 1 / zoom}
                    filter={isHov || isSel ? "url(#elevation)" : "none"}
                    style={{
                      cursor: hasSp ? "pointer" : "default",
                      transformOrigin: "center",
                    }}
                    onMouseEnter={(e) => onEnter(f, i, e)}
                    onMouseMove={onMove}
                    onMouseLeave={onLeave}
                    onClick={() => onClick(f, i)}
                    whileHover={hasSp ? {
                      scale: 1.02,
                      filter: "url(#elevation)",
                      transition: { duration: 0.2 },
                    } : {}}
                  />
                );
              })}
            </g>

            {/* Zoom indicator */}
            {zoom > 1 && (
              <text
                x={dims.w - 12}
                y={dims.h - 12}
                textAnchor="end"
                fill="rgba(46,125,50,0.5)"
                fontSize={11}
                fontFamily="var(--font-inter), system-ui"
                fontWeight={600}
              >
                {zoom.toFixed(1)}×
              </text>
            )}
          </svg>
        </div>
      </div>

      {/* ══════════ SIDEBAR ══════════ */}
      <AnimatePresence>
        {selProv && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex-shrink-0 w-full xl:w-80"
          >
            <div
              className="rounded-2xl overflow-hidden flex flex-col glass-card"
              style={{
                maxHeight: Math.max(dims.h, 400),
              }}
            >
              {/* Header */}
              <div
                className="p-5 flex-shrink-0"
                style={{ borderBottom: "1px solid var(--border-light)" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="section-label mb-1" style={{ fontSize: "10px" }}>
                      Provinsi
                    </p>
                    <h3 className="font-bold text-lg leading-tight" style={{ color: "var(--text-primary)" }}>
                      {toTitleCase(selProv)}
                    </h3>
                    {selRegion && (
                      <span
                        className="inline-flex items-center gap-1.5 text-[11px] mt-2 px-3 py-1 rounded-full"
                        style={{
                          background: REGION_CFG[selRegion].gradient,
                          color: "white",
                          boxShadow: `0 2px 8px ${REGION_CFG[selRegion].shadow}50`,
                        }}
                      >
                        {REGION_LABEL[selRegion]}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelProv(null)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "var(--bg-muted)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
                <p className="text-sm mt-3" style={{ color: "var(--text-muted)" }}>
                  <span className="font-bold text-lg" style={{ color: "var(--green-500)" }}>
                    {sidebarSpecies.length}
                  </span>{" "}
                  spesies terdokumentasi
                </p>
              </div>

              {/* Species list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {sidebarSpecies.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      Belum ada data spesies
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
                      untuk provinsi ini
                    </p>
                  </div>
                ) : (
                  sidebarSpecies.map((sp, idx) => (
                    <motion.div
                      key={sp.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        href={`/species/${sp.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl transition-all group hover:shadow-md"
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
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                          <Image
                            src={sp.image}
                            alt={sp.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                            {sp.name}
                          </p>
                          <p className="text-[11px] italic truncate" style={{ color: "var(--text-muted)" }}>
                            {sp.latinName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                              style={{
                                color: STATUS_CLR[sp.status] || "var(--text-muted)",
                                background: `${STATUS_CLR[sp.status] || "#999"}15`,
                                border: `1px solid ${STATUS_CLR[sp.status] || "#999"}30`,
                              }}
                            >
                              {sp.status.charAt(0).toUpperCase() + sp.status.slice(1)}
                            </span>
                            {sp.provinceMain === selProv && (
                              <span
                                className="text-[9px] px-2 py-0.5 rounded-full"
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
                          className="w-4 h-4 flex-shrink-0 opacity-30 group-hover:opacity-100 transition-all group-hover:translate-x-1"
                          style={{ color: "var(--green-500)" }}
                        />
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {sidebarSpecies.length > 0 && selRegion && (
                <div
                  className="p-4 flex-shrink-0 space-y-2"
                  style={{ borderTop: "1px solid var(--border-light)" }}
                >
                  <Link
                    href={`/species?province=${encodeURIComponent(selProv)}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg"
                    style={{ background: "var(--green-500)", color: "white" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--green-600)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--green-500)")}
                  >
                    Lihat Semua Spesies
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ TOOLTIP ══════════ */}
      <AnimatePresence>
        {tip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: tip.x + 16,
              top: tip.y,
              transform: "translateY(-50%)",
            }}
          >
            <div className="glass-card rounded-xl p-4 min-w-[200px] shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: REGION_CFG[tip.region].base }}
                />
                <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                  {tip.prov}
                </span>
              </div>
              {tip.region !== "unknown" && (
                <p className="text-[11px] mb-2" style={{ color: "var(--text-muted)" }}>
                  {REGION_LABEL[tip.region]}
                </p>
              )}
              {tip.speciesCount > 0 ? (
                <div className="mt-2 pt-2" style={{ borderTop: "1px solid var(--border-light)" }}>
                  <p className="text-xs font-bold mb-1.5" style={{ color: "var(--green-500)" }}>
                    {tip.speciesCount} spesies terdokumentasi
                  </p>
                  <div className="space-y-0.5">
                    {tip.speciesNames.map((n) => (
                      <p key={n} className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        • {n}
                      </p>
                    ))}
                  </div>
                  {tip.speciesCount > 3 && (
                    <p className="text-[10px] mt-1.5" style={{ color: "var(--text-faint)" }}>
                      +{tip.speciesCount - 3} lainnya
                    </p>
                  )}
                  <p className="text-[10px] mt-2 font-semibold" style={{ color: "var(--green-400)" }}>
                    Klik untuk lihat detail →
                  </p>
                </div>
              ) : (
                <div className="mt-2 pt-2" style={{ borderTop: "1px solid var(--border-light)" }}>
                  <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                    Belum ada data spesies
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
