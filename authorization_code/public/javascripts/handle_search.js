/**
  Receives the JSON object generated
  from the search submission and displays
 */
var results = JSON.parse(sessionStorage.getItem('search_results')); //get search results

/**
 * sets the header texts to list the number of tracks, artists, and albums
 */
function headers(){
    document.getElementById('headinfo').innerText = results.tracks.items.length + " songs";
    document.getElementById('artistsinfo').innerText = results.artists.items.length + " artists";
    document.getElementById('albumsinfo').innerText = results.albums.items.length + " albums";
}

/**
 * Displays the artists in a horizontal scroll
 * @param artists the list of artists
 */
function displayArtists(artists) {

    var menu = document.getElementById('show_artists'); //list of artists
    for(var i = 0; i < artists.length; i++) {
        if(artists[i].images[0]) {
            var artist = results.artists.items[i];
            var tmpl = document.getElementById('artist-template').content.cloneNode(true);
            tmpl.querySelector(".artist-image").src =  artists[i].images[0].url;    //set source of artist image
            tmpl.querySelector(".artist-title").innerText = artist.name;    //write artist name
            tmpl.querySelector(".artist-title").id = artist.id + "" + i.toString(); //set id for listener

            menu.appendChild(tmpl);

            addArtistListener(artist.name, artist.id, artist.id + "" + i.toString());    //add listener to artist
        }
    }

}

/**
 * Displays the albums in a horizontal scroll
 * @param albums the list of albums
 */
function displayAlbums(albums) {
    // console.log(artists[0].images[0].url);
    var menu = document.getElementById('show_albums');
    for(var i = 0; i < albums.length; i++) {
        if(albums[i].images[0]) {
            var album = results.albums.items[i];
            var tmpl = document.getElementById('album-template').content.cloneNode(true);
            tmpl.querySelector(".album-image").src =  albums[i].images[0].url;  //set album image
            tmpl.querySelector(".album-title").innerText = album.name;  //album name
            tmpl.querySelector(".artist-title").innerText = album.artists[0].name;  //artist name
            tmpl.querySelector(".artist-title").id = album.artists[0].id + "" + i.toString() + "" + i.toString();   //set id
            tmpl.querySelector(".album-title").id = i.toString() + "" + i.toString(); //set id

            menu.appendChild(tmpl);

            addAlbumListener(album.id, album.name, album.artists[0].name, i.toString() + "" + i.toString()); //add album listener
            addArtistListener(album.artists[0].name, album.artists[0].id, album.artists[0].id + "" + i.toString() + "" + i.toString());//add listener to artist
        }
    }

}
headers();
displayTracks(results.tracks.items);
displayArtists(results.artists.items);
displayAlbums(results.albums.items);