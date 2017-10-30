/*
  Receives the JSON object generated
  from the search submission
 */
var results = JSON.parse(sessionStorage.getItem('search_results'));

/*
    Takes the JSON object and displays the
    search results as a list. Currently only
    displays eight albums and eight artists
 */
function displayResults(res) {
    //albums
    document.getElementById('head').innerText = "Tracks";

    var tracksList = document.getElementById('show_tracks');
    var listSize = results.tracks.items.length;

    for (var i = 0; i < listSize; i++) {
        var trck = results.tracks.items[i];
        var tmpl = document.getElementById('track-template').content.cloneNode(true);

        //shortens long track names
        var trackName = trck.name;
        if (trackName.length > 50) {
            var extra = (trackName.length - 50) * -1
            trackName = trackName.slice(0, extra) + "...";
        }

        //write track name to the template
        tmpl.querySelector('.track-title').innerText = trackName;

        //shortens long artist name
        var artistName = trck.artists[0].name;  //get the first artist
        if (artistName.length > 25) {
            var ex = (artistName.length - 25) * -1
            artistName = artistName.slice(0, ex) + "...";
        }
        tmpl.querySelector('.track-artist').innerText = artistName; //write to html

        //shortens long album names
        var albumName = trck.album.name;
        if (albumName.length > 30) {
            var ext = (albumName.length - 30) * -1
            albumName = albumName.slice(0, ext) + "...";
        }
        //write to html
        tmpl.querySelector('.track-album').innerText = albumName;

        addAlbumListener(trck.album.id);    //add listener to album
        addPlayListener(trck.uri);          //add listener to play button

        tracksList.appendChild(tmpl);   //write template to html

        tmpl.querySelector('.track-album').id = trck.album.id;  //add id for listener
        tmpl.querySelector('.playbtn').id = trck.uri;   //add is for listener


    }


}

/**
 * adds an event listener to album to change the iframe to show
 * a list of tracks in the album
 * @param albumID the album id
 */
function addAlbumListener(albumID) {
    (function () {
        var id = document.getElementById(albumID);  //get element
        if (id) {
            id.addEventListener('click', function () {
                parent.document.getElementById('mainPane').src = "album.html?albumid="
                    + albumID;
            }, false);
        }
    }());
}

/**
 * adds event listeners to the play button so that the image will
 * change on hover and click.
 * @param uri   track uri, for playing music later, also acts as an id
 */
function addPlayListener(uri) {
    (function () {
        var id = document.getElementById(uri);
        if (id) {
            id.addEventListener('mouseover', function () {
                if (id.src === 'http://localhost:8888/images/play-icon.png' ) {
                    id.src = "images/play-icon-hover.png";
                }
            }, false);

            id.addEventListener('mouseout', function () {
                if (id.src === 'http://localhost:8888/images/play-icon-hover.png' ) {
                    id.src = "images/play-icon.png";
                }
            }, false);

            id.addEventListener('click', function () {
                if (id.src === ('http://localhost:8888/images/play-icon-hover.png')) {
                    id.src = "images/pause-icon.png";
                } else {
                    id.src = "images/play-icon-hover.png";
                }

            }, false);
        }
    }());
}

displayResults(results);