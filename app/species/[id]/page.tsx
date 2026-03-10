import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Users,
  AlertTriangle,
  Shield,
  Eye,
  Leaf,
  ExternalLink,
  ChevronRight,
  Zap,
} from "lucide-react";
import speciesData from "@/data/species.json";

// ============================================
// TYPES
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

// ============================================
// STATIC PARAMS
// ============================================
export async function generateStaticParams() {
  return speciesData.map((s) => ({ id: s.id }));
}

// ============================================
// METADATA
// ============================================
export async function generateMetadata({ params }: { params: any }) {
  const { id } = (await params) as { id: string };
  const species = speciesData.find((s) => s.id === id) as Species | undefined;
  if (!species) return { title: "Spesies tidak ditemukan" };
  return {
    title: `${species.name} — ${species.latinName}`,
    description: species.description.substring(0, 160),
  };
}

// ============================================
// STATUS CONFIG
// ============================================
const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
    desc: string;
  }
> = {
  kritis: {
    label: "Kritis (CR)",
    color: "#C0392B",
    bg: "rgba(192,57,43,0.1)",
    border: "rgba(192,57,43,0.25)",
    icon: <AlertTriangle className="w-4 h-4" />,
    desc: "Menghadapi risiko kepunahan yang sangat tinggi di alam liar",
  },
  terancam: {
    label: "Terancam (EN)",
    color: "#D35400",
    bg: "rgba(211,84,0,0.1)",
    border: "rgba(211,84,0,0.25)",
    icon: <Shield className="w-4 h-4" />,
    desc: "Menghadapi risiko kepunahan yang tinggi di alam liar",
  },
  rentan: {
    label: "Rentan (VU)",
    color: "#B7950B",
    bg: "rgba(183,149,11,0.1)",
    border: "rgba(183,149,11,0.25)",
    icon: <Eye className="w-4 h-4" />,
    desc: "Menghadapi risiko kepunahan yang cukup tinggi di alam liar",
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
// DETAIL PAGE
// ============================================
export default async function SpeciesDetailPage({ params }: { params: any }) {
  const { id } = (await params) as { id: string };
  const species = speciesData.find((s) => s.id === id) as Species | undefined;

  if (!species) notFound();

  const statusCfg = STATUS_CONFIG[species.status];

  const related = speciesData
    .filter((s) => s.region === species.region && s.id !== species.id)
    .slice(0, 3) as Species[];

  return (
    <div className="min-h-screen pt-20" style={{ background: "var(--bg-base)" }}>
      {/* ==================== HERO IMAGE ==================== */}
      <div className="relative h-[55vh] min-h-[380px] max-h-[560px] overflow-hidden">
        <Image
          src={species.image}
          alt={species.name}
          fill
          priority
          className="object-cover"
        />
        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(26,46,26,0.85) 0%, rgba(26,46,26,0.4) 50%, transparent 100%)",
          }}
        />

        {/* Back button */}
        <div className="absolute top-6 left-0 right-0">
          <div className="container-main px-4">
            <Link
              href="/species"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
              }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Kembali ke Direktori
            </Link>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 pb-10">
          <div className="container-main px-4">
            {/* Type + Region badges */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                {species.type}
              </span>
              <span
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <MapPin className="w-3 h-3" />
                {REGION_LABELS[species.region]}
              </span>
            </div>

            {/* Name */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-1 leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {species.name}
            </h1>
            <p className="text-white/60 text-lg italic mb-4">{species.latinName}</p>

            {/* Status badge */}
            {statusCfg && (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-sm"
                style={{
                  backgroundColor: statusCfg.bg,
                  borderColor: statusCfg.border,
                  color: statusCfg.color,
                }}
              >
                {statusCfg.icon}
                <span className="font-semibold text-sm">{statusCfg.label}</span>
                <span className="text-xs opacity-70">— {statusCfg.desc}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== CONTENT ==================== */}
      <div className="container-main px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== MAIN CONTENT (2/3) ===== */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div
              className="p-6 rounded-2xl animate-fade-up"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
              }}
            >
              <h2
                className="text-xl font-bold mb-4"
                style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
              >
                Tentang {species.name}
              </h2>
              <p className="leading-relaxed text-sm" style={{ color: "var(--text-secondary)" }}>
                {species.description}
              </p>
            </div>

            {/* Fun Fact */}
            <div
              
              
              
              className="p-6 rounded-2xl border relative overflow-hidden"
              style={{
                backgroundColor: `${species.color}08`,
                borderColor: `${species.color}20`,
              }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
                style={{
                  background: `radial-gradient(circle, ${species.color}, transparent)`,
                }}
              />
              <div className="relative flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${species.color}20` }}
                >
                  <Zap className="w-4 h-4" style={{ color: species.color }} />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{ color: species.color }}
                  >
                    Fakta Unik
                  </p>
                  <p
                    className="text-sm leading-relaxed font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {species.funFact}
                  </p>
                </div>
              </div>
            </div>

            {/* Threat Section */}
            <div
              
              
              
              className="p-6 rounded-2xl"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--status-cr-border)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--status-cr-bg)" }}
                >
                  <AlertTriangle className="w-4 h-4" style={{ color: "var(--status-cr)" }} />
                </div>
                <h2
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
                >
                  Ancaman yang Dihadapi
                </h2>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {species.threat}
              </p>
            </div>

            {/* Action CTA */}
            <div
              
              
              
              className="p-6 rounded-2xl"
              style={{
                background: "var(--green-50)",
                border: "1px solid var(--green-200)",
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--green-100)" }}
                >
                  <Leaf className="w-4 h-4" style={{ color: "var(--green-600)" }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold mb-1"
                    style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
                  >
                    Apa yang Bisa Kamu Lakukan?
                  </h2>
                  <p className="text-xs" style={{ color: "var(--green-600)" }}>
                    Setiap tindakan kecilmu berarti besar bagi kelangsungan hidup mereka
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                {species.action}
              </p>
              <a
                href="https://www.wwf.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: "var(--green-500)",
                  color: "white",
                }}
              >
                <ExternalLink className="w-4 h-4" />
                Kunjungi WWF Indonesia
              </a>
            </div>
          </div>

          {/* ===== SIDEBAR (1/3) ===== */}
          <div className="space-y-5">
            {/* Info Cards */}
            {[
              {
                icon: <Users className="w-4 h-4" />,
                label: "Estimasi Populasi",
                value: species.population,
                color: species.color,
              },
              {
                icon: <MapPin className="w-4 h-4" />,
                label: "Habitat",
                value: species.habitat,
                color: "#3498DB",
              },
              {
                icon: <Leaf className="w-4 h-4" />,
                label: "Wilayah",
                value: REGION_LABELS[species.region],
                color: "var(--green-500)",
              },
            ].map((item) => (
              <div
                key={item.label}
                
                
                className="p-5 rounded-2xl"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    {item.label}
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-primary)" }}>
                  {item.value}
                </p>
              </div>
            ))}

            {/* Source */}
            <div
              
              
              
              className="p-5 rounded-2xl"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
              }}
            >
              <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: "var(--text-muted)" }}>
                Sumber Data
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {species.source}
              </p>
              <a
                href="https://iucnredlist.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs mt-2 hover:underline"
                style={{ color: "var(--green-500)" }}
              >
                IUCN Red List <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Navigation */}
            <div
              
              
              
              className="p-5 rounded-2xl"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
              }}
            >
              <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: "var(--text-muted)" }}>
                Spesies Lainnya
              </p>
              <Link
                href="/species"
                className="flex items-center justify-between text-sm font-medium transition-all duration-200 group"
                style={{ color: "var(--green-500)" }}
              >
                Lihat semua direktori
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ==================== RELATED SPECIES ==================== */}
        {related.length > 0 && (
          <div
            
            
            
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--green-500)" }}>
                  Wilayah yang Sama
                </p>
                <h2
                  className="text-3xl font-bold"
                  style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
                >
                  Spesies dari {REGION_LABELS[species.region]}
                </h2>
              </div>
              <Link
                href={`/species?region=${species.region}`}
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium transition-all group"
                style={{ color: "var(--green-500)" }}
              >
                Lihat semua
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/species/${rel.id}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-light)",
                  }}
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm transition-colors truncate"
                      style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
                    >
                      <span className="group-hover:text-[var(--green-500)]">{rel.name}</span>
                    </p>
                    <p className="text-xs italic truncate" style={{ color: "var(--text-muted)" }}>
                      {rel.latinName}
                    </p>
                  </div>
                  <ChevronRight
                    className="w-4 h-4 flex-shrink-0 transition-colors"
                    style={{ color: "var(--text-faint)" }}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
