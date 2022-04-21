export default class Parking {
  constructor(pos) {
    this.pos = pos;
    $(`#tile${this.pos}`).empty().append(`<div class="player-area"></div>
        <img src="https://img.icons8.com/color/96/000000/parking.png" />
        <h2>FREE PARKING</h2>`);
  }
}
