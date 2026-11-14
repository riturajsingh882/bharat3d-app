import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  RotateCcw,
  X,
  Info
} from 'lucide-react';
import type { HistoricalPeriodId } from '../types';
import { HISTORICAL_ERAS } from '../data/historicalEras';

interface HistoricalTimelineProps {
  currentEraId: HistoricalPeriodId;
  onSelectEra: (id: HistoricalPeriodId) => void;
  onClose: () => void;
}

export const HistoricalTimeline: React.FC<HistoricalTimelineProps> = ({
  currentEraId,
  onSelectEra,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
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

  const handlePrev = () => {
    const prevIdx = safeIndex > 0 ? safeIndex - 1 : HISTORICAL_ERAS.length - 1;
    onSelectEra(HISTORICAL_ERAS[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (safeIndex + 1) % HISTORICAL_ERAS.length;
    onSelectEra(HISTORICAL_ERAS[nextIdx].id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel-glow border border-amber-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl bg-[#080c14]/95 text-white font-sans select-none animate-in fade-in slide-in-from-bottom-4">
      {/* Top Header: Era Title, Capital, and Controls */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg border border-white/20"
            style={{ backgroundColor: currentEra.color }}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {currentEra.era}
              </span>
              <span className="text-xs font-mono text-neutral-400 font-semibold">
                Era {safeIndex + 1} of {HISTORICAL_ERAS.length}
              </span>
            </div>
            <h3 className="text-2xl font-serif font-semibold tracking-tight text-white flex items-center gap-2 mt-0.5">
              <span>{currentEra.name}</span>
              <span className="text-sm font-sans font-normal text-amber-300/90">
                ({currentEra.yearApprox})
              </span>
            </h3>
          </div>
        </div>

        {/* Playback Controls & Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              isPlaying 
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isPlaying ? 'Pause Auto-Chronology' : 'Play Auto-Chronology (4.5s per era)'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'PAUSE' : 'AUTOPLAY'}</span>
          </button>

          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Previous Era"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Next Era"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => onSelectEra('present')}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Reset to Present Day"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 text-neutral-400 transition-colors cursor-pointer ml-1"
            title="Close Timeline"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Middle: Brief Narrative & Capital / Ruler Quick Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3 text-xs font-mono">
        <div className="md:col-span-2 text-neutral-300 font-sans text-xs leading-relaxed font-semibold">
          {currentEra.description}
        </div>
        <div className="bg-[#121622] border border-white/10 rounded-lg p-2.5 space-y-1">
          <div className="flex justify-between">
            <span className="text-neutral-400">Capital:</span>
            <span className="text-white font-bold">{currentEra.capital}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Key Figures:</span>
            <span className="text-amber-300 font-bold truncate max-w-[160px]" title={currentEra.rulerNotable}>
              {currentEra.rulerNotable}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Slider & Ticks */}
      <div className="pt-2">
        <div className="relative w-full h-8 flex items-center">
          {/* Track Bar */}
          <div className="absolute left-0 right-0 h-2 bg-slate-800 rounded-full overflow-hidden">
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
                    className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                      isSelected 
                        ? 'border-white shadow-[0_0_12px_#fff] scale-110' 
                        : idx < safeIndex 
                        ? 'border-transparent bg-amber-500/70' 
                        : 'border-slate-600 bg-slate-900'
                    }`}
                    style={{ backgroundColor: isSelected ? era.color : undefined }}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>

                  {/* Hover Floating Tooltip */}
                  <span className="absolute -top-7 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/95 text-white border border-white/20 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xl whitespace-nowrap">
                    {era.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Bottom Labels: BCE to CE Range */}
        <div className="flex justify-between text-[11px] font-mono text-neutral-400 mt-1">
          <span className="flex items-center gap-1 font-bold text-teal-400">
            <Sparkles className="w-3 h-3" />
            c. 2600 BCE (Indus Valley)
          </span>
          <span className="text-neutral-500">c. 320 BCE (Maurya)</span>
          <span className="text-neutral-500">c. 1526 CE (Mughal)</span>
          <span className="text-neutral-500">1947 CE (Partition)</span>
          <span className="font-bold text-[#C9A227]">2026 CE (Present Day)</span>
        </div>
      </div>

      {/* Cartographic Authenticity Disclaimer */}
      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
        <span className="flex items-center gap-1 text-amber-300 font-bold">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>APPROXIMATE SCHOLARLY RECONSTRUCTION: Historical boundaries reflect dynastic core & spheres of influence, not modern surveyed borders.</span>
        </span>
        <span className="text-neutral-400 shrink-0 ml-2">ASI / Imperial Gazetteer baseline</span>
      </div>
    </div>
  );
};
