'use strict';

//global constants
const searchButton = document.querySelector('.search-btn');
const userSearch = document.querySelector('.user-search');


//Read input and call the API
function collectSearch () {
    let wordToSearch = userSearch.value;
    fetch (`http://api.tvmaze.com/search/shows?q=:${wordToSearch}`)
    .then (response => response.json())
    .then (data => {
        console.log (data);
    })
}


//listen search button
searchButton.addEventListener ('click', collectSearch);




//Paint found series

//listen click in one serie
//change css
//add to favourites
//If series is in favourites, else....

//localStorage keep
//localStorage read
//localStorage paint


//others: Resolve lost pictures; reset button 