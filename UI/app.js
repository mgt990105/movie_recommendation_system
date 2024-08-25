const submitForm = document.getElementById("movieForm");
const recommendationResults = document.getElementById("recommendation");
const recommendationText = document.getElementById("recommendation-text");
const resultsSection = document.getElementById("results");
const inputMovie = document.getElementById("input-movie");
const distanceExplainer = document.getElementById("distance-explainer");

function outputMovies(event) {
  event.preventDefault();
  var formData = new FormData(this);
  var xhr = new XMLHttpRequest();
  // xhr.open("POST", "http://localhost:5001/recommend_movie"); //testing out
  xhr.open("POST", "/api/recommend_movie");
  xhr.onload = function () {
    var response = JSON.parse(xhr.responseText);
    console.log(response);
    console.log(typeof response);
    if (response === "No Results") {
      distanceExplainer.style.display = "none";
      recommendationResults.style.display = "none";
      inputMovie.style.display = "none";
      resultsSection.style.display = "block";
      resultsSection.style.color = "#5c4bdb";
      recommendationText.style.marginTop = "50px";

      recommendationText.innerHTML =
        "<h2> Oops! There are no recommendations for this movie at the moment</h2>";
      return;
    }

    // console.log(response);
    // The .sort() method is used to sort the elements of the array. By default, .sort() sorts elements as strings.
    // However, here it is passed a custom comparison function to sort the keys based on their associated values

    // response[a] and response[b]: These expressions access the values associated with the keys a and b in the response object.
    // parseFloat(response[a]) and parseFloat(response[b]): The parseFloat() function is used to convert the string values (like "10", "5", "8") into floating-point numbers for accurate numerical comparison
    // If response[a] is smaller than response[b], the result is negative, meaning a should be sorted before b.
    var sortedKeys = Object.keys(response).sort(function (a, b) {
      return parseFloat(response[a]) - parseFloat(response[b]);
    });
    // console.log(response);
    // console.log(sortedKeys);

    recommendationText.innerHTML = "";
    recommendationResults.innerHTML = "";

    distanceExplainer.style.display = "block";
    recommendationResults.style.display = "grid";
    inputMovie.style.display = "block";
    resultsSection.style.display = "block";
    resultsSection.style.color = "black";

    resultsSection.scrollIntoView({
      behavior: "smooth",
    });

    inputMovie.innerHTML =
      "<img src='images/movie-posters/" +
      sortedKeys[0].toLowerCase().replace(/ /g, "_") +
      ".jpg'>";

    recommendationText.innerHTML =
      "<h2> Recommendations for " +
      "<span>" +
      sortedKeys[0] +
      "</span>" +
      "</h2>";

    // console.log(sortedKeys.keys);;

    for (let i = 1; i < 11; i++) {
      // Get the movie title from sortedKeys[i]
      let movieTitle = sortedKeys[i];

      // Get the distance value from the response object
      let distance = response[movieTitle];

      // Convert movieTitle to lowercase and replace spaces with underscores for the image path
      let movieFileName = movieTitle.toLowerCase().replace(/ /g, "_");

      // Construct the list item with the dynamic image path and separated spans
      recommendationResults.innerHTML +=
        "<li>" +
        "<img src='images/movie-posters/" +
        movieFileName +
        ".jpg'>" +
        "<span>" +
        movieTitle +
        "</span>" +
        "<span>Distance: " +
        distance +
        "</span>" +
        "</li>";
    }

    // for (var movieIndex in sortedKeys) {
    //   recommendationResults.innerHTML +=
    //     "<li>" +
    //     sortedKeys[movieIndex] +
    //     " - " +
    //     response[sortedKeys[movieIndex]] +
    //     "</li>";
    // }

    // sortedKeys.forEach(function (movie) {
    //   recommendationHTML.innerHTML +=
    //     "<li>" + movie + " - " + response[movie] + "</li>";
    // });
  };
  xhr.send(formData);
}
submitForm.addEventListener("submit", outputMovies);
