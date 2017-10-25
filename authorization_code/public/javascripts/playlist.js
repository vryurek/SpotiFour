var access_token = localStorage.getItem('access');
var user = localStorage.getItem('user');
alert(user.id);
if (access_token) {
    //getPlaylists(user);
}

/**
 After the user has logged in, this method retrieves a list of the user's playlists.
 response contains the user information.
 */
function getPlaylists (response) {
    var playlistLink =  'https://api.spotify.com/v1/users/' + response.id +'/playlists';
    addPlaylist(playlistLink);  //append each playlist to an unordered list
}

/**
 Appends each playlist to an unordered list "show_playlists"
 Accepts the url of the first playlist as a parameter
 */
function addPlaylist(url) {
    if (url === null) { //if the url is null, return
        return;
    }

    $.ajax({    //get playlist info
        url: url,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(list) {
            //append each playlist to show_playlists
            for (var i = 0; i < list.items.length; i++) {
                $('#show_playlists').append('<li><a href="playlist.html?userid=' +
                    list.items[i].owner.id + '&playlistid=' + list.items[i].id +
                    '">' + list.items[i].name + '</a></li>')


            }
            addPlaylist(list.next); //move on to the next playlist, if there is one
        }
    });
}