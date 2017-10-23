var results = JSON.parse(localStorage.getItem('search_results'));

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