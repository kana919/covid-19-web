import { JapanStatsPanel } from './components/JapanStatsPanel.js'
import { PrefStatsPanel } from './components/PrefStatsPanel.js'
import { PrefStatsTable } from './components/PrefStatsTable.js'
import { InfectionGraph } from './components/InfectionGraph.js'
import { InfectionMap } from './components/InfectionMap.js'
import { Instruction } from './components/Instruction.js'
import { PrefIdHokkaido, PrefIdMiddle, PrefIdOkinawa } from "./components/JapanMap.js";
import { fetchFromAPI } from './apiUtil.js'


let apiDomain = 'localhost:8000';
let urlScheme = 'http://';

// 本番環境用の設定
if (process.env.NODE_ENV === 'production') {
  // 複雑化したら環境変数へ移行
  apiDomain = 'api.covid19jp.org';
  urlScheme = 'http://';
} else {
  console.log('This page runs on development env!!!');
}

export class App {
  constructor() {
    // コンポーネントの初期化
    this.jpStats = new JapanStatsPanel();
    this.prefStats = new PrefStatsPanel();
    this.jpGraph = new InfectionGraph("graph-chart");
    this.jpInstraction = new Instruction("nationwide-aggregation-date", "nationwide-update-date")
    this.prefGraph = new InfectionGraph("detail-graph-chart");
    this.table = new PrefStatsTable();
    this.maps = [
      new InfectionMap("map-hokkaido", false, PrefIdHokkaido),
      new InfectionMap("map-middle", true, PrefIdMiddle),
      new InfectionMap("map-okinawa", false, PrefIdOkinawa),
    ];
    this.mapInstraction = new Instruction("map-aggregation-date", "map-update-date")
  }

  mount() {
    try {
      /*
      // 日本の感染情報を取得/表示
      */
      const japanInfectionInfo = fetchFromAPI(`${urlScheme}//${apiDomain}/stats/infection/japan`);
      japanInfectionInfo.then(infectionInfo => {
        // グラフを表示
        this.jpGraph.render(infectionInfo);
        // ローディング完了処理
        // XXX: 都道府県用のグラフと同じコンポーネントを使い回しているのでローディング完了処理を
        //      共通のメソッド化できない.
        //      Componentとviewを明確に分けるか、クラスを継承する形にした方が良い　
        const graphLoader = document.querySelector('#graph-loader');
        const graph = document.querySelector('#graph-chart');
        graphLoader.classList.add('none');
        graph.classList.remove('none');

        // 感染者情報を表示
        this.jpStats.render(infectionInfo);
        // ローディング完了処理
        this.jpStats.loaded();
        this.jpInstraction.render(infectionInfo[0].reported_date, infectionInfo[0].updated_at);
      });

      /*
      // 都道府県ごとの感染情報を取得/表示
      */
      const prefInfectionInfo = fetchFromAPI(`${urlScheme}//${apiDomain}/stats/infection/prefectures`);
      prefInfectionInfo.then(infectionInfo => {
        // 東京都の感染情報の概要表示
        this.prefStats.render(infectionInfo[12]);

        // 地図上のマウスオーバーのイベントリスナーの登録
        const that = this
        this.maps.forEach(map => {
          map.addEventFunc((ev) => {
            const prefId = ev.target.dataItem.dataContext.id;
            const index = parseInt(prefId.split("JP-")[1]) - 1;
            // 概要情報の更新
            that.prefStats.render(infectionInfo[index]);
            // 詳細グラフの更新
            that.prefGraph.update(infectionInfo[index].daily);
            let prefGraphTitle = document.querySelector('#detail-graph-title');
            prefGraphTitle.innerHTML = `${infectionInfo[index].name}の日別発生状況`;
          });
          // 地図の表示
          map.render(infectionInfo);
          map.loaded();
        });
        // ローディング完了処理
        this.prefStats.loaded();
        const mapLoader = document.querySelector('#map-loader');
        mapLoader.classList.add('none');
        this.mapInstraction.render(
          infectionInfo[0].daily[0].reported_date,
          infectionInfo[0].daily[0].updated_at
        );

        // 各都道府県の感染情報テーブル表示
        this.table.render(infectionInfo);
        for (let info of infectionInfo) {
          // 各都道府県のセルにイベントリスナーの登録
          let prefCellElement = document.querySelector(`#${info.name_en}`);
          if (prefCellElement === null) {
            continue;
          }
          prefCellElement.addEventListener("mouseover",
            {
              handleEvent: (ev) => {
                // 概要情報の更新
                that.prefStats.render(info);
                // 詳細グラフの更新
                that.prefGraph.update(info.daily);
                let prefGraphTitle = document.querySelector('#detail-graph-title');
                prefGraphTitle.innerHTML = `${info.name}の日別発生状況`;
              }
            });
        }

        // 東京の感染情報グラフの表示
        this.prefGraph.render(infectionInfo[12].daily);
        // ローディング完了処理
        // XXX: 全国用のグラフと同じコンポーネントを使い回しているのでローディング完了処理を
        //      共通のメソッド化できない.
        //      Componentとviewを明確に分けるか、クラスを継承する形にした方が良い　
        const detailGraphLoader = document.querySelector('#detail-graph-loader');
        const detailGraphTitle = document.querySelector('#detail-graph-title');
        const detailGraph = document.querySelector('#detail-graph-chart');
        detailGraphLoader.classList.add('none');
        detailGraphTitle.classList.remove('none');
        detailGraph.classList.remove('none');
      });
    } catch (error) {
      console.error(`${error}`);
    }
  }
}
