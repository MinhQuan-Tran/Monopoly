import Property from "./property.js";

export default class Station extends Property {
  constructor(pos, name, price, owner, isMortgage) {
    super(pos, name, price, owner, isMortgage);
    if ($(`#tile${this.pos}`).hasClass("property-column")) {
      $(`#tile${this.pos}`).empty().append(`<div class="player-area"></div>
        ${this.name}
        <img src="https://img.icons8.com/color/96/000000/subway.png" />
        <b>\$${this.price}</b>`);
    } else {
      $(`#tile${this.pos}`).empty().append(`<div class="property-info">
        <div class="player-area"></div>
          ${this.name}
          <b>\$${this.price}</b>
        </div>
        <img src="https://img.icons8.com/color/96/000000/subway.png" />`);
    }
  }

  rentPay(player) {
    let totalStation = 0;
    this.owner.properties.forEach((property) => {
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

  targetDisplay() {
    let totalStation = 0;
    this.owner.properties.forEach((property) => {
      if (property.constructor.name == "Station") {
        totalStation++;
      }
    });
    return totalStation - 1;
  }

  display(target) {
    super.display(target);
    $(".card-info").append(
      super.cardRow("One station", 25 * Math.pow(2, 1), target === 0)
    );
    $(".card-info").append(
      super.cardRow("Two Stations", 25 * Math.pow(2, 2)),
      target === 1
    );
    $(".card-info").append(
      super.cardRow("Three Stations", 25 * Math.pow(2, 3)),
      target === 2
    );
    $(".card-info").append(
      super.cardRow("Four Stations", 25 * Math.pow(2, 4)),
      target === 3
    );
    $(".popup-card").removeClass("hide");
  }
}
