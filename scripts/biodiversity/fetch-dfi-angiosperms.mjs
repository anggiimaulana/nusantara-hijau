import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const indexUrl = "https://www.indonesiaplants.org/angiosperms/";
const sampleFamily = {
  slug: "acanthaceae",
  url: "https://www.indonesiaplants.org/angiosperms/acanthaceae/",
  family: "Acanthaceae",
};
const defaultFamilyLimit = Number(process.env.DFI_FAMILY_LIMIT ?? "25");
const familyConcurrency = Number(process.env.DFI_FAMILY_CONCURRENCY ?? "4");

const rawDirPath = path.join(repoRoot, "data", "biodiversity", "raw", "digital-flora-indonesia-angiosperms");
const processedDirPath = path.join(repoRoot, "data", "biodiversity", "processed");

const indexRawPath = path.join(rawDirPath, "angiosperms-index.raw.html");
const familyRawPath = path.join(rawDirPath, `${sampleFamily.slug}.raw.html`);
const familyCatalogPath = path.join(processedDirPath, "dfi-angiosperm-families.generated.json");
const familyTaxaPath = path.join(processedDirPath, `dfi-${sampleFamily.slug}-taxa.generated.json`);
const batchTaxaPath = path.join(processedDirPath, "dfi-angiosperm-batch-taxa.generated.json");

function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"');
}

function stripHtml(value) {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchText(url) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "user-agent": "NusantaraHijauDFIConnector/1.0",
        },
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`DFI request failed (${response.status}) for ${url}`);
      }

      return response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
      }
    }
  }

  throw lastError;
}

async function fetchTextWithCache(url, cachePath) {
  try {
    const html = await fetchText(url);
    await writeFile(cachePath, html, "utf8");
    return html;
  } catch (error) {
    try {
      return await readFile(cachePath, "utf8");
    } catch {
      throw error;
    }
  }
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

function extractFamilyCatalog(html) {
  const matches = Array.from(
    html.matchAll(/<a href="(https?:\/\/(?:www\.)?indonesiaplants\.org\/angiosperms\/[a-z0-9-]+\/?(?:#[^"]*)?)"[^>]*>([^<]+)<\/a>/gi),
  );

  const seen = new Set();
  const families = [];

  for (const [, url, rawName] of matches) {
    const family = decodeEntities(rawName).trim();
    if (!family.endsWith("aceae") && family !== "Opiliaceae") {
      continue;
    }

    const normalizedUrl = url.endsWith("/") ? url : `${url}/`;
    if (seen.has(normalizedUrl)) {
      continue;
    }

    seen.add(normalizedUrl);
    families.push({
      family,
      url: normalizedUrl,
      slug: normalizedUrl.split("/").filter(Boolean).pop(),
    });
  }

  return families.sort((left, right) => left.family.localeCompare(right.family));
}

function extractListItems(html) {
  return Array.from(html.matchAll(/<li>([\s\S]*?)<\/li>/gi), (match) => match[1]);
}

function inferRegions(text) {
  const source = text.toUpperCase();
  const mappings = [
    ["SUMATRA", "sumatera"],
    ["JAVA", "jawa"],
    ["KALIMANTAN", "kalimantan"],
    ["SULAWESI", "sulawesi"],
    ["PAPUA", "papua"],
    ["NUSA TENGGARA", "bali-nusra"],
    ["MALUKU", "maluku"],
  ];

  return mappings.filter(([token]) => source.includes(token)).map(([, region]) => region);
}

function uniquifyInternalIds(records) {
  const seen = new Map();

  return records.map((record) => {
    const current = seen.get(record.internalId) ?? 0;
    seen.set(record.internalId, current + 1);

    if (current === 0) {
      return record;
    }

    return {
      ...record,
      internalId: `${record.internalId}:${current + 1}`,
      provenance: {
        ...record.provenance,
        notes: [...record.provenance.notes, `Duplicate scientific name occurrence normalized with suffix ${current + 1}.`],
      },
    };
  });
}

async function fetchFamilyTaxa(familyEntry, generatedAt) {
  const familyPath = path.join(rawDirPath, `${familyEntry.slug}.raw.html`);
  const familyHtml = await fetchTextWithCache(familyEntry.url, familyPath);
  const taxa = uniquifyInternalIds(
    extractListItems(familyHtml)
      .map((item) => toCanonicalTaxon(item, familyEntry.family, familyEntry.url, generatedAt))
      .filter((record) => record.scientificName.length > 0),
  );

  return {
    familyEntry,
    familyHtml,
    familyPath,
    taxa,
  };
}

function toCanonicalTaxon(htmlItem, family, sourceUrl, generatedAt) {
  const nameMatch = htmlItem.match(/<strong><em>([^<]+)<\/em><\/strong>\s*([^<]*)/i);
  const scientificNameCore = decodeEntities(nameMatch?.[1] ?? "").trim();
  const authorship = decodeEntities(nameMatch?.[2] ?? "")
    .replace(/^\s+|\s+$/g, "")
    .replace(/^\((.*?)\)$/, "$1")
    .trim();
  const scientificName = [scientificNameCore, authorship].filter(Boolean).join(" ").trim();
  const plainText = stripHtml(htmlItem);
  const genus = scientificNameCore.split(" ")[0] ?? null;
  const species = scientificNameCore.split(" ").slice(1).join(" ") || null;

  return {
    internalId: `dfi:${family.toLowerCase()}:${scientificNameCore.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    scientificName,
    scientificNameAuthorship: authorship || null,
    acceptedName: scientificNameCore || null,
    taxonomicStatus: "accepted",
    commonNames: [],
    taxonomy: {
      kingdom: "Plantae",
      phylum: null,
      class: null,
      order: null,
      family,
      genus,
      species,
      rank: "species",
    },
    distribution: {
      country: "Indonesia",
      regions: inferRegions(plainText),
      provinces: [],
      presenceType: "present",
      distributionNotes: plainText,
    },
    conservation: {
      iucnCode: null,
      iucnLabelId: null,
      populationText: null,
      threatsText: null,
    },
    media: {
      imagePath: null,
      accentColor: null,
    },
    sources: [
      {
        sourceId: "digital-flora-indonesia-angiosperms",
        sourceUrl,
        externalId: scientificNameCore || null,
        retrievedAt: generatedAt,
        license: "website terms apply",
        fieldsTrusted: ["scientificName", "taxonomy.family", "distribution.regions"],
      },
    ],
    provenance: {
      generatedAt,
      pipelineStage: "normalized",
      rawSnapshotPath: path.relative(repoRoot, familyRawPath),
      notes: [
        "Derived from a Digital Flora of Indonesia family page.",
        "This is a first-pass flora extractor from family-level checklist HTML.",
      ],
    },
  };
}

async function main() {
  const generatedAt = new Date().toISOString();
  await mkdir(rawDirPath, { recursive: true });
  await mkdir(processedDirPath, { recursive: true });

  const indexHtml = await fetchTextWithCache(indexUrl, indexRawPath);

  const families = extractFamilyCatalog(indexHtml);
  const familiesToFetch = families.slice(0, Math.max(1, defaultFamilyLimit));
  const fetchedFamilies = await mapWithConcurrency(familiesToFetch, familyConcurrency, (familyEntry) =>
    fetchFamilyTaxa(familyEntry, generatedAt),
  );

  const sampleFamilyResult =
    fetchedFamilies.find((entry) => entry.familyEntry.slug === sampleFamily.slug) ?? fetchedFamilies[0];
  const taxa = sampleFamilyResult.taxa;
  const batchTaxa = fetchedFamilies.flatMap((entry) => entry.taxa);

  await Promise.all([
    writeFile(familyRawPath, sampleFamilyResult.familyHtml, "utf8"),
    writeFile(
      familyCatalogPath,
      `${JSON.stringify(
        {
          generatedAt,
          sourceId: "digital-flora-indonesia-angiosperms",
          sourceUrl: indexUrl,
          familyCount: families.length,
          families,
        },
        null,
        2,
      )}\n`,
      "utf8",
    ),
    writeFile(
      familyTaxaPath,
      `${JSON.stringify(
        {
          generatedAt,
          sourceId: "digital-flora-indonesia-angiosperms",
          sourceUrl: sampleFamilyResult.familyEntry.url,
          family: sampleFamilyResult.familyEntry.family,
          recordCount: taxa.length,
          records: taxa,
        },
        null,
        2,
      )}\n`,
      "utf8",
    ),
    writeFile(
      batchTaxaPath,
      `${JSON.stringify(
        {
          generatedAt,
          sourceId: "digital-flora-indonesia-angiosperms",
          sourceUrl: indexUrl,
          harvestedFamilyCount: fetchedFamilies.length,
          harvestedFamilies: fetchedFamilies.map((entry) => entry.familyEntry),
          recordCount: batchTaxa.length,
          records: batchTaxa,
        },
        null,
        2,
      )}\n`,
      "utf8",
    ),
  ]);

  console.log(`Wrote DFI family catalog to ${path.relative(repoRoot, familyCatalogPath)}`);
  console.log(`Wrote DFI family taxa to ${path.relative(repoRoot, familyTaxaPath)}`);
  console.log(`Wrote DFI batch taxa to ${path.relative(repoRoot, batchTaxaPath)}`);
  console.log(`DFI family count: ${families.length}`);
  console.log(`DFI harvested families: ${fetchedFamilies.length}`);
  console.log(`DFI batch taxa: ${batchTaxa.length}`);
  console.log(`DFI ${sampleFamilyResult.familyEntry.family} taxa: ${taxa.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
