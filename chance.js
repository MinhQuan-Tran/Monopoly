export default class Chance {
  constructor(pos) {
    this.pos = pos;
    $(`#tile${this.pos}`).empty().append(`<div class="player-area"></div>
        CHANCE
        <img src="https://img.icons8.com/color/48/000000/chip--v1.png" />`);
  }
}
