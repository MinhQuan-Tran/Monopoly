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
}

// PROPERTIES

class Property {
  constructor(name, color, price, mortgage, isMortgage) {
    this.name = name;
    this.color = color; //property color
    this.price = price;
    this.mortgage = mortgage; //mortgage values
    this.isMortgage = isMortgage;
  }
  pay() {}
}

class Land extends Property {
  constructor(name, color, price, mortgage, isMortgage, numHouse, housePrice) {
    super(name, color, price, mortgage, isMortgage);
    this.numHouse = numHouse; //5 houses = hotel
    this.housePrice = housePrice;
  }
}

class Station extends Property {
  constructor(name, color, price, mortgage, isMortgage) {
    super(name, color, price, mortgage, isMortgage);
  }
}

// MAIN
let numPlayers = 5;
let player = [];
let initBalance = 1000;
let currentTurn = 1;
let endTurn = false;

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

$(function () {
  $("#action-button").click(async () => {
    $("#action-button").prop("disabled", true);
    switch ($("#action-button").val()) {
      case "roll-dice":
        updateDices();
        displayDices();
        let sumDice = sumDices();
        let step = sumDice;
        await player[currentTurn].movePlayer(step, 200, true);
        if (dices[0] != dices[1]) {
          $("#action-button").val("end-turn");
          $("#action-button").text("END TURN");
        }
        break;
      case "end-turn":
        currentTurn++;
        if (currentTurn > 4) {
          currentTurn = 1;
        }
        $("#action-button").val("roll-dice");
        $("#action-button").text("ROLL DICE");
        break;
    }
    $("#action-button").prop("disabled", false);
  });
});
