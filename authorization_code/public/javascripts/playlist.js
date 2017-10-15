function getParams() {
    var url = document.location.href;
    var paramList = url.split('?')[1].split('&');
    var userID = paramList[0].split('=')[1];
    var playlistID = paramList[1].split('=')[1];
    var trackURL = 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks';
    showTracks(trackURL);
}

function showTracks(url) {
    if (url === null) {
        return;
    }
    alert('hi');
    $.ajax({    //get track info
        url: url,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (tracks) {
            for (var i = 0; i < tracks.items.length; i++) {
                alert(i);
                $('#show_tracks').append('<li><a href="#">HI</a></li>')
            }
            showTracks(tracks.next);
        }
    });
    alert('hi');
}