import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
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
