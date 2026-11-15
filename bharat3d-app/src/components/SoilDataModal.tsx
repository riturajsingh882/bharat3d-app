import React from 'react';
import { X, Database, ExternalLink, Layers, Calendar, AlertTriangle } from 'lucide-react';

interface SoilDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DATASETS = [
  {
    name: 'Soil Resource Database (1:1M)',
    scale: '1:1,000,000',
    coverage: 'Pan-India (national)',
  },
  {
    name: 'Soil Resource Database (1:250K)',
    scale: '1:250,000',
    coverage: 'State-scale mapping',
  },
  {
    name: 'Soil Resource Database (1:50K)',
    scale: '1:50,000',
    coverage: '~49–50 selected districts',
  },
  {
    name: 'Soil Resource Database (1:10K)',
    scale: '1:10,000',
    coverage: '114–146 selected blocks',
  },
];

export const SoilDataModal: React.FC<SoilDataModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl vista-modal overflow-hidden flex flex-col max-h-[88vh] font-sans shadow-[0_24px_80px_rgba(0,0,0,0.75)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0e1117]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a1f2c] border border-amber-500/50 flex items-center justify-center">
              <Layers className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold tracking-tight text-white">
                Soil Geography — Data Sources &amp; Accuracy
              </h2>
              <p className="text-sm text-neutral-300 font-sans mt-0.5 font-medium">
                ICAR-NBSS&amp;LUP soil-resource datasets &amp; classification methodology
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Accuracy status banner */}
          <div className="p-4 rounded-xl bg-[#1a1510] border-l-4 border-l-amber-500 border border-white/5 flex gap-3.5 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed text-neutral-200">
              <span className="font-semibold text-amber-300">
                The current map shows an approximate schematic, not official ICAR geometry.{' '}
              </span>
              The soil polygons on this map are a simplified educational approximation of India&apos;s
              major soil belts. They are <strong>not</strong> the official ICAR-NBSS&amp;LUP
              soil-resource polygons and must not be used for parcel-level or legal soil classification.
            </div>
          </div>

          {/* Publisher */}
          <div className="vista-card p-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-2">
              Authoritative Publisher
            </div>
            <div className="text-white font-semibold">
              ICAR — National Bureau of Soil Survey &amp; Land Use Planning (NBSS&amp;LUP)
            </div>
            <div className="text-sm text-neutral-300 mt-1">
              The national authority for soil-resource mapping in India.
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs font-semibold">
              <a href="https://nbsslup.icar.gov.in/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-white flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> nbsslup.icar.gov.in
              </a>
              <a href="https://bhoomigeoportal-nbsslup.in/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-white flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> BHOOMI Geoportal
              </a>
              <a href="https://icar.gov.in/en/landmark-technologies-1" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-white flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> ICAR soil mapping
              </a>
            </div>
          </div>

          {/* Reference map */}
          <div className="vista-card p-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" /> Official NBSS&amp;LUP &quot;Soils of India&quot; reference map
            </div>
            <img
              src="/data/soils_of_india_reference.jpg"
              alt="Official NBSS&LUP Soils of India map"
              className="w-full max-h-72 object-contain rounded-lg border border-white/10 bg-white"
            />
            <div className="text-[10px] text-neutral-500 mt-2 font-mono leading-relaxed">
              Source: AESRs of India, NBSS&amp;LUP, Nagpur. Shown for visual reference only — this scan is
              not georeferenced and is not extracted as GIS vector data.
            </div>
          </div>

          {/* Datasets */}
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-amber-400" /> Official datasets identified on BHOOMI Geoportal
            </div>
            <div className="space-y-2">
              {DATASETS.map((d) => (
                <div key={d.name} className="vista-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">{d.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-bold">
                      {d.scale}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">{d.coverage}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Access status */}
          <div className="p-4 rounded-xl bg-[#12161d] border border-white/10">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-sky-400" /> Access status
            </div>
            <div className="text-sm text-neutral-200 leading-relaxed">
              These datasets are served through the <strong>BHOOMI Geoportal viewer</strong>. Open
              vector export (GeoJSON / WFS / shapefile) is <strong>not publicly available</strong> —
              GIS download requires registration or institutional permission from ICAR-NBSS&amp;LUP.
              Because the raw official geometry could not be accessed, this atlas keeps a clearly
              labelled <strong>approximate</strong> layer rather than presenting unverified data as
              official.
            </div>
          </div>

          {/* Classification note */}
          <div className="p-4 rounded-xl bg-[#12161d] border border-white/10">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Classification note
            </div>
            <div className="text-sm text-neutral-200 leading-relaxed">
              ICAR-NBSS&amp;LUP maps use scientific <strong>soil taxonomy</strong> (orders,
              subgroups, associations), which is not identical to the eight traditional educational
              categories used here. A documented crosswalk is required before any official dataset
              replaces this layer. The current approximation covers <strong>6 of the 8</strong>
              educational categories; <strong>Saline &amp; Alkaline</strong> and{' '}
              <strong>Peaty &amp; Marshy</strong> soils are not mapped here and require the official
              dataset.
            </div>
          </div>

          {/* Class crosswalk */}
          <div className="p-4 rounded-xl bg-[#12161d] border border-white/10">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Official class → educational category crosswalk
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              {[
                ['Alluvial-derived (with saline phases)', 'Alluvial + Saline/Alkaline'],
                ['Coastal & Deltaic Alluvium-derived', 'Alluvial'],
                ['Deep Black / Shallow Black', 'Black / Regur'],
                ['Mixed Red & Black', 'Red & Yellow (+ Black)'],
                ['Red Loamy / Red & Yellow', 'Red & Yellow'],
                ['Red & Lateritic', 'Laterite (+ Red & Yellow)'],
                ['Brown Forest & Podzolic / Brown & Red Hills', 'Forest & Mountain'],
                ['Desert (saline) / Grey Brown / Sandy & Littoral', 'Arid / Desert'],
                ['Saline & sodic', 'Saline & Alkaline'],
                ['Skeletal / Tarai', 'Forest & Mountain / Alluvial'],
              ].map(([a, b]) => (
                <div key={a} className="flex items-start justify-between gap-3 py-1 border-b border-white/5 last:border-0">
                  <span className="text-neutral-300">{a}</span>
                  <span className="text-amber-300 font-bold text-right shrink-0">{b}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-neutral-500 mt-2 font-mono leading-relaxed">
              Indicative crosswalk derived from the official map legend. Some classes span multiple
              educational categories; that uncertainty is preserved rather than forced into one class.
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-xl bg-[#1a1510] border-l-4 border-l-amber-500 border border-white/5 text-sm text-neutral-200 leading-relaxed">
            <span className="font-semibold text-amber-300">Disclaimer: </span>
            Mapped soil distribution is an approximate educational schematic based on the ICAR 8-fold
            classification. Mapping scale, survey coverage and classification methodology determine
            the level of geographic detail. This layer should not be interpreted as parcel-level soil
            certification.
          </div>

          <div className="text-xs text-neutral-500 font-mono flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Source review: November 2026 · ICAR-NBSS&amp;LUP /
            BHOOMI Geoportal
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0e1117] flex items-center justify-between text-xs">
          <span className="text-neutral-400 font-bold font-mono">
            Approximate layer · official dataset access required
          </span>
          <button onClick={onClose} className="btn-coral px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
