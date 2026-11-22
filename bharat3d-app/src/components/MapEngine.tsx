import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, NavigationControl, ScaleControl, setWorkerUrl, Marker, type MapMouseEvent, type MapGeoJSONFeature } from 'maplibre-gl';
import type { ActiveLayer, BasemapStyle, DemographicRecord, HistoricalPeriodId, ReligionFilter, SearchTarget, SelectedFeatureInfo, TradeCategory, EnvironmentalPillar, EnvironmentalComparisonConfig, DisasterHazardType, DisasterRegion, InfrastructureCategory } from '../types';
import { APP_CONFIG } from '../config';
import { formatElevationDual } from '../utils/elevation';
import { ENVIRONMENTAL_FEATURES, ENVIRONMENTAL_FEATURES_BY_ID } from '../data/environmentalGeojson';
import { DISASTER_GEOJSON, DISASTER_HAZARDS_BY_ID } from '../data/disasterIntelligence';
import { INFRASTRUCTURE_GEOJSON, INFRASTRUCTURE_BY_ID } from '../data/infrastructureIntelligence';

// Statically point MapLibre worker to the public directory
setWorkerUrl('/maplibre-gl-worker.mjs');

// Maps search-result types without a dedicated highlight layer to a source + property.
const SEARCH_HIGHLIGHT_SOURCE: Record<string, { source: string; field: string } | undefined> = {
  historical_empire: { source: 'historical-empires', field: 'name' },
  historical_capital: { source: 'historical-empires', field: 'name' },
  trade_route: { source: 'historical-trade-routes', field: 'name' },
  environmental_change: { source: 'environmental-change', field: 'id' },
  glacier: { source: 'environmental-change', field: 'id' },
  wetland: { source: 'environmental-change', field: 'id' },
  disaster_hazard: { source: 'disaster-seismic-zones', field: 'id' },
  seismic_zone: { source: 'disaster-seismic-zones', field: 'id' },
  earthquake_epicenter: { source: 'disaster-seismic-zones', field: 'id' },
  infrastructure_item: { source: 'infrastructure-economic', field: 'id' },
  infrastructure_highway: { source: 'infrastructure-economic', field: 'id' },
  infrastructure_railway: { source: 'infrastructure-economic', field: 'id' },
  infrastructure_airport: { source: 'infrastructure-economic', field: 'id' },
  infrastructure_seaport: { source: 'infrastructure-economic', field: 'id' },
  infrastructure_corridor: { source: 'infrastructure-economic', field: 'id' },
  infrastructure_dam: { source: 'infrastructure-economic', field: 'id' },
  infrastructure_power: { source: 'infrastructure-economic', field: 'id' },
  infrastructure_sez: { source: 'infrastructure-economic', field: 'id' },
  infrastructure_urban: { source: 'infrastructure-economic', field: 'id' }
};

// Generates crisp 44x44 high-DPI canvas icon badges for map symbols
function createCategoryIconCanvas(category: string, bg: string): ImageData | null {
  const size = 44;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const cx = size / 2;
  const cy = size / 2;

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.arc(cx, cy + 1.5, 17, 0, Math.PI * 2);
  ctx.fill();

  // Outer circle with category color
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fill();

  // White border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.stroke();

  // Dark inner circle
  ctx.fillStyle = '#060a12';
  ctx.beginPath();
  ctx.arc(cx, cy, 14.5, 0, Math.PI * 2);
  ctx.fill();

  // Center vector glyph in white
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (category === 'railways') {
    // Train locomotive
    ctx.beginPath();
    ctx.roundRect(cx - 7, cy - 8, 14, 13, 2.5);
    ctx.fill();
    ctx.fillStyle = bg;
    ctx.fillRect(cx - 5, cy - 6, 10, 4);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy + 1, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - 4, cy + 6.5, 1.5, 0, Math.PI * 2);
    ctx.arc(cx + 4, cy + 6.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (category === 'airports') {
    // Climbing passenger airplane
    ctx.beginPath();
    ctx.moveTo(cx, cy - 8);
    ctx.lineTo(cx + 2, cy - 1);
    ctx.lineTo(cx + 9, cy + 2);
    ctx.lineTo(cx + 9, cy + 4);
    ctx.lineTo(cx + 2, cy + 2.5);
    ctx.lineTo(cx + 1.5, cy + 7);
    ctx.lineTo(cx + 4.5, cy + 9);
    ctx.lineTo(cx + 4.5, cy + 10);
    ctx.lineTo(cx, cy + 8.5);
    ctx.lineTo(cx - 4.5, cy + 10);
    ctx.lineTo(cx - 4.5, cy + 9);
    ctx.lineTo(cx - 1.5, cy + 7);
    ctx.lineTo(cx - 2, cy + 2.5);
    ctx.lineTo(cx - 9, cy + 4);
    ctx.lineTo(cx - 9, cy + 2);
    ctx.lineTo(cx - 2, cy - 1);
    ctx.closePath();
    ctx.fill();
  } else if (category === 'seaports') {
    // Anchor
    ctx.beginPath();
    ctx.arc(cx, cy - 6, 2.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 3.5);
    ctx.lineTo(cx, cy + 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy - 2);
    ctx.lineTo(cx + 5, cy - 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + 2, 6, 0.2 * Math.PI, 0.8 * Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 4);
    ctx.lineTo(cx - 6, cy + 2);
    ctx.moveTo(cx + 6, cy + 4);
    ctx.lineTo(cx + 6, cy + 2);
    ctx.stroke();
  } else if (category === 'power_plants') {
    // Lightning bolt
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(cx + 2, cy - 8);
    ctx.lineTo(cx - 5, cy - 0.5);
    ctx.lineTo(cx - 1, cy - 0.5);
    ctx.lineTo(cx - 3, cy + 8);
    ctx.lineTo(cx + 5, cy + 0.5);
    ctx.lineTo(cx + 1, cy + 0.5);
    ctx.closePath();
    ctx.fill();
  } else if (category === 'dams') {
    // Dam wall & water waves
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy - 7);
    ctx.lineTo(cx + 5, cy - 7);
    ctx.lineTo(cx + 7, cy + 2);
    ctx.lineTo(cx - 7, cy + 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy + 5);
    ctx.quadraticCurveTo(cx - 3.5, cy + 3.5, cx, cy + 5);
    ctx.quadraticCurveTo(cx + 3.5, cy + 6.5, cx + 7, cy + 5);
    ctx.stroke();
  } else if (category === 'industrial_corridors') {
    // Factory sawtooth
    ctx.fillStyle = '#f0abfc';
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy + 6);
    ctx.lineTo(cx - 7, cy - 2);
    ctx.lineTo(cx - 2, cy + 1);
    ctx.lineTo(cx - 2, cy - 4);
    ctx.lineTo(cx + 3, cy - 1);
    ctx.lineTo(cx + 3, cy - 7);
    ctx.lineTo(cx + 6, cy - 7);
    ctx.lineTo(cx + 6, cy + 6);
    ctx.closePath();
    ctx.fill();
  } else if (category === 'economic_zones') {
    // Skyscraper high-rise
    ctx.fillStyle = '#6ee7b7';
    ctx.fillRect(cx - 6, cy - 4, 4, 10);
    ctx.fillRect(cx - 1, cy - 8, 4, 14);
    ctx.fillRect(cx + 4, cy - 2, 3, 8);
  } else if (category === 'urban_centres') {
    // Megacity skyline
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(cx - 7, cy - 3, 3, 9);
    ctx.fillRect(cx - 3, cy - 7, 4, 13);
    ctx.beginPath();
    ctx.moveTo(cx - 1, cy - 7);
    ctx.lineTo(cx - 1, cy - 10);
    ctx.stroke();
    ctx.fillRect(cx + 2, cy - 5, 5, 11);
  } else {
    // Highway shield
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 7);
    ctx.lineTo(cx + 6, cy - 4);
    ctx.lineTo(cx + 4.5, cy + 3);
    ctx.lineTo(cx, cy + 7);
    ctx.lineTo(cx - 4.5, cy + 3);
    ctx.lineTo(cx - 6, cy - 4);
    ctx.closePath();
    ctx.fill();
  }

  return ctx.getImageData(0, 0, size, size);
}

function getCategorySvgIcon(category: string): string {
  switch (category) {
    case 'railways':
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="3" rx="2.5"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1.2" fill="currentColor"/><circle cx="16" cy="15" r="1.2" fill="currentColor"/></svg>`;
    case 'airports':
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`;
    case 'seaports':
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" x2="12" y1="22" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>`;
    case 'industrial_corridors':
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>`;
    case 'dams':
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`;
    case 'power_plants':
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;
    case 'economic_zones':
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;
    case 'urban_centres':
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`;
    default:
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>`;
  }
}

function getCategoryBadgeMeta(category: string): { label: string; emoji: string } {
  switch (category) {
    case 'railways':
      return { label: 'INDIAN RAILWAYS', emoji: '🚆' };
    case 'airports':
      return { label: 'AIRPORT HUB', emoji: '✈️' };
    case 'seaports':
      return { label: 'MAJOR PORT', emoji: '⚓' };
    case 'industrial_corridors':
      return { label: 'CORRIDOR', emoji: '🏭' };
    case 'dams':
      return { label: 'MAJOR DAM', emoji: '💧' };
    case 'power_plants':
      return { label: 'MEGA POWER', emoji: '⚡' };
    case 'economic_zones':
      return { label: 'SEZ TECH HUB', emoji: '🏢' };
    case 'urban_centres':
      return { label: 'METRO CITY', emoji: '🏙️' };
    default:
      return { label: 'HIGHWAY', emoji: '🛣️' };
  }
}

// Dynamic zoom-responsive scaling curve:
// Zoom out (<= 4.5): small & compact (0.65) so it never covers states
// Zoom mid (7.0): legible peak size (0.80)
// Zoom in (> 7.0 to 16.0): progressively shrinks (0.80 down to 0.32) so ground features/terrain are completely unblocked
function computeMarkerZoomScale(zoom: number): number {
  if (zoom <= 4.5) {
    return 0.65;
  } else if (zoom <= 7.0) {
    return 0.65 + ((zoom - 4.5) / 2.5) * 0.15;
  } else {
    const progress = Math.min(1, Math.max(0, (zoom - 7.0) / 9.0));
    return 0.80 - progress * 0.48;
  }
}

// Extracts a concise, high-impact 1-liner metric (never long summary paragraphs!)
function getCompactInfrastructureMetric(p: any): string | undefined {
  if (!p) return undefined;
  // Mega Power Plants
  if (p.capacity_mw || p.installed_capacity_mw) {
    const val = (p.capacity_mw || p.installed_capacity_mw).toLocaleString();
    return `${val} MW${p.power_type ? ` · ${p.power_type}` : ''}`;
  }
  // Major Hub Airports
  if (p.passengers_mppa) {
    return `${p.passengers_mppa} MPPA${p.iata_code ? ` · ${p.iata_code}` : ''}`;
  }
  if (p.iata_code && !p.passengers_mppa) {
    return `IATA: ${p.iata_code}`;
  }
  // Major Seaports
  if (p.cargo_mmt) {
    return `${p.cargo_mmt} MMT/yr Cargo`;
  }
  // Railways Hubs & Junctions
  if (p.platforms) {
    return `${p.platforms} Platforms${p.daily_passengers ? ` · ${p.daily_passengers}` : ''}`;
  }
  // Multipurpose Dams
  if (p.height_m) {
    return `Height: ${p.height_m}m${p.reservoir_capacity_bcm ? ` · ${p.reservoir_capacity_bcm} BCM` : ''}`;
  }
  // Corridors & Expressways
  if (p.length_km) {
    return `${p.length_km.toLocaleString()} km${p.lanes ? ` · ${p.lanes} Lanes` : ' Corridor'}`;
  }
  // Metropolitan Urban Centres
  if (p.population_metro) {
    return `Metro Pop: ${p.population_metro}`;
  }
  // Special Economic Zones
  if (p.area_acres) {
    return `${p.area_acres.toLocaleString()} Acres${p.specialization ? ` · ${p.specialization}` : ''}`;
  }
  if (p.specialization && p.specialization.length <= 30) {
    return p.specialization;
  }
  if (p.route_type && p.route_type.length <= 30) {
    return p.route_type;
  }
  if (p.sub_type && p.sub_type.length <= 30) {
    return p.sub_type;
  }
  return undefined;
}

function createInfrastructureMarkerElement(opts: {
  name: string;
  category: string;
  subType?: string;
  metricText?: string;
  color?: string;
  initialZoom?: number;
}): HTMLElement {
  const color = opts.color || '#38bdf8';
  const badgeMeta = getCategoryBadgeMeta(opts.category);
  const svgIcon = getCategorySvgIcon(opts.category);
  const initialScale = computeMarkerZoomScale(opts.initialZoom ?? 7.2);

  const container = document.createElement('div');
  container.className = 'infra-exact-marker-root flex flex-col items-center select-none pointer-events-none';
  container.style.cssText = 'position: relative; display: flex; flex-direction: column; align-items: center; pointer-events: none; z-index: 1000;';

  container.innerHTML = `
    <!-- Zoom Scaler Wrapper -->
    <div class="infra-marker-zoom-scaler" style="
      transform-origin: bottom center;
      transform: scale(${initialScale.toFixed(3)});
      transition: transform 0.08s cubic-bezier(0.2, 0, 0, 1);
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: none;
    ">
      <!-- Floating Compact Billboard Card -->
      <div class="infra-marker-billboard" style="
        background: rgba(6, 10, 18, 0.94);
        border: 1px solid ${color}80;
        box-shadow: 0 0 14px ${color}40, 0 6px 20px rgba(0,0,0,0.85);
        border-radius: 8px;
        padding: 3.5px 7px 4.5px 7px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 5px;
        min-width: 90px;
        max-width: 170px;
        position: relative;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        pointer-events: none;
      ">
        <!-- Category Badge Pill -->
        <div style="
          background: ${color}20;
          color: ${color};
          border: 1px solid ${color}55;
          font-family: monospace;
          font-size: 7.5px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 1px 5px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 3px;
          margin-bottom: 2px;
          white-space: nowrap;
        ">
          <span style="font-size: 8.5px; line-height: 1;">${badgeMeta.emoji}</span>
          <span>${badgeMeta.label}</span>
        </div>

        <!-- Asset Name -->
        <div style="
          color: #ffffff;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 10.5px;
          font-weight: 800;
          line-height: 1.2;
          text-align: center;
          letter-spacing: -0.01em;
          margin-bottom: 1.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.9);
        ">
          ${opts.name}
        </div>

        <!-- Key Metric (Clean 1-liner) -->
        ${opts.metricText ? `
          <div class="infra-marker-metric" style="
            color: #cbd5e1;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 8.5px;
            font-weight: 600;
            text-align: center;
            line-height: 1.15;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 155px;
          ">
            ${opts.metricText}
          </div>
        ` : ''}

        <!-- Bottom Triangle Pointer -->
        <div style="
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 7px;
          height: 7px;
          background: rgba(6, 10, 18, 0.95);
          border-right: 1px solid ${color}80;
          border-bottom: 1px solid ${color}80;
        "></div>
      </div>

      <!-- The 3D Ground Pin Beacon -->
      <div class="infra-marker-beacon" style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <!-- Outer pulsing animated radar ring -->
        <div style="
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${color}25;
          border: 1.5px solid ${color};
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>

        <!-- Concentric secondary glow ring -->
        <div style="
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          box-shadow: 0 0 12px ${color}, inset 0 0 7px ${color}80;
        "></div>

        <!-- Glossy 3D Teardrop Pin Body with Detailed Logo -->
        <div style="
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, ${color}, #050912 85%);
          border: 2px solid #ffffff;
          box-shadow: 0 3px 9px rgba(0,0,0,0.9), 0 0 14px ${color}80;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
        ">
          ${svgIcon}
        </div>

        <!-- Ground Needle Anchor -->
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 2.5px;
          height: 6px;
          background: #ffffff;
          border-radius: 0 0 1.5px 1.5px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.8);
          z-index: 9;
        "></div>
      </div>
    </div>
  `;

  return container;
}

function applyMarkerScaleToElement(map: Map) {
  const marker = (map as any)._activeInfraMarker;
  if (!marker) return;
  const el = marker.getElement();
  if (!el) return;
  const scaler = el.querySelector('.infra-marker-zoom-scaler') as HTMLElement | null;
  if (!scaler) return;
  const z = map.getZoom();
  const scale = computeMarkerZoomScale(z);
  scaler.style.transform = `scale(${scale.toFixed(3)})`;
  const metricEl = el.querySelector('.infra-marker-metric') as HTMLElement | null;
  if (metricEl) {
    if (z >= 11) {
      metricEl.style.display = 'none';
    } else {
      metricEl.style.display = 'block';
    }
  }
}

function clearSearchHighlight(map: Map) {
  if ((map as any)._activeInfraMarker) {
    try {
      (map as any)._activeInfraMarker.remove();
    } catch {}
    (map as any)._activeInfraMarker = null;
  }
  if (map.getLayer('states-highlight')) map.setFilter('states-highlight', ['==', 'shapeName', '']);
  if (map.getLayer('states-highlight-fill')) map.setFilter('states-highlight-fill', ['==', 'shapeName', '']);
  if (map.getLayer('districts-highlight-line')) map.setFilter('districts-highlight-line', ['==', 'shapeName', '']);
  if (map.getLayer('districts-highlight-fill')) map.setFilter('districts-highlight-fill', ['==', 'shapeName', '']);
  if (map.getLayer('rivers-highlight')) map.setFilter('rivers-highlight', ['==', 'clean_name', '']);
  if (map.getLayer('mountains-highlight')) map.setFilter('mountains-highlight', ['==', 'name', '']);
  if (map.getLayer('roads-highlight')) map.setFilter('roads-highlight', ['==', 'code', '']);
  const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
  if (src && typeof src.setData === 'function') src.setData({ type: 'FeatureCollection', features: [] });
}

// Generate geodesic circular polygon for earthquake rupture and shockwave zones
function createGeodesicCircle(centerLng: number, centerLat: number, radiusKm: number, numPoints = 64) {
  const coords: [number, number][] = [];
  const kmToRad = radiusKm / 6371.0;
  const centerLatRad = (centerLat * Math.PI) / 180.0;
  const centerLngRad = (centerLng * Math.PI) / 180.0;

  for (let i = 0; i <= numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints;
    const latRad = Math.asin(
      Math.sin(centerLatRad) * Math.cos(kmToRad) +
      Math.cos(centerLatRad) * Math.sin(kmToRad) * Math.cos(angle)
    );
    const lngRad = centerLngRad + Math.atan2(
      Math.sin(angle) * Math.sin(kmToRad) * Math.cos(centerLatRad),
      Math.cos(kmToRad) - Math.sin(centerLatRad) * Math.sin(latRad)
    );
    coords.push([(lngRad * 180.0) / Math.PI, (latRad * 180.0) / Math.PI]);
  }
  return {
    type: 'Polygon' as const,
    coordinates: [coords]
  };
}

// Generate perpendicular polygon swath along cyclone tracks for wind impact zones
function createLineCorridor(coordinates: [number, number][], offsetKm = 45) {
  if (!coordinates || coordinates.length < 2) return null;
  const leftSide: [number, number][] = [];
  const rightSide: [number, number][] = [];

  for (let i = 0; i < coordinates.length; i++) {
    const p = coordinates[i];
    const prev = coordinates[Math.max(0, i - 1)];
    const next = coordinates[Math.min(coordinates.length - 1, i + 1)];

    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1e-6;

    const nx = -dy / len;
    const ny = dx / len;

    const latRad = (p[1] * Math.PI) / 180.0;
    const degLat = offsetKm / 111.0;
    const degLng = offsetKm / (111.0 * Math.max(0.1, Math.cos(latRad)));

    leftSide.push([p[0] + nx * degLng, p[1] + ny * degLat]);
    rightSide.unshift([p[0] - nx * degLng, p[1] - ny * degLat]);
  }

  const ring = [...leftSide, ...rightSide, leftSide[0]];
  return {
    type: 'Polygon' as const,
    coordinates: [ring]
  };
}

// Generate rich marked highlighted features for any disaster event
function createDisasterImpactFeatures(match: any, target: { name?: string; key?: string; lng?: number; lat?: number }) {
  const features: any[] = [];
  let centerLng = target.lng;
  let centerLat = target.lat;

  if (centerLng === undefined || centerLat === undefined) {
    if (match?.geometry?.type === 'Point' && Array.isArray(match.geometry.coordinates)) {
      centerLng = match.geometry.coordinates[0];
      centerLat = match.geometry.coordinates[1];
    } else if (match?.geometry?.coordinates && Array.isArray(match.geometry.coordinates)) {
      const flat = match.geometry.coordinates.flat(Infinity);
      if (flat.length >= 2) {
        centerLng = flat[0];
        centerLat = flat[1];
      }
    }
  }

  if (centerLng === undefined) centerLng = 78.9629;
  if (centerLat === undefined) centerLat = 20.5937;

  const hazardType = match?.properties?.hazard_type || target.key || '';
  const name = match?.properties?.name || target.name || 'Disaster Event';
  const year = match?.properties?.year;
  const labelPrefix = year ? `${year} ` : '';

  // 1. EARTHQUAKE: Shockwave impact circle + Outer isoseismal buffer + Epicenter beacon
  if (hazardType === 'earthquake' || (!hazardType && (name.toLowerCase().includes('earthquake') || match?.properties?.magnitude_mw))) {
    const mw = match?.properties?.magnitude_mw || match?.properties?.magnitude || 7.5;
    let radiusKm = 65;
    if (mw >= 8.5) radiusKm = 140;
    else if (mw >= 8.0) radiusKm = 110;
    else if (mw >= 7.5) radiusKm = 85;
    else if (mw >= 7.0) radiusKm = 65;
    else if (mw >= 6.0) radiusKm = 45;
    else radiusKm = 30;

    const ruptureCircle = createGeodesicCircle(centerLng, centerLat, radiusKm, 64);
    features.push({
      type: 'Feature',
      geometry: ruptureCircle,
      properties: {
        id: (match?.id || 'eq') + '_rupture',
        name: `${name} - Severe Ground Motion Rupture Zone`,
        color: '#ef4444',
        border_color: '#ffffff',
        fill_opacity: 0.42,
        stroke_width: 3.5
      }
    });

    const shockwaveCircle = createGeodesicCircle(centerLng, centerLat, radiusKm * 1.7, 64);
    features.push({
      type: 'Feature',
      geometry: shockwaveCircle,
      properties: {
        id: (match?.id || 'eq') + '_shockwave',
        name: `${name} - High Intensity Isoseismal Buffer`,
        color: '#ef4444',
        border_color: '#f97316',
        fill_opacity: 0.12,
        stroke_width: 2.0
      }
    });

    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [centerLng, centerLat] },
      properties: {
        id: (match?.id || 'eq') + '_beacon',
        name: name,
        label_text: `🚨 ${labelPrefix}${name} • Mw ${mw}`,
        color: '#ef4444',
        pulse_color: 'rgba(239, 68, 68, 0.45)'
      }
    });
  }
  // 2. CYCLONE: Wind impact corridor + Track line + Landfall beacon
  else if (hazardType === 'cyclone' || name.toLowerCase().includes('cyclone')) {
    if (match?.geometry?.type === 'LineString') {
      const lineCoords = match.geometry.coordinates as [number, number][];
      const swath = createLineCorridor(lineCoords, 45);
      if (swath) {
        features.push({
          type: 'Feature',
          geometry: swath,
          properties: {
            id: (match?.id || 'cyc') + '_swath',
            name: `${name} - Gale-Force Wind Impact Swath (IMD)`,
            color: '#c026d3',
            border_color: '#f0abfc',
            fill_opacity: 0.38,
            stroke_width: 3.0
          }
        });
      }
      features.push({
        type: 'Feature',
        geometry: match.geometry,
        properties: {
          id: (match?.id || 'cyc') + '_track',
          name: name,
          color: '#f0abfc',
          border_color: '#c026d3'
        }
      });
      const landfallPt = lineCoords[lineCoords.length - 1] || [centerLng, centerLat];
      const speed = match.properties?.wind_speed_kmh ? `${match.properties.wind_speed_kmh} km/h` : (match.properties?.cyclone_category || 'Landfall');
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: landfallPt },
        properties: {
          id: (match?.id || 'cyc') + '_landfall',
          name: name,
          label_text: `🌀 ${labelPrefix}${name} • ${speed}`,
          color: '#c026d3',
          pulse_color: 'rgba(192, 38, 211, 0.45)'
        }
      });
    } else {
      const landfallCircle = createGeodesicCircle(centerLng, centerLat, 55, 64);
      features.push({
        type: 'Feature',
        geometry: landfallCircle,
        properties: {
          id: (match?.id || 'cyc') + '_swath',
          name: `${name} Landfall Impact Zone`,
          color: '#c026d3',
          border_color: '#ffffff',
          fill_opacity: 0.4,
          stroke_width: 3.0
        }
      });
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [centerLng, centerLat] },
        properties: {
          id: (match?.id || 'cyc') + '_beacon',
          name: name,
          label_text: `🌀 ${labelPrefix}${name}`,
          color: '#c026d3',
          pulse_color: 'rgba(192, 38, 211, 0.45)'
        }
      });
    }
  }
  // 3. FLOOD: Catchment basin polygon + Focal breach beacon
  else if (hazardType === 'flood' || name.toLowerCase().includes('flood') || name.toLowerCase().includes('deluge')) {
    if (match?.geometry && (match.geometry.type === 'Polygon' || match.geometry.type === 'MultiPolygon')) {
      features.push({
        type: 'Feature',
        geometry: match.geometry,
        properties: {
          id: (match?.id || 'fld') + '_basin',
          name: `${name} Inundated Catchment Basin`,
          color: '#0284c7',
          border_color: '#38bdf8',
          fill_opacity: 0.45,
          stroke_width: 3.5
        }
      });
    } else {
      const floodCircle = createGeodesicCircle(centerLng, centerLat, 45, 64);
      features.push({
        type: 'Feature',
        geometry: floodCircle,
        properties: {
          id: (match?.id || 'fld') + '_basin',
          name: `${name} Inundation Basin`,
          color: '#0284c7',
          border_color: '#ffffff',
          fill_opacity: 0.45,
          stroke_width: 3.5
        }
      });
    }
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [centerLng, centerLat] },
      properties: {
        id: (match?.id || 'fld') + '_beacon',
        name: name,
        label_text: `🌊 ${labelPrefix}${name}`,
        color: '#0284c7',
        pulse_color: 'rgba(2, 132, 199, 0.45)'
      }
    });
  }
  // 4. LANDSLIDE: Debris flow chute + Escarpment beacon
  else if (hazardType === 'landslide' || name.toLowerCase().includes('landslide') || name.toLowerCase().includes('glof')) {
    if (match?.geometry && (match.geometry.type === 'Polygon' || match.geometry.type === 'MultiPolygon')) {
      features.push({
        type: 'Feature',
        geometry: match.geometry,
        properties: {
          id: (match?.id || 'ls') + '_zone',
          name: `${name} Debris Flow / Landslide Chute`,
          color: '#ea580c',
          border_color: '#fdba74',
          fill_opacity: 0.48,
          stroke_width: 3.5
        }
      });
    } else {
      const lsCircle = createGeodesicCircle(centerLng, centerLat, 30, 64);
      features.push({
        type: 'Feature',
        geometry: lsCircle,
        properties: {
          id: (match?.id || 'ls') + '_zone',
          name: `${name} Debris Flow Corridor`,
          color: '#ea580c',
          border_color: '#ffffff',
          fill_opacity: 0.48,
          stroke_width: 3.5
        }
      });
    }
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [centerLng, centerLat] },
      properties: {
        id: (match?.id || 'ls') + '_beacon',
        name: name,
        label_text: `⛰️ ${labelPrefix}${name}`,
        color: '#ea580c',
        pulse_color: 'rgba(234, 88, 12, 0.45)'
      }
    });
  }
  // 5. TSUNAMI: Coastal runup buffer + Shoreline beacon
  else if (hazardType === 'tsunami' || name.toLowerCase().includes('tsunami')) {
    if (match?.geometry && (match.geometry.type === 'Polygon' || match.geometry.type === 'MultiPolygon')) {
      features.push({
        type: 'Feature',
        geometry: match.geometry,
        properties: {
          id: (match?.id || 'tsu') + '_buffer',
          name: `${name} Coastal Inundation Strip`,
          color: '#06b6d4',
          border_color: '#67e8f9',
          fill_opacity: 0.45,
          stroke_width: 3.5
        }
      });
    } else {
      const tsuCircle = createGeodesicCircle(centerLng, centerLat, 50, 64);
      features.push({
        type: 'Feature',
        geometry: tsuCircle,
        properties: {
          id: (match?.id || 'tsu') + '_buffer',
          name: `${name} Tsunami Inundation Buffer`,
          color: '#06b6d4',
          border_color: '#ffffff',
          fill_opacity: 0.45,
          stroke_width: 3.5
        }
      });
    }
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [centerLng, centerLat] },
      properties: {
        id: (match?.id || 'tsu') + '_beacon',
        name: name,
        label_text: `🚨 ${labelPrefix}${name}`,
        color: '#06b6d4',
        pulse_color: 'rgba(6, 182, 212, 0.45)'
      }
    });
  }
  // 6. OTHER (HEATWAVE / DROUGHT)
  else {
    const defaultColor = hazardType === 'heatwave' ? '#e11d48' : hazardType === 'drought' ? '#b45309' : '#f59e0b';
    if (match?.geometry && (match.geometry.type === 'Polygon' || match.geometry.type === 'MultiPolygon')) {
      features.push({
        type: 'Feature',
        geometry: match.geometry,
        properties: {
          id: (match?.id || 'haz') + '_poly',
          name: name,
          color: defaultColor,
          border_color: '#ffffff',
          fill_opacity: 0.45,
          stroke_width: 3.0
        }
      });
    } else if (match?.geometry) {
      features.push({
        type: 'Feature',
        geometry: match.geometry,
        properties: {
          id: (match?.id || 'haz') + '_geom',
          name: name,
          color: defaultColor,
          border_color: '#ffffff'
        }
      });
    }
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [centerLng, centerLat] },
      properties: {
        id: (match?.id || 'haz') + '_beacon',
        name: name,
        label_text: `${labelPrefix}${name}`,
        color: defaultColor,
        pulse_color: defaultColor + '66'
      }
    });
  }

  return features;
}

function applySearchHighlight(map: Map, target: SearchTarget | null) {
  clearSearchHighlight(map);
  if (!target || !target.type || !map) return;

  const setPoint = () => {
    if (target.lng === undefined || target.lat === undefined) return;
    const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
    if (src) {
      src.setData({
        type: 'FeatureCollection',
        features: [
          { type: 'Feature', geometry: { type: 'Point', coordinates: [target.lng, target.lat] }, properties: {} }
        ]
      });
    }
  };

  switch (target.type) {
    case 'state':
      if (target.key) {
        if (map.getLayer('states-highlight')) map.setFilter('states-highlight', ['==', 'shapeName', target.key]);
        if (map.getLayer('states-highlight-fill')) map.setFilter('states-highlight-fill', ['==', 'shapeName', target.key]);
      }
      break;
    case 'district':
      if (target.key) {
        if (map.getLayer('districts-highlight-line')) map.setFilter('districts-highlight-line', ['==', 'shapeName', target.key]);
        if (map.getLayer('districts-highlight-fill')) map.setFilter('districts-highlight-fill', ['==', 'shapeName', target.key]);
      }
      break;
    case 'river':
      if (target.key && map.getLayer('rivers-highlight')) map.setFilter('rivers-highlight', ['==', 'clean_name', target.key]);
      break;
    case 'mountain':
      if (target.key && map.getLayer('mountains-highlight')) map.setFilter('mountains-highlight', ['==', 'name', target.key]);
      break;
    case 'highway':
      if (target.key && map.getLayer('roads-highlight')) map.setFilter('roads-highlight', ['==', 'code', target.key]);
      break;
    case 'city':
    case 'peak':
    case 'archaeological_site':
      setPoint();
      break;
    case 'environmental_change':
    case 'glacier':
    case 'wetland': {
      const keyOrName = target.key || target.name || '';
      let match = target.key ? ENVIRONMENTAL_FEATURES_BY_ID[target.key] : undefined;
      if (!match && keyOrName) {
        match = ENVIRONMENTAL_FEATURES_BY_ID[keyOrName];
      }
      if (!match && target.name) {
        const tName = target.name.toLowerCase();
        match = ENVIRONMENTAL_FEATURES.find(f => {
          const fName = (f.properties?.name || '').toLowerCase();
          return fName.includes(tName) || tName.includes(fName);
        });
      }
      if (!match && target.name) {
        const tTokens = target.name.toLowerCase().split(/[\s&,/()-]+/).filter(w => w.length >= 4);
        if (tTokens.length > 0) {
          match = ENVIRONMENTAL_FEATURES.find(f => {
            const fName = (f.properties?.name || '').toLowerCase();
            return tTokens.some(w => fName.includes(w));
          });
        }
      }

      const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
      if (match) {
        if (src) {
          src.setData({
            type: 'FeatureCollection',
            features: [match]
          });
        }
        const featId = match.properties?.id || match.id || keyOrName;
        const envFilter: any = [
          'any',
          ['==', ['get', 'id'], featId],
          ['==', ['id'], featId],
          ['==', ['get', 'name'], match.properties?.name || target.name || featId]
        ];
        ['env-highlight-fill', 'env-highlight-border', 'env-highlight-line', 'env-highlight-point'].forEach(id => {
          if (map.getLayer(id)) {
            map.setLayoutProperty(id, 'visibility', 'visible');
            map.setFilter(id, envFilter);
          }
        });
      } else {
        try {
          let feats = map.querySourceFeatures('environmental-change', {
            filter: [
              'any',
              ['==', ['get', 'id'], keyOrName],
              ['==', ['id'], keyOrName],
              ['==', ['get', 'name'], target.name || keyOrName]
            ]
          });
          if (feats.length === 0 && target.key) {
            feats = map.querySourceFeatures('environmental-change', {
              filter: [
                'any',
                ['==', ['get', 'id'], target.key],
                ['==', ['id'], target.key]
              ]
            });
          }
          if (feats.length > 0 && src) {
            src.setData({
              type: 'FeatureCollection',
              features: feats.map((f) => ({ type: 'Feature', geometry: f.geometry, properties: f.properties }))
            });
          } else {
            setPoint();
          }
        } catch {
          setPoint();
        }
      }
      break;
    }
    case 'disaster_hazard':
    case 'seismic_zone':
    case 'earthquake_epicenter':
    case 'cyclone_track':
    case 'flood_zone':
    case 'landslide_zone':
    case 'drought_zone':
    case 'tsunami_zone':
    case 'heatwave_zone':
    case 'cyclone':
    case 'flood':
    case 'landslide':
    case 'drought':
    case 'tsunami':
    case 'heatwave':
    case 'earthquake': {
      const keyOrName = target.key || target.name || '';
      let match = target.key ? DISASTER_HAZARDS_BY_ID[target.key] : undefined;
      if (!match && keyOrName) {
        match = DISASTER_HAZARDS_BY_ID[keyOrName];
      }
      if (!match && target.name) {
        const tName = target.name.toLowerCase();
        match = DISASTER_GEOJSON.features.find((f: any) => {
          const fName = (f.properties?.name || '').toLowerCase();
          return fName.includes(tName) || tName.includes(fName);
        });
      }
      const impactFeatures = createDisasterImpactFeatures(match, target);
      const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
      if (src && impactFeatures.length > 0) {
        src.setData({
          type: 'FeatureCollection',
          features: impactFeatures
        });
      } else {
        setPoint();
      }
      break;
    }
    case 'infrastructure_item':
    case 'infrastructure_highway':
    case 'infrastructure_railway':
    case 'infrastructure_airport':
    case 'infrastructure_seaport':
    case 'infrastructure_corridor':
    case 'infrastructure_dam':
    case 'infrastructure_power':
    case 'infrastructure_sez':
    case 'infrastructure_urban': {
      const keyOrName = target.key || target.name || '';
      let match = target.key ? INFRASTRUCTURE_BY_ID[target.key] : undefined;
      if (!match && keyOrName) {
        match = INFRASTRUCTURE_BY_ID[keyOrName];
      }
      if (!match && target.name) {
        const tName = target.name.toLowerCase();
        match = INFRASTRUCTURE_GEOJSON.features.find((f: any) => {
          const fName = (f.properties?.name || '').toLowerCase();
          return fName.includes(tName) || tName.includes(fName);
        });
      }

      const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
      if (match) {
        const p = match.properties;
        const color = p.color || '#38bdf8';
        const hlFeatures: any[] = [];
        let anchorCoords: [number, number] | undefined = p.coordinates;

        if (match.geometry.type === 'Point') {
          const pt = match.geometry.coordinates as [number, number];
          anchorCoords = anchorCoords || pt;
          const haloCircle = createGeodesicCircle(pt[0], pt[1], 15, 64);
          hlFeatures.push({
            type: 'Feature',
            geometry: haloCircle,
            properties: {
              id: (match.id || 'infra') + '_halo',
              name: p.name,
              color: color,
              border_color: '#ffffff',
              fill_opacity: 0.35,
              stroke_width: 2.5
            }
          });
        } else if (match.geometry.type === 'LineString') {
          const pts = match.geometry.coordinates as [number, number][];
          if (!anchorCoords && pts.length > 0) {
            anchorCoords = pts[Math.floor(pts.length / 2)];
          }
          hlFeatures.push({
            type: 'Feature',
            geometry: match.geometry,
            properties: {
              id: (match.id || 'infra') + '_line',
              name: p.name,
              color: color,
              border_color: '#ffffff',
              fill_opacity: 0.8,
              stroke_width: 5.5
            }
          });
        }

        if (src) {
          src.setData({
            type: 'FeatureCollection',
            features: hlFeatures
          });
        }

        if (anchorCoords) {
          if ((map as any)._activeInfraMarker) {
            try { (map as any)._activeInfraMarker.remove(); } catch {}
            (map as any)._activeInfraMarker = null;
          }
          try {
            const markerEl = createInfrastructureMarkerElement({
              name: p.name,
              category: p.category || 'railways',
              subType: p.sub_type,
              metricText: getCompactInfrastructureMetric(p),
              color: color,
              initialZoom: map.getZoom()
            });
            const marker = new Marker({ element: markerEl, anchor: 'bottom' })
              .setLngLat(anchorCoords)
              .addTo(map);
            (map as any)._activeInfraMarker = marker;
            applyMarkerScaleToElement(map);
          } catch (e) {
            console.warn('Marker placement error in applySearchHighlight:', e);
          }
        }
      } else {
        setPoint();
      }
      break;
    }
    default: {
      const cfg = SEARCH_HIGHLIGHT_SOURCE[target.type];
      if (cfg && target.key) {
        try {
          const feats = map.querySourceFeatures(cfg.source, { filter: ['==', cfg.field, target.key] });
          if (feats.length > 0) {
            const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
            if (src) {
              src.setData({
                type: 'FeatureCollection',
                features: feats.map((f) => ({ type: 'Feature', geometry: f.geometry, properties: f.properties }))
              });
            }
          }
        } catch {
          // ignore lookup errors
        }
      } else {
        setPoint();
      }
      break;
    }
  }
}

// Calculate squared distance from point (px, py) to line segment (vx, vy)-(wx, wy) in screen space
function distToSegmentSquared(px: number, py: number, vx: number, vy: number, wx: number, wy: number): number {
  const l2 = (vx - wx) * (vx - wx) + (vy - wy) * (vy - wy);
  if (l2 === 0) return (px - vx) * (px - vx) + (py - wy) * (py - wy);
  let t = ((px - vx) * (wx - vx) + (py - vy) * (wy - wy)) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = vx + t * (wx - vx);
  const projY = vy + t * (wy - vy);
  return (px - projX) * (px - projX) + (py - projY) * (py - projY);
}

// Sort candidate features by screen proximity to the touch tap point
function sortFeaturesByProximity(
  features: MapGeoJSONFeature[],
  tapPoint: { x: number; y: number },
  map: Map
): MapGeoJSONFeature[] {
  if (features.length <= 1) return features;

  const scored = features.map((feat) => {
    let minDistSq = Infinity;
    const geom = feat.geometry;

    if (!geom) return { feat, dist: Infinity };

    if (geom.type === 'Point') {
      const screenPt = map.project(geom.coordinates as [number, number]);
      minDistSq = (tapPoint.x - screenPt.x) ** 2 + (tapPoint.y - screenPt.y) ** 2;
    } else if (geom.type === 'LineString') {
      const coords = geom.coordinates as [number, number][];
      for (let i = 0; i < coords.length - 1; i++) {
        const p1 = map.project(coords[i]);
        const p2 = map.project(coords[i + 1]);
        const d = distToSegmentSquared(tapPoint.x, tapPoint.y, p1.x, p1.y, p2.x, p2.y);
        if (d < minDistSq) minDistSq = d;
      }
    } else if (geom.type === 'MultiLineString') {
      const lines = geom.coordinates as [number, number][][];
      for (const line of lines) {
        for (let i = 0; i < line.length - 1; i++) {
          const p1 = map.project(line[i]);
          const p2 = map.project(line[i + 1]);
          const d = distToSegmentSquared(tapPoint.x, tapPoint.y, p1.x, p1.y, p2.x, p2.y);
          if (d < minDistSq) minDistSq = d;
        }
      }
    } else {
      minDistSq = 100;
    }

    return { feat, dist: minDistSq };
  });

  scored.sort((a, b) => a.dist - b.dist);
  return scored.map((s) => s.feat);
}

interface MapEngineProps {
  activeLayers: Set<ActiveLayer>;
  religionFilter: ReligionFilter;
  basemapStyle: BasemapStyle;
  is3D: boolean;
  terrainExaggeration: number;
  demographicsData: Record<string, DemographicRecord>;
  onSelectFeature: (info: SelectedFeatureInfo | null) => void;
  selectedFeature: SelectedFeatureInfo | null;
  searchTarget: SearchTarget | null;
  isElevationHighlight: boolean;
  selectedHistoricalPeriod?: HistoricalPeriodId;
  tradeCategories?: Set<TradeCategory>;
  environmentalPillars?: Set<EnvironmentalPillar>;
  comparisonConfig?: EnvironmentalComparisonConfig;
  disasterHazardTypes?: Set<DisasterHazardType>;
  disasterRegionFilter?: DisasterRegion;
  selectedDisasterEventId?: string | null;
  infrastructureCategories?: Set<InfrastructureCategory>;
  selectedInfrastructureId?: string | null;
}

export const MapEngine: React.FC<MapEngineProps> = ({
  activeLayers,
  religionFilter,
  basemapStyle,
  is3D,
  terrainExaggeration,
  demographicsData,
  onSelectFeature,
  selectedFeature,
  searchTarget,
  isElevationHighlight,
  selectedHistoricalPeriod = 'maurya',
  tradeCategories,
  environmentalPillars,
  comparisonConfig,
  disasterHazardTypes,
  disasterRegionFilter = 'all',
  selectedDisasterEventId = null,
  infrastructureCategories,
  selectedInfrastructureId = null
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const activeMarkerRef = useRef<Marker | null>(null);
  const flowIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastHoverTsRef = useRef<number>(0);
  const lastHoverKeyRef = useRef<string>('');
  const hoverSupportedRef = useRef<boolean>(
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
  const [hoveredTooltip, setHoveredTooltip] = useState<{
    x: number;
    y: number;
    title: string;
    type: string;
    subtitle?: string;
    metricLabel?: string;
    metricValue?: string;
    source?: string;
  } | null>(null);

  // Basemap tiles generator
  const getBasemapTiles = (style: BasemapStyle) => {
    return APP_CONFIG.BASEMAPS[style] || APP_CONFIG.BASEMAPS.dark;
  };

  // Centralized, instant-response layer styling application
  const applyLayerStyles = useCallback((map: Map) => {
    if (!map) return;

    const setVis = (layerId: string, visible: boolean) => {
      try {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
        }
      } catch (err) {
        console.warn(`Layer visibility warning on ${layerId}:`, err);
      }
    };

    const isSoilActive = activeLayers.has('soils');
    const isDensityActive = activeLayers.has('pop_density');
    const isPopTotalActive = activeLayers.has('pop_total');
    const isReligionActive = activeLayers.has('religion');
    const isLiteracyActive = activeLayers.has('literacy');
    const isSexRatioActive = activeLayers.has('sex_ratio');

    const hasDemographicLayer = isDensityActive || isPopTotalActive || isReligionActive || isLiteracyActive || isSexRatioActive;
    const showDistricts = (activeLayers.has('political_districts') || hasDemographicLayer) && !isSoilActive;

    // 1. Soils Layer
    setVis('soils-fill', isSoilActive);

    // 2. State & District Fills
    setVis('states-fill', activeLayers.has('political_states') && !showDistricts && !isSoilActive);
    setVis('districts-fill', showDistricts);
    setVis('districts-line', activeLayers.has('political_districts') || hasDemographicLayer || isSoilActive);

    // 3. State Boundaries & Dedicated State Name Labels
    setVis('states-line', activeLayers.has('political_states'));
    setVis('states-glow', activeLayers.has('political_states'));
    setVis('states-label', activeLayers.has('state_labels'));

    // Urban Night Light Nodes (Only shown during demographic exploration to prevent map clutter)
    const showUrbanNodes = isDensityActive || isPopTotalActive;
    setVis('urban-nodes-glow', showUrbanNodes);
    setVis('urban-nodes-halo', showUrbanNodes);
    setVis('urban-nodes-core', showUrbanNodes);

    // 4. Physical Overlays
    setVis('rivers-core', activeLayers.has('rivers'));
    setVis('rivers-glow', activeLayers.has('rivers'));
    setVis('rivers-flow', activeLayers.has('rivers'));
    setVis('rivers-hit-target', activeLayers.has('rivers'));
    setVis('rivers-highlight', true);
    setVis('mountains-line', activeLayers.has('mountains'));
    setVis('mountains-glow', activeLayers.has('mountains'));
    setVis('mountains-hit-target', activeLayers.has('mountains'));
    setVis('mountains-highlight', true);

    // 5. Historical Atlas & Time Machine Layers
    const isHistoricalActive = activeLayers.has('historical_atlas');
    setVis('empires-fill', isHistoricalActive);
    setVis('empires-glow', isHistoricalActive);
    setVis('empires-border', isHistoricalActive);
    setVis('empires-capitals', isHistoricalActive);

    // 6. Archaeological Sites
    const isArchActive = activeLayers.has('archaeological_sites');
    setVis('archaeology-glow', isArchActive);
    setVis('archaeology-core', isArchActive);
    setVis('archaeology-inner-pip', isArchActive);
    setVis('archaeology-labels', isArchActive);

    // 7. Trade Routes & Connectivity
    const isTradeActive = activeLayers.has('trade_routes');
    const hasAnyTradeCategory = !tradeCategories || tradeCategories.size > 0;
    const effectiveTradeActive = isTradeActive && hasAnyTradeCategory;

    const cats = tradeCategories ? Array.from(tradeCategories) : [];
    const catCondition = cats.length > 0 
      ? ['any', ...cats.map(c => ['==', ['get', 'category'], c])]
      : ['==', ['get', 'category'], 'none'];

    if (map.getLayer('trade-glow')) {
      map.setFilter('trade-glow', ['all', ['!=', ['geometry-type'], 'Point'], catCondition] as any);
      map.setLayoutProperty('trade-glow', 'visibility', effectiveTradeActive ? 'visible' : 'none');
    }
    if (map.getLayer('trade-core')) {
      map.setFilter('trade-core', ['all', ['!=', ['geometry-type'], 'Point'], catCondition] as any);
      map.setLayoutProperty('trade-core', 'visibility', effectiveTradeActive ? 'visible' : 'none');
    }
    if (map.getLayer('trade-flow')) {
      map.setFilter('trade-flow', ['all', ['!=', ['geometry-type'], 'Point'], ['!=', ['get', 'category'], 'historical_railway'], catCondition] as any);
      map.setLayoutProperty('trade-flow', 'visibility', effectiveTradeActive ? 'visible' : 'none');
    }
    if (map.getLayer('trade-railways')) {
      const showRailways = effectiveTradeActive && (!tradeCategories || tradeCategories.has('historical_railway'));
      map.setLayoutProperty('trade-railways', 'visibility', showRailways ? 'visible' : 'none');
    }
    if (map.getLayer('trade-labels')) {
      map.setFilter('trade-labels', ['all', ['!=', ['geometry-type'], 'Point'], catCondition] as any);
      map.setLayoutProperty('trade-labels', 'visibility', effectiveTradeActive ? 'visible' : 'none');
    }
    if (map.getLayer('trade-hit-target')) {
      map.setFilter('trade-hit-target', ['all', ['!=', ['geometry-type'], 'Point'], catCondition] as any);
      map.setLayoutProperty('trade-hit-target', 'visibility', effectiveTradeActive ? 'visible' : 'none');
    }

    const showPorts = effectiveTradeActive && (!tradeCategories || tradeCategories.has('ancient_port'));
    setVis('trade-ports-halo', showPorts);
    setVis('trade-ports-core', showPorts);
    setVis('trade-ports-labels', showPorts);
    setVis('trade-ports-hit-target', showPorts);


    // 7.4 Environmental Change & Climate Explorer
    const isEnvActive = activeLayers.has('environmental_change');
    const hasAnyEnvPillar = !environmentalPillars || environmentalPillars.size > 0;
    const effectiveEnvActive = isEnvActive && hasAnyEnvPillar;
    const envPillarsArray = environmentalPillars ? Array.from(environmentalPillars) : [];
    const envPillarCondition = envPillarsArray.length > 0
      ? ['any', ...envPillarsArray.map(p => ['==', ['get', 'pillar'], p])]
      : ['==', ['get', 'pillar'], 'none'];

    const envPolyFilter = ['all', ['==', ['geometry-type'], 'Polygon'], envPillarCondition] as any;
    const envLineFilter = ['all', ['==', ['geometry-type'], 'LineString'], envPillarCondition] as any;
    const envPointFilter = ['all', ['==', ['geometry-type'], 'Point'], envPillarCondition] as any;

    ['env-polygons-glow', 'env-polygons-fill', 'env-polygons-border', 'env-polygons-labels', 'env-polygons-hit-target'].forEach(id => {
      if (map.getLayer(id)) {
        map.setFilter(id, envPolyFilter);
        map.setLayoutProperty(id, 'visibility', effectiveEnvActive ? 'visible' : 'none');
      }
    });

    ['env-lines-glow', 'env-lines-core', 'env-lines-flow', 'env-lines-labels', 'env-lines-hit-target'].forEach(id => {
      if (map.getLayer(id)) {
        map.setFilter(id, envLineFilter);
        map.setLayoutProperty(id, 'visibility', effectiveEnvActive ? 'visible' : 'none');
      }
    });

    ['env-points-halo', 'env-points-core', 'env-points-labels', 'env-points-hit-target'].forEach(id => {
      if (map.getLayer(id)) {
        map.setFilter(id, envPointFilter);
        map.setLayoutProperty(id, 'visibility', effectiveEnvActive ? 'visible' : 'none');
      }
    });

    // Environmental Highlight Layers visibility and filter clearance on untick
    ['env-highlight-fill', 'env-highlight-border', 'env-highlight-line', 'env-highlight-point'].forEach(id => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', effectiveEnvActive ? 'visible' : 'none');
        if (!effectiveEnvActive) {
          map.setFilter(id, ['==', ['id'], '']);
        }
      }
    });

    if (!effectiveEnvActive) {
      const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
      if (src && typeof src.setData === 'function') {
        src.setData({ type: 'FeatureCollection', features: [] });
      }
    }

    // Dynamic Environmental Change Color & Severity Styling based on Delta vs Baseline Mode
    const activeEnvColorExpr = comparisonConfig?.isDeltaMode
      ? [
          'match',
          ['get', 'severity_code'],
          'severe', '#ef4444',
          'high', '#f97316',
          'moderate', '#eab308',
          'stable', '#10b981',
          '#ef4444'
        ] as any
      : [
          'match',
          ['get', 'pillar'],
          'forest_change', '#10b981',
          'glacier_retreat', '#06b6d4',
          'urban_expansion', '#f97316',
          'coastal_erosion', '#ef4444',
          'wetland_change', '#3b82f6',
          'desertification', '#eab308',
          'groundwater_stress', '#a855f7',
          'river_avulsion', '#14b8a6',
          '#10b981'
        ] as any;

    if (map.getLayer('env-polygons-fill')) {
      map.setPaintProperty('env-polygons-fill', 'fill-color', activeEnvColorExpr);
      map.setPaintProperty('env-polygons-fill', 'fill-opacity', comparisonConfig?.isDeltaMode ? 0.55 : 0.40);
    }
    if (map.getLayer('env-polygons-border')) {
      map.setPaintProperty('env-polygons-border', 'line-color', activeEnvColorExpr);
    }
    if (map.getLayer('env-polygons-glow')) {
      map.setPaintProperty('env-polygons-glow', 'line-color', activeEnvColorExpr);
    }
    if (map.getLayer('env-lines-core')) {
      map.setPaintProperty('env-lines-core', 'line-color', activeEnvColorExpr);
    }
    if (map.getLayer('env-lines-glow')) {
      map.setPaintProperty('env-lines-glow', 'line-color', activeEnvColorExpr);
    }
    if (map.getLayer('env-points-core')) {
      map.setPaintProperty('env-points-core', 'circle-color', activeEnvColorExpr);
    }
    if (map.getLayer('env-points-halo')) {
      map.setPaintProperty('env-points-halo', 'circle-color', activeEnvColorExpr);
    }

    // 7.5 Infrastructure & Economic Geography Networks
    const isInfraActive = activeLayers.has('infrastructure_economic');
    const isRoadsActive = (activeLayers.has('roads') || isInfraActive) && (!infrastructureCategories || infrastructureCategories.has('highways'));
    setVis('roads-casing', isRoadsActive);
    setVis('roads-core', isRoadsActive);
    setVis('roads-label', isRoadsActive);
    setVis('roads-hit-target', isRoadsActive);
    setVis('roads-highlight', true);
    if (map.getLayer('roads-highlight')) {
      const isRoadId = selectedInfrastructureId && (selectedInfrastructureId.startsWith('NH-') || selectedInfrastructureId.startsWith('NE-') || selectedInfrastructureId.startsWith('SH-'));
      map.setFilter('roads-highlight', ['==', 'code', isRoadId ? selectedInfrastructureId : '']);
    }

    const isRailwaysActive = isInfraActive && (!infrastructureCategories || infrastructureCategories.has('railways'));
    setVis('infra-railways-glow', isRailwaysActive);
    setVis('infra-railways-casing', isRailwaysActive);
    setVis('infra-railways-core', isRailwaysActive);
    setVis('infra-railways-labels', isRailwaysActive);
    setVis('infra-railways-hit-target', isRailwaysActive);
    setVis('infra-railways-points-halo', isRailwaysActive);
    setVis('infra-railways-points-core', isRailwaysActive);
    setVis('infra-railways-points-labels', isRailwaysActive);
    setVis('infra-railways-points-hit-target', isRailwaysActive);

    const isCorridorsActive = isInfraActive && (!infrastructureCategories || infrastructureCategories.has('industrial_corridors'));
    setVis('infra-corridors-glow', isCorridorsActive);
    setVis('infra-corridors-casing', isCorridorsActive);
    setVis('infra-corridors-core', isCorridorsActive);
    setVis('infra-corridors-labels', isCorridorsActive);
    setVis('infra-corridors-hit-target', isCorridorsActive);

    const isAirportsActive = isInfraActive && (!infrastructureCategories || infrastructureCategories.has('airports'));
    setVis('infra-airports-halo', isAirportsActive);
    setVis('infra-airports-core', isAirportsActive);
    setVis('infra-airports-labels', isAirportsActive);
    setVis('infra-airports-hit-target', isAirportsActive);

    const isSeaportsActive = isInfraActive && (!infrastructureCategories || infrastructureCategories.has('seaports'));
    setVis('infra-seaports-halo', isSeaportsActive);
    setVis('infra-seaports-core', isSeaportsActive);
    setVis('infra-seaports-labels', isSeaportsActive);
    setVis('infra-seaports-hit-target', isSeaportsActive);

    const isDamsActive = isInfraActive && (!infrastructureCategories || infrastructureCategories.has('dams'));
    setVis('infra-dams-halo', isDamsActive);
    setVis('infra-dams-core', isDamsActive);
    setVis('infra-dams-labels', isDamsActive);
    setVis('infra-dams-hit-target', isDamsActive);

    const isPowerActive = isInfraActive && (!infrastructureCategories || infrastructureCategories.has('power_plants'));
    setVis('infra-power-halo', isPowerActive);
    setVis('infra-power-core', isPowerActive);
    setVis('infra-power-labels', isPowerActive);
    setVis('infra-power-hit-target', isPowerActive);

    const isSezActive = isInfraActive && (!infrastructureCategories || infrastructureCategories.has('economic_zones'));
    setVis('infra-sez-halo', isSezActive);
    setVis('infra-sez-core', isSezActive);
    setVis('infra-sez-labels', isSezActive);
    setVis('infra-sez-hit-target', isSezActive);

    const isUrbanActive = isInfraActive && (!infrastructureCategories || infrastructureCategories.has('urban_centres'));
    setVis('infra-urban-halo', isUrbanActive);
    setVis('infra-urban-core', isUrbanActive);
    setVis('infra-urban-labels', isUrbanActive);
    setVis('infra-urban-hit-target', isUrbanActive);

    // 8. Disaster & Hazard Intelligence
    const isDisasterActive = activeLayers.has('disaster_seismic');
    const hasAnyDisasterHazard = !disasterHazardTypes || disasterHazardTypes.size > 0;
    const effectiveDisasterActive = isDisasterActive && hasAnyDisasterHazard;

    const showSeismic = effectiveDisasterActive && (!disasterHazardTypes || disasterHazardTypes.has('seismic_zone'));
    const showEarthquakes = effectiveDisasterActive && (!disasterHazardTypes || disasterHazardTypes.has('earthquake'));
    const showCyclones = effectiveDisasterActive && (!disasterHazardTypes || disasterHazardTypes.has('cyclone'));
    const showFloods = effectiveDisasterActive && (!disasterHazardTypes || disasterHazardTypes.has('flood'));
    const showLandslides = effectiveDisasterActive && (!disasterHazardTypes || disasterHazardTypes.has('landslide'));
    const showDroughts = effectiveDisasterActive && (!disasterHazardTypes || disasterHazardTypes.has('drought'));
    const showTsunamis = effectiveDisasterActive && (!disasterHazardTypes || disasterHazardTypes.has('tsunami'));
    const showHeatwaves = effectiveDisasterActive && (!disasterHazardTypes || disasterHazardTypes.has('heatwave'));

    const regionCondition = (disasterRegionFilter && disasterRegionFilter !== 'all')
      ? ['==', ['get', 'region_group'], disasterRegionFilter]
      : ['!=', ['get', 'name'], 'none'];

    if (map.getLayer('seismic-zones-fill')) {
      map.setFilter('seismic-zones-fill', ['all', ['==', '$type', 'Polygon'], ['==', ['coalesce', ['get', 'hazard_type'], 'seismic_zone'], 'seismic_zone'], regionCondition] as any);
      map.setLayoutProperty('seismic-zones-fill', 'visibility', showSeismic ? 'visible' : 'none');
      map.setPaintProperty('seismic-zones-fill', 'fill-opacity', selectedDisasterEventId ? 0.18 : 0.42);
    }
    if (map.getLayer('seismic-zones-line')) {
      map.setFilter('seismic-zones-line', ['all', ['==', '$type', 'Polygon'], ['==', ['coalesce', ['get', 'hazard_type'], 'seismic_zone'], 'seismic_zone'], regionCondition] as any);
      map.setLayoutProperty('seismic-zones-line', 'visibility', showSeismic ? 'visible' : 'none');
    }
    if (map.getLayer('earthquake-epicenter-glow')) {
      map.setFilter('earthquake-epicenter-glow', ['all', ['==', '$type', 'Point'], regionCondition] as any);
      map.setLayoutProperty('earthquake-epicenter-glow', 'visibility', showEarthquakes ? 'visible' : 'none');
    }
    if (map.getLayer('earthquake-epicenter-core')) {
      map.setFilter('earthquake-epicenter-core', ['all', ['==', '$type', 'Point'], regionCondition] as any);
      map.setLayoutProperty('earthquake-epicenter-core', 'visibility', showEarthquakes ? 'visible' : 'none');
    }
    if (map.getLayer('earthquake-epicenter-labels')) {
      map.setFilter('earthquake-epicenter-labels', ['all', ['==', '$type', 'Point'], regionCondition] as any);
      map.setLayoutProperty('earthquake-epicenter-labels', 'visibility', showEarthquakes ? 'visible' : 'none');
    }

    if (map.getLayer('disaster-cyclones-track')) {
      map.setFilter('disaster-cyclones-track', ['all', ['==', ['get', 'hazard_type'], 'cyclone'], regionCondition] as any);
      map.setLayoutProperty('disaster-cyclones-track', 'visibility', showCyclones ? 'visible' : 'none');
    }
    if (map.getLayer('disaster-cyclones-casing')) {
      map.setFilter('disaster-cyclones-casing', ['all', ['==', ['get', 'hazard_type'], 'cyclone'], regionCondition] as any);
      map.setLayoutProperty('disaster-cyclones-casing', 'visibility', showCyclones ? 'visible' : 'none');
    }
    if (map.getLayer('disaster-cyclones-labels')) {
      map.setFilter('disaster-cyclones-labels', ['all', ['==', ['get', 'hazard_type'], 'cyclone'], regionCondition] as any);
      map.setLayoutProperty('disaster-cyclones-labels', 'visibility', showCyclones ? 'visible' : 'none');
    }

    if (map.getLayer('disaster-floods-fill')) {
      map.setFilter('disaster-floods-fill', ['all', ['==', ['get', 'hazard_type'], 'flood'], regionCondition] as any);
      map.setLayoutProperty('disaster-floods-fill', 'visibility', showFloods ? 'visible' : 'none');
    }
    if (map.getLayer('disaster-floods-border')) {
      map.setFilter('disaster-floods-border', ['all', ['==', ['get', 'hazard_type'], 'flood'], regionCondition] as any);
      map.setLayoutProperty('disaster-floods-border', 'visibility', showFloods ? 'visible' : 'none');
    }
    if (map.getLayer('disaster-floods-labels')) {
      map.setFilter('disaster-floods-labels', ['all', ['==', ['get', 'hazard_type'], 'flood'], regionCondition] as any);
      map.setLayoutProperty('disaster-floods-labels', 'visibility', showFloods ? 'visible' : 'none');
    }

    if (map.getLayer('disaster-landslides-fill')) {
      map.setFilter('disaster-landslides-fill', ['all', ['==', ['get', 'hazard_type'], 'landslide'], regionCondition] as any);
      map.setLayoutProperty('disaster-landslides-fill', 'visibility', showLandslides ? 'visible' : 'none');
    }
    if (map.getLayer('disaster-landslides-border')) {
      map.setFilter('disaster-landslides-border', ['all', ['==', ['get', 'hazard_type'], 'landslide'], regionCondition] as any);
      map.setLayoutProperty('disaster-landslides-border', 'visibility', showLandslides ? 'visible' : 'none');
    }
    if (map.getLayer('disaster-landslides-labels')) {
      map.setFilter('disaster-landslides-labels', ['all', ['==', ['get', 'hazard_type'], 'landslide'], regionCondition] as any);
      map.setLayoutProperty('disaster-landslides-labels', 'visibility', showLandslides ? 'visible' : 'none');
    }

    if (map.getLayer('disaster-droughts-fill')) {
      map.setFilter('disaster-droughts-fill', ['all', ['==', ['get', 'hazard_type'], 'drought'], regionCondition] as any);
      map.setLayoutProperty('disaster-droughts-fill', 'visibility', showDroughts ? 'visible' : 'none');
    }
    if (map.getLayer('disaster-droughts-border')) {
      map.setFilter('disaster-droughts-border', ['all', ['==', ['get', 'hazard_type'], 'drought'], regionCondition] as any);
      map.setLayoutProperty('disaster-droughts-border', 'visibility', showDroughts ? 'visible' : 'none');
    }
    if (map.getLayer('disaster-droughts-labels')) {
      map.setFilter('disaster-droughts-labels', ['all', ['==', ['get', 'hazard_type'], 'drought'], regionCondition] as any);
      map.setLayoutProperty('disaster-droughts-labels', 'visibility', showDroughts ? 'visible' : 'none');
    }

    if (map.getLayer('disaster-tsunami-fill')) {
      map.setFilter('disaster-tsunami-fill', ['all', ['==', ['get', 'hazard_type'], 'tsunami'], ['==', '$type', 'Polygon'], regionCondition] as any);
      map.setLayoutProperty('disaster-tsunami-fill', 'visibility', showTsunamis ? 'visible' : 'none');
    }
    if (map.getLayer('disaster-tsunami-line')) {
      map.setFilter('disaster-tsunami-line', ['all', ['==', ['get', 'hazard_type'], 'tsunami'], regionCondition] as any);
      map.setLayoutProperty('disaster-tsunami-line', 'visibility', showTsunamis ? 'visible' : 'none');
    }
    if (map.getLayer('disaster-tsunami-labels')) {
      map.setFilter('disaster-tsunami-labels', ['all', ['==', ['get', 'hazard_type'], 'tsunami'], regionCondition] as any);
      map.setLayoutProperty('disaster-tsunami-labels', 'visibility', showTsunamis ? 'visible' : 'none');
    }

    if (map.getLayer('disaster-heatwaves-fill')) {
      map.setFilter('disaster-heatwaves-fill', ['all', ['==', ['get', 'hazard_type'], 'heatwave'], regionCondition] as any);
      map.setLayoutProperty('disaster-heatwaves-fill', 'visibility', showHeatwaves ? 'visible' : 'none');
    }
    if (map.getLayer('disaster-heatwaves-border')) {
      map.setFilter('disaster-heatwaves-border', ['all', ['==', ['get', 'hazard_type'], 'heatwave'], regionCondition] as any);
      map.setLayoutProperty('disaster-heatwaves-border', 'visibility', showHeatwaves ? 'visible' : 'none');
    }
    if (map.getLayer('disaster-heatwaves-labels')) {
      map.setFilter('disaster-heatwaves-labels', ['all', ['==', ['get', 'hazard_type'], 'heatwave'], regionCondition] as any);
      map.setLayoutProperty('disaster-heatwaves-labels', 'visibility', showHeatwaves ? 'visible' : 'none');
    }

    // 9. Selection Highlights (always visible; controlled by filters, not layer toggles)
    setVis('states-highlight', true);
    setVis('states-highlight-fill', true);
    setVis('districts-highlight-line', true);
    setVis('districts-highlight-fill', true);

    // 10. Dynamic Demographic Choropleth Expression
    if (map.getLayer('districts-fill')) {
      if (isDensityActive) {
        map.setPaintProperty('districts-fill', 'fill-color', [
          'interpolate', ['linear'], ['coalesce', ['get', 'density_2011'], 350],
          30, '#fef08a',       // Extremely low (Ladakh, Arunachal, desert)
          120, '#a3e635',      // Low (Himalayan / plateau)
          350, '#22c55e',      // National average (~382)
          650, '#f59e0b',      // High (Peninsular / fertile plains)
          1100, '#ea580c',     // Very high (UP, Bihar, WB)
          2500, '#dc2626',     // High density urban / delta
          10000, '#7f1d1d'     // Megacity / Delhi / Mumbai
        ]);
        map.setPaintProperty('districts-fill', 'fill-opacity', 0.72);
      } else if (isPopTotalActive) {
        map.setPaintProperty('districts-fill', 'fill-color', [
          'interpolate', ['linear'], ['coalesce', ['get', 'population_2011'], 800000],
          50000, '#cffafe',
          500000, '#38bdf8',
          1500000, '#2563eb',
          4000000, '#1d4ed8',
          10000000, '#020617'
        ]);
        map.setPaintProperty('districts-fill', 'fill-opacity', 0.7);
      } else if (isReligionActive) {
        const religionPalettes: Record<ReligionFilter, { low: string; mid: string; high: string }> = {
          hindu: { low: '#ffedd5', mid: '#f97316', high: '#9a3412' },       // Saffron / Amber
          muslim: { low: '#ecfdf5', mid: '#10b981', high: '#064e3b' },      // Emerald / Forest Green
          christian: { low: '#eff6ff', mid: '#3b82f6', high: '#1e3a8a' },   // Royal Blue
          sikh: { low: '#fef3c7', mid: '#f59e0b', high: '#78350f' },        // Sacred Gold / Amber
          buddhist: { low: '#fdf4ff', mid: '#a855f7', high: '#581c87' },    // Royal Purple / Dharma
          jain: { low: '#fff1f2', mid: '#f43f5e', high: '#881337' }         // Ahimsa Rose / Ruby
        };
        const palette = religionPalettes[religionFilter] || religionPalettes.hindu;
        map.setPaintProperty('districts-fill', 'fill-color', [
          'interpolate', ['linear'], ['coalesce', ['get', `${religionFilter}_pct`], 5],
          2, palette.low,
          25, palette.mid,
          85, palette.high
        ]);
        map.setPaintProperty('districts-fill', 'fill-opacity', 0.75);
      } else if (isLiteracyActive) {
        map.setPaintProperty('districts-fill', 'fill-color', [
          'interpolate', ['linear'], ['coalesce', ['get', 'literacy_rate'], 72],
          50, '#ef4444',     // Critical (<55%)
          65, '#f59e0b',     // Moderate (65%)
          78, '#10b981',     // High (78%)
          95, '#059669'      // Very high (>90%)
        ]);
        map.setPaintProperty('districts-fill', 'fill-opacity', 0.7);
      } else if (isSexRatioActive) {
        map.setPaintProperty('districts-fill', 'fill-color', [
          'interpolate', ['linear'], ['coalesce', ['get', 'sex_ratio'], 940],
          860, '#f43f5e',    // Disproportionate male (<880)
          940, '#a855f7',    // National baseline (~940)
          1040, '#06b6d4'    // Higher female ratio (>1000, Kerala/Coastal)
        ]);
        map.setPaintProperty('districts-fill', 'fill-opacity', 0.7);
      } else {
        map.setPaintProperty('districts-fill', 'fill-color', '#0f172a');
        map.setPaintProperty('districts-fill', 'fill-opacity', activeLayers.has('political_districts') ? 0.35 : 0);
      }
    }

    // Force immediate GPU redraw for zero-latency toggle responsiveness
    try {
      map.triggerRepaint();
    } catch {
      // ignore
    }
  }, [activeLayers, religionFilter, tradeCategories, environmentalPillars, comparisonConfig, disasterHazardTypes, disasterRegionFilter, selectedDisasterEventId, infrastructureCategories, selectedInfrastructureId]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'base-raster': {
            type: 'raster',
            tiles: getBasemapTiles(basemapStyle),
            tileSize: 256,
            maxzoom: 18,
            attribution: '© ESRI | © OpenStreetMap contributors | Government of India Open Data'
          },
          'terrarium-dem': {
            type: 'raster-dem',
            tiles: [APP_CONFIG.TERRAIN_DEM_URL],
            encoding: 'terrarium',
            tileSize: 256,
            maxzoom: 12
          }
        },
        layers: [
          {
            id: 'base-raster-layer',
            type: 'raster',
            source: 'base-raster',
            paint: {
              'raster-opacity': 1.0,
              'raster-contrast': 0.15,
              'raster-brightness-min': 0.05
            }
          },
          {
            id: 'hillshading-layer',
            type: 'hillshade',
            source: 'terrarium-dem',
            paint: {
              'hillshade-exaggeration': 0.35,
              'hillshade-shadow-color': '#020617',
              'hillshade-highlight-color': '#38bdf8',
              'hillshade-accent-color': '#0284c7'
            }
          }
        ]
      },
      center: [78.9629, 22.5937], // Center of India
      zoom: 4.8,
      pitch: is3D ? 52 : 0,
      bearing: is3D ? -8 : 0,
      maxPitch: 85,
      attributionControl: false,
      clickTolerance: 18 // Generous tap movement tolerance for touchscreens (prevents accidental tap-drag cancellation on mobile)
    });

    map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.on('load', () => {
      // Register custom category icons for map layers
      const CATEGORY_ICONS: Array<{ id: string; category: string; color: string }> = [
        { id: 'infra-icon-railways', category: 'railways', color: '#0284c7' },
        { id: 'infra-icon-airports', category: 'airports', color: '#4f46e5' },
        { id: 'infra-icon-seaports', category: 'seaports', color: '#0891b2' },
        { id: 'infra-icon-industrial_corridors', category: 'industrial_corridors', color: '#c026d3' },
        { id: 'infra-icon-dams', category: 'dams', color: '#0369a1' },
        { id: 'infra-icon-power_plants', category: 'power_plants', color: '#ca8a04' },
        { id: 'infra-icon-economic_zones', category: 'economic_zones', color: '#059669' },
        { id: 'infra-icon-urban_centres', category: 'urban_centres', color: '#c2410c' },
        { id: 'infra-icon-highways', category: 'highways', color: '#d97706' },
      ];
      for (const ic of CATEGORY_ICONS) {
        try {
          const imgData = createCategoryIconCanvas(ic.category, ic.color);
          if (imgData && !map.hasImage(ic.id)) {
            map.addImage(ic.id, imgData);
          }
        } catch {}
      }

      // 1. Enable 3D Terrain
      try {
        if (is3D) {
          map.setTerrain({
            source: 'terrarium-dem',
            exaggeration: terrainExaggeration
          });
        }
      } catch (err) {
        console.warn('Terrain initialization warning:', err);
      }

      // 2. Load Core GeoJSON Sources
      map.addSource('india-states', {
        type: 'geojson',
        data: '/data/india_states.geojson'
      });

      map.addSource('state-centroids', {
        type: 'geojson',
        data: '/data/state_centroids.geojson'
      });

      map.addSource('india-districts', {
        type: 'geojson',
        data: '/data/india_districts.geojson'
      });

      map.addSource('india-rivers', {
        type: 'geojson',
        data: '/data/india_rivers.geojson'
      });

      map.addSource('india-soils', {
        type: 'geojson',
        data: '/data/india_soils.geojson'
      });

      map.addSource('india-mountains', {
        type: 'geojson',
        data: '/data/india_mountains.geojson'
      });

      map.addSource('india-elevation-points', {
        type: 'geojson',
        data: '/data/india_elevation_points.geojson'
      });

      map.addSource('india-urban-nodes', {
        type: 'geojson',
        data: '/data/india_urban_nodes.geojson'
      });

      // 3. Load Atlas & Time Machine Sources
      map.addSource('historical-empires', {
        type: 'geojson',
        data: '/data/historical_empires.geojson'
      });

      map.addSource('archaeological-sites', {
        type: 'geojson',
        data: '/data/archaeological_sites.geojson'
      });

      map.addSource('historical-trade-routes', {
        type: 'geojson',
        data: '/data/historical_trade_routes.geojson'
      });


      map.addSource('environmental-change', {
        type: 'geojson',
        data: '/data/environmental_change.geojson'
      });

      map.addSource('india-highways', {
        type: 'geojson',
        data: '/data/india_highways.geojson'
      });

      map.addSource('disaster-seismic-zones', {
        type: 'geojson',
        data: DISASTER_GEOJSON
      });

      map.addSource('infrastructure-economic', {
        type: 'geojson',
        data: INFRASTRUCTURE_GEOJSON
      });

      map.addSource('search-highlight', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // Register natural faceted mountain summit peak icon
      try {
        const peakCanvas = document.createElement('canvas');
        peakCanvas.width = 36;
        peakCanvas.height = 36;
        const pCtx = peakCanvas.getContext('2d');
        if (pCtx) {
          const cx = 18;
          const topY = 4;
          const baseY = 30;
          const halfW = 14;

          // 1. Soft natural ground shadow
          pCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          pCtx.beginPath();
          pCtx.ellipse(cx, baseY + 1, halfW + 1, 3, 0, 0, Math.PI * 2);
          pCtx.fill();

          // 2. Left slope (Sunward facet - golden ivory sunlight)
          pCtx.fillStyle = '#fffbeb';
          pCtx.beginPath();
          pCtx.moveTo(cx, topY);
          pCtx.lineTo(cx - halfW, baseY);
          pCtx.lineTo(cx, baseY - 2);
          pCtx.closePath();
          pCtx.fill();

          // 3. Right slope (Shaded facet - rich warm copper terracotta)
          pCtx.fillStyle = '#c2410c';
          pCtx.beginPath();
          pCtx.moveTo(cx, topY);
          pCtx.lineTo(cx + halfW, baseY);
          pCtx.lineTo(cx, baseY - 2);
          pCtx.closePath();
          pCtx.fill();

          // 4. Clean summit ridge line
          pCtx.strokeStyle = '#ffffff';
          pCtx.lineWidth = 1.2;
          pCtx.beginPath();
          pCtx.moveTo(cx, topY);
          pCtx.lineTo(cx, baseY - 2);
          pCtx.stroke();

          // 5. Alpine snowcap highlight at the peak apex
          pCtx.fillStyle = '#ffffff';
          pCtx.beginPath();
          pCtx.moveTo(cx, topY);
          pCtx.lineTo(cx - 5, topY + 9);
          pCtx.lineTo(cx + 5, topY + 9);
          pCtx.closePath();
          pCtx.fill();

          const imgData = pCtx.getImageData(0, 0, 36, 36);
          if (!map.hasImage('natural-summit-peak')) {
            map.addImage('natural-summit-peak', imgData);
          }
        }
      } catch (e) {
        console.warn('Natural summit icon warning:', e);
      }

      // ========================================================
      // BASE VECTOR LAYERS
      // ========================================================

      // State Base Fill Layer
      map.addLayer({
        id: 'states-fill',
        type: 'fill',
        source: 'india-states',
        paint: {
          'fill-color': '#0f172a',
          'fill-opacity': 0.2
        }
      });

      // District Fill & Thematic Choropleths
      map.addLayer({
        id: 'districts-fill',
        type: 'fill',
        source: 'india-districts',
        paint: {
          'fill-color': '#0f172a',
          'fill-opacity': 0.35
        }
      });

      // Soil Classification Layer (Layered ABOVE districts-fill so it is never masked)
      map.addLayer({
        id: 'soils-fill',
        type: 'fill',
        source: 'india-soils',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.55,
          'fill-outline-color': '#ffffff'
        }
      });

      // District Administrative Lines
      map.addLayer({
        id: 'districts-line',
        type: 'line',
        source: 'india-districts',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 0.6,
          'line-opacity': 0.35
        }
      });

      // District Selection Highlights
      map.addLayer({
        id: 'districts-highlight-fill',
        type: 'fill',
        source: 'india-districts',
        paint: {
          'fill-color': '#C9A227',
          'fill-opacity': 0.35
        },
        filter: ['==', 'shapeName', '']
      });

      map.addLayer({
        id: 'districts-highlight-line',
        type: 'line',
        source: 'india-districts',
        paint: {
          'line-color': '#C9A227',
          'line-width': 3,
          'line-opacity': 1
        },
        filter: ['==', 'shapeName', '']
      });

      // State Boundaries & Atmospheric Glow
      map.addLayer({
        id: 'states-glow',
        type: 'line',
        source: 'india-states',
        paint: {
          'line-color': '#00f0ff',
          'line-width': 7.5,
          'line-opacity': 0.65,
          'line-blur': 5
        }
      });

      map.addLayer({
        id: 'states-line',
        type: 'line',
        source: 'india-states',
        paint: {
          'line-color': '#38bdf8',
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            4, 1.4,
            7, 2.4,
            10, 3.8
          ],
          'line-opacity': 0.95
        }
      });

      // Urban Night Light Nodes (only displayed during demographic layer exploration)
      map.addLayer({
        id: 'urban-nodes-glow',
        type: 'circle',
        source: 'india-urban-nodes',
        layout: {
          visibility: 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            3, ['*', ['get', 'radius'], 1.4],
            6, ['*', ['get', 'radius'], 2.2],
            10, ['*', ['get', 'radius'], 3.5]
          ],
          'circle-color': ['get', 'color'],
          'circle-blur': 1.1,
          'circle-opacity': 0.88
        }
      });

      map.addLayer({
        id: 'urban-nodes-halo',
        type: 'circle',
        source: 'india-urban-nodes',
        layout: {
          visibility: 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            3, ['get', 'radius'],
            6, ['*', ['get', 'radius'], 1.6],
            10, ['*', ['get', 'radius'], 2.4]
          ],
          'circle-color': ['get', 'color'],
          'circle-blur': 0.35,
          'circle-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'urban-nodes-core',
        type: 'circle',
        source: 'india-urban-nodes',
        layout: {
          visibility: 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            3, 1.8,
            6, 2.8,
            10, 4.2
          ],
          'circle-color': '#ffffff',
          'circle-opacity': 1.0
        }
      });

      // State Selection Highlights
      map.addLayer({
        id: 'states-highlight-fill',
        type: 'fill',
        source: 'india-states',
        paint: {
          'fill-color': '#C9A227',
          'fill-opacity': 0.22
        },
        filter: ['==', 'shapeName', '']
      });

      map.addLayer({
        id: 'states-highlight',
        type: 'line',
        source: 'india-states',
        paint: {
          'line-color': '#C9A227',
          'line-width': 4,
          'line-opacity': 1,
          'line-blur': 1
        },
        filter: ['==', 'shapeName', '']
      });

      // Mountain Ranges
      map.addLayer({
        id: 'mountains-glow',
        type: 'line',
        source: 'india-mountains',
        paint: {
          'line-color': '#f59e0b',
          'line-width': 8,
          'line-opacity': 0.35,
          'line-blur': 6
        }
      });

      map.addLayer({
        id: 'mountains-line',
        type: 'line',
        source: 'india-mountains',
        paint: {
          'line-color': '#fbbf24',
          'line-width': 3.5,
          'line-opacity': 0.9,
          'line-dasharray': [3, 1]
        }
      });

      // Mountains Hit Target (Invisible wide interactive hit-target for effortless mobile finger tapping)
      map.addLayer({
        id: 'mountains-hit-target',
        type: 'line',
        source: 'india-mountains',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('mountains') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 32,
          'line-opacity': 0.001
        }
      });

      map.addLayer({
        id: 'mountains-highlight',
        type: 'line',
        source: 'india-mountains',
        paint: {
          'line-color': '#10b981',
          'line-width': 5,
          'line-opacity': 1
        },
        filter: ['==', 'name', '']
      });

      // River Systems & Flow
      map.addLayer({
        id: 'rivers-glow',
        type: 'line',
        source: 'india-rivers',
        paint: {
          'line-color': '#06b6d4',
          'line-width': 6,
          'line-opacity': 0.45,
          'line-blur': 4
        }
      });

      map.addLayer({
        id: 'rivers-core',
        type: 'line',
        source: 'india-rivers',
        paint: {
          'line-color': '#38bdf8',
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            4, 1.8,
            8, 3.2
          ],
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'rivers-flow',
        type: 'line',
        source: 'india-rivers',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.6,
          'line-opacity': 0.75,
          'line-dasharray': [0, 4, 3]
        }
      });

      // Rivers Hit Target (Invisible wide interactive hit-target for mobile touchscreens)
      map.addLayer({
        id: 'rivers-hit-target',
        type: 'line',
        source: 'india-rivers',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('rivers') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 30,
          'line-opacity': 0.001
        }
      });

      map.addLayer({
        id: 'rivers-highlight',
        type: 'line',
        source: 'india-rivers',
        paint: {
          'line-color': '#22d3ee',
          'line-width': 5,
          'line-opacity': 1
        },
        filter: ['==', 'clean_name', '']
      });

      // ========================================================
      // 1. HISTORICAL ATLAS & TIME MACHINE LAYERS
      // ========================================================

      map.addLayer({
        id: 'empires-fill',
        type: 'fill',
        source: 'historical-empires',
        layout: {
          visibility: activeLayers.has('historical_atlas') ? 'visible' : 'none'
        },
        filter: ['==', 'id', selectedHistoricalPeriod],
        paint: {
          'fill-color': ['coalesce', ['get', 'color'], '#c2410c'],
          'fill-opacity': 0.42
        }
      });

      map.addLayer({
        id: 'empires-glow',
        type: 'line',
        source: 'historical-empires',
        layout: {
          visibility: activeLayers.has('historical_atlas') ? 'visible' : 'none'
        },
        filter: ['==', 'id', selectedHistoricalPeriod],
        paint: {
          'line-color': ['coalesce', ['get', 'color'], '#c2410c'],
          'line-width': 8,
          'line-opacity': 0.5,
          'line-blur': 5
        }
      });

      map.addLayer({
        id: 'empires-border',
        type: 'line',
        source: 'historical-empires',
        layout: {
          visibility: activeLayers.has('historical_atlas') ? 'visible' : 'none'
        },
        filter: ['==', 'id', selectedHistoricalPeriod],
        paint: {
          'line-color': '#ffffff',
          'line-width': 2.8,
          'line-dasharray': [4, 2],
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'empires-capitals',
        type: 'symbol',
        source: 'historical-empires',
        layout: {
          'text-field': ['concat', '🏛️ ', ['get', 'name'], '\nCapital: ', ['get', 'capital']],
          'text-size': 13,
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.05,
          'text-allow-overlap': false,
          visibility: activeLayers.has('historical_atlas') ? 'visible' : 'none'
        },
        filter: ['==', 'id', selectedHistoricalPeriod],
        paint: {
          'text-color': '#fffbeb',
          'text-halo-color': '#0f172a',
          'text-halo-width': 2.5
        }
      });

      // ========================================================
      // 2. ARCHAEOLOGICAL SITES LAYERS
      // ========================================================

      // Color expression dynamically supporting explicit 'color' property or category keys
      const siteColorExpr: any = [
        'coalesce',
        ['get', 'color'],
        [
          'match',
          ['get', 'category'],
          'ivc_site', '#14b8a6',                      // Teal (Indus Valley Settlements)
          'ancient_university', '#f59e0b',            // Amber (Ancient Universities)
          'buddhist_monument', '#8b5cf6',             // Purple (Buddhist Monasteries)
          'rock_cut_monument', '#f43f5e',             // Rose (Rock-Cut Temples)
          'medieval_monument', '#f43f5e',             // Rose (Rock-Cut Temples)
          'ancient_temple', '#f43f5e',                // Rose (Rock-Cut Temples)
          'ancient_port', '#06b6d4',                  // Cyan (Ancient Ports)
          '#14b8a6'                                   // Default Teal
        ]
      ];

      // 1. Vibrant outer atmospheric glow matching category color
      map.addLayer({
        id: 'archaeology-glow',
        type: 'circle',
        source: 'archaeological-sites',
        layout: {
          visibility: activeLayers.has('archaeological_sites') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 15,
            7, 22,
            10, 28
          ],
          'circle-color': siteColorExpr,
          'circle-blur': 0.75,
          'circle-opacity': 0.75
        }
      });

      // 2. Main Solid Category Dot with crisp white outer ring
      map.addLayer({
        id: 'archaeology-core',
        type: 'circle',
        source: 'archaeological-sites',
        layout: {
          visibility: activeLayers.has('archaeological_sites') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 7.5,
            7, 9.5,
            10, 11.5
          ],
          'circle-color': siteColorExpr,
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 1.0
        }
      });

      // 3. Crisp inner luminous pinpoint for tactile cartographic clarity
      map.addLayer({
        id: 'archaeology-inner-pip',
        type: 'circle',
        source: 'archaeological-sites',
        layout: {
          visibility: activeLayers.has('archaeological_sites') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 2.2,
            7, 3.0,
            10, 3.8
          ],
          'circle-color': '#ffffff',
          'circle-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'archaeology-labels',
        type: 'symbol',
        source: 'archaeological-sites',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            4, 10.5,
            7, 12,
            10, 13.5
          ],
          'text-offset': [0, 1.4],
          'text-anchor': 'top',
          'text-allow-overlap': false,
          visibility: activeLayers.has('archaeological_sites') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#020617',
          'text-halo-width': 2.5
        }
      });

      // ========================================================
      // 3. HISTORICAL TRADE ROUTES & CONNECTIVITY LAYERS
      // ========================================================

      map.addLayer({
        id: 'trade-glow',
        type: 'line',
        source: 'historical-trade-routes',
        filter: ['!=', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'line-color': ['coalesce', ['get', 'color'], '#38bdf8'],
          'line-width': 7,
          'line-opacity': 0.45,
          'line-blur': 4
        }
      });

      map.addLayer({
        id: 'trade-core',
        type: 'line',
        source: 'historical-trade-routes',
        filter: ['!=', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'line-color': ['coalesce', ['get', 'color'], '#38bdf8'],
          'line-width': 3,
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'trade-flow',
        type: 'line',
        source: 'historical-trade-routes',
        filter: ['all', ['!=', ['geometry-type'], 'Point'], ['!=', ['get', 'category'], 'historical_railway']],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.8,
          'line-dasharray': [2, 4],
          'line-opacity': 0.85
        }
      });

      // Special railway track dash layer for historical railways
      map.addLayer({
        id: 'trade-railways',
        type: 'line',
        source: 'historical-trade-routes',
        filter: ['all', ['!=', ['geometry-type'], 'Point'], ['==', ['get', 'category'], 'historical_railway']],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 2.2,
          'line-dasharray': [2, 3],
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'trade-labels',
        type: 'symbol',
        source: 'historical-trade-routes',
        filter: ['!=', ['geometry-type'], 'Point'],
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-letter-spacing': 0.08,
          'text-allow-overlap': false,
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      // Trade Routes Hit Target (Invisible wide interactive hit-target for mobile touchscreens)
      map.addLayer({
        id: 'trade-hit-target',
        type: 'line',
        source: 'historical-trade-routes',
        filter: ['!=', ['geometry-type'], 'Point'],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 32,
          'line-opacity': 0.001
        }
      });

      // ========================================================
      // 3.2 ANCIENT PORTS & EMPORIA (POINT LAYERS)
      // ========================================================

      map.addLayer({
        id: 'trade-ports-halo',
        type: 'circle',
        source: 'historical-trade-routes',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 11,
          'circle-color': 'rgba(251, 191, 36, 0.22)',
          'circle-stroke-color': '#fbbf24',
          'circle-stroke-width': 1.5
        }
      });

      map.addLayer({
        id: 'trade-ports-core',
        type: 'circle',
        source: 'historical-trade-routes',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 6,
          'circle-color': '#fbbf24',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.8
        }
      });

      map.addLayer({
        id: 'trade-ports-labels',
        type: 'symbol',
        source: 'historical-trade-routes',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-offset': [0, 1.4],
          'text-anchor': 'top',
          'text-allow-overlap': false,
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#fef08a',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      map.addLayer({
        id: 'trade-ports-hit-target',
        type: 'circle',
        source: 'historical-trade-routes',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('trade_routes') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 32,
          'circle-opacity': 0.001
        }
      });


      // ========================================================
      // 3.4 ENVIRONMENTAL CHANGE & CLIMATE EXPLORER LAYERS
      // ========================================================

      // Dynamic color expression based on delta vs normal thematic mode
      const envColorExpr: any = [
        'match',
        ['get', 'pillar'],
        'forest_change', '#10b981',
        'glacier_retreat', '#06b6d4',
        'urban_expansion', '#f97316',
        'coastal_erosion', '#ef4444',
        'wetland_change', '#3b82f6',
        'desertification', '#eab308',
        'groundwater_stress', '#a855f7',
        'river_avulsion', '#14b8a6',
        '#10b981'
      ];

      // Polygons (Forests, Urban Sprawl, Wetlands, Desertification, Groundwater)
      map.addLayer({
        id: 'env-polygons-glow',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Polygon'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'line-color': envColorExpr,
          'line-width': 5,
          'line-opacity': 0.5,
          'line-blur': 3
        }
      });

      map.addLayer({
        id: 'env-polygons-fill',
        type: 'fill',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Polygon'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'fill-color': envColorExpr,
          'fill-opacity': 0.40
        }
      });

      map.addLayer({
        id: 'env-polygons-border',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Polygon'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'line-color': envColorExpr,
          'line-width': 2.0,
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'env-polygons-labels',
        type: 'symbol',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Polygon'],
        layout: {
          'text-field': [
            'concat',
            ['get', 'name'],
            '\nΔ ',
            ['coalesce', ['get', 'delta_text'], ''],
            ' (',
            ['coalesce', ['get', 'change_rate_display'], ''],
            ')'
          ],
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            4, 9.5,
            7, 11.5,
            10, 13.5
          ],
          'text-anchor': 'center',
          'text-allow-overlap': false,
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#020617',
          'text-halo-width': 2.5
        }
      });

      map.addLayer({
        id: 'env-polygons-hit-target',
        type: 'fill',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Polygon'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'fill-color': '#000000',
          'fill-opacity': 0.001
        }
      });

      // Lines (Shorelines, River Avulsion Channels)
      map.addLayer({
        id: 'env-lines-glow',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'line-color': envColorExpr,
          'line-width': 7,
          'line-opacity': 0.45,
          'line-blur': 4
        }
      });

      map.addLayer({
        id: 'env-lines-core',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'line-color': envColorExpr,
          'line-width': 3.5,
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'env-lines-flow',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.6,
          'line-dasharray': [2, 4],
          'line-opacity': 0.85
        }
      });

      map.addLayer({
        id: 'env-lines-labels',
        type: 'symbol',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-letter-spacing': 0.08,
          'text-allow-overlap': false,
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      // 32px Wide Line Hit Target for 1-Tap Mobile Touch
      map.addLayer({
        id: 'env-lines-hit-target',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 32,
          'line-opacity': 0.001
        }
      });

      // Points (Glacier snouts, Urban centroids, Hotspot spots)
      map.addLayer({
        id: 'env-points-halo',
        type: 'circle',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 13,
          'circle-color': 'rgba(16, 185, 129, 0.22)',
          'circle-stroke-color': envColorExpr,
          'circle-stroke-width': 1.5
        }
      });

      map.addLayer({
        id: 'env-points-core',
        type: 'circle',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 6.5,
          'circle-color': envColorExpr,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2.0
        }
      });

      map.addLayer({
        id: 'env-points-labels',
        type: 'symbol',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11.5,
          'text-offset': [0, 1.4],
          'text-anchor': 'top',
          'text-allow-overlap': false,
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#020617',
          'text-halo-width': 2.5
        }
      });

      // 32px Radius Circle Hit Target for 1-Tap Mobile Touch
      map.addLayer({
        id: 'env-points-hit-target',
        type: 'circle',
        source: 'environmental-change',
        filter: ['==', ['geometry-type'], 'Point'],
        layout: {
          visibility: activeLayers.has('environmental_change') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 32,
          'circle-opacity': 0.001
        }
      });

      // Highlight Layers for Selected Environmental Feature
      map.addLayer({
        id: 'env-highlight-fill',
        type: 'fill',
        source: 'environmental-change',
        filter: ['==', ['id'], ''],
        paint: {
          'fill-color': '#f59e0b',
          'fill-opacity': 0.48
        }
      });

      map.addLayer({
        id: 'env-highlight-border',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['id'], ''],
        paint: {
          'line-color': '#ffffff',
          'line-width': 3.5,
          'line-opacity': 1.0
        }
      });

      map.addLayer({
        id: 'env-highlight-line',
        type: 'line',
        source: 'environmental-change',
        filter: ['==', ['id'], ''],
        paint: {
          'line-color': '#fbbf24',
          'line-width': 6.5,
          'line-opacity': 1.0
        }
      });

      map.addLayer({
        id: 'env-highlight-point',
        type: 'circle',
        source: 'environmental-change',
        filter: ['==', ['id'], ''],
        paint: {
          'circle-radius': 14,
          'circle-color': '#f59e0b',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 3.5
        }
      });

      // ========================================================
      // 3.5 NATIONAL HIGHWAYS, EXPRESSWAYS & ROAD CORRIDORS
      // ========================================================

      map.addLayer({
        id: 'roads-casing',
        type: 'line',
        source: 'india-highways',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('roads') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#0b1220',
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            4, 2.6,
            7, 4.2,
            10, 6.5
          ],
          'line-opacity': 0.9
        }
      });

      map.addLayer({
        id: 'roads-core',
        type: 'line',
        source: 'india-highways',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('roads') ? 'visible' : 'none'
        },
        paint: {
          'line-color': ['coalesce', ['get', 'color'], '#f59e0b'],
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            4, 1.5,
            7, 2.5,
            10, 3.6
          ],
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'roads-label',
        type: 'symbol',
        source: 'india-highways',
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'code'],
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            4, 9,
            7, 10.5,
            10, 12
          ],
          'text-letter-spacing': 0.05,
          'text-allow-overlap': false,
          'text-optional': true,
          visibility: activeLayers.has('roads') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      // National Highways & Expressways Hit Target (Invisible wide hit-target for effortless single-tap selection on mobile)
      map.addLayer({
        id: 'roads-hit-target',
        type: 'line',
        source: 'india-highways',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('roads') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 32,
          'line-opacity': 0.001
        }
      });

      map.addLayer({
        id: 'roads-highlight',
        type: 'line',
        source: 'india-highways',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 6,
          'line-opacity': 1,
          'line-blur': 0.5
        },
        filter: ['==', 'code', '']
      });

      // ========================================================
      // 3.6 INFRASTRUCTURE & ECONOMIC GEOGRAPHY NETWORKS
      // ========================================================

      // --- RAILWAYS & FREIGHT CORRIDORS ---
      map.addLayer({
        id: 'infra-railways-glow',
        type: 'line',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'LineString'], ['==', ['get', 'category'], 'railways']],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#38bdf8',
          'line-width': 5.5,
          'line-opacity': 0.35,
          'line-blur': 2
        }
      });

      map.addLayer({
        id: 'infra-railways-casing',
        type: 'line',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'LineString'], ['==', ['get', 'category'], 'railways']],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#030712',
          'line-width': 3.6,
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'infra-railways-core',
        type: 'line',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'LineString'], ['==', ['get', 'category'], 'railways']],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#38bdf8',
          'line-width': 2.2,
          'line-dasharray': [3, 2]
        }
      });

      map.addLayer({
        id: 'infra-railways-labels',
        type: 'symbol',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'LineString'], ['==', ['get', 'category'], 'railways']],
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'name'],
          'text-size': 10,
          'text-letter-spacing': 0.05,
          'text-allow-overlap': false,
          'text-optional': true,
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#e0f2fe',
          'text-halo-color': '#030712',
          'text-halo-width': 2
        }
      });

      map.addLayer({
        id: 'infra-railways-hit-target',
        type: 'line',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'LineString'], ['==', ['get', 'category'], 'railways']],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 32,
          'line-opacity': 0.001
        }
      });

      // --- RAILWAYS POINT HUBS & TERMINALS ---
      map.addLayer({
        id: 'infra-railways-points-halo',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'railways']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 14,
          'circle-color': '#38bdf8',
          'circle-blur': 0.8,
          'circle-opacity': 0.7
        }
      });

      map.addLayer({
        id: 'infra-railways-points-core',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'railways']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 6.0,
          'circle-color': '#ffffff',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#0284c7'
        }
      });

      map.addLayer({
        id: 'infra-railways-points-labels',
        type: 'symbol',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'railways']],
        layout: {
          'text-field': ['concat', '🚆 ', ['get', 'name']],
          'text-size': 10,
          'text-offset': [0, -1.4],
          'text-anchor': 'bottom',
          'text-allow-overlap': false,
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#e0f2fe',
          'text-halo-color': '#0f172a',
          'text-halo-width': 2
        }
      });

      map.addLayer({
        id: 'infra-railways-points-hit-target',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'railways']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 24,
          'circle-color': '#000000',
          'circle-opacity': 0.001
        }
      });

      // --- INDUSTRIAL CORRIDORS ---
      map.addLayer({
        id: 'infra-corridors-glow',
        type: 'line',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'LineString'], ['==', ['get', 'category'], 'industrial_corridors']],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#d946ef',
          'line-width': 6,
          'line-opacity': 0.35,
          'line-blur': 2
        }
      });

      map.addLayer({
        id: 'infra-corridors-casing',
        type: 'line',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'LineString'], ['==', ['get', 'category'], 'industrial_corridors']],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#0f172a',
          'line-width': 4,
          'line-opacity': 0.95
        }
      });

      map.addLayer({
        id: 'infra-corridors-core',
        type: 'line',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'LineString'], ['==', ['get', 'category'], 'industrial_corridors']],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#d946ef',
          'line-width': 2.6
        }
      });

      map.addLayer({
        id: 'infra-corridors-labels',
        type: 'symbol',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'LineString'], ['==', ['get', 'category'], 'industrial_corridors']],
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'name'],
          'text-size': 10,
          'text-letter-spacing': 0.05,
          'text-allow-overlap': false,
          'text-optional': true,
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#fae8ff',
          'text-halo-color': '#0f172a',
          'text-halo-width': 2
        }
      });

      map.addLayer({
        id: 'infra-corridors-hit-target',
        type: 'line',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'LineString'], ['==', ['get', 'category'], 'industrial_corridors']],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 32,
          'line-opacity': 0.001
        }
      });

      // --- AIRPORTS ---
      map.addLayer({
        id: 'infra-airports-halo',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'airports']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 13,
          'circle-color': '#818cf8',
          'circle-blur': 0.8,
          'circle-opacity': 0.65
        }
      });

      map.addLayer({
        id: 'infra-airports-core',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'airports']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 5.5,
          'circle-color': '#ffffff',
          'circle-stroke-width': 2.2,
          'circle-stroke-color': '#4338ca'
        }
      });

      map.addLayer({
        id: 'infra-airports-labels',
        type: 'symbol',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'airports']],
        layout: {
          'text-field': ['concat', ['coalesce', ['get', 'iata_code'], 'AIR'], ' • ', ['get', 'name']],
          'text-size': 10,
          'text-offset': [0, -1.3],
          'text-anchor': 'bottom',
          'text-allow-overlap': false,
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#e0e7ff',
          'text-halo-color': '#0f172a',
          'text-halo-width': 2
        }
      });

      map.addLayer({
        id: 'infra-airports-hit-target',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'airports']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 22,
          'circle-color': '#000000',
          'circle-opacity': 0.001
        }
      });

      // --- SEAPORTS ---
      map.addLayer({
        id: 'infra-seaports-halo',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'seaports']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 13,
          'circle-color': '#06b6d4',
          'circle-blur': 0.8,
          'circle-opacity': 0.65
        }
      });

      map.addLayer({
        id: 'infra-seaports-core',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'seaports']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 5.5,
          'circle-color': '#ffffff',
          'circle-stroke-width': 2.2,
          'circle-stroke-color': '#0891b2'
        }
      });

      map.addLayer({
        id: 'infra-seaports-labels',
        type: 'symbol',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'seaports']],
        layout: {
          'text-field': ['concat', '⚓ ', ['get', 'name']],
          'text-size': 10,
          'text-offset': [0, -1.3],
          'text-anchor': 'bottom',
          'text-allow-overlap': false,
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#cffafe',
          'text-halo-color': '#0f172a',
          'text-halo-width': 2
        }
      });

      map.addLayer({
        id: 'infra-seaports-hit-target',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'seaports']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 22,
          'circle-color': '#000000',
          'circle-opacity': 0.001
        }
      });

      // --- DAMS & RESERVOIRS ---
      map.addLayer({
        id: 'infra-dams-halo',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'dams']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 12,
          'circle-color': '#0284c7',
          'circle-blur': 0.8,
          'circle-opacity': 0.65
        }
      });

      map.addLayer({
        id: 'infra-dams-core',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'dams']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 5,
          'circle-color': '#ffffff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#0369a1'
        }
      });

      map.addLayer({
        id: 'infra-dams-labels',
        type: 'symbol',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'dams']],
        layout: {
          'text-field': ['concat', '💧 ', ['get', 'name']],
          'text-size': 9.5,
          'text-offset': [0, -1.3],
          'text-anchor': 'bottom',
          'text-allow-overlap': false,
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#bae6fd',
          'text-halo-color': '#0f172a',
          'text-halo-width': 2
        }
      });

      map.addLayer({
        id: 'infra-dams-hit-target',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'dams']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 22,
          'circle-color': '#000000',
          'circle-opacity': 0.001
        }
      });

      // --- POWER PLANTS & CLEAN ENERGY ---
      map.addLayer({
        id: 'infra-power-halo',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'power_plants']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 13,
          'circle-color': '#eab308',
          'circle-blur': 0.8,
          'circle-opacity': 0.65
        }
      });

      map.addLayer({
        id: 'infra-power-core',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'power_plants']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 5.5,
          'circle-color': '#ffffff',
          'circle-stroke-width': 2.2,
          'circle-stroke-color': '#ca8a04'
        }
      });

      map.addLayer({
        id: 'infra-power-labels',
        type: 'symbol',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'power_plants']],
        layout: {
          'text-field': ['concat', '⚡ ', ['get', 'name']],
          'text-size': 9.5,
          'text-offset': [0, -1.3],
          'text-anchor': 'bottom',
          'text-allow-overlap': false,
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#fef08a',
          'text-halo-color': '#0f172a',
          'text-halo-width': 2
        }
      });

      map.addLayer({
        id: 'infra-power-hit-target',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'power_plants']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 22,
          'circle-color': '#000000',
          'circle-opacity': 0.001
        }
      });

      // --- SPECIAL ECONOMIC ZONES (SEZs) ---
      map.addLayer({
        id: 'infra-sez-halo',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'economic_zones']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 12,
          'circle-color': '#10b981',
          'circle-blur': 0.8,
          'circle-opacity': 0.65
        }
      });

      map.addLayer({
        id: 'infra-sez-core',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'economic_zones']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 5,
          'circle-color': '#ffffff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#059669'
        }
      });

      map.addLayer({
        id: 'infra-sez-labels',
        type: 'symbol',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'economic_zones']],
        layout: {
          'text-field': ['concat', '🏢 ', ['get', 'name']],
          'text-size': 9.5,
          'text-offset': [0, -1.3],
          'text-anchor': 'bottom',
          'text-allow-overlap': false,
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#a7f3d0',
          'text-halo-color': '#0f172a',
          'text-halo-width': 2
        }
      });

      map.addLayer({
        id: 'infra-sez-hit-target',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'economic_zones']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 22,
          'circle-color': '#000000',
          'circle-opacity': 0.001
        }
      });

      // --- MAJOR URBAN CENTRES (MEGACITIES) ---
      map.addLayer({
        id: 'infra-urban-halo',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'urban_centres']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 15,
          'circle-color': '#f97316',
          'circle-blur': 0.85,
          'circle-opacity': 0.7
        }
      });

      map.addLayer({
        id: 'infra-urban-core',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'urban_centres']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 6.5,
          'circle-color': '#ffffff',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#c2410c'
        }
      });

      map.addLayer({
        id: 'infra-urban-labels',
        type: 'symbol',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'urban_centres']],
        layout: {
          'text-field': ['concat', '🏙️ ', ['get', 'name']],
          'text-size': 10.5,
          'text-offset': [0, -1.3],
          'text-anchor': 'bottom',
          'text-allow-overlap': false,
          visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#fed7aa',
          'text-halo-color': '#0f172a',
          'text-halo-width': 2
        }
      });

      map.addLayer({
        id: 'infra-urban-hit-target',
        type: 'circle',
        source: 'infrastructure-economic',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['get', 'category'], 'urban_centres']],
        layout: { visibility: activeLayers.has('infrastructure_economic') ? 'visible' : 'none' },
        paint: {
          'circle-radius': 24,
          'circle-color': '#000000',
          'circle-opacity': 0.001
        }
      });

      // ========================================================
      // 4. DISASTER & SEISMIC RISK LAYERS
      // ========================================================

      // 4.1 BIS SEISMIC ZONES
      map.addLayer({
        id: 'seismic-zones-fill',
        type: 'fill',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', '$type', 'Polygon'], ['==', ['coalesce', ['get', 'hazard_type'], 'seismic_zone'], 'seismic_zone']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'fill-color': [
            'match', ['coalesce', ['get', 'zone_code'], ['get', 'zone_id']],
            'Zone V', '#ef4444',
            'ZONE_V', '#ef4444',
            'Zone IV', '#f97316',
            'ZONE_IV', '#f97316',
            'Zone III', '#eab308',
            'ZONE_III', '#eab308',
            'Zone II', '#3b82f6',
            'ZONE_II', '#3b82f6',
            ['coalesce', ['get', 'color'], '#ef4444']
          ],
          'fill-opacity': 0.35
        }
      });

      map.addLayer({
        id: 'seismic-zones-line',
        type: 'line',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', '$type', 'Polygon'], ['==', ['coalesce', ['get', 'hazard_type'], 'seismic_zone'], 'seismic_zone']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': [
            'match', ['coalesce', ['get', 'zone_code'], ['get', 'zone_id']],
            'Zone V', '#ef4444',
            'ZONE_V', '#ef4444',
            'Zone IV', '#f97316',
            'ZONE_IV', '#f97316',
            'Zone III', '#eab308',
            'ZONE_III', '#eab308',
            'Zone II', '#3b82f6',
            'ZONE_II', '#3b82f6',
            ['coalesce', ['get', 'border_color'], '#ef4444']
          ],
          'line-width': 2.2,
          'line-opacity': 0.85
        }
      });

      // 4.2 HISTORICAL EARTHQUAKES & EPICENTERS
      map.addLayer({
        id: 'earthquake-epicenter-glow',
        type: 'circle',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['coalesce', ['get', 'hazard_type'], 'earthquake'], 'earthquake']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 16,
          'circle-color': '#ef4444',
          'circle-blur': 0.9,
          'circle-opacity': 0.75
        }
      });

      map.addLayer({
        id: 'earthquake-epicenter-core',
        type: 'circle',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['coalesce', ['get', 'hazard_type'], 'earthquake'], 'earthquake']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': 6,
          'circle-color': '#ffffff',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#b91c1c'
        }
      });

      map.addLayer({
        id: 'earthquake-epicenter-labels',
        type: 'symbol',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', '$type', 'Point'], ['==', ['coalesce', ['get', 'hazard_type'], 'earthquake'], 'earthquake']],
        layout: {
          'text-field': ['concat', ['to-string', ['get', 'year']], ' ', ['get', 'name'], ' (M', ['to-string', ['coalesce', ['get', 'magnitude_mw'], ['get', 'magnitude']]], ')'],
          'text-size': 10.5,
          'text-offset': [0, -1.3],
          'text-anchor': 'bottom',
          'text-allow-overlap': false,
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#fecdd3',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      // 4.3 CYCLONE TRACKS
      map.addLayer({
        id: 'disaster-cyclones-casing',
        type: 'line',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'cyclone'], ['==', '$type', 'LineString']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none',
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#020617',
          'line-width': 5.5,
          'line-opacity': 0.8
        }
      });

      map.addLayer({
        id: 'disaster-cyclones-track',
        type: 'line',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'cyclone'], ['==', '$type', 'LineString']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none',
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': ['coalesce', ['get', 'color'], '#c026d3'],
          'line-width': 2.8,
          'line-dasharray': [2, 1]
        }
      });

      map.addLayer({
        id: 'disaster-cyclones-labels',
        type: 'symbol',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'cyclone'], ['==', '$type', 'LineString']],
        layout: {
          'text-field': ['concat', '🌀 ', ['get', 'name'], ' (', ['to-string', ['get', 'wind_speed_kmh']], ' km/h)'],
          'symbol-placement': 'line-center',
          'text-size': 11,
          'text-offset': [0, -0.8],
          'text-allow-overlap': false,
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f5d0fe',
          'text-halo-color': '#020617',
          'text-halo-width': 2.5
        }
      });

      // 4.4 FLOOD-PRONE BASINS
      map.addLayer({
        id: 'disaster-floods-fill',
        type: 'fill',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'flood'], ['==', '$type', 'Polygon']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'fill-color': '#0284c7',
          'fill-opacity': 0.35
        }
      });

      map.addLayer({
        id: 'disaster-floods-border',
        type: 'line',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'flood'], ['==', '$type', 'Polygon']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#38bdf8',
          'line-width': 2,
          'line-opacity': 0.85
        }
      });

      map.addLayer({
        id: 'disaster-floods-labels',
        type: 'symbol',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'flood'], ['==', '$type', 'Polygon']],
        layout: {
          'text-field': ['concat', '🌊 ', ['get', 'name']],
          'text-size': 10.5,
          'text-allow-overlap': false,
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#bae6fd',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      // 4.5 LANDSLIDE SUSCEPTIBILITY ZONES
      map.addLayer({
        id: 'disaster-landslides-fill',
        type: 'fill',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'landslide'], ['==', '$type', 'Polygon']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'fill-color': '#ea580c',
          'fill-opacity': 0.40
        }
      });

      map.addLayer({
        id: 'disaster-landslides-border',
        type: 'line',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'landslide'], ['==', '$type', 'Polygon']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#f97316',
          'line-width': 2.2,
          'line-opacity': 0.9
        }
      });

      map.addLayer({
        id: 'disaster-landslides-labels',
        type: 'symbol',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'landslide'], ['==', '$type', 'Polygon']],
        layout: {
          'text-field': ['concat', '⛰️ ', ['get', 'name']],
          'text-size': 10.5,
          'text-allow-overlap': false,
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#fed7aa',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      // 4.6 DROUGHT-PRONE REGIONS
      map.addLayer({
        id: 'disaster-droughts-fill',
        type: 'fill',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'drought'], ['==', '$type', 'Polygon']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'fill-color': '#b45309',
          'fill-opacity': 0.34
        }
      });

      map.addLayer({
        id: 'disaster-droughts-border',
        type: 'line',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'drought'], ['==', '$type', 'Polygon']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#f59e0b',
          'line-width': 1.8,
          'line-dasharray': [3, 2]
        }
      });

      map.addLayer({
        id: 'disaster-droughts-labels',
        type: 'symbol',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'drought'], ['==', '$type', 'Polygon']],
        layout: {
          'text-field': ['concat', '☀️ ', ['get', 'name']],
          'text-size': 10.5,
          'text-allow-overlap': false,
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#fde68a',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      // 4.7 TSUNAMI HAZARD ZONES
      map.addLayer({
        id: 'disaster-tsunami-fill',
        type: 'fill',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'tsunami'], ['==', '$type', 'Polygon']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'fill-color': '#06b6d4',
          'fill-opacity': 0.4
        }
      });

      map.addLayer({
        id: 'disaster-tsunami-line',
        type: 'line',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'tsunami'], ['!=', '$type', 'Point']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#22d3ee',
          'line-width': 3.5,
          'line-opacity': 0.9
        }
      });

      map.addLayer({
        id: 'disaster-tsunami-labels',
        type: 'symbol',
        source: 'disaster-seismic-zones',
        filter: ['==', ['get', 'hazard_type'], 'tsunami'],
        layout: {
          'text-field': ['concat', '🚨 ', ['get', 'name']],
          'text-size': 10.5,
          'text-allow-overlap': false,
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#a5f3fc',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      // 4.8 HEATWAVE RISK ZONES
      map.addLayer({
        id: 'disaster-heatwaves-fill',
        type: 'fill',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'heatwave'], ['==', '$type', 'Polygon']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'fill-color': '#e11d48',
          'fill-opacity': 0.35
        }
      });

      map.addLayer({
        id: 'disaster-heatwaves-border',
        type: 'line',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'heatwave'], ['==', '$type', 'Polygon']],
        layout: {
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'line-color': '#f43f5e',
          'line-width': 2,
          'line-opacity': 0.85
        }
      });

      map.addLayer({
        id: 'disaster-heatwaves-labels',
        type: 'symbol',
        source: 'disaster-seismic-zones',
        filter: ['all', ['==', ['get', 'hazard_type'], 'heatwave'], ['==', '$type', 'Polygon']],
        layout: {
          'text-field': ['concat', '🌡️ ', ['get', 'name'], ' (', ['to-string', ['get', 'max_recorded_temp_c']], '°C)'],
          'text-size': 10.5,
          'text-allow-overlap': false,
          visibility: activeLayers.has('disaster_seismic') ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#fecdd3',
          'text-halo-color': '#020617',
          'text-halo-width': 2
        }
      });

      // ========================================================
      // TYPOGRAPHY & ELEVATION HIGHLIGHTS
      // ========================================================

      map.addLayer({
        id: 'states-label',
        type: 'symbol',
        source: 'state-centroids',
        layout: {
          'text-field': ['get', 'shapeName'],
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            4, 9,
            6, 12,
            9, 16
          ],
          'text-letter-spacing': 0.08,
          'text-max-width': 8,
          'text-transform': 'uppercase',
          'text-allow-overlap': false
        },
        paint: {
          'text-color': '#f1f5f9',
          'text-halo-color': '#020617',
          'text-halo-width': 2,
          'text-halo-blur': 1,
          'text-opacity': 0.88
        }
      });

      // Pan-India Elevation Highlight: Natural Soft Hypsometric Terrain Tint
      map.addLayer({
        id: 'elevation-heatmap',
        type: 'heatmap',
        source: 'india-elevation-points',
        layout: {
          visibility: isElevationHighlight ? 'visible' : 'none'
        },
        paint: {
          'heatmap-weight': [
            'interpolate', ['linear'], ['get', 'elevation_m'],
            0, 0.05,
            500, 0.15,
            1500, 0.35,
            2700, 0.65,
            7000, 0.95,
            8586, 1.2
          ],
          'heatmap-intensity': [
            'interpolate', ['linear'], ['zoom'],
            4, 1.0,
            7, 1.8
          ],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',
            0.15, 'rgba(58, 146, 155, 0.18)',   // Turquoise coastal lowlands
            0.35, 'rgba(164, 213, 178, 0.28)',  // Sage alluvial plains
            0.55, 'rgba(217, 203, 171, 0.38)',  // Warm parchment plateaus
            0.75, 'rgba(194, 65, 12, 0.55)',    // Terracotta mountain ridges
            0.92, 'rgba(255, 238, 214, 0.7)',   // Sunlit alpine ridges
            0.99, 'rgba(255, 255, 255, 0.85)'   // Permanent glacial summits
          ],
          'heatmap-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 45,
            7, 75,
            10, 110
          ],
          'heatmap-opacity': 0.55
        }
      });

      // Pan-India Elevation Highlight: Natural Terrain Footprint Glow
      map.addLayer({
        id: 'elevation-natural-glow',
        type: 'circle',
        source: 'india-elevation-points',
        layout: {
          visibility: isElevationHighlight ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['get', 'elevation_m'],
            0, 4,
            500, 6,
            1500, 10,
            2700, 14,
            7000, 20,
            8586, 26
          ],
          'circle-color': [
            'interpolate', ['linear'], ['get', 'elevation_m'],
            0, '#3a929b',
            500, '#a4d5b2',
            1500, '#d9cbab',
            2700, '#c2410c',
            5000, '#ea580c',
            7500, '#fffbeb'
          ],
          'circle-blur': 0.85,
          'circle-opacity': 0.6
        }
      });

      // Pan-India Elevation Highlight: Natural Faceted Topographic Summit Peak Glyphs
      map.addLayer({
        id: 'elevation-natural-summit',
        type: 'symbol',
        source: 'india-elevation-points',
        layout: {
          'icon-image': 'natural-summit-peak',
          'icon-anchor': 'bottom',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-size': [
            'interpolate', ['linear'], ['get', 'elevation_m'],
            0, 0.35,
            500, 0.45,
            1500, 0.58,
            2700, 0.75,
            5000, 0.9,
            8586, 1.05
          ],
          visibility: isElevationHighlight ? 'visible' : 'none'
        }
      });

      // Pan-India Elevation Highlight: Natural Topographic Spot Height Core
      map.addLayer({
        id: 'elevation-natural-spot-core',
        type: 'circle',
        source: 'india-elevation-points',
        layout: {
          visibility: isElevationHighlight ? 'visible' : 'none'
        },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['get', 'elevation_m'],
            0, 2.0,
            1500, 2.8,
            2700, 3.5,
            8586, 4.2
          ],
          'circle-color': '#ffffff',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': [
            'interpolate', ['linear'], ['get', 'elevation_m'],
            0, '#3a929b',
            1500, '#c2410c',
            2700, '#ea580c',
            8586, '#7c2d12'
          ]
        }
      });

      // Pan-India Elevation Highlight: Natural Topographic Summit Typography
      map.addLayer({
        id: 'elevation-natural-labels',
        type: 'symbol',
        source: 'india-elevation-points',
        layout: {
          'text-field': ['concat', ['get', 'name'], '\n', ['get', 'elevation_ft_in']],
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            4, 9,
            7, 11,
            10, 13
          ],
          'text-offset': [0, -1.2],
          'text-anchor': 'bottom',
          'text-allow-overlap': false,
          visibility: isElevationHighlight ? 'visible' : 'none'
        },
        paint: {
          'text-color': '#f8fafc',
          'text-halo-color': '#080c14',
          'text-halo-width': 2.0,
          'text-halo-blur': 0.5,
          'text-opacity': 0.92
        }
      });

      // ========================================================
      // SEARCH & TIMELINE EVENT HIGHLIGHT (rendered above all data layers)
      // ========================================================
      map.addLayer({
        id: 'search-highlight-fill',
        type: 'fill',
        source: 'search-highlight',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': ['coalesce', ['get', 'color'], '#f59e0b'],
          'fill-opacity': ['coalesce', ['get', 'fill_opacity'], 0.48],
          'fill-outline-color': ['coalesce', ['get', 'border_color'], '#ffffff']
        }
      });

      map.addLayer({
        id: 'search-highlight-polygon-glow',
        type: 'line',
        source: 'search-highlight',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'line-color': ['coalesce', ['get', 'border_color'], ['get', 'color'], '#f59e0b'],
          'line-width': ['coalesce', ['get', 'glow_width'], 8.0],
          'line-opacity': 0.7,
          'line-blur': 3.0
        }
      });

      map.addLayer({
        id: 'search-highlight-polygon-line',
        type: 'line',
        source: 'search-highlight',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'line-color': ['coalesce', ['get', 'border_color'], '#ffffff'],
          'line-width': ['coalesce', ['get', 'stroke_width'], 3.5],
          'line-opacity': 1.0
        }
      });

      map.addLayer({
        id: 'search-highlight-line-casing',
        type: 'line',
        source: 'search-highlight',
        filter: ['==', '$type', 'LineString'],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#050811',
          'line-width': 12,
          'line-opacity': 0.85
        }
      });

      map.addLayer({
        id: 'search-highlight-line-glow',
        type: 'line',
        source: 'search-highlight',
        filter: ['==', '$type', 'LineString'],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': ['coalesce', ['get', 'color'], '#fbbf24'],
          'line-width': 7.0,
          'line-opacity': 0.9,
          'line-blur': 1.5
        }
      });

      map.addLayer({
        id: 'search-highlight-line',
        type: 'line',
        source: 'search-highlight',
        filter: ['==', '$type', 'LineString'],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': ['coalesce', ['get', 'border_color'], '#ffffff'],
          'line-width': 3.0,
          'line-opacity': 1.0
        }
      });

      map.addLayer({
        id: 'search-highlight-point-pulse',
        type: 'circle',
        source: 'search-highlight',
        filter: ['==', '$type', 'Point'],
        paint: {
          'circle-radius': 30,
          'circle-color': ['coalesce', ['get', 'pulse_color'], 'rgba(245, 158, 11, 0.22)'],
          'circle-stroke-color': ['coalesce', ['get', 'color'], '#f59e0b'],
          'circle-stroke-width': 2.5
        }
      });

      map.addLayer({
        id: 'search-highlight-point',
        type: 'circle',
        source: 'search-highlight',
        filter: ['==', '$type', 'Point'],
        paint: {
          'circle-radius': 11,
          'circle-color': ['coalesce', ['get', 'color'], '#f59e0b'],
          'circle-stroke-width': 3.5,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 1.0
        }
      });

      map.addLayer({
        id: 'search-highlight-label',
        type: 'symbol',
        source: 'search-highlight',
        filter: ['==', '$type', 'Point'],
        layout: {
          'text-field': ['coalesce', ['get', 'label_text'], ''],
          'text-size': 11,
          'text-offset': [0, -1.8],
          'text-anchor': 'bottom',
          'text-allow-overlap': true,
          'text-ignore-placement': true
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#020617',
          'text-halo-width': 2.5
        }
      });

      // Apply initial active layer styles immediately upon load
      applyLayerStyles(map);

      // River and Trade Route flow animation ticker
      let flowStep = 0;
      if (flowIntervalRef.current) clearInterval(flowIntervalRef.current);
      flowIntervalRef.current = setInterval(() => {
        const m = mapRef.current;
        if (!m || !m.isStyleLoaded()) return;

        // Rivers dasharray
        if (m.getLayer('rivers-flow') && m.getLayoutProperty('rivers-flow', 'visibility') !== 'none') {
          m.setPaintProperty('rivers-flow', 'line-dasharray', [
            (flowStep % 3) + 0.1,
            3,
            2
          ]);
        }

        // Trade route dasharray
        if (m.getLayer('trade-flow') && m.getLayoutProperty('trade-flow', 'visibility') !== 'none') {
          m.setPaintProperty('trade-flow', 'line-dasharray', [
            (flowStep % 4) + 0.5,
            4
          ]);
        }

        flowStep = (flowStep + 1) % 16;
      }, 150);

      // Intelligent Mouse Hover (mouse/pointer devices only — touch selects features)
      map.on('mousemove', (e: MapMouseEvent) => {
        if (!hoverSupportedRef.current) return;
        // Coalesce rapid pointer events to ~60fps to avoid jank when hovering
        // the large district / state GeoJSON sources.
        const now = performance.now();
        if (now - lastHoverTsRef.current < 16) return;
        lastHoverTsRef.current = now;

        const features = map.queryRenderedFeatures(e.point, {
          layers: [
            'archaeology-core',
            'archaeology-inner-pip',
            'earthquake-epicenter-core',
            'seismic-zones-fill',
            'disaster-cyclones-track',
            'disaster-floods-fill',
            'disaster-landslides-fill',
            'disaster-droughts-fill',
            'disaster-tsunami-line',
            'disaster-tsunami-fill',
            'disaster-heatwaves-fill',
            'infra-railways-hit-target',
            'infra-railways-points-hit-target',
            'infra-corridors-hit-target',
            'infra-airports-hit-target',
            'infra-seaports-hit-target',
            'infra-dams-hit-target',
            'infra-power-hit-target',
            'infra-sez-hit-target',
            'infra-urban-hit-target',
            'trade-hit-target',
            'trade-core',
            'trade-railways',
            'trade-ports-hit-target',
            'trade-ports-core',
            'roads-hit-target',
            'roads-core',
            'empires-fill',
            'elevation-natural-summit',
            'elevation-natural-spot-core',
            'urban-nodes-halo',
            'env-points-hit-target',
            'env-points-core',
            'env-lines-hit-target',
            'env-lines-core',
            'env-polygons-hit-target',
            'env-polygons-fill',
            'rivers-hit-target',
            'rivers-core',
            'mountains-hit-target',
            'mountains-line',
            'soils-fill',
            'districts-fill',
            'states-fill'
          ].filter(id => Boolean(map.getLayer(id)))
        });

        if (features.length > 0) {
          map.getCanvas().style.cursor = 'pointer';
          const topFeat = features[0];
          const props = topFeat.properties || {};

          let title = props.clean_name || props.shapeName || props.name || 'Geographical Feature';
          let featType = 'FEATURE';
          let subtitle = props.river_system || props.category || props.type || '';
          let metricLabel = undefined;
          let metricValue = undefined;
          let source = props.source || 'Verified Government Data';

          if (topFeat.layer.id === 'empires-fill') {
            featType = 'HISTORICAL EMPIRE';
            title = props.name || 'Historical Empire';
            subtitle = `${props.era || ''} • Capital: ${props.capital || ''}`;
            metricLabel = 'Approx. Extent';
            metricValue = props.approximate_area_sqkm ? `${props.approximate_area_sqkm.toLocaleString()} km²` : 'Scholarly Reconstruction';
            source = 'Archaeological Survey of India / Historical Atlas';
          } else if (topFeat.layer.id.startsWith('archaeology-')) {
            featType = 'ARCHAEOLOGICAL SITE';
            title = props.name || 'Archaeological Site';
            subtitle = `${props.category_display || props.category || ''} (${props.period || ''})`;
            metricLabel = 'Discovery';
            metricValue = `${props.excavator || props.excavators || 'ASI Survey'} (${props.discovery_year || ''})`;
            source = 'Archaeological Survey of India (ASI)';
          } else if (topFeat.layer.id.startsWith('trade-')) {
            const isPort = props.category === 'ancient_port';
            featType = isPort ? 'ANCIENT PORT & EMPORIUM' : (props.category_display ? props.category_display.toUpperCase() : 'HISTORICAL TRADE ROUTE');
            title = props.name || 'Trade Corridor';
            subtitle = props.era || props.era_active || 'Historical Artery';
            metricLabel = isPort ? 'Location' : (props.total_length_km ? 'Length' : 'Commodities');
            metricValue = isPort 
              ? (props.location_desc || 'Historic Seaport')
              : (props.total_length_km ? `${props.total_length_km.toLocaleString()} km` : (props.commodities || 'Trade Artery'));
            source = props.citation || 'Archaeological Survey of India (ASI) / Project Mausam';
          } else if (topFeat.layer.id.startsWith('roads-')) {
            featType = props.category === 'Expressway' ? 'EXPRESSWAY' : props.category === 'State Highway' ? 'STATE HIGHWAY' : 'NATIONAL HIGHWAY';
            title = `${props.code ? props.code + ' — ' : ''}${props.name || 'Road Corridor'}`;
            subtitle = `${props.from || ''} → ${props.to || ''}`;
            metricLabel = 'Route Length';
            metricValue = props.length_km ? `${props.length_km.toLocaleString()} km` : (props.corridor || 'Road Corridor');
            source = props.source || 'MoRTH / NHAI';
          } else if (topFeat.layer.id.startsWith('infra-')) {
            const cat = props.category || '';
            featType = cat === 'highways' ? 'NATIONAL HIGHWAY'
              : cat === 'railways' ? 'RAIL & FREIGHT CORRIDOR'
              : cat === 'airports' ? 'MAJOR HUB AIRPORT'
              : cat === 'seaports' ? 'MAJOR SEAPORT'
              : cat === 'industrial_corridors' ? 'INDUSTRIAL CORRIDOR'
              : cat === 'dams' ? 'MULTIPURPOSE DAM'
              : cat === 'power_plants' ? 'MEGA POWER PLANT'
              : cat === 'economic_zones' ? 'SPECIAL ECONOMIC ZONE'
              : 'METROPOLITAN URBAN CENTRE';
            title = props.name || 'Infrastructure Asset';
            subtitle = `${props.sub_type || cat.toUpperCase()} • ${props.state || 'India'}`;
            metricLabel = props.iata_code ? 'IATA / MPPA'
              : props.cargo_mmt ? 'Cargo Capacity'
              : props.installed_capacity_mw ? 'Capacity'
              : props.population_metro ? 'Metro Population'
              : props.length_km ? 'Length'
              : 'Official Asset';
            metricValue = props.iata_code ? `${props.iata_code} • ${props.passengers_mppa || '—'} MPPA`
              : props.cargo_mmt ? `${props.cargo_mmt} MMT/yr`
              : props.installed_capacity_mw ? `${props.installed_capacity_mw.toLocaleString()} MW`
              : props.population_metro ? `${props.population_metro} (${props.metro_gdp_usd || ''})`
              : props.length_km ? `${props.length_km} km`
              : (props.authority || 'Government of India');
            source = props.authority || 'Government of India';
          } else if (topFeat.layer.id.startsWith('env-')) {
            featType = 'ENVIRONMENTAL CHANGE';
            title = props.name || 'Environmental Hotspot';
            subtitle = `${props.category_name || 'Climate Change'} • ${props.region || ''}`;
            metricLabel = 'Assessment Delta';
            metricValue = props.delta_text || props.comparison_text || 'Multi-Decadal Shift';
            source = props.source_authority || 'Forest Survey of India / ISRO-SAC';
          } else if (topFeat.layer.id.startsWith('earthquake-epicenter-')) {
            featType = 'HISTORICAL EARTHQUAKE';
            title = `${props.year || ''} ${props.name}`;
            subtitle = `Fault: ${props.fault_system || props.tectonic_setting || 'Tectonic Plate Boundary'}`;
            metricLabel = 'Magnitude';
            metricValue = `M ${props.magnitude_mw || props.magnitude} (Depth: ${props.depth_km || '—'} km)`;
            source = props.authority || 'National Centre for Seismology / IMD';
          } else if (topFeat.layer.id === 'seismic-zones-fill') {
            featType = 'SEISMIC HAZARD ZONE';
            title = `${props.zone_code || props.zone_name || props.zone_id}`;
            subtitle = `Zone Factor Z = ${props.zone_factor_z || '0.36'} • ${props.hazard_level || 'High Risk'}`;
            metricLabel = 'Peak Ground Accel';
            metricValue = props.peak_ground_accel || '0.36g';
            source = props.authority || 'Bureau of Indian Standards (BIS 1893:2016)';
          } else if (topFeat.layer.id.startsWith('disaster-cyclones-')) {
            featType = 'TROPICAL CYCLONE TRACK';
            title = props.name;
            subtitle = `${props.cyclone_category || 'Cyclonic Storm'} • ${props.region_name || 'Coastal'}`;
            metricLabel = 'Max Wind Speed';
            metricValue = props.wind_speed_kmh ? `${props.wind_speed_kmh} km/h (Surge: ${props.storm_surge_m}m)` : 'Severe Storm';
            source = props.authority || 'India Meteorological Department (IMD)';
          } else if (topFeat.layer.id.startsWith('disaster-floods-')) {
            featType = 'FLOOD-PRONE BASIN';
            title = props.name;
            subtitle = `${props.basin_name || 'River Basin'} • ${props.region_name || 'Floodplain'}`;
            metricLabel = 'Inundated Area';
            metricValue = props.inundated_sqkm ? `${props.inundated_sqkm.toLocaleString()} sq km` : (props.hazard_level || 'High Risk');
            source = props.authority || 'Central Water Commission (CWC) / NDMA';
          } else if (topFeat.layer.id.startsWith('disaster-landslides-')) {
            featType = 'LANDSLIDE SUSCEPTIBILITY';
            title = props.name;
            subtitle = `${props.susceptibility_rating || 'High Susceptibility'} • ${props.region_name || 'Himalayan/Ghats'}`;
            metricLabel = 'Rock Formation';
            metricValue = props.rock_formation || 'Fragile Metasediments';
            source = props.authority || 'Geological Survey of India (GSI NLSM)';
          } else if (topFeat.layer.id.startsWith('disaster-droughts-')) {
            featType = 'DROUGHT-PRONE REGION';
            title = props.name;
            subtitle = `${props.hazard_level || 'Chronic Drought'} • ${props.region_name || 'Peninsular'}`;
            metricLabel = 'Aridity Index';
            metricValue = props.aridity_index || 'Semi-Arid';
            source = props.authority || 'Central Water Commission / IMD';
          } else if (topFeat.layer.id.startsWith('disaster-tsunami-')) {
            featType = 'TSUNAMI HAZARD BUFFER';
            title = props.name;
            subtitle = `${props.hazard_level || 'Inundation Buffer'} • ${props.region_name || 'Coastline'}`;
            metricLabel = 'Max Run-up';
            metricValue = props.max_runup_m ? `${props.max_runup_m} m Run-up` : 'Inundation Zone';
            source = props.authority || 'INCOIS (Indian Tsunami Early Warning Centre)';
          } else if (topFeat.layer.id.startsWith('disaster-heatwaves-')) {
            featType = 'SEVERE HEATWAVE ZONE';
            title = props.name;
            subtitle = `${props.hazard_level || 'Extreme Heat Core'} • ${props.region_name || 'Interior'}`;
            metricLabel = 'Max Recorded Temp';
            metricValue = props.max_recorded_temp_c ? `${props.max_recorded_temp_c}°C (Avg ${props.avg_heatwave_days || 15} days/yr)` : 'Extreme Heat';
            source = props.authority || 'India Meteorological Department (IMD)';
          } else if (topFeat.layer.id.startsWith('elevation-natural-')) {
            featType = 'NATURAL MOUNTAIN SUMMIT';
            title = props.name || 'Topographic Summit';
            subtitle = `${props.zone || 'Physiographic Feature'} • ${props.category || 'Peak'}`;
            metricLabel = 'Elevation (Ft & In)';
            metricValue = `${props.elevation_ft_in} (${props.elevation_m >= 0 ? props.elevation_m + ' m' : props.elevation_m + ' m below sea level'})`;
            source = 'Survey of India / NASA SRTM 30m';
          } else if (topFeat.layer.id === 'urban-nodes-halo') {
            featType = 'URBAN NODE';
            subtitle = props.type || 'Metropolitan Hub';
            metricLabel = 'Night Light Hub';
            metricValue = `${props.intensity?.toUpperCase() || 'HIGH'} EMISSION`;
            source = 'NASA Black Marble / ISRO';
          } else if (topFeat.layer.id.startsWith('rivers-')) {
            featType = 'RIVER';
            subtitle = props.river_system || 'River Basin';
            if (props.length_km) {
              metricLabel = 'Course Length';
              metricValue = `${props.length_km.toLocaleString()} km`;
            }
          } else if (topFeat.layer.id.startsWith('mountains-')) {
            featType = 'MOUNTAIN RANGE';
            subtitle = props.type || 'Relief System';
            if (props.peak) {
              metricLabel = 'Highest Peak';
              metricValue = `${props.peak} — ${formatElevationDual(props.elevation_m)}`;
            }
          } else if (topFeat.layer.id === 'soils-fill') {
            featType = 'SOIL CLASSIFICATION';
            subtitle = props.suitability ? `Crops: ${props.suitability.split(',')[0]}` : 'ICAR Classification';
            if (props.area_pct) {
              metricLabel = 'National Share';
              metricValue = `${props.area_pct}% of India`;
            }
          } else if (topFeat.layer.id === 'districts-fill') {
            featType = 'DISTRICT';
            subtitle = props.state_name ? `State: ${props.state_name}` : 'District Boundary';
            if (activeLayers.has('pop_density') && props.density_2011) {
              metricLabel = 'Density';
              metricValue = `${props.density_2011.toLocaleString()} / km²`;
            } else if (activeLayers.has('pop_total') && props.population_2011) {
              metricLabel = 'Population';
              metricValue = props.population_2011.toLocaleString();
            } else if (activeLayers.has('literacy') && props.literacy_rate) {
              metricLabel = 'Literacy';
              metricValue = `${props.literacy_rate}%`;
            } else if (activeLayers.has('sex_ratio') && props.sex_ratio) {
              metricLabel = 'Sex Ratio';
              metricValue = `${props.sex_ratio} F / 1000 M`;
            } else if (activeLayers.has('religion')) {
              const relVal = props[`${religionFilter}_pct`];
              if (relVal !== undefined) {
                metricLabel = `${religionFilter.toUpperCase()} Share`;
                metricValue = `${relVal}%`;
              }
            } else if (props.population_2011) {
              metricLabel = 'Population';
              metricValue = props.population_2011.toLocaleString();
            }
          } else if (topFeat.layer.id === 'states-fill') {
            featType = 'STATE / UT';
            subtitle = props.capital ? `Capital: ${props.capital}` : 'State Boundary';
            if (props.population_2011) {
              metricLabel = 'Population';
              metricValue = `${props.population_2011.toLocaleString()} (${props.density_2011} / km²)`;
            }
          }

          const rect = map.getCanvasContainer().getBoundingClientRect();
          const clientX = rect.left + e.point.x;
          const clientY = rect.top + e.point.y - 14;
          const hoverKey = [
            featType,
            title,
            subtitle || '',
            metricLabel || '',
            metricValue || '',
            Math.round(clientX / 6),
            Math.round(clientY / 6)
          ].join('|');

          if (hoverKey !== lastHoverKeyRef.current) {
            lastHoverKeyRef.current = hoverKey;
            setHoveredTooltip({
              x: clientX,
              y: clientY,
              title,
              type: featType,
              subtitle,
              metricLabel,
              metricValue,
              source
            });
          }
        } else {
          map.getCanvas().style.cursor = '';
          lastHoverKeyRef.current = '';
          setHoveredTooltip(null);
        }
      });

      map.getCanvas().addEventListener('mouseleave', () => {
        setHoveredTooltip(null);
      });

      // Robust Click Selection with Two-Stage Mobile Hit Resolution
      map.on('click', (e: MapMouseEvent) => {
        // Generous touch buffer for mobile fingers (24px radius = 48x48px touch zone)
        const touchRadius = 24;
        const touchBbox: [[number, number], [number, number]] = [
          [e.point.x - touchRadius, e.point.y - touchRadius],
          [e.point.x + touchRadius, e.point.y + touchRadius]
        ];

        // 1. High priority linear & discrete point layers (highways, mountains, rivers, trade, archaeological sites, summits)
        const priorityLinearPointLayers = [
          'infra-railways-hit-target',
          'infra-railways-points-hit-target',
          'infra-corridors-hit-target',
          'infra-airports-hit-target',
          'infra-seaports-hit-target',
          'infra-dams-hit-target',
          'infra-power-hit-target',
          'infra-sez-hit-target',
          'infra-urban-hit-target',
          'infra-railways-core',
          'infra-railways-points-core',
          'infra-corridors-core',
          'infra-airports-core',
          'infra-seaports-core',
          'infra-dams-core',
          'infra-power-core',
          'infra-sez-core',
          'infra-urban-core',
          'roads-hit-target',
          'roads-core',
          'roads-casing',
          'roads-label',
          'mountains-hit-target',
          'mountains-line',
          'mountains-glow',
          'rivers-hit-target',
          'rivers-core',
          'rivers-glow',
          'rivers-flow',
          'trade-hit-target',
          'trade-core',
          'trade-glow',
          'trade-flow',
          'trade-railways',
          'trade-ports-hit-target',
          'trade-ports-core',
          'archaeology-core',
          'archaeology-inner-pip',
          'archaeology-glow',
          'earthquake-epicenter-core',
          'disaster-cyclones-track',
          'disaster-tsunami-line',
          'elevation-natural-summit',
          'elevation-natural-spot-core',
          'env-points-hit-target',
          'env-points-core',
          'env-lines-hit-target',
          'env-lines-core',
          'env-polygons-hit-target'
        ].filter(id => Boolean(map.getLayer(id)));

        // 2. Low priority background polygon layers (districts, states, soils, empires, seismic zones, env polygons)
        const polygonLayers = [
          'env-polygons-fill',
          'seismic-zones-fill',
          'disaster-floods-fill',
          'disaster-landslides-fill',
          'disaster-droughts-fill',
          'disaster-tsunami-fill',
          'disaster-heatwaves-fill',
          'empires-fill',
          'soils-fill',
          'districts-fill',
          'states-fill'
        ].filter(id => Boolean(map.getLayer(id)));

        // Stage 1: Check for direct linear/point hits at tap point
        const directLinearHits = map.queryRenderedFeatures(e.point, { layers: priorityLinearPointLayers });
        let features: MapGeoJSONFeature[] = [];

        if (directLinearHits && directLinearHits.length > 0) {
          features = directLinearHits;
        } else {
          // Stage 2: If tap landed slightly off the line (typical mobile touch), search within the 48x48px touch zone
          const bufferedHits = map.queryRenderedFeatures(touchBbox, { layers: priorityLinearPointLayers });
          if (bufferedHits && bufferedHits.length > 0) {
            // Sort by proximity to tap point
            features = sortFeaturesByProximity(bufferedHits, e.point, map);
          } else {
            // Stage 3: Only if no linear/point feature was anywhere near the tap, query background polygon at tap point
            features = map.queryRenderedFeatures(e.point, { layers: polygonLayers });
          }
        }

        const clearHighlights = () => {
          if (map.getLayer('states-highlight')) map.setFilter('states-highlight', ['==', 'shapeName', '']);
          if (map.getLayer('states-highlight-fill')) map.setFilter('states-highlight-fill', ['==', 'shapeName', '']);
          if (map.getLayer('districts-highlight-line')) map.setFilter('districts-highlight-line', ['==', 'shapeName', '']);
          if (map.getLayer('districts-highlight-fill')) map.setFilter('districts-highlight-fill', ['==', 'shapeName', '']);
          if (map.getLayer('rivers-highlight')) map.setFilter('rivers-highlight', ['==', 'clean_name', '']);
          if (map.getLayer('mountains-highlight')) map.setFilter('mountains-highlight', ['==', 'name', '']);
          if (map.getLayer('roads-highlight')) map.setFilter('roads-highlight', ['==', 'code', '']);
          if (map.getLayer('env-highlight-fill')) map.setFilter('env-highlight-fill', ['==', ['id'], '']);
          if (map.getLayer('env-highlight-border')) map.setFilter('env-highlight-border', ['==', ['id'], '']);
          if (map.getLayer('env-highlight-line')) map.setFilter('env-highlight-line', ['==', ['id'], '']);
          if (map.getLayer('env-highlight-point')) map.setFilter('env-highlight-point', ['==', ['id'], '']);
          if ((map as any)._activeInfraMarker) {
            try { (map as any)._activeInfraMarker.remove(); } catch {}
            (map as any)._activeInfraMarker = null;
          }
          const searchHighlightSrc = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
          if (searchHighlightSrc) searchHighlightSrc.setData({ type: 'FeatureCollection', features: [] });
        };

        if (features.length > 0) {
          clearHighlights();
          const topFeat = features[0];
          const props = topFeat.properties || {};
          const name = props.clean_name || props.shapeName || props.name || 'Feature';
          
          let featType: SelectedFeatureInfo['type'] = 'state';

          if (topFeat.layer.id.startsWith('roads-')) {
            featType = 'highway';
            if (map.getLayer('roads-highlight')) {
              map.setFilter('roads-highlight', ['==', 'code', props.code || '']);
            }
          } else if (topFeat.layer.id.startsWith('mountains-')) {
            featType = 'mountain';
            if (map.getLayer('mountains-highlight')) {
              map.setFilter('mountains-highlight', ['==', 'name', props.name || '']);
            }
          } else if (topFeat.layer.id.startsWith('rivers-')) {
            featType = 'river';
            if (map.getLayer('rivers-highlight')) {
              map.setFilter('rivers-highlight', ['==', 'clean_name', props.clean_name || '']);
            }
          } else if (topFeat.layer.id.startsWith('trade-')) {
            featType = 'trade_route';
          } else if (topFeat.layer.id.startsWith('env-')) {
            featType = 'environmental_change';
            const featId = props.id || '';
            const envFilter: any = featId
              ? ['any', ['==', ['get', 'id'], featId], ['==', ['id'], featId], ['==', ['get', 'name'], name || featId]]
              : ['==', ['id'], ''];
            if (map.getLayer('env-highlight-fill')) map.setFilter('env-highlight-fill', envFilter);
            if (map.getLayer('env-highlight-border')) map.setFilter('env-highlight-border', envFilter);
            if (map.getLayer('env-highlight-line')) map.setFilter('env-highlight-line', envFilter);
            if (map.getLayer('env-highlight-point')) map.setFilter('env-highlight-point', envFilter);

            const searchHighlightSrc = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
            if (searchHighlightSrc && topFeat.geometry) {
              searchHighlightSrc.setData({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: topFeat.geometry,
                  properties: topFeat.properties
                }]
              });
            }
          } else if (topFeat.layer.id.startsWith('archaeology-')) {
            featType = 'archaeological_site';
          } else if (topFeat.layer.id.startsWith('earthquake-epicenter-')) {
            featType = 'earthquake_epicenter';
            const searchHighlightSrc = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
            if (searchHighlightSrc && topFeat.geometry) {
              searchHighlightSrc.setData({
                type: 'FeatureCollection',
                features: [{ type: 'Feature', geometry: topFeat.geometry, properties: topFeat.properties }]
              });
            }
          } else if (topFeat.layer.id === 'seismic-zones-fill') {
            featType = 'seismic_zone';
            const searchHighlightSrc = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
            if (searchHighlightSrc && topFeat.geometry) {
              searchHighlightSrc.setData({
                type: 'FeatureCollection',
                features: [{ type: 'Feature', geometry: topFeat.geometry, properties: topFeat.properties }]
              });
            }
          } else if (topFeat.layer.id.startsWith('disaster-cyclones-')) {
            featType = 'cyclone_track';
            const searchHighlightSrc = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
            if (searchHighlightSrc && topFeat.geometry) {
              searchHighlightSrc.setData({
                type: 'FeatureCollection',
                features: [{ type: 'Feature', geometry: topFeat.geometry, properties: topFeat.properties }]
              });
            }
          } else if (topFeat.layer.id.startsWith('disaster-floods-')) {
            featType = 'flood_zone';
            const searchHighlightSrc = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
            if (searchHighlightSrc && topFeat.geometry) {
              searchHighlightSrc.setData({
                type: 'FeatureCollection',
                features: [{ type: 'Feature', geometry: topFeat.geometry, properties: topFeat.properties }]
              });
            }
          } else if (topFeat.layer.id.startsWith('disaster-landslides-')) {
            featType = 'landslide_zone';
            const searchHighlightSrc = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
            if (searchHighlightSrc && topFeat.geometry) {
              searchHighlightSrc.setData({
                type: 'FeatureCollection',
                features: [{ type: 'Feature', geometry: topFeat.geometry, properties: topFeat.properties }]
              });
            }
          } else if (topFeat.layer.id.startsWith('disaster-droughts-')) {
            featType = 'drought_zone';
            const searchHighlightSrc = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
            if (searchHighlightSrc && topFeat.geometry) {
              searchHighlightSrc.setData({
                type: 'FeatureCollection',
                features: [{ type: 'Feature', geometry: topFeat.geometry, properties: topFeat.properties }]
              });
            }
          } else if (topFeat.layer.id.startsWith('disaster-tsunami-')) {
            featType = 'tsunami_zone';
            const searchHighlightSrc = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
            if (searchHighlightSrc && topFeat.geometry) {
              searchHighlightSrc.setData({
                type: 'FeatureCollection',
                features: [{ type: 'Feature', geometry: topFeat.geometry, properties: topFeat.properties }]
              });
            }
          } else if (topFeat.layer.id.startsWith('disaster-heatwaves-')) {
            featType = 'heatwave_zone';
            const searchHighlightSrc = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
            if (searchHighlightSrc && topFeat.geometry) {
              searchHighlightSrc.setData({
                type: 'FeatureCollection',
                features: [{ type: 'Feature', geometry: topFeat.geometry, properties: topFeat.properties }]
              });
            }
          } else if (topFeat.layer.id.startsWith('infra-')) {
            const cat = props.category || '';
            featType = cat === 'highways' ? 'highway' : 'infrastructure_item';
            const searchHighlightSrc = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
            if (searchHighlightSrc && topFeat.geometry) {
              const color = props.color || '#f59e0b';
              if (topFeat.geometry.type === 'Point') {
                const pt = topFeat.geometry.coordinates as [number, number];
                const halo = createGeodesicCircle(pt[0], pt[1], 15, 64);
                searchHighlightSrc.setData({
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      geometry: halo,
                      properties: {
                        id: (topFeat.id || 'infra') + '_halo',
                        name: props.name,
                        color: color,
                        border_color: '#ffffff',
                        fill_opacity: 0.35,
                        stroke_width: 2.5
                      }
                    },
                    {
                      type: 'Feature',
                      geometry: topFeat.geometry,
                      properties: {
                        id: (topFeat.id || 'infra') + '_beacon',
                        name: props.name,
                        label_text: `🏗️ ${props.name}`,
                        color: color,
                        pulse_color: color
                      }
                    }
                  ]
                });
              } else {
                searchHighlightSrc.setData({
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      geometry: topFeat.geometry,
                      properties: {
                        id: (topFeat.id || 'infra') + '_line',
                        name: props.name,
                        color: color,
                        border_color: '#ffffff',
                        fill_opacity: 0.45,
                        stroke_width: 4.5
                      }
                    }
                  ]
                });
              }
            }
          } else if (topFeat.layer.id === 'empires-fill') {
            featType = 'historical_empire';
          } else if (topFeat.layer.id === 'soils-fill') {
            featType = 'soil';
          } else if (topFeat.layer.id === 'districts-fill') {
            featType = 'district';
            if (map.getLayer('districts-highlight-line')) {
              map.setFilter('districts-highlight-line', ['==', 'shapeName', props.shapeName || '']);
            }
            if (map.getLayer('districts-highlight-fill')) {
              map.setFilter('districts-highlight-fill', ['==', 'shapeName', props.shapeName || '']);
            }
          } else if (topFeat.layer.id === 'states-fill') {
            featType = 'state';
            if (map.getLayer('states-highlight')) {
              map.setFilter('states-highlight', ['==', 'shapeName', props.shapeName || '']);
            }
            if (map.getLayer('states-highlight-fill')) {
              map.setFilter('states-highlight-fill', ['==', 'shapeName', props.shapeName || '']);
            }
          }

          // Build Demographic Record if applicable
          let demoRecord: DemographicRecord | undefined = undefined;
          if (props.population_2011) {
            demoRecord = {
              state: props.state_name || props.shapeName,
              district: props.district || props.shapeName,
              population_2011: props.population_2011,
              population_2001: props.population_2001,
              density_2011: props.density_2011,
              area_sqkm: props.area_sqkm,
              growth_pct: props.growth_pct,
              literacy_rate: props.literacy_rate,
              sex_ratio: props.sex_ratio,
              rural_pct: props.rural_pct,
              urban_pct: props.urban_pct,
              hindu_pct: props.hindu_pct,
              muslim_pct: props.muslim_pct,
              christian_pct: props.christian_pct,
              sikh_pct: props.sikh_pct,
              buddhist_pct: props.buddhist_pct,
              jain_pct: props.jain_pct,
              other_pct: props.other_pct,
              source: props.source || 'Census of India 2011',
              census_year: props.census_year || 2011
            };
          } else if (featType === 'state' || featType === 'district') {
            const distKey = name.toUpperCase();
            const matched = Object.entries(demographicsData).find(([key]) => key.includes(distKey));
            if (matched) demoRecord = matched[1];
          }

          onSelectFeature({
            type: featType,
            name,
            properties: props,
            demographics: demoRecord,
            coordinates: [e.lngLat.lng, e.lngLat.lat],
            geometry: topFeat.geometry
          });
        } else {
          clearHighlights();
          onSelectFeature(null);
        }
      });

      // Dynamic zoom-responsive scaling listener for active on-map markers
      map.on('zoom', () => applyMarkerScaleToElement(map));
      map.on('zoomend', () => applyMarkerScaleToElement(map));

    });

    mapRef.current = map;

    return () => {
      if (activeMarkerRef.current) {
        try { activeMarkerRef.current.remove(); } catch {}
        activeMarkerRef.current = null;
      }
      if (flowIntervalRef.current) {
        clearInterval(flowIntervalRef.current);
        flowIntervalRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync Historical Empire layer filter when selectedHistoricalPeriod changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    try {
      const empireFilter: any = ['==', 'id', selectedHistoricalPeriod];
      ['empires-fill', 'empires-glow', 'empires-border', 'empires-capitals'].forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.setFilter(layerId, empireFilter);
        }
      });
      map.triggerRepaint();
    } catch (e) {
      console.warn('Historical period filter update warning:', e);
    }
  }, [selectedHistoricalPeriod]);

  // Update Basemap Tiles on Style Switch
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    try {
      const source = map.getSource('base-raster') as any;
      if (source && source.setTiles) {
        source.setTiles(getBasemapTiles(basemapStyle));
      }

      // Apply tactile fine-art hillshading when physical_tactile basemap is active
      if (map.getLayer('hillshading-layer')) {
        if (basemapStyle === 'physical_tactile') {
          map.setPaintProperty('hillshading-layer', 'hillshade-shadow-color', '#3d1a0e');
          map.setPaintProperty('hillshading-layer', 'hillshade-highlight-color', '#ffeed6');
          map.setPaintProperty('hillshading-layer', 'hillshade-accent-color', '#c2410c');
          map.setPaintProperty('hillshading-layer', 'hillshade-exaggeration', 0.75);
        } else {
          map.setPaintProperty('hillshading-layer', 'hillshade-shadow-color', '#020617');
          map.setPaintProperty('hillshading-layer', 'hillshade-highlight-color', '#38bdf8');
          map.setPaintProperty('hillshading-layer', 'hillshade-accent-color', '#0284c7');
          map.setPaintProperty('hillshading-layer', 'hillshade-exaggeration', 0.35);
        }
      }
      map.triggerRepaint();
    } catch (e) {
      console.warn('Basemap tile switch warning:', e);
    }
  }, [basemapStyle]);

  // 1. Toggle 2D vs 3D Perspective (Camera Tilt & Terrain Base)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    try {
      if (is3D) {
        if (map.getSource('terrarium-dem')) {
          map.setTerrain({
            source: 'terrarium-dem',
            exaggeration: terrainExaggeration
          });
        }
        map.easeTo({ pitch: 55, bearing: -8, duration: 800 });
      } else {
        map.setTerrain(null);
        map.easeTo({ pitch: 0, bearing: 0, duration: 600 });
      }
      map.triggerRepaint();
    } catch (e) {
      console.warn('Error toggling 3D mode:', e);
    }
  }, [is3D]);

  // 2. Real-time, instant-response Terrain Relief Exaggeration Slider (Zero camera jumping, fluid scaling)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !is3D) return;

    try {
      if (map.getSource('terrarium-dem')) {
        map.setTerrain({
          source: 'terrarium-dem',
          exaggeration: terrainExaggeration
        });
      }
      if (map.getLayer('hillshading-layer')) {
        map.setPaintProperty(
          'hillshading-layer',
          'hillshade-exaggeration',
          Math.min(1.0, 0.2 + (terrainExaggeration * 0.25))
        );
      }
      map.triggerRepaint();
    } catch (e) {
      console.warn('Error adjusting terrain exaggeration:', e);
    }
  }, [terrainExaggeration, is3D]);

  // 3. Dynamic Pan-India Elevation Highlight Toggle (Natural Topographic Summit Peaks & Hypsometric Tint)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const elevationLayerIds = [
      'elevation-heatmap',
      'elevation-natural-glow',
      'elevation-natural-summit',
      'elevation-natural-spot-core',
      'elevation-natural-labels'
    ];

    elevationLayerIds.forEach(id => {
      try {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', isElevationHighlight ? 'visible' : 'none');
        }
      } catch (err) {
        console.warn(`Layer visibility update warning on ${id}:`, err);
      }
    });

    if (isElevationHighlight) {
      // Natural 3D terrain elevation with authentic, sculpted physical contours
      if (map.getSource('terrarium-dem')) {
        map.setTerrain({
          source: 'terrarium-dem',
          exaggeration: 2.0
        });
      }
      if (map.getLayer('hillshading-layer')) {
        map.setPaintProperty('hillshading-layer', 'hillshade-exaggeration', 0.65);
        map.setPaintProperty('hillshading-layer', 'hillshade-shadow-color', '#2e140d');
        map.setPaintProperty('hillshading-layer', 'hillshade-highlight-color', '#fff5ea');
        map.setPaintProperty('hillshading-layer', 'hillshade-accent-color', '#c2410c');
      }
      map.easeTo({ pitch: 48, duration: 800 });
    } else {
      if (is3D && map.getSource('terrarium-dem')) {
        map.setTerrain({
          source: 'terrarium-dem',
          exaggeration: terrainExaggeration
        });
      }
    }
    map.triggerRepaint();
  }, [isElevationHighlight, is3D, terrainExaggeration]);

  // Guaranteed instantaneous layer state execution with zero-latency response
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Apply layer visibility immediately to all existing layers
    applyLayerStyles(map);

    // Also attach to load if map was still initializing
    if (!map.loaded()) {
      map.once('load', () => applyLayerStyles(map));
    }
  }, [applyLayerStyles]);

  // Sync Highlights when selectedFeature changes from search or outside
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (activeMarkerRef.current) {
      try { activeMarkerRef.current.remove(); } catch {}
      activeMarkerRef.current = null;
    }
    if ((map as any)._activeInfraMarker) {
      try { (map as any)._activeInfraMarker.remove(); } catch {}
      (map as any)._activeInfraMarker = null;
    }

    if (!selectedFeature) {
      if (map.getLayer('states-highlight')) map.setFilter('states-highlight', ['==', 'shapeName', '']);
      if (map.getLayer('states-highlight-fill')) map.setFilter('states-highlight-fill', ['==', 'shapeName', '']);
      if (map.getLayer('districts-highlight-line')) map.setFilter('districts-highlight-line', ['==', 'shapeName', '']);
      if (map.getLayer('districts-highlight-fill')) map.setFilter('districts-highlight-fill', ['==', 'shapeName', '']);
      if (map.getLayer('rivers-highlight')) map.setFilter('rivers-highlight', ['==', 'clean_name', '']);
      if (map.getLayer('mountains-highlight')) map.setFilter('mountains-highlight', ['==', 'name', '']);
      if (map.getLayer('roads-highlight')) map.setFilter('roads-highlight', ['==', 'code', '']);
      if (map.getLayer('env-highlight-fill')) map.setFilter('env-highlight-fill', ['==', ['id'], '']);
      if (map.getLayer('env-highlight-border')) map.setFilter('env-highlight-border', ['==', ['id'], '']);
      if (map.getLayer('env-highlight-line')) map.setFilter('env-highlight-line', ['==', ['id'], '']);
      if (map.getLayer('env-highlight-point')) map.setFilter('env-highlight-point', ['==', ['id'], '']);
      const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
      if (src && typeof src.setData === 'function') src.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    const { type, properties, name } = selectedFeature;
    const featName = properties.clean_name || properties.shapeName || properties.name || name;

    if (type === 'state') {
      if (map.getLayer('states-highlight')) map.setFilter('states-highlight', ['==', 'shapeName', properties.shapeName || featName]);
      if (map.getLayer('states-highlight-fill')) map.setFilter('states-highlight-fill', ['==', 'shapeName', properties.shapeName || featName]);
    } else if (type === 'district') {
      if (map.getLayer('districts-highlight-line')) map.setFilter('districts-highlight-line', ['==', 'shapeName', properties.shapeName || featName]);
      if (map.getLayer('districts-highlight-fill')) map.setFilter('districts-highlight-fill', ['==', 'shapeName', properties.shapeName || featName]);
    } else if (type === 'river') {
      if (map.getLayer('rivers-highlight')) map.setFilter('rivers-highlight', ['==', 'clean_name', properties.clean_name || featName]);
    } else if (type === 'mountain') {
      if (map.getLayer('mountains-highlight')) map.setFilter('mountains-highlight', ['==', 'name', properties.name || featName]);
    } else if (
      type === 'highway' ||
      type === 'infrastructure_item' ||
      type === 'infrastructure_highway' ||
      type === 'infrastructure_railway' ||
      type === 'infrastructure_airport' ||
      type === 'infrastructure_seaport' ||
      type === 'infrastructure_corridor' ||
      type === 'infrastructure_dam' ||
      type === 'infrastructure_power' ||
      type === 'infrastructure_sez' ||
      type === 'infrastructure_urban'
    ) {
      if (properties?.code && map.getLayer('roads-highlight')) {
        map.setFilter('roads-highlight', ['==', 'code', properties.code]);
      } else if (featName && map.getLayer('roads-highlight')) {
        map.setFilter('roads-highlight', ['==', 'code', featName]);
      }

      const featId = properties.id || properties.code || properties.key || '';
      let match = selectedFeature.geometry 
        ? { type: 'Feature', geometry: selectedFeature.geometry, properties: selectedFeature.properties }
        : (featId ? INFRASTRUCTURE_BY_ID[featId] : undefined);

      if (!match && featName) {
        const tName = featName.toLowerCase();
        match = INFRASTRUCTURE_GEOJSON.features.find((f: any) => {
          const fName = (f.properties?.name || '').toLowerCase();
          return fName.includes(tName) || tName.includes(fName);
        });
      }

      const p = match?.properties || properties;
      const color = p.color || (type === 'highway' ? '#f59e0b' : '#38bdf8');
      const hlFeatures: any[] = [];
      let anchorCoords: [number, number] | undefined = selectedFeature.coordinates || p.coordinates;

      const geom = match?.geometry || selectedFeature.geometry;
      if (geom) {
        if (geom.type === 'Point') {
          const pt = geom.coordinates as [number, number];
          anchorCoords = anchorCoords || pt;
          const haloCircle = createGeodesicCircle(pt[0], pt[1], 15, 64);
          hlFeatures.push({
            type: 'Feature',
            geometry: haloCircle,
            properties: {
              id: (featId || 'infra') + '_halo',
              name: featName,
              color: color,
              border_color: '#ffffff',
              fill_opacity: 0.35,
              stroke_width: 2.5
            }
          });
        } else if (geom.type === 'LineString') {
          const pts = geom.coordinates as [number, number][];
          if (!anchorCoords && pts.length > 0) {
            anchorCoords = pts[Math.floor(pts.length / 2)];
          }
          hlFeatures.push({
            type: 'Feature',
            geometry: geom,
            properties: {
              id: (featId || 'infra') + '_line',
              name: featName,
              color: color,
              border_color: '#ffffff',
              fill_opacity: 0.8,
              stroke_width: 5.5
            }
          });
        }
      }

      const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
      if (src && typeof src.setData === 'function' && hlFeatures.length > 0) {
        src.setData({
          type: 'FeatureCollection',
          features: hlFeatures
        });
      }

      if (anchorCoords) {
        try {
          const markerEl = createInfrastructureMarkerElement({
            name: featName || p.name || 'Asset',
            category: p.category || (type === 'highway' ? 'highways' : 'railways'),
            subType: p.sub_type,
            metricText: getCompactInfrastructureMetric(p),
            color: color,
            initialZoom: map.getZoom()
          });
          const marker = new Marker({ element: markerEl, anchor: 'bottom' })
            .setLngLat(anchorCoords)
            .addTo(map);
          activeMarkerRef.current = marker;
          (map as any)._activeInfraMarker = marker;
          applyMarkerScaleToElement(map);
        } catch (e) {
          console.warn('Marker placement error in selectedFeature effect:', e);
        }
      }
    } else if (type === 'environmental_change') {
      const featId = properties.id || '';
      const envFilter: any = featId
        ? [
            'any',
            ['==', ['get', 'id'], featId],
            ['==', ['id'], featId],
            ['==', ['get', 'name'], featName || featId]
          ]
        : ['==', ['id'], ''];

      ['env-highlight-fill', 'env-highlight-border', 'env-highlight-line', 'env-highlight-point'].forEach(id => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', 'visible');
          map.setFilter(id, envFilter);
        }
      });

      let match = selectedFeature.geometry 
        ? { type: 'Feature', geometry: selectedFeature.geometry, properties: selectedFeature.properties }
        : (featId ? ENVIRONMENTAL_FEATURES_BY_ID[featId] : undefined);

      if (!match && featName) {
        const tName = featName.toLowerCase();
        match = ENVIRONMENTAL_FEATURES.find(f => {
          const fName = (f.properties?.name || '').toLowerCase();
          return fName.includes(tName) || tName.includes(fName);
        });
      }

      // Synchronously push geometry to search-highlight source for guaranteed zero-latency marked area display!
      const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
      if (src && typeof src.setData === 'function') {
        if (match) {
          src.setData({
            type: 'FeatureCollection',
            features: [match]
          });
        }
      }
    } else if (
      type === 'disaster_hazard' ||
      type === 'seismic_zone' ||
      type === 'earthquake_epicenter' ||
      type === 'cyclone_track' ||
      type === 'flood_zone' ||
      type === 'landslide_zone' ||
      type === 'drought_zone' ||
      type === 'tsunami_zone' ||
      type === 'heatwave_zone'
    ) {
      const featId = properties.id || properties.key || '';
      let match = selectedFeature.geometry 
        ? { type: 'Feature', geometry: selectedFeature.geometry, properties: selectedFeature.properties }
        : (featId ? DISASTER_HAZARDS_BY_ID[featId] : undefined);

      if (!match && featName) {
        const tName = featName.toLowerCase();
        match = DISASTER_GEOJSON.features.find((f: any) => {
          const fName = (f.properties?.name || '').toLowerCase();
          return fName.includes(tName) || tName.includes(fName);
        });
      }

      const impactFeatures = createDisasterImpactFeatures(match, {
        name: featName,
        key: featId,
        lng: selectedFeature.coordinates ? selectedFeature.coordinates[0] : undefined,
        lat: selectedFeature.coordinates ? selectedFeature.coordinates[1] : undefined
      });

      const src = map.getSource('search-highlight') as { setData: (d: unknown) => void } | undefined;
      if (src && typeof src.setData === 'function' && impactFeatures.length > 0) {
        src.setData({
          type: 'FeatureCollection',
          features: impactFeatures
        });
      }
    }
  }, [selectedFeature, activeLayers, environmentalPillars]);

  // Handle Search FlyTo
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !searchTarget) return;

    if (searchTarget.bbox) {
      map.fitBounds(searchTarget.bbox, { padding: 64, duration: 1600, essential: true });
    } else if (searchTarget.lat !== undefined && searchTarget.lng !== undefined) {
      map.flyTo({
        center: [searchTarget.lng, searchTarget.lat],
        zoom: searchTarget.zoom ?? 8,
        pitch: searchTarget.pitch !== undefined ? searchTarget.pitch : map.getPitch(),
        bearing: searchTarget.bearing !== undefined ? searchTarget.bearing : map.getBearing(),
        duration: 2200,
        essential: true
      });
    }

    applySearchHighlight(map, searchTarget);
  }, [searchTarget]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#050608]">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Cinematic Map Vignette Overlay */}
      <div className="map-vignette pointer-events-none" />

      {/* Floating Interactive Hover Card - Obsidian & Coral Theme */}
      {hoveredTooltip && (
        <div
          className="fixed pointer-events-none z-50 vista-card bg-[#0d1016]/95 border border-white/10 border-l-3 border-l-[#C9A227] text-white px-4 py-3.5 rounded-xl shadow-2xl text-sm -translate-x-1/2 -translate-y-full mb-3 max-w-sm transition-transform duration-75 font-mono"
          style={{ left: `${hoveredTooltip.x}px`, top: `${hoveredTooltip.y}px` }}
        >
          <div className="flex items-center justify-between gap-2.5 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40 shrink-0">
              {hoveredTooltip.type}
            </span>
            <span className="text-xs text-neutral-300 font-semibold truncate text-right min-w-0 flex-1" title={hoveredTooltip.source}>
              {hoveredTooltip.source}
            </span>
          </div>

          <div className="font-extrabold text-base text-white tracking-tight">{hoveredTooltip.title}</div>
          {hoveredTooltip.subtitle && (
            <div className="text-neutral-300 text-xs mt-1 font-sans font-semibold">{hoveredTooltip.subtitle}</div>
          )}

          {hoveredTooltip.metricLabel && hoveredTooltip.metricValue && (
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-4 text-xs font-mono font-bold">
              <span className="text-neutral-300 font-semibold">{hoveredTooltip.metricLabel}:</span>
              <span className="font-black text-[#C9A227] text-sm">
                {hoveredTooltip.metricValue}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
