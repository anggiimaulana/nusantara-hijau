import SpeciesDetailClient from "@/components/SpeciesDetailClient";
import { catalogRecords, getCatalogRegions, type CatalogSpecies } from "@/lib/biodiversity-catalog";
import { notFound } from "next/navigation";

type SpeciesPageParams = Promise<{ id: string }>;

function getSpeciesById(id: string) {
  return catalogRecords.find((species) => species.id === id);
}

function getRelatedSpecies(species: CatalogSpecies) {
  const ownRegions = new Set(getCatalogRegions(species));

  const related = catalogRecords.filter((candidate) => {
    if (candidate.id === species.id) return false;

    const candidateRegions = getCatalogRegions(candidate);
    const sharesRegion = candidateRegions.some((region) => ownRegions.has(region));
    const sharesType = candidate.type === species.type;

    return sharesRegion || sharesType;
  });

  return related.slice(0, 4);
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
