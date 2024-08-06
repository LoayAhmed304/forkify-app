import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

const recipeContainer = document.querySelector('.recipe');

///////////////////////////////////////

async function showRecipe() {
  try {
    // Get the recipe hash
    const hash = document.location.hash.slice(1);

    if (!hash) return; // Fresh page

    // 1) Loading recipe
    recipeView.renderSpinner();
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
    resultsView.render(model.getSearchResultsPage(1));

    // Render pagination buttons
    paginationView.render(model.state.searchResults);
  } catch (err) {
    console.log(err);
  }
}

function init() {
  recipeView.addHandlerRender(showRecipe);
  searchView.addHandlerSearch(showSearchResults);
}

init();
