import moment from 'moment';
import InfectionGraph from './components/InfectionGraph.js'


export class App {
  constructor() {
    moment.locale('ja');
    this.apiDomain = 'http://localhost:8000/';
    this.japanInfectionInfo = {};
    this.prefInfectionInfo = {};
    this.behaviorInfo = {};
  }

  mount() {
    try {
      // 日本の感染情報を取得
      this.japanInfectionInfo = fetchFromAPI(`${this.apiDomain}/stats/infection/japan`);
      this.japanInfectionInfo.then(infectionInfo => {
        // グラフを表示
        const graph = new InfectionGraph("graph");
        graph.render(infectionInfo);
        console.log(infectionInfo);
        // 感染者情報を表示
        displayJapanStats(infectionInfo);
      });

      // 行動情報を取得
      this.behaviorInfo = fetchFromAPI(`${this.apiDomain}/stats/behavior`);
      this.behaviorInfo.then(behaviorInfo => {
        // TODO: 実装
        // displayBehaviorStats(behaviorInfo);
      });

      // 都道府県ごとの感染情報を取得
      this.prefInfectionInfo = fetchFromAPI(`${this.apiDomain}/stats/infection/prefectures`);
      this.prefInfectionInfo.then(infectionInfo => {
        // 東京都の感染情報の概要表示
        displayPrefectureStatsOverview(infectionInfo[12]);

        // イベントリスナーの登録
        for (let info of infectionInfo) {
          let prefCellElement = document.querySelector(`#${info.name_en}`);
          prefCellElement.addEventListener("mouseover", {info: info, handleEvent: handleEventDisplayStats});
        }

        // 各都道府県の感染情報テーブル表示
        displayPrefectureStats(infectionInfo);
      });
    } catch (error) {
      console.error(`${error}`);
    }
  }
}

function fetchFromAPI(url) {
  return fetch(url, {
    method: 'GET',
    mode: 'cors'
  })
  .then(response => {
    if (!response.ok) {
      return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
    } else {
      return response.json();
    }
  });
}

function displayJapanStats(infectionInfo) {
  // TODO: 修正
  if (infectionInfo.length === 0) {
    return
  }

  // 日時見出し
  const dateElement = document.querySelector("#date");

  dateElement.innerHTML = moment(infectionInfo[0].reported_date).format('MMMMDo(dddd)');

  // 当日
  const infectionNumElement = document.querySelector("#jp-infection-num");
  const recoveryNumElement = document.querySelector("#jp-recovery-num");
  const deadNumElement = document.querySelector("#jp-dead-num");

  infectionNumElement.innerHTML = infectionInfo[0].new_infected + '人';
  recoveryNumElement.innerHTML = infectionInfo[0].total_recovered - infectionInfo[1].total_recovered + '人';
  deadNumElement.innerHTML = infectionInfo[0].total_death - infectionInfo[1].total_death + '人';

  // 累計
  const totalInfectionNumElement = document.querySelector("#jp-total-infection-num");
  const totalRecoveryNumElement = document.querySelector("#jp-total-recovery-num");
  const totalDeadNumElement = document.querySelector("#jp-total-dead-num");

  totalInfectionNumElement.innerHTML = infectionInfo[0].total_infected + '人';
  totalRecoveryNumElement.innerHTML = infectionInfo[0].total_recovered + '人';
  totalDeadNumElement.innerHTML = infectionInfo[0].total_death + '人';
}

function displayPrefectureStats(infectionInfo) {
  // 感染者数テーブル
  for (let info of infectionInfo) {
    let prefCellElement = document.querySelector(`#${info.name_en}`);
    if (info.daily.length > 0) {
      // データが存在している場合は現在感染者数を表示
      prefCellElement.innerHTML = info.daily[0].current_infected;
    } else {
      // データがない場合は不明
      prefCellElement.innerHTML = '不明';
    }
  }
}

// TODO: 実装
function displayBehaviorStats(behaviorInfo) {
  const stayHomeElement = document.querySelector("#jp-stay-home-ratio");
}

function handleEventDisplayStats(e) {
  displayPrefectureStatsOverview(this.info);
}

function displayPrefectureStatsOverview(info) {
  const prefNameElement = document.querySelector('#prefecture-name');
  prefNameElement.innerHTML = info.name;

  const infectionNumElement = document.querySelector("#infection-num");
  const recoveryNumElement = document.querySelector("#recovery-num");
  const deadNumElement = document.querySelector("#dead-num");

  const totalInfectionNumElement = document.querySelector("#total-infection-num");
  const totalRecoveryNumElement = document.querySelector("#total-recovery-num");
  const totalDeadNumElement = document.querySelector("#total-dead-num");

  if (info.daily.length > 0) {
    // データが存在している場合は現在感染者数を表示
    infectionNumElement.innerHTML = info.daily[0].new_infected + '人';
    recoveryNumElement.innerHTML = info.daily[0].recovered + '人';
    deadNumElement.innerHTML = info.daily[0].death + '人';
    totalInfectionNumElement.innerHTML = info.daily[0].total_infected + '人';
    totalRecoveryNumElement.innerHTML = info.total_recovered + '人';
    totalDeadNumElement.innerHTML = info.total_death + '人';
  } else {
    // データがない場合は不明
    infectionNumElement.innerHTML = '- 人';
    recoveryNumElement.innerHTML = '- 人';
    deadNumElement.innerHTML = '- 人';
  }
}
