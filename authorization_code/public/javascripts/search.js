var access_token = localStorage.getItem('access');
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

    url += "&limit=8";
    return url;
}

function sendSearch(url){
    $.ajax({
        url: url,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (results) {
            localStorage.setItem('search_results', JSON.stringify(results));
        }

    });
}

$("#searchbtn").click(function () {
    var url = createSearchUrl($("#searchfield").val(), ["artist", "album"]);
    sendSearch(url);
    window.location='search.html';
});