import Property from "./property.js";

export default class Station extends Property {
  constructor(pos, name, color, price, owner, isMortgage) {
    super(name, color, price, owner, isMortgage);
  }

  rentPay(player) {
    let totalStation = 0;
    owner.properties.forEach((property) => {
      if (property.constructor.name == "Station") {
        totalStation++;
      }
    });
    if (player.pay(25 * Math.pow(2, totalStation))) {
      // 25, 50, 100, 200
      this.owner.collect(25 * Math.pow(2, totalStation));
      return true;
    }
    return false;
  }
}
