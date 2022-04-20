import Player from "./player.js";
import Dice from "./dice.js";
import Land from "./land.js";
import Station from "./station.js";

$(function () {
  // DICE

  let numDices = 2;
  let dices = [];

  function setupDices() {
    for (let i = 0; i < numDices; i++) {
      dices[i] = new Dice();
    }
  }

  function rollDices() {
    for (var i = 0; i < numDices; i++) {
      dices[i].randomize();
    }
  }

  function sumDices() {
    let sum = 0;
    for (var i = 0; i < numDices; i++) {
      sum += dices[i].value;
    }
    return sum;
  }

  function displayDices() {
    for (var i = 0; i < numDices; i++) {
      let url = "";
      switch (dices[i].value) {
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

  // MAIN

  let numPlayers = 4;
  let player = [];
  let initBalance = 1000;
  let currentTurn = 1;
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
  setupDices();

  $("#action-button").click(async () => {
    $("#action-button").prop("disabled", true);
    switch ($("#action-button").val()) {
      case "roll-dice":
        rollDices();
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

  $("#card-action-1").click(() => {
    switch ($("#card-action-1").val()) {
      case "buy":
        if (tiles[player[currentTurn].pos].constructor.name == "Land") {
          if (player[currentTurn].buy(tiles[player[currentTurn].pos])) {
            $(".popup-card").addClass("hide");
          }
        }
        break;
    }
  });

  function checkTile(pos) {
    switch (tiles[pos].constructor.name) {
      case "Land":
        if (tiles[pos].owner == null) {
          $("#card-action-1").val("buy");
          $("#card-action-2").val("auction");
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
      $.each(land, function (key, value) {
        tiles[value.pos] = new Land(
          value.pos,
          value.name,
          value.color,
          value.price,
          null,
          false,
          0,
          value.housePrice,
          value.rent
        );
      });
    });
    console.log(tiles);
  }
});
