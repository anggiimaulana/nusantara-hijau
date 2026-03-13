import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const rawDirPath = path.join(repoRoot, "data", "biodiversity", "raw", "gbif-indonesia-flora");
const processedDirPath = path.join(repoRoot, "data", "biodiversity", "processed");
const summaryPath = path.join(processedDirPath, "gbif-indonesia-flora-summary.generated.json");
const rawSummaryPath = path.join(rawDirPath, "summary.raw.json");
const rawSpeciesFacetPath = path.join(rawDirPath, "species-facets.raw.json");
const rawFamilyFacetPath = path.join(rawDirPath, "family-facets.raw.json");
const rawSamplePath = path.join(rawDirPath, "sample.raw.json");

const BASE_URL = "https://api.gbif.org/v1/occurrence/search?country=ID&taxonKey=6";

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "NusantaraHijauGBIFConnector/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`GBIF request failed (${response.status}) for ${url}`);
  }

  return response.json();
}

async function resolveSpeciesName(speciesKey) {
  const data = await fetchJson(`https://api.gbif.org/v1/species/${speciesKey}`);
  return {
    key: String(speciesKey),
    scientificName: data.scientificName ?? data.canonicalName ?? null,
    canonicalName: data.canonicalName ?? null,
    family: data.family ?? null,
    order: data.order ?? null,
    genus: data.genus ?? null,
    rank: data.rank ?? null,
    taxonomicStatus: data.taxonomicStatus ?? null,
  };
}

async function resolveFamilyName(familyKey) {
  const data = await fetchJson(`https://api.gbif.org/v1/species/${familyKey}`);
  return {
    key: String(familyKey),
    family: data.canonicalName ?? data.scientificName ?? null,
    order: data.order ?? null,
    rank: data.rank ?? null,
  };
}

function toSampleRecord(record) {
  return {
    gbifId: String(record.key),
    occurrenceId: record.occurrenceID ?? null,
    scientificName: record.scientificName ?? null,
    acceptedScientificName: record.acceptedScientificName ?? null,
    family: record.family ?? null,
    order: record.order ?? null,
    stateProvince: record.stateProvince ?? null,
    eventDate: record.eventDate ?? null,
    basisOfRecord: record.basisOfRecord ?? null,
    occurrenceStatus: record.occurrenceStatus ?? null,
    references: record.references ?? null,
  };
}

async function main() {
  const fetchedAt = new Date().toISOString();
  const [summaryData, speciesFacetData, familyFacetData, sampleData] = await Promise.all([
    fetchJson(`${BASE_URL}&limit=0`),
    fetchJson(`${BASE_URL}&limit=0&facet=speciesKey&facetLimit=20`),
    fetchJson(`${BASE_URL}&limit=0&facet=familyKey&facetLimit=20`),
    fetchJson(`${BASE_URL}&limit=10`),
  ]);

  const speciesFacet = speciesFacetData.facets?.[0]?.counts ?? [];
  const familyFacet = familyFacetData.facets?.[0]?.counts ?? [];

  const topSpecies = await Promise.all(
    speciesFacet.map(async (item) => ({
      count: item.count,
      ...(await resolveSpeciesName(item.name)),
    })),
  );

  const topFamilies = await Promise.all(
    familyFacet.map(async (item) => ({
      count: item.count,
      ...(await resolveFamilyName(item.name)),
    })),
  );

  const summary = {
    generatedAt: fetchedAt,
    sourceId: "gbif-indonesia-flora",
    sourceUrl: BASE_URL,
    metrics: {
      totalOccurrences: summaryData.count,
      sampledRecords: sampleData.results.length,
      topSpeciesCount: topSpecies.length,
      topFamilyCount: topFamilies.length,
    },
    topSpecies,
    topFamilies,
    recentSampleRecords: sampleData.results.map(toSampleRecord),
    provenance: {
      pipelineStage: "source-summary",
      rawSnapshotPath: path.relative(repoRoot, rawDirPath),
      notes: [
        "This connector summarizes GBIF occurrence-backed flora data for Indonesia.",
        "It does not yet build a full deduplicated canonical flora taxa list from all GBIF occurrences.",
      ],
    },
  };

  await mkdir(rawDirPath, { recursive: true });
  await mkdir(processedDirPath, { recursive: true });

  await Promise.all([
    writeFile(rawSummaryPath, `${JSON.stringify(summaryData, null, 2)}\n`, "utf8"),
    writeFile(rawSpeciesFacetPath, `${JSON.stringify(speciesFacetData, null, 2)}\n`, "utf8"),
    writeFile(rawFamilyFacetPath, `${JSON.stringify(familyFacetData, null, 2)}\n`, "utf8"),
    writeFile(rawSamplePath, `${JSON.stringify(sampleData, null, 2)}\n`, "utf8"),
    writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
  ]);

  console.log(`Wrote GBIF flora summary to ${path.relative(repoRoot, summaryPath)}`);
  console.log(`Total occurrences: ${summary.metrics.totalOccurrences}`);
  console.log(`Top species resolved: ${topSpecies.length}`);
  console.log(`Top families resolved: ${topFamilies.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
