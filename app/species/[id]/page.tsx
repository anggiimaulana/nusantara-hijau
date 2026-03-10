import { notFound } from "next/navigation";
import Image from "next/image";
import ImageWithFallback from "@/components/ImageWithFallback";
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
// STATIC PARAMS (SSG — generate all detail pages at build time)
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
    color: "#E74C3C",
    bg: "rgba(231,76,60,0.1)",
    border: "rgba(231,76,60,0.25)",
    icon: <AlertTriangle className="w-4 h-4" />,
    desc: "Menghadapi risiko kepunahan yang sangat tinggi di alam liar",
  },
  terancam: {
    label: "Terancam (EN)",
    color: "#E67E22",
    bg: "rgba(230,126,34,0.1)",
    border: "rgba(230,126,34,0.25)",
    icon: <Shield className="w-4 h-4" />,
    desc: "Menghadapi risiko kepunahan yang tinggi di alam liar",
  },
  rentan: {
    label: "Rentan (VU)",
    color: "#F1C40F",
    bg: "rgba(241,196,15,0.1)",
    border: "rgba(241,196,15,0.25)",
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

  // Related species: same region, exclude current
  const related = speciesData
    .filter((s) => s.region === species.region && s.id !== species.id)
    .slice(0, 3) as Species[];

  return (
    <div className="min-h-screen pt-20">
      {/* ==================== HERO IMAGE ==================== */}
      <div className="relative h-[55vh] min-h-[380px] max-h-[560px] overflow-hidden">
        <ImageWithFallback
          src={species.image}
          alt={species.name}
          fill
          priority
          className="object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-0 right-0">
          <div className="section-container px-4">
            <Link
              href="/species"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white text-sm font-medium hover:bg-black/60 transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Kembali ke Direktori
            </Link>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 pb-10">
          <div className="section-container px-4">
            {/* Type + Region badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm text-white/70 border border-white/10 capitalize">
                {species.type}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm text-white/70 border border-white/10">
                <MapPin className="w-3 h-3" />
                {REGION_LABELS[species.region]}
              </span>
            </div>

            {/* Name */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-1 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {species.name}
            </h1>
            <p className="text-white/50 text-lg italic mb-4">
              {species.latinName}
            </p>

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
      <div className="section-container px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== MAIN CONTENT (2/3) ===== */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="p-6 rounded-2xl bg-[#0D1B2E] border border-white/6">
              <h2
                className="text-xl font-bold text-white mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Tentang {species.name}
              </h2>
              <p className="text-[#90A4AE] leading-relaxed text-sm">
                {species.description}
              </p>
            </div>

            {/* Fun Fact */}
            <div
              className="p-6 rounded-2xl border relative overflow-hidden"
              style={{
                backgroundColor: `${species.color}0D`,
                borderColor: `${species.color}25`,
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
                  <p className="text-white text-sm leading-relaxed font-medium">
                    {species.funFact}
                  </p>
                </div>
              </div>
            </div>

            {/* Threat Section */}
            <div className="p-6 rounded-2xl bg-[#0D1B2E] border border-[#E74C3C]/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#E74C3C]/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-[#E74C3C]" />
                </div>
                <h2
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Ancaman yang Dihadapi
                </h2>
              </div>
              <p className="text-[#90A4AE] text-sm leading-relaxed">
                {species.threat}
              </p>
            </div>

            {/* Action CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#2ECC71]/8 to-[#27AE60]/4 border border-[#2ECC71]/15">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#2ECC71]/15 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-4 h-4 text-[#2ECC71]" />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold text-white mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Apa yang Bisa Kamu Lakukan?
                  </h2>
                  <p className="text-[#2ECC71]/70 text-xs">
                    Setiap tindakan kecilmu berarti besar bagi kelangsungan
                    hidup mereka
                  </p>
                </div>
              </div>
              <p className="text-[#90A4AE] text-sm leading-relaxed mb-4">
                {species.action}
              </p>
              <a
                href="https://www.wwf.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2ECC71]/15 border border-[#2ECC71]/25 text-[#2ECC71] text-sm font-semibold hover:bg-[#2ECC71]/25 transition-all duration-200"
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
                color: "#2ECC71",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-2xl bg-[#0D1B2E] border border-white/6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${item.color}18`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span className="text-[#546E7A] text-xs font-medium uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
                <p className="text-white text-sm font-medium leading-relaxed">
                  {item.value}
                </p>
              </div>
            ))}

            {/* Source */}
            <div className="p-5 rounded-2xl bg-[#0D1B2E] border border-white/6">
              <p className="text-[#546E7A] text-xs uppercase tracking-widest mb-2 font-medium">
                Sumber Data
              </p>
              <p className="text-[#90A4AE] text-sm">{species.source}</p>
              <a
                href="https://iucnredlist.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#2ECC71] text-xs mt-2 hover:underline"
              >
                IUCN Red List <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Navigation between species */}
            <div className="p-5 rounded-2xl bg-[#0D1B2E] border border-white/6">
              <p className="text-[#546E7A] text-xs uppercase tracking-widest mb-3 font-medium">
                Spesies Lainnya
              </p>
              <Link
                href="/species"
                className="flex items-center justify-between text-[#2ECC71] text-sm font-medium hover:gap-2 transition-all duration-200 group"
              >
                Lihat semua direktori
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ==================== RELATED SPECIES ==================== */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[#2ECC71] text-xs font-semibold tracking-widest uppercase mb-1">
                  Wilayah yang Sama
                </p>
                <h2
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Spesies dari {REGION_LABELS[species.region]}
                </h2>
              </div>
              <Link
                href={`/species?region=${species.region}`}
                className="hidden sm:flex items-center gap-1.5 text-[#2ECC71] text-sm font-medium hover:gap-2.5 transition-all group"
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
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-white/6 bg-[#0D1B2E] hover:border-[#2ECC71]/20 hover:bg-[#2ECC71]/3 transition-all duration-300"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={rel.image}
                      alt={rel.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-white font-semibold text-sm group-hover:text-[#2ECC71] transition-colors truncate"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {rel.name}
                    </p>
                    <p className="text-[#546E7A] text-xs italic truncate">
                      {rel.latinName}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#546E7A] group-hover:text-[#2ECC71] flex-shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
