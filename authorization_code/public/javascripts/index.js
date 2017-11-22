/**
 * This js file contains all the javscript code necessary for index.html. A
 * skeleton of this code was provided by spotify as an example, but it has
 * been modified and added to. Handles login/logout and displays the side menu and search bar
 */
    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    // //user profile template
    var userProfileSource = document.getElementById('user-profile-template').innerHTML,
        userProfileTemplate = Handlebars.compile(userProfileSource),
        userProfilePlaceholder = document.getElementById('user-profile');

    //template for displaying oauth information, not currently used
    var oauthSource = document.getElementById('oauth-template').innerHTML,
        oauthTemplate = Handlebars.compile(oauthSource),
        oauthPlaceholder = document.getElementById('oauth');

    var params = getHashParams();   //the params from the url

    //the access token, refresh token, and error from params
    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;


    /**
       After the user has logged in, this method retrieves a list of the user's playlists.
       response contains the user information.
        @param response the user object
     */
    function getPlaylists (response) {
        var playlistLink =  'https://api.spotify.com/v1/users/' + response.id +'/playlists';
        addPlaylist(playlistLink);  //append each playlist to an unordered list
    }

    /**
       Appends each playlist to an unordered list "show_playlists"
       Accepts the url of the first playlist as a parameter
        @param url the url to access the users playlists
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
                var userID;
                //append each playlist to show_playlists
                for (var i = 0; i < list.items.length; i++) {
                    var playlistID = list.items[i].id;  //playlist id
                    userID = list.items[i].owner.id;    //the user id
                    var playlistName = list.items[i].name;
                    var playlistNameShort;  //shortened playlist name

                    //shortens long playlist names
                    if (playlistName.length > 19) {
                        var extra = (playlistName.length - 19) * -1;
                        playlistNameShort = playlistName.slice(0, extra) + "...";
                    }
                    else
                        playlistNameShort = playlistName;

                    //append playlists to unordered list
                    $('#show_playlists').append('<li><a id="' + playlistID + '" href="#">' + playlistNameShort + '</a></li>');

                    addPlaylistListener(playlistID, userID, playlistName);  //add listener

                }
            }
        });
    }

/**
 * Adds a listener to the playlist link that redirects the iframe
 * @param listID    the playlist id
 * @param userID    the user's id
 * @param playlistName  the playlist name
 */
function addPlaylistListener(listID, userID, playlistName) {
        (function () {
            var id = document.getElementById(listID);
            if (id) {
                id.addEventListener('click', function () {
                    //change iframe source to show the playlist's tracks
                    document.getElementById('mainPane').src = "playlist.html?userid=" + userID
                        + "&playlistid=" + listID + "&playlistname=" + playlistName;
                }, false);
            }
        }());
    }



    //if there is an error
    if (error) {
        alert('There was an error during the authentication');
    } else {    //otherwise, continue
        if (access_token) {     //if an access token is obtained, render the loggedin screen
            // render oauth info, currently unused
            oauthPlaceholder.innerHTML = oauthTemplate({
                access_token: access_token,
                refresh_token: refresh_token
            });

            //request user info
            $.ajax({
                url: 'https://api.spotify.com/v1/me/',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                    if(response.display_name == null)
                        response.display_name = response.id;
                    userProfilePlaceholder.innerHTML = userProfileTemplate(response);   //display user info

                    //add listeners
                    addLibTrackListener();
                    addLibAlbumListener();
                    addGlobalTopListener();
                    addCountryTopListener();
                    addLogoutListener();
                    getPlaylists(response); //retrieve playlists


                    //show the loggedin screen
                    $('#login').hide();
                    $('#loggedin').show();
                    //$('body').css("background", "black");
                }
            });

        } else {
            // render initial login screen
            $('#login').show();
            $('#loggedin').hide();
        }

        //refreshes the access token, currently unused
        var tokenbtn = document.getElementById('obtain-new-token');
        if (tokenbtn) {
            tokenbtn.addEventListener('click', function() {
                $.ajax({
                    url: '/refresh_token',
                    data: {
                        'refresh_token': refresh_token
                    }
                }).done(function(data) {
                    access_token = data.access_token;
                    oauthPlaceholder.innerHTML = oauthTemplate({
                        access_token: access_token,
                        refresh_token: refresh_token
                    });
                });
            }, false);
        }

        /**
         * changes the iframe window to display the songs in the user's music library.
         */
        function addLibTrackListener () {
            var libraryTracks = document.getElementById('libraryTracks');
            console.log(libraryTracks);
            if (libraryTracks) {
                libraryTracks.addEventListener('click', function () {
                    document.getElementById('mainPane').src = "libraryTracks.html";
                }, false);
            }
        }

        /**
         * changes the iframe window to display the albums in the user's music library.
         */
        function addLibAlbumListener () {
            var libraryAlbums = document.getElementById('libraryAlbums');
            console.log(libraryAlbums);
            if (libraryAlbums) {
                libraryAlbums.addEventListener('click', function () {
                    document.getElementById('mainPane').src = "libraryAlbums.html";
                }, false);
            }
        }

        /**
         * changes the iframe window to display the global top 50.
         */
        function addGlobalTopListener () {
            var globalTop = document.getElementById('global-top');
            console.log(globalTop);
            if (globalTop) {
                globalTop.addEventListener('click', function () {
                    document.getElementById('mainPane').src = "popular.html?global=true";
                }, false);
            }
        }

        /**
         * changes the iframe window to display the country top 50.
         */
        function addCountryTopListener () {
            var countryTop = document.getElementById('us-top');
            if (countryTop) {
                countryTop.addEventListener('click', function () {
                    document.getElementById('mainPane').src = "popular.html?global=false";
                }, false);
            }
        }

        /**
         * returns the user to the login screen to re-approve the application or login as someone else
         */
        function addLogoutListener() {
            var logoutbtn = document.getElementById('logout');
            if (logoutbtn) {
                logoutbtn.addEventListener('click', function() {
                    $('#login').show();
                    $('#loggedin').hide();
                }, false);
            }
        }

    }

