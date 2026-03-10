import SpeciesDetailClient from "@/components/SpeciesDetailClient";
import speciesData from "@/data/species.json";
import { notFound } from "next/navigation";

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
type SpeciesPageParams = Promise<{ id: string }>;

// ============================================
// STATIC PARAMS
// ============================================
export async function generateStaticParams() {
  return speciesData.map((s) => ({ id: s.id }));
}

// ============================================
// METADATA
// ============================================
export async function generateMetadata({ params }: { params: SpeciesPageParams }) {
  const { id } = await params;
  const species = speciesData.find((s) => s.id === id) as Species | undefined;
  if (!species) return { title: "Spesies tidak ditemukan" };
  return {
    title: `${species.name} — ${species.latinName}`,
    description: species.description.substring(0, 160),
  };
}

// ============================================
// DETAIL PAGE
// ============================================
export default async function SpeciesDetailPage({ params }: { params: SpeciesPageParams }) {
  const { id } = await params;
  const species = speciesData.find((s) => s.id === id) as Species | undefined;

  if (!species) notFound();

  const related = speciesData
    .filter((s) => s.region === species.region && s.id !== species.id)
    .slice(0, 3) as Species[];

  return <SpeciesDetailClient species={species} related={related} />;
}
