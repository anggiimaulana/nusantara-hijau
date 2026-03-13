import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const curatedPath = path.join(repoRoot, "data", "biodiversity", "processed", "curated-ui-taxa.generated.json");
const fishbasePath = path.join(repoRoot, "data", "biodiversity", "processed", "fishbase-indonesia-taxa.generated.json");
const gbifFloraPath = path.join(repoRoot, "data", "biodiversity", "processed", "gbif-indonesia-flora-summary.generated.json");
const gbifReptilesPath = path.join(repoRoot, "data", "biodiversity", "processed", "gbif-indonesia-reptiles-summary.generated.json");
const dfiFamiliesPath = path.join(repoRoot, "data", "biodiversity", "processed", "dfi-angiosperm-families.generated.json");
const dfiTaxaPath = path.join(repoRoot, "data", "biodiversity", "processed", "dfi-acanthaceae-taxa.generated.json");
const dfiBatchTaxaPath = path.join(repoRoot, "data", "biodiversity", "processed", "dfi-angiosperm-batch-taxa.generated.json");
const mddPath = path.join(repoRoot, "data", "biodiversity", "processed", "mdd-indonesia-summary.generated.json");
const mddTaxaPath = path.join(repoRoot, "data", "biodiversity", "processed", "mdd-indonesia-taxa.generated.json");
const manifestPath = path.join(repoRoot, "data", "biodiversity", "source-manifest.json");
const outputPath = path.join(repoRoot, "data", "biodiversity", "reports", "catalog-status.generated.json");

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function countBy(items, selector) {
  return items.reduce((accumulator, item) => {
    const key = selector(item);
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
}

async function main() {
  const [curated, fishbase, gbifFlora, gbifReptiles, dfiFamilies, dfiTaxa, dfiBatchTaxa, mdd, mddTaxa, manifest] = await Promise.all([
    readJson(curatedPath),
    readJson(fishbasePath),
    readJson(gbifFloraPath),
    readJson(gbifReptilesPath),
    readJson(dfiFamiliesPath),
    readJson(dfiTaxaPath),
    readJson(dfiBatchTaxaPath),
    readJson(mddPath),
    readJson(mddTaxaPath),
    readJson(manifestPath),
  ]);

  const status = {
    generatedAt: new Date().toISOString(),
    sourceManifest: {
      totalSources: manifest.length,
      byGroup: countBy(manifest, (entry) => entry.group),
      byPriority: countBy(manifest, (entry) => entry.priority),
      authRequiredCount: manifest.filter((entry) => entry.authRequired).length,
    },
    processedArtifacts: {
      curatedUiSubset: {
        recordCount: curated.recordCount,
        kingdoms: countBy(curated.records, (record) => record.taxonomy.kingdom ?? "unknown"),
        regions: countBy(curated.records, (record) => record.distribution.regions[0] ?? "unknown"),
      },
      fishbaseIndonesia: {
        recordCount: fishbase.recordCount,
        topOrdersSample: Object.entries(countBy(fishbase.records, (record) => record.taxonomy.order ?? "unknown"))
          .sort((left, right) => right[1] - left[1])
          .slice(0, 10),
        presenceTypes: countBy(fishbase.records, (record) => record.distribution.presenceType ?? "unknown"),
      },
      gbifIndonesiaFlora: {
        totalOccurrences: gbifFlora.metrics.totalOccurrences,
        topSpeciesResolved: gbifFlora.metrics.topSpeciesCount,
        topFamiliesResolved: gbifFlora.metrics.topFamilyCount,
      },
      gbifIndonesiaReptiles: {
        totalOccurrences: gbifReptiles.metrics.totalOccurrences,
        groupCount: gbifReptiles.metrics.groupCount,
        groups: gbifReptiles.groups.map((group) => ({
          label: group.label,
          occurrenceCount: group.occurrenceCount,
        })),
      },
      mddIndonesia: {
        livingSpecies: mdd.metrics.livingSpecies,
        extinctSpecies: mdd.metrics.extinctSpecies,
        orders: mdd.metrics.orders,
        families: mdd.metrics.families,
        genera: mdd.metrics.genera,
        extractedOrderSummaries: mdd.orderSummaries.length,
        taxaRecordCount: mddTaxa.recordCount,
      },
      dfiAngiosperms: {
        familyCount: dfiFamilies.familyCount,
        sampleFamily: dfiTaxa.family,
        sampleTaxaCount: dfiTaxa.recordCount,
        harvestedFamilyCount: dfiBatchTaxa.harvestedFamilyCount,
        harvestedTaxaCount: dfiBatchTaxa.recordCount,
      },
    },
    progressNotes: [
      "Curated UI subset and FishBase Indonesia now exist as canonical-style processed artifacts.",
      "FishBase is the largest taxa-level external connector in the repo so far.",
      "DFI now contributes an Indonesia-native flora family catalog and first family-level taxa extraction.",
      "MDD now contributes an authoritative Indonesia mammal summary with order-level counts.",
      "GBIF now contributes an Indonesia reptile occurrence summary across Squamata, Testudines, and Crocodylia.",
      "Next major completeness gains likely come from more DFI family pages plus taxa-level reptile connectors.",
    ],
  };

  await writeFile(outputPath, `${JSON.stringify(status, null, 2)}\n`, "utf8");

  console.log(`Wrote catalog status report to ${path.relative(repoRoot, outputPath)}`);
  console.log(`Manifest sources: ${status.sourceManifest.totalSources}`);
  console.log(`Curated records: ${status.processedArtifacts.curatedUiSubset.recordCount}`);
  console.log(`FishBase records: ${status.processedArtifacts.fishbaseIndonesia.recordCount}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
