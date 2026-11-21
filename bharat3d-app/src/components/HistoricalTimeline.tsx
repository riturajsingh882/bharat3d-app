import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Clock, 
  Sparkles, 
  RotateCcw,
  X,
  Info,
  Minimize2,
  Maximize2
} from 'lucide-react';
import type { HistoricalPeriodId } from '../types';
import { HISTORICAL_ERAS } from '../data/historicalEras';

interface HistoricalTimelineProps {
  currentEraId: HistoricalPeriodId;
  onSelectEra: (id: HistoricalPeriodId) => void;
  onClose: () => void;
  isOpen?: boolean;
}

export const HistoricalTimeline: React.FC<HistoricalTimelineProps> = ({
  currentEraId,
  onSelectEra,
  onClose,
  isOpen = true
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const currentIndex = HISTORICAL_ERAS.findIndex(era => era.id === currentEraId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentEra = HISTORICAL_ERAS[safeIndex];

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      const idx = HISTORICAL_ERAS.findIndex(e => e.id === currentEraId);
      const nextIdx = (idx + 1) % HISTORICAL_ERAS.length;
      onSelectEra(HISTORICAL_ERAS[nextIdx].id);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying, currentEraId, onSelectEra]);

  if (!isOpen) return null;

  const handlePrev = () => {
    const prevIdx = safeIndex > 0 ? safeIndex - 1 : HISTORICAL_ERAS.length - 1;
    onSelectEra(HISTORICAL_ERAS[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (safeIndex + 1) % HISTORICAL_ERAS.length;
    onSelectEra(HISTORICAL_ERAS[nextIdx].id);
  };

  // --- MINIMIZED COMPACT FLOATING PILL ---
  if (isMinimized) {
    return (
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95%] font-sans pointer-events-auto animate-snappy-pop select-none">
        <div className="bg-[#091014]/94 backdrop-blur-xl border border-amber-500/50 rounded-full px-3.5 py-1.5 shadow-2xl shadow-amber-950/60 flex items-center gap-3 text-xs text-white">
          <div className="flex items-center gap-1.5">
            <span 
              className="w-3.5 h-3.5 rounded-full shadow-md border border-white/20 shrink-0" 
              style={{ backgroundColor: currentEra.color }}
            />
            <span className="font-serif font-bold text-xs sm:text-sm tracking-wide text-amber-300">
              {currentEra.name}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              ({currentEra.yearApprox})
            </span>
          </div>

          <div className="flex items-center gap-1 border-l border-white/10 pl-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Expand Historical Timeline Deck"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
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

  // --- ERGONOMIC LOW-PROFILE TIMELINE DECK ---
  // Exactly matches EnvironmentalComparisonDeck width & compact height
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] sm:w-[88%] max-w-2xl lg:max-w-[720px] transition-all duration-300 font-sans pointer-events-auto animate-snappy-pop select-none">
      <div className="bg-[#091014]/94 backdrop-blur-2xl border border-amber-500/40 rounded-2xl shadow-2xl overflow-visible shadow-amber-950/60 text-white">
        
        {/* Sleek Low-Profile Header Bar */}
        <div className="px-3 py-1.5 bg-[#060c10] border-b border-white/10 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div 
              className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-white shadow-md border border-white/20 shrink-0"
              style={{ backgroundColor: currentEra.color }}
            >
              <Clock className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-1.5 truncate min-w-0">
              <span className="font-serif font-bold text-xs sm:text-sm tracking-wide text-white uppercase truncate">
                {currentEra.name}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold shrink-0">
                {currentEra.yearApprox}
              </span>
              <span className="text-[9px] font-mono text-neutral-400 font-semibold hidden md:inline shrink-0">
                ({safeIndex + 1}/{HISTORICAL_ERAS.length})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Playback Autoplay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                isPlaying 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'bg-white/5 hover:bg-white/15 text-neutral-200 border-white/10'
              }`}
              title={isPlaying ? 'Pause Auto-Chronology' : 'Play Auto-Chronology (4.5s per era)'}
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            {/* Prev */}
            <button
              onClick={handlePrev}
              className="p-1 rounded bg-white/5 hover:bg-white/15 text-neutral-200 hover:text-white transition-colors cursor-pointer"
              title="Previous Era"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              className="p-1 rounded bg-white/5 hover:bg-white/15 text-neutral-200 hover:text-white transition-colors cursor-pointer"
              title="Next Era"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Reset to Present */}
            <button
              onClick={() => onSelectEra('present')}
              className="p-1 rounded bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Reset to Present Day"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Toggle Narrative Details */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer flex items-center gap-1 border ${
                showDetails
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                  : 'text-neutral-400 hover:text-white border-transparent hover:bg-white/5'
              }`}
              title="Toggle Scholarly Narrative"
            >
              <Info className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Details</span>
              {showDetails ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
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
              title="Close Timeline"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Compact Main Control Body */}
        <div className="p-2.5 sm:p-3 space-y-2">
          
          {/* Interactive Timeline Slider & Ticks */}
          <div>
            <div className="relative w-full h-6 flex items-center">
              {/* Track Bar */}
              <div className="absolute left-0 right-0 h-1.5 bg-slate-800/90 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-300 rounded-full"
                  style={{ 
                    width: `${(safeIndex / (HISTORICAL_ERAS.length - 1)) * 100}%`,
                    backgroundColor: currentEra.color 
                  }}
                />
              </div>

              {/* Interactive Era Points */}
              <div className="absolute left-0 right-0 flex justify-between items-center px-1">
                {HISTORICAL_ERAS.map((era, idx) => {
                  const isSelected = era.id === currentEraId;
                  return (
                    <button
                      key={era.id}
                      onClick={() => onSelectEra(era.id)}
                      className={`group relative flex flex-col items-center cursor-pointer transition-transform duration-200 ${
                        isSelected ? 'scale-125 z-10' : 'hover:scale-110'
                      }`}
                      title={`${era.name} (${era.yearApprox})`}
                    >
                      <span 
                        className={`w-3 h-3 rounded-full border transition-all flex items-center justify-center ${
                          isSelected 
                            ? 'border-white shadow-[0_0_8px_#f59e0b] scale-110 ring-2 ring-amber-400/60' 
                            : idx < safeIndex 
                            ? 'border-transparent bg-amber-500/70' 
                            : 'border-slate-600 bg-slate-900'
                        }`}
                        style={{ backgroundColor: isSelected ? era.color : undefined }}
                      >
                        {isSelected && <span className="w-1 h-1 rounded-full bg-white" />}
                      </span>

                      {/* Hover Floating Tooltip */}
                      <span className="absolute -top-7 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/95 text-white border border-white/20 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xl whitespace-nowrap z-30">
                        {era.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline Bottom Labels */}
            <div className="flex justify-between text-[10px] font-mono text-neutral-400 pt-1">
              <span className="flex items-center gap-1 font-bold text-teal-400">
                <Sparkles className="w-3 h-3" />
                c. 2600 BCE (Indus)
              </span>
              <span className="hidden sm:inline text-neutral-500">c. 320 BCE (Maurya)</span>
              <span className="hidden sm:inline text-neutral-500">c. 1526 CE (Mughal)</span>
              <span className="font-bold text-[#C9A227]">2026 CE (Present)</span>
            </div>
          </div>

          {/* Quick Facts Pill Row */}
          <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-[#0e141c]/90 border border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="text-neutral-400 text-[11px]">Capital:</span>
              <span className="text-white font-bold text-[11px] truncate">{currentEra.capital}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <span className="text-neutral-400 text-[11px]">Ruler/Figures:</span>
              <span className="text-amber-300 font-bold text-[11px] truncate max-w-[220px]" title={currentEra.rulerNotable}>
                {currentEra.rulerNotable}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-[10px] text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>ASI Baseline</span>
            </div>
          </div>

          {/* Collapsible Scholarly Narrative & Sources */}
          {showDetails && (
            <div className="p-2.5 rounded-xl bg-[#060a10]/95 border border-amber-500/25 space-y-2 text-xs font-sans text-neutral-300 animate-in fade-in slide-in-from-top-1">
              <div className="leading-relaxed font-normal">
                {currentEra.description}
              </div>
              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span className="text-amber-400/90 font-semibold flex items-center gap-1">
                  <Info className="w-3 h-3 shrink-0" />
                  <span>Historical boundaries reflect dynastic core and spheres of influence.</span>
                </span>
                <span className="text-neutral-500 shrink-0 ml-2">ASI &amp; Imperial Records</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
