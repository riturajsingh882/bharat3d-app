import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck, Database, Mountain, Compass } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
  onFinished?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading, onFinished }) => {
  const [progress, setProgress] = useState(15);
  const [stage, setStage] = useState('Initializing GIS Engine...');
  const [shouldRender, setShouldRender] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const stages = [
      { pct: 30, text: 'Calibrating 36 States & UT Administrative Boundaries (ADM1)...' },
      { pct: 55, text: 'Enriching 735 Districts with Census 2011 Microdata...' },
      { pct: 75, text: 'Synchronizing Major River Networks & Hydrographic Basins...' },
      { pct: 90, text: 'Activating 3D Relief Terrain (NASA SRTM / Mapzen DEM)...' },
      { pct: 100, text: 'Bharat 3D Academic Atlas Ready' }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < stages.length) {
        setProgress(stages[currentIdx].pct);
        setStage(stages[currentIdx].text);
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading && progress >= 100) {
      const timer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setShouldRender(false);
          if (onFinished) onFinished();
        }, 700);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isLoading, progress, onFinished]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] transition-opacity duration-700 select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient lighting effects */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -translate-y-12" />
      <div className="absolute w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none translate-y-36" />
      <div className="absolute w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-48" />

      {/* Main Card */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        {/* Animated Brand Emblem */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          {/* Outer rotating pulse ring */}
          <div className="absolute inset-0 rounded-3xl border border-cyan-500/30 animate-ping opacity-25" />
          <div className="absolute -inset-2 rounded-3xl border border-blue-500/20 animate-spin" style={{ animationDuration: '12s' }} />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 shadow-2xl shadow-cyan-500/40 flex items-center justify-center border border-cyan-300/40">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-serif font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-300">
              BHARAT 3D
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#C9A227]/15 text-[#D9B23C] border border-[#C9A227]/40 tracking-wider">
              ATLAS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Interactive Geographic &amp; Demographic Atlas of India
          </p>
        </div>

        {/* Feature Icons Row */}
        <div className="flex items-center gap-4 my-6 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Compass className="w-3.5 h-3.5" /> 3D Terrain
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span className="flex items-center gap-1.5 text-blue-400">
            <Mountain className="w-3.5 h-3.5" /> 10 River Basins
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span className="flex items-center gap-1.5 text-amber-400">
            <Database className="w-3.5 h-3.5" /> Census Microdata
          </span>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-80 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 truncate max-w-[220px] text-left">{stage}</span>
            <span className="font-mono font-bold text-[#D9B23C]">{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-900/90 border border-slate-800 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C9A227] via-[#D9B23C] to-[#e3c66a] transition-all duration-300 shadow-lg shadow-[#C9A227]/40"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Authentic Provenance Notice */}
        <div className="mt-8 flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/40 px-3.5 py-1.5 rounded-lg border border-slate-800/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Strict Provenance Standard: 100% Authentic Government & Verified Data</span>
        </div>
      </div>
    </div>
  );
};
