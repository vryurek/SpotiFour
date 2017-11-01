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
            document.getElementById('headinfo').innerText = "Playlist - " + tracks.items.length + " songs";
            var trackList = new Array(0);
            for (var i = 0; i < tracks.items.length; i++) {
                trackList.push(tracks.items[i].track);
            }
            displayTracks(trackList);
        }
    });
}
