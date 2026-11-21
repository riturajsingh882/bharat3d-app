# BHARAT 3D — Prerequisites, Architecture & Developer Manual

> **A Comprehensive From-Scratch Guide to Replicating, Running, and Understanding Bharat 3D.**
> 
> This document details all hardware requirements, software installations, frameworks, libraries, APIs, math formulas, data processing pipelines, touch-event architectures, UI animation models, and verified sovereign sources required to build and run this interactive 3D geographic intelligence platform.

---

## 📑 Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [System Prerequisites & Hardware Requirements](#2-system-prerequisites--hardware-requirements)
3. [Step-by-Step Installation Guide (From Scratch)](#3-step-by-step-installation-guide-from-scratch)
4. [Technology Stack & Dependency Reference](#4-technology-stack--dependency-reference)
   - [4.1 Languages & Runtimes](#41-languages--runtimes)
   - [4.2 Frameworks & Build Tools](#42-frameworks--build-tools)
   - [4.3 Geospatial & 3D Rendering Engine](#43-geospatial--3d-rendering-engine)
   - [4.4 Styling, Design System & Typography](#44-styling-design-system--typography)
   - [4.5 Mathematical Scaling & Color Interpolation](#45-mathematical-scaling--color-interpolation)
   - [4.6 UI Iconography](#46-ui-iconography)
5. [How the 3D Map Was Built From Scratch (The Technical Recipe)](#5-how-the-3d-map-was-built-from-scratch-the-technical-recipe)
   - [Phase 1: Digital Elevation Model (DEM) & RGB Tile Decoding](#phase-1-digital-elevation-model-dem--rgb-tile-decoding)
   - [Phase 2: 3D Mesh Generation & Terrain Exaggeration](#phase-2-3d-mesh-generation--terrain-exaggeration)
   - [Phase 3: Procedural Natural Mountain Summits (▲)](#phase-3-procedural-natural-mountain-summits-)
   - [Phase 4: Vector GeoJSON Ingestion & 11-Layer Architecture](#phase-4-vector-geojson-ingestion--11-layer-architecture)
   - [Phase 5: Animated Hydrological Network & Trade Route Shaders](#phase-5-animated-hydrological-network--trade-route-shaders)
   - [Phase 6: Census 2011 Data Joining & Dynamic Choropleths](#phase-6-census-2011-data-joining--dynamic-choropleths)
   - [Phase 7: Precision Dual Elevation Converter (Ft & In + Meters)](#phase-7-precision-dual-elevation-converter-ft--in--meters)
   - [Phase 8: Mobile Touch Target Hit Resolution Architecture](#phase-8-mobile-touch-target-hit-resolution-architecture)
   - [Phase 9: GPU-Accelerated Spring-Damped Accordion Engine](#phase-9-gpu-accelerated-spring-damped-accordion-engine)
   - [Phase 10: State Comparison Matrix & Analytical Logic](#phase-10-state-comparison-matrix--analytical-logic)
6. [APIs, External Tile Services & Network Endpoints](#6-apis-external-tile-services--network-endpoints)
7. [Official Sovereign Data Sources & Provenance Registry](#7-official-sovereign-data-sources--provenance-registry)
8. [Codebase Architecture & File Roles](#8-codebase-architecture--file-roles)
9. [Troubleshooting & Frequently Encountered Issues](#9-troubleshooting--frequently-encountered-issues)
10. [Updating Guidelines for Future Versions](#10-updating-guidelines-for-future-versions)

---

## 1. Executive Summary

**Bharat 3D** is a production-grade 3D Geographic Information System (GIS), civilizational atlas, and socio-demographic intelligence platform focused on the Republic of India. Unlike conventional commercial web maps that present static 2D tiles or generic world views, Bharat 3D delivers:
- **True Hardware-Accelerated 3D Terrain**: Interactive pitch up to $85^\circ$ with continuous elevation contours from AWS/SRTM elevation data.
- **Administrative & Demographic Intelligence**: 36 States & UTs (ADM1) and 735 Districts (ADM2) coupled with Census 2011 Primary Census Abstract and Table C-01 Religious demographics.
- **Physical & Hydrological Systems**: 10 animated river basins, ICAR 8-fold soil geography, and tectonic mountain orogeny.
- **Historical Atlas & Time Machine**: 13 historical eras from the Indus Valley Civilization to the modern day with a docked interactive timeline.
- **Archaeological & Cultural Explorer**: 18 ASI-verified sites with excavation histories and category color coding.
- **National Infrastructure**: 28 curated expressway and national highway corridors.
- **Disaster Risk Intelligence**: BIS 1893:2016 seismic zones and historical M7+ earthquake epicenters.
- **Absolute Geographic Integrity**: **Zero AI Hallucination**. Every coordinate, length, and statistic is verified against official government publications.

---

## 2. System Prerequisites & Hardware Requirements

Before running or developing Bharat 3D, ensure your development workstation meets the following criteria:

### Operating System:
- **Windows**: Windows 10 (Build 19041+) or Windows 11 (64-bit).
- **macOS**: macOS 12 (Monterey) or later (Apple Silicon M1/M2/M3 or Intel).
- **Linux**: Ubuntu 20.04+, Debian 11+, Fedora 36+, or Arch Linux.

### Hardware & GPU:
- **GPU (Graphics Processing Unit)**: Dedicated GPU (NVIDIA GTX 1050+, AMD Radeon RX 560+, Apple Silicon GPU) or modern integrated GPU (Intel Iris Xe, AMD Vega) with full **WebGL 2.0** support.
- **RAM**: Minimum 4 GB RAM (8 GB or higher strongly recommended for seamless 3D terrain meshing).
- **Display**: Minimum $1280 \times 720$ resolution; calibrated for $1920 \times 1080$ Full HD and mobile viewports down to $360\text{px}$.

### Software Runtimes:
- **Node.js**: **v18.18.0 or higher** (Node.js **v20 LTS** or **v22 LTS** recommended). Check with:
  ```bash
  node --version
  ```
- **Package Manager**: **pnpm** (Fast, disk space efficient package manager). Check with:
  ```bash
  pnpm --version
  ```
  *(If pnpm is not installed, install it globally using `npm install -g pnpm` or use standard `npm`).*

### Web Browser:
- Google Chrome (v90+), Microsoft Edge (v90+), Mozilla Firefox (v90+), or Apple Safari (v16+).
- **Crucial**: **Hardware Acceleration must be enabled** in browser settings (`Settings` $\rightarrow$ `System` $\rightarrow$ `Use graphics acceleration when available`).

---

## 3. Step-by-Step Installation Guide (From Scratch)

If you are cloning or opening this project on a new computer, follow these exact terminal commands:

### Step 3.1: Navigate to the Project Root
Open PowerShell (Windows) or Terminal (macOS/Linux) and navigate to the project directory:
```bash
cd "INTERACTIVE INDIA 3D DATA"
```

### Step 3.2: Enter the Application Directory
```bash
cd bharat3d-app
```

### Step 3.3: Install Dependencies
Execute the install command to download and link all required libraries:
```bash
pnpm install
```
*(Alternative if using standard npm)*:
```bash
npm install
```

### Step 3.4: Launch the Local Development Server
Start the development server with Hot Module Replacement (HMR):
```bash
pnpm dev
```
Terminal output will show:
```
  VITE v6.x.x  ready in 240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```
Hold `Ctrl` and click the link (or open your browser to `http://localhost:5173/`).

### Step 3.5: Build for Production
To generate a type-checked, minified production build:
```bash
pnpm build
```
To preview the production bundle locally:
```bash
pnpm preview
```

---

## 4. Technology Stack & Dependency Reference

### 4.1 Languages & Runtimes
- **TypeScript 5.8+ (`typescript`)**:
  - *Where used*: Across the entire application (`src/**/*.ts`, `src/**/*.tsx`).
  - *Why used*: Provides strict type definitions for GeoJSON properties, demographic census objects, camera states, historical eras, and basemap styles, preventing runtime reference errors.

### 4.2 Frameworks & Build Tools
- **React 19 (`react`, `react-dom`)**:
  - *Where used*: Application root (`src/App.tsx`), UI components (`TopNavBar.tsx`, `SidebarNav.tsx`, `InfoPanel.tsx`, `HistoricalTimeline.tsx`, `StateComparisonModal.tsx`, `SourceModal.tsx`, `BharatLogo.tsx`).
  - *Why used*: Provides declarative UI state synchronization for layer toggles, selected features, camera flying, and modal popups.
- **Vite 6 (`vite`, `@vitejs/plugin-react`)**:
  - *Where used*: Root configuration (`vite.config.ts`, `package.json`).
  - *Why used*: Next-generation build tool featuring sub-second Hot Module Replacement (HMR) and optimized Rollup-based tree-shaking for rapid production bundling.

### 4.3 Geospatial & 3D Rendering Engine
- **MapLibre GL JS v4 (`maplibre-gl`)**:
  - *Where used*: Core map component (`src/components/MapEngine.tsx`).
  - *Why used*: Open-source WebGL/WebGPU fork of Mapbox GL that natively supports true 3D digital elevation models (`setTerrain`), camera pitch/bearing controls, raster DEM decoding, custom vector line dasharray shaders, and geo-referenced canvas glyphs.

### 4.4 Styling, Design System & Typography
- **Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`)**:
  - *Where used*: Global stylesheet (`src/index.css`) and across all JSX elements.
  - *Why used*: Direct Vite-integrated CSS compiler providing zero-overhead atomic styling, custom color variables, and fluid responsive layouts.
- **Google Fonts — Cormorant Garamond**:
  - *Where used*: Loaded in `index.html` and enforced via `src/index.css`.
  - *Why used*: High-legibility classical cartographic serif typeface providing an authentic, prestigious, Survey-of-India aesthetic with full weight variants (300 to 700).

### 4.5 Mathematical Scaling & Color Interpolation
- **D3-Scale & D3-Interpolate (`d3-scale`, `d3-interpolate`)**:
  - *Where used*: Choropleth calculations in `MapEngine.tsx` and `App.tsx`.
  - *Why used*: Computes continuous color scales (plasma, viridis, custom coral-to-amber ramps) for population density, literacy rates, and sex ratio distributions across districts.

### 4.6 UI Iconography
- **Lucide React (`lucide-react`)**:
  - *Where used*: Navigation buttons, sidebar accordions, modal cards, and feature profiles.
  - *Why used*: Clean, scalable SVG icons (`Mountain`, `Waves`, `Compass`, `ShieldCheck`, `Users`, `TreePine`, `PieChart`, `Route`, `Landmark`, `Scale`, `Clock`, `AlertTriangle`, etc.).

---

## 5. How the 3D Map Was Built From Scratch (The Technical Recipe)

### Phase 1: Digital Elevation Model (DEM) & RGB Tile Decoding
Standard web maps are flat images. To make the terrain physical and three-dimensional, Bharat 3D uses **AWS Open Data Terrarium RGB Elevation Tiles**.

Each pixel in the raster tile encodes the elevation of that point on Earth using its Red, Green, and Blue color channels according to this mathematical formula:
$$\text{Elevation (meters)} = (R \times 256 + G + \frac{B}{256}) - 32,768$$

In `MapEngine.tsx`, this raster source is added to MapLibre:
```typescript
map.addSource('terrain-source', {
  type: 'raster-dem',
  tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
  encoding: 'terrarium',
  tileSize: 256,
  maxzoom: 15
});
```

### Phase 2: 3D Mesh Generation & Terrain Exaggeration
Once the DEM tiles are ingested, the MapLibre engine calculates height displacement for each vertex of the map plane, creating a true 3D mesh:
```typescript
map.setTerrain({
  source: 'terrain-source',
  exaggeration: terrainExaggeration // Fluidly scaled from 0.5x to 3.5x
});
```
When the user adjusts the **Relief Exaggeration** slider in the navigation bar, `map.setTerrain({ source: 'terrain-source', exaggeration: newVal })` dynamically recalculates the mesh heights in real time.

### Phase 3: Procedural Natural Mountain Summits (▲)
To avoid artificial or floating needle spires, Bharat 3D generates grounded, authentic cartographic summit peaks (`▲`) using an HTML5 Canvas generator in `MapEngine.tsx`:
1. Creates a high-resolution $96 \times 96$ canvas.
2. Draws a sunward facet with an ivory fill (`#FFFDF0`).
3. Draws a shaded southeastern facet with terracotta alpine tone (`#C2410C`).
4. Adds an alpine snowcap (`#FFFFFF`) with sharp contrast.
5. Ingests the canvas as a MapLibre sprite icon (`natural-summit-peak`).
6. Binds each peak to `elevation_high_points.json` coordinates (e.g., *Mt. Kangchenjunga* at 8,586m / 28,169 ft 3 in, *Anamudi* at 2,695m / 8,842 ft).

### Phase 4: Vector GeoJSON Ingestion & 11-Layer Architecture
Local geospatial vector files (`public/data/*.geojson`) are ingested asynchronously:
1. **Administrative Boundaries**:
   - `india_states.geojson`: 36 States and Union Territories (ADM1).
   - `india_districts.geojson`: 735 Districts (ADM2).
2. **Pedological Data**:
   - `india_soils.geojson`: 8 ICAR soil zones rendered with scientific color values.
3. **Hydrological Data**:
   - `india_rivers.geojson`: Vector polylines for the 10 major river systems.
4. **Orogenic Data**:
   - `india_mountains.geojson`: Major mountain chain arcs.
5. **National Highways & Expressways**:
   - `india_highways.geojson`: 28 Curated national highway and expressway corridors.
6. **Historical Atlas & Dynastic Empires**:
   - `historical_empires.geojson`: 13 Historical era territorial reconstructions.
7. **Ancient Civilizations & Archaeology**:
   - `archaeological_sites.geojson`: 18 ASI-verified monumental sites.
8. **Historical Trade Routes, Maritime Networks & Railways**:
   - `historical_trade_routes.geojson`: 27 verified features across Ancient Trade Networks, Indian Ocean Maritime, Silk Road Connections, Spice Trade Routes, 10 Ancient Ports & Emporia, Colonial Trade Networks, and Historical Railways (1853–1905).
9. **Disaster & Seismic Risk Intelligence**:
   - `disaster_seismic_zones.geojson`: BIS 1893:2016 seismic hazard zones & historic M7+ earthquake epicenters.
10. **Demographic Lookup Tables**:
    - `census_demographics.json`: Census 2011 PCA + Table C-01 statistics.
11. **Unified Search Index**:
    - `search_index.json`: Pre-indexed search tokens for instantaneous search.

### Phase 5: Animated Hydrological Network & Trade Route Shaders
To simulate moving water currents through river channels and merchant movements along trade corridors:
- A base glowing line is drawn (`rivers-layer`, `trade-glow`).
- An animated overlay line uses an animated dasharray pattern:
```typescript
let step = 0;
const animateVectors = () => {
  step = (step + 1) % 32;
  if (map.getLayer('rivers-animated-flow')) {
    map.setPaintProperty('rivers-animated-flow', 'line-dasharray', [0.5, 4, step / 4, 2]);
  }
  if (map.getLayer('trade-flow')) {
    map.setPaintProperty('trade-flow', 'line-dasharray', [1, 2, (step % 16) / 2, 2]);
  }
  requestAnimationFrame(animateVectors);
};
```
- **Historical Railway Cross-Tie Shaders**: Railway corridors use a specialized high-contrast dashed railbed styling (`trade-railways`) with `line-dasharray: [1, 1]` or cross-tie intervals in crimson (`#e11d48`) overlaid on a dark casing.
- **Ancient Port Halos & Hit Buffers**: The 10 ancient maritime ports are rendered via a multi-tier WebGL point hierarchy:
  - `trade-ports-halo`: A pulsating ambient glow ring (`#fbbf24`) with `circle-radius: 9` and `circle-opacity: 0.35`.
  - `trade-ports-core`: High-contrast golden node with a pure white border.
  - `trade-ports-labels`: Zoom-responsive typography anchored to port coordinates.
  - `trade-ports-hit-target`: A 32px radius invisible touch circle for instant mobile selection.
This produces smooth, pulsing flow vectors along all river courses and trade routes without WebGL re-binding overhead.

### Phase 6: Census 2011 Data Joining & Dynamic Choropleths
Socio-demographic data (`census_demographics.json`) is keyed by district and state ID codes:
- When a user enables **Population Density**, **Literacy**, or **Sex Ratio**, the application generates a MapLibre `interpolate` expression that maps metric numbers directly to plasma/viridis color gradients.
- This creates instant, hardware-accelerated choropleths across all 735 districts without lag.

### Phase 7: Precision Dual Elevation Converter (Ft & In + Meters)
In `src/utils/elevation.ts`, an exact mathematical converter ensures that elevations are displayed in both imperial and metric systems:
```typescript
export function metersToFeetInches(meters: number): string {
  const totalInches = meters * 39.37007874;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet.toLocaleString()} ft ${inches} in (${meters.toLocaleString()} m)`;
}
```
*(e.g., $8,586\text{ meters} \longrightarrow \mathbf{28,169\text{ ft } 3\text{ in } (8,586\text{ m})}$)*.

### Phase 8: Mobile Touch Target Hit Resolution Architecture
On touchscreen devices, fine lines (highways, rivers, mountain ridges) can be frustratingly hard to tap with finger pads:
1. **Invisible Wide Hit Buffers**: The engine adds transparent wide line layers underneath each visible vector:
   ```typescript
   map.addLayer({
     id: 'highways-hit-target',
     type: 'line',
     source: 'highways-source',
     paint: {
       'line-width': isMobile ? 32 : 18,
       'line-opacity': 0.001 // Invisible yet detectable by GPU picking
     }
   });
   ```
2. **Touch-Slop Bounding Box Query**: On tap, the engine queries an expanded $24 \times 24$ pixel bounding box around the touch coordinate:
   ```typescript
   const bbox: [maplibregl.PointLike, maplibregl.PointLike] = [
     [e.point.x - 12, e.point.y - 12],
     [e.point.x + 12, e.point.y + 12]
   ];
   const features = map.queryRenderedFeatures(bbox, { layers: interactiveLayers });
   ```
3. **Proximity-Based Hit Sorting (`sortFeaturesByProximity`)**: When multiple features intersect the bounding box, the algorithm computes the minimum Euclidean distance between the tap point and each candidate's geometry, instantly picking the nearest feature on the **first tap**.

### Phase 9: GPU-Accelerated Spring-Damped Accordion Engine
Rather than jarring show/hide snaps, accordions use CSS Grid fractional row interpolation:
```css
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.accordion-content.expanded {
  grid-template-rows: 1fr;
}
.accordion-inner {
  overflow: hidden;
}
```
This guarantees 60 FPS transitions without triggering CPU-bound reflow loops on the MapLibre canvas.

### Phase 10: State Comparison Matrix & Analytical Logic
The State Comparison Studio dynamically correlates two state objects from the Census 2011 baseline:
- Computes relative percentage differentials:
  $$\Delta \% = \frac{\text{Value}_A - \text{Value}_B}{\text{Value}_B} \times 100$$
- Normalizes population densities and decadal growth rates.
- Renders side-by-side SVG comparative distribution bars and Table C-01 faith community bars with zero external chart library overhead.

---

## 6. APIs, External Tile Services & Network Endpoints

Bharat 3D accesses the following audited open endpoints:

| Endpoint Name | Purpose | URL Pattern | Provider |
| :--- | :--- | :--- | :--- |
| **AWS Terrarium DEM** | 3D Terrain Elevation Meshing | `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png` | Amazon Web Services / Mapzen |
| **ESRI World Gray Canvas** | Obsidian Matte Dark Basemap | `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}` | ESRI / ArcGIS |
| **ESRI World Imagery** | True-Color Satellite Imagery | `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` | ESRI / Maxar / Earthstar |
| **OpenStreetMap Standard** | Global Reference Basemap | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` | OpenStreetMap Foundation |
| **Geoapify Dark Matter** | Purple-Tuned Dark Basemap | `https://maps.geoapify.com/v1/tile/dark-matter-purple-roads/{z}/{x}/{y}.png` | Geoapify Open API |
| **Google Fonts API** | Cormorant Garamond Typography | `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:...` | Google Fonts |

> [!TIP]
> All primary geographic boundaries, census statistics, highway networks, archaeological sites, and river coordinates are bundled **locally** in `bharat3d-app/public/data/`. Only the background basemap raster tiles and DEM elevation tiles stream over the network.

---

## 7. Official Sovereign Data Sources & Provenance Registry

Every data layer in Bharat 3D strictly references verified sovereign baselines:

1. **Administrative Boundaries (States & Districts)**:
   - *Authority*: **Survey of India (SOI)** & **Ministry of Panchayati Raj / Local Government Directory (LGD)**.
   - *Coverage*: 36 States & UTs (ADM1), 735 Districts (ADM2).
   - *License*: Open Government Data (OGD) / CC-BY 2.5 India.
2. **Digital Elevation Model (DEM)**:
   - *Authority*: **NASA Shuttle Radar Topography Mission (SRTM)** & **ISRO CartoDEM**.
   - *Coverage*: Pan-India 30m resolution elevation.
   - *License*: Open Data / Public Domain.
3. **Hydrological River Systems**:
   - *Authority*: **India-WRIS / Central Water Commission (CWC)**, Ministry of Jal Shakti.
   - *Coverage*: 10 major river basins, courses, dams, and confluences.
   - *License*: Open Government Data (NDSAP).
4. **Demographic & Socioeconomic Microdata**:
   - *Authority*: **Office of the Registrar General & Census Commissioner, India (ORGI)**.
   - *Coverage*: Primary Census Abstract (PCA) 2011 & 2001.
   - *License*: Government of India Open Data (`data.gov.in`).
5. **Religious Composition**:
   - *Authority*: **Census of India 2011 Table C-01 (Religion Population by District)**.
   - *Coverage*: 6 major religions across Indian districts.
   - *License*: Government of India Open Data.
6. **Soil Geography & Classification**:
   - *Authority*: **ICAR - National Bureau of Soil Survey & Land Use Planning (NBSS&LUP)**.
   - *Coverage*: 8-fold Indian Soil Classification.
   - *License*: ICAR Scientific Research Data.
7. **Orography & Mountain Ranges**:
   - *Authority*: **Geological Survey of India (GSI)** & **Survey of India**.
   - *Coverage*: Himalayas, Western Ghats, Eastern Ghats, Aravalli, Vindhyas, Satpura.
   - *License*: Government of India Mapping Products.
8. **National Highways & Expressways**:
   - *Authority*: **Ministry of Road Transport & Highways (MoRTH)** & **National Highways Authority of India (NHAI)**.
   - *Coverage*: 28 principal national expressways, NH grid lines, and scenic corridors.
   - *License*: MoRTH Open Data.
9. **Archaeological Sites & Monumental Heritage**:
   - *Authority*: **Archaeological Survey of India (ASI)** & **UNESCO World Heritage Centre**.
   - *Coverage*: 18 verified monumental archaeological excavations and ancient university centers.
   - *License*: AMASR Act / ASI Official Excavation Reports.
10. **Natural Disasters & Seismic Risk Hazard**:
    - *Authority*: **Bureau of Indian Standards (BIS IS 1893:2016 Part 1)** & **National Centre for Seismology (NCS / MoES)**.
    - *Coverage*: Seismic Zones V, IV, and III + Historical M7+ earthquake epicenters.
    - *License*: BIS / MoES Public Domain Hazard Documentation.
11. **Historical Atlas & Dynastic Frontiers**:
    - *Authority*: **Schwartzberg Historical Atlas of South Asia (University of Chicago)** & **ASI Archaeological Records**.
    - *Coverage*: 13 historical eras (Indus Valley to present day).
    - *Scholarly Note*: Explicitly classified as approximate territorial reconstructions.

---

## 8. Codebase Architecture & File Roles

Below is the directory map of the application and the responsibility of every file:

```
INTERACTIVE INDIA 3D DATA/
├── README.md                              <- High-level introduction & architecture overview
├── USER_GUIDE.md                          <- Complete operational user manual
├── PREREQUISITES_AND_ARCHITECTURE.md     <- This file (developer & prerequisites manual)
├── DATA_SOURCE_REGISTRY.md                <- Detailed scientific audit of all data sources
├── DATA_AVAILABILITY_MATRIX.md            <- Feasibility & layer availability matrix
├── start-bharat3d.bat                     <- One-click launch script for Windows
└── bharat3d-app/                          <- React + Vite web application root
    ├── package.json                       <- Project dependencies, scripts & metadata
    ├── vite.config.ts                     <- Vite configuration & React/Tailwind plugins
    ├── tsconfig.json                      <- TypeScript compilation settings
    ├── index.html                         <- HTML entry point & Google Fonts loader
    ├── scripts/
    │   └── build-search-index.mjs         <- Node script compiling search_index.json from GeoJSONs
    ├── public/
    │   ├── maplibre-gl-worker.mjs         <- Local MapLibre Web Worker bundle
    │   └── data/
    │       ├── india_states.geojson       <- 36 States & UT boundaries (ADM1)
    │       ├── india_districts.geojson    <- 735 District boundary polygons (ADM2)
    │       ├── india_rivers.geojson       <- 10 Major river basins & streams
    │       ├── india_soils.geojson        <- ICAR 8-fold soil classifications
    │       ├── india_mountains.geojson    <- Major mountain orogenic arcs
    │       ├── india_highways.geojson     <- 28 NH & Expressway corridors (MoRTH/NHAI)
    │       ├── historical_empires.geojson <- 13 Dynastic era territorial reconstructions
    │       ├── archaeological_sites.geojson <- 18 ASI-verified monumental sites
    │       ├── historical_trade_routes.geojson <- 27 features across 7 foundations (routes, maritime, silk, spice, 10 ports, colonial, railways)
    │       ├── disaster_seismic_zones.geojson <- BIS 1893 seismic zones & M7+ epicenters
    │       ├── india_urban_nodes.geojson  <- Major urban city centers
    │       ├── elevation_high_points.json <- Precision summit coordinates & ft/in data
    │       ├── census_demographics.json   <- Census 2011 PCA + C-01 demographic data
    │       └── search_index.json          <- Pre-compiled search lookup index
    └── src/
        ├── main.tsx                       <- React application root bootstrapping
        ├── App.tsx                        <- Main state orchestrator, layout, legends & modals
        ├── index.css                      <- Tailwind v4, custom theme, accordion animations & fonts
        ├── types.ts                       <- TypeScript interfaces for all data models
        ├── config.ts                      <- Default coordinates, colors & layer presets
        ├── data/
        │   └── historicalEras.ts          <- 13 Historical era metadata, rulers, and dates
        ├── utils/
        │   └── elevation.ts               <- Dual feet/inches & metric elevation converter
        └── components/
            ├── BharatLogo.tsx             <- Spatial network emblem & BHARAT 3D brand
            ├── TopNavBar.tsx              <- Navigation bar, search, presets & 3D controls
            ├── SidebarNav.tsx             <- Left layer control drawer & accordions
            ├── MapEngine.tsx              <- Core MapLibre GL 3D WebGL engine & canvas
            ├── InfoPanel.tsx              <- Right intelligence dossier & KPI dashboard
            ├── HistoricalTimeline.tsx     <- Docked bottom timeline scrubber & play controls
            ├── StateComparisonModal.tsx   <- Side-by-side dual-state comparison studio
            ├── SourceModal.tsx            <- Official Provenance & Data Registry dialog
            └── LoadingScreen.tsx          <- Initializing cinematic splash screen
```

---

## 9. Troubleshooting & Frequently Encountered Issues

### Issue 1: "WebGL: CONTEXT_LOST_WEBGL" or Flat 2D Map (No 3D Relief)
- **Cause**: Browser Hardware Acceleration is disabled, or graphics driver requires updating.
- **Resolution**:
  1. Open Chrome/Edge settings and search for `Hardware Acceleration`.
  2. Toggle `Use graphics acceleration when available` to **ON**.
  3. Relaunch the browser and navigate to `chrome://gpu` to confirm WebGL 2.0 is listed as `Hardware accelerated`.

### Issue 2: "Port 5173 is already in use"
- **Cause**: Another instance of the Vite dev server is running in the background.
- **Resolution**: Vite will automatically select the next port (e.g. `http://localhost:5174`). Alternatively, terminate the existing process:
  ```powershell
  Get-Process -Name node | Stop-Process -Force
  ```

### Issue 3: "EPERM: operation not permitted, mkdir" on Windows
- **Cause**: Windows sandbox file locking or anti-virus temporary lock during `pnpm install` or `build`.
- **Resolution**: Simply re-run the command once more; in Windows environments, this is transient.

### Issue 4: GeoJSON Layers Not Rendering Immediately
- **Cause**: Browser cache or initial loading delay on low-bandwidth connections.
- **Resolution**: Perform a hard refresh (`Ctrl + Shift + R` or `Cmd + Shift + R`). The local GeoJSON files are cached in memory for sub-second responses thereafter.

---

## 10. Updating Guidelines for Future Versions

When adding new features, datasets, or visual themes in future iterations, adhere to the following conventions:

1. **Adding a New Thematic Layer**:
   - Place the GeoJSON in `bharat3d-app/public/data/`.
   - Declare the layer type in `src/types.ts`.
   - Add the toggle control and status dot logic in `src/components/SidebarNav.tsx`.
   - Implement the MapLibre layer in `src/components/MapEngine.tsx`.
   - Re-run `node scripts/build-search-index.mjs` to include new feature names in the search bar.
   - Document the official publishing authority in `src/components/SourceModal.tsx` and `DATA_SOURCE_REGISTRY.md`.
2. **Preserving Typography**:
   - Ensure all new UI components inherit `'Cormorant Garamond'` with strong font weights (`font-bold`, `font-extrabold`) and adequate size (`text-sm` or larger) for dark-theme clarity.
3. **Data Integrity Principle**:
   - Never inject fabricated or AI-hallucinated statistics. Every entry must cite its official Government of India or audited scientific baseline.
