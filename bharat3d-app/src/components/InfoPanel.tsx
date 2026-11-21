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
  AlertTriangle,
  Scroll,
  Route,
  Calendar,
  ChevronDown,
  Anchor,
  Train,
  Waves,
  Globe,
  TreePine,
  Droplets,
  Building2,
  Sun,
  Gauge,
  ExternalLink,
  Flame,
  Wind
} from 'lucide-react';
import type { SelectedFeatureInfo, EnvironmentalComparisonConfig } from '../types';
import { metersToFeetInches } from '../utils/elevation';
import { STATE_LANDMARKS } from '../data/stateLandmarks';
import { STATE_CROPS } from '../data/stateAgriculture';
import { STATE_WILDLIFE } from '../data/stateWildlife';
import { getFeatureTemporalAssessment } from '../data/environmentalChange';

const SITE_CATEGORY_LABELS: Record<string, string> = {
  ivc_site: 'Indus Valley Settlements',
  ancient_university: 'Ancient Universities',
  buddhist_monument: 'Buddhist Monasteries',
  rock_cut_monument: 'Rock-Cut Temples',
  medieval_monument: 'Rock-Cut Temples & Monuments',
  ancient_temple: 'Rock-Cut Temples & Monuments',
  ancient_port: 'Ancient Ports'
};

// Compact, elegant authority & classification badge for hazard cards
const getDisasterShortBadge = (type: string, properties: Record<string, any>): string => {
  if (type === 'cyclone_track' || properties.hazard_type === 'cyclone') return 'IMD CYCLONE';
  if (type === 'flood_zone' || properties.hazard_type === 'flood') return 'CWC FLOOD';
  if (type === 'landslide_zone' || properties.hazard_type === 'landslide') return 'GSI NLSM';
  if (type === 'drought_zone' || properties.hazard_type === 'drought') return 'CWC / NITI';
  if (type === 'tsunami_zone' || properties.hazard_type === 'tsunami') return 'INCOIS';
  if (type === 'heatwave_zone' || properties.hazard_type === 'heatwave') return 'IMD / NDMA';
  if (type === 'earthquake_epicenter' || properties.hazard_type === 'earthquake') {
    return properties.magnitude_mw ? `M ${properties.magnitude_mw}` : 'EARTHQUAKE';
  }
  if (properties.zone_code) return properties.zone_code;

  const rawAuth = properties.authority ? properties.authority.split('(')[0].trim() : '';
  if (!rawAuth) return 'BIS 1893';
  if (/NITI.*Water|CWC/i.test(rawAuth)) return 'CWC / NITI';
  if (/INCOIS/i.test(rawAuth)) return 'INCOIS';
  if (/Bureau of Indian Standards|BIS/i.test(rawAuth)) return 'BIS IS 1893';
  if (/Geological Survey|GSI/i.test(rawAuth)) return 'GSI NLSM';
  if (/National Centre for Seismology|NCS/i.test(rawAuth)) return 'NCS / MoES';
  if (/NDMA.*IMD|IMD.*NDMA/i.test(rawAuth)) return 'IMD / NDMA';
  if (/NDMA/i.test(rawAuth)) return 'NDMA';
  if (/IMD/i.test(rawAuth)) return 'IMD';
  if (/Central Water Commission/i.test(rawAuth)) return 'CWC';
  if (rawAuth.length <= 12) return rawAuth.toUpperCase();
  return rawAuth.slice(0, 11).toUpperCase() + '…';
};

interface InfoPanelProps {
  feature: SelectedFeatureInfo | null;
  onClose: () => void;
  isOpen?: boolean;
  comparisonConfig?: EnvironmentalComparisonConfig;
}

// Collapsible section wrapper (accordion) for the dossier panels with silky-smooth snappy transitions.
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
        className="w-full px-4 py-3 flex items-center justify-between gap-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-white/5 transition-colors cursor-pointer select-none"
      >
        <span className="flex items-center gap-1.5 min-w-0">{icon}<span className="truncate">{title}</span></span>
        <span className="flex items-center gap-2 shrink-0">
          {badge && <span className="text-[10px] font-mono text-neutral-400 font-bold">{badge}</span>}
          <ChevronDown className={`w-4 h-4 text-neutral-400 chevron-rotate ${open ? 'is-open text-white' : ''}`} />
        </span>
      </button>
      <div className={`accordion-collapse ${open ? 'is-open' : ''}`}>
        <div>
          <div className="px-4 pb-4 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const InfoPanel: React.FC<InfoPanelProps> = ({ feature, onClose, comparisonConfig }) => {
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
  const explicitWikiUrl = properties.wikipedia_url;
  const wikiName = (properties.name || displayName || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  const wikiUrl = explicitWikiUrl || (wikiName ? `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiName.replace(/\s+/g, '_'))}` : undefined);
  const stateLandmarks = type === 'state' ? STATE_LANDMARKS[properties.shapeName || displayName] : undefined;
  const stateCrops = type === 'state' ? STATE_CROPS[properties.shapeName || displayName] : undefined;
  const stateWildlife = type === 'state' ? STATE_WILDLIFE[properties.shapeName || displayName] : undefined;

  return (
    <aside className="w-full h-full bg-[#080a0e]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col z-20 text-neutral-200 select-none shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-[#0a0d14]/90 flex items-start justify-between gap-3 shrink-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase text-[#C9A227]">
            <span className="truncate">{type.replace('_', ' ')} Intelligence</span>
            {properties.shapeGroup && <span className="text-neutral-400 truncate">• {properties.shapeGroup}</span>}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-1 break-words">{displayName}</h2>
          
          {properties.capital && (
            <p className="font-mono text-sm text-neutral-200 font-bold flex items-center gap-1.5 mt-1 break-words">
              <Building className="w-4 h-4 text-[#C9A227] shrink-0" />
              <span>Capital: {properties.capital}</span>
            </p>
          )}
          {properties.period && (
            <p className="font-mono text-sm text-amber-400 font-bold mt-1 flex items-center gap-1.5 break-words">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{properties.period}</span>
            </p>
          )}
          {properties.river_system && (
            <p className="font-mono text-sm text-sky-400 font-bold mt-1 break-words">{properties.river_system}</p>
          )}
          {properties.category && (
            <p className="font-mono text-sm text-amber-400 font-bold mt-1 break-words">{properties.category}</p>
          )}
          {properties.state_name && type === 'district' && (
            <p className="font-mono text-sm text-neutral-300 font-bold mt-1 break-words">State: {properties.state_name}</p>
          )}

          {/* Direct Wikipedia Reference Button with Serif 'W' Badge */}
          {wikiUrl && (
            <div className="mt-2.5">
              <a
                href={wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer group"
                title={`Open Wikipedia article for ${displayName}`}
              >
                <span className="w-4 h-4 rounded bg-white text-black font-serif font-black text-[11px] flex items-center justify-center leading-none select-none shrink-0">
                  W
                </span>
                <span className="group-hover:underline font-sans text-xs">Wikipedia</span>
                <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-white ml-0.5 shrink-0" />
              </a>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
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
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <span className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Landmark className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="truncate">Imperial Chronology</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-bold shrink-0 max-w-[120px] truncate">
                  {properties.period_id?.toUpperCase() || 'HISTORICAL'}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {properties.era && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Era / Horizon:</span>
                    <span className="font-bold text-white text-sm text-right min-w-0 break-words">{properties.era}</span>
                  </div>
                )}
                {properties.capital && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Dynastic Capital:</span>
                    <span className="font-bold text-[#C9A227] text-sm text-right min-w-0 break-words">{properties.capital}</span>
                  </div>
                )}
                {properties.ruler_or_system && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Ruler / System:</span>
                    <span className="font-bold text-amber-300 text-sm text-right min-w-0 break-words">{properties.ruler_or_system}</span>
                  </div>
                )}
                {properties.approximate_area_sqkm && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Approx. Territorial Extent:</span>
                    <span className="font-bold text-emerald-400 text-sm text-right min-w-0 break-words">
                      {properties.approximate_area_sqkm.toLocaleString()} km²
                    </span>
                  </div>
                )}
                {properties.highlights && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Highlights:</span>
                    <span className="text-neutral-200 break-words leading-relaxed">{properties.highlights}</span>
                  </div>
                )}
                {properties.trade_connections && (
                  <div className="py-1.5">
                    <span className="text-neutral-400 block text-[11px]">Trade Connections:</span>
                    <span className="text-sky-300 break-words leading-relaxed">{properties.trade_connections}</span>
                  </div>
                )}
              </div>

              {/* Approximate Reconstruction Disclaimer */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono leading-relaxed mt-2 break-words">
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
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <span className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Scroll className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="truncate">Archaeological Profile</span>
                </span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <a href={`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(wikiName)}`} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/30 border border-white/25 flex items-center justify-center text-xs font-black text-white transition-colors cursor-pointer shrink-0" title={`Wikipedia: ${wikiName}`} aria-label={`Wikipedia article for ${wikiName}`}>W</a>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-500/30 font-bold shrink-0">
                    ASI MONUMENT
                  </span>
                </span>
              </div>

              {properties.description && (
                <p className="text-xs font-mono text-neutral-200 leading-relaxed break-words">{properties.description}</p>
              )}

              <div className="space-y-2 text-xs font-mono">
                {properties.civilization && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Civilization:</span>
                    <span className="font-bold text-teal-300 text-sm text-right ml-2 min-w-0 break-words">{properties.civilization}</span>
                  </div>
                )}
                {properties.category && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Category:</span>
                    <span className="font-bold text-teal-300 text-sm text-right ml-2 min-w-0 break-words">{SITE_CATEGORY_LABELS[properties.category] || properties.category}</span>
                  </div>
                )}
                {properties.period && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Chronological Period:</span>
                    <span className="font-bold text-white text-sm text-right ml-2 min-w-0 break-words">{properties.period}</span>
                  </div>
                )}
                {properties.excavator && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Excavator / Team:</span>
                    <span className="font-bold text-amber-300 text-xs text-right ml-2 min-w-0 break-words">{properties.excavator}</span>
                  </div>
                )}
                {properties.discovery_year && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Discovery Year:</span>
                    <span className="font-bold text-white text-right ml-2 min-w-0 break-words">{properties.discovery_year}</span>
                  </div>
                )}
                {properties.key_finds && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Key Archaeological Finds:</span>
                    <span className="text-neutral-200 leading-relaxed break-words">{properties.key_finds}</span>
                  </div>
                )}
                {properties.status && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Protection Status:</span>
                    <span className="font-bold text-emerald-300 text-xs text-right ml-2 min-w-0 break-words">{properties.status}</span>
                  </div>
                )}
                {properties.citation && (
                  <div className="py-1.5">
                    <span className="text-neutral-400 block text-[11px]">Citation / Source:</span>
                    <span className="text-neutral-300 text-[11px] leading-relaxed break-words">{properties.citation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. Trade Route & Connectivity Dossier */}
        {type === 'trade_route' && (
          <div className="space-y-3">
            <div className="vista-card p-4 space-y-3 border border-sky-500/30">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <span className="flex items-center gap-1.5 min-w-0 flex-1">
                  {properties.category === 'ancient_port' ? (
                    <Anchor className="w-4 h-4 text-amber-300 shrink-0" />
                  ) : properties.category === 'historical_railway' ? (
                    <Train className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : properties.category === 'maritime_route' ? (
                    <Waves className="w-4 h-4 text-sky-400 shrink-0" />
                  ) : properties.category === 'silk_road' ? (
                    <Mountain className="w-4 h-4 text-purple-400 shrink-0" />
                  ) : properties.category === 'spice_route' ? (
                    <Trees className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : properties.category === 'colonial_network' ? (
                    <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                  ) : (
                    <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="text-white truncate">
                    {properties.category_display || (properties.category === 'ancient_port' ? 'Ancient Port & Emporium' : 'Trade & Connectivity Artery')}
                  </span>
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border shrink-0 max-w-[130px] truncate ${
                  properties.category === 'ancient_port'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-400/40'
                    : properties.category === 'historical_railway'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    : properties.category === 'silk_road'
                    ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                    : properties.category === 'spice_route'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : properties.category === 'colonial_network'
                    ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
                    : 'bg-sky-950/80 text-sky-300 border-sky-500/30'
                }`}>
                  {properties.route_type_display || properties.route_type || 'TRADE ARTERY'}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {(properties.era || properties.era_active) && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Epoch / Active Era:</span>
                    <span className="font-bold text-white text-sm text-right min-w-0 break-words">{properties.era || properties.era_active}</span>
                  </div>
                )}
                {properties.total_length_km && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Total Route Length:</span>
                    <span className="font-bold text-sky-300 text-right min-w-0 break-words">{properties.total_length_km.toLocaleString()} km</span>
                  </div>
                )}
                {properties.termini && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Termini &amp; Coastal Endpoints:</span>
                    <span className="text-neutral-200 break-words leading-relaxed">{properties.termini}</span>
                  </div>
                )}
                {properties.location_desc && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Geographical Location:</span>
                    <span className="text-amber-300 font-sans break-words leading-relaxed">{properties.location_desc}</span>
                  </div>
                )}
                {(properties.connected_nodes || properties.key_stations) && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Connected Hubs, Ports &amp; Stations:</span>
                    <span className="text-amber-400 leading-relaxed font-sans break-words">{properties.connected_nodes || properties.key_stations}</span>
                  </div>
                )}
                {properties.commodities && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Principal Commodities &amp; Cargo:</span>
                    <span className="text-emerald-400 font-bold leading-relaxed font-sans break-words">{properties.commodities}</span>
                  </div>
                )}
                {(properties.chronicles || properties.historical_accounts) && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Historical Chroniclers &amp; Primary Accounts:</span>
                    <span className="text-neutral-300 italic font-sans break-words leading-relaxed">{properties.chronicles || properties.historical_accounts}</span>
                  </div>
                )}
                {properties.significance && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Historical Significance &amp; Impact:</span>
                    <span className="text-neutral-200 text-[11px] leading-relaxed font-sans break-words">{properties.significance}</span>
                  </div>
                )}
                {properties.citation && (
                  <div className="pt-1.5">
                    <span className="text-neutral-500 block text-[10px] uppercase tracking-wider">Official Institutional Citation:</span>
                    <span className="text-sky-300 text-[11px] leading-relaxed break-words">{properties.citation}</span>
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
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <span className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Route className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="truncate">Road Corridor Profile</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950/80 text-orange-300 border border-orange-500/30 font-bold shrink-0 max-w-[120px] truncate">
                  {properties.category || 'HIGHWAY'}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {properties.code && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Route Designation:</span>
                    <span className="font-bold text-orange-300 text-sm text-right min-w-0 break-words">{properties.code}</span>
                  </div>
                )}
                {properties.from && properties.to && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Terminal Points:</span>
                    <span className="text-neutral-200 break-words leading-relaxed">{properties.from} → {properties.to}</span>
                  </div>
                )}
                {properties.length_km && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Route Length:</span>
                    <span className="font-bold text-[#C9A227] text-sm text-right min-w-0 break-words">{properties.length_km.toLocaleString()} km</span>
                  </div>
                )}
                {properties.states && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">States Served:</span>
                    <span className="text-amber-300 break-words leading-relaxed">{properties.states}</span>
                  </div>
                )}
                {properties.corridor && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Corridor Class:</span>
                    <span className="font-bold text-white text-sm text-right min-w-0 break-words">{properties.corridor}</span>
                  </div>
                )}
                <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                  <span className="text-neutral-400 shrink-0">Configuration:</span>
                  <span className="font-bold text-neutral-200 text-right min-w-0 break-words">{properties.lanes || '—'} lanes</span>
                </div>
                <div className="flex justify-between items-start py-1.5 gap-2">
                  <span className="text-neutral-400 shrink-0">Tolled / Access:</span>
                  <span className={`font-bold text-sm text-right min-w-0 break-words ${properties.toll ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {properties.toll ? 'Tolled · Access-Controlled' : 'Open Access'}
                  </span>
                </div>
                {properties.status && (
                  <div className="pt-1.5 border-t border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Status:</span>
                    <span className="text-emerald-300 font-bold break-words leading-relaxed">{properties.status}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. Disaster & Hazard Intelligence Dossier */}
        {(type === 'seismic_zone' || 
          type === 'earthquake_epicenter' || 
          type === 'disaster_hazard' || 
          type === 'cyclone_track' || 
          type === 'flood_zone' || 
          type === 'landslide_zone' || 
          type === 'drought_zone' || 
          type === 'tsunami_zone' || 
          type === 'heatwave_zone') && (
          <div className="space-y-3">
            <div className="vista-card p-4 space-y-3 border border-rose-500/40 bg-[#14080b]/90">
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/10">
                <div className="flex items-start gap-1.5 min-w-0 flex-1 text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {type === 'cyclone_track' || properties.hazard_type === 'cyclone' ? (
                    <Wind className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                  ) : type === 'flood_zone' || properties.hazard_type === 'flood' ? (
                    <Waves className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  ) : type === 'landslide_zone' || properties.hazard_type === 'landslide' ? (
                    <Mountain className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : type === 'drought_zone' || properties.hazard_type === 'drought' ? (
                    <Sun className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  ) : type === 'tsunami_zone' || properties.hazard_type === 'tsunami' ? (
                    <Waves className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  ) : type === 'heatwave_zone' || properties.hazard_type === 'heatwave' ? (
                    <Flame className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : type === 'earthquake_epicenter' || properties.hazard_type === 'earthquake' ? (
                    <Activity className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-snug break-words">
                    {type === 'cyclone_track' || properties.hazard_type === 'cyclone'
                      ? 'Tropical Cyclone Track & Landfall'
                      : type === 'flood_zone' || properties.hazard_type === 'flood'
                      ? 'High-Risk Flood Plain / Basin'
                      : type === 'landslide_zone' || properties.hazard_type === 'landslide'
                      ? 'Landslide Susceptibility Zone'
                      : type === 'drought_zone' || properties.hazard_type === 'drought'
                      ? 'Chronic Drought-Prone Region'
                      : type === 'tsunami_zone' || properties.hazard_type === 'tsunami'
                      ? 'Tsunami Coastal Inundation Zone'
                      : type === 'heatwave_zone' || properties.hazard_type === 'heatwave'
                      ? 'Severe Heatwave Hazard Core'
                      : type === 'earthquake_epicenter' || properties.hazard_type === 'earthquake'
                      ? 'Historical Earthquake Event'
                      : 'BIS Seismic Hazard Zone'}
                  </span>
                </div>
                <span 
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30 font-bold shrink-0 max-w-[125px] text-center tracking-normal whitespace-nowrap mt-0.5"
                  title={properties.authority ? properties.authority.split('(')[0].trim() : 'NDMA / BIS'}
                >
                  {getDisasterShortBadge(type, properties)}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {/* Seismic Fields */}
                {(properties.zone_code || properties.zone_name) && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Seismic Hazard Zone:</span>
                    <span className="font-bold text-rose-400 text-sm text-right min-w-0 break-words">{properties.zone_code || properties.zone_name} ({properties.hazard_level || 'Zone V'})</span>
                  </div>
                )}
                {properties.zone_factor_z && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Zone Factor (Z) &amp; PGA:</span>
                    <span className="font-bold text-white text-sm text-right min-w-0 break-words">{properties.zone_factor_z} ({properties.peak_ground_accel || 'High Acceleration'})</span>
                  </div>
                )}
                {properties.seismic_intensity && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Expected Ground Shaking:</span>
                    <span className="font-bold text-amber-300 text-right min-w-0 break-words">{properties.seismic_intensity}</span>
                  </div>
                )}
                {properties.building_code_mandate && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Building Code Mandate:</span>
                    <span className="text-rose-300 font-semibold break-words leading-relaxed">{properties.building_code_mandate}</span>
                  </div>
                )}

                {/* Earthquake Fields */}
                {properties.year && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Event Year / Date:</span>
                    <span className="font-bold text-white text-sm text-right min-w-0 break-words">{properties.date_str || properties.year}</span>
                  </div>
                )}
                {(properties.magnitude_mw || properties.magnitude) && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Moment Magnitude (Mw):</span>
                    <span className="font-black text-rose-400 text-lg text-right min-w-0 break-words">M {properties.magnitude_mw || properties.magnitude}</span>
                  </div>
                )}
                {properties.depth_km && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Focal Depth:</span>
                    <span className="font-bold text-neutral-200 text-right min-w-0 break-words">{properties.depth_km} km</span>
                  </div>
                )}
                {(properties.fatalities_approx || properties.casualties) && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Human Casualties / Impact:</span>
                    <span className="font-bold text-red-400 text-right min-w-0 break-words">{properties.casualties || Number(properties.fatalities_approx).toLocaleString()}</span>
                  </div>
                )}
                {(properties.fault_system || properties.tectonic_setting) && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Tectonic Fault / Mechanism:</span>
                    <span className="text-amber-300 break-words leading-relaxed">{properties.fault_system || properties.tectonic_setting}</span>
                  </div>
                )}

                {/* Cyclone Fields */}
                {properties.cyclone_category && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Storm Intensity Category:</span>
                    <span className="font-bold text-fuchsia-300 text-right min-w-0 break-words">{properties.cyclone_category}</span>
                  </div>
                )}
                {properties.wind_speed_kmh && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Peak 3-Min Sustained Winds:</span>
                    <span className="font-black text-rose-400 text-base text-right min-w-0 break-words">{properties.wind_speed_kmh} km/h</span>
                  </div>
                )}
                {properties.central_pressure_hpa && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Central Barometric Pressure:</span>
                    <span className="font-bold text-neutral-200 text-right min-w-0 break-words">{properties.central_pressure_hpa} hPa</span>
                  </div>
                )}
                {properties.storm_surge_m && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Storm Surge Inundation:</span>
                    <span className="font-bold text-teal-300 text-right min-w-0 break-words">{properties.storm_surge_m} m above normal tide</span>
                  </div>
                )}
                {properties.landfall_point && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Coastal Landfall:</span>
                    <span className="font-bold text-amber-300 text-right min-w-0 break-words">{properties.landfall_point}</span>
                  </div>
                )}
                {properties.evacuation_count && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Civil Defense Evacuation:</span>
                    <span className="text-emerald-400 font-semibold break-words leading-relaxed">{properties.evacuation_count}</span>
                  </div>
                )}

                {/* Flood Fields */}
                {properties.basin_name && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">River Basin Catchment:</span>
                    <span className="font-bold text-sky-300 text-right min-w-0 break-words">{properties.basin_name}</span>
                  </div>
                )}
                {properties.inundated_sqkm && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Inundated Flood Area:</span>
                    <span className="font-bold text-sky-400 text-right min-w-0 break-words">{properties.inundated_sqkm.toLocaleString()} sq km</span>
                  </div>
                )}
                {properties.vulnerable_population && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Vulnerable Population:</span>
                    <span className="font-bold text-rose-300 text-right min-w-0 break-words">{properties.vulnerable_population}</span>
                  </div>
                )}
                {properties.return_period && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Flood Recurrence:</span>
                    <span className="font-semibold text-neutral-300 text-right min-w-0 break-words">{properties.return_period}</span>
                  </div>
                )}

                {/* Landslide Fields */}
                {properties.susceptibility_rating && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">GSI NLSM Susceptibility:</span>
                    <span className="font-bold text-orange-400 text-right min-w-0 break-words">{properties.susceptibility_rating}</span>
                  </div>
                )}
                {properties.rock_formation && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Geological Lithology &amp; Bedrock:</span>
                    <span className="text-neutral-200 break-words leading-relaxed">{properties.rock_formation}</span>
                  </div>
                )}
                {properties.trigger_mechanisms && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Primary Trigger Factors:</span>
                    <span className="text-amber-300 break-words leading-relaxed">{properties.trigger_mechanisms}</span>
                  </div>
                )}

                {/* Drought Fields */}
                {properties.aridity_index && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Aridity &amp; Drought Index:</span>
                    <span className="font-bold text-amber-400 text-right min-w-0 break-words">{properties.aridity_index}</span>
                  </div>
                )}
                {properties.rainfall_deficit_pct && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Rainfall Deficit / Pattern:</span>
                    <span className="text-rose-300 font-semibold break-words leading-relaxed">{properties.rainfall_deficit_pct}</span>
                  </div>
                )}
                {properties.mitigation_scheme && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Mitigation &amp; Water Security:</span>
                    <span className="text-emerald-400 break-words leading-relaxed">{properties.mitigation_scheme}</span>
                  </div>
                )}

                {/* Tsunami Fields */}
                {properties.inundation_buffer_km && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Coastal Inundation Buffer:</span>
                    <span className="font-bold text-teal-300 text-right min-w-0 break-words">{properties.inundation_buffer_km} km inland</span>
                  </div>
                )}
                {properties.max_runup_m && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Maximum Run-Up Height:</span>
                    <span className="font-bold text-teal-400 text-base text-right min-w-0 break-words">{properties.max_runup_m} meters</span>
                  </div>
                )}
                {properties.early_warning_time_min && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">ITEWC Lead Warning Window:</span>
                    <span className="font-bold text-amber-300 text-right min-w-0 break-words">~{properties.early_warning_time_min} minutes</span>
                  </div>
                )}

                {/* Heatwave Fields */}
                {properties.max_recorded_temp_c && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">All-Time Peak Temperature:</span>
                    <span className="font-black text-rose-400 text-lg text-right min-w-0 break-words">{properties.max_recorded_temp_c} °C</span>
                  </div>
                )}
                {properties.avg_heatwave_days && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Annual Heatwave Days:</span>
                    <span className="font-bold text-amber-400 text-right min-w-0 break-words">{properties.avg_heatwave_days} days / summer</span>
                  </div>
                )}
                {properties.wet_bulb_risk && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Wet-Bulb Thermal Stress:</span>
                    <span className="text-rose-300 font-semibold break-words leading-relaxed">{properties.wet_bulb_risk}</span>
                  </div>
                )}
                {properties.action_plan_framework && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Heat Action Plan Protocol:</span>
                    <span className="text-emerald-400 break-words leading-relaxed">{properties.action_plan_framework}</span>
                  </div>
                )}

                {/* Summary / Intelligence Assessment */}
                {(properties.summary || properties.description) && (
                  <div className="pt-2">
                    <span className="text-neutral-400 block text-[11px] mb-1 font-sans uppercase font-bold tracking-wider">
                      Intelligence Assessment &amp; Hazard Brief:
                    </span>
                    <p className="text-neutral-300 font-sans text-xs leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5 break-words">
                      {properties.summary || properties.description}
                    </p>
                  </div>
                )}

                {/* Official Authority & Citation */}
                {(properties.official_reference || properties.authority) && (
                  <div className="pt-2 flex items-start gap-1.5 text-[10px] text-neutral-400 font-mono border-t border-white/5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="break-words leading-relaxed min-w-0 flex-1">
                      Authority: <strong className="text-neutral-200">{properties.authority}</strong>
                      {properties.official_reference && <> • Reference: <em>{properties.official_reference}</em></>}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* 4.5 Environmental Change & Climate Explorer Dossier */}
        {type === 'environmental_change' && (
          <div className="space-y-3">
            <div className="vista-card p-4 space-y-3 border border-emerald-500/40 bg-[#0a1518]/90">
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/10 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <div className="flex items-start gap-1.5 min-w-0 flex-1">
                  {properties.pillar === 'forest_change' ? (
                    <TreePine className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : properties.pillar === 'glacier_retreat' ? (
                    <Mountain className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  ) : properties.pillar === 'urban_expansion' ? (
                    <Building2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  ) : properties.pillar === 'coastal_erosion' ? (
                    <Waves className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : properties.pillar === 'wetland_change' ? (
                    <Droplets className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  ) : properties.pillar === 'desertification' ? (
                    <Sun className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  ) : properties.pillar === 'groundwater_stress' ? (
                    <Gauge className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  ) : (
                    <Compass className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  )}
                  <span className="text-white leading-snug break-words">
                    {properties.category_name || 'Environmental Change'}
                  </span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border shrink-0 max-w-[120px] whitespace-nowrap text-center mt-0.5 ${
                  properties.severity_code === 'severe'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    : properties.severity_code === 'high'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    : properties.severity_code === 'positive'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-yellow-950/80 text-yellow-300 border-yellow-500/40'
                }`}>
                  {properties.severity_level || 'ASSESSED'}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {properties.region && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Geographical Region / Jurisdiction:</span>
                    <span className="text-white font-sans font-bold break-words leading-relaxed">{properties.region}</span>
                  </div>
                )}

                {/* Dynamic Temporal Comparative Metric Box */}
                {(() => {
                  const temporal = getFeatureTemporalAssessment(
                    properties,
                    comparisonConfig?.yearA,
                    comparisonConfig?.yearB
                  );

                  return (
                    <div className="p-3 bg-[#071114] border border-white/10 rounded-lg space-y-2.5 my-2">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 gap-2">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 min-w-0 flex-1">
                          <Activity className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">Comparative Assessment</span>
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold shrink-0">
                          {temporal.timeSpanYears}y ({temporal.yearA} → {temporal.yearB})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {/* Baseline Box */}
                        <div className="bg-black/40 p-2 rounded-lg border border-amber-500/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-amber-400 text-[10px] uppercase font-bold font-mono">
                              Baseline ({temporal.yearA}):
                            </span>
                          </div>
                          <div className="text-amber-200 font-bold text-[11px] font-sans break-words leading-tight">
                            {temporal.textA}
                          </div>
                          {temporal.contextA && (
                            <div className="text-[9.5px] text-neutral-400 font-sans mt-1 leading-snug line-clamp-2">
                              {temporal.contextA}
                            </div>
                          )}
                          <div className="text-[8.5px] text-neutral-500 font-mono mt-1 truncate">
                            {temporal.dateLabelA} · {temporal.sensorA}
                          </div>
                        </div>

                        {/* Comparison Box */}
                        <div className="bg-black/40 p-2 rounded-lg border border-emerald-500/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-emerald-400 text-[10px] uppercase font-bold font-mono">
                              Compare ({temporal.yearB}):
                            </span>
                          </div>
                          <div className="text-emerald-200 font-bold text-[11px] font-sans break-words leading-tight">
                            {temporal.textB}
                          </div>
                          {temporal.contextB && (
                            <div className="text-[9.5px] text-neutral-400 font-sans mt-1 leading-snug line-clamp-2">
                              {temporal.contextB}
                            </div>
                          )}
                          <div className="text-[8.5px] text-neutral-500 font-mono mt-1 truncate">
                            {temporal.dateLabelB} · {temporal.sensorB}
                          </div>
                        </div>
                      </div>

                      {/* Net Variance */}
                      <div className="pt-1.5 border-t border-white/10 flex justify-between items-center text-xs gap-2">
                        <span className="text-neutral-400 text-[11px] shrink-0">Recorded Net Variance (Δ):</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] shrink-0 ${
                          temporal.severityCode === 'severe'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                            : temporal.severityCode === 'positive'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}>
                          {temporal.deltaText}
                        </span>
                      </div>

                      {/* Annual Change Rate */}
                      <div className="pt-1.5 border-t border-white/10 flex justify-between items-center text-xs gap-2">
                        <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px] shrink-0">
                          <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Annual Change Rate:</span>
                        </span>
                        <span className="font-extrabold text-amber-200 font-mono text-[11px] bg-amber-950/70 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
                          {temporal.annualRateText}
                        </span>
                      </div>

                      {/* Dynamic Assessment Narrative */}
                      <div className="pt-1.5 border-t border-white/10 text-[10.5px] text-neutral-300 leading-relaxed font-sans bg-white/[0.02] p-1.5 rounded break-words">
                        <span className="text-emerald-400 font-bold block mb-0.5 uppercase text-[9px] font-mono">
                          Epoch Assessment ({temporal.yearA} → {temporal.yearB}):
                        </span>
                        {temporal.assessmentSummary}
                      </div>
                    </div>
                  );
                })()}

                {properties.primary_driver && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Primary Driver &amp; Forcing Mechanism:</span>
                    <span className="text-amber-300 leading-relaxed font-sans break-words">{properties.primary_driver}</span>
                  </div>
                )}

                {properties.ecological_impact && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Ecological Impact &amp; Environmental Consequences:</span>
                    <span className="text-neutral-200 text-[11px] leading-relaxed font-sans break-words">{properties.ecological_impact}</span>
                  </div>
                )}

                {properties.citation && (
                  <div className="pt-1.5">
                    <span className="text-neutral-500 block text-[10px] uppercase tracking-wider">Official Publishing Authority:</span>
                    <span className="text-emerald-300 text-[11px] leading-relaxed break-words">{properties.citation}</span>
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
              <div className="text-xs font-mono font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-wider pb-2 border-b border-white/10">
                <Droplet className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">Hydrological Profile (CWC / WRIS)</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                {properties.length_km && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">Total Course Length:</span>
                    <span className="font-bold text-[#C9A227] text-sm text-right min-w-0 break-words">{properties.length_km.toLocaleString()} km</span>
                  </div>
                )}
                {properties.river_system && (
                  <div className="flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                    <span className="text-neutral-400 shrink-0">River Basin:</span>
                    <span className="font-bold text-white text-sm text-right min-w-0 break-words">{properties.river_system}</span>
                  </div>
                )}
                {properties.origin && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Geographic Origin:</span>
                    <span className="text-neutral-200 font-medium break-words leading-relaxed">{properties.origin}</span>
                  </div>
                )}
                {properties.outflow && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Outflow / Destination:</span>
                    <span className="text-neutral-200 font-medium break-words leading-relaxed">{properties.outflow}</span>
                  </div>
                )}
                {properties.states_covered && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Riparian States:</span>
                    <span className="text-neutral-300 break-words leading-relaxed">{properties.states_covered}</span>
                  </div>
                )}
                {properties.dams && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Major Dams &amp; Reservoirs:</span>
                    <span className="text-emerald-400 font-medium break-words leading-relaxed">{properties.dams}</span>
                  </div>
                )}
                {properties.major_cities && (
                  <div className="py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 block text-[11px]">Key Cities along Course:</span>
                    <span className="text-amber-400 font-medium break-words leading-relaxed">{properties.major_cities}</span>
                  </div>
                )}
                {properties.tributaries && (
                  <div className="py-1.5">
                    <span className="text-neutral-400 block text-[11px]">Major Tributaries:</span>
                    <span className="text-neutral-300 break-words leading-relaxed">{properties.tributaries}</span>
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
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <span className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Trees className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="truncate">Pedological Profile</span>
                </span>
                {properties.area_pct && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-bold shrink-0">
                    {properties.area_pct}% of India
                  </span>
                )}
              </div>

              {properties.coverage_sqkm && (
                <div className="text-xs font-mono text-neutral-400 flex justify-between items-start py-1.5 border-b border-white/5 gap-2">
                  <span className="shrink-0">Geographic Area:</span>
                  <span className="text-neutral-200 font-bold text-right min-w-0 break-words">{properties.coverage_sqkm.toLocaleString()} km²</span>
                </div>
              )}

              <p className="text-xs text-neutral-300 leading-relaxed font-sans pt-1 break-words">{properties.composition}</p>

              <div className="pt-2 border-t border-white/5 text-xs font-mono space-y-1">
                <div className="text-neutral-400">Crop Suitability:</div>
                <div className="text-emerald-400 font-bold break-words leading-relaxed">{properties.suitability}</div>
              </div>

              <div className="pt-2 border-t border-white/5 text-xs font-mono space-y-1">
                <div className="text-neutral-400">Geological Genesis:</div>
                <div className="text-neutral-300 break-words leading-relaxed">{properties.geology}</div>
              </div>

              {properties.states && (
                <div className="pt-2 border-t border-white/5 text-xs font-mono space-y-1">
                  <div className="text-neutral-400">Predominant Regions:</div>
                  <div className="text-neutral-300 break-words leading-relaxed">{properties.states.join(', ')}</div>
                </div>
              )}

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono leading-relaxed mt-2 break-words">
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
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <span className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Mountain className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Orogenic &amp; Relief Profile</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold shrink-0">
                  GSI Survey
                </span>
              </div>

              <div className="flex justify-between items-start text-xs font-mono py-1.5 border-b border-white/5 gap-2">
                <span className="text-neutral-400 shrink-0">Highest Peak:</span>
                <span className="font-bold text-amber-400 text-sm text-right min-w-0 break-words">{properties.peak}</span>
              </div>
              <div className="flex justify-between items-start text-xs font-mono py-1.5 border-b border-white/5 gap-2">
                <span className="text-neutral-400 shrink-0">Max Elevation (Ft &amp; In):</span>
                <span className="font-bold text-[#C9A227] text-sm text-right min-w-0 break-words">
                  {properties.elevation_m ? metersToFeetInches(properties.elevation_m) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-start text-xs font-mono py-1.5 border-b border-white/5 gap-2">
                <span className="text-neutral-400 shrink-0">Metric Elevation:</span>
                <span className="font-bold text-neutral-300 text-xs text-right min-w-0 break-words">{properties.elevation_m} m</span>
              </div>
              {properties.extent && (
                <div className="flex justify-between items-start text-xs font-mono py-1.5 border-b border-white/5 gap-2">
                  <span className="text-neutral-400 shrink-0">Strike Extent:</span>
                  <span className="text-neutral-200 text-right min-w-0 break-words">{properties.extent}</span>
                </div>
              )}

              <p className="text-xs text-neutral-300 leading-relaxed font-sans pt-1 break-words">{properties.geology}</p>

              {properties.passes && (
                <div className="pt-2 border-t border-white/5 text-xs font-mono">
                  <span className="text-neutral-400 block">Mountain Passes:</span>
                  <span className="text-amber-400 break-words leading-relaxed">{properties.passes.join(', ')}</span>
                </div>
              )}

              {properties.biodiversity && (
                <div className="pt-2 border-t border-white/5 text-xs font-mono">
                  <span className="text-neutral-400 block">Ecological Significance:</span>
                  <span className="text-emerald-400 break-words leading-relaxed">{properties.biodiversity}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Demographics Details (State or District) with VISTA.IO Style Big Numbers */}
        {demographics && (
          <div className="vista-card p-4">
            <div className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider mb-3 flex items-center justify-between gap-2 pb-2 border-b border-white/10">
              <span className="flex items-center gap-1.5 min-w-0 flex-1">
                <Users className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span className="truncate">Demographic Numbers</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-white/10 text-neutral-200 border border-white/15 font-bold shrink-0">
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
                <div className="mt-3 text-sm font-mono text-neutral-300 flex justify-between items-start py-1.5 border-t border-white/10 font-bold gap-2">
                  <span className="text-neutral-400 font-semibold shrink-0">Geographic Surface Area:</span>
                  <span className="text-white font-bold text-right min-w-0 break-words">{demographics.area_sqkm.toLocaleString()} km²</span>
                </div>
              )}
            </div>

            {/* Literacy & Gender Ratio */}
            <div className="vista-card p-4 space-y-3 font-mono">
              <div className="text-xs font-bold text-white flex items-center justify-between uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Literacy &amp; Sex Ratio</span>
                </span>
              </div>

              {demographics.literacy_rate !== undefined && (
                <div>
                  <div className="flex justify-between items-start text-sm mb-1.5 font-bold gap-2">
                    <span className="text-neutral-300 shrink-0">Literacy Rate:</span>
                    <span className="font-extrabold text-emerald-400 text-base text-right min-w-0 break-words">{demographics.literacy_rate}%</span>
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
                <div className="pt-2.5 border-t border-white/10 flex justify-between items-center text-sm font-bold gap-2">
                  <span className="text-neutral-300 flex items-center gap-1.5 font-semibold shrink-0">
                    <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                    Sex Ratio:
                  </span>
                  <span className="font-bold text-rose-300 px-2.5 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 shrink-0">
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
                    <PieChart className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Faith Communities (C-01)</span>
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
            <div className="break-words leading-relaxed"><span className="text-white font-bold">Authority:</span> {properties.source || demographics?.source || 'Government of India / ASI / BIS'}</div>
            <div className="break-words leading-relaxed"><span className="text-white font-bold">Baseline Reference:</span> {properties.year || demographics?.census_year || 'Official Record'}</div>
            <div className="text-xs text-neutral-300 pt-2 border-t border-white/10 leading-relaxed font-sans font-semibold break-words">
              All factual attributes strictly originate from official government publications, ASI excavation memoirs, and academic peer-reviewed cartography.
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </aside>
  );
};
