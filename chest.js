export default class Chance {
  constructor(pos) {
    this.pos = pos;
    $(`#tile${this.pos}`).empty().append(`<div class="player-area"></div>
        COMMUNITY CHEST
        <img src="https://img.icons8.com/color/96/000000/treasure-chest.png" />`);
  }
}
