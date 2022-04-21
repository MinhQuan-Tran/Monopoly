export default class Jail {
  constructor(pos) {
    this.pos = pos;
    $(`#tile${this.pos}`).empty().append(`<div class="player-area"></div>
        <img src="https://img.icons8.com/color/48/000000/prison-building.png" />
        <h2>JAIL</h2>`);
  }
}
