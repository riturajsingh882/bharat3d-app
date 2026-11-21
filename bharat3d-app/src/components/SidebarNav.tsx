import React, { useState } from 'react';
import { Leaf, Building2, Droplets, Sun, Gauge, Calendar, Activity, Flame, Wind, Radio } from 'lucide-react';
import { 
  Mountain, 
  MapPin, 
  Waves, 
  TreePine, 
  Users, 
  PieChart, 
  ChevronDown, 
  Type, 
  RotateCcw,
  Route,
  Landmark,
  Compass,
  Scroll,
  AlertTriangle,
  Clock,
  Info,
  Anchor,
  Train,
  Globe
} from 'lucide-react';
import type { ActiveLayer, HistoricalPeriodId, ReligionFilter, TradeCategory, EnvironmentalPillar, DisasterHazardType, DisasterRegion, HistoricalDisasterEvent } from '../types';
import { HISTORICAL_ERAS } from '../data/historicalEras';
import { HISTORICAL_DISASTER_EVENTS } from '../data/disasterIntelligence';
import { BharatLogo } from './BharatLogo';

// Small status light on each main section header:
// green = at least one layer in the section is active (shown on the map),
// red = no layer in the section is active.
const ActiveDot: React.FC<{ on: boolean }> = ({ on }) => (
  <span
    className={`h-2 w-2 shrink-0 rounded-full ${on ? 'bg-emerald-400 shadow-[0_0_7px_#34d399]' : 'bg-rose-500 shadow-[0_0_7px_#f43f5e]'}`}
    title={on ? 'Active — a layer here is shown on the map' : 'Inactive — no layer here is shown'}
    aria-label={on ? 'Section active' : 'Section inactive'}
  />
);

interface SidebarNavProps {
  activeLayers: Set<ActiveLayer>;
  toggleLayer: (layer: ActiveLayer) => void;
  religionFilter: ReligionFilter;
  setReligionFilter: (rel: ReligionFilter) => void;
  selectedEraId: HistoricalPeriodId;
  onSelectEra: (era: HistoricalPeriodId) => void;
  isTimelineOpen: boolean;
  onToggleTimeline: () => void;
  tradeCategories: Set<TradeCategory>;
  toggleTradeCategory: (cat: TradeCategory) => void;
  onSelectAllTradeCategories: () => void;
  onClearTradeCategories: () => void;
  onResetLayers?: () => void;
  onOpenSoilSources?: () => void;
  environmentalPillars?: Set<EnvironmentalPillar>;
  toggleEnvironmentalPillar?: (pillar: EnvironmentalPillar) => void;
  onSelectAllEnvironmentalPillars?: () => void;
  onClearEnvironmentalPillars?: () => void;
  onOpenComparisonDeck?: () => void;
  disasterHazardTypes?: Set<DisasterHazardType>;
  toggleDisasterHazardType?: (type: DisasterHazardType) => void;
  onSelectAllDisasterHazards?: () => void;
  onClearDisasterHazards?: () => void;
  disasterRegionFilter?: DisasterRegion;
  setDisasterRegionFilter?: (region: DisasterRegion) => void;
  isDisasterTimelineOpen?: boolean;
  onToggleDisasterTimeline?: () => void;
  onSelectDisasterEvent?: (event: HistoricalDisasterEvent) => void;
  selectedDisasterEventId?: string | null;
  onResetDisasterFocus?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeLayers,
  toggleLayer,
  religionFilter,
  setReligionFilter,
  selectedEraId,
  onSelectEra,
  isTimelineOpen,
  onToggleTimeline,
  tradeCategories,
  toggleTradeCategory,
  onSelectAllTradeCategories,
  onClearTradeCategories,
  onResetLayers,
  onOpenSoilSources,
  environmentalPillars = new Set(),
  toggleEnvironmentalPillar = () => {},
  onSelectAllEnvironmentalPillars = () => {},
  onClearEnvironmentalPillars = () => {},
  onOpenComparisonDeck = () => {},
  disasterHazardTypes = new Set(['seismic_zone', 'earthquake', 'cyclone', 'flood', 'landslide', 'drought', 'tsunami', 'heatwave']),
  toggleDisasterHazardType = () => {},
  onSelectAllDisasterHazards = () => {},
  onClearDisasterHazards = () => {},
  disasterRegionFilter = 'all',
  setDisasterRegionFilter = () => {},
  isDisasterTimelineOpen = false,
  onToggleDisasterTimeline = () => {},
  onSelectDisasterEvent = () => {},
  selectedDisasterEventId = null,
  onResetDisasterFocus
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    historical: false,
    historyTimeline: false,
    archaeology: false,
    trade: false,
    environmental: false,
    roads: false,
    disaster: false,
    disasterTimeline: false,
    political: false,
    soils: false,
    demographics: false,
    hydro: false,
    physical: false
  });

  const toggleSection = (sec: string) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const sectionActive = (layers: ActiveLayer[]) => layers.some((l) => activeLayers.has(l));

  const currentEra = HISTORICAL_ERAS.find(e => e.id === selectedEraId) || HISTORICAL_ERAS[0];

  return (
    <aside className="w-full h-full bg-[#080a0e]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col z-20 text-neutral-200 select-none shadow-2xl overflow-hidden font-sans">
      {/* Brand Header with fresh new BHARAT 3D logo */}
      <div className="p-4 border-b border-white/10 bg-[#0a0d14]/90 flex items-center justify-between">
        <BharatLogo size="md" showSubtitle={true} />
      </div>

      {/* Layer Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {/* ======================================================== */}
        {/* 1. HISTORICAL ATLAS */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden border border-amber-500/30">
          <button
            onClick={() => toggleSection('historical')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-amber-300 hover:text-amber-200 transition-colors bg-[#17130d] cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <ActiveDot on={sectionActive(['historical_atlas'])} />
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>Historical Atlas</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${openSections.historical ? 'is-open text-white' : ''}`} />
          </button>
          
          <div className={`accordion-collapse ${openSections.historical ? 'is-open' : ''}`}>
            <div>
              <div className="p-2 space-y-2 bg-[#0d1016]">
                {/* Toggle Layer */}
                <button
                  onClick={() => toggleLayer('historical_atlas')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('historical_atlas')
                      ? 'bg-amber-500/20 text-white border border-amber-500/50 border-l-3 border-l-amber-500 font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('historical_atlas') ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-neutral-600'}`} />
                    <span>Show Historical Empires</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold">12 Eras</span>
                </button>

                {/* Quick Era Selector List */}
                <div className="pt-2 px-1 space-y-1 bg-[#131720] border border-white/5 rounded-lg p-2 text-xs font-mono">
                  <div className="text-[11px] font-bold text-neutral-400 mb-1.5 flex justify-between">
                    <span>ACTIVE DYNASTY / ERA:</span>
                    <span className="text-amber-400 font-bold">{currentEra.yearApprox}</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                    {HISTORICAL_ERAS.map((era) => (
                      <button
                        key={era.id}
                        onClick={() => {
                          onSelectEra(era.id);
                          if (!activeLayers.has('historical_atlas')) {
                            toggleLayer('historical_atlas');
                          }
                        }}
                        className={`w-full px-2 py-1.5 rounded text-left transition-all flex items-center justify-between cursor-pointer ${
                          selectedEraId === era.id
                            ? 'bg-amber-500/25 text-white font-bold border border-amber-400/40 shadow-sm'
                            : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{era.name}</span>
                        <span className="text-[10px] text-neutral-400 ml-1 shrink-0 font-normal">{era.capital.split('/')[0].split('&')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1.5 INDIAN HISTORY TIMELINE */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden border border-indigo-500/30">
          <button
            onClick={() => toggleSection('historyTimeline')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-indigo-300 hover:text-indigo-200 transition-colors bg-[#12101d] cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <ActiveDot on={isTimelineOpen} />
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Indian History Timeline</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${openSections.historyTimeline ? 'is-open text-white' : ''}`} />
          </button>

          <div className={`accordion-collapse ${openSections.historyTimeline ? 'is-open' : ''}`}>
            <div>
              <div className="p-2 space-y-1.5 bg-[#0d1016]">
                <button
                  onClick={onToggleTimeline}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer border ${
                    isTimelineOpen
                      ? 'bg-indigo-500 text-slate-950 border-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.4)]'
                      : 'bg-white/5 hover:bg-white/10 text-indigo-300 border-indigo-500/30'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isTimelineOpen ? 'Hide Timeline' : 'Open Timeline'}</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-bold">SLIDER</span>
                </button>
                <div className="px-3 py-2 text-xs font-mono font-semibold text-neutral-300 leading-relaxed bg-[#131720] rounded-lg">
                  Scroll through 13 eras, from the Indus Valley to the present-day Republic.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. CIVILIZATIONS & ARCHAEOLOGY */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden border border-teal-500/30">
          <button
            onClick={() => toggleSection('archaeology')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-teal-300 hover:text-teal-200 transition-colors bg-[#0b1717] cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <ActiveDot on={sectionActive(['archaeological_sites'])} />
              <Scroll className="w-4 h-4 text-teal-400" />
              <span>Civilizations & Archaeology</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${openSections.archaeology ? 'is-open text-white' : ''}`} />
          </button>
          
          <div className={`accordion-collapse ${openSections.archaeology ? 'is-open' : ''}`}>
            <div>
              <div className="p-2 space-y-1.5 bg-[#0d1016]">
                <button
                  onClick={() => toggleLayer('archaeological_sites')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('archaeological_sites')
                      ? 'bg-teal-500/20 text-white border border-teal-500/50 border-l-3 border-l-teal-500 font-bold shadow-[0_0_12px_rgba(20,184,166,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('archaeological_sites') ? 'bg-teal-400 shadow-[0_0_8px_#14b8a6]' : 'bg-neutral-600'}`} />
                    <span>Verified ASI Sites</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-500/40 font-bold">18 Sites</span>
                </button>

                <div className="px-3 py-2 text-xs font-mono font-semibold text-neutral-300 space-y-1 bg-[#131720] rounded-lg">
                  <div className="text-teal-300 font-bold">• Indus Valley: Harappa, Mohenjo-daro, Dholavira, Lothal, Rakhigarhi</div>
                  <div className="text-amber-300 font-bold">• Universities: Nalanda, Taxila, Vikramashila</div>
                  <div className="text-sky-300 font-bold">• Buddhist: Sanchi, Bodh Gaya, Sarnath</div>
                  <div className="text-rose-300 font-bold">• Rock-Cut: Ajanta, Ellora, Hampi, Konark</div>
                  <div className="text-emerald-300 font-bold">• Ancient Ports: Muziris, Arikamedu</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. TRADE ROUTES & CONNECTIVITY */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden border border-sky-500/30">
          <button
            onClick={() => toggleSection('trade')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-sky-300 hover:text-sky-200 transition-colors bg-[#0b141d] cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <ActiveDot on={sectionActive(['trade_routes'])} />
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Trade Routes &amp; Connectivity</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${openSections.trade ? 'is-open text-white' : ''}`} />
          </button>
          
          <div className={`accordion-collapse ${openSections.trade ? 'is-open' : ''}`}>
            <div>
              <div className="p-2 space-y-2 bg-[#0d1016]">
                {/* Master Toggle */}
                <button
                  onClick={() => toggleLayer('trade_routes')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('trade_routes')
                      ? 'bg-sky-500/20 text-white border border-sky-500/50 border-l-3 border-l-sky-500 font-bold shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('trade_routes') && tradeCategories.size === 7 ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]' : activeLayers.has('trade_routes') ? 'bg-sky-400/70' : 'bg-neutral-600'}`} />
                    <span>All Trade &amp; Connectivity</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/40 font-bold">
                    {activeLayers.has('trade_routes') && tradeCategories.size < 7 ? `${tradeCategories.size} Active` : '27 Features'}
                  </span>
                </button>

                {/* Quick actions */}
                <div className="flex items-center justify-between px-1 text-[11px] font-mono">
                  <span className="text-neutral-400 font-bold">
                    Active Pillars: <span className="text-sky-300">{activeLayers.has('trade_routes') ? tradeCategories.size : 0}/7</span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={onSelectAllTradeCategories}
                      className="text-[10px] text-sky-400 hover:text-sky-200 underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-neutral-600">•</span>
                    <button
                      onClick={onClearTradeCategories}
                      className="text-[10px] text-neutral-400 hover:text-neutral-200 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* 7 Individual Thematic Category Filters */}
                <div className="space-y-1 pt-1 border-t border-white/5">
                  {/* 1. Ancient Trade Networks */}
                  <button
                    onClick={() => toggleTradeCategory('ancient_highway')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('trade_routes') && tradeCategories.has('ancient_highway')
                        ? 'bg-amber-950/60 text-amber-200 border border-amber-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('trade_routes') && tradeCategories.has('ancient_highway') ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-neutral-600'}`} />
                      <Landmark className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ancient Trade Networks</span>
                    </span>
                    <span className="text-[10px] text-amber-400/80">3 routes</span>
                  </button>

                  {/* 2. Indian Ocean Maritime Routes */}
                  <button
                    onClick={() => toggleTradeCategory('maritime_route')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('trade_routes') && tradeCategories.has('maritime_route')
                        ? 'bg-sky-950/60 text-sky-200 border border-sky-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('trade_routes') && tradeCategories.has('maritime_route') ? 'bg-sky-400 shadow-[0_0_6px_#0ea5e9]' : 'bg-neutral-600'}`} />
                      <Waves className="w-3.5 h-3.5 text-sky-400" />
                      <span>Indian Ocean Maritime</span>
                    </span>
                    <span className="text-[10px] text-sky-400/80">2 routes</span>
                  </button>

                  {/* 3. Silk Road Connections */}
                  <button
                    onClick={() => toggleTradeCategory('silk_road')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('trade_routes') && tradeCategories.has('silk_road')
                        ? 'bg-purple-950/60 text-purple-200 border border-purple-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('trade_routes') && tradeCategories.has('silk_road') ? 'bg-purple-400 shadow-[0_0_6px_#a855f7]' : 'bg-neutral-600'}`} />
                      <Mountain className="w-3.5 h-3.5 text-purple-400" />
                      <span>Silk Road Connections</span>
                    </span>
                    <span className="text-[10px] text-purple-400/80">3 branches</span>
                  </button>

                  {/* 4. Spice Trade Routes */}
                  <button
                    onClick={() => toggleTradeCategory('spice_route')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('trade_routes') && tradeCategories.has('spice_route')
                        ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('trade_routes') && tradeCategories.has('spice_route') ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-neutral-600'}`} />
                      <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Spice Trade Routes</span>
                    </span>
                    <span className="text-[10px] text-emerald-400/80">2 circuits</span>
                  </button>

                  {/* 5. Ancient Ports */}
                  <button
                    onClick={() => toggleTradeCategory('ancient_port')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('trade_routes') && tradeCategories.has('ancient_port')
                        ? 'bg-amber-950/60 text-amber-200 border border-amber-400/50 font-bold shadow-[0_0_8px_rgba(251,191,36,0.2)]'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('trade_routes') && tradeCategories.has('ancient_port') ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' : 'bg-neutral-600'}`} />
                      <Anchor className="w-3.5 h-3.5 text-amber-300" />
                      <span>Ancient Ports &amp; Emporia</span>
                    </span>
                    <span className="text-[10px] text-amber-300 font-bold">10 ports</span>
                  </button>

                  {/* 6. Colonial Trade Networks */}
                  <button
                    onClick={() => toggleTradeCategory('colonial_network')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('trade_routes') && tradeCategories.has('colonial_network')
                        ? 'bg-indigo-950/60 text-indigo-200 border border-indigo-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('trade_routes') && tradeCategories.has('colonial_network') ? 'bg-indigo-400 shadow-[0_0_6px_#6366f1]' : 'bg-neutral-600'}`} />
                      <Globe className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Colonial Trade Networks</span>
                    </span>
                    <span className="text-[10px] text-indigo-400/80">3 corridors</span>
                  </button>

                  {/* 7. Historical Railway Development */}
                  <button
                    onClick={() => toggleTradeCategory('historical_railway')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('trade_routes') && tradeCategories.has('historical_railway')
                        ? 'bg-rose-950/60 text-rose-200 border border-rose-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('trade_routes') && tradeCategories.has('historical_railway') ? 'bg-rose-400 shadow-[0_0_6px_#e11d48]' : 'bg-neutral-600'}`} />
                      <Train className="w-3.5 h-3.5 text-rose-400" />
                      <span>Historical Railways (1853–1905)</span>
                    </span>
                    <span className="text-[10px] text-rose-400/80">4 lines</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* ======================================================== */}
        {/* 3.4 ENVIRONMENTAL CHANGE & CLIMATE EXPLORER */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden border border-emerald-500/30">
          <button
            onClick={() => toggleSection('environmental')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-emerald-300 hover:text-emerald-200 transition-colors bg-[#0a1614] cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <ActiveDot on={sectionActive(['environmental_change'])} />
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Environmental Change Explorer</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${openSections.environmental ? 'is-open text-white' : ''}`} />
          </button>
          
          <div className={`accordion-collapse ${openSections.environmental ? 'is-open' : ''}`}>
            <div>
              <div className="p-2 space-y-2 bg-[#0c1214]">
                {/* Master Toggle */}
                <button
                  onClick={() => toggleLayer('environmental_change')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('environmental_change')
                      ? 'bg-emerald-500/20 text-white border border-emerald-500/50 border-l-3 border-l-emerald-500 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('environmental_change') ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-neutral-600'}`} />
                    <span>Environmental Layer</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
                    42 Features
                  </span>
                </button>

                {/* Launch Year Comparison Tool Button */}
                <button
                  onClick={onOpenComparisonDeck}
                  className="w-full px-3 py-2 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-emerald-950/90 to-sky-950/90 hover:from-emerald-900/90 hover:to-sky-900/90 text-emerald-200 border border-emerald-500/40 flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Year Comparison Tool</span>
                  <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                </button>

                {/* Sub-pillar Active Header & Quick Actions */}
                <div className="flex items-center justify-between px-1 text-[11px] font-mono">
                  <span className="text-neutral-400 font-bold">
                    Active Pillars: <span className="text-emerald-300">{environmentalPillars.size}/8</span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={onSelectAllEnvironmentalPillars}
                      className="text-[10px] text-emerald-400 hover:text-emerald-200 underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-neutral-600">•</span>
                    <button
                      onClick={onClearEnvironmentalPillars}
                      className="text-[10px] text-neutral-400 hover:text-neutral-200 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* 8 Granular Pillar Sub-Toggles */}
                <div className="space-y-1 pt-1 border-t border-white/5">
                  {/* 1. Forest Cover */}
                  <button
                    onClick={() => toggleEnvironmentalPillar('forest_change')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('environmental_change') && environmentalPillars.has('forest_change')
                        ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('environmental_change') && environmentalPillars.has('forest_change') ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-neutral-600'}`} />
                      <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Forest-Cover Changes (FSI)</span>
                    </span>
                    <span className="text-[10px] text-emerald-400/80">5 belts</span>
                  </button>

                  {/* 2. Glacier Retreat */}
                  <button
                    onClick={() => toggleEnvironmentalPillar('glacier_retreat')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('environmental_change') && environmentalPillars.has('glacier_retreat')
                        ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('environmental_change') && environmentalPillars.has('glacier_retreat') ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' : 'bg-neutral-600'}`} />
                      <Mountain className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Glacier Retreat (SAC-ISRO)</span>
                    </span>
                    <span className="text-[10px] text-cyan-400/80">6 snouts</span>
                  </button>

                  {/* 3. Urban Expansion */}
                  <button
                    onClick={() => toggleEnvironmentalPillar('urban_expansion')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('environmental_change') && environmentalPillars.has('urban_expansion')
                        ? 'bg-orange-950/60 text-orange-200 border border-orange-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('environmental_change') && environmentalPillars.has('urban_expansion') ? 'bg-orange-400 shadow-[0_0_6px_#f97316]' : 'bg-neutral-600'}`} />
                      <Building2 className="w-3.5 h-3.5 text-orange-400" />
                      <span>Urban Sprawl (NRSC LULC)</span>
                    </span>
                    <span className="text-[10px] text-orange-400/80">5 metros</span>
                  </button>

                  {/* 4. Coastal Erosion */}
                  <button
                    onClick={() => toggleEnvironmentalPillar('coastal_erosion')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('environmental_change') && environmentalPillars.has('coastal_erosion')
                        ? 'bg-rose-950/60 text-rose-200 border border-rose-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('environmental_change') && environmentalPillars.has('coastal_erosion') ? 'bg-rose-400 shadow-[0_0_6px_#ef4444]' : 'bg-neutral-600'}`} />
                      <Waves className="w-3.5 h-3.5 text-rose-400" />
                      <span>Coastal Erosion (NCCR-MoES)</span>
                    </span>
                    <span className="text-[10px] text-rose-400/80">5 coasts</span>
                  </button>

                  {/* 5. Wetland Changes */}
                  <button
                    onClick={() => toggleEnvironmentalPillar('wetland_change')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('environmental_change') && environmentalPillars.has('wetland_change')
                        ? 'bg-blue-950/60 text-blue-200 border border-blue-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('environmental_change') && environmentalPillars.has('wetland_change') ? 'bg-blue-400 shadow-[0_0_6px_#3b82f6]' : 'bg-neutral-600'}`} />
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      <span>Wetland Contraction (Ramsar)</span>
                    </span>
                    <span className="text-[10px] text-blue-400/80">6 lakes</span>
                  </button>

                  {/* 6. Desertification */}
                  <button
                    onClick={() => toggleEnvironmentalPillar('desertification')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('environmental_change') && environmentalPillars.has('desertification')
                        ? 'bg-yellow-950/60 text-yellow-200 border border-yellow-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('environmental_change') && environmentalPillars.has('desertification') ? 'bg-yellow-400 shadow-[0_0_6px_#eab308]' : 'bg-neutral-600'}`} />
                      <Sun className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Desertification &amp; Badlands</span>
                    </span>
                    <span className="text-[10px] text-yellow-400/80">5 zones</span>
                  </button>

                  {/* 7. Groundwater Stress */}
                  <button
                    onClick={() => toggleEnvironmentalPillar('groundwater_stress')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('environmental_change') && environmentalPillars.has('groundwater_stress')
                        ? 'bg-purple-950/60 text-purple-200 border border-purple-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('environmental_change') && environmentalPillars.has('groundwater_stress') ? 'bg-purple-400 shadow-[0_0_6px_#a855f7]' : 'bg-neutral-600'}`} />
                      <Gauge className="w-3.5 h-3.5 text-purple-400" />
                      <span>Groundwater Over-Draft (CGWB)</span>
                    </span>
                    <span className="text-[10px] text-purple-400/80">5 aquifers</span>
                  </button>

                  {/* 8. River Course Changes */}
                  <button
                    onClick={() => toggleEnvironmentalPillar('river_avulsion')}
                    className={`w-full px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeLayers.has('environmental_change') && environmentalPillars.has('river_avulsion')
                        ? 'bg-teal-950/60 text-teal-200 border border-teal-500/40 font-bold'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeLayers.has('environmental_change') && environmentalPillars.has('river_avulsion') ? 'bg-teal-400 shadow-[0_0_6px_#14b8a6]' : 'bg-neutral-600'}`} />
                      <Compass className="w-3.5 h-3.5 text-teal-400" />
                      <span>River Migration &amp; Avulsion</span>
                    </span>
                    <span className="text-[10px] text-teal-400/80">5 rivers</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3.5 NATIONAL HIGHWAYS & EXPRESSWAYS */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden border border-orange-500/30">
          <button
            onClick={() => toggleSection('roads')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-orange-300 hover:text-orange-200 transition-colors bg-[#1a110a] cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <ActiveDot on={sectionActive(['roads'])} />
              <Route className="w-4 h-4 text-orange-400" />
              <span>National Highways &amp; Expressways</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${openSections.roads ? 'is-open text-white' : ''}`} />
          </button>

          <div className={`accordion-collapse ${openSections.roads ? 'is-open' : ''}`}>
            <div>
              <div className="p-2 space-y-1.5 bg-[#0d1016]">
                <button
                  onClick={() => toggleLayer('roads')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('roads')
                      ? 'bg-orange-500/20 text-white border border-orange-500/50 border-l-3 border-l-orange-500 font-bold shadow-[0_0_12px_rgba(249,115,22,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('roads') ? 'bg-orange-400 shadow-[0_0_8px_#fb923c]' : 'bg-neutral-600'}`} />
                    <span>Show Road &amp; Highway Network</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-orange-950/80 text-orange-300 border border-orange-500/40 font-bold">28 Corridors</span>
                </button>

                <div className="px-3 py-2 text-xs font-mono font-semibold text-neutral-300 space-y-1 bg-[#131720] rounded-lg">
                  <div className="text-emerald-400 font-bold">• Expressways (access-controlled, tolled)</div>
                  <div className="text-amber-400 font-bold">• National Highways (NH grid &amp; corridors)</div>
                  <div className="text-slate-300 font-bold">• State Highways &amp; coastal corridors</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. DISASTER & HAZARD INTELLIGENCE */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden border border-rose-500/40">
          <button
            onClick={() => toggleSection('disaster')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-rose-300 hover:text-rose-200 transition-colors bg-[#1a0f12] cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <ActiveDot on={sectionActive(['disaster_seismic'])} />
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Disaster &amp; Hazard Intelligence</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${openSections.disaster ? 'is-open text-white' : ''}`} />
          </button>
          
          <div className={`accordion-collapse ${openSections.disaster ? 'is-open' : ''}`}>
            <div>
              <div className="p-2 space-y-2.5 bg-[#0d1016]">
                {/* Master Toggle */}
                <button
                  onClick={() => toggleLayer('disaster_seismic')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('disaster_seismic')
                      ? 'bg-rose-500/20 text-white border border-rose-500/50 border-l-3 border-l-rose-500 font-bold shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('disaster_seismic') ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-neutral-600'}`} />
                    <span>Disaster &amp; Seismic Hazards</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 font-bold">
                    NDMA / BIS
                  </span>
                </button>

                {/* Sub-controls when active */}
                {activeLayers.has('disaster_seismic') && (
                  <div className="space-y-2.5 pt-1">
                    {/* Hazard Category Toggles */}
                    <div className="bg-[#131720] p-2 rounded-lg border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-neutral-400">
                        <span>Hazards Active ({disasterHazardTypes.size}/8)</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={onSelectAllDisasterHazards}
                            className="text-rose-400 hover:text-rose-300 cursor-pointer"
                          >
                            Select All
                          </button>
                          <span>•</span>
                          <button
                            onClick={onClearDisasterHazards}
                            className="text-neutral-500 hover:text-neutral-300 cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {[
                          { id: 'seismic_zone' as DisasterHazardType, label: 'BIS Seismic Zones (IS 1893:2016)', sub: 'Zones II, III, IV, V PGA', icon: Radio, color: '#ef4444' },
                          { id: 'earthquake' as DisasterHazardType, label: 'Earthquake Epicenters & Magnitudes', sub: '1897 Shillong to 2015 Mw 8.6', icon: Activity, color: '#ef4444' },
                          { id: 'cyclone' as DisasterHazardType, label: 'Cyclone Tracks & Landfalls', sub: '1999 Odisha, Phailin, Amphan...', icon: Wind, color: '#c026d3' },
                          { id: 'flood' as DisasterHazardType, label: 'Flood-Prone Basins (CWC / NDMA)', sub: 'Brahmaputra, Kosi, Kerala...', icon: Waves, color: '#0284c7' },
                          { id: 'landslide' as DisasterHazardType, label: 'Landslide Susceptibility (GSI NLSM)', sub: 'Wayanad, Garhwal, Sikkim...', icon: Mountain, color: '#ea580c' },
                          { id: 'drought' as DisasterHazardType, label: 'Drought-Prone Regions (CWC / IMD)', sub: 'Marathwada, Rayalaseema, Thar', icon: Sun, color: '#b45309' },
                          { id: 'tsunami' as DisasterHazardType, label: 'Tsunami Hazard Zones (INCOIS)', sub: 'Coromandel, A&N, Andhra', icon: Waves, color: '#06b6d4' },
                          { id: 'heatwave' as DisasterHazardType, label: 'Heatwave Core Belts (IMD / NDMA)', sub: 'Vidarbha, Phalodi 51°C, Delhi', icon: Flame, color: '#e11d48' }
                        ].map(hazard => {
                          const active = disasterHazardTypes.has(hazard.id);
                          const HazardIcon = hazard.icon;
                          return (
                            <button
                              key={hazard.id}
                              onClick={() => toggleDisasterHazardType(hazard.id)}
                              className={`w-full px-2.5 py-1.5 rounded-md text-left transition-all cursor-pointer flex items-center justify-between text-xs font-mono ${
                                active
                                  ? 'bg-white/10 text-white font-bold border border-rose-500/40'
                                  : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200 border border-transparent opacity-60'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <HazardIcon className="w-3.5 h-3.5 shrink-0" style={{ color: active ? hazard.color : '#737373' }} />
                                <div className="truncate">
                                  <div className="truncate leading-tight">{hazard.label}</div>
                                  <div className="text-[9px] text-neutral-400 truncate font-normal">{hazard.sub}</div>
                                </div>
                              </div>
                              <span
                                className="w-2 h-2 rounded-full shrink-0 ml-1.5"
                                style={{ backgroundColor: active ? hazard.color : '#404040' }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. HISTORICAL DISASTER TIMELINE (SEPARATE STANDALONE) */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden border border-rose-500/40">
          <button
            onClick={() => toggleSection('disasterTimeline')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-rose-300 hover:text-rose-200 transition-colors bg-[#1a0f12] cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <ActiveDot on={isDisasterTimelineOpen || Boolean(selectedDisasterEventId)} />
              <Clock className="w-4 h-4 text-rose-400" />
              <span>Historical Disaster Timeline</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40">
                1897–2024
              </span>
              <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${openSections.disasterTimeline ? 'is-open text-white' : ''}`} />
            </div>
          </button>
          
          <div className={`accordion-collapse ${openSections.disasterTimeline ? 'is-open' : ''}`}>
            <div>
              <div className="p-2 space-y-2.5 bg-[#0d1016]">
                {/* Launch / Toggle Interactive Deck Button */}
                <button
                  onClick={onToggleDisasterTimeline}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-all cursor-pointer border ${
                    isDisasterTimelineOpen
                      ? 'bg-rose-600/30 text-rose-200 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.35)] font-bold'
                      : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    <span>Disaster Event Timeline Deck</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30">
                    {isDisasterTimelineOpen ? 'ACTIVE' : 'OPEN'}
                  </span>
                </button>

                {/* Geographic Zone Filter */}
                <div className="bg-[#131720] p-2 rounded-lg border border-white/5 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase font-bold text-neutral-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-rose-400" />
                      <span>Geographic Zone Filter</span>
                    </span>
                    <span className="text-[9px] text-rose-400 lowercase">{disasterRegionFilter}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
                    {[
                      { id: 'all' as DisasterRegion, label: '🌐 All India' },
                      { id: 'himalayan' as DisasterRegion, label: '🏔️ Himalayan Arc' },
                      { id: 'gangetic' as DisasterRegion, label: '🌾 Indo-Gangetic' },
                      { id: 'coastal' as DisasterRegion, label: '🏖️ Coastal Belts' },
                      { id: 'peninsular' as DisasterRegion, label: '🏜️ Peninsular' },
                      { id: 'northeast' as DisasterRegion, label: '🌿 Northeast' }
                    ].map(reg => (
                      <button
                        key={reg.id}
                        onClick={() => setDisasterRegionFilter(reg.id)}
                        className={`px-2 py-1 rounded text-left transition-all cursor-pointer ${
                          disasterRegionFilter === reg.id
                            ? 'bg-rose-500/30 text-white font-bold border border-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.25)]'
                            : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {reg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clutter-Free Focus Status / Reset Button */}
                {selectedDisasterEventId && (
                  <div className="bg-rose-950/40 border border-rose-500/40 p-2 rounded-lg flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-200 text-[10px] truncate">
                      ✨ Event Focus Active (Clutter-Free)
                    </span>
                    {onResetDisasterFocus && (
                      <button
                        onClick={onResetDisasterFocus}
                        className="text-[10px] px-2 py-0.5 rounded bg-rose-600/30 text-rose-200 hover:bg-rose-600/50 border border-rose-500/50 cursor-pointer shrink-0 font-bold"
                        title="Show all hazard layers again"
                      >
                        Show All
                      </button>
                    )}
                  </div>
                )}

                {/* Chronological Detailed Event Explorer */}
                <div className="bg-[#131720] p-2 rounded-lg border border-white/5 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase font-bold text-neutral-400 flex items-center justify-between">
                    <span>Chronological Events ({HISTORICAL_DISASTER_EVENTS.filter(e => disasterRegionFilter === 'all' || e.region === disasterRegionFilter).length})</span>
                    <span className="text-rose-400">1897–2024</span>
                  </div>
                  <div className="space-y-1 max-h-72 overflow-y-auto scrollbar-thin pr-1">
                    {HISTORICAL_DISASTER_EVENTS
                      .filter(e => disasterRegionFilter === 'all' || e.region === disasterRegionFilter)
                      .map(evt => {
                        const isSelected = selectedDisasterEventId === evt.id;
                        return (
                          <button
                            key={evt.id}
                            onClick={() => onSelectDisasterEvent(evt)}
                            className={`w-full p-2 rounded-lg text-left transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-rose-500/25 border-rose-400 text-white font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                                : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="font-mono text-[10px] font-bold text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/30">
                                {evt.year}
                              </span>
                              <span className="text-[10px] font-mono text-neutral-300 font-semibold truncate">
                                {evt.magnitudeOrIntensity}
                              </span>
                            </div>
                            <div className="text-xs font-semibold truncate leading-tight text-white">
                              {evt.name.replace(/^\d{4}\s*/, '')}
                            </div>
                            <div className="text-[9px] font-mono text-neutral-400 truncate mt-0.5">
                              📍 {evt.regionName}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. POLITICAL BOUNDARIES */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden">
          <button
            onClick={() => toggleSection('political')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-white hover:text-[#C9A227] transition-colors bg-[#131720] cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <ActiveDot on={sectionActive(['political_states', 'state_labels', 'political_districts'])} />
              <MapPin className="w-4 h-4 text-[#C9A227]" />
              Political Boundaries
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${openSections.political ? 'is-open text-white' : ''}`} />
          </button>
          
          <div className={`accordion-collapse ${openSections.political ? 'is-open' : ''}`}>
            <div>
              <div className="p-2 space-y-1.5 bg-[#0d1016]">
                <button
                  onClick={() => toggleLayer('political_states')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('political_states')
                      ? 'bg-[#C9A227]/15 text-white border border-[#C9A227]/50 border-l-3 border-l-[#C9A227] font-bold shadow-[0_0_12px_rgba(201,162,39,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('political_states') ? 'bg-[#C9A227] shadow-[0_0_8px_#C9A227]' : 'bg-neutral-600'}`} />
                    <span>State & UT Boundaries</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-neutral-200 border border-white/15 font-bold">36 Units</span>
                </button>

                <button
                  onClick={() => toggleLayer('state_labels')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('state_labels')
                      ? 'bg-[#C9A227]/15 text-white border border-[#C9A227]/50 border-l-3 border-l-[#C9A227] font-bold shadow-[0_0_12px_rgba(201,162,39,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-[#C9A227]" />
                    <span>State Name Labels</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-neutral-200 border border-white/15 font-bold">Typography</span>
                </button>

                <button
                  onClick={() => toggleLayer('political_districts')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('political_districts')
                      ? 'bg-[#C9A227]/15 text-white border border-[#C9A227]/50 border-l-3 border-l-[#C9A227] font-bold shadow-[0_0_12px_rgba(201,162,39,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('political_districts') ? 'bg-[#C9A227] shadow-[0_0_8px_#C9A227]' : 'bg-neutral-600'}`} />
                    <span>District Polygons</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-neutral-200 border border-white/15 font-bold">735 Units</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 7. SOIL GEOGRAPHY (ICAR) */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden">
          <button
            onClick={() => toggleSection('soils')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-white hover:text-amber-400 transition-colors bg-[#131720] cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <ActiveDot on={sectionActive(['soils'])} />
              <TreePine className="w-4 h-4 text-amber-500" />
              Soil Geography (ICAR)
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${openSections.soils ? 'is-open text-white' : ''}`} />
          </button>
          
          <div className={`accordion-collapse ${openSections.soils ? 'is-open' : ''}`}>
            <div>
              <div className="p-2 space-y-1.5 bg-[#0d1016]">
                <button
                  onClick={() => toggleLayer('soils')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('soils')
                      ? 'bg-amber-500/15 text-white border border-amber-500/50 border-l-3 border-l-amber-500 font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('soils') ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-neutral-600'}`} />
                    <span>8-Fold Classification</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold">NBSS&LUP</span>
                </button>

                <button
                  onClick={onOpenSoilSources}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
                  title="Soil data sources, ICAR datasets & accuracy"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Data sources &amp; accuracy</span>
                </button>
                
                <div className={`accordion-collapse ${activeLayers.has('soils') ? 'is-open' : ''}`}>
                  <div>
                    <div className="px-3 py-2.5 grid grid-cols-2 gap-2 text-xs font-mono font-bold bg-[#141822] border border-white/10 rounded-lg mt-1">
                      <span className="flex items-center gap-1.5 text-yellow-300"><span className="w-2.5 h-2.5 rounded-sm bg-[#eab308] inline-block"/>Alluvial</span>
                      <span className="flex items-center gap-1.5 text-neutral-200"><span className="w-2.5 h-2.5 rounded-sm bg-[#475569] inline-block"/>Black / Regur</span>
                      <span className="flex items-center gap-1.5 text-red-300"><span className="w-2.5 h-2.5 rounded-sm bg-[#ef4444] inline-block"/>Red & Yellow</span>
                      <span className="flex items-center gap-1.5 text-orange-400"><span className="w-2.5 h-2.5 rounded-sm bg-[#c2410c] inline-block"/>Laterite</span>
                      <span className="flex items-center gap-1.5 text-amber-300"><span className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b] inline-block"/>Arid / Desert</span>
                      <span className="flex items-center gap-1.5 text-green-300"><span className="w-2.5 h-2.5 rounded-sm bg-[#15803d] inline-block"/>Mountain</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 8. DEMOGRAPHIC INTELLIGENCE */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden">
          <button
            onClick={() => toggleSection('demographics')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-white hover:text-[#C9A227] transition-colors bg-[#131720] cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <ActiveDot on={sectionActive(['pop_density', 'pop_total', 'literacy', 'sex_ratio', 'religion'])} />
              <Users className="w-4 h-4 text-[#C9A227]" />
              Demographic Intelligence
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${openSections.demographics ? 'is-open text-white' : ''}`} />
          </button>
          
          <div className={`accordion-collapse ${openSections.demographics ? 'is-open' : ''}`}>
            <div>
              <div className="p-2 space-y-1.5 bg-[#0d1016]">
                <button
                  onClick={() => toggleLayer('pop_density')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('pop_density')
                      ? 'bg-[#C9A227]/15 text-white border border-[#C9A227]/50 border-l-3 border-l-[#C9A227] font-bold shadow-[0_0_12px_rgba(201,162,39,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('pop_density') ? 'bg-[#C9A227] shadow-[0_0_8px_#C9A227]' : 'bg-neutral-600'}`} />
                    <span>Population Density</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-neutral-200 border border-white/15 font-bold">Persons/km²</span>
                </button>

                <button
                  onClick={() => toggleLayer('pop_total')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('pop_total')
                      ? 'bg-[#C9A227]/15 text-white border border-[#C9A227]/50 border-l-3 border-l-[#C9A227] font-bold shadow-[0_0_12px_rgba(201,162,39,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('pop_total') ? 'bg-[#C9A227] shadow-[0_0_8px_#C9A227]' : 'bg-neutral-600'}`} />
                    <span>Total Population</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-neutral-200 border border-white/15 font-bold">Census PCA</span>
                </button>

                <button
                  onClick={() => toggleLayer('literacy')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('literacy')
                      ? 'bg-emerald-500/15 text-white border border-emerald-500/50 border-l-3 border-l-emerald-500 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('literacy') ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-neutral-600'}`} />
                    <span>Literacy Rate</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">Total %</span>
                </button>

                <button
                  onClick={() => toggleLayer('sex_ratio')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('sex_ratio')
                      ? 'bg-rose-500/15 text-white border border-rose-500/50 border-l-3 border-l-rose-500 font-bold shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('sex_ratio') ? 'bg-rose-400 shadow-[0_0_8px_#f43f5e]' : 'bg-neutral-600'}`} />
                    <span>Sex Ratio</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 font-bold">F / 1000 M</span>
                </button>

                {/* Religious Demographics Dropdown */}
                <button
                  onClick={() => toggleLayer('religion')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('religion')
                      ? 'bg-purple-500/15 text-white border border-purple-500/50 border-l-3 border-l-purple-500 font-bold shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-purple-400" />
                    <span>Faith Communities (C-01)</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40 font-bold">Choropleth</span>
                </button>

                <div className={`accordion-collapse ${activeLayers.has('religion') ? 'is-open' : ''}`}>
                  <div>
                    <div className="pt-2 px-1 space-y-1.5 bg-[#141822] border border-purple-500/25 rounded-lg p-2.5">
                      <div className="text-xs font-mono font-bold text-neutral-200 mb-1.5">Select Faith Community:</div>
                      {(['hindu', 'muslim', 'christian', 'sikh', 'buddhist', 'jain'] as ReligionFilter[]).map((rel) => (
                        <button
                          key={rel}
                          onClick={() => setReligionFilter(rel)}
                          className={`w-full px-3 py-1.5 rounded-md text-xs font-mono flex items-center justify-between capitalize transition-all cursor-pointer ${
                            religionFilter === rel
                              ? 'bg-purple-600/30 text-white font-bold border border-purple-400/50 shadow-sm'
                              : 'text-neutral-300 hover:bg-white/5 hover:text-white font-semibold'
                          }`}
                        >
                          <span>{rel} Population</span>
                          {religionFilter === rel && <span className="w-2 h-2 rounded-full bg-purple-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 9. RIVER SYSTEMS & HYDROLOGY */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden">
          <button
            onClick={() => toggleSection('hydro')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-white hover:text-sky-400 transition-colors bg-[#131720] cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <ActiveDot on={sectionActive(['rivers'])} />
              <Waves className="w-4 h-4 text-sky-400" />
              River Systems & Tributaries
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${openSections.hydro ? 'is-open text-white' : ''}`} />
          </button>
          
          <div className={`accordion-collapse ${openSections.hydro ? 'is-open' : ''}`}>
            <div>
              <div className="p-2 space-y-1.5 bg-[#0d1016]">
                <button
                  onClick={() => toggleLayer('rivers')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('rivers')
                      ? 'bg-sky-500/15 text-white border border-sky-500/50 border-l-3 border-l-sky-500 font-bold shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('rivers') ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]' : 'bg-neutral-600'}`} />
                    <span>Animated River Network</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/40 font-bold">
                    10 Basins
                  </span>
                </button>
                <div className="px-3 pt-1 text-xs font-mono font-semibold text-neutral-300 space-y-1">
                  <div>• Ganga, Brahmaputra, Indus</div>
                  <div>• Godavari, Krishna, Kaveri, Mahanadi</div>
                  <div>• Narmada, Tapi, Sabarmati</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 10. MOUNTAINS & OROGENY */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden">
          <button
            onClick={() => toggleSection('physical')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-white hover:text-emerald-400 transition-colors bg-[#131720] cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <ActiveDot on={sectionActive(['mountains'])} />
              <Mountain className="w-4 h-4 text-emerald-400" />
              Mountains & Orogeny
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${openSections.physical ? 'is-open text-white' : ''}`} />
          </button>
          
          <div className={`accordion-collapse ${openSections.physical ? 'is-open' : ''}`}>
            <div>
              <div className="p-2 space-y-1.5 bg-[#0d1016]">
                <button
                  onClick={() => toggleLayer('mountains')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeLayers.has('mountains')
                      ? 'bg-emerald-500/15 text-white border border-emerald-500/50 border-l-3 border-l-emerald-500 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('mountains') ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-neutral-600'}`} />
                    <span>Major Mountain Ranges</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">GSI / SOI</span>
                </button>
                <div className="px-3 pt-1 text-xs font-mono font-semibold text-neutral-300 space-y-1">
                  <div>• Great Himalayas & Kangchenjunga</div>
                  <div>• Western Ghats (Anamudi) & Eastern Ghats</div>
                  <div>• Aravalli, Vindhyas, Satpura</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Quick Actions */}
      <div className="p-3.5 border-t border-white/10 bg-[#07090d] flex items-center justify-between text-xs font-mono">
        {onResetLayers && (
          <button
            onClick={onResetLayers}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-[#C9A227] transition-colors text-xs font-bold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Reset Overlays</span>
          </button>
        )}
        <span className="text-[#C9A227] font-bold text-xs ml-auto tracking-wider">CARTOGRAPHIC ATLAS · CENSUS 2011</span>
      </div>
    </aside>
  );
};
