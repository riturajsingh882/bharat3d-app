import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, NavigationControl, ScaleControl, setWorkerUrl, type MapMouseEvent, type MapGeoJSONFeature } from 'maplibre-gl';
import type { ActiveLayer, BasemapStyle, DemographicRecord, HistoricalPeriodId, ReligionFilter, SearchTarget, SelectedFeatureInfo, TradeCategory, EnvironmentalPillar, EnvironmentalComparisonConfig } from '../types';
import { APP_CONFIG } from '../config';
import { formatElevationDual } from '../utils/elevation';

// Statically point MapLibre worker to the public directory
setWorkerUrl('/maplibre-gl-worker.mjs');

// Maps search-result types without a dedicated highlight layer to a source + property.
const SEARCH_HIGHLIGHT_SOURCE: Record<string, { source: string; field: string } | undefined> = {
  historical_empire: { source: 'historical-empires', field: 'name' },
  historical_capital: { source: 'historical-empires', field: 'name' },
  trade_route: { source: 'historical-trade-routes', field: 'name' },
  environmental_change: { source: 'environmental-change', field: 'id' },
  glacier: { source: 'environmental-change', field: 'id' },
  wetland: { source: 'environmental-change', field: 'id' }
};

function clearSearchHighlight(map: Map) {
  if (map.getLayer('states-highlight')) map.setFilter('states-highlight', ['==', 'shapeName', '']);
  if (map.getLayer('states-highlight-fill')) map.setFilter('states-highlight-fill', ['==', 'shapeName', '']);
  if (map.getLayer('districts-highlight-line')) map.setFilter('districts-highlight-line', ['==', 'shapeName', '']);
  if (map.getLayer('districts-highlight-fill')) map.setFilter('districts-highlight-fill', ['==', 'shapeName', '']);
  if (map.getLayer('rivers-highlight')) map.setFilter('rivers-highlight', ['==', 'clean_name', '']);
  if (map.getLayer('mountains-highlight')) map.setFilter('mountains-highlight', ['==', 'name', '']);
  if (map.getLayer('roads-highlight')) map.setFilter('roads-highlight', ['==', 'code', '']);
  if (map.getLayer('env-highlight-fill')) map.setFilter('env-highlight-fill', ['==', ['id'], '']);
  if (map.getLayer('env-highlight-border')) map.setFilter('env-highlight-border', ['==', ['id'], '']);
  if (map.getLayer('env-highlight-line')) map.setFilter('env-highlight-line', ['==', ['id'], '']);
  if (map.getLayer('env-highlight-point')) map.setFilter('env-highlight-point', ['==', ['id'], '']);
  const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
  if (src && typeof src.setData === 'function') src.setData({ type: 'FeatureCollection', features: [] });
}

function applySearchHighlight(map: Map, target: SearchTarget | null) {
  clearSearchHighlight(map);
  if (!target || !target.type || !map.isStyleLoaded()) return;

  const setPoint = () => {
    if (target.lng === undefined || target.lat === undefined) return;
    const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
    if (src) {
      src.setData({
        type: 'FeatureCollection',
        features: [
          { type: 'Feature', geometry: { type: 'Point', coordinates: [target.lng, target.lat] }, properties: {} }
        ]
      });
    }
  };

  switch (target.type) {
    case 'state':
      if (target.key) {
        if (map.getLayer('states-highlight')) map.setFilter('states-highlight', ['==', 'shapeName', target.key]);
        if (map.getLayer('states-highlight-fill')) map.setFilter('states-highlight-fill', ['==', 'shapeName', target.key]);
      }
      break;
    case 'district':
      if (target.key) {
        if (map.getLayer('districts-highlight-line')) map.setFilter('districts-highlight-line', ['==', 'shapeName', target.key]);
        if (map.getLayer('districts-highlight-fill')) map.setFilter('districts-highlight-fill', ['==', 'shapeName', target.key]);
      }
      break;
    case 'river':
      if (target.key && map.getLayer('rivers-highlight')) map.setFilter('rivers-highlight', ['==', 'clean_name', target.key]);
      break;
    case 'mountain':
      if (target.key && map.getLayer('mountains-highlight')) map.setFilter('mountains-highlight', ['==', 'name', target.key]);
      break;
    case 'highway':
      if (target.key && map.getLayer('roads-highlight')) map.setFilter('roads-highlight', ['==', 'code', target.key]);
      break;
    case 'city':
    case 'peak':
    case 'archaeological_site':
      setPoint();
      break;
    case 'environmental_change':
    case 'glacier':
    case 'wetland': {
      const keyOrName = target.key || target.name || '';
      try {
        let feats = map.querySourceFeatures('environmental-change', {
          filter: [
            'any',
            ['==', ['get', 'id'], keyOrName],
            ['==', ['id'], keyOrName],
            ['==', ['get', 'name'], target.name || keyOrName]
          ]
        });
        if (feats.length === 0 && target.key) {
          feats = map.querySourceFeatures('environmental-change', {
            filter: [
              'any',
              ['==', ['get', 'id'], target.key],
              ['==', ['id'], target.key]
            ]
          });
        }
        if (feats.length > 0) {
          const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
          if (src) {
            src.setData({
              type: 'FeatureCollection',
              features: feats.map((f) => ({ type: 'Feature', geometry: f.geometry, properties: f.properties }))
            });
          }
        } else {
          setPoint();
        }
      } catch {
        setPoint();
      }
      break;
    }
    default: {
      const cfg = SEARCH_HIGHLIGHT_SOURCE[target.type];
      if (cfg && target.key) {
        try {
          const feats = map.querySourceFeatures(cfg.source, { filter: ['==', cfg.field, target.key] });
          if (feats.length > 0) {
            const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
            if (src) {
              src.setData({
                type: 'FeatureCollection',
                features: feats.map((f) => ({ type: 'Feature', geometry: f.geometry, properties: f.properties }))
              });
            }
          }
        } catch {
          // ignore lookup errors
        }
      } else {
        setPoint();
      }
      break;
    }
  }
}

// Calculate squared distance from point (px, py) to line segment (vx, vy)-(wx, wy) in screen space
function distToSegmentSquared(px: number, py: number, vx: number, vy: number, wx: number, wy: number): number {
  const l2 = (vx - wx) * (vx - wx) + (vy - wy) * (vy - wy);
  if (l2 === 0) return (px - vx) * (px - vx) + (py - wy) * (py - wy);
  let t = ((px - vx) * (wx - vx) + (py - vy) * (wy - wy)) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = vx + t * (wx - vx);
  const projY = vy + t * (wy - vy);
  return (px - projX) * (px - projX) + (py - projY) * (py - projY);
}

// Sort candidate features by screen proximity to the touch tap point
function sortFeaturesByProximity(
  features: MapGeoJSONFeature[],
  tapPoint: { x: number; y: number },
  map: Map
): MapGeoJSONFeature[] {
  if (features.length <= 1) return features;

  const scored = features.map((feat) => {
    let minDistSq = Infinity;
    const geom = feat.geometry;

    if (!geom) return { feat, dist: Infinity };

    if (geom.type === 'Point') {
      const screenPt = map.project(geom.coordinates as [number, number]);
      minDistSq = (tapPoint.x - screenPt.x) ** 2 + (tapPoint.y - screenPt.y) ** 2;
    } else if (geom.type === 'LineString') {
      const coords = geom.coordinates as [number, number][];
      for (let i = 0; i < coords.length - 1; i++) {
        const p1 = map.project(coords[i]);
        const p2 = map.project(coords[i + 1]);
        const d = distToSegmentSquared(tapPoint.x, tapPoint.y, p1.x, p1.y, p2.x, p2.y);
        if (d < minDistSq) minDistSq = d;
      }
    } else if (geom.type === 'MultiLineString') {
      const lines = geom.coordinates as [number, number][][];
      for (const line of lines) {
        for (let i = 0; i < line.length - 1; i++) {
          const p1 = map.project(line[i]);
          const p2 = map.project(line[i + 1]);
          const d = distToSegmentSquared(tapPoint.x, tapPoint.y, p1.x, p1.y, p2.x, p2.y);
          if (d < minDistSq) minDistSq = d;
        }
      }
    } else {
      minDistSq = 100;
    }

    return { feat, dist: minDistSq };
  });

  scored.sort((a, b) => a.dist - b.dist);
  return scored.map((s) => s.feat);
}

interface MapEngineProps {
  activeLayers: Set<ActiveLayer>;
  religionFilter: ReligionFilter;
  basemapStyle: BasemapStyle;
  is3D: boolean;
  terrainExaggeration: number;
  demographicsData: Record<string, DemographicRecord>;
  onSelectFeature: (info: SelectedFeatureInfo | null) => void;
  selectedFeature: SelectedFeatureInfo | null;
  searchTarget: SearchTarget | null;
  isElevationHighlight: boolean;
  selectedHistoricalPeriod?: HistoricalPeriodId;
  tradeCategories?: Set<TradeCategory>;
  environmentalPillars?: Set<EnvironmentalPillar>;
  comparisonConfig?: EnvironmentalComparisonConfig;
}

export const MapEngine: React.FC<MapEngineProps> = ({
  activeLayers,
  religionFilter,
  basemapStyle,
  is3D,
  terrainExaggeration,
  demographicsData,
  onSelectFeature,
  selectedFeature,
  searchTarget,
  isElevationHighlight,
  selectedHistoricalPeriod = 'maurya',
  tradeCategories,
  environmentalPillars,
  comparisonConfig
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const flowIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastHoverTsRef = useRef<number>(0);
  const lastHoverKeyRef = useRef<string>('');
  const hoverSupportedRef = useRef<boolean>(
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
  const [hoveredTooltip, setHoveredTooltip] = useState<{
    x: number;
    y: number;
    title: string;
    type: string;
    subtitle?: string;
    metricLabel?: string;
    metricValue?: string;
    source?: string;
  } | null>(null);

  // Basemap tiles generator
  const getBasemapTiles = (style: BasemapStyle) => {
    return APP_CONFIG.BASEMAPS[style] || APP_CONFIG.BASEMAPS.dark;
  };

  // Centralized, instant-response layer styling application
  const applyLayerStyles = useCallback((map: Map) => {
    if (!map) return;

    const setVis = (layerId: string, visible: boolean) => {
      try {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
        }
      } catch (err) {
        console.warn(`Layer visibility warning on ${layerId}:`, err);
      }
    };

    const isSoilActive = activeLayers.has('soils');
    const isDensityActive = activeLayers.has('pop_density');
    const isPopTotalActive = activeLayers.has('pop_total');
    const isReligionActive = activeLayers.has('religion');
    const isLiteracyActive = activeLayers.has('literacy');
    const isSexRatioActive = activeLayers.has('sex_ratio');

    const hasDemographicLayer = isDensityActive || isPopTotalActive || isReligionActive || isLiteracyActive || isSexRatioActive;
    const showDistricts = (activeLayers.has('political_districts') || hasDemographicLayer) && !isSoilActive;

    // 1. Soils Layer
    setVis('soils-fill', isSoilActive);

    // 2. State & District Fills
    setVis('states-fill', activeLayers.has('political_states') && !showDistricts && !isSoilActive);
    setVis('districts-fill', showDistricts);
    setVis('districts-line', activeLayers.has('political_districts') || hasDemographicLayer || isSoilActive);

    // 3. State Boundaries & Dedicated State Name Labels
    setVis('states-line', activeLayers.has('political_states'));
    setVis('states-glow', activeLayers.has('political_states'));
    setVis('states-label', activeLayers.has('state_labels'));

    // Urban Night Light Nodes (Only shown during demographic exploration to prevent map clutter)
    const showUrbanNodes = isDensityActive || isPopTotalActive;
    setVis('urban-nodes-glow', showUrbanNodes);
    setVis('urban-nodes-halo', showUrbanNodes);
    setVis('urban-nodes-core', showUrbanNodes);

    // 4. Physical Overlays
    setVis('rivers-core', activeLayers.has('rivers'));
    setVis('rivers-glow', activeLayers.has('rivers'));
    setVis('rivers-flow', activeLayers.has('rivers'));
    setVis('rivers-hit-target', activeLayers.has('rivers'));
    setVis('rivers-highlight', true);
    setVis('mountains-line', activeLayers.has('mountains'));
    setVis('mountains-glow', activeLayers.has('mountains'));
    setVis('mountains-hit-target', activeLayers.has('mountains'));
    setVis('mountains-highlight', true);

    // 5. Historical Atlas & Time Machine Layers
    const isHistoricalActive = activeLayers.has('historical_atlas');
    setVis('empires-fill', isHistoricalActive);
    setVis('empires-glow', isHistoricalActive);
    setVis('empires-border', isHistoricalActive);
    setVis('empires-capitals', isHistoricalActive);

    // 6. Archaeological Sites
    const isArchActive = activeLayers.has('archaeological_sites');
    setVis('archaeology-glow', isArchActive);
    setVis('archaeology-core', isArchActive);
    setVis('archaeology-inner-pip', isArchActive);
    setVis('archaeology-labels', isArchActive);

    // 7. Trade Routes & Connectivity
    const isTradeActive = activeLayers.has('trade_routes');
    const hasAnyTradeCategory = !tradeCategories || tradeCategories.size > 0;
    const effectiveTradeActive = isTradeActive && hasAnyTradeCategory;

    const cats = tradeCategories ? Array.from(tradeCategories) : [];
    const catCondition = cats.length > 0 
      ? ['any', ...cats.map(c => ['==', ['get', 'category'], c])]
      : ['==', ['get', 'category'], 'none'];

    if (map.getLayer('trade-glow')) {
      map.setFilter('trade-glow', ['all', ['!=', ['geometry-type'], 'Point'], catCondition] as any);
      map.setLayoutProperty('trade-glow', 'visibility', effectiveTradeActive ? 'visible' : 'none');
    }
    if (map.getLayer('trade-core')) {
      map.setFilter('trade-core', ['all', ['!=', ['geometry-type'], 'Point'], catCondition] as any);
      map.setLayoutProperty('trade-core', 'visibility', effectiveTradeActive ? 'visible' : 'none');
    }
    if (map.getLayer('trade-flow')) {
      map.setFilter('trade-flow', ['all', ['!=', ['geometry-type'], 'Point'], ['!=', ['get', 'category'], 'historical_railway'], catCondition] as any);
      map.setLayoutProperty('trade-flow', 'visibility', effectiveTradeActive ? 'visible' : 'none');
    }
    if (map.getLayer('trade-railways')) {
      const showRailways = effectiveTradeActive && (!tradeCategories || tradeCategories.has('historical_railway'));
      map.setLayoutProperty('trade-railways', 'visibility', showRailways ? 'visible' : 'none');
    }
    if (map.getLayer('trade-labels')) {
      map.setFilter('trade-labels', ['all', ['!=', ['geometry-type'], 'Point'], catCondition] as any);
      map.setLayoutProperty('trade-labels', 'visibility', effectiveTradeActive ? 'visible' : 'none');
    }
    if (map.getLayer('trade-hit-target')) {
      map.setFilter('trade-hit-target', ['all', ['!=', ['geometry-type'], 'Point'], catCondition] as any);
      map.setLayoutProperty('trade-hit-target', 'visibility', effectiveTradeActive ? 'visible' : 'none');
    }

    const showPorts = effectiveTradeActive && (!tradeCategories || tradeCategories.has('ancient_port'));
    setVis('trade-ports-halo', showPorts);
    setVis('trade-ports-core', showPorts);
    setVis('trade-ports-labels', showPorts);
    setVis('trade-ports-hit-target', showPorts);


    // 7.4 Environmental Change & Climate Explorer
    const isEnvActive = activeLayers.has('environmental_change');
    const hasAnyEnvPillar = !environmentalPillars || environmentalPillars.size > 0;
    const effectiveEnvActive = isEnvActive && hasAnyEnvPillar;
    const envPillarsArray = environmentalPillars ? Array.from(environmentalPillars) : [];
    const envPillarCondition = envPillarsArray.length > 0
      ? ['any', ...envPillarsArray.map(p => ['==', ['get', 'pillar'], p])]
      : ['==', ['get', 'pillar'], 'none'];

    const envPolyFilter = ['all', ['==', ['geometry-type'], 'Polygon'], envPillarCondition] as any;
    const envLineFilter = ['all', ['==', ['geometry-type'], 'LineString'], envPillarCondition] as any;
    const envPointFilter = ['all', ['==', ['geometry-type'], 'Point'], envPillarCondition] as any;

    ['env-polygons-glow', 'env-polygons-fill', 'env-polygons-border', 'env-polygons-labels', 'env-polygons-hit-target'].forEach(id => {
      if (map.getLayer(id)) {
        map.setFilter(id, envPolyFilter);
        map.setLayoutProperty(id, 'visibility', effectiveEnvActive ? 'visible' : 'none');
      }
    });

    ['env-lines-glow', 'env-lines-core', 'env-lines-flow', 'env-lines-labels', 'env-lines-hit-target'].forEach(id => {
      if (map.getLayer(id)) {
        map.setFilter(id, envLineFilter);
        map.setLayoutProperty(id, 'visibility', effectiveEnvActive ? 'visible' : 'none');
      }
    });

    ['env-points-halo', 'env-points-core', 'env-points-labels', 'env-points-hit-target'].forEach(id => {
      if (map.getLayer(id)) {
        map.setFilter(id, envPointFilter);
        map.setLayoutProperty(id, 'visibility', effectiveEnvActive ? 'visible' : 'none');
      }
    });

    // Environmental Highlight Layers visibility and filter clearance on untick
    ['env-highlight-fill', 'env-highlight-border', 'env-highlight-line', 'env-highlight-point'].forEach(id => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', effectiveEnvActive ? 'visible' : 'none');
        if (!effectiveEnvActive) {
          map.setFilter(id, ['==', ['id'], '']);
        }
      }
    });

    if (!effectiveEnvActive) {
      const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
      if (src && typeof src.setData === 'function') {
        src.setData({ type: 'FeatureCollection', features: [] });
      }
    }

    // Dynamic Environmental Change Color & Severity Styling based on Delta vs Baseline Mode
    const activeEnvColorExpr = comparisonConfig?.isDeltaMode
      ? [
          'match',
          ['get', 'severity_code'],
          'severe', '#ef4444',
          'high', '#f97316',
          'moderate', '#eab308',
          'stable', '#10b981',
          '#ef4444'
        ] as any
      : [
          'match',
          ['get', 'pillar'],
          'forest_change', '#10b981',
          'glacier_retreat', '#06b6d4',
          'urban_expansion', '#f97316',
          'coastal_erosion', '#ef4444',
          'wetland_change', '#3b82f6',
          'desertification', '#eab308',
          'groundwater_stress', '#a855f7',
          'river_avulsion', '#14b8a6',
          '#10b981'
        ] as any;

    if (map.getLayer('env-polygons-fill')) {
      map.setPaintProperty('env-polygons-fill', 'fill-color', activeEnvColorExpr);
      map.setPaintProperty('env-polygons-fill', 'fill-opacity', comparisonConfig?.isDeltaMode ? 0.55 : 0.40);
    }
    if (map.getLayer('env-polygons-border')) {
      map.setPaintProperty('env-polygons-border', 'line-color', activeEnvColorExpr);
    }
    if (map.getLayer('env-polygons-glow')) {
      map.setPaintProperty('env-polygons-glow', 'line-color', activeEnvColorExpr);
    }
    if (map.getLayer('env-lines-core')) {
      map.setPaintProperty('env-lines-core', 'line-color', activeEnvColorExpr);
    }
    if (map.getLayer('env-lines-glow')) {
      map.setPaintProperty('env-lines-glow', 'line-color', activeEnvColorExpr);
    }
    if (map.getLayer('env-points-core')) {
      map.setPaintProperty('env-points-core', 'circle-color', activeEnvColorExpr);
    }
    if (map.getLayer('env-points-halo')) {
      map.setPaintProperty('env-points-halo', 'circle-color', activeEnvColorExpr);
    }

    // 7.5 National Highways & Expressways
    const isRoadsActive = activeLayers.has('roads');
    setVis('roads-casing', isRoadsActive);
    setVis('roads-core', isRoadsActive);
    setVis('roads-label', isRoadsActive);
    setVis('roads-hit-target', isRoadsActive);
    setVis('roads-highlight', true);

    // 8. Disaster & Seismic Hazards
    const isDisasterActive = activeLayers.has('disaster_seismic');
    setVis('seismic-zones-fill', isDisasterActive);
    setVis('seismic-zones-line', isDisasterActive);
    setVis('earthquake-epicenter-glow', isDisasterActive);
    setVis('earthquake-epicenter-core', isDisasterActive);
    setVis('earthquake-epicenter-labels', isDisasterActive);

    // 9. Selection Highlights (always visible; controlled by filters, not layer toggles)
    setVis('states-highlight', true);
    setVis('states-highlight-fill', true);
    setVis('districts-highlight-line', true);
    setVis('districts-highlight-fill', true);

    // 10. Dynamic Demographic Choropleth Expression
    if (map.getLayer('districts-fill')) {
      if (isDensityActive) {
        map.setPaintProperty('districts-fill', 'fill-color', [
          'interpolate', ['linear'], ['coalesce', ['get', 'density_2011'], 350],
          30, '#fef08a',       // Extremely low (Ladakh, Arunachal, desert)
          120, '#a3e635',      // Low (Himalayan / plateau)
          350, '#22c55e',      // National average (~382)
          650, '#f59e0b',      // High (Peninsular / fertile plains)
          1100, '#ea580c',     // Very high (UP, Bihar, WB)
          2500, '#dc2626',     // High density urban / delta
          10000, '#7f1d1d'     // Megacity / Delhi / Mumbai
        ]);
        map.setPaintProperty('districts-fill', 'fill-opacity', 0.72);
      } else if (isPopTotalActive) {
        map.setPaintProperty('districts-fill', 'fill-color', [
          'interpolate', ['linear'], ['coalesce', ['get', 'population_2011'], 800000],
          50000, '#cffafe',
          500000, '#38bdf8',
          1500000, '#2563eb',
          4000000, '#1d4ed8',
          10000000, '#020617'
        ]);
        map.setPaintProperty('districts-fill', 'fill-opacity', 0.7);
      } else if (isReligionActive) {
        const religionPalettes: Record<ReligionFilter, { low: string; mid: string; high: string }> = {
          hindu: { low: '#ffedd5', mid: '#f97316', high: '#9a3412' },       // Saffron / Amber
          muslim: { low: '#ecfdf5', mid: '#10b981', high: '#064e3b' },      // Emerald / Forest Green
          christian: { low: '#eff6ff', mid: '#3b82f6', high: '#1e3a8a' },   // Royal Blue
          sikh: { low: '#fef3c7', mid: '#f59e0b', high: '#78350f' },        // Sacred Gold / Amber
          buddhist: { low: '#fdf4ff', mid: '#a855f7', high: '#581c87' },    // Royal Purple / Dharma
          jain: { low: '#fff1f2', mid: '#f43f5e', high: '#881337' }         // Ahimsa Rose / Ruby
        };
        const palette = religionPalettes[religionFilter] || religionPalettes.hindu;
        map.setPaintProperty('districts-fill', 'fill-color', [
          'interpolate', ['linear'], ['coalesce', ['get', `${religionFilter}_pct`], 5],
          2, palette.low,
          25, palette.mid,
          85, palette.high
        ]);
        map.setPaintProperty('districts-fill', 'fill-opacity', 0.75);
      } else if (isLiteracyActive) {
        map.setPaintProperty('districts-fill', 'fill-color', [
          'interpolate', ['linear'], ['coalesce', ['get', 'literacy_rate'], 72],
          50, '#ef4444',     // Critical (<55%)
          65, '#f59e0b',     // Moderate (65%)
          78, '#10b981',     // High (78%)
          95, '#059669'      // Very high (>90%)
        ]);
        map.setPaintProperty('districts-fill', 'fill-opacity', 0.7);
      } else if (isSexRatioActive) {
        map.setPaintProperty('districts-fill', 'fill-color', [
          'interpolate', ['linear'], ['coalesce', ['get', 'sex_ratio'], 940],
          860, '#f43f5e',    // Disproportionate male (<880)
          940, '#a855f7',    // National baseline (~940)
          1040, '#06b6d4'    // Higher female ratio (>1000, Kerala/Coastal)
        ]);
        map.setPaintProperty('districts-fill', 'fill-opacity', 0.7);
      } else {
        map.setPaintProperty('districts-fill', 'fill-color', '#0f172a');
        map.setPaintProperty('districts-fill', 'fill-opacity', activeLayers.has('political_districts') ? 0.35 : 0);
      }
    }

    // Force immediate GPU redraw for zero-latency toggle responsiveness
    try {
      map.triggerRepaint();
    } catch {
      // ignore
    }
  }, [activeLayers, religionFilter, tradeCategories, environmentalPillars, comparisonConfig]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'base-raster': {
            type: 'raster',
            tiles: getBasemapTiles(basemapStyle),
            tileSize: 256,
            maxzoom: 18,
            attribution: '© ESRI | © OpenStreetMap contributors | Government of India Open Data'
          },
          'terrarium-dem': {
            type: 'raster-dem',
            tiles: [APP_CONFIG.TERRAIN_DEM_URL],
            encoding: 'terrarium',
            tileSize: 256,
            maxzoom: 12
          }
        },
        layers: [
          {
            id: 'base-raster-layer',
            type: 'raster',
            source: 'base-raster',
            paint: {
              'raster-opacity': 1.0,
              'raster-contrast': 0.15,
              'raster-brightness-min': 0.05
            }
          },
          {
            id: 'hillshading-layer',
            type: 'hillshade',
            source: 'terrarium-dem',
            paint: {
              'hillshade-exaggeration': 0.35,
              'hillshade-shadow-color': '#020617',
              'hillshade-highlight-color': '#38bdf8',
              'hillshade-accent-color': '#0284c7'
            }
          }
        ]
      },
      center: [78.9629, 22.5937], // Center of India
      zoom: 4.8,
      pitch: is3D ? 52 : 0,
      bearing: is3D ? -8 : 0,
      maxPitch: 85,
      attributionControl: false,
      clickTolerance: 18 // Generous tap movement tolerance for touchscreens (prevents accidental tap-drag cancellation on mobile)
    });

    map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.on('load', () => {
      // 1. Enable 3D Terrain
      try {
        if (is3D) {
          map.setTerrain({
            source: 'terrarium-dem',
            exaggeration: terrainExaggeration
          });
        }
      } catch (err) {
        console.warn('Terrain initialization warning:', err);
      }

      // 2. Load Core GeoJSON Sources
      map.addSource('india-states', {
        type: 'geojson',
        data: '/data/india_states.geojson'
      });

      map.addSource('state-centroids', {
        type: 'geojson',
        data: '/data/state_centroids.geojson'
      });

      map.addSource('india-districts', {
        type: 'geojson',
        data: '/data/india_districts.geojson'
      });

      map.addSource('india-rivers', {
        type: 'geojson',
        data: '/data/india_rivers.geojson'
      });

      map.addSource('india-soils', {
        type: 'geojson',
        data: '/data/india_soils.geojson'
      });

      map.addSource('india-mountains', {
        type: 'geojson',
        data: '/data/india_mountains.geojson'
      });

      map.addSource('india-elevation-points', {
        type: 'geojson',
        data: '/data/india_elevation_points.geojson'
      });

      map.addSource('india-urban-nodes', {
        type: 'geojson',
        data: '/data/india_urban_nodes.geojson'
      });

      // 3. Load Atlas & Time Machine Sources
      map.addSource('historical-empires', {
        type: 'geojson',
        data: '/data/historical_empires.geojson'
      });

      map.addSource('archaeological-sites', {
        type: 'geojson',
        data: '/data/archaeological_sites.geojson'
      });

      map.addSource('historical-trade-routes', {
        type: 'geojson',
        data: '/data/historical_trade_routes.geojson'
      });


      map.addSource('environmental-change', {
        type: 'geojson',
        data: '/data/environmental_change.geojson'
      });

      map.addSource('india-highways', {
        type: 'geojson',
        data: '/data/india_highways.geojson'
      });

      map.addSource('disaster-seismic-zones', {
        type: 'geojson',
        data: '/data/disaster_seismic_zones.geojson'
      });

      map.addSource('search-highlight', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // Register natural faceted mountain summit peak icon
      try {
        const peakCanvas = document.createElement('canvas');
        peakCanvas.width = 36;
        peakCanvas.height = 36;
        const pCtx = peakCanvas.getContext('2d');
        if (pCtx) {
          const cx = 18;
          const topY = 4;
          const baseY = 30;
          const halfW = 14;

          // 1. Soft natural ground shadow
          pCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          pCtx.beginPath();
          pCtx.ellipse(cx, baseY + 1, halfW + 1, 3, 0, 0, Math.PI * 2);
          pCtx.fill();

          // 2. Left slope (Sunward facet - golden ivory sunlight)
          pCtx.fillStyle = '#fffbeb';
          pCtx.beginPath();
          pCtx.moveTo(cx, topY);
          pCtx.lineTo(cx - halfW, baseY);
          pCtx.lineTo(cx, baseY - 2);
          pCtx.closePath();
          pCtx.fill();

          // 3. Right slope (Shaded facet - rich warm copper terracotta)
          pCtx.fillStyle = '#c2410c';
          pCtx.beginPath();
          pCtx.moveTo(cx, topY);
          pCtx.lineTo(cx + halfW, baseY);
          pCtx.lineTo(cx, baseY - 2);
          pCtx.closePath();
          pCtx.fill();

          // 4. Clean summit ridge line
          pCtx.strokeStyle = '#ffffff';
          pCtx.lineWidth = 1.2;
          pCtx.beginPath();
          pCtx.moveTo(cx, topY);
          pCtx.lineTo(cx, baseY - 2);
          pCtx.stroke();

          // 5. Alpine snowcap highlight at the peak apex
          pCtx.fillStyle = '#ffffff';
          pCtx.beginPath();
          pCtx.moveTo(cx, topY);
          pCtx.lineTo(cx - 5, topY + 9);
          pCtx.lineTo(cx + 5, topY + 9);
          pCtx.closePath();
          pCtx.fill();

          const imgData = pCtx.getImageData(0, 0, 36, 36);
          if (!map.hasImage('natural-summit-peak')) {
            map.addImage('natural-summit-peak', imgData);
          }
        }
      } catch (e) {
        console.warn('Natural summit icon warning:', e);
      }

      // ========================================================
      // BASE VECTOR LAYERS
      // ========================================================

      // State Base Fill Layer
      map.addLayer({
        id: 'states-fill',
        type: 'fill',
        source: 'india-states',
        paint: {
          'fill-color': '#0f172a',
          'fill-opacity': 0.2
        }
      });

      // District Fill & Thematic Choropleths
      map.addLayer({
        id: 'districts-fill',
        type: 'fill',
        source: 'india-districts',
        paint: {
          'fill-color': '#0f172a',
          'fill-opacity': 0.35
        }
      });

      // Soil Classification Layer (Layered ABOVE districts-fill so it is never masked)
      map.addLayer({
        id: 'soils-fill',
        type: 'fill',
        source: 'india-soils',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.55,
          'fill-outline-color': '#ffffff'
        }
      });

      // District Administrative Lines
      map.addLayer({
        id: 'districts-line',
        type: 'line',
        source: 'india-districts',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 0.6,
          'line-opacity': 0.35
        }
      });

      // District Selection Highlights
      map.addLayer({
        id: 'districts-highlight-fill',
        type: 'fill',
        source: 'india-districts',
        paint: {
          'fill-color': '#C9A227',
          'fill-opacity': 0.35
        },
        filter: ['==', 'shapeName', '']
      });

      map.addLayer({
        id: 'districts-highlight-line',
        type: 'line',
        source: 'india-districts',
        paint: {
          'line-color': '#C9A227',
          'line-width': 3,
          'line-opacity': 1
        },
        filter: ['==', 'shapeName', '']
      });

      // State Boundaries & Atmospheric Glow
      map.addLayer({
        id: 'states-glow',
        type: 'line',
        source: 'india-states',
        paint: {
          'line-color': '#00f0ff',
          'line-width': 7.5,
          'line-opacity': 0.65,
          'line-blur': 5
        }
      });

      map.addLayer({
        id: 'states-line',
        type: 'line',
        source: 'india-states',
        paint: {
          'line-color': '#38bdf8',
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            4, 1.4,
            7, 2.4,
            10, 3.8
          ],
          'line-opacity': 0.95
        }
      });

      // Urban Night Light Nodes (only displayed during demographic layer exploration)
      map.addLayer({
        id: 'urban-nodes-glow',
        type: 'circle',
        source: 'india-urban-nodes',
        layout: {
          visibility: 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            3, ['*', ['get', 'radius'], 1.4],
            6, ['*', ['get', 'radius'], 2.2],
            10, ['*', ['get', 'radius'], 3.5]
          ],
          'circle-color': ['get', 'color'],
          'circle-blur': 1.1,
          'circle-opacity': 0.88
        }
      });

      map.addLayer({
        id: 'urban-nodes-halo',
        type: 'circle',
        source: 'india-urban-nodes',
        layout: {
          visibility: 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            3, ['get', 'radius'],
            6, ['*', ['get', 'radius'], 1.6],
            10, ['*', ['get', 'radius'], 2.4]
          ],
          'circle-color': ['get', 'color'],
          'circle-blur': 0.35,
          'circle-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'urban-nodes-core',
        type: 'circle',
        source: 'india-urban-nodes',
        layout: {
          visibility: 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            3, 1.8,
            6, 2.8,
            10, 4.2
          ],
          'circle-color': '#ffffff',
          'circle-opacity': 1.0
        }
      });

      // State Selection Highlights
      map.addLayer({
        id: 'states-highlight-fill',
        type: 'fill',
        source: 'india-states',
        paint: {
          'fill-color': '#C9A227',
          'fill-opacity': 0.22
        },
        filter: ['==', 'shapeName', '']
      });

      map.addLayer({
        id: 'states-highlight',
        type: 'line',
        source: 'india-states',
        paint: {
          'line-color': '#C9A227',
          'line-width': 4,
          'line-opacity': 1,
          'line-blur': 1
        },
        filter: ['==', 'shapeName', '']
      });

      // Mountain Ranges
      map.addLayer({
        id: 'mountains-glow',
        type: 'line',
        source: 'india-mountains',
        paint: {
          'line-color': '#f59e0b',
          'line-width': 8,
          'line-opacity': 0.35,
          'line-blur': 6
        }
      });

      map.addLayer({
        id: 'mountains-line',
        type: 'line',
        source: 'india-mountains',
        paint: {
          'line-color': '#fbbf24',
          'line-width': 3.5,
          'line-opacity': 0.9,
          'line-dasharray': [3, 1]
        }
      });

      // Mountains Hit Target (Invisible wide interactive hit-target for effortless mobile finger tapping)
      map.addLayer({
        id: 'mountains-hit-target',
        type: 'line',
        source: 'india-mountains',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('mountains') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 32,
          'line-opacity': 0.001
        }
      });

      map.addLayer({
        id: 'mountains-highlight',
        type: 'line',
        source: 'india-mountains',
        paint: {
          'line-color': '#10b981',
          'line-width': 5,
          'line-opacity': 1
        },
        filter: ['==', 'name', '']
      });

      // River Systems & Flow
      map.addLayer({
        id: 'rivers-glow',
        type: 'line',
        source: 'india-rivers',
        paint: {
          'line-color': '#06b6d4',
          'line-width': 6,
          'line-opacity': 0.45,
          'line-blur': 4
        }
      });

      map.addLayer({
        id: 'rivers-core',
        type: 'line',
        source: 'india-rivers',
        paint: {
          'line-color': '#38bdf8',
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            4, 1.8,
            8, 3.2
          ],
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'rivers-flow',
        type: 'line',
        source: 'india-rivers',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.6,
          'line-opacity': 0.75,
          'line-dasharray': [0, 4, 3]
        }
      });

      // Rivers Hit Target (Invisible wide interactive hit-target for mobile touchscreens)
      map.addLayer({
        id: 'rivers-hit-target',
        type: 'line',
        source: 'india-rivers',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('rivers') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 30,
          'line-opacity': 0.001
        }
      });

      map.addLayer({
        id: 'rivers-highlight',
        type: 'line',
        source: 'india-rivers',
        paint: {
          'line-color': '#22d3ee',
          'line-width': 5,
          'line-opacity': 1
        },
        filter: ['==', 'clean_name', '']
      });

      // ========================================================
      // 1. HISTORICAL ATLAS & TIME MACHINE LAYERS
      // ========================================================

      map.addLayer({
        id: 'empires-fill',
        type: 'fill',
        source: 'historical-empires',
        layout: {
          visibility: activeLayers.has('historical_atlas') ? 'visible' : 'none'
        },
        filter: ['==', 'id', selectedHistoricalPeriod],
        paint: {
          'fill-color': ['coalesce', ['get', 'color'], '#c2410c'],
          'fill-opacity': 0.42
        }
      });

      map.addLayer({
        id: 'empires-glow',
        type: 'line',
        source: 'historical-empires',
        layout: {
          visibility: activeLayers.has('historical_atlas') ? 'visible' : 'none'
        },
        filter: ['==', 'id', selectedHistoricalPeriod],
        paint: {
          'line-color': ['coalesce', ['get', 'color'], '#c2410c'],
          'line-width': 8,
          'line-opacity': 0.5,
          'line-blur': 5
        }
      });

      map.addLayer({
        id: 'empires-border',
        type: 'line',
        source: 'historical-empires',
        layout: {
          visibility: activeLayers.has('historical_atlas') ? 'visible' : 'none'
        },
        filter: ['==', 'id', selectedHistoricalPeriod],
        paint: {
          'line-color': '#ffffff',
          'line-width': 2.8,
          'line-dasharray': [4, 2],
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'empires-capitals',
        type: 'symbol',
        source: 'historical-empires',
        layout: {
          'text-field': ['concat', '🏛️ ', ['get', 'name'], '\nCapital: ', ['get', 'capital']],
          'text-size': 13,
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.05,
          'text-allow-overlap': false,
          visibility: activeLayers.has('historical_atlas') ? 'visible' : 'none'
        },
        filter: ['==', 'id', selectedHistoricalPeriod],
        paint: {
          'text-color': '#fffbeb',
          'text-halo-color': '#0f172a',
          'text-halo-width': 2.5
        }
      });

      // ========================================================
      // 2. ARCHAEOLOGICAL SITES LAYERS
      // ========================================================

      // Color expression dynamically supporting explicit 'color' property or category keys
      const siteColorExpr: any = [
        'coalesce',
        ['get', 'color'],
        [
          'match',
          ['get', 'category'],
          'ivc_site', '#14b8a6',                      // Teal (Indus Valley Settlements)
          'ancient_university', '#f59e0b',            // Amber (Ancient Universities)
          'buddhist_monument', '#8b5cf6',             // Purple (Buddhist Monasteries)
          'rock_cut_monument', '#f43f5e',             // Rose (Rock-Cut Temples)
          'medieval_monument', '#f43f5e',             // Rose (Rock-Cut Temples)
          'ancient_temple', '#f43f5e',                // Rose (Rock-Cut Temples)
          'ancient_port', '#06b6d4',                  // Cyan (Ancient Ports)
          '#14b8a6'                                   // Default Teal
        ]
      ];

      // 1. Vibrant outer atmospheric glow matching category color
      map.addLayer({
        id: 'archaeology-glow',
        type: 'circle',
        source: 'archaeological-sites',
        layout: {
          visibility: activeLayers.has('archaeological_sites') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 15,
            7, 22,
            10, 28
          ],
          'circle-color': siteColorExpr,
          'circle-blur': 0.75,
          'circle-opacity': 0.75
        }
      });

      // 2. Main Solid Category Dot with crisp white outer ring
      map.addLayer({
        id: 'archaeology-core',
        type: 'circle',
        source: 'archaeological-sites',
        layout: {
          visibility: activeLayers.has('archaeological_sites') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 7.5,
            7, 9.5,
            10, 11.5
          ],
          'circle-color': siteColorExpr,
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 1.0
        }
      });

      // 3. Crisp inner luminous pinpoint for tactile cartographic clarity
      map.addLayer({
        id: 'archaeology-inner-pip',
        type: 'circle',
        source: 'archaeological-sites',
        layout: {
          visibility: activeLayers.has('archaeological_sites') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 2.2,
            7, 3.0,
            10, 3.8
          ],
          'circle-color': '#ffffff',
          'circle-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'archaeology-labels',
        type: 'symbol',
        source: 'archaeological-sites',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            4, 10.5,
            7, 12,
            10, 13.5
          ],
          'text-offset': [0, 1.4],
          'text-anchor': 'top',
          'text-allow-overlap': false,
          visibility: activeLayers.has('archaeological_sites') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#020617',
          'text-halo-width': 2.5
        }
      });

      // ========================================================
      // 3. HISTORICAL TRADE ROUTES & CONNECTIVITY LAYERS
      // ========================================================

      map.addLayer({
        id: 'trade-glow',
        type: 'line',
        source: 'historical-trade-routes',
        filter: ['!=', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'line-color': ['coalesce', ['get', 'color'], '#38bdf8'],
          'line-width': 7,
          'line-opacity': 0.45,
          'line-blur': 4
        }
      });

      map.addLayer({
        id: 'trade-core',
        type: 'line',
        source: 'historical-trade-routes',
        filter: ['!=', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'line-color': ['coalesce', ['get', 'color'], '#38bdf8'],
          'line-width': 3,
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'trade-flow',
        type: 'line',
        source: 'historical-trade-routes',
        filter: ['all', ['!=', ['geometry-type'], 'Point'], ['!=', ['get', 'category'], 'historical_railway']],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.8,
          'line-dasharray': [2, 4],
          'line-opacity': 0.85
        }
      });

      // Special railway track dash layer for historical railways
      map.addLayer({
        id: 'trade-railways',
        type: 'line',
        source: 'historical-trade-routes',
        filter: ['all', ['!=', ['geometry-type'], 'Point'], ['==', ['get', 'category'], 'historical_railway']],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 2.2,
          'line-dasharray': [2, 3],
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'trade-labels',
        type: 'symbol',
        source: 'historical-trade-routes',
        filter: ['!=', ['geometry-type'], 'Point'],
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-letter-spacing': 0.08,
          'text-allow-overlap': false,
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      // Trade Routes Hit Target (Invisible wide interactive hit-target for mobile touchscreens)
      map.addLayer({
        id: 'trade-hit-target',
        type: 'line',
        source: 'historical-trade-routes',
        filter: ['!=', ['geometry-type'], 'Point'],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 32,
          'line-opacity': 0.001
        }
      });

      // ========================================================
      // 3.2 ANCIENT PORTS & EMPORIA (POINT LAYERS)
      // ========================================================

      map.addLayer({
        id: 'trade-ports-halo',
        type: 'circle',
        source: 'historical-trade-routes',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 11,
          'circle-color': 'rgba(251, 191, 36, 0.22)',
          'circle-stroke-color': '#fbbf24',
          'circle-stroke-width': 1.5
        }
      });

      map.addLayer({
        id: 'trade-ports-core',
        type: 'circle',
        source: 'historical-trade-routes',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 6,
          'circle-color': '#fbbf24',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.8
        }
      });

      map.addLayer({
        id: 'trade-ports-labels',
        type: 'symbol',
        source: 'historical-trade-routes',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-offset': [0, 1.4],
          'text-anchor': 'top',
          'text-allow-overlap': false,
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#fef08a',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      map.addLayer({
        id: 'trade-ports-hit-target',
        type: 'circle',
        source: 'historical-trade-routes',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 32,
          'circle-opacity': 0.001
        }
      });


      // ========================================================
      // 3.4 ENVIRONMENTAL CHANGE & CLIMATE EXPLORER LAYERS
      // ========================================================

      // Dynamic color expression based on delta vs normal thematic mode
      const envColorExpr: any = [
        'match',
        ['get', 'pillar'],
        'forest_change', '#10b981',
        'glacier_retreat', '#06b6d4',
        'urban_expansion', '#f97316',
        'coastal_erosion', '#ef4444',
        'wetland_change', '#3b82f6',
        'desertification', '#eab308',
        'groundwater_stress', '#a855f7',
        'river_avulsion', '#14b8a6',
        '#10b981'
      ];

      // Polygons (Forests, Urban Sprawl, Wetlands, Desertification, Groundwater)
      map.addLayer({
        id: 'env-polygons-glow',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Polygon'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'line-color': envColorExpr,
          'line-width': 5,
          'line-opacity': 0.5,
          'line-blur': 3
        }
      });

      map.addLayer({
        id: 'env-polygons-fill',
        type: 'fill',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Polygon'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'fill-color': envColorExpr,
          'fill-opacity': 0.40
        }
      });

      map.addLayer({
        id: 'env-polygons-border',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Polygon'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'line-color': envColorExpr,
          'line-width': 2.0,
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'env-polygons-labels',
        type: 'symbol',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Polygon'],
        layout: {
          'text-field': [
            'concat',
            ['get', 'name'],
            '\nΔ ',
            ['coalesce', ['get', 'delta_text'], ''],
            ' (',
            ['coalesce', ['get', 'change_rate_display'], ''],
            ')'
          ],
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            4, 9.5,
            7, 11.5,
            10, 13.5
          ],
          'text-anchor': 'center',
          'text-allow-overlap': false,
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#020617',
          'text-halo-width': 2.5
        }
      });

      map.addLayer({
        id: 'env-polygons-hit-target',
        type: 'fill',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Polygon'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'fill-color': '#000000',
          'fill-opacity': 0.001
        }
      });

      // Lines (Shorelines, River Avulsion Channels)
      map.addLayer({
        id: 'env-lines-glow',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'line-color': envColorExpr,
          'line-width': 7,
          'line-opacity': 0.45,
          'line-blur': 4
        }
      });

      map.addLayer({
        id: 'env-lines-core',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'line-color': envColorExpr,
          'line-width': 3.5,
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'env-lines-flow',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.6,
          'line-dasharray': [2, 4],
          'line-opacity': 0.85
        }
      });

      map.addLayer({
        id: 'env-lines-labels',
        type: 'symbol',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-letter-spacing': 0.08,
          'text-allow-overlap': false,
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      // 32px Wide Line Hit Target for 1-Tap Mobile Touch
      map.addLayer({
        id: 'env-lines-hit-target',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 32,
          'line-opacity': 0.001
        }
      });

      // Points (Glacier snouts, Urban centroids, Hotspot spots)
      map.addLayer({
        id: 'env-points-halo',
        type: 'circle',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 13,
          'circle-color': 'rgba(16, 185, 129, 0.22)',
          'circle-stroke-color': envColorExpr,
          'circle-stroke-width': 1.5
        }
      });

      map.addLayer({
        id: 'env-points-core',
        type: 'circle',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 6.5,
          'circle-color': envColorExpr,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2.0
        }
      });

      map.addLayer({
        id: 'env-points-labels',
        type: 'symbol',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11.5,
          'text-offset': [0, 1.4],
          'text-anchor': 'top',
          'text-allow-overlap': false,
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#020617',
          'text-halo-width': 2.5
        }
      });

      // 32px Radius Circle Hit Target for 1-Tap Mobile Touch
      map.addLayer({
        id: 'env-points-hit-target',
        type: 'circle',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 32,
          'circle-opacity': 0.001
        }
      });

      // Highlight Layers for Selected Environmental Feature
      map.addLayer({
        id: 'env-highlight-fill',
        type: 'fill',
        source: 'environmental-change',
        filter: ['==', ['id'], ''],
        paint: {
          'fill-color': '#fbbf24',
          'fill-opacity': 0.35
        }
      });

      map.addLayer({
        id: 'env-highlight-border',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['id'], ''],
        paint: {
          'line-color': '#fbbf24',
          'line-width': 4.0,
          'line-opacity': 1.0
        }
      });

      map.addLayer({
        id: 'env-highlight-line',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['id'], ''],
        paint: {
          'line-color': '#fbbf24',
          'line-width': 5.5,
          'line-opacity': 1.0
        }
      });

      map.addLayer({
        id: 'env-highlight-point',
        type: 'circle',
        source: 'environmental-change',
        filter: ['==', ['id'], ''],
        paint: {
          'circle-radius': 14,
          'circle-color': 'rgba(251, 191, 36, 0.35)',
          'circle-stroke-color': '#fbbf24',
          'circle-stroke-width': 3.0
        }
      });

      // ========================================================
      // 3.5 NATIONAL HIGHWAYS, EXPRESSWAYS & ROAD CORRIDORS
      // ========================================================

      map.addLayer({
        id: 'roads-casing',
        type: 'line',
        source: 'india-highways',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('roads') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#0b1220',
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            4, 2.6,
            7, 4.2,
            10, 6.5
          ],
          'line-opacity': 0.9
        }
      });

      map.addLayer({
        id: 'roads-core',
        type: 'line',
        source: 'india-highways',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('roads') ? 'visible' : 'none'
        },
        paint: {
          'line-color': ['coalesce', ['get', 'color'], '#f59e0b'],
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            4, 1.5,
            7, 2.5,
            10, 3.6
          ],
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'roads-label',
        type: 'symbol',
        source: 'india-highways',
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'code'],
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            4, 9,
            7, 10.5,
            10, 12
          ],
          'text-letter-spacing': 0.05,
          'text-allow-overlap': false,
          'text-optional': true,
          visibility: activeLayers.has('roads') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      // National Highways & Expressways Hit Target (Invisible wide hit-target for effortless single-tap selection on mobile)
      map.addLayer({
        id: 'roads-hit-target',
        type: 'line',
        source: 'india-highways',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('roads') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 32,
          'line-opacity': 0.001
        }
      });

      map.addLayer({
        id: 'roads-highlight',
        type: 'line',
        source: 'india-highways',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 6,
          'line-opacity': 1,
          'line-blur': 0.5
        },
        filter: ['==', 'code', '']
      });

      // ========================================================
      // 4. DISASTER & SEISMIC RISK LAYERS
      // ========================================================

      map.addLayer({
        id: 'seismic-zones-fill',
        type: 'fill',
        source: 'disaster-seismic-zones',
        filter: ['==', '$type', 'Polygon'],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'fill-color': [
            'match', ['get', 'zone_code'],
            'Zone V', '#ef4444',
            'Zone IV', '#f97316',
            '#eab308'
          ],
          'fill-opacity': 0.38
        }
      });

      map.addLayer({
        id: 'seismic-zones-line',
        type: 'line',
        source: 'disaster-seismic-zones',
        filter: ['==', '$type', 'Polygon'],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': [
            'match', ['get', 'zone_code'],
            'Zone V', '#ef4444',
            'Zone IV', '#f97316',
            '#eab308'
          ],
          'line-width': 2.2,
          'line-opacity': 0.85
        }
      });

      map.addLayer({
        id: 'earthquake-epicenter-glow',
        type: 'circle',
        source: 'disaster-seismic-zones',
        filter: ['==', '$type', 'Point'],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 16,
          'circle-color': '#ef4444',
          'circle-blur': 0.9,
          'circle-opacity': 0.75
        }
      });

      map.addLayer({
        id: 'earthquake-epicenter-core',
        type: 'circle',
        source: 'disaster-seismic-zones',
        filter: ['==', '$type', 'Point'],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 6,
          'circle-color': '#ffffff',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#b91c1c'
        }
      });

      map.addLayer({
        id: 'earthquake-epicenter-labels',
        type: 'symbol',
        source: 'disaster-seismic-zones',
        filter: ['==', '$type', 'Point'],
        layout: {
          'text-field': ['concat', ['to-string', ['get', 'year']], ' ', ['get', 'name'], ' (M', ['to-string', ['get', 'magnitude_mw']], ')'],
          'text-size': 10.5,
          'text-offset': [0, -1.3],
          'text-anchor': 'bottom',
          'text-allow-overlap': false,
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#fecdd3',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      // ========================================================
      // TYPOGRAPHY & ELEVATION HIGHLIGHTS
      // ========================================================

      map.addLayer({
        id: 'states-label',
        type: 'symbol',
        source: 'state-centroids',
        layout: {
          'text-field': ['get', 'shapeName'],
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            4, 9,
            6, 12,
            9, 16
          ],
          'text-letter-spacing': 0.08,
          'text-max-width': 8,
          'text-transform': 'uppercase',
          'text-allow-overlap': false
        },
        paint: {
          'text-color': '#f1f5f9',
          'text-halo-color': '#020617',
          'text-halo-width': 2,
          'text-halo-blur': 1,
          'text-opacity': 0.88
        }
      });

      // Pan-India Elevation Highlight: Natural Soft Hypsometric Terrain Tint
      map.addLayer({
        id: 'elevation-heatmap',
        type: 'heatmap',
        source: 'india-elevation-points',
        layout: {
          visibility: isElevationHighlight ? 'visible' : 'none'
        },
        paint: {
          'heatmap-weight': [
            'interpolate', ['linear'], ['get', 'elevation_m'],
            0, 0.05,
            500, 0.15,
            1500, 0.35,
            2700, 0.65,
            7000, 0.95,
            8586, 1.2
          ],
          'heatmap-intensity': [
            'interpolate', ['linear'], ['zoom'],
            4, 1.0,
            7, 1.8
          ],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',
            0.15, 'rgba(58, 146, 155, 0.18)',   // Turquoise coastal lowlands
            0.35, 'rgba(164, 213, 178, 0.28)',  // Sage alluvial plains
            0.55, 'rgba(217, 203, 171, 0.38)',  // Warm parchment plateaus
            0.75, 'rgba(194, 65, 12, 0.55)',    // Terracotta mountain ridges
            0.92, 'rgba(255, 238, 214, 0.7)',   // Sunlit alpine ridges
            0.99, 'rgba(255, 255, 255, 0.85)'   // Permanent glacial summits
          ],
          'heatmap-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 45,
            7, 75,
            10, 110
          ],
          'heatmap-opacity': 0.55
        }
      });

      // Pan-India Elevation Highlight: Natural Terrain Footprint Glow
      map.addLayer({
        id: 'elevation-natural-glow',
        type: 'circle',
        source: 'india-elevation-points',
        layout: {
          visibility: isElevationHighlight ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['get', 'elevation_m'],
            0, 4,
            500, 6,
            1500, 10,
            2700, 14,
            7000, 20,
            8586, 26
          ],
          'circle-color': [
            'interpolate', ['linear'], ['get', 'elevation_m'],
            0, '#3a929b',
            500, '#a4d5b2',
            1500, '#d9cbab',
            2700, '#c2410c',
            5000, '#ea580c',
            7500, '#fffbeb'
          ],
          'circle-blur': 0.85,
          'circle-opacity': 0.6
        }
      });

      // Pan-India Elevation Highlight: Natural Faceted Topographic Summit Peak Glyphs
      map.addLayer({
        id: 'elevation-natural-summit',
        type: 'symbol',
        source: 'india-elevation-points',
        layout: {
          'icon-image': 'natural-summit-peak',
          'icon-anchor': 'bottom',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-size': [
            'interpolate', ['linear'], ['get', 'elevation_m'],
            0, 0.35,
            500, 0.45,
            1500, 0.58,
            2700, 0.75,
            5000, 0.9,
            8586, 1.05
          ],
          visibility: isElevationHighlight ? 'visible' : 'none'
        }
      });

      // Pan-India Elevation Highlight: Natural Topographic Spot Height Core
      map.addLayer({
        id: 'elevation-natural-spot-core',
        type: 'circle',
        source: 'india-elevation-points',
        layout: {
          visibility: isElevationHighlight ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['get', 'elevation_m'],
            0, 2.0,
            1500, 2.8,
            2700, 3.5,
            8586, 4.2
          ],
          'circle-color': '#ffffff',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': [
            'interpolate', ['linear'], ['get', 'elevation_m'],
            0, '#3a929b',
            1500, '#c2410c',
            2700, '#ea580c',
            8586, '#7c2d12'
          ]
        }
      });

      // Pan-India Elevation Highlight: Natural Topographic Summit Typography
      map.addLayer({
        id: 'elevation-natural-labels',
        type: 'symbol',
        source: 'india-elevation-points',
        layout: {
          'text-field': ['concat', ['get', 'name'], '\n', ['get', 'elevation_ft_in']],
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            4, 9,
            7, 11,
            10, 13
          ],
          'text-offset': [0, -1.2],
          'text-anchor': 'bottom',
          'text-allow-overlap': false,
          visibility: isElevationHighlight ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#080c14',
          'text-halo-width': 2.0,
          'text-halo-blur': 0.5,
          'text-opacity': 0.92
        }
      });

      // ========================================================
      // SEARCH RESULT HIGHLIGHT (rendered above all data layers)
      // ========================================================
      map.addLayer({
        id: 'search-highlight-fill',
        type: 'fill',
        source: 'search-highlight',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': '#f5c542',
          'fill-opacity': 0.28,
          'fill-outline-color': '#ffffff'
        }
      });

      map.addLayer({
        id: 'search-highlight-polygon-line',
        type: 'line',
        source: 'search-highlight',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'line-color': '#ffffff',
          'line-width': 2.5,
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'search-highlight-line-casing',
        type: 'line',
        source: 'search-highlight',
        filter: ['==', '$type', 'LineString'],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#ffffff',
          'line-width': 8,
          'line-opacity': 0.4
        }
      });

      map.addLayer({
        id: 'search-highlight-line',
        type: 'line',
        source: 'search-highlight',
        filter: ['==', '$type', 'LineString'],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#f5c542',
          'line-width': 4,
          'line-opacity': 1
        }
      });

      map.addLayer({
        id: 'search-highlight-point',
        type: 'circle',
        source: 'search-highlight',
        filter: ['==', '$type', 'Point'],
        paint: {
          'circle-radius': 10,
          'circle-color': '#f5c542',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.95
        }
      });

      // Apply initial active layer styles immediately upon load
      applyLayerStyles(map);

      // River and Trade Route flow animation ticker
      let flowStep = 0;
      if (flowIntervalRef.current) clearInterval(flowIntervalRef.current);
      flowIntervalRef.current = setInterval(() => {
        const m = mapRef.current;
        if (!m || !m.isStyleLoaded()) return;

        // Rivers dasharray
        if (m.getLayer('rivers-flow') && m.getLayoutProperty('rivers-flow', 'visibility') !== 'none') {
          m.setPaintProperty('rivers-flow', 'line-dasharray', [
            (flowStep % 3) + 0.1,
            3,
            2
          ]);
        }

        // Trade route dasharray
        if (m.getLayer('trade-flow') && m.getLayoutProperty('trade-flow', 'visibility') !== 'none') {
          m.setPaintProperty('trade-flow', 'line-dasharray', [
            (flowStep % 4) + 0.5,
            4
          ]);
        }

        flowStep = (flowStep + 1) % 16;
      }, 150);

      // Intelligent Mouse Hover (mouse/pointer devices only — touch selects features)
      map.on('mousemove', (e: MapMouseEvent) => {
        if (!hoverSupportedRef.current) return;
        // Coalesce rapid pointer events to ~60fps to avoid jank when hovering
        // the large district / state GeoJSON sources.
        const now = performance.now();
        if (now - lastHoverTsRef.current < 16) return;
        lastHoverTsRef.current = now;

        const features = map.queryRenderedFeatures(e.point, {
          layers: [
            'archaeology-core',
            'archaeology-inner-pip',
            'earthquake-epicenter-core',
            'seismic-zones-fill',
            'trade-hit-target',
            'trade-core',
            'trade-railways',
            'trade-ports-hit-target',
            'trade-ports-core',
            'roads-hit-target',
            'roads-core',
            'empires-fill',
            'elevation-natural-summit',
            'elevation-natural-spot-core',
            'urban-nodes-halo',
            'env-points-hit-target',
            'env-points-core',
            'env-lines-hit-target',
            'env-lines-core',
            'env-polygons-hit-target',
            'env-polygons-fill',
            'rivers-hit-target',
            'rivers-core',
            'mountains-hit-target',
            'mountains-line',
            'soils-fill',
            'districts-fill',
            'states-fill'
          ].filter(id => Boolean(map.getLayer(id)))
        });

        if (features.length > 0) {
          map.getCanvas().style.cursor = 'pointer';
          const topFeat = features[0];
          const props = topFeat.properties || {};

          let title = props.clean_name || props.shapeName || props.name || 'Geographical Feature';
          let featType = 'FEATURE';
          let subtitle = props.river_system || props.category || props.type || '';
          let metricLabel = undefined;
          let metricValue = undefined;
          let source = props.source || 'Verified Government Data';

          if (topFeat.layer.id === 'empires-fill') {
            featType = 'HISTORICAL EMPIRE';
            title = props.name || 'Historical Empire';
            subtitle = `${props.era || ''} • Capital: ${props.capital || ''}`;
            metricLabel = 'Approx. Extent';
            metricValue = props.approximate_area_sqkm ? `${props.approximate_area_sqkm.toLocaleString()} km²` : 'Scholarly Reconstruction';
            source = 'Archaeological Survey of India / Historical Atlas';
          } else if (topFeat.layer.id.startsWith('archaeology-')) {
            featType = 'ARCHAEOLOGICAL SITE';
            title = props.name || 'Archaeological Site';
            subtitle = `${props.category_display || props.category || ''} (${props.period || ''})`;
            metricLabel = 'Discovery';
            metricValue = `${props.excavator || props.excavators || 'ASI Survey'} (${props.discovery_year || ''})`;
            source = 'Archaeological Survey of India (ASI)';
          } else if (topFeat.layer.id.startsWith('trade-')) {
            const isPort = props.category === 'ancient_port';
            featType = isPort ? 'ANCIENT PORT & EMPORIUM' : (props.category_display ? props.category_display.toUpperCase() : 'HISTORICAL TRADE ROUTE');
            title = props.name || 'Trade Corridor';
            subtitle = props.era || props.era_active || 'Historical Artery';
            metricLabel = isPort ? 'Location' : (props.total_length_km ? 'Length' : 'Commodities');
            metricValue = isPort 
              ? (props.location_desc || 'Historic Seaport')
              : (props.total_length_km ? `${props.total_length_km.toLocaleString()} km` : (props.commodities || 'Trade Artery'));
            source = props.citation || 'Archaeological Survey of India (ASI) / Project Mausam';
          } else if (topFeat.layer.id.startsWith('roads-')) {
            featType = props.category === 'Expressway' ? 'EXPRESSWAY' : props.category === 'State Highway' ? 'STATE HIGHWAY' : 'NATIONAL HIGHWAY';
            title = `${props.code ? props.code + ' — ' : ''}${props.name || 'Road Corridor'}`;
            subtitle = `${props.from || ''} → ${props.to || ''}`;
            metricLabel = 'Route Length';
            metricValue = props.length_km ? `${props.length_km.toLocaleString()} km` : (props.corridor || 'Road Corridor');
            source = props.source || 'MoRTH / NHAI';
          } else if (topFeat.layer.id.startsWith('env-')) {
            featType = 'ENVIRONMENTAL CHANGE';
            title = props.name || 'Environmental Hotspot';
            subtitle = `${props.category_name || 'Climate Change'} • ${props.region || ''}`;
            metricLabel = 'Assessment Delta';
            metricValue = props.delta_text || props.comparison_text || 'Multi-Decadal Shift';
            source = props.source_authority || 'Forest Survey of India / ISRO-SAC';
          } else if (topFeat.layer.id.startsWith('earthquake-epicenter-')) {
            featType = 'HISTORICAL EARTHQUAKE';
            title = `${props.year} ${props.name}`;
            subtitle = `Fault: ${props.fault_system || 'Tectonic Plate Boundary'}`;
            metricLabel = 'Magnitude';
            metricValue = `M ${props.magnitude_mw} (Depth: ${props.depth_km} km)`;
            source = 'National Centre for Seismology / IMD';
          } else if (topFeat.layer.id === 'seismic-zones-fill') {
            featType = 'SEISMIC HAZARD ZONE';
            title = `${props.zone_code} (${props.hazard_level})`;
            subtitle = `Zone Factor Z = ${props.zone_factor_z}`;
            metricLabel = 'Peak Ground Accel';
            metricValue = props.peak_ground_accel;
            source = 'Bureau of Indian Standards (BIS 1893:2016)';
          } else if (topFeat.layer.id.startsWith('elevation-natural-')) {
            featType = 'NATURAL MOUNTAIN SUMMIT';
            title = props.name || 'Topographic Summit';
            subtitle = `${props.zone || 'Physiographic Feature'} • ${props.category || 'Peak'}`;
            metricLabel = 'Elevation (Ft & In)';
            metricValue = `${props.elevation_ft_in} (${props.elevation_m >= 0 ? props.elevation_m + ' m' : props.elevation_m + ' m below sea level'})`;
            source = 'Survey of India / NASA SRTM 30m';
          } else if (topFeat.layer.id === 'urban-nodes-halo') {
            featType = 'URBAN NODE';
            subtitle = props.type || 'Metropolitan Hub';
            metricLabel = 'Night Light Hub';
            metricValue = `${props.intensity?.toUpperCase() || 'HIGH'} EMISSION`;
            source = 'NASA Black Marble / ISRO';
          } else if (topFeat.layer.id.startsWith('rivers-')) {
            featType = 'RIVER';
            subtitle = props.river_system || 'River Basin';
            if (props.length_km) {
              metricLabel = 'Course Length';
              metricValue = `${props.length_km.toLocaleString()} km`;
            }
          } else if (topFeat.layer.id.startsWith('mountains-')) {
            featType = 'MOUNTAIN RANGE';
            subtitle = props.type || 'Relief System';
            if (props.peak) {
              metricLabel = 'Highest Peak';
              metricValue = `${props.peak} — ${formatElevationDual(props.elevation_m)}`;
            }
          } else if (topFeat.layer.id === 'soils-fill') {
            featType = 'SOIL CLASSIFICATION';
            subtitle = props.suitability ? `Crops: ${props.suitability.split(',')[0]}` : 'ICAR Classification';
            if (props.area_pct) {
              metricLabel = 'National Share';
              metricValue = `${props.area_pct}% of India`;
            }
          } else if (topFeat.layer.id === 'districts-fill') {
            featType = 'DISTRICT';
            subtitle = props.state_name ? `State: ${props.state_name}` : 'District Boundary';
            if (activeLayers.has('pop_density') && props.density_2011) {
              metricLabel = 'Density';
              metricValue = `${props.density_2011.toLocaleString()} / km²`;
            } else if (activeLayers.has('pop_total') && props.population_2011) {
              metricLabel = 'Population';
              metricValue = props.population_2011.toLocaleString();
            } else if (activeLayers.has('literacy') && props.literacy_rate) {
              metricLabel = 'Literacy';
              metricValue = `${props.literacy_rate}%`;
            } else if (activeLayers.has('sex_ratio') && props.sex_ratio) {
              metricLabel = 'Sex Ratio';
              metricValue = `${props.sex_ratio} F / 1000 M`;
            } else if (activeLayers.has('religion')) {
              const relVal = props[`${religionFilter}_pct`];
              if (relVal !== undefined) {
                metricLabel = `${religionFilter.toUpperCase()} Share`;
                metricValue = `${relVal}%`;
              }
            } else if (props.population_2011) {
              metricLabel = 'Population';
              metricValue = props.population_2011.toLocaleString();
            }
          } else if (topFeat.layer.id === 'states-fill') {
            featType = 'STATE / UT';
            subtitle = props.capital ? `Capital: ${props.capital}` : 'State Boundary';
            if (props.population_2011) {
              metricLabel = 'Population';
              metricValue = `${props.population_2011.toLocaleString()} (${props.density_2011} / km²)`;
            }
          }

          const rect = map.getCanvasContainer().getBoundingClientRect();
          const clientX = rect.left + e.point.x;
          const clientY = rect.top + e.point.y - 14;
          const hoverKey = [
            featType,
            title,
            subtitle || '',
            metricLabel || '',
            metricValue || '',
            Math.round(clientX / 6),
            Math.round(clientY / 6)
          ].join('|');

          if (hoverKey !== lastHoverKeyRef.current) {
            lastHoverKeyRef.current = hoverKey;
            setHoveredTooltip({
              x: clientX,
              y: clientY,
              title,
              type: featType,
              subtitle,
              metricLabel,
              metricValue,
              source
            });
          }
        } else {
          map.getCanvas().style.cursor = '';
          lastHoverKeyRef.current = '';
          setHoveredTooltip(null);
        }
      });

      map.getCanvas().addEventListener('mouseleave', () => {
        setHoveredTooltip(null);
      });

      // Robust Click Selection with Two-Stage Mobile Hit Resolution
      map.on('click', (e: MapMouseEvent) => {
        // Generous touch buffer for mobile fingers (24px radius = 48x48px touch zone)
        const touchRadius = 24;
        const touchBbox: [[number, number], [number, number]] = [
          [e.point.x - touchRadius, e.point.y - touchRadius],
          [e.point.x + touchRadius, e.point.y + touchRadius]
        ];

        // 1. High priority linear & discrete point layers (highways, mountains, rivers, trade, archaeological sites, summits)
        const priorityLinearPointLayers = [
          'roads-hit-target',
          'roads-core',
          'roads-casing',
          'roads-label',
          'mountains-hit-target',
          'mountains-line',
          'mountains-glow',
          'rivers-hit-target',
          'rivers-core',
          'rivers-glow',
          'rivers-flow',
          'trade-hit-target',
          'trade-core',
          'trade-glow',
          'trade-flow',
          'trade-railways',
          'trade-ports-hit-target',
          'trade-ports-core',
          'archaeology-core',
          'archaeology-inner-pip',
          'archaeology-glow',
          'earthquake-epicenter-core',
          'elevation-natural-summit',
          'elevation-natural-spot-core',
          'env-points-hit-target',
          'env-points-core',
          'env-lines-hit-target',
          'env-lines-core',
          'env-polygons-hit-target'
        ].filter(id => Boolean(map.getLayer(id)));

        // 2. Low priority background polygon layers (districts, states, soils, empires, seismic zones, env polygons)
        const polygonLayers = [
          'env-polygons-fill',
          'seismic-zones-fill',
          'empires-fill',
          'soils-fill',
          'districts-fill',
          'states-fill'
        ].filter(id => Boolean(map.getLayer(id)));

        // Stage 1: Check for direct linear/point hits at tap point
        const directLinearHits = map.queryRenderedFeatures(e.point, { layers: priorityLinearPointLayers });
        let features: MapGeoJSONFeature[] = [];

        if (directLinearHits && directLinearHits.length > 0) {
          features = directLinearHits;
        } else {
          // Stage 2: If tap landed slightly off the line (typical mobile touch), search within the 48x48px touch zone
          const bufferedHits = map.queryRenderedFeatures(touchBbox, { layers: priorityLinearPointLayers });
          if (bufferedHits && bufferedHits.length > 0) {
            // Sort by proximity to tap point
            features = sortFeaturesByProximity(bufferedHits, e.point, map);
          } else {
            // Stage 3: Only if no linear/point feature was anywhere near the tap, query background polygon at tap point
            features = map.queryRenderedFeatures(e.point, { layers: polygonLayers });
          }
        }

        const clearHighlights = () => {
          if (map.getLayer('states-highlight')) map.setFilter('states-highlight', ['==', 'shapeName', '']);
          if (map.getLayer('states-highlight-fill')) map.setFilter('states-highlight-fill', ['==', 'shapeName', '']);
          if (map.getLayer('districts-highlight-line')) map.setFilter('districts-highlight-line', ['==', 'shapeName', '']);
          if (map.getLayer('districts-highlight-fill')) map.setFilter('districts-highlight-fill', ['==', 'shapeName', '']);
          if (map.getLayer('rivers-highlight')) map.setFilter('rivers-highlight', ['==', 'clean_name', '']);
          if (map.getLayer('mountains-highlight')) map.setFilter('mountains-highlight', ['==', 'name', '']);
          if (map.getLayer('roads-highlight')) map.setFilter('roads-highlight', ['==', 'code', '']);
          if (map.getLayer('env-highlight-fill')) map.setFilter('env-highlight-fill', ['==', 'id', '']);
          if (map.getLayer('env-highlight-border')) map.setFilter('env-highlight-border', ['==', 'id', '']);
          if (map.getLayer('env-highlight-line')) map.setFilter('env-highlight-line', ['==', 'id', '']);
          if (map.getLayer('env-highlight-point')) map.setFilter('env-highlight-point', ['==', 'id', '']);
          const searchHighlightSrc = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
          if (searchHighlightSrc) searchHighlightSrc.setData({ type: 'FeatureCollection', features: [] });
        };

        if (features.length > 0) {
          clearHighlights();
          const topFeat = features[0];
          const props = topFeat.properties || {};
          const name = props.clean_name || props.shapeName || props.name || 'Feature';
          
          let featType: SelectedFeatureInfo['type'] = 'state';

          if (topFeat.layer.id.startsWith('roads-')) {
            featType = 'highway';
            if (map.getLayer('roads-highlight')) {
              map.setFilter('roads-highlight', ['==', 'code', props.code || '']);
            }
          } else if (topFeat.layer.id.startsWith('mountains-')) {
            featType = 'mountain';
            if (map.getLayer('mountains-highlight')) {
              map.setFilter('mountains-highlight', ['==', 'name', props.name || '']);
            }
          } else if (topFeat.layer.id.startsWith('rivers-')) {
            featType = 'river';
            if (map.getLayer('rivers-highlight')) {
              map.setFilter('rivers-highlight', ['==', 'clean_name', props.clean_name || '']);
            }
          } else if (topFeat.layer.id.startsWith('trade-')) {
            featType = 'trade_route';
          } else if (topFeat.layer.id.startsWith('env-')) {
            featType = 'environmental_change';
            const featId = props.id || '';
            const envFilter: any = featId
              ? ['any', ['==', ['get', 'id'], featId], ['==', ['id'], featId], ['==', ['get', 'name'], name || featId]]
              : ['==', ['id'], ''];
            if (map.getLayer('env-highlight-fill')) map.setFilter('env-highlight-fill', envFilter);
            if (map.getLayer('env-highlight-border')) map.setFilter('env-highlight-border', envFilter);
            if (map.getLayer('env-highlight-line')) map.setFilter('env-highlight-line', envFilter);
            if (map.getLayer('env-highlight-point')) map.setFilter('env-highlight-point', envFilter);
          } else if (topFeat.layer.id.startsWith('archaeology-')) {
            featType = 'archaeological_site';
          } else if (topFeat.layer.id.startsWith('earthquake-epicenter-')) {
            featType = 'earthquake_epicenter';
          } else if (topFeat.layer.id === 'seismic-zones-fill') {
            featType = 'seismic_zone';
          } else if (topFeat.layer.id === 'empires-fill') {
            featType = 'historical_empire';
          } else if (topFeat.layer.id === 'soils-fill') {
            featType = 'soil';
          } else if (topFeat.layer.id === 'districts-fill') {
            featType = 'district';
            if (map.getLayer('districts-highlight-line')) {
              map.setFilter('districts-highlight-line', ['==', 'shapeName', props.shapeName || '']);
            }
            if (map.getLayer('districts-highlight-fill')) {
              map.setFilter('districts-highlight-fill', ['==', 'shapeName', props.shapeName || '']);
            }
          } else if (topFeat.layer.id === 'states-fill') {
            featType = 'state';
            if (map.getLayer('states-highlight')) {
              map.setFilter('states-highlight', ['==', 'shapeName', props.shapeName || '']);
            }
            if (map.getLayer('states-highlight-fill')) {
              map.setFilter('states-highlight-fill', ['==', 'shapeName', props.shapeName || '']);
            }
          }

          // Build Demographic Record if applicable
          let demoRecord: DemographicRecord | undefined = undefined;
          if (props.population_2011) {
            demoRecord = {
              state: props.state_name || props.shapeName,
              district: props.district || props.shapeName,
              population_2011: props.population_2011,
              population_2001: props.population_2001,
              density_2011: props.density_2011,
              area_sqkm: props.area_sqkm,
              growth_pct: props.growth_pct,
              literacy_rate: props.literacy_rate,
              sex_ratio: props.sex_ratio,
              rural_pct: props.rural_pct,
              urban_pct: props.urban_pct,
              hindu_pct: props.hindu_pct,
              muslim_pct: props.muslim_pct,
              christian_pct: props.christian_pct,
              sikh_pct: props.sikh_pct,
              buddhist_pct: props.buddhist_pct,
              jain_pct: props.jain_pct,
              other_pct: props.other_pct,
              source: props.source || 'Census of India 2011',
              census_year: props.census_year || 2011
            };
          } else if (featType === 'state' || featType === 'district') {
            const distKey = name.toUpperCase();
            const matched = Object.entries(demographicsData).find(([key]) => key.includes(distKey));
            if (matched) demoRecord = matched[1];
          }

          onSelectFeature({
            type: featType,
            name,
            properties: props,
            demographics: demoRecord,
            coordinates: [e.lngLat.lng, e.lngLat.lat],
            geometry: topFeat.geometry
          });
        } else {
          clearHighlights();
          onSelectFeature(null);
        }
      });

    });

    mapRef.current = map;

    return () => {
      if (flowIntervalRef.current) {
        clearInterval(flowIntervalRef.current);
        flowIntervalRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync Historical Empire layer filter when selectedHistoricalPeriod changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    try {
      const empireFilter: any = ['==', 'id', selectedHistoricalPeriod];
      ['empires-fill', 'empires-glow', 'empires-border', 'empires-capitals'].forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.setFilter(layerId, empireFilter);
        }
      });
      map.triggerRepaint();
    } catch (e) {
      console.warn('Historical period filter update warning:', e);
    }
  }, [selectedHistoricalPeriod]);

  // Update Basemap Tiles on Style Switch
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    try {
      const source = map.getSource('base-raster') as any;
      if (source && source.setTiles) {
        source.setTiles(getBasemapTiles(basemapStyle));
      }

      // Apply tactile fine-art hillshading when physical_tactile basemap is active
      if (map.getLayer('hillshading-layer')) {
        if (basemapStyle === 'physical_tactile') {
          map.setPaintProperty('hillshading-layer', 'hillshade-shadow-color', '#3d1a0e');
          map.setPaintProperty('hillshading-layer', 'hillshade-highlight-color', '#ffeed6');
          map.setPaintProperty('hillshading-layer', 'hillshade-accent-color', '#c2410c');
          map.setPaintProperty('hillshading-layer', 'hillshade-exaggeration', 0.75);
        } else {
          map.setPaintProperty('hillshading-layer', 'hillshade-shadow-color', '#020617');
          map.setPaintProperty('hillshading-layer', 'hillshade-highlight-color', '#38bdf8');
          map.setPaintProperty('hillshading-layer', 'hillshade-accent-color', '#0284c7');
          map.setPaintProperty('hillshading-layer', 'hillshade-exaggeration', 0.35);
        }
      }
      map.triggerRepaint();
    } catch (e) {
      console.warn('Basemap tile switch warning:', e);
    }
  }, [basemapStyle]);

  // 1. Toggle 2D vs 3D Perspective (Camera Tilt & Terrain Base)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    try {
      if (is3D) {
        if (map.getSource('terrarium-dem')) {
          map.setTerrain({
            source: 'terrarium-dem',
            exaggeration: terrainExaggeration
          });
        }
        map.easeTo({ pitch: 55, bearing: -8, duration: 800 });
      } else {
        map.setTerrain(null);
        map.easeTo({ pitch: 0, bearing: 0, duration: 600 });
      }
      map.triggerRepaint();
    } catch (e) {
      console.warn('Error toggling 3D mode:', e);
    }
  }, [is3D]);

  // 2. Real-time, instant-response Terrain Relief Exaggeration Slider (Zero camera jumping, fluid scaling)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !is3D) return;

    try {
      if (map.getSource('terrarium-dem')) {
        map.setTerrain({
          source: 'terrarium-dem',
          exaggeration: terrainExaggeration
        });
      }
      if (map.getLayer('hillshading-layer')) {
        map.setPaintProperty(
          'hillshading-layer',
          'hillshade-exaggeration',
          Math.min(1.0, 0.2 + (terrainExaggeration * 0.25))
        );
      }
      map.triggerRepaint();
    } catch (e) {
      console.warn('Error adjusting terrain exaggeration:', e);
    }
  }, [terrainExaggeration, is3D]);

  // 3. Dynamic Pan-India Elevation Highlight Toggle (Natural Topographic Summit Peaks & Hypsometric Tint)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const elevationLayerIds = [
      'elevation-heatmap',
      'elevation-natural-glow',
      'elevation-natural-summit',
      'elevation-natural-spot-core',
      'elevation-natural-labels'
    ];

    elevationLayerIds.forEach(id => {
      try {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', isElevationHighlight ? 'visible' : 'none');
        }
      } catch (err) {
        console.warn(`Layer visibility update warning on ${id}:`, err);
      }
    });

    if (isElevationHighlight) {
      // Natural 3D terrain elevation with authentic, sculpted physical contours
      if (map.getSource('terrarium-dem')) {
        map.setTerrain({
          source: 'terrarium-dem',
          exaggeration: 2.0
        });
      }
      if (map.getLayer('hillshading-layer')) {
        map.setPaintProperty('hillshading-layer', 'hillshade-exaggeration', 0.65);
        map.setPaintProperty('hillshading-layer', 'hillshade-shadow-color', '#2e140d');
        map.setPaintProperty('hillshading-layer', 'hillshade-highlight-color', '#fff5ea');
        map.setPaintProperty('hillshading-layer', 'hillshade-accent-color', '#c2410c');
      }
      map.easeTo({ pitch: 48, duration: 800 });
    } else {
      if (is3D && map.getSource('terrarium-dem')) {
        map.setTerrain({
          source: 'terrarium-dem',
          exaggeration: terrainExaggeration
        });
      }
    }
    map.triggerRepaint();
  }, [isElevationHighlight, is3D, terrainExaggeration]);

  // Guaranteed instantaneous layer state execution with zero-latency response
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Apply layer visibility immediately to all existing layers
    applyLayerStyles(map);

    // Also attach to load if map was still initializing
    if (!map.loaded()) {
      map.once('load', () => applyLayerStyles(map));
    }
  }, [applyLayerStyles]);

  // Sync Highlights when selectedFeature changes from search or outside
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (!selectedFeature) {
      if (map.getLayer('states-highlight')) map.setFilter('states-highlight', ['==', 'shapeName', '']);
      if (map.getLayer('states-highlight-fill')) map.setFilter('states-highlight-fill', ['==', 'shapeName', '']);
      if (map.getLayer('districts-highlight-line')) map.setFilter('districts-highlight-line', ['==', 'shapeName', '']);
      if (map.getLayer('districts-highlight-fill')) map.setFilter('districts-highlight-fill', ['==', 'shapeName', '']);
      if (map.getLayer('rivers-highlight')) map.setFilter('rivers-highlight', ['==', 'clean_name', '']);
      if (map.getLayer('mountains-highlight')) map.setFilter('mountains-highlight', ['==', 'name', '']);
      if (map.getLayer('roads-highlight')) map.setFilter('roads-highlight', ['==', 'code', '']);
      if (map.getLayer('env-highlight-fill')) map.setFilter('env-highlight-fill', ['==', ['id'], '']);
      if (map.getLayer('env-highlight-border')) map.setFilter('env-highlight-border', ['==', ['id'], '']);
      if (map.getLayer('env-highlight-line')) map.setFilter('env-highlight-line', ['==', ['id'], '']);
      if (map.getLayer('env-highlight-point')) map.setFilter('env-highlight-point', ['==', ['id'], '']);
      const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
      if (src && typeof src.setData === 'function') src.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    const { type, properties, name } = selectedFeature;
    const featName = properties.clean_name || properties.shapeName || properties.name || name;

    if (type === 'state') {
      if (map.getLayer('states-highlight')) map.setFilter('states-highlight', ['==', 'shapeName', properties.shapeName || featName]);
      if (map.getLayer('states-highlight-fill')) map.setFilter('states-highlight-fill', ['==', 'shapeName', properties.shapeName || featName]);
    } else if (type === 'district') {
      if (map.getLayer('districts-highlight-line')) map.setFilter('districts-highlight-line', ['==', 'shapeName', properties.shapeName || featName]);
      if (map.getLayer('districts-highlight-fill')) map.setFilter('districts-highlight-fill', ['==', 'shapeName', properties.shapeName || featName]);
    } else if (type === 'river') {
      if (map.getLayer('rivers-highlight')) map.setFilter('rivers-highlight', ['==', 'clean_name', properties.clean_name || featName]);
    } else if (type === 'mountain') {
      if (map.getLayer('mountains-highlight')) map.setFilter('mountains-highlight', ['==', 'name', properties.name || featName]);
    } else if (type === 'highway') {
      if (map.getLayer('roads-highlight')) map.setFilter('roads-highlight', ['==', 'code', properties.code || featName]);
    } else if (type === 'environmental_change') {
      const featId = properties.id || '';
      const envFilter: any = featId
        ? [
            'any',
            ['==', ['get', 'id'], featId],
            ['==', ['id'], featId],
            ['==', ['get', 'name'], featName || featId]
          ]
        : ['==', ['id'], ''];

      ['env-highlight-fill', 'env-highlight-border', 'env-highlight-line', 'env-highlight-point'].forEach(id => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', 'visible');
          map.setFilter(id, envFilter);
        }
      });

      // Synchronously push geometry to search-highlight source for guaranteed zero-latency marked area display!
      const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
      if (src && typeof src.setData === 'function') {
        if (selectedFeature.geometry) {
          src.setData({
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: selectedFeature.geometry,
              properties: selectedFeature.properties
            }]
          });
        } else {
          try {
            const feats = map.querySourceFeatures('environmental-change', { filter: envFilter });
            if (feats.length > 0) {
              src.setData({
                type: 'FeatureCollection',
                features: feats.map(f => ({ type: 'Feature', geometry: f.geometry, properties: f.properties }))
              });
            }
          } catch {
            // ignore query errors
          }
        }
      }
    }
  }, [selectedFeature, activeLayers, environmentalPillars]);

  // Handle Search FlyTo
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !searchTarget) return;

    if (searchTarget.bbox) {
      map.fitBounds(searchTarget.bbox, { padding: 64, duration: 1600, essential: true });
    } else if (searchTarget.lat !== undefined && searchTarget.lng !== undefined) {
      map.flyTo({
        center: [searchTarget.lng, searchTarget.lat],
        zoom: searchTarget.zoom ?? 8,
        pitch: searchTarget.pitch !== undefined ? searchTarget.pitch : map.getPitch(),
        bearing: searchTarget.bearing !== undefined ? searchTarget.bearing : map.getBearing(),
        duration: 2200,
        essential: true
      });
    }

    applySearchHighlight(map, searchTarget);
  }, [searchTarget]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#050608]">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Cinematic Map Vignette Overlay */}
      <div className="map-vignette pointer-events-none" />

      {/* Floating Interactive Hover Card - Obsidian & Coral Theme */}
      {hoveredTooltip && (
        <div
          className="fixed pointer-events-none z-50 vista-card bg-[#0d1016]/95 border border-white/10 border-l-3 border-l-[#C9A227] text-white px-4 py-3.5 rounded-xl shadow-2xl text-sm -translate-x-1/2 -translate-y-full mb-3 max-w-sm transition-transform duration-75 font-mono"
          style={{ left: `${hoveredTooltip.x}px`, top: `${hoveredTooltip.y}px` }}
        >
          <div className="flex items-center justify-between gap-2.5 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40">
              {hoveredTooltip.type}
            </span>
            <span className="text-xs text-neutral-300 font-semibold truncate">{hoveredTooltip.source}</span>
          </div>

          <div className="font-extrabold text-base text-white tracking-tight">{hoveredTooltip.title}</div>
          {hoveredTooltip.subtitle && (
            <div className="text-neutral-300 text-xs mt-1 font-sans font-semibold">{hoveredTooltip.subtitle}</div>
          )}

          {hoveredTooltip.metricLabel && hoveredTooltip.metricValue && (
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-4 text-xs font-mono font-bold">
              <span className="text-neutral-300 font-semibold">{hoveredTooltip.metricLabel}:</span>
              <span className="font-black text-[#C9A227] text-sm">
                {hoveredTooltip.metricValue}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
