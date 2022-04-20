import Property from "./property.js";

export default class Land extends Property {
  constructor(
    pos,
    name,
    color,
    price,
    owner,
    isMortgage,
    numHouse,
    housePrice,
    rent
  ) {
    super(pos, name, color, price, owner, isMortgage);
    this.numHouse = numHouse; //5 houses = hotel
    this.housePrice = housePrice;
    this.rent = rent; //array of 6
  }

  rentPay(player) {
    if (player.pay(this.rent[numHouse])) {
      this.owner.collect(this.rent[numHouse]);
      return true;
    }
    return false;
  }
}
