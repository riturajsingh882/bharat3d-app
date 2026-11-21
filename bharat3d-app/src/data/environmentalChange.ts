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

