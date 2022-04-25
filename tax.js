export default class Tax {
  constructor(pos, name, tax, iconURL) {
    this.pos = pos;
    this.name = name;
    this.tax = tax;
    this.iconURL = iconURL;

    if ($(`#tile${this.pos}`).hasClass("property-column")) {
      $(`#tile${this.pos}`).empty().append(`<div class="player-area"></div>
        ${this.name} TAX
        <img src="${this.iconURL}" />
        <p>PAY <b>\$${this.tax}</b></p>`);
    } else {
      $(`#tile${this.pos}`).empty().append(`<div class="player-area"></div>
        <div class="property-info">
            ${this.name} TAX
            <p>PAY <b>\$${this.tax}</b></p>
        </div>
        <img src="${this.iconURL}" />`);
    }
  }

  taxPay(player) {
    if (player.pay(this.tax)) {
      return true;
    }
    return false;
  }
}
