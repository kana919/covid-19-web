export class App {
  constructor() {
  }

  mount() {
    try {
      // 感染情報を取得
      const infectionInfo = fetchFromAPI(`http://localhost:8000/stats/infection`);
      infectionInfo.then(infectionInfo => {
        displayTotalNum(infectionInfo);
      });

      // 行動情報を取得
      const behaviorInfo = fetchFromAPI(`http://localhost:8000/stats/behavior`);
      behaviorInfo.then(behaviorInfo => {
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

function calcJapanTotalNum(infectionInfo) {
  let total_infected = 0;
  let total_recovered = 0;
  let total_dead = 0;
  for (const info of infectionInfo) {
    total_infected += info.total_infected;
    total_recovered += info.total_recovered;
    total_dead += info.total_death;
  }
  return {
    "infected": total_infected,
    "recovered": total_recovered,
    "dead": total_dead
  };
}

function calcJapanLatestNum(infectionInfo) {
  let total_infected = 0;
  let total_recovered = 0;
  let total_dead = 0;
  for (const info of infectionInfo) {
    if (info.daily && info.daily[0]) {
      total_infected += info.daily[0].infected;
      total_recovered += info.daily[0].recovered;
      total_dead += info.daily[0].death;
    }
  }
  return {
    "infected": total_infected,
    "recovered": total_recovered,
    "dead": total_dead
  };
}


function displayTotalNum(infectionInfo) {
  const jpInfectionNumElement = document.querySelector("#jp-infection-num");
  const jpTotalInfectionNumElement = document.querySelector("#jp-total-infection-num");
  const jpRecoveryNumElement = document.querySelector("#jp-recovery-num");
  const jpTotalRecoveryNumElement = document.querySelector("#jp-total-recovery-num");
  const jpDeadNumElement = document.querySelector("#jp-dead-num");
  const jpTotalDeadNumElement = document.querySelector("#jp-total-dead-num");

  const total = calcJapanTotalNum(infectionInfo);
  jpTotalInfectionNumElement.innerHTML = total.infected + '人';
  jpTotalRecoveryNumElement.innerHTML = total.recovered + '人';
  jpTotalDeadNumElement.innerHTML = total.dead + '人';

  const latest = calcJapanLatestNum(infectionInfo);
  jpInfectionNumElement.innerHTML = latest.infected + '人';
  jpRecoveryNumElement.innerHTML = latest.recovered + '人';
  jpDeadNumElement.innerHTML = latest.dead + '人';
}

function displayInfectionTable(infectionInfo) {
}
