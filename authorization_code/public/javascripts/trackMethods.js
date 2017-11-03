function displayTracks(tracks) {
    var tracksList = document.getElementById('show_tracks');
    var listSize = tracks.length;

    for (var i = 0; i < listSize; i++) {
        var trck = tracks[i];
        console.log(tracks[0].name);
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

        addAlbumListener(trck.album.id, trck.album.name);    //add listener to album
        addPlayListener(trck.uri);          //add listener to play button

    }
}

/**
 * adds an event listener to album to change the iframe to show
 * a list of tracks in the album
 * @param albumID the album id
 * @param albumName the album name
 */
function addAlbumListener(albumID, albumName) {
    (function () {
        var id = document.getElementById(albumID);  //get element
        if (id) {
            id.addEventListener('click', function () {
                parent.document.getElementById('mainPane').src = "AlbumTracks.html?albumid="
                    + albumID + "&albumName=" + albumName;
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

                    parent.document.getElementById('spotify-player').src = 'https://open.spotify.com/embed?uri=' + uri;
                    $.ajax({
                        url: 'https://api.spotify.com/v1/me/player/play',
                        headers: {
                            'Authorization': 'Bearer ' + access_token
                        },
                        type: 'PUT',
                        data: '{"uris": ["' + uri + '"]}',
                        success: function(data) {
                            //alert('Load was performed.');
                        }
                    });
                } else {
                    id.src = "images/play-icon-hover.png";
                    $.ajax({
                        url: 'https://api.spotify.com/v1/me/player/pause',
                        headers: {
                            'Authorization': 'Bearer ' + access_token
                        },
                        type: 'PUT',
                        success: function(data) {
                            //alert('Load was performed.');
                        }
                    });

                }

            }, false);
        }
    }());
}