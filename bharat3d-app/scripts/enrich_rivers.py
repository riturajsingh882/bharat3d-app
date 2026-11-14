import json

RIVER_INFO = {
    'Ganges': {
        'clean_name': 'Ganga (Ganges)',
        'basin': 'Ganga Basin',
        'length_km': 2525,
        'origin': 'Gangotri Glacier (Gaumukh), Uttarakhand (Elev: 3,892 m)',
        'outflow': 'Bay of Bengal (Ganga-Brahmaputra Delta / Sundarbans)',
        'states': 'Uttarakhand, Uttar Pradesh, Bihar, West Bengal',
        'dams': 'Tehri Dam, Farakka Barrage, Bhimgauda Barrage',
        'cities': 'Rishikesh, Haridwar, Kanpur, Prayagraj, Varanasi, Patna, Bhagalpur, Kolkata (Hooghly)',
        'tributaries': 'Yamuna, Son, Gomti, Ghaghara, Gandak, Kosi, Ramganga, Mahananda',
        'type': 'Major National River',
        'rank': 1
    },
    'Yamuna': {
        'clean_name': 'Yamuna',
        'basin': 'Ganga Basin',
        'length_km': 1376,
        'origin': 'Yamunotri Glacier, Uttarkashi, Uttarakhand (Elev: 6,387 m)',
        'outflow': 'Triveni Sangam (Prayagraj) -> Confluence with Ganga',
        'states': 'Uttarakhand, Himachal Pradesh, Haryana, Delhi, Uttar Pradesh',
        'dams': 'Hathnikund Barrage, Lakhwar Dam, Wazirabad Barrage',
        'cities': 'Yamuna Nagar, Delhi, Noida, Mathura, Agra, Firozabad, Etawah, Prayagraj',
        'tributaries': 'Chambal, Betwa, Ken, Hindon, Tons, Sindh',
        'type': 'Major Tributary (Right-bank of Ganga)',
        'rank': 2
    },
    'Brahmaputra': {
        'clean_name': 'Brahmaputra (Yarlung Tsangpo)',
        'basin': 'Brahmaputra Basin',
        'length_km': 2900,
        'origin': 'Angsi Glacier, Mount Kailash, Tibet (Elev: 5,210 m)',
        'outflow': 'Bay of Bengal (via Meghna / Padma confluence)',
        'states': 'Arunachal Pradesh (as Siang/Dihang), Assam',
        'dams': 'Dibang Dam (planned), Ranganadi, Kurichhu (Bhutan)',
        'cities': 'Pasighat, Dibrugarh, Tezpur, Guwahati, Dhubri',
        'tributaries': 'Subansiri, Kameng, Manas, Sankosh, Teesta, Dibang, Lohit, Dhansiri',
        'type': 'Transboundary Himalayan River',
        'rank': 1
    },
    'Godävari': {
        'clean_name': 'Godavari (Dakshin Ganga)',
        'basin': 'Godavari Basin',
        'length_km': 1465,
        'origin': 'Brahmagiri Mountain, Trimbakeshwar, Nashik, Maharashtra (Elev: 1,067 m)',
        'outflow': 'Bay of Bengal (Andhra Pradesh coast)',
        'states': 'Maharashtra, Telangana, Andhra Pradesh, Chhattisgarh, Odisha',
        'dams': 'Jayakwadi Dam, Sriram Sagar (Pochampad), Polavaram Project, Dowleswaram Barrage',
        'cities': 'Nashik, Nanded, Nizamabad, Ramagundam, Rajahmundry',
        'tributaries': 'Pravara, Purna, Manjira, Pranhita (Penganga+Wardha+Wainganga), Indravati, Sabari',
        'type': 'Major Peninsular River (Longest in South India)',
        'rank': 1
    },
    'Krishna': {
        'clean_name': 'Krishna',
        'basin': 'Krishna Basin',
        'length_km': 1400,
        'origin': 'Mahabaleshwar, Western Ghats, Maharashtra (Elev: 1,337 m)',
        'outflow': 'Bay of Bengal (Hamsaladeevi, Andhra Pradesh)',
        'states': 'Maharashtra, Karnataka, Telangana, Andhra Pradesh',
        'dams': 'Koyna Dam, Almatti Dam (Lal Bahadur Shastri), Narayanpur Dam, Jurala, Srisailam, Nagarjuna Sagar, Prakasam Barrage',
        'cities': 'Satara, Sangli, Bagalkot, Raichur, Srisailam, Amaravati, Vijayawada',
        'tributaries': 'Koyna, Ghataprabha, Malaprabha, Bhima, Tungabhadra, Musi, Munneru',
        'type': 'Major Peninsular River',
        'rank': 1
    },
    'Cauvery': {
        'clean_name': 'Kaveri (Cauvery)',
        'basin': 'Kaveri Basin',
        'length_km': 805,
        'origin': 'Talakaveri, Brahmagiri Range, Kodagu, Karnataka (Elev: 1,341 m)',
        'outflow': 'Bay of Bengal (Poompuhar, Tamil Nadu)',
        'states': 'Karnataka, Tamil Nadu, Kerala, Puducherry',
        'dams': 'Krishna Raja Sagara (KRS), Harangi, Hemavathi, Kabini, Mettur Dam (Stanley Reservoir), Grand Anicut (Kallanai)',
        'cities': 'Kushalnagar, Srirangapatna, Mysuru, Erode, Tiruchirappalli, Thanjavur, Mayiladuthurai',
        'tributaries': 'Harangi, Hemavati, Lakshmana Tirtha, Kabini, Shimsha, Arkavathi, Bhavani, Noyyal, Amaravati',
        'type': 'Major Peninsular River',
        'rank': 1
    },
    'Narmada': {
        'clean_name': 'Narmada (Reva)',
        'basin': 'Narmada Basin',
        'length_km': 1312,
        'origin': 'Amarkantak Plateau, Anuppur, Madhya Pradesh (Elev: 1,057 m)',
        'outflow': 'Gulf of Khambhat (Arabian Sea), Bharuch, Gujarat',
        'states': 'Madhya Pradesh, Maharashtra, Gujarat',
        'dams': 'Sardar Sarovar Dam, Indira Sagar Dam, Omkareshwar Dam, Bargi Dam, Maheshwar Dam',
        'cities': 'Jabalpur, Hoshangabad (Narmadapuram), Omkareshwar, Maheshwar, Bharuch',
        'tributaries': 'Hiran, Tawa, Barna, Kolar, Sukta, Uri, Hatni, Orsang',
        'type': 'Major West-Flowing Rift Valley River',
        'rank': 1
    },
    'Tapi': {
        'clean_name': 'Tapi (Tapti)',
        'basin': 'Tapi Basin',
        'length_km': 724,
        'origin': 'Multai, Betul District, Satpura Range, Madhya Pradesh (Elev: 752 m)',
        'outflow': 'Gulf of Khambhat (Arabian Sea), Surat, Gujarat',
        'states': 'Madhya Pradesh, Maharashtra, Gujarat',
        'dams': 'Ukai Dam (Vallabh Sagar), Kakrapar Weir, Hathnur Dam',
        'cities': 'Betul, Burhanpur, Bhusawal, Jalgaon, Surat',
        'tributaries': 'Purna, Girna, Panjhra, Vaghur, Bori, Aner',
        'type': 'Major West-Flowing River',
        'rank': 2
    },
    'Mahäna Nadï': {
        'clean_name': 'Mahanadi',
        'basin': 'Mahanadi Basin',
        'length_km': 851,
        'origin': 'Sihawa Highlands, Dhamtari, Chhattisgarh (Elev: 442 m)',
        'outflow': 'Bay of Bengal (False Point, Kendrapara, Odisha)',
        'states': 'Chhattisgarh, Odisha, Maharashtra, Jharkhand',
        'dams': 'Hirakud Dam (World\'s longest earthen dam), Gangrel Dam (Ravishankar Sagar), Dudhawa Reservoir',
        'cities': 'Dhamtari, Raipur, Sambalpur, Cuttack',
        'tributaries': 'Seonath, Hasdeo, Mand, Ib, Ong, Tel, Jonk',
        'type': 'Major East-Flowing River',
        'rank': 1
    },
    'Indus': {
        'clean_name': 'Indus (Sindhu)',
        'basin': 'Indus Basin',
        'length_km': 3180,
        'origin': 'Sengge Zangbo (near Lake Manasarovar), Tibet (Elev: 5,182 m)',
        'outflow': 'Arabian Sea (south of Karachi, Pakistan)',
        'states': 'Ladakh (India), Jammu and Kashmir',
        'dams': 'Nimoo Bazgo, Chutak, Tarbela (Pak)',
        'cities': 'Leh, Skardu, Gilgit, Attock, Sukkur, Hyderabad (Sindh)',
        'tributaries': 'Zanskar, Shyok, Gilgit, Chenab, Jhelum, Ravi, Beas, Sutlej',
        'type': 'Transboundary Himalayan River (Cradle of Indus Valley Civilization)',
        'rank': 1
    },
    'Chambal': {
        'clean_name': 'Chambal',
        'basin': 'Ganga Basin (Yamuna sub-basin)',
        'length_km': 1024,
        'origin': 'Janapav, Vindhya Range near Mhow, Madhya Pradesh (Elev: 853 m)',
        'outflow': 'Yamuna River (Etawah, Uttar Pradesh)',
        'states': 'Madhya Pradesh, Rajasthan, Uttar Pradesh',
        'dams': 'Gandhi Sagar Dam, Rana Pratap Sagar, Jawahar Sagar, Kota Barrage',
        'cities': 'Mhow, Kota, Dholpur',
        'tributaries': 'Banas, Kali Sindh, Parbati, Shipra',
        'type': 'Major Tributary (Famous for Chambal ravines & Gharial sanctuary)',
        'rank': 2
    },
    'Betwa': {
        'clean_name': 'Betwa (Vetravati)',
        'basin': 'Ganga Basin (Yamuna sub-basin)',
        'length_km': 590,
        'origin': 'Vindhya Range near Hoshangabad, Madhya Pradesh (Elev: 470 m)',
        'outflow': 'Yamuna River (Hamirpur, Uttar Pradesh)',
        'states': 'Madhya Pradesh, Uttar Pradesh',
        'dams': 'Rajghat Dam, Matatila Dam, Parichha Dam',
        'cities': 'Bhojpur, Vidisha, Orchha, Jhansi, Hamirpur',
        'tributaries': 'Dhasan, Bina, Jamni',
        'type': 'Key Bundelkhand River (Ken-Betwa link project)',
        'rank': 2
    },
    'Son': {
        'clean_name': 'Son (Sone)',
        'basin': 'Ganga Basin',
        'length_km': 784,
        'origin': 'Amarkantak Plateau, Anuppur, Madhya Pradesh (Elev: 1,050 m)',
        'outflow': 'Ganga River (near Danapur/Patna, Bihar)',
        'states': 'Madhya Pradesh, Chhattisgarh, Uttar Pradesh, Bihar',
        'dams': 'Bansagar Dam, Indrapuri Barrage',
        'cities': 'Deori, Chopan, Daudnagar, Patna',
        'tributaries': 'Rihand, North Koel, Gopad, Kanhar',
        'type': 'Second largest southern tributary of Ganga after Yamuna',
        'rank': 2
    },
    'Tungabhadra': {
        'clean_name': 'Tungabhadra',
        'basin': 'Krishna Basin',
        'length_km': 531,
        'origin': 'Confluence of Tunga and Bhadra at Koodli, Shimoga, Karnataka',
        'outflow': 'Krishna River (Gondi Malla, Mahbubnagar/Alampur)',
        'states': 'Karnataka, Andhra Pradesh, Telangana',
        'dams': 'Tungabhadra Dam (Hospet)',
        'cities': 'Harihar, Hospet, Hampi (Vijayanagara Empire capital), Mantralayam, Kurnool',
        'tributaries': 'Tunga, Bhadra, Varada, Hagari (Vedavathi)',
        'type': 'Major Peninsular Tributary',
        'rank': 2
    },
    'Bhima': {
        'clean_name': 'Bhima (Chandrabhaga)',
        'basin': 'Krishna Basin',
        'length_km': 861,
        'origin': 'Bhimashankar, Western Ghats, Pune, Maharashtra (Elev: 945 m)',
        'outflow': 'Krishna River (near Raichur, Karnataka/Telangana border)',
        'states': 'Maharashtra, Karnataka, Telangana',
        'dams': 'Ujjani Dam (Bhima Dam), Chas Kaman Dam',
        'cities': 'Khed, Pandharpur, Solapur, Afzalpur',
        'tributaries': 'Ghod, Sina, Nira, Mula-Mutha, Indrayani',
        'type': 'Major Tributary of Krishna',
        'rank': 2
    },
    'Sutlej': {
        'clean_name': 'Sutlej (Satluj)',
        'basin': 'Indus Basin',
        'length_km': 1450,
        'origin': 'Lake Rakshastal near Mount Kailash, Tibet (Elev: 4,575 m)',
        'outflow': 'Chenab River -> Panjnad -> Indus River',
        'states': 'Himachal Pradesh, Punjab',
        'dams': 'Bhakra Dam, Nangal Dam, Karcham Wangtoo, Nathpa Jhakri, Harike Barrage',
        'cities': 'Rampur, Bilaspur, Nangal, Ropar, Firozpur',
        'tributaries': 'Spiti River, Baspa River, Soan River',
        'type': 'Major Trans-Himalayan River (Easternmost of Punjab 5 rivers)',
        'rank': 1
    },
    'Chenab': {
        'clean_name': 'Chenab (Asikni / Chandrabhaga)',
        'basin': 'Indus Basin',
        'length_km': 960,
        'origin': 'Baralacha La Pass (confluence of Chandra & Bhaga), Himachal Pradesh',
        'outflow': 'Panjnad River -> Indus River',
        'states': 'Himachal Pradesh, Jammu and Kashmir',
        'dams': 'Salal Dam, Baglihar Dam, Dul Hasti Dam, Pakal Dul Dam, Ratle Dam',
        'cities': 'Kishtwar, Doda, Ramban, Akhnoor',
        'tributaries': 'Marusudar, Tawi River, Ans, Kalnai',
        'type': 'Major Indus Tributary (Highest railway bridge in the world built across it)',
        'rank': 1
    },
    'Jhelum': {
        'clean_name': 'Jhelum (Vitasta)',
        'basin': 'Indus Basin',
        'length_km': 725,
        'origin': 'Verinag Spring, Pir Panjal Range, Anantnag, Jammu and Kashmir',
        'outflow': 'Chenab River (Trimmu, Pakistan)',
        'states': 'Jammu and Kashmir',
        'dams': 'Uri Dam I & II, Mangla Dam (Pak)',
        'cities': 'Anantnag, Srinagar (Dal Lake connection), Baramulla',
        'tributaries': 'Lidder River, Sind River, Neelum (Kishanganga), Pohru',
        'type': 'Major Valley River of Kashmir',
        'rank': 2
    },
    'Ravi': {
        'clean_name': 'Ravi (Airavati / Parushni)',
        'basin': 'Indus Basin',
        'length_km': 720,
        'origin': 'Bara Bhangal, Kangra District, Himachal Pradesh',
        'outflow': 'Chenab River (near Ahmadpur Sial)',
        'states': 'Himachal Pradesh, Jammu and Kashmir, Punjab',
        'dams': 'Ranjit Sagar Dam (Thein Dam), Chamera Dam I & II, Shahpurkandi Dam',
        'cities': 'Chamba, Madhopur, Pathankot',
        'tributaries': 'Budhil, Tundahan, Nai or Dhona, Seul, Siul',
        'type': 'Major Indus Tributary',
        'rank': 2
    },
    'Beas': {
        'clean_name': 'Beas (Vipasha)',
        'basin': 'Indus Basin',
        'length_km': 470,
        'origin': 'Beas Kund, Rohtang Pass, Pir Panjal, Himachal Pradesh (Elev: 4,361 m)',
        'outflow': 'Sutlej River (Harike Pattan, Punjab)',
        'states': 'Himachal Pradesh, Punjab',
        'dams': 'Pong Dam (Maharana Pratap Sagar), Pandoh Dam',
        'cities': 'Manali, Kullu, Mandi, Harike',
        'tributaries': 'Parbati River, Suketi, Uhl, Tirthan',
        'type': 'Indus Tributary Entirely Within India',
        'rank': 2
    },
    'Mahi': {
        'clean_name': 'Mahi',
        'basin': 'Mahi Basin',
        'length_km': 583,
        'origin': 'Minda Village, Dhar District, Vindhyas, Madhya Pradesh (Elev: 500 m)',
        'outflow': 'Gulf of Khambhat (Arabian Sea)',
        'states': 'Madhya Pradesh, Rajasthan, Gujarat',
        'dams': 'Mahi Bajaj Sagar Dam, Kadana Dam, Wanakbori Dam',
        'cities': 'Dhar, Banswara, Lunawada, Vadodara district',
        'tributaries': 'Som, Anas, Panam',
        'type': 'Crosses Tropic of Cancer Twice in India',
        'rank': 2
    },
    'Sabarmati': {
        'clean_name': 'Sabarmati',
        'basin': 'Sabarmati Basin',
        'length_km': 371,
        'origin': 'Aravalli Hills, Udaipur District, Rajasthan (Elev: 762 m)',
        'outflow': 'Gulf of Khambhat (Arabian Sea)',
        'states': 'Rajasthan, Gujarat',
        'dams': 'Dharoi Dam, Vasna Barrage',
        'cities': 'Gandhinagar, Ahmedabad (Sabarmati Riverfront)',
        'tributaries': 'Wakal, Hathmati, Vatrak, Sei',
        'type': 'Major Gujarat River (Mahatma Gandhi Sabarmati Ashram)',
        'rank': 2
    },
    'Indravati': {
        'clean_name': 'Indravati',
        'basin': 'Godavari Basin',
        'length_km': 535,
        'origin': 'Dandakaranya Range, Kalahandi District, Odisha',
        'outflow': 'Godavari River (Bhadrakali, Telangana/Chhattisgarh/Maharashtra tripoint)',
        'states': 'Odisha, Chhattisgarh, Maharashtra',
        'dams': 'Indravati Dam',
        'cities': 'Jagdalpur (Chitrakote Falls - Niagara of India)',
        'tributaries': 'Kunderu, Kotri, Bandia',
        'type': 'Lifeline of Bastar Region',
        'rank': 2
    },
    'Tista': {
        'clean_name': 'Teesta',
        'basin': 'Brahmaputra Basin',
        'length_km': 414,
        'origin': 'Tso Lhamo Lake / Pahunri Glacier, North Sikkim (Elev: 5,280 m)',
        'outflow': 'Brahmaputra River (Jamuna River in Bangladesh)',
        'states': 'Sikkim, West Bengal',
        'dams': 'Teesta Low Dam Project (TLDP III, IV, V)',
        'cities': 'Mangan, Singtam, Rangpo, Kalimpong, Jalpaiguri',
        'tributaries': 'Rangeet River, Dikchu, Rangpo Chu',
        'type': 'Lifeline of Sikkim and North Bengal',
        'rank': 2
    },
    'Brahmani': {
        'clean_name': 'Brahmani',
        'basin': 'Brahmani-Baitarani Basin',
        'length_km': 799,
        'origin': 'Confluence of Sankh and South Koel at Vedvyas near Rourkela, Odisha',
        'outflow': 'Bay of Bengal (Dhamra Port / Bhitarkanika Mangroves)',
        'states': 'Odisha, Jharkhand',
        'dams': 'Rengali Dam, Samal Barrage',
        'cities': 'Rourkela, Talcher, Dhenkanal, Jajpur',
        'tributaries': 'Sankh, South Koel, Tikira, Singhadajhor',
        'type': 'Major Odisha River',
        'rank': 2
    },
    'Penner': {
        'clean_name': 'Pennar (Pinakini)',
        'basin': 'Pennar Basin',
        'length_km': 597,
        'origin': 'Nandi Hills, Chikkaballapur District, Karnataka',
        'outflow': 'Bay of Bengal (Utukuru near Nellore, Andhra Pradesh)',
        'states': 'Karnataka, Andhra Pradesh',
        'dams': 'Somasila Dam, Mylavaram Dam',
        'cities': 'Gauribidanur, Hindupur, Anantapur, Proddatur, Kadapa, Nellore',
        'tributaries': 'Jayamangali, Kunderu, Papagni, Cheyyeru, Chitravathi',
        'type': 'Major Southern Peninsular River',
        'rank': 2
    }
}

def main():
    path = 'bharat3d-app/public/data/india_rivers.geojson'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    indian_features = []
    
    for feat in data['features']:
        props = feat['properties']
        raw_name = props.get('name') or props.get('name_en') or ''
        
        # Match against our enriched river dictionary
        info = None
        for k, v in RIVER_INFO.items():
            if k.lower() == raw_name.lower() or raw_name.lower() in k.lower():
                info = v
                break
        
        if info:
            props['clean_name'] = info['clean_name']
            props['river_system'] = info['basin']
            props['length_km'] = info['length_km']
            props['origin'] = info['origin']
            props['outflow'] = info['outflow']
            props['states_covered'] = info['states']
            props['dams'] = info['dams']
            props['major_cities'] = info['cities']
            props['tributaries'] = info['tributaries']
            props['category'] = info['type']
            props['hierarchy_rank'] = info['rank']
            props['source'] = 'Central Water Commission (CWC) / India-WRIS & Natural Earth'
            indian_features.append(feat)
        elif raw_name and raw_name not in ['Irrawaddy Delta', 'Ayeyarwady', 'Qarqan', 'Chindwin', 'Salween', 'Helmand', 'Pamir', 'Panj', 'Yurungkax', 'Huang', 'Mytinge', 'Mytitha', 'Kaladan', 'Nmai', 'Nu', 'Za', 'Zi', 'Za’gya']:
            # Retain other Indian tributaries
            props['clean_name'] = raw_name
            props['river_system'] = 'Indian Fluvial Network'
            props['category'] = 'Regional Tributary'
            props['source'] = 'India-WRIS / Natural Earth'
            props['hierarchy_rank'] = 3
            indian_features.append(feat)

    data['features'] = indian_features
    print(f"Filtered and enriched {len(indian_features)} authentic Indian river segments.")

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)
    print("Enriched india_rivers.geojson written successfully!")

if __name__ == '__main__':
    main()
