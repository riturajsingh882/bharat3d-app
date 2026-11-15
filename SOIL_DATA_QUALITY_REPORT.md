# BHARAT 3D — Soil Geography Data-Quality & Source Audit

**Layer:** Soil Geography (ICAR 8-fold classification)
**Audit date:** 15 November 2026
**Status:** ⚠️ **Approximate / schematic** — official NBSS&LUP GIS geometry could not be openly obtained. No fabricated polygons were added.

---

## 1. Objective

Audit the existing Soil Geography layer, verify the official authoritative sources, and — if genuine official GIS data can be accessed — replace the approximate polygons with it. Where official data cannot be accessed, retain the existing layer, **clearly label it as approximate**, and document exactly what is required to obtain verified data.

---

## 2. Official sources investigated

| # | Source | URL | Result |
|---|--------|-----|--------|
| 1 | ICAR–NBSS&LUP (National Bureau of Soil Survey & Land Use Planning) | https://nbsslup.icar.gov.in/ | ✅ Authoritative publisher confirmed |
| 2 | ICAR soil-mapping programme | https://icar.gov.in/en/landmark-technologies-1 | ✅ Confirms national/state/district soil-resource mapping |
| 3 | BHOOMI Geoportal (NBSS&LUP) | https://bhoomigeoportal-nbsslup.in/ | ✅ Datasets listed (see §3); viewer access only |
| 4 | BHOOMI Geoportal — services index | https://bhoomigeoportal-nbsslup.in/BHOOMI_Geoportal/Menu/bhoomi_services_2.html | ✅ Lists all soil/terrain/agro layers |
| 5 | BHOOMI Geoportal — state-wise services | https://bhoomigeoportal-nbsslup.in/BHOOMI_StateWise/Menu/bhoomi_services.html | ✅ State/detail datasets listed |
| 6 | ISRO / NRSC Bhuvan | https://bhuvan.nrsc.gov.in/ | ◻️ Geospatial reference; soil download not confirmed open |
| 7 | Soil Health Card (DAC&FW) | https://soilhealth.dac.gov.in/ | ◻️ Supplementary nutrient data only (not soil geography) |

> Source review performed November 2026. Portal contents may change; verify before future updates.

---

## 3. Official datasets identified (BHOOMI Geoportal)

| Dataset | Scale | Coverage |
|---|---|---|
| Soil Resource Database | 1:1,000,000 | Pan-India (national) |
| Soil Resource Database | 1:250,000 | State-scale |
| Soil Resource Database | 1:50,000 | ~49–50 selected districts |
| Soil Resource Database | 1:10,000 | 114–146 selected blocks |
| WRB classification | 1:1,000,000 | Pan-India |
| Per-type layers | 1:1,000,000 | Alluvial, Black, Red, Mountainous |

These confirm the documented ICAR mapping scales: **national 1:1M, state 1:250K, and district 1:50K (selected districts only — not every district has a 1:50K dataset).**

---

## 4. Access findings

- The datasets are served through the **BHOOMI Geoportal map viewer** (visual map services).
- **No open vector export** (GeoJSON / WFS / Shapefile) was found publicly available.
- GIS download requires **registration or institutional permission** from ICAR-NBSS&LUP.
- No public API/WFS endpoint was confirmed.
- Therefore the raw official geometry **could not be retrieved** in this environment.

---

## 5. What was implemented (honest fallback)

Per the brief (“do not replace one approximate map with another approximate map”):

1. **Kept the existing approximate layer** — no new invented polygons.
2. **Added a “Soil Data Sources & Accuracy” panel** (info icon in the soil sidebar section and the on-map legend) documenting the publisher, datasets, scales, access status, classification methodology and disclaimer.
3. **Labelled the layer clearly as approximate**: “APPROX.” tag on the legend; “Schematic approximation — not official NBSS&LUP geometry” note; accuracy disclaimer in the feature info panel.
4. **Showed all 8 educational categories** in the legend — 6 mapped (solid) and **Saline/Alkaline + Peaty/Marshy marked as not mapped** (dashed), instead of implying full coverage.
5. **Documented the classification crosswalk requirement** (ICAR taxonomy ≠ the 8 educational categories).

---

## 6. Classification crosswalk

ICAR-NBSS&LUP maps use scientific **soil taxonomy** (orders, subgroups, associations). The eight traditional educational categories in this atlas are a **derived/educational grouping**, not the original ICAR legend. A documented crosswalk is required before any official dataset replaces this layer. Where an association spans multiple educational categories, that uncertainty must be preserved rather than collapsed into one category.

---

## 7. Coverage & limitations

| Item | Status |
|---|---|
| Categories mapped | 6 of 8 (Alluvial, Black/Regur, Red & Yellow, Laterite, Arid/Desert, Forest & Mountain) |
| Not mapped | Saline & Alkaline, Peaty & Marshy |
| Geometry | Approximate schematic polygons (not official) |
| Scale of current display | Schematic — not equivalent to ICAR 1:1M/1:250K/1:50K |
| District-level detail | Not available from official source in current dataset |

---

## 8. What is required to obtain verified data

1. **Request GIS access** to the NBSS&LUP Soil Resource Database via https://bhoomigeoportal-nbsslup.in/ (registration / institutional permission).
2. Obtain the **1:1M national** dataset first, then progressively add **1:250K state** and **1:50K district** datasets where available.
3. Reproject to EPSG:4326, repair invalid geometries, preserve multipolygons, and retain original soil-taxonomy attributes.
4. Build a documented **crosswalk** from ICAR taxonomy → the 8 educational categories.
5. Replace `public/data/india_soils.geojson` with the verified GeoJSON and update the layer legend/attributes accordingly.
6. Re-run visual QA against the official maps before publishing.

---

## 9. QA checklist

| Check | Status |
|---|---|
| Identifies the original ICAR dataset(s) and official URLs | ✅ Documented (§2–3) |
| Provides survey year & mapping scale | ⚠️ Scales documented; per-dataset survey year not published on the public index |
| Uses actual GIS geometries (not hand-drawn) | ❌ Not yet — official geometry not accessible |
| Preserves original ICAR soil taxonomy | ❌ Not applicable to the approximate layer |
| Documents classification crosswalk | ⚠️ Requirement documented; formal crosswalk pending official data |
| All 8 categories have working independent toggles | ⚠️ 6 mapped; 2 marked as unmapped |
| Clicking a region shows traceable soil info | ✅ Yes (with accuracy disclaimer) |
| Identifies limitations where district data unavailable | ✅ Yes (data-sources panel) |

**Honest status: the layer remains a clearly-labelled approximation.** A scientifically defensible, geographically exact soil layer requires the official NBSS&LUP GIS dataset, which needs authorised access.
