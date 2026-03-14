import curatedSpeciesData from "@/data/species.json";

export interface CatalogSpecies {
  id: string;
  name: string;
  latinName: string;
  region: string;
  province: string[];
  provinceMain: string;
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

const curatedRecords = curatedSpeciesData as Array<{
  id: string;
  name: string;
  latinName: string;
  region: string;
  province: string[];
  provinceMain: string;
  type: "flora" | "fauna";
  status?: string;
  statusEN?: string;
  description: string;
  image?: string;
  color?: string;
  population?: string;
  habitat?: string;
  threat?: string;
  action?: string;
  funFact?: string;
  source?: string;
}>;

export const catalogRecords: CatalogSpecies[] = curatedRecords.map((record) => ({
  id: record.id,
  name: record.name,
  latinName: record.latinName,
  region: record.region,
  province: record.province,
  provinceMain: record.provinceMain,
  regions: record.region ? [record.region] : [],
  type: record.type,
  status: record.status ?? null,
  statusEN: record.statusEN ?? null,
  description: record.description,
  image: record.image ?? null,
  color: record.color ?? null,
  population: record.population ?? null,
  habitat: record.habitat ?? null,
  threat: record.threat ?? null,
  action: record.action ?? null,
  funFact: record.funFact ?? null,
  source: record.source ?? "IUCN Red List 2023",
  sourceKey: "curated",
  sourceLabel: "Kurasi NusantaraHijau",
  detailRich: true,
}));

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
