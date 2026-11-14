export const APP_CONFIG = {
  GEOAPIFY_API_KEY: import.meta.env.VITE_GEOAPIFY_API_KEY || 'sk-a432ce8be9784dfe8da5247a13f025f0',
  TERRAIN_DEM_URL: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
  BASEMAPS: {
    // ESRI Dark Gray Canvas — Professional, watermark-free dark GIS basemap
    dark: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
    ],
    // ESRI World Imagery — Authentic high-res satellite photography of India
    satellite: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    ],
    // OpenStreetMap Standard — Global topological street & place cartography
    osm: [
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    ],
    // Geoapify Dark Matter (direct tile endpoint — works in dev and on Vercel)
    geoapify: [
      'https://maps.geoapify.com/v1/tile/dark-matter-dark-grey/{z}/{x}/{y}.png?apiKey=sk-a432ce8be9784dfe8da5247a13f025f0'
    ],
    // Tactile Physical Relief Map (Fine Art Physical Relief as in reference image)
    physical_tactile: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}'
    ]
  }
};
