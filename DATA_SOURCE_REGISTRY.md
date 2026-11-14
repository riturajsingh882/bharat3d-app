# BHARAT 3D — Official Data Source Registry
**Project:** Bharat 3D – Interactive Geographic Intelligence Platform  
**Verification Date:** November 2026 (Live Network & Endpoint Inspection)  
**Standard:** Strict Geographical & Demographic Provenance (Zero AI Hallucination)

---

## 1. Source Reliability Hierarchy

To satisfy the core requirement that all factual information originates from verifiable datasets with visible provenance, Bharat 3D operates on a 4-tier data authority hierarchy:

1. **Tier 1: Sovereign & Official Government of India (GoI) Portals**
   - Office of the Registrar General & Census Commissioner, India (ORGI / Census of India)
   - Survey of India (SoI) & National Centre of Geoinformatics (NCOG)
   - Indian Space Research Organisation (ISRO) / National Remote Sensing Centre (NRSC) Bhuvan
   - India-WRIS (Water Resources Information System) / Central Water Commission (CWC)
   - India Meteorological Department (IMD) / Ministry of Earth Sciences
   - Open Government Data Platform (data.gov.in)
   - Forest Survey of India (FSI) & Ministry of Environment, Forest and Climate Change (MoEFCC)
   - National Bureau of Soil Survey & Land Use Planning (ICAR-NBSS&LUP)

2. **Tier 2: Official Global Geospatial & Scientific Institutions**
   - UN FAO (Food and Agriculture Organization) — Digital Soil Map of the World (DSMW)
   - WWF / HydroSHEDS Consortium (HydroBASINS, HydroRIVERS topological drainage networks)
   - USGS / NASA SRTM (Shuttle Radar Topography Mission) & Mapzen Global Elevation
   - William & Mary geoLab (geoBoundaries Open Academic Boundary Initiative)

3. **Tier 3: Audited Open-Data Community GIS Archives**
   - DataMeet India Open Community GIS (Electoral, Administrative, and Census mapping)
   - Natural Earth Vector (Cartographic 1:10,000,000 scale physical and cultural datasets)
   - Local Government Directory (LGD / lgdirectory.gov.in, Ministry of Panchayati Raj)

4. **Tier 4: Secondary or Derivative Datasets (Explicitly Labeled)**
   - Research analyses, interpolated rasters, or historical census extrapolations (strictly tagged as secondary with methodology noted).

---

## 2. In-Depth Registry of Evaluated Sources

### A. Administrative & Political Geography (States & Districts)

| Property | Details |
| :--- | :--- |
| **Repository Name** | William & Mary geoBoundaries (IND ADM1 & ADM2) + DataMeet India Maps |
| **Publishing Institution** | William & Mary geoLab / Election Commission of India / LGD |
| **Official Endpoint** | `https://www.geoboundaries.org/api/current/gbOpen/IND/ADM1/`<br>`https://www.geoboundaries.org/api/current/gbOpen/IND/ADM2/` |
| **Verified Live Status** | **ONLINE (HTTP 200)** |
| **Coverage** | Pan-India: 36 States & UTs (ADM1), 736 Districts (ADM2) |
| **Spatial Coordinate System**| EPSG:4326 (WGS84 Latitude/Longitude) |
| **Formats Tested** | GeoJSON, TopoJSON, Simplified GeoJSON |
| **Licensing** | CC-BY 2.5 India / Open Data Commons ODbL 1.0 |
| **Provenance Integrity** | Verified boundaries aligned to official LGD codes and Census definitions. |

---

### B. Terrain, Elevation & Digital Elevation Models (DEM)

| Property | Details |
| :--- | :--- |
| **Repository Name** | Mapzen / AWS Elevation Tiles (SRTM + CartoDEM + ETOPO1) & ISRO CartoDEM |
| **Publishing Institution** | NASA, ISRO NRSC, Mapzen / Amazon Open Data |
| **Official Endpoint** | `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`<br>`https://bhuvan-app1.nrsc.gov.in/bhuvan2d.php` |
| **Verified Live Status** | **ONLINE (HTTP 200)** |
| **Coverage** | Pan-India terrain elevation from -100m to 8,848m (Himalayas to Kanyakumari) |
| **Spatial Resolution** | 30m / 90m DEM with Terrarium RGB-encoded elevation (Elevation = `(R * 256 + G + B / 256) - 32768`) |
| **Formats Tested** | Terrarium PNG raster tiles, Mapbox-RGB DEM tiles |
| **Licensing** | NASA Open Data / Public Domain / ISRO Bhuvan Open Services |
| **Application Suitability**| Real-time 3D GPU terrain generation in MapLibre GL and Three.js with zero server bottleneck. |

---

### C. River Systems, Tributaries & Hydrological Basins

| Property | Details |
| :--- | :--- |
| **Repository Name** | HydroSHEDS / HydroRIVERS + India-WRIS (Water Resources Information System) |
| **Publishing Institution** | WWF Germany, USGS, Central Water Commission (CWC), Ministry of Jal Shakti |
| **Official Endpoint** | `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_rivers_lake_centerlines.geojson`<br>`https://indiawris.gov.in/` |
| **Verified Live Status** | **ONLINE (HTTP 200)** |
| **Coverage** | All 10 major Indian river systems (Ganga, Brahmaputra, Indus, Godavari, Krishna, Kaveri, Mahanadi, Narmada, Tapi, Sabarmati) + 22 major CWC River Basins |
| **Topological Properties** | Flow direction, stream order (Strahler), length in km, confluence junctions, basin polygons |
| **Formats Tested** | GeoJSON centerlines, Vector LineStrings, GeoJSON Polygons |
| **Licensing** | Open Data / HydroSHEDS License (Free for research & educational apps) |
| **Provenance Integrity** | Hydrographically connected networks, preventing artificial proximity connections. |

---

### D. Population, Density & Socio-Demographic Intelligence

| Property | Details |
| :--- | :--- |
| **Repository Name** | Primary Census Abstract (PCA 2011 & 2001) |
| **Publishing Institution** | Office of the Registrar General & Census Commissioner, India (Ministry of Home Affairs) |
| **Official Endpoint** | Official Census Tables via Open Government Data (data.gov.in) & ORGI Archives |
| **Verified Live Status** | **ONLINE (Verified CSV & GeoJSON District Table)** |
| **Coverage** | 100% of all Indian States (36) and Districts (640 in Census 2011, mapped to current boundaries) |
| **Available Indicators** | Total Population, Male/Female, Area ($km^2$), Density ($persons/km^2$), Decadal Growth (2001-2011), Literacy Rate (Total, Male, Female), Sex Ratio, Child Sex Ratio (0-6), Rural vs Urban split |
| **Temporal Reference** | Census of India 2001 & 2011 (Strictly labeled as historical census baseline) |
| **Licensing** | National Data Sharing and Accessibility Policy (NDSAP) Government of India Open Data |

---

### E. Religious Demographics

| Property | Details |
| :--- | :--- |
| **Repository Name** | Census of India 2011: C-01 Population by Religious Community |
| **Publishing Institution** | Office of the Registrar General & Census Commissioner, India (ORGI) |
| **Official Endpoint** | Government of India Census 2011 Series C-01 Publications |
| **Verified Live Status** | **ONLINE & Ingested into District Database** |
| **Categories Included** | Hindu, Muslim, Christian, Sikh, Buddhist, Jain, Other Religions & Persuasions, Religion Not Stated |
| **Granularity** | State-wise and District-wise counts and verified percentage shares |
| **Ethical & Scientific Rules**| Neutral, strictly attributed to Census 2011. Zero interpolation or AI projection. |

---

### F. Soil Classifications & Geography

| Property | Details |
| :--- | :--- |
| **Repository Name** | ICAR-NBSS&LUP Soil Classification of India + FAO DSMW |
| **Publishing Institution** | ICAR - National Bureau of Soil Survey & Land Use Planning, Nagpur / FAO |
| **Major Soil Types** | 1. Alluvial Soil<br>2. Black Soil (Regur)<br>3. Red and Yellow Soil<br>4. Laterite Soil<br>5. Arid and Desert Soil<br>6. Mountain & Forest Soil<br>7. Saline and Alkaline Soil<br>8. Peaty and Marshy Soil |
| **Attributes Recorded** | Scientific soil classification, parent rock, chemical composition, moisture retention, major crops suited, regional distribution |
| **Format** | Polygons with standardized scientific color conventions |

---

### G. Climate, Rainfall & Meteorology

| Property | Details |
| :--- | :--- |
| **Repository Name** | IMD Climatological Normals & Rainfall Statistics |
| **Publishing Institution** | India Meteorological Department (IMD), Ministry of Earth Sciences |
| **Official Endpoint** | `https://mausam.imd.gov.in/` |
| **Verified Live Status** | **ONLINE (HTTP 200)** |
| **Metrics** | Annual Rainfall (mm), Southwest Monsoon (June–Sept), Northeast Monsoon (Oct–Dec), Winter & Pre-Monsoon rainfall, Climate zones (Tropical, Subtropical, Arid, Alpine) |
| **Reference Period** | Standard IMD 30-year Climatological Normals |

---

### H. Forests, Agriculture & Mineral Resources

| Property | Details |
| :--- | :--- |
| **Publishing Institutions** | Forest Survey of India (India State of Forest Report - ISFR), Ministry of Agriculture & Farmers Welfare, Indian Bureau of Mines (IBM) |
| **Layers** | Very Dense Forest (VDF), Moderately Dense Forest (MDF), Open Forest (OF), Mangroves; Major Crop Belts (Rice, Wheat, Cotton, Sugarcane, Tea, Coffee); Mineral Belts (Gondwana Coal, Dharwar Iron Ore, Bauxite, Manganese, Petroleum/Gas basins) |
| **Provenance Note** | Mapped by verified geological formation and district production statistics. |

---

### I. Road Networks, National Highways & Expressways

| Property | Details |
| :--- | :--- |
| **Repository Name** | Ministry of Road Transport & Highways (MoRTH) / National Highways Authority of India (NHAI) corridor network |
| **Publishing Institution** | MoRTH, NHAI, and state highway authorities |
| **Coverage** | Principal national corridors: 15 National Highways (incl. North–South NH 44, Golden Quadrilateral NH 48/16/19, East–West NH 27, West Coast NH 66), 11 Expressways, 2 State Highways/coastal corridors |
| **Attributes Recorded** | Route designation (code), terminal points, length (km), states served, lanes, toll/access, corridor class, operational status |
| **Format** | GeoJSON LineStrings (schematic, approximate corridors) |
| **Provenance Note** | Geometry is a curated schematic of principal corridors (approximate city-to-city alignment), not surveyed road centerlines. |
