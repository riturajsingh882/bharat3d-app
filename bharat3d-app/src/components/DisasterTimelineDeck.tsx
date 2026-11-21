import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  X, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Flame, 
  Waves, 
  Mountain, 
  Sun, 
  Radio, 
  Wind,
  Activity
} from 'lucide-react';
import type { DisasterHazardType, DisasterRegion, HistoricalDisasterEvent } from '../types';
import { HISTORICAL_DISASTER_EVENTS } from '../data/disasterIntelligence';

interface DisasterTimelineDeckProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEventId: string | null;
  onSelectEvent: (event: HistoricalDisasterEvent) => void;
  activeHazardTypes?: Set<DisasterHazardType>;
  selectedRegion?: DisasterRegion;
}

const HAZARD_TYPE_META: Record<DisasterHazardType, { label: string; color: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  earthquake: { label: 'Earthquake', color: '#ef4444', icon: Activity },
  seismic_zone: { label: 'Seismic Zone', color: '#f97316', icon: Radio },
  cyclone: { label: 'Cyclone', color: '#c026d3', icon: Wind },
  flood: { label: 'Flood Basin', color: '#0284c7', icon: Waves },
  landslide: { label: 'Landslide', color: '#ea580c', icon: Mountain },
  drought: { label: 'Drought Belt', color: '#b45309', icon: Sun },
  tsunami: { label: 'Tsunami Buffer', color: '#06b6d4', icon: Waves },
  heatwave: { label: 'Severe Heatwave', color: '#e11d48', icon: Flame }
};

export const DisasterTimelineDeck: React.FC<DisasterTimelineDeckProps> = ({
  isOpen,
  onClose,
  selectedEventId,
  onSelectEvent,
  activeHazardTypes: _activeHazardTypes,
  selectedRegion = 'all'
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [hazardFilter, setHazardFilter] = useState<string>('all');

  // Filter events based on active filters
  const filteredEvents = HISTORICAL_DISASTER_EVENTS.filter(event => {
    if (hazardFilter !== 'all' && event.hazardType !== hazardFilter) return false;
    if (selectedRegion !== 'all' && event.region !== selectedRegion) return false;
    return true;
  });

  const currentIndex = filteredEvents.findIndex(e => e.id === selectedEventId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentEvent = filteredEvents[safeIndex] || HISTORICAL_DISASTER_EVENTS[0];

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying || filteredEvents.length <= 1) return;

    const timer = setInterval(() => {
      const idx = filteredEvents.findIndex(e => e.id === (selectedEventId || currentEvent.id));
      const nextIdx = (idx + 1) % filteredEvents.length;
      onSelectEvent(filteredEvents[nextIdx]);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, filteredEvents, selectedEventId, currentEvent, onSelectEvent]);

  if (!isOpen) return null;

  const handlePrev = () => {
    if (filteredEvents.length === 0) return;
    const prevIdx = safeIndex > 0 ? safeIndex - 1 : filteredEvents.length - 1;
    onSelectEvent(filteredEvents[prevIdx]);
  };

  const handleNext = () => {
    if (filteredEvents.length === 0) return;
    const nextIdx = (safeIndex + 1) % filteredEvents.length;
    onSelectEvent(filteredEvents[nextIdx]);
  };

  // Minimized Floating Pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95%] font-sans pointer-events-auto animate-snappy-pop select-none">
        <div className="bg-[#12070a]/95 backdrop-blur-xl border border-rose-500/60 rounded-full px-3.5 py-1.5 shadow-2xl shadow-rose-950/70 flex items-center gap-3 text-xs text-white">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-mono font-bold text-xs tracking-wide text-rose-300">
              {currentEvent?.year} {currentEvent?.name}
            </span>
            <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
              ({currentEvent?.magnitudeOrIntensity})
            </span>
          </div>

          <div className="flex items-center gap-1 border-l border-white/10 pl-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Expand Disaster Timeline Deck"
            >
              <Maximize2 className="w-3.5 h-3.5 text-rose-400" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-rose-400 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Close Timeline"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentMeta = HAZARD_TYPE_META[currentEvent?.hazardType] || { label: 'Disaster', color: '#ef4444', icon: AlertTriangle };
  const CurrentIcon = currentMeta.icon;

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] sm:w-[88%] max-w-2xl lg:max-w-[720px] transition-all duration-300 font-sans pointer-events-auto animate-snappy-pop select-none">
      <div className="bg-[#12070a]/95 backdrop-blur-2xl border border-rose-500/50 rounded-2xl shadow-2xl overflow-visible shadow-rose-950/70 text-white">
        
        {/* TOP BAR: Title, Filter Pills, Actions */}
        <div className="px-3.5 py-2 border-b border-white/10 flex items-center justify-between gap-2 bg-gradient-to-r from-rose-950/60 via-black/40 to-black/60 rounded-t-2xl">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-md bg-rose-500/20 border border-rose-500/40 shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="font-serif font-bold text-xs sm:text-sm tracking-wide text-rose-300">
                Disaster &amp; Hazard Timeline
              </span>
              <span className="text-[10px] font-mono text-neutral-400 hidden md:inline">
                (1897 – 2024 • {filteredEvents.length} Events)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick sub-filter selector */}
            <select
              value={hazardFilter}
              onChange={(e) => setHazardFilter(e.target.value)}
              className="bg-black/60 border border-rose-500/40 text-[11px] font-mono text-rose-200 rounded px-2 py-0.5 outline-none cursor-pointer focus:border-rose-400"
            >
              <option value="all">All Hazard Types</option>
              <option value="earthquake">🔴 Earthquakes</option>
              <option value="cyclone">🌀 Cyclones</option>
              <option value="flood">🌊 Floods</option>
              <option value="landslide">⛰️ Landslides</option>
              <option value="tsunami">🚨 Tsunamis</option>
              <option value="heatwave">🌡️ Heatwaves</option>
            </select>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
              title="Minimize Timeline Deck"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-rose-400 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
              title="Close Timeline"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* MIDDLE BAR: Current Event Spotlight with Play/Prev/Next */}
        <div className="px-3.5 py-2.5 flex items-center justify-between gap-3 bg-black/40">
          {/* Controls: Play/Pause, Prev, Next */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isPlaying 
                  ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]' 
                  : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
              title={isPlaying ? 'Pause Historical Tour' : 'Play Chronological Tour'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handlePrev}
              disabled={filteredEvents.length <= 1}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
              title="Previous Event"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNext}
              disabled={filteredEvents.length <= 1}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
              title="Next Event"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Current Event Info Banner */}
          {currentEvent && (
            <div className="flex-1 min-w-0 flex items-center justify-between gap-2 bg-[#1b0d12]/80 border border-rose-500/30 px-3 py-1.5 rounded-xl">
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-500/50 shrink-0">
                  {currentEvent.year}
                </span>

                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                    <CurrentIcon className="w-3 h-3 shrink-0" style={{ color: currentMeta.color }} />
                    <span className="truncate">{currentEvent.name}</span>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 truncate">
                    {currentEvent.regionName} • <span className="text-rose-300 font-semibold">{currentEvent.magnitudeOrIntensity}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectEvent(currentEvent)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/60 text-[11px] font-mono text-rose-200 font-bold flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_8px_rgba(244,63,94,0.3)] hover:scale-105"
                title="Fly to coordinate on 3D map"
              >
                <Compass className="w-3 h-3 text-rose-400" />
                <span>Inspect</span>
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM BAR: Scrubbable Event Rail */}
        <div className="px-3.5 py-2 border-t border-white/5 bg-[#0d0709] rounded-b-2xl">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin py-1">
            {filteredEvents.map((evt) => {
              const isSelected = evt.id === currentEvent?.id;
              const meta = HAZARD_TYPE_META[evt.hazardType] || { label: 'Event', color: '#ef4444' };
              
              return (
                <button
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500 text-white font-bold border border-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.6)] scale-105'
                      : 'bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                  title={`${evt.year} - ${evt.name} (${evt.magnitudeOrIntensity})`}
                >
                  <span 
                    className="w-1.5 h-1.5 rounded-full shrink-0" 
                    style={{ backgroundColor: isSelected ? '#ffffff' : meta.color }} 
                  />
                  <span>{evt.year}</span>
                  <span className="hidden sm:inline opacity-80 truncate max-w-[85px]">{evt.name.split(' ')[1] || evt.hazardType}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
