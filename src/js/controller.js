import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

const recipeContainer = document.querySelector('.recipe');

///////////////////////////////////////

async function showRecipe() {
  try {
    // Get the recipe hash
    const hash = document.location.hash.slice(1);

    if (!hash) return; // Fresh page
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    await model.loadRecipe(hash);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}

async function showSearchResults() {
  try {
    // Get the search value
    const query = searchView.getQuery();

    if (!query) return; // Empty search value

    resultsView.renderSpinner();

    // Update the state object
    await model.loadSearchResults(query);

    // Display the search results
    resultsView.render(model.getSearchResultsPage());

    // Render pagination buttons
    paginationView.render(model.state.searchResults);
  } catch (err) {
    console.log(err);
  }
}

function paginationControl(gotoPage) {
  // Display the new search results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // Render the new pagination buttons
  paginationView.render(model.state.searchResults);
}

function controlServings(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  // 1) Add or remove bookmar
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function init() {
  recipeView.addHandlerRender(showRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(showSearchResults);
  paginationView.addHandlerClick(paginationControl);
}

init();
