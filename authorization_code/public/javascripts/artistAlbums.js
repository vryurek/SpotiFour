/**
 *This file displays the albums by an artist.
 **/
var access_token = localStorage.getItem('access');

var url = document.location.href;
var paramList = url.split('?')[1].split('&');
var artistID = paramList[0].split('=')[1];
var artistName = decodeURIComponent(paramList[1].split('=')[1]);

document.getElementById('head').innerText = artistName;   //write artist name to the head text

$.ajax ({
    url: 'https://api.spotify.com/v1/artists/' + artistID + '/albums?limit=50',
    headers: {
        'Authorization': 'Bearer ' + access_token
    },
    success: function (albums) {
        var listSize = albums.items.length;
        document.getElementById('headinfo').innerText = "Artist - " + listSize + " albums";
        var albumList = document.getElementById('show_tracks');

        for (var i = 0; i < listSize; i++) {
            var albm = albums.items[i];
            var tmpl = document.getElementById('album-template').content.cloneNode(true);

            tmpl.querySelector('.album-cover').src = albm.images[0].url;

            //write track name to the template
            tmpl.querySelector('.album-title').innerText = albm.name;
            tmpl.querySelector('.album-title').id = i.toString();  //add id for listener


            albumList.appendChild(tmpl);   //write template to html

            addAlbumListener(albm.id, albm.name, albm.artists[0].name, i.toString());

        }
    }
});
