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
