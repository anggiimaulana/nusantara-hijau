import SpeciesDetailClient from "@/components/SpeciesDetailClient";
import { catalogRecords, getCatalogRegions, type CatalogSpecies } from "@/lib/biodiversity-catalog";
import { notFound } from "next/navigation";

type SpeciesPageParams = Promise<{ id: string }>;

function getSpeciesById(id: string) {
  return catalogRecords.find((species) => species.id === id);
}

function getRelatedSpecies(species: CatalogSpecies) {
  const ownRegions = new Set(getCatalogRegions(species));

  // Sort candidates to prioritize regional matches
  const candidates = catalogRecords
    .filter((candidate) => candidate.id !== species.id)
    .map((candidate) => {
      const candidateRegions = getCatalogRegions(candidate);
      const sharesRegion = candidateRegions.some((region) => ownRegions.has(region));
      const sharesType = candidate.type === species.type;
      
      let score = 0;
      if (sharesRegion) score += 10;
      if (sharesType) score += 5;
      
      return { candidate, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return candidates.slice(0, 4).map(item => item.candidate);
}

export async function generateMetadata({ params }: { params: SpeciesPageParams }) {
  const { id } = await params;
  const species = getSpeciesById(id);

  if (!species) {
    return { title: "Spesies tidak ditemukan" };
  }

  return {
    title: `${species.name} — ${species.latinName}`,
    description: species.description.substring(0, 160),
  };
}

export default async function SpeciesDetailPage({ params }: { params: SpeciesPageParams }) {
  const { id } = await params;
  const species = getSpeciesById(id);

  if (!species) notFound();

  return <SpeciesDetailClient species={species} related={getRelatedSpecies(species)} />;
}
