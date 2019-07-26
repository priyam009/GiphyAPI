//Array to add topics
var topics = ["pikachu", "snorlax", "charmander"];

//Buttons for initial example in array
function renderButtons() {
  $("#add-button").empty();

  for (var index = 0; index < topics.length; index++) {
    var displayButton = $("<button>");
    displayButton.addClass("topic-btn mr-2 mb-2 btn btn-dark");
    displayButton.attr("data-name", topics[index]);
    displayButton.text(topics[index]);
    $("#add-button").append(displayButton);
  }

};

//Get value from the input field
$("#submit-button").on("click", function(event) {
  event.preventDefault();

  var getValue = $("#topic-input")
    .val()
    .trim();

  $(".topic-form").trigger("reset");

  topics.push(getValue.toLowerCase());

  renderButtons();
});

//Show buttons
renderButtons();

//Show Gifs
function displayTopicGif() {
  var gifTopic = $(this).attr("data-name");
  var gifOffset = 0;
  var gifLimit = 15;

  $("#previous-page").on("click", function() {
    if(gifOffset !== 0) {
      gifOffset -= gifLimit;
      getURL(gifTopic, gifOffset, gifLimit);
    };
  });
  
  $("#next-page").on("click", function() {
    gifOffset += gifLimit;
    getURL(gifTopic, gifOffset, gifLimit);
  });

  getURL(gifTopic, gifOffset, gifLimit);
};



//Return URL
function getURL(gifTopic, gifOffset, gifLimit) {
  var gifUrl = "https://api.giphy.com/v1/gifs/search?api_key=xlwTlWsHjqOnoRq5SnOLVMHw75qxIX2k&q=" + gifTopic + "&offset=" + gifOffset + "&limit=" + gifLimit;

  var pokeUrl = "https://pokeapi.co/api/v2/pokemon/" + gifTopic;

  getGif(gifUrl);
  getPoke(pokeUrl);
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

      displayImg.attr("data-still", response.data[count].images.original_still.url);
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
      
      if(stateValue === "still") {
        var stillState = $(this).attr("data-animate");
        $(this).attr("src", stillState);
        $(this).attr("data-state", "animate");
      } else {
        var animateState = $(this).attr("data-still");
        $(this).attr("src", animateState);
        $(this).attr("data-state", "still");
      };

    });
  });
};

function getPoke(pokeUrl) {
  $.ajax({
    url: pokeUrl,
    method: "GET"
  }).then(function(response) {

    $("#pokeName-text").text(response.name.toUpperCase());

    var capitalizeType = response.types[0].type.name.charAt(0).toUpperCase() + response.types[0].type.name.slice(1);

    var pokeDetail = 
    {"Pokedex Number": response.id,
    "Type": capitalizeType, 
    "Weight": response.weight/10 + " kg", 
    "Height": response.height*10 + " cm",
    };

    $.each(pokeDetail, function(key, value) {
      var type = $("<li>");
      type.addClass("list-group-item");
      type.text(key + ": " + value);

      $("#detail-text").append(type);
    });
    
    for(var i=0; i<4; i++) {
      var list = $("<li>");
      list.addClass("list-group-item");
      list.text(response.stats[i].stat.name + ": " + response.stats[i].base_stat);

      $("#stat-text").append(list);
    }
  });
};


$(document).ready(function() {

  //Adding click function to all the elements with "topic-btn" class
$(document).on("click", ".topic-btn", displayTopicGif);

// Show buttons
renderButtons();

});

