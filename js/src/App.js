import { JapanStatsPanel } from './components/JapanStatsPanel.js'
import { PrefStatsPanel } from './components/PrefStatsPanel.js'
import { PrefStatsTable } from './components/PrefStatsTable.js'
import { InfectionGraph } from './components/InfectionGraph.js'
import { InfectionMap } from './components/InfectionMap.js'
import { fetchFromAPI } from './apiUtil.js'


export class App {
  constructor() {
    // TODO: 設定から変更できるように修正
    this.apiDomain = 'http://localhost:8000/';

    // コンポーネントの初期化
    this.jpStats = new JapanStatsPanel();
    this.prefStats = new PrefStatsPanel();
    this.jpGraph = new InfectionGraph("graph");
    this.prefGraph = new InfectionGraph("detail-graph");
    this.table = new PrefStatsTable();
    this.map = new InfectionMap("map");
  }

  mount() {
    try {
      /*
      // 日本の感染情報を取得/表示
      */
      const japanInfectionInfo = fetchFromAPI(`${this.apiDomain}/stats/infection/japan`);
      japanInfectionInfo.then(infectionInfo => {
        // グラフを表示
        this.jpGraph.render(infectionInfo);
        // 感染者情報を表示
        this.jpStats.render(infectionInfo);
      });

      /*
      // 都道府県ごとの感染情報を取得/表示
      */
      const prefInfectionInfo = fetchFromAPI(`${this.apiDomain}/stats/infection/prefectures`);
      prefInfectionInfo.then(infectionInfo => {
        // 東京都の感染情報の概要表示
        this.prefStats.render(infectionInfo[12]);

        // 地図上のマウスオーバーのイベントリスナーの登録
        const that = this
        this.map.addEventFunc((ev) => {
          const prefId = ev.target.dataItem.dataContext.id;
          const index = parseInt(prefId.split("JP-")[1]) - 1;
          // 概要情報の更新
          that.prefStats.render(infectionInfo[index]);
          // 詳細グラフの更新
          that.prefGraph.update(infectionInfo[index].daily);
        });
        // 地図の表示
        this.map.render();


        // 各都道府県の感染情報テーブル表示
        this.table.render(infectionInfo);
        for (let info of infectionInfo) {
          // 各都道府県のセルにイベントリスナーの登録
          let prefCellElement = document.querySelector(`#${info.name_en}`);
          prefCellElement.addEventListener("mouseover",
            {
              handleEvent: (ev) => {
                // 概要情報の更新
                that.prefStats.render(info);
                // 詳細グラフの更新
                that.prefGraph.update(info.daily);
              }
            });
        }

        // 東京の感染情報グラフの表示
        this.prefGraph.render(infectionInfo[12].daily);
      });
    } catch (error) {
      console.error(`${error}`);
    }
  }
}
