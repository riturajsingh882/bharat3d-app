// Generates one label-point per state (centroid of each state's largest polygon),
// so the map shows a single state label instead of repeating on every island part.
import fs from 'node:fs';

const src = JSON.parse(fs.readFileSync('public/data/india_states.geojson', 'utf8'));

function ringArea(ring) {
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return a / 2;
}

function ringCentroid(ring) {
  let area = 0, cx = 0, cy = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[i + 1];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  area *= 0.5;
  if (Math.abs(area) < 1e-12) {
    let sx = 0, sy = 0;
    for (const [x, y] of ring) { sx += x; sy += y; }
    return [sx / ring.length, sy / ring.length];
  }
  return [cx / (6 * area), cy / (6 * area)];
}

function largestPolygonCentroid(geom) {
  let polys;
  if (geom.type === 'Polygon') polys = [geom.coordinates];
  else if (geom.type === 'MultiPolygon') polys = geom.coordinates;
  else return null;
  let best = null, bestArea = -1;
  for (const poly of polys) {
    const ring = poly[0];
    const a = Math.abs(ringArea(ring));
    if (a > bestArea) { bestArea = a; best = ring; }
  }
  return best ? ringCentroid(best) : null;
}

const out = { type: 'FeatureCollection', features: [] };
for (const f of src.features) {
  const c = largestPolygonCentroid(f.geometry);
  if (!c) continue;
  out.features.push({
    type: 'Feature',
    properties: { shapeName: f.properties.shapeName || f.properties.name || '' },
    geometry: { type: 'Point', coordinates: [c[0], c[1]] }
  });
}

fs.writeFileSync('public/data/state_centroids.geojson', JSON.stringify(out, null, 2));
console.log('wrote', out.features.length, 'state centroids');

const wb = out.features.find((f) => /west bengal/i.test(f.properties.shapeName));
if (wb) console.log('West Bengal centroid:', wb.geometry.coordinates);
