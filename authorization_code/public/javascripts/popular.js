/**
 * This file pulls the global and US top 50 tracks from the spotify api
 * and displays them.
 */
var access_token = localStorage.getItem('access');
var url = document.location.href;
var paramList = url.split('?')[1].split('&');
var param = paramList[0].split('=')[1];    //whether global or not

if (param === 'true') { //if global
    document.getElementById('head').innerText = 'Global Top 50';
    $.ajax({    //get top 50 global
        url: 'https://api.spotify.com/v1/users/spotifycharts/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (tracks) {
            document.getElementById('headinfo').innerText = "Playlist - " + tracks.items.length + " songs";
            var trackList = new Array(0);
            for (var i = 0; i < tracks.items.length; i++) { //add track object to list from playlist track object
                trackList.push(tracks.items[i].track);
            }
            displayTracks(trackList);
        }
    });
} else {    //otherwise, show top US
    document.getElementById('head').innerText = 'US Top 50';
    $.ajax({
        url: 'https://api.spotify.com/v1/users/spotifycharts/playlists/37i9dQZEVXbLRQDuF5jeBp/tracks',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (tracks) {
            document.getElementById('headinfo').innerText = "Playlist - " + tracks.items.length + " songs";
            var trackList = new Array(0);
            for (var i = 0; i < tracks.items.length; i++) { //add track object to list from playlist track object
                trackList.push(tracks.items[i].track);
            }
            displayTracks(trackList);
        }
    });
}


