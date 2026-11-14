import React, { useState } from 'react';
import { 
  Mountain, 
  MapPin, 
  Waves, 
  TreePine, 
  Users, 
  PieChart, 
  ChevronDown, 
  ChevronRight, 
  Type, 
  RotateCcw,
  Route,
  Landmark,
  Compass,
  Scroll,
  AlertTriangle,
  Clock
} from 'lucide-react';
import type { ActiveLayer, HistoricalPeriodId, ReligionFilter } from '../types';
import { HISTORICAL_ERAS } from '../data/historicalEras';
import { BharatLogo } from './BharatLogo';

interface SidebarNavProps {
  activeLayers: Set<ActiveLayer>;
  toggleLayer: (layer: ActiveLayer) => void;
  religionFilter: ReligionFilter;
  setReligionFilter: (rel: ReligionFilter) => void;
  selectedEraId: HistoricalPeriodId;
  onSelectEra: (era: HistoricalPeriodId) => void;
  isTimelineOpen: boolean;
  onToggleTimeline: () => void;
  onResetLayers?: () => void;
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
  onResetLayers
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    historical: true,
    archaeology: true,
    trade: false,
    roads: true,
    disaster: false,
    political: false,
    soils: false,
    demographics: false,
    hydro: false,
    physical: false
  });

  const toggleSection = (sec: string) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

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
        {/* 1. HISTORICAL ATLAS & TIME MACHINE */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden border border-amber-500/30">
          <button
            onClick={() => toggleSection('historical')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-amber-300 hover:text-amber-200 transition-colors bg-[#17130d]"
          >
            <span className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>Historical Atlas & Time Machine</span>
            </span>
            {openSections.historical ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
          </button>
          
          {openSections.historical && (
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

              {/* Bottom Timeline Launcher Button */}
              <button
                onClick={onToggleTimeline}
                className={`w-full px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer border ${
                  isTimelineOpen 
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-white/5 hover:bg-white/10 text-amber-300 border-amber-500/30'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isTimelineOpen ? 'Hide Universal Timeline' : 'Open Universal Timeline'}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-bold">SLIDER</span>
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
          )}
        </div>

        {/* ======================================================== */}
        {/* 2. CIVILIZATIONS & ARCHAEOLOGY */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden border border-teal-500/30">
          <button
            onClick={() => toggleSection('archaeology')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-teal-300 hover:text-teal-200 transition-colors bg-[#0b1717]"
          >
            <span className="flex items-center gap-2">
              <Scroll className="w-4 h-4 text-teal-400" />
              <span>Civilizations & Archaeology</span>
            </span>
            {openSections.archaeology ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
          </button>
          
          {openSections.archaeology && (
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
          )}
        </div>

        {/* ======================================================== */}
        {/* 3. TRADE ROUTES & CONNECTIVITY */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden border border-sky-500/30">
          <button
            onClick={() => toggleSection('trade')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-sky-300 hover:text-sky-200 transition-colors bg-[#0b141d]"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Trade Routes & Connectivity</span>
            </span>
            {openSections.trade ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
          </button>
          
          {openSections.trade && (
            <div className="p-2 space-y-1.5 bg-[#0d1016]">
              <button
                onClick={() => toggleLayer('trade_routes')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${
                  activeLayers.has('trade_routes')
                    ? 'bg-sky-500/20 text-white border border-sky-500/50 border-l-3 border-l-sky-500 font-bold shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white font-bold'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.has('trade_routes') ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]' : 'bg-neutral-600'}`} />
                  <span>Maritime & Caravan Routes</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/40 font-bold">Networks</span>
              </button>

              <div className="px-3 py-2 text-xs font-mono font-semibold text-neutral-300 space-y-1 bg-[#131720] rounded-lg">
                <div className="text-amber-400 font-bold">• Uttarapatha (Grand Trunk Precursor)</div>
                <div className="text-emerald-400 font-bold">• Dakshinapatha (Peninsular Corridors)</div>
                <div className="text-sky-400 font-bold">• Monsoon Maritime Spice Network</div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 3.5 NATIONAL HIGHWAYS & EXPRESSWAYS */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden border border-orange-500/30">
          <button
            onClick={() => toggleSection('roads')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-orange-300 hover:text-orange-200 transition-colors bg-[#1a110a]"
          >
            <span className="flex items-center gap-2">
              <Route className="w-4 h-4 text-orange-400" />
              <span>National Highways &amp; Expressways</span>
            </span>
            {openSections.roads ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
          </button>

          {openSections.roads && (
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
          )}
        </div>

        {/* ======================================================== */}
        {/* 4. DISASTER & SEISMIC RISK */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden border border-rose-500/30">
          <button
            onClick={() => toggleSection('disaster')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-rose-300 hover:text-rose-200 transition-colors bg-[#1a0f12]"
          >
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Disaster & Seismic Risk</span>
            </span>
            {openSections.disaster ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
          </button>
          
          {openSections.disaster && (
            <div className="p-2 space-y-1.5 bg-[#0d1016]">
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
                  <span>BIS Seismic Zones & Epicenters</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 font-bold">BIS 1893</span>
              </button>

              <div className="px-3 py-2 text-xs font-mono font-semibold text-neutral-300 space-y-1 bg-[#131720] rounded-lg">
                <div className="text-rose-400 font-bold">• Zone V (Very High): Kashmir, Himalayas, Kutch, NE India</div>
                <div className="text-amber-400 font-bold">• Zone IV (High Risk): Delhi-NCR, Indo-Gangetic Basin</div>
                <div className="text-red-300 font-bold">• Epicenters: 1897 Shillong, 1905 Kangra, 1934 Bihar, 2001 Bhuj</div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 5. POLITICAL BOUNDARIES */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden">
          <button
            onClick={() => toggleSection('political')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-white hover:text-[#C9A227] transition-colors bg-[#131720]"
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C9A227]" />
              Political Boundaries
            </span>
            {openSections.political ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
          </button>
          
          {openSections.political && (
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
          )}
        </div>

        {/* ======================================================== */}
        {/* 7. SOIL GEOGRAPHY (ICAR) */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden">
          <button
            onClick={() => toggleSection('soils')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-white hover:text-amber-400 transition-colors bg-[#131720]"
          >
            <span className="flex items-center gap-2">
              <TreePine className="w-4 h-4 text-amber-500" />
              Soil Geography (ICAR)
            </span>
            {openSections.soils ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
          </button>
          
          {openSections.soils && (
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
              
              {activeLayers.has('soils') && (
                <div className="px-3 py-2.5 grid grid-cols-2 gap-2 text-xs font-mono font-bold bg-[#141822] border border-white/10 rounded-lg mt-1">
                  <span className="flex items-center gap-1.5 text-yellow-300"><span className="w-2.5 h-2.5 rounded-sm bg-[#eab308] inline-block"/>Alluvial</span>
                  <span className="flex items-center gap-1.5 text-neutral-200"><span className="w-2.5 h-2.5 rounded-sm bg-[#475569] inline-block"/>Black / Regur</span>
                  <span className="flex items-center gap-1.5 text-red-300"><span className="w-2.5 h-2.5 rounded-sm bg-[#ef4444] inline-block"/>Red & Yellow</span>
                  <span className="flex items-center gap-1.5 text-orange-400"><span className="w-2.5 h-2.5 rounded-sm bg-[#c2410c] inline-block"/>Laterite</span>
                  <span className="flex items-center gap-1.5 text-amber-300"><span className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b] inline-block"/>Arid / Desert</span>
                  <span className="flex items-center gap-1.5 text-green-300"><span className="w-2.5 h-2.5 rounded-sm bg-[#15803d] inline-block"/>Mountain</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 8. DEMOGRAPHIC INTELLIGENCE */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden">
          <button
            onClick={() => toggleSection('demographics')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-white hover:text-[#C9A227] transition-colors bg-[#131720]"
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C9A227]" />
              Demographic Intelligence
            </span>
            {openSections.demographics ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
          </button>
          
          {openSections.demographics && (
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

              {activeLayers.has('religion') && (
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
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 9. RIVER SYSTEMS & HYDROLOGY */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden">
          <button
            onClick={() => toggleSection('hydro')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-white hover:text-sky-400 transition-colors bg-[#131720]"
          >
            <span className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-sky-400" />
              River Systems & Tributaries
            </span>
            {openSections.hydro ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
          </button>
          
          {openSections.hydro && (
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
          )}
        </div>

        {/* ======================================================== */}
        {/* 10. MOUNTAINS & OROGENY */}
        {/* ======================================================== */}
        <div className="vista-card overflow-hidden">
          <button
            onClick={() => toggleSection('physical')}
            className="w-full px-3.5 py-3 flex items-center justify-between text-sm font-serif font-semibold uppercase tracking-wide text-white hover:text-emerald-400 transition-colors bg-[#131720]"
          >
            <span className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-emerald-400" />
              Mountains & Orogeny
            </span>
            {openSections.physical ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
          </button>
          
          {openSections.physical && (
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
          )}
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
