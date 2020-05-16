export class PrefStatsPanel {
  render(info) {
    const prefNameElement = document.querySelector('#prefecture-name');
    prefNameElement.innerHTML = info.name;

    const infectionNumElement = document.querySelector("#infection-num");
    const recoveryNumElement = document.querySelector("#recovery-num");
    const deadNumElement = document.querySelector("#dead-num");
    const stayHomeRatioElement = document.querySelector("#stayhome-ratio");

    const totalInfectionNumElement = document.querySelector("#total-infection-num");
    const totalRecoveryNumElement = document.querySelector("#total-recovery-num");
    const totalDeadNumElement = document.querySelector("#total-dead-num");

    if (info.daily.length > 1) {
      // データが存在している場合は現在感染者数を表示
      infectionNumElement.innerHTML = info.daily[0].new_infected + '人';
      recoveryNumElement.innerHTML = info.daily[0].total_recovered - info.daily[1].total_recovered + '人';
      deadNumElement.innerHTML = info.daily[0].total_death - info.daily[1].total_death + '人';

      totalInfectionNumElement.innerHTML = info.daily[0].total_infected + '人';
      totalRecoveryNumElement.innerHTML = info.daily[0].total_recovered + '人';
      totalDeadNumElement.innerHTML = info.daily[0].total_death + '人';

      if (info.daily[0].restraint_ratio) {
        stayHomeRatioElement.innerHTML = parseInt(info.daily[0].restraint_ratio * 100) + '%'
      } else {
        stayHomeRatioElement.innerHTML = '- %';
      }
    } else {
      // データがない場合は不明
      infectionNumElement.innerHTML = '- 人';
      recoveryNumElement.innerHTML = '- 人';
      deadNumElement.innerHTML = '- 人';

      totalInfectionNumElement.innerHTML = '- 人';
      totalRecoveryNumElement.innerHTML = '- 人';
      totalDeadNumElement.innerHTML = '- 人';

      stayHomeRatioElement.innerHTML = '- %';
    }
  }
}
