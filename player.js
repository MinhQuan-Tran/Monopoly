export default class Player {
  constructor(
    id,
    pos,
    name,
    color,
    inJail,
    iconURL,
    balance,
    numOutJail,
    properties,
    colorSet
  ) {
    this.id = id;
    this.pos = pos;
    this.name = name;
    this.color = color;
    this.inJail = inJail;
    this.iconURL = iconURL;
    this.balance = balance;
    this.numOutJail = numOutJail;
    this.properties = properties;
    this.colorSet = colorSet;
    //place player icon on board
    $(`
      <div id="${this.id}-icon-board" class="player-icon">
        <img src="${this.iconURL}" />
      </div>`).appendTo(`#tile${this.pos} .player-area`);
    //place player info on player list
    $(`<div id="${this.id}" class="player-info">
          <span class="player-name">${this.name}</span>
          <div class="player-icon">
            <img
              src="${this.iconURL}"
            />
          </div>
          <span class="player-balance">$${balance}</span>
        </div>`).appendTo(".player-list");
    console.log(`${this.name} created`);
  }

  move(step) {
    this.pos += step;
    if (this.pos > 40) {
      this.pos -= 40;
    }
    if (this.pos < 1) {
      this.pos += 40;
    }
  }

  updatePosition() {
    $(`#${this.id}-icon-board`)
      .detach()
      .appendTo(`#tile${this.pos} .player-area`);
  }

  pay(amount) {
    if (this.balance < amount) {
      alert("Not enough money!");
      return false;
    }
    this.balance -= amount;
    this.updateMoney();
    return true;
  }

  collect(amount) {
    this.balance += amount;
    this.updateMoney();
  }

  updateMoney() {
    $(`#${this.id} .player-balance`).text("$" + this.balance);
  }

  buy(property) {
    if (this.pay(property.price)) {
      property.setOwner(this);
      this.properties.push(property);
      return true;
    }
    return false;
  }

  getInJail() {
    this.inJail = true;
    $(`#${this.id} .player-icon, #${this.id}-icon-board`).append(
      `<img src="https://img.icons8.com/external-icongeek26-flat-icongeek26/64/000000/external-jail-police-icongeek26-flat-icongeek26.png" />`
    );
  }
  getOutJail() {
    this.inJail = false;
    $(`#${this.id} .player-icon, #${this.id}-icon-board`)
      .children()
      .last()
      .remove();
  }
}
