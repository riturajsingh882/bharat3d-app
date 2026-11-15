// Curated wildlife sanctuaries, national parks & protected species per state.
// Source: Wildlife (Protection) Act 1972 schedules, State Forest Departments,
// Wildlife Institute of India (WII) & ENVIS centres (educational overview).
// Keys match the exact `shapeName` values in india_states.geojson.
export interface WildlifeInfo {
  reserves: string[];
  species: string[];
}

export const STATE_WILDLIFE: Record<string, WildlifeInfo> = {
  'Mahārāshtra': {
    reserves: ['Tadoba-Andhari Tiger Reserve', 'Pench Tiger Reserve', 'Melghat Tiger Reserve', 'Sanjay Gandhi National Park', 'Radhanagari Wildlife Sanctuary'],
    species: ['Bengal Tiger', 'Indian Leopard', 'Great Indian Bustard', 'Gaur (Indian Bison)', 'Sloth Bear', 'Dhole (Wild Dog)', 'Indian Pangolin', 'Forest Owlet', 'Mugger Crocodile', 'Indian Giant Squirrel'],
  },
  'Tamil Nādu': {
    reserves: ['Mudumalai Tiger Reserve', 'Anamalai Tiger Reserve', 'Kalakkad-Mundanthurai Tiger Reserve', 'Gulf of Mannar Marine National Park', 'Guindy National Park'],
    species: ['Nilgiri Tahr', 'Bengal Tiger', 'Asian Elephant', 'Indian Leopard', 'Lion-tailed Macaque', 'Nilgiri Langur', 'Gharial', 'Olive Ridley Turtle', 'Sloth Bear', 'Great Hornbill'],
  },
  'Kerala': {
    reserves: ['Periyar Tiger Reserve', 'Silent Valley National Park', 'Eravikulam National Park', 'Wayanad Wildlife Sanctuary', 'Parambikulam Tiger Reserve'],
    species: ['Asian Elephant', 'Bengal Tiger', 'Nilgiri Tahr', 'Lion-tailed Macaque', 'Indian Leopard', 'Great Hornbill', 'Nilgiri Marten', 'Mugger Crocodile', 'Malabar Civet', 'Gaur (Indian Bison)'],
  },
  'Karnātaka': {
    reserves: ['Bandipur Tiger Reserve', 'Nagarhole Tiger Reserve', 'Bhadra Wildlife Sanctuary', 'Bannerghatta National Park', 'Kudremukh National Park'],
    species: ['Bengal Tiger', 'Asian Elephant', 'Indian Leopard', 'Gaur (Indian Bison)', 'Sloth Bear', 'Dhole (Wild Dog)', 'Lion-tailed Macaque', 'Great Hornbill', 'Indian Pangolin', 'King Cobra'],
  },
  'Assam': {
    reserves: ['Kaziranga National Park', 'Manas National Park', 'Nameri National Park', 'Dibru-Saikhowa National Park', 'Pobitora Wildlife Sanctuary'],
    species: ['One-horned Rhinoceros', 'Bengal Tiger', 'Asian Elephant', 'Wild Water Buffalo', 'Golden Langur', 'Hoolock Gibbon', 'Pygmy Hog', 'Great Hornbill', 'Ganges River Dolphin', 'White-winged Duck'],
  },
  'West Bengal': {
    reserves: ['Sundarbans National Park', 'Jaldapara National Park', 'Buxa Tiger Reserve', 'Gorumara National Park', 'Neora Valley National Park'],
    species: ['Royal Bengal Tiger', 'Ganges River Dolphin', 'One-horned Rhinoceros', 'Red Panda', 'Asian Elephant', 'Fishing Cat', 'Estuarine Crocodile', 'Olive Ridley Turtle', 'Hog Deer', 'Himalayan Newt'],
  },
  'Uttar Pradesh': {
    reserves: ['Dudhwa National Park', 'Pilibhit Tiger Reserve', 'Hastinapur Wildlife Sanctuary', 'Katarniaghat Wildlife Sanctuary', 'Okhla Bird Sanctuary'],
    species: ['Bengal Tiger', 'Barasingha (Swamp Deer)', 'Ganges River Dolphin', 'Sloth Bear', 'Indian Leopard', 'Gharial', 'Sarus Crane', 'Asian Elephant', 'Mugger Crocodile', 'Sambar Deer'],
  },
  'Rājasthān': {
    reserves: ['Ranthambore National Park', 'Sariska Tiger Reserve', 'Keoladeo National Park', 'Desert National Park', 'Kumbhalgarh Wildlife Sanctuary'],
    species: ['Bengal Tiger', 'Indian Leopard', 'Great Indian Bustard', 'Chinkara', 'Desert Fox', 'Sloth Bear', 'Blackbuck', 'Gharial', 'Indian Wolf', 'Demoiselle Crane'],
  },
  'Madhya Pradesh': {
    reserves: ['Kanha Tiger Reserve', 'Bandhavgarh Tiger Reserve', 'Pench Tiger Reserve', 'Satpura Tiger Reserve', 'Panna Tiger Reserve', 'Kuno National Park'],
    species: ['Bengal Tiger', 'Hardground Barasingha', 'Indian Leopard', 'Sloth Bear', 'Dhole (Wild Dog)', 'Gaur (Indian Bison)', 'Chital (Spotted Deer)', 'Gharial', 'Indian Skimmer', 'Long-billed Vulture'],
  },
  'Gujarāt': {
    reserves: ['Gir National Park', 'Little Rann of Kutch Wild Ass Sanctuary', 'Marine National Park', 'Velavadar Blackbuck National Park', 'Nalsarovar Bird Sanctuary'],
    species: ['Asiatic Lion', 'Indian Wild Ass', 'Blackbuck', 'Indian Leopard', 'Sloth Bear', 'Greater Flamingo', 'Great Indian Bustard', 'Mugger Crocodile', 'Indian Wolf', 'Chinkara'],
  },
  'Bihār': {
    reserves: ['Valmiki Tiger Reserve', 'Vikramshila Gangetic Dolphin Sanctuary', 'Kaimur Wildlife Sanctuary', 'Bhimbandh Wildlife Sanctuary', 'Rajgir Wildlife Sanctuary'],
    species: ['Ganges River Dolphin', 'Bengal Tiger', 'Indian Leopard', 'Sloth Bear', 'Gharial', 'Indian Vulture', 'Sambar Deer', 'Chital', 'Indian Wolf', 'Monitor Lizard'],
  },
  'Jhārkhand': {
    reserves: ['Palamau Tiger Reserve (Betla)', 'Hazaribagh Wildlife Sanctuary', 'Dalma Wildlife Sanctuary', 'Palkot Wildlife Sanctuary', 'Parasnath Wildlife Sanctuary'],
    species: ['Asian Elephant', 'Bengal Tiger', 'Indian Leopard', 'Sloth Bear', 'Gaur (Indian Bison)', 'Indian Pangolin', 'Mugger Crocodile', 'Indian Giant Squirrel', 'Python', 'Indian Vulture'],
  },
  'Odisha': {
    reserves: ['Similipal Tiger Reserve', 'Bhitarkanika National Park', 'Chilika (Nalabana Bird Sanctuary)', 'Satkosia Gorge Sanctuary', 'Balukhand-Konark Sanctuary'],
    species: ['Royal Bengal Tiger', 'Olive Ridley Turtle', 'Saltwater Crocodile', 'Asian Elephant', 'Gharial', 'Irrawaddy Dolphin', 'Blackbuck', 'Mugger Crocodile', 'Indian Pangolin', 'Humpback Dolphin'],
  },
  'Chhattīsgarh': {
    reserves: ['Achanakmar-Amarkantak Biosphere Reserve', 'Indravati Tiger Reserve', 'Kanger Valley National Park', 'Barnawapara Wildlife Sanctuary', 'Sitanadi Wildlife Sanctuary'],
    species: ['Bengal Tiger', 'Wild Water Buffalo', 'Asian Elephant', 'Indian Leopard', 'Hill Myna', 'Sloth Bear', 'Gaur (Indian Bison)', 'Four-horned Antelope', 'Indian Skimmer', 'Bastar Hill Myna'],
  },
  'Himāchal Pradesh': {
    reserves: ['Great Himalayan National Park', 'Pin Valley National Park', 'Kibber Wildlife Sanctuary', 'Kalatop-Khajjiar Sanctuary', 'Renuka Wildlife Sanctuary'],
    species: ['Snow Leopard', 'Himalayan Brown Bear', 'Himalayan Tahr', 'Western Tragopan', 'Musk Deer', 'Himalayan Monal', 'Snow Partridge', 'Tibetan Wolf', 'Himalayan Ibex', 'Cheer Pheasant'],
  },
  'Uttarākhand': {
    reserves: ['Jim Corbett National Park', 'Rajaji National Park', 'Valley of Flowers National Park', 'Nanda Devi National Park', 'Gangotri National Park'],
    species: ['Bengal Tiger', 'Asian Elephant', 'Snow Leopard', 'Himalayan Musk Deer', 'Himalayan Monal', 'Himalayan Tahr', 'Gharial', 'Ganges River Dolphin', 'Sambar Deer', 'Kalij Pheasant'],
  },
  'Jammu and Kashmīr': {
    reserves: ['Dachigam National Park', 'Kishtwar National Park', 'Overa-Aru Wildlife Sanctuary', 'Gulmarg Biosphere Reserve', 'Ramnagar Wildlife Sanctuary'],
    species: ['Hangul (Kashmir Stag)', 'Snow Leopard', 'Himalayan Brown Bear', 'Musk Deer', 'Himalayan Marmot', 'Tibetan Wild Ass (Kiang)', 'Himalayan Monal', 'Bar-headed Goose', 'Black-necked Crane', 'Himalayan Ibex'],
  },
  'Ladākh': {
    reserves: ['Hemis National Park', 'Karakoram Wildlife Sanctuary', 'Changthang Cold Desert Wildlife Sanctuary'],
    species: ['Snow Leopard', 'Tibetan Wolf', 'Kiang (Tibetan Wild Ass)', 'Himalayan Ibex', 'Black-necked Crane', 'Bar-headed Goose', 'Blue Sheep (Bharal)', 'Tibetan Argali', 'Himalayan Marmot', 'Eurasian Lynx'],
  },
  'Arunāchal Pradesh': {
    reserves: ['Namdapha National Park', 'Pakke Tiger Reserve', 'Mouling National Park', 'Dibang Wildlife Sanctuary', 'Eaglenest Wildlife Sanctuary'],
    species: ['Snow Leopard', 'Red Panda', 'Clouded Leopard', 'Hoolock Gibbon', 'Great Hornbill', 'White-winged Wood Duck', 'Bengal Tiger', 'Asian Elephant', 'Golden Langur', 'Mishmi Takin'],
  },
  'Nāgāland': {
    reserves: ['Intanki National Park', 'Fakim Wildlife Sanctuary', 'Puliebadze Wildlife Sanctuary', 'Singphan Wildlife Sanctuary', 'Satoi Wildlife Sanctuary'],
    species: ["Blyth's Tragopan", 'Hoolock Gibbon', 'Clouded Leopard', 'Asian Elephant', 'Great Hornbill', 'Slow Loris', 'Indian Leopard', 'Serow', 'Himalayan Black Bear', 'Mithun'],
  },
  'Mizoram': {
    reserves: ['Murlen National Park', 'Phawngpui National Park', 'Dampa Tiger Reserve', 'Ngengpui Wildlife Sanctuary', 'Lengteng Wildlife Sanctuary'],
    species: ['Hoolock Gibbon', 'Clouded Leopard', 'Serow', 'Himalayan Black Bear', "Blyth's Tragopan", "Mrs. Hume's Pheasant", 'Slow Loris', 'Indian Leopard', 'Asian Elephant', 'Malayan Giant Squirrel'],
  },
  'Manipur': {
    reserves: ['Keibul Lamjao National Park', 'Sirohi National Park', 'Yangoupokpi-Lokchao Sanctuary', 'Khongjaingamba Ching Sanctuary'],
    species: ['Sangai (Brow-antlered Deer)', 'Hoolock Gibbon', 'Clouded Leopard', 'Slow Loris', 'Serow', 'Asiatic Black Bear', "Mrs. Hume's Pheasant", 'Indian Leopard', 'Python', 'Hill Myna'],
  },
  'Tripura': {
    reserves: ['Sepahijala Wildlife Sanctuary', 'Trishna Wildlife Sanctuary', 'Gumti Wildlife Sanctuary', 'Rowa Wildlife Sanctuary', 'Clouded Leopard National Park'],
    species: ['Clouded Leopard', 'Hoolock Gibbon', "Phayre's Langur", 'Slow Loris', 'Indian Leopard', 'Asian Elephant', 'Gaur (Indian Bison)', 'Python', 'Hornbill', 'Serow'],
  },
  'Meghālaya': {
    reserves: ['Balphakram National Park', 'Nokrek National Park', 'Nongkhyllem Wildlife Sanctuary', 'Siju Wildlife Sanctuary'],
    species: ['Clouded Leopard', 'Hoolock Gibbon', 'Red Panda', 'Asian Elephant', 'Slow Loris', 'Indian Leopard', 'Serow', 'Great Hornbill', 'Asiatic Golden Cat', 'Marbled Cat'],
  },
  'Sikkim': {
    reserves: ['Khangchendzonga National Park', 'Fambong Lho Wildlife Sanctuary', 'Kyongnosla Alpine Sanctuary', 'Maenam Wildlife Sanctuary', 'Barsey Rhododendron Sanctuary'],
    species: ['Red Panda', 'Snow Leopard', 'Himalayan Black Bear', 'Musk Deer', 'Himalayan Tahr', 'Blue Sheep (Bharal)', 'Himalayan Monal', 'Satyr Tragopan', 'Blood Pheasant', 'Tibetan Wolf'],
  },
  'Goa': {
    reserves: ['Bhagwan Mahavir Wildlife Sanctuary (Mollem)', 'Netravali Wildlife Sanctuary', 'Cotigao Wildlife Sanctuary', 'Bondla Wildlife Sanctuary', 'Salim Ali Bird Sanctuary'],
    species: ['Bengal Tiger', 'Indian Leopard', 'Gaur (Indian Bison)', 'Sloth Bear', 'Mugger Crocodile', 'Great Hornbill', 'Golden Jackal', 'Black Panther', 'Monitor Lizard', 'Indian Giant Squirrel'],
  },
  'Andaman and Nicobar Islands': {
    reserves: ['Mahatma Gandhi Marine National Park', 'Campbell Bay National Park', 'Saddle Peak National Park', 'Rani Jhansi Marine National Park', 'North Button Island National Park'],
    species: ['Dugong', 'Nicobar Megapode', 'Saltwater Crocodile', 'Andaman Wild Pig', 'Coconut Crab', 'Leatherback Turtle', 'Hawksbill Turtle', 'Nicobar Pigeon', 'Narcondam Hornbill', 'Olive Ridley Turtle'],
  },
  'Lakshadweep': {
    reserves: ['Pitti Bird Sanctuary', 'Marine Protected Areas (atolls)'],
    species: ['Green Sea Turtle', 'Hawksbill Turtle', 'Spinner Dolphin', 'Reef Fish', 'Giant Clam', 'Coconut Crab', 'Sooty Tern', 'Brown Noddy', 'Tuna', 'Reef Shark'],
  },
  'Chandīgarh': {
    reserves: ['Sukhna Wildlife Sanctuary', 'City Forest & Lake reserves'],
    species: ['Sambar Deer', 'Spotted Deer', 'Indian Leopard', 'Peacock', 'Golden Jackal', 'Wild Boar', 'Monitor Lizard', 'Indian Porcupine', 'Nilgai', 'Migratory Birds'],
  },
  'Delhi': {
    reserves: ['Asola Bhatti Wildlife Sanctuary', 'Yamuna Biodiversity Park', 'Okhla Bird Sanctuary'],
    species: ['Nilgai', 'Indian Leopard', 'Golden Jackal', 'Peacock', 'Monitor Lizard', 'Indian Porcupine', 'Small Indian Civet', 'Python', 'Migratory Waterfowl', 'Blackbuck'],
  },
  'Puducherry': {
    reserves: ['Oussudu Lake Bird Sanctuary', 'Botanical Garden & wetlands'],
    species: ['Spot-billed Pelican', 'Painted Stork', 'Golden Jackal', 'Small Indian Civet', 'Monitor Lizard', 'Wild Boar', 'Spotted Deer', 'Python', 'Migratory Waterfowl', 'Frogs & Toads'],
  },
  'Dādra and Nagar Haveli and Damān and Diu': {
    reserves: ['Fudam Bird Sanctuary (Diu)', 'Deer parks & reserve forests'],
    species: ['Greater Flamingo', 'Migratory Waterbirds', 'Golden Jackal', 'Wild Boar', 'Small Indian Civet', 'Monitor Lizard', 'Peacock', 'Python', 'Reptiles', 'Butterflies'],
  },
};
