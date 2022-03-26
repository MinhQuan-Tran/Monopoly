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

$(function () {
  $("#action-button").click(function () {
    if ($("#action-button").val() == "roll-dice") {
      updateDices();
      displayDices();
    }
  });
});
