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
  | 'disaster_seismic';

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

export type BasemapStyle = 'dark' | 'satellite' | 'osm' | 'geoapify' | 'physical_tactile';

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
    | 'seismic_zone' 
    | 'earthquake_epicenter';
  name: string;
  state?: string;
  district?: string;
  demographics?: DemographicRecord;
  properties: Record<string, any>;
  coordinates?: [number, number];
}
