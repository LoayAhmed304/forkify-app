import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import view from './views/recipeView.js';
import recipeView from './views/recipeView.js';

const recipeContainer = document.querySelector('.recipe');

///////////////////////////////////////

async function showRecipe() {
  try {
    const hash = document.location.hash.slice(1);
    if (!hash) return;

    // 1) Loading recipe
    view.renderSpinner();
    await model.loadRecipe(hash);

    // 2) Rendering recipe
    view.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}
function init() {
  recipeView.addHandlerRender(showRecipe);
}

init();
