// DICE

let numDices = 2;
let dices = [];

function randomDice() {
  return Math.floor(Math.random() * 6 + 1);
}

function updateDices() {
  for (var i = 0; i < numDices; i++) {
    dices[i] = randomDice();
  }
}

function sumDices() {
  let sum = 0;
  for (var i = 0; i < numDices; i++) {
    sum += dices[i];
  }
  return sum;
}

function displayDices() {
  for (var i = 0; i < numDices; i++) {
    let url = "";
    switch (dices[i]) {
      case 1:
        url =
          "https://upload.wikimedia.org/wikipedia/commons/c/c8/Terning1.svg";
        break;
      case 2:
        url =
          "https://upload.wikimedia.org/wikipedia/commons/2/22/Terning2.svg";
        break;
      case 3:
        url =
          "https://upload.wikimedia.org/wikipedia/commons/9/9f/Terning3.svg";
        break;
      case 4:
        url =
          "https://upload.wikimedia.org/wikipedia/commons/2/23/Terning4.svg";
        break;
      case 5:
        url =
          "https://upload.wikimedia.org/wikipedia/commons/2/23/Terning5.svg";
        break;
      default:
        url =
          "https://upload.wikimedia.org/wikipedia/commons/0/0c/Terning6.svg";
    }
    $(`#dice${i + 1}`).attr("src", url);
  }
}

//PLAYER

class Player {
  constructor(
    id,
    pos,
    name,
    color,
    inJail,
    iconURL,
    balance,
    numOutJail,
    properties
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
  //tiles [1, 40]
  movePlayer(step, time, isForward) {
    return new Promise((resolve) => {
      let movePlayer = setInterval(() => {
        player[currentTurn].move(isForward ? 1 : -1);
        player[currentTurn].updatePosition();
        step--;
        if (step <= 0) {
          clearInterval(movePlayer);
          resolve();
        }
      }, time);
    });
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
    updateMoney();
    return true;
  }

  collect(amount) {
    this.balance += amount;
    updateMoney();
  }

  updateMoney() {
    $(`#${this.id} .player-balance`).innerHTML = this.balance;
  }
}

// TILES

class Property {
  constructor(name, color, price, owner, isMortgage) {
    this.name = name;
    this.color = color; //property color
    this.price = price;
    this.owner = owner;
    this.isMortgage = isMortgage;
  }

  rentPay(player) {}

  buy(player) {
    if (player.pay(this.rent[numHouse])) {
      this.owner = player;
      return true;
    }
    return false;
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

class Land extends Property {
  constructor(
    name,
    color,
    price,
    owner,
    isMortgage,
    numHouse,
    housePrice,
    rent
  ) {
    super(name, color, price, owner, isMortgage);
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

class Station extends Property {
  constructor(name, color, price, owner, isMortgage) {
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

// MAIN
$(function () {
let numPlayers = 4;
let player = [];
let initBalance = 1000;
let currentTurn = 1;
let endTurn = false;
let tiles = [];

player[1] = new Player(
  "player1",
  1,
  "PLAYER 1",
  "red",
  false,
  "https://img.icons8.com/color/48/000000/user-male-circle--v1.png",
  initBalance,
  0,
  []
);

player[2] = new Player(
  "player2",
  1,
  "PLAYER 2",
  "yellow",
  false,
  "https://img.icons8.com/color/48/000000/user-male-circle--v1.png",
  initBalance,
  0,
  []
);

player[3] = new Player(
  "player3",
  1,
  "PLAYER 3",
  "green",
  false,
  "https://img.icons8.com/color/48/000000/user-male-circle--v1.png",
  initBalance,
  0,
  []
);

player[4] = new Player(
  "player4",
  1,
  "PLAYER 4",
  "blue",
  false,
  "https://img.icons8.com/color/48/000000/user-male-circle--v1.png",
  initBalance,
  0,
  []
);

$(`#${player[currentTurn].id}`).css("background-color", "white");

setupTiles();


  $("#action-button").click(async () => {
    $("#action-button").prop("disabled", true);
    switch ($("#action-button").val()) {
      case "roll-dice":
        updateDices();
        displayDices();
        let sumDice = sumDices();
        let step = sumDice;
        await player[currentTurn].movePlayer(step, 200, true);

        checkTile(player[currentTurn].pos);

        if (dices[0] != dices[1]) {
          changeActionButton("end-turn");
        }
        break;

      case "end-turn":
        $(`#${player[currentTurn].id}`).css("background-color", "lightgrey");
        currentTurn++;
        if (currentTurn > numPlayers) {
          currentTurn = 1;
        }
        changeActionButton("roll-dice");
        $(`#${player[currentTurn].id}`).css("background-color", "white");
        break;
    }
    $("#action-button").prop("disabled", false);
  });

  $("#card-actions-1").click(() => {
    switch ($("#card-actions-1").val()) {
      case "buy":
        //if (tiles[player[currentTurn].pos].constructor.name == )
    }
  });
});

// Functions

function checkTile(pos) {
  switch (tiles[pos].constructor.name) {
    case "Land":
      if (tiles[pos].owner == null) {
        $("#card-actions-1").val() = "buy";
        $("#card-actions-2").val() = "auction";
        $(".popup-card").removeClass("hide");
      }
      break;
  }
}

function changeActionButton(value) {
  switch (value) {
    case "end-turn":
      $("#action-button").val("end-turn");
      $("#action-button").text("END TURN");
      break;
    case "roll-dice":
      $("#action-button").val("roll-dice");
      $("#action-button").text("ROLL DICE");
      break;
  }
}

function setupTiles() {
  $.getJSON("tiles.json", function (data) {
    let land = data.land;
    $.each(land, function (pos, name, color, price, housePrice, rent) {
      tiles[pos] = new Land(
        name,
        color,
        price,
        null,
        false,
        0,
        housePrice,
        rent
      );
    });
  });
}
