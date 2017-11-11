/**
 * this file display up to 50 of the user's saved albums.
 */
var access_token = localStorage.getItem('access');

//get library albums
$.ajax ({
    url: 'https://api.spotify.com/v1/me/albums?offset=0&limit=50',
    headers: {
        'Authorization': 'Bearer ' + access_token
    },
    success: function (albums) {
        var albumsList = document.getElementById('library_albums'); //the list of albums
        var listSize = albums.items.length;
        //write the number of albums to the header
        document.getElementById('headinfo').innerText = listSize + " albums";

        for (var i = 0; i < listSize; i++) {
            var albm = albums.items[i].album;   //get album object from saved album object

            var tmpl = document.getElementById('library-album-template').content.cloneNode(true);

            //add the cover art, album title, and artist name to the html
            tmpl.querySelector('.library-album-cover').src = albm.images[0].url;
            tmpl.querySelector('.album-title').innerText = albm.name;
            tmpl.querySelector('.artist-title').innerText = albm.artists[0].name;

            tmpl.querySelector('.album-title').id = i.toString();  //add id for listener
            tmpl.querySelector('.artist-title').id = albm.artists[0].id + "" + i; //add id for listener

            albumsList.appendChild(tmpl);

            //add listeners
            addAlbumListener(albm.id, albm.name, albm.artists[0].name, i.toString());    //add listener to album
            addArtistListener(albm.artists[0].name, albm.artists[0].id, albm.artists[0].id + "" + i);    //add listener to artist

            //add a break in the list if there are four albums on one line.
            if (i > 0 && (((i + 1) % 4) === 0)) {
                $(albumsList).append('<br>');
            }
        }
    }
});