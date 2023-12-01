import { async } from "regenerator-runtime";
import { API_URL, RESULTS_PER_PAGE, KEY } from "./config";
import { AJAX } from "./helpers";
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },
  bookmark: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}`);
    if (!data) return;
    state.recipe = createRecipeObject(data);

    if (state.bookmark.some((b) => b.id === state.recipe.id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    if (!data) return;

    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = 1) {
  return state.search.results.slice(
    state.search.resultsPerPage * (page - 1),
    state.search.resultsPerPage * page
  );
};

export const resetPageResults = function () {
  state.search.page = 1;
  state.search.results = [];
};

export const updateServings = function (servings) {
  state.recipe.ingredients.forEach((ingredient) => {
    ingredient.quantity *= servings / state.recipe.servings;
  });
  state.recipe.servings = servings;
};

export const addBookmark = function (recipe) {
  state.bookmark.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (recipeID) {
  const index = state.bookmark.findIndex((b) => b.id === recipeID);
  state.bookmark.splice(index, 1);
  if (recipeID === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmark));
};

export const getBookmarks = function () {
  state.bookmark = JSON.parse(localStorage.getItem("bookmarks"));
};

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        console.log(ingArr);
        if (ingArr.length !== 3)
          throw new Error("Wrong Ingredient format.Please check again");
        const [quantity, unit, description] = ing[1]
          .replaceAll(" ", "")
          .split(",");
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      ingredients,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
