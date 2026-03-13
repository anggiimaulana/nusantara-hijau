import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const speciesPath = path.join(repoRoot, "data", "species.json");
const schemaPath = path.join(repoRoot, "data", "species.schema.json");
const imageDirPath = path.join(repoRoot, "public", "images", "species");
const outputDirPath = path.join(repoRoot, "data", "biodiversity", "reports");
const outputPath = path.join(outputDirPath, "local-dataset-audit.generated.json");

function countBy(items, selector) {
  return items.reduce((accumulator, item) => {
    const key = selector(item);
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
}

function findDuplicates(values) {
  const counts = countBy(values, (value) => value);
  return Object.entries(counts)
    .filter(([, count]) => count > 1)
    .map(([value, count]) => ({ value, count }))
    .sort((left, right) => right.count - left.count || left.value.localeCompare(right.value));
}

function missingRequiredFields(species, requiredFields) {
  return species.flatMap((entry, index) => {
    const missing = requiredFields.filter((field) => {
      const value = entry[field];

      if (value == null) {
        return true;
      }

      if (typeof value === "string") {
        return value.trim().length === 0;
      }

      if (Array.isArray(value)) {
        return value.length === 0;
      }

      return false;
    });

    if (missing.length === 0) {
      return [];
    }

    return [{ id: entry.id ?? `(index-${index})`, missing }];
  });
}

async function main() {
  const [speciesRaw, schemaRaw, imageFiles] = await Promise.all([
    readFile(speciesPath, "utf8"),
    readFile(schemaPath, "utf8"),
    readdir(imageDirPath),
  ]);

  const species = JSON.parse(speciesRaw);
  const schema = JSON.parse(schemaRaw);
  const requiredFields = schema.items.required;
  const allowedRegions = schema.items.properties.region.enum;
  const allowedTypes = schema.items.properties.type.enum;
  const allowedStatus = schema.items.properties.status.enum;
  const allowedStatusCodes = schema.items.properties.statusEN.enum;

  const imagePaths = imageFiles
    .filter((fileName) => !fileName.startsWith("."))
    .map((fileName) => `/images/species/${fileName}`)
    .sort();

  const imageSet = new Set(imagePaths);
  const speciesImagePaths = species.map((entry) => entry.image).filter(Boolean);

  const byType = countBy(species, (entry) => entry.type ?? "(missing)");
  const byStatus = countBy(species, (entry) => entry.status ?? "(missing)");
  const byStatusCode = countBy(species, (entry) => entry.statusEN ?? "(missing)");
  const byRegion = countBy(species, (entry) => entry.region ?? "(missing)");
  const byProvinceMain = countBy(species, (entry) => entry.provinceMain ?? "(missing)");

  const invalidRegions = species
    .filter((entry) => entry.region && !allowedRegions.includes(entry.region))
    .map((entry) => ({ id: entry.id, region: entry.region }));

  const invalidTypes = species
    .filter((entry) => entry.type && !allowedTypes.includes(entry.type))
    .map((entry) => ({ id: entry.id, type: entry.type }));

  const invalidStatuses = species
    .filter((entry) => entry.status && !allowedStatus.includes(entry.status))
    .map((entry) => ({ id: entry.id, status: entry.status }));

  const invalidStatusCodes = species
    .filter((entry) => entry.statusEN && !allowedStatusCodes.includes(entry.statusEN))
    .map((entry) => ({ id: entry.id, statusEN: entry.statusEN }));

  const invalidImages = species
    .filter((entry) => entry.image && !imageSet.has(entry.image))
    .map((entry) => ({ id: entry.id, image: entry.image }));

  const unusedImages = imagePaths.filter((imagePath) => !speciesImagePaths.includes(imagePath));
  const duplicateIds = findDuplicates(species.map((entry) => entry.id));
  const duplicateNames = findDuplicates(species.map((entry) => entry.name));
  const duplicateLatinNames = findDuplicates(species.map((entry) => entry.latinName));
  const emptyProvinceMain = species.filter((entry) => !entry.provinceMain).map((entry) => entry.id);
  const regionsMissingFromDataset = allowedRegions.filter((region) => !(region in byRegion));

  const report = {
    generatedAt: new Date().toISOString(),
    sourceFiles: {
      speciesPath: path.relative(repoRoot, speciesPath),
      schemaPath: path.relative(repoRoot, schemaPath),
      imageDirPath: path.relative(repoRoot, imageDirPath),
    },
    summary: {
      totalEntries: species.length,
      availableImages: imagePaths.length,
      entriesByType: byType,
      entriesByStatus: byStatus,
      entriesByStatusCode: byStatusCode,
      entriesByRegion: byRegion,
      entriesByProvinceMain: byProvinceMain,
      regionsMissingFromDataset,
    },
    quality: {
      duplicateIds,
      duplicateNames,
      duplicateLatinNames,
      missingRequiredFields: missingRequiredFields(species, requiredFields),
      invalidRegions,
      invalidTypes,
      invalidStatuses,
      invalidStatusCodes,
      invalidImages,
      unusedImages,
      emptyProvinceMain,
    },
  };

  await mkdir(outputDirPath, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`Wrote audit report to ${path.relative(repoRoot, outputPath)}`);
  console.log(`Total entries: ${species.length}`);
  console.log(`By type: ${JSON.stringify(byType)}`);
  console.log(`By region: ${JSON.stringify(byRegion)}`);
  console.log(`Duplicate IDs: ${duplicateIds.length}`);
  console.log(`Duplicate names: ${duplicateNames.length}`);
  console.log(`Invalid image refs: ${invalidImages.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
