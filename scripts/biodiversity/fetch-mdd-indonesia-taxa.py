import csv
import io
import json
from pathlib import Path
from urllib.request import Request, urlopen


REPO_ROOT = Path(r"C:\Users\rifqy\Documents\KULIAH\BELAJAR\NEXT JS\nusantara-hijau")
CSV_URL = "https://raw.githubusercontent.com/mammaldiversity/mammaldiversity.github.io/master/assets/data/mdd.csv"
RAW_DIR = REPO_ROOT / "data" / "biodiversity" / "raw" / "mdd-indonesia"
PROCESSED_DIR = REPO_ROOT / "data" / "biodiversity" / "processed"
RAW_CSV_PATH = RAW_DIR / "mdd.raw.csv"
TAXA_PATH = PROCESSED_DIR / "mdd-indonesia-taxa.generated.json"


def fetch_text(url: str) -> str:
    request = Request(url, headers={"User-Agent": "NusantaraHijauMDDTaxa/1.0"})
    with urlopen(request) as response:
        return response.read().decode("utf-8")


def to_regions(subregion_distribution: str):
    source = (subregion_distribution or "").upper()
    mappings = [
        ("ID.SU", "sumatera"),
        ("ID.JW", "jawa"),
        ("ID.KA", "kalimantan"),
        ("ID.SL", "sulawesi"),
        ("ID.PP", "papua"),
        ("ID.NT", "bali-nusra"),
        ("ID.ML", "maluku"),
    ]

    result = []
    for token, region in mappings:
        if token in source and region not in result:
            result.append(region)
    return result


def split_common_names(value: str):
    if not value:
        return []
    return [part.strip() for part in value.split("|") if part.strip()]


def build_record(row: dict, generated_at: str):
    scientific_name = (row.get("sciName") or "").replace("_", " ").strip()
    common_names = []

    main_common_name = (row.get("mainCommonName") or "").strip()
    if main_common_name:
        common_names.append({"name": main_common_name, "language": "en", "preferred": True})

    for name in split_common_names(row.get("otherCommonNames") or ""):
        common_names.append({"name": name, "language": "en", "preferred": False})

    internal_id = f"mdd:{(row.get('id') or '').strip()}"
    country_distribution = row.get("countryDistribution") or ""
    subregion_distribution = row.get("subregionDistribution") or ""

    return {
        "internalId": internal_id,
        "scientificName": scientific_name,
        "scientificNameAuthorship": None,
        "acceptedName": scientific_name,
        "taxonomicStatus": "accepted",
        "commonNames": common_names,
        "taxonomy": {
            "kingdom": "Animalia",
            "phylum": "Chordata",
            "class": "Mammalia",
            "order": (row.get("order") or None),
            "family": (row.get("family") or None),
            "genus": (row.get("genus") or None),
            "species": (row.get("specificEpithet") or None),
            "rank": "species",
        },
        "distribution": {
            "country": "Indonesia",
            "regions": to_regions(subregion_distribution),
            "provinces": [],
            "presenceType": "present",
            "distributionNotes": country_distribution or None,
        },
        "conservation": {
            "iucnCode": (row.get("iucnStatus") or None),
            "iucnLabelId": None,
            "populationText": None,
            "threatsText": None,
        },
        "media": {
            "imagePath": None,
            "accentColor": None,
        },
        "sources": [
            {
                "sourceId": "mdd-indonesia",
                "sourceUrl": CSV_URL,
                "externalId": (row.get("id") or None),
                "retrievedAt": generated_at,
                "license": "website terms apply",
                "fieldsTrusted": [
                    "scientificName",
                    "commonNames",
                    "taxonomy.order",
                    "taxonomy.family",
                    "distribution",
                    "conservation.iucnCode",
                ],
            }
        ],
        "provenance": {
            "generatedAt": generated_at,
            "pipelineStage": "normalized",
            "rawSnapshotPath": str(RAW_CSV_PATH.relative_to(REPO_ROOT)).replace("/", "\\"),
            "notes": [
                "Derived from Mammal Diversity Database CSV filtered to records whose countryDistribution includes Indonesia.",
                "Multi-country distributions are retained when Indonesia is included.",
            ],
        },
    }


def main():
    from datetime import datetime, timezone

    generated_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    csv_text = fetch_text(CSV_URL)

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    RAW_CSV_PATH.write_text(csv_text, encoding="utf-8")

    reader = csv.DictReader(io.StringIO(csv_text))
    rows = [row for row in reader if "Indonesia" in (row.get("countryDistribution") or "")]
    records = [build_record(row, generated_at) for row in rows]

    payload = {
        "generatedAt": generated_at,
        "sourceId": "mdd-indonesia",
        "sourceUrl": CSV_URL,
        "recordCount": len(records),
        "records": records,
    }

    TAXA_PATH.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    print(f"Wrote MDD taxa to {TAXA_PATH.relative_to(REPO_ROOT)}")
    print(f"MDD Indonesia taxa records: {len(records)}")


if __name__ == "__main__":
    main()
