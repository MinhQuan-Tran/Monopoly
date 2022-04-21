export default class Go {
  constructor(pos, salary) {
    this.pos = pos;
    this.salary = salary;
    $(`#tile${this.pos}`).empty().append(`<div class="player-area"></div>
        <h1>GO</h1>
        <img src="https://img.icons8.com/nolan/96/arrow-pointing-left.png" />
        <p>COLLECT <b>\$${this.salary}</b></p>`);
  }
}
