import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");
const speciesPath = path.join(repoRoot, "data", "species.json");
const outputDirPath = path.join(repoRoot, "data", "biodiversity", "processed");
const outputPath = path.join(outputDirPath, "curated-ui-taxa.generated.json");

function inferKingdom(type) {
  if (type === "flora") {
    return "Plantae";
  }

  if (type === "fauna") {
    return "Animalia";
  }

  return null;
}

function toProcessedRecord(entry) {
  const generatedAt = new Date().toISOString();

  return {
    internalId: `ui:${entry.id}`,
    scientificName: entry.latinName,
    scientificNameAuthorship: null,
    acceptedName: entry.latinName,
    taxonomicStatus: "curated-ui-subset",
    commonNames: [
      {
        name: entry.name,
        language: "id",
        preferred: true,
      },
    ],
    taxonomy: {
      kingdom: inferKingdom(entry.type),
      phylum: null,
      class: null,
      order: null,
      family: null,
      genus: entry.latinName.split(" ")[0] ?? null,
      species: entry.latinName.split(" ").slice(1).join(" ") || null,
      rank: "species",
    },
    distribution: {
      country: "Indonesia",
      regions: entry.region ? [entry.region] : [],
      provinces: entry.province ?? [],
      presenceType: "present",
      distributionNotes: entry.provinceMain ?? null,
    },
    conservation: {
      iucnCode: entry.statusEN ?? null,
      iucnLabelId: entry.status ?? null,
      populationText: entry.population ?? null,
      threatsText: entry.threat ?? null,
    },
    media: {
      imagePath: entry.image ?? null,
      accentColor: entry.color ?? null,
    },
    narrative: {
      description: entry.description ?? null,
      habitat: entry.habitat ?? null,
      actionText: entry.action ?? null,
      funFact: entry.funFact ?? null,
    },
    sources: [
      {
        sourceId: "curated-ui-subset",
        sourceUrl: "data/species.json",
        externalId: entry.id,
        retrievedAt: generatedAt,
        license: null,
        fieldsTrusted: [
          "scientificName",
          "commonNames",
          "distribution",
          "conservation",
          "media",
          "narrative",
        ],
      },
    ],
    provenance: {
      generatedAt,
      pipelineStage: "curated-ui-subset",
      rawSnapshotPath: null,
      notes: [
        "This processed file is generated from the curated UI subset.",
        "It is not the canonical Indonesia biodiversity master dataset.",
        `Source statement: ${entry.source ?? "unknown"}`,
        `Repository schema: data/species.schema.json`,
      ],
    },
  };
}

async function main() {
  const speciesRaw = await readFile(speciesPath, "utf8");
  const species = JSON.parse(speciesRaw);
  const processed = species.map(toProcessedRecord);

  await mkdir(outputDirPath, { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        recordCount: processed.length,
        records: processed,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`Wrote processed dataset to ${path.relative(repoRoot, outputPath)}`);
  console.log(`Processed records: ${processed.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
