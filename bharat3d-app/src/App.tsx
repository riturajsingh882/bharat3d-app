import { useState, useEffect, useRef } from 'react';
import { MapEngine } from './components/MapEngine';
import { SidebarNav } from './components/SidebarNav';
import { TopNavBar } from './components/TopNavBar';
import { InfoPanel } from './components/InfoPanel';
import { SourceModal } from './components/SourceModal';
import { LoadingScreen } from './components/LoadingScreen';
import { HistoricalTimeline } from './components/HistoricalTimeline';
import { StateComparisonModal } from './components/StateComparisonModal';
import { SoilDataModal } from './components/SoilDataModal';
import { EnvironmentalComparisonDeck } from './components/EnvironmentalComparisonDeck';
import { PanelLeftClose, PanelLeftOpen, Mountain, Leaf, Landmark, Scroll, Compass, AlertTriangle, Route, ChevronUp, Clock, Info } from 'lucide-react';
import type { ActiveLayer, BasemapStyle, DemographicRecord, HistoricalPeriodId, ReligionFilter, SearchTarget, SelectedFeatureInfo, TradeCategory, EnvironmentalPillar, EnvironmentalComparisonConfig } from './types';
import { HISTORICAL_ERAS } from './data/historicalEras';
import { 
  ALL_ENVIRONMENTAL_PILLARS, 
  PILLAR_VIEWPORTS, 
  findPillarForHotspot, 
  FEATURE_BENCHMARKS, 
  ENVIRONMENTAL_PILLARS,
  PILLAR_HOTSPOTS
} from './data/environmentalChange';
import { 
  ENVIRONMENTAL_FEATURES, 
  ENVIRONMENTAL_FEATURES_BY_ID 
} from './data/environmentalGeojson';

const DEMOGRAPHIC_LAYERS: ActiveLayer[] = [
  'pop_density',
  'pop_total',
  'literacy',
  'sex_ratio',
  'religion'
];

const ALL_TRADE_CATEGORIES: TradeCategory[] = [
  'ancient_highway',
  'maritime_route',
  'silk_road',
  'spice_route',
  'ancient_port',
  'colonial_network',
  'historical_railway'
];

export function App() {
  const [activeLayers, setActiveLayers] = useState<Set<ActiveLayer>>(
    new Set<ActiveLayer>()
  );
  const [religionFilter, setReligionFilter] = useState<ReligionFilter>('hindu');
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyle>('physical_tactile');
  const [is3D, setIs3D] = useState<boolean>(true);
  const [terrainExaggeration, setTerrainExaggeration] = useState<number>(1.5);
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeatureInfo | null>(null);
  const [searchTarget, setSearchTarget] = useState<SearchTarget | null>(null);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState<boolean>(false);
  const [isElevationHighlight, setIsElevationHighlight] = useState<boolean>(false);
  const [demographicsData, setDemographicsData] = useState<Record<string, DemographicRecord>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Historical Atlas State
  const [selectedHistoricalPeriod, setSelectedHistoricalPeriod] = useState<HistoricalPeriodId>('maurya');
  const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(false);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState<boolean>(
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  // State Comparison Studio State
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);
  const [isSoilModalOpen, setIsSoilModalOpen] = useState<boolean>(false);

  // Trade & Connectivity Sub-categories State
  const [tradeCategories, setTradeCategories] = useState<Set<TradeCategory>>(
    new Set(ALL_TRADE_CATEGORIES)
  );

  const toggleTradeCategory = (cat: TradeCategory) => {
    setTradeCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
    if (!activeLayers.has('trade_routes')) {
      setActiveLayers(prev => new Set(prev).add('trade_routes'));
    }
  };

  const selectAllTradeCategories = () => {
    setTradeCategories(new Set(ALL_TRADE_CATEGORIES));
    if (!activeLayers.has('trade_routes')) {
      setActiveLayers(prev => new Set(prev).add('trade_routes'));
    }
  };

  const clearTradeCategories = () => {
    setTradeCategories(new Set());
  };


  // Environmental Change & Climate Explorer State
  const [environmentalPillars, setEnvironmentalPillars] = useState<Set<EnvironmentalPillar>>(
    new Set(ALL_ENVIRONMENTAL_PILLARS)
  );
  const [isEcoComparisonOpen, setIsEcoComparisonOpen] = useState<boolean>(false);
  const [comparisonConfig, setComparisonConfig] = useState<EnvironmentalComparisonConfig>({
    pillar: 'forest_change',
    yearA: '2001',
    yearB: '2021',
    isDeltaMode: false
  });

  const toggleEnvironmentalPillar = (pillar: EnvironmentalPillar) => {
    const isCurrentlyActive = environmentalPillars.has(pillar);

    // If unticking this pillar and the currently selected feature belongs to it, immediately clear selectedFeature!
    if (isCurrentlyActive && selectedFeature?.type === 'environmental_change' && selectedFeature.properties?.pillar === pillar) {
      setSelectedFeature(null);
    }

    setEnvironmentalPillars(prev => {
      const next = new Set(prev);
      if (next.has(pillar)) {
        next.delete(pillar);
      } else {
        next.add(pillar);
      }
      return next;
    });

    // Only activate 'environmental_change' layer when turning a pillar ON
    if (!isCurrentlyActive && !activeLayers.has('environmental_change')) {
      setActiveLayers(prev => new Set(prev).add('environmental_change'));
    }

    if (!isCurrentlyActive) {
      const vp = PILLAR_VIEWPORTS[pillar];
      if (vp) {
        setSearchTarget({
          name: vp.description,
          lat: vp.lat,
          lng: vp.lng,
          zoom: vp.zoom,
          pitch: vp.pitch,
          bearing: vp.bearing,
          type: 'environmental_change'
        });
      }
    }
  };

  const selectAllEnvironmentalPillars = () => {
    setEnvironmentalPillars(new Set(ALL_ENVIRONMENTAL_PILLARS));
    if (!activeLayers.has('environmental_change')) {
      setActiveLayers(prev => new Set(prev).add('environmental_change'));
    }
  };

  const clearEnvironmentalPillars = () => {
    setEnvironmentalPillars(new Set());
    if (selectedFeature?.type === 'environmental_change') {
      setSelectedFeature(null);
    }
  };

  const updateComparisonConfig = (newConfig: Partial<EnvironmentalComparisonConfig>) => {
    setComparisonConfig(prev => ({ ...prev, ...newConfig }));
  };

  const openEcoComparison = (targetPillar?: EnvironmentalPillar) => {
    const p = targetPillar || comparisonConfig.pillar;
    setIsEcoComparisonOpen(true);
    if (!activeLayers.has('environmental_change')) {
      setActiveLayers(prev => new Set(prev).add('environmental_change'));
    }
    setEnvironmentalPillars(new Set([p]));
    const primaryHotspot = PILLAR_HOTSPOTS[p]?.[0];
    if (primaryHotspot) {
      handleSelectHotspot(primaryHotspot);
    } else {
      const vp = PILLAR_VIEWPORTS[p];
      if (vp) {
        setSearchTarget({
          name: vp.description,
          lat: vp.lat,
          lng: vp.lng,
          zoom: vp.zoom,
          pitch: vp.pitch,
          bearing: vp.bearing,
          type: 'environmental_change'
        });
      }
    }
  };

  const handleSelectPillarFromDeck = (pillar: EnvironmentalPillar) => {
    updateComparisonConfig({ pillar });
    if (!activeLayers.has('environmental_change')) {
      setActiveLayers(prev => new Set(prev).add('environmental_change'));
    }
    setEnvironmentalPillars(new Set([pillar]));
    const primaryHotspot = PILLAR_HOTSPOTS[pillar]?.[0];
    if (primaryHotspot) {
      handleSelectHotspot(primaryHotspot);
    } else {
      const vp = PILLAR_VIEWPORTS[pillar];
      if (vp) {
        setSearchTarget({
          name: vp.description,
          lat: vp.lat,
          lng: vp.lng,
          zoom: vp.zoom,
          pitch: vp.pitch,
          bearing: vp.bearing,
          type: 'environmental_change'
        });
      }
    }
  };

  // Ingest Demographics Data
  useEffect(() => {
    fetch('/data/census_demographics.json')
      .then(res => res.json())
      .then(data => {
        setDemographicsData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load demographics data:', err);
        setIsLoading(false);
      });
  }, []);

  const handleSelectHotspot = (hotspot: { id?: string; name: string; lat: number; lng: number; zoom?: number }) => {
    // 1. Identify which pillar this hotspot belongs to
    const targetPillar = (hotspot.id ? findPillarForHotspot(hotspot.id) : undefined) || comparisonConfig.pillar;

    // 2. Ensure activeLayers has 'environmental_change'
    if (!activeLayers.has('environmental_change')) {
      setActiveLayers(prev => new Set(prev).add('environmental_change'));
    }

    // 3. Ensure environmentalPillars includes this pillar so MapEngine displays its geometry
    setEnvironmentalPillars(prev => new Set(prev).add(targetPillar));

    // 4. Update comparison deck to focus on this pillar
    updateComparisonConfig({ pillar: targetPillar });

    // 5. Set search target with key matching the ID so search-highlight immediately illuminates the geometry!
    setSearchTarget({
      name: hotspot.name,
      lat: hotspot.lat,
      lng: hotspot.lng,
      zoom: hotspot.zoom || 9,
      pitch: 50,
      type: 'environmental_change',
      key: hotspot.id || undefined
    });

    // 6. Match feature synchronously from ENVIRONMENTAL_FEATURES_BY_ID or ENVIRONMENTAL_FEATURES
    let match = hotspot.id ? ENVIRONMENTAL_FEATURES_BY_ID[hotspot.id] : undefined;

    // Fallback: Exact or whole-string name containment
    if (!match) {
      const hName = (hotspot.name || '').toLowerCase();
      match = ENVIRONMENTAL_FEATURES.find(f => {
        const fName = (f.properties?.name || '').toLowerCase();
        return fName.includes(hName) || hName.includes(fName);
      });
    }

    // Fallback: Significant keyword token match (length >= 4 to avoid false substrings)
    if (!match) {
      const hTokens = (hotspot.name || '')
        .toLowerCase()
        .split(/[\s&,/()-]+/)
        .filter(w => w.length >= 4);
      if (hTokens.length > 0) {
        match = ENVIRONMENTAL_FEATURES.find(f => {
          const fName = (f.properties?.name || '').toLowerCase();
          return hTokens.some(w => fName.includes(w));
        });
      }
    }

    if (match) {
      setSelectedFeature({
        type: 'environmental_change',
        name: match.properties.name,
        properties: match.properties,
        coordinates: [hotspot.lng, hotspot.lat],
        geometry: match.geometry
      });
    } else if (hotspot.id) {
      const bMarks = FEATURE_BENCHMARKS[hotspot.id];
      const pMeta = ENVIRONMENTAL_PILLARS[targetPillar];
      const bYear = pMeta?.baselineYear || '2001';
      const cYear = pMeta?.comparisonYear || '2021';
      const bPoint = bMarks?.[bYear];
      const cPoint = bMarks?.[cYear];

      setSelectedFeature({
        type: 'environmental_change',
        name: hotspot.name,
        properties: {
          id: hotspot.id,
          name: hotspot.name,
          pillar: targetPillar,
          category_name: pMeta?.title || 'Environmental Change',
          baseline_year: bYear,
          baseline_text: bPoint?.text || '',
          baseline_value: bPoint?.value,
          comparison_year: cYear,
          comparison_text: cPoint?.text || '',
          comparison_value: cPoint?.value,
          delta_text: bPoint && cPoint ? `${cPoint.value - bPoint.value > 0 ? '+' : ''}${cPoint.value - bPoint.value} ${cPoint.unit}` : undefined,
          authority: pMeta?.authority || ''
        },
        coordinates: [hotspot.lng, hotspot.lat]
      });
    }
  };

  // Intuitive, responsive single-click layer toggling with smart mutual exclusivity
  const toggleLayer = (layer: ActiveLayer) => {
    setActiveLayers(prev => {
      const next = new Set(prev);

      // If user toggled historical atlas
      if (layer === 'historical_atlas') {
        if (next.has('historical_atlas')) {
          next.delete('historical_atlas');
        } else {
          next.add('historical_atlas');
        }
        return next;
      }

      // If user clicked a demographic choropleth layer
      if (DEMOGRAPHIC_LAYERS.includes(layer)) {
        if (next.has(layer)) {
          // Clicking active one toggles it off
          next.delete(layer);
        } else {
          // Switch to this demographic layer: clear other demographics and clear soils
          DEMOGRAPHIC_LAYERS.forEach(d => next.delete(d));
          next.delete('soils');
          next.add(layer);
        }
        return next;
      }

      // If user clicked Soil Geography
      if (layer === 'soils') {
        if (next.has('soils')) {
          next.delete('soils');
        } else {
          // Activating soils clears conflicting demographic fills so soils display immediately!
          DEMOGRAPHIC_LAYERS.forEach(d => next.delete(d));
          next.add('soils');
        }
        return next;
      }

      // Independent overlay layers
      if (next.has(layer)) {
        next.delete(layer);
        if (layer === 'environmental_change' && selectedFeature?.type === 'environmental_change') {
          setSelectedFeature(null);
        }
      } else {
        next.add(layer);
      }
      return next;
    });
  };

  const handleResetLayers = () => {
    setActiveLayers(new Set<ActiveLayer>());
    setTradeCategories(new Set(ALL_TRADE_CATEGORIES));
    setSelectedHistoricalPeriod('maurya');
    setIsTimelineOpen(false);
    setSelectedFeature(null);
  };

  const handleResetView = () => {
    setSearchTarget({
      lat: 22.5937,
      lng: 78.9629,
      zoom: 4.8,
      pitch: is3D ? 52 : 0,
      bearing: is3D ? -8 : 0,
      name: 'India'
    });
    setSelectedFeature(null);
  };

  const activeEraMeta = HISTORICAL_ERAS.find(e => e.id === selectedHistoricalPeriod) || HISTORICAL_ERAS[0];

  // --- Mobile bottom-sheet (feature dossier) drag state ---
  // Heights are percentages of the map area (workspace) so the sheet never
  // grows above the header — the drag handle always stays reachable.
  const SHEET_HALF_PCT = 60;
  const SHEET_FULL_PCT = 100;
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [sheetDragPct, setSheetDragPct] = useState<number | null>(null);
  const sheetDragRef = useRef<{ startY: number; startPct: number; moved: boolean } | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const sheetAreaHeight = () => workspaceRef.current?.clientHeight || window.innerHeight;

  const onSheetTouchStart = (e: any) => {
    sheetDragRef.current = {
      startY: e.touches[0].clientY,
      startPct: sheetExpanded ? SHEET_FULL_PCT : SHEET_HALF_PCT,
      moved: false
    };
  };

  const onSheetTouchMove = (e: any) => {
    const ref = sheetDragRef.current;
    if (!ref) return;
    const dy = ref.startY - e.touches[0].clientY;
    if (Math.abs(dy) > 8) ref.moved = true;
    const pct = (dy / sheetAreaHeight()) * 100;
    setSheetDragPct(Math.max(35, Math.min(SHEET_FULL_PCT, ref.startPct + pct)));
  };

  const onSheetTouchEnd = () => {
    const ref = sheetDragRef.current;
    if (ref) {
      if (ref.moved) {
        const current = sheetDragPct ?? (sheetExpanded ? SHEET_FULL_PCT : SHEET_HALF_PCT);
        setSheetExpanded(current > (SHEET_HALF_PCT + SHEET_FULL_PCT) / 2);
      } else {
        setSheetExpanded((v) => !v);
      }
    }
    setSheetDragPct(null);
    sheetDragRef.current = null;
  };

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#030712] overflow-hidden select-none">
      {/* Cinematic Splash Loading Screen */}
      <LoadingScreen isLoading={isLoading} />

      {/* Top Navigation */}
      <TopNavBar
        is3D={is3D}
        setIs3D={setIs3D}
        terrainExaggeration={terrainExaggeration}
        setTerrainExaggeration={setTerrainExaggeration}
        basemapStyle={basemapStyle}
        setBasemapStyle={setBasemapStyle}
        onSearchSelect={setSearchTarget}
        onResetView={handleResetView}
        onOpenSourceModal={() => setIsSourceModalOpen(true)}
        onOpenComparison={() => setIsComparisonModalOpen(true)}
        onOpenEcoComparison={() => {
          if (isEcoComparisonOpen) {
            setIsEcoComparisonOpen(false);
          } else {
            openEcoComparison();
          }
        }}
        isEcoComparisonOpen={isEcoComparisonOpen}
        selectedFeature={selectedFeature}
        isElevationHighlight={isElevationHighlight}
        setIsElevationHighlight={setIsElevationHighlight}
      />

      {/* Main Workspace Layout */}
      <div ref={workspaceRef} className="flex flex-1 relative overflow-hidden">
        {/* Collapsible Left Layer Navigation (desktop inline column with snappy smooth slide) */}
        <div
          className={`hidden md:block transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-20 overflow-hidden ${
            isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-80 h-full">
            <SidebarNav
              activeLayers={activeLayers}
              toggleLayer={toggleLayer}
              religionFilter={religionFilter}
              setReligionFilter={setReligionFilter}
              selectedEraId={selectedHistoricalPeriod}
              onSelectEra={(era) => {
                setSelectedHistoricalPeriod(era);
                if (!activeLayers.has('historical_atlas')) {
                  toggleLayer('historical_atlas');
                }
              }}
              isTimelineOpen={isTimelineOpen}
              onToggleTimeline={() => setIsTimelineOpen(!isTimelineOpen)}
              tradeCategories={tradeCategories}
              toggleTradeCategory={toggleTradeCategory}
              onSelectAllTradeCategories={selectAllTradeCategories}
              onClearTradeCategories={clearTradeCategories}
              onResetLayers={handleResetLayers}
              onOpenSoilSources={() => setIsSoilModalOpen(true)}
              environmentalPillars={environmentalPillars}
              toggleEnvironmentalPillar={toggleEnvironmentalPillar}
              onSelectAllEnvironmentalPillars={selectAllEnvironmentalPillars}
              onClearEnvironmentalPillars={clearEnvironmentalPillars}
              onOpenComparisonDeck={() => openEcoComparison()}
            />
          </div>
        </div>

        {/* Mobile Sidebar Drawer with Backdrop */}
        <div
          className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div
            className={`absolute left-0 top-0 bottom-0 w-[85vw] max-w-[320px] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          >
            <SidebarNav
              activeLayers={activeLayers}
              toggleLayer={toggleLayer}
              religionFilter={religionFilter}
              setReligionFilter={setReligionFilter}
              selectedEraId={selectedHistoricalPeriod}
              onSelectEra={(era) => {
                setSelectedHistoricalPeriod(era);
                if (!activeLayers.has('historical_atlas')) {
                  toggleLayer('historical_atlas');
                }
              }}
              isTimelineOpen={isTimelineOpen}
              onToggleTimeline={() => setIsTimelineOpen(!isTimelineOpen)}
              tradeCategories={tradeCategories}
              toggleTradeCategory={toggleTradeCategory}
              onSelectAllTradeCategories={selectAllTradeCategories}
              onClearTradeCategories={clearTradeCategories}
              onResetLayers={handleResetLayers}
              onOpenSoilSources={() => setIsSoilModalOpen(true)}
              environmentalPillars={environmentalPillars}
              toggleEnvironmentalPillar={toggleEnvironmentalPillar}
              onSelectAllEnvironmentalPillars={selectAllEnvironmentalPillars}
              onClearEnvironmentalPillars={clearEnvironmentalPillars}
              onOpenComparisonDeck={() => openEcoComparison()}
            />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-3 right-3 z-50 p-1.5 rounded-lg bg-slate-900/90 text-neutral-300 border border-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute z-50 top-3 ${
            isSidebarOpen ? 'hidden md:flex left-[324px]' : 'flex left-3'
          } p-1.5 rounded-lg bg-slate-900/90 text-[#C9A227] border border-[#C9A227]/40 hover:bg-slate-800 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xl backdrop-blur-md cursor-pointer`}
          title={isSidebarOpen ? 'Collapse Sidebar' : 'Open Sidebar'}
        >
          {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>

        {/* Central 3D Interactive Map */}
        <main className="flex-1 h-full relative overflow-hidden bg-[#030712]">
          <MapEngine
            activeLayers={activeLayers}
            religionFilter={religionFilter}
            basemapStyle={basemapStyle}
            is3D={is3D}
            terrainExaggeration={terrainExaggeration}
            demographicsData={demographicsData}
            onSelectFeature={setSelectedFeature}
            selectedFeature={selectedFeature}
            searchTarget={searchTarget}
            isElevationHighlight={isElevationHighlight}
            selectedHistoricalPeriod={selectedHistoricalPeriod}
            tradeCategories={tradeCategories}
          />

          {/* Dynamic Active Legends Overlay */}
          <div className="absolute bottom-4 right-3 md:bottom-6 md:right-6 z-20 pointer-events-none flex flex-col gap-2.5 max-h-[70vh] overflow-y-auto max-w-[calc(100vw-1.5rem)]">

            {/* Environmental Change & Climate Explorer Legend */}
            {activeLayers.has('environmental_change') && (
              <div className="glass-panel-glow rounded-xl p-3 shadow-2xl text-xs pointer-events-auto min-w-[240px] border border-emerald-500/40 font-mono">
                <div className="font-bold text-emerald-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Environmental Change ({environmentalPillars.size}/8)</span>
                  </span>
                  {comparisonConfig.isDeltaMode && (
                    <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/30">
                      Δ MODE
                    </span>
                  )}
                </div>

                {comparisonConfig.isDeltaMode ? (
                  <div className="space-y-1 text-[11px] font-bold">
                    <span className="flex items-center gap-1.5 text-red-400"><span className="w-2.5 h-2.5 rounded bg-[#ef4444] inline-block"/>Severe Degradation / Loss</span>
                    <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2.5 h-2.5 rounded bg-[#f59e0b] inline-block"/>High Vulnerability / Stress</span>
                    <span className="flex items-center gap-1.5 text-yellow-300"><span className="w-2.5 h-2.5 rounded bg-[#eab308] inline-block"/>Moderate / Cautious Monitor</span>
                    <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded bg-[#10b981] inline-block"/>Stable / Conservation Recovery</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-bold pt-1 border-t border-white/5">
                    {environmentalPillars.has('forest_change') && (
                      <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-[#10b981] inline-block"/>Forest Cover</span>
                    )}
                    {environmentalPillars.has('glacier_retreat') && (
                      <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-[#06b6d4] inline-block"/>Glacier Retreat</span>
                    )}
                    {environmentalPillars.has('urban_expansion') && (
                      <span className="flex items-center gap-1 text-orange-400"><span className="w-2 h-2 rounded-full bg-[#f97316] inline-block"/>Urban Sprawl</span>
                    )}
                    {environmentalPillars.has('coastal_erosion') && (
                      <span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-full bg-[#ef4444] inline-block"/>Coastal Erosion</span>
                    )}
                    {environmentalPillars.has('wetland_change') && (
                      <span className="flex items-center gap-1 text-blue-400"><span className="w-2 h-2 rounded-full bg-[#3b82f6] inline-block"/>Wetlands</span>
                    )}
                    {environmentalPillars.has('desertification') && (
                      <span className="flex items-center gap-1 text-yellow-400"><span className="w-2 h-2 rounded-full bg-[#eab308] inline-block"/>Desertification</span>
                    )}
                    {environmentalPillars.has('groundwater_stress') && (
                      <span className="flex items-center gap-1 text-purple-400"><span className="w-2 h-2 rounded-full bg-[#a855f7] inline-block"/>Groundwater</span>
                    )}
                    {environmentalPillars.has('river_avulsion') && (
                      <span className="flex items-center gap-1 text-teal-400"><span className="w-2 h-2 rounded-full bg-[#14b8a6] inline-block"/>River Avulsion</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Historical Atlas Legend */}
            {activeLayers.has('historical_atlas') && (
              <div className="glass-panel-glow rounded-xl p-3.5 shadow-2xl text-xs pointer-events-auto min-w-[240px] border border-amber-500/40 font-mono">
                <div className="font-bold text-white mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Landmark className="w-4 h-4 text-amber-400" />
                    <span>{activeEraMeta.name}</span>
                  </span>
                  <span className="text-[10px] text-amber-400 px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 font-bold">
                    {activeEraMeta.yearApprox}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                  Capital: <strong className="text-white">{activeEraMeta.capital}</strong> • Sphere of Dynastic Control
                </div>
                <div className="mt-1.5 text-[10px] text-amber-300/80 font-mono italic">
                  Approximate scholarly reconstruction based on ASI &amp; Imperial records.
                </div>
              </div>
            )}

            {/* Archaeology Sites Legend */}
            {activeLayers.has('archaeological_sites') && (
              <div className="glass-panel-glow rounded-xl p-3 shadow-2xl text-xs pointer-events-auto min-w-[220px] border border-teal-500/40 font-mono">
                <div className="font-bold text-teal-300 mb-1.5 flex items-center gap-1.5">
                  <Scroll className="w-3.5 h-3.5 text-teal-400" />
                  <span>ASI Archaeological Sites</span>
                </div>
                <div className="grid grid-cols-1 gap-1 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-teal-300"><span className="w-2.5 h-2.5 rounded-full bg-[#14b8a6] inline-block"/>Indus Valley Settlements</span>
                  <span className="flex items-center gap-1.5 text-amber-300"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block"/>Ancient Universities</span>
                  <span className="flex items-center gap-1.5 text-purple-300"><span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6] inline-block"/>Buddhist Monasteries</span>
                  <span className="flex items-center gap-1.5 text-rose-300"><span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] inline-block"/>Rock-Cut Temples</span>
                  <span className="flex items-center gap-1.5 text-cyan-300"><span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] inline-block"/>Ancient Ports</span>
                </div>
              </div>
            )}

            {/* Trade Routes & Connectivity Legend */}
            {activeLayers.has('trade_routes') && (
              <div className="glass-panel-glow rounded-xl p-3 shadow-2xl text-xs pointer-events-auto min-w-[230px] border border-sky-500/40 font-mono">
                <div className="font-bold text-sky-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-sky-400" />
                    <span>Trade &amp; Connectivity</span>
                  </span>
                  <span className="text-[10px] text-sky-400 font-bold bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-500/30">
                    {tradeCategories.size}/7
                  </span>
                </div>
                <div className="space-y-1 text-[11px] font-bold">
                  {tradeCategories.has('ancient_highway') && (
                    <span className="flex items-center gap-1.5 text-amber-400"><span className="w-3 h-1 bg-[#f59e0b] inline-block"/>Ancient Trade Networks</span>
                  )}
                  {tradeCategories.has('maritime_route') && (
                    <span className="flex items-center gap-1.5 text-sky-400"><span className="w-3 h-1 bg-[#0ea5e9] inline-block"/>Indian Ocean Maritime</span>
                  )}
                  {tradeCategories.has('silk_road') && (
                    <span className="flex items-center gap-1.5 text-purple-400"><span className="w-3 h-1 bg-[#a855f7] inline-block"/>Silk Road Connections</span>
                  )}
                  {tradeCategories.has('spice_route') && (
                    <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-3 h-1 bg-[#10b981] inline-block"/>Spice Trade Routes</span>
                  )}
                  {tradeCategories.has('ancient_port') && (
                    <span className="flex items-center gap-1.5 text-amber-300"><span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] border border-white inline-block"/>Ancient Ports (10 Emporia)</span>
                  )}
                  {tradeCategories.has('colonial_network') && (
                    <span className="flex items-center gap-1.5 text-indigo-400"><span className="w-3 h-1 bg-[#6366f1] inline-block"/>Colonial Trade Networks</span>
                  )}
                  {tradeCategories.has('historical_railway') && (
                    <span className="flex items-center gap-1.5 text-rose-400"><span className="w-3 h-1 border-b-2 border-dashed border-[#e11d48] inline-block"/>Historical Railways (1853–1905)</span>
                  )}
                </div>
              </div>
            )}

            {/* Roads & Highways Legend */}
            {activeLayers.has('roads') && (
              <div className="glass-panel-glow rounded-xl p-3 shadow-2xl text-xs pointer-events-auto min-w-[220px] border border-orange-500/40 font-mono">
                <div className="font-bold text-orange-300 mb-1 flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5 text-orange-400" />
                  <span>National Highways &amp; Expressways</span>
                </div>
                <div className="space-y-1 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-3 h-1 bg-[#10b981] inline-block"/>Expressway (Tolled)</span>
                  <span className="flex items-center gap-1.5 text-amber-400"><span className="w-3 h-1 bg-[#f59e0b] inline-block"/>National Highway (NH)</span>
                  <span className="flex items-center gap-1.5 text-slate-300"><span className="w-3 h-1 bg-[#94a3b8] inline-block"/>State Highway / Corridor</span>
                </div>
              </div>
            )}

            {/* Seismic Hazard Legend */}
            {activeLayers.has('disaster_seismic') && (
              <div className="glass-panel-glow rounded-xl p-3 shadow-2xl text-xs pointer-events-auto min-w-[220px] border border-rose-500/40 font-mono">
                <div className="font-bold text-rose-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>BIS Seismic Risk (IS 1893)</span>
                  </span>
                </div>
                <div className="space-y-1 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-red-400"><span className="w-2.5 h-2.5 rounded bg-[#ef4444] inline-block"/>Zone V: Very High Risk (Z=0.36)</span>
                  <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2.5 h-2.5 rounded bg-[#f97316] inline-block"/>Zone IV: High Risk (Z=0.24)</span>
                  <span className="flex items-center gap-1.5 text-rose-300"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-white inline-block"/>Major Historical Epicenter</span>
                </div>
              </div>
            )}

            {/* Elevation Legend */}
            {isElevationHighlight && (
              <div className="glass-panel-glow rounded-xl p-4 shadow-2xl text-sm pointer-events-auto min-w-[240px] border border-[#f59e0b]/50 font-mono">
                <div className="font-bold text-white mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#fef08a] text-sm">
                    <Mountain className="w-4 h-4 text-[#f59e0b]" />
                    <span>Pan-India Natural Elevation</span>
                  </span>
                  <span className="text-xs text-[#fef08a] px-2 py-0.5 rounded bg-[#f59e0b]/20 border border-[#f59e0b]/40 font-bold">
                    NATURAL RELIEF
                  </span>
                </div>
                <div className="text-xs text-neutral-200 font-sans mb-2.5 leading-relaxed font-semibold">
                  Natural hypsometric terrain shading and topographic summit peaks across India.
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden flex shadow-inner border border-white/10 mb-2">
                  <div className="h-full w-[15%] bg-[#3a929b]" title="Depressions & Coast (< 100 ft)" />
                  <div className="h-full w-[22%] bg-[#a4d5b2]" title="Plains & Lowlands (100 - 1,000 ft)" />
                  <div className="h-full w-[25%] bg-[#d9cbab]" title="Plateaus (1,000 - 3,500 ft)" />
                  <div className="h-full w-[20%] bg-[#c2410c]" title="Ghats & Highlands (3,500 - 9,000 ft)" />
                  <div className="h-full w-[18%] bg-gradient-to-r from-[#ea580c] to-[#fffbeb]" title="Great Himalayas (9,000 - 28,169 ft)" />
                </div>
                <div className="flex justify-between text-xs text-neutral-300 font-mono font-bold">
                  <span>-7 ft (Kuttanad)</span>
                  <span>8,842 ft (Anamudi)</span>
                  <span className="text-[#fef08a] font-extrabold">28,169 ft 3 in (Kangchenjunga)</span>
                </div>
              </div>
            )}

            {/* Population Density Legend */}
            {activeLayers.has('pop_density') && (
              <div className="glass-panel-glow rounded-xl p-4 shadow-2xl text-sm pointer-events-auto min-w-[220px]">
                <div className="font-bold text-white mb-1.5 flex items-center justify-between text-sm">
                  <span>Population Density</span>
                  <span className="text-xs text-cyan-300 font-mono font-bold">persons / km²</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs my-2">
                  <span className="w-6 h-3.5 rounded bg-[#fef08a]" title="<30" />
                  <span className="w-6 h-3.5 rounded bg-[#a3e635]" title="120" />
                  <span className="w-6 h-3.5 rounded bg-[#22c55e]" title="350" />
                  <span className="w-6 h-3.5 rounded bg-[#f59e0b]" title="650" />
                  <span className="w-6 h-3.5 rounded bg-[#ea580c]" title="1100" />
                  <span className="w-6 h-3.5 rounded bg-[#dc2626]" title="2500" />
                  <span className="w-6 h-3.5 rounded bg-[#7f1d1d]" title="10000+" />
                </div>
                <div className="flex justify-between text-xs text-neutral-300 font-mono font-bold">
                  <span>&lt;30</span>
                  <span>382 (Avg)</span>
                  <span>10,000+</span>
                </div>
              </div>
            )}

            {/* Soils Legend */}
            {activeLayers.has('soils') && (
              <div className="glass-panel-glow rounded-xl p-3.5 shadow-2xl text-sm pointer-events-auto min-w-[240px]">
                <div className="font-bold text-amber-300 text-sm mb-1.5 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <span>Soil Geography (ICAR)</span>
                    <button
                      onClick={() => setIsSoilModalOpen(true)}
                      className="p-0.5 rounded text-amber-400 hover:text-white transition-colors cursor-pointer"
                      title="Soil data sources & accuracy"
                      aria-label="Soil data sources and accuracy"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold">APPROX.</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-yellow-300"><span className="w-3 h-3 rounded bg-[#eab308] inline-block"/>Alluvial</span>
                  <span className="flex items-center gap-1.5 text-neutral-200"><span className="w-3 h-3 rounded bg-[#334155] inline-block"/>Black / Regur</span>
                  <span className="flex items-center gap-1.5 text-red-300"><span className="w-3 h-3 rounded bg-[#ef4444] inline-block"/>Red & Yellow</span>
                  <span className="flex items-center gap-1.5 text-orange-400"><span className="w-3 h-3 rounded bg-[#c2410c] inline-block"/>Laterite</span>
                  <span className="flex items-center gap-1.5 text-amber-300"><span className="w-3 h-3 rounded bg-[#f59e0b] inline-block"/>Arid / Desert</span>
                  <span className="flex items-center gap-1.5 text-green-300"><span className="w-3 h-3 rounded bg-[#15803d] inline-block"/>Mountain</span>
                  <span className="flex items-center gap-1.5 text-neutral-500"><span className="w-3 h-3 rounded bg-neutral-700 border border-dashed border-neutral-500 inline-block"/>Saline/Alkaline</span>
                  <span className="flex items-center gap-1.5 text-neutral-500"><span className="w-3 h-3 rounded bg-neutral-700 border border-dashed border-neutral-500 inline-block"/>Peaty/Marshy</span>
                </div>
                <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-amber-200/80 font-mono leading-relaxed">
                  Schematic approximation — not official NBSS&amp;LUP geometry. Dashed = not mapped.
                </div>
              </div>
            )}

            {/* Religion Legend */}
            {activeLayers.has('religion') && (
              <div className="glass-panel-glow rounded-xl p-3.5 shadow-2xl text-sm pointer-events-auto min-w-[200px]">
                <div className="font-bold text-purple-300 capitalize text-sm mb-1 flex items-center justify-between">
                  <span>{religionFilter} Share</span>
                  <span className="text-xs text-neutral-300 font-bold">Census C-01</span>
                </div>
                <div className="text-xs text-neutral-200 font-semibold">Choropleth Concentration by District</div>
              </div>
            )}

            {/* Literacy Legend */}
            {activeLayers.has('literacy') && (
              <div className="glass-panel-glow rounded-xl p-3.5 shadow-2xl text-sm pointer-events-auto min-w-[200px]">
                <div className="font-bold text-emerald-300 text-sm mb-1">District Literacy Rate</div>
                <div className="flex items-center gap-1.5 my-1.5">
                  <span className="w-7 h-3 rounded bg-[#ef4444]" />
                  <span className="w-7 h-3 rounded bg-[#f59e0b]" />
                  <span className="w-7 h-3 rounded bg-[#10b981]" />
                  <span className="w-7 h-3 rounded bg-[#059669]" />
                </div>
                <div className="flex justify-between text-xs text-neutral-300 font-mono font-bold">
                  <span>&lt;55%</span>
                  <span>74% (Avg)</span>
                  <span>&gt;90%</span>
                </div>
              </div>
            )}

            {/* Sex Ratio Legend */}
            {activeLayers.has('sex_ratio') && (
              <div className="glass-panel-glow rounded-xl p-3.5 shadow-2xl text-sm pointer-events-auto min-w-[200px]">
                <div className="font-bold text-rose-300 text-sm mb-1">Sex Ratio (F / 1000 M)</div>
                <div className="flex items-center gap-1.5 my-1.5">
                  <span className="w-8 h-3 rounded bg-[#f43f5e]" />
                  <span className="w-8 h-3 rounded bg-[#a855f7]" />
                  <span className="w-8 h-3 rounded bg-[#06b6d4]" />
                </div>
                <div className="flex justify-between text-xs text-neutral-300 font-mono font-bold">
                  <span>&lt;880</span>
                  <span>940 (Avg)</span>
                  <span>&gt;1000</span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Feature dossier — draggable bottom sheet on mobile, side panel on desktop with silky entrance */}
        {selectedFeature && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-30 flex w-full flex-col overflow-hidden rounded-t-2xl shadow-2xl sm:relative sm:inset-auto sm:h-full sm:w-96 sm:rounded-none sm:slide-in-from-right max-sm:slide-in-from-bottom-4 ${sheetDragPct == null ? 'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]' : ''} ${sheetDragPct == null ? (sheetExpanded ? 'h-full' : 'h-[60%]') : ''}`}
            style={sheetDragPct != null ? { height: `${sheetDragPct}%` } : undefined}
          >
            {/* Drag handle (mobile only) */}
            <div
              className="sm:hidden flex w-full shrink-0 cursor-grab touch-none flex-col items-center pt-2 pb-1 active:cursor-grabbing"
              onTouchStart={onSheetTouchStart}
              onTouchMove={onSheetTouchMove}
              onTouchEnd={onSheetTouchEnd}
            >
              <span className="h-1.5 w-10 rounded-full bg-white/30" />
              <span className="mt-0.5 text-[10px] font-mono text-neutral-500">
                {sheetExpanded ? 'Drag down for half view' : 'Drag up for full view'}
              </span>
            </div>
            <div className="min-h-0 flex-1">
              <InfoPanel
                feature={selectedFeature}
                onClose={() => setSelectedFeature(null)}
                comparisonConfig={comparisonConfig}
              />
            </div>
          </div>
        )}
      </div>


      {/* Environmental Year Comparison Tool Deck */}
      <EnvironmentalComparisonDeck
        isOpen={isEcoComparisonOpen}
        onClose={() => setIsEcoComparisonOpen(false)}
        activePillar={comparisonConfig.pillar}
        onSelectPillar={handleSelectPillarFromDeck}
        comparisonConfig={comparisonConfig}
        onUpdateConfig={updateComparisonConfig}
        onSelectHotspot={handleSelectHotspot}
        selectedFeatureId={selectedFeature?.properties?.id}
        selectedFeatureName={selectedFeature?.name}
        onFlyToCoordinates={(lat: number, lng: number, zoom?: number) => {
          if (!activeLayers.has('environmental_change')) {
            setActiveLayers(prev => new Set(prev).add('environmental_change'));
          }
          setSearchTarget({
            name: 'Environmental Site',
            lat,
            lng,
            zoom: zoom || 9,
            pitch: 50,
            type: 'environmental_change'
          });
        }}
      />

      {/* Universal Historical Timeline Slider - Docked at Bottom Center */}
      {isTimelineOpen && (
        <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl flex flex-col items-center gap-1.5 slide-in-from-bottom-4">
          {/* Small collapse / expand toggle, sitting above the timeline bar */}
          <button
            onClick={() => setIsTimelineCollapsed((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-[#C9A227] border border-[#C9A227]/40 hover:bg-slate-800 transition-colors shadow-lg backdrop-blur-md text-xs font-semibold cursor-pointer select-none"
            title={isTimelineCollapsed ? 'Expand timeline' : 'Collapse timeline'}
          >
            <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${isTimelineCollapsed ? '' : 'rotate-180'}`} />
            <span>{isTimelineCollapsed ? 'Show Timeline' : 'Hide Timeline'}</span>
          </button>

          <div className="w-full overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            {isTimelineCollapsed ? (
              <button
                onClick={() => setIsTimelineCollapsed(false)}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl glass-panel-glow border border-amber-500/40 text-left transition-all duration-300 hover:border-amber-400 cursor-pointer"
              >
                <span className="flex items-center gap-2 text-amber-300 font-semibold truncate text-sm min-w-0">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span className="truncate">{activeEraMeta.name}</span>
                </span>
                <span className="text-xs text-neutral-400 font-mono shrink-0">{activeEraMeta.yearApprox}</span>
              </button>
            ) : (
              <HistoricalTimeline
                currentEraId={selectedHistoricalPeriod}
                onSelectEra={(era) => {
                  setSelectedHistoricalPeriod(era);
                  if (!activeLayers.has('historical_atlas')) {
                    toggleLayer('historical_atlas');
                  }
                }}
                onClose={() => setIsTimelineOpen(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* State vs State Comparison Modal */}
      <StateComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
      />

      {/* Verified Sources Modal */}
      <SourceModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
      />

      {/* Soil Data Sources & Accuracy Modal */}
      <SoilDataModal
        isOpen={isSoilModalOpen}
        onClose={() => setIsSoilModalOpen(false)}
      />
    </div>
  );
}

export default App;
