import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const SOURCE_URL = "https://www.fishbase.se/country/CountryChecklist.php?showAll=yes&c_code=360";
const rawDirPath = path.join(repoRoot, "data", "biodiversity", "raw", "fishbase-indonesia");
const processedDirPath = path.join(repoRoot, "data", "biodiversity", "processed");
const rawSnapshotPath = path.join(rawDirPath, "latest.raw.html");
const summaryPath = path.join(processedDirPath, "fishbase-indonesia-summary.generated.json");
const taxaPath = path.join(processedDirPath, "fishbase-indonesia-taxa.generated.json");

const USER_AGENT =
  "Mozilla/5.0 (compatible; NusantaraHijauFishBaseConnector/1.0; +https://example.invalid)";

function stripHtml(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#[0-9]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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
    .replace(/&uuml;/g, "u")
    .replace(/&ouml;/g, "o")
    .replace(/&aacute;/g, "a")
    .replace(/&eacute;/g, "e")
    .replace(/&iacute;/g, "i")
    .replace(/&oacute;/g, "o")
    .replace(/&uacute;/g, "u");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function extractSectionTokens(text, startLabel, endLabel) {
  const startIndex = text.indexOf(startLabel);
  if (startIndex === -1) {
    return [];
  }

  const afterStart = text.slice(startIndex + startLabel.length);
  const section = endLabel ? afterStart.slice(0, afterStart.indexOf(endLabel)) : afterStart;

  return Array.from(new Set(section.match(/[A-Z][A-Za-z/-]{3,}/g) ?? []));
}

function firstNumber(text, pattern) {
  return text.match(pattern)?.[1] ?? null;
}

function extractTableRows(html) {
  const match = html.match(/var table_data_arr = (\{"table_filter":\[.*?\]\});/s);

  if (!match) {
    throw new Error("Could not locate FishBase table_data_arr block");
  }

  const parsed = JSON.parse(match[1]);
  return parsed.table_filter;
}

function parseSpeciesLink(htmlFragment) {
  const linkMatch = htmlFragment.match(/CountrySpeciesSummary\.php\?c_code=(\d+)&id=(\d+)/i);
  const scientificName = decodeEntities(stripHtml(htmlFragment));

  return {
    scientificName,
    externalId: linkMatch?.[2] ?? null,
    sourceUrl: linkMatch
      ? `https://www.fishbase.se/CountrySpeciesSummary.php?c_code=${linkMatch[1]}&id=${linkMatch[2]}`
      : SOURCE_URL,
  };
}

function parseTerritoryNames(text) {
  return decodeEntities(text)
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((entry) => {
      const [language, ...rest] = entry.split(":");
      return {
        language: rest.length > 0 ? language.trim() : "unknown",
        name: rest.length > 0 ? rest.join(":").trim() : language.trim(),
      };
    });
}

function toCanonicalFishTaxon(row, fetchedAt, rawSnapshotRelativePath, checksum) {
  const [orderName, familyName, speciesHtml, fishbaseCommonName, occurrence, territoryNames] = row;
  const { scientificName, externalId, sourceUrl } = parseSpeciesLink(speciesHtml);
  const commonNames = [];

  if (fishbaseCommonName && fishbaseCommonName.trim()) {
    commonNames.push({
      name: decodeEntities(fishbaseCommonName.trim()),
      language: "en",
      preferred: true,
    });
  }

  for (const territoryName of parseTerritoryNames(territoryNames ?? "")) {
    commonNames.push({
      name: territoryName.name,
      language: territoryName.language,
      preferred: false,
    });
  }

  return {
    internalId: `fishbase:id:${externalId ?? slugify(scientificName)}`,
    scientificName,
    scientificNameAuthorship: null,
    acceptedName: scientificName,
    taxonomicStatus: "accepted",
    commonNames,
    taxonomy: {
      kingdom: "Animalia",
      phylum: null,
      class: null,
      order: decodeEntities(orderName ?? ""),
      family: decodeEntities(familyName ?? ""),
      genus: scientificName.split(" ")[0] ?? null,
      species: scientificName.split(" ").slice(1).join(" ") || null,
      rank: "species",
    },
    distribution: {
      country: "Indonesia",
      regions: [],
      provinces: [],
      presenceType:
        occurrence === "native"
          ? "present"
          : occurrence === "introduced"
            ? "introduced"
            : occurrence === "questionable"
              ? "possibly-present"
              : "unknown",
      distributionNotes: decodeEntities(occurrence ?? "") || null,
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
        sourceId: "fishbase",
        sourceUrl,
        externalId,
        retrievedAt: fetchedAt,
        license: "FishBase terms apply",
        fieldsTrusted: [
          "scientificName",
          "commonNames",
          "taxonomy.order",
          "taxonomy.family",
          "distribution.presenceType",
        ],
      },
    ],
    provenance: {
      generatedAt: fetchedAt,
      pipelineStage: "normalized",
      rawSnapshotPath: rawSnapshotRelativePath,
      notes: [
        `Derived from FishBase Indonesia checklist source id ${externalId ?? "unknown"}.`,
        `Raw snapshot checksum sha256: ${checksum}.`,
      ],
    },
  };
}

async function main() {
  const response = await fetch(SOURCE_URL, {
    headers: {
      "user-agent": USER_AGENT,
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  const html = await response.text();
  const plainText = stripHtml(html);
  const rows = extractTableRows(html);
  const orders = extractSectionTokens(plainText, "Order", "Family");
  const families = extractSectionTokens(plainText, "Family", "Record ranking").filter(
    (token) => /idae$|formes$|idae\/$/.test(token) || token.endsWith("idae"),
  );

  const checksum = createHash("sha256").update(html).digest("hex");
  const fetchedAt = new Date().toISOString();
  const rawSnapshotRelativePath = path.relative(repoRoot, rawSnapshotPath);
  const taxa = rows.map((row) => toCanonicalFishTaxon(row, fetchedAt, rawSnapshotRelativePath, checksum));

  const summary = {
    generatedAt: fetchedAt,
    sourceId: "fishbase",
    sourceUrl: SOURCE_URL,
    ok: response.ok,
    status: response.status,
    title: html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? null,
    metrics: {
      reportedSpeciesTotal: firstNumber(plainText, /n\s*=\s*([0-9,]+)\s*\(incomplete\)/i),
      currentlyPresent: firstNumber(plainText, /Table 1:\s*([0-9,]+)\s*species currently present/i),
      possiblyPresent: firstNumber(plainText, /Table 2:\s*([0-9,]+)\s*species possibly present/i),
      absent: firstNumber(plainText, /Table 3:\s*([0-9,]+)\s*species demonstrated to be absent/i),
      reportedAltogether: firstNumber(plainText, /Table 4:\s*([0-9,]+)\s*species reported/i),
    },
    taxonomyBuckets: {
      ordersSample: orders.slice(0, 100),
      orderCountApprox: orders.length,
      familiesSample: families.slice(0, 200),
      familyCountApprox: families.length,
    },
    extractedRows: rows.length,
    provenance: {
      pipelineStage: "source-summary",
      rawSnapshotPath: rawSnapshotRelativePath,
      checksumSha256: checksum,
      notes: [
        "This connector stores a raw HTML snapshot plus a normalized summary.",
        "This connector now also emits taxa-level processed records for the FishBase checklist.",
      ],
    },
  };

  await mkdir(rawDirPath, { recursive: true });
  await mkdir(processedDirPath, { recursive: true });
  await writeFile(rawSnapshotPath, html, "utf8");
  await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  await writeFile(
    taxaPath,
    `${JSON.stringify(
      {
        generatedAt: fetchedAt,
        sourceId: "fishbase",
        sourceUrl: SOURCE_URL,
        recordCount: taxa.length,
        records: taxa,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`Wrote raw FishBase snapshot to ${path.relative(repoRoot, rawSnapshotPath)}`);
  console.log(`Wrote FishBase summary to ${path.relative(repoRoot, summaryPath)}`);
  console.log(`Wrote FishBase taxa to ${path.relative(repoRoot, taxaPath)}`);
  console.log(`Reported total: ${summary.metrics.reportedSpeciesTotal}`);
  console.log(`Currently present: ${summary.metrics.currentlyPresent}`);
  console.log(`Extracted rows: ${rows.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
