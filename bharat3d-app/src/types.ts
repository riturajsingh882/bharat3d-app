export interface DemographicRecord {
  state?: string;
  district?: string;
  population_2011?: number;
  population_2001?: number;
  male_2011?: number;
  female_2011?: number;
  growth_pct?: number;
  area_sqkm?: number;
  density_2011?: number;
  density_2001?: number;
  sex_ratio?: number;
  literacy_rate?: number;
  male_literacy?: number;
  female_literacy?: number;
  rural_pop?: number;
  urban_pop?: number;
  rural_pct?: number;
  urban_pct?: number;
  hindu_count?: number;
  hindu_pct?: number;
  muslim_count?: number;
  muslim_pct?: number;
  christian_count?: number;
  christian_pct?: number;
  sikh_count?: number;
  sikh_pct?: number;
  buddhist_count?: number;
  buddhist_pct?: number;
  jain_count?: number;
  jain_pct?: number;
  other_count?: number;
  other_pct?: number;
  source?: string;
  census_year?: number;
  religion_source?: string;
}

export type ActiveLayer = 
  | 'political_states'
  | 'political_districts'
  | 'state_labels'
  | 'rivers'
  | 'soils'
  | 'mountains'
  | 'pop_density'
  | 'pop_total'
  | 'religion'
  | 'literacy'
  | 'sex_ratio'
  | 'historical_atlas'
  | 'archaeological_sites'
  | 'trade_routes'
  | 'roads'
  | 'infrastructure_economic'
  | 'disaster_seismic'
  | 'environmental_change';

export type InfrastructureCategory =
  | 'highways'
  | 'railways'
  | 'airports'
  | 'seaports'
  | 'industrial_corridors'
  | 'dams'
  | 'power_plants'
  | 'economic_zones'
  | 'urban_centres';

export type HistoricalPeriodId =
  | 'indus_valley'
  | 'mahajanapadas'
  | 'maurya'
  | 'gupta'
  | 'delhi_sultanate'
  | 'mughal'
  | 'maratha'
  | 'british_1909'
  | 'partition_1947'
  | 'states_reorg_1956'
  | 'modern_states_2000'
  | 'telangana_2014'
  | 'present';

export interface HistoricalPeriodMeta {
  id: HistoricalPeriodId;
  name: string;
  era: string;
  yearApprox: string;
  capital: string;
  description: string;
  rulerNotable: string;
  color: string;
}

export type ReligionFilter = 
  | 'hindu'
  | 'muslim'
  | 'christian'
  | 'sikh'
  | 'buddhist'
  | 'jain';

export type TradeCategory = 
  | 'ancient_highway'
  | 'maritime_route'
  | 'silk_road'
  | 'spice_route'
  | 'ancient_port'
  | 'colonial_network'
  | 'historical_railway';

export type EnvironmentalPillar = 
  | 'forest_change'
  | 'glacier_retreat'
  | 'urban_expansion'
  | 'coastal_erosion'
  | 'wetland_change'
  | 'desertification'
  | 'groundwater_stress'
  | 'river_avulsion';

export interface EnvironmentalComparisonConfig {
  pillar: EnvironmentalPillar;
  yearA: string;
  yearB: string;
  isDeltaMode: boolean;
}

export type BasemapStyle = 'dark' | 'satellite' | 'osm' | 'geoapify' | 'physical_tactile';

export type DisasterHazardType = 
  | 'earthquake'
  | 'seismic_zone'
  | 'cyclone'
  | 'flood'
  | 'landslide'
  | 'drought'
  | 'tsunami'
  | 'heatwave';

export type DisasterRegion = 
  | 'all'
  | 'himalayan'
  | 'gangetic'
  | 'coastal'
  | 'peninsular'
  | 'northeast';

export interface HistoricalDisasterEvent {
  id: string;
  name: string;
  year: number;
  dateStr?: string;
  hazardType: DisasterHazardType;
  region: DisasterRegion;
  regionName: string;
  magnitudeOrIntensity: string;
  casualtiesApprox?: number | string;
  coordinates: [number, number]; // [lng, lat]
  zoom?: number;
  pitch?: number;
  bearing?: number;
  summary: string;
  keyFacts: string[];
  authority: string;
  officialReference?: string;
}

export interface CameraPreset {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface SearchTarget {
  name: string;
  type?: string;
  key?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  pitch?: number;
  bearing?: number;
  bbox?: [[number, number], [number, number]];
}

export interface SelectedFeatureInfo {
  type: 
    | 'state' 
    | 'district' 
    | 'river' 
    | 'soil' 
    | 'mountain' 
    | 'historical_empire' 
    | 'archaeological_site' 
    | 'trade_route' 
    | 'highway'
    | 'infrastructure_item'
    | 'infrastructure_highway'
    | 'infrastructure_railway'
    | 'infrastructure_airport'
    | 'infrastructure_seaport'
    | 'infrastructure_corridor'
    | 'infrastructure_dam'
    | 'infrastructure_power'
    | 'infrastructure_sez'
    | 'infrastructure_urban'
    | 'seismic_zone' 
    | 'earthquake_epicenter'
    | 'disaster_hazard'
    | 'cyclone_track'
    | 'flood_zone'
    | 'landslide_zone'
    | 'drought_zone'
    | 'tsunami_zone'
    | 'heatwave_zone'
    | 'environmental_change';
  name: string;
  state?: string;
  district?: string;
  demographics?: DemographicRecord;
  properties: Record<string, any>;
  coordinates?: [number, number];
  geometry?: any;
}
