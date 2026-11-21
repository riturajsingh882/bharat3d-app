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
- **River systems** — animated hydrological networks with directional flow vectors.
- **Mountains & orogeny** — major ranges (GSI / SOI) and natural topographic summits (▲) with dual feet/inches and meters elevation.
- **Historical Atlas & Time Machine** — 13 eras from Indus Valley (2600 BCE) to the present, with a docked timeline slider and auto-tour controls.
- **Civilizations & archaeology** — 18 verified ASI sites across 5 categories (Indus Valley, Ancient Universities, Buddhist Monasteries, Rock-Cut Temples, Ancient Seaports) with category-colored halo rings.
- **Trade routes & connectivity (7 Foundations, 27 Verified Features)** —
  - *Ancient Trade Networks*: Uttarapatha (2,500 km), Dakshinapatha (2,100 km), Central Caravan Route (1,100 km).
  - *Indian Ocean Maritime Routes*: Western Arabian Sea Monsoon Route (3,800 km), Bay of Bengal Suvarnabhumi Network (3,400 km).
  - *Silk Road Connections*: Karakoram–Ladakh Feeder (950 km), Gandhara–Bactria Link (850 km), Sikkim–Chumbi Valley Route (780 km).
  - *Spice Trade Routes*: Malabar Coast 'Black Gold' Pepper Route (850 km), Coromandel Spice & Textile Littoral Corridor (750 km).
  - *Ancient Ports & Emporia*: 10 Monumental Seaports (Lothal, Barygaza/Bharuch, Muziris/Pattanam, Arikamedu/Poduke, Tamralipti, Sopara, Poompuhar, Korkai, Kalyan, Nelcynda) with glowing anchors and interactive coordinate dossiers.
  - *Colonial Trade Networks*: EIC Gangetic Factory Corridor (1,350 km), Bombay Cotton & Opium Artery (820 km), Coromandel Calico Corridor (680 km).
  - *Historical Railway Development (1853–1905)*: GIPR 1853 (Asia's first line), East Indian Railway 1854, Madras Railway 1856, Imperial Trunk Grid (Dalhousie master plan) with authentic railway cross-tie styling.
  - *Controls*: Granular sub-category toggles, active indicator counter (`7/7`), "Select All" / "Clear", and dynamic active legend.
- **Disaster & seismic risk** — BIS IS 1893:2016 zones (Zones V, IV, III) and historical M7+ earthquake epicenters with depth, magnitude, and casualty records.
- **National Highways & Expressways** — 28 curated corridors (tolled expressways, national highway grid, scenic state corridors) with route metadata.

### Search (data-driven)
- Unified search across **states, districts, cities, rivers, mountain ranges, peaks, archaeological sites, ancient ports, highways (e.g. "NH 44", "Delhi-Mumbai Expressway"), historical empires, and trade routes** — powered by a generated index (`public/data/search_index.json`, 1,077 entries).
- Ranked, diacritic-insensitive fuzzy matching with type badges (`State`, `District`, `River`, `Mountain`, `Archaeology`, `Port`, `Trade Route`, `Highway`, `Empire`).
- Selecting a result flies/fits the camera to it **and highlights the exact feature** (gold outline for areas/lines, gold marker for points and ports).

### Mobile & Touch Optimization
- **1-Tap Responsive Selection**: 32px invisible hit targets for fine linear features (highways, rivers, trade routes, railways) and circular hit buffers for ports and sites.
- **Euclidean Proximity Picking (`sortFeaturesByProximity`)**: Evaluates a $24\times24$ px touch bounding box to select the nearest feature on the first tap, eliminating multi-tap frustration.
- **Ergonomic Bottom Sheets**: Feature dossiers and timeline controls slide up cleanly on mobile viewports.

### UI Animations
- **Spring-Damped Accordions**: Left and right panels utilize CSS Grid `grid-template-rows: 0fr -> 1fr` interpolation with cubic-bezier easing (`cubic-bezier(0.16, 1, 0.3, 1)`), ensuring smooth 60 FPS drawer expansion without canvas layout thrashing.

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
| `historical_empires.geojson` | 13 Dynastic era territorial reconstructions & capitals |
| `archaeological_sites.geojson` | 18 ASI-verified monumental sites across 5 categories |
| `historical_trade_routes.geojson` | 27 verified trade routes, maritime circuits, 10 ancient ports & heritage railways |
| `disaster_seismic_zones.geojson` | BIS IS 1893 seismic zones & historical M7+ epicenters |
| `census_demographics.json` | District demographic lookup (PCA 2011 + Table C-01) |
| `search_index.json` | Generated search index (1,077 multi-tier tokens) |

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
