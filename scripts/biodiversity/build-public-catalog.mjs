import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const curatedPath = path.join(repoRoot, "data", "species.json");
const mddPath = path.join(
  repoRoot,
  "data",
  "biodiversity",
  "processed",
  "mdd-indonesia-taxa.generated.json",
);
const dfiPath = path.join(
  repoRoot,
  "data",
  "biodiversity",
  "processed",
  "dfi-angiosperm-batch-taxa.generated.json",
);
const fishbasePath = path.join(
  repoRoot,
  "data",
  "biodiversity",
  "processed",
  "fishbase-indonesia-taxa.generated.json",
);
const outputDirPath = path.join(repoRoot, "data", "biodiversity", "processed");
const outputPath = path.join(outputDirPath, "public-catalog.generated.json");
const summaryOutputPath = path.join(
  outputDirPath,
  "public-catalog-summary.generated.json",
);

const STATUS_BY_CODE = {
  CR: "kritis",
  EN: "terancam",
  VU: "rentan",
};

const SOURCE_LABELS = {
  curated: "Kurasi NusantaraHijau",
  mdd: "Mammal Diversity Database",
  dfi: "Digital Flora of Indonesia",
  fishbase: "FishBase Indonesia",
};

const COLOR_BY_SOURCE = {
  curated: null,
  mdd: "#6B4F3B",
  dfi: "#2F855A",
  fishbase: "#0F766E",
};

const TYPE_LABELS = {
  flora: "flora",
  fauna: "fauna",
};

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function normalizeScientificName(value) {
  return (value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function compactText(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean).map((value) => compactText(value)))];
}

function pickCommonName(commonNames, scientificName) {
  if (Array.isArray(commonNames)) {
    const preferredId = commonNames.find(
      (entry) => entry?.preferred && entry?.language?.toLowerCase?.() === "id",
    );
    if (preferredId?.name) return preferredId.name;

    const anyId = commonNames.find(
      (entry) => entry?.language?.toLowerCase?.() === "id" && entry?.name,
    );
    if (anyId?.name) return anyId.name;

    const preferred = commonNames.find((entry) => entry?.preferred && entry?.name);
    if (preferred?.name) return preferred.name;

    const first = commonNames.find((entry) => entry?.name);
    if (first?.name) return first.name;
  }

  return scientificName;
}

function pickStatus(labelId, code) {
  if (labelId && ["kritis", "terancam", "rentan"].includes(labelId)) {
    return labelId;
  }

  return STATUS_BY_CODE[code] ?? null;
}

function inferPrimaryRegion(regions) {
  if (!regions.length) return "nasional";
  if (regions.length === 1) return regions[0];
  return "nasional";
}

function buildDescription({ name, scientificName, type, sourceLabel, taxonomy, regions, statusCode }) {
  const taxonLabel =
    taxonomy?.family != null
      ? `famili ${taxonomy.family}`
      : taxonomy?.order != null
        ? `ordo ${taxonomy.order}`
        : taxonomy?.rank != null
          ? `takson ${taxonomy.rank}`
          : `entri ${TYPE_LABELS[type]}`;

  const regionLabel =
    regions.length === 0
      ? "Tercatat pada cakupan Indonesia secara umum"
      : regions.length === 1
        ? `Tercatat pada wilayah ${regions[0]}`
        : `Tercatat pada ${regions.length} wilayah utama Indonesia`;

  const statusLabel = statusCode ? ` Status konservasi IUCN yang tersedia: ${statusCode}.` : "";

  return `${name} (${scientificName}) masuk dalam ${sourceLabel} sebagai ${taxonLabel}. ${regionLabel}.${statusLabel}`;
}

function mapCuratedEntry(entry) {
  const regions = uniqueStrings([entry.region]);

  return {
    id: entry.id,
    name: entry.name,
    latinName: entry.latinName,
    region: inferPrimaryRegion(regions),
    regions,
    type: entry.type,
    status: entry.status ?? null,
    statusEN: entry.statusEN ?? null,
    description: entry.description,
    image: entry.image ?? null,
    color: entry.color ?? null,
    population: entry.population ?? null,
    habitat: entry.habitat ?? null,
    threat: entry.threat ?? null,
    action: entry.action ?? null,
    funFact: entry.funFact ?? null,
    source: entry.source ?? SOURCE_LABELS.curated,
    sourceKey: "curated",
    sourceLabel: SOURCE_LABELS.curated,
    detailRich: true,
  };
}

function mapExternalRecord(record, sourceKey, type) {
  const scientificName = compactText(record.acceptedName || record.scientificName);
  const name = compactText(pickCommonName(record.commonNames, scientificName));
  const regions = uniqueStrings(record.distribution?.regions ?? []);
  const statusCode = compactText(record.conservation?.iucnCode);

  return {
    id: `${sourceKey}-${slugify(scientificName)}`,
    name,
    latinName: scientificName,
    region: inferPrimaryRegion(regions),
    regions,
    type,
    status: pickStatus(record.conservation?.iucnLabelId, statusCode),
    statusEN: statusCode || null,
    description: buildDescription({
      name,
      scientificName,
      type,
      sourceLabel: SOURCE_LABELS[sourceKey],
      taxonomy: record.taxonomy,
      regions,
      statusCode,
    }),
    image: record.media?.imagePath ?? null,
    color: record.media?.accentColor ?? COLOR_BY_SOURCE[sourceKey],
    population: record.conservation?.populationText ?? null,
    habitat: record.narrative?.habitat ?? null,
    threat: record.conservation?.threatsText ?? null,
    action: record.narrative?.actionText ?? null,
    funFact: record.narrative?.funFact ?? null,
    source:
      record.sources?.[0]?.sourceUrl ??
      record.provenance?.notes?.[0] ??
      SOURCE_LABELS[sourceKey],
    sourceKey,
    sourceLabel: SOURCE_LABELS[sourceKey],
    detailRich: false,
  };
}

async function readJson(filePath) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function main() {
  const [curated, mdd, dfi, fishbase] = await Promise.all([
    readJson(curatedPath),
    readJson(mddPath),
    readJson(dfiPath),
    readJson(fishbasePath),
  ]);

  const seenScientificNames = new Set();
  const records = [];

  const addRecord = (record) => {
    const normalized = normalizeScientificName(record.latinName);
    if (!normalized || seenScientificNames.has(normalized)) return;
    seenScientificNames.add(normalized);
    records.push(record);
  };

  curated.map(mapCuratedEntry).forEach(addRecord);
  dfi.records.map((record) => mapExternalRecord(record, "dfi", "flora")).forEach(addRecord);
  mdd.records.map((record) => mapExternalRecord(record, "mdd", "fauna")).forEach(addRecord);
  fishbase.records
    .map((record) => mapExternalRecord(record, "fishbase", "fauna"))
    .forEach(addRecord);

  const generatedAt = new Date().toISOString();
  const byType = records.reduce(
    (acc, record) => {
      acc[record.type] = (acc[record.type] ?? 0) + 1;
      return acc;
    },
    { flora: 0, fauna: 0 },
  );
  const bySource = records.reduce((acc, record) => {
    acc[record.sourceKey] = (acc[record.sourceKey] ?? 0) + 1;
    return acc;
  }, {});

  await mkdir(outputDirPath, { recursive: true });

  await writeFile(
    outputPath,
    `${JSON.stringify(
      {
        generatedAt,
        recordCount: records.length,
        records,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  await writeFile(
    summaryOutputPath,
    `${JSON.stringify(
      {
        generatedAt,
        recordCount: records.length,
        byType,
        bySource,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`Wrote ${records.length} records to ${path.relative(repoRoot, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
