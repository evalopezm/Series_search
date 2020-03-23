"use strict";

//global constants and variables
const searchButton = document.querySelector(".search-btn");
const userSearch = document.querySelector(".user-search");
const foundSeries = document.querySelector(".found-series");
const favouriteSeries = document.querySelector(".js-favourite-serie-card");

//Search results
let series = [];
//Favourites list
let favourites = [];

//Read input and call the API
function collectSearch() {
  fetch(`http://api.tvmaze.com/search/shows?q=:${userSearch.value}`)
    .then(response => response.json())
    .then(data => {
      series = data;
      paintFoundSeries();
    });
}

// Paint series
function paintFoundSeries() {
  let serieData = "";
  for (const serie of series) {
    // Favourite series already appear selected in new searchs
    // if (true) {
    //   serieData += `<article class='serie-card favourite-serie'>`;
    // } else {
    serieData += `<article class='serie-card'>`;
    // }
    serieData += `<h2 class='serie-title'>${serie.show.name}</h2>`;
    //Resolve lost pictures
    if (serie.show.image === null) {
      serieData += `<img class='serie-img' src='https://via.placeholder.com/210x295/4c6f72/D3D3D3?text=Best+TV+Series' alt='${serie.show.name}' title='Add to favourites' id='${serie.show.id}'>`;
    } else {
      serieData += `<img class='serie-img' src='${serie.show.image.medium}' alt='${serie.show.name}' title='Add to favourites' id='${serie.show.id}'>`;
    }
    serieData += `</article>`;
  }
  foundSeries.innerHTML = serieData;
  ListenSelectedSerie();
}

//Add to favourites
function addSerieToFavourites(ev) {
  //identify clicked element id
  const clickedSerie = ev.target.id;
  //search in favs (to add or not to add an item already there)
  let serieInFavourites = undefined;
  for (const favourite of favourites) {
    if (favourite.id === parseInt(clickedSerie)) {
      serieInFavourites = favourite;
    }
  }
  if (serieInFavourites === undefined) {
    //Asociate id with element from array
    let selectedSerie = {};
    for (const serie of series) {
      if (serie.show.id === parseInt(clickedSerie)) {
        selectedSerie = serie;
      }
    }
    //add to favourites array
    const newFavouriteSerie = {
      name: selectedSerie.show.name,
      image: selectedSerie.show.image.medium,
      id: selectedSerie.show.id
    };
    favourites.push(newFavouriteSerie);
  }
  setInLocalStorage();
  paintFoundSeries();
  paintFavouriteSeries();
}

//Add to LocalStorage
const setInLocalStorage = () => {
  const favouritesInString = JSON.stringify(favourites);
  localStorage.setItem("favourites", favouritesInString);
};

// Get from LocalStorage
const getFromLocalStorage = () => {
  const favouritesInString = localStorage.getItem("favourites");
  if (favouritesInString !== null) {
    favourites = JSON.parse(favouritesInString);
    paintFavouriteSeries();
  }
};

//Paint favourites
const getFavouriteHtmlCode = favourite => {
  let favouriteHtmlCode = "";
  favouriteHtmlCode += `<li class='favourite-li'>`;
  favouriteHtmlCode += `<img class='favourite-img' src='${favourite.image}' alt='${favourite.name}'>`;
  favouriteHtmlCode += `<p>${favourite.name}</p>`;
  favouriteHtmlCode += `<button class='btn favourites-delete-btn' id='${favourite.id}' title='Borrar de favoritos'>x</button>`;
  favouriteHtmlCode += `</li>`;
  return favouriteHtmlCode;
};

const paintFavouriteSeries = () => {
  favouriteSeries.innerHTML = "";
  for (const favourite of favourites) {
    favouriteSeries.innerHTML += getFavouriteHtmlCode(favourite);
  }
  favouriteSeries.innerHTML += `<button class='btn reset-btn'>Limpiar Favoritos</button>`;

  //Clear all favourite series
  const clearFavourites = document.querySelector(".reset-btn");
  //Listen clear all favourites button
  clearFavourites.addEventListener("click", clearFavouritesList);

  // Delete serie from favourites
  //   listenDeleteBtn();
};

//Change card colors to selected favourites
function addFavouriteColor(ev) {
  const clickedSerie = ev.target;
  clickedSerie.parentElement.classList.add("favourite-serie");
}

//Delete favourites from list, storage and css class
function clearFavouritesList() {
  localStorage.clear();
  favouriteSeries.innerHTML = "";
}

// Unify listener functions
// function favActions(ev) {
//   addSerieToFavourites(ev);
//   addFavouriteColor(ev);
// }

//listen search button
searchButton.addEventListener("click", collectSearch);

//listen click in one serie
const ListenSelectedSerie = () => {
  //   debugger;
  const seriesCards = document.querySelectorAll(".serie-img");
  for (const serieCard of seriesCards) {
    serieCard.addEventListener("click", addSerieToFavourites);
    serieCard.addEventListener("click", addFavouriteColor);
  }
};

//Recover favourites from localStorage when the page opens
getFromLocalStorage();
collectSearch();
