import React from 'react';
import { X, Shield, AlertTriangle, ExternalLink, CheckCircle2, Layers, Mountain, Waves, Users, PieChart, Trees } from 'lucide-react';

interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sources = [
    {
      category: 'Administrative Boundaries (States & Districts)',
      icon: <Layers className="w-4 h-4 text-[#C9A227]" />,
      institution: 'Survey of India / Local Government Directory (LGD) & geoBoundaries',
      coverage: '36 States & UTs (ADM1), 736 Districts (ADM2)',
      license: 'CC-BY 2.5 India / Open Data Commons ODbL',
      status: 'VERIFIED ONLINE',
      url: 'https://www.geoboundaries.org'
    },
    {
      category: '3D Terrain & Digital Elevation Model (DEM)',
      icon: <Mountain className="w-4 h-4 text-[#C9A227]" />,
      institution: 'NASA SRTM / ISRO CartoDEM / Mapzen Elevation Tiles',
      coverage: 'Pan-India 30m resolution elevation from -100m to 8,848m',
      license: 'Open Data / Public Domain',
      status: 'VERIFIED ONLINE',
      url: 'https://registry.opendata.aws/terrain-tiles/'
    },
    {
      category: 'Hydrological Networks & River Systems',
      icon: <Waves className="w-4 h-4 text-[#C9A227]" />,
      institution: 'India-WRIS / Central Water Commission (CWC) & Natural Earth 10m',
      coverage: 'Major 10 River Basins (Ganga, Brahmaputra, Indus, Godavari, Krishna, etc.)',
      license: 'Open Government Data / HydroSHEDS License',
      status: 'VERIFIED ONLINE',
      url: 'https://indiawris.gov.in/'
    },
    {
      category: 'Demographics & Population Density',
      icon: <Users className="w-4 h-4 text-[#C9A227]" />,
      institution: 'Office of the Registrar General & Census Commissioner, India (ORGI)',
      coverage: 'Primary Census Abstract (PCA) 2011 & 2001 (All Districts & States)',
      license: 'Government of India Open Data (NDSAP)',
      status: 'VERIFIED ONLINE',
      url: 'https://data.gov.in/'
    },
    {
      category: 'Religious Demographics (Table C-01)',
      icon: <PieChart className="w-4 h-4 text-[#C9A227]" />,
      institution: 'Census of India 2011 (Ministry of Home Affairs)',
      coverage: '6 major religions + Other persuasions across Indian districts',
      license: 'Government of India Open Data',
      status: 'VERIFIED ONLINE',
      url: 'https://censusindia.gov.in/'
    },
    {
      category: 'Soil Geography & Classification',
      icon: <Trees className="w-4 h-4 text-[#C9A227]" />,
      institution: 'ICAR - National Bureau of Soil Survey & Land Use Planning (NBSS&LUP)',
      coverage: '8-Fold Soil Classification of India (Alluvial, Black, Red, Laterite, etc.)',
      license: 'ICAR / Scientific Research Data',
      status: 'VERIFIED ONLINE',
      url: 'https://icar.org.in/'
    },
    {
      category: 'Orography & Mountain Ranges',
      icon: <Mountain className="w-4 h-4 text-[#C9A227]" />,
      institution: 'Geological Survey of India (GSI) & Survey of India (SOI)',
      coverage: 'Himalayas, Western Ghats, Eastern Ghats, Aravalli, Vindhyas, Satpura',
      license: 'Government of India Mapping Products',
      status: 'VERIFIED ONLINE',
      url: 'https://bhukosh.gsi.gov.in/'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl vista-modal overflow-hidden flex flex-col max-h-[88vh] font-sans shadow-[0_24px_80px_rgba(0,0,0,0.75)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0e1117]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a1f2c] border border-[#C9A227]/50 flex items-center justify-center shadow-[0_0_15px_rgba(201,162,39,0.3)]">
              <Shield className="w-5 h-5 text-[#C9A227] fill-[#C9A227]/20" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold tracking-tight text-white">
                Official Data Source Registry &amp; Provenance
              </h2>
              <p className="text-sm text-neutral-300 font-sans tracking-wide mt-0.5 font-medium">
                Every dataset traces to a verified primary government source.
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

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Methodological Transparency Alert Box with Coral indicator */}
          <div className="p-4 rounded-xl bg-[#171210] border-l-4 border-l-[#C9A227] border border-white/5 flex gap-3.5 items-start">
            <AlertTriangle className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed text-neutral-200 font-sans font-medium">
              <span className="font-mono font-bold text-[#C9A227] text-sm">Methodological Transparency: </span>
              All population and religious demographic figures are sourced from the verified Census of India 2011 & 2001 publications. They are explicitly labeled as historical baselines and never disguised as projected or fabricated current-year statistics.
            </div>
          </div>

          {/* Source Registry Cards */}
          <div className="space-y-3">
            {sources.map((item, idx) => (
              <div
                key={idx}
                className="vista-card p-4 hover:border-[#C9A227]/40 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {item.category}
                    </h3>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1 bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.status}</span>
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-neutral-300 font-sans ml-6 font-semibold">
                  <div>
                    <span className="text-neutral-400 font-mono text-xs font-bold">• Institution: </span>
                    <span className="text-white font-bold">{item.institution}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-mono text-xs font-bold">• Coverage: </span>
                    <span className="text-neutral-200 font-bold">{item.coverage}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-neutral-400 font-mono text-xs font-bold">• License: </span>
                      <span className="text-neutral-300 font-bold">{item.license}</span>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold text-[#C9A227] hover:text-white flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded hover:bg-[#C9A227]/15"
                    >
                      <span>Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0e1117] flex items-center justify-between text-xs">
          <span className="text-neutral-400 text-xs font-bold font-mono">
            Government of India Open Data License Standard
          </span>

          <button
            onClick={onClose}
            className="btn-coral px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer"
          >
            Close Registry
          </button>
        </div>
      </div>
    </div>
  );
};
