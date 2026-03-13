import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const sourceUrl = "https://www.mammaldiversity.org/country/ID/";
const rawDirPath = path.join(repoRoot, "data", "biodiversity", "raw", "mdd-indonesia");
const processedDirPath = path.join(repoRoot, "data", "biodiversity", "processed");
const rawHtmlPath = path.join(rawDirPath, "country-id.raw.html");
const summaryPath = path.join(processedDirPath, "mdd-indonesia-summary.generated.json");

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
    .replace(/&middot;/g, "·");
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
  const response = await fetch(url, {
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "user-agent": "NusantaraHijauMDDConnector/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`MDD request failed (${response.status}) for ${url}`);
  }

  return response.text();
}

function extractCountryTotals(plainText) {
  return {
    livingSpecies: Number(plainText.match(/(\d+)\s+living/i)?.[1] ?? 0),
    extinctSpecies: Number(plainText.match(/and\s+(\d+)\s+extinct species/i)?.[1] ?? 0),
    orders: Number(plainText.match(/in\s+(\d+)\s+orders/i)?.[1] ?? 0),
    families: Number(plainText.match(/(\d+)\s+families/i)?.[1] ?? 0),
    genera: Number(plainText.match(/and\s+(\d+)\s+genera/i)?.[1] ?? 0),
  };
}

function extractOrderSummaries(html) {
  const rows = Array.from(
    html.matchAll(
      /<tr>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*>\s*<button[^>]*data-toggle="order-[^"]+">\s*([^<]+?)\s*<\/button>\s*<\/td>\s*<td[^>]*>(\d+)<\/td>\s*<td[^>]*>(\d+)<\/td>\s*<td[^>]*>(\d+)<\/td>\s*<td[^>]*>(\d+)<\/td>\s*<\/tr>/g,
    ),
  );

  return rows.map((match) => ({
    subclass: decodeEntities(match[1]).trim() || null,
    infraclass: decodeEntities(match[2]).trim() || null,
    order: decodeEntities(match[3]).trim(),
    familyCount: Number(match[4]),
    genusCount: Number(match[5]),
    livingSpecies: Number(match[6]),
    extinctSpecies: Number(match[7]),
  }));
}

async function main() {
  const generatedAt = new Date().toISOString();
  const html = await fetchText(sourceUrl);
  const plainText = stripHtml(html);
  const totals = extractCountryTotals(plainText);
  const orders = extractOrderSummaries(html);

  const summary = {
    generatedAt,
    sourceId: "mdd-indonesia",
    sourceUrl,
    metrics: totals,
    orderSummaries: orders,
    provenance: {
      pipelineStage: "source-summary",
      rawSnapshotPath: path.relative(repoRoot, rawHtmlPath),
      notes: [
        "Derived from the MDD Indonesia country page.",
        "Current scope is country-level mammal summary plus order counts, not full taxa-level export.",
      ],
    },
  };

  await mkdir(rawDirPath, { recursive: true });
  await mkdir(processedDirPath, { recursive: true });
  await writeFile(rawHtmlPath, html, "utf8");
  await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

  console.log(`Wrote MDD summary to ${path.relative(repoRoot, summaryPath)}`);
  console.log(`Living species: ${summary.metrics.livingSpecies}`);
  console.log(`Orders extracted: ${summary.orderSummaries.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
