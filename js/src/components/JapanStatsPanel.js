import moment from 'moment';


export class JapanStatsPanel {
  constructor() {
    moment.locale('ja');
  }

  render(infectionInfo) {
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

    // 現在
    const currentInfectionNumElement = document.querySelector("#jp-current-infection-num");
    currentInfectionNumElement.innerHTML = infectionInfo[0].current_infected + '人';
    console.log(infectionInfo[0]);
  }
}
