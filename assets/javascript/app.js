var topics = ["arsenal", "liverpool"];

//Buttons for initial example in array
function renderButtons() {
  $("#add-button").empty();

  for (var index = 0; index < topics.length; index++) {
    var displayButton = $("<button>");
    displayButton.addClass("mr-2 mb-2");
    displayButton.attr("data-name", topics[index]);
    displayButton.text(topics[index]);
    $("#add-button").append(displayButton);
  }

  $("#add-button>button").on("click", showGif());
}

//Get value from the input field
$("#submit-button").on("click", function() {
  event.preventDefault();

  var getValue = $("#topic-input")
    .val()
    .trim();

  $(".topic-form").trigger("reset");

  topics.push(getValue.toLowerCase());
  console.log(topics);

  renderButtons();
});

//Show buttons
renderButtons();

function showGif() {
  var gifTopic = $(this).attr("data-name");

  console.log("this", this);
  console.log("gifTopic", gifTopic);

  var gifUrl = getURL(gifTopic);
  console.log(gifUrl);

  getGif(gifUrl);
};

//Return URL
function getURL(gifTopic) {
  return (
    "https://api.giphy.com/v1/gifs/search?api_key=xlwTlWsHjqOnoRq5SnOLVMHw75qxIX2k&q=" +
    gifTopic
  );
}

//Get button value when clicked
function getGif(gifUrl) {
  $.ajax({
    url: gifUrl,
    method: "GET"
  }).then(function(response) {
    // console.log(gifUrl);
    // console.log(response.data[0].images.fixed_height.url);

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
      displayImg.attr("src", response.data[count].images.original.url);

      displayRating.text(
        "Rating: " + response.data[count].rating.toUpperCase()
      );
      displayRating.addClass("text-light mb-1");

      displayDiv.append(displayRating);
      displayDiv.append(displayImg);

      $("#add-gif>div:last").append(displayDiv);
    }
  });
}
