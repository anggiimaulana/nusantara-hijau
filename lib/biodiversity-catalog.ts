import publicCatalogData from "@/data/biodiversity/processed/public-catalog.generated.json";

export interface CatalogSpecies {
  id: string;
  name: string;
  latinName: string;
  region: string;
  regions: string[];
  type: "flora" | "fauna";
  status: string | null;
  statusEN: string | null;
  description: string;
  image: string | null;
  color: string | null;
  population: string | null;
  habitat: string | null;
  threat: string | null;
  action: string | null;
  funFact: string | null;
  source: string;
  sourceKey: string;
  sourceLabel: string;
  detailRich: boolean;
}

export const CATALOG_REGION_LABELS: Record<string, string> = {
  sumatera: "Sumatera",
  kalimantan: "Kalimantan",
  jawa: "Jawa",
  sulawesi: "Sulawesi",
  papua: "Papua",
  maluku: "Maluku",
  "bali-nusra": "Bali & Nusa Tenggara",
  nasional: "Nasional / Multiwilayah",
};

export const catalogRecords = publicCatalogData.records as CatalogSpecies[];

export function getCatalogRegions(species: CatalogSpecies): string[] {
  if (species.regions?.length) return species.regions;
  return species.region ? [species.region] : [];
}

export function getCatalogRegionText(species: CatalogSpecies): string {
  const regions = getCatalogRegions(species);

  if (!regions.length || regions.includes("nasional")) {
    return CATALOG_REGION_LABELS.nasional;
  }

  if (regions.length === 1) {
    return CATALOG_REGION_LABELS[regions[0]] ?? regions[0];
  }

  return regions.map((region) => CATALOG_REGION_LABELS[region] ?? region).join(", ");
}
