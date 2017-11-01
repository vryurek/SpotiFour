/**
 *This file displays all the tracks in the user's Music Library
 **/
var access_token = localStorage.getItem('access');

$.ajax({    //get track info
    url: 'https://api.spotify.com/v1/me/tracks',
    headers: {
        'Authorization': 'Bearer ' + access_token
    },
    success: function (tracks) {
        document.getElementById('headinfo').innerText = tracks.items.length + " songs";
        var trackList = new Array(0);
        for (var i = 0; i < tracks.items.length; i++) {
            trackList.push(tracks.items[i].track);
        }
        displayTracks(trackList);
    }
});