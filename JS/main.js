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
        series = data;    
        // console.log(series);
        
    paintFoundSeries ();
    })
}

collectSearch();


// Paint series
function paintFoundSeries () {
    let serieData = '';
    for (const serie of series) {
        serieData += `<article class='found-serie'>`
        serieData += `<h2 class='serie-title'>${serie.show.name}</h2>`
        if (serie.show.image === null){
            serieData += `<img class='serie-img' src='https://via.placeholder.com/210x295/ffffff/666666?text=Best+TV+Series' alt='${serie.show.name}'>`
        }
        else {
            serieData += `<img class='serie-img' src='${serie.show.image.medium}' alt='${serie.show.name}'>`
        }
        serieData +=`</article>`
    }
    foundSerie.innerHTML = serieData;
}


//listen search button
searchButton.addEventListener ('click', collectSearch);





//listen click in one serie
//change css
//add to favourites
//If series is in favourites, else....

//localStorage keep
//localStorage read
//localStorage paint


//others: Resolve lost pictures; reset button 