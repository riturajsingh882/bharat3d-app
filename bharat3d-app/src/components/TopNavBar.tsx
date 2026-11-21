import React, { useEffect, useMemo, useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  ShieldCheck, 
  ChevronRight, 
  Layers, 
  Eye,
  Camera,
  Mountain,
  Scale
} from 'lucide-react';
import type { BasemapStyle, CameraPreset, SearchTarget, SelectedFeatureInfo } from '../types';
import { BharatLogo } from './BharatLogo';

interface SearchEntry {
  name: string;
  type: string;
  key?: string;
  sub?: string;
  aliases?: string[];
  lat?: number;
  lng?: number;
  zoom?: number;
  bbox?: [[number, number], [number, number]];
}

const TYPE_LABEL: Record<string, string> = {
  city: 'City',
  state: 'State',
  district: 'District',
  river: 'River',
  mountain: 'Range',
  peak: 'Peak',
  archaeological_site: 'Site',
  historical_empire: 'Empire',
  historical_capital: 'Capital',
  trade_route: 'Trade Route',
  ancient_port: 'Port',
  highway: 'Road'
};

const TYPE_COLOR: Record<string, string> = {
  city: 'text-cyan-300',
  state: 'text-[#C9A227]',
  district: 'text-sky-300',
  river: 'text-sky-400',
  mountain: 'text-emerald-300',
  peak: 'text-amber-300',
  archaeological_site: 'text-teal-300',
  historical_empire: 'text-amber-400',
  historical_capital: 'text-purple-300',
  trade_route: 'text-emerald-400',
  ancient_port: 'text-amber-300',
  highway: 'text-orange-300'
};

const TYPE_PRIORITY: Record<string, number> = {
  city: 100,
  state: 95,
  district: 90,
  peak: 80,
  archaeological_site: 75,
  ancient_port: 72,
  river: 70,
  mountain: 68,
  highway: 65,
  trade_route: 55,
  historical_capital: 50,
  historical_empire: 50
};

const normSearch = (s: string) => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

interface TopNavBarProps {
  is3D: boolean;
  setIs3D: (val: boolean) => void;
  terrainExaggeration: number;
  setTerrainExaggeration: (val: number) => void;
  basemapStyle: BasemapStyle;
  setBasemapStyle: (style: BasemapStyle) => void;
  onSearchSelect: (target: SearchTarget) => void;
  onResetView: () => void;
  onOpenSourceModal: () => void;
  onOpenComparison: () => void;
  selectedFeature: SelectedFeatureInfo | null;
  isElevationHighlight: boolean;
  setIsElevationHighlight: (val: boolean) => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  is3D,
  setIs3D,
  terrainExaggeration,
  setTerrainExaggeration,
  basemapStyle,
  setBasemapStyle,
  onSearchSelect,
  onResetView,
  onOpenSourceModal,
  onOpenComparison,
  selectedFeature,
  isElevationHighlight,
  setIsElevationHighlight,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSlider, setShowSlider] = useState(false);
  const [showBasemapMenu, setShowBasemapMenu] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  // Cinematic Geographic Camera Presets
  const cameraPresets: CameraPreset[] = [
    {
      id: 'india',
      name: 'Pan-India Overview',
      description: 'National Subcontinental Perspective',
      lat: 22.5937,
      lng: 78.9629,
      zoom: 4.8,
      pitch: 52,
      bearing: -8
    },
    {
      id: 'himalayas',
      name: 'Himalayan Ridge & Karakoram',
      description: 'High Relief Orogenic Arc',
      lat: 29.5,
      lng: 82.5,
      zoom: 6.5,
      pitch: 75,
      bearing: -25
    },
    {
      id: 'ganga',
      name: 'Indo-Gangetic Basin',
      description: 'Alluvial Plains & Sacred Rivers',
      lat: 26.5,
      lng: 82.0,
      zoom: 6.8,
      pitch: 45,
      bearing: 5
    },
    {
      id: 'deccan',
      name: 'Deccan Volcanic Plateau',
      description: 'Basaltic Regur & Cratons',
      lat: 18.5,
      lng: 76.5,
      zoom: 6.4,
      pitch: 48,
      bearing: -15
    },
    {
      id: 'ghats',
      name: 'Western Ghats Escarpment',
      description: 'Biodiversity Hotspot & Coastal Slopes',
      lat: 14.2,
      lng: 75.0,
      zoom: 7.2,
      pitch: 68,
      bearing: 30
    },
    {
      id: 'northeast',
      name: 'Northeast & Brahmaputra Valley',
      description: 'Eastern Himalayas & Fluvial Valley',
      lat: 26.2,
      lng: 92.8,
      zoom: 6.6,
      pitch: 58,
      bearing: -10
    }
  ];

  const [searchIndex, setSearchIndex] = useState<SearchEntry[]>([]);

  useEffect(() => {
    fetch('/data/search_index.json')
      .then((r) => r.json())
      .then((d) => setSearchIndex(Array.isArray(d?.entries) ? d.entries : []))
      .catch(() => setSearchIndex([]));
  }, []);

  const searchResults = useMemo(() => {
    const q = normSearch(searchQuery);
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);

    const scored: { entry: SearchEntry; score: number }[] = [];
    for (const entry of searchIndex) {
      const name = normSearch(entry.name);
      const aliases = (entry.aliases || []).map((a) => normSearch(a));
      const sub = normSearch(entry.sub || '');

      let s = -1;
      if (name === q) s = 1000;
      else if (aliases.includes(q)) s = 950;
      else if (name.startsWith(q)) s = 800;
      else if (aliases.some((a) => a.startsWith(q))) s = 780;
      else if (tokens.length > 1 && tokens.every((t) => name.includes(t))) s = 550;
      else if (name.includes(q)) s = 400;
      else if (aliases.some((a) => a.includes(q))) s = 380;
      else if (sub.includes(q)) s = 220;
      else if (tokens.length > 1 && tokens.every((t) => `${name} ${sub} ${aliases.join(' ')}`.includes(t))) s = 160;
      if (s < 0) continue;

      scored.push({ entry, score: s + (TYPE_PRIORITY[entry.type] || 0) });
    }

    scored.sort((a, b) => b.score - a.score || a.entry.name.length - b.entry.name.length);
    return scored.slice(0, 12);
  }, [searchQuery, searchIndex]);

  const handleSelectSearch = (entry: SearchEntry) => {
    onSearchSelect({
      name: entry.name,
      type: entry.type,
      key: entry.key,
      lat: entry.lat,
      lng: entry.lng,
      zoom: entry.zoom,
      bbox: entry.bbox
    });
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSelectSearch(searchResults[0].entry);
    }
  };

  return (
    <header className="h-auto md:h-14 px-2 md:px-4 py-1.5 md:py-0 bg-[#07090d]/95 backdrop-blur-xl border-b border-white/10 flex flex-wrap md:flex-nowrap items-center justify-between gap-1.5 md:gap-2 z-30 shrink-0 select-none shadow-[0_4px_30px_rgba(0,0,0,0.8)] font-sans">
      {/* Left: Fresh New BHARAT 3D Logo & Breadcrumb Focus */}
      <div className="order-1 flex items-center gap-3">
        <BharatLogo size="sm" showSubtitle={false} compactOnMobile />

        <div className="h-4 w-px bg-white/15 mx-1 hidden sm:block" />

        {/* Breadcrumb Focus */}
        <div className="hidden md:flex items-center gap-1.5 text-sm font-mono text-neutral-200">
          <button 
            onClick={onResetView}
            className="hover:text-[#C9A227] text-neutral-300 font-bold transition-colors flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/5 cursor-pointer text-sm"
          >
            <span>Subcontinent</span>
          </button>

          {selectedFeature && (
            <>
              <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
              <span className="text-white font-bold text-sm px-2.5 py-0.5 rounded bg-[#161a22] border border-[#C9A227]/50 text-[#C9A227] shadow-[0_0_10px_rgba(201,162,39,0.2)]">
                {selectedFeature.properties.shapeName || selectedFeature.properties.name || selectedFeature.name}
              </span>
              {selectedFeature.properties.capital && (
                <span className="text-neutral-400 text-xs font-semibold hidden md:inline">
                  ({selectedFeature.properties.capital})
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="order-3 w-full min-w-0 relative md:order-2 md:w-auto md:flex-1 md:max-w-md md:mx-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search states, cities, districts, rivers, roads…"
            className="w-full bg-[#10141a] border border-white/10 rounded-full pl-10 pr-9 py-2 text-sm text-white placeholder-neutral-400 font-semibold focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </form>

        {/* Dropdown Live Search Suggestions */}
        {searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 vista-card rounded-xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto border border-white/15 bg-[#0e1117]">
            {searchResults.map(({ entry }, idx) => (
              <button
                key={entry.type + entry.name + idx}
                onClick={() => handleSelectSearch(entry)}
                className="w-full px-4 py-2.5 text-left text-sm text-neutral-200 hover:bg-[#C9A227]/15 hover:text-white transition-colors flex items-center justify-between gap-2 border-b border-white/5 last:border-b-0 cursor-pointer font-sans"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-white/10 shrink-0 ${TYPE_COLOR[entry.type] || 'text-neutral-300'}`}>
                    {TYPE_LABEL[entry.type] || entry.type}
                  </span>
                  <span className="truncate font-semibold">{entry.name}</span>
                </span>
                {entry.sub && (
                  <span className="hidden sm:block text-xs text-neutral-400 font-medium truncate max-w-[45%] shrink-0">{entry.sub}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Views, Basemap, 3D, Exaggeration, Sources */}
      <div className="order-2 ml-auto md:order-3 md:ml-0 flex items-center gap-1.5 md:gap-2 shrink-0">
        {/* Camera Cinema Presets */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setShowPresetMenu(!showPresetMenu);
              setShowBasemapMenu(false);
              setShowSlider(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-sans font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
              showPresetMenu
                ? 'bg-[#181d26] text-white border-[#C9A227] shadow-[0_0_12px_rgba(201,162,39,0.3)]'
                : 'bg-[#10141a] text-neutral-200 border-white/10 hover:border-white/20 hover:text-white'
            }`}
            title="Cinematic Camera Perspectives"
          >
            <Camera className="w-4 h-4 text-[#C9A227]" />
            <span className="hidden sm:inline">Views</span>
          </button>

          {showPresetMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 vista-card rounded-xl shadow-2xl z-50 p-2 space-y-1 bg-[#0e1117] border border-white/15">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#C9A227] px-2 py-1">
                Cinematic Perspectives
              </div>
              {cameraPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSearchSelect({
                      lat: preset.lat,
                      lng: preset.lng,
                      zoom: preset.zoom,
                      pitch: preset.pitch,
                      bearing: preset.bearing,
                      name: preset.name
                    });
                    setShowPresetMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-[#C9A227]/15 text-neutral-200 transition-all flex flex-col group cursor-pointer"
                >
                  <span className="text-sm font-sans font-semibold group-hover:text-white">{preset.name}</span>
                  <span className="text-xs text-neutral-300 font-semibold">{preset.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Basemap Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowBasemapMenu(!showBasemapMenu);
              setShowPresetMenu(false);
              setShowSlider(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-sans font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
              showBasemapMenu
                ? 'bg-[#181d26] text-white border-[#C9A227] shadow-[0_0_12px_rgba(201,162,39,0.3)]'
                : 'bg-[#10141a] text-neutral-200 border-white/10 hover:border-white/20 hover:text-white'
            }`}
            title="Switch Map Tiles"
          >
            <Layers className="w-4 h-4 text-neutral-300" />
            <span className="hidden sm:inline">Basemap</span>
          </button>

          {showBasemapMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 vista-card rounded-xl shadow-2xl z-50 p-2 space-y-1 bg-[#0e1117] border border-white/15 font-mono">
              <div className="text-xs font-bold uppercase tracking-wider text-[#C9A227] px-2 py-1">
                Cartographic Tiles
              </div>
              <button
                onClick={() => {
                  setBasemapStyle('physical_tactile');
                  if (!is3D) setIs3D(true);
                  setShowBasemapMenu(false);
                }}
                className={`w-full px-2.5 py-2 rounded-lg text-sm font-bold text-left flex items-center justify-between cursor-pointer ${
                  basemapStyle === 'physical_tactile' ? 'bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40' : 'text-neutral-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3a929b] border border-[#f59e0b]" />
                  <span>Tactile Physical Relief</span>
                </div>
                {basemapStyle === 'physical_tactile' && <Eye className="w-4 h-4 text-[#C9A227]" />}
              </button>
              <button
                onClick={() => {
                  setBasemapStyle('dark');
                  setShowBasemapMenu(false);
                }}
                className={`w-full px-2.5 py-2 rounded-lg text-sm font-bold text-left flex items-center justify-between cursor-pointer ${
                  basemapStyle === 'dark' ? 'bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40' : 'text-neutral-200 hover:bg-white/5'
                }`}
              >
                <span>Dark Gray Canvas (ESRI)</span>
                {basemapStyle === 'dark' && <Eye className="w-4 h-4 text-[#C9A227]" />}
              </button>
              <button
                onClick={() => {
                  setBasemapStyle('satellite');
                  setShowBasemapMenu(false);
                }}
                className={`w-full px-2.5 py-2 rounded-lg text-sm font-bold text-left flex items-center justify-between cursor-pointer ${
                  basemapStyle === 'satellite' ? 'bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40' : 'text-neutral-200 hover:bg-white/5'
                }`}
              >
                <span>Satellite Imagery (ESRI)</span>
                {basemapStyle === 'satellite' && <Eye className="w-4 h-4 text-[#C9A227]" />}
              </button>
              <button
                onClick={() => {
                  setBasemapStyle('osm');
                  setShowBasemapMenu(false);
                }}
                className={`w-full px-2.5 py-2 rounded-lg text-sm font-bold text-left flex items-center justify-between cursor-pointer ${
                  basemapStyle === 'osm' ? 'bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40' : 'text-neutral-200 hover:bg-white/5'
                }`}
              >
                <span>OpenStreetMap Standard</span>
                {basemapStyle === 'osm' && <Eye className="w-4 h-4 text-[#C9A227]" />}
              </button>
              <button
                onClick={() => {
                  setBasemapStyle('geoapify');
                  setShowBasemapMenu(false);
                }}
                className={`w-full px-2.5 py-2 rounded-lg text-sm font-bold text-left flex items-center justify-between cursor-pointer ${
                  basemapStyle === 'geoapify' ? 'bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40' : 'text-neutral-200 hover:bg-white/5'
                }`}
              >
                <span>Geoapify Dark Matter</span>
                {basemapStyle === 'geoapify' && <Eye className="w-4 h-4 text-[#C9A227]" />}
              </button>
            </div>
          )}
        </div>

        {/* State Comparison Studio Launcher */}
        <button
          onClick={() => {
            setShowPresetMenu(false);
            setShowBasemapMenu(false);
            setShowSlider(false);
            onOpenComparison();
          }}
          className="px-3 py-1.5 rounded-lg text-sm font-sans font-semibold flex items-center gap-1.5 transition-all border cursor-pointer bg-[#10141a] text-neutral-200 border-white/10 hover:border-[#C9A227]/60 hover:text-white"
          title="Open State Comparison Studio"
        >
          <Scale className="w-4 h-4 text-[#C9A227]" />
          <span className="hidden lg:inline">Compare</span>
        </button>

        {/* Fine-Art Tactile 3D Elevation & Relief Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSlider(!showSlider);
              setShowBasemapMenu(false);
              setShowPresetMenu(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-sans font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
              is3D
                ? 'bg-gradient-to-r from-[#173e43] via-[#225761] to-[#7c2d12] border-[#f59e0b]/50 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:border-[#f59e0b]'
                : 'bg-[#10141a] text-neutral-200 border-white/10 hover:border-white/20'
            }`}
            title="Tactile 3D Elevation Controls & Exaggeration"
          >
            <Mountain className="w-4 h-4 text-[#f59e0b]" />
            <span className="tracking-wide hidden md:inline">{is3D ? '3D Relief' : '2D Map'}</span>
            {is3D && (
              <span className="hidden md:inline text-xs font-black px-1.5 py-0.5 rounded bg-black/40 text-[#fef08a] border border-[#f59e0b]/30">
                {terrainExaggeration.toFixed(1)}x
              </span>
            )}
            {isElevationHighlight && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#fef08a] shadow-[0_0_6px_#fef08a] animate-pulse" title="Natural Elevation Highlighting is ON" />
            )}
          </button>

          {showSlider && (
            <div className="absolute right-0 top-full mt-2 w-72 p-4 vista-card rounded-xl shadow-2xl z-50 bg-[#0e1117] border border-white/15 font-mono space-y-3">
              {/* Header with Physical Relief Theme Indicator */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-1.5">
                  <Mountain className="w-4 h-4 text-[#f59e0b]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    3D Relief & Elevation
                  </span>
                </div>
                <span className="text-xs font-bold text-[#1a1406] px-2 py-0.5 rounded bg-[#C9A227]">
                  {terrainExaggeration.toFixed(1)}x
                </span>
              </div>

              {/* Perspective Toggle (2D / 3D) */}
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-neutral-300">Terrain Perspective:</span>
                <button
                  type="button"
                  onClick={() => setIs3D(!is3D)}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                    is3D ? 'bg-[#C9A227] text-[#1a1406] shadow-md' : 'bg-[#181d26] text-neutral-300 border border-white/10'
                  }`}
                >
                  {is3D ? '3D Active' : '2D Planar'}
                </button>
              </div>

              {/* Granular fluid slider (0.5x to 3.5x with 0.1x steps) */}
              <div>
                <div className="flex justify-between text-xs text-neutral-200 font-bold mb-1">
                  <span>Relief Exaggeration:</span>
                  <span className="text-[#fef08a] font-bold">{terrainExaggeration.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.5"
                  step="0.1"
                  value={terrainExaggeration}
                  onChange={(e) => setTerrainExaggeration(parseFloat(e.target.value))}
                  className="w-full accent-[#C9A227] cursor-pointer h-2.5 bg-[#181d26] rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 font-mono font-semibold mt-1">
                  <span>0.5x (Subtle)</span>
                  <span>1.5x (Natural)</span>
                  <span>3.5x (High Alpine)</span>
                </div>
              </div>

              {/* Instant Preset Buttons */}
              <div className="pt-2 border-t border-white/10">
                <div className="text-[11px] text-neutral-300 font-bold uppercase tracking-wider mb-1.5">Quick Presets:</div>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {[0.8, 1.5, 2.5, 3.5].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTerrainExaggeration(preset)}
                      className={`py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        Math.abs(terrainExaggeration - preset) < 0.05
                          ? 'bg-[#C9A227] text-[#1a1406]'
                          : 'bg-[#161a22] text-neutral-300 hover:text-white hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {preset}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Fine-Art Style Quick Toggle */}
              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setBasemapStyle(basemapStyle === 'physical_tactile' ? 'dark' : 'physical_tactile');
                    if (!is3D) setIs3D(true);
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-left flex items-center justify-between cursor-pointer border transition-all ${
                    basemapStyle === 'physical_tactile'
                      ? 'bg-[#225761]/80 text-[#fef08a] border-[#f59e0b]/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-[#141822] text-neutral-200 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3a929b] border border-[#f59e0b]" />
                    <span>Tactile Fine Art Theme</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#f59e0b]">
                    {basemapStyle === 'physical_tactile' ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>

              {/* Natural Elevation Highlighting Toggle */}
              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    const next = !isElevationHighlight;
                    setIsElevationHighlight(next);
                    if (next && !is3D) setIs3D(true);
                    if (next && terrainExaggeration < 1.8) setTerrainExaggeration(2.0);
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-between cursor-pointer transition-all ${
                    isElevationHighlight
                      ? 'bg-gradient-to-r from-[#b4431d] to-[#ea580c] text-white border-[#fef08a] shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      : 'bg-[#141822] text-neutral-200 border-white/10 hover:border-white/20'
                  }`}
                  title="Highlight natural physical elevation across India"
                >
                  <span className="flex items-center gap-1.5">
                    <Mountain className="w-4 h-4 text-[#fef08a]" />
                    <span>Natural Elevation Highlighting</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#fef08a]">
                    {isElevationHighlight ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reset View Button */}
        <button
          onClick={onResetView}
          className="p-1.5 rounded-lg text-neutral-300 bg-[#10141a] border border-white/10 hover:border-white/20 hover:text-white transition-colors cursor-pointer"
          title="Reset Pan-India View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Verified Sources Modal Launcher */}
        <button
          onClick={onOpenSourceModal}
          className="btn-coral px-2 md:px-4 py-2 rounded-lg text-sm font-sans font-semibold flex items-center gap-2 cursor-pointer"
          title="View Official Government Data Provenance"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden md:inline tracking-wide">Verified Sources</span>
        </button>
      </div>
    </header>
  );
};
