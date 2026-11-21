// Generates public/data/search_index.json from the GeoJSON datasets.
// Run: node scripts/build-search-index.mjs   (from the bharat3d-app directory)
import fs from 'node:fs';
import path from 'node:path';

const DATA = 'public/data';
const read = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f + '.geojson'), 'utf8'));

// Compute a bounding box for any GeoJSON geometry (Point, LineString, Polygon, Multi*).
function bboxOf(geometry) {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  const visit = (c) => {
    if (!Array.isArray(c)) return;
    if (typeof c[0] === 'number' && typeof c[1] === 'number') {
      const lng = c[0], lat = c[1];
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    } else {
      for (const x of c) visit(x);
    }
  };
  visit(geometry && geometry.coordinates);
  if (minLng === Infinity) return null;
  return [[round6(minLng), round6(minLat)], [round6(maxLng), round6(maxLat)]];
}

const round6 = (n) => Math.round(n * 1e6) / 1e6;
const round5 = (n) => Math.round(n * 1e5) / 1e5;

// Strip diacritics so "Mahārāshtra" is searchable as "Maharashtra".
const norm = (s) => (s == null ? '' : String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g, ''));

const entries = [];
const seen = new Set();

function add(entry) {
  if (!entry || !entry.name) return;
  entry.name = norm(entry.name);
  if (entry.sub) entry.sub = norm(entry.sub);
  if (entry.aliases) entry.aliases = entry.aliases.map(norm);
  const key = entry.type + '|' + entry.name.toLowerCase().trim();
  if (seen.has(key)) return;
  seen.add(key);
  entries.push(entry);
}

// 1. States (polygons -> fit bounds)
for (const f of read('india_states').features) {
  const p = f.properties || {};
  const bbox = bboxOf(f.geometry);
  const e = {
    name: p.shapeName || p.name,
    type: 'state',
    key: p.shapeName || p.name,
    sub: p.capital ? `State · Capital: ${p.capital}` : 'State / UT',
    bbox,
  };
  if (p.capital) e.aliases = [p.capital];
  add(e);
}

// 2. Districts (polygons -> fit bounds)
for (const f of read('india_districts').features) {
  const p = f.properties || {};
  add({
    name: p.shapeName || p.district || p.name,
    type: 'district',
    key: p.shapeName || p.district || p.name,
    sub: p.state_name || p.state ? `District · ${p.state_name || p.state}` : 'District',
    bbox: bboxOf(f.geometry),
  });
}

// 3. Rivers (lines -> fit bounds)
for (const f of read('india_rivers').features) {
  const p = f.properties || {};
  add({
    name: p.clean_name || p.name_en || p.name,
    type: 'river',
    key: p.clean_name || p.name_en || p.name,
    sub: p.river_system || 'River',
    bbox: bboxOf(f.geometry),
  });
}

// 4. Mountain ranges (lines -> fit bounds)
for (const f of read('india_mountains').features) {
  const p = f.properties || {};
  add({
    name: p.name,
    type: 'mountain',
    key: p.name,
    sub: p.peak ? `Mountain Range · ${p.peak}` : 'Mountain Range',
    bbox: bboxOf(f.geometry),
  });
}

// 5. Urban nodes / cities (points)
for (const f of read('india_urban_nodes').features) {
  const p = f.properties || {};
  const [lng, lat] = f.geometry.coordinates;
  add({
    name: p.name,
    type: 'city',
    sub: p.type || 'Metropolitan Hub',
    lat: round5(lat),
    lng: round5(lng),
    zoom: 9,
  });
}

// 6. Elevation points / peaks (points)
for (const f of read('india_elevation_points').features) {
  const p = f.properties || {};
  const [lng, lat] = f.geometry.coordinates;
  add({
    name: p.name,
    type: 'peak',
    sub: p.elevation_ft_in ? `Peak · ${p.elevation_ft_in}` : 'Mountain Peak',
    lat: round5(lat),
    lng: round5(lng),
    zoom: 10,
  });
}

// 7. Archaeological sites (points, explicit lat/lng available)
for (const f of read('archaeological_sites').features) {
  const p = f.properties || {};
  const lng = p.lng ?? (f.geometry && f.geometry.coordinates[0]);
  const lat = p.lat ?? (f.geometry && f.geometry.coordinates[1]);
  add({
    name: p.name,
    type: 'archaeological_site',
    sub: p.period ? `Archaeological Site · ${p.period}` : 'Archaeological Site',
    lat: round5(lat),
    lng: round5(lng),
    zoom: 9,
  });
}

// 8. Historical empires (polygons -> fit bounds)
for (const f of read('historical_empires').features) {
  const p = f.properties || {};
  add({
    name: p.name,
    type: 'historical_empire',
    key: p.name,
    sub: p.era ? `Historical Empire · ${p.era}` : 'Historical Empire',
    bbox: bboxOf(f.geometry),
  });
  if (p.capital) {
    add({
      name: p.capital,
      type: 'historical_capital',
      key: p.name,
      sub: `Historic Capital · ${p.name}`,
      bbox: bboxOf(f.geometry),
    });
  }
}

// 9. Trade routes & Ancient Ports
for (const f of read('historical_trade_routes').features) {
  const p = f.properties || {};
  if (f.geometry && f.geometry.type === 'Point') {
    const [lng, lat] = f.geometry.coordinates;
    add({
      name: p.name,
      type: 'ancient_port',
      key: p.name,
      sub: p.era ? `Ancient Port · ${p.era}` : 'Ancient Trading Port',
      lat: round5(lat),
      lng: round5(lng),
      zoom: 10,
    });
  } else {
    add({
      name: p.name,
      type: 'trade_route',
      key: p.name,
      sub: p.category_display ? `${p.category_display} · ${p.era || ''}` : `Trade Artery · ${p.era || ''}`,
      bbox: bboxOf(f.geometry),
    });
  }
}

// 10. Highways (lines -> fit bounds)
for (const f of read('india_highways').features) {
  const p = f.properties || {};
  add({
    name: p.name,
    type: 'highway',
    key: p.code,
    sub: `${p.category || 'Highway'} · ${p.from} → ${p.to}`,
    aliases: p.code ? [p.code] : [],
    bbox: bboxOf(f.geometry),
  });
}

// 11. Curated major cities (points) for robust city search coverage.
const cities = [
  ['New Delhi', 28.6139, 77.2090], ['Mumbai', 19.0760, 72.8777], ['Bengaluru', 12.9716, 77.5946],
  ['Kolkata', 22.5726, 88.3639], ['Chennai', 13.0827, 80.2707], ['Hyderabad', 17.3850, 78.4867],
  ['Pune', 18.5204, 73.8567], ['Ahmedabad', 23.0225, 72.5714], ['Jaipur', 26.9124, 75.7873],
  ['Lucknow', 26.8467, 80.9462], ['Kanpur', 26.4499, 80.3319], ['Nagpur', 21.1458, 79.0882],
  ['Indore', 22.7196, 75.8577], ['Bhopal', 23.2599, 77.4126], ['Patna', 25.5941, 85.1376],
  ['Vadodara', 22.3072, 73.1812], ['Surat', 21.1702, 72.8311], ['Coimbatore', 11.0168, 76.9558],
  ['Kochi', 9.9312, 76.2673], ['Thiruvananthapuram', 8.5241, 76.9366], ['Visakhapatnam', 17.6868, 83.2185],
  ['Vijayawada', 16.5062, 80.6480], ['Madurai', 9.9252, 78.1198], ['Mysuru', 12.2958, 76.6394],
  ['Varanasi', 25.3176, 82.9739], ['Agra', 27.1767, 78.0081], ['Amritsar', 31.6340, 74.8723],
  ['Chandigarh', 30.7333, 76.7794], ['Dehradun', 30.3165, 78.0322], ['Guwahati', 26.1445, 91.7362],
  ['Shillong', 25.5788, 91.8933], ['Imphal', 24.8170, 93.9368], ['Srinagar', 34.0837, 74.7973],
  ['Jammu', 32.7266, 74.8570], ['Raipur', 21.2514, 81.6296], ['Ranchi', 23.3441, 85.3096],
  ['Bhubaneswar', 20.2961, 85.8245], ['Cuttack', 20.4625, 85.8828], ['Jodhpur', 26.2389, 73.0243],
  ['Udaipur', 24.5854, 73.7125], ['Ajmer', 26.4499, 74.6399], ['Kota', 25.2138, 75.8648],
  ['Gwalior', 26.2183, 78.1828], ['Jabalpur', 23.1815, 79.9864], ['Nashik', 19.9975, 73.7898],
  ['Aurangabad', 19.8762, 75.3433], ['Solapur', 17.6599, 75.9064], ['Kolhapur', 16.7050, 74.2433],
  ['Panaji', 15.4909, 73.8278], ['Mangaluru', 12.9141, 74.8560], ['Hubballi', 15.3647, 75.1240],
  ['Belagavi', 15.8497, 74.4977], ['Tiruchirappalli', 10.7905, 78.7047], ['Salem', 11.6643, 78.1460],
  ['Tirupati', 13.6288, 79.4192], ['Kanyakumari', 8.0883, 77.5385], ['Rishikesh', 30.0869, 78.2676],
  ['Haridwar', 29.9457, 78.1642], ['Prayagraj', 25.4358, 81.8463], ['Allahabad', 25.4358, 81.8463],
  ['Gorakhpur', 26.7606, 83.3732], ['Muzaffarpur', 26.1209, 85.3647], ['Dhanbad', 23.7957, 86.4304],
  ['Jamshedpur', 22.8046, 86.2029], ['Leh', 34.1526, 77.5771], ['Gangtok', 27.3389, 88.6065],
  ['Siliguri', 26.7271, 88.3953], ['Faridabad', 28.4089, 77.3178], ['Ghaziabad', 28.6692, 77.4538],
  ['Noida', 28.5355, 77.3910], ['Gurugram', 28.4595, 77.0266],
];
for (const [name, lat, lng] of cities) {
  add({ name, type: 'city', sub: 'City', lat: round5(lat), lng: round5(lng), zoom: 10 });
}

fs.writeFileSync(
  path.join(DATA, 'search_index.json'),
  JSON.stringify({ entries }, null, 0),
  'utf8'
);
console.log('Wrote search_index.json with', entries.length, 'entries');
