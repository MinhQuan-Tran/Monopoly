export default class Property {
  constructor(pos, name, color, price, owner, isMortgage) {
    this.pos = pos;
    this.name = name;
    this.color = color; //property color
    this.price = price;
    this.owner = owner;
    this.isMortgage = isMortgage;
  }

  rentPay(player) {}

  setOwner(player) {
    this.owner = player;
    $(`#tile${this.pos}`).css("background-color", player.color);
  }

  mortgage() {
    isMortgage = true;
    this.owner.collect(price / 2); //mortgage price = property price / 2
  }

  unmortgage() {
    //110% mortgage price
    if (this.owner.pay((price / 2) * 1.1)) {
      isMortgage = false;
      return true;
    }
    return false;
  }
}
