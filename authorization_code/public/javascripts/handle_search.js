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
    $('#show_results').append('<h3>'+ "Albums" + '</h3>');
    for(var i = 0; i < res.albums.items.length; i++){
        var item = res.albums.items[i].name;
        $('#show_results').append('<li>'+ item + '</li>');
    }
    $('#show_results').append('<h3>'+ "Artists" + '</h3>');
    for(var i = 0; i < res.artists.items.length; i++){
        var item = res.artists.items[i].name;
        $('#show_results').append('<li>'+ item + '</li>');
    }
}

displayResults(results);