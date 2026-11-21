// =============================================================================
// BHARAT 3D — INFRASTRUCTURE & ECONOMIC GEOGRAPHY INTELLIGENCE
// Comprehensive Geospatial Ingestion of India's Economic Backbone:
// 1. National Highways & Expressways (NHAI / MoRTH) — 28 Corridors
// 2. Railways & Dedicated Freight Corridors (Indian Railways / DFCCIL) — 8 Lines
// 3. Major International & Hub Airports (AAI / DGCA) — 20 Hubs
// 4. Major Seaports & Deepwater Harbors (Ministry of Ports / Sagarmala) — 15 Ports
// 5. National Industrial Corridors & Smart Cities (NICDC) — 7 Corridors
// 6. Major Multipurpose Dams & Reservoirs (Central Water Commission) — 12 Projects
// 7. Mega Power Plants & Renewable Parks (CEA / NTPC / NPCIL) — 14 Mega Plants
// 8. Special Economic Zones & Industrial Clusters (DPIIT) — 12 Hubs
// 9. Metropolitan Urban Centres & Megacities (Census / MoHUA) — 12 Megacities
// Total: 128 Verified National Infrastructure Assets
// =============================================================================

import type { InfrastructureCategory } from '../types';

export interface InfrastructureProperties {
  id: string;
  name: string;
  category: InfrastructureCategory;
  sub_type?: string;
  state: string;
  authority: string;
  official_reference?: string;
  color: string;
  summary: string;
  description?: string;
  coordinates?: [number, number];

  // Highways specific
  code?: string;
  from?: string;
  to?: string;
  length_km?: number;
  lanes?: string;
  toll?: boolean;
  corridor_group?: string;

  // Railways specific
  gauge?: string;
  electrification_pct?: number;
  route_type?: string;

  // Airports specific
  iata_code?: string;
  icao_code?: string;
  passengers_mppa?: number;
  runways_count?: number;
  operator?: string;

  // Seaports specific
  port_type?: string;
  cargo_mmt?: number;
  container_teu?: number;
  draft_m?: number;
  berths?: number;

  // Industrial Corridors specific
  nodes?: string[];
  investment_target_usd?: string;
  influence_area_sqkm?: number;

  // Dams specific
  river?: string;
  dam_type?: string;
  height_m?: number;
  reservoir_capacity_mcm?: number;
  installed_capacity_mw?: number;
  purposes?: string[];

  // Power plants specific
  power_type?: 'Solar' | 'Nuclear' | 'Thermal' | 'Wind' | 'Hydro';
  capacity_mw?: number;
  grid_operator?: string;

  // SEZ specific
  sector?: string;
  area_acres?: number;
  units_count?: number;

  // Urban centres specific
  population_metro?: string;
  metro_gdp_usd?: string;
  tier?: string;
}

export interface InfrastructureFeature {
  type: "Feature";
  id: string;
  properties: InfrastructureProperties;
  geometry: {
    type: string;
    coordinates: any;
  };
}

export interface InfrastructureCollection {
  type: "FeatureCollection";
  features: InfrastructureFeature[];
}

export const ALL_INFRASTRUCTURE_CATEGORIES: InfrastructureCategory[] = [
  'highways',
  'railways',
  'airports',
  'seaports',
  'industrial_corridors',
  'dams',
  'power_plants',
  'economic_zones',
  'urban_centres'
];

export const INFRASTRUCTURE_CATEGORIES_META: Record<InfrastructureCategory, {
  label: string;
  shortLabel: string;
  color: string;
  badge: string;
  authority: string;
  description: string;
}> = {
  highways: {
    label: 'National Highways & Expressways',
    shortLabel: 'Highways & Expressways',
    color: '#f59e0b',
    badge: 'MoRTH / NHAI',
    authority: 'National Highways Authority of India (NHAI)',
    description: 'Golden Quadrilateral, North-South, East-West corridors and access-controlled expressways.'
  },
  railways: {
    label: 'Railways & Freight Corridors (DFCs)',
    shortLabel: 'Railways & DFCs',
    color: '#38bdf8',
    badge: 'IR / DFCCIL',
    authority: 'Indian Railways & Dedicated Freight Corridor Corp (DFCCIL)',
    description: 'Western & Eastern DFCs, High-Speed Rail (MAHSR), and trunk golden rail corridors.'
  },
  airports: {
    label: 'Major International & Hub Airports',
    shortLabel: 'Major Airports',
    color: '#818cf8',
    badge: 'AAI / DGCA',
    authority: 'Airports Authority of India (AAI) & Ministry of Civil Aviation',
    description: 'Tier-1 and Tier-2 international airports, dual-runway hubs, and greenfield aerotropolises.'
  },
  seaports: {
    label: 'Major Seaports & Deepwater Harbors',
    shortLabel: 'Major Seaports',
    color: '#06b6d4',
    badge: 'MoPSW / Sagarmala',
    authority: 'Ministry of Ports, Shipping and Waterways (Sagarmala)',
    description: '12 Major Trust Ports, Adani Mundra, Vizhinjam transshipment hub, and Vadhavan mega port.'
  },
  industrial_corridors: {
    label: 'National Industrial Corridors & SIRs',
    shortLabel: 'Industrial Corridors',
    color: '#d946ef',
    badge: 'NICDC / DPIIT',
    authority: 'National Industrial Corridor Development Corporation (NICDC)',
    description: 'DMIC, AKIC, CBIC, BMIC, VCIC with smart industrial cities and investment regions.'
  },
  dams: {
    label: 'Major Multipurpose Dams & Reservoirs',
    shortLabel: 'Major Dams',
    color: '#0284c7',
    badge: 'CWC / MoJS',
    authority: 'Central Water Commission (CWC) & Ministry of Jal Shakti',
    description: 'Tehri, Bhakra Nangal, Sardar Sarovar, Hirakud, Nagarjuna Sagar, and Koyna hydro dams.'
  },
  power_plants: {
    label: 'Mega Power Plants & Clean Energy Parks',
    shortLabel: 'Power Plants & Solar',
    color: '#eab308',
    badge: 'CEA / NTPC / NPCIL',
    authority: 'Central Electricity Authority (CEA), NTPC & NPCIL',
    description: 'Ultra mega thermal plants, nuclear stations (Kudankulam, Tarapur) and solar parks (Bhadla, Pavagada).'
  },
  economic_zones: {
    label: 'Special Economic Zones & Tech Parks',
    shortLabel: 'SEZs & Tech Parks',
    color: '#10b981',
    badge: 'DPIIT / MoCI',
    authority: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
    description: 'GIFT City, SEEPZ Mumbai, Jamnagar Refining SEZ, Sri City, and Bangalore Electronics City.'
  },
  urban_centres: {
    label: 'Metropolitan Urban Centres & Megacities',
    shortLabel: 'Metropolitan Engines',
    color: '#f97316',
    badge: 'Census / MoHUA',
    authority: 'Ministry of Housing and Urban Affairs & Census of India',
    description: 'India\'s Tier-1 metropolitan megacities driving national GDP, corporate services, and innovation.'
  }
};

export const INFRASTRUCTURE_GEOJSON: InfrastructureCollection = {
  type: "FeatureCollection",
  features: [
  {
    "type": "Feature",
    "id": "hwy_nh_1",
    "properties": {
      "id": "hwy_nh_1",
      "name": "NH 1: Srinagar–Kargil–Leh Highway",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Jammu & Kashmir, Ladakh",
      "authority": "MoRTH / BRO",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 1",
      "from": "Srinagar, J&K",
      "to": "Leh, Ladakh",
      "length_km": 422,
      "lanes": "2",
      "toll": false,
      "corridor_group": "Frontier / Trans-Himalayan",
      "summary": "NH 1 (422 km): Connects Srinagar, J&K to Leh, Ladakh across Jammu & Kashmir, Ladakh.",
      "description": "Major trunk highway corridor under MoRTH / BRO. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          74.8,
          34.08
        ],
        [
          75.3,
          34.3
        ],
        [
          75.75,
          34.42
        ],
        [
          76.13,
          34.55
        ],
        [
          77.58,
          34.15
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_44",
    "properties": {
      "id": "hwy_nh_44",
      "name": "NH 44: Srinagar–Kanyakumari (North–South Corridor)",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "J&K, Punjab, Haryana, Delhi, UP, MP, Maharashtra, Telangana, AP, Karnataka, Tamil Nadu",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 44",
      "from": "Srinagar, J&K",
      "to": "Kanyakumari, Tamil Nadu",
      "length_km": 3745,
      "lanes": "4–6",
      "toll": true,
      "corridor_group": "North–South Corridor",
      "summary": "NH 44 (3745 km): Connects Srinagar, J&K to Kanyakumari, Tamil Nadu across J&K, Punjab, Haryana, Delhi, UP, MP, Maharashtra, Telangana, AP, Karnataka, Tamil Nadu.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          74.8,
          34.08
        ],
        [
          74.86,
          32.73
        ],
        [
          75.65,
          32.27
        ],
        [
          75.58,
          31.33
        ],
        [
          75.86,
          30.9
        ],
        [
          76.78,
          30.38
        ],
        [
          76.97,
          29.39
        ],
        [
          77.21,
          28.61
        ],
        [
          78.01,
          27.18
        ],
        [
          78.57,
          25.45
        ],
        [
          78.75,
          23.84
        ],
        [
          79.6,
          22.6
        ],
        [
          79.09,
          21.15
        ],
        [
          78.53,
          19.67
        ],
        [
          78.49,
          17.39
        ],
        [
          78.04,
          15.82
        ],
        [
          77.6,
          14.68
        ],
        [
          77.59,
          12.97
        ],
        [
          78.15,
          11.66
        ],
        [
          78.12,
          9.93
        ],
        [
          77.54,
          8.08
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_48",
    "properties": {
      "id": "hwy_nh_48",
      "name": "NH 48: Delhi–Mumbai–Bengaluru–Chennai (Golden Quadrilateral West)",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Delhi, Haryana, Rajasthan, Gujarat, Maharashtra, Karnataka, Tamil Nadu",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 48",
      "from": "Delhi",
      "to": "Chennai, Tamil Nadu",
      "length_km": 2807,
      "lanes": "4–6",
      "toll": true,
      "corridor_group": "Golden Quadrilateral",
      "summary": "NH 48 (2807 km): Connects Delhi to Chennai, Tamil Nadu across Delhi, Haryana, Rajasthan, Gujarat, Maharashtra, Karnataka, Tamil Nadu.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.21,
          28.61
        ],
        [
          77.03,
          28.46
        ],
        [
          75.79,
          26.91
        ],
        [
          74.64,
          26.45
        ],
        [
          73.71,
          24.58
        ],
        [
          72.57,
          23.02
        ],
        [
          73.18,
          22.31
        ],
        [
          72.83,
          21.17
        ],
        [
          72.88,
          19.08
        ],
        [
          73.86,
          18.52
        ],
        [
          74.02,
          17.68
        ],
        [
          74.24,
          16.7
        ],
        [
          74.5,
          15.85
        ],
        [
          75.12,
          15.36
        ],
        [
          75.92,
          14.47
        ],
        [
          77.1,
          13.34
        ],
        [
          77.59,
          12.97
        ],
        [
          79.13,
          12.92
        ],
        [
          80.27,
          13.08
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_16",
    "properties": {
      "id": "hwy_nh_16",
      "name": "NH 16: Chennai–Kolkata East Coast Corridor",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Tamil Nadu, Andhra Pradesh, Odisha, West Bengal",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 16",
      "from": "Chennai, Tamil Nadu",
      "to": "Kolkata, West Bengal",
      "length_km": 1664,
      "lanes": "4–6",
      "toll": true,
      "corridor_group": "Golden Quadrilateral",
      "summary": "NH 16 (1664 km): Connects Chennai, Tamil Nadu to Kolkata, West Bengal across Tamil Nadu, Andhra Pradesh, Odisha, West Bengal.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          80.27,
          13.08
        ],
        [
          79.97,
          14.44
        ],
        [
          80.05,
          15.51
        ],
        [
          80.65,
          16.51
        ],
        [
          81.79,
          17
        ],
        [
          83.22,
          17.69
        ],
        [
          83.9,
          18.3
        ],
        [
          85.83,
          20.3
        ],
        [
          85.88,
          20.47
        ],
        [
          86.93,
          21.49
        ],
        [
          87.28,
          22.35
        ],
        [
          88.36,
          22.57
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_19",
    "properties": {
      "id": "hwy_nh_19",
      "name": "NH 19: Delhi–Kolkata Grand Trunk Corridor",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Delhi, Haryana, UP, Bihar, Jharkhand, West Bengal",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 19",
      "from": "Delhi",
      "to": "Kolkata, West Bengal",
      "length_km": 1435,
      "lanes": "4–6",
      "toll": true,
      "corridor_group": "Golden Quadrilateral",
      "summary": "NH 19 (1435 km): Connects Delhi to Kolkata, West Bengal across Delhi, Haryana, UP, Bihar, Jharkhand, West Bengal.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.21,
          28.61
        ],
        [
          77.67,
          27.49
        ],
        [
          78.01,
          27.18
        ],
        [
          80.33,
          26.45
        ],
        [
          81.85,
          25.44
        ],
        [
          82.97,
          25.32
        ],
        [
          84.01,
          24.95
        ],
        [
          86.43,
          23.8
        ],
        [
          86.98,
          23.68
        ],
        [
          87.31,
          23.52
        ],
        [
          88.36,
          22.57
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_27",
    "properties": {
      "id": "hwy_nh_27",
      "name": "NH 27: Porbandar–Silchar East–West Corridor",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Gujarat, Rajasthan, MP, UP, Bihar, West Bengal, Assam, Meghalaya",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 27",
      "from": "Porbandar, Gujarat",
      "to": "Silchar, Assam",
      "length_km": 3507,
      "lanes": "4",
      "toll": true,
      "corridor_group": "East–West Corridor",
      "summary": "NH 27 (3507 km): Connects Porbandar, Gujarat to Silchar, Assam across Gujarat, Rajasthan, MP, UP, Bihar, West Bengal, Assam, Meghalaya.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          69.63,
          21.64
        ],
        [
          70.8,
          22.3
        ],
        [
          72.57,
          23.02
        ],
        [
          73.71,
          24.58
        ],
        [
          75.86,
          25.21
        ],
        [
          77.66,
          25.42
        ],
        [
          78.57,
          25.45
        ],
        [
          80.33,
          26.45
        ],
        [
          80.95,
          26.85
        ],
        [
          82.2,
          26.79
        ],
        [
          83.37,
          26.75
        ],
        [
          85.39,
          26.12
        ],
        [
          85.9,
          26.15
        ],
        [
          87.47,
          25.78
        ],
        [
          87.95,
          26.1
        ],
        [
          88.43,
          26.73
        ],
        [
          90.56,
          26.48
        ],
        [
          91.75,
          26.18
        ],
        [
          91.88,
          25.57
        ],
        [
          92.79,
          24.83
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_65",
    "properties": {
      "id": "hwy_nh_65",
      "name": "NH 65: Pune–Hyderabad–Vijayawada–Machilipatnam",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Maharashtra, Karnataka, Telangana, Andhra Pradesh",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 65",
      "from": "Pune, Maharashtra",
      "to": "Machilipatnam, Andhra Pradesh",
      "length_km": 926,
      "lanes": "4–6",
      "toll": true,
      "corridor_group": "Deccan East–West Link",
      "summary": "NH 65 (926 km): Connects Pune, Maharashtra to Machilipatnam, Andhra Pradesh across Maharashtra, Karnataka, Telangana, Andhra Pradesh.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          73.86,
          18.52
        ],
        [
          75.91,
          17.66
        ],
        [
          76.84,
          17.34
        ],
        [
          78.49,
          17.39
        ],
        [
          79.6,
          17.14
        ],
        [
          80.65,
          16.51
        ],
        [
          81.14,
          16.19
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_66",
    "properties": {
      "id": "hwy_nh_66",
      "name": "NH 66: Panvel–Kochi–Kanyakumari West Coast Highway",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Maharashtra, Goa, Karnataka, Kerala, Tamil Nadu",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 66",
      "from": "Panvel, Maharashtra",
      "to": "Kanyakumari, Tamil Nadu",
      "length_km": 1640,
      "lanes": "2–4",
      "toll": true,
      "corridor_group": "West Coastal Corridor",
      "summary": "NH 66 (1640 km): Connects Panvel, Maharashtra to Kanyakumari, Tamil Nadu across Maharashtra, Goa, Karnataka, Kerala, Tamil Nadu.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          73.11,
          18.99
        ],
        [
          73.31,
          16.99
        ],
        [
          73.83,
          15.5
        ],
        [
          74.13,
          14.81
        ],
        [
          74.86,
          12.91
        ],
        [
          75.78,
          11.26
        ],
        [
          76.27,
          9.93
        ],
        [
          76.95,
          8.52
        ],
        [
          77.54,
          8.08
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_30",
    "properties": {
      "id": "hwy_nh_30",
      "name": "NH 30: Sitarganj–Lucknow–Raipur–Jagdalpur",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Uttarakhand, UP, MP, Chhattisgarh",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 30",
      "from": "Sitarganj, Uttarakhand",
      "to": "Jagdalpur, Chhattisgarh",
      "length_km": 1984,
      "lanes": "2–4",
      "toll": false,
      "corridor_group": "Central Peninsular Artery",
      "summary": "NH 30 (1984 km): Connects Sitarganj, Uttarakhand to Jagdalpur, Chhattisgarh across Uttarakhand, UP, MP, Chhattisgarh.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          79.7,
          28.93
        ],
        [
          79.42,
          28.37
        ],
        [
          80.95,
          26.85
        ],
        [
          81.85,
          25.44
        ],
        [
          81.3,
          24.53
        ],
        [
          79.95,
          23.18
        ],
        [
          80.37,
          22.6
        ],
        [
          81.63,
          21.25
        ],
        [
          81.99,
          19.08
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_53",
    "properties": {
      "id": "hwy_nh_53",
      "name": "NH 53: Surat–Nagpur–Paradip Corridor",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Gujarat, Maharashtra, Chhattisgarh, Odisha",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 53",
      "from": "Surat, Gujarat",
      "to": "Paradip, Odisha",
      "length_km": 1779,
      "lanes": "2–4",
      "toll": true,
      "corridor_group": "Central India East–West Link",
      "summary": "NH 53 (1779 km): Connects Surat, Gujarat to Paradip, Odisha across Gujarat, Maharashtra, Chhattisgarh, Odisha.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          72.83,
          21.17
        ],
        [
          74.78,
          20.9
        ],
        [
          75.56,
          21.01
        ],
        [
          77,
          20.7
        ],
        [
          77.75,
          20.93
        ],
        [
          79.09,
          21.15
        ],
        [
          81.63,
          21.25
        ],
        [
          83.98,
          21.47
        ],
        [
          85.88,
          20.47
        ],
        [
          86.61,
          20.31
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_52",
    "properties": {
      "id": "hwy_nh_52",
      "name": "NH 52: Sangrur–Indore–Ankola Corridor",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Punjab, Haryana, Rajasthan, MP, Maharashtra, Karnataka",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 52",
      "from": "Sangrur, Punjab",
      "to": "Ankola, Karnataka",
      "length_km": 2317,
      "lanes": "2–4",
      "toll": true,
      "corridor_group": "Western Meridian Corridor",
      "summary": "NH 52 (2317 km): Connects Sangrur, Punjab to Ankola, Karnataka across Punjab, Haryana, Rajasthan, MP, Maharashtra, Karnataka.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          75.85,
          30.25
        ],
        [
          75.72,
          29.15
        ],
        [
          74.97,
          28.3
        ],
        [
          75.79,
          26.91
        ],
        [
          75.86,
          25.21
        ],
        [
          75.86,
          22.72
        ],
        [
          75.34,
          19.88
        ],
        [
          75.91,
          17.66
        ],
        [
          75.72,
          16.82
        ],
        [
          75.12,
          15.36
        ],
        [
          74.25,
          14.66
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_9",
    "properties": {
      "id": "hwy_nh_9",
      "name": "NH 9: Malout–Haridwar–Pithoragarh Highway",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Punjab, Haryana, Uttar Pradesh, Uttarakhand",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 9",
      "from": "Malout, Punjab",
      "to": "Pithoragarh, Uttarakhand",
      "length_km": 811,
      "lanes": "2–4",
      "toll": false,
      "corridor_group": "Trans-Himalayan Foothill Link",
      "summary": "NH 9 (811 km): Connects Malout, Punjab to Pithoragarh, Uttarakhand across Punjab, Haryana, Uttar Pradesh, Uttarakhand.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          74.19,
          30.19
        ],
        [
          74.94,
          30.21
        ],
        [
          76.78,
          30.38
        ],
        [
          78.16,
          29.95
        ],
        [
          79.03,
          28.81
        ],
        [
          79.42,
          28.37
        ],
        [
          80.69,
          27.57
        ],
        [
          80.2,
          29.58
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_34",
    "properties": {
      "id": "hwy_nh_34",
      "name": "NH 34: Gangotri–Kanpur–Lakhnadon Highway",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Uttarakhand, Uttar Pradesh, Madhya Pradesh",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 34",
      "from": "Gangotri, Uttarakhand",
      "to": "Lakhnadon, Madhya Pradesh",
      "length_km": 1426,
      "lanes": "2–4",
      "toll": false,
      "corridor_group": "Ganga Valley Artery",
      "summary": "NH 34 (1426 km): Connects Gangotri, Uttarakhand to Lakhnadon, Madhya Pradesh across Uttarakhand, Uttar Pradesh, Madhya Pradesh.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          78.94,
          30.99
        ],
        [
          78.29,
          30.09
        ],
        [
          78.16,
          29.95
        ],
        [
          78.13,
          29.37
        ],
        [
          78.78,
          28.84
        ],
        [
          79.42,
          28.37
        ],
        [
          80.33,
          26.45
        ],
        [
          80.86,
          25.18
        ],
        [
          80.82,
          24.58
        ],
        [
          79.95,
          23.18
        ],
        [
          79.6,
          22.6
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_15",
    "properties": {
      "id": "hwy_nh_15",
      "name": "NH 15: Samakhiali–Ajmer–Pathankot Corridor",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Gujarat, Rajasthan, Punjab",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 15",
      "from": "Samakhiali, Gujarat",
      "to": "Pathankot, Punjab",
      "length_km": 1526,
      "lanes": "2–4",
      "toll": false,
      "corridor_group": "Thar Frontier Corridor",
      "summary": "NH 15 (1526 km): Connects Samakhiali, Gujarat to Pathankot, Punjab across Gujarat, Rajasthan, Punjab.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          70.5,
          23.3
        ],
        [
          71.6,
          23.83
        ],
        [
          72.43,
          24.17
        ],
        [
          73.71,
          24.58
        ],
        [
          74.64,
          26.45
        ],
        [
          75.79,
          26.91
        ],
        [
          73.31,
          28.02
        ],
        [
          73.88,
          29.92
        ],
        [
          74.02,
          30.4
        ],
        [
          74.87,
          31.63
        ],
        [
          75.65,
          32.27
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_nh_2",
    "properties": {
      "id": "hwy_nh_2",
      "name": "NH 2: Dibrugarh–Kohima–Imphal–Tuipang (North-East Corridor)",
      "category": "highways",
      "sub_type": "National Highway",
      "state": "Assam, Nagaland, Manipur, Mizoram",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#f59e0b",
      "code": "NH 2",
      "from": "Dibrugarh, Assam",
      "to": "Tuipang, Mizoram",
      "length_km": 1326,
      "lanes": "2",
      "toll": false,
      "corridor_group": "North-East Meridian",
      "summary": "NH 2 (1326 km): Connects Dibrugarh, Assam to Tuipang, Mizoram across Assam, Nagaland, Manipur, Mizoram.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          94.91,
          27.47
        ],
        [
          94.22,
          26.75
        ],
        [
          94.11,
          25.67
        ],
        [
          93.94,
          24.82
        ],
        [
          92.72,
          23.73
        ],
        [
          93.25,
          22.31
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_ne_4",
    "properties": {
      "id": "hwy_ne_4",
      "name": "NE-4: Delhi–Mumbai Expressway",
      "category": "highways",
      "sub_type": "Expressway",
      "state": "Haryana, Rajasthan, Madhya Pradesh, Gujarat, Maharashtra",
      "authority": "MoRTH / NHAI",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#10b981",
      "code": "NE-4",
      "from": "Sohna (Delhi NCR), Haryana",
      "to": "Mumbai, Maharashtra",
      "length_km": 1350,
      "lanes": "8",
      "toll": true,
      "corridor_group": "Greenfield Expressway",
      "summary": "NE-4 (1350 km): Connects Sohna (Delhi NCR), Haryana to Mumbai, Maharashtra across Haryana, Rajasthan, Madhya Pradesh, Gujarat, Maharashtra.",
      "description": "Major trunk highway corridor under MoRTH / NHAI. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.21,
          28.61
        ],
        [
          77.07,
          28.25
        ],
        [
          76.63,
          27.55
        ],
        [
          76.36,
          26.02
        ],
        [
          75.86,
          25.21
        ],
        [
          75.04,
          23.33
        ],
        [
          74.26,
          22.83
        ],
        [
          73.18,
          22.31
        ],
        [
          72.83,
          21.17
        ],
        [
          72.88,
          19.08
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_ne_1",
    "properties": {
      "id": "hwy_ne_1",
      "name": "NE-1: Mumbai–Nagpur Samruddhi Mahamarg",
      "category": "highways",
      "sub_type": "Expressway",
      "state": "Maharashtra",
      "authority": "Maharashtra State Road Development Corporation",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#10b981",
      "code": "NE-1",
      "from": "Nagpur, Maharashtra",
      "to": "Mumbai, Maharashtra",
      "length_km": 701,
      "lanes": "6",
      "toll": true,
      "corridor_group": "Greenfield Expressway",
      "summary": "NE-1 (701 km): Connects Nagpur, Maharashtra to Mumbai, Maharashtra across Maharashtra.",
      "description": "Major trunk highway corridor under Maharashtra State Road Development Corporation. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          79.09,
          21.15
        ],
        [
          78.6,
          20.74
        ],
        [
          77.75,
          20.93
        ],
        [
          75.34,
          19.88
        ],
        [
          73.79,
          20
        ],
        [
          72.98,
          19.22
        ],
        [
          72.88,
          19.08
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_purvanchal_exp_",
    "properties": {
      "id": "hwy_purvanchal_exp_",
      "name": "Purvanchal Exp.: Purvanchal Expressway",
      "category": "highways",
      "sub_type": "Expressway",
      "state": "Uttar Pradesh",
      "authority": "UPEIDA / MoRTH",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#10b981",
      "code": "Purvanchal Exp.",
      "from": "Lucknow, Uttar Pradesh",
      "to": "Ghazipur, Uttar Pradesh",
      "length_km": 340,
      "lanes": "6",
      "toll": true,
      "corridor_group": "Greenfield Expressway",
      "summary": "Purvanchal Exp. (340 km): Connects Lucknow, Uttar Pradesh to Ghazipur, Uttar Pradesh across Uttar Pradesh.",
      "description": "Major trunk highway corridor under UPEIDA / MoRTH. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          80.95,
          26.85
        ],
        [
          82.07,
          26.26
        ],
        [
          83.18,
          26.06
        ],
        [
          83.59,
          25.58
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_agra_lucknow_exp_",
    "properties": {
      "id": "hwy_agra_lucknow_exp_",
      "name": "Agra–Lucknow Exp.: Agra–Lucknow Expressway",
      "category": "highways",
      "sub_type": "Expressway",
      "state": "Uttar Pradesh",
      "authority": "UPEIDA / MoRTH",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#10b981",
      "code": "Agra–Lucknow Exp.",
      "from": "Agra, Uttar Pradesh",
      "to": "Lucknow, Uttar Pradesh",
      "length_km": 302,
      "lanes": "6",
      "toll": true,
      "corridor_group": "Greenfield Expressway",
      "summary": "Agra–Lucknow Exp. (302 km): Connects Agra, Uttar Pradesh to Lucknow, Uttar Pradesh across Uttar Pradesh.",
      "description": "Major trunk highway corridor under UPEIDA / MoRTH. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          78.01,
          27.18
        ],
        [
          78.4,
          27.16
        ],
        [
          79.03,
          27.23
        ],
        [
          79.92,
          27.05
        ],
        [
          80.95,
          26.85
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_yamuna_exp_",
    "properties": {
      "id": "hwy_yamuna_exp_",
      "name": "Yamuna Exp.: Yamuna Expressway",
      "category": "highways",
      "sub_type": "Expressway",
      "state": "Uttar Pradesh",
      "authority": "Yamuna Expressway Industrial Development Authority",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#10b981",
      "code": "Yamuna Exp.",
      "from": "Greater Noida, Uttar Pradesh",
      "to": "Agra, Uttar Pradesh",
      "length_km": 165,
      "lanes": "6",
      "toll": true,
      "corridor_group": "Greenfield Expressway",
      "summary": "Yamuna Exp. (165 km): Connects Greater Noida, Uttar Pradesh to Agra, Uttar Pradesh across Uttar Pradesh.",
      "description": "Major trunk highway corridor under Yamuna Expressway Industrial Development Authority. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.39,
          28.54
        ],
        [
          77.67,
          27.49
        ],
        [
          78.01,
          27.18
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_ne_3",
    "properties": {
      "id": "hwy_ne_3",
      "name": "NE-3: Delhi–Meerut Expressway",
      "category": "highways",
      "sub_type": "Expressway",
      "state": "Delhi, Uttar Pradesh",
      "authority": "NHAI / MoRTH",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#10b981",
      "code": "NE-3",
      "from": "Delhi",
      "to": "Meerut, Uttar Pradesh",
      "length_km": 96,
      "lanes": "6–8",
      "toll": true,
      "corridor_group": "Greenfield Expressway",
      "summary": "NE-3 (96 km): Connects Delhi to Meerut, Uttar Pradesh across Delhi, Uttar Pradesh.",
      "description": "Major trunk highway corridor under NHAI / MoRTH. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.21,
          28.61
        ],
        [
          77.44,
          28.67
        ],
        [
          77.71,
          28.98
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_epe",
    "properties": {
      "id": "hwy_epe",
      "name": "EPE: Eastern Peripheral Expressway (KGP)",
      "category": "highways",
      "sub_type": "Expressway",
      "state": "Haryana, Uttar Pradesh",
      "authority": "NHAI / MoRTH",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#10b981",
      "code": "EPE",
      "from": "Kundli, Haryana",
      "to": "Palwal, Haryana",
      "length_km": 135,
      "lanes": "6",
      "toll": true,
      "corridor_group": "Regional Ring Road",
      "summary": "EPE (135 km): Connects Kundli, Haryana to Palwal, Haryana across Haryana, Uttar Pradesh.",
      "description": "Major trunk highway corridor under NHAI / MoRTH. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.12,
          28.88
        ],
        [
          77.22,
          28.95
        ],
        [
          77.53,
          28.68
        ],
        [
          77.39,
          28.54
        ],
        [
          77.31,
          28.41
        ],
        [
          77.33,
          28.14
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_wpe",
    "properties": {
      "id": "hwy_wpe",
      "name": "WPE: Western Peripheral Expressway (KMP)",
      "category": "highways",
      "sub_type": "Expressway",
      "state": "Haryana",
      "authority": "NHAI / MoRTH",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#10b981",
      "code": "WPE",
      "from": "Kundli, Haryana",
      "to": "Palwal, Haryana",
      "length_km": 135,
      "lanes": "6",
      "toll": true,
      "corridor_group": "Regional Ring Road",
      "summary": "WPE (135 km): Connects Kundli, Haryana to Palwal, Haryana across Haryana.",
      "description": "Major trunk highway corridor under NHAI / MoRTH. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.12,
          28.88
        ],
        [
          77.02,
          28.99
        ],
        [
          76.59,
          28.9
        ],
        [
          76.66,
          28.61
        ],
        [
          76.98,
          28.35
        ],
        [
          77.33,
          28.14
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_ganga_exp_",
    "properties": {
      "id": "hwy_ganga_exp_",
      "name": "Ganga Exp.: Ganga Expressway",
      "category": "highways",
      "sub_type": "Expressway",
      "state": "Uttar Pradesh",
      "authority": "UPEIDA / MoRTH",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#10b981",
      "code": "Ganga Exp.",
      "from": "Meerut, Uttar Pradesh",
      "to": "Prayagraj, Uttar Pradesh",
      "length_km": 594,
      "lanes": "6",
      "toll": true,
      "corridor_group": "Greenfield Expressway",
      "summary": "Ganga Exp. (594 km): Connects Meerut, Uttar Pradesh to Prayagraj, Uttar Pradesh across Uttar Pradesh.",
      "description": "Major trunk highway corridor under UPEIDA / MoRTH. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.71,
          28.98
        ],
        [
          77.78,
          28.73
        ],
        [
          77.86,
          28.4
        ],
        [
          79.57,
          27.39
        ],
        [
          80.33,
          26.45
        ],
        [
          80.81,
          25.93
        ],
        [
          81.85,
          25.44
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_b_luru_mysuru_exp_",
    "properties": {
      "id": "hwy_b_luru_mysuru_exp_",
      "name": "B'luru–Mysuru Exp.: Bengaluru–Mysuru Expressway",
      "category": "highways",
      "sub_type": "Expressway",
      "state": "Karnataka",
      "authority": "NHAI / MoRTH",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#10b981",
      "code": "B'luru–Mysuru Exp.",
      "from": "Bengaluru, Karnataka",
      "to": "Mysuru, Karnataka",
      "length_km": 118,
      "lanes": "6",
      "toll": true,
      "corridor_group": "Greenfield Expressway",
      "summary": "B'luru–Mysuru Exp. (118 km): Connects Bengaluru, Karnataka to Mysuru, Karnataka across Karnataka.",
      "description": "Major trunk highway corridor under NHAI / MoRTH. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.59,
          12.97
        ],
        [
          77.28,
          12.72
        ],
        [
          76.89,
          12.52
        ],
        [
          76.64,
          12.3
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_mumbai_pune_exp_",
    "properties": {
      "id": "hwy_mumbai_pune_exp_",
      "name": "Mumbai–Pune Exp.: Mumbai–Pune Expressway",
      "category": "highways",
      "sub_type": "Expressway",
      "state": "Maharashtra",
      "authority": "MSRDC / MoRTH",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#10b981",
      "code": "Mumbai–Pune Exp.",
      "from": "Mumbai, Maharashtra",
      "to": "Pune, Maharashtra",
      "length_km": 94,
      "lanes": "6",
      "toll": true,
      "corridor_group": "Greenfield Expressway",
      "summary": "Mumbai–Pune Exp. (94 km): Connects Mumbai, Maharashtra to Pune, Maharashtra across Maharashtra.",
      "description": "Major trunk highway corridor under MSRDC / MoRTH. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          72.88,
          19.08
        ],
        [
          73.11,
          18.99
        ],
        [
          73.4,
          18.75
        ],
        [
          73.86,
          18.52
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_rj_sh_61",
    "properties": {
      "id": "hwy_rj_sh_61",
      "name": "RJ SH 61: Jodhpur–Jaisalmer Highway",
      "category": "highways",
      "sub_type": "State Highway",
      "state": "Rajasthan",
      "authority": "Rajasthan PWD / MoRTH",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#94a3b8",
      "code": "RJ SH 61",
      "from": "Jodhpur, Rajasthan",
      "to": "Jaisalmer, Rajasthan",
      "length_km": 290,
      "lanes": "2",
      "toll": false,
      "corridor_group": "Thar Desert Corridor",
      "summary": "RJ SH 61 (290 km): Connects Jodhpur, Rajasthan to Jaisalmer, Rajasthan across Rajasthan.",
      "description": "Major trunk highway corridor under Rajasthan PWD / MoRTH. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          73.02,
          26.24
        ],
        [
          71.92,
          26.92
        ],
        [
          70.9,
          26.91
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "hwy_ecr",
    "properties": {
      "id": "hwy_ecr",
      "name": "ECR: East Coast Road (Chennai–Pondicherry–Nagapattinam)",
      "category": "highways",
      "sub_type": "State Highway",
      "state": "Tamil Nadu, Puducherry",
      "authority": "Tamil Nadu Highways Department",
      "official_reference": "National Highways Development Project (NHDP) / Bharatmala Pariyojana",
      "color": "#94a3b8",
      "code": "ECR",
      "from": "Chennai, Tamil Nadu",
      "to": "Nagapattinam, Tamil Nadu",
      "length_km": 340,
      "lanes": "2–4",
      "toll": false,
      "corridor_group": "Coastal Corridor",
      "summary": "ECR (340 km): Connects Chennai, Tamil Nadu to Nagapattinam, Tamil Nadu across Tamil Nadu, Puducherry.",
      "description": "Major trunk highway corridor under Tamil Nadu Highways Department. Key link in India's national logistics arterial grid."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          80.27,
          13.08
        ],
        [
          80.19,
          12.62
        ],
        [
          79.81,
          11.93
        ],
        [
          79.76,
          11.75
        ],
        [
          79.69,
          11.4
        ],
        [
          79.83,
          10.77
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "rail_wdfc",
    "properties": {
      "id": "rail_wdfc",
      "name": "Western Dedicated Freight Corridor (WDFC)",
      "category": "railways",
      "sub_type": "Dedicated Freight Corridor",
      "state": "UP, Haryana, Rajasthan, Gujarat, Maharashtra",
      "authority": "Dedicated Freight Corridor Corporation of India (DFCCIL)",
      "official_reference": "DFCCIL Annual Report 2023-24",
      "color": "#0284c7",
      "length_km": 1504,
      "gauge": "1676 mm (Broad Gauge)",
      "electrification_pct": 100,
      "route_type": "Double-stack container freight corridor (25-tonne axle load)",
      "summary": "Spans 1,504 km connecting Dadri (UP) to Jawaharlal Nehru Port (JNPT, Navi Mumbai). Designed for 100 km/h double-stack container trains.",
      "description": "Western Dedicated Freight Corridor (WDFC) (1504 km): Operates on 1676 mm (Broad Gauge) with 100% electrification. Key asset under Dedicated Freight Corridor Corporation of India (DFCCIL)."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.55,
          28.55
        ],
        [
          76.9,
          28.35
        ],
        [
          76.5,
          27.8
        ],
        [
          75.8,
          26.9
        ],
        [
          74.6,
          26.4
        ],
        [
          73.3,
          25.1
        ],
        [
          72.6,
          23.05
        ],
        [
          73.2,
          22.3
        ],
        [
          72.85,
          21.2
        ],
        [
          72.85,
          19
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "rail_edfc",
    "properties": {
      "id": "rail_edfc",
      "name": "Eastern Dedicated Freight Corridor (EDFC)",
      "category": "railways",
      "sub_type": "Dedicated Freight Corridor",
      "state": "Punjab, Haryana, UP, Bihar, Jharkhand, West Bengal",
      "authority": "Dedicated Freight Corridor Corporation of India (DFCCIL)",
      "official_reference": "DFCCIL Project Progress 2024",
      "color": "#0284c7",
      "length_km": 1875,
      "gauge": "1676 mm (Broad Gauge)",
      "electrification_pct": 100,
      "route_type": "Heavy-haul bulk freight corridor (coal and minerals)",
      "summary": "Spans 1,875 km connecting Sahnewal (Ludhiana) to Dankuni (Kolkata). Speeds coal transport from eastern coalfields to northern power plants.",
      "description": "Eastern Dedicated Freight Corridor (EDFC) (1875 km): Operates on 1676 mm (Broad Gauge) with 100% electrification. Key asset under Dedicated Freight Corridor Corporation of India (DFCCIL)."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          75.9,
          30.85
        ],
        [
          76.8,
          30.35
        ],
        [
          77.2,
          29.9
        ],
        [
          77.7,
          28.95
        ],
        [
          78.1,
          27.85
        ],
        [
          79,
          27.15
        ],
        [
          80.35,
          26.45
        ],
        [
          81.85,
          25.45
        ],
        [
          83.1,
          25.25
        ],
        [
          84.4,
          24.95
        ],
        [
          86.15,
          23.8
        ],
        [
          87.85,
          22.65
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "rail_mahsr",
    "properties": {
      "id": "rail_mahsr",
      "name": "Mumbai–Ahmedabad High-Speed Rail (MAHSR Bullet Train)",
      "category": "railways",
      "sub_type": "High-Speed Rail",
      "state": "Maharashtra, Gujarat, Dadra & Nagar Haveli",
      "authority": "National High Speed Rail Corporation (NHSRCL) / JICA",
      "official_reference": "NHSRCL Shinkansen Project Status",
      "color": "#06b6d4",
      "length_km": 508,
      "gauge": "1435 mm (Standard Gauge)",
      "electrification_pct": 100,
      "route_type": "E5 Series Shinkansen (Design Speed: 350 km/h, Operating: 320 km/h)",
      "summary": "India's flagship bullet train corridor connecting BKC Mumbai to Sabarmati Ahmedabad in 2 hours 7 minutes, featuring 12 stations and a 21 km undersea tunnel.",
      "description": "Mumbai–Ahmedabad High-Speed Rail (MAHSR Bullet Train) (508 km): Operates on 1435 mm (Standard Gauge) with 100% electrification. Key asset under National High Speed Rail Corporation (NHSRCL) / JICA."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          72.86,
          19.06
        ],
        [
          72.98,
          19.2
        ],
        [
          72.82,
          19.82
        ],
        [
          72.92,
          20.4
        ],
        [
          72.93,
          20.85
        ],
        [
          72.83,
          21.17
        ],
        [
          72.98,
          21.7
        ],
        [
          73.18,
          22.3
        ],
        [
          72.95,
          22.68
        ],
        [
          72.58,
          23.03
        ],
        [
          72.57,
          23.08
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "rail_delhi_howrah",
    "properties": {
      "id": "rail_delhi_howrah",
      "name": "Delhi–Howrah Grand Chord Trunk Route",
      "category": "railways",
      "sub_type": "Golden Quadrilateral Trunk Rail",
      "state": "Delhi, UP, Bihar, Jharkhand, West Bengal",
      "authority": "Indian Railways (Northern, North Central, East Central & Eastern Zones)",
      "official_reference": "Indian Railways Year Book 2023",
      "color": "#38bdf8",
      "length_km": 1445,
      "gauge": "1676 mm",
      "electrification_pct": 100,
      "route_type": "Mission Raftaar 160 km/h upgraded trunk line",
      "summary": "The busiest and most critical passenger and freight mainline in India, linking New Delhi to Kolkata via Kanpur, Prayagraj, Pt. Deen Dayal Upadhyaya, Gaya, and Dhanbad.",
      "description": "Delhi–Howrah Grand Chord Trunk Route (1445 km): Operates on 1676 mm with 100% electrification. Key asset under Indian Railways (Northern, North Central, East Central & Eastern Zones)."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.22,
          28.64
        ],
        [
          77.58,
          28.53
        ],
        [
          77.8,
          27.9
        ],
        [
          78.58,
          27.18
        ],
        [
          80.35,
          26.45
        ],
        [
          81.85,
          25.43
        ],
        [
          83.12,
          25.28
        ],
        [
          84.99,
          24.79
        ],
        [
          86.43,
          23.79
        ],
        [
          86.98,
          23.68
        ],
        [
          88.34,
          22.58
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "rail_delhi_mumbai",
    "properties": {
      "id": "rail_delhi_mumbai",
      "name": "Delhi–Mumbai Central Trunk Rail Route",
      "category": "railways",
      "sub_type": "Golden Quadrilateral Trunk Rail",
      "state": "Delhi, Haryana, Rajasthan, MP, Gujarat, Maharashtra",
      "authority": "Indian Railways (Western & West Central Railway)",
      "official_reference": "Indian Railways Golden Quadrilateral Upgrades",
      "color": "#38bdf8",
      "length_km": 1384,
      "gauge": "1676 mm",
      "electrification_pct": 100,
      "route_type": "Mission Raftaar 160 km/h semi-high speed passenger route",
      "summary": "Connects New Delhi to Mumbai Central via Mathura, Kota, Ratlam, Vadodara, and Surat. Host of the premier Rajdhani Express.",
      "description": "Delhi–Mumbai Central Trunk Rail Route (1384 km): Operates on 1676 mm with 100% electrification. Key asset under Indian Railways (Western & West Central Railway)."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.22,
          28.64
        ],
        [
          77.67,
          27.49
        ],
        [
          77.49,
          27.22
        ],
        [
          76.1,
          25.75
        ],
        [
          75.84,
          25.18
        ],
        [
          75.03,
          23.33
        ],
        [
          73.65,
          22.8
        ],
        [
          73.2,
          22.31
        ],
        [
          72.83,
          21.19
        ],
        [
          72.82,
          19.82
        ],
        [
          72.82,
          18.97
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "rail_konkan",
    "properties": {
      "id": "rail_konkan",
      "name": "Konkan Railway Coastal Corridor (KRCL)",
      "category": "railways",
      "sub_type": "Coastal Mountain Railway",
      "state": "Maharashtra, Goa, Karnataka",
      "authority": "Konkan Railway Corporation Limited (KRCL)",
      "official_reference": "KRCL Technical Documentation",
      "color": "#38bdf8",
      "length_km": 741,
      "gauge": "1676 mm",
      "electrification_pct": 100,
      "route_type": "High-speed scenic coastal railway with 91 tunnels and 2,000 bridges",
      "summary": "Engineered by E. Sreedharan through rugged Western Ghats terrain, linking Roha to Thokur/Mangaluru. Reduced Mumbai–Mangalore travel time by 26 hours.",
      "description": "Konkan Railway Coastal Corridor (KRCL) (741 km): Operates on 1676 mm with 100% electrification. Key asset under Konkan Railway Corporation Limited (KRCL)."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          73.12,
          18.43
        ],
        [
          73.28,
          17.98
        ],
        [
          73.3,
          16.99
        ],
        [
          73.72,
          15.89
        ],
        [
          73.98,
          15.28
        ],
        [
          74.13,
          14.8
        ],
        [
          74.48,
          14.28
        ],
        [
          74.75,
          13.34
        ],
        [
          74.85,
          12.92
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "rail_howrah_chennai",
    "properties": {
      "id": "rail_howrah_chennai",
      "name": "Howrah–Chennai Coastal Mainline",
      "category": "railways",
      "sub_type": "Golden Quadrilateral Trunk Rail",
      "state": "West Bengal, Odisha, Andhra Pradesh, Tamil Nadu",
      "authority": "Indian Railways (South Eastern & East Coast Railway)",
      "official_reference": "East Coast Mainline Doubling Project",
      "color": "#38bdf8",
      "length_km": 1661,
      "gauge": "1676 mm",
      "electrification_pct": 100,
      "route_type": "Double-track fully electrified coastal trunk line",
      "summary": "Major East Coast rail corridor connecting Kolkata to Chennai via Kharagpur, Cuttack, Bhubaneswar, Visakhapatnam, and Vijayawada.",
      "description": "Howrah–Chennai Coastal Mainline (1661 km): Operates on 1676 mm with 100% electrification. Key asset under Indian Railways (South Eastern & East Coast Railway)."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          88.34,
          22.58
        ],
        [
          87.32,
          22.34
        ],
        [
          86.91,
          21.49
        ],
        [
          85.88,
          20.46
        ],
        [
          85.82,
          20.27
        ],
        [
          84.9,
          19.32
        ],
        [
          83.3,
          17.72
        ],
        [
          82.23,
          16.98
        ],
        [
          80.64,
          16.51
        ],
        [
          80.05,
          14.44
        ],
        [
          80.28,
          13.08
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "rail_kashmir_usbrl",
    "properties": {
      "id": "rail_kashmir_usbrl",
      "name": "Udhampur–Srinagar–Baramulla Rail Link (USBRL)",
      "category": "railways",
      "sub_type": "Strategic Mountain Rail",
      "state": "Jammu & Kashmir",
      "authority": "Northern Railway & Konkan Railway Corporation",
      "official_reference": "USBRL National Project Report 2024",
      "color": "#38bdf8",
      "length_km": 272,
      "gauge": "1676 mm",
      "electrification_pct": 100,
      "route_type": "Himalayan mountain railway featuring the 359m Chenab Bridge and Pir Panjal Tunnel",
      "summary": "Integrates Kashmir Valley with the national Indian Railway network. Features the world's highest railway arch bridge over the Chenab River (359 m above river bed).",
      "description": "Udhampur–Srinagar–Baramulla Rail Link (USBRL) (272 km): Operates on 1676 mm with 100% electrification. Key asset under Northern Railway & Konkan Railway Corporation."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          75,
          32.92
        ],
        [
          75.13,
          33.15
        ],
        [
          74.88,
          33.18
        ],
        [
          75.18,
          33.52
        ],
        [
          75.02,
          33.73
        ],
        [
          74.8,
          34.08
        ],
        [
          74.35,
          34.2
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_del",
    "properties": {
      "id": "apt_del",
      "name": "Indira Gandhi International Airport (DEL)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Delhi NCR",
      "authority": "Delhi International Airport Limited (DIAL / GMR)",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "DEL",
      "icao_code": "VIDP",
      "passengers_mppa": 73.6,
      "runways_count": 4,
      "operator": "Delhi International Airport Limited (DIAL / GMR)",
      "summary": "DEL / VIDP: Indira Gandhi International Airport in New Delhi, Delhi NCR. Handles ~73.6 million passengers annually with 4 runway(s).",
      "description": "India's largest and busiest airport. Hub for Air India and IndiGo with 4 operational runways.",
      "coordinates": [
        77.1,
        28.5562
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.1,
        28.5562
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_bom",
    "properties": {
      "id": "apt_bom",
      "name": "Chhatrapati Shivaji Maharaj International Airport (BOM)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Maharashtra",
      "authority": "Mumbai International Airport Limited (MIAL / Adani)",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "BOM",
      "icao_code": "VABB",
      "passengers_mppa": 51.5,
      "runways_count": 2,
      "operator": "Mumbai International Airport Limited (MIAL / Adani)",
      "summary": "BOM / VABB: Chhatrapati Shivaji Maharaj International Airport in Mumbai, Maharashtra. Handles ~51.5 million passengers annually with 2 runway(s).",
      "description": "Premier commercial financial hub airport of India with historic Terminal 2 architectural marvel.",
      "coordinates": [
        72.8656,
        19.0896
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.8656,
        19.0896
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_blr",
    "properties": {
      "id": "apt_blr",
      "name": "Kempegowda International Airport (BLR)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Karnataka",
      "authority": "Bangalore International Airport Limited (BIAL)",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "BLR",
      "icao_code": "VOBL",
      "passengers_mppa": 37.2,
      "runways_count": 2,
      "operator": "Bangalore International Airport Limited (BIAL)",
      "summary": "BLR / VOBL: Kempegowda International Airport in Bengaluru, Karnataka. Handles ~37.2 million passengers annually with 2 runway(s).",
      "description": "Silicon Valley gateway featuring eco-friendly Terminal 2 \"Terminal in a Garden\". Dual parallel runways.",
      "coordinates": [
        77.7066,
        13.1986
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.7066,
        13.1986
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_hyd",
    "properties": {
      "id": "apt_hyd",
      "name": "Rajiv Gandhi International Airport (HYD)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Telangana",
      "authority": "GMR Hyderabad International Airport Limited (GHIAL)",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "HYD",
      "icao_code": "VOHS",
      "passengers_mppa": 25,
      "runways_count": 2,
      "operator": "GMR Hyderabad International Airport Limited (GHIAL)",
      "summary": "HYD / VOHS: Rajiv Gandhi International Airport in Hyderabad, Telangana. Handles ~25 million passengers annually with 2 runway(s).",
      "description": "Major south-central transit and pharmaceutical air freight hub. Consistently ranked top in passenger satisfaction.",
      "coordinates": [
        78.4294,
        17.2403
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        78.4294,
        17.2403
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_ccu",
    "properties": {
      "id": "apt_ccu",
      "name": "Netaji Subhash Chandra Bose International Airport (CCU)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "West Bengal",
      "authority": "Airports Authority of India (AAI)",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "CCU",
      "icao_code": "VECC",
      "passengers_mppa": 22.4,
      "runways_count": 2,
      "operator": "Airports Authority of India (AAI)",
      "summary": "CCU / VECC: Netaji Subhash Chandra Bose International Airport in Kolkata, West Bengal. Handles ~22.4 million passengers annually with 2 runway(s).",
      "description": "Primary air gateway to Eastern and North-Eastern India, handling heavy regional and ASEAN connectivity.",
      "coordinates": [
        88.4467,
        22.6547
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        88.4467,
        22.6547
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_maa",
    "properties": {
      "id": "apt_maa",
      "name": "Chennai International Airport (MAA)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Tamil Nadu",
      "authority": "Airports Authority of India (AAI)",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "MAA",
      "icao_code": "VOMM",
      "passengers_mppa": 21.3,
      "runways_count": 2,
      "operator": "Airports Authority of India (AAI)",
      "summary": "MAA / VOMM: Chennai International Airport in Chennai, Tamil Nadu. Handles ~21.3 million passengers annually with 2 runway(s).",
      "description": "Southern aviation hub with dedicated international and domestic terminals, major electronics and auto freight cargo.",
      "coordinates": [
        80.1709,
        12.9941
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        80.1709,
        12.9941
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_amd",
    "properties": {
      "id": "apt_amd",
      "name": "Sardar Vallabhbhai Patel International Airport (AMD)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Gujarat",
      "authority": "Adani Airport Holdings / AAI",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "AMD",
      "icao_code": "VAAH",
      "passengers_mppa": 11.8,
      "runways_count": 1,
      "operator": "Adani Airport Holdings / AAI",
      "summary": "AMD / VAAH: Sardar Vallabhbhai Patel International Airport in Ahmedabad, Gujarat. Handles ~11.8 million passengers annually with 1 runway(s).",
      "description": "Key business gateway serving Gujarat's industrial corridor, GIFT City, and international diamond/textile trade.",
      "coordinates": [
        72.6347,
        23.0772
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.6347,
        23.0772
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_cok",
    "properties": {
      "id": "apt_cok",
      "name": "Cochin International Airport (COK)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Kerala",
      "authority": "Cochin International Airport Limited (CIAL)",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "COK",
      "icao_code": "VOCI",
      "passengers_mppa": 10.3,
      "runways_count": 1,
      "operator": "Cochin International Airport Limited (CIAL)",
      "summary": "COK / VOCI: Cochin International Airport in Kochi, Kerala. Handles ~10.3 million passengers annually with 1 runway(s).",
      "description": "World's first 100% solar-powered airport (UN Champion of the Earth Award). India's pioneer PPP airport.",
      "coordinates": [
        76.393,
        10.1518
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        76.393,
        10.1518
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_gox",
    "properties": {
      "id": "apt_gox",
      "name": "Manohar International Airport (Mopa) (GOX)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Goa",
      "authority": "GMR Goa International Airport Limited",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "GOX",
      "icao_code": "VOGA",
      "passengers_mppa": 8.5,
      "runways_count": 1,
      "operator": "GMR Goa International Airport Limited",
      "summary": "GOX / VOGA: Manohar International Airport (Mopa) in Mopa, Pernem, Goa. Handles ~8.5 million passengers annually with 1 runway(s).",
      "description": "Greenfield international airport in North Goa commissioned in 2023, catering to international charters and cargo.",
      "coordinates": [
        73.8667,
        15.7667
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        73.8667,
        15.7667
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_pnq",
    "properties": {
      "id": "apt_pnq",
      "name": "Pune International Airport (PNQ)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Maharashtra",
      "authority": "Airports Authority of India (AAI / IAF)",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "PNQ",
      "icao_code": "VAPO",
      "passengers_mppa": 9.2,
      "runways_count": 1,
      "operator": "Airports Authority of India (AAI / IAF)",
      "summary": "PNQ / VAPO: Pune International Airport in Pune, Maharashtra. Handles ~9.2 million passengers annually with 1 runway(s).",
      "description": "High-growth civil enclave serving Pune's IT corridors, automobile manufacturing, and biotech research hubs.",
      "coordinates": [
        73.9197,
        18.5822
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        73.9197,
        18.5822
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_gau",
    "properties": {
      "id": "apt_gau",
      "name": "Lokpriya Gopinath Bordoloi International Airport (GAU)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Assam",
      "authority": "Adani Airport Holdings / AAI",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "GAU",
      "icao_code": "VEGT",
      "passengers_mppa": 5.8,
      "runways_count": 1,
      "operator": "Adani Airport Holdings / AAI",
      "summary": "GAU / VEGT: Lokpriya Gopinath Bordoloi International Airport in Guwahati, Assam. Handles ~5.8 million passengers annually with 1 runway(s).",
      "description": "Premier aviation gateway to the 8 North-Eastern states, undergoing massive new integrated terminal expansion.",
      "coordinates": [
        91.5859,
        26.1061
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        91.5859,
        26.1061
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_atq",
    "properties": {
      "id": "apt_atq",
      "name": "Sri Guru Ram Dass Jee International Airport (ATQ)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Punjab",
      "authority": "Airports Authority of India (AAI)",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "ATQ",
      "icao_code": "VIAR",
      "passengers_mppa": 3.2,
      "runways_count": 1,
      "operator": "Airports Authority of India (AAI)",
      "summary": "ATQ / VIAR: Sri Guru Ram Dass Jee International Airport in Amritsar, Punjab. Handles ~3.2 million passengers annually with 1 runway(s).",
      "description": "Key northern international gateway connecting the global Punjabi diaspora with direct flights to UK, Canada, and Gulf.",
      "coordinates": [
        74.7973,
        31.7096
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        74.7973,
        31.7096
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_sxr",
    "properties": {
      "id": "apt_sxr",
      "name": "Sheikh ul-Alam International Airport (SXR)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Jammu & Kashmir",
      "authority": "AAI / Indian Air Force",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "SXR",
      "icao_code": "VISR",
      "passengers_mppa": 4.4,
      "runways_count": 1,
      "operator": "AAI / Indian Air Force",
      "summary": "SXR / VISR: Sheikh ul-Alam International Airport in Srinagar, Jammu & Kashmir. Handles ~4.4 million passengers annually with 1 runway(s).",
      "description": "Strategic civil enclave and primary tourism lifeline for the Kashmir Valley situated at 1,655 m elevation.",
      "coordinates": [
        74.7742,
        33.9871
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        74.7742,
        33.9871
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_lko",
    "properties": {
      "id": "apt_lko",
      "name": "Chaudhary Charan Singh International Airport (LKO)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Uttar Pradesh",
      "authority": "Adani Airport Holdings / AAI",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "LKO",
      "icao_code": "VILK",
      "passengers_mppa": 6.2,
      "runways_count": 1,
      "operator": "Adani Airport Holdings / AAI",
      "summary": "LKO / VILK: Chaudhary Charan Singh International Airport in Lucknow, Uttar Pradesh. Handles ~6.2 million passengers annually with 1 runway(s).",
      "description": "Central UP gateway airport with newly commissioned Terminal 3 designed to handle 13 million passengers.",
      "coordinates": [
        80.8893,
        26.7606
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        80.8893,
        26.7606
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_vns",
    "properties": {
      "id": "apt_vns",
      "name": "Lal Bahadur Shastri International Airport (VNS)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Uttar Pradesh",
      "authority": "Airports Authority of India (AAI)",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "VNS",
      "icao_code": "VEBN",
      "passengers_mppa": 3,
      "runways_count": 1,
      "operator": "Airports Authority of India (AAI)",
      "summary": "VNS / VEBN: Lal Bahadur Shastri International Airport in Varanasi, Uttar Pradesh. Handles ~3 million passengers annually with 1 runway(s).",
      "description": "Spiritual capital gateway connecting Buddhist pilgrimage circuit and international tourists to Kashi.",
      "coordinates": [
        82.8593,
        25.4524
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        82.8593,
        25.4524
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_jai",
    "properties": {
      "id": "apt_jai",
      "name": "Jaipur International Airport (JAI)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Rajasthan",
      "authority": "Adani Airport Holdings / AAI",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "JAI",
      "icao_code": "VIJP",
      "passengers_mppa": 5.4,
      "runways_count": 1,
      "operator": "Adani Airport Holdings / AAI",
      "summary": "JAI / VIJP: Jaipur International Airport in Jaipur, Rajasthan. Handles ~5.4 million passengers annually with 1 runway(s).",
      "description": "Golden Triangle tourism airport and primary international connection for Rajasthan handicraft and gem trade.",
      "coordinates": [
        75.8122,
        26.8242
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        75.8122,
        26.8242
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_bbi",
    "properties": {
      "id": "apt_bbi",
      "name": "Biju Patnaik International Airport (BBI)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Odisha",
      "authority": "Airports Authority of India (AAI)",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "BBI",
      "icao_code": "VEBS",
      "passengers_mppa": 4.6,
      "runways_count": 1,
      "operator": "Airports Authority of India (AAI)",
      "summary": "BBI / VEBS: Biju Patnaik International Airport in Bhubaneswar, Odisha. Handles ~4.6 million passengers annually with 1 runway(s).",
      "description": "Premier air hub of Odisha supporting mineral industries, IT growth, and Eastern pilgrimage circuits.",
      "coordinates": [
        85.8178,
        20.2444
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        85.8178,
        20.2444
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_trv",
    "properties": {
      "id": "apt_trv",
      "name": "Thiruvananthapuram International Airport (TRV)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Kerala",
      "authority": "Adani Airport Holdings / AAI",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "TRV",
      "icao_code": "VOTV",
      "passengers_mppa": 4.4,
      "runways_count": 1,
      "operator": "Adani Airport Holdings / AAI",
      "summary": "TRV / VOTV: Thiruvananthapuram International Airport in Thiruvananthapuram, Kerala. Handles ~4.4 million passengers annually with 1 runway(s).",
      "description": "India's fifth international airport, strategic southern aviation gateway adjacent to Shankumugham Beach.",
      "coordinates": [
        76.92,
        8.4821
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        76.92,
        8.4821
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_dxn",
    "properties": {
      "id": "apt_dxn",
      "name": "Noida International Airport (Jewar) (DXN)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Uttar Pradesh",
      "authority": "Yamuna International Airport Pvt Ltd (Zurich Airport AG)",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "DXN",
      "icao_code": "VNDX",
      "passengers_mppa": 12,
      "runways_count": 2,
      "operator": "Yamuna International Airport Pvt Ltd (Zurich Airport AG)",
      "summary": "DXN / VNDX: Noida International Airport (Jewar) in Jewar, Gautam Buddha Nagar, Uttar Pradesh. Handles ~12 million passengers annually with 2 runway(s).",
      "description": "Upcoming greenfield mega aerotropolis designed for 70 mppa across 6 runways upon full build-out. NCR's 2nd hub.",
      "coordinates": [
        77.6256,
        28.1633
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.6256,
        28.1633
      ]
    }
  },
  {
    "type": "Feature",
    "id": "apt_nmi",
    "properties": {
      "id": "apt_nmi",
      "name": "Navi Mumbai International Airport (DB Patil) (NMI)",
      "category": "airports",
      "sub_type": "International / Domestic Hub",
      "state": "Maharashtra",
      "authority": "Navi Mumbai International Airport Ltd (NMIAL / Adani)",
      "official_reference": "AAI Airport Operations / DGCA Stat Handbook",
      "color": "#818cf8",
      "iata_code": "NMI",
      "icao_code": "VNMI",
      "passengers_mppa": 20,
      "runways_count": 2,
      "operator": "Navi Mumbai International Airport Ltd (NMIAL / Adani)",
      "summary": "NMI / VNMI: Navi Mumbai International Airport (DB Patil) in Ulwe, Navi Mumbai, Maharashtra. Handles ~20 million passengers annually with 2 runway(s).",
      "description": "Greenfield dual-runway mega airport relieving Mumbai CSMIA air congestion, linked by Mumbai Trans Harbour Link (Atal Setu).",
      "coordinates": [
        73.0683,
        18.9894
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        73.0683,
        18.9894
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_jnpt",
    "properties": {
      "id": "port_jnpt",
      "name": "Jawaharlal Nehru Port (Nhava Sheva)",
      "category": "seaports",
      "sub_type": "Major Port (Container Hub)",
      "state": "Maharashtra",
      "authority": "JNPA / Ministry of Ports",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 85.8,
      "container_teu": 6.05,
      "draft_m": 15.5,
      "berths": 16,
      "port_type": "Major Port (Container Hub)",
      "summary": "Jawaharlal Nehru Port (Nhava Sheva): Major Port (Container Hub) in Navi Mumbai, Maharashtra. Throughput: 85.8 MMT / 6.05M TEUs. Depth Draft: 15.5 m.",
      "description": "India's premier container port, handling over 50% of the country's total containerized cargo. Terminal station of Western DFC.",
      "coordinates": [
        72.95,
        18.95
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.95,
        18.95
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_mundra",
    "properties": {
      "id": "port_mundra",
      "name": "Mundra Port & SEZ",
      "category": "seaports",
      "sub_type": "Private Commercial Mega Port",
      "state": "Gujarat",
      "authority": "Adani Ports and SEZ (APSEZ)",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 155,
      "container_teu": 7.2,
      "draft_m": 17.5,
      "berths": 24,
      "port_type": "Private Commercial Mega Port",
      "summary": "Mundra Port & SEZ: Private Commercial Mega Port in Mundra, Kutch, Gujarat. Throughput: 155 MMT / 7.2M TEUs. Depth Draft: 17.5 m.",
      "description": "India's largest commercial port by cargo volume (>155 MMT). Deep-draft port handling mega container vessels and coal.",
      "coordinates": [
        69.7,
        22.74
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        69.7,
        22.74
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_kandla",
    "properties": {
      "id": "port_kandla",
      "name": "Deendayal Port (Kandla)",
      "category": "seaports",
      "sub_type": "Major Trust Port (Bulk Hub)",
      "state": "Gujarat",
      "authority": "Deendayal Port Authority",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 137.5,
      "container_teu": 0.5,
      "draft_m": 14.5,
      "berths": 18,
      "port_type": "Major Trust Port (Bulk Hub)",
      "summary": "Deendayal Port (Kandla): Major Trust Port (Bulk Hub) in Gandhidham, Kutch, Gujarat. Throughput: 137.5 MMT / 0.5M TEUs. Depth Draft: 14.5 m.",
      "description": "India's top major port for liquid cargo and bulk imports, serving the landlocked hinterland of North-Western India.",
      "coordinates": [
        70.2189,
        23.0033
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        70.2189,
        23.0033
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_mumbai",
    "properties": {
      "id": "port_mumbai",
      "name": "Mumbai Port (MbPA)",
      "category": "seaports",
      "sub_type": "Major Trust Port (Natural Harbor)",
      "state": "Maharashtra",
      "authority": "Mumbai Port Authority",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 63.6,
      "container_teu": 0.25,
      "draft_m": 12,
      "berths": 32,
      "port_type": "Major Trust Port (Natural Harbor)",
      "summary": "Mumbai Port (MbPA): Major Trust Port (Natural Harbor) in Mumbai, Maharashtra. Throughput: 63.6 MMT / 0.25M TEUs. Depth Draft: 12 m.",
      "description": "Historic natural deepwater harbor operating since 1873. Major hub for crude petroleum imports and offshore supply vessels.",
      "coordinates": [
        72.84,
        18.93
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.84,
        18.93
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_chennai",
    "properties": {
      "id": "port_chennai",
      "name": "Chennai Port",
      "category": "seaports",
      "sub_type": "Major Trust Port",
      "state": "Tamil Nadu",
      "authority": "Chennai Port Authority",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 51.6,
      "container_teu": 1.55,
      "draft_m": 15.5,
      "berths": 24,
      "port_type": "Major Trust Port",
      "summary": "Chennai Port: Major Trust Port in Chennai, Tamil Nadu. Throughput: 51.6 MMT / 1.55M TEUs. Depth Draft: 15.5 m.",
      "description": "Third-oldest port in India, premier automotive export hub (\"Detroit of Asia\") and container transshipment facility.",
      "coordinates": [
        80.298,
        13.0833
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        80.298,
        13.0833
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_kamrajar",
    "properties": {
      "id": "port_kamrajar",
      "name": "Kamarajar Port (Ennore)",
      "category": "seaports",
      "sub_type": "Corporatized Major Port",
      "state": "Tamil Nadu",
      "authority": "Kamarajar Port Limited",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 43.5,
      "container_teu": 0.55,
      "draft_m": 16,
      "berths": 9,
      "port_type": "Corporatized Major Port",
      "summary": "Kamarajar Port (Ennore): Corporatized Major Port in Ennore, Chennai, Tamil Nadu. Throughput: 43.5 MMT / 0.55M TEUs. Depth Draft: 16 m.",
      "description": "India's first corporatized major port, dedicated to bulk thermal coal imports for TANGEDCO power stations and automobile exports.",
      "coordinates": [
        80.3333,
        13.25
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        80.3333,
        13.25
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_tuticorin",
    "properties": {
      "id": "port_tuticorin",
      "name": "V.O. Chidambaranar Port (Tuticorin)",
      "category": "seaports",
      "sub_type": "Major Trust Port",
      "state": "Tamil Nadu",
      "authority": "VOC Port Authority",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 38,
      "container_teu": 0.78,
      "draft_m": 14.2,
      "berths": 16,
      "port_type": "Major Trust Port",
      "summary": "V.O. Chidambaranar Port (Tuticorin): Major Trust Port in Thoothukudi, Tamil Nadu. Throughput: 38 MMT / 0.78M TEUs. Depth Draft: 14.2 m.",
      "description": "Strategic Gulf of Mannar port close to east-west international maritime shipping lanes. Major green hydrogen hub initiative.",
      "coordinates": [
        78.1833,
        8.75
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        78.1833,
        8.75
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_cochin",
    "properties": {
      "id": "port_cochin",
      "name": "Cochin Port (Vallarpadam ICTT)",
      "category": "seaports",
      "sub_type": "Major Port (Transshipment Hub)",
      "state": "Kerala",
      "authority": "Cochin Port Authority / DP World",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 35.2,
      "container_teu": 0.7,
      "draft_m": 14.5,
      "berths": 19,
      "port_type": "Major Port (Transshipment Hub)",
      "summary": "Cochin Port (Vallarpadam ICTT): Major Port (Transshipment Hub) in Kochi, Kerala. Throughput: 35.2 MMT / 0.7M TEUs. Depth Draft: 14.5 m.",
      "description": "Natural harbor on the Arabian Sea, featuring India's first dedicated international container transshipment terminal (ICTT).",
      "coordinates": [
        76.2667,
        9.9667
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        76.2667,
        9.9667
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_mangaluru",
    "properties": {
      "id": "port_mangaluru",
      "name": "New Mangalore Port",
      "category": "seaports",
      "sub_type": "Major Trust Port",
      "state": "Karnataka",
      "authority": "New Mangalore Port Authority",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 41.4,
      "container_teu": 0.15,
      "draft_m": 15.1,
      "berths": 16,
      "port_type": "Major Trust Port",
      "summary": "New Mangalore Port: Major Trust Port in Panambur, Mangaluru, Karnataka. Throughput: 41.4 MMT / 0.15M TEUs. Depth Draft: 15.1 m.",
      "description": "Karnataka's only major port. Premier export point for Kudremukh iron ore pellets and import terminal for crude oil and LPG.",
      "coordinates": [
        74.81,
        12.92
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        74.81,
        12.92
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_mormugao",
    "properties": {
      "id": "port_mormugao",
      "name": "Mormugao Port",
      "category": "seaports",
      "sub_type": "Major Trust Port",
      "state": "Goa",
      "authority": "Mormugao Port Authority",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 20.6,
      "container_teu": 0.05,
      "draft_m": 14.4,
      "berths": 11,
      "port_type": "Major Trust Port",
      "summary": "Mormugao Port: Major Trust Port in Vasco da Gama, Goa. Throughput: 20.6 MMT / 0.05M TEUs. Depth Draft: 14.4 m.",
      "description": "Natural harbor situated at the mouth of the Zuari River, historically leading in iron ore exports from Goan mining belts.",
      "coordinates": [
        73.8,
        15.4167
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        73.8,
        15.4167
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_vizag",
    "properties": {
      "id": "port_vizag",
      "name": "Visakhapatnam Port (Vizag)",
      "category": "seaports",
      "sub_type": "Major Trust Port (Deepwater)",
      "state": "Andhra Pradesh",
      "authority": "Visakhapatnam Port Authority",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 73.7,
      "container_teu": 0.6,
      "draft_m": 18.1,
      "berths": 29,
      "port_type": "Major Trust Port (Deepwater)",
      "summary": "Visakhapatnam Port (Vizag): Major Trust Port (Deepwater) in Visakhapatnam, Andhra Pradesh. Throughput: 73.7 MMT / 0.6M TEUs. Depth Draft: 18.1 m.",
      "description": "Deepest major port on India's East Coast, handling iron ore exports to Japan, thermal coal, and petroleum. Major naval bastion.",
      "coordinates": [
        83.2833,
        17.6833
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        83.2833,
        17.6833
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_paradip",
    "properties": {
      "id": "port_paradip",
      "name": "Paradip Port",
      "category": "seaports",
      "sub_type": "Major Trust Port",
      "state": "Odisha",
      "authority": "Paradip Port Authority",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 145.4,
      "container_teu": 0.05,
      "draft_m": 17.1,
      "berths": 20,
      "port_type": "Major Trust Port",
      "summary": "Paradip Port: Major Trust Port in Paradip, Jagatsinghpur, Odisha. Throughput: 145.4 MMT / 0.05M TEUs. Depth Draft: 17.1 m.",
      "description": "India's highest cargo-throughput major port in FY24 (145.4 MMT), dedicated to mechanized coal and iron ore logistics.",
      "coordinates": [
        86.67,
        20.26
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        86.67,
        20.26
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_kolkata_haldia",
    "properties": {
      "id": "port_kolkata_haldia",
      "name": "Syama Prasad Mookerjee Port (Kolkata & Haldia)",
      "category": "seaports",
      "sub_type": "Riverine Major Port",
      "state": "West Bengal",
      "authority": "SMPA / Ministry of Ports",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 65.6,
      "container_teu": 0.85,
      "draft_m": 8.5,
      "berths": 30,
      "port_type": "Riverine Major Port",
      "summary": "Syama Prasad Mookerjee Port (Kolkata & Haldia): Riverine Major Port in Kolkata & Haldia, West Bengal. Throughput: 65.6 MMT / 0.85M TEUs. Depth Draft: 8.5 m.",
      "description": "India's only riverine major port, situated on the Hooghly River. Gateway for Nepal and Bhutan transit trade.",
      "coordinates": [
        88.08,
        22.03
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        88.08,
        22.03
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_vadhavan",
    "properties": {
      "id": "port_vadhavan",
      "name": "Vadhavan Mega Deepwater Port",
      "category": "seaports",
      "sub_type": "Approved Greenfield Mega Port (₹76,200 Cr)",
      "state": "Maharashtra",
      "authority": "JNPA & Maharashtra Maritime Board",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 298,
      "container_teu": 23.2,
      "draft_m": 20,
      "berths": 32,
      "port_type": "Approved Greenfield Mega Port (₹76,200 Cr)",
      "summary": "Vadhavan Mega Deepwater Port: Approved Greenfield Mega Port (₹76,200 Cr) in Dahanu, Palghar, Maharashtra. Throughput: 298 MMT / 23.2M TEUs. Depth Draft: 20 m.",
      "description": "Cabinet-approved (2024) ₹76,200 crore greenfield all-weather deep-draft port. Draft of 20m accommodates 24,000 TEU mega ships.",
      "coordinates": [
        72.67,
        19.98
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.67,
        19.98
      ]
    }
  },
  {
    "type": "Feature",
    "id": "port_vizhinjam",
    "properties": {
      "id": "port_vizhinjam",
      "name": "Vizhinjam International Transshipment Seaport",
      "category": "seaports",
      "sub_type": "Deepwater Transshipment Mega Port",
      "state": "Kerala",
      "authority": "Adani Ports / Government of Kerala",
      "official_reference": "Ministry of Ports, Shipping and Waterways / Sagarmala Atlas",
      "color": "#06b6d4",
      "cargo_mmt": 30,
      "container_teu": 3,
      "draft_m": 20,
      "berths": 5,
      "port_type": "Deepwater Transshipment Mega Port",
      "summary": "Vizhinjam International Transshipment Seaport: Deepwater Transshipment Mega Port in Thiruvananthapuram, Kerala. Throughput: 30 MMT / 3M TEUs. Depth Draft: 20 m.",
      "description": "India's first transshipment deepwater container port, possessing a 20m natural draft only 1 nautical mile from the Suez-Malacca shipping lane.",
      "coordinates": [
        76.9833,
        8.3667
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        76.9833,
        8.3667
      ]
    }
  },
  {
    "type": "Feature",
    "id": "cor_dmic",
    "properties": {
      "id": "cor_dmic",
      "name": "Delhi–Mumbai Industrial Corridor (DMIC)",
      "category": "industrial_corridors",
      "sub_type": "National Industrial Corridor",
      "state": "Delhi, Haryana, Rajasthan, MP, Gujarat, Maharashtra",
      "authority": "National Industrial Corridor Development Corporation (NICDC)",
      "official_reference": "NICDC Strategic Master Plan",
      "color": "#d946ef",
      "length_km": 1504,
      "nodes": [
        "Dholera SIR (Gujarat)",
        "Shendra-Bidkin (Maharashtra)",
        "Manesar-Bawal (Haryana)",
        "Khushkhera-Bhiwadi-Neemrana (Rajasthan)",
        "Pithampur-Dhar (MP)",
        "Dighi Port Industrial Area"
      ],
      "investment_target_usd": "$100 Billion",
      "summary": "Delhi–Mumbai Industrial Corridor (DMIC) (1504 km): Spans Delhi, Haryana, Rajasthan, MP, Gujarat, Maharashtra. Major nodes: Dholera SIR (Gujarat), Shendra-Bidkin (Maharashtra), Manesar-Bawal (Haryana). Target Investment: $100 Billion.",
      "description": "India's most ambitious smart city infrastructure program, spanning 1,504 km along the Western Dedicated Freight Corridor with 24 investment nodes."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.22,
          28.61
        ],
        [
          76.85,
          28.35
        ],
        [
          75.8,
          26.9
        ],
        [
          74.6,
          26.4
        ],
        [
          73.5,
          25.1
        ],
        [
          72.58,
          23.03
        ],
        [
          72.2,
          22.25
        ],
        [
          73.2,
          22.3
        ],
        [
          72.83,
          21.17
        ],
        [
          72.86,
          19.06
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "cor_akic",
    "properties": {
      "id": "cor_akic",
      "name": "Amritsar–Kolkata Industrial Corridor (AKIC)",
      "category": "industrial_corridors",
      "sub_type": "National Industrial Corridor",
      "state": "Punjab, Haryana, UP, Bihar, Jharkhand, West Bengal",
      "authority": "National Industrial Corridor Development Corporation (NICDC)",
      "official_reference": "NICDC Strategic Master Plan",
      "color": "#d946ef",
      "length_km": 1839,
      "nodes": [
        "Rajpura-Patiala (Punjab)",
        "Praghurajpur (Haryana)",
        "Bhaupur-Kanpur (UP)",
        "Naini-Prayagraj (UP)",
        "Baddi-Barhi (Jharkhand)",
        "Raghunathpur (West Bengal)"
      ],
      "investment_target_usd": "$50 Billion",
      "summary": "Amritsar–Kolkata Industrial Corridor (AKIC) (1839 km): Spans Punjab, Haryana, UP, Bihar, Jharkhand, West Bengal. Major nodes: Rajpura-Patiala (Punjab), Praghurajpur (Haryana), Bhaupur-Kanpur (UP). Target Investment: $50 Billion.",
      "description": "Covers 7 states along the Eastern Dedicated Freight Corridor, modernizing the agro-industrial and manufacturing spine of the Indo-Gangetic basin."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          74.87,
          31.63
        ],
        [
          75.85,
          30.9
        ],
        [
          76.78,
          30.38
        ],
        [
          77.55,
          28.6
        ],
        [
          80.35,
          26.45
        ],
        [
          81.85,
          25.43
        ],
        [
          83,
          25.25
        ],
        [
          84.99,
          24.79
        ],
        [
          86.15,
          23.8
        ],
        [
          88.36,
          22.57
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "cor_cbic",
    "properties": {
      "id": "cor_cbic",
      "name": "Chennai–Bengaluru Industrial Corridor (CBIC)",
      "category": "industrial_corridors",
      "sub_type": "National Industrial Corridor",
      "state": "Tamil Nadu, Andhra Pradesh, Karnataka",
      "authority": "National Industrial Corridor Development Corporation (NICDC)",
      "official_reference": "NICDC Strategic Master Plan",
      "color": "#d946ef",
      "length_km": 560,
      "nodes": [
        "Ponneri (Tamil Nadu)",
        "Tumakuru Industrial Township (Karnataka)",
        "Krishnapatnam Node (Andhra Pradesh)"
      ],
      "investment_target_usd": "$25 Billion",
      "summary": "Chennai–Bengaluru Industrial Corridor (CBIC) (560 km): Spans Tamil Nadu, Andhra Pradesh, Karnataka. Major nodes: Ponneri (Tamil Nadu), Tumakuru Industrial Township (Karnataka), Krishnapatnam Node (Andhra Pradesh). Target Investment: $25 Billion.",
      "description": "High-tech electronics, aerospace, and precision engineering corridor backed by JICA, connecting Chennai Port to the tech hub of Bengaluru."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          80.27,
          13.08
        ],
        [
          79.7,
          12.98
        ],
        [
          78.6,
          12.95
        ],
        [
          77.59,
          12.97
        ],
        [
          77.1,
          13.34
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "cor_bmic",
    "properties": {
      "id": "cor_bmic",
      "name": "Bengaluru–Mumbai Industrial Corridor (BMIC)",
      "category": "industrial_corridors",
      "sub_type": "National Industrial Corridor",
      "state": "Karnataka, Maharashtra",
      "authority": "National Industrial Corridor Development Corporation (NICDC)",
      "official_reference": "NICDC Strategic Master Plan",
      "color": "#d946ef",
      "length_km": 1000,
      "nodes": [
        "Dharwad Node (Karnataka)",
        "Belagavi Node",
        "Satara-Sangli Node",
        "Pune-Chakan Auto Hub"
      ],
      "investment_target_usd": "$30 Billion",
      "summary": "Bengaluru–Mumbai Industrial Corridor (BMIC) (1000 km): Spans Karnataka, Maharashtra. Major nodes: Dharwad Node (Karnataka), Belagavi Node, Satara-Sangli Node. Target Investment: $30 Billion.",
      "description": "Bridges the industrial clusters of western and southern India along NH 48, linking automotive, heavy engineering, and software corridors."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.59,
          12.97
        ],
        [
          75.92,
          14.47
        ],
        [
          75.05,
          15.36
        ],
        [
          74.5,
          15.85
        ],
        [
          74.24,
          16.7
        ],
        [
          73.86,
          18.52
        ],
        [
          72.86,
          19.06
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "cor_vcic",
    "properties": {
      "id": "cor_vcic",
      "name": "Vizag–Chennai Industrial Corridor (VCIC / ECEC)",
      "category": "industrial_corridors",
      "sub_type": "National Industrial Corridor",
      "state": "Andhra Pradesh, Tamil Nadu",
      "authority": "National Industrial Corridor Development Corporation (NICDC)",
      "official_reference": "NICDC Strategic Master Plan",
      "color": "#d946ef",
      "length_km": 800,
      "nodes": [
        "Visakhapatnam Node",
        "Kakinada PCPIR Node",
        "Machilipatnam Node",
        "Yerpedu-Srikalahasti Node"
      ],
      "investment_target_usd": "$35 Billion",
      "summary": "Vizag–Chennai Industrial Corridor (VCIC / ECEC) (800 km): Spans Andhra Pradesh, Tamil Nadu. Major nodes: Visakhapatnam Node, Kakinada PCPIR Node, Machilipatnam Node. Target Investment: $35 Billion.",
      "description": "Phase 1 of the East Coast Economic Corridor (ECEC) funded by ADB, unlocking deep-draft maritime export manufacturing in coastal Andhra Pradesh."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          83.28,
          17.68
        ],
        [
          82.23,
          16.98
        ],
        [
          80.64,
          16.51
        ],
        [
          80.05,
          14.44
        ],
        [
          79.5,
          13.7
        ],
        [
          80.27,
          13.08
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "cor_hnic",
    "properties": {
      "id": "cor_hnic",
      "name": "Hyderabad–Nagpur Industrial Corridor (HNIC)",
      "category": "industrial_corridors",
      "sub_type": "National Industrial Corridor",
      "state": "Telangana, Maharashtra",
      "authority": "National Industrial Corridor Development Corporation (NICDC)",
      "official_reference": "NICDC Strategic Master Plan",
      "color": "#d946ef",
      "length_km": 500,
      "nodes": [
        "Zaheerabad NIMZ (Telangana)",
        "Nagpur MIHAN Multi-modal Hub (Maharashtra)"
      ],
      "investment_target_usd": "$20 Billion",
      "summary": "Hyderabad–Nagpur Industrial Corridor (HNIC) (500 km): Spans Telangana, Maharashtra. Major nodes: Zaheerabad NIMZ (Telangana), Nagpur MIHAN Multi-modal Hub (Maharashtra). Target Investment: $20 Billion.",
      "description": "North-South logistics and defense manufacturing spine linking the pharmaceutical innovation hub of Hyderabad with the central air-cargo hub of Nagpur."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          78.48,
          17.38
        ],
        [
          78.2,
          18.6
        ],
        [
          78.5,
          19.67
        ],
        [
          79.08,
          21.14
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "cor_dnic",
    "properties": {
      "id": "cor_dnic",
      "name": "Delhi–Nagpur Industrial Corridor (DNIC)",
      "category": "industrial_corridors",
      "sub_type": "National Industrial Corridor",
      "state": "UP, Madhya Pradesh, Maharashtra",
      "authority": "National Industrial Corridor Development Corporation (NICDC)",
      "official_reference": "NICDC Strategic Master Plan",
      "color": "#d946ef",
      "length_km": 1080,
      "nodes": [
        "Agra Node",
        "Gwalior Node",
        "Bhopal-Mandideep",
        "Nagpur Logistics Hub"
      ],
      "investment_target_usd": "$25 Billion",
      "summary": "Delhi–Nagpur Industrial Corridor (DNIC) (1080 km): Spans UP, Madhya Pradesh, Maharashtra. Major nodes: Agra Node, Gwalior Node, Bhopal-Mandideep. Target Investment: $25 Billion.",
      "description": "Central Indian connectivity corridor unlocking mineral, engineering, and logistics investments across the Bundelkhand and Malwa plateaus."
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          77.22,
          28.61
        ],
        [
          78.01,
          27.18
        ],
        [
          78.18,
          26.22
        ],
        [
          77.41,
          23.25
        ],
        [
          79.08,
          21.14
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "dam_tehri",
    "properties": {
      "id": "dam_tehri",
      "name": "Tehri Dam & Hydroelectric Project",
      "category": "dams",
      "sub_type": "Earth & Rock-fill Dam",
      "state": "Uttarakhand",
      "authority": "Central Water Commission (CWC) / State WRD",
      "official_reference": "National Register of Large Dams (NRLD 2023)",
      "color": "#0284c7",
      "river": "Bhagirathi",
      "dam_type": "Earth & Rock-fill Dam",
      "height_m": 260.5,
      "length_km": 0.57,
      "reservoir_capacity_mcm": 3540,
      "installed_capacity_mw": 2400,
      "summary": "Tehri Dam & Hydroelectric Project: Built on Bhagirathi River in Uttarakhand. Height: 260.5 m. Capacity: 3540 MCM. Power: 2400 MW.",
      "description": "Highest dam in India (260.5 m) and 8th tallest in the world. Powers a 2,400 MW complex providing peak power and drinking water to Delhi & UP.",
      "coordinates": [
        78.48,
        30.3783
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        78.48,
        30.3783
      ]
    }
  },
  {
    "type": "Feature",
    "id": "dam_bhakra",
    "properties": {
      "id": "dam_bhakra",
      "name": "Bhakra–Nangal Dam",
      "category": "dams",
      "sub_type": "Concrete Gravity Dam",
      "state": "Himachal Pradesh & Punjab",
      "authority": "Central Water Commission (CWC) / State WRD",
      "official_reference": "National Register of Large Dams (NRLD 2023)",
      "color": "#0284c7",
      "river": "Sutlej",
      "dam_type": "Concrete Gravity Dam",
      "height_m": 226,
      "length_km": 0.52,
      "reservoir_capacity_mcm": 9340,
      "installed_capacity_mw": 1325,
      "summary": "Bhakra–Nangal Dam: Built on Sutlej River in Himachal Pradesh & Punjab. Height: 226 m. Capacity: 9340 MCM. Power: 1325 MW.",
      "description": "Historic dam described by Nehru as the \"Temple of Modern India\". Creates Gobind Sagar reservoir, irrigating 10M acres across Punjab, Haryana, and Rajasthan.",
      "coordinates": [
        76.4356,
        31.4103
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        76.4356,
        31.4103
      ]
    }
  },
  {
    "type": "Feature",
    "id": "dam_sardar_sarovar",
    "properties": {
      "id": "dam_sardar_sarovar",
      "name": "Sardar Sarovar Dam",
      "category": "dams",
      "sub_type": "Concrete Gravity Dam",
      "state": "Kevadia, Gujarat",
      "authority": "Central Water Commission (CWC) / State WRD",
      "official_reference": "National Register of Large Dams (NRLD 2023)",
      "color": "#0284c7",
      "river": "Narmada",
      "dam_type": "Concrete Gravity Dam",
      "height_m": 163,
      "length_km": 1.21,
      "reservoir_capacity_mcm": 9500,
      "installed_capacity_mw": 1450,
      "summary": "Sardar Sarovar Dam: Built on Narmada River in Kevadia, Gujarat. Height: 163 m. Capacity: 9500 MCM. Power: 1450 MW.",
      "description": "Terminal dam of the Narmada Valley Project. Supplies drinking water to 9,000+ villages in arid Saurashtra and Kutch, and powers a 1,450 MW hydel plant.",
      "coordinates": [
        73.75,
        21.83
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        73.75,
        21.83
      ]
    }
  },
  {
    "type": "Feature",
    "id": "dam_hirakud",
    "properties": {
      "id": "dam_hirakud",
      "name": "Hirakud Dam",
      "category": "dams",
      "sub_type": "Composite Earthen & Masonry Dam",
      "state": "Sambalpur, Odisha",
      "authority": "Central Water Commission (CWC) / State WRD",
      "official_reference": "National Register of Large Dams (NRLD 2023)",
      "color": "#0284c7",
      "river": "Mahanadi",
      "dam_type": "Composite Earthen & Masonry Dam",
      "height_m": 60.9,
      "length_km": 4.8,
      "reservoir_capacity_mcm": 5896,
      "installed_capacity_mw": 347,
      "summary": "Hirakud Dam: Built on Mahanadi River in Sambalpur, Odisha. Height: 60.9 m. Capacity: 5896 MCM. Power: 347 MW.",
      "description": "Longest earthen dam in the world (4.8 km main dam, 25.8 km total with dykes). Tamed the catastrophic \"Sorrow of Odisha\" floods on the Mahanadi.",
      "coordinates": [
        83.87,
        21.57
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        83.87,
        21.57
      ]
    }
  },
  {
    "type": "Feature",
    "id": "dam_nagarjuna_sagar",
    "properties": {
      "id": "dam_nagarjuna_sagar",
      "name": "Nagarjuna Sagar Dam",
      "category": "dams",
      "sub_type": "Masonry Gravity Dam",
      "state": "Nalgonda / Guntur, Telangana & AP",
      "authority": "Central Water Commission (CWC) / State WRD",
      "official_reference": "National Register of Large Dams (NRLD 2023)",
      "color": "#0284c7",
      "river": "Krishna",
      "dam_type": "Masonry Gravity Dam",
      "height_m": 124,
      "length_km": 1.55,
      "reservoir_capacity_mcm": 11472,
      "installed_capacity_mw": 816,
      "summary": "Nagarjuna Sagar Dam: Built on Krishna River in Nalgonda / Guntur, Telangana & AP. Height: 124 m. Capacity: 11472 MCM. Power: 816 MW.",
      "description": "World's largest masonry dam with 26 crest gates. Irrigates over 1 million hectares in the Krishna basin delta rice bowl.",
      "coordinates": [
        79.31,
        16.57
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        79.31,
        16.57
      ]
    }
  },
  {
    "type": "Feature",
    "id": "dam_idukki",
    "properties": {
      "id": "dam_idukki",
      "name": "Idukki Dam",
      "category": "dams",
      "sub_type": "Double-Curvature Arch Dam",
      "state": "Idukki, Kerala",
      "authority": "Central Water Commission (CWC) / State WRD",
      "official_reference": "National Register of Large Dams (NRLD 2023)",
      "color": "#0284c7",
      "river": "Periyar",
      "dam_type": "Double-Curvature Arch Dam",
      "height_m": 168.9,
      "length_km": 0.36,
      "reservoir_capacity_mcm": 1996,
      "installed_capacity_mw": 780,
      "summary": "Idukki Dam: Built on Periyar River in Idukki, Kerala. Height: 168.9 m. Capacity: 1996 MCM. Power: 780 MW.",
      "description": "One of the highest arch dams in Asia, built across the Kuravan and Kurathi granite gorges. Feeds the Moolamattom underground power station.",
      "coordinates": [
        76.97,
        9.85
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        76.97,
        9.85
      ]
    }
  },
  {
    "type": "Feature",
    "id": "dam_indira_sagar",
    "properties": {
      "id": "dam_indira_sagar",
      "name": "Indira Sagar Dam",
      "category": "dams",
      "sub_type": "Concrete Gravity Dam",
      "state": "Khandwa, Madhya Pradesh",
      "authority": "Central Water Commission (CWC) / State WRD",
      "official_reference": "National Register of Large Dams (NRLD 2023)",
      "color": "#0284c7",
      "river": "Narmada",
      "dam_type": "Concrete Gravity Dam",
      "height_m": 92,
      "length_km": 0.65,
      "reservoir_capacity_mcm": 12220,
      "installed_capacity_mw": 1000,
      "summary": "Indira Sagar Dam: Built on Narmada River in Khandwa, Madhya Pradesh. Height: 92 m. Capacity: 12220 MCM. Power: 1000 MW.",
      "description": "India's largest water reservoir by storage capacity (12.22 billion cubic meters). Core mother project of the Narmada river basin development.",
      "coordinates": [
        76.47,
        22.28
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        76.47,
        22.28
      ]
    }
  },
  {
    "type": "Feature",
    "id": "dam_koyna",
    "properties": {
      "id": "dam_koyna",
      "name": "Koyna Dam",
      "category": "dams",
      "sub_type": "Rubble-concrete Gravity Dam",
      "state": "Satara, Maharashtra",
      "authority": "Central Water Commission (CWC) / State WRD",
      "official_reference": "National Register of Large Dams (NRLD 2023)",
      "color": "#0284c7",
      "river": "Koyna",
      "dam_type": "Rubble-concrete Gravity Dam",
      "height_m": 103.2,
      "length_km": 0.81,
      "reservoir_capacity_mcm": 2797,
      "installed_capacity_mw": 1960,
      "summary": "Koyna Dam: Built on Koyna River in Satara, Maharashtra. Height: 103.2 m. Capacity: 2797 MCM. Power: 1960 MW.",
      "description": "The \"Lifeline of Maharashtra\", generating 1,960 MW hydro power and impounding the vast Shivsagar Lake in the Western Ghats.",
      "coordinates": [
        73.75,
        17.4
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        73.75,
        17.4
      ]
    }
  },
  {
    "type": "Feature",
    "id": "dam_rihand",
    "properties": {
      "id": "dam_rihand",
      "name": "Rihand Dam (Govind Ballabh Pant Sagar)",
      "category": "dams",
      "sub_type": "Concrete Gravity Dam",
      "state": "Sonbhadra, Uttar Pradesh",
      "authority": "Central Water Commission (CWC) / State WRD",
      "official_reference": "National Register of Large Dams (NRLD 2023)",
      "color": "#0284c7",
      "river": "Rihand",
      "dam_type": "Concrete Gravity Dam",
      "height_m": 91.4,
      "length_km": 0.93,
      "reservoir_capacity_mcm": 10600,
      "installed_capacity_mw": 300,
      "summary": "Rihand Dam (Govind Ballabh Pant Sagar): Built on Rihand River in Sonbhadra, Uttar Pradesh. Height: 91.4 m. Capacity: 10600 MCM. Power: 300 MW.",
      "description": "Impounds India's largest artificial lake by surface area (450 sq km), supplying critical cooling water to Singrauli's mega thermal power complex.",
      "coordinates": [
        83.03,
        24.2
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        83.03,
        24.2
      ]
    }
  },
  {
    "type": "Feature",
    "id": "dam_mettur",
    "properties": {
      "id": "dam_mettur",
      "name": "Mettur Dam (Stanley Reservoir)",
      "category": "dams",
      "sub_type": "Masonry Gravity Dam",
      "state": "Salem, Tamil Nadu",
      "authority": "Central Water Commission (CWC) / State WRD",
      "official_reference": "National Register of Large Dams (NRLD 2023)",
      "color": "#0284c7",
      "river": "Kaveri",
      "dam_type": "Masonry Gravity Dam",
      "height_m": 65.2,
      "length_km": 1.61,
      "reservoir_capacity_mcm": 2640,
      "installed_capacity_mw": 240,
      "summary": "Mettur Dam (Stanley Reservoir): Built on Kaveri River in Salem, Tamil Nadu. Height: 65.2 m. Capacity: 2640 MCM. Power: 240 MW.",
      "description": "Built in 1934, one of the oldest multipurpose dams in India, serving as the primary irrigation lifeline for the Kaveri delta farmers.",
      "coordinates": [
        77.8,
        11.8
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.8,
        11.8
      ]
    }
  },
  {
    "type": "Feature",
    "id": "dam_tungabhadra",
    "properties": {
      "id": "dam_tungabhadra",
      "name": "Tungabhadra Dam (Pampa Sagar)",
      "category": "dams",
      "sub_type": "Earthen & Masonry Dam",
      "state": "Hospet, Ballari, Karnataka",
      "authority": "Central Water Commission (CWC) / State WRD",
      "official_reference": "National Register of Large Dams (NRLD 2023)",
      "color": "#0284c7",
      "river": "Tungabhadra",
      "dam_type": "Earthen & Masonry Dam",
      "height_m": 49.4,
      "length_km": 2.44,
      "reservoir_capacity_mcm": 3270,
      "installed_capacity_mw": 127,
      "summary": "Tungabhadra Dam (Pampa Sagar): Built on Tungabhadra River in Hospet, Ballari, Karnataka. Height: 49.4 m. Capacity: 3270 MCM. Power: 127 MW.",
      "description": "Joint multipurpose project of Karnataka and Andhra Pradesh, irrigating 1.2M acres across the drought-prone Raichur and Rayalaseema tracts.",
      "coordinates": [
        76.34,
        15.26
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        76.34,
        15.26
      ]
    }
  },
  {
    "type": "Feature",
    "id": "dam_mullaperiyar",
    "properties": {
      "id": "dam_mullaperiyar",
      "name": "Mullaperiyar Dam",
      "category": "dams",
      "sub_type": "Surkhi-Masonry Gravity Dam",
      "state": "Idukki, Kerala (Operated by TN)",
      "authority": "Central Water Commission (CWC) / State WRD",
      "official_reference": "National Register of Large Dams (NRLD 2023)",
      "color": "#0284c7",
      "river": "Periyar",
      "dam_type": "Surkhi-Masonry Gravity Dam",
      "height_m": 53.6,
      "length_km": 0.36,
      "reservoir_capacity_mcm": 443,
      "installed_capacity_mw": 140,
      "summary": "Mullaperiyar Dam: Built on Periyar River in Idukki, Kerala (Operated by TN). Height: 53.6 m. Capacity: 443 MCM. Power: 140 MW.",
      "description": "Historic 1895 gravity dam built under British lease, diverting Western Ghats headwaters eastward to irrigate dry districts of southern Tamil Nadu.",
      "coordinates": [
        77.14,
        9.53
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.14,
        9.53
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_vindhyachal",
    "properties": {
      "id": "pwr_vindhyachal",
      "name": "Vindhyachal Super Thermal Power Station",
      "category": "power_plants",
      "sub_type": "Thermal Power Station",
      "state": "Singrauli, Madhya Pradesh",
      "authority": "NTPC Limited",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#ea580c",
      "power_type": "Thermal",
      "capacity_mw": 4760,
      "operator": "NTPC Limited",
      "summary": "Vindhyachal Super Thermal Power Station: Thermal plant in Singrauli, Madhya Pradesh. Capacity: 4760 MW. Operator: NTPC Limited.",
      "description": "India's largest thermal power station (4,760 MW) using pit-head coal from Nigahi mines and cooling water from Rihand reservoir.",
      "coordinates": [
        82.67,
        24.1
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        82.67,
        24.1
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_mundra_thermal",
    "properties": {
      "id": "pwr_mundra_thermal",
      "name": "Mundra Thermal Power Station",
      "category": "power_plants",
      "sub_type": "Thermal Power Station",
      "state": "Kutch, Gujarat",
      "authority": "Adani Power",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#ea580c",
      "power_type": "Thermal",
      "capacity_mw": 4620,
      "operator": "Adani Power",
      "summary": "Mundra Thermal Power Station: Thermal plant in Kutch, Gujarat. Capacity: 4620 MW. Operator: Adani Power.",
      "description": "Supercritical coal-fired thermal plant on the Gulf of Kutch utilizing imported Indonesian coal.",
      "coordinates": [
        69.55,
        22.82
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        69.55,
        22.82
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_sasan",
    "properties": {
      "id": "pwr_sasan",
      "name": "Sasan Ultra Mega Power Project (UMPP)",
      "category": "power_plants",
      "sub_type": "Thermal Power Station",
      "state": "Singrauli, Madhya Pradesh",
      "authority": "Reliance Power",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#ea580c",
      "power_type": "Thermal",
      "capacity_mw": 3960,
      "operator": "Reliance Power",
      "summary": "Sasan Ultra Mega Power Project (UMPP): Thermal plant in Singrauli, Madhya Pradesh. Capacity: 3960 MW. Operator: Reliance Power.",
      "description": "3,960 MW pit-head coal power station with captive coal mines (Moher and Chhatrasal), delivering low-tariff baseload power across 7 states.",
      "coordinates": [
        82.63,
        23.97
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        82.63,
        23.97
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_kudankulam",
    "properties": {
      "id": "pwr_kudankulam",
      "name": "Kudankulam Nuclear Power Plant (KKNPP)",
      "category": "power_plants",
      "sub_type": "Nuclear Power Station",
      "state": "Tirunelveli, Tamil Nadu",
      "authority": "Nuclear Power Corporation of India (NPCIL) / Rosatom",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#a855f7",
      "power_type": "Nuclear",
      "capacity_mw": 2000,
      "operator": "Nuclear Power Corporation of India (NPCIL) / Rosatom",
      "summary": "Kudankulam Nuclear Power Plant (KKNPP): Nuclear plant in Tirunelveli, Tamil Nadu. Capacity: 2000 MW. Operator: Nuclear Power Corporation of India (NPCIL) / Rosatom.",
      "description": "India's premier nuclear plant running two 1,000 MW Russian VVER pressurized water reactors; 4 more 1,000 MW units under active construction for a 6,000 MW total.",
      "coordinates": [
        77.7125,
        8.1689
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.7125,
        8.1689
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_tarapur",
    "properties": {
      "id": "pwr_tarapur",
      "name": "Tarapur Atomic Power Station (TAPS)",
      "category": "power_plants",
      "sub_type": "Nuclear Power Station",
      "state": "Palghar, Maharashtra",
      "authority": "NPCIL",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#a855f7",
      "power_type": "Nuclear",
      "capacity_mw": 1400,
      "operator": "NPCIL",
      "summary": "Tarapur Atomic Power Station (TAPS): Nuclear plant in Palghar, Maharashtra. Capacity: 1400 MW. Operator: NPCIL.",
      "description": "India's first commercial nuclear power station, commissioned in 1969. Houses two BWR units and two indigenous 540 MW PHWR reactors.",
      "coordinates": [
        72.6558,
        19.8294
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.6558,
        19.8294
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_rawatbhata",
    "properties": {
      "id": "pwr_rawatbhata",
      "name": "Rajasthan Atomic Power Station (RAPS)",
      "category": "power_plants",
      "sub_type": "Nuclear Power Station",
      "state": "Rawatbhata, Chittorgarh, Rajasthan",
      "authority": "NPCIL",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#a855f7",
      "power_type": "Nuclear",
      "capacity_mw": 1180,
      "operator": "NPCIL",
      "summary": "Rajasthan Atomic Power Station (RAPS): Nuclear plant in Rawatbhata, Chittorgarh, Rajasthan. Capacity: 1180 MW. Operator: NPCIL.",
      "description": "Pioneering heavy water nuclear power station on the Rana Pratap Sagar lake. First indigenous PHWR reactor line in India.",
      "coordinates": [
        75.5947,
        24.8719
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        75.5947,
        24.8719
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_kakrapar",
    "properties": {
      "id": "pwr_kakrapar",
      "name": "Kakrapar Atomic Power Station (KAPS)",
      "category": "power_plants",
      "sub_type": "Nuclear Power Station",
      "state": "Surat / Tapi, Gujarat",
      "authority": "NPCIL",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#a855f7",
      "power_type": "Nuclear",
      "capacity_mw": 1140,
      "operator": "NPCIL",
      "summary": "Kakrapar Atomic Power Station (KAPS): Nuclear plant in Surat / Tapi, Gujarat. Capacity: 1140 MW. Operator: NPCIL.",
      "description": "Includes KAPS-3, India's first indigenous 700 MWe pressurized heavy water reactor (PHWR) featuring advanced passive safety mechanisms.",
      "coordinates": [
        73.3503,
        21.2358
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        73.3503,
        21.2358
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_kaiga",
    "properties": {
      "id": "pwr_kaiga",
      "name": "Kaiga Generating Station",
      "category": "power_plants",
      "sub_type": "Nuclear Power Station",
      "state": "Uttara Kannada, Karnataka",
      "authority": "NPCIL",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#a855f7",
      "power_type": "Nuclear",
      "capacity_mw": 880,
      "operator": "NPCIL",
      "summary": "Kaiga Generating Station: Nuclear plant in Uttara Kannada, Karnataka. Capacity: 880 MW. Operator: NPCIL.",
      "description": "Operates 4 indigenous PHWR units in the Western Ghats on the Kali River. Unit 1 set a world record for uninterrupted operation of 962 days.",
      "coordinates": [
        74.4386,
        14.8653
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        74.4386,
        14.8653
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_bhadla",
    "properties": {
      "id": "pwr_bhadla",
      "name": "Bhadla Solar Park",
      "category": "power_plants",
      "sub_type": "Solar Power Station",
      "state": "Phalodi / Jodhpur, Rajasthan",
      "authority": "RSDCL / Adani / Hero Future",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#eab308",
      "power_type": "Solar",
      "capacity_mw": 2245,
      "operator": "RSDCL / Adani / Hero Future",
      "summary": "Bhadla Solar Park: Solar plant in Phalodi / Jodhpur, Rajasthan. Capacity: 2245 MW. Operator: RSDCL / Adani / Hero Future.",
      "description": "One of the world's largest operational solar parks, spanning 14,000 acres in the Thar Desert with over 10 million solar panels.",
      "coordinates": [
        71.91,
        27.53
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        71.91,
        27.53
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_pavagada",
    "properties": {
      "id": "pwr_pavagada",
      "name": "Pavagada Solar Park (Shakti Sthala)",
      "category": "power_plants",
      "sub_type": "Solar Power Station",
      "state": "Tumakuru, Karnataka",
      "authority": "KSPDCL (Karnataka Solar Power Corp)",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#eab308",
      "power_type": "Solar",
      "capacity_mw": 2050,
      "operator": "KSPDCL (Karnataka Solar Power Corp)",
      "summary": "Pavagada Solar Park (Shakti Sthala): Solar plant in Tumakuru, Karnataka. Capacity: 2050 MW. Operator: KSPDCL (Karnataka Solar Power Corp).",
      "description": "Spans 13,000 acres across 5 drought-prone villages. Built without land acquisition by leasing dry farmland directly from 2,300 local farmers.",
      "coordinates": [
        77.27,
        14.1
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.27,
        14.1
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_khavda",
    "properties": {
      "id": "pwr_khavda",
      "name": "Khavda Renewable Energy Park",
      "category": "power_plants",
      "sub_type": "Solar Power Station",
      "state": "Rann of Kutch, Gujarat",
      "authority": "Adani Green / NTPC REL",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#eab308",
      "power_type": "Solar",
      "capacity_mw": 30000,
      "operator": "Adani Green / NTPC REL",
      "summary": "Khavda Renewable Energy Park: Solar plant in Rann of Kutch, Gujarat. Capacity: 30000 MW. Operator: Adani Green / NTPC REL.",
      "description": "World's largest hybrid renewable energy project under construction (30,000 MW across 726 sq km), visible from space.",
      "coordinates": [
        69.8,
        23.85
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        69.8,
        23.85
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_rewa",
    "properties": {
      "id": "pwr_rewa",
      "name": "Rewa Ultra Mega Solar Project",
      "category": "power_plants",
      "sub_type": "Solar Power Station",
      "state": "Rewa, Madhya Pradesh",
      "authority": "RUMSL / Mahindra Susten",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#eab308",
      "power_type": "Solar",
      "capacity_mw": 750,
      "operator": "RUMSL / Mahindra Susten",
      "summary": "Rewa Ultra Mega Solar Project: Solar plant in Rewa, Madhya Pradesh. Capacity: 750 MW. Operator: RUMSL / Mahindra Susten.",
      "description": "750 MW grid-connected solar installation; first solar project in India providing institutional green power to the Delhi Metro Rail Corporation (DMRC).",
      "coordinates": [
        81.57,
        24.48
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        81.57,
        24.48
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_kamuthi",
    "properties": {
      "id": "pwr_kamuthi",
      "name": "Kamuthi Solar Power Project",
      "category": "power_plants",
      "sub_type": "Solar Power Station",
      "state": "Ramanathapuram, Tamil Nadu",
      "authority": "Adani Green Energy",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#eab308",
      "power_type": "Solar",
      "capacity_mw": 648,
      "operator": "Adani Green Energy",
      "summary": "Kamuthi Solar Power Project: Solar plant in Ramanathapuram, Tamil Nadu. Capacity: 648 MW. Operator: Adani Green Energy.",
      "description": "Built in a record 8 months across 2,500 acres, cleaned daily by an automated robotic self-cleaning panel system.",
      "coordinates": [
        78.4,
        9.35
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        78.4,
        9.35
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pwr_muppandal",
    "properties": {
      "id": "pwr_muppandal",
      "name": "Muppandal Wind Farm",
      "category": "power_plants",
      "sub_type": "Wind Power Station",
      "state": "Kanyakumari, Tamil Nadu",
      "authority": "Tamil Nadu Energy Dev Agency (TEDA)",
      "official_reference": "Central Electricity Authority (CEA) / Ministry of Power",
      "color": "#14b8a6",
      "power_type": "Wind",
      "capacity_mw": 1500,
      "operator": "Tamil Nadu Energy Dev Agency (TEDA)",
      "summary": "Muppandal Wind Farm: Wind plant in Kanyakumari, Tamil Nadu. Capacity: 1500 MW. Operator: Tamil Nadu Energy Dev Agency (TEDA).",
      "description": "India's largest onshore wind farm cluster, capitalizing on seasonal high-velocity wind funnels passing through the Palghat/Aralvaimozhi Ghat gaps.",
      "coordinates": [
        77.53,
        8.26
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.53,
        8.26
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sez_gift_city",
    "properties": {
      "id": "sez_gift_city",
      "name": "GIFT City (Gujarat International Finance Tec-City)",
      "category": "economic_zones",
      "sub_type": "Financial Services & Fintech Hub",
      "state": "Gandhinagar, Gujarat",
      "authority": "GIFT SEZ Authority / IFSCA",
      "official_reference": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "color": "#10b981",
      "sector": "Financial Services & Fintech",
      "area_acres": 886,
      "units_count": 500,
      "summary": "GIFT City (Gujarat International Finance Tec-City): Financial Services & Fintech in Gandhinagar, Gujarat. Area: 886 acres. Units: ~500. Regulatory Agency: GIFT SEZ Authority / IFSCA.",
      "description": "India's first operational smart city and designated International Financial Services Centre (IFSC). Global hub for bullion, aircraft leasing, and multi-currency trading.",
      "coordinates": [
        72.68,
        23.16
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.68,
        23.16
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sez_seepz",
    "properties": {
      "id": "sez_seepz",
      "name": "SEEPZ Special Economic Zone",
      "category": "economic_zones",
      "sub_type": "Electronics & Gem / Jewellery Hub",
      "state": "Andheri East, Mumbai, Maharashtra",
      "authority": "Ministry of Commerce and Industry",
      "official_reference": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "color": "#10b981",
      "sector": "Electronics & Gem / Jewellery",
      "area_acres": 111,
      "units_count": 450,
      "summary": "SEEPZ Special Economic Zone: Electronics & Gem / Jewellery in Andheri East, Mumbai, Maharashtra. Area: 111 acres. Units: ~450. Regulatory Agency: Ministry of Commerce and Industry.",
      "description": "Established in 1973, one of India's earliest export processing zones. Accounts for ~25% of India's total studded jewellery and precision electronics exports.",
      "coordinates": [
        72.87,
        19.12
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.87,
        19.12
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sez_jamnagar_refinery",
    "properties": {
      "id": "sez_jamnagar_refinery",
      "name": "Reliance Jamnagar Petroleum SEZ",
      "category": "economic_zones",
      "sub_type": "Petroleum Refining & Petrochemicals Hub",
      "state": "Jamnagar, Gujarat",
      "authority": "Reliance Industries / SEZ Division",
      "official_reference": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "color": "#10b981",
      "sector": "Petroleum Refining & Petrochemicals",
      "area_acres": 7500,
      "units_count": 1,
      "summary": "Reliance Jamnagar Petroleum SEZ: Petroleum Refining & Petrochemicals in Jamnagar, Gujarat. Area: 7500 acres. Units: ~1. Regulatory Agency: Reliance Industries / SEZ Division.",
      "description": "World's largest grassroots petroleum refinery complex (1.24 million barrels per day capacity). India's single largest source of export value.",
      "coordinates": [
        69.85,
        22.35
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        69.85,
        22.35
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sez_sri_city",
    "properties": {
      "id": "sez_sri_city",
      "name": "Sri City Multi-Product SEZ",
      "category": "economic_zones",
      "sub_type": "Automotive, Heavy Machinery, Electronics Hub",
      "state": "Tirupati District, Andhra Pradesh",
      "authority": "Sri City Development Authority / APIIC",
      "official_reference": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "color": "#10b981",
      "sector": "Automotive, Heavy Machinery, Electronics",
      "area_acres": 7500,
      "units_count": 210,
      "summary": "Sri City Multi-Product SEZ: Automotive, Heavy Machinery, Electronics in Tirupati District, Andhra Pradesh. Area: 7500 acres. Units: ~210. Regulatory Agency: Sri City Development Authority / APIIC.",
      "description": "Integrated industrial city housing 210+ manufacturing units from 28 nations (Isuzu, Alstom metro coaches, Foxconn, Kellogg's, Daikin).",
      "coordinates": [
        80.02,
        13.55
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        80.02,
        13.55
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sez_nsez",
    "properties": {
      "id": "sez_nsez",
      "name": "Noida Special Economic Zone (NSEZ)",
      "category": "economic_zones",
      "sub_type": "Electronics, IT, Engineering Hub",
      "state": "Noida, Uttar Pradesh",
      "authority": "Ministry of Commerce and Industry (Govt of India)",
      "official_reference": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "color": "#10b981",
      "sector": "Electronics, IT, Engineering",
      "area_acres": 310,
      "units_count": 350,
      "summary": "Noida Special Economic Zone (NSEZ): Electronics, IT, Engineering in Noida, Uttar Pradesh. Area: 310 acres. Units: ~350. Regulatory Agency: Ministry of Commerce and Industry (Govt of India).",
      "description": "Premier central government multi-product SEZ in North India with comprehensive inland container depot customs clearance.",
      "coordinates": [
        77.4,
        28.53
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.4,
        28.53
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sez_electronics_city",
    "properties": {
      "id": "sez_electronics_city",
      "name": "Electronics City IT Industrial Complex",
      "category": "economic_zones",
      "sub_type": "Information Technology, Software, Hardware Hub",
      "state": "Bengaluru, Karnataka",
      "authority": "ELCITA (Electronics City Industrial Township)",
      "official_reference": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "color": "#10b981",
      "sector": "Information Technology, Software, Hardware",
      "area_acres": 800,
      "units_count": 200,
      "summary": "Electronics City IT Industrial Complex: Information Technology, Software, Hardware in Bengaluru, Karnataka. Area: 800 acres. Units: ~200. Regulatory Agency: ELCITA (Electronics City Industrial Township).",
      "description": "The cradle of India's $250B software export revolution, conceived by R.K. Baliga in 1978. Headquarters of Infosys, Wipro, and global MNC engineering centers.",
      "coordinates": [
        77.67,
        12.85
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.67,
        12.85
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sez_hitec_city",
    "properties": {
      "id": "sez_hitec_city",
      "name": "HITEC City (Cyberabad)",
      "category": "economic_zones",
      "sub_type": "IT, Cloud Computing, Biotechnology Hub",
      "state": "Hyderabad, Telangana",
      "authority": "TSIIC / Government of Telangana",
      "official_reference": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "color": "#10b981",
      "sector": "IT, Cloud Computing, Biotechnology",
      "area_acres": 1200,
      "units_count": 400,
      "summary": "HITEC City (Cyberabad): IT, Cloud Computing, Biotechnology in Hyderabad, Telangana. Area: 1200 acres. Units: ~400. Regulatory Agency: TSIIC / Government of Telangana.",
      "description": "High-tech economic node housing Microsoft, Google, Amazon, and Genome Valley pharma R&D corridors, contributing ~50% of Telangana's exports.",
      "coordinates": [
        78.38,
        17.45
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        78.38,
        17.45
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sez_mahindra_world_city",
    "properties": {
      "id": "sez_mahindra_world_city",
      "name": "Mahindra World City",
      "category": "economic_zones",
      "sub_type": "Automotive, Aerospace, Apparel Hub",
      "state": "Chengalpattu, Chennai, Tamil Nadu",
      "authority": "Mahindra Lifespaces / TIDCO",
      "official_reference": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "color": "#10b981",
      "sector": "Automotive, Aerospace, Apparel",
      "area_acres": 1550,
      "units_count": 65,
      "summary": "Mahindra World City: Automotive, Aerospace, Apparel in Chengalpattu, Chennai, Tamil Nadu. Area: 1550 acres. Units: ~65. Regulatory Agency: Mahindra Lifespaces / TIDCO.",
      "description": "India's first integrated business city with multi-sector SEZs. Host to BMW, Renault-Nissan powertrain, Infosys, and Capgemini.",
      "coordinates": [
        80,
        12.72
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        80,
        12.72
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sez_sanand",
    "properties": {
      "id": "sez_sanand",
      "name": "Sanand GIDC Industrial Estate",
      "category": "economic_zones",
      "sub_type": "Automobiles, Electric Vehicles, Semiconductors Hub",
      "state": "Sanand, Ahmedabad, Gujarat",
      "authority": "Gujarat Industrial Development Corporation (GIDC)",
      "official_reference": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "color": "#10b981",
      "sector": "Automobiles, Electric Vehicles, Semiconductors",
      "area_acres": 5000,
      "units_count": 300,
      "summary": "Sanand GIDC Industrial Estate: Automobiles, Electric Vehicles, Semiconductors in Sanand, Ahmedabad, Gujarat. Area: 5000 acres. Units: ~300. Regulatory Agency: Gujarat Industrial Development Corporation (GIDC).",
      "description": "Automotive hub (Tata Motors, Ford) transforming into India's premier semiconductor packaging corridor (Micron Technology $2.75B ATMP plant).",
      "coordinates": [
        72.38,
        22.98
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.38,
        22.98
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sez_dahej_pcpir",
    "properties": {
      "id": "sez_dahej_pcpir",
      "name": "Dahej Petroleum & Chemicals Region (PCPIR)",
      "category": "economic_zones",
      "sub_type": "Petrochemicals, Specialty Chemicals, LNG Hub",
      "state": "Bharuch, Gujarat",
      "authority": "GIDC / Ministry of Chemicals",
      "official_reference": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "color": "#10b981",
      "sector": "Petrochemicals, Specialty Chemicals, LNG",
      "area_acres": 11000,
      "units_count": 120,
      "summary": "Dahej Petroleum & Chemicals Region (PCPIR): Petrochemicals, Specialty Chemicals, LNG in Bharuch, Gujarat. Area: 11000 acres. Units: ~120. Regulatory Agency: GIDC / Ministry of Chemicals.",
      "description": "India's premier Petroleum, Chemicals and Petrochemicals Investment Region, anchored by ONGC Petro additions (OPaL) and Petronet LNG terminal.",
      "coordinates": [
        72.58,
        21.7
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.58,
        21.7
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sez_pithampur",
    "properties": {
      "id": "sez_pithampur",
      "name": "Pithampur Smart Industrial SEZ",
      "category": "economic_zones",
      "sub_type": "Automobile, Pharmaceuticals, Engineering Hub",
      "state": "Dhar / Indore, Madhya Pradesh",
      "authority": "MPIDC (Madhya Pradesh Industrial Dev Corp)",
      "official_reference": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "color": "#10b981",
      "sector": "Automobile, Pharmaceuticals, Engineering",
      "area_acres": 2500,
      "units_count": 180,
      "summary": "Pithampur Smart Industrial SEZ: Automobile, Pharmaceuticals, Engineering in Dhar / Indore, Madhya Pradesh. Area: 2500 acres. Units: ~180. Regulatory Agency: MPIDC (Madhya Pradesh Industrial Dev Corp).",
      "description": "Known as the \"Detroit of Madhya Pradesh\", major cluster for commercial vehicles (VE Commercial, Eicher, Force Motors) and US-FDA pharma units.",
      "coordinates": [
        75.68,
        22.6
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        75.68,
        22.6
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sez_dholera_sir",
    "properties": {
      "id": "sez_dholera_sir",
      "name": "Dholera Special Investment Region (SIR)",
      "category": "economic_zones",
      "sub_type": "Semiconductor Fab, Defense, Solar, Smart City Hub",
      "state": "Dholera, Ahmedabad, Gujarat",
      "authority": "Dholera Industrial City Development Ltd (DICDL)",
      "official_reference": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "color": "#10b981",
      "sector": "Semiconductor Fab, Defense, Solar, Smart City",
      "area_acres": 227000,
      "units_count": 50,
      "summary": "Dholera Special Investment Region (SIR): Semiconductor Fab, Defense, Solar, Smart City in Dholera, Ahmedabad, Gujarat. Area: 227000 acres. Units: ~50. Regulatory Agency: Dholera Industrial City Development Ltd (DICDL).",
      "description": "Largest planned greenfield smart city in India (920 sq km), node of DMIC. Site of Tata Electronics-PSMC India's first commercial semiconductor wafer fab.",
      "coordinates": [
        72.2,
        22.25
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.2,
        22.25
      ]
    }
  },
  {
    "type": "Feature",
    "id": "urb_delhi_ncr",
    "properties": {
      "id": "urb_delhi_ncr",
      "name": "Delhi National Capital Region (NCR)",
      "category": "urban_centres",
      "sub_type": "Mega-City (Tier-1 Capital)",
      "state": "Delhi, Haryana, UP, Rajasthan",
      "authority": "Ministry of Housing and Urban Affairs (MoHUA) / Census of India",
      "official_reference": "Census of India Urban Agglomerations / MoHUA Urban Atlas",
      "color": "#f97316",
      "population_metro": "33.0 Million",
      "metro_gdp_usd": "$370 Billion",
      "tier": "Mega-City (Tier-1 Capital)",
      "summary": "Delhi National Capital Region (NCR) (Mega-City (Tier-1 Capital)): Population: ~33.0 Million. Estimated Metro GDP: $370 Billion.",
      "description": "National capital territory and political headquarters. Largest urban agglomeration in India by area, driving commerce, IT services, and logistics across North India.",
      "coordinates": [
        77.209,
        28.6139
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.209,
        28.6139
      ]
    }
  },
  {
    "type": "Feature",
    "id": "urb_mumbai_mmr",
    "properties": {
      "id": "urb_mumbai_mmr",
      "name": "Mumbai Metropolitan Region (MMR)",
      "category": "urban_centres",
      "sub_type": "Mega-City (Tier-1 Financial)",
      "state": "Maharashtra",
      "authority": "Ministry of Housing and Urban Affairs (MoHUA) / Census of India",
      "official_reference": "Census of India Urban Agglomerations / MoHUA Urban Atlas",
      "color": "#f97316",
      "population_metro": "21.5 Million",
      "metro_gdp_usd": "$310 Billion",
      "tier": "Mega-City (Tier-1 Financial)",
      "summary": "Mumbai Metropolitan Region (MMR) (Mega-City (Tier-1 Financial)): Population: ~21.5 Million. Estimated Metro GDP: $310 Billion.",
      "description": "Financial, commercial, and entertainment capital of India. Home to RBI, BSE, NSE, SEBI, corporate HQs of Fortune 500 companies, and JNPT port.",
      "coordinates": [
        72.8347,
        18.922
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.8347,
        18.922
      ]
    }
  },
  {
    "type": "Feature",
    "id": "urb_bengaluru",
    "properties": {
      "id": "urb_bengaluru",
      "name": "Bengaluru Urban Agglomeration",
      "category": "urban_centres",
      "sub_type": "Mega-City (Tier-1 Tech)",
      "state": "Karnataka",
      "authority": "Ministry of Housing and Urban Affairs (MoHUA) / Census of India",
      "official_reference": "Census of India Urban Agglomerations / MoHUA Urban Atlas",
      "color": "#f97316",
      "population_metro": "13.2 Million",
      "metro_gdp_usd": "$110 Billion",
      "tier": "Mega-City (Tier-1 Tech)",
      "summary": "Bengaluru Urban Agglomeration (Mega-City (Tier-1 Tech)): Population: ~13.2 Million. Estimated Metro GDP: $110 Billion.",
      "description": "The \"Silicon Valley of India\" and premier technological R&D center. Accounts for ~38% of India's IT software exports and largest startup ecosystem in South Asia.",
      "coordinates": [
        77.5946,
        12.9716
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.5946,
        12.9716
      ]
    }
  },
  {
    "type": "Feature",
    "id": "urb_kolkata",
    "properties": {
      "id": "urb_kolkata",
      "name": "Kolkata Metropolitan Area (KMA)",
      "category": "urban_centres",
      "sub_type": "Mega-City (Tier-1 Cultural/Port)",
      "state": "West Bengal",
      "authority": "Ministry of Housing and Urban Affairs (MoHUA) / Census of India",
      "official_reference": "Census of India Urban Agglomerations / MoHUA Urban Atlas",
      "color": "#f97316",
      "population_metro": "15.3 Million",
      "metro_gdp_usd": "$150 Billion",
      "tier": "Mega-City (Tier-1 Cultural/Port)",
      "summary": "Kolkata Metropolitan Area (KMA) (Mega-City (Tier-1 Cultural/Port)): Population: ~15.3 Million. Estimated Metro GDP: $150 Billion.",
      "description": "Historic colonial capital and principal commercial, financial, and cultural hub of Eastern India. Major trade gateway for Nepal, Bhutan, and the Northeast.",
      "coordinates": [
        88.3639,
        22.5726
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        88.3639,
        22.5726
      ]
    }
  },
  {
    "type": "Feature",
    "id": "urb_chennai",
    "properties": {
      "id": "urb_chennai",
      "name": "Chennai Metropolitan Area",
      "category": "urban_centres",
      "sub_type": "Mega-City (Tier-1 Auto/SaaS)",
      "state": "Tamil Nadu",
      "authority": "Ministry of Housing and Urban Affairs (MoHUA) / Census of India",
      "official_reference": "Census of India Urban Agglomerations / MoHUA Urban Atlas",
      "color": "#f97316",
      "population_metro": "11.5 Million",
      "metro_gdp_usd": "$115 Billion",
      "tier": "Mega-City (Tier-1 Auto/SaaS)",
      "summary": "Chennai Metropolitan Area (Mega-City (Tier-1 Auto/SaaS)): Population: ~11.5 Million. Estimated Metro GDP: $115 Billion.",
      "description": "The \"Detroit of South Asia\" producing over 40% of India's automobiles. Second-largest software exporter, hardware manufacturing hub, and medical tourism center.",
      "coordinates": [
        80.2707,
        13.0827
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        80.2707,
        13.0827
      ]
    }
  },
  {
    "type": "Feature",
    "id": "urb_hyderabad",
    "properties": {
      "id": "urb_hyderabad",
      "name": "Hyderabad Urban Agglomeration",
      "category": "urban_centres",
      "sub_type": "Mega-City (Tier-1 Pharma/IT)",
      "state": "Telangana",
      "authority": "Ministry of Housing and Urban Affairs (MoHUA) / Census of India",
      "official_reference": "Census of India Urban Agglomerations / MoHUA Urban Atlas",
      "color": "#f97316",
      "population_metro": "10.5 Million",
      "metro_gdp_usd": "$75 Billion",
      "tier": "Mega-City (Tier-1 Pharma/IT)",
      "summary": "Hyderabad Urban Agglomeration (Mega-City (Tier-1 Pharma/IT)): Population: ~10.5 Million. Estimated Metro GDP: $75 Billion.",
      "description": "Known as \"Cyberabad\" and the \"Vaccine Capital of the World\", manufacturing 1/3rd of global vaccines. Global tech development campuses for Apple, Google, Microsoft.",
      "coordinates": [
        78.4867,
        17.385
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        78.4867,
        17.385
      ]
    }
  },
  {
    "type": "Feature",
    "id": "urb_ahmedabad",
    "properties": {
      "id": "urb_ahmedabad",
      "name": "Ahmedabad–Gandhinagar Urban Complex",
      "category": "urban_centres",
      "sub_type": "Tier-1 Industrial/Finance",
      "state": "Gujarat",
      "authority": "Ministry of Housing and Urban Affairs (MoHUA) / Census of India",
      "official_reference": "Census of India Urban Agglomerations / MoHUA Urban Atlas",
      "color": "#f97316",
      "population_metro": "8.6 Million",
      "metro_gdp_usd": "$68 Billion",
      "tier": "Tier-1 Industrial/Finance",
      "summary": "Ahmedabad–Gandhinagar Urban Complex (Tier-1 Industrial/Finance): Population: ~8.6 Million. Estimated Metro GDP: $68 Billion.",
      "description": "Commerce and industrial powerhouse of Western India. Global center for pharmaceuticals, denim textiles, chemicals, and the international financial hub GIFT City.",
      "coordinates": [
        72.5714,
        23.0225
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.5714,
        23.0225
      ]
    }
  },
  {
    "type": "Feature",
    "id": "urb_pune",
    "properties": {
      "id": "urb_pune",
      "name": "Pune Metropolitan Region (PMR)",
      "category": "urban_centres",
      "sub_type": "Tier-1 Engineering/Auto",
      "state": "Maharashtra",
      "authority": "Ministry of Housing and Urban Affairs (MoHUA) / Census of India",
      "official_reference": "Census of India Urban Agglomerations / MoHUA Urban Atlas",
      "color": "#f97316",
      "population_metro": "7.4 Million",
      "metro_gdp_usd": "$69 Billion",
      "tier": "Tier-1 Engineering/Auto",
      "summary": "Pune Metropolitan Region (PMR) (Tier-1 Engineering/Auto): Population: ~7.4 Million. Estimated Metro GDP: $69 Billion.",
      "description": "The \"Oxford of the East\" and automobile manufacturing cluster (Bajaj, Bharat Forge, Tata Motors). Major IT park corridor in Hinjewadi.",
      "coordinates": [
        73.8567,
        18.5204
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        73.8567,
        18.5204
      ]
    }
  },
  {
    "type": "Feature",
    "id": "urb_surat",
    "properties": {
      "id": "urb_surat",
      "name": "Surat Urban Agglomeration",
      "category": "urban_centres",
      "sub_type": "Tier-1 Trade/Textile",
      "state": "Gujarat",
      "authority": "Ministry of Housing and Urban Affairs (MoHUA) / Census of India",
      "official_reference": "Census of India Urban Agglomerations / MoHUA Urban Atlas",
      "color": "#f97316",
      "population_metro": "6.6 Million",
      "metro_gdp_usd": "$59 Billion",
      "tier": "Tier-1 Trade/Textile",
      "summary": "Surat Urban Agglomeration (Tier-1 Trade/Textile): Population: ~6.6 Million. Estimated Metro GDP: $59 Billion.",
      "description": "World capital of diamond cutting and polishing (processing 90% of global rough diamonds at Surat Diamond Bourse) and India's largest synthetic man-made textile hub.",
      "coordinates": [
        72.8311,
        21.1702
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.8311,
        21.1702
      ]
    }
  },
  {
    "type": "Feature",
    "id": "urb_visakhapatnam",
    "properties": {
      "id": "urb_visakhapatnam",
      "name": "Visakhapatnam (Vizag) Metropolitan Region",
      "category": "urban_centres",
      "sub_type": "Tier-2 Port/Industrial",
      "state": "Andhra Pradesh",
      "authority": "Ministry of Housing and Urban Affairs (MoHUA) / Census of India",
      "official_reference": "Census of India Urban Agglomerations / MoHUA Urban Atlas",
      "color": "#f97316",
      "population_metro": "2.4 Million",
      "metro_gdp_usd": "$26 Billion",
      "tier": "Tier-2 Port/Industrial",
      "summary": "Visakhapatnam (Vizag) Metropolitan Region (Tier-2 Port/Industrial): Population: ~2.4 Million. Estimated Metro GDP: $26 Billion.",
      "description": "The \"City of Destiny\" and largest economic metropolis of Andhra Pradesh. Eastern Naval Command base, heavy industries, steel, and deepwater container terminal.",
      "coordinates": [
        83.2185,
        17.6868
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        83.2185,
        17.6868
      ]
    }
  },
  {
    "type": "Feature",
    "id": "urb_kochi",
    "properties": {
      "id": "urb_kochi",
      "name": "Kochi (Cochin) Metropolitan Area",
      "category": "urban_centres",
      "sub_type": "Tier-2 Maritime/Trade",
      "state": "Kerala",
      "authority": "Ministry of Housing and Urban Affairs (MoHUA) / Census of India",
      "official_reference": "Census of India Urban Agglomerations / MoHUA Urban Atlas",
      "color": "#f97316",
      "population_metro": "2.2 Million",
      "metro_gdp_usd": "$24 Billion",
      "tier": "Tier-2 Maritime/Trade",
      "summary": "Kochi (Cochin) Metropolitan Area (Tier-2 Maritime/Trade): Population: ~2.2 Million. Estimated Metro GDP: $24 Billion.",
      "description": "Commercial and financial nerve center of Kerala, international transshipment container port, Cochin Shipyard, crude refining, and Infopark IT export zone.",
      "coordinates": [
        76.2673,
        9.9312
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        76.2673,
        9.9312
      ]
    }
  },
  {
    "type": "Feature",
    "id": "urb_chandigarh",
    "properties": {
      "id": "urb_chandigarh",
      "name": "Chandigarh Capital Region (Tricity)",
      "category": "urban_centres",
      "sub_type": "Tier-2 Planned/Services",
      "state": "Chandigarh UT, Punjab, Haryana",
      "authority": "Ministry of Housing and Urban Affairs (MoHUA) / Census of India",
      "official_reference": "Census of India Urban Agglomerations / MoHUA Urban Atlas",
      "color": "#f97316",
      "population_metro": "1.9 Million",
      "metro_gdp_usd": "$18 Billion",
      "tier": "Tier-2 Planned/Services",
      "summary": "Chandigarh Capital Region (Tricity) (Tier-2 Planned/Services): Population: ~1.9 Million. Estimated Metro GDP: $18 Billion.",
      "description": "Master-planned modernist city designed by Le Corbusier. Highest per-capita income urban region in India, encompassing Chandigarh, Mohali, and Panchkula.",
      "coordinates": [
        76.7794,
        30.7333
      ]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        76.7794,
        30.7333
      ]
    }
  }
] as unknown as InfrastructureFeature[]
};

export const INFRASTRUCTURE_BY_ID: Record<string, InfrastructureFeature> = {};
export const INFRASTRUCTURE_BY_CATEGORY: Record<InfrastructureCategory, InfrastructureFeature[]> = {
  highways: [],
  railways: [],
  airports: [],
  seaports: [],
  industrial_corridors: [],
  dams: [],
  power_plants: [],
  economic_zones: [],
  urban_centres: []
};

for (const feat of INFRASTRUCTURE_GEOJSON.features) {
  if (feat.id) {
    INFRASTRUCTURE_BY_ID[feat.id] = feat;
    if (feat.properties?.code) {
      INFRASTRUCTURE_BY_ID[feat.properties.code] = feat;
    }
  }
  const cat = feat.properties.category;
  if (INFRASTRUCTURE_BY_CATEGORY[cat]) {
    INFRASTRUCTURE_BY_CATEGORY[cat].push(feat);
  }
}
