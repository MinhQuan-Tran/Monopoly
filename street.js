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
    if (this.pos > 1 && this.pos < 11) {
      $(`#tile${this.pos} .house-area-${this.color}`).css(
        "border-bottom",
        "3px solid black"
      );
    } else if (this.pos > 11 && this.pos < 21) {
      $(`#tile${this.pos} .house-area-${this.color}`).css(
        "border-left",
        "3px solid black"
      );
    } else if (this.pos > 21 && this.pos < 31) {
      $(`#tile${this.pos} .house-area-${this.color}`).css(
        "border-top",
        "3px solid black"
      );
    } else if (this.pos > 31) {
      $(`#tile${this.pos} .house-area-${this.color}`).css(
        "border-right",
        "3px solid black"
      );
    }
  }

  rentPay(player, isFullColorSet) {
    if (this.numHouse == 0 && isFullColorSet) {
      if (player.pay(this.rent[0] * 2)) {
        this.owner.collect(this.rent[0] * 2);
        return true;
      }
    } else {
      if (player.pay(this.rent[this.numHouse])) {
        this.owner.collect(this.rent[this.numHouse]);
        return true;
      }
    }
    return false;
  }

  targetDisplay(isFullColorSet) {
    if (this.numHouse == 0 && isFullColorSet) {
      return 1;
    }
    return this.numHouse;
  }

  display(target) {
    super.display(target);
    $(".card-name").css("background-color", this.color);
    $(".card-info").append(super.cardRow("Rent", this.rent[0], target === 0));
    $(".card-info").append(
      super.cardRow("Rent with color set", this.rent[0] * 2, target === 1)
    );
    $(".card-info").append(
      super.cardRow("One house", this.rent[1], target === 2)
    );
    $(".card-info").append(
      super.cardRow("Two house", this.rent[2], target === 3)
    );
    $(".card-info").append(
      super.cardRow("Three house", this.rent[3], target === 4)
    );
    $(".card-info").append(
      super.cardRow("Four house", this.rent[4], target === 5)
    );
    $(".card-info").append(super.cardRow("Hotel", this.rent[5]), target === 6);
    $(".property-card").removeClass("hide");
  }
}
