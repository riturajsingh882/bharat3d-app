import type { DisasterHazardType, DisasterRegion, HistoricalDisasterEvent } from '../types';

export interface DisasterHazardProperties {
  id: string;
  name: string;
  hazard_type: DisasterHazardType;
  hazard_level?: string;
  region_group: DisasterRegion;
  region_name: string;
  year?: number;
  date_str?: string;
  color: string;
  border_color?: string;
  authority: string;
  official_reference?: string;
  summary: string;
  description?: string;
  
  // Seismic & Earthquake specific
  zone_id?: string;
  zone_code?: string;
  zone_name?: string;
  zone_factor_z?: number;
  peak_ground_accel?: string;
  seismic_intensity?: string;
  building_code_mandate?: string;
  magnitude?: number;
  magnitude_mw?: number;
  depth_km?: number;
  fatalities_approx?: number | string;
  casualties?: string;
  fault_system?: string;
  tectonic_setting?: string;
  significance?: string;
  regions_covered?: string;

  // Cyclone specific
  cyclone_category?: string;
  wind_speed_kmh?: number;
  central_pressure_hpa?: number;
  landfall_point?: string;
  storm_surge_m?: number;
  evacuation_count?: string;

  // Flood specific
  basin_name?: string;
  inundated_sqkm?: number;
  vulnerable_population?: string;
  return_period?: string;
  monitoring_network?: string;

  // Landslide specific
  susceptibility_rating?: string;
  rock_formation?: string;
  trigger_mechanisms?: string;
  notable_events?: string;

  // Drought specific
  aridity_index?: string;
  rainfall_deficit_pct?: string;
  affected_districts_count?: number;
  mitigation_scheme?: string;

  // Tsunami specific
  inundation_buffer_km?: number;
  max_runup_m?: number;
  early_warning_time_min?: number;
  monitoring_buoys?: string;

  // Heatwave specific
  max_recorded_temp_c?: number;
  avg_heatwave_days?: number;
  wet_bulb_risk?: string;
  action_plan_framework?: string;
}

export interface DisasterGeoJSONFeature {
  type: "Feature";
  id?: string;
  properties: DisasterHazardProperties;
  geometry: {
    type: string;
    coordinates: any;
  };
}

export interface DisasterGeoJSONCollection {
  type: "FeatureCollection";
  features: DisasterGeoJSONFeature[];
}

export const DISASTER_GEOJSON: DisasterGeoJSONCollection = {
  type: "FeatureCollection",
  features: [
    // =========================================================================
    // 1. SEISMIC HAZARD ZONES (BIS IS 1893: 2016 Part 1)
    // =========================================================================
    {
      type: "Feature",
      id: "seismic_zone_5_northeast",
      properties: {
        id: "seismic_zone_5_northeast",
        name: "Seismic Zone V (Eastern Himalayas & Northeast)",
        hazard_type: "seismic_zone",
        hazard_level: "Very High Risk",
        region_group: "northeast",
        region_name: "Northeast India & Eastern Himalaya",
        zone_id: "ZONE_V",
        zone_code: "Zone V",
        zone_name: "Seismic Zone V (Very High Damage Risk)",
        seismic_intensity: "MSK IX or greater",
        zone_factor_z: 0.36,
        peak_ground_accel: "0.36g (PGA >= 0.36g)",
        building_code_mandate: "IS 1893:2016 ductile detailing mandatory (IS 13920)",
        color: "#ef4444",
        border_color: "#dc2626",
        description: "Subduction and thrust zone along the Eastern Himalayan syntaxis, Dauki fault, and Indo-Burmese wedge. Highest seismic hazard in India.",
        regions_covered: "Entire Northeastern States (Assam, Meghalaya, Arunachal, Nagaland, Manipur, Mizoram, Tripura), Andaman & Nicobar.",
        authority: "Bureau of Indian Standards (BIS IS 1893: 2016 Part 1)",
        official_reference: "BIS Criteria for Earthquake Resistant Design of Structures (IS 1893:2016)",
        summary: "Zone V is seismically the most active region in the Indian subcontinent. Capable of generating catastrophic earthquakes of magnitude Mw 8.0 or greater due to the active continental collision between the Indian and Eurasian plates."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [89.5, 26.0],
            [92.0, 28.0],
            [97.5, 29.0],
            [97.5, 24.0],
            [93.0, 22.0],
            [91.0, 24.5],
            [89.5, 26.0]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "seismic_zone_5_kutch",
      properties: {
        id: "seismic_zone_5_kutch",
        name: "Seismic Zone V (Kutch Rift Basin)",
        hazard_type: "seismic_zone",
        hazard_level: "Very High Risk",
        region_group: "peninsular",
        region_name: "Gujarat / Kutch Basin",
        zone_id: "ZONE_V",
        zone_code: "Zone V",
        zone_name: "Seismic Zone V (Kutch Fault Belt)",
        seismic_intensity: "MSK IX or greater",
        zone_factor_z: 0.36,
        peak_ground_accel: "0.36g (PGA >= 0.36g)",
        building_code_mandate: "IS 1893:2016 ductile detailing mandatory",
        color: "#ef4444",
        border_color: "#dc2626",
        description: "Intraplate rifting zone along the Kutch Mainland Fault, Allah Bund, Katrol Hill Fault, and Island Belt Fault.",
        regions_covered: "Kutch District, Bhuj, Anjar, Gandhidham, Kandla, Rann of Kutch (Gujarat).",
        authority: "Bureau of Indian Standards (BIS IS 1893: 2016)",
        official_reference: "GSDMA & BIS IS 1893:2016",
        summary: "One of the world's most seismically hazardous intraplate continental rift zones, source of the catastrophic 1819 Allah Bund and 2001 Bhuj (Mw 7.7) earthquakes."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [68.5, 23.0],
            [71.0, 23.0],
            [71.2, 24.5],
            [68.5, 24.5],
            [68.5, 23.0]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "seismic_zone_5_himalayas",
      properties: {
        id: "seismic_zone_5_himalayas",
        name: "Seismic Zone V (Central & Western Himalayan Arc)",
        hazard_type: "seismic_zone",
        hazard_level: "Very High Risk",
        region_group: "himalayan",
        region_name: "Himalayan Arc / Kashmir to Uttarakhand",
        zone_id: "ZONE_V",
        zone_code: "Zone V",
        zone_name: "Seismic Zone V (Western Himalayan Syntaxis)",
        seismic_intensity: "MSK IX or greater",
        zone_factor_z: 0.36,
        peak_ground_accel: "0.36g (PGA >= 0.36g)",
        building_code_mandate: "IS 1893:2016 ductile detailing mandatory (IS 13920)",
        color: "#ef4444",
        border_color: "#dc2626",
        description: "Main Himalayan Frontal Thrust (MFT) and Main Boundary Thrust (MBT) compression corridor with high seismic slip deficit.",
        regions_covered: "Kashmir Valley, Kangra & Mandi (HP), Chamoli, Uttarkashi, Pithoragarh (Uttarakhand), North Bihar border belt.",
        authority: "Bureau of Indian Standards (BIS IS 1893: 2016)",
        official_reference: "Wadia Institute of Himalayan Geology & BIS",
        summary: "High stress accumulation sector where the Indian Plate converges under Tibet at ~20 mm/year, presenting major potential for great Himalayan earthquakes."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [74.0, 34.8],
            [76.0, 34.0],
            [77.5, 32.5],
            [80.0, 30.5],
            [81.0, 29.8],
            [79.5, 29.5],
            [76.5, 31.8],
            [74.2, 33.2],
            [74.0, 34.8]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "seismic_zone_4_belt",
      properties: {
        id: "seismic_zone_4_belt",
        name: "Seismic Zone IV (Indo-Gangetic Basin & Delhi-NCR)",
        hazard_type: "seismic_zone",
        hazard_level: "High Risk",
        region_group: "gangetic",
        region_name: "Indo-Gangetic Plains & Sub-Himalaya",
        zone_id: "ZONE_IV",
        zone_code: "Zone IV",
        zone_name: "Seismic Zone IV (High Damage Risk)",
        seismic_intensity: "MSK VIII",
        zone_factor_z: 0.24,
        peak_ground_accel: "0.24g (PGA = 0.24g)",
        building_code_mandate: "Seismic design for high-rise structures & soft soil amplification",
        color: "#f97316",
        border_color: "#ea580c",
        description: "Main Himalayan Frontal Thrust belt, Delhi-Haridwar ridge, and deep alluvium basin vulnerable to seismic wave amplification.",
        regions_covered: "National Capital Region (Delhi, Gurugram, Noida), Northern Punjab/Haryana, Foothills of UP & Bihar, Sikkim, Northern West Bengal delta.",
        authority: "Bureau of Indian Standards (BIS IS 1893: 2016)",
        official_reference: "BIS Criteria for Earthquake Resistant Design (IS 1893:2016)",
        summary: "Dense population corridor prone to high earthquake damage risk. The deep soft alluvium in the Gangetic basin significantly amplifies long-period seismic waves from Himalayan earthquakes."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [74.0, 32.5],
            [78.0, 31.0],
            [82.0, 28.5],
            [88.0, 26.5],
            [88.5, 22.5],
            [86.0, 24.0],
            [80.0, 27.0],
            [76.5, 28.0],
            [74.5, 30.5],
            [74.0, 32.5]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "seismic_zone_4_koyna",
      properties: {
        id: "seismic_zone_4_koyna",
        name: "Seismic Zone IV (Koyna-Warna Fault Zone)",
        hazard_type: "seismic_zone",
        hazard_level: "High Risk",
        region_group: "peninsular",
        region_name: "Maharashtra / Western Ghats",
        zone_id: "ZONE_IV",
        zone_code: "Zone IV",
        zone_name: "Seismic Zone IV (Koyna Fault System)",
        seismic_intensity: "MSK VIII",
        zone_factor_z: 0.24,
        peak_ground_accel: "0.24g",
        building_code_mandate: "Mandatory seismic reinforcement for Western Maharashtra dams & infrastructure",
        color: "#f97316",
        border_color: "#ea580c",
        description: "Classic global example of Reservoir-Triggered Seismicity (RTS) along the Koyna-Warna intraplate basement faults.",
        regions_covered: "Satara, Sangli, Ratnagiri, Kolhapur districts (Maharashtra).",
        authority: "Bureau of Indian Standards & National Geophysical Research Institute (NGRI)",
        official_reference: "NGRI Koyna Deep Scientific Drilling Project",
        summary: "Site of the 1967 Koyna Mw 6.3 earthquake, the largest reservoir-triggered earthquake in history. Continues to produce sustained micro-seismicity."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.5, 17.0],
            [74.2, 17.0],
            [74.2, 17.8],
            [73.5, 17.8],
            [73.5, 17.0]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "seismic_zone_3_peninsular",
      properties: {
        id: "seismic_zone_3_peninsular",
        name: "Seismic Zone III (Moderate Damage Risk)",
        hazard_type: "seismic_zone",
        hazard_level: "Moderate Risk",
        region_group: "peninsular",
        region_name: "Peninsular India & Coastal Margins",
        zone_id: "ZONE_III",
        zone_code: "Zone III",
        zone_name: "Seismic Zone III (Moderate Damage Risk)",
        seismic_intensity: "MSK VII",
        zone_factor_z: 0.16,
        peak_ground_accel: "0.16g",
        building_code_mandate: "IS 1893 ductile design for municipal public buildings & bridges",
        color: "#eab308",
        border_color: "#ca8a04",
        description: "Moderate seismic hazard covering major industrial and metropolitan corridors along peninsular rift faults and coastlines.",
        regions_covered: "Mumbai, Thane, Pune, Chennai, Kolkata, Ahmedabad, Surat, Kochi, Goa, Lakshadweep, Narmada-Tapi rift zones.",
        authority: "Bureau of Indian Standards (BIS IS 1893: 2016)",
        official_reference: "BIS IS 1893:2016",
        summary: "Zone III encompasses India's primary financial and commercial centers. Building codes require earthquake-resistant structural frames to withstand moderate ground shaking."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [71.5, 22.0],
            [76.0, 22.5],
            [79.0, 21.0],
            [84.0, 21.5],
            [87.5, 22.0],
            [85.0, 18.0],
            [80.5, 14.5],
            [79.0, 11.5],
            [76.0, 9.5],
            [74.0, 14.0],
            [72.5, 19.0],
            [71.5, 22.0]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "seismic_zone_2_shield",
      properties: {
        id: "seismic_zone_2_shield",
        name: "Seismic Zone II (Low Damage Risk / Cratonic Core)",
        hazard_type: "seismic_zone",
        hazard_level: "Low Risk",
        region_group: "peninsular",
        region_name: "Central Deccan Craton & Southern Shield",
        zone_id: "ZONE_II",
        zone_code: "Zone II",
        zone_name: "Seismic Zone II (Low Damage Risk)",
        seismic_intensity: "MSK VI or less",
        zone_factor_z: 0.10,
        peak_ground_accel: "0.10g",
        building_code_mandate: "Basic structural tying & masonry integrity",
        color: "#3b82f6",
        border_color: "#2563eb",
        description: "Archean Dharwar, Bastar, and Singhbhum cratonic cores of the stable peninsular shield.",
        regions_covered: "Bengaluru, Hyderabad, Raipur, Nagpur, Bhopal, Visakhapatnam, Central Deccan Plateau.",
        authority: "Bureau of Indian Standards (BIS IS 1893: 2016)",
        official_reference: "BIS IS 1893:2016",
        summary: "Zone II is the lowest seismic hazard classification in India. While catastrophic plate boundary earthquakes are rare, intraplate faults can occasionally activate."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.0, 19.5],
            [79.5, 23.0],
            [83.5, 23.5],
            [84.0, 19.5],
            [80.0, 16.0],
            [78.0, 13.0],
            [76.0, 15.0],
            [75.0, 19.5]
          ]
        ]
      }
    },

    // =========================================================================
    // 2. MAJOR HISTORICAL EARTHQUAKES & EPICENTERS
    // =========================================================================
    {
      type: "Feature",
      id: "eq_shillong_1897",
      properties: {
        id: "eq_shillong_1897",
        name: "1897 Great Shillong Earthquake",
        hazard_type: "earthquake",
        region_group: "northeast",
        region_name: "Shillong Plateau / Meghalaya",
        year: 1897,
        date_str: "12 June 1897",
        magnitude: 8.1,
        magnitude_mw: 8.1,
        depth_km: 35,
        casualties: "~1,542 casualties",
        fatalities_approx: 1542,
        tectonic_setting: "Oldham Fault rupture beneath the Shillong Plateau",
        fault_system: "Oldham Blind Thrust Fault (uplift of Shillong Plateau by 11m)",
        significance: "Richard Dixon Oldham used seismograms of this earthquake to discover P, S, and surface seismic waves.",
        authority: "Geological Survey of India (GSI Memoirs Vol. XXIX)",
        official_reference: "GSI Memoirs Vol. XXIX, R.D. Oldham (1899)",
        color: "#ef4444",
        summary: "One of the most powerful intra-continental earthquakes in recorded history. Caused widespread destruction across Meghalaya, Assam, and northern Bengal."
      },
      geometry: {
        type: "Point",
        coordinates: [91.0, 26.0]
      }
    },
    {
      type: "Feature",
      id: "eq_kangra_1905",
      properties: {
        id: "eq_kangra_1905",
        name: "1905 Kangra Earthquake",
        hazard_type: "earthquake",
        region_group: "himalayan",
        region_name: "Kangra / Himachal Pradesh",
        year: 1905,
        date_str: "4 April 1905",
        magnitude: 7.8,
        magnitude_mw: 7.8,
        depth_km: 25,
        casualties: ">20,000 casualties",
        fatalities_approx: 20000,
        tectonic_setting: "Main Boundary Thrust (MBT), Western Himalaya",
        fault_system: "Main Boundary Thrust (MBT) compression corridor",
        significance: "Destroyed Kangra Fort, Dharamshala, and Mandi; led to early structural seismic regulations in India.",
        authority: "Geological Survey of India (Middlemiss, 1910)",
        official_reference: "GSI Memoirs Vol. XXXVIII",
        color: "#ef4444",
        summary: "Devastating morning earthquake in the Kangra valley that killed over 20,000 people and triggered massive landslides throughout the Dhauladhar range."
      },
      geometry: {
        type: "Point",
        coordinates: [76.3, 32.0]
      }
    },
    {
      type: "Feature",
      id: "eq_bihar_nepal_1934",
      properties: {
        id: "eq_bihar_nepal_1934",
        name: "1934 Bihar–Nepal Earthquake",
        hazard_type: "earthquake",
        region_group: "gangetic",
        region_name: "North Bihar & Nepal Terai",
        year: 1934,
        date_str: "15 January 1934",
        magnitude: 8.0,
        magnitude_mw: 8.0,
        depth_km: 15,
        casualties: ">10,700 casualties",
        fatalities_approx: 10700,
        tectonic_setting: "Main Frontal Thrust (MFT) / Indo-Gangetic Plains",
        fault_system: "Himalayan Frontal Thrust / blind sub-alluvial thrust",
        significance: "Extensive liquefaction across North Bihar (Munger, Muzaffarpur, Darbhanga); Mahatma Gandhi visited for relief.",
        authority: "Geological Survey of India (Dunn et al., 1939)",
        official_reference: "GSI Memoirs Vol. LXXIII",
        color: "#ef4444",
        summary: "Catastrophic blind-thrust earthquake producing massive soil liquefaction, sand boils, and ground fissures across the fertile Gangetic alluvium."
      },
      geometry: {
        type: "Point",
        coordinates: [86.5, 26.5]
      }
    },
    {
      type: "Feature",
      id: "eq_assam_1950",
      properties: {
        id: "eq_assam_1950",
        name: "1950 Great Assam–Tibet Earthquake",
        hazard_type: "earthquake",
        region_group: "northeast",
        region_name: "Mishmi Hills / Upper Assam",
        year: 1950,
        date_str: "15 August 1950",
        magnitude: 8.6,
        magnitude_mw: 8.6,
        depth_km: 15,
        casualties: ">4,800 casualties",
        fatalities_approx: 4800,
        tectonic_setting: "Eastern Himalayan Syntaxis strike-slip and thrust",
        fault_system: "Po-Chu Fault / Mishmi Thrust",
        significance: "Largest known terrestrial intra-continental earthquake; dammed Subansiri river, altered Brahmaputra bed, caused massive river flooding.",
        authority: "Geological Survey of India & USGS",
        official_reference: "USGS Historical Earthquake Catalog / GSI",
        color: "#ef4444",
        summary: "The 6th largest earthquake of the 20th century. Massive landslides blocked major Himalayan rivers, forming lakes that later burst and caused catastrophic flash floods."
      },
      geometry: {
        type: "Point",
        coordinates: [96.5, 28.5]
      }
    },
    {
      type: "Feature",
      id: "eq_uttarkashi_1991",
      properties: {
        id: "eq_uttarkashi_1991",
        name: "1991 Uttarkashi Earthquake",
        hazard_type: "earthquake",
        region_group: "himalayan",
        region_name: "Garhwal / Uttarakhand",
        year: 1991,
        date_str: "20 October 1991",
        magnitude: 6.8,
        magnitude_mw: 6.8,
        depth_km: 10,
        casualties: "~1,000 casualties",
        fatalities_approx: 1000,
        tectonic_setting: "Main Central Thrust (MCT), Garhwal Himalaya",
        fault_system: "Main Central Thrust (MCT) zone",
        significance: "Accelerated seismic retrofitting codes for Himalayan rural masonry and dam safety monitoring in Tehri.",
        authority: "National Centre for Seismology & GSI",
        official_reference: "NCS / Ministry of Earth Sciences",
        color: "#f97316",
        summary: "Damaged over 42,000 homes in Uttarkashi and Chamoli districts, demonstrating high seismic vulnerability of unreinforced stone masonry in the Himalayas."
      },
      geometry: {
        type: "Point",
        coordinates: [78.8, 30.7]
      }
    },
    {
      type: "Feature",
      id: "eq_latur_1993",
      properties: {
        id: "eq_latur_1993",
        name: "1993 Latur (Killari) Earthquake",
        hazard_type: "earthquake",
        region_group: "peninsular",
        region_name: "Marathwada / Maharashtra",
        year: 1993,
        date_str: "30 September 1993",
        magnitude: 6.2,
        magnitude_mw: 6.2,
        depth_km: 7,
        casualties: "~9,748 casualties",
        fatalities_approx: 9748,
        tectonic_setting: "Stable Continental Region (SCR) intraplate thrust beneath Deccan Traps",
        fault_system: "Tirna River Basement Fault / Kurduvadi Rift",
        significance: "Disproved the assumption that Peninsular India was aseismic; revised national seismic code IS 1893:2002 to upgrade peninsular zones.",
        authority: "Geological Survey of India & IMD",
        official_reference: "GSI Special Publication No. 35",
        color: "#ef4444",
        summary: "A shallow, lethal intraplate earthquake in the Deccan basalt shield that destroyed 52 villages and reshaped Indian seismic zoning philosophy."
      },
      geometry: {
        type: "Point",
        coordinates: [76.58, 18.06]
      }
    },
    {
      type: "Feature",
      id: "eq_jabalpur_1997",
      properties: {
        id: "eq_jabalpur_1997",
        name: "1997 Jabalpur Earthquake",
        hazard_type: "earthquake",
        region_group: "peninsular",
        region_name: "Madhya Pradesh / Narmada Valley",
        year: 1997,
        date_str: "22 May 1997",
        magnitude: 5.8,
        magnitude_mw: 5.8,
        depth_km: 36,
        casualties: "55 casualties, ~1,500 injured",
        fatalities_approx: 55,
        tectonic_setting: "Narmada-Son Lineament (NSL) deep crustal shear",
        fault_system: "Narmada South Fault deep intraplate zone",
        significance: "First well-recorded deep lower-crustal earthquake along the central Indian Narmada suture zone.",
        authority: "National Centre for Seismology & IMD",
        official_reference: "NCS / GSI Seismological Records",
        color: "#f97316",
        summary: "Struck Jabalpur city in the early hours; damaged thousands of historical brick structures and the Bargi Dam observation network."
      },
      geometry: {
        type: "Point",
        coordinates: [80.06, 23.08]
      }
    },
    {
      type: "Feature",
      id: "eq_chamoli_1999",
      properties: {
        id: "eq_chamoli_1999",
        name: "1999 Chamoli Earthquake",
        hazard_type: "earthquake",
        region_group: "himalayan",
        region_name: "Chamoli / Uttarakhand",
        year: 1999,
        date_str: "29 March 1999",
        magnitude: 6.8,
        magnitude_mw: 6.8,
        depth_km: 15,
        casualties: "~103 casualties",
        fatalities_approx: 103,
        tectonic_setting: "Alaknanda Fault / Main Central Thrust",
        fault_system: "Chamoli Thrust / Alaknanda fault wedge",
        significance: "Triggered extensive rockfalls and severed roads to Badrinath; strong tremors felt in Delhi-NCR.",
        authority: "National Centre for Seismology & GSI",
        official_reference: "GSI Special Publication No. 53",
        color: "#f97316",
        summary: "Struck Chamoli and Rudraprayag districts, causing wide surface fissures and structural damage in mountainous terrain."
      },
      geometry: {
        type: "Point",
        coordinates: [79.4, 30.4]
      }
    },
    {
      type: "Feature",
      id: "eq_bhuj_2001",
      properties: {
        id: "eq_bhuj_2001",
        name: "2001 Bhuj (Gujarat) Earthquake",
        hazard_type: "earthquake",
        region_group: "peninsular",
        region_name: "Kutch / Gujarat",
        year: 2001,
        date_str: "26 January 2001",
        magnitude: 7.7,
        magnitude_mw: 7.7,
        depth_km: 16,
        casualties: "~20,085 casualties, 166,000 injured",
        fatalities_approx: 20085,
        tectonic_setting: "South Wagad Fault / Kutch rift basin",
        fault_system: "South Wagad Thrust Fault intraplate blind rupture",
        significance: "Occurred on Republic Day 2001; prompted the establishment of the Gujarat State Disaster Management Authority (GSDMA) and NDMA.",
        authority: "National Disaster Management Authority (NDMA) & IMD",
        official_reference: "NDMA & GSDMA Post-Disaster Comprehensive Report",
        color: "#ef4444",
        summary: "One of the most destructive earthquakes in modern Indian history. Flattened Bhuj, Anjar, and Bachau; collapsed multistory apartments 300 km away in Ahmedabad."
      },
      geometry: {
        type: "Point",
        coordinates: [70.232, 23.419]
      }
    },
    {
      type: "Feature",
      id: "eq_tsunami_2004",
      properties: {
        id: "eq_tsunami_2004",
        name: "2004 Indian Ocean Tsunami & Megathrust",
        hazard_type: "earthquake",
        region_group: "coastal",
        region_name: "Indian Ocean / Andaman & Nicobar / Coromandel Coast",
        year: 2004,
        date_str: "26 December 2004",
        magnitude: 9.1,
        magnitude_mw: 9.1,
        depth_km: 30,
        casualties: ">16,000 casualties in India",
        fatalities_approx: 16000,
        tectonic_setting: "Sunda Megathrust plate boundary subduction",
        fault_system: "Sunda Trench Megathrust (1,300 km rupture)",
        significance: "Generated catastrophic tsunami waves across Tamil Nadu, Andhra Pradesh, Kerala, and Andaman & Nicobar; led to India establishing the Indian Tsunami Early Warning Centre (ITEWC) at INCOIS Hyderabad.",
        authority: "INCOIS / Ministry of Earth Sciences & USGS",
        official_reference: "INCOIS National Tsunami Risk Atlas (2007)",
        color: "#ef4444",
        summary: "The 3rd largest earthquake in recorded history. Triggered destructive tsunami waves reaching heights up to 10m on India's east coast, prompting the enactment of the Disaster Management Act 2005."
      },
      geometry: {
        type: "Point",
        coordinates: [95.854, 3.316]
      }
    },
    {
      type: "Feature",
      id: "eq_kashmir_2005",
      properties: {
        id: "eq_kashmir_2005",
        name: "2005 Kashmir (Uri / Muzaffarabad) Earthquake",
        hazard_type: "earthquake",
        region_group: "himalayan",
        region_name: "Kashmir / Pir Panjal Range",
        year: 2005,
        date_str: "8 October 2005",
        magnitude: 7.6,
        magnitude_mw: 7.6,
        depth_km: 26,
        casualties: ">86,000 total (>1,400 in J&K, India)",
        fatalities_approx: 1400,
        tectonic_setting: "Balakot-Bagh Fault / Western Himalayan Syntaxis",
        fault_system: "Balakot-Bagh Fault strike-slip/thrust",
        significance: "Severely affected Uri and Tangdhar; led to cross-border Line of Control relief coordination and modern seismic rebuilding standards.",
        authority: "National Centre for Seismology & IMD",
        official_reference: "NCS / Ministry of Earth Sciences",
        color: "#ef4444",
        summary: "Major Himalayan thrust earthquake that decimated mountain towns and triggered thousands of slope failures across the rugged Pir Panjal range."
      },
      geometry: {
        type: "Point",
        coordinates: [73.6, 34.4]
      }
    },
    {
      type: "Feature",
      id: "eq_sikkim_2011",
      properties: {
        id: "eq_sikkim_2011",
        name: "2011 Sikkim Earthquake",
        hazard_type: "earthquake",
        region_group: "himalayan",
        region_name: "Sikkim / Kanchenjunga Range",
        year: 2011,
        date_str: "18 September 2011",
        magnitude: 6.9,
        magnitude_mw: 6.9,
        depth_km: 19.7,
        casualties: "111 casualties (60 in Sikkim)",
        fatalities_approx: 111,
        tectonic_setting: "Kanchenjunga strike-slip fault system",
        fault_system: "Kanchenjunga Fault within Higher Himalaya",
        significance: "Demonstrated compound disaster hazards: strong shaking triggered multiple valley landslides that severed National Highway 31A.",
        authority: "Geological Survey of India & NDMA",
        official_reference: "GSI Sikkim Earthquake Field Report (2012)",
        color: "#f97316",
        summary: "Struck near the border with Nepal, causing widespread damage in Gangtok, Mangan, and North Sikkim hydroelectric dam construction sites."
      },
      geometry: {
        type: "Point",
        coordinates: [88.2, 27.7]
      }
    },
    {
      type: "Feature",
      id: "eq_nepal_bihar_2015",
      properties: {
        id: "eq_nepal_bihar_2015",
        name: "2015 Gorkha (Nepal–North Bihar) Earthquake",
        hazard_type: "earthquake",
        region_group: "gangetic",
        region_name: "North Bihar & Himalayan Foothills",
        year: 2015,
        date_str: "25 April 2015",
        magnitude: 7.8,
        magnitude_mw: 7.8,
        depth_km: 8.2,
        casualties: "8,964 total (~100 in Bihar/UP)",
        fatalities_approx: 100,
        tectonic_setting: "Main Himalayan Thrust (MHT) decollement rupture",
        fault_system: "Main Himalayan Thrust blind underthrusting",
        significance: "High shaking intensity throughout Patna, Raxaul, and Darbhanga; Operation Maitri launched as India's largest military disaster relief operation.",
        authority: "National Centre for Seismology & NDMA",
        official_reference: "NDMA Comprehensive Report on Nepal Earthquake 2015",
        color: "#ef4444",
        summary: "Ruptured a 120 km section of the Main Himalayan Thrust. Caused significant building damage in northern Bihar and felt across all of North India."
      },
      geometry: {
        type: "Point",
        coordinates: [84.7, 28.2]
      }
    },

    // =========================================================================
    // 3. CYCLONE TRACKS & LANDFALL CORRIDORS (IMD Cyclone E-Atlas)
    // =========================================================================
    {
      type: "Feature",
      id: "cyclone_odisha_1999_track",
      properties: {
        id: "cyclone_odisha_1999_track",
        name: "1999 Odisha Super Cyclone (BOB 06)",
        hazard_type: "cyclone",
        region_group: "coastal",
        region_name: "Odisha Coast / Bay of Bengal",
        year: 1999,
        date_str: "25 - 31 October 1999",
        cyclone_category: "Category 5 Super Cyclonic Storm",
        wind_speed_kmh: 260,
        central_pressure_hpa: 912,
        storm_surge_m: 6.0,
        landfall_point: "Paradip, Jagatsinghpur (Odisha)",
        casualties: "9,887 confirmed fatalities",
        fatalities_approx: 9887,
        evacuation_count: "Limited early warning; led to modern evacuation protocol",
        authority: "India Meteorological Department (IMD) / OSDMA",
        official_reference: "IMD Report on Super Cyclonic Storm BOB 06/1999",
        color: "#c026d3",
        border_color: "#a21caf",
        summary: "The strongest tropical cyclone ever recorded in the North Indian Ocean basin. Sustained winds of 260 km/h and a 6-meter storm surge devastated coastal Odisha."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [98.5, 9.5],
          [95.0, 11.5],
          [92.0, 13.5],
          [89.5, 15.5],
          [87.5, 17.5],
          [86.7, 20.3], // Paradip Landfall
          [86.2, 20.8],
          [85.8, 20.5],
          [86.0, 19.8]
        ]
      }
    },
    {
      type: "Feature",
      id: "cyclone_phailin_2013_track",
      properties: {
        id: "cyclone_phailin_2013_track",
        name: "2013 Cyclone Phailin",
        hazard_type: "cyclone",
        region_group: "coastal",
        region_name: "Odisha & Andhra Pradesh Coast",
        year: 2013,
        date_str: "8 - 14 October 2013",
        cyclone_category: "Very Severe Cyclonic Storm (Cat 4/5 equivalent)",
        wind_speed_kmh: 215,
        central_pressure_hpa: 940,
        storm_surge_m: 3.5,
        landfall_point: "Gopalpur, Ganjam (Odisha)",
        casualties: "45 casualties (historic low due to massive evacuation)",
        fatalities_approx: 45,
        evacuation_count: "1.15 Million people evacuated in 36 hours",
        authority: "India Meteorological Department (IMD) & OSDMA",
        official_reference: "UN Office for Disaster Risk Reduction (UNDRR) Case Study",
        color: "#a855f7",
        border_color: "#9333ea",
        summary: "A global benchmark in disaster preparedness. The massive early evacuation of over 1.15 million people prevented mass fatalities from a Category 4-equivalent storm."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [96.0, 11.0],
          [92.5, 13.0],
          [89.0, 15.0],
          [86.5, 17.5],
          [85.0, 19.3], // Gopalpur Landfall
          [83.5, 21.0],
          [82.0, 23.0]
        ]
      }
    },
    {
      type: "Feature",
      id: "cyclone_hudhud_2014_track",
      properties: {
        id: "cyclone_hudhud_2014_track",
        name: "2014 Cyclone Hudhud",
        hazard_type: "cyclone",
        region_group: "coastal",
        region_name: "Andhra Pradesh / Visakhapatnam",
        year: 2014,
        date_str: "7 - 14 October 2014",
        cyclone_category: "Extremely Severe Cyclonic Storm",
        wind_speed_kmh: 185,
        central_pressure_hpa: 960,
        storm_surge_m: 2.0,
        landfall_point: "Visakhapatnam City (Andhra Pradesh)",
        casualties: "124 casualties",
        fatalities_approx: 124,
        evacuation_count: "250,000 evacuated across 4 coastal districts",
        authority: "India Meteorological Department (IMD) & APSDMA",
        official_reference: "IMD Cyclone Report Hudhud (2014)",
        color: "#8b5cf6",
        border_color: "#7c3aed",
        summary: "Made a direct, bullseye landfall on the major port city and naval hub of Visakhapatnam, causing over ₹21,000 crore ($3.4B) in urban and industrial damage."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [93.0, 12.0],
          [90.0, 13.5],
          [87.0, 15.0],
          [84.5, 16.5],
          [83.3, 17.7], // Vizag Landfall
          [82.0, 19.5],
          [81.0, 21.5]
        ]
      }
    },
    {
      type: "Feature",
      id: "cyclone_fani_2019_track",
      properties: {
        id: "cyclone_fani_2019_track",
        name: "2019 Cyclone Fani",
        hazard_type: "cyclone",
        region_group: "coastal",
        region_name: "Odisha Coast / Puri",
        year: 2019,
        date_str: "26 April - 4 May 2019",
        cyclone_category: "Extremely Severe Cyclonic Storm (High-End Cat 4)",
        wind_speed_kmh: 215,
        central_pressure_hpa: 932,
        storm_surge_m: 5.0,
        landfall_point: "Puri (Odisha)",
        casualties: "89 casualties",
        fatalities_approx: 89,
        evacuation_count: "1.2 Million people evacuated in 24 hours",
        authority: "India Meteorological Department (IMD) & NDMA",
        official_reference: "NDMA Fani Response Report (2019)",
        color: "#ec4899",
        border_color: "#db2777",
        summary: "Rare pre-monsoon summer cyclone with exceptional rapid intensification over warm Bay of Bengal waters. Tore through Puri and the Bhubaneswar metropolitan zone."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [88.0, 5.0],
          [86.5, 8.5],
          [84.5, 12.0],
          [84.0, 15.0],
          [85.0, 18.0],
          [85.8, 19.8], // Puri Landfall
          [86.5, 20.8],
          [88.0, 22.5],
          [89.5, 24.5]
        ]
      }
    },
    {
      type: "Feature",
      id: "cyclone_amphan_2020_track",
      properties: {
        id: "cyclone_amphan_2020_track",
        name: "2020 Super Cyclone Amphan",
        hazard_type: "cyclone",
        region_group: "gangetic",
        region_name: "West Bengal & Sundarbans Delta",
        year: 2020,
        date_str: "16 - 21 May 2020",
        cyclone_category: "Category 5 Super Cyclonic Storm",
        wind_speed_kmh: 260,
        central_pressure_hpa: 920,
        storm_surge_m: 5.0,
        landfall_point: "Bakkhali / Sagar Island, Sundarbans (West Bengal)",
        casualties: "128 casualties",
        fatalities_approx: 128,
        evacuation_count: "Over 3 Million people evacuated across WB and Odisha",
        authority: "India Meteorological Department (IMD) & WB DMA",
        official_reference: "IMD Report on Super Cyclonic Storm Amphan (2020)",
        color: "#c026d3",
        border_color: "#a21caf",
        summary: "Costliest cyclone on record in the North Indian Ocean ($14B+ losses). Severe damage to Kolkata city, destroying green cover, power grids, and delta embankments."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [86.5, 10.5],
          [86.0, 13.0],
          [86.5, 16.0],
          [87.0, 19.0],
          [88.3, 21.6], // Sundarbans Landfall
          [88.5, 23.0],
          [89.5, 25.5]
        ]
      }
    },
    {
      type: "Feature",
      id: "cyclone_tauktae_2021_track",
      properties: {
        id: "cyclone_tauktae_2021_track",
        name: "2021 Cyclone Tauktae",
        hazard_type: "cyclone",
        region_group: "coastal",
        region_name: "Arabian Sea / West Coast to Gujarat",
        year: 2021,
        date_str: "14 - 19 May 2021",
        cyclone_category: "Extremely Severe Cyclonic Storm (Cat 4)",
        wind_speed_kmh: 220,
        central_pressure_hpa: 950,
        storm_surge_m: 3.5,
        landfall_point: "Una / Diu Coast, Saurashtra (Gujarat)",
        casualties: "169 casualties (including offshore barge P305 tragedy)",
        fatalities_approx: 169,
        evacuation_count: "200,000 evacuated across coastal Gujarat",
        authority: "India Meteorological Department (IMD) & GSDMA",
        official_reference: "IMD Technical Report on Cyclone Tauktae",
        color: "#f43f5e",
        border_color: "#e11d48",
        summary: "Strongest tropical cyclone to strike Gujarat since 1998. Paralleled the entire west coast of India, causing storm surge in Kerala, Goa, and Maharashtra before landfall."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [73.0, 10.0],
          [72.5, 13.0],
          [71.5, 16.0],
          [71.0, 18.5],
          [71.1, 20.8], // Gujarat Landfall
          [71.5, 22.5],
          [73.0, 25.0]
        ]
      }
    },
    {
      type: "Feature",
      id: "cyclone_biparjoy_2023_track",
      properties: {
        id: "cyclone_biparjoy_2023_track",
        name: "2023 Cyclone Biparjoy",
        hazard_type: "cyclone",
        region_group: "coastal",
        region_name: "Arabian Sea / Kutch Coast",
        year: 2023,
        date_str: "6 - 19 June 2023",
        cyclone_category: "Very Severe Cyclonic Storm",
        wind_speed_kmh: 165,
        central_pressure_hpa: 966,
        storm_surge_m: 2.5,
        landfall_point: "Jakhau Port, Kutch (Gujarat)",
        casualties: "2 casualties (exceptional zero-fatality coastal evacuation)",
        fatalities_approx: 2,
        evacuation_count: "100,000+ evacuated to 1,500 relief shelters",
        authority: "India Meteorological Department (IMD) & NDMA",
        official_reference: "IMD Bulletin on Cyclone Biparjoy (2023)",
        color: "#e11d48",
        border_color: "#be123c",
        summary: "Longest-lasting cyclone in the Arabian Sea (active for 13 days, 3 hours). Demonstrated exceptional civil protection with nearly zero direct casualties upon landfall."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [66.5, 12.0],
          [66.0, 15.0],
          [67.0, 18.0],
          [67.5, 20.5],
          [68.6, 23.2], // Jakhau Port Landfall
          [70.5, 24.5],
          [72.5, 25.5]
        ]
      }
    },

    // =========================================================================
    // 4. FLOOD-PRONE BASINS (CWC / NDMA / Rashtriya Barh Ayog)
    // =========================================================================
    {
      type: "Feature",
      id: "flood_brahmaputra_basin",
      properties: {
        id: "flood_brahmaputra_basin",
        name: "Brahmaputra Valley & Kaziranga Floodplain",
        hazard_type: "flood",
        hazard_level: "Chronic High Risk",
        region_group: "northeast",
        region_name: "Assam Valley",
        basin_name: "Brahmaputra River Basin",
        inundated_sqkm: 38200,
        vulnerable_population: "31 Million",
        return_period: "Annual recurring monsoon deluge",
        monitoring_network: "Central Water Commission (CWC) 45 telemetry stations",
        authority: "Brahmaputra Board & Central Water Commission",
        official_reference: "Rashtriya Barh Ayog / CWC Master Plan",
        color: "#0284c7",
        border_color: "#0369a1",
        summary: "One of the world's most dynamic floodplains. Massive monsoon discharge and extreme silt loads cause annual bank erosion, island avulsion, and deep inundation of 40% of Assam's land area."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [90.0, 26.2],
            [92.5, 26.7],
            [95.0, 27.5],
            [95.8, 27.8],
            [95.5, 27.2],
            [93.5, 26.5],
            [91.5, 26.0],
            [90.0, 26.0],
            [90.0, 26.2]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "flood_north_bihar_kosi",
      properties: {
        id: "flood_north_bihar_kosi",
        name: "North Bihar Plains (Kosi–Gandak Avulsion Basin)",
        hazard_type: "flood",
        hazard_level: "Extremely High Risk",
        region_group: "gangetic",
        region_name: "North Bihar",
        basin_name: "Kosi, Gandak, Bagmati, Kamla-Balan Rivers",
        inundated_sqkm: 68800,
        vulnerable_population: "76% of North Bihar population",
        return_period: "Severe floods every 1–2 years (2008 Kusaha breach catastrophic event)",
        monitoring_network: "CWC & Bihar Water Resources Department (WRD)",
        authority: "Central Water Commission & Bihar WRD",
        official_reference: "CWC / NDMA National Flood Risk Mitigation Project",
        color: "#0284c7",
        border_color: "#0369a1",
        summary: "The Kosi ('Sorrow of Bihar') has shifted its course over 120 km westward in the past 250 years. Extremely high sediment loads from the young Himalayas lead to frequent embankment breaches."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [84.5, 27.2],
            [86.5, 26.8],
            [87.8, 26.4],
            [87.8, 25.4],
            [86.0, 25.3],
            [84.5, 25.6],
            [84.5, 27.2]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "flood_mahanadi_delta",
      properties: {
        id: "flood_mahanadi_delta",
        name: "Mahanadi Delta & Coastal Floodplains",
        hazard_type: "flood",
        hazard_level: "High Risk",
        region_group: "coastal",
        region_name: "Coastal Odisha",
        basin_name: "Mahanadi–Brahmani–Baitarani Delta",
        inundated_sqkm: 14500,
        vulnerable_population: "12 Million",
        return_period: "Monsoon cyclonic surge & upstream dam release",
        monitoring_network: "CWC Hirakud Dam flood coordination cell",
        authority: "Central Water Commission & Odisha WRD",
        official_reference: "CWC Flood Forecasting Bulletins",
        color: "#0284c7",
        border_color: "#0369a1",
        summary: "The flat deltaic plains of Kendrapara, Jagatsinghpur, and Cuttack experience severe compound floods when heavy catchment rains in Chhattisgarh coincide with high ocean tides."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [85.6, 20.6],
            [86.8, 20.8],
            [87.0, 20.2],
            [86.2, 19.8],
            [85.6, 20.6]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "flood_kerala_periyar_2018",
      properties: {
        id: "flood_kerala_periyar_2018",
        name: "Kerala Periyar & Pamba Basins (2018 Deluge Zone)",
        hazard_type: "flood",
        hazard_level: "Very High Risk",
        region_group: "coastal",
        region_name: "Central Kerala",
        basin_name: "Periyar, Pamba, Chalakudy, Bharathapuzha Rivers",
        inundated_sqkm: 5500,
        vulnerable_population: "5.4 Million",
        return_period: "100-year return period mega deluge (August 2018)",
        monitoring_network: "CWC & Kerala State Disaster Management Authority",
        authority: "Central Water Commission & KSDMA",
        official_reference: "CWC Study on Kerala Floods of August 2018",
        color: "#0284c7",
        border_color: "#0369a1",
        summary: "Unprecedented torrential rainfall (164% above normal) filled all major dams simultaneously, forcing the opening of 35 reservoirs including Idukki and Idamalayar."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.2, 10.3],
            [76.8, 10.2],
            [77.0, 9.4],
            [76.4, 9.2],
            [76.2, 10.3]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "flood_mumbai_mithi",
      properties: {
        id: "flood_mumbai_mithi",
        name: "Mumbai Mithi River & Coastal Lowland Flood Basin",
        hazard_type: "flood",
        hazard_level: "High Urban Risk",
        region_group: "coastal",
        region_name: "Mumbai Metropolitan Region",
        basin_name: "Mithi River & Coastal Estuaries",
        inundated_sqkm: 600,
        vulnerable_population: "14 Million MMR urban residents",
        return_period: "Annual monsoon urban waterlogging; 2005 944mm record",
        monitoring_network: "MCGM Doppler Radar & Automatic Weather Stations",
        authority: "Brihanmumbai Municipal Corporation & NDMA",
        official_reference: "Fact Finding Committee on Mumbai Floods (Chitale Report)",
        color: "#0284c7",
        border_color: "#0369a1",
        summary: "Severe urban flooding vulnerability due to reclaimed mangrove creeks, tidal lockouts during high tide, and heavily constrained storm drainage networks."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.78, 19.25],
            [72.98, 19.25],
            [72.98, 18.90],
            [72.78, 18.90],
            [72.78, 19.25]
          ]
        ]
      }
    },

    // =========================================================================
    // 5. LANDSLIDE SUSCEPTIBILITY (Geological Survey of India - GSI NLSM)
    // =========================================================================
    {
      type: "Feature",
      id: "landslide_wayanad_escarpment",
      properties: {
        id: "landslide_wayanad_escarpment",
        name: "Wayanad Escarpment (July 2024 Debris Flow Zone)",
        hazard_type: "landslide",
        hazard_level: "Very High Susceptibility",
        region_group: "peninsular",
        region_name: "Western Ghats / Wayanad, Kerala",
        susceptibility_rating: "GSI NLSM Very High Susceptibility Zone",
        rock_formation: "Charnockite & Hornblende-Biotite Gneiss with thick lateritic soil mantle",
        trigger_mechanisms: "Extreme continuous orographic rainfall (>572 mm in 48h) causing pore-water pressure liquefaction",
        notable_events: "July 2024 Chooralmala-Mundakkai disaster (>400 casualties), 2019 Puthumala landslide",
        authority: "Geological Survey of India (GSI) & KSDMA",
        official_reference: "GSI Post-Disaster Geotechnical Investigation of Wayanad (2024)",
        color: "#ea580c",
        border_color: "#c2410c",
        summary: "Steep Western Ghats escarpment prone to rapid debris avalanches and mudflows when extreme monsoon rainfall saturates the interface between lateritic soil and basement crystalline bedrock."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.05, 11.45],
            [76.25, 11.60],
            [76.35, 11.48],
            [76.15, 11.35],
            [76.05, 11.45]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "landslide_garhwal_kedarnath",
      properties: {
        id: "landslide_garhwal_kedarnath",
        name: "Garhwal MCT Corridor (Kedarnath–Joshimath Axis)",
        hazard_type: "landslide",
        hazard_level: "Very High Susceptibility",
        region_group: "himalayan",
        region_name: "Garhwal Himalaya / Uttarakhand",
        susceptibility_rating: "GSI NLSM Very High Susceptibility Zone",
        rock_formation: "Central Crystallines (Schists, Gneisses) cut by the Main Central Thrust",
        trigger_mechanisms: "Cloudbursts, Glacial Lake Outburst Floods (GLOF), seismic shaking, steep slope undercutting",
        notable_events: "June 2013 Chorabari Lake burst & Kedarnath debris flow; 2023 Joshimath ground subsidence",
        authority: "Geological Survey of India & Wadia Institute of Himalayan Geology",
        official_reference: "WIHG Technical Monograph on Garhwal Geohazards",
        color: "#ea580c",
        border_color: "#c2410c",
        summary: "One of the most active geomorphic hazard belts in Asia. Fragile schistose rocks, extreme relief gradients (>3,000m valley drops), and high tourist density create immense compound disaster vulnerability."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.8, 30.5],
            [79.8, 30.9],
            [79.9, 30.4],
            [79.0, 30.1],
            [78.8, 30.5]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "landslide_himachal_beas",
      properties: {
        id: "landslide_himachal_beas",
        name: "Kangra–Kullu–Mandi Corridor (Beas Valley)",
        hazard_type: "landslide",
        hazard_level: "High to Very High",
        region_group: "himalayan",
        region_name: "Himachal Pradesh",
        susceptibility_rating: "GSI NLSM High Susceptibility Zone",
        rock_formation: "Tertiary Siwalik sedimentary rocks and Lesser Himalayan meta-sediments",
        trigger_mechanisms: "Intense monsoon downpours, river bank erosion, toe-cutting along highway widening projects",
        notable_events: "Monsoon 2023 catastrophic slope failures along NH-3 (Chandigarh-Manali) and Shimla collapses",
        authority: "Geological Survey of India & HPSDMA",
        official_reference: "GSI Landslide Hazard Zonation of Himachal Pradesh",
        color: "#ea580c",
        border_color: "#c2410c",
        summary: "Characterized by structurally complex, highly jointed bedrock prone to rockfalls, wedge failures, and massive debris slides along major transit corridors."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.8, 32.2],
            [77.4, 32.3],
            [77.3, 31.5],
            [76.7, 31.6],
            [76.8, 32.2]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "landslide_sikkim_teesta",
      properties: {
        id: "landslide_sikkim_teesta",
        name: "Teesta Valley & Darjeeling Sub-Himalaya",
        hazard_type: "landslide",
        hazard_level: "Very High Susceptibility",
        region_group: "himalayan",
        region_name: "Sikkim & North Bengal",
        susceptibility_rating: "GSI NLSM Very High Susceptibility Zone",
        rock_formation: "Daling Group phyllites and quartzites prone to weathering",
        trigger_mechanisms: "High annual precipitation (>3,000 mm), Glacial Lake Outburst Floods (GLOFs), seismic triggers",
        notable_events: "October 2023 South Lhonak GLOF flash flood, regular NH-10 road blockages at 29th Mile",
        authority: "Geological Survey of India & Sikkim SDMA",
        official_reference: "GSI Eastern Region NLSM Atlas",
        color: "#ea580c",
        border_color: "#c2410c",
        summary: "Vulnerable to chronic river bank undercutting and soil slips. The October 2023 South Lhonak glacial lake breach washed away roads, bridges, and the Chungthang Dam."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [88.3, 27.5],
            [88.7, 27.6],
            [88.6, 26.9],
            [88.2, 27.0],
            [88.3, 27.5]
          ]
        ]
      }
    },

    // =========================================================================
    // 6. DROUGHT-PRONE REGIONS (CWC / Ministry of Jal Shakti / IMD)
    // =========================================================================
    {
      type: "Feature",
      id: "drought_marathwada_vidarbha",
      properties: {
        id: "drought_marathwada_vidarbha",
        name: "Marathwada & Western Vidarbha Drought Belt",
        hazard_type: "drought",
        hazard_level: "Chronic Severe Drought",
        region_group: "peninsular",
        region_name: "Maharashtra Plateau",
        aridity_index: "Semi-Arid (0.20 to 0.50)",
        rainfall_deficit_pct: "25% to 45% below normal in lean monsoon years",
        affected_districts_count: 8,
        mitigation_scheme: "Jalyukt Shivar, Marathwada Water Grid, Jal Jeevan Mission",
        authority: "Central Water Commission & Maharashtra Water Resources",
        official_reference: "CWC Drought Prone Areas Assessment (2020)",
        color: "#b45309",
        border_color: "#92400e",
        summary: "Located in the deep rain-shadow of the Western Ghats. Highly erratic monsoon rains combined with water-intensive sugarcane cultivation lead to severe agrarian stress and drinking water shortages."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.0, 19.8],
            [77.5, 20.2],
            [78.5, 19.5],
            [77.0, 18.0],
            [75.2, 18.2],
            [75.0, 19.8]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "drought_rayalaseema",
      properties: {
        id: "drought_rayalaseema",
        name: "Rayalaseema Semi-Arid Core",
        hazard_type: "drought",
        hazard_level: "Chronic Severe Drought",
        region_group: "peninsular",
        region_name: "Andhra Pradesh Interior",
        aridity_index: "Arid to Semi-Arid (0.15 to 0.35)",
        rainfall_deficit_pct: "Second lowest rainfall tract in peninsular India (<550 mm/yr)",
        affected_districts_count: 4,
        mitigation_scheme: "Handri-Neeva Sujala Sravanthi, Galeru Nagari, drip irrigation subsidies",
        authority: "Central Water Commission & IMD",
        official_reference: "IMD Agro-Meteorological Drought Atlas",
        color: "#b45309",
        border_color: "#92400e",
        summary: "Anantapur, Kadapa, Kurnool, and Chittoor form a chronic drought pocket with shallow red gravelly soils that have low moisture retention capacity, causing recurring crop failure."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.8, 15.5],
            [78.5, 15.5],
            [79.0, 13.5],
            [77.5, 13.5],
            [76.8, 15.5]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "drought_thar_rajasthan",
      properties: {
        id: "drought_thar_rajasthan",
        name: "Thar Desert Core & Western Rajasthan",
        hazard_type: "drought",
        hazard_level: "Hyper-Arid Drought Risk",
        region_group: "peninsular",
        region_name: "Western Rajasthan",
        aridity_index: "Hyper-Arid (<0.05 to 0.15)",
        rainfall_deficit_pct: "Annual precipitation < 250 mm with 60% coefficient of variation",
        affected_districts_count: 10,
        mitigation_scheme: "Indira Gandhi Canal Project (IGNP), traditional Taanka rainwater harvesting",
        authority: "Central Arid Zone Research Institute (CAZRI) & CWC",
        official_reference: "CAZRI Arid Zone Geodatabase",
        color: "#b45309",
        border_color: "#92400e",
        summary: "Extreme hydrological and meteorological drought core. Deep saline groundwater aquifers, intense summer evapotranspiration, and shifting sand dunes create harsh desert conditions."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [69.5, 27.5],
            [73.5, 28.5],
            [74.0, 26.0],
            [71.0, 24.5],
            [69.5, 27.5]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "drought_bundelkhand",
      properties: {
        id: "drought_bundelkhand",
        name: "Bundelkhand Gneissic Plateau",
        hazard_type: "drought",
        hazard_level: "Severe Multi-Year Drought",
        region_group: "gangetic",
        region_name: "UP & MP Border Region",
        aridity_index: "Semi-Arid (0.28 to 0.42)",
        rainfall_deficit_pct: "Recurring dry spells during monsoon break periods",
        affected_districts_count: 13,
        mitigation_scheme: "Ken-Betwa River Interlinking Project, Bundelkhand Special Package",
        authority: "NITI Aayog & Central Water Commission",
        official_reference: "NITI Aayog Bundelkhand Drought Mitigation Report",
        color: "#b45309",
        border_color: "#92400e",
        summary: "Underlain by impermeable Bundelkhand granite rocks that offer negligible groundwater storage. Deficient monsoon rains lead to the rapid dry-up of open wells and ponds."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.0, 25.5],
            [80.5, 25.5],
            [80.5, 24.2],
            [78.2, 24.2],
            [78.0, 25.5]
          ]
        ]
      }
    },

    // =========================================================================
    // 7. TSUNAMI HAZARD ZONES (INCOIS - Indian Tsunami Early Warning Centre)
    // =========================================================================
    {
      type: "Feature",
      id: "tsunami_coromandel_coast",
      properties: {
        id: "tsunami_coromandel_coast",
        name: "Coromandel Coastal Tsunami Inundation Buffer",
        hazard_type: "tsunami",
        hazard_level: "Very High Tsunami Hazard",
        region_group: "coastal",
        region_name: "Tamil Nadu & Puducherry Coast",
        inundation_buffer_km: 1.5,
        max_runup_m: 10.0,
        early_warning_time_min: 120,
        monitoring_buoys: "INCOIS Bottom Pressure Recorders (BPR) & Coastal Radar Network",
        authority: "INCOIS (Indian Tsunami Early Warning Centre)",
        official_reference: "INCOIS Tsunami Risk Atlas for Tamil Nadu (2007/2021)",
        color: "#06b6d4",
        border_color: "#0891b2",
        summary: "Suffered catastrophic devastation during the 2004 Sumatra-Andaman earthquake tsunami. Low-lying flat coastal topography makes settlements from Nagapattinam to Chennai highly vulnerable to trans-oceanic tsunami surges."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [80.3, 13.5],
          [80.25, 13.08],
          [80.0, 12.0],
          [79.85, 11.0],
          [79.85, 10.5],
          [79.4, 9.8],
          [79.3, 9.2]
        ]
      }
    },
    {
      type: "Feature",
      id: "tsunami_andaman_nicobar",
      properties: {
        id: "tsunami_andaman_nicobar",
        name: "Andaman & Nicobar Trench Subduction Margin",
        hazard_type: "tsunami",
        hazard_level: "Extreme Near-Field Tsunami Hazard",
        region_group: "coastal",
        region_name: "Andaman & Nicobar Islands",
        inundation_buffer_km: 3.0,
        max_runup_m: 12.0,
        early_warning_time_min: 15,
        monitoring_buoys: "Port Blair, Indira Point, Diglipur Seismic-Tsunami stations",
        authority: "INCOIS & Survey of India",
        official_reference: "MoES Tsunami Preparedness Protocol",
        color: "#06b6d4",
        border_color: "#0891b2",
        summary: "Located directly adjacent to the active Sunda-Andaman megathrust trench. Near-field tsunami wave arrival times can be less than 15-20 minutes following a submarine earthquake."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [93.0, 13.5],
          [92.8, 12.5],
          [92.7, 11.5],
          [92.8, 9.2],
          [93.8, 7.0],
          [93.9, 6.7]
        ]
      }
    },
    {
      type: "Feature",
      id: "tsunami_andhra_coast",
      properties: {
        id: "tsunami_andhra_coast",
        name: "Andhra Pradesh Coastal Tsunami Inundation Zone",
        hazard_type: "tsunami",
        hazard_level: "High Tsunami Hazard",
        region_group: "coastal",
        region_name: "Andhra Pradesh Coast",
        inundation_buffer_km: 1.2,
        max_runup_m: 4.5,
        early_warning_time_min: 150,
        monitoring_buoys: "Machilipatnam & Visakhapatnam tide gauges",
        authority: "INCOIS & APSDMA",
        official_reference: "INCOIS Tsunami Risk Atlas for Andhra Pradesh",
        color: "#06b6d4",
        border_color: "#0891b2",
        summary: "Vulnerable to Bay of Bengal tsunamigenic seismic events. Flat delta plains of Krishna and Godavari allow tsunami run-ups to penetrate inland through river mouths and estuaries."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [80.3, 14.0],
          [80.8, 15.5],
          [81.8, 16.2],
          [82.4, 16.8],
          [83.3, 17.7],
          [84.2, 18.5]
        ]
      }
    },

    // =========================================================================
    // 8. HEATWAVE INFORMATION (IMD Heatwave Atlas & NDMA Heat Action Plan)
    // =========================================================================
    {
      type: "Feature",
      id: "heatwave_vidarbha_central",
      properties: {
        id: "heatwave_vidarbha_central",
        name: "Vidarbha & Central India Heat Core",
        hazard_type: "heatwave",
        hazard_level: "Severe Heatwave Core Zone",
        region_group: "peninsular",
        region_name: "Eastern Maharashtra / Central India",
        max_recorded_temp_c: 48.6,
        avg_heatwave_days: 18,
        wet_bulb_risk: "Extreme Danger (Dry Heat Convection)",
        action_plan_framework: "Nagpur Heat Action Plan (HAP) & NDMA Guidelines",
        authority: "India Meteorological Department (IMD) & NDMA",
        official_reference: "IMD Heatwave Atlas of India / NDMA National Guidelines",
        color: "#e11d48",
        border_color: "#be123c",
        summary: "Nagpur, Chandrapur, and Wardha routinely record temperatures exceeding 47°C to 48.5°C in May. Prolonged continental hot dry winds from the northwest create acute thermal stress."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.5, 21.8],
            [80.5, 21.8],
            [80.5, 19.8],
            [78.5, 19.8],
            [78.5, 21.8]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "heatwave_thar_rajasthan",
      properties: {
        id: "heatwave_thar_rajasthan",
        name: "Western Rajasthan Extreme Arid Heat Zone",
        hazard_type: "heatwave",
        hazard_level: "National Extreme Record Zone",
        region_group: "peninsular",
        region_name: "Western Rajasthan",
        max_recorded_temp_c: 51.0,
        avg_heatwave_days: 22,
        wet_bulb_risk: "Very High Thermal Index (Phalodi 51.0°C Record)",
        action_plan_framework: "Rajasthan State Heat Action Protocol",
        authority: "India Meteorological Department (IMD)",
        official_reference: "IMD Extreme Weather Events Database",
        color: "#e11d48",
        border_color: "#be123c",
        summary: "Contains Phalodi, which holds the national record of 51.0°C (19 May 2016). High solar radiation, sparse vegetation, and dry desert sands generate extreme day temperatures."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [70.0, 28.5],
            [74.5, 28.5],
            [74.5, 25.5],
            [70.0, 25.5],
            [70.0, 28.5]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "heatwave_gangetic_urban",
      properties: {
        id: "heatwave_gangetic_urban",
        name: "Indo-Gangetic & Delhi-NCR Urban Heat Corridor",
        hazard_type: "heatwave",
        hazard_level: "High Risk + Urban Heat Island",
        region_group: "gangetic",
        region_name: "Delhi-NCR, Western UP, Haryana, Punjab",
        max_recorded_temp_c: 49.2,
        avg_heatwave_days: 15,
        wet_bulb_risk: "Critical Compound Risk (Heat + Pre-Monsoon Moisture)",
        action_plan_framework: "Delhi Heat Action Plan (DDMA)",
        authority: "India Meteorological Department & Delhi DMA",
        official_reference: "IMD Climatological Normals & Urban Heat Island Studies",
        color: "#e11d48",
        border_color: "#be123c",
        summary: "Urban Heat Island (UHI) effects trap heat overnight in high-density built environments. Pre-monsoon humidity influx pushes wet-bulb temperatures into the danger threshold for outdoor workers."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.5, 30.5],
            [78.5, 29.5],
            [81.0, 27.5],
            [80.0, 26.5],
            [76.5, 27.5],
            [75.5, 30.5]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "heatwave_rayalaseema_telangana",
      properties: {
        id: "heatwave_rayalaseema_telangana",
        name: "Telangana & Rayalaseema Humid Heat Belt",
        hazard_type: "heatwave",
        hazard_level: "High Wet-Bulb Hazard",
        region_group: "peninsular",
        region_name: "Telangana & Andhra Pradesh Interior",
        max_recorded_temp_c: 47.5,
        avg_heatwave_days: 14,
        wet_bulb_risk: "High Morbidity Risk from Thermal Stress",
        action_plan_framework: "Telangana Cool Roof Policy & NDMA Heat Action Plan",
        authority: "India Meteorological Department & TSDMA",
        official_reference: "Telangana State Disaster Management Authority HAP",
        color: "#e11d48",
        border_color: "#be123c",
        summary: "Industrial coal-belt pockets like Ramagundam and Khammam experience intense radiant heat, exacerbated by high relative humidity that inhibits the human body's natural evaporative cooling."
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.0, 18.8],
            [80.8, 18.8],
            [80.5, 16.5],
            [78.0, 16.5],
            [78.0, 18.8]
          ]
        ]
      }
    }
  ]
};

// =============================================================================
// HISTORICAL DISASTER EVENTS (CHRONOLOGICAL TIMELINE)
// =============================================================================
export const HISTORICAL_DISASTER_EVENTS: HistoricalDisasterEvent[] = [
  {
    id: "eq_shillong_1897",
    name: "1897 Great Shillong Earthquake",
    year: 1897,
    dateStr: "12 June 1897",
    hazardType: "earthquake",
    region: "northeast",
    regionName: "Shillong Plateau, Meghalaya",
    magnitudeOrIntensity: "Mw 8.1 (MSK XI)",
    casualtiesApprox: "~1,542 casualties",
    coordinates: [91.0, 26.0],
    zoom: 7.2,
    pitch: 45,
    bearing: 15,
    summary: "One of the most powerful intraplate continental earthquakes ever documented. Richard Dixon Oldham analyzed its recordings to discover primary (P), secondary (S), and surface seismic waves.",
    keyFacts: [
      "Fault system: Oldham Fault rupture beneath Shillong Plateau",
      "Uplifted parts of the plateau by 11 meters relative to the plains",
      "Destroyed masonry buildings across 390,000 sq km of northeast India"
    ],
    authority: "Geological Survey of India (GSI Memoirs Vol. XXIX)",
    officialReference: "GSI Memoirs Vol. XXIX (1899)"
  },
  {
    id: "eq_kangra_1905",
    name: "1905 Kangra Earthquake",
    year: 1905,
    dateStr: "4 April 1905",
    hazardType: "earthquake",
    region: "himalayan",
    regionName: "Kangra Valley, Himachal Pradesh",
    magnitudeOrIntensity: "Mw 7.8 (MSK X)",
    casualtiesApprox: ">20,000 casualties",
    coordinates: [76.3, 32.0],
    zoom: 7.5,
    pitch: 50,
    bearing: -20,
    summary: "Catastrophic rupture along the Main Boundary Thrust (MBT) in the western Himalayas, completely leveling Kangra, Dharamshala, and Mandi.",
    keyFacts: [
      "Over 100,000 buildings collapsed across Himachal Pradesh",
      "Led to the earliest seismic structural building regulations in British India",
      "Triggered hundreds of rock avalanches across the Dhauladhar Range"
    ],
    authority: "Geological Survey of India (Middlemiss, 1910)",
    officialReference: "GSI Memoirs Vol. XXXVIII"
  },
  {
    id: "eq_bihar_nepal_1934",
    name: "1934 Bihar–Nepal Earthquake",
    year: 1934,
    dateStr: "15 January 1934",
    hazardType: "earthquake",
    region: "gangetic",
    regionName: "North Bihar & Nepal Terai",
    magnitudeOrIntensity: "Mw 8.0 (MSK X)",
    casualtiesApprox: ">10,700 casualties",
    coordinates: [86.5, 26.5],
    zoom: 7.2,
    pitch: 40,
    bearing: 0,
    summary: "Major Himalayan frontal blind thrust rupture that caused unprecedented liquefaction, sand volcanism, and deep fissures across North Bihar towns.",
    keyFacts: [
      "Munger and Muzaffarpur were almost completely leveled",
      "Mahatma Gandhi and Rajendra Prasad led volunteer relief campaigns",
      "Extensive liquefaction disrupted railway tracks and irrigation canals"
    ],
    authority: "Geological Survey of India (Dunn et al., 1939)",
    officialReference: "GSI Memoirs Vol. LXXIII"
  },
  {
    id: "eq_assam_1950",
    name: "1950 Great Assam–Tibet Earthquake",
    year: 1950,
    dateStr: "15 August 1950",
    hazardType: "earthquake",
    region: "northeast",
    regionName: "Mishmi Hills, Upper Assam",
    magnitudeOrIntensity: "Mw 8.6 (MSK XI)",
    casualtiesApprox: ">4,800 casualties",
    coordinates: [96.5, 28.5],
    zoom: 6.8,
    pitch: 55,
    bearing: 30,
    summary: "The 6th largest earthquake of the 20th century. Massive landslides blocked major Himalayan rivers, forming natural dams that later burst and caused catastrophic flash floods.",
    keyFacts: [
      "Dammed the Subansiri River; dam burst 8 days later, inundating 70 villages",
      "Altered the bed of the Brahmaputra River, permanently worsening flood risks",
      "Strong ground shaking felt over an area exceeding 4.5 million sq km"
    ],
    authority: "Geological Survey of India & USGS",
    officialReference: "USGS Historical Earthquake Catalog"
  },
  {
    id: "eq_uttarkashi_1991",
    name: "1991 Uttarkashi Earthquake",
    year: 1991,
    dateStr: "20 October 1991",
    hazardType: "earthquake",
    region: "himalayan",
    regionName: "Garhwal, Uttarakhand",
    magnitudeOrIntensity: "Mw 6.8 (MSK VIII)",
    casualtiesApprox: "~1,000 casualties",
    coordinates: [78.8, 30.7],
    zoom: 7.6,
    pitch: 50,
    bearing: -15,
    summary: "Shallow tectonic rupture along the Main Central Thrust in the Garhwal Himalayas that flattened over 42,000 houses.",
    keyFacts: [
      "Demonstrated vulnerability of traditional unreinforced stone-and-mud dwellings",
      "Led to revised safety monitoring protocols for the Tehri Dam",
      "Spurred the establishment of specialized Himalayan seismological networks"
    ],
    authority: "National Centre for Seismology & GSI",
    officialReference: "NCS Seismological Records"
  },
  {
    id: "eq_latur_1993",
    name: "1993 Latur (Killari) Earthquake",
    year: 1993,
    dateStr: "30 September 1993",
    hazardType: "earthquake",
    region: "peninsular",
    regionName: "Marathwada, Maharashtra",
    magnitudeOrIntensity: "Mw 6.2 (MSK IX)",
    casualtiesApprox: "~9,748 casualties",
    coordinates: [76.58, 18.06],
    zoom: 7.8,
    pitch: 45,
    bearing: 10,
    summary: "A shallow, lethal intraplate earthquake in the Deccan basalt shield that destroyed 52 villages and reshaped Indian seismic zoning philosophy.",
    keyFacts: [
      "Disproved the long-held belief that Peninsular India was completely stable/aseismic",
      "Focal depth of only 7 km magnified surface ground acceleration",
      "Directly spurred the revision of national seismic building code IS 1893"
    ],
    authority: "Geological Survey of India & IMD",
    officialReference: "GSI Special Publication No. 35"
  },
  {
    id: "cyclone_odisha_1999_track",
    name: "1999 Odisha Super Cyclone (BOB 06)",
    year: 1999,
    dateStr: "29 October 1999",
    hazardType: "cyclone",
    region: "coastal",
    regionName: "Paradip, Odisha Coast",
    magnitudeOrIntensity: "Cat 5 Super Cyclone (260 km/h, 912 hPa)",
    casualtiesApprox: "9,887 confirmed fatalities",
    coordinates: [86.7, 20.3],
    zoom: 7.5,
    pitch: 40,
    bearing: -10,
    summary: "The most intense recorded tropical cyclone in North Indian Ocean history. A 6-meter storm surge penetrated 35 km inland across coastal Odisha.",
    keyFacts: [
      "Sustained wind speeds of 260 km/h with gusts exceeding 300 km/h",
      "Destroyed 1.6 million houses and killed over 400,000 livestock",
      "Led to the creation of the Odisha State Disaster Management Authority (OSDMA)"
    ],
    authority: "India Meteorological Department (IMD)",
    officialReference: "IMD BOB 06/1999 Comprehensive Report"
  },
  {
    id: "eq_bhuj_2001",
    name: "2001 Bhuj (Gujarat) Earthquake",
    year: 2001,
    dateStr: "26 January 2001",
    hazardType: "earthquake",
    region: "peninsular",
    regionName: "Kutch, Gujarat",
    magnitudeOrIntensity: "Mw 7.7 (MSK X)",
    casualtiesApprox: "~20,085 casualties",
    coordinates: [70.232, 23.419],
    zoom: 7.8,
    pitch: 48,
    bearing: 5,
    summary: "One of the most destructive earthquakes in modern Indian history. Flattened Bhuj, Anjar, and Bachau; collapsed multistory apartments 300 km away in Ahmedabad.",
    keyFacts: [
      "Struck on Republic Day morning during school and municipal parades",
      "Prompted the creation of GSDMA and the national NDMA framework",
      "Total economic damages exceeded $5.5 Billion USD"
    ],
    authority: "National Disaster Management Authority (NDMA) & IMD",
    officialReference: "GSDMA Bhuj Reconstruction Review"
  },
  {
    id: "eq_tsunami_2004",
    name: "2004 Indian Ocean Tsunami & Megathrust",
    year: 2004,
    dateStr: "26 December 2004",
    hazardType: "tsunami",
    region: "coastal",
    regionName: "Coromandel Coast & Andaman-Nicobar",
    magnitudeOrIntensity: "Mw 9.1 (Megathrust Rupture)",
    casualtiesApprox: ">16,000 casualties in India",
    coordinates: [80.25, 13.08],
    zoom: 7.0,
    pitch: 35,
    bearing: 0,
    summary: "A massive undersea earthquake off northern Sumatra generated giant tsunami waves that struck coastal Tamil Nadu, Andhra Pradesh, Kerala, and Andaman & Nicobar.",
    keyFacts: [
      "Maximum run-up heights reached 10 to 12 meters along the coast",
      "Led to India establishing the Indian Tsunami Early Warning Centre (ITEWC) at INCOIS",
      "Directly spurred Parliament to pass the Disaster Management Act, 2005"
    ],
    authority: "INCOIS / Ministry of Earth Sciences",
    officialReference: "INCOIS Tsunami Early Warning Atlas"
  },
  {
    id: "eq_kashmir_2005",
    name: "2005 Kashmir (Uri / Muzaffarabad) Earthquake",
    year: 2005,
    dateStr: "8 October 2005",
    hazardType: "earthquake",
    region: "himalayan",
    regionName: "Uri / Tangdhar, Jammu & Kashmir",
    magnitudeOrIntensity: "Mw 7.6 (MSK X)",
    casualtiesApprox: ">86,000 total (>1,400 in J&K)",
    coordinates: [73.6, 34.4],
    zoom: 7.4,
    pitch: 52,
    bearing: -25,
    summary: "Major Himalayan compressional earthquake along the Balakot-Bagh fault that caused widespread mountain collapses, severing mountain roads and isolated valleys.",
    keyFacts: [
      "Uri and Tangdhar border sectors suffered severe damage to infrastructure",
      "Severed major mountain supply highways and triggered extensive slope liquefaction",
      "Cross-border humanitarian aid points were established along the Line of Control"
    ],
    authority: "National Centre for Seismology & IMD",
    officialReference: "NCS Seismological Bulletins"
  },
  {
    id: "flood_mumbai_mithi",
    name: "2005 Mumbai Mega Deluge (944mm Record)",
    year: 2005,
    dateStr: "26 July 2005",
    hazardType: "flood",
    region: "coastal",
    regionName: "Mumbai Metropolitan Region",
    magnitudeOrIntensity: "944 mm rainfall in 24 hours",
    casualtiesApprox: ">1,000 casualties",
    coordinates: [72.85, 19.05],
    zoom: 8.5,
    pitch: 45,
    bearing: 0,
    summary: "Cloudburst rainfall of 944 mm in 24 hours coincided with a 4.48-meter high tide, causing the Mithi River to overflow and submerging two-thirds of Mumbai.",
    keyFacts: [
      "Economic losses exceeded $1.2 Billion; airport and suburban rail shutdown for days",
      "The Chitale Committee recommended comprehensive widening of the Mithi River",
      "Spurred modern doppler weather radar installations and pumping station upgrades"
    ],
    authority: "Brihanmumbai Municipal Corporation & Chitale Committee",
    officialReference: "Chitale Committee Fact-Finding Report (2006)"
  },
  {
    id: "flood_north_bihar_kosi",
    name: "2008 Kosi Mega Floods & River Avulsion",
    year: 2008,
    dateStr: "18 August 2008",
    hazardType: "flood",
    region: "gangetic",
    regionName: "Kusaha, North Bihar",
    magnitudeOrIntensity: "Embankment Breach; 120 km Avulsion",
    casualtiesApprox: ">527 confirmed dead, 3 Million displaced",
    coordinates: [86.9, 26.3],
    zoom: 7.8,
    pitch: 42,
    bearing: 10,
    summary: "The Kosi River breached its eastern afflux embankment at Kusaha (Nepal), re-occupying an old course 120 km to the east and submerging five districts of North Bihar.",
    keyFacts: [
      "Declared a 'National Calamity' by the Prime Minister of India",
      "Submerged over 300,000 hectares of prime agricultural farmland",
      "Highlighted the limits of hard structural river embankments in silt-laden rivers"
    ],
    authority: "Central Water Commission & Bihar WRD",
    officialReference: "NDMA Kosi Flood Breach Assessment Report"
  },
  {
    id: "landslide_garhwal_kedarnath",
    name: "2013 Kedarnath Debris Flow & Himalayan Floods",
    year: 2013,
    dateStr: "16 - 17 June 2013",
    hazardType: "landslide",
    region: "himalayan",
    regionName: "Mandakini Valley, Kedarnath, Uttarakhand",
    magnitudeOrIntensity: "GLOF + Cloudburst Debris Flow",
    casualtiesApprox: ">5,700 presumed dead / missing",
    coordinates: [79.06, 30.73],
    zoom: 8.2,
    pitch: 58,
    bearing: -10,
    summary: "Unprecedented multi-day cloudburst rainfall combined with rapid melting of snow burst the Chorabari moraine dam, sending a colossal debris avalanche through Kedarnath town.",
    keyFacts: [
      "Over 100,000 pilgrims stranded across the Char Dham mountain pilgrimage routes",
      "Operation Surya Hope conducted by the Indian Armed Forces was the largest military rescue in history",
      "Decimated bridges, hydel tunnels, and the entire Mandakini valley floor"
    ],
    authority: "Wadia Institute of Himalayan Geology & NDMA",
    officialReference: "WIHG Kedarnath Disaster Monograph"
  },
  {
    id: "cyclone_phailin_2013_track",
    name: "2013 Cyclone Phailin (Gopalpur Landfall)",
    year: 2013,
    dateStr: "12 October 2013",
    hazardType: "cyclone",
    region: "coastal",
    regionName: "Gopalpur, Ganjam, Odisha",
    magnitudeOrIntensity: "Cat 5 Equivalent (215 km/h, 940 hPa)",
    casualtiesApprox: "45 casualties",
    coordinates: [85.0, 19.3],
    zoom: 7.5,
    pitch: 40,
    bearing: 5,
    summary: "A landmark achievement in global disaster risk reduction. The rapid evacuation of 1.15 million people to cyclone shelters prevented catastrophic loss of life.",
    keyFacts: [
      "Lowest casualty rate in global history for an intense Category 4/5 cyclone",
      "Odisha's community early warning dissemination network praised by the United Nations",
      "Extensive power transmission infrastructure damage in Ganjam district"
    ],
    authority: "India Meteorological Department & OSDMA",
    officialReference: "UNDRR Phailin Success Case Study"
  },
  {
    id: "cyclone_hudhud_2014_track",
    name: "2014 Cyclone Hudhud (Visakhapatnam Strike)",
    year: 2014,
    dateStr: "12 October 2014",
    hazardType: "cyclone",
    region: "coastal",
    regionName: "Visakhapatnam City, Andhra Pradesh",
    magnitudeOrIntensity: "Extremely Severe Cyclone (185 km/h)",
    casualtiesApprox: "124 casualties",
    coordinates: [83.3, 17.7],
    zoom: 8.0,
    pitch: 45,
    bearing: -15,
    summary: "Made direct landfall on the industrial and naval port city of Visakhapatnam, destroying green cover, port cranes, and urban telecommunications networks.",
    keyFacts: [
      "First cyclone in India where real-time satellite radar and drone assessment were deployed",
      "Caused over ₹21,900 crore ($3.4B) in infrastructural damage",
      "Visakhapatnam Airport roof blown off, crippling commercial air access"
    ],
    authority: "India Meteorological Department & APSDMA",
    officialReference: "IMD Hudhud Technical Monograph"
  },
  {
    id: "eq_nepal_bihar_2015",
    name: "2015 Gorkha (Nepal–Bihar) Earthquake",
    year: 2015,
    dateStr: "25 April 2015",
    hazardType: "earthquake",
    region: "gangetic",
    regionName: "Gorkha, Nepal / North Bihar",
    magnitudeOrIntensity: "Mw 7.8 (MHT Decollement)",
    casualtiesApprox: "8,964 total (~100 in Bihar/UP)",
    coordinates: [84.7, 28.2],
    zoom: 7.2,
    pitch: 42,
    bearing: 0,
    summary: "A major thrust earthquake on the Main Himalayan Thrust that shook North India, triggering building collapses across Raxaul, Patna, and Gorakhpur.",
    keyFacts: [
      "India launched Operation Maitri within 6 hours, delivering emergency relief and NDRF teams",
      "Severe liquefaction and crack openings observed in the northern Gangetic plain",
      "Highlighted the high seismic vulnerability of multi-story brick masonry buildings"
    ],
    authority: "National Centre for Seismology & NDMA",
    officialReference: "NDMA Operation Maitri Report"
  },
  {
    id: "flood_kerala_periyar_2018",
    name: "2018 Kerala Century Mega Floods",
    year: 2018,
    dateStr: "8 - 19 August 2018",
    hazardType: "flood",
    region: "coastal",
    regionName: "Periyar & Pamba Basins, Kerala",
    magnitudeOrIntensity: "100-Year Return Deluge",
    casualtiesApprox: "483 fatalities, 1.4 Million in camps",
    coordinates: [76.4, 9.9],
    zoom: 7.8,
    pitch: 45,
    bearing: 10,
    summary: "Unprecedented monsoon rainfall filled all major dams simultaneously, forcing the opening of 35 reservoirs including Idukki and Idamalayar, causing massive flooding across 14 districts.",
    keyFacts: [
      "Over 1.4 million people sheltered in 3,000 relief camps",
      "Traditional Kerala fishermen ('Kerala's Army') rescued over 65,000 marooned citizens",
      "Total estimated damages exceeded ₹40,000 crore ($5.8B)"
    ],
    authority: "Central Water Commission & KSDMA",
    officialReference: "CWC Study on Kerala Floods (2018)"
  },
  {
    id: "cyclone_fani_2019_track",
    name: "2019 Cyclone Fani (Puri Landfall)",
    year: 2019,
    dateStr: "3 May 2019",
    hazardType: "cyclone",
    region: "coastal",
    regionName: "Puri, Odisha Coast",
    magnitudeOrIntensity: "Cat 4 Extremely Severe (215 km/h)",
    casualtiesApprox: "89 casualties",
    coordinates: [85.8, 19.8],
    zoom: 7.8,
    pitch: 42,
    bearing: 0,
    summary: "Rare summer pre-monsoon storm with exceptional rapid intensification over warm Bay of Bengal waters. Tore through Puri and the Bhubaneswar metropolitan zone.",
    keyFacts: [
      "Evacuated 1.2 million people in 24 hours across 10,000 shelters",
      "Completely uprooted electrical grids in Puri and Bhubaneswar; power restoration took weeks",
      "Chilika Lake opened 4 new natural mouths due to the intense storm surge"
    ],
    authority: "India Meteorological Department & NDMA",
    officialReference: "NDMA Fani Evaluation Report"
  },
  {
    id: "cyclone_amphan_2020_track",
    name: "2020 Super Cyclone Amphan",
    year: 2020,
    dateStr: "20 May 2020",
    hazardType: "cyclone",
    region: "gangetic",
    regionName: "Sagar Island & Kolkata, West Bengal",
    magnitudeOrIntensity: "Cat 5 Super Cyclone (260 km/h, 920 hPa)",
    casualtiesApprox: "128 casualties",
    coordinates: [88.3, 21.6],
    zoom: 7.6,
    pitch: 40,
    bearing: 10,
    summary: "The costliest cyclone in North Indian Ocean history ($14B+ losses). Severe damage to Kolkata city, destroying green cover, power grids, and delta embankments during the COVID-19 lockdown.",
    keyFacts: [
      "Over 3 million people evacuated across West Bengal and Odisha during the pandemic",
      "Sundarbans mangrove delta suffered severe saline inundation of freshwater ponds",
      "Kolkata recorded winds of 133 km/h, flooding roads and collapsing ancient heritage structures"
    ],
    authority: "India Meteorological Department & WB DMA",
    officialReference: "IMD Super Cyclone Amphan Bulletin"
  },
  {
    id: "cyclone_tauktae_2021_track",
    name: "2021 Cyclone Tauktae",
    year: 2021,
    dateStr: "17 May 2021",
    hazardType: "cyclone",
    region: "coastal",
    regionName: "Una / Diu Coast, Saurashtra, Gujarat",
    magnitudeOrIntensity: "Cat 4 Extremely Severe (220 km/h)",
    casualtiesApprox: "169 casualties",
    coordinates: [71.1, 20.8],
    zoom: 7.6,
    pitch: 45,
    bearing: -10,
    summary: "Strongest tropical cyclone to strike Gujarat since 1998. Paralleled the entire west coast of India, causing storm surge in Kerala, Goa, and Maharashtra before landfall.",
    keyFacts: [
      "Sustained wind speeds of 220 km/h severely damaged Saurashtra orchards and power lines",
      "Offshore barge P305 sank near Bombay High oilfields, claiming 86 lives",
      "Demonstrated the trend of increasing intense Arabian Sea cyclogenesis driven by sea surface warming"
    ],
    authority: "India Meteorological Department & GSDMA",
    officialReference: "IMD Technical Monograph on Tauktae"
  },
  {
    id: "landslide_sikkim_teesta",
    name: "2023 South Lhonak Glacial Lake Outburst (GLOF)",
    year: 2023,
    dateStr: "4 October 2023",
    hazardType: "landslide",
    region: "himalayan",
    regionName: "Teesta Valley, North Sikkim",
    magnitudeOrIntensity: "GLOF Flash Flood (Teesta Basin)",
    casualtiesApprox: ">100 dead or missing (including 22 Army personnel)",
    coordinates: [88.5, 27.5],
    zoom: 8.0,
    pitch: 55,
    bearing: -20,
    summary: "Sudden glacial lake outburst flood from South Lhonak Lake in North Sikkim sent millions of cubic meters of water and debris cascading down the Teesta River.",
    keyFacts: [
      "Washed away the 1,200 MW Teesta-III Chungthang Dam in minutes",
      "Submerged National Highway 10, cutting off Sikkim from the rest of India for weeks",
      "Highlighted the urgent risk of climate-induced glacial lake expansions across the Himalayas"
    ],
    authority: "National Remote Sensing Centre (NRSC/ISRO) & Sikkim SDMA",
    officialReference: "NRSC Post-GLOF Satellite Inundation Mapping"
  },
  {
    id: "cyclone_biparjoy_2023_track",
    name: "2023 Cyclone Biparjoy (Kutch Landfall)",
    year: 2023,
    dateStr: "15 June 2023",
    hazardType: "cyclone",
    region: "coastal",
    regionName: "Jakhau Port, Kutch, Gujarat",
    magnitudeOrIntensity: "Very Severe Cyclone (165 km/h)",
    casualtiesApprox: "2 casualties (historic benchmark evacuation)",
    coordinates: [68.6, 23.2],
    zoom: 7.8,
    pitch: 42,
    bearing: 5,
    summary: "Longest-lasting cyclone in the Arabian Sea (active for 13 days, 3 hours). Demonstrated exceptional civil protection with nearly zero direct casualties upon landfall.",
    keyFacts: [
      "Over 100,000 citizens relocated to reinforced storm shelters within 72 hours",
      "Extensive salt-flat inundation and power transmission towers damaged in Kutch",
      "Later traveled inland across Rajasthan, bringing unprecedented desert rainfall"
    ],
    authority: "India Meteorological Department & NDMA",
    officialReference: "IMD Report on Cyclone Biparjoy (2023)"
  },
  {
    id: "landslide_wayanad_escarpment",
    name: "2024 Wayanad Catastrophic Debris Avalanches",
    year: 2024,
    dateStr: "30 July 2024",
    hazardType: "landslide",
    region: "peninsular",
    regionName: "Chooralmala & Mundakkai, Wayanad, Kerala",
    magnitudeOrIntensity: "Very High Debris Flow (>572 mm rain / 48h)",
    casualtiesApprox: ">400 casualties",
    coordinates: [76.15, 11.48],
    zoom: 8.5,
    pitch: 55,
    bearing: 15,
    summary: "Torrential monsoon rains triggered catastrophic debris flows originating at high altitudes on the Western Ghats escarpment, flattening the villages of Chooralmala, Mundakkai, and Attamala.",
    keyFacts: [
      "Massive boulders and liquefying laterite slurry traveled over 8 km down the Iruvanjippuzha riverbed",
      "Destroyed the primary bridge connecting Chooralmala and Mundakkai",
      "Prompted GSI and NDMA to deploy advanced automated early warning rainfall threshold stations"
    ],
    authority: "Geological Survey of India & KSDMA",
    officialReference: "GSI Wayanad Geotechnical Survey Report (2024)"
  },
  {
    id: "heatwave_vidarbha_central",
    name: "2024 Severe Pan-India Summer Heatwave Spell",
    year: 2024,
    dateStr: "May - June 2024",
    hazardType: "heatwave",
    region: "gangetic",
    regionName: "Vidarbha, Delhi-NCR, Churu, Western Rajasthan",
    magnitudeOrIntensity: "48°C - 50°C Prolonged Records",
    casualtiesApprox: ">200 heatstroke fatalities across North India",
    coordinates: [77.2, 28.6],
    zoom: 6.8,
    pitch: 35,
    bearing: 0,
    summary: "One of the longest and most severe heatwave spells in Indian recorded history. Temperatures repeatedly surged above 48°C in Delhi, Haryana, Rajasthan, and Vidarbha.",
    keyFacts: [
      "Delhi Mungeshpur station recorded historic high temperatures above 49.5°C",
      "Peak summer electrical grid demand surpassed 250 GW nationwide",
      "Accelerated the rollout of NDMA municipal Heat Action Plans (HAP) and labor hours restrictions"
    ],
    authority: "India Meteorological Department (IMD) & NDMA",
    officialReference: "IMD Climatological Report on Summer 2024 Heatwaves"
  }
];

// Lookup dictionaries
export const DISASTER_HAZARDS_BY_ID: Record<string, DisasterGeoJSONFeature> = {};
for (const feature of DISASTER_GEOJSON.features) {
  if (feature.id) {
    DISASTER_HAZARDS_BY_ID[String(feature.id)] = feature;
  }
}

export const HISTORICAL_DISASTER_EVENTS_BY_ID: Record<string, HistoricalDisasterEvent> = {};
for (const event of HISTORICAL_DISASTER_EVENTS) {
  HISTORICAL_DISASTER_EVENTS_BY_ID[event.id] = event;
}
