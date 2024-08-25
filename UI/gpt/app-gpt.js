document
  .getElementById("movieForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var formData = new FormData(this);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/recommend_movie");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        var sortedKeys = Object.keys(response).sort(function (a, b) {
          return parseFloat(response[a]) - parseFloat(response[b]);
        });
        var recommendationHTML = "<h2>Recommendations:</h2><ul>";
        sortedKeys.forEach(function (movie) {
          recommendationHTML +=
            "<li>" + movie + " - " + response[movie] + "</li>";
        });
        recommendationHTML += "</ul>";
        document.getElementById("recommendation").innerHTML =
          recommendationHTML;
      } else {
        console.error("Request failed. Status:", xhr.status);
      }
    };
    xhr.send(formData);
  });
