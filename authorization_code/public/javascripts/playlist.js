/*This file displays the tracks from a playlist*/

var access_token = localStorage.getItem('access');      //retrieve the access token

/**
 * parses the url to retrieve the userID and playlist id as parameters
 */
function getParams() {
    var url = document.location.href;
    var paramList = url.split('?')[1].split('&');
    var userID = paramList[0].split('=')[1];
    var playlistID = paramList[1].split('=')[1];
    var playlistName = paramList[2].split('=')[1];

    //If the playlist name has a space, it will display '%20' by default. This fixes it.
    var name ="";
    var words = playlistName.split('%20');
    for (var k = 0; k < words.length; k++) {
        name += words[k] + " ";
    }

    document.getElementById('head').innerText = name;   //write playlist name to the head text

    //the path to get tracks from a playlist
    var trackURL = 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks';
    showTracks(trackURL);   //get the tracks from a playlist

}

/**
 * retrieve and show the tracks in a playlist
 */
function showTracks(url) {
    if (url === null) { //return if the url is null
        return;
    }
    $.ajax({    //get track info
        url: url,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (tracks) {
            var tracksList = document.getElementById('show_tracks');
            var listSize = tracks.items.length;
            //write number of songs to the header text
            document.getElementById('headinfo').innerText = "Playlist - " + listSize + " songs";

            for (var i = 0; i < listSize; i++) {
                    var trck = tracks.items[i].track;
                    var tmpl = document.getElementById('track-template').content.cloneNode(true);
                    //var artistTmpl = document.getElementById('artistList-template').content.cloneNode(true);

                    //shortens long track names
                    var trackName = trck.name;
                    if (trackName.length > 50) {
                        var extra = (trackName.length - 50) * -1
                        trackName = trackName.slice(0, extra) + "...";
                    }
                    //write track name to the template
                    tmpl.querySelector('.track-title').innerText = trackName;

                    /*code that gets all artists, not working*/
                    // var artistList = trck.artists;
                    // for (var j = 0; j < artistList.length; j++) {
                    //     //alert(artistList[j].name);
                    //
                    //     artistTmpl.querySelector('.artistList-artist').innerText = artistList[j].name;
                    //     artistTmpl.querySelector('.artistList-artist').id = artistList[j].id;
                    //     //tmpl.querySelector('.track-artist').appendChild(artistTmpl);
                    // }
                    //tmpl.querySelector('.track-artist').appendChild(artistTmpl);

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

                    tmpl.querySelector('.track-album').id = trck.album.id;  //add id for listener
                    tmpl.querySelector('.playbtn').id = trck.uri;   //add is for listener
                    tracksList.appendChild(tmpl);   //write template to html

                    addAlbumListener(trck.album.id);    //add listener to album
                    addPlayListener(trck.uri);          //add listener to play button

            }
            showTracks(tracks.next);    //move on to next url, if there is one
        }
    });
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

                    //revert all the buttons back to unselected play buttons
                    var btns = document.getElementsByClassName('playbtn');
                    for (var j = 0; j < btns.length; j++) {
                        btns[j].src = "images/play-icon.png";
                    }
                    //change clicked button to pause button
                    id.src = "images/pause-icon.png";
                } else {
                    id.src = "images/play-icon-hover.png";
                }

            }, false);
        }
    }());
}