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
  let numDices = 2;
  let dices = [];
  let numPlayers = 4;
  let player = [];
  let currentTurn = 1;
  let tiles = [];
  let colorSet = {};
  let sumDice = 0;
  let sameDices = 0;
  let tempOpenPopup;
  const initBalance = 1000;
  const timeBetweenStep = 200;

  await setupTiles();
  await setupDices();
  await setupPlayers();

  $("#action-button").click(async () => {
    $("#action-button").prop("disabled", true);
    switch ($("#action-button").val()) {
      case "roll-dice":
        if (player[currentTurn].inJail > 0) {
          $("#num-jail-left").text(player[currentTurn].inJail);
          if (player[currentTurn].balance < 50) {
            $("#jail-pay").prop("disabled", true);
          } else {
            $("#jail-pay").prop("disabled", false);
          }
          if (player[currentTurn].numOutJail <= 0) {
            $("#jail-card").prop("disabled", true);
          } else {
            $("#jail-card").prop("disabled", false);
          }
          $("dialog").prop("open", true);

          const jailDecision = await getJailDecision();

          console.log(jailDecision);

          switch (jailDecision) {
            case "pay":
              player[currentTurn].pay(50);
              player[currentTurn].getOutJail();
              break;
            case "card":
              player[currentTurn].numOutJail--;
              player[currentTurn].getOutJail();
              break;
            case "roll":
              rollDices();
              displayDices();
              if (dices[0].value != dices[1].value) {
                player[currentTurn].inJail--;
                changeActionButton("end-turn");
              } else {
                player[currentTurn].inJail = 0;
              }
              if (player[currentTurn].inJail == 0) {
                player[currentTurn].getOutJail();
              }
              break;
          }

          $("dialog").prop("open", false);
        } else {
          rollDices();
          displayDices();
          sumDice = sumDices();
          if (sameDices == 2 && dices[0].value == dices[1].value) {
            const jailPos = tiles.find((element) => {
              if (element != null && element.constructor.name == "Jail") {
                return true;
              }
            }).pos;
            let step;
            let moveForward = false;
            if (player[currentTurn].pos > jailPos) {
              step = player[currentTurn].pos - jailPos;
            } else {
              step = jailPos - player[currentTurn].pos;
              moveForward = true;
            }
            console.log(jailPos);
            await movePlayer(
              player[currentTurn],
              step,
              timeBetweenStep / 2,
              moveForward
            );
            player[currentTurn].getInJail();
            sameDices = 0;
            changeActionButton("end-turn");
          } else {
            let step = sumDice;
            await movePlayer(player[currentTurn], step, timeBetweenStep, true);

            await checkTile(player[currentTurn].pos);

            if (dices[0].value != dices[1].value) {
              sameDices = 0;
              changeActionButton("end-turn");
            } else {
              sameDices++;
            }
          }
        }
        break;

      case "end-turn":
        currentTurn++;
        if (currentTurn > numPlayers) {
          currentTurn = 1;
        }
        changeActionButton("roll-dice");
        changeFocusPlayer(currentTurn);
        break;
    }
    $("#action-button").prop("disabled", false);
  });

  $("#card-option-1").click(() => {
    switch ($("#card-option-1").val()) {
      case "buy":
        if (
          ["Street", "Station", "Utility"].includes(
            tiles[player[currentTurn].pos].constructor.name
          )
        ) {
          if (player[currentTurn].buy(tiles[player[currentTurn].pos])) {
            $(".property-card").addClass("hide");
          }
        }
        break;
    }
  });

  $("#card-option-2").click(async () => {
    switch ($("#card-option-2").val()) {
      case "auction":
        let auctionCurrentTurn = currentTurn;
        let amount = 0;
        let highestAuctionPlayer = null; // turn
        $("#auction-card").removeClass("hide");
        while (highestAuctionPlayer != auctionCurrentTurn) {
          changeFocusPlayer(auctionCurrentTurn);
          updateAuction(
            amount,
            highestAuctionPlayer,
            player[auctionCurrentTurn].balance < amount + 100,
            player[auctionCurrentTurn].balance < amount + 10,
            player[auctionCurrentTurn].balance < amount + 1
          );
          let addAmount = await getAuction();
          if (addAmount > 0) {
            amount += addAmount;
            highestAuctionPlayer = auctionCurrentTurn;
          }
          auctionCurrentTurn++;
          if (auctionCurrentTurn > numPlayers) {
            auctionCurrentTurn = 1;
          }
          if (auctionCurrentTurn == currentTurn && amount == 0) {
            break;
          }
        }
        $("#auction-card").addClass("hide");
        if (amount > 0) {
          player[highestAuctionPlayer].buy(
            tiles[player[currentTurn].pos],
            amount
          );
        }
        changeFocusPlayer(currentTurn);
        break;
    }
    $(".property-card").addClass("hide");
  });

  function updateAuction(
    amount,
    highestAuctionPlayer,
    disableOption1,
    disableOption2,
    disableOption3
  ) {
    $("#highest-auction-player").text(
      highestAuctionPlayer === null
        ? "No one"
        : player[highestAuctionPlayer].name
    );
    $("#highest-auction-amount").text(`$${amount}`);
    $("#auction-option1").prop("disabled", disableOption1);
    $("#auction-option2").prop("disabled", disableOption2);
    $("#auction-option3").prop("disabled", disableOption3);
  }

  function getAuction() {
    return new Promise((resolve) => {
      $("#auction-option1").click(() => {
        resolve(100);
      });
      $("#auction-option2").click(() => {
        resolve(10);
      });
      $("#auction-option3").click(() => {
        resolve(1);
      });
      $("#auction-pass").click(() => {
        resolve(0);
      });
    });
  }

  function changeFocusPlayer(toPlayer) {
    player.forEach((element) => {
      $(`#${element.id}`).css("background-color", "lightgrey");
    });
    $(`#${player[toPlayer].id}`).css("background-color", "white");
  }

  function movePlayer(player, step, time, isForward) {
    return new Promise((resolve) => {
      let movePlayer = setInterval(async () => {
        await player.move(isForward ? 1 : -1);
        player.updatePosition();
        if (tiles[player.pos].constructor.name == "Go") {
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

  function getJailDecision() {
    return new Promise((resolve) => {
      $("#jail-pay").click(() => {
        resolve("pay");
      });
      $("#jail-card").click(() => {
        resolve("card");
      });
      $("#jail-roll").click(() => {
        resolve("roll");
      });
    });
  }

  async function checkTile(pos) {
    switch (tiles[pos].constructor.name) {
      case "Street":
      case "Station":
      case "Utility":
        if (tiles[pos].owner == null) {
          clearTimeout(tempOpenPopup);
          $("#card-option-1").val("buy").text("Buy").removeClass("hide");
          $("#card-option-2")
            .val("auction")
            .text("Auction")
            .removeClass("hide");
          tiles[pos].display("buy");
          await checkPopupCard();
        } else if (tiles[pos].owner != player[currentTurn]) {
          clearTimeout(tempOpenPopup);
          $("#card-option-1").addClass("hide");
          $("#card-option-2").addClass("hide");
          switch (tiles[pos].constructor.name) {
            case "Street":
              if (
                tiles[pos].owner.colorSet[tiles[pos].color] ==
                colorSet[tiles[pos].color]
              ) {
                tiles[pos].display(tiles[pos].targetDisplay(true));
                await tiles[pos].rentPay(player[currentTurn], true);
              } else {
                tiles[pos].display(tiles[pos].targetDisplay());
                await tiles[pos].rentPay(player[currentTurn]);
              }
              break;
            case "Station":
              tiles[pos].display(tiles[pos].targetDisplay());
              await tiles[pos].rentPay(player[currentTurn]);
              break;
            case "Utility":
              tiles[pos].display(tiles[pos].targetDisplay());
              await tiles[pos].rentPay(player[currentTurn], sumDice);
              break;
          }
          tempOpenPopup = setTimeout(() => {
            $(".property-card").addClass("hide");
          }, 2000);
        }
        break;
      case "GoToJail":
        let step = player[currentTurn].pos - tiles[pos].jailPos;
        await movePlayer(player[currentTurn], step, timeBetweenStep / 2, false);
        player[currentTurn].getInJail();
        changeActionButton("end-turn");
        break;
      case "Tax":
        tiles[pos].taxPay(player[currentTurn]);
        break;
    }
  }

  function checkPopupCard() {
    return new Promise((resolve) => {
      if ($(".property-card").hasClass("hide")) {
        resolve();
      }

      let observer = new MutationObserver((mutations) => {
        if ($(".property-card").hasClass("hide")) {
          resolve();
          observer.disconnect();
        }
      });

      observer.observe(document.getElementById("property-card"), {
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
        if (colorSet.hasOwnProperty(value.color)) colorSet[value.color]++;
        else colorSet[value.color] = 1;
      });
      console.log(colorSet);

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
          false,
          value.iconURL
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
      0,
      "https://img.icons8.com/color/48/000000/user-male-circle--v1.png",
      initBalance,
      0,
      [],
      {}
    );

    player[2] = new Player(
      "player2",
      1,
      "PLAYER 2",
      "yellow",
      0,
      "https://img.icons8.com/color/48/000000/user-male-circle--v1.png",
      initBalance,
      0,
      [],
      {}
    );

    player[3] = new Player(
      "player3",
      1,
      "PLAYER 3",
      "green",
      0,
      "https://img.icons8.com/color/48/000000/user-male-circle--v1.png",
      initBalance,
      0,
      [],
      {}
    );

    player[4] = new Player(
      "player4",
      1,
      "PLAYER 4",
      "blue",
      0,
      "https://img.icons8.com/color/48/000000/user-male-circle--v1.png",
      initBalance,
      0,
      [],
      {}
    );

    $(`#${player[currentTurn].id}`).css("background-color", "white");
  }
});
