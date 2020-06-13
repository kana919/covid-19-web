import moment from 'moment';


export class Instruction {
  constructor(aggrDateId, updateDateId) {
    this.aggrDateId = aggrDateId;
    this.updateDateId = updateDateId;

    moment.locale('ja');
  }

  render(aggrDate, updateDate) {
    const aggrDateElement = document.querySelector(`#${this.aggrDateId}`);
    const aggrDateFmt = moment(aggrDate).format('MMMMDo');
    aggrDateElement.innerHTML = `${aggrDateFmt}時点の集計`;
    const updateDateElement = document.querySelector(`#${this.updateDateId}`);
    const updateDateFmt = moment(updateDate).format('MMMMDokk時mm分');
    updateDateElement.innerHTML = `更新日時 ${updateDateFmt}`
  }
}
