import React, { useState } from 'react';
import { 
  X, 
  Users, 
  PieChart, 
  BookOpen, 
  Heart, 
  Trees, 
  Droplet, 
  ShieldCheck, 
  Mountain,
  Compass,
  Building,
  Activity,
  Landmark,
  Compass as TradeIcon,
  AlertTriangle,
  Scroll,
  Route,
  Calendar,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import type { SelectedFeatureInfo } from '../types';
import { metersToFeetInches } from '../utils/elevation';
import { STATE_LANDMARKS } from '../data/stateLandmarks';
import { STATE_CROPS } from '../data/stateAgriculture';
import { STATE_WILDLIFE } from '../data/stateWildlife';

const SITE_CATEGORY_LABELS: Record<string, string> = {
  ivc_site: 'Indus Valley Settlements',
  ancient_university: 'Ancient Universities',
  buddhist_monument: 'Buddhist Monasteries',
  rock_cut_monument: 'Rock-Cut Temples',
  medieval_monument: 'Rock-Cut Temples & Monuments',
  ancient_temple: 'Rock-Cut Temples & Monuments',
  ancient_port: 'Ancient Ports'
};

interface InfoPanelProps {
  feature: SelectedFeatureInfo | null;
  onClose: () => void;
}

// Collapsible section wrapper (accordion) for the dossier panels.
const CollapsibleSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, badge, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="vista-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between gap-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5 min-w-0">{icon}<span className="truncate">{title}</span></span>
        <span className="flex items-center gap-2 shrink-0">
          {badge && <span className="text-[10px] font-mono text-neutral-400 font-bold">{badge}</span>}
          {open ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
        </span>
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  );
};

export const InfoPanel: React.FC<InfoPanelProps> = ({ feature, onClose }) => {
  if (!feature) {
    return (
      <aside className="w-full h-full bg-[#080a0e]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col p-6 text-neutral-200 z-20 select-none overflow-y-auto font-sans">
        {/* Empty State Hero */}
        <div className="flex flex-col items-start mt-2">
          <div className="w-12 h-12 rounded-xl bg-[#141822] border border-white/10 flex items-center justify-center mb-4 text-[#C9A227] shadow-[0_0_20px_rgba(201,162,39,0.3)]">
            <Compass className="w-6 h-6 stroke-[2] animate-pulse" />
          </div>

          <h3 className="font-serif text-2xl font-semibold text-white tracking-tight uppercase">
            GEOSPATIAL INTELLIGENCE
          </h3>
          
          <div className="coral-indicator-bar mt-3">
            <p className="font-sans text-sm text-neutral-300 font-medium leading-relaxed">
              Select any <span className="text-[#C9A227] font-semibold">Empire</span>, <span className="text-amber-400 font-semibold">Archaeological Site</span>, <span className="text-sky-400 font-semibold">Trade Route</span>, <span className="text-rose-400 font-semibold">Seismic Zone</span>, or <span className="text-emerald-400 font-semibold">State</span> to inspect verified baseline data.
            </p>
          </div>
        </div>

        {/* National Benchmark KPI Block */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-300 mb-4 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#C9A227]" />
            <span>National Demographic Benchmarks</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="vista-card p-4">
              <div className="stat-kpi-coral text-3xl font-black text-[#C9A227]">1.21B</div>
              <div className="font-mono text-xs font-bold text-neutral-300 uppercase tracking-wider mt-1">Total Population</div>
            </div>

            <div className="vista-card p-4">
              <div className="stat-kpi-coral text-3xl font-black text-[#C9A227]">382</div>
              <div className="font-mono text-xs font-bold text-neutral-300 uppercase tracking-wider mt-1">Persons / km²</div>
            </div>

            <div className="vista-card p-4">
              <div className="stat-kpi-coral text-3xl font-black text-emerald-400">74.0%</div>
              <div className="font-mono text-xs font-bold text-neutral-300 uppercase tracking-wider mt-1">Literacy Rate</div>
            </div>

            <div className="vista-card p-4">
              <div className="stat-kpi-coral text-3xl font-black text-rose-400">943</div>
              <div className="font-mono text-xs font-bold text-neutral-300 uppercase tracking-wider mt-1">Sex Ratio (F/1000M)</div>
            </div>
          </div>
        </div>

        {/* Quick Capabilities */}
        <div className="mt-8 space-y-3">
          <div className="vista-card p-4">
            <div className="font-mono text-sm font-bold text-white mb-1.5">Authentic Provenance</div>
            <p className="text-xs text-neutral-300 font-semibold leading-relaxed font-sans">
              Strictly grounded in Archaeological Survey of India (ASI), Census 2011, Bureau of Indian Standards (BIS 1893), and Survey of India verified records.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const { type, properties, demographics } = feature;
  const displayName = properties.clean_name || properties.shapeName || properties.name || feature.name;
  const wikiName = (properties.name || displayName || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  const stateLandmarks = type === 'state' ? STATE_LANDMARKS[properties.shapeName || displayName] : undefined;
  const stateCrops = type === 'state' ? STATE_CROPS[properties.shapeName || displayName] : undefined;
  const stateWildlife = type === 'state' ? STATE_WILDLIFE[properties.shapeName || displayName] : undefined;

  return (
    <aside className="w-full h-full bg-[#080a0e]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col z-20 text-neutral-200 select-none shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-[#0a0d14]/90 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase text-[#C9A227]">
            <span>{type.replace('_', ' ')} Intelligence</span>
            {properties.shapeGroup && <span className="text-neutral-400">• {properties.shapeGroup}</span>}
          </div>
          <h2 className="font-serif text-3xl font-semibold text-white tracking-tight mt-1">{displayName}</h2>
          
          {properties.capital && (
            <p className="font-mono text-sm text-neutral-200 font-bold flex items-center gap-1.5 mt-1">
              <Building className="w-4 h-4 text-[#C9A227]" />
              Capital: {properties.capital}
            </p>
          )}
          {properties.period && (
            <p className="font-mono text-sm text-amber-400 font-bold mt-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {properties.period}
            </p>
          )}
          {properties.river_system && (
            <p className="font-mono text-sm text-sky-400 font-bold mt-1">{properties.river_system}</p>
          )}
          {properties.category && (
            <p className="font-mono text-sm text-amber-400 font-bold mt-1">{properties.category}</p>
          )}
          {properties.state_name && type === 'district' && (
            <p className="font-mono text-sm text-neutral-300 font-bold mt-1">State: {properties.state_name}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Close Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 1. Historical Empire Dossier */}
        {type === 'historical_empire' && (
          <div className="space-y-3">
            <div className="vista-card p-4 space-y-3">
              <div className="text-xs font-mono font-bold text-white flex items-center justify-between uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-amber-500" />
                  <span>Imperial Chronology</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-bold">
                  {properties.period_id?.toUpperCase() || 'HISTORICAL'}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {properties.era && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Era / Horizon:</span>
                    <span className="font-bold text-white text-sm">{properties.era}</span>
                  </div>
                )}
                {properties.capital && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Dynastic Capital:</span>
                    <span className="font-bold text-[#C9A227] text-sm">{properties.capital}</span>
                  </div>
                )}
                {properties.ruler_or_system && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Ruler / System:</span>
                    <span className="font-bold text-amber-300 text-sm">{properties.ruler_or_system}</span>
                  </div>
                )}
                {properties.approximate_area_sqkm && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Approx. Territorial Extent:</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {properties.approximate_area_sqkm.toLocaleString()} km²
                    </span>
                  </div>
                )}
                {properties.highlights && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Highlights:</span>
                    <span className="text-neutral-200">{properties.highlights}</span>
                  </div>
                )}
                {properties.trade_connections && (
                  <div className="py-1.5">
                    <span className="text-neutral-400 block text-[11px]">Trade Connections:</span>
                    <span className="text-sky-300">{properties.trade_connections}</span>
                  </div>
                )}
              </div>

              {/* Approximate Reconstruction Disclaimer */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono leading-relaxed mt-2">
                <span className="font-bold block mb-1">⚠️ Cartographic Disclaimer:</span>
                Boundaries represent approximate scholarly reconstructions of core domains and tributary spheres based on ASI and Imperial records. Not surveyed borders.
              </div>
            </div>
          </div>
        )}

        {/* 2. Archaeological Site Dossier */}
        {type === 'archaeological_site' && (
          <div className="space-y-3">
            <div className="vista-card p-4 space-y-3">
              <div className="text-xs font-mono font-bold text-white flex items-center justify-between uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Scroll className="w-4 h-4 text-teal-400" />
                  <span>Archaeological Profile</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <a href={`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(wikiName)}`} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/30 border border-white/25 flex items-center justify-center text-xs font-black text-white transition-colors cursor-pointer" title={`Wikipedia: ${wikiName}`} aria-label={`Wikipedia article for ${wikiName}`}>W</a>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-500/30 font-bold">
                    ASI MONUMENT
                  </span>
                </span>
              </div>

              {properties.description && (
                <p className="text-xs font-mono text-neutral-200 leading-relaxed">{properties.description}</p>
              )}

              <div className="space-y-2 text-xs font-mono">
                {properties.civilization && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Civilization:</span>
                    <span className="font-bold text-teal-300 text-sm text-right ml-2">{properties.civilization}</span>
                  </div>
                )}
                {properties.category && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Category:</span>
                    <span className="font-bold text-teal-300 text-sm">{SITE_CATEGORY_LABELS[properties.category] || properties.category}</span>
                  </div>
                )}
                {properties.period && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Chronological Period:</span>
                    <span className="font-bold text-white text-sm text-right ml-2">{properties.period}</span>
                  </div>
                )}
                {properties.excavator && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Excavator / Team:</span>
                    <span className="font-bold text-amber-300 text-xs text-right ml-2">{properties.excavator}</span>
                  </div>
                )}
                {properties.discovery_year && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Discovery Year:</span>
                    <span className="font-bold text-white">{properties.discovery_year}</span>
                  </div>
                )}
                {properties.key_finds && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Key Archaeological Finds:</span>
                    <span className="text-neutral-200 leading-relaxed">{properties.key_finds}</span>
                  </div>
                )}
                {properties.status && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Protection Status:</span>
                    <span className="font-bold text-emerald-300 text-xs text-right ml-2">{properties.status}</span>
                  </div>
                )}
                {properties.citation && (
                  <div className="py-1.5">
                    <span className="text-neutral-400 block text-[11px]">Citation / Source:</span>
                    <span className="text-neutral-300 text-[11px] leading-relaxed">{properties.citation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. Trade Route Dossier */}
        {type === 'trade_route' && (
          <div className="space-y-3">
            <div className="vista-card p-4 space-y-3">
              <div className="text-xs font-mono font-bold text-white flex items-center justify-between uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <TradeIcon className="w-4 h-4 text-sky-400" />
                  <span>Maritime & Caravan Corridor</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/30 font-bold">
                  {properties.network_type || 'TRADE ARTERY'}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {properties.era_active && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Era Active:</span>
                    <span className="font-bold text-white text-sm">{properties.era_active}</span>
                  </div>
                )}
                {properties.connected_nodes && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Connected Hubs & Ports:</span>
                    <span className="text-amber-400 leading-relaxed">{properties.connected_nodes}</span>
                  </div>
                )}
                {properties.commodities && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Principal Commodities:</span>
                    <span className="text-emerald-400 font-bold leading-relaxed">{properties.commodities}</span>
                  </div>
                )}
                {properties.chronicles && (
                  <div className="py-1.5">
                    <span className="text-neutral-400 block text-[11px]">Historical Chroniclers:</span>
                    <span className="text-neutral-300">{properties.chronicles}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3.5 National Highway / Expressway / Road Corridor Dossier */}
        {type === 'highway' && (
          <div className="space-y-3">
            <div className="vista-card p-4 space-y-3">
              <div className="text-xs font-mono font-bold text-white flex items-center justify-between uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Route className="w-4 h-4 text-orange-400" />
                  <span>Road Corridor Profile</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950/80 text-orange-300 border border-orange-500/30 font-bold">
                  {properties.category || 'HIGHWAY'}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {properties.code && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Route Designation:</span>
                    <span className="font-bold text-orange-300 text-sm">{properties.code}</span>
                  </div>
                )}
                {properties.from && properties.to && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Terminal Points:</span>
                    <span className="text-neutral-200">{properties.from} → {properties.to}</span>
                  </div>
                )}
                {properties.length_km && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Route Length:</span>
                    <span className="font-bold text-[#C9A227] text-sm">{properties.length_km.toLocaleString()} km</span>
                  </div>
                )}
                {properties.states && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">States Served:</span>
                    <span className="text-amber-300">{properties.states}</span>
                  </div>
                )}
                {properties.corridor && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Corridor Class:</span>
                    <span className="font-bold text-white text-sm">{properties.corridor}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400">Configuration:</span>
                  <span className="font-bold text-neutral-200">{properties.lanes || '—'} lanes</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-400">Tolled / Access:</span>
                  <span className={`font-bold text-sm ${properties.toll ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {properties.toll ? 'Tolled · Access-Controlled' : 'Open Access'}
                  </span>
                </div>
                {properties.status && (
                  <div className="pt-1.5 border-t border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Status:</span>
                    <span className="text-emerald-300 font-bold">{properties.status}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. Seismic Risk & Earthquake Epicenter Dossier */}
        {(type === 'seismic_zone' || type === 'earthquake_epicenter') && (
          <div className="space-y-3">
            <div className="vista-card p-4 space-y-3">
              <div className="text-xs font-mono font-bold text-white flex items-center justify-between uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>{type === 'earthquake_epicenter' ? 'Historical Earthquake Event' : 'BIS Seismic Hazard Zone'}</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30 font-bold">
                  BIS 1893:2016
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {properties.zone_code && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Seismic Hazard Zone:</span>
                    <span className="font-bold text-rose-400 text-sm">{properties.zone_code} ({properties.hazard_level})</span>
                  </div>
                )}
                {properties.zone_factor_z && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Zone Factor (Z):</span>
                    <span className="font-bold text-white text-sm">{properties.zone_factor_z} ({properties.peak_ground_accel})</span>
                  </div>
                )}
                {properties.year && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Event Year:</span>
                    <span className="font-bold text-white text-sm">{properties.year}</span>
                  </div>
                )}
                {properties.magnitude_mw && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Moment Magnitude (Mw):</span>
                    <span className="font-black text-rose-400 text-lg">M {properties.magnitude_mw}</span>
                  </div>
                )}
                {properties.depth_km && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Focal Depth:</span>
                    <span className="font-bold text-neutral-200">{properties.depth_km} km</span>
                  </div>
                )}
                {properties.fatalities_approx && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Estimated Casualties:</span>
                    <span className="font-bold text-red-400">{properties.fatalities_approx.toLocaleString()}</span>
                  </div>
                )}
                {properties.fault_system && (
                  <div className="py-1.5">
                    <span className="text-neutral-400 block text-[11px]">Tectonic Fault / Mechanism:</span>
                    <span className="text-amber-300">{properties.fault_system}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* River Feature Details */}
        {type === 'river' && (
          <div className="space-y-3">
            <div className="vista-card p-4 space-y-3">
              <div className="text-xs font-mono font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-wider">
                <Droplet className="w-4 h-4 text-sky-400" />
                <span>Hydrological Profile (CWC / WRIS)</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                {properties.length_km && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">Total Course Length</span>
                    <span className="font-bold text-[#C9A227] text-sm">{properties.length_km.toLocaleString()} km</span>
                  </div>
                )}
                {properties.river_system && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400">River Basin</span>
                    <span className="font-bold text-white text-sm">{properties.river_system}</span>
                  </div>
                )}
                {properties.origin && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Geographic Origin:</span>
                    <span className="text-neutral-200 font-medium">{properties.origin}</span>
                  </div>
                )}
                {properties.outflow && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Outflow / Destination:</span>
                    <span className="text-neutral-200 font-medium">{properties.outflow}</span>
                  </div>
                )}
                {properties.states_covered && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Riparian States:</span>
                    <span className="text-neutral-300">{properties.states_covered}</span>
                  </div>
                )}
                {properties.dams && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Major Dams & Reservoirs:</span>
                    <span className="text-emerald-400 font-medium">{properties.dams}</span>
                  </div>
                )}
                {properties.major_cities && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Key Cities along Course:</span>
                    <span className="text-amber-400 font-medium">{properties.major_cities}</span>
                  </div>
                )}
                {properties.tributaries && (
                  <div className="py-1.5">
                    <span className="text-neutral-400 block text-[11px]">Major Tributaries:</span>
                    <span className="text-neutral-300">{properties.tributaries}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Soil Feature Details */}
        {type === 'soil' && (
          <div className="space-y-3">
            <div className="vista-card p-4 space-y-3">
              <div className="text-xs font-mono font-bold text-white flex items-center justify-between uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Trees className="w-4 h-4 text-amber-500" />
                  <span>Pedological Profile</span>
                </span>
                {properties.area_pct && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-bold">
                    {properties.area_pct}% of India
                  </span>
                )}
              </div>

              {properties.coverage_sqkm && (
                <div className="text-xs font-mono text-neutral-400 flex justify-between py-1.5 border-b border-white/5">
                  <span>Geographic Area:</span>
                  <span className="text-neutral-200 font-bold">{properties.coverage_sqkm.toLocaleString()} km²</span>
                </div>
              )}

              <p className="text-xs text-neutral-300 leading-relaxed font-sans pt-1">{properties.composition}</p>

              <div className="pt-2 border-t border-white/5 text-xs font-mono space-y-1">
                <div className="text-neutral-400">Crop Suitability:</div>
                <div className="text-emerald-400 font-bold">{properties.suitability}</div>
              </div>

              <div className="pt-2 border-t border-white/5 text-xs font-mono space-y-1">
                <div className="text-neutral-400">Geological Genesis:</div>
                <div className="text-neutral-300">{properties.geology}</div>
              </div>

              {properties.states && (
                <div className="pt-2 border-t border-white/5 text-xs font-mono space-y-1">
                  <div className="text-neutral-400">Predominant Regions:</div>
                  <div className="text-neutral-300">{properties.states.join(', ')}</div>
                </div>
              )}

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono leading-relaxed mt-2">
                <span className="font-bold block mb-1">Approximate Distribution:</span>
                Schematic educational representation of the ICAR 8-fold scheme — not official NBSS&amp;LUP soil-resource geometry. Not a parcel-level soil certification.
              </div>
            </div>
          </div>
        )}

        {/* Mountain Feature Details */}
        {type === 'mountain' && (
          <div className="space-y-3">
            <div className="vista-card p-4 space-y-3">
              <div className="text-xs font-mono font-bold text-white flex items-center justify-between uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Mountain className="w-4 h-4 text-emerald-400" />
                  <span>Orogenic & Relief Profile</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
                  GSI Survey
                </span>
              </div>

              <div className="flex justify-between text-xs font-mono py-1.5 border-b border-white/5">
                <span className="text-neutral-400">Highest Peak</span>
                <span className="font-bold text-amber-400 text-sm">{properties.peak}</span>
              </div>
              <div className="flex justify-between text-xs font-mono py-1.5 border-b border-white/5">
                <span className="text-neutral-400">Max Elevation (Ft & In)</span>
                <span className="font-bold text-[#C9A227] text-sm">
                  {properties.elevation_m ? metersToFeetInches(properties.elevation_m) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono py-1.5 border-b border-white/5">
                <span className="text-neutral-400">Metric Elevation</span>
                <span className="font-bold text-neutral-300 text-xs">{properties.elevation_m} m</span>
              </div>
              {properties.extent && (
                <div className="flex justify-between text-xs font-mono py-1.5 border-b border-white/5">
                  <span className="text-neutral-400">Strike Extent</span>
                  <span className="text-neutral-200">{properties.extent}</span>
                </div>
              )}

              <p className="text-xs text-neutral-300 leading-relaxed font-sans pt-1">{properties.geology}</p>

              {properties.passes && (
                <div className="pt-2 border-t border-white/5 text-xs font-mono">
                  <span className="text-neutral-400 block">Mountain Passes:</span>
                  <span className="text-amber-400">{properties.passes.join(', ')}</span>
                </div>
              )}

              {properties.biodiversity && (
                <div className="pt-2 border-t border-white/5 text-xs font-mono">
                  <span className="text-neutral-400 block">Ecological Significance:</span>
                  <span className="text-emerald-400">{properties.biodiversity}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Demographics Details (State or District) with VISTA.IO Style Big Numbers */}
        {demographics && (
          <div className="vista-card p-4">
            <div className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#C9A227]" />
                Demographic Numbers
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-white/10 text-neutral-200 border border-white/15 font-bold">
                Census {demographics.census_year || 2011}
              </span>
            </div>
            <div className="space-y-4">
            {/* Big Number KPI Counter Block */}
            <div className="vista-card p-4">
              <div className="grid grid-cols-2 gap-3 font-mono">
                {/* Total Population */}
                <div className="bg-[#161a22] p-3.5 rounded-xl border border-white/5">
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Population</div>
                  <div className="stat-kpi-coral text-3xl font-black text-[#C9A227] mt-0.5">
                    {demographics.population_2011 ? (demographics.population_2011 >= 1000000 ? `${(demographics.population_2011 / 1000000).toFixed(2)}M` : demographics.population_2011.toLocaleString()) : 'N/A'}
                  </div>
                  {demographics.growth_pct !== undefined && (
                    <div className="text-xs text-emerald-400 font-bold mt-1">
                      +{demographics.growth_pct}% decadal
                    </div>
                  )}
                </div>

                {/* Density */}
                <div className="bg-[#161a22] p-3.5 rounded-xl border border-white/5">
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Density</div>
                  <div className="stat-kpi-coral text-3xl font-black text-[#C9A227] mt-0.5">
                    {demographics.density_2011 ? demographics.density_2011.toLocaleString() : 'N/A'}
                  </div>
                  <div className="text-xs text-neutral-300 font-bold mt-1">persons / km²</div>
                </div>
              </div>

              {demographics.area_sqkm && (
                <div className="mt-3 text-sm font-mono text-neutral-300 flex justify-between py-1.5 border-t border-white/10 font-bold">
                  <span className="text-neutral-400 font-semibold">Geographic Surface Area:</span>
                  <span className="text-white font-bold">{demographics.area_sqkm.toLocaleString()} km²</span>
                </div>
              )}
            </div>

            {/* Literacy & Gender Ratio */}
            <div className="vista-card p-4 space-y-3 font-mono">
              <div className="text-xs font-bold text-white flex items-center justify-between uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Literacy & Sex Ratio
                </span>
              </div>

              {demographics.literacy_rate !== undefined && (
                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-bold">
                    <span className="text-neutral-300">Literacy Rate:</span>
                    <span className="font-extrabold text-emerald-400 text-base">{demographics.literacy_rate}%</span>
                  </div>
                  <div className="w-full bg-[#181d26] h-2.5 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="bg-[#C9A227] h-full rounded-full shadow-[0_0_8px_#C9A227]" 
                      style={{ width: `${Math.min(100, demographics.literacy_rate)}%` }}
                    />
                  </div>
                </div>
              )}

              {demographics.sex_ratio !== undefined && (
                <div className="pt-2.5 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                  <span className="text-neutral-300 flex items-center gap-1.5 font-semibold">
                    <Heart className="w-4 h-4 text-rose-400" />
                    Sex Ratio:
                  </span>
                  <span className="font-bold text-rose-300 px-2.5 py-0.5 rounded bg-rose-950/60 border border-rose-500/40">
                    {demographics.sex_ratio} F / 1000 M
                  </span>
                </div>
              )}
            </div>

            {/* Rural vs Urban Split */}
            {demographics.rural_pct !== undefined && demographics.urban_pct !== undefined && (
              <div className="vista-card p-4 font-mono">
                <div className="text-xs font-bold text-white mb-2 uppercase tracking-wider">Demographic Distribution</div>
                <div className="w-full bg-[#181d26] h-3 rounded-full overflow-hidden flex border border-white/10">
                  <div className="bg-[#C9A227] h-full" style={{ width: `${demographics.rural_pct}%` }} />
                  <div className="bg-sky-500 h-full" style={{ width: `${demographics.urban_pct}%` }} />
                </div>
                <div className="flex justify-between text-sm mt-2 font-bold">
                  <span className="text-[#C9A227]">Rural: {demographics.rural_pct}%</span>
                  <span className="text-sky-400">Urban: {demographics.urban_pct}%</span>
                </div>
              </div>
            )}

            {/* Religious Composition (Census Table C-01) */}
            {demographics.hindu_pct !== undefined && (
              <div className="vista-card p-4 font-mono">
                <div className="text-xs font-bold text-white mb-3 flex items-center justify-between uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <PieChart className="w-4 h-4 text-purple-400" />
                    Faith Communities (C-01)
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Hindu', pct: demographics.hindu_pct, color: 'bg-orange-500' },
                    { label: 'Muslim', pct: demographics.muslim_pct, color: 'bg-emerald-500' },
                    { label: 'Christian', pct: demographics.christian_pct, color: 'bg-blue-500' },
                    { label: 'Sikh', pct: demographics.sikh_pct, color: 'bg-amber-500' },
                    { label: 'Buddhist', pct: demographics.buddhist_pct, color: 'bg-purple-500' },
                    { label: 'Jain', pct: demographics.jain_pct, color: 'bg-rose-500' },
                    { label: 'Others', pct: demographics.other_pct, color: 'bg-neutral-500' },
                  ]
                    .filter(item => item.pct && item.pct > 0)
                    .map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1 font-bold">
                          <span className="text-neutral-300 font-semibold">{item.label}</span>
                          <span className="text-white font-black">{item.pct}%</span>
                        </div>
                        <div className="w-full bg-[#181d26] h-2 rounded-full overflow-hidden border border-white/10">
                          <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            </div>
          </div>
        )}

        {/* Top 5 Historical & Famous Places (State) */}
        {type === 'state' && stateLandmarks && stateLandmarks.length > 0 && (
          <CollapsibleSection title="Top 5 Historical & Famous Places" icon={<Landmark className="w-4 h-4 text-amber-400" />}>
            <ol className="space-y-3 text-sm">
              {stateLandmarks.map((lm, i) => {
                const wikiUrl = `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(lm.name)}`;
                return (
                  <li key={lm.name} className="flex gap-3">
                    <span className="text-[#C9A227] font-black shrink-0 w-5 text-right">{i + 1}.</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-bold">{lm.name}</span>
                        <a href={wikiUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 w-5 h-5 rounded-full bg-white/10 hover:bg-white/30 border border-white/25 flex items-center justify-center text-[10px] font-black text-white transition-colors cursor-pointer" title={`Read more on Wikipedia: ${lm.name}`} aria-label={`Wikipedia article for ${lm.name}`}>W</a>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/10 font-bold uppercase tracking-wide">{lm.type}</span>
                      </div>
                      <div className="text-neutral-400 text-xs leading-relaxed mt-0.5 font-sans">{lm.blurb}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CollapsibleSection>
        )}

        {/* Agriculture — Top Crops (State) */}
        {type === 'state' && stateCrops && stateCrops.length > 0 && (
          <CollapsibleSection title="Agriculture — Top Crops" icon={<Trees className="w-4 h-4 text-emerald-400" />}>
            <ul className="space-y-2.5 text-sm">
              {stateCrops.map((c) => {
                const wikiUrl = `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(c.crop)}`;
                const seasonCls =
                  c.season === 'Kharif'
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                    : c.season === 'Rabi'
                      ? 'bg-sky-950/60 text-sky-300 border-sky-500/30'
                      : c.season === 'Zaid'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                        : 'bg-purple-950/60 text-purple-300 border-purple-500/30';
                return (
                  <li key={c.crop} className="flex gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-bold">{c.crop}</span>
                        <a href={wikiUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 w-5 h-5 rounded-full bg-white/10 hover:bg-white/30 border border-white/25 flex items-center justify-center text-[10px] font-black text-white transition-colors cursor-pointer" title={`Wikipedia: ${c.crop}`} aria-label={`Wikipedia article for ${c.crop}`}>W</a>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border ${seasonCls}`}>{c.season}</span>
                      </div>
                      <div className="text-neutral-400 text-xs leading-relaxed mt-0.5 font-sans">{c.why}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CollapsibleSection>
        )}

        {/* Wildlife & Protected Areas (State) */}
        {type === 'state' && stateWildlife && (
          <CollapsibleSection title="Wildlife & Protected Areas" icon={<Mountain className="w-4 h-4 text-emerald-400" />}>
            <div className="mb-3">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Sanctuaries / Reserves</div>
              <div className="flex flex-wrap gap-1.5">
                {stateWildlife.reserves.map((r) => (
                  <a
                    key={r}
                    href={`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(r)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                    title={`Wikipedia: ${r}`}
                  >
                    <span>{r}</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[8px] font-black text-white">W</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Protected Species</div>
              <ol className="space-y-2 text-sm">
                {stateWildlife.species.map((s, i) => (
                  <li key={s} className="flex items-start gap-2.5">
                    <span className="text-[#C9A227] font-black shrink-0 w-4 text-right">{i + 1}.</span>
                    <span className="text-neutral-200 flex-1 min-w-0">{s}</span>
                    <a
                      href={`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(s)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 w-5 h-5 rounded-full bg-white/10 hover:bg-white/30 border border-white/25 flex items-center justify-center text-[10px] font-black text-white transition-colors cursor-pointer"
                      title={`Wikipedia: ${s}`}
                      aria-label={`Wikipedia article for ${s}`}
                    >
                      W
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </CollapsibleSection>
        )}

        {/* Provenance & Source Metadata */}
        <CollapsibleSection title="Verified Source Provenance" icon={<ShieldCheck className="w-4 h-4" />}>
          <div className="text-xs font-mono space-y-2 text-neutral-300">
            <div><span className="text-white font-bold">Authority:</span> {properties.source || demographics?.source || 'Government of India / ASI / BIS'}</div>
            <div><span className="text-white font-bold">Baseline Reference:</span> {properties.year || demographics?.census_year || 'Official Record'}</div>
            <div className="text-xs text-neutral-300 pt-2 border-t border-white/10 leading-relaxed font-sans font-semibold">
              All factual attributes strictly originate from official government publications, ASI excavation memoirs, and academic peer-reviewed cartography.
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </aside>
  );
};
