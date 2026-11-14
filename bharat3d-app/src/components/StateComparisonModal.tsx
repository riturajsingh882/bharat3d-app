import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  Scale, 
  PieChart
} from 'lucide-react';

interface StateComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StateData {
  shapeName: string;
  capital?: string;
  population_2011: number;
  area_sqkm: number;
  density_2011: number;
  literacy_rate: number;
  sex_ratio: number;
  growth_pct?: number;
  hindu_pct?: number;
  muslim_pct?: number;
  christian_pct?: number;
  sikh_pct?: number;
  buddhist_pct?: number;
}

export const StateComparisonModal: React.FC<StateComparisonModalProps> = ({
  isOpen,
  onClose
}) => {
  const [states, setStates] = useState<StateData[]>([]);
  const [stateAName, setStateAName] = useState<string>('Uttar Pradesh');
  const [stateBName, setStateBName] = useState<string>('Mahārāshtra');

  useEffect(() => {
    if (!isOpen) return;

    fetch('/data/india_states.geojson')
      .then(r => r.json())
      .then(d => {
        if (d && d.features) {
          const list: StateData[] = d.features.map((f: any) => ({
            shapeName: f.properties.shapeName || f.properties.name,
            capital: f.properties.capital,
            population_2011: f.properties.population_2011 || 0,
            area_sqkm: f.properties.area_sqkm || 0,
            density_2011: f.properties.density_2011 || 0,
            literacy_rate: f.properties.literacy_rate || 0,
            sex_ratio: f.properties.sex_ratio || 0,
            growth_pct: f.properties.growth_pct || 0,
            hindu_pct: f.properties.hindu_pct || 0,
            muslim_pct: f.properties.muslim_pct || 0,
            christian_pct: f.properties.christian_pct || 0,
            sikh_pct: f.properties.sikh_pct || 0,
            buddhist_pct: f.properties.buddhist_pct || 0
          }));
          list.sort((a, b) => a.shapeName.localeCompare(b.shapeName));
          setStates(list);

          // Default selection if available
          const hasUP = list.find(s => s.shapeName.toLowerCase().includes('uttar pradesh'));
          const hasMH = list.find(s => s.shapeName.toLowerCase().includes('mah'));
          if (hasUP) setStateAName(hasUP.shapeName);
          if (hasMH) setStateBName(hasMH.shapeName);
        }
      })
      .catch(err => console.error('Error fetching state comparison data:', err));
  }, [isOpen]);

  if (!isOpen) return null;

  const stateA = states.find(s => s.shapeName === stateAName) || states[0];
  const stateB = states.find(s => s.shapeName === stateBName) || states[1] || states[0];

  const handleSwap = () => {
    const temp = stateAName;
    setStateAName(stateBName);
    setStateBName(temp);
  };

  const renderComparisonBar = (
    label: string, 
    valA: number, 
    valB: number, 
    unit: string, 
    higherIsBetter: boolean = true,
    decimals: number = 0
  ) => {
    const total = (valA + valB) || 1;
    const pctA = Math.round((valA / total) * 100);
    const pctB = 100 - pctA;
    const isAWinner = higherIsBetter ? valA > valB : valA < valB;
    const isBWinner = higherIsBetter ? valB > valA : valB < valA;

    return (
      <div className="bg-[#121622] border border-white/10 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold text-sm ${isAWinner ? 'text-[#C9A227]' : 'text-neutral-300'}`}>
              {decimals > 0 ? valA.toFixed(decimals) : valA.toLocaleString()} {unit}
            </span>
            {isAWinner && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C9A227]/20 text-[#C9A227] font-bold border border-[#C9A227]/30">
                HIGHER
              </span>
            )}
          </div>

          <span className="text-neutral-400 font-bold uppercase tracking-wider text-[11px]">{label}</span>

          <div className="flex items-center gap-1.5">
            {isBWinner && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
                HIGHER
              </span>
            )}
            <span className={`font-bold text-sm ${isBWinner ? 'text-sky-400' : 'text-neutral-300'}`}>
              {decimals > 0 ? valB.toFixed(decimals) : valB.toLocaleString()} {unit}
            </span>
          </div>
        </div>

        {/* Dual Comparative Ratio Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-900 border border-white/5">
          <div 
            className="h-full bg-[#C9A227] transition-all duration-500" 
            style={{ width: `${pctA}%` }} 
            title={`${stateA?.shapeName}: ${pctA}%`}
          />
          <div 
            className="h-full bg-sky-400 transition-all duration-500" 
            style={{ width: `${pctB}%` }} 
            title={`${stateB?.shapeName}: ${pctB}%`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans">
      <div className="w-full max-w-4xl bg-[#0a0d14] border border-white/15 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0e121a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold tracking-tight text-white">
                State vs State Comparison Studio
              </h2>
              <p className="text-xs text-neutral-400 font-sans">
                Comparative statistical analysis grounded in Census 2011 &amp; Survey of India baseline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State Selectors Strip */}
        <div className="p-4 bg-[#111622] border-b border-white/10 grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
          {/* State A Select */}
          <div className="md:col-span-3 space-y-1">
            <label className="text-xs font-mono font-bold text-[#C9A227] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" />
              Primary State (A)
            </label>
            <select
              value={stateAName}
              onChange={(e) => setStateAName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#080b11] border border-[#C9A227]/40 text-white font-mono text-sm font-bold focus:outline-none focus:border-[#C9A227]"
            >
              {states.map(s => (
                <option key={s.shapeName} value={s.shapeName}>
                  {s.shapeName}
                </option>
              ))}
            </select>
            {stateA?.capital && (
              <span className="text-[11px] font-mono text-neutral-400">Capital: {stateA.capital}</span>
            )}
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/10 hover:rotate-180 duration-300"
              title="Swap States"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* State B Select */}
          <div className="md:col-span-3 space-y-1 text-right">
            <label className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center justify-end gap-1.5">
              Comparative State (B)
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            </label>
            <select
              value={stateBName}
              onChange={(e) => setStateBName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#080b11] border border-sky-500/40 text-white font-mono text-sm font-bold focus:outline-none focus:border-sky-400"
            >
              {states.map(s => (
                <option key={s.shapeName} value={s.shapeName}>
                  {s.shapeName}
                </option>
              ))}
            </select>
            {stateB?.capital && (
              <span className="text-[11px] font-mono text-neutral-400">Capital: {stateB.capital}</span>
            )}
          </div>
        </div>

        {/* Comparison Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {stateA && stateB ? (
            <>
              {/* Metric: Total Population */}
              {renderComparisonBar('Total Population (Census 2011)', stateA.population_2011, stateB.population_2011, 'citizens', true)}

              {/* Metric: Land Area */}
              {renderComparisonBar('Geographical Area', stateA.area_sqkm, stateB.area_sqkm, 'sq km', true)}

              {/* Metric: Density */}
              {renderComparisonBar('Population Density', stateA.density_2011, stateB.density_2011, '/ km²', true)}

              {/* Metric: Literacy Rate */}
              {renderComparisonBar('Literacy Rate', stateA.literacy_rate, stateB.literacy_rate, '%', true, 1)}

              {/* Metric: Sex Ratio */}
              {renderComparisonBar('Sex Ratio', stateA.sex_ratio, stateB.sex_ratio, 'F / 1000 M', true)}

              {/* Metric: Decadal Growth */}
              {stateA.growth_pct !== undefined && stateB.growth_pct !== undefined && (
                renderComparisonBar('Decadal Population Growth', stateA.growth_pct, stateB.growth_pct, '%', true, 1)
              )}

              {/* Religious Distribution Side-by-Side Table */}
              <div className="bg-[#121622] border border-white/10 rounded-xl p-4 mt-2">
                <div className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-purple-400" />
                    Religious Demographics Comparison (Table C-01)
                  </span>
                  <span className="text-neutral-500 text-[10px]">Percentage Share</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  {[
                    { label: 'Hindu', keyA: stateA.hindu_pct, keyB: stateB.hindu_pct, color: 'text-amber-400' },
                    { label: 'Muslim', keyA: stateA.muslim_pct, keyB: stateB.muslim_pct, color: 'text-emerald-400' },
                    { label: 'Christian', keyA: stateA.christian_pct, keyB: stateB.christian_pct, color: 'text-sky-400' },
                    { label: 'Sikh', keyA: stateA.sikh_pct, keyB: stateB.sikh_pct, color: 'text-yellow-400' },
                    { label: 'Buddhist', keyA: stateA.buddhist_pct, keyB: stateB.buddhist_pct, color: 'text-purple-400' }
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className={`font-bold text-sm ${item.color}`}>
                        {item.keyA ? `${item.keyA.toFixed(1)}%` : '—'}
                      </span>
                      <span className="text-neutral-300 font-bold">{item.label} Community</span>
                      <span className={`font-bold text-sm ${item.color}`}>
                        {item.keyB ? `${item.keyB.toFixed(1)}%` : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-neutral-400 font-mono">
              Loading state demographic datasets...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0a0d14] border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>Source: Office of the Registrar General & Census Commissioner (ORGI), Govt. of India</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
          >
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
};
