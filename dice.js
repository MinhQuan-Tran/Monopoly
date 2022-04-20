export default class Dice {
  constructor() {
    this.value = 6;
  }
  randomize() {
    this.value = Math.floor(Math.random() * 6 + 1);
  }
}
