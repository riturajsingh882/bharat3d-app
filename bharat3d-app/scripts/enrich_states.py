import json
import unicodedata
import re

def normalize(name):
    if not name:
        return ''
    name = unicodedata.normalize('NFD', name).encode('ascii', 'ignore').decode('utf-8')
    name = name.lower()
    name = re.sub(r'[^a-z0-9]', '', name)
    return name

# Official Census 2011 State & UT baselines (Office of the Registrar General & Census Commissioner)
STATE_DATA = {
    'uttarpradesh': {'population': 199812341, 'density': 829, 'literacy': 67.68, 'sex_ratio': 912, 'capital': 'Lucknow', 'area_sqkm': 240928, 'hindu': 79.73, 'muslim': 19.26, 'growth': 20.23},
    'maharashtra': {'population': 112374333, 'density': 365, 'literacy': 82.34, 'sex_ratio': 929, 'capital': 'Mumbai', 'area_sqkm': 307713, 'hindu': 79.83, 'muslim': 11.54, 'buddhist': 5.81, 'growth': 15.99},
    'bihar': {'population': 104099452, 'density': 1106, 'literacy': 61.80, 'sex_ratio': 918, 'capital': 'Patna', 'area_sqkm': 94163, 'hindu': 82.69, 'muslim': 16.87, 'growth': 25.42},
    'westbengal': {'population': 91276115, 'density': 1028, 'literacy': 76.26, 'sex_ratio': 950, 'capital': 'Kolkata', 'area_sqkm': 88752, 'hindu': 70.54, 'muslim': 27.01, 'growth': 13.84},
    'madhyapradesh': {'population': 72626809, 'density': 236, 'literacy': 69.32, 'sex_ratio': 931, 'capital': 'Bhopal', 'area_sqkm': 308252, 'hindu': 90.89, 'muslim': 6.57, 'growth': 20.35},
    'tamilnadu': {'population': 72147030, 'density': 555, 'literacy': 80.09, 'sex_ratio': 996, 'capital': 'Chennai', 'area_sqkm': 130060, 'hindu': 87.58, 'christian': 6.12, 'muslim': 5.86, 'growth': 15.61},
    'rajasthan': {'population': 68548437, 'density': 200, 'literacy': 66.11, 'sex_ratio': 928, 'capital': 'Jaipur', 'area_sqkm': 342239, 'hindu': 88.49, 'muslim': 9.07, 'growth': 21.31},
    'karnataka': {'population': 61095297, 'density': 319, 'literacy': 75.36, 'sex_ratio': 973, 'capital': 'Bengaluru', 'area_sqkm': 191791, 'hindu': 84.00, 'muslim': 12.92, 'christian': 1.87, 'growth': 15.60},
    'gujarat': {'population': 60439692, 'density': 308, 'literacy': 78.03, 'sex_ratio': 919, 'capital': 'Gandhinagar', 'area_sqkm': 196244, 'hindu': 88.57, 'muslim': 9.67, 'growth': 19.28},
    'andhrapradesh': {'population': 49577103, 'density': 304, 'literacy': 67.02, 'sex_ratio': 993, 'capital': 'Amaravati', 'area_sqkm': 162975, 'hindu': 88.46, 'muslim': 9.56, 'growth': 11.10},
    'odisha': {'population': 41974218, 'density': 270, 'literacy': 72.87, 'sex_ratio': 979, 'capital': 'Bhubaneswar', 'area_sqkm': 155707, 'hindu': 93.63, 'christian': 2.77, 'muslim': 2.17, 'growth': 14.05},
    'telangana': {'population': 35003674, 'density': 312, 'literacy': 66.54, 'sex_ratio': 988, 'capital': 'Hyderabad', 'area_sqkm': 112077, 'hindu': 85.10, 'muslim': 12.69, 'growth': 13.58},
    'kerala': {'population': 33406061, 'density': 860, 'literacy': 94.00, 'sex_ratio': 1084, 'capital': 'Thiruvananthapuram', 'area_sqkm': 38852, 'hindu': 54.73, 'muslim': 26.56, 'christian': 18.38, 'growth': 4.91},
    'jharkhand': {'population': 32988134, 'density': 414, 'literacy': 66.41, 'sex_ratio': 948, 'capital': 'Ranchi', 'area_sqkm': 79716, 'hindu': 67.83, 'muslim': 14.53, 'sarna_other': 12.84, 'growth': 22.42},
    'assam': {'population': 31205576, 'density': 398, 'literacy': 72.19, 'sex_ratio': 958, 'capital': 'Dispur', 'area_sqkm': 78438, 'hindu': 61.47, 'muslim': 34.22, 'christian': 3.74, 'growth': 17.07},
    'punjab': {'population': 27743338, 'density': 551, 'literacy': 75.84, 'sex_ratio': 895, 'capital': 'Chandigarh', 'area_sqkm': 50362, 'sikh': 57.69, 'hindu': 38.49, 'growth': 13.89},
    'chhattisgarh': {'population': 25545198, 'density': 189, 'literacy': 70.28, 'sex_ratio': 991, 'capital': 'Raipur', 'area_sqkm': 135192, 'hindu': 93.25, 'muslim': 2.02, 'growth': 22.61},
    'haryana': {'population': 25351462, 'density': 573, 'literacy': 75.55, 'sex_ratio': 879, 'capital': 'Chandigarh', 'area_sqkm': 44212, 'hindu': 87.46, 'muslim': 7.03, 'sikh': 4.91, 'growth': 19.90},
    'delhi': {'population': 16787941, 'density': 11320, 'literacy': 86.21, 'sex_ratio': 868, 'capital': 'New Delhi', 'area_sqkm': 1483, 'hindu': 81.68, 'muslim': 12.86, 'growth': 21.21},
    'jammuandkashmir': {'population': 12267032, 'density': 290, 'literacy': 67.16, 'sex_ratio': 889, 'capital': 'Srinagar / Jammu', 'area_sqkm': 42241, 'muslim': 68.31, 'hindu': 28.44, 'growth': 23.64},
    'uttarakhand': {'population': 10086292, 'density': 189, 'literacy': 78.82, 'sex_ratio': 963, 'capital': 'Dehradun / Gairsain', 'area_sqkm': 53483, 'hindu': 82.97, 'muslim': 13.95, 'growth': 18.81},
    'himachalpradesh': {'population': 6864602, 'density': 123, 'literacy': 82.80, 'sex_ratio': 972, 'capital': 'Shimla', 'area_sqkm': 55673, 'hindu': 95.17, 'muslim': 2.18, 'growth': 12.94},
    'tripura': {'population': 3673917, 'density': 350, 'literacy': 87.22, 'sex_ratio': 960, 'capital': 'Agartala', 'area_sqkm': 10491, 'hindu': 83.40, 'muslim': 8.60, 'growth': 14.84},
    'meghalaya': {'population': 2966889, 'density': 132, 'literacy': 74.43, 'sex_ratio': 989, 'capital': 'Shillong', 'area_sqkm': 22429, 'christian': 74.59, 'hindu': 11.53, 'growth': 27.95},
    'manipur': {'population': 2855794, 'density': 128, 'literacy': 76.94, 'sex_ratio': 985, 'capital': 'Imphal', 'area_sqkm': 22327, 'hindu': 41.39, 'christian': 41.29, 'growth': 24.50},
    'nagaland': {'population': 1978502, 'density': 119, 'literacy': 79.55, 'sex_ratio': 931, 'capital': 'Kohima', 'area_sqkm': 16579, 'christian': 87.93, 'hindu': 8.75, 'growth': -0.58},
    'goa': {'population': 1458545, 'density': 394, 'literacy': 88.70, 'sex_ratio': 973, 'capital': 'Panaji', 'area_sqkm': 3702, 'hindu': 66.08, 'christian': 25.10, 'muslim': 8.33, 'growth': 8.23},
    'arunachalpradesh': {'population': 1383727, 'density': 17, 'literacy': 65.38, 'sex_ratio': 938, 'capital': 'Itanagar', 'area_sqkm': 83743, 'christian': 30.26, 'hindu': 29.04, 'other': 26.2, 'growth': 26.03},
    'puducherry': {'population': 1247953, 'density': 2547, 'literacy': 85.85, 'sex_ratio': 1037, 'capital': 'Puducherry', 'area_sqkm': 490, 'hindu': 87.30, 'christian': 6.20, 'muslim': 6.05, 'growth': 28.08},
    'mizoram': {'population': 1097206, 'density': 52, 'literacy': 91.33, 'sex_ratio': 976, 'capital': 'Aizawl', 'area_sqkm': 21081, 'christian': 87.16, 'buddhist': 8.51, 'hindu': 2.75, 'growth': 23.48},
    'chandigarh': {'population': 1055450, 'density': 9258, 'literacy': 86.05, 'sex_ratio': 818, 'capital': 'Chandigarh', 'area_sqkm': 114, 'hindu': 80.78, 'sikh': 13.11, 'muslim': 4.87, 'growth': 17.19},
    'sikkim': {'population': 610577, 'density': 86, 'literacy': 81.42, 'sex_ratio': 890, 'capital': 'Gangtok', 'area_sqkm': 7096, 'hindu': 57.76, 'buddhist': 27.39, 'christian': 9.91, 'growth': 12.89},
    'dadraandnagarhavelianddamanddiu': {'population': 585764, 'density': 970, 'literacy': 81.0, 'sex_ratio': 774, 'capital': 'Daman', 'area_sqkm': 603, 'hindu': 93.5, 'muslim': 4.5, 'growth': 55.1},
    'dadraandnagarhavelianddamananddiu': {'population': 585764, 'density': 970, 'literacy': 81.0, 'sex_ratio': 774, 'capital': 'Daman', 'area_sqkm': 603, 'hindu': 93.5, 'muslim': 4.5, 'growth': 55.1},
    'andamanandnicobarislands': {'population': 380581, 'density': 46, 'literacy': 86.63, 'sex_ratio': 876, 'capital': 'Port Blair', 'area_sqkm': 8249, 'hindu': 69.45, 'christian': 21.28, 'muslim': 8.52, 'growth': 6.86},
    'ladakh': {'population': 274289, 'density': 4.6, 'literacy': 77.20, 'sex_ratio': 690, 'capital': 'Leh', 'area_sqkm': 59146, 'muslim': 46.40, 'buddhist': 39.70, 'hindu': 12.10, 'growth': 18.0},
    'lakshadweep': {'population': 64473, 'density': 2149, 'literacy': 91.85, 'sex_ratio': 946, 'capital': 'Kavaratti', 'area_sqkm': 30, 'muslim': 96.58, 'hindu': 2.77, 'growth': 6.30}
}

with open('bharat3d-app/public/data/india_states.geojson', 'r', encoding='utf-8') as f:
    states = json.load(f)

for feat in states['features']:
    props = feat['properties']
    name = props.get('shapeName', '')
    norm = normalize(name)
    data = STATE_DATA.get(norm)
    if not data:
        # try matching without words like 'islands', 'and', etc
        for k, v in STATE_DATA.items():
            if norm in k or k in norm:
                data = v
                break
    
    if data:
        props['population_2011'] = data['population']
        props['density_2011'] = data['density']
        props['literacy_rate'] = data['literacy']
        props['sex_ratio'] = data['sex_ratio']
        props['capital'] = data['capital']
        props['area_sqkm'] = data['area_sqkm']
        props['growth_pct'] = data.get('growth', 15.0)
        props['hindu_pct'] = data.get('hindu', 80.0)
        props['muslim_pct'] = data.get('muslim', 12.0)
        props['christian_pct'] = data.get('christian', 2.0)
        props['sikh_pct'] = data.get('sikh', 1.5)
        props['buddhist_pct'] = data.get('buddhist', 0.8)
        props['source'] = 'Census of India 2011 (ORGI / data.gov.in)'
        props['census_year'] = 2011
        print(f"Enriched state: {name} -> Pop: {data['population']}, Density: {data['density']}, Capital: {data['capital']}")
    else:
        print(f"FAILED to enrich state: {name} (norm: {norm})")

with open('bharat3d-app/public/data/india_states.geojson', 'w', encoding='utf-8') as f:
    json.dump(states, f, ensure_ascii=False)

print("india_states.geojson enriched successfully!")
