export class PrefStatsTable {
  render(infectionInfo) {
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
}
