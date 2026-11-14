# Bharat 3D — Academic Atlas of India

An interactive, dark-themed 3D atlas of the Republic of India: real-time 3D terrain, administrative boundaries, thematic census choropleths, historical empires, and a national road network — all grounded in verified Government of India and scientific data.

Built with **React 19 · TypeScript · Vite · Tailwind CSS v4 · MapLibre GL JS**.

---

## Features

### Interactive 3D map
- Hardware-accelerated 3D terrain (NASA SRTM / Mapzen Terrarium DEM) with adjustable relief exaggeration (0.5×–3.5×).
- Camera controls: pan, zoom, tilt/pitch, rotate, plus curated **Views** presets (Himalayas, Indo-Gangetic Basin, Deccan, Western Ghats, Northeast, Pan-India).
- Basemap switcher: Tactile Physical Relief, ESRI Dark Gray Canvas, ESRI Satellite, OpenStreetMap, Geoapify Dark Matter.
- Hover cards and click-to-inspect dossiers with verified source provenance.

### Thematic layers (left sidebar)
- **Political boundaries** — 36 States & UTs, 735 districts, state labels.
- **Demographic intelligence** — population density, total population, literacy, sex ratio (Census 2011 PCA).
- **Faith communities** — religion choropleth by district (Census 2011 Table C-01).
- **Soil geography** — ICAR 8-fold classification.
- **River systems** — animated hydrological networks.
- **Mountains & orogeny** — major ranges (GSI / SOI).
- **Historical Atlas & Time Machine** — 13 eras from Indus Valley to the present, with a docked timeline slider.
- **Civilizations & archaeology** — 18 verified ASI sites.
- **Trade routes & connectivity** — historical land/maritime corridors.
- **Disaster & seismic risk** — BIS IS 1893 zones and historical epicenters.
- **National Highways & Expressways** — 28 curated corridors (NH grid, expressways, state highways) with route metadata.

### Search (data-driven)
- Unified search across **states, districts, cities, rivers, mountain ranges, peaks, archaeological sites, highways (e.g. "NH 44"), historical empires, and trade routes** — powered by a generated index (`public/data/search_index.json`).
- Ranked, diacritic-insensitive fuzzy matching with type badges.
- Selecting a result flies/fits the camera to it **and highlights the exact feature** (gold outline for areas/lines, gold marker for points).

### State Comparison Studio
- Compare any two states side-by-side (population, area, density, literacy, sex ratio, decadal growth, religious composition). Launched from the **Compare** button in the top navigation bar.

### Theme
- Academic **antique-gold on deep-ink** palette; **Cormorant Garamond** for display type, **Inter** for UI, **JetBrains Mono** for data.

---

## Getting started

```bash
# from this directory (bharat3d-app)
pnpm install        # or npm install
pnpm dev            # start the dev server (default http://localhost:5173)
```

Production build:

```bash
pnpm build          # type-check + Vite build -> dist/
pnpm preview        # preview the production build
pnpm lint           # oxlint
```

### Regenerate the search index
The search index is derived from the GeoJSON datasets. After editing any data file, rebuild it:

```bash
node scripts/build-search-index.mjs
```

---

## Data & provenance

All vector/data files live in [`public/data/`](public/data):

| File | Contents |
| :--- | :--- |
| `india_states.geojson` | 36 States & UTs (ADM1) with Census attributes |
| `india_districts.geojson` | 735 districts (ADM2) with Census 2011 attributes |
| `india_rivers.geojson` | Major river network centerlines |
| `india_mountains.geojson` | Major mountain ranges |
| `india_soils.geojson` | ICAR soil classifications |
| `india_elevation_points.geojson` | Named summits & spot heights |
| `india_urban_nodes.geojson` | Major urban nodes |
| `india_highways.geojson` | NH, expressway & corridor routes (MoRTH/NHAI) |
| `historical_empires.geojson` | Historical empire extents |
| `archaeological_sites.geojson` | Verified ASI sites |
| `historical_trade_routes.geojson` | Historical trade corridors |
| `disaster_seismic_zones.geojson` | BIS seismic zones & epicenters |
| `census_demographics.json` | District demographic lookup |
| `search_index.json` | Generated search index |

> Note: historical boundaries and the highway/route geometry are **approximate scholarly/cartographic reconstructions** (schematic corridors), consistent with the "verified baseline, approximate reconstruction" approach used throughout the atlas.

See the root-level [`USER_GUIDE.md`](../USER_GUIDE.md), [`DATA_SOURCE_REGISTRY.md`](../DATA_SOURCE_REGISTRY.md), and [`DATA_AVAILABILITY_MATRIX.md`](../DATA_AVAILABILITY_MATRIX.md) for the full operation manual and data provenance.

---

## Project structure

```
bharat3d-app/
├── index.html
├── public/
│   ├── data/                  # GeoJSON + JSON datasets
│   └── maplibre-gl-worker.mjs
├── scripts/
│   └── build-search-index.mjs # generates public/data/search_index.json
└── src/
    ├── App.tsx                # layout, state, legends
    ├── config.ts              # basemaps, DEM, API keys
    ├── types.ts               # shared TypeScript types
    ├── index.css              # design system (fonts, palette, panels)
    ├── data/historicalEras.ts # historical era metadata
    ├── utils/elevation.ts     # elevation formatting & registry
    └── components/
        ├── MapEngine.tsx      # MapLibre map, layers, interactions, search highlight
        ├── TopNavBar.tsx      # search, basemap, 3D, views, compare, sources
        ├── SidebarNav.tsx     # layer toggles
        ├── InfoPanel.tsx      # feature dossier drawer
        ├── HistoricalTimeline.tsx
        ├── StateComparisonModal.tsx
        ├── SourceModal.tsx
        ├── LoadingScreen.tsx
        └── BharatLogo.tsx
```

---

## Notes

- The production JS bundle is large (~1.4 MB minified) — almost entirely **MapLibre GL**; code-splitting the map engine into a lazy chunk is the next optimization if needed.
- MapLibre's worker is pointed at `/maplibre-gl-worker.mjs` (see `MapEngine.tsx`).
