import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");
const outputDirPath = path.join(repoRoot, "data", "biodiversity", "reports");
const outputPath = path.join(outputDirPath, "public-source-snapshots.generated.json");

const USER_AGENT =
  "Mozilla/5.0 (compatible; NusantaraHijauBiodiversityAudit/1.0; +https://example.invalid)";

const sources = [
  {
    id: "ugm-brin-benchmark",
    name: "UGM / BRIN biodiversity benchmark article",
    url: "https://ugm.ac.id/en/news/indonesia-records-31750-flora-and-744000-fauna-species-ugm-and-brin-urge-stronger-biodiversity-research/",
    extractMetrics(text) {
      return {
        floraSpecies: text.match(/31,750\s+flora/i)?.[0] ?? null,
        faunaSpecies: text.match(/744,000\s+fauna/i)?.[0] ?? null,
      };
    },
  },
  {
    id: "digital-flora-indonesia",
    name: "Digital Flora of Indonesia",
    url: "https://www.indonesiaplants.org/",
    extractMetrics(text) {
      return {
        plantSpecies: text.match(/23,162\s+vascular\s+plant\s+species/i)?.[0] ?? null,
        continuouslyUpdated: /continue updating the database/i.test(text),
      };
    },
  },
  {
    id: "ssrs-indonesia-biodiversity-hub",
    name: "SSRS Indonesia Biodiversity Hub",
    url: "https://hub.biodiversitas-indonesia.or.id/",
    extractMetrics(text) {
      return {
        latestDateMention:
          text.match(/March\s+11,\s+2026|March\s+7,\s+2026|February\s+17,\s+2026/i)?.[0] ?? null,
        includesAnimalia: /Animalia/i.test(text),
        includesPlantae: /Plantae/i.test(text),
        includesFungi: /Fungi/i.test(text),
      };
    },
  },
  {
    id: "fishbase-indonesia",
    name: "FishBase Indonesia checklist",
    url: "https://www.fishbase.se/country/CountryChecklist.php?showAll=yes&c_code=360",
    extractMetrics(text) {
      return {
        fishSpeciesPresent: text.match(/([0-9,]+)\s+species\s+currently\s+present/i)?.[1] ?? null,
        fishListCount: text.match(/Fish\s+Species\s+in\s+Indonesia\s*\n?\s*n\s*=\s*([0-9,]+)/i)?.[1] ?? null,
      };
    },
  },
  {
    id: "griis-indonesia",
    name: "GRIIS Indonesia via GBIF",
    url: "https://www.gbif.org/dataset/61fb216d-1216-4287-8b78-fdfef45e8e18",
    extractMetrics(text) {
      return {
        records: text.match(/([0-9,]+)\\\s*records/i)?.[1] ?? text.match(/([0-9,]+)\s+records/i)?.[1] ?? null,
        acceptedNames: text.match(/([0-9,]+)\\\s*accepted names/i)?.[1] ?? text.match(/([0-9,]+)\s+accepted names/i)?.[1] ?? null,
      };
    },
  },
];

function stripHtml(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function snapshotSource(source) {
  const response = await fetch(source.url, {
    headers: {
      "user-agent": USER_AGENT,
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  const body = await response.text();
  const plainText = stripHtml(body);

  return {
    id: source.id,
    name: source.name,
    url: source.url,
    fetchedAt: new Date().toISOString(),
    ok: response.ok,
    status: response.status,
    title: body.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? null,
    metrics: source.extractMetrics(plainText),
    excerpt: plainText.slice(0, 800),
  };
}

async function main() {
  const snapshots = [];

  for (const source of sources) {
    try {
      snapshots.push(await snapshotSource(source));
    } catch (error) {
      snapshots.push({
        id: source.id,
        name: source.name,
        url: source.url,
        fetchedAt: new Date().toISOString(),
        ok: false,
        status: null,
        title: null,
        metrics: null,
        excerpt: null,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  await mkdir(outputDirPath, { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), snapshots }, null, 2)}\n`,
    "utf8",
  );

  console.log(`Wrote source snapshots to ${path.relative(repoRoot, outputPath)}`);
  console.log(`Snapshot count: ${snapshots.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
