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

    var userProfileSource = document.getElementById('user-profile-template').innerHTML,
        userProfileTemplate = Handlebars.compile(userProfileSource),
        userProfilePlaceholder = document.getElementById('user-profile');

    var oauthSource = document.getElementById('oauth-template').innerHTML,
        oauthTemplate = Handlebars.compile(oauthSource),
        oauthPlaceholder = document.getElementById('oauth');

    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;
    /*
       After the user has logged in, this method retrieves a list of the user's playlists.
       response contains the user information.
     */
    function getPlaylists (response) {
        var playlistLink =  'https://api.spotify.com/v1/users/' + response.id +'/playlists';
        addPlaylist(playlistLink);  //append each playlist to an unordered list
    }

    /*
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
                        list.items[i].owner.id + '&playlistid=' + list.items[i].id + '&refresh=' + refresh_token +
                        '">' + list.items[i].name + '</a></li>')

                }
                addPlaylist(list.next); //move on to the next playlist
            }
        });
    }

    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {
            // render oauth info
            oauthPlaceholder.innerHTML = oauthTemplate({
                access_token: access_token,
                refresh_token: refresh_token
            });

            $.ajax({
                url: 'https://api.spotify.com/v1/me/',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                    userProfilePlaceholder.innerHTML = userProfileTemplate(response);
                    getPlaylists(response); //retrieve playlists

                    $('#login').hide();
                    $('#loggedin').show();


                }
            });

        } else {
            // render initial screen
            $('#login').show();
            $('#loggedin').hide();
        }

        document.getElementById('obtain-new-token').addEventListener('click', function() {
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

        document.getElementById('logout').addEventListener('click', function() {
            $('#login').show();
            $('#loggedin').hide();

        }, false);
    }

