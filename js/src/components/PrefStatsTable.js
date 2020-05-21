export class PrefStatsTable {
  render(infectionInfo) {
    // 感染者数テーブル
    for (let info of infectionInfo) {
      let prefCellElements = document.querySelectorAll(`#${info.name_en} #num`);
      if (info.daily.length > 0 && prefCellElements.length > 0) {
        // データが存在している場合は現在感染者数を表示
        prefCellElements[0].innerHTML = info.daily[0].current_infected;
      } else {
        // データがない場合は不明
        prefCellElements[0].innerHTML = '不明';
      }
    }
  }
}
