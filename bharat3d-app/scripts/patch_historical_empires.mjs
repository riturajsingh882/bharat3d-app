// Adds the three modern "republic" eras (2000, 2014, present) to the historical
// empires dataset, reusing the modern-India boundary geometry from states_reorg_1956.
import fs from 'node:fs';

const P = 'public/data/historical_empires.geojson';
const d = JSON.parse(fs.readFileSync(P, 'utf8'));
const base = d.features.find((f) => f.properties.id === 'states_reorg_1956');
if (!base) throw new Error('states_reorg_1956 feature not found');

const republics = [
  {
    id: 'modern_states_2000',
    name: 'Republic of India — New States of 2000',
    era: '2000 CE',
    calendar_year: 2000,
    ruler_or_system: 'Parliamentary Federal Republic (Uttarakhand, Chhattisgarh & Jharkhand created)',
    color: '#0891b2',
    border_color: '#0ea5e9',
    highlights: 'Creation of Uttarakhand, Chhattisgarh and Jharkhand (2000).',
  },
  {
    id: 'telangana_2014',
    name: 'Republic of India — Bifurcation of Telangana (2014)',
    era: '2014 CE',
    calendar_year: 2014,
    ruler_or_system: 'Parliamentary Federal Republic (Telangana carved from Andhra Pradesh)',
    color: '#7c3aed',
    border_color: '#8b5cf6',
    highlights: 'Telangana created as the 29th state (2014).',
  },
  {
    id: 'present',
    name: 'Republic of India (Present Day)',
    era: 'Present (2026)',
    calendar_year: 2026,
    ruler_or_system: 'Parliamentary Federal Republic — 28 States & 8 Union Territories',
    color: '#C9A227',
    border_color: '#D9B23C',
    highlights: '28 States and 8 Union Territories; sovereign baseline per Survey of India.',
  },
];

for (const r of republics) {
  if (d.features.some((f) => f.properties.id === r.id)) continue;
  d.features.push({
    type: 'Feature',
    properties: {
      id: r.id,
      name: r.name,
      era: r.era,
      period_group: 'modern',
      calendar_year: r.calendar_year,
      capital: 'New Delhi',
      ruler_or_system: r.ruler_or_system,
      primary_rivers: base.properties.primary_rivers,
      approximate_area_sqkm: 3287263,
      scholarly_disclaimer:
        'Sovereign boundaries of the Republic of India per Survey of India. External boundary is essentially unchanged from 1956; only internal state reorganisation differs.',
      citation: 'Survey of India / States Reorganisation & subsequent Acts',
      color: r.color,
      border_color: r.border_color,
      trade_connections: 'Modern pan-India transport corridors and maritime trade',
      highlights: r.highlights,
    },
    geometry: JSON.parse(JSON.stringify(base.geometry)),
  });
}

fs.writeFileSync(P, JSON.stringify(d, null, 2));
console.log('historical_empires.geojson now has', d.features.length, 'features');
