import React, { useState } from 'react';
import { 
  TreePine, 
  Mountain, 
  Building2, 
  Waves, 
  Droplets, 
  Sun, 
  Gauge, 
  Compass, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  MapPin
} from 'lucide-react';
import type { EnvironmentalPillar, EnvironmentalComparisonConfig } from '../types';
import { ENVIRONMENTAL_PILLARS, ALL_ENVIRONMENTAL_PILLARS } from '../data/environmentalChange';

interface MonitoredHotspot {
  name: string;
  lat: number;
  lng: number;
  zoom?: number;
}

const PILLAR_HOTSPOTS: Record<EnvironmentalPillar, MonitoredHotspot[]> = {
  forest_change: [
    { name: "Western Ghats", lat: 13.8, lng: 75.6, zoom: 7.5 },
    { name: "Northeast Tribal", lat: 26.0, lng: 94.0, zoom: 7 },
    { name: "Sundarbans Mangrove", lat: 21.9, lng: 88.6, zoom: 8.5 },
    { name: "Eastern Ghats", lat: 17.2, lng: 82.0, zoom: 7.5 }
  ],
  glacier_retreat: [
    { name: "Gangotri / Gaumukh", lat: 30.92, lng: 79.08, zoom: 11 },
    { name: "Siachen Glacier", lat: 35.50, lng: 77.10, zoom: 10 },
    { name: "Chorabari (Kedarnath)", lat: 30.75, lng: 79.05, zoom: 12 },
    { name: "Zemu (Sikkim)", lat: 27.75, lng: 88.22, zoom: 10.5 },
    { name: "Kolhai (Kashmir)", lat: 34.18, lng: 75.33, zoom: 11 }
  ],
  urban_expansion: [
    { name: "Delhi NCR", lat: 28.60, lng: 77.15, zoom: 9 },
    { name: "Bengaluru BBMP", lat: 12.97, lng: 77.60, zoom: 10 },
    { name: "Mumbai MMR", lat: 19.12, lng: 72.95, zoom: 9.5 },
    { name: "Hyderabad ORR", lat: 17.40, lng: 78.45, zoom: 9.5 }
  ],
  coastal_erosion: [
    { name: "Sagar Island (WB)", lat: 21.60, lng: 88.15, zoom: 10.5 },
    { name: "Satabhaya (Odisha)", lat: 20.62, lng: 86.95, zoom: 10.5 },
    { name: "Chellanam (Kerala)", lat: 9.70, lng: 76.28, zoom: 10.5 },
    { name: "Puducherry Coast", lat: 11.93, lng: 79.83, zoom: 11 }
  ],
  wetland_change: [
    { name: "Chilika Lagoon", lat: 19.68, lng: 85.35, zoom: 9.5 },
    { name: "Vembanad-Kol", lat: 9.65, lng: 76.38, zoom: 9.5 },
    { name: "Wular Lake", lat: 34.35, lng: 74.58, zoom: 10.5 },
    { name: "Loktak & Phumdis", lat: 24.52, lng: 93.82, zoom: 10.5 },
    { name: "Sambhar Salt Lake", lat: 26.92, lng: 75.05, zoom: 10 }
  ],
  desertification: [
    { name: "Thar Fringe (Rajasthan)", lat: 27.00, lng: 72.20, zoom: 7.5 },
    { name: "Aravalli Gaps (NCR)", lat: 27.95, lng: 76.65, zoom: 9 },
    { name: "Rayalaseema Scrub", lat: 14.68, lng: 77.60, zoom: 8 },
    { name: "Chambal Ravines", lat: 26.30, lng: 78.20, zoom: 9 }
  ],
  groundwater_stress: [
    { name: "Punjab Granary", lat: 30.25, lng: 75.85, zoom: 8 },
    { name: "Marwar Fossil Aquifers", lat: 26.25, lng: 72.75, zoom: 8 },
    { name: "Delhi NCR Cones", lat: 28.60, lng: 77.20, zoom: 10 },
    { name: "Tamil Nadu Hard-Rock", lat: 11.00, lng: 77.50, zoom: 8.5 }
  ],
  river_avulsion: [
    { name: "Kosi Avulsion Corridor", lat: 26.10, lng: 86.90, zoom: 8.5 },
    { name: "Majuli Island (Assam)", lat: 26.95, lng: 94.20, zoom: 9.5 },
    { name: "Malda Ganga Migration", lat: 24.90, lng: 88.00, zoom: 9.5 },
    { name: "Saraswati Paleochannel", lat: 28.80, lng: 74.20, zoom: 7 }
  ]
};

interface EnvironmentalComparisonDeckProps {
  isOpen: boolean;
  onClose: () => void;
  activePillar: EnvironmentalPillar;
  onSelectPillar: (pillar: EnvironmentalPillar) => void;
  comparisonConfig: EnvironmentalComparisonConfig;
  onUpdateConfig: (newConfig: Partial<EnvironmentalComparisonConfig>) => void;
  onFlyToCoordinates?: (lat: number, lng: number, zoom?: number) => void;
  onSelectHotspot?: (hotspot: { name: string; lat: number; lng: number; zoom?: number }) => void;
}

export const EnvironmentalComparisonDeck: React.FC<EnvironmentalComparisonDeckProps> = ({
  isOpen,
  onClose,
  activePillar,
  onSelectPillar,
  comparisonConfig,
  onUpdateConfig,
  onFlyToCoordinates,
  onSelectHotspot
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentMeta = ENVIRONMENTAL_PILLARS[activePillar];
  const hotspots = PILLAR_HOTSPOTS[activePillar] || [];

  const getPillarIcon = (pillarId: EnvironmentalPillar) => {
    switch (pillarId) {
      case 'forest_change':
        return <TreePine className="w-4 h-4 text-emerald-400" />;
      case 'glacier_retreat':
        return <Mountain className="w-4 h-4 text-cyan-400" />;
      case 'urban_expansion':
        return <Building2 className="w-4 h-4 text-orange-400" />;
      case 'coastal_erosion':
        return <Waves className="w-4 h-4 text-rose-400" />;
      case 'wetland_change':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'desertification':
        return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'groundwater_stress':
        return <Gauge className="w-4 h-4 text-purple-400" />;
      case 'river_avulsion':
        return <Compass className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl transition-all duration-300 font-sans pointer-events-auto">
      <div className="bg-[#0b1318]/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden shadow-emerald-950/50">
        
        {/* Header Bar */}
        <div className="px-4 py-2.5 bg-[#071015] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm tracking-wide text-white uppercase">
                  Environmental Change &amp; Climate Explorer
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                  Year Comparison Tool
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 flex items-center gap-2 font-mono mt-0.5">
                <span>{currentMeta.title}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{currentMeta.authority}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title={isCollapsed ? "Expand Deck" : "Collapse Deck"}
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Close Tool"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {!isCollapsed && (
          <div className="p-4 space-y-4">
            
            {/* 8-Pillar Selector Tabs */}
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-400" />
                <span>Select Environmental Theme (8 Pillars):</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5">
                {ALL_ENVIRONMENTAL_PILLARS.map(pId => {
                  const meta = ENVIRONMENTAL_PILLARS[pId];
                  const isSelected = activePillar === pId;
                  return (
                    <button
                      key={pId}
                      onClick={() => {
                        onSelectPillar(pId);
                        onUpdateConfig({
                          pillar: pId,
                          yearA: meta.availableYears[0],
                          yearB: meta.availableYears[meta.availableYears.length - 1]
                        });
                      }}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-lg shadow-emerald-950/50 scale-[1.02]' 
                          : 'bg-[#121c22]/60 border-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        {getPillarIcon(pId)}
                      </div>
                      <span className="text-[10px] text-center leading-tight tracking-tight">
                        {meta.shortTitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Year Comparison Controller Deck */}
            <div className="bg-[#0e171d] border border-white/10 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4">
              
              {/* Year A (Baseline) Selector */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>Baseline Year (A):</span>
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    {currentMeta.availableYears.slice(0, -1).map(yr => (
                      <button
                        key={`yearA-${yr}`}
                        onClick={() => onUpdateConfig({ yearA: yr })}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer border ${
                          comparisonConfig.yearA === yr
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                            : 'bg-black/30 text-neutral-400 border-white/5 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-neutral-500 font-mono text-xs hidden sm:block">
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </div>

                {/* Year B (Comparison) Selector */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    <span>Comparison Year (B):</span>
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    {currentMeta.availableYears.slice(1).map(yr => (
                      <button
                        key={`yearB-${yr}`}
                        onClick={() => onUpdateConfig({ yearB: yr })}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer border ${
                          comparisonConfig.yearB === yr
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                            : 'bg-black/30 text-neutral-400 border-white/5 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mode Toggle: Delta vs Temporal Baseline */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateConfig({ isDeltaMode: !comparisonConfig.isDeltaMode })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                    comparisonConfig.isDeltaMode
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-md'
                      : 'bg-neutral-800 text-neutral-400 border-white/10 hover:text-white'
                  }`}
                >
                  <Activity className={`w-3.5 h-3.5 ${comparisonConfig.isDeltaMode ? 'text-emerald-400 animate-pulse' : 'text-neutral-400'}`} />
                  <span>{comparisonConfig.isDeltaMode ? 'Show Change Rate (Δ Active)' : 'Switch to Delta Rate'}</span>
                </button>
              </div>
            </div>

            {/* Quick Fly-To Monitored Hotspot Pills */}
            {hotspots.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>Monitored Sites:</span>
                </span>
                {hotspots.map(h => (
                  <button
                    key={h.name}
                    onClick={() => {
                      if (onSelectHotspot) {
                        onSelectHotspot(h);
                      } else {
                        onFlyToCoordinates?.(h.lat, h.lng, h.zoom);
                      }
                    }}
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#142026] text-neutral-300 hover:text-emerald-300 hover:bg-emerald-950/60 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{h.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Key Finding & Metric Insight Banner */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-[#0e1a1e] to-sky-950/30 border border-emerald-500/30 rounded-xl p-3">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Official Sovereign Assessment Finding ({comparisonConfig.yearA} vs {comparisonConfig.yearB}):
                  </div>
                  <div className="text-xs text-neutral-200 leading-relaxed font-sans">
                    {currentMeta.keyFinding}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono pt-0.5">
                    Source Authority: <span className="text-white font-bold">{currentMeta.authority}</span> • Units: <span className="text-emerald-300">{currentMeta.metricUnit}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
