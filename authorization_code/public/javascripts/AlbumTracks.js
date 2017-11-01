/**
 *This file displays the tracks in an album.
 **/
var access_token = localStorage.getItem('access');

var url = document.location.href;
var paramList = url.split('?')[1].split('&');
var albumID = paramList[0].split('=')[1];
var albumName = paramList[1].split('=')[1];

//If the playlist name has a space, it will display '%20' by default. This fixes it.
var name ="";
var words = albumName.split('%20');
for (var k = 0; k < words.length; k++) {
    name += words[k] + " ";
}

document.getElementById('head').innerText = name;   //write playlist name to the head text

$.ajax({    //get track info
    url: 'https://api.spotify.com/v1/albums/' + albumID + '/tracks',
    headers: {
        'Authorization': 'Bearer ' + access_token
    },
    success: function (tracks) {
        document.getElementById('headinfo').innerText = "Album - " + tracks.items.length + " songs";
        var trackList = new Array(0);
        for (var i = 0; i < tracks.items.length; i++) {
            trackList.push(tracks.items[i]);
        }

        // console.log(trackList[0].name);
        displayTracks(trackList);
    }
});
