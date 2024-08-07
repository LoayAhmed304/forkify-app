import { async } from 'regenerator-runtime';
import { API_URL, API_SEARCH_URL, API_SEARCH_RESULT } from './config.js';
import { getJSON } from './helpers.js';
import { RES_PER_PAGE } from './config.js';

export const state = {
  recipe: {},
  searchResults: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export async function loadRecipe(id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    const recipe = data.data.recipe;
    state.recipe = {
      title: recipe.title,
      id: recipe.id,
      cookingTime: recipe.cooking_time,
      image: recipe.image_url,
      ingredients: recipe.ingredients,
      sourceURL: recipe.source_url,
      servings: recipe.servings,
      publisher: recipe.publisher,
    };
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
}

export async function loadSearchResults(query) {
  try {
    state.searchResults.query = query;
    const results = await getJSON(`${API_URL}?search=${query}`);
    state.searchResults.results = results.data.recipes.map(rec => {
      return {
        title: rec.title,
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
      };
    });
    state.searchResults.page = 1;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export function getSearchResultsPage(page = state.searchResults.page) {
  state.searchResults.page = page;
  const start = (page - 1) * 10;
  const end = page * state.searchResults.resultsPerPage;
  return state.searchResults.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings
  });

  state.recipe.servings = newServings;
}

export function addBookmark(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true; // New property on recipe object
  _updateLocalStorage();
}

export function deleteBookmark(id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false; // New property on recipe object
  _updateLocalStorage();
}

function _updateLocalStorage() {
  // Store the bookmarks array into the local storage
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

function init() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
}

function clearBookmarks() {
  // for debugging purposes
  localStorage.clear('bookmarks');
}

init();
// clearBookmarks();
