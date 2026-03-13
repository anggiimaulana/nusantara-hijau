import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const rawDirPath = path.join(repoRoot, "data", "biodiversity", "raw", "gbif-indonesia-reptiles");
const processedDirPath = path.join(repoRoot, "data", "biodiversity", "processed");
const summaryPath = path.join(processedDirPath, "gbif-indonesia-reptiles-summary.generated.json");

const groups = [
  { id: "squamata", label: "Squamata", taxonKey: 11592253 },
  { id: "testudines", label: "Testudines", taxonKey: 11418114 },
  { id: "crocodylia", label: "Crocodylia", taxonKey: 11493978 },
];

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "NusantaraHijauGBIFReptiles/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`GBIF request failed (${response.status}) for ${url}`);
  }

  return response.json();
}

async function resolveSpecies(speciesKey) {
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

async function fetchGroupSummary(group) {
  const baseUrl = `https://api.gbif.org/v1/occurrence/search?country=ID&taxonKey=${group.taxonKey}`;
  const [countData, facetData] = await Promise.all([
    fetchJson(`${baseUrl}&limit=0`),
    fetchJson(`${baseUrl}&facet=speciesKey&facetLimit=10&limit=0`),
  ]);

  const speciesFacet = facetData.facets?.[0]?.counts ?? [];
  const topSpecies = await Promise.all(
    speciesFacet.map(async (item) => ({
      count: item.count,
      ...(await resolveSpecies(item.name)),
    })),
  );

  return {
    ...group,
    occurrenceCount: countData.count,
    topSpecies,
    raw: {
      countData,
      facetData,
    },
  };
}

async function main() {
  const generatedAt = new Date().toISOString();
  const summaries = await Promise.all(groups.map(fetchGroupSummary));

  const payload = {
    generatedAt,
    sourceId: "gbif-indonesia-reptiles",
    sourceUrl: "https://api.gbif.org/v1/occurrence/search?country=ID",
    groups: summaries.map((summary) => ({
      id: summary.id,
      label: summary.label,
      taxonKey: summary.taxonKey,
      occurrenceCount: summary.occurrenceCount,
      topSpecies: summary.topSpecies,
    })),
    metrics: {
      totalOccurrences: summaries.reduce((sum, item) => sum + item.occurrenceCount, 0),
      groupCount: summaries.length,
    },
    provenance: {
      pipelineStage: "source-summary",
      rawSnapshotPath: path.relative(repoRoot, rawDirPath),
      notes: [
        "Derived from GBIF occurrence search filtered to Indonesia reptile groups.",
        "Current scope is occurrence-backed reptile summary, not full canonical reptile taxa extraction.",
      ],
    },
  };

  await mkdir(rawDirPath, { recursive: true });
  await mkdir(processedDirPath, { recursive: true });

  await Promise.all([
    ...summaries.flatMap((summary) => [
      writeFile(path.join(rawDirPath, `${summary.id}-count.raw.json`), `${JSON.stringify(summary.raw.countData, null, 2)}\n`, "utf8"),
      writeFile(path.join(rawDirPath, `${summary.id}-facet.raw.json`), `${JSON.stringify(summary.raw.facetData, null, 2)}\n`, "utf8"),
    ]),
    writeFile(summaryPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8"),
  ]);

  console.log(`Wrote GBIF reptiles summary to ${path.relative(repoRoot, summaryPath)}`);
  console.log(`Total reptile occurrences: ${payload.metrics.totalOccurrences}`);
  for (const group of payload.groups) {
    console.log(`${group.label}: ${group.occurrenceCount}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
