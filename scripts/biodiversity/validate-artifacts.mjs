import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const manifestPath = path.join(repoRoot, "data", "biodiversity", "source-manifest.json");
const curatedPath = path.join(repoRoot, "data", "biodiversity", "processed", "curated-ui-taxa.generated.json");
const fishbasePath = path.join(repoRoot, "data", "biodiversity", "processed", "fishbase-indonesia-taxa.generated.json");
const dfiTaxaPath = path.join(repoRoot, "data", "biodiversity", "processed", "dfi-acanthaceae-taxa.generated.json");
const dfiBatchTaxaPath = path.join(repoRoot, "data", "biodiversity", "processed", "dfi-angiosperm-batch-taxa.generated.json");
const mddTaxaPath = path.join(repoRoot, "data", "biodiversity", "processed", "mdd-indonesia-taxa.generated.json");

const manifestRequiredFields = [
  "id",
  "group",
  "role",
  "priority",
  "url",
  "access",
  "authRequired",
  "retrievalMethod",
  "license",
  "citationHint",
  "releaseCadence",
  "fieldMappingFocus",
  "rawSnapshotPath",
  "checksumRequired",
  "notes",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertObjectHasFields(object, fields, context) {
  for (const field of fields) {
    assert(field in object, `${context} missing required field: ${field}`);
  }
}

function validateManifestEntries(entries) {
  assert(Array.isArray(entries), "source-manifest.json must be an array");
  const seenIds = new Set();

  for (const entry of entries) {
    assertObjectHasFields(entry, manifestRequiredFields, `source manifest entry ${entry.id ?? "(unknown)"}`);
    assert(!seenIds.has(entry.id), `duplicate source manifest id: ${entry.id}`);
    seenIds.add(entry.id);
    assert(Array.isArray(entry.fieldMappingFocus), `fieldMappingFocus must be an array for ${entry.id}`);
    assert(entry.fieldMappingFocus.length > 0, `fieldMappingFocus must not be empty for ${entry.id}`);
    assert(typeof entry.authRequired === "boolean", `authRequired must be boolean for ${entry.id}`);
    assert(typeof entry.checksumRequired === "boolean", `checksumRequired must be boolean for ${entry.id}`);
  }
}

function validateCanonicalRecord(record, context) {
  assert(typeof record.internalId === "string" && record.internalId.length > 0, `${context} invalid internalId`);
  assert(typeof record.scientificName === "string" && record.scientificName.length > 0, `${context} invalid scientificName`);
  assert(record.taxonomy && typeof record.taxonomy === "object", `${context} missing taxonomy`);
  assert(typeof record.taxonomy.kingdom === "string" && record.taxonomy.kingdom.length > 0, `${context} missing taxonomy.kingdom`);
  assert(record.distribution && typeof record.distribution === "object", `${context} missing distribution`);
  assert(typeof record.distribution.country === "string" && record.distribution.country.length > 0, `${context} missing distribution.country`);
  assert(Array.isArray(record.sources) && record.sources.length > 0, `${context} missing sources`);
  assert(record.provenance && typeof record.provenance === "object", `${context} missing provenance`);
  assert(typeof record.provenance.generatedAt === "string", `${context} missing provenance.generatedAt`);
  assert(typeof record.provenance.pipelineStage === "string", `${context} missing provenance.pipelineStage`);
}

function validateCanonicalDataset(dataset, context) {
  assert(dataset && typeof dataset === "object", `${context} must be an object`);
  assert(typeof dataset.recordCount === "number", `${context} missing numeric recordCount`);
  assert(Array.isArray(dataset.records), `${context} records must be an array`);
  assert(dataset.recordCount === dataset.records.length, `${context} recordCount does not match records length`);

  const seenIds = new Set();

  dataset.records.forEach((record, index) => {
    const recordContext = `${context} record ${index}`;
    validateCanonicalRecord(record, recordContext);
    assert(!seenIds.has(record.internalId), `${context} duplicate internalId: ${record.internalId}`);
    seenIds.add(record.internalId);
  });
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function main() {
  const [manifest, curatedDataset, fishbaseDataset, dfiDataset, dfiBatchDataset, mddTaxaDataset] = await Promise.all([
    readJson(manifestPath),
    readJson(curatedPath),
    readJson(fishbasePath),
    readJson(dfiTaxaPath),
    readJson(dfiBatchTaxaPath),
    readJson(mddTaxaPath),
  ]);

  validateManifestEntries(manifest);
  validateCanonicalDataset(curatedDataset, "curated-ui-taxa");
  validateCanonicalDataset(fishbaseDataset, "fishbase-indonesia-taxa");
  validateCanonicalDataset(dfiDataset, "dfi-acanthaceae-taxa");
  validateCanonicalDataset(dfiBatchDataset, "dfi-angiosperm-batch-taxa");
  validateCanonicalDataset(mddTaxaDataset, "mdd-indonesia-taxa");

  console.log(`Validated source manifest entries: ${manifest.length}`);
  console.log(`Validated curated taxa records: ${curatedDataset.recordCount}`);
  console.log(`Validated FishBase taxa records: ${fishbaseDataset.recordCount}`);
  console.log(`Validated DFI flora taxa records: ${dfiDataset.recordCount}`);
  console.log(`Validated DFI batch flora taxa records: ${dfiBatchDataset.recordCount}`);
  console.log(`Validated MDD mammal taxa records: ${mddTaxaDataset.recordCount}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
