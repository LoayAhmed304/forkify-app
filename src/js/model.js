import { RES_PER_PAGE, API_URL, API_KEY } from './config.js';
import { AJAX } from './helpers.js';

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

function createRecipeObject(recipe) {
  return {
    title: recipe.title,
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    sourceURL: recipe.source_url,
    servings: recipe.servings,
    publisher: recipe.publisher,
    ...(recipe.key && { key: recipe.key }),
  };
}
export async function loadRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    const recipe = data.data.recipe;
    state.recipe = createRecipeObject(recipe);

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
    const results = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.searchResults.results = results.data.recipes.map(rec => {
      return {
        title: rec.title,
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
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

export async function addRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(prop => prop[0].includes('ingredient') && prop[1])
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please follow the instructions below'
          );
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients: ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data.data.recipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}

init();
// clearBookmarks();
