"use strict";

//global constants and variables
const searchButton = document.querySelector(".search-btn");
const userSearch = document.querySelector(".user-search");
const foundSeries = document.querySelector(".found-series");
const favouriteSeries = document.querySelector(".js-favourite-serie-card");
const clearFavourites = document.querySelector(".reset-btn");

//Search results array
let series = [];
//Favourites list array
let favourites = [];

//Read input and call the API
function collectSearch() {
  fetch(`//api.tvmaze.com/search/shows?q=:${userSearch.value}`)
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
    let serieInFavourites = false;
    for (const favourite of favourites) {
      if (favourite.id === serie.show.id) {
        serieInFavourites = true;
      }
    }
    if (serieInFavourites) {
      serieData += `<article class='serie-card favourite-serie'>`;
    } else {
      serieData += `<article class='serie-card'>`;
    }
    //
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
  listenSelectedSerie();
}

//Add to favourites
function changeSerieStatus(ev) {
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

    //Delete serie from favourites, clicking in the searched serie
  } else if (serieInFavourites.id === parseInt(clickedSerie)) {
    let favouriteToDelete = serieInFavourites;
    //find the position of the serie in the favourites array
    let indexToDelete = favourites.indexOf(favouriteToDelete);
    //delete the serie in the index position found
    favourites.splice(indexToDelete, 1);
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

  // X btn
  const listenXBtn = () => {
    const xBtns = document.querySelectorAll(".favourites-delete-btn");
    for (const xBtn of xBtns) {
      xBtn.addEventListener("click", removeFromFavourites);
    }

    //Delete 1 selected item from favourites using X btn
    function removeFromFavourites(ev) {
      //identify clicked element id
      const serieToDelete = ev.target.id;
      console.log(serieToDelete);
      // for (favourite of favourites) {
      //   if (serieToDelete === favourites.id) {
      // }
      // }
    }

    //Clear all favourite series
    const clearFavourites = document.querySelector(".reset-btn");
    //Listen clear all favourites button
    clearFavourites.addEventListener("click", clearFavouritesList);
  };

  listenXBtn();
};

//Delete favourites from list, storage and css class
function clearFavouritesList() {
  favourites = [];
  paintFavouriteSeries();
  paintFoundSeries();
  setInLocalStorage();
}

//listen search button
searchButton.addEventListener("click", collectSearch);

//listen click in one serie
const listenSelectedSerie = () => {
  const seriesCards = document.querySelectorAll(".serie-img");
  for (const serieCard of seriesCards) {
    serieCard.addEventListener("click", changeSerieStatus);
  }
};

//Listen x button
// const listenXBtn = () => {
//   const xBtns = document.querySelectorAll(".favourites-delete-btn");
//   for (const xBtn of xBtns) {
//     xBtn.addEventListener("click", console.log("hello"));
//   }
// };

//Recover favourites from localStorage when the page opens
getFromLocalStorage();
//Call the API when the page opens
collectSearch();
