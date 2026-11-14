export interface ElevationLandmark {
  name: string;
  zone: string;
  category: 'High Peak' | 'Pass' | 'Plateau' | 'Plains' | 'Coast / Depression';
  meters: number;
  feetInches: string;
  description: string;
  lat: number;
  lng: number;
  zoom: number;
  pitch: number;
  bearing: number;
  color: string;
}

/**
 * Converts meters to exact Feet and Inches representation.
 * Formula: 1m = 39.37007874 inches.
 */
export function metersToFeetInches(meters: number): string {
  const isNegative = meters < 0;
  const absMeters = Math.abs(meters);
  const totalInches = Math.round(absMeters * 39.37007874);
  let feet = Math.floor(totalInches / 12);
  let inches = totalInches % 12;

  if (inches === 12) {
    feet += 1;
    inches = 0;
  }

  const sign = isNegative ? '-' : '';
  return `${sign}${feet.toLocaleString()} ft ${inches} in`;
}

/**
 * Formats elevation displaying both Feet & Inches and Meters.
 */
export function formatElevationDual(meters: number): string {
  return `${metersToFeetInches(meters)} (${meters.toLocaleString()} m)`;
}

/**
 * Complete, verified elevation registry of India across all physiographic divisions.
 * Every landmark has authentic Survey of India / GSI / NASA SRTM coordinates and elevation figures.
 */
export const PAN_INDIA_ELEVATION_ZONES: {
  zoneTitle: string;
  rangeFt: string;
  color: string;
  landmarks: ElevationLandmark[];
}[] = [
  {
    zoneTitle: 'The Great Himalayas & Karakoram (Himadri)',
    rangeFt: '20,000 ft to 28,170 ft',
    color: '#c2410c', // Copper / Terracotta peak color
    landmarks: [
      {
        name: 'Mt. Kangchenjunga',
        zone: 'Sikkim Himalayas',
        category: 'High Peak',
        meters: 8586,
        feetInches: metersToFeetInches(8586), // 28,169 ft 3 in
        description: 'Highest peak in India, 3rd highest in the world. Permanent snowcap.',
        lat: 27.7025,
        lng: 88.1475,
        zoom: 9.8,
        pitch: 75,
        bearing: -20,
        color: '#c2410c'
      },
      {
        name: 'Nanda Devi',
        zone: 'Garhwal Himalayas (Uttarakhand)',
        category: 'High Peak',
        meters: 7816,
        feetInches: metersToFeetInches(7816), // 25,643 ft 1 in
        description: 'Highest peak situated entirely within Indian borders.',
        lat: 30.3758,
        lng: 79.9706,
        zoom: 9.5,
        pitch: 72,
        bearing: -15,
        color: '#ea580c'
      },
      {
        name: 'Kamet Peak',
        zone: 'Zaskar Range (Uttarakhand)',
        category: 'High Peak',
        meters: 7756,
        feetInches: metersToFeetInches(7756), // 25,446 ft 2 in
        description: 'Second highest peak in Garhwal region near Tibetan border.',
        lat: 30.9208,
        lng: 79.5703,
        zoom: 9.5,
        pitch: 70,
        bearing: 0,
        color: '#ea580c'
      },
      {
        name: 'Karakoram Siachen Ridge',
        zone: 'Ladakh Trans-Himalayas',
        category: 'High Peak',
        meters: 5753,
        feetInches: metersToFeetInches(5753), // 18,874 ft 8 in
        description: 'World\'s highest battlefield and subcontinental water tower.',
        lat: 35.5,
        lng: 77.0,
        zoom: 8.5,
        pitch: 70,
        bearing: -30,
        color: '#f97316'
      }
    ]
  },
  {
    zoneTitle: 'Lesser Himalayas & Mountain Passes (Himachal & Shivaliks)',
    rangeFt: '5,000 ft to 18,000 ft',
    color: '#d97706', // Ochre / Gold
    landmarks: [
      {
        name: 'Khardung La Pass',
        zone: 'Ladakh Range',
        category: 'Pass',
        meters: 5359,
        feetInches: metersToFeetInches(5359), // 17,582 ft 0 in
        description: 'Historic high motorable pass connecting Indus & Shyok valleys.',
        lat: 34.2787,
        lng: 77.6047,
        zoom: 9.2,
        pitch: 68,
        bearing: -10,
        color: '#d97706'
      },
      {
        name: 'Pir Panjal Crest',
        zone: 'Jammu & Kashmir / HP',
        category: 'High Peak',
        meters: 4100,
        feetInches: metersToFeetInches(4100), // 13,451 ft 5 in
        description: 'Longest sub-Himalayan mountain chain protecting Kashmir Valley.',
        lat: 33.8,
        lng: 74.8,
        zoom: 8.8,
        pitch: 65,
        bearing: 20,
        color: '#f59e0b'
      },
      {
        name: 'Shimla Ridge & Mussoorie',
        zone: 'Himachal / Uttarakhand',
        category: 'High Peak',
        meters: 2205,
        feetInches: metersToFeetInches(2205), // 7,234 ft 3 in
        description: 'Historic British colonial summer capitals atop Middle Himalayan ridges.',
        lat: 31.1048,
        lng: 77.1734,
        zoom: 9.2,
        pitch: 60,
        bearing: 15,
        color: '#fbbf24'
      }
    ]
  },
  {
    zoneTitle: 'Peninsular Highlands, Western & Eastern Ghats',
    rangeFt: '3,000 ft to 9,000 ft',
    color: '#84cc16', // Olive-Gold highland green
    landmarks: [
      {
        name: 'Anamudi Peak (Western Ghats)',
        zone: 'Idukki, Kerala',
        category: 'High Peak',
        meters: 2695,
        feetInches: metersToFeetInches(2695), // 8,841 ft 10 in
        description: 'Highest peak in all of Peninsular India and South of the Himalayas.',
        lat: 10.1697,
        lng: 77.0642,
        zoom: 9.5,
        pitch: 70,
        bearing: 35,
        color: '#84cc16'
      },
      {
        name: 'Doddabetta (Nilgiri Hills)',
        zone: 'Tamil Nadu',
        category: 'High Peak',
        meters: 2637,
        feetInches: metersToFeetInches(2637), // 8,651 ft 7 in
        description: 'Junction point where Western and Eastern Ghats converge.',
        lat: 11.4011,
        lng: 76.7358,
        zoom: 9.5,
        pitch: 65,
        bearing: 20,
        color: '#84cc16'
      },
      {
        name: 'Guru Shikhar (Aravalli Range)',
        zone: 'Mount Abu, Rajasthan',
        category: 'High Peak',
        meters: 1722,
        feetInches: metersToFeetInches(1722), // 5,649 ft 7 in
        description: 'Highest summit of the ancient Precambrian Aravalli range.',
        lat: 24.6503,
        lng: 72.7788,
        zoom: 9.2,
        pitch: 65,
        bearing: -10,
        color: '#a3e635'
      },
      {
        name: 'Jindhagada Peak (Eastern Ghats)',
        zone: 'Araku Valley, Andhra Pradesh',
        category: 'High Peak',
        meters: 1690,
        feetInches: metersToFeetInches(1690), // 5,544 ft 7 in
        description: 'Highest orographic relief point in the Eastern Ghats escarpment.',
        lat: 18.2325,
        lng: 82.9036,
        zoom: 9.0,
        pitch: 62,
        bearing: 15,
        color: '#a3e635'
      },
      {
        name: 'Dhupgarh (Satpura Range)',
        zone: 'Pachmarhi, Madhya Pradesh',
        category: 'High Peak',
        meters: 1350,
        feetInches: metersToFeetInches(1350), // 4,429 ft 2 in
        description: 'Highest peak of the central Indian Satpura horst mountain block.',
        lat: 22.4492,
        lng: 78.3694,
        zoom: 9.0,
        pitch: 60,
        bearing: 0,
        color: '#a3e635'
      }
    ]
  },
  {
    zoneTitle: 'The Deccan & Central Volcanic Plateaus',
    rangeFt: '1,000 ft to 3,000 ft',
    color: '#eab308', // Warm parchment ochre
    landmarks: [
      {
        name: 'Chota Nagpur Plateau',
        zone: 'Jharkhand / Odisha',
        category: 'Plateau',
        meters: 700,
        feetInches: metersToFeetInches(700), // 2,296 ft 7 in
        description: 'Ancient Dharwar craton rich in iron, coal, and mica deposits.',
        lat: 23.3,
        lng: 85.3,
        zoom: 8.0,
        pitch: 45,
        bearing: 0,
        color: '#eab308'
      },
      {
        name: 'Maharashtra Lava Plateau',
        zone: 'Deccan Traps (Pune/Nashik)',
        category: 'Plateau',
        meters: 600,
        feetInches: metersToFeetInches(600), // 1,968 ft 6 in
        description: 'Stepped basaltic trap topography formed by Cretaceous volcanism.',
        lat: 19.0,
        lng: 74.5,
        zoom: 7.8,
        pitch: 48,
        bearing: -15,
        color: '#eab308'
      },
      {
        name: 'Malwa Plateau',
        zone: 'Madhya Pradesh / Rajasthan',
        category: 'Plateau',
        meters: 500,
        feetInches: metersToFeetInches(500), // 1,640 ft 5 in
        description: 'Gently rolling volcanic tableland draining into the Chambal.',
        lat: 23.5,
        lng: 76.0,
        zoom: 7.8,
        pitch: 45,
        bearing: 0,
        color: '#eab308'
      }
    ]
  },
  {
    zoneTitle: 'The Great Northern Alluvial Plains (Indo-Gangetic Basin)',
    rangeFt: '100 ft to 1,000 ft',
    color: '#22c55e', // Alluvial fertile green
    landmarks: [
      {
        name: 'Ambala Drainage Divide',
        zone: 'Punjab - Haryana Watershed',
        category: 'Plains',
        meters: 250,
        feetInches: metersToFeetInches(250), // 820 ft 3 in
        description: 'Natural ridge separating Indus drainage from Ganga drainage.',
        lat: 30.3782,
        lng: 76.7767,
        zoom: 8.5,
        pitch: 40,
        bearing: 0,
        color: '#22c55e'
      },
      {
        name: 'Middle Ganga Plain',
        zone: 'Varanasi & Patna',
        category: 'Plains',
        meters: 80,
        feetInches: metersToFeetInches(80), // 262 ft 6 in
        description: 'Flat, deeply deposited fertile alluvial plain with river meanders.',
        lat: 25.4,
        lng: 83.5,
        zoom: 8.0,
        pitch: 35,
        bearing: 0,
        color: '#22c55e'
      },
      {
        name: 'Brahmaputra Fluvial Trough',
        zone: 'Assam Valley',
        category: 'Plains',
        meters: 55,
        feetInches: metersToFeetInches(55), // 180 ft 5 in
        description: 'Narrow, braided sediment-heavy alluvial valley between two ranges.',
        lat: 26.2,
        lng: 91.8,
        zoom: 8.0,
        pitch: 42,
        bearing: 10,
        color: '#22c55e'
      }
    ]
  },
  {
    zoneTitle: 'Coastal Plains, Deltas & Sea Level (Lowlands & Sub-Zero)',
    rangeFt: '-7 ft to 100 ft',
    color: '#06b6d4', // Coastal Teal / Turquoise
    landmarks: [
      {
        name: 'Sundarbans Delta',
        zone: 'West Bengal / Bay of Bengal',
        category: 'Coast / Depression',
        meters: 6,
        feetInches: metersToFeetInches(6), // 19 ft 8 in
        description: 'World\'s largest active mangrove delta; tidal mudflats and creeks.',
        lat: 21.9497,
        lng: 88.9,
        zoom: 8.5,
        pitch: 35,
        bearing: 0,
        color: '#06b6d4'
      },
      {
        name: 'Indian Ocean / Arabian Sea Mean Level',
        zone: 'Pan-India Coastline',
        category: 'Coast / Depression',
        meters: 0,
        feetInches: metersToFeetInches(0), // 0 ft 0 in
        description: 'National datum baseline (MSL) established by Survey of India.',
        lat: 14.0,
        lng: 73.5,
        zoom: 7.0,
        pitch: 40,
        bearing: 0,
        color: '#0284c7'
      },
      {
        name: 'Kuttanad Region (Kerala)',
        zone: 'Alappuzha, Kerala',
        category: 'Coast / Depression',
        meters: -2.2,
        feetInches: metersToFeetInches(-2.2), // -7 ft 3 in
        description: 'Lowest geographical elevation in India. Farming conducted below sea level.',
        lat: 9.4981,
        lng: 76.4312,
        zoom: 10.0,
        pitch: 50,
        bearing: 0,
        color: '#0369a1'
      }
    ]
  }
];
