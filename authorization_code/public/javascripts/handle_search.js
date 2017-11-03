/*
  Receives the JSON object generated
  from the search submission
 */
var results = JSON.parse(sessionStorage.getItem('search_results'));

function headers(){
    document.getElementById('head').innerText = "tracks";
    document.getElementById('headinfo').innerText = results.tracks.items.length + " songs";
}

function displayArtists(artists) {
   // console.log(artists[0].images[0].url);
    var menu = document.getElementById('scrollmenu');
    for(var i = 0; i < artists.length; i++) {
        if(artists[i].images[0]) {
            var img = document.createElement("img");
            img.src = artists[i].images[0].url;
            menu.appendChild(img);
        }
    }

}
headers();
displayTracks(results.tracks.items);
displayArtists(results.artists.items);