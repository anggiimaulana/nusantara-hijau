# Biodiversity Data Workspace

This folder is the staging area for the future Indonesia biodiversity pipeline.

## Intent

- Keep the current UI dataset in `data/species.json` stable.
- Store biodiversity ingestion artifacts separately.
- Make provenance, refresh timing, and source boundaries explicit.

## Folder roles

- `source-manifest.json`: manually curated list of approved data sources.
- `reports/`: generated diagnostics and snapshot outputs.
- `processed/`: generated normalized artifacts that do not yet drive the UI directly.
- `raw/`: reserved for immutable source snapshots and downloaded source files.

## Source manifest contract

Every future source entry should capture at least these fields:

- `id`: stable internal source key.
- `group`: flora, birds, fish, cross-taxa, etc.
- `role`: checklist, taxonomy backbone, observation layer, conservation layer, or benchmark.
- `url`: primary source URL.
- `access`: api, web, download, institutional, or mixed.
- `authRequired`: whether secrets or formal access are needed.
- `retrievalMethod`: fetch, api client, download, scrape, or manual import.
- `license`: best-known license or terms status.
- `citationHint`: how the source should be cited in generated outputs.
- `releaseCadence`: real-time, weekly, monthly, ad hoc, or unknown.
- `fieldMappingFocus`: which fields this source is trusted for.
- `rawSnapshotPath`: where immutable source snapshots should live.
- `checksumRequired`: whether downloaded artifacts must be hashed and recorded.
- `notes`: integration caveats and known weaknesses.

## Working rules

- Raw files should be immutable once stored.
- Processed outputs should be reproducible from scripts.
- Do not mix raw source data with curated UI copy.
- Do not claim nationwide completeness without a dated benchmark and explicit gap notes.
