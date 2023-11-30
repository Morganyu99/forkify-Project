import * as model from "./model.js";
import RecipeView from "./views/recipeView.js";
import ResultsView from "./views/resultsView.js";
import SearchView from "./views/searchView.js";
import PaginationView from "./views/paginationView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import paginationView from "./views/paginationView.js";
import BookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import recipeView from "./views/recipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import bookmarksView from "./views/bookmarksView.js";
// https://forkify-api.herokuap p.com/v2

///////////////////////////////////////
//API 7fa69d8c-2cf2-47d8-bdc4-25f54211b3b2

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    RecipeView.renderSpinner();
    ResultsView.update(model.getSearchResultsPage(model.state.search.page));
    await model.loadRecipe(id);
    const recipe = model.state.recipe;
    RecipeView.render(recipe);
    BookmarksView.update(model.state.bookmark);
    RecipeView.addHandlerUpdateServings(controlServings);
  } catch (err) {
    RecipeView.renderError();
  }
};

const controlSearchRecipes = async function () {
  try {
    const query = SearchView.getQuery();

    if (!query) return;
    model.resetPageResults();
    ResultsView.renderSpinner();
    await model.loadSearchResult(query);

    ResultsView.render(model.getSearchResultsPage(model.state.search.page));
    PaginationView.render(model.state.search);
    PaginationView.addHandlerClick(controlPagination);
  } catch (err) {
    ResultsView.renderError();
  }
};
const controlAddBookmark = function () {
  model.state.recipe.bookmarked
    ? model.deleteBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);
  RecipeView.update(model.state.recipe);
  BookmarksView.render(model.state.bookmark);
};

const controlPagination = function (result = true) {
  result ? paginationView.changeButton(+1) : paginationView.changeButton(-1);
  ResultsView.render(model.getSearchResultsPage(model.state.search.page));
  PaginationView.render(model.state.search);
};

const controlServings = function (servings) {
  model.updateServings(servings);

  RecipeView.update(model.state.recipe);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    await recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    //Chnage id in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //Update
    recipeView.render(model.state.recipe);

    //Close form window
    setTimeout(function () {
      addRecipeView._hiddenToggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    //Refresh Form

    setTimeout(function () {
      addRecipeView.replaceViewForm;
    }, (MODAL_CLOSE_SEC + 1) * 1000);
    //render bookmark view
    bookmarksView.render(model.state.bookmark);
    bookmarksView.update(model.state.bookmark);
  } catch (err) {
    addRecipeView.renderError(err.message);
    console.log(err);
  }
};

const init = function () {
  model.getBookmarks();
  BookmarksView.render(model.state.bookmark);
  RecipeView.addHandlerRender(controlRecipes);
  SearchView.addHandlerSearch(controlSearchRecipes);
  RecipeView.addHandlerBookmark(controlAddBookmark);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};

init();
