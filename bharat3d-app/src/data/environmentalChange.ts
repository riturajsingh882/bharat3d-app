import type { EnvironmentalPillar } from '../types';

export interface EnvironmentalPillarMeta {
  id: EnvironmentalPillar;
  title: string;
  shortTitle: string;
  subtitle: string;
  iconName: string;
  color: string;
  authority: string;
  baselineYear: string;
  comparisonYear: string;
  availableYears: string[];
  metricLabel: string;
  metricUnit: string;
  description: string;
  keyFinding: string;
}

export const ENVIRONMENTAL_PILLARS: Record<EnvironmentalPillar, EnvironmentalPillarMeta> = {
  forest_change: {
    id: 'forest_change',
    title: 'Forest-Cover Changes',
    shortTitle: 'Forest Cover',
    subtitle: 'Canopy Density & State of Forest Assessments',
    iconName: 'TreePine',
    color: '#10b981',
    authority: 'Forest Survey of India (FSI), MoEFCC',
    baselineYear: '2001',
    comparisonYear: '2021',
    availableYears: ['2001', '2011', '2021'],
    metricLabel: 'Canopy Forest Extent',
    metricUnit: 'sq km',
    description: 'Decadal assessment of Very Dense, Moderately Dense, Open Forest and Mangrove cover based on satellite remote sensing (IRS LISS-III).',
    keyFinding: 'National forest cover expanded by +2.2% from 675,538 sq km (2001) to 713,789 sq km (2021), but Northeast tribal states lost over 3,200 sq km of primary canopy due to shifting cultivation.'
  },
  glacier_retreat: {
    id: 'glacier_retreat',
    title: 'Himalayan Glacier Retreat',
    shortTitle: 'Glacier Retreat',
    subtitle: 'Snout Position, Ice Mass & GLOF Hazards',
    iconName: 'Mountain',
    color: '#06b6d4',
    authority: 'Space Applications Centre (SAC - ISRO) & GSI',
    baselineYear: '1965',
    comparisonYear: '2022',
    availableYears: ['1965', '1990', '2000', '2022'],
    metricLabel: 'Terminus Snout Shift / Ice Area',
    metricUnit: 'm retreat / sq km',
    description: 'Long-term monitoring of major Himalayan glacial termini in the Indus, Ganga, and Brahmaputra headwaters (Gangotri, Siachen, Zemu, Kolhai, Bara Shigri).',
    keyFinding: 'Gangotri Glacier has retreated over 1,530 meters since the 1960s (~22 m/year), with expanding supra-glacial lakes and moraine-dammed GLOF vulnerabilities across Uttarakhand and Sikkim.'
  },
  urban_expansion: {
    id: 'urban_expansion',
    title: 'Metropolitan Urban Expansion',
    shortTitle: 'Urban Sprawl',
    subtitle: 'Decadal Land-Use & Built-Up Surface Growth',
    iconName: 'Building2',
    color: '#f97316',
    authority: 'National Remote Sensing Centre (NRSC / ISRO) & Census',
    baselineYear: '1991',
    comparisonYear: '2021',
    availableYears: ['1991', '2001', '2011', '2021'],
    metricLabel: 'Contiguous Built-Up Area',
    metricUnit: 'sq km',
    description: 'Multi-decadal satellite mapping of impervious urban footprint growth across major agglomerations (Delhi NCR, Bengaluru, Mumbai MMR, Hyderabad, Chennai).',
    keyFinding: 'Bengaluru paved built-up surface expanded by >340% (from 165 to 741 sq km) with an 80% loss in living interconnected water tanks; Delhi NCR expanded by >270% over peri-urban croplands.'
  },
  coastal_erosion: {
    id: 'coastal_erosion',
    title: 'Coastal Erosion & Shoreline Dynamics',
    shortTitle: 'Coastal Erosion',
    subtitle: 'Shoreline Displacement & Accretion Rates',
    iconName: 'Waves',
    color: '#ef4444',
    authority: 'National Centre for Coastal Research (NCCR / MoES)',
    baselineYear: '1990',
    comparisonYear: '2022',
    availableYears: ['1990', '2006', '2018', '2022'],
    metricLabel: 'Shoreline Shift Rate',
    metricUnit: 'm/year displacement',
    description: 'High-resolution shoreline change analysis across 6,632 km of mainland coastline: 33.6% under active erosion, 26.9% accreting, and 39.5% stable.',
    keyFinding: 'West Bengal leads national erosion vulnerability with 60.5% of its coastline retreating; southern Sagar Island experiences severe erosion up to 16-20 m/year, displacing coastal mouzas.'
  },
  wetland_change: {
    id: 'wetland_change',
    title: 'Wetland & Lake Contraction',
    shortTitle: 'Wetlands',
    subtitle: 'Open Water Spread & Ramsar Conservation Status',
    iconName: 'Droplets',
    color: '#3b82f6',
    authority: 'SAC - ISRO (National Wetland Atlas) & MoEFCC',
    baselineYear: '1990',
    comparisonYear: '2020',
    availableYears: ['1990', '2006', '2020'],
    metricLabel: 'Open Water Spread Area',
    metricUnit: 'sq km',
    description: 'Temporal analysis of major inland and coastal wetlands (Chilika, Vembanad, Wular, Loktak, Sambhar, Kolleru) assessing reclamation, siltation, and weed encroachment.',
    keyFinding: 'Wular Lake open water spread shrank by over 57% due to siltation and willow plantations; Chilika Lake demonstrated significant ecological recovery following the 2000 tidal mouth dredging.'
  },
  desertification: {
    id: 'desertification',
    title: 'Desertification & Land Degradation',
    shortTitle: 'Desertification',
    subtitle: 'Wind & Water Erosion, Salinization & Scrub Transition',
    iconName: 'Sun',
    color: '#eab308',
    authority: 'SAC - ISRO Desertification Atlas & CAZRI',
    baselineYear: '2003',
    comparisonYear: '2018',
    availableYears: ['2003', '2011', '2018'],
    metricLabel: 'Degraded Land Share of TGA',
    metricUnit: '% of Geographic Area',
    description: 'Remote sensing assessment across 328 million hectares: ~29.7% of India undergoes land degradation, driven by wind erosion in arid west and water erosion in peninsular uplands.',
    keyFinding: 'Over 66% of western Rajasthan remains degraded by wind erosion; Aravalli range mining breaches opened 12 sand drift gaps towards Haryana, while Chambal ravines expand into fertile uplands.'
  },
  groundwater_stress: {
    id: 'groundwater_stress',
    title: 'Groundwater Stress & Over-Exploitation',
    shortTitle: 'Groundwater',
    subtitle: 'Dynamic Extraction Stages & Aquifer Depletion',
    iconName: 'Gauge',
    color: '#a855f7',
    authority: 'Central Ground Water Board (CGWB), Ministry of Jal Shakti',
    baselineYear: '2004',
    comparisonYear: '2022',
    availableYears: ['2004', '2011', '2017', '2022'],
    metricLabel: 'Stage of GW Extraction',
    metricUnit: '% of recharge extracted',
    description: 'National assessment across 7,089 administrative blocks: categorizing extraction as Safe (<70%), Semi-Critical (70-90%), Critical (90-100%), and Over-Exploited (>100%).',
    keyFinding: 'Punjab extraction stage reached an alarming 164% (76% of blocks Over-Exploited) and Haryana 134%, driven by intensive tubewell irrigation; Marwar Rajasthan draws deep fossil water at 188% stage.'
  },
  river_avulsion: {
    id: 'river_avulsion',
    title: 'River Course Migration & Avulsion',
    shortTitle: 'River Avulsion',
    subtitle: 'Historical Nodal Avulsions, Bankline Erosion & Paleochannels',
    iconName: 'Compass',
    color: '#14b8a6',
    authority: 'National Remote Sensing Centre (NRSC) & CWC',
    baselineYear: '1950',
    comparisonYear: '2022',
    availableYears: ['1780', '1950', '2008', '2022'],
    metricLabel: 'Channel Migration Distance',
    metricUnit: 'km displacement',
    description: 'Geomorphological mapping of subcontinental river migration: Kosi 120 km westward avulsion and 2008 breach, Brahmaputra channel widening at Majuli, and Saraswati paleochannels.',
    keyFinding: 'The Kosi migrated westward by >120 km over 250 years before avulsing 100 km eastward in the 2008 Kusaha breach; Majuli Island contracted from ~750 sq km (1950) to ~380 sq km due to toe erosion.'
  }
};

export const ALL_ENVIRONMENTAL_PILLARS: EnvironmentalPillar[] = [
  'forest_change',
  'glacier_retreat',
  'urban_expansion',
  'coastal_erosion',
  'wetland_change',
  'desertification',
  'groundwater_stress',
  'river_avulsion'
];

export interface ObservationDateMeta {
  year: string;
  month: string;
  monthIndex: number; // 0-11
  day: number;
  label: string;
  season: string;
  sensor: string;
  cycleName: string;
}

export const PILLAR_OBSERVATION_DATES: Record<EnvironmentalPillar, Record<string, ObservationDateMeta>> = {
  forest_change: {
    '2001': { year: '2001', month: 'October', monthIndex: 9, day: 15, label: 'Oct 2001', season: 'Post-Monsoon', sensor: 'IRS-1C LISS-III', cycleName: 'ISFR 2001 Biennial Assessment' },
    '2011': { year: '2011', month: 'November', monthIndex: 10, day: 18, label: 'Nov 2011', season: 'Post-Monsoon', sensor: 'IRS-P6 ResourceSat-1', cycleName: 'ISFR 2011 Decadal Baseline' },
    '2021': { year: '2021', month: 'December', monthIndex: 11, day: 22, label: 'Dec 2021', season: 'Winter Canopy', sensor: 'ResourceSat-2A LISS-III', cycleName: 'ISFR 2021 Modern Benchmark' }
  },
  glacier_retreat: {
    '1965': { year: '1965', month: 'March', monthIndex: 2, day: 12, label: 'Mar 1965', season: 'Pre-Melt Baseline', sensor: 'Corona KH-4 Satellite', cycleName: 'Corona Satellite Historical Snout Datum' },
    '1990': { year: '1990', month: 'October', monthIndex: 9, day: 24, label: 'Oct 1990', season: 'Post-Monsoon', sensor: 'Landsat-5 TM', cycleName: 'Landsat TM Multispectral Terminus' },
    '2000': { year: '2000', month: 'June', monthIndex: 5, day: 15, label: 'Jun 2000', season: 'Early Summer', sensor: 'NASA SRTM & ETM+', cycleName: 'Millennium Digital Elevation Datum' },
    '2022': { year: '2022', month: 'November', monthIndex: 10, day: 10, label: 'Nov 2022', season: 'Autumn Clear', sensor: 'Sentinel-2A & Cartosat-3', cycleName: 'SAC-ISRO Contemporary Cryosphere Release' }
  },
  urban_expansion: {
    '1991': { year: '1991', month: 'March', monthIndex: 2, day: 1, label: 'Mar 1991', season: 'Spring Census', sensor: 'Landsat-5 & Survey of India', cycleName: 'Decadal Census 1991 Urban Footprint' },
    '2001': { year: '2001', month: 'March', monthIndex: 2, day: 1, label: 'Mar 2001', season: 'Spring Census', sensor: 'IRS-1C LISS-III', cycleName: 'Decadal Census 2001 Metros' },
    '2011': { year: '2011', month: 'March', monthIndex: 2, day: 1, label: 'Mar 2011', season: 'Spring Census', sensor: 'Cartosat-1 / LISS-IV', cycleName: 'Decadal Census 2011 LULC Footprint' },
    '2021': { year: '2021', month: 'November', monthIndex: 10, day: 15, label: 'Nov 2021', season: 'Post-Monsoon', sensor: 'NRSC Decadal Bhuvan LULC', cycleName: 'NRSC Decadal Megacity Expansion' }
  },
  coastal_erosion: {
    '1990': { year: '1990', month: 'January', monthIndex: 0, day: 15, label: 'Jan 1990', season: 'Winter Littoral', sensor: 'Survey of India HWL Baseline', cycleName: 'National Shoreline Baseline (MoES)' },
    '2006': { year: '2006', month: 'May', monthIndex: 4, day: 20, label: 'May 2006', season: 'Post-Tsunami', sensor: 'IRS-P6 AWiFS & LISS-IV', cycleName: 'Post-2004 Tsunami Coastline Survey' },
    '2018': { year: '2018', month: 'June', monthIndex: 5, day: 10, label: 'Jun 2018', season: 'Pre-Monsoon', sensor: 'NCCR-MoES Shoreline Change Atlas', cycleName: 'NCCR National Shoreline Assessment' },
    '2022': { year: '2022', month: 'December', monthIndex: 11, day: 30, label: 'Dec 2022', season: 'Winter Littoral', sensor: 'Sentinel-2 & High-Res DGPS', cycleName: 'Contemporary Littoral Displacement' }
  },
  wetland_change: {
    '1990': { year: '1990', month: 'February', monthIndex: 1, day: 2, label: 'Feb 1990', season: 'World Wetlands Day', sensor: 'Landsat-5 Pre-Ramsar', cycleName: 'National Pre-Ramsar Baseline' },
    '2006': { year: '2006', month: 'October', monthIndex: 9, day: 15, label: 'Oct 2006', season: 'Post-Monsoon Open Water', sensor: 'IRS LISS-III Wetland Atlas', cycleName: 'SAC National Wetland Atlas Cycle 1' },
    '2020': { year: '2020', month: 'February', monthIndex: 1, day: 18, label: 'Feb 2020', season: 'Winter Waterfowl', sensor: 'Sentinel-2 & SAC VEDAS', cycleName: 'Ramsar Conservation Modern Survey' }
  },
  desertification: {
    '2003': { year: '2003', month: 'May', monthIndex: 4, day: 25, label: 'May 2003', season: 'Pre-Monsoon Arid', sensor: 'IRS AWiFS Satellite', cycleName: 'SAC Desertification Atlas Cycle 1' },
    '2011': { year: '2011', month: 'May', monthIndex: 4, day: 28, label: 'May 2011', season: 'Summer Peak', sensor: 'ResourceSat-1 AWiFS', cycleName: 'SAC Desertification Atlas Cycle 2' },
    '2018': { year: '2018', month: 'June', monthIndex: 5, day: 12, label: 'Jun 2018', season: 'Pre-Monsoon Arid', sensor: 'ResourceSat-2 AWiFS & CAZRI', cycleName: 'SAC Desertification Atlas Cycle 3' }
  },
  groundwater_stress: {
    '2004': { year: '2004', month: 'March', monthIndex: 2, day: 31, label: 'Mar 2004', season: 'Pre-Monsoon Hydro', sensor: 'CGWB National Well Network', cycleName: 'National Dynamic GW Assessment 2004' },
    '2011': { year: '2011', month: 'March', monthIndex: 2, day: 31, label: 'Mar 2011', season: 'Pre-Monsoon Hydro', sensor: 'CGWB Assessment Block Matrix', cycleName: 'National Dynamic GW Assessment 2011' },
    '2017': { year: '2017', month: 'March', monthIndex: 2, day: 31, label: 'Mar 2017', season: 'Pre-Monsoon Hydro', sensor: 'CGWB & State GW Depts', cycleName: 'National Dynamic GW Assessment 2017' },
    '2022': { year: '2022', month: 'October', monthIndex: 9, day: 31, label: 'Oct 2022', season: 'Post-Monsoon Infiltration', sensor: 'INGRES Digital Assessment Platform', cycleName: 'CGWB INGRES Sovereign Benchmark' }
  },
  river_avulsion: {
    '1780': { year: '1780', month: 'January', monthIndex: 0, day: 1, label: 'Jan 1780', season: 'Historical Winter', sensor: 'Major James Rennell Bengal Atlas', cycleName: 'Pre-Avulsion Historical Fluvial Course' },
    '1950': { year: '1950', month: 'August', monthIndex: 7, day: 15, label: 'Aug 1950', season: 'Monsoon Flood', sensor: 'Survey of India 1-Inch Toposheets', cycleName: 'Pre-1950 Earthquake Channel Datum' },
    '2008': { year: '2008', month: 'August', monthIndex: 7, day: 18, label: 'Aug 2008', season: 'Kusaha Breach', sensor: 'MODIS & IRS LISS-IV Disaster Rapid', cycleName: 'Kosi 100km Avulsion Breach Datum' },
    '2022': { year: '2022', month: 'October', monthIndex: 9, day: 10, label: 'Oct 2022', season: 'Post-Monsoon', sensor: 'Sentinel-2 & CWC Fluvial Records', cycleName: 'Contemporary Braided River Geometry' }
  }
};

export interface PillarViewport {
  lat: number;
  lng: number;
  zoom: number;
  pitch: number;
  bearing: number;
  description: string;
}

export const PILLAR_VIEWPORTS: Record<EnvironmentalPillar, PillarViewport> = {
  forest_change: {
    lat: 13.85,
    lng: 75.35,
    zoom: 6.8,
    pitch: 45,
    bearing: -8,
    description: 'Western Ghats Montane Forest Corridor'
  },
  glacier_retreat: {
    lat: 31.05,
    lng: 78.95,
    zoom: 7.8,
    pitch: 55,
    bearing: 25,
    description: 'Himalayan Glaciers & Gangotri-Gaumukh Snout'
  },
  urban_expansion: {
    lat: 28.61,
    lng: 77.23,
    zoom: 8.5,
    pitch: 48,
    bearing: -12,
    description: 'Delhi-NCR Megalopolis & Built-up Sprawl Corridor'
  },
  coastal_erosion: {
    lat: 21.65,
    lng: 87.85,
    zoom: 8.0,
    pitch: 42,
    bearing: 10,
    description: 'Sagar Island & Northern Bay of Bengal Coastal Front'
  },
  wetland_change: {
    lat: 19.72,
    lng: 85.32,
    zoom: 8.8,
    pitch: 45,
    bearing: -5,
    description: 'Chilika Lake Lagoon & Ramsar Estuarine Wetland'
  },
  desertification: {
    lat: 26.65,
    lng: 72.85,
    zoom: 7.2,
    pitch: 45,
    bearing: 18,
    description: 'Thar Desert Eastern Transition Fringe & Aravalli Sand Drift Gaps'
  },
  groundwater_stress: {
    lat: 30.25,
    lng: 75.85,
    zoom: 7.5,
    pitch: 48,
    bearing: -10,
    description: 'Indo-Gangetic Northwestern Granary Aquifers & Over-Exploited Blocks'
  },
  river_avulsion: {
    lat: 25.95,
    lng: 86.85,
    zoom: 8.2,
    pitch: 50,
    bearing: 15,
    description: 'Kosi River 120 km Avulsion Fan & 2008 Kusaha Breach Corridor'
  }
};

export interface MonitoredHotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom?: number;
}

export const PILLAR_HOTSPOTS: Record<EnvironmentalPillar, MonitoredHotspot[]> = {
  forest_change: [
    { id: "forest-western-ghats", name: "Western Ghats", lat: 14.5, lng: 75.0, zoom: 7.5 },
    { id: "forest-northeast-tribal", name: "Northeast Tribal Belt", lat: 25.5, lng: 93.0, zoom: 7.5 },
    { id: "forest-sundarbans-mangroves", name: "Sundarbans Mangrove", lat: 21.9, lng: 88.9, zoom: 9 },
    { id: "forest-eastern-ghats", name: "Eastern Ghats", lat: 17.2, lng: 82.0, zoom: 7.5 },
    { id: "forest-central-highlands", name: "Central Sal & Teak", lat: 22.5, lng: 80.5, zoom: 7.5 }
  ],
  glacier_retreat: [
    { id: "glacier-gangotri", name: "Gangotri / Gaumukh", lat: 30.92, lng: 79.08, zoom: 11 },
    { id: "glacier-siachen", name: "Siachen Glacier", lat: 35.50, lng: 77.10, zoom: 10 },
    { id: "glacier-chorabari", name: "Chorabari (Kedarnath)", lat: 30.75, lng: 79.05, zoom: 12 },
    { id: "glacier-zemu", name: "Zemu (Sikkim)", lat: 27.75, lng: 88.22, zoom: 10.5 },
    { id: "glacier-kolhai", name: "Kolhai (Kashmir)", lat: 34.18, lng: 75.33, zoom: 11 },
    { id: "glacier-bara-shigri", name: "Bara Shigri (Spiti)", lat: 32.25, lng: 77.60, zoom: 11 }
  ],
  urban_expansion: [
    { id: "urban-delhi-ncr", name: "Delhi NCR", lat: 28.60, lng: 77.15, zoom: 9 },
    { id: "urban-bengaluru", name: "Bengaluru BBMP", lat: 12.97, lng: 77.60, zoom: 10 },
    { id: "urban-mumbai-mmr", name: "Mumbai MMR", lat: 19.12, lng: 72.95, zoom: 9.5 },
    { id: "urban-hyderabad", name: "Hyderabad ORR", lat: 17.40, lng: 78.45, zoom: 9.5 },
    { id: "urban-chennai", name: "Chennai OMR", lat: 12.95, lng: 80.15, zoom: 9.5 }
  ],
  coastal_erosion: [
    { id: "coastal-sundarbans-sagar", name: "Sagar Island (WB)", lat: 21.60, lng: 88.15, zoom: 10.5 },
    { id: "coastal-odisha-kendrapara", name: "Satabhaya (Odisha)", lat: 20.62, lng: 86.95, zoom: 10.5 },
    { id: "coastal-kerala-chellanam", name: "Chellanam (Kerala)", lat: 9.70, lng: 76.28, zoom: 10.5 },
    { id: "coastal-puducherry-ennore", name: "Puducherry Coast", lat: 11.93, lng: 79.83, zoom: 11 },
    { id: "coastal-gujarat-khambhat", name: "Gulf of Khambhat", lat: 21.80, lng: 72.35, zoom: 10 }
  ],
  wetland_change: [
    { id: "wetland-chilika", name: "Chilika Lagoon", lat: 19.68, lng: 85.35, zoom: 9.5 },
    { id: "wetland-vembanad", name: "Vembanad-Kol", lat: 9.65, lng: 76.38, zoom: 9.5 },
    { id: "wetland-wular", name: "Wular Lake", lat: 34.35, lng: 74.58, zoom: 10.5 },
    { id: "wetland-loktak", name: "Loktak & Phumdis", lat: 24.52, lng: 93.82, zoom: 10.5 },
    { id: "wetland-kolleru", name: "Kolleru Lake", lat: 16.65, lng: 81.30, zoom: 10 },
    { id: "wetland-sambhar", name: "Sambhar Salt Lake", lat: 26.92, lng: 75.05, zoom: 10 }
  ],
  desertification: [
    { id: "desert-thar-eastern", name: "Thar Fringe (Rajasthan)", lat: 27.00, lng: 72.20, zoom: 7.5 },
    { id: "desert-aravalli-breach", name: "Aravalli Gaps (NCR)", lat: 27.95, lng: 76.65, zoom: 9 },
    { id: "desert-rayalaseema-scrub", name: "Rayalaseema Scrub", lat: 14.68, lng: 77.60, zoom: 8 },
    { id: "desert-chambal-badlands", name: "Chambal Ravines", lat: 26.30, lng: 78.20, zoom: 9 },
    { id: "desert-rann-saurashtra", name: "Rann & Banni", lat: 23.60, lng: 69.50, zoom: 8.5 }
  ],
  groundwater_stress: [
    { id: "gw-punjab-haryana", name: "Punjab Granary", lat: 30.25, lng: 75.85, zoom: 8 },
    { id: "gw-western-rajasthan", name: "Marwar Fossil Aquifers", lat: 26.25, lng: 72.75, zoom: 8 },
    { id: "gw-delhi-ncr", name: "Delhi NCR Cones", lat: 28.60, lng: 77.20, zoom: 10 },
    { id: "gw-tamilnadu-cauvery", name: "Tamil Nadu Hard-Rock", lat: 11.00, lng: 77.50, zoom: 8.5 },
    { id: "gw-gangetic-eastern", name: "Eastern Gangetic Plain", lat: 25.50, lng: 85.50, zoom: 8 }
  ],
  river_avulsion: [
    { id: "river-kosi-migration", name: "Kosi Avulsion Corridor", lat: 26.10, lng: 86.90, zoom: 8.5 },
    { id: "river-brahmaputra-majuli", name: "Majuli Island (Assam)", lat: 26.95, lng: 94.20, zoom: 9.5 },
    { id: "river-ganga-malda", name: "Malda Ganga Migration", lat: 24.90, lng: 88.00, zoom: 9.5 },
    { id: "river-saraswati-paleochannel", name: "Saraswati Paleochannel", lat: 28.80, lng: 74.20, zoom: 7 },
    { id: "river-teesta-avulsion", name: "Teesta Historic Avulsion", lat: 26.50, lng: 88.80, zoom: 9 }
  ]
};

export const findPillarForHotspot = (hotspotId: string): EnvironmentalPillar | undefined => {
  for (const [pillar, hotspots] of Object.entries(PILLAR_HOTSPOTS)) {
    if (hotspots.some(h => h.id === hotspotId)) {
      return pillar as EnvironmentalPillar;
    }
  }
  return undefined;
};

export const findHotspotById = (hotspotId: string): MonitoredHotspot | undefined => {
  for (const hotspots of Object.values(PILLAR_HOTSPOTS)) {
    const found = hotspots.find(h => h.id === hotspotId);
    if (found) return found;
  }
  return undefined;
};

// ============================================================================
// DYNAMIC MULTI-DECADAL TEMPORAL FINDINGS (YEAR-BY-YEAR / EPOCH-BY-EPOCH)
// ============================================================================

export const PILLAR_TEMPORAL_FINDINGS: Record<EnvironmentalPillar, Record<string, string>> = {
  forest_change: {
    '2001-2011': 'ISFR Decadal Cycle 2001 to 2011: National recorded forest canopy increased by +16,400 sq km (+2.4%), primarily through social forestry and commercial monoculture plantations in southern and central states; however, Northeast tribal hill tracts suffered a net loss of -1,685 sq km from shortened jhum shifting cultivation cycles.',
    '2011-2021': 'ISFR Decadal Cycle 2011 to 2021: Total tree and forest canopy added +21,850 sq km (+3.1%), driven by agroforestry and scrub regeneration; however, core evergreen interior forests in the Western Ghats and Andaman Islands experienced persistent linear fragmentation from infrastructure corridors.',
    '2001-2021': 'Comprehensive 20-Year Assessment (2001–2021): National forest canopy expanded from 675,538 sq km to 713,789 sq km (+5.66%), but primary interior dense forests contracted by >3,200 sq km in the Northeast, offset quantitatively by open commercial agro-plantations (rubber, coffee, eucalyptus).'
  },
  glacier_retreat: {
    '1965-1990': 'Corona to Landsat-5 Benchmark (1965–1990): Gangotri snout retreated ~580 m (avg ~23.2 m/yr); Siachen glacier terminus receded ~1.7 km with nascent lateral moraine disintegration under early warming signals.',
    '1990-2000': 'Decadal Satellite Transition (1990–2000): Snout retreat rate accelerated across the Central and Western Himalayas; Gangotri retreated an additional ~310 m (~31.0 m/yr), and Chorabari glacier formed supra-glacial ponds, triggering preliminary GLOF hazard advisories.',
    '2000-2022': 'Modern Cryosphere Benchmark (2000–2022): High-resolution Sentinel-2 and Cartosat-3 monitoring revealed sustained glacier thinning and terminus fragmentation; Gangotri snout retreated ~640 m, and total Himalayan glacierized area contracted by ~13.5% with expanding proglacial moraine-dammed lakes.',
    '1965-2000': '35-Year Pre-Millennium Datum (1965–2000): Cumulative terminus retreat exceeded 890 m at Gangotri and 3.1 km at Siachen, documenting the onset of widespread debris-covered ice ablation.',
    '1990-2022': '32-Year Digital Satellite Epoch (1990–2022): Terminus retreat reached ~950 m at Gangotri (~29.7 m/yr) and supra-glacial lake expansion increased GLOF risks tenfold across the Teesta and Alaknanda headwaters.',
    '1965-2022': 'Long-Baseline 57-Year Satellite Record (1965–2022): Gangotri snout retreated over 1,530 meters cumulative; Kashmir’s Kolahoi glacier hollowed out with >32% mass volume reduction, severely affecting Indus basin summer melt discharge.'
  },
  urban_expansion: {
    '1991-2001': 'Decadal Census 1991 to 2001: Initial post-liberalization economic boom ignited metropolitan edge growth; Delhi NCR expanded built-up area by +330 sq km across Trans-Yamuna, and Bengaluru added +133 sq km around early Whitefield (ITPL) and Hosur Road tech clusters.',
    '2001-2011': 'Decadal Census 2001 to 2011: Expressway and ring road construction stimulated unprecedented peri-urban land conversion; Delhi-Gurgaon and Greater Noida corridors added +505 sq km, while Bengaluru’s Outer Ring Road tech boom paved over 120 cascade water tanks (+210 sq km).',
    '2011-2021': 'Decadal Benchmark 2011 to 2021: Megalopolitan radial expansion reached orbital expressways (KMP in Delhi NCR, 158-km ORR in Hyderabad, Satellite Ring Road in Bengaluru), adding over 2,100 sq km of impervious surface across Tier-1 agglomerations.',
    '1991-2011': '20-Year Economic Trajectory (1991–2011): Tier-1 metros expanded built-up footprints by +170% to +210%, converting vast agrarian and flood-basin fringes into commercial logistics and residential high-rise corridors.',
    '2001-2021': '20-Year Megacity Acceleration (2001–2021): Urban built-up surface more than doubled across all top 5 Indian capitals; Hyderabad expanded outward across the 158-km ORR grid (+350 sq km) and Mumbai expanded northward into Thane, Mira-Bhayandar, and Vasai-Virar (+400 sq km).',
    '1991-2021': 'Full 30-Year Satellite Trajectory (1991–2021): Greater Bengaluru built-up footprint expanded by +349% (from 165 to 741 sq km) with an 80% loss in living interconnected water tanks; Delhi NCR expanded by +279% (485 to 1,840 sq km) across fertile agrarian floodplains.'
  },
  coastal_erosion: {
    '1990-2006': 'Shoreline Baseline to Post-Tsunami (1990–2006): Sagar Island lost ~28.5 sq km of littoral perimeter from sea-level rise and the 2004 Indian Ocean Tsunami; Odisha’s Satabhaya coast experienced ~620 m of inland sea ingress, inundating early village settlements.',
    '2006-2018': 'NCCR Decadal Assessment (2006–2018): Severe cyclonic storms (Aila, Phailin, Hudhud) intensified littoral drift imbalances; Chellanam in Kerala experienced ~160 m of shoreline loss, while Satabhaya submerged an additional ~590 m, prompting state-sponsored relocation.',
    '2018-2022': 'Contemporary Shoreline Monitoring (2018–2022): High-resolution DGPS and Sentinel-2 surveys recorded critical erosion along 33.6% of the Indian mainland coast; Sagar Island cumulative loss reached 60.5 sq km and Satabhaya’s original village site was fully submerged.',
    '1990-2018': '28-Year National Shoreline Trajectory (1990–2018): NCCR confirmed West Bengal lost >99 sq km of coastal land, while Odisha and Tamil Nadu coasts suffered severe net erosion near artificial harbor breakwaters.',
    '2006-2022': '16-Year Post-Tsunami Epoch (2006–2022): Accelerated sea-level rise (4.5 mm/yr in Sundarbans) and intense cyclonic surges displaced thousands across low-lying deltaic barrier islands.',
    '1990-2022': '32-Year National Shoreline Atlas (1990–2022): Cumulative erosion submerged Satabhaya village under 1.5 km of sea ingress; Sagar Island contracted from 285 to 224.5 sq km, establishing the northern Bay of Bengal as India’s foremost climate vulnerability hotspot.'
  },
  wetland_change: {
    '1990-2006': 'Pre-Ramsar to National Wetland Atlas (1990–2006): Chilika Lake brackish lagoon underwent historic ecological restoration through the artificial Sipakuda sea mouth opening in 2000, increasing open water spread by +170 sq km; conversely, Vembanad and Loktak suffered open water contractions from reclamation and invasive weed proliferation.',
    '2006-2020': 'Wetland Atlas Cycle to Modern Survey (2006–2020): Sambhar Salt Lake lost -38 sq km of seasonal water spread from illegal sub-surface brine extraction; Loktak Lake’s open water spread contracted by -33 sq km as floating phumdis proliferated due to the Ithai Barrage.',
    '1990-2020': '30-Year Comprehensive Wetland Assessment (1990–2020): Vembanad-Kol wetland shrunk by -35.6% (from 230 to 148 sq km) from urban encroachment; Deepor Beel lost >65% of active water spread due to railway line fragmentation and municipal landfill waste leachate.'
  },
  desertification: {
    '2003-2011': 'SAC Desertification Atlas Cycle 1 to Cycle 2 (2003–2011): Land degradation affected 96.4 million hectares (29.3% of India); wind erosion expanded by +0.8 million ha in western Rajasthan, while quartzite ridge quarrying created 3 new sand-drift gaps along the Aravalli range.',
    '2011-2018': 'SAC Desertification Atlas Cycle 2 to Cycle 3 (2011–2018): Degraded land expanded by an additional 1.87 million hectares nationally; vegetation degradation and water erosion intensified across rainshadow districts of Karnataka (Bellary) and Andhra Pradesh (Anantapur).',
    '2003-2018': '15-Year Multi-Decadal Degradation Trajectory (2003–2018): CAZRI and SAC documented 21 functional mining breach gaps along the Aravalli hills, funneling Thar sand drifts eastward into Haryana and NCR farmlands; Chambal ravine badlands expanded by +320 sq km.'
  },
  groundwater_stress: {
    '2004-2011': 'Dynamic GW Assessment 2004 to 2011: National extraction stage climbed from 58% to 62%; over-exploited assessment blocks in Punjab expanded from 103 to 110 (out of 138), driven by free power policies for agricultural tube-wells.',
    '2011-2017': 'Dynamic GW Assessment 2011 to 2017: Deep fracture aquifers in peninsular hard-rock terrains (Rayalaseema, Marathwada) experienced severe de-watering as borewell depths exceeded 250 meters; Punjab extraction reached 161%.',
    '2017-2022': 'INGRES Sovereign Digital Assessment (2017–2022): Stage of groundwater extraction reached 164% in Punjab (76% of blocks over-exploited) and 134% in Haryana; Western Rajasthan extraction reached 188%, mining non-replenishable deep fossil aquifers.',
    '2004-2017': '13-Year Aquifer Depletion Trend (2004–2017): Northwest granary water tables declined by 0.5 to 0.8 meters annually, forcing millions of farmers to shift from centrifugal to deep multi-stage submersible pumps.',
    '2011-2022': '11-Year Critical Aquifer Transition (2011–2022): Peninsular hard-rock basalt aquifers in Marathwada and Rayalaseema transitioned from safe to critical/over-exploited, escalating recurring summer tanker emergencies.',
    '2004-2022': '18-Year Sovereign Assessment Trend (2004–2022): Punjab-Haryana granary extraction surged from 145% to 164%, exhausting upper alluvial unconfined aquifers and threatening national food security.'
  },
  river_avulsion: {
    '1780-1950': 'Historical Colonial to Independence Benchmark (1780–1950): The Kosi River migrated ~95 km westward across its alluvial mega-fan, abandoning paleochannels past Purnea; Teesta River avulsed from the Ganges into the Brahmaputra system following the 1787 catastrophic flood.',
    '1950-2008': 'Post-Independence Fluvial Epoch (1950–2008): Following the 1950 Great Assam Earthquake (M8.6), Brahmaputra riverbed aggraded by 2-3 meters, widening channels and eroding ~300 sq km of Majuli Island; on Aug 18, 2008, the Kosi breached the Kusaha embankment, avulsing 100 km eastward overnight.',
    '2008-2022': 'Post-Kusaha Avulsion Benchmark (2008–2022): The Kosi was re-channeled within artificial embankments subject to rapid bed aggradation; Majuli Island contracted to ~380 sq km under continuous south-bank toe scour.',
    '1780-2008': '228-Year Geomorphological Spectrum (1780–2008): The Kosi migrated 120 km westward across North Bihar before the 2008 breach redirected flow into historical eastern courses, demonstrating extreme fluvial volatility.',
    '1950-2022': '72-Year Modern Channel Dynamic (1950–2022): Majuli Island shrunk from ~750 sq km to ~380 sq km (a 49.3% loss of landmass); Ganges bankline erosion along Malda retreated by 18.5 km, submerging fertile mango orchards.',
    '1780-2022': '242-Year Subcontinental Fluvial Record (1780–2022): Massive nodal avulsions altered major river courses across Bengal and Bihar, creating vast flood hazard zones and stranded paleochannel networks.'
  }
};

export const getPillarTemporalFinding = (
  pillar: EnvironmentalPillar,
  yearA: string,
  yearB: string
): string => {
  const key = `${yearA}-${yearB}`;
  const pillarFindings = PILLAR_TEMPORAL_FINDINGS[pillar] || {};
  if (pillarFindings[key]) {
    return pillarFindings[key];
  }
  // Fallback to default key finding
  return ENVIRONMENTAL_PILLARS[pillar]?.keyFinding || 'Sovereign remote sensing multi-decadal assessment.';
};

// ============================================================================
// FEATURE-SPECIFIC MULTI-YEAR BENCHMARKS (ALL PILLARS & HOTSPOTS)
// ============================================================================

export interface BenchmarkPoint {
  value: number;
  unit: string;
  text: string;
  context: string;
}

export const FEATURE_BENCHMARKS: Record<string, Record<string, BenchmarkPoint>> = {
  // Urban Sprawl
  'urban-delhi-ncr': {
    '1991': { value: 485, unit: 'sq km', text: '485 sq km contiguous built-up footprint', context: 'Urban core confined largely to Delhi NCT; early stages of DLF Gurugram and Noida industrial sectors.' },
    '2001': { value: 815, unit: 'sq km', text: '815 sq km contiguous built-up footprint', context: 'Rapid Trans-Yamuna residential expansion; early IT and automotive industrial corridor onset in Haryana.' },
    '2011': { value: 1320, unit: 'sq km', text: '1,320 sq km contiguous built-up footprint', context: 'Explosive expansion along Delhi-Gurgaon Expressway and Greater Noida Yamuna Expressway.' },
    '2021': { value: 1840, unit: 'sq km', text: '1,840 sq km contiguous built-up footprint', context: 'Radial agglomeration linking Faridabad, Ghaziabad, Gurugram, Noida, and Sonipat across KMP Expressway.' }
  },
  'urban-bengaluru': {
    '1991': { value: 165, unit: 'sq km', text: '165 sq km built-up (34% tree canopy, 280 living lakes)', context: 'Garden City baseline; lush tree cover across residential layouts and vibrant interconnected cascade lakes.' },
    '2001': { value: 298, unit: 'sq km', text: '298 sq km built-up (early IT corridor boom)', context: 'IT boom triggers eastward expansion towards ITPL Whitefield and Hosur Road electronic city campuses.' },
    '2011': { value: 508, unit: 'sq km', text: '508 sq km built-up (Outer Ring Road tech corridor)', context: 'ORR tech park development; encroachment into Bellandur-Varthur lake catchments and stormwater valleys.' },
    '2021': { value: 741, unit: 'sq km', text: '741 sq km built-up (>78% paved surfaces, <80 living lakes)', context: 'Impervious concrete sprawl extending to Sarjapur, Devanahalli airport corridor, and Bannerghatta fringes.' }
  },
  'urban-mumbai-mmr': {
    '1991': { value: 340, unit: 'sq km', text: '340 sq km built-up area', context: 'Island city and western/central suburban corridors up to Borivali and Mulund.' },
    '2001': { value: 510, unit: 'sq km', text: '510 sq km built-up area', context: 'Navi Mumbai planned nodes (Vashi, Belapur) and Thane Ghodbunder Road suburbanization.' },
    '2011': { value: 715, unit: 'sq km', text: '715 sq km built-up area', context: 'Expansion along central belt into Kalyan-Dombivli and northern coastal belt into Vasai-Virar.' },
    '2021': { value: 910, unit: 'sq km', text: '910 sq km built-up area', context: 'Panvel, Ulwe, JNPT logistics expansion, and Trans-Harbour corridor encroachments into salt pans.' }
  },
  'urban-hyderabad': {
    '1991': { value: 210, unit: 'sq km', text: '210 sq km built-up footprint', context: 'Historic core bounded by Charminar, Secunderabad, and Sanathnagar industrial belt.' },
    '2001': { value: 335, unit: 'sq km', text: '335 sq km built-up footprint', context: 'HITEC City Phase-1 onset; Madhapur cyber-corridors convert granite boulder landscapes into tech parks.' },
    '2011': { value: 490, unit: 'sq km', text: '490 sq km built-up footprint', context: '158-km Outer Ring Road construction drives suburban conversions across Financial District and Gachibowli.' },
    '2021': { value: 685, unit: 'sq km', text: '685 sq km built-up footprint', context: 'Intense radial expansion across Kokapet, Tellapur, Shamshabad airport corridor, and Medchal.' }
  },
  'urban-chennai': {
    '1991': { value: 174, unit: 'sq km', text: '174 sq km built-up area', context: 'Historic municipal core bounded by North Chennai harbor, Anna Nagar, and Guindy.' },
    '2001': { value: 265, unit: 'sq km', text: '265 sq km built-up area', context: 'Old Mahabalipuram Road (OMR) declared IT corridor; early conversion of coastal marshlands.' },
    '2011': { value: 385, unit: 'sq km', text: '385 sq km built-up area', context: 'Sriperumbudur-Oragadam automotive hub and Tambaram southern suburban growth.' },
    '2021': { value: 512, unit: 'sq km', text: '512 sq km built-up area', context: 'Expansion across Pallikaranai marsh catchments and radial GST road industrial agglomerations.' }
  },

  // Forest Cover
  'forest-western-ghats': {
    '2001': { value: 43850, unit: 'sq km', text: '43,850 sq km canopy cover (IRS-1C LISS-III)', context: 'Post-monsoon assessment under ISFR 2001 biennial cycle; baseline for Western Ghats montane corridor.' },
    '2011': { value: 44480, unit: 'sq km', text: '44,480 sq km canopy cover (IRS-P6 ResourceSat-1)', context: '+630 sq km increase over decade; initial expansion of commercial plantation canopy (rubber/coffee) in Kodagu & Wayanad.' },
    '2021': { value: 45120, unit: 'sq km', text: '45,120 sq km canopy cover (ResourceSat-2A LISS-III)', context: 'Core evergreen interior fragmentation persists despite +640 sq km plantation/open forest gain.' }
  },
  'forest-northeast-tribal': {
    '2001': { value: 169825, unit: 'sq km', text: '169,825 sq km primary canopy', context: 'Pristine rainforest and sub-tropical broadleaf canopy across Arunachal, Nagaland, Manipur, Mizoram.' },
    '2011': { value: 168140, unit: 'sq km', text: '168,140 sq km canopy (-1,685 sq km loss)', context: 'Shortened jhum shifting cultivation cycles (from 15 to <5 years) accelerating canopy clearing.' },
    '2021': { value: 166540, unit: 'sq km', text: '166,540 sq km canopy (-1,600 sq km loss)', context: 'Bamboo flowering, shifting cultivation clearing, and infrastructure expansion cause net loss of >3,200 sq km.' }
  },
  'forest-sundarbans-mangroves': {
    '2001': { value: 2120, unit: 'sq km', text: '2,120 sq km dense mangrove canopy', context: 'Pristine halophytic mangrove littoral forest protecting the lower Bengal delta.' },
    '2011': { value: 2110, unit: 'sq km', text: '2,110 sq km mangrove canopy', context: 'Cyclone Sidr (2007) and Aila (2009) caused severe edge scouring and tidal siltation.' },
    '2021': { value: 2114, unit: 'sq km', text: '2,114 sq km mangrove canopy', context: 'Active afforestation by West Bengal Forest Dept stabilizes canopy despite accelerating sea level rise.' }
  },

  // Glacier Retreat
  'glacier-gangotri': {
    '1965': { value: 0, unit: 'm', text: '0 m terminus baseline datum (Corona satellite)', context: 'Corona KH-4 photographic satellite datum establishing historical Gaumukh snout coordinates.' },
    '1990': { value: 580, unit: 'm', text: '580 m cumulative terminus retreat', context: 'Landsat-5 TM multispectral observations; snout receded ~580 m at an average rate of 23.2 m/year.' },
    '2000': { value: 890, unit: 'm', text: '890 m cumulative terminus retreat', context: 'Terminus retreat accelerated to ~31.0 m/year during the 1990s decade with lateral moraine collapse.' },
    '2022': { value: 1530, unit: 'm', text: '1,530 m cumulative terminus retreat', context: 'Sentinel-2 & Cartosat-3 verify sustained snout retreat; ablation zone thinning and tributary detachment.' }
  },
  'glacier-siachen': {
    '1965': { value: 76.5, unit: 'km', text: '76.5 km total glacier length (Corona datum)', context: 'Longest non-polar glacier in the Karakoram; snout terminating at Nubra River source.' },
    '1990': { value: 74.8, unit: 'km', text: '74.8 km glacier length (-1.7 km snout retreat)', context: 'Debris-covered lower tongue experiencing gradual snout calving and sub-glacial discharge shifts.' },
    '2000': { value: 73.4, unit: 'km', text: '73.4 km glacier length (-1.4 km snout retreat)', context: 'Thinning of middle trunk ice and development of supraglacial debris cover.' },
    '2022': { value: 71.2, unit: 'km', text: '71.2 km glacier length (-2.2 km snout retreat)', context: 'Net terminus retreat of 5.3 km since 1965 with ice downwasting along lower 12 km.' }
  },

  // Wetlands
  'wetland-chilika': {
    '1990': { value: 890, unit: 'sq km', text: '890 sq km open water spread', context: 'Lagoon mouth choked with sand; invasive weed Eichhornia reduced salinity and crippled fish catch.' },
    '2006': { value: 1060, unit: 'sq km', text: '1,060 sq km open water spread', context: 'Opening of new Sipakuda sea mouth in 2000 restored tidal flushing, earning Ramsar Wetland Conservation Award.' },
    '2020': { value: 1165, unit: 'sq km', text: '1,165 sq km open water spread', context: 'Sustained dolphin conservation and brackish estuarine open water revitalized to 1,165 sq km.' }
  },
  'wetland-loktak': {
    '1990': { value: 245, unit: 'sq km', text: '245 sq km open water spread', context: 'Pre-Ithai barrage natural water level cycle supported self-sustaining floating phumdi mats.' },
    '2006': { value: 215, unit: 'sq km', text: '215 sq km open water spread', context: 'Permanent water ponding from Ithai Barrage prevents phumdis from grounding in dry season, causing thinning.' },
    '2020': { value: 182, unit: 'sq km', text: '182 sq km open water spread', context: 'Open water contracted to 182 sq km (-63 sq km loss); endangered Sangai deer habitat under acute stress.' }
  },
  'wetland-vembanad': {
    '1990': { value: 230, unit: 'sq km', text: '230 sq km open water spread', context: 'Vast estuarine backwater lagoon supporting traditional polder farming and brackish fisheries.' },
    '2006': { value: 185, unit: 'sq km', text: '185 sq km open water spread', context: 'Thanneermukkom salinity barrage altered ecological balance; agricultural reclamation expanded.' },
    '2020': { value: 148, unit: 'sq km', text: '148 sq km open water spread', context: 'Severe shrinkage to 148 sq km (-35.6% contraction) from urban encroachments and resort bunding.' }
  },

  // Coastal Erosion
  'coastal-sundarbans-sagar': {
    '1990': { value: 0, unit: 'sq km', text: '0 sq km eroded datum (285 sq km island area)', context: 'Historic island perimeter established by Survey of India high water line maps.' },
    '2006': { value: 28.5, unit: 'sq km', text: '28.5 sq km land eroded post-tsunami', context: 'Severe littoral scouring along southern shoreline and Ghoramara island submergence.' },
    '2018': { value: 51.0, unit: 'sq km', text: '51.0 sq km land eroded', context: 'Cyclones Aila and Hudhud accelerated wave energy and tidal deltaic erosion.' },
    '2022': { value: 60.5, unit: 'sq km', text: '60.5 sq km net cumulative land loss', context: 'Sagar Island area reduced to 224.5 sq km; thousands of climate refugees relocated inland.' }
  },
  'coastal-odisha-kendrapara': {
    '1990': { value: 0, unit: 'm', text: '0 m sea ingress datum (Satabhaya village intact)', context: 'Satabhaya historic coastal hamlet cluster intact with ancient Panchubarahi temple.' },
    '2006': { value: 620, unit: 'm', text: '620 m inland sea ingress', context: 'Waves breached protective sand dunes, flooding paddy fields and destroying primary school.' },
    '2018': { value: 1210, unit: 'm', text: '1,210 m inland sea ingress', context: 'Ancient temple engulfed by high tide; Odisha government initiated resettlement at Bagapatia.' },
    '2022': { value: 1500, unit: 'm', text: '1,500 m cumulative sea ingress', context: 'Complete submergence of historic Satabhaya village site under the Bay of Bengal.' }
  },

  // Groundwater
  'gw-punjab-haryana': {
    '2004': { value: 145, unit: '%', text: '145% extraction stage (over-exploited)', context: 'Submersible electric tubewell boom for Green Revolution paddy-wheat double cropping.' },
    '2011': { value: 156, unit: '%', text: '156% extraction stage (over-exploited)', context: 'Deep aquifer pumping exceeds natural recharge by >50%; water tables drop 0.6 m/yr.' },
    '2017': { value: 161, unit: '%', text: '161% extraction stage (over-exploited)', context: 'Borewells penetrate deeper into semi-confined aquifers containing fossil saline lenses.' },
    '2022': { value: 164, unit: '%', text: '164% extraction stage (critical over-exploitation)', context: '76% of assessment blocks over-exploited; Punjab draws 28 billion cubic meters annually vs 17 BCM recharge.' }
  },
  'gw-western-rajasthan': {
    '2004': { value: 138, unit: '%', text: '138% extraction stage', context: 'Deep fossil water mining in arid zones lacking monsoon surface recharge.' },
    '2011': { value: 154, unit: '%', text: '154% extraction stage', context: 'Borewell depths exceed 200 meters for cash crops (cumin, isabgol, mustard).' },
    '2017': { value: 172, unit: '%', text: '172% extraction stage', context: 'Saline water encroachment into depleted fresh groundwater pockets.' },
    '2022': { value: 188, unit: '%', text: '188% extraction stage', context: 'Severe exhaustion of non-replenishable fossil aquifers across Jodhpur, Bikaner, and Barmer.' }
  },

  // River Avulsion
  'river-kosi-migration': {
    '1780': { value: 0, unit: 'km', text: '0 km migration baseline (Major Rennell Bengal Atlas)', context: 'Kosi flowed past Purnea, emptying into the Ganges near Manihari.' },
    '1950': { value: 95, unit: 'km', text: '95 km westward migration', context: 'Continuous westward shifting over 170 years across North Bihar alluvial mega-fan.' },
    '2008': { value: 120, unit: 'km', text: '120 km cumulative migration (Kusaha breach)', context: 'On Aug 18, 2008, Kusaha embankment breached, avulsing flow 100 km eastward overnight.' },
    '2022': { value: 120, unit: 'km', text: '120 km avulsion corridor (embanked)', context: 'Sediment aggradation elevates riverbed several meters above adjoining countryside.' }
  },
  'river-brahmaputra-majuli': {
    '1950': { value: 750, unit: 'sq km', text: '750 sq km island area (pre-1950 Great Assam Earthquake)', context: 'Majuli world’s largest river island with 65 historic Neo-Vaishnavite Satras.' },
    '2008': { value: 450, unit: 'sq km', text: '450 sq km island area (-300 sq km erosion)', context: 'Post-earthquake riverbed rise caused channel widening and intense toe scour along south bank.' },
    '2022': { value: 380, unit: 'sq km', text: '380 sq km island area (-370 sq km net erosion)', context: 'Island shrunk to ~380 sq km (49.3% contraction); geobag revetments deployed to preserve Satras.' }
  }
};

// ============================================================================
// DYNAMIC TEMPORAL ASSESSMENT GENERATOR (YEAR A VS YEAR B)
// ============================================================================

export interface TemporalAssessment {
  yearA: string;
  yearB: string;
  dateLabelA: string;
  dateLabelB: string;
  sensorA: string;
  sensorB: string;
  valueA: number;
  valueB: number;
  unit: string;
  textA: string;
  textB: string;
  contextA?: string;
  contextB?: string;
  deltaValue: number;
  deltaPct: number;
  deltaText: string;
  annualRateText: string;
  timeSpanYears: number;
  severityCode: 'severe' | 'high' | 'moderate' | 'positive';
  assessmentSummary: string;
}

export function getFeatureTemporalAssessment(
  properties: any,
  yearA?: string,
  yearB?: string
): TemporalAssessment {
  const featId = properties.id || '';
  const pillar = (properties.pillar || 'urban_expansion') as EnvironmentalPillar;
  const pillarMeta = ENVIRONMENTAL_PILLARS[pillar];
  const obsDates = PILLAR_OBSERVATION_DATES[pillar] || {};

  const availableYears = pillarMeta?.availableYears || ['1991', '2021'];
  const yA = yearA || availableYears[0];
  const yB = yearB || availableYears[availableYears.length - 1];

  const metaA = obsDates[yA];
  const metaB = obsDates[yB];

  const dateLabelA = metaA ? `${metaA.day} ${metaA.month} ${metaA.year}` : `Year ${yA}`;
  const dateLabelB = metaB ? `${metaB.day} ${metaB.month} ${metaB.year}` : `Year ${yB}`;
  const sensorA = metaA ? `${metaA.sensor} (${metaA.cycleName})` : 'Sovereign Remote Sensing Baseline';
  const sensorB = metaB ? `${metaB.sensor} (${metaB.cycleName})` : 'Sovereign Remote Sensing Contemporary';

  const numYA = parseInt(yA) || 1991;
  const numYB = parseInt(yB) || 2021;
  const timeSpanYears = Math.max(1, Math.abs(numYB - numYA));

  // 1. Check if explicit curated benchmark exists
  const benchmarkRecord = FEATURE_BENCHMARKS[featId];
  if (benchmarkRecord && benchmarkRecord[yA] && benchmarkRecord[yB]) {
    const ptA = benchmarkRecord[yA];
    const ptB = benchmarkRecord[yB];
    const deltaVal = ptB.value - ptA.value;
    const deltaPct = ptA.value !== 0 ? (deltaVal / ptA.value) * 100 : 0;
    const annualRate = deltaVal / timeSpanYears;
    const sign = deltaVal >= 0 ? '+' : '';
    const unit = ptA.unit || 'sq km';

    let severity: 'severe' | 'high' | 'moderate' | 'positive' = 'moderate';
    if (pillar === 'urban_expansion') {
      severity = annualRate > 25 ? 'severe' : annualRate > 15 ? 'high' : 'moderate';
    } else if (pillar === 'forest_change') {
      severity = deltaVal < 0 ? 'severe' : 'positive';
    } else if (pillar === 'glacier_retreat' || pillar === 'coastal_erosion') {
      severity = annualRate > 20 ? 'severe' : 'high';
    } else if (pillar === 'wetland_change') {
      severity = deltaVal < 0 ? 'severe' : 'positive';
    } else if (pillar === 'groundwater_stress') {
      severity = ptB.value > 150 ? 'severe' : ptB.value > 100 ? 'high' : 'moderate';
    }

    const deltaText = `${sign}${Math.abs(deltaVal).toLocaleString()} ${unit} (${sign}${deltaPct.toFixed(1)}%) in ${timeSpanYears} yrs`;
    const annualRateText = `${sign}${annualRate.toFixed(1)} ${unit} / year (${sign}${(deltaPct / timeSpanYears).toFixed(1)}%/yr)`;

    return {
      yearA: yA,
      yearB: yB,
      dateLabelA,
      dateLabelB,
      sensorA,
      sensorB,
      valueA: ptA.value,
      valueB: ptB.value,
      unit,
      textA: ptA.text,
      textB: ptB.text,
      contextA: ptA.context,
      contextB: ptB.context,
      deltaValue: deltaVal,
      deltaPct,
      deltaText,
      annualRateText,
      timeSpanYears,
      severityCode: severity,
      assessmentSummary: `${properties.name}: Between ${yA} and ${yB} (${timeSpanYears} years), metric shifted from ${ptA.text} to ${ptB.text} (${deltaText} at an annual rate of ${annualRateText}). ${ptB.context || properties.primary_driver || ''}`
    };
  }

  // 2. Fallback: Proportional interpolation from GeoJSON baseline & comparison values
  const baseYr = parseInt(properties.baseline_year || availableYears[0]) || 1991;
  const compYr = parseInt(properties.comparison_year || availableYears[availableYears.length - 1]) || 2021;
  const baseVal = properties.baseline_value ?? 100;
  const compVal = properties.comparison_value ?? 200;
  const fullSpan = Math.max(1, compYr - baseYr);

  // Linear interpolation for yearA and yearB
  const fracA = Math.max(0, Math.min(1, (numYA - baseYr) / fullSpan));
  const fracB = Math.max(0, Math.min(1, (numYB - baseYr) / fullSpan));

  const valA = Math.round(baseVal + (compVal - baseVal) * fracA);
  const valB = Math.round(baseVal + (compVal - baseVal) * fracB);

  const deltaVal = valB - valA;
  const deltaPct = valA !== 0 ? (deltaVal / valA) * 100 : 0;
  const annualRate = deltaVal / timeSpanYears;
  const sign = deltaVal >= 0 ? '+' : '';
  const unit = pillarMeta?.metricUnit || 'sq km';

  const deltaText = `${sign}${Math.abs(deltaVal).toLocaleString()} ${unit} (${sign}${deltaPct.toFixed(1)}%) in ${timeSpanYears} yrs`;
  const annualRateText = `${sign}${annualRate.toFixed(1)} ${unit} / year (${sign}${(deltaPct / timeSpanYears).toFixed(1)}%/yr)`;

  return {
    yearA: yA,
    yearB: yB,
    dateLabelA,
    dateLabelB,
    sensorA,
    sensorB,
    valueA: valA,
    valueB: valB,
    unit,
    textA: `${valA.toLocaleString()} ${unit}`,
    textB: `${valB.toLocaleString()} ${unit}`,
    contextA: `Sovereign capture benchmark datum for ${yA}.`,
    contextB: `Sovereign capture benchmark datum for ${yB}.`,
    deltaValue: deltaVal,
    deltaPct,
    deltaText,
    annualRateText,
    timeSpanYears,
    severityCode: (properties.severity_code as any) || 'moderate',
    assessmentSummary: `${properties.name}: Between ${yA} and ${yB} (${timeSpanYears} years), recorded net change was ${deltaText} with an annual change rate of ${annualRateText}.`
  };
}

