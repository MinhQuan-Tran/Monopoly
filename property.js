export default class Property {
  constructor(pos, name, price, owner, isMortgage) {
    this.pos = pos;
    this.name = name;
    this.price = price;
    this.owner = owner;
    this.isMortgage = isMortgage;
  }

  rentPay(player) {}

  targetDisplay() {}

  display(target) {
    $(".card-name").text(this.name);
    $(".card-info").empty();
    $(".card-info").append(
      this.cardRow("Purchase Price", this.price, target === "buy")
    );
    $(".card-info").append(
      this.cardRow("Mortgage Value", this.price / 2, target === "mortage")
    );
    $(".card-info").append($("<tr></tr>").append($("<br>")));
  }

  setOwner(player) {
    this.owner = player;
    $(`#tile${this.pos}`).css("background-color", player.color);
  }

  resetOwner() {
    this.owner = null;
    $(`#tile${this.pos}`).css("background-color", rgb(212, 252, 218));
  }

  cardRow(left, right, selected) {
    let cardLeft = $("<td></td>").text(left);
    let cardRight = $("<td></td>").text("$" + right);
    let cardRow = $("<tr></tr>").append(cardLeft).append(cardRight);
    if (selected) {
      cardRow.css("background-color", "skyblue");
    }
    return cardRow;
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
