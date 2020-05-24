import _ from 'lodash';

import am4geodata_japanLow from "@amcharts/amcharts4-geodata/japanLow";

const prefNameMap = {
  "Aichi": "愛知県",
  "Akita": "秋田県",
  "Aomori": "青森県",
  "Chiba": "千葉県",
  "Ehime": "愛媛県",
  "Fukui": "福井県",
  "Fukuoka": "福岡県",
  "Fukushima": "福島県",
  "Gifu": "岐阜県",
  "Gunma": "群馬県",
  "Hiroshima": "広島県",
  "Hokkaido":"北海道",
  "Hyogo": "兵庫県",
  "Ibaraki": "茨城県",
  "Ishikawa": "石川県",
  "Iwate": "岩手県",
  "Kagawa": "香川県",
  "Kagoshima": "鹿児島県",
  "Kanagawa": "神奈川県",
  "Kochi": "高知県",
  "Kumamoto": "熊本県",
  "Kyoto": "京都府",
  "Mie": "三重県",
  "Miyagi": "宮城県",
  "Miyazaki": "宮崎県",
  "Nagano": "長野県",
  "Nagasaki": "長崎県",
  "Nara": "奈良県",
  "Niigata": "新潟県",
  "Oita": "大分県",
  "Okayama": "岡山県",
  "Okinawa": "沖縄県",
  "Osaka": "大阪府",
  "Saga": "佐賀県",
  "Saitama": "埼玉県",
  "Shiga": "滋賀県",
  "Shimane": "島根県",
  "Shizuoka": "静岡県",
  "Tochigi": "栃木県",
  "Tokushima": "徳島県",
  "Tokyo": "東京都",
  "Tottori": "鳥取県",
  "Toyama": "富山県",
  "Wakayama": "和歌山県",
  "Yamagata": "山形県",
  "Yamaguchi": "山口県",
  "Yamanashi": "山梨県"
}

export const PrefIdHokkaido = ["JP-01"]
export const PrefIdOkinawa = ["JP-47"]
export const PrefIdMiddle = [
  "JP-02",
  "JP-03",
  "JP-04",
  "JP-05",
  "JP-06",
  "JP-07",
  "JP-08",
  "JP-09",
  "JP-10",
  "JP-11",
  "JP-12",
  "JP-13",
  "JP-14",
  "JP-15",
  "JP-16",
  "JP-17",
  "JP-18",
  "JP-19",
  "JP-20",
  "JP-21",
  "JP-22",
  "JP-23",
  "JP-24",
  "JP-25",
  "JP-26",
  "JP-27",
  "JP-28",
  "JP-29",
  "JP-30",
  "JP-31",
  "JP-32",
  "JP-33",
  "JP-34",
  "JP-35",
  "JP-36",
  "JP-37",
  "JP-38",
  "JP-39",
  "JP-40",
  "JP-41",
  "JP-42",
  "JP-43",
  "JP-44",
  "JP-45",
  "JP-46",
]

export class JapanMap {
  constructor() {
    this.geoData = _.cloneDeep(am4geodata_japanLow);
    this._localizeName();
  }

  _localizeName() {
    for (const feature of this.geoData.features) {
      feature.properties.name = prefNameMap[feature.properties.name];
      console.log(feature.properties.name);
    }
  }

  getGeoData(prefIds = []) {
    if (prefIds.length > 0) {
      this.geoData.features = this.geoData.features.filter(feature => {
        return prefIds.includes(feature.id);
      });
    }
    return this.geoData;
  }
}
