import Player from "./player.js";
import Dice from "./dice.js";
import Street from "./street.js";
import Station from "./station.js";
import Utility from "./utility.js";
import Go from "./go.js";
import Chance from "./chance.js";
import Chest from "./chest.js";
import Tax from "./tax.js";
import GoToJail from "./gotojail.js";
import Jail from "./jail.js";
import Parking from "./parking.js";

$(async function () {
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

  await setupTiles();
  await setupDices();
  await setupPlayers();

  $("#action-button").click(async () => {
    $("#action-button").prop("disabled", true);
    switch ($("#action-button").val()) {
      case "roll-dice":
        rollDices();
        displayDices();
        let sumDice = sumDices();
        let step = sumDice;
        await movePlayer(player[currentTurn], step, 200, true);

        await checkTile(player[currentTurn].pos);

        if (dices[0].value != dices[1].value) {
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
        if (
          ["Street", "Station", "Utility"].includes(
            tiles[player[currentTurn].pos].constructor.name
          )
        ) {
          if (player[currentTurn].buy(tiles[player[currentTurn].pos])) {
            $(".popup-card").addClass("hide");
          }
        }
        break;
    }
  });

  function movePlayer(player, step, time, isForward) {
    return new Promise((resolve) => {
      let movePlayer = setInterval(async () => {
        await player.move(isForward ? 1 : -1);
        player.updatePosition();
        if (checkTile(player.pos, "Go") == true) {
          player.collect(tiles[player.pos].salary);
        }
        step--;
        if (step <= 0) {
          clearInterval(movePlayer);
          resolve();
        }
      }, time);
    });
  }

  async function checkTile(pos, specificType) {
    if (specificType != null) {
      if (tiles[pos].constructor.name === specificType) {
        console.log(tiles[pos].constructor.name);
        return true;
      }
    } else {
      switch (tiles[pos].constructor.name) {
        case "Street":
        case "Station":
        case "Utility":
          if (tiles[pos].owner == null) {
            $("#card-action-1").val("buy");
            $("#card-action-2").val("auction");
            tiles[pos].display("buy");
            await checkPopupCard();
          } else if (tiles[pos].owner != player[currentTurn]) {
            await tiles[pos].rentPay(player[currentTurn]);
          }
          break;
      }
    }
  }

  function checkPopupCard() {
    return new Promise((resolve) => {
      if ($(".popup-card").hasClass("hide")) {
        resolve();
      }

      let observer = new MutationObserver((mutations) => {
        if ($(".popup-card").hasClass("hide")) {
          resolve();
          observer.disconnect();
        }
      });

      observer.observe(document.getElementById("popup-card"), {
        attributes: true,
      });
    });
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

  async function setupTiles() {
    await $.getJSON("tiles.json", function (data) {
      let street = data.street;
      $.each(street, function (key, value) {
        tiles[value.pos] = new Street(
          value.pos,
          value.name,
          value.price,
          null,
          false,
          value.color,
          0,
          value.housePrice,
          value.rent
        );
      });

      let station = data.station;
      $.each(station, function (key, value) {
        tiles[value.pos] = new Station(
          value.pos,
          value.name,
          value.price,
          null,
          false
        );
      });

      let utility = data.utility;
      $.each(utility, function (key, value) {
        tiles[value.pos] = new Utility(
          value.pos,
          value.name,
          value.price,
          null,
          false
        );
      });

      let go = data.go;
      $.each(go, function (key, value) {
        tiles[value.pos] = new Go(value.pos, value.salary);
      });

      let chance = data.chance;
      $.each(chance, function (key, value) {
        tiles[value.pos] = new Chance(value.pos);
      });

      let chest = data.chest;
      $.each(chest, function (key, value) {
        tiles[value.pos] = new Chest(value.pos);
      });

      let tax = data.tax;
      $.each(tax, function (key, value) {
        tiles[value.pos] = new Tax(
          value.pos,
          value.name,
          value.tax,
          value.iconURL
        );
      });

      let goToJail = data.goToJail;
      $.each(goToJail, function (key, value) {
        tiles[value.pos] = new GoToJail(value.pos, value.jailPos);
        tiles[value.jailPos] = new Jail(value.jailPos);
      });

      let parking = data.parking;
      $.each(parking, function (key, value) {
        tiles[value.pos] = new Parking(value.pos);
      });
    });
    console.log(tiles);
  }

  function setupPlayers() {
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
  }
});
