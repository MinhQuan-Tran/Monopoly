import Property from "./property.js";

export default class Utility extends Property {
  constructor(pos, name, price, owner, isMortgage) {
    super(pos, name, price, owner, isMortgage);
  }

  rentPay(player, diceRoll) {
    owner.properties.forEach((property) => {
      if (property.constructor.name == "Utility") {
        if (player.pay(10 * diceRoll)) {
          this.owner.collect(10 * diceRoll);
          return true;
        } else {
          return false;
        }
      }
    });
    if (player.pay(4 * diceRoll)) {
      this.owner.collect(4 * diceRoll);
      return true;
    } else {
      return false;
    }
  }
}
