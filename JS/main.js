'use strict';

//global constants
const searchButton = document.querySelector('.search-btn');
const userSearch = document.querySelector('.user-search');
const foundSerie = document.querySelector('.serie-card');

let series = [];

//Read input and call the API
function collectSearch () {
    fetch (`http://api.tvmaze.com/search/shows?q=:${userSearch.value}`)
    .then (response => response.json())
    .then (data => {
        console.log (data);
        series = data;
    paintFoundSeries;
    })
}
collectSearch();

// for series [i] (i=0, i < series.length, i++) {

// };

//Paint series
const paintFoundSeries = () => {
    let serieData = '';
    for (const serie of series) {
        serieData += `<article class='found-serie'>`
        serieData += `<h2 class='serie-title'>${serie[i].show.name}</h2>`
        serieData += `<img class='serie-img' src='${serie[i].show.image.medium}' alt='${serie[i].show.name}'>`
    }
    foundSerie.innerHTML = serieData;
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