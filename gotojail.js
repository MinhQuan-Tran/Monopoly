export default class GoToJail {
  constructor(pos, jailPos) {
    this.pos = pos;
    this.jailPos = jailPos;
    $(`#tile${this.pos}`).empty().append(`<div class="player-area"></div>
        <img src="https://img.icons8.com/color/96/000000/detain.png" />
        <h2>GO TO JAIL</h2>`);
  }
}
