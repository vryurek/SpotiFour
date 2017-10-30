/*
  Receives the JSON object generated
  from the search submission
 */
var results = JSON.parse(sessionStorage.getItem('search_results'));

/*
    Takes the JSON object and displays the
    search results as a list. Currently only
    displays eight albums and eight artists
 */
function displayResults(res){
    //albums
    document.getElementById("head").innerText = "Artists";
    for(var i = 0; i < res.albums.items.length; i++){
        var item = res.albums.items[i].name;
        $('#albums').append('<li>'+ item + '</li>');
    }
    //artists
    for(var i = 0; i < res.artists.items.length; i++){
        var item = res.artists.items[i].name;
        $('#artists').append('<li>'+ item + '</li>');
    }
    //songs
    for(var i = 0; i < res.tracks.items.length; i++){
        var item = res.tracks.items[i].name;
        $('#tracks').append('<li>'+ item + '</li>');
    }

}

displayResults(results);