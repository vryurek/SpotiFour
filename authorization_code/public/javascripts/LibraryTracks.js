/**
 *This file displays up to 250 tracks in the user's Music Library
 **/
var access_token = localStorage.getItem('access');
var num = 0;    //number of tracks

//max amount of tracks you can query from spotify is 50, so loop
//in order to get more than 50.
for (var j = 0; j < 5; j++) {
    (function () {
        $.ajax({    //get track info
            url: 'https://api.spotify.com/v1/me/tracks?offset=' + (j * 50) + '&limit=50',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (tracks) {
                num += tracks.items.length;
                document.getElementById('headinfo').innerText = num + " songs";

                //get array of track objects from array of saved track objects
                var trackList = new Array(0);
                for (var i = 0; i < tracks.items.length; i++) {
                    trackList.push(tracks.items[i].track);
                }
                displayTracks(trackList);   //display track list

            }
        });
    })()

}

