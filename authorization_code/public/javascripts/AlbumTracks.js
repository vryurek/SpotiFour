/**
 *This file displays the tracks in an album in a list format,
 * including the track title, time, and lyrics.
 **/
var access_token = localStorage.getItem('access');  //get access token

var url = document.location.href;
var paramList = url.split('?')[1].split('&');
var albumID = paramList[0].split('=')[1];   //the album id
var albumName = decodeURIComponent(paramList[1].split('=')[1]); //the name of the album
var artistName = decodeURIComponent(paramList[2].split('=')[1]);    //the name of the artist

document.getElementById('head').innerText = albumName;   //write album name to the head text

$.ajax({    //get track info
    url: 'https://api.spotify.com/v1/albums/' + albumID + '/tracks?limit=50',
    headers: {
        'Authorization': 'Bearer ' + access_token
    },
    success: function (tracks) {
        //write the artist name and number of tracks to the header
        document.getElementById('headinfo').innerText = "Album by " + artistName + " - " + tracks.items.length + " songs";
        var tracksList = document.getElementById('show_tracks');    //where to append the list
        var listSize = tracks.items.length; //the number of tracks

        for (var i = 0; i < listSize; i++) {
            var trck = tracks.items[i];
            var tmpl = document.getElementById('track-template').content.cloneNode(true);   //get template

            //shortens long track names
            var trackName = trck.name;
            if (trackName.length > 100) {
                var extra = (trackName.length - 100) * -1;
                trackName = trackName.slice(0, extra) + "...";
            }

            //write track name to the template
            tmpl.querySelector('.track-title').innerText = trackName;
            tmpl.querySelector('.playbtn').id = trck.uri;   //add id for listener

            //get duration of the track
            tmpl.querySelector('.cell3').innerText = getDuration(trck.duration_ms);

            tmpl.querySelector('.track-lyric').id = "lyric" + "" + i.toString() + "" + i.toString();
            tmpl.querySelector('.lyric-drop').id = i.toString() + "" + "lyric";

            tracksList.appendChild(tmpl);   //write template to html
            addPlayListener(trck.uri);          //add listener to play button
            addLyricListener("lyric" + "" + i.toString() + "" + i.toString(), i.toString() + "" + "lyric", trackName, artistName);

        }


    }
});
