//Array to add topics
var topics = ["pikachu", "snorlax", "charmander"];

//Buttons for initial example in array
function renderButtons() {
  $("#add-button").empty();

  for (var index = 0; index < topics.length; index++) {
    var displayButton = $("<button>");
    displayButton.addClass("mr-2 mb-2 btn-dark topic-btn");
    displayButton.attr("data-name", topics[index]);
    displayButton.text(topics[index].toUpperCase());
    $("#add-button").append(displayButton);
  }
}

//Get value from the input field
$("#submit-button").on("click", function(event) {
  event.preventDefault();

  var getValue = $("#topic-input")
    .val()
    .trim();

  $(".topic-form").trigger("reset");

  topics.push(getValue);

  renderButtons();
});

//Show Gifs
function displayTopicGif() {
  var gifTopic = $(this).attr("data-name");
  var gifOffset = 0;
  var gifLimit = 15;

  activePokemon(gifTopic);

  $("#previous-page").on("click", function() {
    if (gifOffset !== 0) {
      gifOffset -= gifLimit;
      getURL(gifTopic, gifOffset, gifLimit);
    }
  });

  $("#next-page").on("click", function() {
    gifOffset += gifLimit;
    getURL(gifTopic, gifOffset, gifLimit);
  });

  getURL(gifTopic, gifOffset, gifLimit);
}

//Active Pokemon Button
function activePokemon(name) {
  $("#add-button button").each(function(index, element) {

    //Remove all existing active highlight
    $(element).removeClass("active-pokemon");
    $(element).addClass("btn-dark");

    //Check for new active highlight
    if ($(element).attr("data-name") === name) {
      $(element).addClass("active-pokemon");
      $(element).removeClass("btn-dark");
    }
  });
  
  //Check if a Pokemon is selected and send true it selected
  if (name) {
    checkSelect(true);
  }
}

//Return URL
function getURL(gifTopic, gifOffset, gifLimit) {
  var gifUrl =
    "https://api.giphy.com/v1/gifs/search?api_key=xlwTlWsHjqOnoRq5SnOLVMHw75qxIX2k&q=" +
    gifTopic +
    "&offset=" +
    gifOffset +
    "&limit=" +
    gifLimit;

  var pokeUrl = "https://pokeapi.co/api/v2/pokemon/" + gifTopic;

  getPoke(pokeUrl, gifUrl);
}

//Error message when pokemon doesnot exist
function errorPoki() {
  $("#detail-text").empty();
  $("#stat-text").empty();
  $("#add-gif").empty();

  $("#pokeName-text").text("Pokemon does not exist. Try Again!");
}

//get pokemon information from api
function getPoke(pokeUrl, gifUrl) {
  $.ajax({
    url: pokeUrl,
    method: "GET",
    error: errorPoki
  }).done(function(response) {
    if (response.name) {
      $("#pokeName-text").text(response.name.toUpperCase());

      var capitalizeType =
        response.types[0].type.name.charAt(0).toUpperCase() +
        response.types[0].type.name.slice(1);

      var pokeDetail = {
        "Pokedex Number": response.id,
        Type: capitalizeType,
        Weight: response.weight / 10 + " kg",
        Height: response.height * 10 + " cm"
      };

      $("#detail-text").empty();
      $("#stat-text").empty();

      $.each(pokeDetail, function(key, value) {
        var type = $("<li>");
        type.addClass("list-group-item");
        type.text(key + ": " + value);

        $("#detail-text").append(type);
      });

      for (var i = 0; i < 4; i++) {
        var list = $("<li>");
        list.addClass("list-group-item");
        list.text(
          response.stats[i].stat.name + ": " + response.stats[i].base_stat
        );

        $("#stat-text").append(list);
      }
      getGif(gifUrl);
    }
  });
}

//Get button value when clicked
function getGif(gifUrl) {
  $.ajax({
    url: gifUrl,
    method: "GET"
  }).then(function(response) {
    $("#add-gif").empty();

    for (var count = 0; count < 15; count++) {
      if (count % 3 === 0) {
        var addRow = $("<div>");
        addRow.addClass("row mb-4");
        $("#add-gif").append(addRow);
        $("#add-gif").append("<hr>");
      }

      var displayDiv = $("<div>");
      var displayImg = $("<img>");
      var displayRating = $("<p>");

      displayDiv.addClass("col-md-4");

      displayImg.addClass("img-fluid");
      displayImg.addClass("gif");
      displayImg.addClass("pointer");

      displayImg.attr(
        "data-still",
        response.data[count].images.original_still.url
      );
      displayImg.attr("data-animate", response.data[count].images.original.url);
      displayImg.attr("data-state", "still");

      displayImg.attr("src", response.data[count].images.original_still.url);

      displayRating.text(
        "Rating: " + response.data[count].rating.toUpperCase()
      );
      displayRating.addClass("text-light mb-1");

      displayDiv.append(displayRating);
      displayDiv.append(displayImg);

      $("#add-gif>div:last").append(displayDiv);
    }

    $(".gif").on("click", function() {
      var stateValue = $(this).attr("data-state");

      if (stateValue === "still") {
        var stillState = $(this).attr("data-animate");
        $(this).attr("src", stillState);
        $(this).attr("data-state", "animate");
      } else {
        var animateState = $(this).attr("data-still");
        $(this).attr("src", animateState);
        $(this).attr("data-state", "still");
      }
    });
  });
}

function checkSelect(checkName) {
  if (checkName) {
    $(".check-select").show();
  } else {
    $(".check-select").hide();
  }
}

$(document).ready(function() {
  //Adding click function to all the elements with "topic-btn" class
  $(document).on("click", ".topic-btn", displayTopicGif);

  // Show buttons
  renderButtons();
  checkSelect(false);
});
