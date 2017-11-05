/**
 * this function displays tracks in a list format
 * @param tracks    an array of track objects
 */
function displayTracks(tracks) {
    var tracksList = document.getElementById('show_tracks');
    var listSize = tracks.length;

    for (var i = 0; i < listSize; i++) {
        var trck = tracks[i]; //current track
        var tmpl = document.getElementById('track-template').content.cloneNode(true);
        //var artistTmpl = document.getElementById('artistList-template').content.cloneNode(true);

        //shortens long track names
        var trackName = trck.name;
        if (trackName.length > 35) {
            var extra = (trackName.length - 35) * -1;
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
            var ex = (artistName.length - 25) * -1;
            artistName = artistName.slice(0, ex) + "...";
        }
        tmpl.querySelector('.track-artist').innerText = artistName; //write to html

        //shortens long album names
        var albumName = trck.album.name;
        if (albumName.length > 25) {
            var ext = (albumName.length - 25) * -1;
            albumName = albumName.slice(0, ext) + "...";
        }

        //write to html
        tmpl.querySelector('.track-album').innerText = albumName;
        tmpl.querySelector('.cell3').innerText = getDuration(trck.duration_ms);

        tmpl.querySelector('.track-album').id = i.toString();  //add id for listener
        tmpl.querySelector('.track-artist').id = trck.artists[0].id + "" + i; //add id for listener
        tmpl.querySelector('.playbtn').id = trck.uri;   //add id for listener
        tracksList.appendChild(tmpl);   //write template to html

        addAlbumListener(trck.album.id, trck.album.name, trck.artists[0].name, i.toString());    //add listener to album
        addArtistListener(trck.artists[0].name, trck.artists[0].id, trck.artists[0].id + "" + i);    //add listener to album
        addPlayListener(trck.uri);          //add listeners to play button

    }
}

/**
 * adds an event listener to album to change the iframe to show
 * a list of tracks in the album
 * @param albumID the album id
 * @param albumName the album name
 * @param artistName the artist name
 * @param num the id of the album element
 */
function addAlbumListener(albumID, albumName, artistName, num) {
    (function () {
        var id = document.getElementById(num);  //get element
        if (id) {
            id.addEventListener('click', function () {
                parent.document.getElementById('mainPane').src = "AlbumTracks.html?albumid="
                    + albumID + "&albumName=" + albumName + "&artistName=" + artistName;
            }, false);
        }
    }());
}

/**
 * adds an event listener to artist to change the iframe to show
 * a list of albums of the artist
 * @param artistID the artist id
 * @param artistName the artist name
 * @param num the id of the album element
 */
function addArtistListener(artistName, artistID, num) {
    (function () {
        var id = document.getElementById(num);  //get element
        if (id) {
            id.addEventListener('click', function () {
                parent.document.getElementById('mainPane').src = "artistAlbums.html?artistid="
                    + artistID + "&artistName=" + artistName;
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
                    id.src = "images/play-icon-hover.png";  //hover icon
                }
            }, false);

            id.addEventListener('mouseout', function () {
                if (id.src === 'http://localhost:8888/images/play-icon-hover.png' ) {
                    id.src = "images/play-icon.png";    //non-hover icon
                }
            }, false);

            id.addEventListener('click', function () {
                //play
                if (id.src === ('http://localhost:8888/images/play-icon-hover.png')) {

                    //revert all the buttons back to unselected play buttons
                    var btns = document.getElementsByClassName('playbtn');
                    for (var j = 0; j < btns.length; j++) {
                        btns[j].src = "images/play-icon.png";
                    }
                    //change clicked button to pause button
                    id.src = "images/pause-icon.png";

                    //change iframe source to track uri
                    parent.document.getElementById('spotify-player').src = 'https://open.spotify.com/embed?uri=' + uri;

                    $.ajax({    //get currently playing track
                        url: 'https://api.spotify.com/v1/me/player/currently-playing',
                        headers: {
                            'Authorization': 'Bearer ' + access_token
                        },
                        success: function(response) {
                            //if the currently playing track matches the track uri, resume
                            if (response.item.uri.toString() === uri.toString()) {
                                $.ajax({
                                    url: 'https://api.spotify.com/v1/me/player/play',
                                    headers: {
                                        'Authorization': 'Bearer ' + access_token
                                    },
                                    type: 'PUT',
                                    success: function(data) {
                                        //alert('Load was performed.');
                                    }
                                });
                            } else {    //otherwise, play song from beginning.
                                $.ajax({
                                    url: 'https://api.spotify.com/v1/me/player/play',
                                    headers: {
                                        'Authorization': 'Bearer ' + access_token
                                    },
                                    type: 'PUT',
                                    data: '{"uris": ["' + uri + '"]}',
                                    success: function(data) {
                                    }
                                });
                            }
                        }
                    });


                } else {    //pause
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

/**
 *This function returns the duration of the song in minutes:seconds
 *when given the time in milliseconds
 * @param time the duration of the track in ms
 * @return string the duration in minutes:seconds
 **/
function getDuration(time) {
    var minutes = Math.floor(time / 60000);
    var seconds = ((time % 60000) / 1000).toFixed(0);
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return minutes + ":" + seconds;
}