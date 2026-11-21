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
