import Property from "./property.js";

export default class Street extends Property {
  constructor(
    pos,
    name,
    price,
    owner,
    isMortgage,
    color,
    numHouse,
    housePrice,
    rent
  ) {
    super(pos, name, price, owner, isMortgage);
    this.color = color;
    this.numHouse = numHouse; //5 houses = hotel
    this.housePrice = housePrice;
    this.rent = rent; //array of 6
    if (this.pos < 12 || this.pos > 31) {
      // bottom and right
      $(`#tile${this.pos}`).empty()
        .append(`<div class="house-area-${this.color}"></div>
        <div class="property-info">
          <div class="player-area"></div>
          ${this.name}<br />
          <b>\$${this.price}</b>
        </div>`);
    } else {
      $(`#tile${this.pos}`).empty().append(`<div class="property-info">
          <div class="player-area"></div>
          ${this.name}<br />
          <b>\$${this.price}</b>
        </div>
        <div class="house-area-${this.color}"></div>`);
    }
  }

  rentPay(player) {
    if (player.pay(this.rent[this.numHouse])) {
      this.owner.collect(this.rent[this.numHouse]);
      return true;
    }
    return false;
  }

  display(target) {
    super.display(target);
    $(".card-info").append(super.cardRow("Rent", this.rent[0], target === 0));
    $(".card-info").append(
      super.cardRow("Rent with color set", this.rent[0] * 2),
      target === 1
    );
    $(".card-info").append(
      super.cardRow("One house", this.rent[1]),
      target === 2
    );
    $(".card-info").append(
      super.cardRow("Two house", this.rent[2]),
      target === 3
    );
    $(".card-info").append(
      super.cardRow("Three house", this.rent[3]),
      target === 4
    );
    $(".card-info").append(
      super.cardRow("Four house", this.rent[4]),
      target === 5
    );
    $(".card-info").append(super.cardRow("Hotel", this.rent[5]), target === 6);
    $(".popup-card").removeClass("hide");
  }
}
