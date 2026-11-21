import fs from 'node:fs';
import path from 'node:path';

const tradeRoutesData = {
  type: "FeatureCollection",
  features: [
    // ========================================================
    // 1. ANCIENT TRADE NETWORKS (TERRESTRIAL HIGHWAYS)
    // ========================================================
    {
      type: "Feature",
      id: "uttarapatha",
      geometry: {
        type: "LineString",
        coordinates: [
          [72.8277, 33.7463], // Taxila
          [74.3587, 31.5204], // Lahore
          [76.9635, 29.3909], // Panipat
          [77.2090, 28.6139], // Delhi
          [77.6737, 27.4924], // Mathura
          [79.9199, 27.0543], // Kannauj
          [81.8463, 25.4358], // Prayagraj
          [82.9739, 25.3176], // Varanasi
          [85.1376, 25.5941], // Pataliputra
          [87.0000, 25.2500], // Champa / Bhagalpur
          [87.9250, 22.3000]  // Tamralipti
        ]
      },
      properties: {
        id: "uttarapatha",
        name: "Uttarapatha (Northern Highway / Grand Trunk Precursor)",
        category: "ancient_highway",
        category_display: "Ancient Trade Network",
        era: "Vedic, Mauryan, Mughal to Modern (c. 1000 BCE – Present)",
        era_active: "c. 1000 BCE – 16th c. CE",
        route_type: "terrestrial_highway",
        route_type_display: "Transcontinental Terrestrial Highway",
        total_length_km: 2500,
        termini: "Taxila (Gandhara) ↔ Pataliputra & Tamralipti (Bengal Delta)",
        connected_nodes: "Taxila, Lahore, Kurukshetra, Indraprastha, Mathura, Kannauj, Prayagraj, Varanasi, Pataliputra, Champa, Tamralipti",
        key_stations: "Taxila, Lahore, Kurukshetra, Indraprastha, Mathura, Kannauj, Prayagraj, Varanasi, Pataliputra, Champa, Tamralipti",
        commodities: "Gandharan wool, silk bolts, lapis lazuli, fine horses, Bengal muslins, iron agricultural implements, imperial stone edicts",
        chronicles: "Megasthenes (Indica), Kautilya (Arthashastra), Xuanzang travels (630 CE), Sher Shah Suri (Sadak-e-Azam)",
        historical_accounts: "Megasthenes (Indica), Kautilya (Arthashastra), Xuanzang travels (630 CE), Sher Shah Suri (Sadak-e-Azam)",
        significance: "The great royal road of northern India connecting northwestern borderlands with the eastern seaport of Bengal, acting as the socio-economic and military spine of the Mauryan and Mughal empires.",
        citation: "Archaeological Survey of India (ASI) & Schwartzberg Historical Atlas",
        color: "#f59e0b"
      }
    },
    {
      type: "Feature",
      id: "dakshinapatha",
      geometry: {
        type: "LineString",
        coordinates: [
          [82.9739, 25.3176], // Varanasi
          [81.3800, 25.3400], // Kaushambi
          [77.8100, 23.5300], // Vidisha
          [75.7682, 23.1765], // Ujjayini
          [75.5800, 22.1800], // Maheshwar (Narmada crossing)
          [75.3800, 19.4800], // Pratishthana (Paithan)
          [76.0800, 18.2500], // Tagara (Ter)
          [80.3500, 16.5700], // Amaravati / Dharanikota
          [79.7036, 12.8342], // Kanchipuram
          [78.1198, 9.9252]   // Madurai
        ]
      },
      properties: {
        id: "dakshinapatha",
        name: "Dakshinapatha (Great Southern Highway)",
        category: "ancient_highway",
        category_display: "Ancient Trade Network",
        era: "Mauryan, Satavahana, & Chola Eras (c. 500 BCE – 14th c. CE)",
        era_active: "c. 500 BCE – 14th c. CE",
        route_type: "terrestrial_highway",
        route_type_display: "Transpeninsular Highway",
        total_length_km: 2100,
        termini: "Varanasi / Ujjayini ↔ Pratishthana, Amaravati & Madurai",
        connected_nodes: "Varanasi, Kaushambi, Vidisha, Ujjayini, Maheshwar (Narmada), Pratishthana (Paithan), Tagara, Amaravati, Kanchipuram, Madurai",
        key_stations: "Varanasi, Kaushambi, Vidisha, Ujjayini, Maheshwar (Narmada), Pratishthana (Paithan), Tagara, Amaravati, Kanchipuram, Madurai",
        commodities: "Black pepper, pearls from Gulf of Mannar, beryls from Coimbatore, fine cotton textiles, sandalwood, semi-precious carnelian beads",
        chronicles: "Kautilya (Arthashastra Book VII: 'Dakshinapatha is superior as it traverses mineral, diamond, and pearl country'), Periplus of the Erythraean Sea §50",
        historical_accounts: "Kautilya (Arthashastra Book VII), Periplus of the Erythraean Sea §50",
        significance: "The foremost trade artery connecting northern India to the rich mineral, gemstone, and textile emporia of peninsular India and the Satavahana capital at Paithan.",
        citation: "Archaeological Survey of India (ASI) & Ray, H.P. (Monastery and Guild)",
        color: "#f59e0b"
      }
    },
    {
      type: "Feature",
      id: "madhyadesha_barygaza",
      geometry: {
        type: "LineString",
        coordinates: [
          [77.6737, 27.4924], // Mathura
          [78.1828, 26.2183], // Gwalior
          [77.8100, 23.5300], // Vidisha / Besnagar
          [75.7682, 23.1765], // Ujjayini
          [75.3000, 22.5900], // Dhar
          [75.4000, 22.3600], // Mandu
          [75.5800, 22.1800], // Maheshwar
          [72.9667, 21.7051]  // Barygaza / Bharuch
        ]
      },
      properties: {
        id: "madhyadesha_barygaza",
        name: "Central Caravan Route (Mathura–Vidisha–Ujjayini–Barygaza)",
        category: "ancient_highway",
        category_display: "Ancient Trade Network",
        era: "Mauryan, Shunga, & Western Kshatrapa (c. 300 BCE – 400 CE)",
        era_active: "c. 300 BCE – 400 CE",
        route_type: "terrestrial_highway",
        route_type_display: "Hinterland-to-Port Artery",
        total_length_km: 1100,
        termini: "Mathura / Vidisha ↔ Barygaza (Bharuch, Gulf of Khambhat)",
        connected_nodes: "Mathura, Gwalior, Vidisha (Heliodorus pillar), Ujjayini (Astronomical meridian), Mandu, Maheshwar, Barygaza",
        key_stations: "Mathura, Gwalior, Vidisha, Ujjayini, Mandu, Maheshwar, Barygaza",
        commodities: "Onyx, agate, chalcedony, spikenard, bdellium, cotton cloths, Roman gold coin imports, Mediterranean wine",
        chronicles: "Periplus of the Erythraean Sea §48 ('From Ozene all things useful for the country round are brought down to Barygaza')",
        historical_accounts: "Periplus of the Erythraean Sea §48, Ptolemy Geographia VII.1",
        significance: "Crucial trade artery funneling the agricultural and gemstone wealth of the Malwa plateau and northern plains directly into India's premier western Roman trading port.",
        citation: "Archaeological Survey of India (ASI) & Schoff, W.H.",
        color: "#f59e0b"
      }
    },

    // ========================================================
    // 2. INDIAN OCEAN MARITIME ROUTES
    // ========================================================
    {
      type: "Feature",
      id: "monsoon_arabian_sea",
      geometry: {
        type: "LineString",
        coordinates: [
          [55.0000, 14.0000], // Gulf of Aden approach
          [62.0000, 17.0000], // Open Arabian Sea crossing via Hippalus SW winds
          [68.5000, 19.5000], // Mid-Arabian Sea
          [72.9667, 21.7051], // Barygaza (Bharuch)
          [72.8028, 19.4172], // Sopara
          [73.1305, 19.2437], // Kalyan
          [74.4500, 14.2800], // Honnavar
          [76.2088, 10.1558], // Muziris (Pattanam)
          [76.5417, 9.3583],  // Nelcynda
          [76.6141, 8.8932],  // Quilon
          [77.5385, 8.0883]   // Cape Comorin
        ]
      },
      properties: {
        id: "monsoon_arabian_sea",
        name: "Western Indian Ocean Monsoon Maritime Route",
        category: "maritime_route",
        category_display: "Indian Ocean Maritime Route",
        era: "Ptolemaic, Roman, & Early Islamic Eras (c. 100 BCE – 12th c. CE)",
        era_active: "c. 100 BCE – 12th c. CE",
        route_type: "maritime_network",
        route_type_display: "Transoceanic Monsoon Route",
        total_length_km: 3800,
        termini: "Red Sea (Berenike & Myos Hormos) ↔ Barygaza, Muziris & Nelcynda",
        connected_nodes: "Alexandria, Berenike, Aden, Barygaza, Sopara, Kalyan, Muziris, Nelcynda, Quilon, Kanyakumari",
        key_stations: "Alexandria, Berenike, Aden, Barygaza, Sopara, Kalyan, Muziris, Nelcynda, Quilon, Kanyakumari",
        commodities: "Roman gold aurei, copper, tin, Italian amphorae wine, frankincense, Malabar black pepper ('Black Gold'), pearls, beryls, Chinese silk",
        chronicles: "Periplus of the Erythraean Sea, Pliny the Elder (Naturalis Historia 6.101: 'India drains our empire of 50 million sesterces annually')",
        historical_accounts: "Periplus of the Erythraean Sea, Pliny the Elder, Ptolemy Geographia",
        significance: "Exploitation of regular summer monsoon winds (Hippalus winds) allowed direct open-sea navigation between the Roman empire and Indian seaports in under 40 days.",
        citation: "Ministry of Culture (Project Mausam) & Casson, L. (Periplus Maris Erythraei)",
        color: "#0ea5e9"
      }
    },
    {
      type: "Feature",
      id: "bay_of_bengal_suvarnabhumi",
      geometry: {
        type: "LineString",
        coordinates: [
          [87.9269, 22.2986], // Tamralipti (Bengal)
          [86.5000, 20.0000], // Kalinga / Mahanadi mouth
          [83.3000, 17.7000], // Visakhapatnam coast
          [80.5000, 15.0000], // Machilipatnam
          [79.8189, 11.9022], // Arikamedu
          [79.8550, 11.1444], // Poompuhar / Kaveripattinam
          [79.8436, 10.7672], // Nagapattinam
          [83.0000, 8.5000],  // Palk Strait eastward
          [89.0000, 8.0000],  // Mid Bay of Bengal
          [93.0000, 8.0000],  // Nicobar passage
          [96.5000, 6.5000]   // Malacca Strait / Kedah
        ]
      },
      properties: {
        id: "bay_of_bengal_suvarnabhumi",
        name: "Bay of Bengal Maritime Network (Chola & Kalinga Route to Southeast Asia)",
        category: "maritime_route",
        category_display: "Indian Ocean Maritime Route",
        era: "Mauryan, Satavahana, Pallava, & Imperial Chola (c. 300 BCE – 13th c. CE)",
        era_active: "c. 300 BCE – 13th c. CE",
        route_type: "maritime_network",
        route_type_display: "Trans-Bay Maritime Artery",
        total_length_km: 3400,
        termini: "Tamralipti, Arikamedu & Nagapattinam ↔ Suvarnabhumi (Kedah, Srivijaya & Malacca)",
        connected_nodes: "Tamralipti, Manikapatna, Machilipatnam, Arikamedu, Kaveripattinam, Nagapattinam, Andaman & Nicobar, Kedah (Kataha), Srivijaya (Sumatra), Canton",
        key_stations: "Tamralipti, Manikapatna, Machilipatnam, Arikamedu, Kaveripattinam, Nagapattinam, Andaman & Nicobar, Kedah, Srivijaya, Canton",
        commodities: "Bengal fine muslins, Coromandel painted chintz, iron weapons, camphor, cloves, nutmeg, sandalwood, Buddhist and Hindu iconography",
        chronicles: "Pattinappalai (Sangam text), Faxian travelogues (414 CE), Thanjavur Inscription of Rajendra Chola I (1025 CE naval campaign)",
        historical_accounts: "Thanjavur Big Temple epigraphs, Faxian, Chau Ju-Kua (Chu-fan-chi)",
        significance: "Maritime highway facilitating extensive commercial, religious, and architectural exchanges, giving birth to Indianized kingdoms and monumental temples across Southeast Asia.",
        citation: "Archaeological Survey of India (ASI) & Ministry of Culture (Project Mausam)",
        color: "#0ea5e9"
      }
    },

    // ========================================================
    // 3. SILK ROAD CONNECTIONS
    // ========================================================
    {
      type: "Feature",
      id: "ladakh_karakoram_silk_branch",
      geometry: {
        type: "LineString",
        coordinates: [
          [74.7973, 34.0837], // Srinagar
          [75.3000, 34.3000], // Sonamarg
          [75.5200, 34.2800], // Zoji La Pass (3,528 m)
          [76.1300, 34.5500], // Kargil
          [77.5771, 34.1526], // Leh (Ladakh)
          [77.6050, 34.2790], // Khardung La Pass (5,359 m)
          [77.5600, 34.5600], // Diskit (Nubra Valley)
          [77.5400, 34.7800], // Panamik
          [77.7500, 35.0300], // Saser La Pass
          [77.9200, 35.4000], // Daulat Beg Oldi
          [77.8280, 35.5140]  // Karakoram Pass (5,540 m) -> To Yarkand / Kashgar
        ]
      },
      properties: {
        id: "ladakh_karakoram_silk_branch",
        name: "Karakoram & Ladakh Silk Route Feeder",
        category: "silk_road",
        category_display: "Silk Road Connection",
        era: "Kushan, Tibetan, & Dogra Eras (c. 1st c. CE – 1949 CE)",
        era_active: "c. 1st c. CE – 20th c. CE",
        route_type: "silk_road_connection",
        route_type_display: "High-Altitude Trans-Himalayan Pass",
        total_length_km: 950,
        termini: "Srinagar & Leh (Ladakh) ↔ Yarkand & Kashgar (Tarim Basin, Silk Road)",
        connected_nodes: "Srinagar, Kargil, Leh, Nubra Valley, Panamik, Karakoram Pass, Yarkand, Kashgar",
        key_stations: "Srinagar, Kargil, Leh, Nubra Valley, Panamik, Karakoram Pass, Yarkand, Kashgar",
        commodities: "Central Asian raw silk, jade from Khotan, pashmina (cashmere) wool, saffron, musk, tea, borax, silver yambus",
        chronicles: "Mirza Muhammad Haidar Dughlat (Tarikh-i-Rashidi), Sven Hedin (Transhimalaya), Survey of India trans-Himalayan surveys",
        historical_accounts: "Tarikh-i-Rashidi, Cunningham (Ladak: Physical, Statistical, and Historical 1854)",
        significance: "The highest commercial caravan route on Earth crossing five major passes above 5,000 meters, linking the Indian plains to the northern and southern Silk Roads of Central Asia.",
        citation: "UNESCO Silk Roads Programme & Cunningham, A. (1854)",
        color: "#a855f7"
      }
    },
    {
      type: "Feature",
      id: "gandhara_bactria_silk_feeder",
      geometry: {
        type: "LineString",
        coordinates: [
          [72.8277, 33.7463], // Taxila
          [72.2300, 33.8800], // Attock (Indus)
          [71.5249, 34.0151], // Peshawar (Purushapura)
          [71.1500, 34.1000], // Khyber Pass
          [70.4500, 34.4300], // Jalalabad
          [69.2000, 34.5500], // Kabul
          [67.8200, 34.8200], // Bamiyan (Silk Road valley)
          [66.8900, 36.7500]  // Balkh (Bactria - Great Silk Road junction)
        ]
      },
      properties: {
        id: "gandhara_bactria_silk_feeder",
        name: "Gandhara–Khyber Silk Road Link (To Bactria)",
        category: "silk_road",
        category_display: "Silk Road Connection",
        era: "Achaemenid, Mauryan, Indo-Greek, & Kushan (c. 500 BCE – 8th c. CE)",
        era_active: "c. 500 BCE – 8th c. CE",
        route_type: "silk_road_connection",
        route_type_display: "Trans-Continental Mountain Defile",
        total_length_km: 850,
        termini: "Taxila & Peshawar ↔ Balkh (Bactra, Crossroads of Central Asian Silk Road)",
        connected_nodes: "Taxila, Peshawar (Purushapura), Khyber Pass, Nagarahara (Jalalabad), Kabul, Bamiyan, Balkh (Bactria)",
        key_stations: "Taxila, Peshawar, Khyber Pass, Nagarahara, Kabul, Bamiyan, Balkh",
        commodities: "Chinese raw silk, lapis lazuli from Badakhshan, Bactrian horses, Roman glassware, Greco-Buddhist sculptures, Sanskrit manuscripts",
        chronicles: "Xuanzang (Great Tang Records on the Western Regions 629 CE), Faxian, Strabo Geographica",
        historical_accounts: "Xuanzang, Strabo, Arrian Anabasis of Alexander",
        significance: "The definitive cultural and commercial corridor transmitting Buddhism, Indian mathematical concepts, and trade goods from India into Central Asia, China, and the Eurasian Silk Road.",
        citation: "UNESCO Silk Roads Programme & Archaeological Survey of India (ASI)",
        color: "#a855f7"
      }
    },
    {
      type: "Feature",
      id: "tea_horse_sikkim_chumbi",
      geometry: {
        type: "LineString",
        coordinates: [
          [88.3639, 22.5726], // Calcutta
          [88.1400, 25.0100], // Malda
          [88.4312, 26.7271], // Siliguri
          [88.4667, 27.0667], // Kalimpong
          [88.6065, 27.3389], // Gangtok
          [88.8314, 27.3864], // Nathu La Pass (4,310 m)
          [88.9000, 27.4800], // Chumbi Valley (Yadong)
          [89.6000, 28.9200], // Gyantse
          [91.1300, 29.6500]  // Lhasa
        ]
      },
      properties: {
        id: "tea_horse_sikkim_chumbi",
        name: "Sikkim–Chumbi Valley Route (Old Silk / Tea Horse Branch)",
        category: "silk_road",
        category_display: "Silk Road Connection",
        era: "Pala, Tibetan, & British Raj (c. 8th c. CE – 1962 CE)",
        era_active: "c. 8th c. CE – 20th c. CE",
        route_type: "silk_road_connection",
        route_type_display: "Trans-Himalayan Trade Defile",
        total_length_km: 780,
        termini: "Bengal Plains (Siliguri & Kalimpong) ↔ Lhasa (Tibet)",
        connected_nodes: "Calcutta, Siliguri, Kalimpong, Gangtok, Nathu La, Jelep La, Chumbi Valley, Gyantse, Lhasa",
        key_stations: "Siliguri, Kalimpong, Gangtok, Nathu La, Jelep La, Chumbi Valley, Gyantse, Lhasa",
        commodities: "Tibetan raw wool, musk, yak tails, medicinal herbs, Chinese tea bricks, Darjeeling tea, manufactured Indian cotton goods",
        chronicles: "Younghusband Expedition records (1904), Asiatic Society of Bengal memoirs, Survey of India frontier route logs",
        historical_accounts: "Younghusband (1904), Bell, Sir Charles (Tibet: Past & Present 1924)",
        significance: "The eastern Himalayan gateway between India and Tibet, handling over 70% of trans-Himalayan commerce until the mid-20th century.",
        citation: "Survey of India Archives & Asiatic Society of Bengal",
        color: "#a855f7"
      }
    },

    // ========================================================
    // 4. SPICE TRADE ROUTES
    // ========================================================
    {
      type: "Feature",
      id: "malabar_pepper_circuit",
      geometry: {
        type: "LineString",
        coordinates: [
          [74.4500, 14.2800], // Honnavar
          [74.5500, 13.9800], // Bhatkal
          [74.6900, 13.6200], // Kundapura
          [74.8560, 12.9141], // Mangalore
          [75.3704, 11.8745], // Cannanore (Kannur)
          [75.7804, 11.2588], // Calicut (Kozhikode)
          [76.2088, 10.1558], // Muziris (Kodungallur)
          [76.2673, 9.9312],  // Cochin
          [76.5417, 9.3583],  // Nelcynda (Niranam)
          [76.6141, 8.8932],  // Quilon (Kollam)
          [77.5385, 8.0883]   // Kanyakumari
        ]
      },
      properties: {
        id: "malabar_pepper_circuit",
        name: "Malabar Coast 'Black Gold' Pepper Route",
        category: "spice_route",
        category_display: "Spice Trade Route",
        era: "Classical Antiquity to Early Modern (c. 300 BCE – 18th c. CE)",
        era_active: "c. 300 BCE – 18th c. CE",
        route_type: "spice_circuit",
        route_type_display: "Coastal Spice Cabotage Route",
        total_length_km: 850,
        termini: "Honnavar & Cannanore ↔ Muziris, Quilon & Kanyakumari",
        connected_nodes: "Honnavar, Mangalore, Cannanore, Calicut, Muziris, Cochin, Nelcynda, Quilon, Kanyakumari",
        key_stations: "Honnavar, Mangalore, Cannanore, Calicut, Muziris, Cochin, Nelcynda, Quilon, Kanyakumari",
        commodities: "Malabar Tellicherry black pepper, green cardamom, wild ginger, Malabar cinnamon, betel nut, Malabar teak for shipbuilding",
        chronicles: "Pliny the Elder, Periplus of the Erythraean Sea §56, Sangam Akananuru 149 ('Yavana ships arrive with gold and depart laden with pepper')",
        historical_accounts: "Sangam Akananuru, Pliny, Ibn Battuta (1342 CE), Vasco da Gama logs (1498 CE)",
        significance: "The epicentre of the global spice trade for two millennia, attracting Phoenician, Roman, Arab, Chinese, Venetian, and Portuguese fleets and dictating international geopolitical rivalries.",
        citation: "Archaeological Survey of India (ASI) & Kerala State Archaeology",
        color: "#10b981"
      }
    },
    {
      type: "Feature",
      id: "coromandel_spice_textile",
      geometry: {
        type: "LineString",
        coordinates: [
          [80.3167, 13.4167], // Pulicat
          [80.2783, 13.0333], // Madras / San Thome
          [80.1927, 12.6269], // Mamallapuram
          [79.8189, 11.9022], // Arikamedu
          [79.7714, 11.7480], // Cuddalore
          [79.8550, 11.1444], // Kaveripattinam (Poompuhar)
          [79.8528, 11.0289], // Tranquebar
          [79.8436, 10.7672], // Nagapattinam
          [79.8600, 10.2900], // Point Calimere
          [78.0833, 8.6333]   // Korkai (Pearl Coast)
        ]
      },
      properties: {
        id: "coromandel_spice_textile",
        name: "Coromandel Spice & Textile Coastal Route",
        category: "spice_route",
        category_display: "Spice Trade Route",
        era: "Sangam, Pallava, Chola, & Colonial (c. 200 BCE – 18th c. CE)",
        era_active: "c. 200 BCE – 18th c. CE",
        route_type: "spice_circuit",
        route_type_display: "Littoral Maritime Corridor",
        total_length_km: 750,
        termini: "Pulicat & Madras ↔ Kaveripattinam, Nagapattinam & Korkai",
        connected_nodes: "Pulicat, San Thome, Mamallapuram, Arikamedu, Poompuhar, Tranquebar, Nagapattinam, Korkai",
        key_stations: "Pulicat, San Thome, Mamallapuram, Arikamedu, Poompuhar, Tranquebar, Nagapattinam, Korkai",
        commodities: "Painted chintz textiles, dyed kalamkari cloth, natural indigo cakes, Ceylon cinnamon, Gulf of Mannar natural pearls, turtle shells",
        chronicles: "Pattinappalai, Periplus of the Erythraean Sea §60, Marco Polo (1292 CE description of the Pearl Fishery Coast)",
        historical_accounts: "Pattinappalai, Periplus, Marco Polo, VOC (Dutch East India Company) factory records",
        significance: "Coastal maritime corridor bartering world-famous south Indian textiles for Southeast Asian nutmeg, mace, and cloves, while commanding the celebrated pearl beds of Korkai.",
        citation: "Archaeological Survey of India (ASI) & Tamil Nadu Maritime History",
        color: "#10b981"
      }
    },

    // ========================================================
    // 5. ANCIENT PORTS (MONUMENTAL MARITIME EMPORIA - POINTS)
    // ========================================================
    {
      type: "Feature",
      id: "port_lothal",
      geometry: {
        type: "Point",
        coordinates: [72.2494, 22.5222]
      },
      properties: {
        id: "port_lothal",
        name: "Lothal (World's Earliest Tidal Dockyard)",
        category: "ancient_port",
        category_display: "Ancient Port & Emporium",
        era: "Mature Harappan (c. 2400–1900 BCE)",
        era_active: "c. 2400–1900 BCE",
        route_type: "port_emporium",
        route_type_display: "Engineered Bronze Age Tidal Port",
        location_desc: "Bhogavo River estuary, Gulf of Khambhat, Gujarat",
        connected_nodes: "Indus Valley cities (Mohenjo-daro, Harappa) ↔ Dilmun (Bahrain), Magan (Oman), Ur (Mesopotamia)",
        commodities: "Carnelian etched beads, worked ivory combs, copper ingots, steatite seals, shell bangles",
        chronicles: "Excavations by Dr. S.R. Rao (ASI 1955–1962), Mesopotamian cuneiform records of 'Meluhha' trade",
        historical_accounts: "ASI Excavation Memoir No. 78 (Rao, S.R. 1979/1985)",
        significance: "Features a trapezoidal kiln-burnt brick basin (214 × 36 m) with inlet and spillway lock gates engineered to float sea vessels during high tides, recognized as humanity's earliest known tidal dockyard.",
        citation: "Archaeological Survey of India (ASI) & UNESCO Tentative List",
        color: "#fbbf24"
      }
    },
    {
      type: "Feature",
      id: "port_barygaza",
      geometry: {
        type: "Point",
        coordinates: [72.9667, 21.7051]
      },
      properties: {
        id: "port_barygaza",
        name: "Barygaza / Bharuch (Emporium of Western India)",
        category: "ancient_port",
        category_display: "Ancient Port & Emporium",
        era: "Mauryan, Satavahana, & Western Kshatrapa (c. 300 BCE – 400 CE)",
        era_active: "c. 300 BCE – 400 CE",
        route_type: "port_emporium",
        route_type_display: "Estuarine Roman Gateway Port",
        location_desc: "Narmada River mouth, Gulf of Khambhat, Gujarat",
        connected_nodes: "Red Sea (Myos Hormos, Berenike) ↔ Ujjayini, Mathura, Pataliputra, Tagara, Paithan",
        commodities: "Exported spikenard, costus, bdellium, ivory, agate, carnelian, silks; Imported Italian wine, copper, tin, lead, gold & silver aurei",
        chronicles: "Periplus of the Erythraean Sea §41–49 ('The country of Barygaza is exceedingly fertile... the entrance is difficult on account of the tides')",
        historical_accounts: "Periplus Maris Erythraei, Ptolemy Geographia VII.1",
        significance: "The foremost western gateway for Indo-Roman commerce; pilot boats operated by the local king guided international merchant vessels safely through treacherous river mouth bores.",
        citation: "Archaeological Survey of India (ASI Vadodara Circle) & Schoff, W.H.",
        color: "#fbbf24"
      }
    },
    {
      type: "Feature",
      id: "port_muziris",
      geometry: {
        type: "Point",
        coordinates: [76.2088, 10.1558]
      },
      properties: {
        id: "port_muziris",
        name: "Muziris / Pattanam (Roman Pepper Capital)",
        category: "ancient_port",
        category_display: "Ancient Port & Emporium",
        era: "Chera Kingdom & Roman Empire (c. 100 BCE – 6th c. CE)",
        era_active: "c. 100 BCE – 6th c. CE",
        route_type: "port_emporium",
        route_type_display: "Premier Roman Transoceanic Emporium",
        location_desc: "Periyar River delta, Kodungallur / Pattanam, Kerala",
        connected_nodes: "Alexandria, Berenike ↔ Karur (Chera capital), Madurai, Nelcynda, Rome",
        commodities: "Exported Malabar black pepper, beryl gemstones, pearls, tortoise-shell; Imported Roman gold coin hoards, Terra Sigillata, amphorae",
        chronicles: "Periplus §53–54, Pliny Naturalis Historia 6.104, Tabula Peutingeriana (showing Temple of Augustus), Sangam Akananuru 149",
        historical_accounts: "Tabula Peutingeriana, Pliny, Sangam poetry, Muziris Papyrus (Vienna)",
        significance: "The greatest trading emporium of south India. The Muziris Papyrus documents a single 2nd-century Roman cargo ship (Hermapollon) carrying goods valued at over 131 talents of gold.",
        citation: "Kerala Council for Historical Research (KCHR) & Archaeological Survey of India (ASI)",
        color: "#fbbf24"
      }
    },
    {
      type: "Feature",
      id: "port_arikamedu",
      geometry: {
        type: "Point",
        coordinates: [79.8189, 11.9022]
      },
      properties: {
        id: "port_arikamedu",
        name: "Arikamedu / Poduke (Roman Ceramic & Bead Port)",
        category: "ancient_port",
        category_display: "Ancient Port & Emporium",
        era: "Early Historic Indo-Roman (c. 200 BCE – 200 CE)",
        era_active: "c. 200 BCE – 200 CE",
        route_type: "port_emporium",
        route_type_display: "Manufacturing & Maritime Trade Hub",
        location_desc: "Ariyankuppam River bank, Puducherry",
        connected_nodes: "Mediterranean ports ↔ Suvarnabhumi, Kanchipuram, Kaveripattinam, Anuradhapura (Sri Lanka)",
        commodities: "Exported glass Indo-Pacific beads, fine cotton textiles, muslin; Imported Roman wine amphorae, Arretine ware ceramics, Roman intaglios",
        chronicles: "Periplus of the Erythraean Sea §60 (listing 'Poduke'), Excavations by Sir Mortimer Wheeler (1945)",
        historical_accounts: "Wheeler, R.E.M. (Ancient India No. 2, 1946), Casal, J.M. (1949)",
        significance: "Revealed extensive brick warehouse quays, dye-vats, and thousands of Mediterranean amphorae fragments, proving permanent settlement of Greco-Roman merchants on the Coromandel coast.",
        citation: "Archaeological Survey of India (ASI) & Wheeler, R.E.M.",
        color: "#fbbf24"
      }
    },
    {
      type: "Feature",
      id: "port_tamralipti",
      geometry: {
        type: "Point",
        coordinates: [87.9269, 22.2986]
      },
      properties: {
        id: "port_tamralipti",
        name: "Tamralipti / Tamluk (Bay of Bengal Embarkation Port)",
        category: "ancient_port",
        category_display: "Ancient Port & Emporium",
        era: "Mauryan, Gupta, & Pala Eras (c. 400 BCE – 8th c. CE)",
        era_active: "c. 400 BCE – 8th c. CE",
        route_type: "port_emporium",
        route_type_display: "Deltaic Riverine-Maritime Terminal",
        location_desc: "Rupnarayan River, Bengal Delta (Modern Tamluk, West Bengal)",
        connected_nodes: "Pataliputra, Varanasi, Taxila (via Uttarapatha) ↔ Sri Lanka, Kedah, Java, Sumatra, China",
        commodities: "Bengal fine muslins, terracotta plaques, iron tools, Buddhist manuscripts, spices from Southeast Asia, Chinese silk",
        chronicles: "Mahavamsa (Emperor Ashoka sending Bodhi tree sapling with Princess Sanghamitta), Faxian (411 CE), Xuanzang (639 CE), Yijing (673 CE)",
        historical_accounts: "Faxian (Record of Buddhistic Kingdoms), Xuanzang (Si-Yu-Ki), Yijing",
        significance: "The eastern maritime terminal of the ancient Uttarapatha highway where merchant fleets and Buddhist pilgrims boarded transoceanic vessels bound for Southeast Asia and China.",
        citation: "Archaeological Survey of India (ASI Kolkata Circle)",
        color: "#fbbf24"
      }
    },
    {
      type: "Feature",
      id: "port_sopara",
      geometry: {
        type: "Point",
        coordinates: [72.8028, 19.4172]
      },
      properties: {
        id: "port_sopara",
        name: "Sopara / Shurparaka (Konkan Ashokan Port)",
        category: "ancient_port",
        category_display: "Ancient Port & Emporium",
        era: "Mauryan, Satavahana, to Silahara (c. 3rd c. BCE – 13th c. CE)",
        era_active: "c. 3rd c. BCE – 13th c. CE",
        route_type: "port_emporium",
        route_type_display: "Ancient Capital & Maritime Port",
        location_desc: "Palghar / North Konkan, Maharashtra",
        connected_nodes: "Arabia, Persian Gulf, Rome ↔ Paithan, Nashik, Junnar, Ujjain",
        commodities: "Exported cotton cloth, iron, timber, spices; Imported copper, Roman coins, Arabian incense",
        chronicles: "Mahabharata (sacred Shurparaka), Ashoka's Major Rock Edicts VIII and IX found here, Periplus §52, Ptolemy",
        historical_accounts: "Pandit Bhagwanlal Indraji (1882 excavations), Ashokan rock inscriptions",
        significance: "Ancient capital of the coastal province of Aparanta; 1882 excavations by Bhagwanlal Indraji un-earthed an Ashokan Buddhist stupa with a stone coffer containing sacred relic caskets.",
        citation: "Archaeological Survey of India (ASI Mumbai Circle)",
        color: "#fbbf24"
      }
    },
    {
      type: "Feature",
      id: "port_poompuhar",
      geometry: {
        type: "Point",
        coordinates: [79.8550, 11.1444]
      },
      properties: {
        id: "port_poompuhar",
        name: "Poompuhar / Kaveripattinam (Chola Maritime Capital)",
        category: "ancient_port",
        category_display: "Ancient Port & Emporium",
        era: "Early Chola Sangam Era (c. 300 BCE – 500 CE)",
        era_active: "c. 300 BCE – 500 CE",
        route_type: "port_emporium",
        route_type_display: "River-Confluence Sangam Seaport",
        location_desc: "Kaveri River confluence with Bay of Bengal, Tamil Nadu",
        connected_nodes: "Sri Lanka, Southeast Asia, Rome ↔ Uraiyur, Madurai, Thanjavur",
        commodities: "Pepper, pearls, precious coral, gemstones, horses from Arabia, manufactured silks from China",
        chronicles: "Sangam classics Silappadikaram and Manimekalai, Pattinappalai, Periplus §60, Ptolemy",
        historical_accounts: "Silappadikaram (Ilango Adigal), Pattinappalai (Kadiyalur Uruttirangannanar)",
        significance: "Celebrated in ancient Tamil epics; marine archaeological expeditions by the National Institute of Oceanography (NIO) discovered submerged brick structures, wharves, and ring-wells off its coast.",
        citation: "National Institute of Oceanography (NIO) & Tamil Nadu Archaeology Dept",
        color: "#fbbf24"
      }
    },
    {
      type: "Feature",
      id: "port_korkai",
      geometry: {
        type: "Point",
        coordinates: [78.0833, 8.6333]
      },
      properties: {
        id: "port_korkai",
        name: "Korkai (Pandyan Pearl Fishery Capital)",
        category: "ancient_port",
        category_display: "Ancient Port & Emporium",
        era: "Early Pandyan Sangam Era (c. 4th c. BCE – 3rd c. CE)",
        era_active: "c. 4th c. BCE – 3rd c. CE",
        route_type: "port_emporium",
        route_type_display: "Pearl Fishery Littoral Emporium",
        location_desc: "Thamirabarani River estuary, Gulf of Mannar, Tamil Nadu",
        connected_nodes: "Rome, Alexandria, Sri Lanka ↔ Madurai (Pandyan capital)",
        commodities: "Natural Gulf of Mannar pearls, conch chanks, beryls, fine south Indian cottons",
        chronicles: "Periplus of the Erythraean Sea §59 ('Colchoi, where the pearl-fisheries are worked by condemned criminals'), Ptolemy Geographia VII.1",
        historical_accounts: "Periplus, Ptolemy, Sangam literature, Caldwell (1877 excavations)",
        significance: "The principal port and cradle of the Early Pandyan kingdom, famous throughout the ancient Greek, Roman, and Persian worlds as the world's finest pearl fishery center.",
        citation: "Tamil Nadu State Department of Archaeology & ASI",
        color: "#fbbf24"
      }
    },
    {
      type: "Feature",
      id: "port_kalyan",
      geometry: {
        type: "Point",
        coordinates: [73.1305, 19.2437]
      },
      properties: {
        id: "port_kalyan",
        name: "Kalyan / Calliena (Satavahana Trade Port)",
        category: "ancient_port",
        category_display: "Ancient Port & Emporium",
        era: "Satavahana Dynasty (c. 2nd c. BCE – 3rd c. CE)",
        era_active: "c. 2nd c. BCE – 3rd c. CE",
        route_type: "port_emporium",
        route_type_display: "Estuarine Deccan Seaport",
        location_desc: "Ulhas River / Thane Creek confluence, Maharashtra",
        connected_nodes: "Red Sea, Persian Gulf ↔ Junnar, Paithan, Ter (via Nana Ghat mountain pass)",
        commodities: "Deccan black cotton cloth, iron weapons, timber, grain, Roman wines, bronze statues",
        chronicles: "Periplus §52 ('The city of Calliena, which in the time of the elder Saraganus became a lawful market-town')",
        historical_accounts: "Periplus of the Erythraean Sea §52, Nana Ghat rock inscriptions",
        significance: "Leading northern Konkan port connected to the Deccan interior via the Nana Ghat toll-gate pass; witnessed fierce naval and trade rivalry between the Satavahanas and Western Kshatrapas.",
        citation: "Archaeological Survey of India (ASI Western Circle)",
        color: "#fbbf24"
      }
    },
    {
      type: "Feature",
      id: "port_nelcynda",
      geometry: {
        type: "Point",
        coordinates: [76.5417, 9.3583]
      },
      properties: {
        id: "port_nelcynda",
        name: "Nelcynda / Niranam (Ancient Malabar Pepper Mart)",
        category: "ancient_port",
        category_display: "Ancient Port & Emporium",
        era: "Early Historic Ay & Pandyan Era (c. 1st c. BCE – 3rd c. CE)",
        era_active: "c. 1st c. BCE – 3rd c. CE",
        route_type: "port_emporium",
        route_type_display: "Riverine Backwater Pepper Mart",
        location_desc: "Pamba / Manimala River confluence, Niranam, Kerala",
        connected_nodes: "Rome, Alexandria ↔ Madurai, Kottayam, Western Ghats pepper hills",
        commodities: "Tellicherry black pepper, malabathrum (cinnamon leaves), tortoise-shell, Roman coins, fine Mediterranean pottery",
        chronicles: "Pliny the Elder (Naturalis Historia 6.26), Periplus of the Erythraean Sea §53–54 ('Nelcynda is distant from Muziris by river and sea about 500 stadia')",
        historical_accounts: "Pliny, Periplus, Ptolemy Geographia",
        significance: "Major pepper-exporting riverine port situated safely in the Kerala backwaters where Roman merchants sailed upriver on country rafts to load vast quantities of Malabar pepper.",
        citation: "Archaeological Survey of India (ASI) & Schoff, W.H.",
        color: "#fbbf24"
      }
    },

    // ========================================================
    // 6. COLONIAL TRADE NETWORKS
    // ========================================================
    {
      type: "Feature",
      id: "colonial_riverine_eic",
      geometry: {
        type: "LineString",
        coordinates: [
          [88.3500, 22.5700], // Calcutta (Fort William)
          [88.3900, 22.9000], // Hooghly
          [88.2700, 24.1800], // Murshidabad / Cossimbazar Silk Factory
          [85.1800, 25.6000], // Patna (Gulzarbagh Opium & Saltpetre Agency)
          [83.9800, 25.5600], // Buxar
          [83.5800, 25.5800], // Ghazipur Opium Factory
          [82.9700, 25.3200], // Varanasi
          [82.5600, 25.1400], // Mirzapur Cotton Mart
          [81.8500, 25.4300], // Allahabad (Prayagraj)
          [80.3300, 26.4500], // Kanpur
          [78.0100, 27.1800]  // Agra
        ]
      },
      properties: {
        id: "colonial_riverine_eic",
        name: "East India Company Gangetic Factory & Opium Corridor",
        category: "colonial_network",
        category_display: "Colonial Trade Network",
        era: "Colonial Era (c. 1757 – 1858 CE)",
        era_active: "18th – 19th c. CE",
        route_type: "colonial_corridor",
        route_type_display: "Riverine Resource Extraction Artery",
        total_length_km: 1350,
        termini: "Calcutta (Fort William) ↔ Patna, Mirzapur & Agra",
        connected_nodes: "Calcutta, Hooghly, Murshidabad, Patna, Ghazipur, Varanasi, Mirzapur, Allahabad, Kanpur, Agra",
        key_stations: "Calcutta, Hooghly, Murshidabad, Patna, Ghazipur, Varanasi, Mirzapur, Allahabad, Kanpur, Agra",
        commodities: "Bihar manufactured opium (shipped to China in Opium trade), saltpetre (potassium nitrate for British gunpowder), raw Bengal silk, indigo dye, salt monopoly",
        chronicles: "East India Company Factory Records, Imperial Gazetteer of India, Trotter (The History of the British Empire in India)",
        historical_accounts: "EIC Factory Records, Hunter (The Imperial Gazetteer of India Vol. IV)",
        significance: "The principal economic extraction artery of the British East India Company along the Ganga, converting regional agrarian production into export revenues that funded imperial conquest.",
        citation: "National Archives of India & Imperial Gazetteer of India",
        color: "#6366f1"
      }
    },
    {
      type: "Feature",
      id: "colonial_cotton_berar_bombay",
      geometry: {
        type: "LineString",
        coordinates: [
          [79.0882, 21.1458], // Nagpur
          [77.7796, 20.9374], // Amravati (Berar Cotton Belt)
          [77.0082, 20.7002], // Akola
          [75.5626, 21.0077], // Jalgaon / Khandesh
          [74.7749, 20.9042], // Dhule
          [74.5288, 20.5539], // Malegaon
          [73.7898, 19.9975], // Nashik
          [73.4800, 19.7000], // Thull Ghat Pass
          [73.1305, 19.2437], // Kalyan
          [72.8400, 18.9400]  // Bombay Port (Cotton Green & Victoria Docks)
        ]
      },
      properties: {
        id: "colonial_cotton_berar_bombay",
        name: "Bombay Hinterland Cotton & Opium Artery",
        category: "colonial_network",
        category_display: "Colonial Trade Network",
        era: "Colonial Era (c. 1850 – 1947 CE)",
        era_active: "19th – 20th c. CE",
        route_type: "colonial_corridor",
        route_type_display: "Hinterland-to-Port Commodity Corridor",
        total_length_km: 820,
        termini: "Nagpur & Berar Cotton Belt ↔ Bombay Port (Cotton Green)",
        connected_nodes: "Nagpur, Amravati, Akola, Khandesh, Jalgaon, Nashik, Thull Ghat, Kalyan, Bombay Port",
        key_stations: "Nagpur, Amravati, Akola, Khandesh, Jalgaon, Nashik, Thull Ghat, Kalyan, Bombay Port",
        commodities: "Raw baled Deccan cotton, Malwa opium, oilseeds, Bombay textile mill yarn, British Lancashire manufactured cloth imports",
        chronicles: "Bombay Presidency Gazetteer, Reports of the Cotton Commissioner of India (1868), Morris (The Emergence of an Industrial Labour Force in India)",
        historical_accounts: "Bombay Presidency Gazetteer Vol. IX, Cotton Supply Association Reports (Manchester 1862)",
        significance: "Fueled by the American Civil War (1861–1865) cotton famine, this corridor transformed Bombay into 'Cottonopolis', financed the city's Victorian public architecture, and accelerated modern banking and deep-water dock construction.",
        citation: "Maharashtra State Archives & Imperial Gazetteer of India",
        color: "#6366f1"
      }
    },
    {
      type: "Feature",
      id: "colonial_coromandel_indigo",
      geometry: {
        type: "LineString",
        coordinates: [
          [81.1300, 16.1800], // Masulipatnam
          [80.4400, 16.3000], // Guntur
          [79.9800, 14.4400], // Nellore
          [80.3100, 13.4100], // Pulicat
          [80.2800, 13.0800], // Madras (Fort St. George)
          [79.3300, 12.9000], // Arcot
          [79.7000, 12.8300], // Kanchipuram
          [79.7700, 11.7500], // Cuddalore (Fort St. David)
          [78.1400, 11.6600]  // Salem Weaving Belt
        ]
      },
      properties: {
        id: "colonial_coromandel_indigo",
        name: "Coromandel Calico & Indigo Corridor",
        category: "colonial_network",
        category_display: "Colonial Trade Network",
        era: "Colonial Era (c. 1639 – 1850 CE)",
        era_active: "17th – 19th c. CE",
        route_type: "colonial_corridor",
        route_type_display: "Textile & Dye Extraction Artery",
        total_length_km: 680,
        termini: "Fort St. George (Madras) ↔ Masulipatnam, Arcot & Salem",
        connected_nodes: "Masulipatnam, Guntur, Nellore, Pulicat, Fort St. George (Madras), Arcot, Kanchipuram, Cuddalore, Salem",
        key_stations: "Masulipatnam, Guntur, Nellore, Pulicat, Fort St. George (Madras), Arcot, Kanchipuram, Cuddalore, Salem",
        commodities: "Coromandel piecegoods (calicoes, muslins, longcloths), natural indigo dye cakes, saltpeter, British woolens",
        chronicles: "Madras Presidency Public Consultations, Love (Vestiges of Old Madras), Imperial Gazetteer of India",
        historical_accounts: "Vestiges of Old Madras (Love, H.D. 1913), Madras District Gazetteers",
        significance: "Anchored around the first territorial acquisition of the East India Company (Fort St. George, 1639), this corridor systematized procurement from village weaver guilds and funneled south Indian textiles to Europe and Southeast Asia.",
        citation: "Tamil Nadu Archives & Imperial Gazetteer of India",
        color: "#6366f1"
      }
    },

    // ========================================================
    // 7. HISTORICAL RAILWAY DEVELOPMENT (1853–1905)
    // ========================================================
    {
      type: "Feature",
      id: "railway_gipr_1853",
      geometry: {
        type: "LineString",
        coordinates: [
          [72.8353, 18.9400], // Bombay Bori Bunder (CSMT)
          [72.8340, 18.9744], // Byculla
          [72.8478, 19.0178], // Dadar
          [72.8792, 19.0657], // Kurla
          [72.9080, 19.0860], // Ghatkopar
          [72.9360, 19.1437], // Bhandup
          [72.9759, 19.1860], // Thane (Historic terminal on 16 April 1853)
          [73.0428, 19.1889], // Diva
          [73.1305, 19.2437], // Kalyan Junction
          [73.4858, 19.6467], // Kasara (Thal Ghat foot)
          [73.5606, 19.6972], // Igatpuri (Thal Ghat summit)
          [73.8567, 18.5204]  // Pune (via Bhor Ghat reversing station)
        ]
      },
      properties: {
        id: "railway_gipr_1853",
        name: "Great Indian Peninsula Railway (GIPR, 1853 — Asia's First Line)",
        category: "historical_railway",
        category_display: "Historical Railway Development",
        era: "Pioneering Railway Era (Inaugurated 16 April 1853)",
        era_active: "1853 – Present",
        route_type: "historical_railway",
        route_type_display: "Pioneering Broad-Gauge Railway",
        total_length_km: 240,
        termini: "Bombay (Bori Bunder / CSMT) ↔ Thane & Kalyan (Extended to Pune & Jabalpur)",
        connected_nodes: "Bori Bunder, Byculla, Dadar, Kurla, Bhandup, Thane, Kalyan Junction, Thal Ghat, Bhor Ghat, Pune",
        key_stations: "Bori Bunder, Byculla, Dadar, Kurla, Bhandup, Thane, Kalyan, Kasara, Igatpuri, Pune",
        commodities: "First passenger train in Asia (400 guests, 14 carriages, 21-gun salute, hauled by locomotives Sindh, Sultan & Sahib); raw cotton, postal mail, military troops",
        chronicles: "The Bombay Times (18 April 1853 report), Administrative Reports on Indian Railways (Public Works Dept), MacGeorge (Ways and Works in India 1894)",
        historical_accounts: "The Times of India archives (1853), GIPR Company minute books",
        significance: "Inaugurated the railway age across the Asian continent on Saturday, 16 April 1853 at 3:30 PM. Overcame the formidable natural barrier of the Western Ghats with pioneering reversing station incline viaducts.",
        citation: "National Rail Museum New Delhi & Indian Railways Heritage Directorate",
        color: "#e11d48"
      }
    },
    {
      type: "Feature",
      id: "railway_eir_1854",
      geometry: {
        type: "LineString",
        coordinates: [
          [88.3426, 22.5850], // Howrah (Calcutta)
          [88.3430, 22.7523], // Serampore
          [88.3970, 22.9030], // Hooghly (15 Aug 1854 terminal)
          [87.8615, 23.2324], // Burdwan
          [87.1328, 23.6212], // Raniganj (Coalfields 1855)
          [86.9661, 23.6889], // Asansol
          [85.1376, 25.5941], // Patna
          [83.1189, 25.2817], // Mughalsarai
          [81.8463, 25.4358], // Allahabad (Yamuna Bridge 1865)
          [80.3319, 26.4499], // Kanpur
          [78.0880, 27.8974], // Aligarh
          [77.2273, 28.6608]  // Delhi Junction (Yamuna Iron Bridge 1866)
        ]
      },
      properties: {
        id: "railway_eir_1854",
        name: "East Indian Railway (EIR, 1854 — Gangetic Coal & Trunk Line)",
        category: "historical_railway",
        category_display: "Historical Railway Development",
        era: "Colonial Trunk Line Era (Inaugurated 15 August 1854)",
        era_active: "1854 – Present",
        route_type: "historical_railway",
        route_type_display: "Industrial Coal & Trunk Railway",
        total_length_km: 1500,
        termini: "Howrah (Calcutta) ↔ Hooghly, Raniganj, Allahabad & Delhi",
        connected_nodes: "Howrah, Serampore, Hooghly, Burdwan, Raniganj Coalfields, Asansol, Patna, Mughalsarai, Allahabad, Kanpur, Aligarh, Delhi Junction",
        key_stations: "Howrah, Serampore, Hooghly, Burdwan, Raniganj, Asansol, Patna, Mughalsarai, Allahabad, Kanpur, Delhi",
        commodities: "Raniganj bituminous coal (essential for steam engines & steamships), Gangetic foodgrains, jute, military personnel, millions of third-class passenger commuters",
        chronicles: "Bengal Hurkaru (16 Aug 1854), Huddleston (History of the East Indian Railway 1906), Government of India Railway Department Reports",
        historical_accounts: "Huddleston, G. (1906), East Indian Railway Committee Reports",
        significance: "Conceived by Rowland Macdonald Stephenson; opened on 15 August 1854. Connected the Bengal coalfields to Calcutta and Delhi, providing the industrial fuel and transport backbone of modern India.",
        citation: "National Rail Museum & Eastern Railway Heritage Archives",
        color: "#e11d48"
      }
    },
    {
      type: "Feature",
      id: "railway_madras_1856",
      geometry: {
        type: "LineString",
        coordinates: [
          [80.2944, 13.1097], // Royapuram (Madras)
          [80.2394, 13.1089], // Perambur
          [79.6678, 13.0788], // Arakkonam
          [79.3589, 12.9278], // Walajah Road (Arcot - 1 July 1856 terminal)
          [79.1350, 12.9739], // Katpadi / Vellore
          [78.5778, 12.5714], // Jolarpettai
          [78.1460, 11.6643], // Salem
          [77.7172, 11.3410], // Erode
          [76.9558, 11.0168], // Coimbatore
          [76.6548, 10.7867], // Palakkad Gap
          [76.2778, 10.7610], // Shoranur
          [75.8100, 11.1800]  // Beypore / Calicut (Arabian Sea 1862)
        ]
      },
      properties: {
        id: "railway_madras_1856",
        name: "Madras Railway (1856 — Peninsular East–West Trunk Line)",
        category: "historical_railway",
        category_display: "Historical Railway Development",
        era: "Early Railway Era (Inaugurated 1 July 1856)",
        era_active: "1856 – Present",
        route_type: "historical_railway",
        route_type_display: "Transpeninsular Coast-to-Coast Railway",
        total_length_km: 660,
        termini: "Royapuram (Madras) ↔ Walajah Road & Beypore (Calicut, Arabian Sea)",
        connected_nodes: "Royapuram, Perambur, Arakkonam, Walajah Road, Katpadi, Jolarpettai, Salem, Erode, Coimbatore, Palghat Gap, Shoranur, Beypore",
        key_stations: "Royapuram, Perambur, Arakkonam, Walajah Road, Katpadi, Salem, Erode, Coimbatore, Palghat Gap, Beypore",
        commodities: "South Indian cotton bales, spices from Malabar, handloom textiles, tea from Nilgiri hills, salt, imperial troops",
        chronicles: "Madras Athenaeum (July 1856), Administrative Reports on Southern Railways, Imperial Gazetteer of India",
        historical_accounts: "Madras Athenaeum, Southern Railway Heritage Archives",
        significance: "Opened on 1 July 1856 from Royapuram (today the oldest surviving railway station structure in the subcontinent). In 1862, it bridged the Indian peninsula from Bay of Bengal to Arabian Sea through the Palghat Gap.",
        citation: "National Rail Museum & Southern Railway Heritage Centre",
        color: "#e11d48"
      }
    },
    {
      type: "Feature",
      id: "railway_dalhousie_trunk_grid",
      geometry: {
        type: "LineString",
        coordinates: [
          [71.5249, 34.0151], // Peshawar (North-West Frontier)
          [73.0169, 33.5651], // Rawalpindi
          [74.3587, 31.5204], // Lahore
          [74.8723, 31.6340], // Amritsar
          [75.8573, 30.9010], // Ludhiana
          [76.7767, 30.3782], // Ambala
          [77.2273, 28.6608], // Delhi
          [78.0081, 27.1767], // Agra
          [78.1828, 26.2183], // Gwalior
          [78.5685, 25.4484], // Jhansi
          [77.4126, 23.2599], // Bhopal
          [77.7500, 21.9333], // Itarsi Junction
          [79.0882, 21.1458], // Nagpur
          [78.6022, 20.7453], // Wardha
          [78.4867, 17.3850], // Hyderabad
          [77.3667, 15.1667], // Guntakal Junction
          [77.5946, 12.9716], // Bangalore
          [80.2707, 13.0827]  // Madras Central
        ]
      },
      properties: {
        id: "railway_dalhousie_trunk_grid",
        name: "Imperial Trunk Railway Grid (Lord Dalhousie Plan 1853–1880s)",
        category: "historical_railway",
        category_display: "Historical Railway Development",
        era: "High Colonial Trunk Grid Era (1853–1905 CE)",
        era_active: "1853 – Present",
        route_type: "historical_railway",
        route_type_display: "Grand Imperial Strategic & Commercial Grid",
        total_length_km: 3200,
        termini: "Peshawar & Lahore ↔ Delhi, Nagpur, Hyderabad, Bangalore & Madras",
        connected_nodes: "Peshawar, Rawalpindi, Lahore, Amritsar, Ludhiana, Ambala, Delhi, Agra, Gwalior, Jhansi, Bhopal, Itarsi, Nagpur, Hyderabad, Guntakal, Bangalore, Madras",
        key_stations: "Peshawar, Lahore, Amritsar, Delhi, Agra, Jhansi, Bhopal, Itarsi, Nagpur, Hyderabad, Guntakal, Bangalore, Madras",
        commodities: "National freight spine: coal, foodgrains, cotton, iron machinery, postal parcels, trans-subcontinental express trains (Grand Trunk Express)",
        chronicles: "Lord Dalhousie's Famous Railway Minute of 20 April 1853, Imperial Gazetteer of India Vol. III (Public Works), Davidson (The Railways of India 1868)",
        historical_accounts: "Governor-General Lord Dalhousie Minute (1853), Imperial Gazetteer of India Vol. III",
        significance: "The master blueprint formulated by Governor-General Lord Dalhousie in his historic 1853 minute. Linked India's presidency ports and strategic frontiers, unifying the subcontinental economy and laying the foundation for Indian Railways.",
        citation: "Ministry of Railways & National Rail Museum New Delhi",
        color: "#e11d48"
      }
    }
  ]
};

const outputPath = path.join('public', 'data', 'historical_trade_routes.geojson');
fs.writeFileSync(outputPath, JSON.stringify(tradeRoutesData, null, 2), 'utf8');
console.log(`Successfully generated ${outputPath} with ${tradeRoutesData.features.length} features.`);
