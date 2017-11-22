/**
 * This file takes a query from the search bar and retrieves a
 * search results object from the api
 */
//Access token for spotify requests
var access_token;
window.onload = function() {
    access_token = localStorage.getItem('access');
};

/**
 Generates a url for the GET request given a search
 query and fields. Still need to add a lot of
 search customization
 @param query the query from the search bar
 @param fields the criteria to search for (albums, artists, and tracks)
 */
function createSearchUrl(query, fields){
    if(query === null) return;
    var words = query.split(" ");
    var url = "https://api.spotify.com/v1/search";
    url += "?q=";
    for(var i = 0; i < words.length; i++){
        url += words[i];
        if(i != words.length - 1) url += "%20";
    }

    url += "&type="
    for (var i = 0; i < fields.length; i++){
        url += fields[i];
        if(i != fields.length - 1) url += ",";
    }

    url += "&limit=20";
    return url;
}

/**
Completes an Ajax request given a url and stores the results
to the webpage
 @param url the request url
 */
function sendSearch(url){
    $.ajax({
        url: url,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (results) {
            sessionStorage.clear();
            sessionStorage.setItem('search_results', JSON.stringify(results));  //save results
            document.getElementById('mainPane').src="search.html";  //change iframe to display the results
        },
        error: function (jqXHR, textStatus, errorThrown ){
            //alert(textStatus);
        }

    });
}

//fires the search when search button is clicked
$("#searchbtn").click(function () {
    if($("#searchfield").val().length !== 0) {
        var url = createSearchUrl($("#searchfield").val(), ["artist", "album", "track"]);
        sendSearch(url);
    }
});

//fires the search when enter is pressed
$('#searchfield').keypress(function(e){
    if(e.which == 13){//Enter key pressed
        $('#searchbtn').click();//Trigger search button click event
    }
});