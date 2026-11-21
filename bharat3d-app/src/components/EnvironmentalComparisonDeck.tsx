import React, { useState, useRef, useEffect } from 'react';
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
  Calendar as CalendarIcon, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  MapPin,
  Minimize2,
  Maximize2,
  CheckCircle2,
  Clock,
  Satellite,
  Info
} from 'lucide-react';
import type { EnvironmentalPillar, EnvironmentalComparisonConfig } from '../types';
import { 
  ENVIRONMENTAL_PILLARS, 
  ALL_ENVIRONMENTAL_PILLARS,
  PILLAR_OBSERVATION_DATES,
  getPillarTemporalFinding,
  type ObservationDateMeta
} from '../data/environmentalChange';

interface MonitoredHotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom?: number;
}

const PILLAR_HOTSPOTS: Record<EnvironmentalPillar, MonitoredHotspot[]> = {
  forest_change: [
    { id: "forest-western-ghats", name: "Western Ghats", lat: 13.8, lng: 75.6, zoom: 7.5 },
    { id: "forest-northeast-tribal", name: "Northeast Tribal", lat: 26.0, lng: 94.0, zoom: 7 },
    { id: "forest-sundarbans-mangroves", name: "Sundarbans Mangrove", lat: 21.9, lng: 88.6, zoom: 8.5 },
    { id: "forest-eastern-ghats", name: "Eastern Ghats", lat: 17.2, lng: 82.0, zoom: 7.5 },
    { id: "forest-central-highlands", name: "Central Sal & Teak", lat: 22.5, lng: 80.5, zoom: 7.5 }
  ],
  glacier_retreat: [
    { id: "glacier-gangotri", name: "Gangotri / Gaumukh", lat: 30.92, lng: 79.08, zoom: 11 },
    { id: "glacier-siachen", name: "Siachen Glacier", lat: 35.50, lng: 77.10, zoom: 10 },
    { id: "glacier-chorabari", name: "Chorabari (Kedarnath)", lat: 30.75, lng: 79.05, zoom: 12 },
    { id: "glacier-zemu", name: "Zemu (Sikkim)", lat: 27.75, lng: 88.22, zoom: 10.5 },
    { id: "glacier-kolhai", name: "Kolhai (Kashmir)", lat: 34.18, lng: 75.33, zoom: 11 },
    { id: "glacier-bara-shigri", name: "Bara Shigri (Spiti)", lat: 32.25, lng: 77.60, zoom: 11 }
  ],
  urban_expansion: [
    { id: "urban-delhi-ncr", name: "Delhi NCR", lat: 28.60, lng: 77.15, zoom: 9 },
    { id: "urban-bengaluru", name: "Bengaluru BBMP", lat: 12.97, lng: 77.60, zoom: 10 },
    { id: "urban-mumbai-mmr", name: "Mumbai MMR", lat: 19.12, lng: 72.95, zoom: 9.5 },
    { id: "urban-hyderabad", name: "Hyderabad ORR", lat: 17.40, lng: 78.45, zoom: 9.5 },
    { id: "urban-chennai", name: "Chennai OMR", lat: 12.95, lng: 80.15, zoom: 9.5 }
  ],
  coastal_erosion: [
    { id: "coastal-sundarbans-sagar", name: "Sagar Island (WB)", lat: 21.60, lng: 88.15, zoom: 10.5 },
    { id: "coastal-odisha-kendrapara", name: "Satabhaya (Odisha)", lat: 20.62, lng: 86.95, zoom: 10.5 },
    { id: "coastal-kerala-chellanam", name: "Chellanam (Kerala)", lat: 9.70, lng: 76.28, zoom: 10.5 },
    { id: "coastal-puducherry-ennore", name: "Puducherry Coast", lat: 11.93, lng: 79.83, zoom: 11 },
    { id: "coastal-gujarat-khambhat", name: "Gulf of Khambhat", lat: 21.80, lng: 72.35, zoom: 10 }
  ],
  wetland_change: [
    { id: "wetland-chilika", name: "Chilika Lagoon", lat: 19.68, lng: 85.35, zoom: 9.5 },
    { id: "wetland-vembanad", name: "Vembanad-Kol", lat: 9.65, lng: 76.38, zoom: 9.5 },
    { id: "wetland-wular", name: "Wular Lake", lat: 34.35, lng: 74.58, zoom: 10.5 },
    { id: "wetland-loktak", name: "Loktak & Phumdis", lat: 24.52, lng: 93.82, zoom: 10.5 },
    { id: "wetland-kolleru", name: "Kolleru Lake", lat: 16.65, lng: 81.30, zoom: 10 },
    { id: "wetland-sambhar", name: "Sambhar Salt Lake", lat: 26.92, lng: 75.05, zoom: 10 }
  ],
  desertification: [
    { id: "desert-thar-eastern", name: "Thar Fringe (Rajasthan)", lat: 27.00, lng: 72.20, zoom: 7.5 },
    { id: "desert-aravalli-breach", name: "Aravalli Gaps (NCR)", lat: 27.95, lng: 76.65, zoom: 9 },
    { id: "desert-rayalaseema-scrub", name: "Rayalaseema Scrub", lat: 14.68, lng: 77.60, zoom: 8 },
    { id: "desert-chambal-badlands", name: "Chambal Ravines", lat: 26.30, lng: 78.20, zoom: 9 },
    { id: "desert-rann-saurashtra", name: "Rann & Banni", lat: 23.60, lng: 69.50, zoom: 8.5 }
  ],
  groundwater_stress: [
    { id: "gw-punjab-haryana", name: "Punjab Granary", lat: 30.25, lng: 75.85, zoom: 8 },
    { id: "gw-western-rajasthan", name: "Marwar Fossil Aquifers", lat: 26.25, lng: 72.75, zoom: 8 },
    { id: "gw-delhi-ncr", name: "Delhi NCR Cones", lat: 28.60, lng: 77.20, zoom: 10 },
    { id: "gw-tamilnadu-cauvery", name: "Tamil Nadu Hard-Rock", lat: 11.00, lng: 77.50, zoom: 8.5 },
    { id: "gw-gangetic-eastern", name: "Eastern Gangetic Plain", lat: 25.50, lng: 85.50, zoom: 8 }
  ],
  river_avulsion: [
    { id: "river-kosi-migration", name: "Kosi Avulsion Corridor", lat: 26.10, lng: 86.90, zoom: 8.5 },
    { id: "river-brahmaputra-majuli", name: "Majuli Island (Assam)", lat: 26.95, lng: 94.20, zoom: 9.5 },
    { id: "river-ganga-malda", name: "Malda Ganga Migration", lat: 24.90, lng: 88.00, zoom: 9.5 },
    { id: "river-saraswati-paleochannel", name: "Saraswati Paleochannel", lat: 28.80, lng: 74.20, zoom: 7 },
    { id: "river-teesta-avulsion", name: "Teesta Historic Avulsion", lat: 26.50, lng: 88.80, zoom: 9 }
  ]
};

interface CalendarPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pillar: EnvironmentalPillar;
  selectedYear: string;
  availableYears: string[];
  onSelectYear: (year: string) => void;
  accentColor: 'amber' | 'emerald';
}

// Snappy, interactive calendar date selector popover
const CalendarPickerPopover: React.FC<CalendarPickerPopoverProps> = ({
  isOpen,
  onClose,
  title,
  pillar,
  selectedYear,
  availableYears,
  onSelectYear,
  accentColor
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const datesRecord = PILLAR_OBSERVATION_DATES[pillar] || {};
  const activeDateMeta: ObservationDateMeta | undefined = datesRecord[selectedYear];

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAmber = accentColor === 'amber';
  const borderCol = isAmber ? 'border-amber-500/50' : 'border-emerald-500/50';
  const glowCol = isAmber ? 'shadow-amber-950/60' : 'shadow-emerald-950/60';
  const textCol = isAmber ? 'text-amber-300' : 'text-emerald-300';
  const badgeBg = isAmber ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  // Days array for the calendar month grid simulation
  const daysInMonth = 31;
  const targetDay = activeDateMeta?.day || 15;

  return (
    <div 
      ref={popoverRef}
      className={`absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-50 w-[310px] sm:w-[340px] bg-[#0a1217]/98 backdrop-blur-2xl border ${borderCol} rounded-2xl shadow-2xl ${glowCol} p-3.5 font-sans animate-calendar-pop pointer-events-auto`}
    >
      {/* Popover Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${badgeBg} border`}>
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
              {title}
            </div>
            <div className="text-[10px] text-neutral-400 font-mono">
              Sovereign Remote Sensing Cycle
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Selected Date Spotlight Display */}
      {activeDateMeta && (
        <div className="bg-[#121c22]/90 border border-white/10 rounded-xl p-2.5 mb-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Selected Observation Date
            </div>
            <div className={`text-sm font-serif font-bold ${textCol} tracking-wide mt-0.5`}>
              {activeDateMeta.day} {activeDateMeta.month} {activeDateMeta.year}
            </div>
            <div className="text-[10px] text-neutral-300 font-mono flex items-center gap-1.5 mt-0.5">
              <Satellite className="w-3 h-3 text-sky-400" />
              <span>{activeDateMeta.sensor}</span>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${badgeBg} font-bold`}>
              {activeDateMeta.season}
            </span>
          </div>
        </div>
      )}

      {/* Available Sovereign Assessment Passes (Verified Data Only) */}
      <div className="space-y-1.5 mb-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>Verified Official Capture Dates:</span>
          </span>
          <span className="text-[9px] text-amber-400 font-mono">
            {availableYears.length} passes available
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {availableYears.map(yr => {
            const isSelected = selectedYear === yr;
            const meta = datesRecord[yr];
            return (
              <button
                key={yr}
                onClick={() => {
                  onSelectYear(yr);
                  onClose();
                }}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `${badgeBg} shadow-md scale-[1.02] border-emerald-400/80`
                    : 'bg-[#121b21]/80 border-white/10 text-neutral-300 hover:bg-white/15 hover:text-white'
                }`}
                title={`Select ${meta ? `${meta.day} ${meta.month} ${meta.year}` : yr} benchmark`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-white">{yr}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-black/40 text-emerald-300' : 'bg-white/5 text-neutral-300'
                    }`}>
                      {meta ? `${meta.day} ${meta.month.slice(0, 3)}` : 'Pass'}
                    </span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </div>
                <div className="text-[10px] text-neutral-400 font-sans truncate mt-1">
                  {meta ? meta.sensor : `${yr} Sovereign Datum`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mini Calendar Monthly Days Grid Visualizer - Only Official Pass Day Active */}
      <div className="bg-[#080d11] border border-white/5 rounded-xl p-2 mb-2">
        <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span className="text-white font-bold">{activeDateMeta?.month || 'Survey'} {activeDateMeta?.year || selectedYear}</span>
          <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
            Official Pass Day: {targetDay} {activeDateMeta?.month?.slice(0, 3)}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-mono">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i} className="text-neutral-500 font-bold">{d}</span>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isTarget = dayNum === targetDay;
            return (
              <button
                key={dayNum}
                disabled={!isTarget}
                onClick={() => {
                  if (isTarget) {
                    onClose();
                  }
                }}
                className={`h-5 w-full flex items-center justify-center rounded text-[9px] transition-all ${
                  isTarget
                    ? `${isAmber ? 'bg-amber-500 text-black font-extrabold shadow-sm ring-2 ring-amber-300 animate-pulse' : 'bg-emerald-500 text-black font-extrabold shadow-sm ring-2 ring-emerald-300 animate-pulse'} cursor-pointer`
                    : 'text-neutral-600 bg-white/[0.02] opacity-25 cursor-not-allowed select-none'
                }`}
                title={isTarget ? `Official Data Capture Pass on Day ${dayNum} (${activeDateMeta?.sensor})` : `No sovereign sensor data captured on day ${dayNum}. Official pass is on Day ${targetDay}.`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
        <div className="text-[8.5px] font-mono text-neutral-400 text-center pt-1.5 border-t border-white/5 mt-1.5">
          ✦ Non-survey days disabled: Official remote sensing data captured only on verified pass dates.
        </div>
      </div>

      {/* Live Map Sync Confirmation */}
      <div className="text-[10px] text-emerald-400/90 font-mono text-center flex items-center justify-center gap-1.5 pt-1">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>Synchronizes 3D map &amp; comparison metrics in real time</span>
      </div>
    </div>
  );
};

interface EnvironmentalComparisonDeckProps {
  isOpen: boolean;
  onClose: () => void;
  activePillar: EnvironmentalPillar;
  onSelectPillar: (pillar: EnvironmentalPillar) => void;
  comparisonConfig: EnvironmentalComparisonConfig;
  onUpdateConfig: (newConfig: Partial<EnvironmentalComparisonConfig>) => void;
  onFlyToCoordinates?: (lat: number, lng: number, zoom?: number) => void;
  onSelectHotspot?: (hotspot: MonitoredHotspot) => void;
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
  // State for ultra-compact minimized pill bar vs floating deck
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  // State for toggling full sovereign assessment findings disclosure
  const [showFindings, setShowFindings] = useState<boolean>(false);
  // Calendar popover states
  const [isCalendarAOpen, setIsCalendarAOpen] = useState<boolean>(false);
  const [isCalendarBOpen, setIsCalendarBOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentMeta = ENVIRONMENTAL_PILLARS[activePillar];
  const hotspots = PILLAR_HOTSPOTS[activePillar] || [];
  const observationDates = PILLAR_OBSERVATION_DATES[activePillar] || {};

  const dateMetaA = observationDates[comparisonConfig.yearA];
  const dateMetaB = observationDates[comparisonConfig.yearB];

  const handleSelectYearA = (yr: string) => {
    const years = currentMeta.availableYears;
    const currB = comparisonConfig.yearB;
    if (parseInt(yr) >= parseInt(currB)) {
      const nextYears = years.filter(y => parseInt(y) > parseInt(yr));
      const newB = nextYears.length > 0 ? nextYears[0] : years[years.length - 1];
      onUpdateConfig({ yearA: yr, yearB: newB });
    } else {
      onUpdateConfig({ yearA: yr });
    }
  };

  const handleSelectYearB = (yr: string) => {
    const years = currentMeta.availableYears;
    const currA = comparisonConfig.yearA;
    if (parseInt(yr) <= parseInt(currA)) {
      const priorYears = years.filter(y => parseInt(y) < parseInt(yr));
      const newA = priorYears.length > 0 ? priorYears[priorYears.length - 1] : years[0];
      onUpdateConfig({ yearA: newA, yearB: yr });
    } else {
      onUpdateConfig({ yearB: yr });
    }
  };

  const getPillarIcon = (pillarId: EnvironmentalPillar, sizeClass = "w-3.5 h-3.5") => {
    switch (pillarId) {
      case 'forest_change':
        return <TreePine className={`${sizeClass} text-emerald-400`} />;
      case 'glacier_retreat':
        return <Mountain className={`${sizeClass} text-cyan-400`} />;
      case 'urban_expansion':
        return <Building2 className={`${sizeClass} text-orange-400`} />;
      case 'coastal_erosion':
        return <Waves className={`${sizeClass} text-rose-400`} />;
      case 'wetland_change':
        return <Droplets className={`${sizeClass} text-blue-400`} />;
      case 'desertification':
        return <Sun className={`${sizeClass} text-yellow-400`} />;
      case 'groundwater_stress':
        return <Gauge className={`${sizeClass} text-purple-400`} />;
      case 'river_avulsion':
        return <Compass className={`${sizeClass} text-teal-400`} />;
    }
  };

  // --- MINIMIZED FLOATING PILL VIEW (Zero Map Occlusion Mode) ---
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95%] font-sans pointer-events-auto animate-snappy-pop">
        <div className="bg-[#0b1318]/92 backdrop-blur-xl border border-emerald-500/50 rounded-full px-3.5 py-1.5 shadow-2xl shadow-emerald-950/60 flex items-center gap-3 text-xs text-white">
          <div className="flex items-center gap-1.5">
            {getPillarIcon(activePillar, "w-4 h-4")}
            <span className="font-serif font-bold text-sm tracking-wide text-emerald-300">
              {currentMeta.shortTitle}
            </span>
          </div>

          <div className="h-3.5 w-px bg-white/20" />

          {/* Date Range Pill */}
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-300">
            <span className="text-amber-300 font-bold">{dateMetaA ? dateMetaA.label : comparisonConfig.yearA}</span>
            <ArrowRight className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-300 font-bold">{dateMetaB ? dateMetaB.label : comparisonConfig.yearB}</span>
          </div>

          {/* Delta status */}
          <div className="hidden sm:flex items-center gap-1">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              comparisonConfig.isDeltaMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                : 'bg-white/5 text-neutral-400 border-white/10'
            }`}>
              {comparisonConfig.isDeltaMode ? 'Δ Active' : 'Baseline'}
            </span>
          </div>

          <div className="h-3.5 w-px bg-white/20" />

          {/* Expand and Close Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-mono"
              title="Expand Deck"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Expand</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Tool"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- COMPACT FLOATING DECK VIEW (Ergonomic, low-height profile) ---
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl sm:max-w-2xl md:max-w-3xl transition-all duration-300 font-sans pointer-events-auto animate-snappy-pop">
      <div className="bg-[#091014]/94 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl shadow-2xl overflow-visible shadow-emerald-950/60">
        
        {/* Sleek, Low-Profile Header Bar */}
        <div className="px-3 py-1.5 bg-[#060c10] border-b border-white/10 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Activity className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xs sm:text-sm tracking-wide text-white uppercase">
                Environmental &amp; Climate Explorer
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider hidden sm:inline-block">
                Time Machine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Toggle Sovereign Findings Button */}
            <button
              onClick={() => setShowFindings(!showFindings)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer flex items-center gap-1 border ${
                showFindings
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'text-neutral-400 hover:text-white border-transparent hover:bg-white/5'
              }`}
              title="Toggle Official Findings"
            >
              <Info className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Findings</span>
              {showFindings ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>

            {/* Minimize to Pill (Zero Map Occlusion) */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
              title="Minimize to Floating Bar"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>

            {/* Close Tool */}
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-rose-400 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
              title="Close Tool"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Compact Main Control Body */}
        <div className="p-2.5 sm:p-3 space-y-2.5">
          
          {/* Horizontal Low-Profile Pillar Switcher Bar */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
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
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-sans font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected 
                      ? 'bg-emerald-950/90 border-emerald-400 text-white shadow-md shadow-emerald-950/40 scale-[1.02]' 
                      : 'bg-[#10171d]/60 border-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {getPillarIcon(pId)}
                  <span>{meta.shortTitle}</span>
                </button>
              );
            })}
          </div>

          {/* Temporal Calendar Date Comparison & Mode Controls */}
          <div className="bg-[#0b1419] border border-white/10 rounded-xl p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2.5 relative">
            
            {/* Calendar Date Pickers Group */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Baseline Calendar Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsCalendarAOpen(!isCalendarAOpen);
                    setIsCalendarBOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#142027] hover:bg-[#192832] border border-amber-500/40 hover:border-amber-400 text-neutral-200 transition-all cursor-pointer flex items-center gap-2 shadow-sm text-xs font-mono"
                  title="Open Calendar to select Baseline Assessment Date"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-neutral-400 uppercase font-sans">Baseline:</span>
                    <span className="font-bold text-amber-300">
                      {dateMetaA ? dateMetaA.label : comparisonConfig.yearA}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Snappy Baseline Calendar Popover */}
                <CalendarPickerPopover
                  isOpen={isCalendarAOpen}
                  onClose={() => setIsCalendarAOpen(false)}
                  title="Baseline Assessment Date (A)"
                  pillar={activePillar}
                  selectedYear={comparisonConfig.yearA}
                  availableYears={currentMeta.availableYears.slice(0, -1)}
                  onSelectYear={handleSelectYearA}
                  accentColor="amber"
                />
              </div>

              {/* Arrow divider */}
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />

              {/* Comparison Calendar Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsCalendarBOpen(!isCalendarBOpen);
                    setIsCalendarAOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#142027] hover:bg-[#192832] border border-emerald-500/40 hover:border-emerald-400 text-neutral-200 transition-all cursor-pointer flex items-center gap-2 shadow-sm text-xs font-mono"
                  title="Open Calendar to select Comparison Assessment Date"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-neutral-400 uppercase font-sans">Compare:</span>
                    <span className="font-bold text-emerald-300">
                      {dateMetaB ? dateMetaB.label : comparisonConfig.yearB}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Snappy Comparison Calendar Popover */}
                <CalendarPickerPopover
                  isOpen={isCalendarBOpen}
                  onClose={() => setIsCalendarBOpen(false)}
                  title="Comparison Assessment Date (B)"
                  pillar={activePillar}
                  selectedYear={comparisonConfig.yearB}
                  availableYears={currentMeta.availableYears.slice(1)}
                  onSelectYear={handleSelectYearB}
                  accentColor="emerald"
                />
              </div>
            </div>

            {/* Clear Mode Switcher: Category Theme vs Severity Rate */}
            <div className="flex items-center rounded-lg bg-[#0c1418] p-0.5 border border-white/10 shrink-0">
              <button
                onClick={() => onUpdateConfig({ isDeltaMode: false })}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  !comparisonConfig.isDeltaMode
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Pillar Category Mode: Features shaded by environmental theme (Green: Forest, Cyan: Glacier, Orange: Urban, Blue: Wetland)"
              >
                <span>🎨 Category Theme</span>
              </button>
              <button
                onClick={() => onUpdateConfig({ isDeltaMode: true })}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  comparisonConfig.isDeltaMode
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Annual Change Rate Mode: Features shaded by rate of loss or growth (🔴 Severe Loss/Sprawl, 🟠 High Stress, 🟢 Recovery)"
              >
                <Activity className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>⚠️ Severity (Rate)</span>
              </button>
            </div>
          </div>

          {/* Explanatory Mode & Rate Helper Strip */}
          <div className="flex items-center justify-between text-[10px] font-mono px-1 py-0.5 border-t border-b border-white/5">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="text-neutral-400 font-bold uppercase tracking-wider">Map Shading:</span>
              {comparisonConfig.isDeltaMode ? (
                <span className="flex items-center gap-2">
                  <span className="text-red-400 flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />Severe Loss/Sprawl</span>
                  <span className="text-amber-400 flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />High Stress</span>
                  <span className="text-yellow-300 flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />Moderate</span>
                  <span className="text-emerald-400 flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Recovery/Stable</span>
                </span>
              ) : (
                <span className="text-emerald-300">
                  {currentMeta.title} Category Colors (Standard Cartographic Theme)
                </span>
              )}
            </div>
            <span className="text-neutral-400 font-bold hidden md:inline">
              Metric: <span className="text-white">{currentMeta.metricLabel}</span>
            </span>
          </div>

          {/* Quick Fly-To Monitored Hotspot Pills (Single-line compact chips) */}
          {hotspots.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1 shrink-0">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Sites:</span>
              </span>
              {hotspots.map(h => (
                <button
                  key={h.id || h.name}
                  onClick={() => {
                    if (onSelectHotspot) {
                      onSelectHotspot(h);
                    } else {
                      onFlyToCoordinates?.(h.lat, h.lng, h.zoom);
                    }
                  }}
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#111b21] text-neutral-300 hover:text-emerald-300 hover:bg-emerald-950/70 border border-white/5 hover:border-emerald-500/30 whitespace-nowrap transition-all cursor-pointer"
                >
                  <span>{h.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Collapsible Sovereign Findings Disclosure */}
          {showFindings && (
            <div className="bg-gradient-to-r from-emerald-950/50 via-[#0d171c] to-sky-950/40 border border-emerald-500/30 rounded-xl p-2.5 animate-snappy-pop">
              <div className="flex items-start gap-2">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1 text-left flex-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center justify-between">
                    <span>Official Sovereign Finding ({comparisonConfig.yearA} vs {comparisonConfig.yearB}):</span>
                    <a
                      href={`https://en.wikipedia.org/wiki/${encodeURIComponent(currentMeta.title.replace(/\s+/g, '_'))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[10px] font-mono font-bold transition-all"
                      title="Open Wikipedia article"
                    >
                      <span className="w-3 h-3 rounded bg-white text-black font-serif font-black text-[9px] flex items-center justify-center leading-none">
                        W
                      </span>
                      <span>Wikipedia</span>
                    </a>
                  </div>
                  <div className="text-xs text-neutral-200 leading-relaxed font-sans">
                    {getPillarTemporalFinding(activePillar, comparisonConfig.yearA, comparisonConfig.yearB)}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono pt-0.5">
                    Authority: <span className="text-white font-bold">{currentMeta.authority}</span> • Units: <span className="text-emerald-300">{currentMeta.metricUnit}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
