import type { HistoricalPeriodMeta } from '../types';

export const HISTORICAL_ERAS: HistoricalPeriodMeta[] = [
  {
    id: 'indus_valley',
    name: 'Indus Valley Civilization',
    era: 'Bronze Age Urbanism',
    yearApprox: 'c. 2600 – 1900 BCE',
    capital: 'Harappa & Mohenjo-daro',
    rulerNotable: 'Civic Guilds & Priest-King Tradition',
    color: '#0d9488', // Teal
    description: 'First urbanization of the Indian subcontinent featuring advanced hydraulic engineering, grid planning, granaries, and bronze metallurgy across the Indus-Saraswati basin.'
  },
  {
    id: 'mahajanapadas',
    name: 'Sixteen Mahajanapadas',
    era: 'Iron Age Second Urbanization',
    yearApprox: 'c. 600 – 320 BCE',
    capital: 'Rajagriha / Vaishali / Ujjain',
    rulerNotable: 'Bimbisara & Ajatashatru (Haryanka)',
    color: '#8b5cf6', // Violet
    description: 'Sixteen major oligarchic republics (Gana-Sanghas) and monarchies spanning the Gangetic plain, witnessing the rise of Buddhism (Gautama Buddha) and Jainism (Mahavira).'
  },
  {
    id: 'maurya',
    name: 'Maurya Empire',
    era: 'Pan-Indian Imperial Unification',
    yearApprox: 'c. 322 – 185 BCE',
    capital: 'Pataliputra (Patna)',
    rulerNotable: 'Ashoka the Great & Chandragupta Maurya',
    color: '#c2410c', // Terracotta Orange
    description: 'First subcontinental imperial state established by Chandragupta with Chanakya (Arthashastra), reaching zenith under Ashoka with stone edicts advocating Dhamma and ahimsa.'
  },
  {
    id: 'gupta',
    name: 'Gupta Empire',
    era: 'Classical Golden Age',
    yearApprox: 'c. 320 – 550 CE',
    capital: 'Pataliputra & Ujjayini',
    rulerNotable: 'Samudragupta & Chandragupta II Vikramaditya',
    color: '#b45309', // Amber / Gold
    description: 'Flourishing of Sanskrit literature (Kalidasa), mathematics (Aryabhata, decimal system), astronomy, Hindu iconography, and Buddhist art at Nalanda and Ajanta.'
  },
  {
    id: 'delhi_sultanate',
    name: 'Delhi Sultanate',
    era: 'Medieval Indo-Islamic Era',
    yearApprox: 'c. 1206 – 1526 CE',
    capital: 'Delhi (Qila Rai Pithora / Siri / Daulatabad)',
    rulerNotable: 'Alauddin Khalji & Muhammad bin Tughluq',
    color: '#0284c7', // Sky Blue
    description: 'Five successive dynasties (Mamluk, Khalji, Tughlaq, Sayyid, Lodi) integrating Persian administrative institutions, defensive warfare against Mongol incursions, and Sufi syncretism.'
  },
  {
    id: 'mughal',
    name: 'Mughal Empire',
    era: 'Early Modern Imperial Hegemony',
    yearApprox: 'c. 1526 – 1707 CE',
    capital: 'Agra, Fatehpur Sikri, Shahjahanabad',
    rulerNotable: 'Akbar the Great & Shah Jahan',
    color: '#15803d', // Emerald Green
    description: 'High imperial centralization, Mansabdari governance, Todar Mal agrarian revenue reforms, and architectural peaks spanning Taj Mahal to Red Fort under Akbar and Shah Jahan.'
  },
  {
    id: 'maratha',
    name: 'Maratha Confederacy',
    era: 'Hindavi Swarajya & Peshwa Expansion',
    yearApprox: 'c. 1674 – 1818 CE',
    capital: 'Raigad & Pune (Shaniwar Wada)',
    rulerNotable: 'Chhatrapati Shivaji Maharaj & Peshwa Baji Rao I',
    color: '#ea580c', // Saffron / Copper
    description: 'Founded by Chhatrapati Shivaji Maharaj based on decentralized hill fortification and guerrilla tactics (Ganimi Kava), expanded into a confederacy dominating 18th-century central and northern India.'
  },
  {
    id: 'british_1909',
    name: 'British Indian Empire',
    era: 'Colonial Raj & Princely States',
    yearApprox: '1909 CE (Imperial Gazetteer)',
    capital: 'Calcutta (transferred to Delhi 1911)',
    rulerNotable: 'British Crown & Chamber of Princes',
    color: '#be185d', // Rose / Imperial Red
    description: 'Colonial administrative partition between directly-ruled British Presidencies and ~565 sovereign Princely States bound by subsidiary alliances and paramountcy.'
  },
  {
    id: 'partition_1947',
    name: 'Independence & Partition',
    era: 'Post-Colonial Nation Building',
    yearApprox: '1947 CE',
    capital: 'New Delhi',
    rulerNotable: 'Jawaharlal Nehru & Sardar Vallabhbhai Patel',
    color: '#e11d48', // Crimson
    description: 'Radcliffe Line demarcation creating independent India and Pakistan, accompanied by the monumental integration of 565 Princely States orchestrated by Sardar Patel and V.P. Menon.'
  },
  {
    id: 'states_reorg_1956',
    name: 'States Reorganisation',
    era: 'Linguistic Federalism',
    yearApprox: '1956 CE',
    capital: 'New Delhi',
    rulerNotable: 'Fazal Ali Commission (SRC)',
    color: '#4f46e5', // Indigo
    description: 'Historic redrawing of state boundaries on linguistic lines under the States Reorganisation Act 1956, establishing enduring federal state boundaries.'
  },
  {
    id: 'modern_states_2000',
    name: 'Creation of 2000 States',
    era: 'Regional Decentralization',
    yearApprox: '2000 CE',
    capital: 'New Delhi',
    rulerNotable: 'Atal Bihari Vajpayee Administration',
    color: '#0891b2', // Cyan
    description: 'Parliamentary creation of Chhattisgarh (from MP), Uttarakhand (from UP), and Jharkhand (from Bihar) responding to regional developmental aspirations.'
  },
  {
    id: 'telangana_2014',
    name: 'Bifurcation of Telangana',
    era: '29th State Formation',
    yearApprox: '2014 CE',
    capital: 'New Delhi',
    rulerNotable: 'Andhra Pradesh Reorganisation Act',
    color: '#7c3aed', // Purple
    description: 'Creation of Telangana as India’s 29th state carving 10 districts from Andhra Pradesh with Hyderabad serving as joint capital.'
  },
  {
    id: 'present',
    name: 'Republic of India (Present)',
    era: 'Contemporary Administrative Baseline',
    yearApprox: 'Present Day (2026)',
    capital: 'New Delhi',
    rulerNotable: 'Constitutional Federal Republic',
    color: '#C9A227', // Antique Gold
    description: '28 States and 8 Union Territories with Survey of India sovereign baseline, 735+ districts, and 1.4+ billion citizens.'
  }
];
