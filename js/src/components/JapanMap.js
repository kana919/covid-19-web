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

export default class JapanMap {
  constructor() {
    this.geoData = am4geodata_japanLow;
    this._localizeName();
  }

  _localizeName() {
    for (const feature of this.geoData.features) {
      feature.properties.name = prefNameMap[feature.properties.name];
    }
  }

  getGeoData() {
    return this.geoData;
  }
}
