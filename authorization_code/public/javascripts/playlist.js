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
            for (var i = 0; i < tracks.items.length; i++) {
                var trck = tracks.items[i].track;
                $('#show_tracks').append('<li>'+ trck.name + '</li>')   //append each track to a list
            }
            showTracks(tracks.next);    //move on to next url, if there is one
        }
    });
}